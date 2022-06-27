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
import { useMutation, useQuery } from "@apollo/react-hooks";
import { List, message } from "antd";
import moment from "moment";
import serverDateTime from "../../../helper/serverDateTime";

import {
    materialsQuery,
    materialsVariables,
    MaterialsQuery,
    MaterialsQueryVariables,
    MaterialsQueryNode,
} from "../../../graphql/queries/materials";

import user from "../../../userInfo";
import MaterialActions from "../../../components/MaterialActions/MaterialActions";
import MaterialListItem from "../../../components/MaterialListItem/MaterialListItem";
import FlowProgress from "../../../components/FlowProgress/FlowProgress";
import {
    updateMaterialMutation,
    UpdateMaterialMutation,
    UpdateMaterialMutationVariables,
} from "../../../graphql/mutations/updateMaterial";
import { routes } from "../../../history";

type Props = {
    onMaterialFlowClick: (material: MaterialsQueryNode) => void;
    search: string;
};

// TODO: endless scrolling
const Tab: FC<Props> = ({ onMaterialFlowClick, search }) => {
    const { loading, data, refetch } = useQuery<
        MaterialsQuery,
        MaterialsQueryVariables
    >(materialsQuery.query, {
        variables: materialsVariables.organizationOnlyActive(
            user!.organization!.id,
            search
        ),
        fetchPolicy: "no-cache",
    });
    const [updateMaterial] = useMutation<
        UpdateMaterialMutation,
        UpdateMaterialMutationVariables
    >(updateMaterialMutation.mutation, {
        onCompleted: () => {
            refetch();
            message.info("Anzeige wurde beendet.");
        },
    });

    const handleFinishClick = (materialId: string) => {
        // TODO: what to do with remaining material?
        updateMaterial({
            variables: {
                input: {
                    id: materialId,
                    isFinished: true,
                    visibleUntil: serverDateTime.now(),
                },
            },
        });
    };

    function renderTitle(title: string | null, visibleUntil: string | null) {
        const visibleUntilMoment = moment(visibleUntil);
        const ends = visibleUntilMoment.isValid()
            ? `(endet ${visibleUntilMoment.fromNow()})`
            : "(kein Enddatum angegeben)";

        return `${title || "KEIN TITEL"} ${ends}`;
    }

    return (
        <List
            itemLayout="vertical"
            loading={loading}
            size="large"
            dataSource={data?.materials?.edges || []}
            renderItem={(edge) => {
                const material = edge?.node;

                if (material) {
                    return (
                        <MaterialListItem
                            key={material.id}
                            material={material}
                            title={renderTitle(
                                material.title,
                                material.visibleUntil
                            )}
                            actions={
                                <>
                                    <MaterialActions.Flows
                                        material={material}
                                        onClick={onMaterialFlowClick}
                                    />
                                    <MaterialActions.Edit material={material} />
                                    <MaterialActions.Show
                                        material={material}
                                        route={routes.organizationActive}
                                    />
                                    <MaterialActions.Finish
                                        material={material}
                                        onClick={handleFinishClick}
                                    />
                                </>
                            }
                            description={
                                <>
                                    {material.description}
                                    <br />
                                    <FlowProgress
                                        total={material.inflowQuantity}
                                        reserved={material.reservedQuantity}
                                        pickedUp={material.pickedUpQuantity}
                                        unit={material.quantityUnit}
                                    />
                                </>
                            }
                        />
                    );
                }
                return null;
            }}
        />
    );
};

export default Tab;
