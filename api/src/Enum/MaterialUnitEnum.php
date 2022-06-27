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
abstract class MaterialUnitEnum {
    const STUECK = "STUECK";
    const KILOGRAMM = "KILOGRAMM";
    const METER = "METER";

    const DEFAULT = self::STUECK;

    public static function checkIfValueIsAllowed(string $value) {
        switch ($value) {
            case self::STUECK:
            case self::KILOGRAMM:
            case self::METER:
                return;
            default:
                throw new \InvalidArgumentException("MaterialUnit $value is not supported");
        }
    }

    public static function getTextForEnumValue(string $value): string {
        self::checkIfValueIsAllowed($value);
        switch ($value) {
            case self::STUECK:
                return "Stück";
            case self::KILOGRAMM:
                return "Kg";
            case self::METER:
                return "m";
        }
    }

    public static function toEnumTextMapping(): array {
        return [
            self::STUECK => self::getTextForEnumValue(self::STUECK),
            self::KILOGRAMM => self::getTextForEnumValue(self::KILOGRAMM),
            self::METER => self::getTextForEnumValue(self::METER),
        ];
    }

    public static function toDropdownOptions(): array {
        $labelMappings = self::toEnumTextMapping();
        $result = [];

        foreach ($labelMappings as $value => $label) {
            array_push($result, ["label" => $label, "value" => $value]);
        }

        return $result;
    }
}
