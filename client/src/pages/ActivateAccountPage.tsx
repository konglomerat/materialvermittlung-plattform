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

import React, { FC, useEffect, useState } from "react";
import { Alert, Button, Col, Form, Input, Checkbox } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { Store } from "antd/lib/form/interface";
import axios from "axios";
import { Link, RouteComponentProps, useLocation } from "react-router-dom";
import PasswordStrengthBar from "react-password-strength-bar";

import Row from "../components/Layouts/Row";
import { login } from "../helper/login";
import history, { routes } from "../history";
import Content from "../components/Layouts/Content";

const ActivateAccountPage: FC<RouteComponentProps> = ({ match }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [tokenValid, setTokenValid] = useState<boolean | null>(null);
    const [attemptFailed, setAttemptFailed] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [hasAlreadyAcceptedTerms, setHasAlreadyAcceptedTerms] = useState(
        false
    );

    // here we save changes of the first password to provide
    // the needed data for the password strength bar which will
    // give us a score to disable or enable the button
    const [password, setPassword] = useState<string>();
    const [passwordScore, setPasswordScore] = useState<number>();

    const location = useLocation();
    const urlParameters = new URLSearchParams(location.search);
    const token = urlParameters.get("t");

    useEffect(() => {
        axios
            .post("/api/token-info", `activationToken=${token}`)
            .then((response) => {
                setTokenValid(true);
                setEmail(response.data.email);
                setName(response.data.name);
                setHasAlreadyAcceptedTerms(response.data.hasAcceptedTerms);
            })
            .catch((response) => {
                setTokenValid(false);
            });
    }, [token]);

    const attemptActivation = (formValues: Store) => {
        setLoading(true);
        const { password, hasAcceptedTerms } = formValues;
        // IMPORTANT: treat special characters
        const encodedPassword = encodeURIComponent(password);

        axios
            .post(
                "/api/set-password",
                `activationToken=${token}&password=${encodedPassword}&hasAcceptedTerms=${hasAcceptedTerms}`
            )
            .then((response) => {
                login(
                    email,
                    password,
                    () => history.push(routes.index),
                    () => history.push(routes.login)
                );
            })
            .catch((response) => {
                setAttemptFailed(true);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleValuesChange = () => {
        setAttemptFailed(false);
    };

    if (tokenValid === false) {
        return (
            <Content title="Anmeldelink ungültig">
                <Row>
                    <p>
                        Fordere{" "}
                        <Link to="/account/passwort-vergessen">hier</Link> einen
                        neuen an.
                    </p>
                </Row>
            </Content>
        );
    }

    return (
        <Content title={`Hallo ${name ? name : email}`}>
            <h3>Gib deinem Account ein neues Passwort.</h3>
            <br />
            <p>
                Das Passwort muss mindestens 8 Zeichen lang sein und sollte
                mindestens eine Zahl und ein Sonderzeichen enthalten.
            </p>

            <Form
                layout="vertical"
                name="activate"
                onFinish={attemptActivation}
                onValuesChange={handleValuesChange}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 12 }}
            >
                <Form.Item>
                    <Form.Item
                        name="password"
                        label="Passwort"
                        rules={[
                            {
                                required: true,
                                message: "Bitte ein Passwort vergeben.",
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Passwort"
                            onChange={(event) =>
                                // we set a state variable here to be able to
                                // provide the password to the password strength bar
                                setPassword(event.currentTarget.value)
                            }
                        />
                    </Form.Item>
                    <PasswordStrengthBar
                        minLength={8}
                        shortScoreWord="zu kurz"
                        scoreWords={[
                            "zu schwach",
                            "zu schwach",
                            "okay",
                            "gut",
                            "stark",
                        ]} // ['weak', 'weak', 'okay', 'good', 'strong']
                        password={password}
                        onChangeScore={setPasswordScore}
                    />
                </Form.Item>

                <Form.Item
                    name="repeat"
                    label="Passwort wiederholen"
                    rules={[
                        {
                            required: true,
                            enum: ["password"],
                            message: "Bitte das Passwort wiederholen.",
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (
                                    !value ||
                                    getFieldValue("password") === value
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    "Bitte das Passwort wiederholen."
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        type="password"
                        placeholder="Passwort"
                    />
                </Form.Item>

                {!hasAlreadyAcceptedTerms ? (
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
                ) : null}

                <Form.Item noStyle>
                    <Row>
                        <Col span={4}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                disabled={!passwordScore || passwordScore < 2}
                            >
                                Aktivieren
                            </Button>
                        </Col>
                        {attemptFailed ? (
                            <Col span={15}>
                                <Alert
                                    message="Aktivierung fehlgeschlagen."
                                    type="error"
                                    className="alert"
                                />
                            </Col>
                        ) : null}
                    </Row>
                </Form.Item>
            </Form>
        </Content>
    );
};

export default ActivateAccountPage;
