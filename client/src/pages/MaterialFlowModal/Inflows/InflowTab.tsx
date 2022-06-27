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

import React, { FC } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Spin, Form } from "antd";
import { ApolloError } from "apollo-client";

import { MaterialsQueryNode } from "../../../graphql/queries/materials";
import {
    inflowsQuery,
    InflowsQuery,
    InflowsQueryVariables,
} from "../../../graphql/queries/inflows";
import FlowLine from "../../../components/FlowLine/FlowLine";

import {
    createInflowMutation,
    CreateInflowMutation,
    CreateInflowMutationVariables,
} from "../../../graphql/mutations/createInflow";

import { dropdowns } from "../../../clientConfig";

type Props = {
    material: MaterialsQueryNode;
    refetchMaterial: () => any;
};

// TODO: endless scrolling
const InflowTab: FC<Props> = ({ material, refetchMaterial }) => {
    const [form] = Form.useForm();

    const handleError = (error: ApolloError) => {
        console.error(error);
    };

    const { loading: loadingInflows, data, refetch } = useQuery<
        InflowsQuery,
        InflowsQueryVariables
    >(inflowsQuery.query, {
        variables: {
            material_id: material._id,
            order: {
                createdOn: "DESC",
            },
        },
        fetchPolicy: "no-cache",
    });
    const [createInflow, { loading: loadingCreateInflow }] = useMutation<
        CreateInflowMutation,
        CreateInflowMutationVariables
    >(createInflowMutation.mutation, {
        onCompleted: ({ createInflow }) => {
            refetchMaterial();
            refetch();
            form.resetFields();
        },
        onError: handleError,
    });
    const inflows = data?.inflows?.edges;

    const handleSubmit = (quantity: number, comment: string) => {
        if (quantity) {
            createInflow({
                variables: {
                    input: {
                        material: material.id,
                        quantity: quantity,
                        comment: comment,
                    },
                },
            });
        }
    };

    if (loadingInflows) {
        return <Spin />; //TODO: replace with <Skeleton/>
    }

    return (
        <>
            <FlowLine.Form
                formRef={form}
                quantityUnit={material.quantityUnit}
                onSubmit={handleSubmit}
                dropdownOptions={dropdowns.inflowComments}
                loading={loadingCreateInflow}
            />

            <div>
                {inflows?.map((edge) => {
                    const inflow = edge?.node;
                    if (inflow)
                        return (
                            <FlowLine.Line
                                quantity={inflow.quantity}
                                quantityUnit={material.quantityUnit}
                                comment={inflow.comment}
                                key={inflow.id}
                            />
                        );
                })}
            </div>
        </>
    );
};

export default InflowTab;
