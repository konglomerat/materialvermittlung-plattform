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

import moment from "moment";
import { gql } from "apollo-boost";
import { QueryAndName } from "../types";
import * as materialsTypes from "../generated/MaterialsQuery";
import { relayStylePagination } from "@apollo/client/utilities";

// Fragments
const fragments = {
    // needed to make endless scrolling work correctly
    PageInfo: gql`
        fragment PageInfo on MaterialConnection {
            totalCount
            pageInfo {
                endCursor
                startCursor
                hasNextPage
                hasPreviousPage
            }
        }
    `,
    Material: gql`
        fragment Material on Material {
            id
            _id
            title
            description
            isNew
            isDraft
            isFinished
            dimensions
            quantityUnit
            availableQuantity
            inflowQuantity
            pickedUpQuantity
            reservedQuantity
            publishAt
            updatedAt
            visibleUntil
            validationResults
            color
            organization {
                id
                name
                imprint
            }
            images {
                id
                previewUrl
                thumbnailUrl
            }
            storage {
                title
                isPublic
                notes
                addressStreet
                addressPostalCode
                addressCity
                contact
            }
        }
    `,
};

// Queries and corresponding Types

// MATERIALS
export const materialsQuery: QueryAndName = {
    queryName: "MaterialsQuery",
    query: gql`
        query MaterialsQuery(
            $first: Int
            $after: String
            $isDraft: Boolean
            $isFinished: Boolean
            $organization_id: Int
            $publishAt: MaterialFilter_publishAt
            $visibleUntil: MaterialFilter_visibleUntil
            $order: MaterialFilter_order
            $hasAvailableQuantity: Boolean
            $search: String
        ) {
            materials(
                first: $first
                after: $after
                isDraft: $isDraft
                isFinished: $isFinished
                organization_id: $organization_id
                publishAt: $publishAt
                visibleUntil: $visibleUntil
                order: $order
                hasAvailableQuantity: $hasAvailableQuantity
                search: $search
            ) {
                ...PageInfo
                edges {
                    node {
                        ...Material
                    }
                }
            }
        }
        ${fragments.PageInfo}
        ${fragments.Material}
    `,
};

export type MaterialsQuery = materialsTypes.MaterialsQuery;
export type MaterialsQueryNode = materialsTypes.MaterialsQuery_materials_edges_node;
export type MaterialsQueryImage = materialsTypes.MaterialsQuery_materials_edges_node_images;
export type MaterialsQueryVariables = materialsTypes.MaterialsQueryVariables;

export const materialsVariables = {
    fetchMore: (
        first: number,
        after?: string | null
    ): MaterialsQueryVariables => {
        return {
            first,
            after,
        };
    },
    publicOrExclusiveForLoggedInUser: (
        first: number,
        search: string
    ): MaterialsQueryVariables => {
        const now = moment().format();
        return {
            isDraft: false,
            first,
            publishAt: {
                before: now,
            },
            visibleUntil: {
                after: now,
            },
            // visibility not enforced by the backend
            // depending on the user
            hasAvailableQuantity: true,
            search,
        };
    },
    organizationOnlyDrafts: (
        organization_id?: number,
        search?: string
    ): MaterialsQueryVariables => {
        return {
            first: 200,
            organization_id,
            isDraft: true,
            order: {
                updatedAt: "DESC",
            },
            search,
        };
    },
    organizationOnlyActive: (
        organization_id?: number,
        search?: string
    ): MaterialsQueryVariables => {
        return {
            first: 200,
            organization_id,
            isDraft: false,
            isFinished: false,
            order: { updatedAt: "DESC" },
            search,
        };
    },
    organizationOnlyFinished: (
        organization_id?: number,
        search?: string
    ): MaterialsQueryVariables => {
        return {
            first: 200,
            organization_id,
            isFinished: true,
            order: { updatedAt: "DESC" },
            search,
        };
    },
};

// Apollo Client Cache Config for Endless Scrolling

// see apollo client
export const fieldsCacheConfig = {
    // https://www.apollographql.com/docs/react/pagination/cursor-based/#relay-style-cursor-pagination
    materials: relayStylePagination(),
};
