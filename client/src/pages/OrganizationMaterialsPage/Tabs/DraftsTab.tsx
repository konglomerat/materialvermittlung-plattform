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

import {
    materialsVariables,
    materialsQuery,
    MaterialsQuery,
} from "../../../graphql/queries/materials";

import user from "../../../userInfo";
import MaterialActions from "../../../components/MaterialActions/MaterialActions";
import MaterialListItem from "../../../components/MaterialListItem/MaterialListItem";
import { routes } from "../../../history";

interface Props {
    search: string;
}

// TODO: endless scrolling
const Tab: FC<Props> = ({ search }) => {
    const { loading, data } = useQuery<MaterialsQuery>(materialsQuery.query, {
        variables: materialsVariables.organizationOnlyDrafts(
            user!.organization!.id,
            search
        ),
        fetchPolicy: "no-cache",
    });

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
                            actions={
                                <>
                                    <MaterialActions.Publish
                                        material={material}
                                    />
                                    <MaterialActions.Edit material={material} />
                                    <MaterialActions.Show
                                        material={material}
                                        route={routes.organizationDrafts}
                                    />
                                </>
                            }
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
