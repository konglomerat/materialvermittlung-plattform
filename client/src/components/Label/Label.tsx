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
import { WarningOutlined } from "@ant-design/icons";

type Props = {
    isDraft?: boolean;
    isValidToBePublished?: boolean;
    children: any;
};

const Label: FC<Props> = (props) => {
    return (
        <span>
            {props.isValidToBePublished === false && props.isDraft ? (
                <WarningOutlined
                    style={{ marginRight: "4px", color: "orange" }}
                />
            ) : null}
            <span
                style={{
                    borderBottom:
                        props.isValidToBePublished === false
                            ? "2px dashed orange"
                            : "2px solid transparent",
                }}
            >
                {props.children}
            </span>
        </span>
    );
};

export default Label;
