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

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\InflowRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\NumericFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *     graphql={
 *      "collection_query"={
 *          "normalization_context"={"groups"={"read"}}
 *     },
 *      "create"={
 *          "security_post_denormalize"="is_granted('INFLOW_CREATE', object)",
 *          "denormalization_context"={"groups"={"mutation"}}
 *      },
 *      "update"={
 *          "security"="is_granted('INFLOW_UPDATE', object)",
 *          "denormalization_context"={"groups"={"mutation"}}
 *      },
 *     "delete"={
 *          "security"="is_granted('INFLOW_DELETE', object)",
 *          "denormalization_context"={"groups"={"mutation"}}
 *      }
 *     },
 * )
 * @ApiFilter(NumericFilter::class, properties={"material.id"})
 * @ApiFilter(OrderFilter::class, properties={"createdOn"})
 * @ORM\Entity(repositoryClass=InflowRepository::class)
 * @ORM\EntityListeners({"App\ORM\InflowListener"})
 */
class Inflow
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"read"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Material::class, inversedBy="inflows")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"read", "mutation"})
     */
    private $material;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"read"})
     */
    private $createdOn;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"read", "mutation"})
     */
    private $comment;

    /**
     * @ORM\Column(type="float")
     * @Groups({"read", "mutation"})
     */
    private $quantity;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMaterial(): ?Material
    {
        return $this->material;
    }

    public function setMaterial(?Material $material): self
    {
        $this->material = $material;

        return $this;
    }

    public function getCreatedOn(): ?\DateTimeInterface
    {
        return $this->createdOn;
    }

    public function setCreatedOn(\DateTimeInterface $createdOn): self
    {
        $this->createdOn = $createdOn;

        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(?string $comment): self
    {
        $this->comment = $comment;

        return $this;
    }

    public function getQuantity(): ?float
    {
        return $this->quantity;
    }

    public function setQuantity(float $quantity): self
    {
        $this->quantity = $quantity;

        return $this;
    }
}
