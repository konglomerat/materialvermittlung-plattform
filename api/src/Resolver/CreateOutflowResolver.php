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
use App\Entity\Organization;
use App\Entity\Outflow;
use App\Entity\User;
use App\Helpers\IdHelper;
use App\Repository\MaterialRepository;
use App\Repository\OrganizationRepository;
use App\Service\MailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Security;


/**
 * Both item_query and collection_query are protected using the corresponding extension.
 * {@see RestrictOutflowExtension::applyToCollection()}
 * {@see RestrictOutflowExtension::applyToItem()}
 */
final class CreateOutflowResolver implements MutationResolverInterface {
    private $entityManager;
    private $security;
    private $mailService;

    public function __construct(EntityManagerInterface $entityManager, Security $security, MailService $mailService) {
        $this->entityManager = $entityManager;
        $this->security = $security;
        $this->mailService = $mailService;
    }

    /**
     * @param null $item
     */
    public function __invoke($item, array $context): ?Outflow {
        $input = $context['args']['input'];
        /** @var $user User */
        $user = $this->security->getUser();

        if ($user) {
            /** @var $materialRepository MaterialRepository */
            $materialRepository = $this->entityManager->getRepository(Material::class);
            /** @var $material Material */
            $material = $materialRepository->find(IdHelper::iriToId($input['material']));

            if ($material) {
                if ($user->getOrganization() === $material->getOrganization()) {
                    if(!Outflow::isCreateAllowedForOrganization($input)) {
                        throw new AccessDeniedException();
                    }
                    // only set fields on outflow that are allowed to be mutated by a user of the organization
                    // outflow can never be a reservation
                    $outflow = new Outflow();
                    $outflow->setMaterial($material);

                    if (isset($input['quantity'])) {
                        $outflow->setQuantity($input['quantity']);
                    }
                    if (isset($input['comment'])) {
                        $outflow->setComment($input['comment']);
                    }
                    // we let the server set the date
                    $outflow->setPickedUpAt(new \DateTime());
                    $outflow->setCreatedOn(new \DateTime());
                    $this->entityManager->persist($outflow);
                    return $outflow;
                } else {
                    if (isset($input['reservingOrganization']) && $input['reservingOrganization']) {
                        if(!Outflow::isCreateAllowedForReservingOrganization($input)) {
                            throw new AccessDeniedException();
                        }
                        /** @var $organizationRepository OrganizationRepository */
                        $organizationRepository = $this->entityManager->getRepository(Organization::class);
                        /** @var $reservingOrganization Organization */
                        $reservingOrganization = $organizationRepository->find(IdHelper::iriToId($input['reservingOrganization']));

                        if ($reservingOrganization && $user->getOrganization() === $reservingOrganization) {
                            // only set fields on outflow that are allowed to be mutated by a user of the organization
                            $outflow = new Outflow();
                            $outflow->setMaterial($material);
                            $outflow->setReservingOrganization($reservingOrganization);
                            if (isset($input['quantity'])) {
                                $outflow->setQuantity($input['quantity']);
                            }
                            $this->entityManager->persist($outflow);
                            $this->mailService->sendToOrganization_newReservation($outflow);
                            $this->mailService->sendToReservingOrganization_newReservation($outflow);
                            return $outflow;
                        }
                    }
                }
            }
        }
        throw new AccessDeniedException();
    }
}
