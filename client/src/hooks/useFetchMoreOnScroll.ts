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

import { useEffect, useState } from "react";
import useScrollPosition from "@react-hook/window-scroll";

export default function useQueryWithFetchMore(
    shouldFetch: boolean,
    handleFetch: () => Promise<any>
) {
    const [isFetching, setIsFetching] = useState(false);
    const scrollY = useScrollPosition(60);

    useEffect(() => {
        if (
            shouldFetch &&
            scrollY + document.body.clientHeight + window.innerHeight >
                document.body.scrollHeight
        ) {
            setIsFetching(true);
            handleFetch().finally(() => {
                setIsFetching(false);
            });
        }
    }, [scrollY, handleFetch, shouldFetch]);

    return isFetching;
}
