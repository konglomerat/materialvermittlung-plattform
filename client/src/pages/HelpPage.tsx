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
import { Typography } from "antd";
import Content from "../components/Layouts/Content";

const HelpPage: FC = () => {
    return (
        <Content>
            <Typography.Title>
                Willkommen auf der Zündstoffe-Plattform
            </Typography.Title>
            <Typography.Title level={2}>
                Lasst uns gemeinsam in Dresden ein großes Netzwerk der
                Wiederverwendung spannen und die Ressourcen dieser Stadt teilen!
            </Typography.Title>
            <p>
                Ohne Login könnt ihr öffentlich zugängliches Material sofort
                sichten und euch mit dem entsprechenden Lager in Verbindung
                setzen, um Material dort abzuholen.
            </p>

            <p>
                Du möchtest eigenes Material einstellen? Dann log dich ein! Der
                Login-Bereich im Menü steht derzeit nur Organisationen,
                Vereinen, Initiativen oder Firmen zur Verfügung. Diese können
                sich bei uns per Email anmelden unter:
                <a href="mailto:materialvermittlung@konglomerat.org">
                    {" "}
                    materialvermittlung@konglomerat.org
                </a>
            </p>
            <p>
                Im rechten Menü findet ihr die Möglichkeit euch anzumelden bzw.
                zu registrieren.
            </p>
            <p>
                Nach eurer Mitteilung schalten wir euch den Zugang zur Plattform
                frei und Ihr könnt euer Material einstellen und natürlich auch
                Material, welches von anderen Organisationen eingestellt wurde,
                sehen und abholen. So können wir in Dresden ein gutes Netzwerk
                von wiederverwendbarem Material spannen.
            </p>
        </Content>
    );
};

export default HelpPage;
