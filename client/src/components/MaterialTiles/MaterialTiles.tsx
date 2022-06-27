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

import React, { FC, memo } from "react";
import Masonry from "react-masonry-component";

type Props = {
    children: any;
};

const MaterialTiles: FC<Props> = (props) => {
    return (
        <div className="material-tiles__wrapper">
            <Masonry className="material-tiles">{props.children}</Masonry>
        </div>
    );
};

export default memo(MaterialTiles);
