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

namespace App\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\MediaObject;
use App\Entity\Material;
use App\Entity\User;
use App\Helpers\IdHelper;
use App\Repository\MaterialRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Security;

final class UploadMediaObjectResolver implements MutationResolverInterface
{
    private $entityManager;
    private $security;

    public function __construct(EntityManagerInterface $entityManager, Security $security)
    {
        $this->entityManager = $entityManager;
        $this->security = $security;
    }

    /**
     * @param null $item
     */
    public function __invoke($item, array $context): ?MediaObject
    {
        $input = $context['args']['input'];
        /** @var $user User */
        $user = $this->security->getUser();


        if($user) {
            /** @var $materialRepository MaterialRepository */
            $materialRepository = $this->entityManager->getRepository(Material::class);
            $materialId = $input['materialId'];
            $material = $materialRepository->find(IdHelper::iriToId($materialId));

            if($material && $material->getOrganization() === $user->getOrganization()) {
                // we allow fiele to be null to make the testsetup easier
                if(!isset($input['file'])) throw new \InvalidArgumentException("File is required for an Upload.");

                $file = $input['file'];
                $sortIndex = isset($input['sortIndex']) ?  $input['sortIndex'] : null;

                $mediaObject = new MediaObject();
                $mediaObject->file = $file;
                $mediaObject->setMaterial($material);
                $mediaObject->setUploadedBy($user);

                if($sortIndex !== null) {
                    $mediaObject->setSortIndex($sortIndex);
                } else {
                    $lastSortIndex = $material->getLastImageSortIndex();
                    $mediaObject->setSortIndex($lastSortIndex ? $lastSortIndex : 0);
                }

                return $mediaObject;
            }
        }

        throw new AccessDeniedException();
    }
}
