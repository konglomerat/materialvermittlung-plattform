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

// ====================================================
// GraphQL query operation: MaterialQuery
// ====================================================

export interface MaterialQuery_material_images {
    __typename: "MediaObject";
    id: string;
    thumbnailUrl: string | null;
    previewUrl: string | null;
    detailsUrl: string | null;
}

export interface MaterialQuery_material_storage {
    __typename: "Storage";
    id: string;
    _id: number;
    title: string;
    isPublic: boolean | null;
    notes: string | null;
    addressStreet: string | null;
    addressPostalCode: string | null;
    addressCity: string | null;
    contact: string | null;
}

export interface MaterialQuery_material_organization_storages {
    __typename: "Storage";
    id: string;
    _id: number;
    title: string;
    isPublic: boolean | null;
}

export interface MaterialQuery_material_organization {
    __typename: "Organization";
    id: string;
    name: string;
    imprint: string | null;
    storages: (MaterialQuery_material_organization_storages | null)[] | null;
}

export interface MaterialQuery_material_inflows_edges_node {
    __typename: "InflowCollection";
    id: string;
    quantity: number;
    comment: string | null;
}

export interface MaterialQuery_material_inflows_edges {
    __typename: "InflowCollectionEdge";
    node: MaterialQuery_material_inflows_edges_node | null;
}

export interface MaterialQuery_material_inflows {
    __typename: "InflowCollectionConnection";
    edges: (MaterialQuery_material_inflows_edges | null)[] | null;
}

export interface MaterialQuery_material_outflows_edges_node {
    __typename: "OutflowCollection";
    id: string;
    quantity: number | null;
    pickedUpAt: string | null;
}

export interface MaterialQuery_material_outflows_edges {
    __typename: "OutflowCollectionEdge";
    node: MaterialQuery_material_outflows_edges_node | null;
}

export interface MaterialQuery_material_outflows {
    __typename: "OutflowCollectionConnection";
    edges: (MaterialQuery_material_outflows_edges | null)[] | null;
}

export interface MaterialQuery_material {
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
    /**
     * Edgecase:
     */
    isVisible: boolean | null;
    disallowPartialReservations: boolean | null;
    images: (MaterialQuery_material_images | null)[] | null;
    storage: MaterialQuery_material_storage | null;
    organization: MaterialQuery_material_organization | null;
    inflows: MaterialQuery_material_inflows | null;
    outflows: MaterialQuery_material_outflows | null;
}

export interface MaterialQuery {
    material: MaterialQuery_material | null;
}

export interface MaterialQueryVariables {
    id: string;
}
