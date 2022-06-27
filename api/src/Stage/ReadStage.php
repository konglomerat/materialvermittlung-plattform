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

namespace App\Stage;

use ApiPlatform\Core\GraphQl\Resolver\Stage\ReadStageInterface;
use App\Entity\MediaObject;
use Liip\ImagineBundle\Imagine\Cache\CacheManager;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Vich\UploaderBundle\Templating\Helper\UploaderHelper;
use ColorThief\ColorThief;

// TODO: some really good documentation
// https://github.com/api-platform/core/issues/3081#issuecomment-533782814

final class ReadStage implements ReadStageInterface
{
    private $readStage;
    private $helper;
    private $imagineCacheManager;
    private $environment;

    public function __construct(ReadStageInterface $readStage, UploaderHelper $helper, CacheManager $imagineCacheManager, $environment)
    {
        $this->readStage = $readStage;
        $this->helper = $helper;
        $this->imagineCacheManager = $imagineCacheManager;
        $this->environment = $environment;
    }

    private function generateUrl(?string $path, string $filter): string {
        switch($this->environment) {
            case "test":
                return "SOME_URL_FOR_TESTING";
            case "dev":
                // so we can correctly proxy images in the create-react-app dev server
                // -> see `client/package.json
                return "https://localhost" . $this->imagineCacheManager->generateUrl(
                        $path,
                        $filter,
                        [],
                        null,
                        UrlGeneratorInterface::ABSOLUTE_PATH
                    );
            default:
                // Production
                return $this->imagineCacheManager->getBrowserPath(
                    $path,
                    $filter,
                );
        }
    }

    private function setImageVariantsForMediaObject(MediaObject $mediaObject) {
        $path = $this->helper->asset($mediaObject, 'file', MediaObject::class);
        $mediaObject->detailsUrl = $this->generateUrl($path, "details");
        $mediaObject->previewUrl = $this->generateUrl($path, "preview");
        $mediaObject->thumbnailUrl = $this->generateUrl($path, "thumbnail");
    }

    /**
     * {@inheritdoc}
     */
    public function __invoke(?string $resourceClass, ?string $rootClass, string $operationName, array $context)
    {
        // Call the decorated read stage (this syntax calls the __invoke method).
        $readObject = ($this->readStage)($resourceClass, $rootClass, $operationName, $context);

        if (is_iterable($readObject)) {
            foreach ($readObject as $object) {
                if (is_a($object, MediaObject::class, true)) {
                    $this->setImageVariantsForMediaObject($object);
                }
            }
        }

        if (is_a($readObject, MediaObject::class, true)) {
            $this->setImageVariantsForMediaObject($readObject);
        }

        return $readObject;
    }
}
