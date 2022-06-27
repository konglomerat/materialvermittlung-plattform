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

import React, { FC, useEffect, useState } from "react";
import {
    DeleteOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import Tile from "./ImagesUpload.Tile";

type Pros = {
    file?: File;
    id: string;
    index: number;
    length: number;
    thumbnail?: string | null;
    disabled?: boolean;
    onDelete: (id: string) => void;
    onReorder: (index: number, direction: number) => void;
};

const ImagePreview: FC<Pros> = (props) => {
    const [thumbnail, setTumbnail] = useState(props.thumbnail);

    // we hide the element once remove was clicked
    // the request might take longer
    const [removing, setRemoving] = useState(false);

    useEffect(() => {
        if (props.thumbnail) {
            setTumbnail(props.thumbnail);
        } else {
            if (props.file) {
                let reader = new FileReader();
                reader.onloadend = () => {
                    setTumbnail(reader.result as string);
                };
                reader.readAsDataURL(props.file);
            }
        }
    }, [props.file, props.thumbnail]);

    function handleMoveLeft() {
        props.onReorder(props.index, -1);
    }

    function handleMoveRight() {
        props.onReorder(props.index, 1);
    }

    if (removing) return null;

    const canMoveLeft = props.index > 0;
    const canMoveRight = props.index < props.length - 1;

    return (
        <Tile backgroundSrc={thumbnail}>
            {!props.disabled && (
                <>
                    <div
                        className="images-upload__remove"
                        onClick={() => {
                            if (props.onDelete && !removing) {
                                setRemoving(true);
                                props.onDelete(props.id);
                            }
                        }}
                    >
                        <DeleteOutlined style={{ fontSize: "20px" }} />
                    </div>
                    {canMoveLeft && (
                        <div
                            className="images-upload__move images-upload__move-left"
                            onClick={handleMoveLeft}
                        >
                            <ArrowLeftOutlined />
                        </div>
                    )}

                    {canMoveRight && (
                        <div
                            className="images-upload__move images-upload__move-right"
                            onClick={handleMoveRight}
                        >
                            <ArrowRightOutlined />
                        </div>
                    )}
                </>
            )}
        </Tile>
    );
};

export default ImagePreview;
