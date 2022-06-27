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

use App\Resolver\UploadMediaObjectResolver;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * @ORM\Entity
 *
 * IMPORTANT: we currently rely on the default sorting configured here -> see Material->getLastImageSortIndex()
 * IMPORTANT: "file" is not required so we can write test for the file upload more easily
 *            without implementing a real upload. We focus on testing access restrictions!
 *
 * @ApiResource(
 *     order={"sortIndex": "ASC"},
 *     attributes={"pagination_enabled"=false},
 *     iri="http://schema.org/MediaObject",
 *     normalizationContext={
 *         "groups"={"read"}
 *     },
 *     graphql={
 *         "upload"={
 *             "mutation"=UploadMediaObjectResolver::class,
 *             "deserialize"=false,
 *             "args"={
 *                 "file"={"type"="Upload", "description"="File to upload"},
 *                 "materialId"={"type"="ID!", "description"="Id of material"},
 *                 "sortIndex"={"type"="Int", "description"="Index that will be used for sorting images of a material"},
 *             }
 *         },
 *        "delete"={
 *             "security"="is_granted('MEDIA_OBJECT_DELETE', object)",
 *             "denormalization_context"={"groups"={"mutation"}}
 *         },
 *        "update"={
 *             "security"="is_granted('MEDIA_OBJECT_UPDATE', object)",
 *             "denormalization_context"={"groups"={"mutation"}}
 *         }
 *     }
 * )
 * @Vich\Uploadable
 */

// TODO: check this out for thumbnails -> https://github.com/liip/LiipImagineBundle
class MediaObject
{
    /**
     * @var int|null
     *
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     * @ORM\Id
     */
    protected $id;

    /**
     * @var string|null
     *
     * @ApiProperty(iri="http://schema.org/contentUrl")
     * @Groups({"read"})
     */
    public $detailsUrl;

    /**
     * @var string|null
     *
     * @ApiProperty(iri="http://schema.org/contentUrl")
     * @Groups({"read"})
     */
    public $previewUrl;

    /**
     * @var string|null
     *
     * @ApiProperty(iri="http://schema.org/contentUrl")
     * @Groups({"read"})
     */
    public $thumbnailUrl;

    /**
     * @var File|null
     *
     * @Assert\NotNull(groups={"media_object_create"})
     * @Vich\UploadableField(mapping="media_object", fileNameProperty="filePath")
     */
    public $file;

    /**
     * @var string|null
     *
     * @ORM\Column(nullable=true)
     */
    public $filePath;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Material", inversedBy="images")
     */
    public $material;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"read", "mutation"})
     */
    private $sortIndex;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="mediaObjects")
     */
    private $uploadedBy;

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

    public function getSortIndex(): ?int
    {
        return $this->sortIndex;
    }

    public function setSortIndex(?int $sortIndex): self
    {
        $this->sortIndex = $sortIndex;

        return $this;
    }

    public function getUploadedBy(): ?User
    {
        return $this->uploadedBy;
    }

    public function setUploadedBy(?User $uploadedBy): self
    {
        $this->uploadedBy = $uploadedBy;

        return $this;
    }
}
