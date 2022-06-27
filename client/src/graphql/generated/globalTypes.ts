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

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface InflowFilter_order {
    createdOn?: string | null;
}

export interface MaterialFilter_order {
    publishAt?: string | null;
    visibleUntil?: string | null;
    updatedAt?: string | null;
}

export interface MaterialFilter_publishAt {
    before?: string | null;
    strictly_before?: string | null;
    after?: string | null;
    strictly_after?: string | null;
}

export interface MaterialFilter_visibleUntil {
    before?: string | null;
    strictly_before?: string | null;
    after?: string | null;
    strictly_after?: string | null;
}

export interface OutflowFilter_exists {
    pickedUpAt?: boolean | null;
    reservingOrganization?: boolean | null;
}

export interface OutflowFilter_order {
    pickedUpAt?: string | null;
    reservationApprovedAt?: string | null;
    createdOn?: string | null;
}

export interface approveReservationOutflowInput {
    id: string;
    clientMutationId?: string | null;
}

export interface createInflowInput {
    material: string;
    comment?: string | null;
    quantity: number;
    clientMutationId?: string | null;
}

export interface createMaterialInput {
    title?: string | null;
    quantityUnit: string;
    description?: string | null;
    dimensions?: string | null;
    color?: string | null;
    publishAt?: string | null;
    visibleUntil?: string | null;
    isDraft?: boolean | null;
    storage?: string | null;
    isFinished?: boolean | null;
    disallowPartialReservations?: boolean | null;
    clientMutationId?: string | null;
}

export interface createOutflowInput {
    material?: string | null;
    comment?: string | null;
    reservingOrganization?: string | null;
    quantity?: number | null;
    clientMutationId?: string | null;
}

export interface customDeleteOutflowInput {
    id: string;
    clientMutationId?: string | null;
}

export interface pickedUpReservationOutflowInput {
    id: string;
    quantity: number;
    clientMutationId?: string | null;
}

export interface updateInflowInput {
    id: string;
    material?: string | null;
    comment?: string | null;
    quantity?: number | null;
    clientMutationId?: string | null;
}

export interface updateMaterialInput {
    id: string;
    storage?: string | null;
    title?: string | null;
    description?: string | null;
    quantityUnit?: string | null;
    dimensions?: string | null;
    color?: string | null;
    publishAt?: string | null;
    visibleUntil?: string | null;
    isDraft?: boolean | null;
    disallowPartialReservations?: boolean | null;
    isFinished?: boolean | null;
    acceptTermsAndConditions?: boolean | null;
    clientMutationId?: string | null;
}

export interface updateOutflowInput {
    id: string;
    material?: string | null;
    comment?: string | null;
    reservingOrganization?: string | null;
    quantity?: number | null;
    clientMutationId?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
