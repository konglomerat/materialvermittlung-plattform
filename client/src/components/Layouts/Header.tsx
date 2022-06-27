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
import { Link } from "react-router-dom";
import { Row, Col, Layout, Button, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import user from "../../userInfo";

import Menu from "../../components/Menu/Menu";
import Logo from "../Logo/Logo";
import { routes } from "../../history";
import { searchInputPlacementId } from "../Search/SearchInput";

type Props = {};

const Header: FC<Props> = () => (
    <Layout.Header style={{ zIndex: 1000 }}>
        <Row justify="space-between" align="middle" className="row">
            <Col xs={0} md={4} className="col">
                <Link to={routes.index}>
                    <Logo logoType="logo" />
                </Link>
            </Col>
            <Col xs={4} md={0} className="col">
                <Link to={routes.index}>
                    <Logo logoType="avatar" />
                </Link>
            </Col>
            <Col xs={15} md={10}>
                <Row id={searchInputPlacementId} />
            </Col>
            <Col
                span={4}
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                    }}
                >
                    {user && !user.isAdmin ? (
                        <Tooltip title="Neues Material">
                            <Button
                                type="primary"
                                href={routes.newMaterial}
                                style={{ marginRight: "10px" }}
                                icon={<PlusOutlined />}
                            />
                        </Tooltip>
                    ) : null}
                    <Menu />
                </div>
            </Col>
        </Row>
    </Layout.Header>
);

export default Header;
