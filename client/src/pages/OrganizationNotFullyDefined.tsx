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

const OrganizationNotFullyDefined: FC = () => {
    if (user && user.organization) {
        return (
            <Content title="Deine Organisation ist noch nicht vollständig eingerichtet">
                Folgende Informationen fehlen:
                <br />
                <br />
                <ul>
                    {!user.organization.hasImprint && (
                        <li>
                            <strong>Ein Impressum.</strong> Dieses wird für
                            jedes Material angezeigt.
                        </li>
                    )}
                    {!user.organization.hasNotificationMailAddresses && (
                        <li>
                            <strong>Mindestens eine E-Mail Adresse</strong> an
                            die Bestätigungsmails versendet werden können
                        </li>
                    )}
                </ul>
                <br />
                {user.isOrgAdmin ? (
                    <>
                        Als Administrator für deine Organisation kannst du{" "}
                        <Link to={routes.admin.organization}>
                            <strong>hier</strong>
                        </Link>{" "}
                        die fehlenden Informationen hinterlegen.
                    </>
                ) : (
                    <>Bitte informiere den Administrator deiner Organisation.</>
                )}
                <br />
            </Content>
        );
    } else {
        return null;
    }
};

export default OrganizationNotFullyDefined;
