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

type Props = {
    href: string;
    text: string;
};

const Obfuscate: FC<Props> = ({ href, text }) => {
    const textInReverse = text.split("").reverse().join("");

    return (
        // eslint-disable-next-line
        <a
            style={{ direction: "rtl", unicodeBidi: "bidi-override" }}
            onClick={() => (window.location.href = href)}
        >
            {textInReverse}
        </a>
    );
};

export default Obfuscate;
