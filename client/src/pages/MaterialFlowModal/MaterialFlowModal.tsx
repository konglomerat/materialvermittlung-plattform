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
import { Card, Col, Statistic, Tabs } from "antd";

import Modal from "../../components/Modal/Modal";
import OutflowTab from "./Outflows/OutflowTab";
import InflowTab from "./Inflows/InflowTab";
import Row from "../../components/Layouts/Row";
import { useQuery } from "@apollo/react-hooks";
import {
    materialQuery,
    MaterialQuery,
    MaterialQueryVariables,
} from "../../graphql/queries/material";

import Unit from "../../components/Unit/Unit";

const { TabPane } = Tabs;

type Props = {
    materialId: string;
    onFlowModalCancelClick: () => void;
    defaultTab?: "outflow" | "inflow";
};

const MaterialFlowModal: FC<Props> = ({
    materialId,
    onFlowModalCancelClick,
    defaultTab,
}) => {
    const [materialFlowModalTab, setMaterialFlowModalTab] = useState<string>(
        defaultTab || "outflow"
    );

    const { data, loading, refetch } = useQuery<
        MaterialQuery,
        MaterialQueryVariables
    >(materialQuery.query, {
        variables: {
            id: materialId,
        },
    });

    const handleMaterialFlowTabClick = (clickedTabKey: string) => {
        setMaterialFlowModalTab(clickedTabKey);
    };

    const material = data?.material;

    //TODO: styling
    return (
        <Modal
            isVisible={!!materialId}
            onCancel={onFlowModalCancelClick}
            title={material?.title}
        >
            <Card style={{ minHeight: "50vh" }}>
                <Row>
                    <Col md={8} sm={12}>
                        <Statistic
                            title="offene Reservierungen"
                            loading={loading}
                            value={material?.reservedQuantity}
                            suffix={<Unit unit={material?.quantityUnit} />}
                            decimalSeparator=","
                            groupSeparator="."
                        />
                    </Col>
                    <Col md={8} sm={12}>
                        <Statistic
                            title="noch frei verfügbar"
                            loading={loading}
                            value={material?.availableQuantity}
                            suffix={<Unit unit={material?.quantityUnit} />}
                            decimalSeparator=","
                            groupSeparator="."
                        />
                    </Col>
                </Row>
                <Tabs
                    activeKey={materialFlowModalTab}
                    onTabClick={handleMaterialFlowTabClick}
                    size="large"
                >
                    {material ? (
                        <>
                            <TabPane tab="Abgänge" key="outflow">
                                <OutflowTab
                                    material={material}
                                    refetchMaterial={refetch}
                                />
                            </TabPane>
                            <TabPane tab="Zugänge" key="inflow">
                                <InflowTab
                                    material={material}
                                    refetchMaterial={refetch}
                                />
                            </TabPane>
                        </>
                    ) : null}
                </Tabs>
            </Card>
        </Modal>
    );
};

export default MaterialFlowModal;
