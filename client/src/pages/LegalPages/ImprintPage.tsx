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

import Content from "../../components/Layouts/Content";

const { Title } = Typography;

// to convert docx to html use https://word2cleanhtml.com
// and do some minor cleanups

const ImprintPage: FC = () => {
    return (
        <Content>
            <Title level={2}>
                <strong>Impressum:</strong>
            </Title>
            <p>
                Konglomerat e.V.
                <br />
                Jagdweg 1-3
                <br />
                01159 Dresden
            </p>
            <p>
                vertreten durch den Vorstand: Anna Seidel Bettina Weber Carl
                Frenkel Sarah Urban
            </p>
            <p>Registergericht: Amtsgericht Dresden (Vereinsregister)</p>
            <p>Vereinsregisternummer: VR 5771</p>
            <p>UST-ID: DE318655778</p>
            <p>
                Verantwortlich für die Inhalte i.S.d. § 18 MStV ist Bettina
                Weber, welche unter vorstehenden Kontaktdaten erreichbar ist.
            </p>
            <p>E-Mail: vorstand@konglomerat.org</p>
            <p>Telefon: +49(0) 163 9031023</p>
            <p>
                <strong>Online-Streitbeilegung</strong>
            </p>
            <p>
                <strong> </strong>
            </p>
            <p>
                Die EU-Kommission stellt im Internet unter folgendem Link eine
                Plattform zur Online-Streitbeilegung bereit
                <a href="https://webgate.ec.europa.eu/odr">
                    https://webgate.ec.europa.eu/odr
                </a>
                .
            </p>
            <p>
                Wir sind weder bereit noch verpflichtet, an einem
                Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen (vgl. § 36 VSBG).
            </p>
        </Content>
    );
};

export default ImprintPage;
