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

import React, { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBoxes,
    faBrush,
    faMapMarked,
    faRulerCombined,
} from "@fortawesome/pro-regular-svg-icons";

import { MaterialsQueryNode } from "../../graphql/queries/materials";
import classnames from "classnames";
import { MaterialQueryMaterial } from "../../graphql/queries/material";
import Unit from "../Unit/Unit";

type Props = {
    material: MaterialsQueryNode | MaterialQueryMaterial;
    size?: "big";
};

const MaterialMetadata: FC<Props> = ({ material, size }) => {
    return (
        <div
            className={classnames("material-metadata", {
                ["material-metadata--" + size]: size,
            })}
        >
            <div className="material-metadata__item">
                <FontAwesomeIcon
                    icon={faBoxes}
                    className="material-metadata__item-icon"
                />
                {material.availableQuantity + " "}
                <Unit unit={material.quantityUnit} />
            </div>
            <div className="material-metadata__item">
                <FontAwesomeIcon
                    icon={faRulerCombined}
                    className="material-metadata__item-icon"
                />
                {material.dimensions ? material.dimensions : "???"}
            </div>
            <div className="material-metadata__item">
                <FontAwesomeIcon
                    icon={faBrush}
                    className="material-metadata__item-icon"
                />
                {material.color ? material.color : "???"}
            </div>
            <div className="material-metadata__item">
                <FontAwesomeIcon
                    icon={faMapMarked}
                    className="material-metadata__item-icon"
                />
                {material.storage?.title + ", "}
                {material.storage?.addressPostalCode +
                    " " +
                    material.storage?.addressCity}
            </div>
        </div>
    );
};

export default MaterialMetadata;
