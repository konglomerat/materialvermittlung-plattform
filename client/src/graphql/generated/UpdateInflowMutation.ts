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

import { updateInflowInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateInflowMutation
// ====================================================

export interface UpdateInflowMutation_updateInflow_inflow {
    __typename: "InflowItem";
    id: string;
    _id: number;
    quantity: number;
}

export interface UpdateInflowMutation_updateInflow {
    __typename: "updateInflowPayload";
    inflow: UpdateInflowMutation_updateInflow_inflow | null;
}

export interface UpdateInflowMutation {
    /**
     * Updates a Inflow.
     */
    updateInflow: UpdateInflowMutation_updateInflow | null;
}

export interface UpdateInflowMutationVariables {
    input: updateInflowInput;
}
