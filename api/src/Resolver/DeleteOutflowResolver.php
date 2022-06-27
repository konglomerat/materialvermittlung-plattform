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

final class DeleteOutflowResolver implements MutationResolverInterface {
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
            $material = $outflow->getMaterial();

            if($outflow->getPickedUpAt()) {
                // we should never delete an Outflow that was picked up
                // as this will lead to wrong numbers when e.g. calculating the remaining amount
                throw new AccessDeniedException();
            }

            if ($outflow) {
                if ($user->getOrganization() === $outflow->getMaterial()->getOrganization()) {
                    if($outflow->getReservingOrganization()){
                        $this->mailService->sendToReservingOrganization_removedReservation($outflow);
                    }
                    $material->removeOutflow($outflow);
                    $this->entityManager->persist($material);
                    $this->entityManager->remove($outflow);
                    $this->entityManager->flush();

                    return $outflow;
                } else {
                    if ( $user->getOrganization() === $outflow->getReservingOrganization()) {
                        if($outflow->getReservingOrganization()){
                            $this->mailService->sendToOrganization_removedReservation($outflow);
                        }
                        $material->removeOutflow($outflow);
                        $this->entityManager->persist($material);
                        $this->entityManager->remove($outflow);
                        $this->entityManager->flush();
                        return $outflow;
                    }
                }
            }
        }
        throw new AccessDeniedException();
    }
}
