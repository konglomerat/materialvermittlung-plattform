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
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *     graphql={},
 *     normalizationContext={
 *         "groups"={"read"}
 *     },
 * )
 * @ORM\Entity(repositoryClass="App\Repository\OrganizationRepository")
 * @ORM\EntityListeners({"App\ORM\OrganizationListener"})
 */
class Organization
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"read"})
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\User", mappedBy="organization", cascade={"remove"})
     */
    private $users;

    /**
     * @ORM\OneToMany(targetEntity=Storage::class, mappedBy="organization", cascade={"remove"})
     * @Groups({"read"})
     */
    private $storages;

    /**
     * @ORM\OneToMany(targetEntity=Material::class, mappedBy="organization", cascade={"remove"})
     */
    private $materials;

    /**
     * @ORM\OneToMany(targetEntity=Outflow::class, mappedBy="reservingOrganization")
     */
    private $outflows;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"read"})
     */
    private $imprint;

    /**
     * @ORM\Column(type="array", nullable=true)
     */
    private $notificationMailAddresses = [];

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->storages = new ArrayCollection();
        $this->materials = new ArrayCollection();
        $this->outflows = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
            $user->setOrganization($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->contains($user)) {
            $this->users->removeElement($user);
            // set the owning side to null (unless already changed)
            if ($user->getOrganization() === $this) {
                $user->setOrganization(null);
            }
        }

        return $this;
    }

    public function __toString()
    {
        return $this->name;
    }

    /**
     * @return Collection|Storage[]
     */
    public function getStorages(): Collection
    {
        return $this->storages;
    }

    public function addStorage(Storage $storage): self
    {
        if (!$this->storages->contains($storage)) {
            $this->storages[] = $storage;
            $storage->setOrganization($this);
        }

        return $this;
    }

    public function removeStorage(Storage $storage): self
    {
        if ($this->storages->contains($storage)) {
            $this->storages->removeElement($storage);
            // set the owning side to null (unless already changed)
            if ($storage->getOrganization() === $this) {
                $storage->setOrganization(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Material[]
     */
    public function getMaterials(): Collection
    {
        return $this->materials;
    }

    public function addMaterial(Material $material): self
    {
        if (!$this->materials->contains($material)) {
            $this->materials[] = $material;
            $material->setOrganization($this);
        }

        return $this;
    }

    public function removeMaterial(Material $material): self
    {
        if ($this->materials->contains($material)) {
            $this->materials->removeElement($material);
            // set the owning side to null (unless already changed)
            if ($material->getOrganization() === $this) {
                $material->setOrganization(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Outflow[]
     */
    public function getOutflows(): Collection
    {
        return $this->outflows;
    }

    public function addOutflow(Outflow $outflow): self
    {
        if (!$this->outflows->contains($outflow)) {
            $this->outflows[] = $outflow;
            $outflow->setReservingOrganization($this);
        }

        return $this;
    }

    public function removeOutflow(Outflow $outflow): self
    {
        if ($this->outflows->removeElement($outflow)) {
            // set the owning side to null (unless already changed)
            if ($outflow->getReservingOrganization() === $this) {
                $outflow->setReservingOrganization(null);
            }
        }

        return $this;
    }

    public function getImprint(): ?string
    {
        return $this->imprint;
    }

    public function setImprint(?string $imprint): self
    {
        $this->imprint = $imprint;

        return $this;
    }

    public function addNotificationMailAddress(string $email) {
        if($this->notificationMailAddresses) {
            array_push($this->notificationMailAddresses, $email);
        } else {
            $this->notificationMailAddresses = [$email];
        }
        return $this;
    }

    public function getNotificationMailAddresses(): ?array
    {
        return $this->notificationMailAddresses;
    }

    public function setNotificationMailAddresses(array $notificationMailAddresses): self
    {
        $this->notificationMailAddresses = $notificationMailAddresses;

        return $this;
    }
}
