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

import React, { FC, ReactNode, ReactNodeArray } from "react";
import Row from "./Row";
import { Col, Typography } from "antd";
import classnames from "classnames";
import ErrorBoundary from "../ErrorBoundary";

type Props = {
    children: ReactNode | ReactNodeArray;
    noPadding?: boolean;
    wide?: boolean;
    className?: string;
    title?: any;
    titleLevel?: 1 | 2 | 3 | 4 | 5;
};

const Content: FC<Props> = ({
    noPadding,
    wide,
    className,
    title,
    children,
    titleLevel,
}) => {
    const classNameList = classnames(
        {
            "page--with-padding": !noPadding,
            "page--narrow": !wide,
        },
        "content",
        className
    );

    return (
        <ErrorBoundary>
            <main className={classNameList}>
                {title ? (
                    <Row style={{ marginBottom: "0px" }}>
                        <Col span={24}>
                            <Typography.Title
                                level={titleLevel}
                                ellipsis={true}
                            >
                                {title}
                            </Typography.Title>
                        </Col>
                    </Row>
                ) : null}
                {children}
            </main>
        </ErrorBoundary>
    );
};

export default Content;
