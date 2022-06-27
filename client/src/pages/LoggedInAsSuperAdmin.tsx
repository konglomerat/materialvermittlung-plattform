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
import { Link } from "react-router-dom";
import { routes } from "../history";
import user from "../userInfo";
import Content from "../components/Layouts/Content";

const LoggedInAsSuperAdmin: FC = () => {
    if (user && user.isAdmin) {
        return (
            <Content title="Sie sind als Admin angemeldet">
                Nutze den Admin Nutzer ausschließlich zum Anlegen neuer Nutzer
                und Organisationen.
                <br />
                <Link to={routes.admin.index}>Zur Administration</Link>
            </Content>
        );
    } else {
        return null;
    }
};

export default LoggedInAsSuperAdmin;
