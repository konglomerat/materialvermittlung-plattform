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
import { Avatar } from "antd";

interface Props {
    material: {
        title: string | null;
        description: string | null;
        images: ({ id: string; thumbnailUrl: string | null } | null)[] | null;
    };
    title?: string;
    description?: ReactNode;
    actions?: ReactNode;
}

const MaterialListItem: FC<Props> = ({
    material,
    title,
    actions,
    description,
}) => {
    return (
        <div className="materialListItem">
            <Avatar
                className="materialListItem__avatar"
                shape="square"
                size={50}
                src={material.images?.[0]?.thumbnailUrl || undefined}
            />
            <div className="materialListItem__content">
                <div className="materialListItem__title">
                    {title || material.title}
                </div>
                <div>{description || material.description}</div>
            </div>
            <div className="materialListItem__actions">{actions}</div>
        </div>
    );
};

export default MaterialListItem;
