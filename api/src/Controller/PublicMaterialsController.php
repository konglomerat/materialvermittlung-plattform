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

namespace App\Controller;

use App\Entity\Material;
use App\Entity\Storage;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Translation\Exception\NotFoundResourceException;

class PublicMaterialsController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/api/public-materials", name="public_materials")
     */
    public function index()
    {
        $storageRepository = $this->entityManager->getRepository(Storage::class);
        $allStorages = $storageRepository->findAll();
        $result = array();
        $today = new \DateTime();
        /** @var $storage Storage*/
        foreach ($allStorages as $storage) {
            if ($storage->getIsPublic()) {
                $allStorageMaterials = $storage->getMaterials();
                foreach ($allStorageMaterials as $material) {
                    #if ($material->getPublishAt() < $today && $material->getVisibleUntil() > $today && !$material->getIsDraft() && $material->getRemainingQuantity() > 0) {
                    if ($material->getPublishAt() > $today && $material->getVisibleUntil() < $today && !$material->getIsDraft() && $material->getRemainingQuantity() > 0) {
                        array_push($result, $material);
                    }
                }
            }
        }
        // TODO: enable pagination
        $serializedEntity = $this->container->get('serializer')->serialize($result, 'json');
        return new Response($serializedEntity);
    }

    /**
     * @Route("/api/public-material/{id}")
     */
    public function singleMaterial(int $id) {
        $materialRepository = $this->entityManager->getRepository(Material::class);
        /** @var Material $material */
        $material = $materialRepository->findOneById($id);
        if ($material) {
            if ($material->getStorage()->getIsPublic()) {
                $serializedEntity = $this->container->get('serializer')->serialize($material, 'json');
                return new Response($serializedEntity);
            } else {
                throw new AccessDeniedException();
            }
        } else {
            throw new NotFoundResourceException();
        }
    }
}
