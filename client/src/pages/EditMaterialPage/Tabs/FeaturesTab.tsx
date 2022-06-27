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
import { Button, Form, Input, Alert, message, Select, Checkbox } from "antd";
import { useMutation } from "@apollo/react-hooks";
import { SwapOutlined } from "@ant-design/icons";
import { MaterialQuery } from "../../../graphql/queries/material";
import {
    updateMaterialMutation,
    UpdateMaterialMutation,
    UpdateMaterialMutationVariables,
} from "../../../graphql/mutations/updateMaterial";

import Label from "../../../components/Label/Label";
import materialStatus, { MaterialStatus } from "../../../helper/materialStatus";
import validation from "../../../helper/validation";
import MaterialFlowModal from "../../MaterialFlowModal/MaterialFlowModal";
import SubmitButton from "../SubmitButton";
import { dropdowns, defaults } from "../../../clientConfig";

import {
    updateInflowMutation,
    UpdateInflowMutation,
    UpdateInflowMutationVariables,
} from "../../../graphql/mutations/updateInflow";

type Props = {
    materialResult?: MaterialQuery;
    materialIdParam: string;
    refetch: () => void;
};

const FeaturesTab: FC<Props> = (props) => {
    const [saving, setSaving] = useState(false);
    const [materialFlowModalVisible, setMaterialFlowModalVisible] = useState(
        false
    );

    const [updateMaterial] = useMutation<
        UpdateMaterialMutation,
        UpdateMaterialMutationVariables
    >(updateMaterialMutation.mutation, {
        onCompleted: () => {
            window.setTimeout(() => {
                // we add a delay here to show that
                // the user can see the feedback.
                // even if the response was fast
                setSaving(false);
                message.info("Material gespeichert");
            }, 800);
            props.refetch();
        },
    });

    const [updateInflow] = useMutation<
        UpdateInflowMutation,
        UpdateInflowMutationVariables
    >(updateInflowMutation.mutation, {});

    // By using the form, we loose type information
    function handleSubmit(values: {
        id: string;
        quantity: string;
        comment: string;
        title: string;
        description: string;
        quantityUnit: string;
        color: string;
        dimensions: string;
        disallowPartialReservations: boolean;
    }) {
        setSaving(true);
        const material = props.materialResult?.material;

        if (values.quantity && values.quantity !== "") {
            const inflows = material?.inflows?.edges;
            const initialInflowId = inflows?.[0]?.node?.id;
            updateInflow({
                variables: {
                    input: {
                        id: initialInflowId!,
                        quantity: Number(values.quantity),
                        comment: values.comment,
                    },
                },
            });
        }

        updateMaterial({
            variables: {
                input: {
                    id: `/materials/${props.materialIdParam}`,
                    title: values.title || "",
                    description: values.description || "",
                    quantityUnit: values.quantityUnit || "",
                    color: values.color || "",
                    dimensions: values.dimensions || "",
                    disallowPartialReservations:
                        values.disallowPartialReservations,
                    // as we disable the button until the user clicks the checkbox
                    // we can just set it to true here
                    // we only set it if the material is not a draft
                    acceptTermsAndConditions: material?.isDraft
                        ? undefined
                        : true,
                },
            },
        });
    }

    const handleMaterialFlowCancelClick = () => {
        setMaterialFlowModalVisible(false);
    };

    const handleMaterialFlowClick = () => {
        setMaterialFlowModalVisible(true);
    };

    if (props.materialResult?.material) {
        const material = props.materialResult.material;
        const status = materialStatus(material.isDraft, material.isFinished);
        const isDraft = status === MaterialStatus.Draft;
        const disabled = !isDraft;
        const isValid = validation.featureTabIsValid(
            props.materialResult.material.validationResults
        );

        const validationResult = validation.typedValidationResult(
            props.materialResult.material.validationResults
        );

        const initialValues = {
            title: material.title,
            quantity:
                material.inflowQuantity > 0
                    ? material.inflows?.edges?.[0]?.node?.quantity
                    : null,
            comment:
                material.inflowQuantity > 0
                    ? material.inflows?.edges?.[0]?.node?.comment
                    : null,
            quantityUnit: material.quantityUnit || defaults.materialUnit,
            color: material.color,
            description: material.description,
            dimensions: material.dimensions,
            disallowPartialReservations: material.disallowPartialReservations,
        };

        return (
            <>
                {!isValid && (
                    <Alert
                        style={{ marginBottom: "16px" }}
                        type="warning"
                        message={
                            <>
                                Es werden weitere Angaben benötigt, um das
                                Material veröffentlichen zu können.
                            </>
                        }
                    />
                )}

                <Form
                    initialValues={initialValues}
                    layout="vertical"
                    onFinish={handleSubmit}
                    size="large"
                >
                    <Form.Item
                        name="title"
                        label={<Label>Gib deinem Material einen Titel:</Label>}
                        rules={[
                            {
                                required: true,
                                message: "Titel wird benötigt",
                            },
                        ]}
                    >
                        <Input
                            type="text"
                            placeholder="z.B. Bunte Duschvorhänge"
                        />
                    </Form.Item>
                    <Form.Item
                        label={
                            <Label
                                isDraft={isDraft}
                                isValidToBePublished={
                                    validationResult?.quantity
                                }
                            >
                                Wieviel hast du?
                            </Label>
                        }
                        required={!isDraft}
                        style={{ marginBottom: 0 }}
                    >
                        {isDraft && (
                            <Alert
                                style={{ marginBottom: "16px" }}
                                type="info"
                                message={
                                    <>
                                        Hinweis: Nachdem du das Material
                                        veröffentlicht hast, kannst du hier
                                        Material Zu- und Abgänge einzeln
                                        erfassen.
                                    </>
                                }
                            />
                        )}
                        <Form.Item
                            name="quantity"
                            rules={[
                                {
                                    required: !isDraft,
                                    message: "Menge wird benötigt",
                                },
                            ]}
                            style={{ display: "inline-block" }}
                        >
                            <Input
                                type="number"
                                placeholder="Menge"
                                disabled={disabled}
                            />
                        </Form.Item>
                        <Form.Item
                            name="quantityUnit"
                            rules={[
                                {
                                    required: !isDraft,
                                    message: "Einheit wird benötigt",
                                },
                            ]}
                            style={{
                                display: "inline-block",
                                width: "100px",
                                margin: "0 8px",
                            }}
                        >
                            <Select
                                clearIcon={true}
                                placeholder="Bitte auswählen"
                                disabled={disabled}
                            >
                                {dropdowns.materialUnits.map((option) => {
                                    return (
                                        <Select.Option
                                            value={option.value}
                                            key={option.value}
                                        >
                                            {option.label}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                        {material.isDraft ? null : (
                            <Button
                                type="link"
                                icon={<SwapOutlined />}
                                onClick={handleMaterialFlowClick}
                            >
                                Zu- oder Abgang registrieren
                            </Button>
                        )}
                        {materialFlowModalVisible ? (
                            <MaterialFlowModal
                                materialId={material.id}
                                onFlowModalCancelClick={
                                    handleMaterialFlowCancelClick
                                }
                                defaultTab="outflow"
                            />
                        ) : null}
                    </Form.Item>
                    {isDraft && (
                        <Form.Item
                            label={
                                <Label
                                    isDraft={isDraft}
                                    isValidToBePublished={
                                        validationResult?.firstInflowComment
                                    }
                                >
                                    Woher stammt das Material (nicht öffentlich
                                    sichtbar)
                                </Label>
                            }
                            name="comment"
                        >
                            <Select
                                clearIcon={true}
                                placeholder="Bitte auswählen"
                                style={{ maxWidth: "300px" }}
                            >
                                {dropdowns.inflowComments.map((option) => {
                                    return (
                                        <Select.Option
                                            value={option.value}
                                            key={option.value}
                                        >
                                            {option.label}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    )}
                    <Form.Item
                        name="disallowPartialReservations"
                        valuePropName="checked"
                        style={{ maxWidth: "300px" }}
                    >
                        <Checkbox>
                            Material kann nicht aufgeteilt werden (nur eine
                            Reservierung möglich)
                        </Checkbox>
                    </Form.Item>
                    <Form.Item
                        label={
                            <Label
                                isDraft={isDraft}
                                isValidToBePublished={
                                    validationResult?.dimensions
                                }
                            >
                                Format/Abmaße:
                            </Label>
                        }
                        name="dimensions"
                        rules={[
                            {
                                required: !isDraft,
                                message: "Format/Abmaße werden benötigt",
                            },
                        ]}
                        style={{ maxWidth: "300px" }}
                    >
                        <Input
                            type="text"
                            placeholder="z.B. A4, 1m x 1,5m, ..."
                        />
                    </Form.Item>
                    <Form.Item
                        name="color"
                        label={<Label>Welche Farbe hat dein Material?</Label>}
                    >
                        <Input type="text" placeholder="Farbe" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label={
                            <Label
                                isDraft={isDraft}
                                isValidToBePublished={
                                    validationResult?.description
                                }
                            >
                                Um was handelt es sich? Beschreibe kurz, was du
                                anbietest. Schreib auch gern etwas zum Zustand
                                deines Materials.
                            </Label>
                        }
                        rules={[
                            {
                                required: !isDraft,
                                message: "Beschreibung wird benötigt",
                            },
                        ]}
                    >
                        <Input.TextArea placeholder="z.B. Duschvorhänge, z. T. noch verpackt. Unterschiedliche Muster und Farben." />
                    </Form.Item>
                    <SubmitButton
                        isDraft={!!material.isDraft}
                        isSaving={saving}
                    >
                        Speichern
                    </SubmitButton>
                </Form>
            </>
        );
    } else {
        return null;
    }
};

export default FeaturesTab;
