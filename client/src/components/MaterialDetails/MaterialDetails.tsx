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
import { Alert, Card, Divider } from "antd";
import { useQuery } from "@apollo/react-hooks";
import { mailAddresses } from "../../clientConfig";

import Obfuscate from "../Obfuscate/Obfuscate";
import MaterialMetadata from "../MaterialMetadata/MaterialMetadata";
import ImagesViewer from "../ImagesViewer/ImagesViewer";
import Modal from "../Modal/Modal";
import {
    materialQuery,
    MaterialQuery,
    MaterialQueryVariables,
    notLoggedInMaterialQuery,
} from "../../graphql/queries/material";
import Reservation from "./Reservation/Reservation";
import NotAllowedPage from "../../pages/NotAllowedPage";
import user from "../../userInfo";

type Props = {
    materialId: number;
    // currently means no reservations can be made
    // used when only previewing material, e.g. when managing material
    // in your organization
    readonly?: boolean;
    onCancel: () => void;
};

const MaterialDetails: FC<Props> = (props) => {
    const { data, refetch } = useQuery<MaterialQuery, MaterialQueryVariables>(
        user ? materialQuery.query : notLoggedInMaterialQuery,
        {
            variables: {
                id: `/materials/${props.materialId}`,
            },
        }
    );
    const material = data?.material;
    const storage = material?.storage;

    const handleRefetch = () => {
        window.setTimeout(() => {
            refetch();
        }, 1000);
    };

    if (!material?.storage?.isPublic && !user) {
        return (
            <Modal onCancel={props.onCancel} isVisible>
                <Card
                    style={{
                        paddingBottom: "60px", //equals padding of not allowed page
                    }}
                >
                    <NotAllowedPage />
                </Card>
            </Modal>
        );
    }

    if (material) {
        return (
            <Modal
                onCancel={props.onCancel}
                title={material?.title}
                isVisible={true}
            >
                <Card style={{ paddingBottom: "100px" }}>
                    <MaterialMetadata material={material} size="big" />
                    <br />
                    <ImagesViewer images={material.images || []} />
                    <p>
                        {material?.description
                            ? material?.description
                            : "Noch keine Beschreibung angegeben"}
                    </p>
                    <br />
                    <h2>Abholung</h2>
                    <strong>Lager:</strong>
                    <br />
                    {storage?.title}
                    <br />
                    <br />
                    <strong>Adresse:</strong>
                    <br />
                    {storage?.addressStreet}
                    <br />
                    {storage?.addressPostalCode} {storage?.addressCity}
                    <br />
                    <br />
                    <strong>Hinweise zur Abholung:</strong>
                    <Alert message={storage?.notes} type="info" />
                    <br />
                    <h2>Kontakt</h2>
                    {storage?.contact}
                    <br />
                    <br />
                    <Reservation
                        material={material}
                        readonly={props.readonly}
                        refetchMaterial={handleRefetch}
                    />
                    <br />
                    <br />
                    <Divider />
                    <h3>
                        Impressum der anbietenden Organisation (
                        {material.organization?.name})
                    </h3>
                    {material.organization?.imprint}
                    <br />
                    <br />
                    <Obfuscate
                        text="Verstoß melden"
                        href={`mailto:${mailAddresses.reportViolation}?subject=Verstoß für Material "${material.title}" (ID ${material._id})`}
                    />
                </Card>
            </Modal>
        );
    } else {
        return null;
    }
};

export default MaterialDetails;
