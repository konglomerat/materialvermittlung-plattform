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
import { useQuery } from "@apollo/react-hooks";
import {
    outflowsQuery,
    OutflowsQuery,
    OutflowsQueryVariables,
    outflowsVariables,
} from "../../../graphql/queries/outflows";
import user from "../../../userInfo";
import ReservationsConfirmList from "../ReservationsConfirmList";
import PickupModal from "./PickupModal";
import { OutflowsQuery_outflows_edges_node } from "../../../graphql/generated/OutflowsQuery";

interface Props {
    searchTerm: string;
    onActiveMaterialChange: (materialId: number) => void;
}

const ReservationsTab: FC<Props> = ({ searchTerm, onActiveMaterialChange }) => {
    const [
        outflowIdForPickupModal,
        setOutflowIdForPickupModal,
    ] = useState<OutflowsQuery_outflows_edges_node | null>();
    const { loading, data, refetch } = useQuery<
        OutflowsQuery,
        OutflowsQueryVariables
    >(outflowsQuery.query, {
        variables: outflowsVariables.reservationsForOrgMaterials(
            user!.organization!.id,
            searchTerm
        ),
        fetchPolicy: "no-cache",
    });

    const handleActiveReservationChange = (
        outflow: OutflowsQuery_outflows_edges_node
    ) => {
        setOutflowIdForPickupModal(outflow);
    };

    const handlePickupModalCancelClick = () => {
        setOutflowIdForPickupModal(null);
    };

    return (
        <>
            <ReservationsConfirmList
                loading={loading}
                data={data}
                onActiveMaterialChange={onActiveMaterialChange}
                onActiveReservationChange={handleActiveReservationChange}
                refetch={refetch}
            />
            {outflowIdForPickupModal ? (
                <PickupModal
                    reservation={outflowIdForPickupModal}
                    onCancelClick={handlePickupModalCancelClick}
                    refetch={refetch}
                />
            ) : null}
        </>
    );
};

export default ReservationsTab;
