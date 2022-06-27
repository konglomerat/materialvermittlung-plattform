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

import React, { ReactChild, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { searchInputPlacementId } from "./SearchInput";

const SearchInputPortal = React.memo(
    ({ children }: { children: ReactChild }) => {
        const [domElement, setDomElement] = useState<HTMLElement | null>();
        useEffect(() => {
            setDomElement(document.getElementById(searchInputPlacementId));
        }, []);

        if (!domElement) {
            return null;
        }

        return ReactDOM.createPortal(<>{children}</>, domElement);
    }
);

export default SearchInputPortal;
