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

import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { Input } from "antd";
import { useIntl } from "react-intl";

export const searchInputPlacementId = "search-input-container";

interface SearchInputProps {
    onSearchChange: (value: string) => void;
}

const SearchInput: FC<SearchInputProps> = ({ onSearchChange }) => {
    const intl = useIntl();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearchChange(searchTerm);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, onSearchChange]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
    };
    return (
        <Input.Search
            onChange={handleChange}
            onSearch={handleSearch}
            placeholder={intl.formatMessage({ id: "search" })}
            allowClear
            enterButton
        />
    );
};

export default SearchInput;
