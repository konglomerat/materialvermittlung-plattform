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

import { InflowFilter_order } from "./globalTypes";

// ====================================================
// GraphQL query operation: InflowsQuery
// ====================================================

export interface InflowsQuery_inflows_edges_node_material {
    __typename: "Material";
    quantityUnit: string;
}

export interface InflowsQuery_inflows_edges_node {
    __typename: "InflowCollection";
    id: string;
    _id: number;
    quantity: number;
    createdOn: string | null;
    comment: string | null;
    material: InflowsQuery_inflows_edges_node_material;
}

export interface InflowsQuery_inflows_edges {
    __typename: "InflowCollectionEdge";
    node: InflowsQuery_inflows_edges_node | null;
}

export interface InflowsQuery_inflows {
    __typename: "InflowCollectionConnection";
    edges: (InflowsQuery_inflows_edges | null)[] | null;
}

export interface InflowsQuery {
    inflows: InflowsQuery_inflows | null;
}

export interface InflowsQueryVariables {
    material_id: number;
    order?: InflowFilter_order | null;
}
