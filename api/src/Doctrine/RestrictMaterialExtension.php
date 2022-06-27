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
use App\Entity\Material;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;

class RestrictMaterialExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface {
    /**
     * @var Security
     */
    private $security;

    public function __construct(Security $security) {
        $this->security = $security;
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null, $context = []): void {
        if (Material::class === $resourceClass) {
            $this->apply($queryBuilder);
        }
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, string $operationName = null, array $context = []): void {
        if (Material::class === $resourceClass) {
            $this->apply($queryBuilder);
        }
    }

    private function apply(QueryBuilder $queryBuilder): void {
        $user = $this->security->getUser();
        $material = $queryBuilder->getRootAliases()[0];

        $storage = "storage";

        $visibilityStartsBeforeNow = "$material.publishAt < CURRENT_TIMESTAMP()";
        $visibilityEndsAfterNow = "$material.visibleUntil > CURRENT_TIMESTAMP()";
        $visibilityNeverEnds = "$material.visibleUntil is NULL";
        $storageIsPublic = "$storage.isPublic = true";
        $isNotDraft = "$material.isDraft = false";

        if ($user) {
            // If the user is ADMIN we do nothing
            if (in_array("ROLE_ADMIN", $user->getRoles())) {
                return;
            }

            // For every other user (normal and organization admin), we allow public and restricted material that is published
            // We also allow all material of the users organization
            $userOrganizationId = $user->getOrganization()->getId();
            $userOrganizationMatches = "$material.organization = $userOrganizationId";

            $queryBuilder->andWhere(
                "(
                    $userOrganizationMatches OR (
                        $visibilityStartsBeforeNow AND (
                            $visibilityEndsAfterNow OR $visibilityNeverEnds
                        )
                    )
                )"
            );
        } else {
            // If we do not have a user we only show public material that was published
            $queryBuilder->leftJoin("$material.storage", $storage);
            $queryBuilder->andWhere(
                "(
                    $isNotDraft AND
                    $storageIsPublic AND
                    $visibilityStartsBeforeNow AND (
                        $visibilityEndsAfterNow OR $visibilityNeverEnds
                    )
                )"
            );
        }
    }
}
