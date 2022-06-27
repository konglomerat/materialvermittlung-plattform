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

namespace App\Stage;

use ApiPlatform\Core\GraphQl\Resolver\Stage\WriteStageInterface;
use App\Entity\Reservation;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Security;

final class WriteStage implements WriteStageInterface
{
    private $writeStage;
    private $security;
    private $entityManager;

    public function __construct(WriteStageInterface $writeStage, Security $security, EntityManagerInterface $entityManager)
    {
        $this->writeStage = $writeStage;
        $this->security = $security;
        $this->entityManager = $entityManager;
    }

    /**
     * {@inheritdoc}
     */
    public function __invoke($data, string $resourceClass, string $operationName, array $context)
    {
        if (is_a($data, Reservation::class, true)) {
            $data->setCreatedOn(new \DateTime());
            $userInterface = $this->security->getUser();
            $user = $this->entityManager->getRepository(User::class)->findOneByEmail($userInterface->getUsername());
            $data->setReservedBy($user);
        }

        // Call the decorated write stage (this syntax calls the __invoke method).
        $writtenObject = ($this->writeStage)($data, $resourceClass, $operationName, $context);

        // You can add post-write code here.

        return $writtenObject;
    }
}
