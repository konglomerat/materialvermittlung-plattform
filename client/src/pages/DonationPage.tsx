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
import React, { FC, useEffect } from "react";
import { Row, Col, Typography } from "antd";
import Content from "../components/Layouts/Content";

const DonationPage: FC = () => {
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
                    <Typography.Title>Z??ndstoffe Plattform</Typography.Title>
                    <Typography.Title level={2}>
                        Materialressourcen optimaler nutzen
                    </Typography.Title>
                    <p>
                        Z??ndstoffe - Materialvermittlung Dresden ist ein
                        gemeinn??tziges Projekt, das im Rahmen der Zukunftsstadt
                        #Dresden 2030 entstanden ist. Unser Tr??gerverein ist der
                        Konglomerat e.V. im #Rosenwerk. Seit 2017 leisten wir in
                        Dresden einen Beitrag dazu, den Gedanken der
                        Wiederverwendung in Bildungseinrichtungen, der Kunst-
                        und Kulturszene, Institutionen und in der
                        Stadtgesellschaft zu verankern. Wir minimieren den
                        Ressourcenverbrauch, versuchen Material im Kreislauf zu
                        halten und f??rdern sowohl die Wertsch??tzung f??r als auch
                        den kreativen Umgang mit Restmaterial. Im Juni 2021 geht
                        unsere Onlineplattform an den Start. Diese Plattform
                        soll die Materialvermittlung innerhalb von Dresden
                        effizienter gestalten. Mit dieser Plattform m??chten wir
                        Dresdner Institutionen, Unternehmen und Vereine
                        unterst??tzen Restmaterial einander leichter zur
                        Verf??gung zu stellen. Dar??ber hinaus spannen wir ein
                        Netzwerk der Wiederverwendung in Dresden und erz??hlen
                        Materialgeschichten. Wir als Z??ndstoffe -
                        Materialvermittlung Dresden sehen unsere Aufgabe in
                        diesem Netzwerk darin, die Informationsl??cke ??ber das
                        vorhandene Restmaterial zwischen Abnehmerin und
                        Anbieterin zu schlie??en.
                    </p>
                    <p>
                        <strong>
                            Wir m??chten, dass eine Vielzahl an Menschen diese
                            Plattform in Dresden nutzt und gestalten daher den
                            Zugang niedrigschwellig und kostenlos. Da Server und
                            die Pflege der Plattform aber Kosten erzeugen,
                            ben??tigen wir daf??r Unterst??tzung in Form von
                            Spenden. Zudem w??rden wir Spenden nutzen, um die
                            Plattform mit zus??tzlichen Funktionen auszustatten.
                            Dazu z??hlen unter anderem erweiterte Suchfunktionen,
                            eine Darstellung der CO??-Einsparungen oder eine
                            Kartenoption.
                        </strong>
                    </p>
                    <p>
                        <strong>
                            Unterst??tzt unsere Arbeit mit einer einmaligen
                            Spende oder werdet F??rderer durch regelm????ige
                            Beitr??ge. Nur so k??nnen wir die Plattform dauerhaft
                            zur Verf??gung stellen und unser Projekt
                            gemeinschaftlich und nachhaltig finanzieren.
                        </strong>
                    </p>
                </Col>
                <Col md={12} span={24}>
                    <div id="betterplace_donation_iframe">
                        <strong>
                            <a href="https://www.betterplace.org/de/donate/platform/projects/92555-zuendstoffe-plattform-materialressourcen-optimaler-nutzen">
                                Jetzt Spenden f??r ???Z??ndstoffe Plattform -
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
