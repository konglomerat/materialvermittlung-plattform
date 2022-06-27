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

import * as inflowsTypes from "../generated/InflowsQuery";

export const inflowsQuery: QueryAndName = {
    queryName: "InflowsQuery",
    query: gql`
        query InflowsQuery($material_id: Int!, $order: InflowFilter_order) {
            inflows(material_id: $material_id, order: $order, first: 100) {
                edges {
                    node {
                        id
                        _id
                        quantity
                        createdOn
                        comment
                        material {
                            quantityUnit
                        }
                    }
                }
            }
        }
    `,
};

export type InflowsQuery = inflowsTypes.InflowsQuery;
export type InflowsQueryVariables = inflowsTypes.InflowsQueryVariables;
