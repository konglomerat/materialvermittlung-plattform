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

import { QueryAndName } from "../types";
import { gql } from "apollo-boost";

import * as featuresTypes from "../generated/MaterialQuery";

export const materialQuery: QueryAndName = {
    queryName: "MaterialQuery",
    query: gql`
        query MaterialQuery($id: ID!) {
            material(id: $id) {
                id
                _id
                title
                description
                isNew
                isDraft
                isFinished
                dimensions
                quantityUnit
                availableQuantity
                inflowQuantity
                pickedUpQuantity
                reservedQuantity
                publishAt
                updatedAt
                visibleUntil
                validationResults
                color
                dimensions
                isDraft
                isVisible
                disallowPartialReservations
                images {
                    id
                    thumbnailUrl
                    previewUrl
                    detailsUrl
                }
                storage {
                    id
                    _id
                    title
                    isPublic
                    notes
                    addressStreet
                    addressPostalCode
                    addressCity
                    contact
                }
                organization {
                    id
                    name
                    imprint
                    storages {
                        id
                        _id
                        title
                        isPublic
                    }
                }
                inflows {
                    edges {
                        node {
                            id
                            quantity
                            comment
                        }
                    }
                }
                outflows {
                    edges {
                        node {
                            id
                            quantity
                            pickedUpAt
                        }
                    }
                }
            }
        }
    `,
};

export const notLoggedInMaterialQuery = gql`
    query MaterialQueryNotLoggedIn($id: ID!) {
        material(id: $id) {
            id
            _id
            title
            description
            isNew
            isDraft
            isFinished
            quantityUnit
            availableQuantity
            inflowQuantity
            pickedUpQuantity
            reservedQuantity
            publishAt
            updatedAt
            visibleUntil
            validationResults
            color
            dimensions
            isDraft
            visibleUntil
            disallowPartialReservations
            images {
                id
                thumbnailUrl
                previewUrl
                detailsUrl
            }
            storage {
                id
                _id
                title
                isPublic
                notes
                addressStreet
                addressPostalCode
                addressCity
                contact
            }
            organization {
                name
                imprint
            }
        }
    }
`;

export type MaterialQuery = featuresTypes.MaterialQuery;
export type MaterialQueryVariables = featuresTypes.MaterialQueryVariables;
export type MaterialQueryMaterial = featuresTypes.MaterialQuery_material;
