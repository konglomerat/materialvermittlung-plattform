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

import React, { FC } from "react";
import { Popconfirm } from "antd";
import { red } from "@ant-design/colors";
import { WarningOutlined } from "@ant-design/icons";

type Props = {
    text: string;
    okText: string;
    danger?: boolean;
    children: React.ReactNode;
    onConfirm: () => void;
};

const ExistingReservationPopconfirm: FC<Props> = ({
    text,
    okText,
    danger,
    children,
    onConfirm,
}) => {
    return (
        <Popconfirm
            icon={<WarningOutlined style={{ color: red[6] }} />}
            title={
                <div
                    style={{
                        maxWidth: "400px",
                        fontSize: "12px",
                    }}
                >
                    <strong
                        style={{
                            color: red[6],
                            fontSize: "14px",
                            marginBottom: "18px",
                        }}
                    >
                        Achtung
                    </strong>
                    <br />
                    {text}
                </div>
            }
            onConfirm={onConfirm}
            okText={okText}
            okButtonProps={{ danger }}
            cancelText="Abbrechen"
            overlayStyle={{
                // bug in ant.d: z-index of <Popconfirm/> is below that of <Modal/>
                zIndex: 11030,
            }}
        >
            {children}
        </Popconfirm>
    );
};

export default ExistingReservationPopconfirm;
