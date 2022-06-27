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

import React, { Component, ReactChild } from "react";
import { Button, Result } from "antd";
import { FormattedMessage } from "react-intl";
import Content from "./Layouts/Content";
import { routes } from "../history";

interface Props {
    children: ReactChild;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <Content>
                    <Result
                        status="warning"
                        title={<FormattedMessage id={"error.title"} />}
                        subTitle={<FormattedMessage id={"error.message"} />}
                        extra={
                            <Button type="primary">
                                <a href={routes.index}>Zu allen Materialien</a>
                            </Button>
                        }
                    />
                </Content>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
