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

use App\Entity\Organization;
use App\Entity\Storage;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\HttpKernel\KernelInterface;

class OrganizationListener
{
    /**
     * @var KernelInterface
     */
    private $kernel;

    public function __construct(KernelInterface $kernel) {
        $this->kernel = $kernel;
    }

    public function postPersist(Organization $organization, LifecycleEventArgs $args)
    {
        if ($organization instanceof Organization && count($organization->getStorages()) === 0) {
            if ($this->kernel->getEnvironment() !== "test") {
                $storage = new Storage();
                $storage->setTitle($organization->getName() . " Lager");
                $storage->setOrganization($organization);
                $storage->setIsPublic(false);

                $entityManager = $args->getObjectManager();
                $entityManager->persist($storage);
                $entityManager->flush();
            }
        }
    }
}
