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

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OutflowFilter_exists, OutflowFilter_order } from "./globalTypes";

// ====================================================
// GraphQL query operation: OutflowsQuery
// ====================================================

export interface OutflowsQuery_outflows_edges_node_reservingOrganization {
    __typename: "Organization";
    name: string;
}

export interface OutflowsQuery_outflows_edges_node_material_images {
    __typename: "MediaObject";
    id: string;
    thumbnailUrl: string | null;
}

export interface OutflowsQuery_outflows_edges_node_material_storage {
    __typename: "Storage";
    title: string;
    addressPostalCode: string | null;
    addressCity: string | null;
}

export interface OutflowsQuery_outflows_edges_node_material {
    __typename: "Material";
    _id: number;
    id: string;
    title: string | null;
    /**
     * Edgecase:
     */
    isVisible: boolean | null;
    quantityUnit: string;
    availableQuantity: number;
    description: string | null;
    images: (OutflowsQuery_outflows_edges_node_material_images | null)[] | null;
    storage: OutflowsQuery_outflows_edges_node_material_storage | null;
}

export interface OutflowsQuery_outflows_edges_node {
    __typename: "OutflowCollection";
    id: string;
    _id: number;
    quantity: number | null;
    createdOn: string | null;
    pickedUpAt: string | null;
    comment: string | null;
    reservationApprovedAt: string | null;
    reservingOrganization: OutflowsQuery_outflows_edges_node_reservingOrganization | null;
    material: OutflowsQuery_outflows_edges_node_material | null;
}

export interface OutflowsQuery_outflows_edges {
    __typename: "OutflowCollectionEdge";
    node: OutflowsQuery_outflows_edges_node | null;
}

export interface OutflowsQuery_outflows {
    __typename: "OutflowCollectionConnection";
    totalCount: number;
    edges: (OutflowsQuery_outflows_edges | null)[] | null;
}

export interface OutflowsQuery {
    outflows: OutflowsQuery_outflows | null;
}

export interface OutflowsQueryVariables {
    first?: number | null;
    after?: string | null;
    material_id?: number | null;
    reservingOrganization_id?: number | null;
    materialOrganizationId?: number | null;
    exists?: OutflowFilter_exists | null;
    order?: OutflowFilter_order | null;
    search?: string | null;
}
