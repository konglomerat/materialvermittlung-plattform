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

import React, { FC, useState, useEffect } from "react";
import { MaterialsQueryImage } from "../../graphql/queries/materials";
import classnames from "classnames";

type Props = {
    images: (MaterialsQueryImage | null)[];
};

const ImagesViewer: FC<Props> = ({ images }) => {
    const [
        currentImage,
        setCurrentImage,
    ] = useState<MaterialsQueryImage | null>();

    useEffect(() => {
        const filteredImages = images.filter((image) => !!image);
        if (filteredImages.length) {
            setCurrentImage(filteredImages[0]);
        }
    }, [images]);

    return (
        <div className="images-viewer">
            <div className="images-viewer__current">
                {currentImage?.previewUrl && (
                    <img
                        alt="thumbnail"
                        src={currentImage.previewUrl}
                        className="images-viewer__current-image"
                    />
                )}
            </div>
            <ul className="images-viewer__images">
                {images.map((image) => {
                    if (image?.thumbnailUrl) {
                        return (
                            <li
                                key={image.id}
                                className={classnames(
                                    "images-viewer__images-item-wrapper",
                                    {
                                        "images-viewer__images-item-wrapper--active":
                                            currentImage?.id &&
                                            currentImage.id === image.id,
                                    }
                                )}
                            >
                                <div
                                    onClick={() => {
                                        setCurrentImage(image);
                                    }}
                                    style={{
                                        backgroundImage: `url(${image.thumbnailUrl})`,
                                    }}
                                    className="images-viewer__images-item"
                                ></div>
                            </li>
                        );
                    } else {
                        return null;
                    }
                })}
            </ul>
        </div>
    );
};

export default ImagesViewer;
