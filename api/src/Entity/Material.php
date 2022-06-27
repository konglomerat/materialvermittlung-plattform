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
use App\DataStructure\ValidationResults;
use App\Enum\MaterialUnitEnum;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Security\Core\User\UserInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\NumericFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Annotation\ApiFilter;
use App\Filter\MaterialQuantityFilter;
use App\Filter\MaterialSearchFilter;
use App\Resolver\UpdateMaterialResolver;

/**
 * @ApiResource(
 *     graphql={
 *      "collection_query"={
 *          "normalization_context"={"groups"={"read"}}
 *     },
 *      "item_query"={
 *          "security"="is_granted('MATERIAL_READ', object)",
 *          "normalization_context"={"groups"={"read"}}
 *      },
 *      "create"={
 *          "security_post_denormalize"="is_granted('MATERIAL_CREATE', object)",
 *          "denormalization_context"={"groups"={"mutation"}}
 *      },
 *      "update"={
 *            "mutation"=UpdateMaterialResolver::class,
 *            "deserialize"=false,
 *             "args"={
 *                "id"={"type"="ID!"},
 *                "storage"={"type"="ID"},
 *                "title"={"type"="String"},
 *                "description"={"type"="String"},
 *                "quantityUnit"={"type"="String"},
 *                "dimensions"={"type"="String"},
 *                "color"={"type"="String"},
 *                "publishAt"={"type"="String"},
 *                "visibleUntil"={"type"="String"},
 *                "isDraft"={"type"="Boolean"},
 *                "disallowPartialReservations"={"type"="Boolean"},
 *                "isFinished"={"type"="Boolean"},
 *                "acceptTermsAndConditions"={"type"="Boolean"}
 *            }
 *        },
 *     },
 *    attributes={"order"={"publishAt": "DESC"}}
 * )
 *
 * @ApiFilter(NumericFilter::class, properties={"organization.id"})
 * @ApiFilter(BooleanFilter::class, properties={"isDraft", "isFinished"})
 * @ApiFilter(DateFilter::class, properties={"publishAt", "visibleUntil": DateFilter::INCLUDE_NULL_AFTER })
 * @ApiFilter(OrderFilter::class, properties={"publishAt", "visibleUntil", "updatedAt"})
 * @ApiFilter(MaterialQuantityFilter::class)
 * @ApiFilter(MaterialSearchFilter::class)
 * @ORM\Entity(repositoryClass="App\Repository\MaterialRepository")
 * @ORM\EntityListeners({"App\ORM\MaterialListener"})
 */
class Material {
    const REMAINING_QUANTITY_ROUNDING_OFFSET = 0.005;
    const QUANTITY_PRECISION = 2;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"read", "mutation"})
     */
    private $title;

    /**
     * @ORM\Column(type="string", length=10000, nullable=true)
     * @Groups({"read", "mutation"})
     */
    private $description;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"read", "mutation"})
     */
    private $quantityUnit;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"read", "mutation"})
     */
    private $dimensions;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"read", "mutation"})
     */
    private $color;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\MediaObject", mappedBy="material", cascade={"remove"})
     * @Groups({"read"})
     */
    private $images;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="materials")
     * @ORM\JoinColumn(nullable=true)
     */
    private $createdBy;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"read"})
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"read", "mutation"})
     */
    private $publishAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"read", "mutation"})
     */
    private $visibleUntil;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Groups({"read", "mutation"})
     */
    private $isDraft = true;

    /**
     * @ORM\ManyToOne(targetEntity=Storage::class, inversedBy="materials")
     * @Groups({"read", "mutation"})
     */
    private $storage;

    /**
     * @ORM\ManyToOne(targetEntity=Organization::class, inversedBy="materials")
     * @ORM\JoinColumn(nullable=true)
     * @Groups({"read"})
     */
    private $organization;

    /**
     * @ORM\OneToMany(targetEntity=Inflow::class, mappedBy="material")
     * @Groups({"read"})
     */
    private $inflows;

    /**
     * @ORM\OneToMany(targetEntity=Outflow::class, mappedBy="material")
     * @Groups({"read"})
     */
    private $outflows;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Groups({"read", "mutation"})
     */
    private $isFinished = false;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Groups({"read", "mutation"})
     */
    private $disallowPartialReservations = false;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $termsAndConditionsAcceptedAt;

    /**
     * @ORM\ManyToOne(targetEntity=User::class)
     */
    private $termsAndConditionsAcceptedBy;

    /**
     * @ORM\Column(type="array", nullable=true)
     */
    private $changeLog = [];

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $storagePostalCode;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $wasAnonymizedAt;

    public function __construct()
    {
        $this->images = new ArrayCollection();
        $this->inflows = new ArrayCollection();
        $this->outflows = new ArrayCollection();
    }

    // Calculated Fields

    /**
     * Edgecase:
     *
     * When viewing lists of materials (for example a list of reservations), the material might be in the list
     * (for example: your organization made a reservation for it), but the material-details are not visible,
     * because the owner changed the publishAt-date. This property allows us to check, whether the details can be viewed
     * by others.
     *
     * @Groups({"read"})
     */
    public function getIsVisible(): ?bool {
        $now = new \DateTime();

        $isDraft = $this->getIsDraft();
        $isPublished = $now > $this->getPublishAt();
        $isStillVisible = !$this->getVisibleUntil() || $now < $this->getVisibleUntil();

        return !$isDraft && $isPublished && $isStillVisible;
    }


    /**
     * @Groups({"read"})
     */
    public function getIsNew(): ?bool {
        return $this->getPublishAt() > (new \DateTime())->sub(new \DateInterval("P2D"));
    }

    /**
     * @Groups({"read"})
     */
    public function getValidationResults(): array {
        return (ValidationResults::fromMaterial($this))->toArray();
    }

    /**
     * @Groups({"read"})
     */
    public function getInflowQuantity(): float {
        $quantity = array_reduce($this->getInflows()->toArray(), function (float $accumulator, Inflow $inflow) {
            return $accumulator + $inflow->getQuantity();
        }, 0);

        return self::roundQuantity($quantity);
    }

    /**
     * @Groups({"read"})
     */
    public function getOutflowQuantity(): float {
        $quantity = array_reduce($this->getOutflows()->toArray(), function (float $accumulator, Outflow $outflow) {
            return $accumulator + $outflow->getQuantity();
        }, 0);

        return self::roundQuantity($quantity);
    }

    /**
     * @Groups({"read"})
     */
    public function getPickedUpQuantity(): float {
        $quantity = array_reduce($this->getOutflows()->toArray(), function (float $accumulator, Outflow $outflow) {
            if ($outflow->getPickedUpAt()) {
                return $accumulator + $outflow->getQuantity();
            }
            return $accumulator;
        }, 0);

        return self::roundQuantity($quantity);
    }

    /**
     * @Groups({"read"})
     */
    public function getReservedQuantity(): float {
        $quantity = array_reduce($this->getOutflows()->toArray(), function (float $accumulator, Outflow $outflow) {
            if (!$outflow->getPickedUpAt() && $outflow->getReservingOrganization()) {
                return $accumulator + $outflow->getQuantity();
            }
            return $accumulator;
        }, 0);

        return self::roundQuantity($quantity);
    }

    /**
     * @Groups({"read"})
     */
    public function getAvailableQuantity(): float {
        return self::roundQuantity($this->getInflowQuantity() - $this->getOutflowQuantity());
    }

    // Default Getters and Setters

    public function getId(): ?int {
        return $this->id;
    }

    public function getTitle(): ?string {
        return $this->title;
    }

    public function setTitle(?string $title): self {
        $this->title = $title;

        return $this;
    }

    public function getQuantityUnit(): ?string {
        return $this->quantityUnit;
    }

    /**
     * @Groups({"read"})
     */
    public function getReadableQuantityUnit(): ?string {
        return MaterialUnitEnum::getTextForEnumValue($this->getQuantityUnit());
    }

    public function setQuantityUnit(string $quantityUnit): self {
        $this->quantityUnit = $quantityUnit;

        return $this;
    }

    public function getDescription(): ?string {
        return $this->description;
    }

    public function setDescription(string $description): self {
        $this->description = $description;

        return $this;
    }

    public function getDimensions(): ?string {
        return $this->dimensions;
    }

    public function setDimensions(string $dimensions): self {
        $this->dimensions = $dimensions;

        return $this;
    }

    public function getColor(): ?string {
        return $this->color;
    }

    public function setColor(string $color): self {
        $this->color = $color;

        return $this;
    }

    /**
     * @return Collection|MediaObject[]
     */
    public function getImages(): Collection {
        return $this->images;
    }

    public function addImage(MediaObject $image): self {
        if (!$this->images->contains($image)) {
            $this->images[] = $image;
            $image->setMaterial($this);
        }

        return $this;
    }

    public function getLastImageSortIndex(): ?int {
        // IMPORTANT: we currently rely on the default sorting if MediaObject
        $lastImage = $this->images[sizeof($this->images) - 1];
        if ($lastImage) {
            return $lastImage->getSortIndex();
        } else {
            return null;
        }
    }

    public function removeImage(MediaObject $image): self {
        if ($this->images->contains($image)) {
            $this->images->removeElement($image);
            // set the owning side to null (unless already changed)
            if ($image->getMaterial() === $this) {
                $image->setMaterial(null);
            }
        }

        return $this;
    }

    public function getCreatedBy(): ?User {
        return $this->createdBy;
    }

    public function setCreatedBy(?UserInterface $createdBy): self {
        $this->createdBy = $createdBy;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface {
        return $this->createdAt;
    }

    public function setCreatedAt(?\DateTimeInterface $createdAt): self {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getPublishAt(): ?\DateTimeInterface {
        return $this->publishAt;
    }

    public function setPublishAt(?\DateTimeInterface $publishAt): self {
        $this->publishAt = $publishAt;

        return $this;
    }

    public function getVisibleUntil(): ?\DateTimeInterface {
        return $this->visibleUntil;
    }

    public function setVisibleUntil(?\DateTimeInterface $visibleUntil): self {
        $this->visibleUntil = $visibleUntil;

        return $this;
    }

    public function getIsDraft(): ?bool {
        return $this->isDraft;
    }

    public function setIsDraft(?bool $isDraft): self {
        $this->isDraft = $isDraft;

        return $this;
    }

    public function getStorage(): ?Storage {
        return $this->storage;
    }

    public function setStorage(?Storage $storage): self {
        $this->storage = $storage;

        return $this;
    }

    public function getOrganization(): ?Organization {
        return $this->organization;
    }

    public function setOrganization(?Organization $organization): self {
        $this->organization = $organization;

        return $this;
    }

    /**
     * @return Collection|Outflow[]
     */
    public function getOutflows(): Collection {
        return $this->outflows;
    }

    /**
     * @return Collection|Inflow[]
     */
    public function getInflows(): Collection {
        return $this->inflows;
    }

    public function addInflow(Inflow $inflow): self {
        if (!$this->inflows->contains($inflow)) {
            $this->inflows[] = $inflow;
            $inflow->setMaterial($this);
        }

        return $this;
    }

    public function removeInflow(Inflow $inflow): self {
        if ($this->inflows->removeElement($inflow)) {
            // set the owning side to null (unless already changed)
            if ($inflow->getMaterial() === $this) {
                $inflow->setMaterial(null);
            }
        }

        return $this;
    }

    public function addOutflow(Outflow $outflow): self {
        if (!$this->outflows->contains($outflow)) {
            $this->outflows[] = $outflow;
            $outflow->setMaterial($this);
        }

        return $this;
    }

    public function removeOutflow(Outflow $outflow): self {
        if ($this->outflows->removeElement($outflow)) {
            // set the owning side to null (unless already changed)
            if ($outflow->getMaterial() === $this) {
                $outflow->setMaterial(null);
            }
        }

        return $this;
    }

    private static function roundQuantity(float $quantity): float {
        return round($quantity, self::QUANTITY_PRECISION);
    }

    public function getIsFinished(): ?bool {
        return $this->isFinished;
    }

    public function setIsFinished(?bool $isFinished): self {
        $this->isFinished = $isFinished;

        return $this;
    }

    public function getDisallowPartialReservations(): ?bool {
        return $this->disallowPartialReservations;
    }

    public function setDisallowPartialReservations(?bool $disallowPartialReservations): self {
        $this->disallowPartialReservations = $disallowPartialReservations;

        return $this;
    }

    public function getTermsAndConditionsAcceptedAt(): ?\DateTimeInterface
    {
        return $this->termsAndConditionsAcceptedAt;
    }

    public function setTermsAndConditionsAcceptedAt(?\DateTimeInterface $termsAndConditionsAcceptedAt): self
    {
        $this->termsAndConditionsAcceptedAt = $termsAndConditionsAcceptedAt;

        return $this;
    }

    public function getTermsAndConditionsAcceptedBy(): ?User
    {
        return $this->termsAndConditionsAcceptedBy;
    }

    public function setTermsAndConditionsAcceptedBy(?User $termsAndConditionsAcceptedBy): self
    {
        $this->termsAndConditionsAcceptedBy = $termsAndConditionsAcceptedBy;

        return $this;
    }

    private static function fieldsAreAllowed(array $fields, array $allowed): bool {
        foreach(array_keys($fields) as $key) {
            if(!in_array($key, $allowed)) return false;
        }
        return true;
    }

    public static function isAllowedToUpdate(array $fields): bool {
        $allowed = ["title", "description", "quantityUnit", "dimensions", "color", "publishAt", "visibleUntil", "isDraft"];
        return self::fieldsAreAllowed($fields, $allowed);
    }

    public function clearChangeLog(): self
    {
        $this->changeLog = [];

        return $this;
    }

    public function addChangeLogEntry(array $entry): self {
        if($this->changeLog) {
            array_push($this->changeLog, $entry);
        } else {
            $this->changeLog = [$entry];
        }

        return $this;
    }

    public function getStoragePostalCode(): ?string
    {
        return $this->storagePostalCode;
    }

    public function setStoragePostalCode(?string $storagePostalCode): self
    {
        $this->storagePostalCode = $storagePostalCode;

        return $this;
    }

    public function getWasAnonymizedAt(): ?\DateTimeInterface
    {
        return $this->wasAnonymizedAt;
    }

    public function setWasAnonymizedAt(?\DateTimeInterface $wasAnonymizedAt): self
    {
        $this->wasAnonymizedAt = $wasAnonymizedAt;

        return $this;
    }
}
