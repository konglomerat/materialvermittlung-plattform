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
use App\Entity\Outflow;
use Doctrine\ORM\QueryBuilder;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;

final class OutflowSearchFilter extends AbstractContextAwareFilter {

    const PROPERTY_NAME="search";

    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null)
    {
        // otherwise filter is applied to order and page as well
        if ($property !== self::PROPERTY_NAME) {
            return;
        }

        if(is_string($value) && $resourceClass === Outflow::class && $value !== "") {
            $outflowAlias = $queryBuilder->getRootAliases()[0];
            $materialAlias = "mat";
            $organizationAlias = "org";
            // we join here to be able to also search for attributes of the organization and the material
            $queryBuilder->leftJoin($outflowAlias.".material", $materialAlias);
            $queryBuilder->leftJoin($materialAlias.".organization", $organizationAlias);
            SearchHelper::buildWhereForAllQueryWords($queryBuilder, $materialAlias, $organizationAlias, $value);
        }
    }

    // IMPORTANT: this makes the filter available in graphql. This feels
    // like a stange API or a strange naming `getDescription()`
    public function getDescription(string $resourceClass): array
    {
        return [self::PROPERTY_NAME => [
            'type' => 'string',
            'required' => false,
        ]];
    }
}
