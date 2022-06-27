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
import {
    MaterialQuery_material,
    MaterialQuery_material_outflows_edges_node,
} from "../../../graphql/generated/MaterialQuery";
import { Button, Col, InputNumber, Result, Row, Slider } from "antd";
import { useMutation } from "@apollo/react-hooks";

import {
    createOutflowMutation,
    CreateOutflowMutation,
    CreateOutflowMutationVariables,
} from "../../../graphql/mutations/createOutflow";
import {
    updateOutflowMutation,
    UpdateOutflowMutation,
    UpdateOutflowMutationVariables,
} from "../../../graphql/mutations/updateOutflow";

import user from "../../../userInfo";
import Unit from "../../Unit/Unit";

interface Props {
    material: MaterialQuery_material;
    reservation?: MaterialQuery_material_outflows_edges_node;
    refetchMaterial: () => void;
}

const ReservationForm: FC<Props> = ({
    material,
    reservation,
    refetchMaterial,
}) => {
    const [quantity, setQuantity] = useState<number>(
        reservation && reservation.quantity ? reservation.quantity : 0
    );
    const [
        reservationCreatedOrUpdated,
        setReservationCreatedOrUpdated,
    ] = useState<boolean>(false);
    const [reservationInProgress, setReservationInProgress] = useState<boolean>(
        !!reservation
    );

    const handleError = () => {
        console.error("something went wrong");
    };

    const [createOutflow, { loading: createLoading }] = useMutation<
        CreateOutflowMutation,
        CreateOutflowMutationVariables
    >(createOutflowMutation.mutation, {
        onCompleted: ({ createOutflow }) => {
            if (createOutflow?.outflow) {
                handleCreateReservationCompleted();
            }
        },
        onError: handleError,
    });

    const [updateOutflow, { loading: updateLoading }] = useMutation<
        UpdateOutflowMutation,
        UpdateOutflowMutationVariables
    >(updateOutflowMutation.mutation, {
        onCompleted: ({ updateOutflow }) => {
            if (updateOutflow?.outflow) {
                handleCreateReservationCompleted();
            }
        },
        onError: handleError,
    });

    const loading = createLoading || updateLoading;

    const handleCreateReservationCompleted = () => {
        setReservationCreatedOrUpdated(true);
        refetchMaterial();
    };

    const onChange = (valueString: string | number | undefined) => {
        const value = Number(valueString);
        const availableQuantityFloored = Math.floor(material.availableQuantity);

        // The quantity can be a float e.g. 10.54 but the slider only allows integer values
        // which makes sense, as we do not want to bother the user with selecting the decimal place
        // of the amount.
        //
        // However if we have a decimal place remaining we want the user to be able to select it with
        // the slider to set the quantity to zero and hide the material.
        //
        // The user will always be able to directly type a value.
        if (value === availableQuantityFloored) {
            setQuantity(material.availableQuantity);
        } else {
            setQuantity(value);
        }
    };

    const handlePartialReservation = () => {
        if (!!reservation) {
            updateOutflow({
                variables: {
                    input: {
                        id: reservation.id,
                        quantity,
                    },
                },
            });
        } else {
            createOutflow({
                variables: {
                    input: {
                        material: material.id,
                        quantity,
                        reservingOrganization: user?.organization?.iri,
                    },
                },
            });
        }
    };

    const handleFullReservation = () => {
        if (!!reservation) {
            updateOutflow({
                variables: {
                    input: {
                        id: reservation.id,
                        quantity: material.availableQuantity,
                    },
                },
            });
        } else {
            createOutflow({
                variables: {
                    input: {
                        material: material.id,
                        quantity: material.availableQuantity,
                        reservingOrganization: user?.organization?.iri,
                    },
                },
            });
        }
    };

    const renderPartialReservation = () => {
        const maxQuantity =
            reservation && reservation.quantity
                ? material.availableQuantity + reservation.quantity
                : material.availableQuantity;
        return (
            <>
                {reservation ? (
                    <p>Ändere hier die Menge der Reservierung</p>
                ) : (
                    <p>Wie viel möchtest du reservieren?</p>
                )}
                <Row>
                    <Col xs={12} md={12}>
                        <Slider
                            min={1}
                            max={maxQuantity}
                            onChange={onChange}
                            value={quantity}
                            step={1}
                        />
                    </Col>
                    <Col xs={12} md={4}>
                        <InputNumber
                            min={1}
                            max={maxQuantity}
                            style={{ margin: "0 16px" }}
                            value={quantity}
                            onChange={onChange}
                        />
                    </Col>
                    <Col xs={24} md={6}>
                        <Button
                            onClick={handlePartialReservation}
                            type="primary"
                            loading={loading}
                        >
                            {reservation ? "Bestätigen" : "Reservieren"}
                        </Button>
                    </Col>
                </Row>
            </>
        );
    };

    const renderFullReservation = () => {
        return (
            <>
                <p>
                    Für dieses Material kann nur die gesamte Menge reserviert
                    und abgeholt werden.
                </p>
                <Row>
                    <Col xs={12} md={4}>
                        <InputNumber
                            disabled
                            style={{ margin: "0 16px" }}
                            value={material.availableQuantity}
                        />
                    </Col>
                    <Col xs={12} md={6}>
                        <Button
                            onClick={handleFullReservation}
                            type="primary"
                            loading={loading}
                        >
                            Alles Reservieren
                        </Button>
                    </Col>
                </Row>
            </>
        );
    };

    if (!reservationInProgress) {
        return (
            <>
                <Button
                    type="primary"
                    onClick={() => setReservationInProgress(true)}
                >
                    Reservieren
                </Button>
            </>
        );
    }

    if (reservationCreatedOrUpdated) {
        return (
            <Result
                status="success"
                title="Reservierung erfolgreich!"
                subTitle={
                    <>
                        Es wurden {quantity + " "}{" "}
                        <Unit unit={material.quantityUnit} /> für dich
                        reserviert
                    </>
                }
            />
        );
    }

    if (material.disallowPartialReservations) {
        return renderFullReservation();
    } else {
        return renderPartialReservation();
    }
};

export default ReservationForm;
