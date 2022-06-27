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

import compressImages from "../../../helper/compressImages";
import materialStatus, { MaterialStatus } from "../../../helper/materialStatus";
import validation from "../../../helper/validation";

import { message, Alert } from "antd";

import { useMutation } from "@apollo/react-hooks";
import { MaterialQuery } from "../../../graphql/queries/material";

import {
    updateMediaObject,
    UpdateMediaObject,
    UpdateMediaObjectVariables,
} from "../../../graphql/mutations/updateMediaObject";

import {
    uploadMediaObject,
    UploadMediaObject,
    UploadMediaObjectVariables,
} from "../../../graphql/mutations/uploadMediaObject";

import {
    deleteMediaObject,
    DeleteMediaObject,
    DeleteMediaObjectVariables,
} from "../../../graphql/mutations/deleteMediaObject";

import ImagesUpload, {
    Image,
} from "../../../components/ImagesUpload/ImagesUpload";
import moment, { Moment } from "moment";
import AcceptGuidelines from "../AcceptGuidelines";

type Props = {
    materialResult?: MaterialQuery;
    materialIdParam: string;
    refetch: () => {};
};

const PhotosTab: FC<Props> = (props) => {
    const [loading, setLoading] = useState<boolean>();
    const [lastSaved, setLastSaved] = useState<Moment>();
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    useEffect(() => {
        if (!loading) {
            setLastSaved(moment());
        }
    }, [loading]);

    const [uploadMediaObjectMutation] = useMutation<
        UploadMediaObject,
        UploadMediaObjectVariables
    >(uploadMediaObject.mutation, {
        onCompleted: () => {
            // Maybe later
        },
    });

    const [deleteMediaObjectMutation] = useMutation<
        DeleteMediaObject,
        DeleteMediaObjectVariables
    >(deleteMediaObject.mutation, {
        onCompleted: () => {
            setLoading(false);
            props.refetch();
        },
    });

    const [updateMediaObjectMutation] = useMutation<
        UpdateMediaObject,
        UpdateMediaObjectVariables
    >(updateMediaObject.mutation, {
        onCompleted: () => {
            setLoading(false);
        },
    });

    function handleReorder(images: Image[]) {
        // we display no loading indicator as this might get annoying
        // setLoading(true);
        if (images && images.length >= 0) {
            const updatePromises = images.map((image, index) => {
                if (image) {
                    return updateMediaObjectMutation({
                        variables: {
                            id: image.id,
                            sortIndex: index,
                        },
                    });
                } else {
                    return null;
                }
            });

            Promise.all(updatePromises).then(() => {
                // we display no loading indicator as this might get annoying
                // setLoading(false);
                props.refetch();
            });
        }
    }

    function handleUpload(files: File[], materialIri: string) {
        setLoading(true);
        if (files && files.length >= 0) {
            compressImages(files).then((compressedFiles) => {
                const uploadPromises = Array.from(compressedFiles).map(
                    (compressedFile) => {
                        return uploadMediaObjectMutation({
                            variables: {
                                file: compressedFile,
                                materialId: materialIri,
                            },
                        });
                    }
                );

                Promise.all(uploadPromises).then(() => {
                    setLoading(false);
                    message.info("Bilder erfolgreich gespeichert");
                    props.refetch();
                });
            });
        }
    }

    function handleDelete(id: string) {
        deleteMediaObjectMutation({
            variables: {
                id,
            },
        });
    }

    function renderLoadingInfo() {
        if (loading) {
            return "...Speichern";
        }

        if (loading !== undefined && lastSaved) {
            return `automatisch gespeichert ${lastSaved.fromNow()}`;
        }
    }

    if (props.materialResult?.material) {
        const material = props.materialResult?.material;
        const status = materialStatus(material.isDraft, material.isFinished);
        const isFinished = status === MaterialStatus.Finished;
        const isDraft = material.isDraft;
        const isValid = validation.imagesTabIsValid(
            props.materialResult.material.validationResults
        );

        return (
            <div>
                {!isValid && (
                    <Alert
                        style={{ marginBottom: "16px" }}
                        type="warning"
                        message={
                            <>
                                Es werden Bilder benötigt, um das Material
                                veröffentlichen zu können.
                            </>
                        }
                    />
                )}
                {!isDraft && (
                    <AcceptGuidelines
                        acceptedTerms={acceptedTerms}
                        onChange={setAcceptedTerms}
                    />
                )}
                <ImagesUpload
                    disabled={isFinished || (!isDraft && !acceptedTerms)}
                    loading={loading}
                    onReorderUploaded={handleReorder}
                    onDeleteUploadedFile={handleDelete}
                    onUploadFiles={(files) => handleUpload(files, material.id)}
                    uploadedImages={material.images?.map((image) => {
                        if (image) {
                            return {
                                id: image?.id,
                                thumbnail: image?.previewUrl,
                            };
                        }
                    })}
                />
                {renderLoadingInfo()}
            </div>
        );
    }

    return null;
};

export default PhotosTab;
