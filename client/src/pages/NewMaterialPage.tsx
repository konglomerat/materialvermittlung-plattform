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
import { ApolloError, useMutation } from "@apollo/react-hooks";
import { Form, Input, Button, Alert, message } from "antd";
import history, { routes } from "../history";

import compressImages from "../helper/compressImages";

import {
    createMaterialMutation,
    CreateMaterialMutation,
    CreateMaterialMutationVariables,
} from "../graphql/mutations/createMaterial";

import {
    uploadMediaObject,
    UploadMediaObject,
    UploadMediaObjectVariables,
} from "../graphql/mutations/uploadMediaObject";

import ImagesUpload from "../components/ImagesUpload/ImagesUpload";
import { defaults } from "../clientConfig";
import Content from "../components/Layouts/Content";

const NewMaterialPage: FC = () => {
    const [loading, setLoading] = useState(false);
    const [hasApolloError, setHasApolloError] = useState(false);

    const [uploads, setUploads] = useState<File[]>();

    // Mutations

    const [createMaterial] = useMutation<
        CreateMaterialMutation,
        CreateMaterialMutationVariables
    >(createMaterialMutation.mutation, {
        onCompleted: ({ createMaterial }) => {
            if (createMaterial?.material) {
                handleCreateMaterialCompleted(createMaterial.material._id);
            }
        },
        onError: handleError,
    });

    const [uploadMediaObjectMutation] = useMutation<
        UploadMediaObject,
        UploadMediaObjectVariables
    >(uploadMediaObject.mutation, {
        onCompleted: () => {
            // Maybe later
        },
        onError: handleError,
    });

    function handleError(error: ApolloError) {
        setHasApolloError(true);
        console.error(error.message);
    }

    function handleFinishAllMutations(materialId: number) {
        message.info("Neues Material als Entwurf gespeichert");
        history.push(routes.editMaterial(materialId));
    }

    function handleSubmit({ title }: any) {
        setLoading(true);
        createMaterial({
            variables: {
                input: {
                    title,
                    // we set a default here so the user has less
                    // potential fields to fill in later
                    quantityUnit: defaults.materialUnit,
                },
            },
        });
    }

    function handleCreateMaterialCompleted(materialId: number) {
        if (uploads && uploads.length >= 0) {
            compressImages(uploads).then((compressedUploads) => {
                const uploadPromises = Array.from(compressedUploads).map(
                    (file, index) => {
                        return uploadMediaObjectMutation({
                            variables: {
                                file,
                                materialId: "materials/" + materialId,
                                sortIndex: index,
                            },
                        });
                    }
                );

                Promise.all(uploadPromises).then(() =>
                    handleFinishAllMutations(materialId)
                );
            });
        } else {
            handleFinishAllMutations(materialId);
        }
    }

    return (
        <Content title="Neues Material als Entwurf anlegen" titleLevel={3}>
            <Form onFinish={handleSubmit} layout="vertical">
                Bitte Bilder auswählen:
                <br />
                <div style={{ marginBottom: "20px" }}>
                    <ImagesUpload
                        onUploadChange={(files) => setUploads(files)}
                        loading={loading}
                    />
                </div>
                <Form.Item
                    name="title"
                    label="Gib deinem Material einen Titel:"
                    rules={[
                        {
                            required: true,
                            message: "Bitte gib einen Titel ein.",
                        },
                    ]}
                >
                    <Input
                        type="text"
                        placeholder="z.B. Coole Kupferspulen"
                        size="large"
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={loading}
                    >
                        {loading ? "Entwurf wird angelegt" : "Entwurf anlegen"}
                    </Button>
                </Form.Item>
            </Form>
            {hasApolloError && (
                <Alert
                    message="Leider konnte das Material nicht angelegt werden"
                    type="error"
                />
            )}
        </Content>
    );
};

export default NewMaterialPage;
