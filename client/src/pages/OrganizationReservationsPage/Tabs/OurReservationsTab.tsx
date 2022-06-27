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
import { useQuery } from "@apollo/react-hooks";
import {
    outflowsQuery,
    OutflowsQuery,
    OutflowsQueryVariables,
    outflowsVariables,
} from "../../../graphql/queries/outflows";
import user from "../../../userInfo";
import ReservationsStatusList from "../ReservationsStatusList";

interface Props {
    searchTerm: string;
    onActiveMaterialChange: (materialId: number) => void;
}

const OurReservationsTab: FC<Props> = ({
    searchTerm,
    onActiveMaterialChange,
}) => {
    const { loading, data } = useQuery<OutflowsQuery, OutflowsQueryVariables>(
        outflowsQuery.query,
        {
            variables: outflowsVariables.reservationsByOrg(
                user!.organization!.id,
                searchTerm
            ),
            fetchPolicy: "no-cache",
        }
    );

    return (
        <ReservationsStatusList
            loading={loading}
            data={data}
            onActiveMaterialChange={onActiveMaterialChange}
        />
    );
};

export default OurReservationsTab;
