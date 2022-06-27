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

namespace App\ORM;

use App\Entity\Material;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Security;

class UserListener
{
    private $security;
    private $entityManager;

    public function __construct(Security $security, EntityManagerInterface $entityManager)
    {
        $this->security = $security;
        $this->entityManager = $entityManager;
    }

    public function preRemove(User $user) {
        // We want to keep all material, so we have to remove the relation between
        // User and Material before removing a User.
        $repository = $this->entityManager->getRepository(Material::class);
        $materials = $repository->findBy(["createdBy" => $user]);
        /**
         * @var $material Material
         */
        foreach ($materials as $material) {
            $material->setCreatedBy(null);
            $this->entityManager->persist($material);
        }
        $this->entityManager->flush();
    }
}
