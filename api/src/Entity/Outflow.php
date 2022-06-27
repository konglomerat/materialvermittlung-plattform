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

use App\Resolver\CreateOutflowResolver;
use App\Resolver\UpdateOutflowResolver;
use App\Resolver\DeleteOutflowResolver;
use App\Resolver\ApproveReservationResolver;
use App\Resolver\PickedUpReservationResolver;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\OutflowRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\NumericFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use App\Filter\OutflowSearchFilter;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *     graphql={
 *        "collection_query"={
 *            "normalization_context"={"groups"={"read"}}
 *        },
 *        "create"={
 *            "mutation"=CreateOutflowResolver::class,
 *            "deserialize"=false,
 *            "denormalization_context"={"groups"={"mutation"}}
 *        },
 *        "update"={
 *            "mutation"=UpdateOutflowResolver::class,
 *            "deserialize"=false,
 *            "denormalization_context"={"groups"={"mutation"}}
 *        },
 *        "customDelete"={
 *            "mutation"=DeleteOutflowResolver::class,
 *            "args"={
 *              "id"={"type"="ID!", "description"="Id of outflow"},
 *            }
 *        },
 *        "approveReservation"={
 *            "mutation"=ApproveReservationResolver::class,
 *            "args"={
 *              "id"={"type"="ID!", "description"="Id of outflow"},
 *            }
 *        },
 *        "pickedUpReservation"={
 *            "mutation"=PickedUpReservationResolver::class,
 *            "args"={
 *              "id"={"type"="ID!", "description"="Id of outflow"},
 *              "quantity"={"type"="Float!", "description"="Quantity picked up"},
 *            }
 *        }
 *    }
 * )
 * @ApiFilter(ExistsFilter::class, properties={"pickedUpAt", "reservingOrganization"})
 * @ApiFilter(NumericFilter::class, properties={"material.id", "reservingOrganization.id", "material.organization.id"})
 * @ApiFilter(OrderFilter::class, properties={"pickedUpAt", "reservationApprovedAt", "createdOn"})
 * @ApiFilter(OutflowSearchFilter::class)
 * @ORM\Entity(repositoryClass="App\Repository\OutflowRepository", repositoryClass=OutflowRepository::class)
 * @ORM\EntityListeners({"App\ORM\OutflowListener"})
 */
class Outflow
{
    const COMMENT_PICKUP_WITH_RESERVATION = "PICKUP_WITH_RESERVATION";
    const COMMENT_PICKUP = "PICKUP";
    const COMMENT_DISPOSAL = "DISPOSAL";

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"read"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Material::class, inversedBy="outflows")
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
     * @ORM\ManyToOne(targetEntity=Organization::class, inversedBy="outflows")
     * @Groups({"read", "mutation"})
     */
    private $reservingOrganization;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"read", "mutation"})
     */
    private $quantity;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"read"})
     */
    private $pickedUpAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"read"})
     */
    private $reservationApprovedAt;


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

    public function getReservingOrganization(): ?Organization
    {
        return $this->reservingOrganization;
    }

    public function setReservingOrganization(?Organization $reservingOrganization): self
    {
        $this->reservingOrganization = $reservingOrganization;

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

    public function getPickedUpAt(): ?\DateTimeInterface
    {
        return $this->pickedUpAt;
    }

    public function setPickedUpAt(?\DateTimeInterface $pickedUpAt): self
    {
        $this->pickedUpAt = $pickedUpAt;

        return $this;
    }

    private static function fieldsAreAllowed(array $fields, array $allowed): bool {
        foreach(array_keys($fields) as $key) {
            if(!in_array($key, $allowed)) return false;
        }
        return true;
    }

    public static function isCreateAllowedForOrganization(array $fields): bool {
        $allowed = ['material', 'quantity', 'comment'];
        return self::fieldsAreAllowed($fields, $allowed);
    }

    public static function isCreateAllowedForReservingOrganization(array $fields): bool {
        // we do not allow the client to send a date for pickedUpAt as
        // the server is responsible for setting the date
        $allowed = ['material', 'quantity', 'reservingOrganization'];
        return self::fieldsAreAllowed($fields, $allowed);
    }

    public static function isUpdateAllowedForOrganization(array $fields): bool {
        $allowed = ['id', 'quantity', 'comment'];
        return self::fieldsAreAllowed($fields, $allowed);
    }

    public static function isUpdateAllowedForReservingOrganization(array $fields): bool {
        $allowed = ['id', 'quantity'];
        return self::fieldsAreAllowed($fields, $allowed);
    }

    public function getReservationApprovedAt(): ?\DateTimeInterface
    {
        return $this->reservationApprovedAt;
    }

    public function setReservationApprovedAt(?\DateTimeInterface $reservationApprovedAt): self
    {
        $this->reservationApprovedAt = $reservationApprovedAt;

        return $this;
    }
}
