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

// @ts-nocheck
import React, { FC, useEffect, useState } from "react";
import { Row, Col, Typography, Button } from "antd";
import Content from "../components/Layouts/Content";

const DonationPage: FC = () => {
    const [allowExternalContent, setAllowExternalContent] = useState(
        Boolean(window._bp_iframe?.load_donation_iframe)
    );
    useEffect(() => {
        if (allowExternalContent) {
            const head = document.getElementsByTagName("head")[0];
            const js = document.createElement("script");
            js.type = "text/javascript";
            js.src =
                "https://betterplace-assets.betterplace.org/assets/load_donation_iframe.js";
            head.appendChild(js);
        }
    }, [allowExternalContent]);
    /*
     * Configure at
     * https://www.betterplace.org/de/projects/92555-zuendstoffe-plattform-materialressourcen-optimaler-nutzen/manage/iframe_donation_form/new
     */
    window._bp_iframe = window._bp_iframe || {};
    window._bp_iframe.project_id = 92555; /* REQUIRED */
    window._bp_iframe.lang = "de"; /* Language of the form */
    window._bp_iframe.width = 600; /* Custom iframe-tag-width, integer */
    window._bp_iframe.color =
        "cb5133"; /* Button and banderole color, hex without "#" */
    window._bp_iframe.background_color =
        "ffffff"; /* Background-color, hex without "#" */
    window._bp_iframe.default_amount = 20; /* Donation-amount, integer 1-99 */
    window._bp_iframe.recurring_interval =
        "single"; /* Interval for recurring donations, string out of single, monthly und yearly */
    window._bp_iframe.bottom_logo = true;

    useEffect(() => {
        // trigger the form rendering manually, when visiting the page for a second time
        if (window._bp_iframe && window._bp_iframe.load_donation_iframe) {
            window._bp_iframe.load_donation_iframe();
        }
    });

    return (
        <Content>
            <Row gutter={24}>
                <Col md={12} span={24}>
                    <Typography.Title>Zündstoffe Plattform</Typography.Title>
                    <Typography.Title level={2}>
                        Materialressourcen optimaler nutzen
                    </Typography.Title>
                    <p>
                        Zündstoffe - Materialvermittlung Dresden ist ein
                        gemeinnütziges Projekt, das im Rahmen der Zukunftsstadt
                        #Dresden 2030 entstanden ist. Unser Trägerverein ist der
                        Konglomerat e.V. im #Rosenwerk. Seit 2017 leisten wir in
                        Dresden einen Beitrag dazu, den Gedanken der
                        Wiederverwendung in Bildungseinrichtungen, der Kunst-
                        und Kulturszene, Institutionen und in der
                        Stadtgesellschaft zu verankern. Wir minimieren den
                        Ressourcenverbrauch, versuchen Material im Kreislauf zu
                        halten und fördern sowohl die Wertschätzung für als auch
                        den kreativen Umgang mit Restmaterial. Im Juni 2021 geht
                        unsere Onlineplattform an den Start. Diese Plattform
                        soll die Materialvermittlung innerhalb von Dresden
                        effizienter gestalten. Mit dieser Plattform möchten wir
                        Dresdner Institutionen, Unternehmen und Vereine
                        unterstützen Restmaterial einander leichter zur
                        Verfügung zu stellen. Darüber hinaus spannen wir ein
                        Netzwerk der Wiederverwendung in Dresden und erzählen
                        Materialgeschichten. Wir als Zündstoffe -
                        Materialvermittlung Dresden sehen unsere Aufgabe in
                        diesem Netzwerk darin, die Informationslücke über das
                        vorhandene Restmaterial zwischen Abnehmerin und
                        Anbieterin zu schließen.
                    </p>
                    <p>
                        <strong>
                            Wir möchten, dass eine Vielzahl an Menschen diese
                            Plattform in Dresden nutzt und gestalten daher den
                            Zugang niedrigschwellig und kostenlos. Da Server und
                            die Pflege der Plattform aber Kosten erzeugen,
                            benötigen wir dafür Unterstützung in Form von
                            Spenden. Zudem würden wir Spenden nutzen, um die
                            Plattform mit zusätzlichen Funktionen auszustatten.
                            Dazu zählen unter anderem erweiterte Suchfunktionen,
                            eine Darstellung der CO²-Einsparungen oder eine
                            Kartenoption.
                        </strong>
                    </p>
                    <p>
                        <strong>
                            Unterstützt unsere Arbeit mit einer einmaligen
                            Spende oder werdet Förderer durch regelmäßige
                            Beiträge. Nur so können wir die Plattform dauerhaft
                            zur Verfügung stellen und unser Projekt
                            gemeinschaftlich und nachhaltig finanzieren.
                        </strong>
                    </p>
                </Col>
                <Col md={12} span={24}>
                    <div id="betterplace_donation_iframe">
                        <Button
                            type="primary"
                            onClick={() => setAllowExternalContent(true)}
                        >
                            Externe Inhalte erlauben & Spendenformular laden
                        </Button>
                        <strong>
                            <a href="https://www.betterplace.org/de/donate/platform/projects/92555-zuendstoffe-plattform-materialressourcen-optimaler-nutzen">
                                Oder jetzt Spenden für „Zündstoffe Plattform -
                                Materialressourcen optimaler nutzen" bei unserem
                                Partner betterplace.org
                            </a>
                        </strong>
                    </div>
                </Col>
            </Row>
        </Content>
    );
};

export default DonationPage;
