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

import { Image } from "./Image";
import { Reservation } from "./Reservation";
import { Storage } from "./Storage";
import { Organization } from "./Organization";

export interface Material {
    id?: string; // iri, e.g. `/materials/9`
    _id?: string; // db-id, e.g. `9`
    isDraft?: boolean;
    name?: string;
    quantity?: number;
    availableQuantity?: number;
    quantityUnit?: string;
    description?: string;
    articleNumber?: string;
    color?: string;
    storage?: Storage;
    useContactFromStorage?: boolean;
    contactPersonOverwrite?: string;
    contactPhoneOverwrite?: string;
    contactEmailOverwrite?: string;
    allowPartialReservation?: boolean;
    organization?: Organization;
    images: {
        edges: [
            {
                node: Image;
            }?
        ];
    };
    reservations: {
        edges: [{ node: Reservation }];
    };
}
