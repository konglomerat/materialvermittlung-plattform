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

import React, { FC, useState, memo } from "react";
import classnames from "classnames";
import { MaterialsQueryNode } from "../../graphql/queries/materials";

import MaterialMetadata from "../MaterialMetadata/MaterialMetadata";
import { Link } from "react-router-dom";
import { routes } from "../../history";
import user from "../../userInfo";

type Props = {
    isNotPublic?: boolean;
    isNew?: boolean;
    imageSrc?: string | null;
    info?: any;
    details?: any;
    footer?: any;
    size?: "small";
    noBorder?: boolean;
    linkTo?: string;
    isOrganizationMaterial?: boolean;
};

const tileMinHeightRatio = 1.3;
const tileMaxHeightRatio = 1.6;
const tileMinWidth = 300;

function getSizeFactor(size?: "small"): number {
    switch (size) {
        case "small":
            return 0.5;

        default:
            return 1;
    }
}

function getRandomHeightRatio(): number {
    return (
        Math.random() * (tileMaxHeightRatio - tileMinHeightRatio) +
        tileMinHeightRatio
    );
}

function getNumberOfTilesPerWidth(size?: "small"): number {
    const numberOfTiles = Math.floor(
        window.innerWidth / (tileMinWidth * getSizeFactor(size))
    );

    if (numberOfTiles > 1) {
        return numberOfTiles;
    } else {
        return 1;
    }
}

const AbstractMaterialTile: FC<Props> = (props) => {
    const [heightRatio] = useState(getRandomHeightRatio());

    function renderContent() {
        if (props.info || props.details) {
            return (
                <div className="material-tiles-tile__content">
                    <div className="material-tiles-tile__info">
                        {props.info}
                    </div>
                </div>
            );
        }
        return null;
    }

    const renderWrapper = () => (
        <div
            style={{
                backgroundImage: `url("${props.imageSrc}")`,
                paddingTop: `${heightRatio * 100}%`,
            }}
            className={classnames("material-tiles-tile", {
                "material-tiles-tile--clickable": props.linkTo,
                "material-tiles-tile--no-border": props.noBorder,
                "material-tiles-tile--not-public": props.isNotPublic,
            })}
        >
            {props.isNotPublic && (
                <div className="material-tiles-tile__tag">NICHT ÖFFENTLICH</div>
            )}
            {props.isNew && <div className="badge" />}
            {props.isOrganizationMaterial && (
                <div className="material-tiles-tile--is-org-material-overlay">
                    <div className="material-tiles-tile--is-org-material-overlay-text">
                        EIGENES MATERIAL
                    </div>
                </div>
            )}
            {renderContent()}
        </div>
    );

    if (props.linkTo) {
        return (
            <Link
                to={props.linkTo}
                className="material-tiles-tile__wrapper"
                style={{
                    width: `${100 / getNumberOfTilesPerWidth(props.size)}%`,
                }}
            >
                {renderWrapper()}
            </Link>
        );
    } else {
        return (
            <div
                className="material-tiles-tile__wrapper"
                style={{
                    width: `${100 / getNumberOfTilesPerWidth(props.size)}%`,
                }}
            >
                {renderWrapper()}
            </div>
        );
    }
};

type DefaultMaterialTileProps = {
    material: MaterialsQueryNode;
};

const DefaultMaterialTile: FC<DefaultMaterialTileProps> = ({ material }) => {
    return (
        <AbstractMaterialTile
            isNotPublic={!material.storage?.isPublic}
            isNew={!!material.isNew}
            key={material.id}
            imageSrc={material.images?.[0]?.previewUrl || undefined}
            linkTo={routes.material(material._id)}
            isOrganizationMaterial={
                material.organization?.id === user?.organization?.iri
            }
            info={
                <>
                    <h3>{material.title}</h3>
                    <MaterialMetadata material={material} />
                </>
            }
        />
    );
};

type ImageMaterialTileProps = {
    material: MaterialsQueryNode;
};

const ImagesMaterialTile: FC<ImageMaterialTileProps> = ({ material }) => {
    return (
        <AbstractMaterialTile
            imageSrc={material.images?.[0]?.previewUrl || undefined}
            noBorder
            size="small"
        />
    );
};

export default {
    Default: memo(DefaultMaterialTile),
    Image: memo(ImagesMaterialTile),
};

export function getNumberOfTilesForBackground(
    factor: number = 2,
    size?: "small"
) {
    const height = window.innerHeight;
    const width = window.innerWidth;

    const columns = getNumberOfTilesPerWidth(size);

    const rows = Math.ceil(height / ((width / columns) * tileMinHeightRatio));

    const numberOfTilesToLoad = factor * columns * rows;

    if (numberOfTilesToLoad > 10) {
        return numberOfTilesToLoad;
    } else {
        // for smaller screens
        return 10;
    }
}
