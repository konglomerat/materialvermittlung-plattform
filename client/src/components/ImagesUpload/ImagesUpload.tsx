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

import React, { FC, useEffect, useState, useRef } from "react";
import { PlusOutlined } from "@ant-design/icons";
import Preview from "./ImagesUpload.Preview";
import Tile from "./ImagesUpload.Tile";
import { Spin } from "antd";
import classnames from "classnames";
import produce from "immer";

const DEFAULT_UPLOAD_LIMIT = 4;

type Props = {
    loading?: boolean;
    uploadedImages?: Image[];
    maxImages?: number;
    minImages?: number;
    disabled?: boolean;
    // will remove uploads after onUploadFiles was called
    onUploadFiles?: (files: File[]) => void;
    // will collect uploads outside
    onUploadChange?: (files: File[]) => void;
    // Remove
    onDeleteUploadedFile?: (id: string) => void;
    onReorderUploaded?: (images: Image[]) => void;
};

export type Image =
    | {
          id: string;
          thumbnail?: string | null;
      }
    | null
    | undefined;

const ImagesUpload: FC<Props> = ({
    maxImages,
    uploadedImages,
    disabled,
    loading,
    onUploadFiles,
    onUploadChange,
    onDeleteUploadedFile,
    onReorderUploaded,
}) => {
    const limit = maxImages ? maxImages : DEFAULT_UPLOAD_LIMIT;
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploads, setUploads] = useState<File[]>();
    const remainingUploads =
        limit -
        (uploads?.length ? uploads?.length : 0) -
        (uploadedImages?.length ? uploadedImages?.length : 0);

    useEffect(() => {
        if (onUploadFiles && uploads?.length) {
            onUploadFiles(uploads);
            setUploads([]);
        }
        if (onUploadChange && uploads?.length) {
            onUploadChange(uploads);
        }
    }, [uploads, onUploadChange, onUploadFiles]);

    function limitNumberOfUploads(files: File[]): File[] {
        if (files.length <= remainingUploads) return files;
        if (remainingUploads) {
            return files.slice(0, remainingUploads);
        }
        return [];
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const fileList = event.currentTarget.files;
        if (fileList) {
            const limited = limitNumberOfUploads(Array.from(fileList));
            if (uploads) {
                setUploads([...uploads, ...limited]);
            } else {
                setUploads(limited);
            }
        }
    }

    function handleDeleteUploaded(id: string) {
        if (onDeleteUploadedFile) {
            onDeleteUploadedFile(id);
        }
    }

    function handleDeleteUpload(name: string) {
        setUploads(
            uploads?.filter((item) => {
                return item.name !== name;
            })
        );
    }

    function handleReorderUploads(index: number, direction: number) {
        const indexToSwitchWith = index + direction;
        if (
            uploads?.length &&
            indexToSwitchWith >= 0 &&
            indexToSwitchWith <= uploads.length - 1
        ) {
            const nextUploads = produce(uploads, (draftUploads) => {
                var uploadToBeSwitchedWith = draftUploads[indexToSwitchWith];
                draftUploads[indexToSwitchWith] = draftUploads[index];
                draftUploads[index] = uploadToBeSwitchedWith;
            });
            setUploads(nextUploads);
        }
    }

    function handleReorderUploaded(index: number, direction: number) {
        const indexToSwitchWith = index + direction;
        if (
            onReorderUploaded &&
            uploadedImages?.length &&
            indexToSwitchWith >= 0 &&
            indexToSwitchWith <= uploadedImages.length - 1
        ) {
            const nextImages = produce(uploadedImages, (draftImages) => {
                var imageToBeSwitchedWith = draftImages[indexToSwitchWith];
                draftImages[indexToSwitchWith] = draftImages[index];
                draftImages[index] = imageToBeSwitchedWith;
            });
            onReorderUploaded(nextImages);
        }
    }

    function renderImages() {
        return uploadedImages?.map((image, index) => {
            if (image) {
                return (
                    <Preview
                        disabled={disabled}
                        key={image.id}
                        id={image.id}
                        index={index}
                        length={uploadedImages?.length || 0}
                        thumbnail={image.thumbnail}
                        onDelete={handleDeleteUploaded}
                        onReorder={handleReorderUploaded}
                    />
                );
            }
        });
    }

    function renderUploads() {
        if (onUploadFiles) return null;
        return uploads?.map((image, index) => {
            return (
                <Preview
                    key={image.name}
                    file={image}
                    id={image.name}
                    index={index}
                    length={uploads.length}
                    onReorder={handleReorderUploads}
                    onDelete={handleDeleteUpload}
                />
            );
        });
    }

    function renderButton() {
        if (disabled) return null;

        if (loading) {
            return (
                <Tile>
                    <Spin />
                </Tile>
            );
        }

        return (
            <Tile
                className={classnames("images-upload__button", {
                    "images-upload__button--disabled": remainingUploads <= 0,
                })}
                onClick={() => {
                    if (inputRef.current && remainingUploads > 0) {
                        inputRef.current.click();
                    }
                }}
            >
                <PlusOutlined style={{ fontSize: "30px" }} />
                <br />
                <small className="images-upload__hint">
                    Bilder hinzufügen
                    <br />
                    (max {limit})
                </small>
            </Tile>
        );
    }

    return (
        <div className="images-upload">
            <div className="images-upload__list">
                {renderImages()}
                {renderUploads()}
                {renderButton()}
            </div>
            <input
                style={{ height: "0px", visibility: "hidden" }}
                ref={inputRef}
                type="file"
                onChange={handleChange}
                multiple
                accept=".png,.jpg,.jpeg"
            />
        </div>
    );
};

export default ImagesUpload;
