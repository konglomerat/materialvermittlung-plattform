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
import MaterialListItem from "../../components/MaterialListItem/MaterialListItem";
import { List } from "antd";

import moment from "moment";
import { OutflowsQuery } from "../../graphql/queries/outflows";
import Reservation from "../../components/ReservationActions/ReservationActions";

interface Props {
    loading: boolean;
    data: OutflowsQuery | undefined;
    onActiveMaterialChange: (materialId: number) => void;
}

const ReservationsStatusList: FC<Props> = ({
    loading,
    data,
    onActiveMaterialChange,
}) => {
    return (
        <List
            loading={loading}
            size="large"
            dataSource={data?.outflows?.edges || []}
            rowKey={(item) => {
                return item?.node?.id || "";
            }}
            renderItem={(edge) => {
                const outflow = edge?.node;

                if (outflow && outflow.material) {
                    const material = outflow.material;
                    return (
                        <MaterialListItem
                            material={material}
                            actions={
                                <>
                                    <Reservation.ApprovedStatus
                                        outflow={outflow}
                                    />
                                    <Reservation.ShowMaterial
                                        outflow={outflow}
                                        onClick={onActiveMaterialChange}
                                        disableIfMaterialNotVisible={true}
                                    />
                                </>
                            }
                            description={
                                <>
                                    {outflow.quantity} {material.quantityUnit}{" "}
                                    reserviert am{" "}
                                    {moment(outflow.createdOn).format(
                                        "DD.MM.YY"
                                    )}
                                    <br />
                                    lagert in {material.storage?.title} (
                                    {material.storage?.addressPostalCode},{" "}
                                    {material.storage?.addressCity})
                                </>
                            }
                        />
                    );
                }
                return null;
            }}
        />
    );
};

export default ReservationsStatusList;
