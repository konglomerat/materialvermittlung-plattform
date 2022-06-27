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
// GraphQL query operation: MaterialQueryNotLoggedIn
// ====================================================

export interface MaterialQueryNotLoggedIn_material_images {
    __typename: "MediaObject";
    id: string;
    thumbnailUrl: string | null;
    previewUrl: string | null;
    detailsUrl: string | null;
}

export interface MaterialQueryNotLoggedIn_material_storage {
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

export interface MaterialQueryNotLoggedIn_material_organization {
    __typename: "Organization";
    name: string;
    imprint: string | null;
}

export interface MaterialQueryNotLoggedIn_material {
    __typename: "Material";
    id: string;
    _id: number;
    title: string | null;
    description: string | null;
    isNew: boolean | null;
    isDraft: boolean | null;
    isFinished: boolean | null;
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
    dimensions: string | null;
    disallowPartialReservations: boolean | null;
    images: (MaterialQueryNotLoggedIn_material_images | null)[] | null;
    storage: MaterialQueryNotLoggedIn_material_storage | null;
    organization: MaterialQueryNotLoggedIn_material_organization | null;
}

export interface MaterialQueryNotLoggedIn {
    material: MaterialQueryNotLoggedIn_material | null;
}

export interface MaterialQueryNotLoggedInVariables {
    id: string;
}
