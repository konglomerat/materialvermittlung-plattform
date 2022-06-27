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

type DropdownOption = {
    label: string;
    value: string;
};

type EnumReadableTextMapping = {
    [key: string]: string;
};

type Config = {
    dropdowns: {
        // see Enum/MaterialUnit.php
        materialUnits: DropdownOption[];
        // see Enum/MaterialFlowComments.php
        inflowComments: DropdownOption[];
        outflowComments: DropdownOption[];
    };
    enumTextMappings: {
        units: EnumReadableTextMapping;
        materialFlows: EnumReadableTextMapping;
    };
    defaults: {
        materialUnit: string;
    };
    urls: {
        admin: {
            accounts: string;
            storage: string;
            organization: string;
        };
    };
    mailAddresses: {
        reportViolation: string;
    };
};

const fallbackConfig: Config = {
    dropdowns: {
        materialUnits: [],
        inflowComments: [],
        outflowComments: [],
    },
    enumTextMappings: {
        units: {},
        materialFlows: {},
    },
    defaults: {
        materialUnit: "",
    },
    urls: {
        admin: {
            accounts: "",
            storage: "",
            organization: "",
        },
    },
    mailAddresses: {
        reportViolation: "",
    },
};

// @ts-ignore
const config: Config = window.materialvermittlung__config || fallbackConfig;

export const enumTextMappings = config.enumTextMappings;
export const dropdowns = config.dropdowns;
export const defaults = config.defaults;
export const serverUrls = config.urls;
export const mailAddresses = config.mailAddresses;
