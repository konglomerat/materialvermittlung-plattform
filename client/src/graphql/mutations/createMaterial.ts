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
import * as createTypes from "../generated/CreateMaterialMutation";

export const createMaterialMutation: MutationAndName = {
    mutationName: "CreateMaterialMutation",
    mutation: gql`
        mutation CreateMaterialMutation($input: createMaterialInput!) {
            createMaterial(input: $input) {
                material {
                    _id
                }
            }
        }
    `,
};

export type CreateMaterialMutation = createTypes.CreateMaterialMutation;
export type CreateMaterialMutationVariables = createTypes.CreateMaterialMutationVariables;
