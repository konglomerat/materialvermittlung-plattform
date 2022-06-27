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

import { gql } from "apollo-boost";
import { MutationAndName } from "../types";
import * as createTypes from "../generated/CreateInflowMutation";

export const createInflowMutation: MutationAndName = {
    mutationName: "CreateInflowMutation",
    mutation: gql`
        mutation CreateInflowMutation($input: createInflowInput!) {
            createInflow(input: $input) {
                inflow {
                    id
                    _id
                    quantity
                    comment
                    createdOn
                    material {
                        id
                        _id
                        quantityUnit
                    }
                }
            }
        }
    `,
};

export type CreateInflowMutation = createTypes.CreateInflowMutation;
export type CreateInflowMutationVariables = createTypes.CreateInflowMutationVariables;
