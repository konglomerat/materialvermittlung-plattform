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
import { Store } from "antd/lib/form/interface";
import { Alert, Button, Col, Form, Input, Row, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { login } from "../../helper/login";
import user from "../../userInfo";
import logout from "../../helper/logout";

const devLogins = [
    {
        username: "mat.private.user@example.org",
        text: "Materialvermittlung [Private]",
    },
    {
        username: "mat.private.admin@example.org",
        text: "Materialvermittlung [Private]",
    },
    {
        username: "mat.user@example.org",
        text: "Materialvermittlung [Public]",
    },
    {
        username: "konglo.user@example.org",
        text: "Konglomerat [Public]",
    },
    { username: "mat.terms@example.org", text: "Has Not Accepted Terms" },
    {
        username: "konglo.admin@example.org",
        text: "Konglomerat [Public]",
    },
    {
        username: "admin@example.org",
        text: "Super Admin",
    },
];

const LoginForm: FC = () => {
    const history = useHistory();
    const [loginLoading, setLoginLoading] = useState<boolean>(false);
    const [loginAttemptFailed, setLoginAttemptFailed] = useState<boolean>(
        false
    );

    function attemptLogin(formValues: Store) {
        setLoginLoading(true);
        const { email, password } = formValues;
        login(email, password, () => {
            setLoginLoading(false);
            setLoginAttemptFailed(true);
        });
    }

    function renderLoggedIn() {
        return (
            <>
                <Alert
                    message={`Du bist angemeldet als ${user?.username}`}
                    description="Viel Spaß beim Stöbern :)"
                    type="success"
                    showIcon
                />
                <Button
                    style={{ float: "right", marginTop: "10px" }}
                    type="primary"
                    onClick={() => logout()}
                >
                    <FormattedMessage id="logout" />
                </Button>
            </>
        );
    }

    function renderDev() {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
            // dev code
            return (
                <div>
                    <Typography.Title level={5}>
                        DEV: Testusers
                    </Typography.Title>

                    {devLogins.map((item) => {
                        return (
                            <div
                                key={item.username.replace(/[^A-Z0-9]+/gi, "_")}
                            >
                                <Typography.Link
                                    onClick={() =>
                                        login(item.username, "password")
                                    }
                                >
                                    {`${item.username} - ${item.text}`}
                                </Typography.Link>
                                <br />
                            </div>
                        );
                    })}
                    <br />
                </div>
            );
        } else {
            // production code
            return null;
        }
    }

    function renderLogin() {
        return (
            <>
                <Typography.Title level={5}>
                    <FormattedMessage id={"loginForOrganizations"} />
                </Typography.Title>
                {loginAttemptFailed ? (
                    <Alert
                        style={{ marginBottom: "20px" }}
                        message="Anmeldung fehlgeschlagen! Bitte prüfe deinen Nutzernamen und Passwort"
                        type="error"
                    />
                ) : null}

                <Form
                    name="login"
                    onFinish={attemptLogin}
                    layout="vertical"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 12 }}
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                type: "email",
                                message: "Bitte eine E-Mail eingeben.",
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="E-Mail" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Bitte das Passwort nicht vergessen.",
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Passwort"
                        />
                    </Form.Item>

                    <Row>
                        <Col flex="none">
                            <Form.Item noStyle>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loginLoading}
                                >
                                    <FormattedMessage id="login" />
                                </Button>
                            </Form.Item>
                            <Form.Item noStyle>
                                <a
                                    style={{ margin: "10px" }}
                                    href="mailto:materialvermittlung@konglomerat.org?
                                        &subject=Registrierungsanfrage Zündstoffe Materialvermittlung
                                        &body=Hallo Materialvermittlung,%0A
                                            %0A
                                            ich möchte meine Organisation auf der Zündstoffe Materialvermittlungsplattform registrieren.%0A
                                            %0A
                                            Hinweis: Die Anmeldung für Privatpersonen ist nicht möglich.%0A
                                            %0A
                                            Meine Organisation: %0A
                                            Meine Kontaktdaten: %0A
                                            %0A
                                            Viele Grüße"
                                >
                                    <FormattedMessage id="signUp" />
                                </a>
                            </Form.Item>
                        </Col>
                        <Col flex="auto" style={{ textAlign: "right" }}>
                            <Button
                                type="link"
                                onClick={() =>
                                    history.push("/account/passwort-vergessen")
                                }
                            >
                                <FormattedMessage id="forgotPassword" />
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </>
        );
    }

    return (
        <div>
            {renderDev()}
            {!user ? renderLogin() : renderLoggedIn()}
        </div>
    );
};

export default LoginForm;
