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

import {
    MaterialFilter_publishAt,
    MaterialFilter_visibleUntil,
    MaterialFilter_order,
} from "./globalTypes";

// ====================================================
// GraphQL query operation: MaterialsQuery
// ====================================================

export interface MaterialsQuery_materials_pageInfo {
    __typename: "MaterialPageInfo";
    endCursor: string | null;
    startCursor: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface MaterialsQuery_materials_edges_node_organization {
    __typename: "Organization";
    id: string;
    name: string;
    imprint: string | null;
}

export interface MaterialsQuery_materials_edges_node_images {
    __typename: "MediaObject";
    id: string;
    previewUrl: string | null;
    thumbnailUrl: string | null;
}

export interface MaterialsQuery_materials_edges_node_storage {
    __typename: "Storage";
    title: string;
    isPublic: boolean | null;
    notes: string | null;
    addressStreet: string | null;
    addressPostalCode: string | null;
    addressCity: string | null;
    contact: string | null;
}

export interface MaterialsQuery_materials_edges_node {
    __typename: "Material";
    id: string;
    _id: number;
    title: string | null;
    description: string | null;
    isNew: boolean | null;
    isDraft: boolean | null;
    isFinished: boolean | null;
    dimensions: string | null;
    quantityUnit: string;
    availableQuantity: number;
    inflowQuantity: number;
    pickedUpQuantity: number;
    reservedQuantity: number;
    publishAt: string | null;
    updatedAt: string | null;
    visibleUntil: string | null;
    validationResults: any;
    color: string | null;
    organization: MaterialsQuery_materials_edges_node_organization | null;
    images: (MaterialsQuery_materials_edges_node_images | null)[] | null;
    storage: MaterialsQuery_materials_edges_node_storage | null;
}

export interface MaterialsQuery_materials_edges {
    __typename: "MaterialEdge";
    node: MaterialsQuery_materials_edges_node | null;
}

export interface MaterialsQuery_materials {
    __typename: "MaterialConnection";
    totalCount: number;
    pageInfo: MaterialsQuery_materials_pageInfo;
    edges: (MaterialsQuery_materials_edges | null)[] | null;
}

export interface MaterialsQuery {
    materials: MaterialsQuery_materials | null;
}

export interface MaterialsQueryVariables {
    first?: number | null;
    after?: string | null;
    isDraft?: boolean | null;
    isFinished?: boolean | null;
    organization_id?: number | null;
    publishAt?: MaterialFilter_publishAt | null;
    visibleUntil?: MaterialFilter_visibleUntil | null;
    order?: MaterialFilter_order | null;
    hasAvailableQuantity?: boolean | null;
    search?: string | null;
}
