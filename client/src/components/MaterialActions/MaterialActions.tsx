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

import React, { FC, CSSProperties } from "react";
import { Button, Popconfirm, Tooltip } from "antd";
import {
    EditOutlined,
    RocketOutlined,
    WarningOutlined,
    SwapOutlined,
    EyeOutlined,
    FlagOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import { EditMaterialTabs, routes } from "../../history";
import validation from "../../helper/validation";
import { MaterialsQueryNode } from "../../graphql/queries/materials";

const tooltipStyle: CSSProperties = { fontSize: "4px" };

type Props = {
    material: MaterialsQueryNode;
};

const Edit: FC<Props> = ({ material }) => {
    return (
        <Tooltip title="Bearbeiten">
            <Button
                type="link"
                key="edit"
                href={routes.editMaterial(material._id)}
                icon={<EditOutlined />}
            />
        </Tooltip>
    );
};

const Publish: FC<Props> = ({ material }) => {
    const isValid = validation.isValid(material.validationResults);

    return (
        <Tooltip
            style={tooltipStyle}
            title={isValid ? "Veröffentlichen" : "Fehlende Infos"}
        >
            <Button
                type="link"
                key="publish"
                href={routes.editMaterial(
                    material._id,
                    isValid ? EditMaterialTabs.Publish : undefined
                )}
                icon={
                    isValid ? (
                        <RocketOutlined />
                    ) : (
                        <WarningOutlined style={{ color: "orange" }} />
                    )
                }
            />
        </Tooltip>
    );
};

type FlowsProps = Props & {
    onClick: (material: MaterialsQueryNode) => void;
};

const Flows: FC<FlowsProps> = ({ material, onClick }) => {
    return (
        <Tooltip title="Materialflüsse">
            <Button
                type="link"
                key="reservations"
                icon={<SwapOutlined />}
                onClick={() => onClick(material)}
            />
        </Tooltip>
    );
};

type FinishProps = Props & {
    onClick: (materialId: string) => void;
};

const Finish: FC<FinishProps> = ({ material, onClick }) => {
    return (
        <Tooltip title="Abschließen">
            <Popconfirm
                title="Das Material wird abgeschlossen. Nach 12 Monaten wird das Material endgültig von der Plattform gelöscht."
                onConfirm={() => onClick(material.id)}
                okText="Ok"
                cancelText="Abbrechen"
            >
                <Button type="link" icon={<FlagOutlined />} />
            </Popconfirm>
        </Tooltip>
    );
};

type ShowProps = Props & {
    route: string;
};

const Show: FC<ShowProps> = ({ material, route }) => {
    return (
        <Tooltip title="Anzeigen">
            <Link to={`${route}/${material._id}`}>
                <Button type="link" icon={<EyeOutlined />} />
            </Link>
        </Tooltip>
    );
};

export default {
    Edit,
    Publish,
    Flows,
    Finish,
    Show,
};
