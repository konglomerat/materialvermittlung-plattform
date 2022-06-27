<?php
/*
 * Copyright (c) 2022 Sandstorm Media GmbH
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

namespace App\Filter;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractContextAwareFilter;
use App\Entity\Material;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\QueryBuilder;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;

/*
 * With MaterialQuantityFilter we want to be a able to show materials that have
 * no quantity left, calculated using in- and outflows, which use different
 * entity models. As filters in ApiPlattform use DQL we should too and not
 * filter programmatically using JS on the client are PHP. -> Using this "low-level"
 * approach is more performant when aggregating data of entity relations (e.g. in- & outflow)
 *
 * For filtering with PHP we would also need to write custom resolvers. We would
 * need to implement al kind of behaviour that ApiPlattform would otherwise provide
 * out of the box ;)
 *
 * The filter can be used together with oder filters like so:
 *
 * `{someOtherFilter: true, hasAvailableQuantity: true}` -> quantity sum > 0
 * `{someOtherFilter: true, hasAvailableQuantity: false}` -> quantity sum < 0
 * `{someOtherFilter: true}` -> no filter -> any quantity sum
 * */
final class MaterialQuantityFilter extends AbstractContextAwareFilter {

    const PROPERTY_NAME="hasAvailableQuantity";
    const SUM_COLUMN="quantity";

    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null)
    {
        // otherwise filter is applied to order and page as well
        if ($property !== self::PROPERTY_NAME) {
            return;
        }

        if(is_bool($value) && $resourceClass === Material::class) {
            $rootAlias = $queryBuilder->getRootAliases()[0];
            $entityManager = $queryBuilder->getEntityManager();

            // safeguard to not accidentally reuse an alias
            // or be reused
            $aliasPrefix = "mqf_";
            $outflowAlias = $aliasPrefix."outflow";
            $inflowAlias = $aliasPrefix."inflow";
            $whereOperator = $value ? ">" : "<=";

            /*
             * Rounding Issues and limitations by DQL
             *
             * Due to rounding issues with float the filter would not work correctly when
             * directly comparing SUMs of in- and outflows. We are also limited by arithmetic`
             * operations in DQL, that work normally work in SQL. (https://github.com/doctrine/orm/issues/7593)
             *
             * The current solution allows to add an offset `SUM(quantity)+<OFFSET>` to e.g. the outflows to take care of the rounding
             * issue.
             *
             * We also have to take care of sub-query results being null. For this we use `COALESCE(..., <OFFSET>).
             *
             * This SQL code can easily be transformed into DQL:
             *
             * SELECT * from material
             * WHERE
             *   (SELECT COALESCE(SUM(quantity)+0, 0)      FROM inflow WHERE material_id = material.id) >
             *   (SELECT COALESCE(SUM(quantity)+0.0005, 0.0005) FROM outflow WHERE material_id = material.id)
             * */

            $inflowSum = $this->buildSubQuery(
                $entityManager,
                $rootAlias,
                $inflowAlias,
                "App\Entity\Inflow"
            );
            $outflowSum = $this->buildSubQuery(
                $entityManager,
                $rootAlias,
                $outflowAlias,
                "App\Entity\Outflow",
                Material::REMAINING_QUANTITY_ROUNDING_OFFSET
            );
            $queryBuilder->andWhere("($inflowSum) $whereOperator ($outflowSum)");
        }
    }

    private function buildSubQuery(EntityManager $entityManager, string $materialAlias, string $flowAlias, string $flowEntity, float $offset = 0): string {
        $dql = $entityManager->createQueryBuilder()
            ->select("COALESCE(SUM(".$flowAlias.".".self::SUM_COLUMN.")+".$offset.",".$offset.")")
            ->from($flowEntity, $flowAlias)
            ->where($flowAlias.".material = $materialAlias")
            ->getDQL();

        // we have to add brackets -> otherwise this will give a DQL parsing error
        return $dql;
    }

    // IMPORTANT: this makes the filter available in graphql. This feels
    // like a stange API or a strange naming `getDescription()`
    public function getDescription(string $resourceClass): array
    {
        return [self::PROPERTY_NAME => [
            'type' => 'bool',
            'required' => false,
        ]];
    }
}
