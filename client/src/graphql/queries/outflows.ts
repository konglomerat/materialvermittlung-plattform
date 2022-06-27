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

import { QueryAndName } from "../types";
import { gql } from "apollo-boost";

import * as outflowsTypes from "../generated/OutflowsQuery";

export const outflowsQuery: QueryAndName = {
    queryName: "OutflowsQuery",
    query: gql`
        query OutflowsQuery(
            $first: Int
            $after: String
            $material_id: Int
            $reservingOrganization_id: Int
            $materialOrganizationId: Int
            $exists: OutflowFilter_exists
            $order: OutflowFilter_order
            $search: String
        ) {
            outflows(
                material_id: $material_id
                reservingOrganization_id: $reservingOrganization_id
                material_organization_id: $materialOrganizationId
                exists: $exists
                order: $order
                first: $first
                after: $after
                search: $search
            ) {
                totalCount
                edges {
                    node {
                        id
                        _id
                        quantity
                        createdOn
                        pickedUpAt
                        comment
                        reservationApprovedAt
                        reservingOrganization {
                            name
                        }
                        material {
                            _id
                            id
                            title
                            isVisible
                            quantityUnit
                            availableQuantity
                            description
                            images {
                                id
                                thumbnailUrl
                            }
                            storage {
                                title
                                addressPostalCode
                                addressCity
                            }
                        }
                    }
                }
            }
        }
    `,
};

export type OutflowsQuery = outflowsTypes.OutflowsQuery;
export type OutflowsQueryNode = outflowsTypes.OutflowsQuery_outflows_edges_node;
export type OutflowsQueryVariables = outflowsTypes.OutflowsQueryVariables;

export const outflowsVariables = {
    reservations: (materialId: number): OutflowsQueryVariables => {
        return {
            first: 100,
            material_id: materialId,
            exists: {
                reservingOrganization: true,
            },
            order: {
                pickedUpAt: "DESC",
            },
        };
    },
    reservationsByOrg: (
        orgId: number,
        search: string
    ): OutflowsQueryVariables => {
        return {
            first: 100,
            // to only see reservations by my organization
            reservingOrganization_id: orgId,
            exists: {
                pickedUpAt: false,
            },
            order: {
                reservationApprovedAt: "DESC",
            },
            search,
        };
    },
    reservationsForOrgMaterials: (
        orgId: number,
        search: string
    ): OutflowsQueryVariables => {
        return {
            first: 100,
            // to only see reservations for material of my organization
            materialOrganizationId: orgId,
            exists: {
                pickedUpAt: false,
                reservingOrganization: true,
            },
            order: {
                reservationApprovedAt: "DESC",
            },
            search,
        };
    },
    outflows: (materialId: number): OutflowsQueryVariables => {
        return {
            first: 100,
            material_id: materialId,
            order: {
                createdOn: "DESC",
            },
            exists: {
                pickedUpAt: true,
            },
        };
    },
};
