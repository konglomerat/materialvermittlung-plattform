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

const DataProtectionPage: FC = () => {
    return (
        <Content>
            <Title level={3}>
                <strong>Datenschutzerklärung der Website</strong>{" "}
                <a href="/">
                    <strong>{window.location.host}</strong>
                </a>
            </Title>
            <p>
                <strong>Ein Hinweis auch hier bereits vorab:</strong>
            </p>
            <p>
                <strong> </strong>
            </p>
            <p>
                <strong>
                    Aus Gründen der Lesbarkeit haben wir teils zur Vereinfachung
                    in den Datenschutzbestimmungen die weibliche Form gewählt,
                    nichtsdestotrotz beziehen sich die Angaben natürlich auf die
                    Angehörigen aller Geschlechter.
                </strong>
            </p>
            <p>
                Hinsichtlich der Verarbeitung personenbezogener Daten über
                unserer Website gelten folgende Bestimmungen
            </p>
            <p>
                <strong>§ 1 </strong>
                <strong>
                    Information über die Erhebung personenbezogener Daten
                </strong>
            </p>
            <p>
                (1) Im Folgenden informieren wir Sie über die Erhebung
                personenbezogener Daten bei Nutzung unserer Website.
                Personenbezogene Daten sind alle Daten, die auf Sie persönlich
                beziehbar sind, z.B. Ihr Name, Adresse, E-Mail-Adressen sowie
                (ggf.) Ihr Nutzerverhalten.
            </p>
            <p>
                (2) Verantwortliche gemäß Artikel 4 Ziffer 7
                EU-Datenschutz-Grundverordnung (nachfolgend „DS-GVO“) ist die
            </p>
            <p>
                <em> </em>
            </p>
            <p>Konglomerat e.V.</p>
            <p>
                vertreten durch den Vorstand Anna Seidel, Bettina Weber, Carl
                Frenkel und Sarah Urban
            </p>
            <p>Jagdweg 1 – 3</p>
            <p>01159 Dresden</p>
            <p>
                (siehe unser Impressum{" "}
                <a href="https://konglomerat.org/impressum.html">
                    https://konglomerat.org/impressum.html
                </a>
                ).
            </p>
            <p>
                <em> </em>
            </p>
            <p>
                <em>datenschutz@materialvermittlung.org</em>
            </p>
            <p>
                Unsere Datenschutzbeauftragte erreichen Sie unter
                datenschutzbeauftragter@materialvermittlung.org oder folgender
                Postadresse
            </p>
            <p>Jagdweg 1-3</p>
            <p>01159 Dresden</p>
            <p>
                (3) Bei Ihrer Kontaktaufnahme mit uns per E-Mail werden die von
                Ihnen mitgeteilten Daten von uns verarbeitet und gespeichert, um
                Ihre Fragen zu beantworten. Die in diesem Zusammenhang
                anfallenden Daten löschen wir, nachdem die Speicherung nicht
                mehr erforderlich ist, oder schränken die Verarbeitung ein,
                falls (z.B. steuer-) gesetzliche Aufbewahrungspflichten oder
                sonstige Rechtfertigungsgründe zur weitergehenden Speicherung
                bestehen. Im letzteren Falle nehmen wir jedoch spätestens nach
                einem Jahr der Speicherung eine Trennung und Zugangsbeschränkung
                hinsichtlich der auf Grund gesetzlicher Bestimmung gespeicherten
                Daten vor, soweit nachstehend nicht etwas anderes angegeben ist.
                Rechtsgrundlage der erstmaligen Erhebung ist insoweit Artikel 6
                Abs. 1 S. 1 lit. a) DS-GVO, diejenige für die weitere
                Verarbeitung im Rahmen einer Vertragserfüllung oder zur
                Durchführung vorvertraglicher Maßnahmen, die für die Beantragung
                Ihrer Anfrage erforderlich sind, Artikel 6 Abs. 1 S. 1 lit. b)
                DS-GVO sowie (ggf.) weitere Speicherung aus sonstigen
                rechtlichen Gründen Artikel 6 Abs. 1 S. 1 lit. c) DS-DVO.
            </p>
            <p>
                (4) Etwaig über unsere Plattform erfolgreich transferierte
                Zündstoffe werden von uns spätestens ein Jahr nach Bestätigung
                einer Reservierung im offenen Bereich pseudonymisiert und die zu
                Grunde liegenden Transaktionen im geschlossenen Bereich der
                betroffenen Teilnehmerinnen gelöscht.
            </p>
            <p>
                (5) Falls wir für einzelne Funktionen unseres Angebots auf
                beauftragte Dienstleisterinnen zurückgreifen oder Ihre Daten für
                werbliche Zwecke nutzen möchten, werden wir Sie untenstehend im
                Detail über die jeweiligen Vorgänge informieren. Dabei nennen
                wir auch die festgelegten Kriterien der Speicherdauer.
            </p>
            <p>
                <strong> </strong>
            </p>
            <p>
                <strong>§ 2 </strong>
                <strong>Ihre Rechte</strong>
            </p>
            <p>
                (1) Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie
                betreffenden personenbezogenen Daten:
            </p>
            <p>- Recht auf Auskunft (Artikel 15 DS-GVO),</p>
            <p>
                - Recht auf Berichtigung oder Löschung (Artikel 16, 17 DS-GVO),
            </p>
            <p>
                - Recht auf Einschränkung der Verarbeitung (Artikel 18 DS-GVO),
            </p>
            <p>
                - Recht nicht ausschließlich einer automatisierten Entscheidung
                unterworfen zu sein (Artikel 22 DS-GVO),
            </p>
            <p>- Recht auf Datenübertragbarkeit (Artikel 20 DS-GVO) sowie</p>
            <p>
                - Recht auf Widerspruch gegen die Verarbeitung (Artikel 21
                DS-GVO).
            </p>
            <p>
                Die Rechte auf Auskunft und Datenübertragbarkeit können von
                Ihnen als Teilnehmerin über die jeweilige Funktion im
                geschlossenen Bereich unserer Plattform ausgeübt werden. Im
                Übrigen verbleibt es bei der Möglichkeit der Kontaktaufnahme
                über die in genannten Kontaktdaten.
            </p>
            <p>
                (2) Sie haben zudem das Recht, sich bei einer
                Datenschutz-Aufsichtsbehörde über die eine – aus Ihrer Sicht –
                rechtswidrige Verarbeitung Ihrer personenbezogenen Daten durch
                uns zu beschweren, Artikel 77 DS-GVO. In der Regel können Sie
                sich hierfür an die Aufsichtsbehörde Ihres üblichen
                Aufenthaltsortes oder Arbeitsplatzes oder unseres
                Unternehmenssitzes wenden.
            </p>
            <p>
                (3) Soweit Sie Ihre in Absatz 1 aufgeführten Rechte auf
                Berichtigung, Löschung oder Einschränkung der Verarbeitung
                gegenüber uns geltend gemacht, so sind wir verpflichtet, allen
                Empfängern, denen die Sie betreffenden personenbezogenen Daten
                offengelegt wurden, die von Ihnen gewünschte Berichtigung oder
                Löschung der Daten oder Einschränkung der Verarbeitung
                mitzuteilen, es sei denn, dies erweist sich als unmöglich oder
                ist mit einem unverhältnismäßigen Aufwand verbunden. Ihnen steht
                uns gegenüber aber in jedem Falle das Recht zu, über diese
                Empfängerinnen unterrichtet zu werden, Artikel 19 DS-GVO.
            </p>
            <p>
                (4) Wir weisen klarstellend darauf hin, dass bei uns keinerlei
                automatisierten Entscheidungsfindung gemäß Artikel 22 Abs. 1 und
                4 DS-GVO stattfindet.
            </p>
            <p>
                <strong>§ 3 </strong>
                <strong>
                    Erhebung personenbezogener Daten bei Besuch (= Aufruf)
                    unserer Website
                </strong>
            </p>
            <p>
                (1) Bei einem lediglich informatorischen Besuch der Website (=
                Aufruf), d.h. falls Sie sich nicht registrieren oder uns nicht
                anderweitig Informationen übermitteln, erheben wir nur die
                personenbezogenen Daten, die Ihr Browser an unseren Server
                übermittelt. Wir verwenden dazu ein Übertragungsverfahren,
                welches auf dem SSL-Protokoll (Secure Sockets Layer-Protokoll:
                TLS 1.3) basiert. Wenn Sie unsere Website betrachten möchten,
                erheben wir die folgenden Daten, die für uns technisch
                erforderlich sind, um Ihnen unsere Website anzuzeigen und die
                Stabilität und Sicherheit zu gewährleisten (Rechtsgrundlage ist
                Artikel 6 Abs. 1 S. 1 lit. f) DS-GVO):
            </p>
            <p>● IP-Adresse (Speicherdauer 15 Tage)</p>
            <p>● Datum und Uhrzeit der Anfrage</p>
            <p>● Zeitzonendifferenz zur Greenwich Mean Time (GMT)</p>
            <p>● Inhalt der Anforderung (konkrete Seite)</p>
            <p>● Zugriffsstatus/HTTP-Statuscode</p>
            <p>● jeweils übertragene Datenmenge</p>
            <p>● Website, von der die Anforderung kommt</p>
            <p>● Browser</p>
            <p>● Betriebssystem und dessen Oberfläche</p>
            <p>● Sprache und Version der Browsersoftware.</p>
            <p>
                (2) Zusätzlich zu den zuvor genannten Daten werden bei Ihrer
                Nutzung unserer Website ein sog. Bearer Cookies auf Ihrem
                Rechner gespeichert, wenn Sie sich einloggen. Dieses ist
                entweder bis zum manuellen Logout oder 24h gültig. Das Cookie
                dient dazu, Sie zu authentisieren. Spätestens 24h nach dem
                letzten Login müssen Sie sich neu einloggen, da das Cookie dann
                abgelaufen ist. Das Bearer Cookie ist gegen Manipulation durch
                den Client abgesichtert ("HTTP only" Flag und "Strict" Flag).
            </p>
            <p>
                <strong>§ 4 </strong>
                <strong>Weitere Funktionen und Angebote unserer Website</strong>
            </p>
            <p>
                (1) Neben der rein informatorischen Nutzung unserer Website
                bieten wir verschiedene Leistungen an, die Sie bei Interesse
                nutzen können. Dazu müssen Sie in der Regel weitere
                personenbezogene Daten angeben, die wir zur Erbringung der
                jeweiligen Leistung nutzen und für die die zuvor genannten
                Grundsätze zur Datenverarbeitung gelten.
            </p>
            <p>
                (2) Teilweise bedienen wir uns zur Verarbeitung Ihrer Daten
                externer Dienstleisterinnen. Diese wurden von uns sorgfältig
                ausgewählt und beauftragt, sind an unsere Weisungen gebunden und
                werden regelmäßig kontrolliert.
            </p>
            <p>
                (3) Weiterhin können wir Ihre personenbezogenen Daten an Dritte
                weitergeben, wenn Vertragsabschlüsse oder ähnliche Leistungen
                von uns gemeinsam mit Partnern angeboten werden. Nähere
                Informationen hierzu erhalten Sie bei Angabe Ihrer
                personenbezogenen Daten oder in der Beschreibung des Angebotes.
                Im Rahmen des Hostings unserer Website bedienen wir uns der
                Sandstorm Media GmbH, Tatzberg 47, 01307 Dresden (nachfolgend
                „HOSTINGPARTNERIN“), welche sich wiederum der Firma Hetzner
                Online GmbH, Industriestraße 25, 91710 Gunzenhausen, bedient,
                deren Server ebenfalls in Deutschland ansässig sind.
            </p>
            <p>
                (4) Soweit unsere Dienstleisterin oder Partnerin ihren Sitz in
                einem Staat außerhalb des Europäischen Wirtschaftsraumen (EWR)
                haben, informieren wir Sie über die Folgen dieses Umstands in
                der Beschreibung des Angebotes.
            </p>
            <p>
                <strong>§ 5 </strong>
                <strong>
                    Widerspruch gegen die oder Widerruf hinsichtlich der
                    Verarbeitung Ihrer Daten
                </strong>
            </p>
            <p>
                (1) Falls Sie im Einzelfall eine Einwilligung zur Verarbeitung
                Ihrer Daten erteilt haben, können Sie diese jederzeit unter den
                oben unter Absatz 2 bzw. im dort verlinkten Impressum genannten
                Kontaktdaten widerrufen. Ein solcher Widerruf beeinflusst die
                Zulässigkeit der Verarbeitung Ihrer personenbezogenen Daten,
                nachdem Sie ihn gegenüber uns ausgesprochen haben.
            </p>
            <p>
                (2) Soweit wir die Verarbeitung Ihrer personenbezogenen Daten
                auf die Interessenabwägung stützen, können Sie Widerspruch gegen
                die Verarbeitung einlegen. Dies ist der Fall, wenn die
                Verarbeitung insbesondere nicht zur Erfüllung eines Vertrags mit
                Ihnen erforderlich ist, was von uns jeweils bei der
                nachfolgenden Beschreibung der Funktionen dargestellt wird. Bei
                Ausübung eines solchen Widerspruchs bitten wir um Darlegung der
                Gründe, weshalb wir Ihre personenbezogenen Daten nicht wie von
                uns durchgeführt verarbeiten sollten. Im Falle Ihres begründeten
                Widerspruchs prüfen wir die Sachlage und werden entweder die
                Datenverarbeitung einstellen bzw. anpassen oder Ihnen unsere
                zwingenden schutzwürdigen Gründe aufzeigen, aufgrund derer wir
                die Verarbeitung fortführen.
            </p>
            <p>
                (3) Selbstverständlich können Sie einer etwaigen Verarbeitung
                Ihrer personenbezogenen Daten für Zwecke der Werbung und
                Datenanalyse jederzeit widersprechen. Über Ihren
                Werbewiderspruch können Sie uns unter den oben unter Absatz 2
                bzw. im dort verlinkten Impressum genannten Kontaktdaten
                informieren.
            </p>
            <p>
                <strong>§ 6 </strong>
                <strong>Registrierung auf unserer Plattform</strong>
            </p>
            <p>
                (1) Soweit Sie den geschlossenen Bereich unserer Webseite nutzen
                möchten, müssen Sie sich mittels Angabe Ihrer E-Mail-Adresse und
                eines selbst gewählten Passworts registrieren. Wir verwenden für
                die Prüfung Ihrer angegebenen E-Mailadresse das sog.
                Double-Opt-in- Verfahren, d. h. Ihre Registrierung ist erst
                vollständig abgeschlossen, wenn Sie zuvor Ihre Anmeldung über
                eine Ihnen zu diesem Zweck zugesandte Bestätigungs-E-Mail durch
                Klick auf den darin enthaltenen Link bestätigt haben. Nehmen Sie
                die Verifizierung nicht binnen 3 Werktagen nach Erhalt der
                Bestätigungs-E-Mail vor, so wird Ihre Registrierungsanfrage
                zunächst pseudonymisiert und nach spätestens einem Monat
                gelöscht. Die Angabe von Vor-und Nachname sowie E-Mailadresse
                und Passwort ist verpflichtend, alle weiteren Informationen
                können Sie freiwillig durch Nutzung der Funktionen im
                geschlossenen Bereich unserer Webseite bereitstellen.
            </p>
            <p>
                (2) Wenn Sie die Funktionen im geschlossenen Bereich unserer
                Webseite zum Bereitstellen und Reservieren von Zündstoffen
                nutzen, speichern wir auch Ihre insoweit bereitgestellten
                personenbezogenen Daten zur Vertragserfüllung. Rechtsgrundlage
                hierfür ist Artikel 6 Abs. 1 S. 1 lit. b) DS-GVO. Weiterhin
                speichern wir die von Ihnen angegebenen freiwilligen Daten für
                die Zeit Ihrer Nutzung der Webseite, soweit Sie diese nicht
                zuvor löschen. Alle Angaben können Sie entsprechend der
                Plattformfunktionen im geschlossenen Bereich verwalten und
                ändern. Rechtsgrundlage der Speicherung und Verarbeitung Ihrer
                uns zugänglich gemachten freiwilligen Angaben ist primär Artikel
                6 Abs. 1 S. 1 lit. a) DS-GVO sowie sekundär Artikel 6 Abs. 1 S.
                1 lit. f) DS-GVO.
            </p>
            <p>
                (3) Wenn Sie die Webseite nutzen, können Ihre Daten entsprechend
                der Vertragsleistung anderen Teilnehmerinnen und Nutzerinnen der
                Webseite zugänglich werden.
            </p>
            <p>
                a) Nutzerinnen erhalten standardisiert folgende Informationen
                über Sie:
            </p>
            <p>Vor- und Nachname oder Nutzerinnenname.</p>
            <p>
                b) Für alle Nutzerinnen sind darüber hinaus Zündstoffe innerhalb
                des Präsentationszeitraums sichtbar.
            </p>
            <p>
                (4) Um unberechtigte Zugriffe Dritter auf Ihre persönlichen
                Daten zu verhindern, wird die Verbindung per TLS-Technik
                verschlüsselt.
            </p>
            <p>
                <strong>§ 7 </strong>
                <strong>Nutzung unserer sonstigen Plattformfunktionen</strong>
            </p>
            <p>
                (1) Sie können zudem als Nutzerin freiwillig, als Teilnehmerin
                verpflichtend ein Nutzerinnenkonto (nachfolgend als "Profil"
                bezeichnet) anlegen, durch das wir zusätzliche Daten für spätere
                weitere Aktivitäten innerhalb des geschlossenen Bereichs unserer
                Website speichern können. Rechtsgrundlage für Speicherung und
                Verarbeitung der freiwilligen Daten ist Artikel 6 Abs. 1 S. 1
                lit. a) DS-GVO. Im Übrigen sind die Rechtsgrundlagen dieser
                Verarbeitung die Artikel 6 Abs. 1 S. 1 lit. b) und (ggf. im
                Falle einer Spende an die Webseite) lit. c) DS-GVO, hilfsweise
                Artikel 6 Abs. 1. S. 1. lit. f) DS-GVO, um Missbrauch zu
                verhindern.
            </p>
            <p>
                (2) Die für die Abwicklung der Verträgen zwischen
                Bestandsinhaberinnen und Abnehmerinnen abgefragten Angaben sind
                Pflichtangaben. Die von Ihnen angegebenen Daten verarbeiten wir
                zur Abwicklung Ihrer Verträge bzw. – im Falle der Verträge
                zwischen den Bestandsinhaberinnen und Abnehmerinnen – zur
                Unterstützung bei der Durchführung der über unsere Plattform zu
                schließenden Verträge.
            </p>
            <p>
                (3) Soweit auch abgabenrechtlich relevante Verträge mit uns
                bestehen (z.B. auf Grund Spenden Ihrerseits, sind wir aufgrund
                handels- und steuerrechtlicher Vorgaben verpflichtet, Ihre
                Adress-, Zahlungs- und Bestelldaten für die Dauer von zehn
                Jahren zu speichern. Im Übrigen speichern wir Ihre Daten für bis
                zu zehn Jahre nach Erfüllung der Verträge zwischen den
                Teilnehmerinnen (über „Zündstoffe“) vor dem Hintergrund der
                regelmäßigen Verjährung unter Berücksichtigung des
                frühestmöglichen Verjährungsbeginns, um im Falle von
                Streitigkeiten zwischen Teilnehmerinnen Unterstützung leisten zu
                können. Bei erfolglosen Einstellungen von Zündstoffen (für
                welche sich keine Abnehmerin findet und welche Sie mithin wieder
                löschen) werden Ihre Daten spätestens 12 Monate nach Beendigung
                des Präsentationszeitraums gelöscht. Rechtsgrundlage der
                Speicherung sind insoweit (nachrangig) Artikel 6 Abs. 1 S. 1
                lit. b), c) und f) DS-GVO.
            </p>
            <p>
                <strong>§ 8 </strong>
                <strong>
                    Datenübermittlung an Bestandsinhaberinnen nach Reservierung
                </strong>
            </p>
            <p>
                Soweit Sie als Teilnehmerin Zündstoffe zwecks Reservierung
                anfragen, werden wir Ihre personenbezogenen Daten den
                Bestandsinhaberinnen zur Verfügung zu stellen, damit diese Ihre
                Anfrage prüfen können. Dies betrifft im Zweifel Ihren Vor- und
                Nachnamen, Ihre Adressdaten, den gewünschten Zündstoff nebst
                gewünschter Menge, Ihre E-Mail-Adresse und das Datum der
                Reservierungsanfrage. Rechtsgrundlage dieser Datenübermittlung
                ist Artikel 6 Abs. 1, S. 1, lit. b) DS-GVO.
            </p>
            <p>
                <strong> </strong>
            </p>
            <p>
                <strong>§ 9 </strong>
                <strong>Links zu externen Websites</strong>
            </p>
            <p>
                Soweit darüber hinaus auf Webseiten anderer Anbieterinnen
                verlinkt wird, gilt diese Datenschutzerklärung nicht für deren
                Inhalte. Welche Daten die Betreiberinnen dieser Seiten
                möglicherweise erheben, entzieht sich unserem Kenntnis- und dem
                Einflussbereich. Informationen hierüber erhalten Sie ggf. im
                Datenschutzhinweis der jeweiligen Seite.
            </p>
            <p>
                <strong>Stand: Juni 2021</strong>
            </p>
        </Content>
    );
};

export default DataProtectionPage;
