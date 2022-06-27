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
import { Tabs } from "antd";
import { useParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import DraftsTab from "./Tabs/DraftsTab";
import ActiveTab from "./Tabs/ActiveTab";
import PastTab from "./Tabs/FinishedTab";
import history, { OrganizationMaterialLists } from "../../history";
import { MaterialsQueryNode } from "../../graphql/queries/materials";
import MaterialFlowModal from "../MaterialFlowModal/MaterialFlowModal";
import MaterialDetails from "../../components/MaterialDetails/MaterialDetails";
import Content from "../../components/Layouts/Content";
import SearchInput from "../../components/Search/SearchInput";
import SearchInputPortal from "../../components/Search/SearchInputPortal";
import ReservationsTab from "./Tabs/ReservationsTab";

const { TabPane } = Tabs;

const OrganizationMaterialsPage: FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { tab, materialId } = useParams();

    const [materialIdForFlowModal, setMaterialIdForFlowModal] = useState<
        string | null
    >(null);

    const handleSearchChange = (search: string) => {
        setSearchTerm(search);
    };

    const handleOnTabClick = (clickedTabKey: string) => {
        history.push(`/organisation/${clickedTabKey}`);
    };

    const handleActiveMaterialModalCancelClick = () => {
        history.push(`/organisation/${tab}`);
    };

    const handleMaterialFlowClick = (material: MaterialsQueryNode) => {
        setMaterialIdForFlowModal(material.id);
    };

    const handleFlowModalCancelClick = () => {
        setMaterialIdForFlowModal(null);
    };

    return (
        <Content title={<FormattedMessage id="menu.ourMaterial" />}>
            <SearchInputPortal>
                <SearchInput onSearchChange={handleSearchChange} />
            </SearchInputPortal>
            <Tabs activeKey={tab} onTabClick={handleOnTabClick} size="large">
                <TabPane tab="Entwürfe" key={OrganizationMaterialLists.Drafts}>
                    <DraftsTab search={searchTerm} />
                </TabPane>
                <TabPane tab="Aktiv" key={OrganizationMaterialLists.Active}>
                    <ActiveTab
                        onMaterialFlowClick={handleMaterialFlowClick}
                        search={searchTerm}
                    />
                </TabPane>
                <TabPane
                    tab="Abgeschlossen"
                    key={OrganizationMaterialLists.Finished}
                >
                    <PastTab
                        onMaterialFlowClick={handleMaterialFlowClick}
                        search={searchTerm}
                    />
                </TabPane>
                <TabPane
                    tab="Reservierungen"
                    key={OrganizationMaterialLists.reservations}
                >
                    <ReservationsTab
                        searchTerm={searchTerm}
                        onActiveMaterialChange={(materialId) =>
                            history.push(
                                `/organisation/reservierungen/${materialId}`
                            )
                        }
                    />
                </TabPane>
            </Tabs>
            {materialId ? (
                <MaterialDetails
                    readonly={true}
                    materialId={materialId}
                    onCancel={handleActiveMaterialModalCancelClick}
                />
            ) : null}
            {materialIdForFlowModal ? (
                <MaterialFlowModal
                    materialId={materialIdForFlowModal}
                    onFlowModalCancelClick={handleFlowModalCancelClick}
                />
            ) : null}
        </Content>
    );
};

export default OrganizationMaterialsPage;
