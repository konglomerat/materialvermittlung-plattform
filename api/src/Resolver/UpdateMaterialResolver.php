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
use App\Entity\Material;
use App\Entity\Storage;
use App\Entity\User;
use App\Helpers\IdHelper;
use App\Repository\MaterialRepository;
use App\Repository\StorageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Security;

final class UpdateMaterialResolver implements MutationResolverInterface {
    private $entityManager;
    private $security;

    public function __construct(EntityManagerInterface $entityManager, Security $security) {
        $this->entityManager = $entityManager;
        $this->security = $security;
    }

    /**
     * @param null $item
     */
    public function __invoke($item, array $context): ?Material {
        $input = $context['args']['input'];
        /** @var $user User */
        $user = $this->security->getUser();

        if ($user) {
            /** @var $materialRepository MaterialRepository */
            $materialRepository = $this->entityManager->getRepository(Material::class);
            /** @var $material Material */
            $material = $materialRepository->find(IdHelper::iriToId($input['id']));

            if ($material) {
                if ($user->getOrganization() === $material->getOrganization()) {

                    // Material can only be changed if we have a draft or the user accepted the terms and conditions
                    $acceptTermsAndConditions = isset($input['acceptTermsAndConditions']) && $input['acceptTermsAndConditions'];
                    $canBeUpdated = $material->getIsDraft() || $acceptTermsAndConditions;

                    if($canBeUpdated) {

                        $firstPublish = false;
                        $now = new \DateTime();

                        // 1. we have to check if the material was published
                        if ($material->getIsDraft() && isset($input['isDraft']) && !$input['isDraft']) {
                            if($acceptTermsAndConditions) {
                                $material->setIsDraft($input['isDraft']);
                                $firstPublish = true;
                            } else {
                                // also for the first publish the acceptTermsAndConditions must be true
                                throw new AccessDeniedException();
                            }
                        }

                        // 2. we can make all the updates
                        if (isset($input['title'])) {
                            $material->setTitle($input['title']);
                        }
                        if (isset($input['description'])) {
                            $material->setDescription($input['description']);
                        }
                        if (isset($input['quantityUnit'])) {
                            $material->setQuantityUnit($input['quantityUnit']);
                        }
                        if (isset($input['dimensions'])) {
                            $material->setDimensions($input['dimensions']);
                        }
                        if (isset($input['color'])) {
                            $material->setColor($input['color']);
                        }
                        if (isset($input['publishAt'])) {
                            $material->setPublishAt(new \DateTime($input['publishAt']));
                        }
                        if (isset($input['visibleUntil'])) {
                            $material->setVisibleUntil(new \DateTime($input['visibleUntil']));
                        }
                        if (isset($input['disallowPartialReservations'])) {
                            $material->setDisallowPartialReservations($input['disallowPartialReservations']);
                        }
                        if (isset($input['isFinished'])) {
                            $material->setIsFinished($input['isFinished']);
                        }

                        if (isset($input['storage'])) {
                            /** @var $storageRepository StorageRepository */
                            $storageRepository = $this->entityManager->getRepository(Storage::class);
                            /** @var $material Material */
                            $storage = $storageRepository->find(IdHelper::iriToId($input['storage']));
                            if($storage && $storage->getOrganization() === $material->getOrganization()) {
                                $material->setStorage($storage);
                            }
                        }

                        if($firstPublish || $material->getTermsAndConditionsAcceptedAt()) {
                            $material->setTermsAndConditionsAcceptedAt($now);
                            $material->setTermsAndConditionsAcceptedBy($user);
                        }

                        $changeLogEntry = [
                            "timestamp" => $now->getTimestamp(),
                            "userId" => $user->getId(),
                            "input" => $input
                        ];

                        $material->addChangeLogEntry($changeLogEntry);

                        $this->entityManager->persist($material);
                        return $material;
                    }
                }
            }
        }
        throw new AccessDeniedException();
    }
}
