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

import React, { FC, useEffect, useState } from "react";
import { Button, Alert, message, Form, DatePicker, Checkbox } from "antd";
import { useMutation } from "@apollo/react-hooks";
import moment, { Moment } from "moment";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import validation from "../../../helper/validation";
import { MaterialQuery } from "../../../graphql/queries/material";
import materialStatus, { MaterialStatus } from "../../../helper/materialStatus";
import serverDateTime from "../../../helper/serverDateTime";
import { routes } from "../../../history";

import {
    updateMaterialMutation,
    UpdateMaterialMutation,
    UpdateMaterialMutationVariables,
} from "../../../graphql/mutations/updateMaterial";

type Props = {
    materialResult?: MaterialQuery;
    materialIdParam: string;
    refetch: () => void;
};

type DateRange = null | (Moment | null)[];

const PickupTab: FC<Props> = (props) => {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [form] = Form.useForm();
    const material = props.materialResult?.material;

    useEffect(() => {
        form.resetFields();
    }, [material, form]);

    const [updateMaterial, { loading }] = useMutation<
        UpdateMaterialMutation,
        UpdateMaterialMutationVariables
    >(updateMaterialMutation.mutation, {
        onCompleted: () => {
            props.refetch();
        },
    });

    const prepareDatesToBeSaved = (
        dates: DateRange
    ): { publishAt: string | null; visibleUntil: string | null } => {
        const publishAt = dates?.[0] ? dates?.[0].format() : null;
        const visibleUntil = dates?.[1] ? dates?.[1].format() : null;
        return {
            publishAt,
            visibleUntil,
        };
    };

    const handleSubmit = (values: { dates: DateRange }) => {
        console.log("HERE");
        const dates = prepareDatesToBeSaved(values.dates);
        updateMaterial({
            variables: {
                input: {
                    id: `/materials/${props.materialIdParam}`,
                    publishAt: dates.publishAt,
                    visibleUntil: dates.visibleUntil,
                    // as we disable the button until the user clicks the checkbox
                    // we can just set it to true here
                    // we only set it if the material is not a draft
                    acceptTermsAndConditions: true,
                },
            },
        }).then(() => {
            message.info("Material gespeichert.");
        });
    };

    const handlePublishNow = () => {
        updateMaterial({
            variables: {
                input: {
                    id: `/materials/${props.materialIdParam}`,
                    isDraft: false,
                    publishAt: serverDateTime.now(),
                    visibleUntil: null,
                    // as we disable the button until the user clicks the checkbox
                    // we can just set it to true here
                    // we only set it if the material is not a draft
                    acceptTermsAndConditions: true,
                },
            },
        }).then(() => {
            props.refetch();
            message.success("Material wurde publiziert");
        });
    };

    if (material) {
        const status = materialStatus(material.isDraft, material.isFinished);
        const isDraft = status === MaterialStatus.Draft;
        const isValid = validation.isValid(material.validationResults);

        return (
            <Form
                form={form}
                initialValues={{
                    dates: [
                        material.publishAt ? moment(material.publishAt) : null,
                        material.visibleUntil
                            ? moment(material.visibleUntil)
                            : null,
                    ],
                    termsAccepted: false,
                }}
                layout="vertical"
                onFinish={handleSubmit}
                size="large"
            >
                {!isValid && (
                    <Alert
                        style={{ marginBottom: "16px" }}
                        type="warning"
                        message={
                            <>
                                Es fehlen Informationen, um das Material zu
                                publizieren. Bitte prüfe die anderen Tabs!
                            </>
                        }
                    />
                )}
                <Checkbox
                    disabled={!isValid}
                    checked={acceptedTerms}
                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                >
                    Ich habe die{" "}
                    <Link to={routes.materialGuidelines} target="_blank">
                        besonderen Nutzungsbedingungen für die Einstellung von
                        Materialien/Zündstoffen
                    </Link>{" "}
                    gelesen und stimme ihnen zu.
                </Checkbox>
                <br />
                <br />
                {isDraft && (
                    <>
                        <Button
                            size="large"
                            type="primary"
                            loading={loading}
                            disabled={!isValid || !acceptedTerms}
                            onClick={handlePublishNow}
                        >
                            <FormattedMessage id="editMaterial.tab.activate.activateNow" />
                        </Button>{" "}
                        (
                        <FormattedMessage id="editMaterial.tab.activate.immediatelyVisible" />
                        )
                        <br />
                        <br />
                        <h3>
                            <FormattedMessage id="visibility" />
                        </h3>
                    </>
                )}

                <Form.Item name="dates">
                    <DatePicker.RangePicker
                        format="DD-MM-yyyy"
                        allowClear={true}
                        //TODO: validation
                        allowEmpty={[false, true]}
                        onChange={(value) => console.log(value)}
                    />
                </Form.Item>
                <Button
                    size="large"
                    htmlType="submit"
                    loading={loading}
                    disabled={!isValid || !acceptedTerms}
                >
                    {isDraft ? (
                        <FormattedMessage id="editMaterial.tab.activate.activateLater" />
                    ) : (
                        "Sichtbarkeit Aktualisieren"
                    )}
                </Button>
            </Form>
        );
    }
    return null;
};

export default PickupTab;
