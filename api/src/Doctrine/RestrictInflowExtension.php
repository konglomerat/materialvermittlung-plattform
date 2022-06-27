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

namespace App\Doctrine;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\Inflow;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;

class RestrictInflowExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface {
    /**
     * @var Security
     */
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null, $context = []): void
    {
        if(Inflow::class === $resourceClass){
            $this->apply($queryBuilder);
        }
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, string $operationName = null, array $context = []): void
    {
        if(Inflow::class === $resourceClass){
            $this->apply($queryBuilder);
        }
    }

    private function apply(QueryBuilder $queryBuilder){
        $user = $this->security->getUser();
        $inflow = $queryBuilder->getRootAliases()[0];
        $material = "material";

        if($user){
            // If the user is ADMIN we do nothing
            if(in_array("ROLE_ADMIN", $user->getRoles())) {
                return;
            }
            $userOrganizationId = $user->getOrganization()->getId();
            $userOrganizationMatchesMaterialOrganization = "$material.organization = $userOrganizationId";

            $queryBuilder->leftJoin("$inflow.material", $material);
            $queryBuilder->andWhere(
                "($userOrganizationMatchesMaterialOrganization)"
            );
        } else {
            // Create an empty result if no user is logged in
            $queryBuilder->andWhere("TRUE = FALSE");
        }
    }
}
