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

namespace App\Enum;

// ###########################################################################
// IMPORTANT: when making changes also change corresponding ts file in client
// -> see clientConfig.ts
// ###########################################################################
abstract class MaterialFlowCommentsEnum {
    const INVENTUR = "INVENTUR";
    const EINRICHTUNG_BILDUNG = "EINRICHTUNG_BILDUNG";
    const EINRICHTUNG_SOZIAL = "EINRICHTUNG_SOZIAL";
    const ZIVILGESELLSCHAFT = "ZIVILGESELLSCHAFT";
    const PRIVAT = "PRIVAT";
    const KMU = "KMU";
    const KUNST_KULTUR = "KUNST_KULTUR";
    const ENTSORGUNG = "ENTSORGUNG";
    const OTHER = "OTHER";

    const INFLOW_ALL = [
        self::INVENTUR,
        self::EINRICHTUNG_SOZIAL,
        self::EINRICHTUNG_BILDUNG,
        self::ZIVILGESELLSCHAFT,
        self::PRIVAT,
        self::KMU,
        self::KUNST_KULTUR,
        self::OTHER,
    ];

    const OUTFLOW_ALL = [
        self::INVENTUR,
        self::EINRICHTUNG_SOZIAL,
        self::EINRICHTUNG_BILDUNG,
        self::ZIVILGESELLSCHAFT,
        self::PRIVAT,
        self::KMU,
        self::KUNST_KULTUR,
        // only outflows currently have this comment
        self::ENTSORGUNG,
        self::OTHER,
    ];

    public static function toEnumTextMapping(): array {
        return [
            self::INVENTUR => "Inventur/Korrektur",
            self::EINRICHTUNG_BILDUNG => "Bildungseinrichtung",
            self::EINRICHTUNG_SOZIAL => "soziale Einrichtung",
            self::ZIVILGESELLSCHAFT => "organisierte Zivilgesellschaft",
            self::KUNST_KULTUR => "Kunst & Kultur",
            self::PRIVAT => "privater Haushalt",
            self::KMU => "KMU",
            self::ENTSORGUNG => "Entsorgung",
            self::OTHER => "Andere",
        ];
    }

    public static function toInflowDropdownOptions(): array {

        $labelMappings = self::toEnumTextMapping();
        $result = [];

        foreach ($labelMappings as $value => $label) {
            if($value !== self::ENTSORGUNG) {
                array_push($result, ["label" => $label, "value" => $value]);
            }
        }

        return $result;
    }

    public static function toOutflowDropdownOptions(): array {

        $labelMappings = self::toEnumTextMapping();
        $result = [];

        foreach ($labelMappings as $value => $label) {
            array_push($result, ["label" => $label, "value" => $value]);
        }

        return $result;
    }
}
