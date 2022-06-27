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
import { Card, Skeleton, Typography } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import moment from "moment";

interface StoryCardProps {
    title?: string;
    content?: string;
    date?: string;
    author?: string;
    image?: string;
}

const { Paragraph } = Typography;
const { Meta } = Card;

const StoryCard: FC<StoryCardProps> = ({
    title,
    content,
    date,
    author,
    image,
}) => (
    <Card
        title={
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {title ? (
                    title
                ) : (
                    <Skeleton active paragraph={false} title={{ width: 300 }} />
                )}
                <ExportOutlined />
            </div>
        }
        style={{ marginBottom: 10 }}
        hoverable
    >
        <Meta
            title={
                <Paragraph
                    style={{
                        whiteSpace: "normal",
                        fontWeight: "initial",
                    }}
                >
                    {content ? (
                        <>
                            {image ? (
                                <>
                                    <img
                                        src={image}
                                        alt={title}
                                        style={{
                                            width: "100%",
                                            marginBottom: "20px",
                                        }}
                                    />
                                </>
                            ) : null}
                            {content}
                        </>
                    ) : (
                        <Skeleton
                            active
                            title={false}
                            paragraph={{ rows: 6 }}
                        />
                    )}
                </Paragraph>
            }
            description={
                date ? (
                    `${moment(date).format("DD. MMMM YYYY")} / ${author}`
                ) : (
                    <Skeleton
                        active
                        paragraph={{ width: 200, rows: 1 }}
                        title={false}
                    />
                )
            }
        />
    </Card>
);

export default StoryCard;
