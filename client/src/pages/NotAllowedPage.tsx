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
import { Link, useLocation } from "react-router-dom";
import { routes } from "../history";
import user from "../userInfo";
import Content from "../components/Layouts/Content";

const NotAllowedPage: FC = () => {
    const location = useLocation();

    if (user) {
        if (user.isAdmin) {
            return (
                <Content title="Sie sind als Admin angemeldet">
                    Nutze den Admin Nutzer ausschließlich zum Anlegen neuer
                    Nutzer und Organisationen.
                    <br />
                    <Link to={routes.admin.index}>Zur Administration</Link>
                </Content>
            );
        }
    }

    return (
        <Content title="Sie sind nicht angemeldet">
            <Link to={`${routes.login}?redirect=${location.pathname}`}>
                Zum Login
            </Link>
        </Content>
    );
};

export default NotAllowedPage;
