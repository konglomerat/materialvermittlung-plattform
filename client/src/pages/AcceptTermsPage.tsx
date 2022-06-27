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
import { Link, useLocation } from "react-router-dom";
import { Button, Checkbox, Col, Form } from "antd";
import axios from "axios";

import Content from "../components/Layouts/Content";
import { routes } from "../history";
import Row from "../components/Layouts/Row";

const AcceptTermsPage: FC = () => {
    const [loading, setLoading] = useState(false);

    const location = useLocation();

    const handleSubmit = () => {
        setLoading(true);
        axios
            .post("/api/user_accept_terms")
            .then(() => {
                const urlParameters = new URLSearchParams(location.search);
                const redirect = urlParameters.get("redirect");
                if (redirect) {
                    // we don't use window.push() here; this way, the page is reloaded and thus we get the new userInfo
                    window.location.href = redirect.toString();
                } else {
                    window.location.href = routes.index;
                }
            })
            .catch(() => {
                setLoading(false);
            });
    };

    return (
        <Content title={`Nutzungsbedingungen akzeptieren`}>
            <Form
                layout="vertical"
                name="activate"
                onFinish={handleSubmit}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 12 }}
            >
                <Form.Item
                    name="hasAcceptedTerms"
                    valuePropName="checked"
                    rules={[
                        {
                            validator: (_, value) =>
                                value
                                    ? Promise.resolve()
                                    : Promise.reject(
                                          "Bitte die Nutzungsbedingungen und die Datenschutzbestimmungen akzeptieren."
                                      ),
                        },
                    ]}
                >
                    <Checkbox>
                        Ich habe{" "}
                        <Link to={routes.terms} target="_blank">
                            die Nutzungsbedingungen
                        </Link>{" "}
                        und{" "}
                        <Link to={routes.dataProtection} target="_blank">
                            die Datenschutzbestimmungen
                        </Link>{" "}
                        gelesen und akzeptiere diese.
                    </Checkbox>
                </Form.Item>
                <Form.Item noStyle>
                    <Row>
                        <Col span={4}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                            >
                                Zur Materialvermittlung
                            </Button>
                        </Col>
                    </Row>
                </Form.Item>
            </Form>
        </Content>
    );
};

export default AcceptTermsPage;
