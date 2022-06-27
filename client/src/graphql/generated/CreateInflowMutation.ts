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

import { createInflowInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateInflowMutation
// ====================================================

export interface CreateInflowMutation_createInflow_inflow_material {
    __typename: "Material";
    id: string;
    _id: number;
    quantityUnit: string;
}

export interface CreateInflowMutation_createInflow_inflow {
    __typename: "InflowItem";
    id: string;
    _id: number;
    quantity: number;
    comment: string | null;
    createdOn: string | null;
    material: CreateInflowMutation_createInflow_inflow_material;
}

export interface CreateInflowMutation_createInflow {
    __typename: "createInflowPayload";
    inflow: CreateInflowMutation_createInflow_inflow | null;
}

export interface CreateInflowMutation {
    /**
     * Creates a Inflow.
     */
    createInflow: CreateInflowMutation_createInflow | null;
}

export interface CreateInflowMutationVariables {
    input: createInflowInput;
}
