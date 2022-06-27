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
import { Alert, Button, Col, Form, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Store } from "antd/lib/form/interface";
import axios from "axios";
import { RouteComponentProps } from "react-router-dom";

import Row from "../components/Layouts/Row";
import Content from "../components/Layouts/Content";

const ForgotPasswordPage: FC<RouteComponentProps> = ({ match }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [resetMailSent, setResetMailSent] = useState<boolean>(false);
    const [attemptFailed, setAttemptFailed] = useState<boolean>(false);

    const attemptRequestReset = (formValues: Store) => {
        setLoading(true);
        const { email } = formValues;

        axios
            .post("/api/reset-password", `email=${email}`)
            .then((response) => {
                setResetMailSent(true);
            })
            .catch((response) => {
                setAttemptFailed(true);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (resetMailSent) {
        return (
            <Content title="E-Mail gesendet">
                <Row>
                    <Col span={24}>
                        <p>
                            Wir haben dir eine E-Mail zum Zurücksetzen deines
                            Passworts gesendet. Prüfe gegebenenfalls deine
                            Spamordner.
                        </p>
                    </Col>
                </Row>
            </Content>
        );
    }

    return (
        <Content title="Passwort zurücksetzen">
            <Form
                name="request-reset"
                onFinish={attemptRequestReset}
                onValuesChange={() => setAttemptFailed(false)}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 12 }}
            >
                <Form.Item
                    name="email"
                    label="E-Mail"
                    rules={[
                        {
                            required: true,
                            message: "Bitte die E-Mail eingeben.",
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined />} placeholder="E-Mail" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Zurücksetzen
                    </Button>
                </Form.Item>
                {attemptFailed ? (
                    <Row>
                        <Col span={24}>
                            <Alert
                                message="Unbekannte E-Mail."
                                type="error"
                                className="alert"
                            />
                        </Col>
                    </Row>
                ) : null}
            </Form>
        </Content>
    );
};

export default ForgotPasswordPage;
