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

import React, { FC, useState } from "react";
import { FormattedMessage } from "react-intl";

import MaterialDetails from "../../components/MaterialDetails/MaterialDetails";
import Content from "../../components/Layouts/Content";
import SearchInput from "../../components/Search/SearchInput";
import SearchInputPortal from "../../components/Search/SearchInputPortal";
import OurReservationsTab from "./Tabs/OurReservationsTab";

const OrganizationReservationsPage: FC = () => {
    const [activeMaterialId, setActiveMaterialId] = useState<
        number | undefined
    >();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (search: string) => {
        setSearchTerm(search);
    };

    return (
        <Content title={<FormattedMessage id="menu.ourReservations" />}>
            <SearchInputPortal>
                <SearchInput onSearchChange={handleSearchChange} />
            </SearchInputPortal>
            <OurReservationsTab
                onActiveMaterialChange={setActiveMaterialId}
                searchTerm={searchTerm}
            />
            {activeMaterialId ? (
                <MaterialDetails
                    materialId={activeMaterialId}
                    onCancel={() => setActiveMaterialId(undefined)}
                />
            ) : null}
        </Content>
    );
};

export default OrganizationReservationsPage;
