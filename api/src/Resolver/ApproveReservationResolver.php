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
use App\Repository\OutflowRepository;
use App\Service\MailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Security;

class ApproveReservationResolver implements MutationResolverInterface
{
    private $entityManager;
    private $security;
    private $mailService;

    public function __construct(EntityManagerInterface $entityManager, Security $security, MailService $mailService)
    {
        $this->entityManager = $entityManager;
        $this->security = $security;
        $this->mailService = $mailService;
    }

    /**
     * @param null $item
     */
    public function __invoke($item, array $context): ?Outflow
    {
        /** @var $user User */
        $user = $this->security->getUser();

        $outflowId = $context['args']['input']['id'];
        /** @var $outflowRepository OutflowRepository */
        $outflowRepository = $this->entityManager->getRepository(Outflow::class);
        $outflow = $outflowRepository->find(IdHelper::iriToId($outflowId));

        if($outflow && $user) {
            if(
                $outflow->getMaterial()->getOrganization() === $user->getOrganization() &&
                $outflow->getReservingOrganization() &&
                !$outflow->getReservationApprovedAt()
            ) {
                // we only send a mail if this changed from null -> some date
                $this->mailService->sendToReservingOrganization_approvedReservation($outflow);
                $outflow->setReservationApprovedAt(new \DateTime());
                return $outflow;
            }
        }
        throw new AccessDeniedException();
    }
}
