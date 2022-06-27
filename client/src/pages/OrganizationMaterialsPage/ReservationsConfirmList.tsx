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
import ReservationActions from "../../components/ReservationActions/ReservationActions";

import { OutflowsQuery_outflows_edges_node } from "../../graphql/generated/OutflowsQuery";

interface Props {
    loading: boolean;
    data: OutflowsQuery | undefined;
    refetch: () => void;
    onActiveMaterialChange: (materialId: number) => void;
    onActiveReservationChange: (
        outflow: OutflowsQuery_outflows_edges_node
    ) => void;
}

const ReservationsConfirmList: FC<Props> = ({
    loading,
    data,
    refetch,
    onActiveMaterialChange,
    onActiveReservationChange,
}) => {
    const handlePickupClick = (outflow: OutflowsQuery_outflows_edges_node) => {
        onActiveReservationChange(outflow);
    };

    return (
        <List
            loading={loading}
            size="large"
            dataSource={data?.outflows?.edges || []}
            renderItem={(edge) => {
                const outflow = edge?.node;

                if (outflow && outflow.material) {
                    const material = outflow.material;
                    return (
                        <MaterialListItem
                            key={outflow.id}
                            material={material}
                            actions={
                                <>
                                    <ReservationActions.Approve
                                        onRefetch={refetch}
                                        outflow={outflow}
                                    />
                                    {outflow.reservationApprovedAt && (
                                        <ReservationActions.PickUp
                                            onPickupClick={handlePickupClick}
                                            outflow={outflow}
                                        />
                                    )}
                                    <ReservationActions.ShowMaterial
                                        onClick={onActiveMaterialChange}
                                        outflow={outflow}
                                    />
                                    <ReservationActions.Remove
                                        onRefetch={refetch}
                                        outflow={outflow}
                                    />
                                </>
                            }
                            description={
                                <>
                                    {outflow.quantity} {material.quantityUnit},
                                    lagert in {material.storage?.title} (
                                    {material.storage?.addressPostalCode},{" "}
                                    {material.storage?.addressCity}), <br />
                                    reserviert am{" "}
                                    {moment(outflow.createdOn).format(
                                        "DD.MM.YY"
                                    )}{" "}
                                    von {outflow.reservingOrganization?.name}
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

export default ReservationsConfirmList;
