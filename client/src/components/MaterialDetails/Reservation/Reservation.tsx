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
import user from "../../../userInfo";
import { Typography } from "antd";

import { MaterialQuery_material } from "../../../graphql/generated/MaterialQuery";
import { MaterialQueryVariables } from "../../../graphql/queries/material";

import ReservationForm from "./ReservationForm";
import ExistingReservation from "./ExistingReservation";

const { Paragraph } = Typography;

interface Props {
    readonly?: boolean;
    material: MaterialQuery_material;
    refetchMaterial: (variables?: Partial<MaterialQueryVariables>) => any;
}

const Reservation: FC<Props> = ({ readonly, material, refetchMaterial }) => {
    // only registered users should be able to make reservations
    // to prevent material from being "blocked" for others and then not getting picked up
    if (readonly || !user) {
        return null;
    }

    if (material?.organization?.id === user.organization?.iri) {
        return (
            <>
                <h2>Reservierung</h2>
                <Paragraph>
                    Reservierungen können nicht auf organisationseigenen
                    Materialien gemacht werden.
                </Paragraph>
            </>
        );
    }

    const notPickedUpReservations = material.outflows?.edges?.filter(
        (outflow) => {
            return !outflow!.node!.pickedUpAt;
        }
    );
    return (
        <>
            <h2>Reservierung</h2>
            {material.outflows?.edges?.map((outflow) => (
                <ExistingReservation
                    material={material}
                    reservation={outflow!.node!}
                    refetchMaterial={refetchMaterial}
                />
            ))}
            {notPickedUpReservations?.length === 0 ? (
                <ReservationForm
                    material={material}
                    refetchMaterial={refetchMaterial}
                />
            ) : null}
        </>
    );
};

export default Reservation;
