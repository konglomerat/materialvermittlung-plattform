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

import React, { FC, useEffect, useState } from "react";
import { useHistory, useRouteMatch, Redirect } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import Modal from "../../components/Modal/Modal";
import Logo from "../../components/Logo/Logo";
import { Card, Empty } from "antd";

import MaterialDetails from "../../components/MaterialDetails/MaterialDetails";
import MaterialTiles from "../../components/MaterialTiles/MaterialTiles";
import MaterialListTile, {
    getNumberOfTilesForBackground,
} from "../../components/MaterialTiles/MaterialTiles.Tile";
import StoriesFeed from "./StoriesFeed";
import LoginForm from "./LoginForm";
import {
    materialsQuery,
    MaterialsQuery,
    MaterialsQueryVariables,
    materialsVariables,
} from "../../graphql/queries/materials";
import useFetchMoreOnScroll from "../../hooks/useFetchMoreOnScroll";
import user from "../../userInfo";
import { routes } from "../../history";
import Content from "../../components/Layouts/Content";
import { MaterialsQuery_materials_edges } from "../../graphql/generated/MaterialsQuery";
import SearchInput from "../../components/Search/SearchInput";
import SearchInputPortal from "../../components/Search/SearchInputPortal";

const first = getNumberOfTilesForBackground();

const LandingPage: FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const location = useRouteMatch();
    const history = useHistory();

    const { data, fetchMore, refetch } = useQuery<
        MaterialsQuery,
        MaterialsQueryVariables
    >(materialsQuery.query, {
        variables: materialsVariables.publicOrExclusiveForLoggedInUser(
            first,
            searchTerm
        ),
    });

    useEffect(() => {
        refetch(
            materialsVariables.publicOrExclusiveForLoggedInUser(
                first,
                searchTerm
            )
        );
    }, [searchTerm, refetch]);

    useFetchMoreOnScroll(!!data?.materials?.pageInfo.hasNextPage, () => {
        console.log("useFetchMoreOnScroll");
        return fetchMore({
            variables: materialsVariables.fetchMore(
                first,
                data?.materials?.pageInfo.endCursor
            ),
        });
    });

    const handleSearchChange = (search: string) => {
        setSearchTerm(search);
    };

    const renderModal = () => {
        // @ts-ignore
        const materialId = location.params.materialId as string | undefined;
        if (materialId) {
            return (
                <MaterialDetails
                    materialId={Number(materialId)}
                    onCancel={() => {
                        history.push(routes.index);
                    }}
                />
            );
        }
        switch (location.path) {
            case routes.stories:
                return (
                    <Modal
                        onCancel={() => history.push(routes.index)}
                        title="Materialgeschichten"
                        isVisible={true}
                    >
                        <StoriesFeed />
                    </Modal>
                );
            case routes.login:
                if (user) {
                    return <Redirect to={routes.index} />;
                } else {
                    return (
                        <Modal
                            center={true}
                            size="small"
                            onCancel={() => history.push(routes.index)}
                            isVisible={true}
                        >
                            <Card>
                                <Logo style={{ height: "80px" }} />
                            </Card>
                            <Card>
                                <LoginForm />
                            </Card>
                        </Modal>
                    );
                }
            default:
            case routes.index:
                return null;
        }
    };

    const modal = renderModal();

    return (
        <Content noPadding wide>
            {modal}
            <SearchInputPortal>
                <SearchInput onSearchChange={handleSearchChange} />
            </SearchInputPortal>
            {data && data.materials && data?.materials?.totalCount > 0 ? (
                <MaterialTiles>
                    {data?.materials?.edges?.map(
                        (edge: MaterialsQuery_materials_edges | null) => {
                            const material = edge?.node;
                            if (material) {
                                return (
                                    <MaterialListTile.Default
                                        key={material.id}
                                        material={material}
                                    />
                                );
                            }
                        }
                    )}
                </MaterialTiles>
            ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
        </Content>
    );
};

export default LandingPage;
