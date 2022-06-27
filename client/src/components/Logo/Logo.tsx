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

import React, { CSSProperties, FC } from "react";

import logo from "./_assets/logos_logo.svg";
import avatar from "./_assets/logos_avatar.svg";

type Props = {
    logoType?: "avatar" | "logo";
    style?: CSSProperties;
};

const Logo: FC<Props> = (props) => {
    let imgSrc = "";
    switch (props.logoType) {
        case "avatar":
            imgSrc = avatar;
            break;
        default:
        case "logo":
            imgSrc = logo;
            break;
    }
    return (
        <img
            style={{ height: "80%", ...props.style }}
            src={imgSrc}
            alt="Logo Materialvermittlung Dresden"
        />
    );
};

export default Logo;
