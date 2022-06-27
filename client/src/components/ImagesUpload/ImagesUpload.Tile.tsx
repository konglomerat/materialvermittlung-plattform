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
import classnames from "classnames";

type Pros = {
    children: any;
    backgroundSrc?: string | null;
    className?: string;
    onClick?: () => void;
};

const Tile: FC<Pros> = (props) => {
    return (
        <div className="images-upload__tile-wrapper">
            <div
                onClick={props.onClick}
                className="images-upload__tile"
                style={{
                    backgroundImage: props.backgroundSrc
                        ? `url(${props.backgroundSrc})`
                        : undefined,
                }}
            >
                <div
                    className={classnames(
                        "images-upload__tile-content",
                        props.className
                    )}
                >
                    {props.children}
                </div>
            </div>
        </div>
    );
};

export default Tile;
