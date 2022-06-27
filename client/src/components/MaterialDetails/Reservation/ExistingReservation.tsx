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
import { Button, Spin } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/react-hooks";

import {
    MaterialQuery_material,
    MaterialQuery_material_outflows_edges_node,
} from "../../../graphql/generated/MaterialQuery";
import {
    deleteOutflowMutation,
    DeleteOutflowMutation,
    DeleteOutflowMutationVariables,
} from "../../../graphql/mutations/deleteOutflow";
import { MaterialQueryVariables } from "../../../graphql/queries/material";

import FlowLine from "../../FlowLine/FlowLine";
import ReservationForm from "./ReservationForm";
import ExistingReservationPopconfirm from "../../ExistingReservationPopconfirm/ExistingReservationPopconfirm";

interface Props {
    material: MaterialQuery_material;
    reservation: MaterialQuery_material_outflows_edges_node;
    refetchMaterial: (variables?: Partial<MaterialQueryVariables>) => any;
}

const existingReservationText = `
    Du bist dabei, eine bestehende
    Reservierungsanfrage hinsichtlich eines
    Zündstoffs zu ändern. So Du hierzu
    bereits eine Bestätigung haben solltest,
    kann es im Einzelfall sein, dass Du
    einen rechtsverbindlichen Vertrag
    geschlossen hast. Bitte halte daher ggf.
    mit dem Bestandsinhaber oder der
    Bestandsinhaberin Rücksprache, ob diese
    der evtl. Vertragsänderung zustimmt bzw.
    den Zündstoff zu den geänderten
    Konditionen noch überlassen möchte.
`;

const ExistingReservation: FC<Props> = ({
    material,
    reservation,
    refetchMaterial,
}) => {
    const [editing, setEditing] = useState(false);
    const [deleteOutflow, { loading }] = useMutation<
        DeleteOutflowMutation,
        DeleteOutflowMutationVariables
    >(deleteOutflowMutation.mutation);

    const handleDeleteReservation = (outflowId: string) => {
        deleteOutflow({
            variables: {
                input: {
                    id: outflowId,
                },
            },
        }).then(() => refetchMaterial());
    };

    const handleReservationUpdateCompleted = () => {
        setEditing(false);
        refetchMaterial();
    };

    return (
        <>
            <FlowLine.Line
                quantity={reservation.quantity}
                quantityUnit={material.quantityUnit}
                comment={null}
                actions={
                    <>
                        {!material.disallowPartialReservations &&
                            !reservation.pickedUpAt && (
                                <ExistingReservationPopconfirm
                                    text={existingReservationText}
                                    onConfirm={() => setEditing(true)}
                                    okText="Ändern"
                                >
                                    <Button
                                        type="link"
                                        icon={<EditOutlined />}
                                    />
                                </ExistingReservationPopconfirm>
                            )}
                        {!reservation.pickedUpAt && (
                            <ExistingReservationPopconfirm
                                text={existingReservationText}
                                onConfirm={() =>
                                    handleDeleteReservation(reservation.id)
                                }
                                okText="Löschen"
                                danger
                            >
                                <Button
                                    type="link"
                                    danger
                                    icon={
                                        loading ? <Spin /> : <DeleteOutlined />
                                    }
                                />
                            </ExistingReservationPopconfirm>
                        )}
                        {reservation.pickedUpAt && "bereits abgeholt"}
                    </>
                }
            />
            {editing ? (
                <ReservationForm
                    material={material}
                    reservation={reservation}
                    refetchMaterial={handleReservationUpdateCompleted}
                />
            ) : null}
        </>
    );
};

export default ExistingReservation;
