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

import { fieldsCacheConfig as materialsFieldsCacheConfig } from "./queries/materials";
import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { onError } from "apollo-link-error";

// FIX: `... as unknown as ApolloLink` otherwise client -> link will show a ts exception
// https://github.com/apollographql/apollo-client/issues/6011#issuecomment-619468320
const linkError: ApolloLink = (onError(({ networkError }) => {
    if (
        networkError &&
        // @ts-ignore
        networkError.result &&
        // @ts-ignore
        networkError.result.code === 401
    ) {
        // TODO: handle correctly, probably show some kind of error page
    }
}) as unknown) as ApolloLink;

// FIX: `... as unknown as ApolloLink` otherwise client -> link will show a ts exception
// https://github.com/apollographql/apollo-client/issues/6011#issuecomment-619468320
const uploadLink: ApolloLink = (createUploadLink() as unknown) as ApolloLink;

const client = new ApolloClient({
    // TODO: fix, brake after update of apollo
    link: linkError.concat(uploadLink),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    ...materialsFieldsCacheConfig,
                },
            },
        },
    }),
});

export default client;
