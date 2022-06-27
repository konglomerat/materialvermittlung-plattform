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
import { Form, Select, Alert, message } from "antd";
import { useMutation } from "@apollo/react-hooks";
import validation from "../../../helper/validation";
import { MaterialQuery } from "../../../graphql/queries/material";
import materialStatus, { MaterialStatus } from "../../../helper/materialStatus";
import SubmitButton from "../SubmitButton";

import {
    updateMaterialMutation,
    UpdateMaterialMutation,
    UpdateMaterialMutationVariables,
} from "../../../graphql/mutations/updateMaterial";

const NO_STORAGE_OPTION = "EMPTY";

type Props = {
    materialResult?: MaterialQuery;
    materialIdParam: string;
    refetch: () => void;
};

const PickupTab: FC<Props> = (props) => {
    const [saving, setSaving] = useState(false);

    const [updateMaterial] = useMutation<
        UpdateMaterialMutation,
        UpdateMaterialMutationVariables
    >(updateMaterialMutation.mutation, {
        onCompleted: () => {
            setSaving(false);
            message.info("Material gespeichert");
            props.refetch();
        },
    });

    function handleSubmit(values: { [key: string]: string }) {
        const material = props.materialResult?.material;

        updateMaterial({
            variables: {
                input: {
                    id: `/materials/${props.materialIdParam}`,
                    storage:
                        values.storage === NO_STORAGE_OPTION
                            ? null
                            : values.storage,
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

    function renderAlert() {
        if (props.materialResult?.material) {
            if (
                !validation.pickupTabIsValid(
                    props.materialResult.material.validationResults
                )
            ) {
                return (
                    <Alert
                        style={{ marginBottom: "16px" }}
                        type="warning"
                        message={
                            <>
                                Das Material kann nur mit einem ausgewähltem
                                Lager publiziert werden!
                            </>
                        }
                    />
                );
            }
        }
    }

    if (props.materialResult?.material) {
        const material = props.materialResult.material;
        const storages = material.organization?.storages;

        const status = materialStatus(material.isDraft, material.isFinished);

        const requiredIfNotDraft = status !== MaterialStatus.Draft;
        const isFinished = status === MaterialStatus.Finished;

        const initialValues = {
            storage: material.storage?.id || null,
        };

        return (
            <>
                {renderAlert()}
                <Form
                    onFinish={handleSubmit}
                    initialValues={initialValues}
                    layout="vertical"
                >
                    <Form.Item
                        rules={[{ required: requiredIfNotDraft }]}
                        name="storage"
                        label="Wo lagert dein Material?"
                    >
                        <Select
                            allowClear={!requiredIfNotDraft}
                            placeholder="Bitte wähle ein Lager aus."
                            value={material.id}
                            disabled={isFinished}
                        >
                            {storages?.map((storage) => {
                                if (storage) {
                                    return (
                                        <Select.Option
                                            value={storage.id}
                                            key={storage.id}
                                        >
                                            {`${storage.title} ${
                                                storage.isPublic
                                                    ? "(öffentlich)"
                                                    : ""
                                            }`}
                                        </Select.Option>
                                    );
                                }
                            })}
                        </Select>
                    </Form.Item>
                    <SubmitButton
                        isSaving={saving}
                        isDraft={!!material.isDraft}
                    >
                        Speichern
                    </SubmitButton>
                </Form>
            </>
        );
    }
    return null;
};

export default PickupTab;
