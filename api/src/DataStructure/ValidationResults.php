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

namespace App\DataStructure;

use App\Entity\Material;

class ValidationResults {
    static function fromMaterial(Material $material): ValidationResults {
        return new ValidationResults($material);
    }
    private $material;

    public function __construct(Material $material) {
        $this->material = $material;
    }

    public function toArray(): array {
        $firstInflow = $this->material->getInflows()->first();

        $description = !!$this->material->getDescription();
        $title = !!$this->material->getTitle();
        $quantityUnit = !!$this->material->getQuantityUnit();
        $quantity = !!$this->material->getInflowQuantity();
        $dimensions = !!$this->material->getDimensions();
        $images = !!sizeof($this->material->getImages());
        $storage = !!$this->material->getStorage();
        $firstInflowComment = $firstInflow ? !!$firstInflow->getComment() : false;

        // `publishAt` can be null and does not need to be validated
        // this property will be set to a date as part of the publishing process
        // in the client

        // `visibleUntil` can be null and does not need to be validated
        // material can be visible forever -> e.g. when in a public storage

        // IMPORTANT: adding and removing properties, please also update
        // `validation.ts` in client/helper/
        return [
            "_all" =>
                $description &&
                $title &&
                $quantityUnit &&
                $quantity &&
                $dimensions &&
                $images &&
                $storage &&
                $firstInflowComment
            ,
            "description" => $description,
            "title" => $title,
            "quantityUnit" => $quantityUnit,
            "quantity" => $quantity,
            "dimensions" => $dimensions,
            "images" => $images,
            "storage" => $storage,
            "firstInflowComment" => $firstInflowComment,
        ];
    }
}
