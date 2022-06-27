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
import { useParams, Link } from "react-router-dom";
import { Tabs } from "antd";
import { FormattedMessage } from "react-intl";
import { useQuery } from "@apollo/react-hooks";
import {
    CheckOutlined,
    WarningOutlined,
    RocketOutlined,
} from "@ant-design/icons";

import validation from "../../helper/validation";
import materialStatus, { MaterialStatus } from "../../helper/materialStatus";
import PhotosTab from "./Tabs/ImagesTab";
import FeaturesTab from "./Tabs/FeaturesTab";
import PickupTab from "./Tabs/PickupTab";
import PublishTab from "./Tabs/VisibilityTab";
import Content from "../../components/Layouts/Content";

import history, { EditMaterialTabs, routes } from "../../history";

import {
    materialQuery,
    MaterialQuery,
    MaterialQueryVariables,
} from "../../graphql/queries/material";

const NewMaterialPage: FC = () => {
    const { materialId, editTab } = useParams();

    const { data, refetch } = useQuery<MaterialQuery, MaterialQueryVariables>(
        materialQuery.query,
        {
            variables: {
                id: `/materials/${materialId}`,
            },
            fetchPolicy: "no-cache",
        }
    );

    function switchTab(tab: EditMaterialTabs) {
        history.push(routes.editMaterial(materialId, tab));
    }

    const tabsValidation = validation.tabsAreValid(
        data?.material?.validationResults
    );

    function renderIconForTab(tab: EditMaterialTabs) {
        if (tab === EditMaterialTabs.Publish) return <RocketOutlined />;

        const tabIsValid = ((tab) => {
            switch (tab) {
                case EditMaterialTabs.Features:
                    return tabsValidation.featuresIsValid;
                case EditMaterialTabs.Images:
                    return tabsValidation.imagesIsValid;
                case EditMaterialTabs.Pickup:
                    return tabsValidation.pickupIsValid;
                default:
                    return false;
            }
        })(tab);

        if (tabIsValid) {
            return (
                <CheckOutlined style={{ marginRight: "0", color: "green" }} />
            );
        } else {
            return (
                <WarningOutlined
                    style={{ marginRight: "0", color: "orange" }}
                />
            );
        }
    }

    function renderBacklink() {
        const material = data?.material;

        if (material) {
            const status = materialStatus(
                material.isDraft,
                material.isFinished
            );
            switch (status) {
                case MaterialStatus.Draft: {
                    return (
                        <>
                            <Link to={routes.organizationDrafts}>Entwürfe</Link>{" "}
                            /{" "}
                        </>
                    );
                }
                case MaterialStatus.Active: {
                    return (
                        <>
                            <Link to={routes.organizationActive}>Aktiv</Link> /{" "}
                        </>
                    );
                }
                case MaterialStatus.Finished: {
                    return (
                        <>
                            <Link to={routes.organizationFinished}>
                                Abgeschlossen
                            </Link>{" "}
                            /{" "}
                        </>
                    );
                }
                default: {
                    return null;
                }
            }
        }
        return null;
    }

    if (data?.material) {
        const material = data.material;
        return (
            <Content
                title={
                    <>
                        {renderBacklink()}
                        {material.title}
                    </>
                }
                titleLevel={4}
            >
                <Tabs
                    onTabClick={(tab) => switchTab(tab as EditMaterialTabs)}
                    activeKey={editTab || EditMaterialTabs.Features}
                    size="large"
                >
                    <Tabs.TabPane
                        tab={
                            <span>
                                <FormattedMessage id="editMaterial.tab.features" />{" "}
                                {renderIconForTab(EditMaterialTabs.Features)}
                            </span>
                        }
                        key={EditMaterialTabs.Features}
                    >
                        <FeaturesTab
                            materialIdParam={materialId}
                            materialResult={data}
                            refetch={refetch}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={
                            <span>
                                <FormattedMessage id="editMaterial.tab.pictures" />{" "}
                                {renderIconForTab(EditMaterialTabs.Images)}
                            </span>
                        }
                        key={EditMaterialTabs.Images}
                    >
                        <PhotosTab
                            materialIdParam={materialId}
                            materialResult={data}
                            refetch={refetch}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={
                            <span>
                                <FormattedMessage id="editMaterial.tab.pickup" />{" "}
                                {renderIconForTab(EditMaterialTabs.Pickup)}
                            </span>
                        }
                        key={EditMaterialTabs.Pickup}
                    >
                        <PickupTab
                            materialIdParam={materialId}
                            materialResult={data}
                            refetch={refetch}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={
                            <span>
                                <FormattedMessage id="editMaterial.tab.activate" />{" "}
                                {renderIconForTab(EditMaterialTabs.Publish)}
                            </span>
                        }
                        key={EditMaterialTabs.Publish}
                    >
                        <PublishTab
                            materialIdParam={materialId}
                            materialResult={data}
                            refetch={refetch}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </Content>
        );
    }
    return null;
};

export default NewMaterialPage;
