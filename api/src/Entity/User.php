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
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ApiResource(
 *     graphql={},
 *     normalizationContext={
 *         "groups"={"read"}
 *     }
 * )
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @ORM\EntityListeners({"App\ORM\UserListener"})
 * @ORM\Table(name="users")
 *
 * IMPORTANT: No "Groups" annotation used for any property
 * prevents any property to be accessible through the api
 */
class User implements UserInterface
{
    // TODO: copy replace with constants in project
    const ROLE_USER = "ROLE_USER";
    const ROLE_ADMIN = "ROLE_ADMIN";
    const ROLE_ORG_ADMIN = "ROLE_ORG_ADMIN";

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     */
    private $email;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string", nullable=true)
     */
    private $password;

    /**
     * @var string token used to activate the account from the activation email
     * @ORM\Column(type="string", nullable=true)
     */
    private $activationToken;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $activationTokenCreatedAt;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Organization", inversedBy="users")
     */
    private $organization;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Material", mappedBy="created_by")
     */
    private $materials;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $name;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $hasAcceptedTerms;

    /**
     * @ORM\OneToMany(targetEntity=MediaObject::class, mappedBy="uploadedBy")
     */
    private $mediaObjects;

    public function __construct()
    {
        $this->materials = new ArrayCollection();
        $this->mediaObjects = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = strtolower($email);

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = self::ROLE_USER;

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(?string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @return string
     */
    public function getActivationToken(): ?string
    {
        return $this->activationToken;
    }

    /**
     * @param string $activationToken
     */
    public function setActivationToken(?string $activationToken): void
    {
        $this->activationToken = $activationToken;
    }



    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
        return 'salt: @VDjXY9LN.cHZipf8PeuMLg66p*QaqbnPNEx4WhnGfebs!aaHpHF4hyvsR8bVjo6';
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getActivationTokenCreatedAt(): ?\DateTimeInterface
    {
        return $this->activationTokenCreatedAt;
    }

    public function setActivationTokenCreatedAt(?\DateTimeInterface $activationTokenCreatedAt): self
    {
        $this->activationTokenCreatedAt = $activationTokenCreatedAt;

        return $this;
    }

    public function getOrganization(): ?Organization
    {
        return $this->organization;
    }

    public function setOrganization(?Organization $organization): self
    {
        $this->organization = $organization;

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
            $material->setCreatedBy($this);
        }

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getHasAcceptedTerms(): ?\DateTimeInterface
    {
        return $this->hasAcceptedTerms;
    }

    public function setHasAcceptedTerms(?\DateTimeInterface $hasAcceptedTerms): self
    {
        $this->hasAcceptedTerms = $hasAcceptedTerms;

        return $this;
    }

    public function hasRoleUser(): bool {
        return in_array(self::ROLE_USER, $this->getRoles());
    }

    public function hasRoleAdmin(): bool {
        return in_array(self::ROLE_ADMIN, $this->getRoles());
    }

    public function hasRoleOrgAdmin(): bool {
        return in_array(self::ROLE_ORG_ADMIN, $this->getRoles());
    }

    /**
     * @return Collection|MediaObject[]
     */
    public function getMediaObjects(): Collection
    {
        return $this->mediaObjects;
    }

    public function addMediaObject(MediaObject $mediaObject): self
    {
        if (!$this->mediaObjects->contains($mediaObject)) {
            $this->mediaObjects[] = $mediaObject;
            $mediaObject->setUploadedBy($this);
        }

        return $this;
    }

    public function removeMediaObject(MediaObject $mediaObject): self
    {
        if ($this->mediaObjects->removeElement($mediaObject)) {
            // set the owning side to null (unless already changed)
            if ($mediaObject->getUploadedBy() === $this) {
                $mediaObject->setUploadedBy(null);
            }
        }

        return $this;
    }
}
