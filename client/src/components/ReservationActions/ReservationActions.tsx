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
import { Button, Tooltip, Spin } from "antd";
import { useMutation } from "@apollo/react-hooks";

import {
    CheckCircleFilled,
    CheckOutlined,
    DeleteOutlined,
    EyeOutlined,
    ClockCircleOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";

import { green } from "@ant-design/colors";

import { OutflowsQueryNode } from "../../graphql/queries/outflows";
import { OutflowsQuery_outflows_edges_node } from "../../graphql/generated/OutflowsQuery";

import {
    approveReservationOutflow,
    ApproveReservationOutflowMutation,
    ApproveReservationOutflowMutationVariables,
} from "../../graphql/mutations/approveReservationOutflow";

import {
    deleteOutflowMutation,
    DeleteOutflowMutation,
    DeleteOutflowMutationVariables,
} from "../../graphql/mutations/deleteOutflow";
import ExistingReservationPopconfirm from "../ExistingReservationPopconfirm/ExistingReservationPopconfirm";

const ShowMaterial: FC<{
    outflow: OutflowsQueryNode;
    onClick: (materialId: number) => void;
    // The material will always be visible for the owner but in some cases might not be visible
    // anymore for the reserving organization. For list displaying the reservation to the reserving
    // organization we need to prevent the user from clicking this icon. Otherwise we will get an
    // access denied exception from the server.
    disableIfMaterialNotVisible?: boolean;
}> = ({ outflow, onClick, disableIfMaterialNotVisible }) => {
    const disabled =
        disableIfMaterialNotVisible && outflow.material
            ? !outflow.material.isVisible
            : false;
    return (
        <Tooltip
            title={
                disabled
                    ? "Material ist nicht mehr öffentlich sichtbar"
                    : "Material anzeigen"
            }
        >
            <Button
                type="link"
                disabled={disabled}
                icon={<EyeOutlined />}
                onClick={() => {
                    if (outflow.material) onClick(outflow.material._id);
                }}
            />
        </Tooltip>
    );
};

type RemoveProps = {
    outflow: OutflowsQueryNode;
    onRefetch: () => void;
};

const Remove: FC<RemoveProps> = ({ outflow, onRefetch }) => {
    // we set it to true once but reset it as we want to prevent concurrent clicks
    // if the element is not yet removed from the list after the mutation has finished
    const [disabled, setDisabled] = useState(false);
    const [deleteReservation] = useMutation<
        DeleteOutflowMutation,
        DeleteOutflowMutationVariables
    >(deleteOutflowMutation.mutation, {
        onCompleted: () => {
            onRefetch();
        },
    });

    const handleDeleteReservation = (outflowId: string) => {
        // we need to prevent mutating again if the mutation is still running
        setDisabled(true);
        deleteReservation({
            variables: {
                input: {
                    id: outflowId,
                },
            },
        });
    };

    return (
        <Tooltip title="Reservierung ablehnen">
            <ExistingReservationPopconfirm
                text="Du bist dabei, eine bestehende Beschreibung eines Zündstoffs zu ändern. So Du hierzu bereits Reservierungsanfragen erhalten und diese bestätigt haben solltest, kann es im Einzelfall sein, dass Du einen rechtsverbindlichen Vertrag geschlossen hast. Bitte halte daher ggf. mit dem Abnehmer oder der Abnehmerin Rücksprache, ob diese der evtl. Vertragsänderung zustimmt bzw. den Zündstoff zu den geänderten Konditionen noch abnehmen möchte."
                onConfirm={() => handleDeleteReservation(outflow.id)}
                danger
                okText="Ablehnen und Löschen"
            >
                <Button
                    disabled={disabled}
                    type="link"
                    danger
                    icon={disabled ? <Spin size="small" /> : <DeleteOutlined />}
                />
            </ExistingReservationPopconfirm>
        </Tooltip>
    );
};

type ApproveProps = {
    outflow: OutflowsQueryNode;
    onRefetch: () => void;
};

const Approve: FC<ApproveProps> = ({ outflow, onRefetch }) => {
    // we set it to true once but reset it as we want to prevent concurrent clicks
    // if the element is not yet removed from the list after the mutation has finished
    const [disabled, setDisabled] = useState(false);
    const [approveReservation] = useMutation<
        ApproveReservationOutflowMutation,
        ApproveReservationOutflowMutationVariables
    >(approveReservationOutflow.mutation, {
        onCompleted: ({ approveReservationOutflow }) => {
            if (approveReservationOutflow?.outflow) {
                onRefetch();
            }
        },
    });

    const handleApproveReservation = (outflowId: string) => {
        // we need to prevent mutating again if the mutation is still running
        setDisabled(true);
        approveReservation({
            variables: {
                input: {
                    id: outflowId,
                },
            },
        });
    };

    const isApproved = outflow.reservationApprovedAt;
    const tooltip = isApproved
        ? "Reservierung bestätigt"
        : "Reservierung bestätigen";
    return (
        <Tooltip title={tooltip}>
            {isApproved ? (
                <CheckCircleFilled
                    style={{
                        color: green[6],
                        padding: "8px",
                    }}
                />
            ) : (
                <Button
                    type="link"
                    disabled={disabled}
                    icon={disabled ? <Spin size="small" /> : <CheckOutlined />}
                    onClick={() => handleApproveReservation(outflow.id)}
                />
            )}
        </Tooltip>
    );
};

type PickupProps = {
    outflow: OutflowsQueryNode;
    onPickupClick: (outflow: OutflowsQuery_outflows_edges_node) => void;
};

const PickUp: FC<PickupProps> = ({ outflow, onPickupClick }) => {
    return (
        <Tooltip title="Abholung bestätigen">
            <Button
                type="link"
                icon={<ShoppingCartOutlined />}
                onClick={() => onPickupClick(outflow)}
            />
        </Tooltip>
    );
};

const ApprovedStatus: FC<{ outflow: OutflowsQueryNode }> = ({ outflow }) => {
    const isApproved = outflow.reservationApprovedAt;
    const tooltip = isApproved
        ? "Reservierung bestätigt"
        : "Warten auf Bestätigung";
    return (
        <Tooltip title={tooltip}>
            {isApproved ? (
                <CheckCircleFilled
                    type=""
                    style={{
                        color: green[6],
                        padding: "8px",
                    }}
                />
            ) : (
                <ClockCircleOutlined style={{ padding: "8px" }} />
            )}
        </Tooltip>
    );
};

export default {
    Remove,
    Approve,
    ShowMaterial,
    ApprovedStatus,
    PickUp,
};
