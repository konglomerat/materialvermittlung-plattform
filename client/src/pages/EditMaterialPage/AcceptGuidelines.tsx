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
import { Checkbox, Alert } from "antd";
import { Link } from "react-router-dom";
import { routes } from "../../history";

type Props = {
    acceptedTerms: boolean;
    onChange: (acceptedTerms: boolean) => void;
};

const AcceptGuidelines: FC<Props> = ({ acceptedTerms, onChange }) => {
    return (
        <Alert
            style={{ marginBottom: "16px" }}
            type="warning"
            message={
                <>
                    <div style={{ marginBottom: "5px" }}>
                        Das Material wurde bereits veröffentlicht. Bei
                        Änderungen musst du den Richtlinien erneut zustimmen, um
                        Änderungen vorzunehmen und zu speichern.
                    </div>
                    <Checkbox
                        value={acceptedTerms}
                        onChange={(event) => onChange(event.target.checked)}
                    >
                        Ich habe die{" "}
                        <Link to={routes.materialGuidelines} target="_blank">
                            besonderen Nutzungsbedingungen für die Einstellung
                            von Materialien/Zündstoffen
                        </Link>{" "}
                        gelesen und stimme ihnen zu.
                    </Checkbox>
                </>
            }
        />
    );
};

export default AcceptGuidelines;
