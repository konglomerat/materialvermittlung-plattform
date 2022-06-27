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

import React, { FC, ReactNode, useEffect } from "react";
import { Card } from "antd";
import { CloseOutlined } from "@ant-design/icons";

interface Props {
    size?: "small";
    center?: boolean;
    children: any;
    title?: string | null;
    onCancel: () => void;
    footer?: ReactNode;
    isVisible?: boolean;
}

const Modal: FC<Props> = (props) => {
    useEffect(() => {
        // Prevent scrolling on mount
        document.body.style.overflow = "hidden";
        // Re-enable scrolling when component unmounts
        return function cleanup() {
            document.body.style.overflow = "auto";
        };
    }, []); // Empty array ensures effect is only run on mount and unmount

    function renderTitle() {
        return (
            <Card>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <h1 style={{ marginBottom: 0, width: "100%" }}>
                        {props.title}
                    </h1>
                    <CloseOutlined onClick={props.onCancel} />
                </div>
            </Card>
        );
    }

    function renderInner() {
        return (
            <div
                className="modal__container"
                style={{
                    maxWidth: props.size === "small" ? "450px" : "800px",
                }}
            >
                {renderTitle()}
                <div className="modal__content">{props.children}</div>
                {renderFooter()}
            </div>
        );
    }

    function renderFooter() {
        if (props.footer) {
            return <Card>{props.footer}</Card>;
        }
    }

    if (props.isVisible) {
        return (
            <div className="modal">
                <div className="modal__backdrop" onClick={props.onCancel}></div>
                {renderInner()}
            </div>
        );
    } else {
        return null;
    }
};

export default Modal;
