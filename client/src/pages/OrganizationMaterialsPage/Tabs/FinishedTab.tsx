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
import { useQuery } from "@apollo/react-hooks";
import { List } from "antd";
import moment from "moment";

import {
    materialsVariables,
    materialsQuery,
    MaterialsQuery,
    MaterialsQueryVariables,
    MaterialsQueryNode,
} from "../../../graphql/queries/materials";

import user from "../../../userInfo";
import MaterialActions from "../../../components/MaterialActions/MaterialActions";
import MaterialListItem from "../../../components/MaterialListItem/MaterialListItem";
import { routes } from "../../../history";

type Props = {
    onMaterialFlowClick: (material: MaterialsQueryNode) => void;
    search: string;
};

const Tab: FC<Props> = ({ onMaterialFlowClick, search }) => {
    const { loading, data } = useQuery<MaterialsQuery, MaterialsQueryVariables>(
        materialsQuery.query,
        {
            variables: materialsVariables.organizationOnlyFinished(
                user!.organization!.id,
                search
            ),
            fetchPolicy: "no-cache",
        }
    );

    // TODO: endless scrolling
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
                            title={`${material.title} (${moment(
                                material.visibleUntil
                            ).fromNow()})`}
                            actions={[
                                <MaterialActions.Flows
                                    material={material}
                                    onClick={onMaterialFlowClick}
                                />,
                                <MaterialActions.Show
                                    material={material}
                                    route={routes.organizationFinished}
                                />,
                            ]}
                            description={material.description}
                        />
                    );
                }
                return null;
            }}
        />
    );
};

export default Tab;
