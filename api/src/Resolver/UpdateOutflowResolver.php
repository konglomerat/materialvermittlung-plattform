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
use App\Entity\Outflow;
use App\Entity\User;
use App\Helpers\IdHelper;
use App\Repository\MaterialRepository;
use App\Service\MailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Security;

/**
 * Both item_query and collection_query are protected using the corresponding extension.
 * {@see RestrictOutflowExtension::applyToCollection()}
 * {@see RestrictOutflowExtension::applyToItem()}
 */
final class UpdateOutflowResolver implements MutationResolverInterface {
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
            /** @var $outflowRepository MaterialRepository */
            $outflowRepository = $this->entityManager->getRepository(Outflow::class);
            /** @var $outflow Outflow */
            $outflow = $outflowRepository->find(IdHelper::iriToId($input['id']));

            if ($outflow) {
                if ($user->getOrganization() === $outflow->getMaterial()->getOrganization()) {
                    if(!Outflow::isUpdateAllowedForOrganization($input)) {
                        throw new AccessDeniedException();
                    }
                    if (isset($input['quantity'])) {
                        $outflow->setQuantity($input['quantity']);
                    }
                    if (isset($input['comment'])) {
                        $outflow->setComment($input['comment']);
                    }

                    $this->entityManager->persist($outflow);
                    return $outflow;
                } else {
                    if ( $user->getOrganization() === $outflow->getReservingOrganization()) {
                        if(!Outflow::isUpdateAllowedForReservingOrganization($input)) {
                            throw new AccessDeniedException();
                        }
                        if (isset($input['quantity']) && $input['quantity'] !== $outflow->getQuantity()) {
                            // we only do something if the value really changed
                            $this->mailService->sendToOrganization_updatedReservation($outflow);
                            $this->mailService->sendToReservingOrganization_updatedReservation($outflow);
                            // if the quantity is changed we will reset the approval
                            $outflow->setReservationApprovedAt(null);
                            $outflow->setQuantity($input['quantity']);
                            $this->entityManager->persist($outflow);
                        }
                        return $outflow;
                    }
                }
            }
        }
        throw new AccessDeniedException();
    }
}
