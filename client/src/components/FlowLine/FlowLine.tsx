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
import { Button, Select, InputNumber, Form as AntdForm, Row } from "antd";
import Unit from "../Unit/Unit";
import { FormInstance } from "antd/lib/form";
import FlowComment from "../FlowComment/FlowComment";

type FormProps = {
    onSubmit: (quantity: number, comment: string) => void;
    dropdownOptions: { label: string; value: string }[];
    loading: boolean;
    quantityUnit: string;
    formRef?: FormInstance<any>;
    disabled?: boolean;
};

const Form: FC<FormProps> = (props) => {
    const handleSubmit = (values: { quantity: string; comment: string }) => {
        const formQuantity = Number(values.quantity);
        if (formQuantity > 0) props.onSubmit(formQuantity, values.comment);
    };

    return (
        <AntdForm
            form={props.formRef}
            onFinish={handleSubmit}
            style={{ width: "100%" }}
            className="flow-line"
        >
            <AntdForm.Item noStyle>
                <div className="flow-line__left">
                    <div className="flow-line__quantity">
                        <AntdForm.Item
                            name="quantity"
                            style={{ marginBottom: "5px" }}
                        >
                            <InputNumber
                                min={0}
                                disabled={props.disabled}
                                style={{ width: "100%" }}
                            />
                        </AntdForm.Item>{" "}
                    </div>
                    <div className="flow-line__unit">
                        <Unit unit={props.quantityUnit} />
                    </div>
                </div>
                <div className="flow-line__right">
                    <div className="flow-line__comment">
                        <AntdForm.Item
                            style={{
                                marginBottom: "5px",
                            }}
                            name="comment"
                            rules={[
                                {
                                    required: true,
                                    message: "Wird benötigt",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Bitte auswählen"
                                dropdownStyle={{ zIndex: 10000 }}
                                disabled={props.disabled}
                            >
                                {props.dropdownOptions.map((option) => {
                                    return (
                                        <Select.Option
                                            value={option.value}
                                            key={option.value}
                                        >
                                            {option.label}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </AntdForm.Item>
                    </div>
                    <div className="flow-line__actions">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={props.loading}
                            disabled={props.loading || props.disabled}
                        >
                            Anlegen
                        </Button>
                    </div>
                </div>
            </AntdForm.Item>
        </AntdForm>
    );
};

type LineProps = {
    quantity: number | null;
    quantityUnit: string;
    comment: string | null;
    actions?: ReactNode;
};

const Line: FC<LineProps> = ({ quantity, quantityUnit, comment, actions }) => {
    return (
        <Row className="flow-line">
            <div className="flow-line__left">
                <div className="flow-line__quantity">{quantity || 0}</div>
                <div className="flow-line__unit">
                    <Unit unit={quantityUnit} />
                </div>
            </div>
            <div className="flow-line__right">
                <div className="flow-line__coment">
                    <FlowComment comment={comment} />
                </div>
            </div>
            <div>{actions}</div>
        </Row>
    );
};

export default { Form, Line };
