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
    outflowsQuery,
    outflowsVariables,
    OutflowsQuery,
    OutflowsQueryVariables,
} from "../../../graphql/queries/outflows";

import {
    createOutflowMutation,
    CreateOutflowMutation,
    CreateOutflowMutationVariables,
} from "../../../graphql/mutations/createOutflow";

import FlowLine from "../../../components/FlowLine/FlowLine";
import { dropdowns } from "../../../clientConfig";

type Props = {
    material: MaterialsQueryNode;
    refetchMaterial: () => any;
};

// TODO: endless scrolling
const OutflowTab: FC<Props> = ({ material, refetchMaterial }) => {
    const [form] = Form.useForm();

    const handleError = (error: ApolloError) => {
        console.error(error);
    };

    const { loading: loadingOutflows, data, refetch } = useQuery<
        OutflowsQuery,
        OutflowsQueryVariables
    >(outflowsQuery.query, {
        variables: outflowsVariables.outflows(material._id),
        fetchPolicy: "no-cache",
    });
    const [createOutflow, { loading: loadingCreateOutflow }] = useMutation<
        CreateOutflowMutation,
        CreateOutflowMutationVariables
    >(createOutflowMutation.mutation, {
        onCompleted: ({ createOutflow }) => {
            refetchMaterial();
            refetch();
            form.resetFields();
        },
        onError: handleError,
    });
    const outflows = data?.outflows?.edges;

    const handleSubmit = (quantity: number, comment: string) => {
        // the user should only be able to reduce material that is available
        // -> might has to remove reservations that were not picked up
        const validQuantity =
            quantity <= material.availableQuantity
                ? quantity
                : material.availableQuantity;

        createOutflow({
            variables: {
                input: {
                    material: material.id,
                    quantity: validQuantity,
                    comment,
                },
            },
        });
    };

    if (loadingOutflows) {
        return <Spin />; //TODO: replace with <Skeleton/>
    }

    return (
        <>
            <FlowLine.Form
                disabled={material.availableQuantity <= 0}
                dropdownOptions={dropdowns.outflowComments}
                formRef={form}
                loading={loadingCreateOutflow}
                onSubmit={handleSubmit}
                quantityUnit={material.quantityUnit}
            />
            <div>
                {outflows?.map((edge) => {
                    const outflow = edge?.node;
                    if (outflow)
                        return (
                            <FlowLine.Line
                                key={outflow.id}
                                quantity={outflow.quantity}
                                quantityUnit={material.quantityUnit}
                                comment={
                                    outflow.reservingOrganization
                                        ? `Reservierung von ${outflow.reservingOrganization.name}`
                                        : outflow.comment
                                }
                            />
                        );
                })}
            </div>
        </>
    );
};

export default OutflowTab;
