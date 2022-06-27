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
import { Button, Card, Col, InputNumber } from "antd";
import { ApolloError } from "apollo-client";
import { useMutation } from "@apollo/react-hooks";

import Modal from "../../../components/Modal/Modal";
import Row from "../../../components/Layouts/Row";
import Unit from "../../../components/Unit/Unit";

import { OutflowsQuery_outflows_edges_node } from "../../../graphql/generated/OutflowsQuery";
import {
    pickedupReservationOutflow,
    PickedupReservationOutflowMutation,
    PickedupReservationOutflowMutationVariables,
} from "../../../graphql/mutations/pickedupReservationOutflow";

interface Props {
    reservation: OutflowsQuery_outflows_edges_node;
    onCancelClick: () => void;
    refetch: () => void;
}

const PickupModal: FC<Props> = ({ reservation, onCancelClick, refetch }) => {
    const [quantity, setQuantity] = useState<number>(reservation.quantity!);

    const handleQuantityChange = (value: number | string | undefined) => {
        setQuantity(Number(value));
    };

    const handleSubmit = () => {
        pickedupReservation({
            variables: {
                input: {
                    id: reservation.id,
                    quantity: quantity,
                },
            },
        });
    };

    const handleError = (error: ApolloError) => {
        console.error(error);
    };

    const [pickedupReservation, { loading }] = useMutation<
        PickedupReservationOutflowMutation,
        PickedupReservationOutflowMutationVariables
    >(pickedupReservationOutflow.mutation, {
        onCompleted: () => {
            refetch();
            onCancelClick();
        },
        onError: handleError,
    });

    const material = reservation.material!;
    const headerColumnWidth = 4;

    return (
        <Modal
            isVisible={!!reservation}
            onCancel={onCancelClick}
            title={`Abholung für Reservierung "${material.title}"`}
        >
            <Card>
                <Row>
                    <Col span={headerColumnWidth}>Reservierte Menge:</Col>
                    <Col span={8}>
                        {reservation.pickedUpAt ? (
                            `${reservation.quantity} `
                        ) : (
                            <InputNumber
                                value={quantity}
                                onChange={handleQuantityChange}
                                onPressEnter={handleSubmit}
                                max={
                                    reservation.quantity! +
                                    material.availableQuantity
                                }
                            />
                        )}{" "}
                        <Unit unit={material.quantityUnit} />
                    </Col>
                </Row>
                <Row>
                    <Col span={headerColumnWidth}>Reserviert von:</Col>
                    <Col span={8}>
                        {reservation.reservingOrganization
                            ? reservation.reservingOrganization.name
                            : null}
                    </Col>
                </Row>
                <Row>
                    <Col span={headerColumnWidth} />
                    <Col span={8}>
                        {reservation.pickedUpAt ? (
                            "Abgeholt"
                        ) : (
                            <Button
                                type="primary"
                                onClick={handleSubmit}
                                loading={loading}
                            >
                                Material wurde abgeholt
                            </Button>
                        )}
                    </Col>
                </Row>
            </Card>
        </Modal>
    );
};

export default PickupModal;
