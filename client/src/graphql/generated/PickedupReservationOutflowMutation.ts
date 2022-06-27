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

import { pickedUpReservationOutflowInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: PickedupReservationOutflowMutation
// ====================================================

export interface PickedupReservationOutflowMutation_pickedUpReservationOutflow_outflow {
    __typename: "OutflowItem";
    id: string;
}

export interface PickedupReservationOutflowMutation_pickedUpReservationOutflow {
    __typename: "pickedUpReservationOutflowPayload";
    outflow: PickedupReservationOutflowMutation_pickedUpReservationOutflow_outflow | null;
}

export interface PickedupReservationOutflowMutation {
    /**
     * PickedUpReservations a Outflow.
     */
    pickedUpReservationOutflow: PickedupReservationOutflowMutation_pickedUpReservationOutflow | null;
}

export interface PickedupReservationOutflowMutationVariables {
    input: pickedUpReservationOutflowInput;
}
