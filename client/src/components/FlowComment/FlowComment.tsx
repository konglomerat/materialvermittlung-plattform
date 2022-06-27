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

import React, { CSSProperties, FC } from "react";
import { enumTextMappings } from "../../clientConfig";

type Props = {
    comment?: string | null;
    style?: CSSProperties;
};

const FlowComment: FC<Props> = (props) => {
    if (!props.comment) return <span style={props.style}>Kein Kommentar</span>;

    const commentAsText =
        enumTextMappings.materialFlows[props.comment] || props.comment;

    return <span style={props.style}>{commentAsText}</span>;
};

export default FlowComment;
