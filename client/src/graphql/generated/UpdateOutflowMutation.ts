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

import { updateOutflowInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateOutflowMutation
// ====================================================

export interface UpdateOutflowMutation_updateOutflow_outflow_reservingOrganization {
    __typename: "Organization";
    id: string;
    name: string;
}

export interface UpdateOutflowMutation_updateOutflow_outflow {
    __typename: "OutflowItem";
    id: string;
    _id: number;
    pickedUpAt: string | null;
    quantity: number | null;
    reservationApprovedAt: string | null;
    reservingOrganization: UpdateOutflowMutation_updateOutflow_outflow_reservingOrganization | null;
}

export interface UpdateOutflowMutation_updateOutflow {
    __typename: "updateOutflowPayload";
    outflow: UpdateOutflowMutation_updateOutflow_outflow | null;
}

export interface UpdateOutflowMutation {
    /**
     * Updates a Outflow.
     */
    updateOutflow: UpdateOutflowMutation_updateOutflow | null;
}

export interface UpdateOutflowMutationVariables {
    input: updateOutflowInput;
}
