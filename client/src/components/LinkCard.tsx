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
import { Card, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";

interface Props {
    label: string;
    to: string;
    icon?: ReactNode;
}

const LinkCard: FC<Props> = ({ label, to, icon }) => {
    return (
        <Link to={to}>
            <Card hoverable={true}>
                <Row>
                    <Col flex="auto">
                        <Typography.Title
                            level={5}
                            style={{
                                width: "auto",
                                marginBottom: 0,
                            }}
                        >
                            {label}
                        </Typography.Title>
                    </Col>
                    <Col flex="none">{icon}</Col>
                </Row>
            </Card>
        </Link>
    );
};

export default LinkCard;
