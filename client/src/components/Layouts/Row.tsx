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

import React, { FC, ReactNode } from "react";
import { Row as AntRow } from "antd";
import { RowProps } from "antd/es/row";

interface Props {
    children: ReactNode;
}

const gutter = { xs: 8, sm: 16, md: 24, lg: 32 };

const Row: FC<Props & RowProps> = ({ children, ...props }) => (
    <AntRow gutter={[gutter, gutter]} {...props}>
        {children}
    </AntRow>
);

export default Row;
