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

use App\Entity\Inflow;
use App\Entity\Material;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Security\Core\Security;

class MaterialListener
{
    private $security;
    private $entityManager;
    private $kernel;

    public function __construct(Security $security, EntityManagerInterface $entityManager, KernelInterface $kernel)
    {
        $this->security = $security;
        $this->entityManager = $entityManager;
        $this->kernel = $kernel;
    }

    // Will be called only if material is created
    public function prePersist(Material $material)
    {
        $user = $this->security->getToken() ? $this->security->getToken()->getUser() : null;

        // if needed for fixture generation
        if (!$material->getCreatedAt()) {
            $material->setCreatedAt(new \DateTime());
        }

        // if needed for fixture generation
        if (!$material->getUpdatedAt()) {
            $material->setUpdatedAt(new \DateTime());
        }

        // for fixture generation or when creating a material through a super admin we do not use the current user
        // to set `createBy` and `organization`. We just use the values provided but also check them here.
        // VALUES MISSING
        if(!$material->getCreatedBy() || !$material->getOrganization()) {
            // LOGGED IN USER WITH ORGANIZATION
            // (remember, an admin does not have an organization )
            if ($user instanceof User && $user->getOrganization()) {
                if(!$material->getCreatedBy() || !$material->getOrganization()) {
                    $material->setCreatedBy($user);
                    $material->setOrganization($user->getOrganization());
                }
            } else {
                // if the user does not have an organization or we have no user at all
                // than the information provided for `createdBy` and `organization` is incomplete
                throw new \Exception("createdBy and organization of a material should never be null, when not creating material through a logged in user!", 1618822926);
            }
        // VALUES ALREADY PROVIDED
        } else {
            // we need to check if if the combination of user and organization is correct
            // e.g. when creating fixtures or if the admin creates a material.
            // The user needs to belong to the organization provided.
            if($material->getCreatedBy()->getOrganization() !== $material->getOrganization()) {
                throw new \Exception("The organization of the creating user does not match the provided organization of the material!", 1618822927);
            }
        }

        // IMPORTANT: the client expects one inflow to be present
        // to set the original quantity in the draft
        $firstInflow = new Inflow();
        $firstInflow->setQuantity(0);
        $firstInflow->setCreatedOn(new \DateTime());
        $firstInflow->setMaterial($material);
        $this->entityManager->persist($firstInflow);
    }

    // Will be called every time material is updated
    public function preUpdate(Material $material) {
        $material->setUpdatedAt(new \DateTime());
    }
}
