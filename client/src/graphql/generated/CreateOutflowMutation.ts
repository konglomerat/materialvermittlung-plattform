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

import { createOutflowInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateOutflowMutation
// ====================================================

export interface CreateOutflowMutation_createOutflow_outflow_reservingOrganization {
    __typename: "Organization";
    id: string;
    name: string;
}

export interface CreateOutflowMutation_createOutflow_outflow_material_images {
    __typename: "MediaObject";
    id: string;
    thumbnailUrl: string | null;
}

export interface CreateOutflowMutation_createOutflow_outflow_material_storage {
    __typename: "Storage";
    title: string;
    addressPostalCode: string | null;
    addressCity: string | null;
}

export interface CreateOutflowMutation_createOutflow_outflow_material {
    __typename: "Material";
    id: string;
    _id: number;
    title: string | null;
    description: string | null;
    quantityUnit: string;
    images:
        | (CreateOutflowMutation_createOutflow_outflow_material_images | null)[]
        | null;
    storage: CreateOutflowMutation_createOutflow_outflow_material_storage | null;
}

export interface CreateOutflowMutation_createOutflow_outflow {
    __typename: "OutflowItem";
    id: string;
    _id: number;
    quantity: number | null;
    comment: string | null;
    createdOn: string | null;
    pickedUpAt: string | null;
    reservationApprovedAt: string | null;
    reservingOrganization: CreateOutflowMutation_createOutflow_outflow_reservingOrganization | null;
    material: CreateOutflowMutation_createOutflow_outflow_material | null;
}

export interface CreateOutflowMutation_createOutflow {
    __typename: "createOutflowPayload";
    outflow: CreateOutflowMutation_createOutflow_outflow | null;
}

export interface CreateOutflowMutation {
    /**
     * Creates a Outflow.
     */
    createOutflow: CreateOutflowMutation_createOutflow | null;
}

export interface CreateOutflowMutationVariables {
    input: createOutflowInput;
}
