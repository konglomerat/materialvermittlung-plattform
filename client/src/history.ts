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

import { createBrowserHistory } from "history";

const history = createBrowserHistory();

export default history;

export enum OrganizationMaterialLists {
    Drafts = "entwuerfe",
    Active = "aktiv",
    Finished = "abgeschlossen",
    reservations = "reservierungen",
}

export enum EditMaterialTabs {
    Images = "fotos",
    Features = "eigenschaften",
    Pickup = "abholung",
    Publish = "publizieren",
}

export const routes = {
    help: "/help",
    login: "/login",
    logout: "/logout",
    acceptTerms: "/account/agb-akzeptieren",
    organizationHasMissingInformation: "/fehlende-infos",
    userIsSuperAdmin: "/du-bist-admin",
    terms: "/nutzungsbedingungen",
    dataProtection: "/datenschutz",
    materialGuidelines: "/material-richtlinien",
    imprint: "/impressum",
    admin: {
        index: "/admin",
        accounts: "/admin/accounts",
        storage: "/admin/storage",
        organization: "/admin/organization",
    },
    stories: "/materialgeschichten",
    donate: "/spenden",
    index: "/",
    newMaterial: "/neu",
    reservationsOnForeignMaterial: "/reservierungen",
    material: (materialId: number) => `/material/${materialId}`,
    editMaterial: (materialId: number | string, tab?: EditMaterialTabs) =>
        `/material/${materialId}/bearbeiten/${tab || ""}`,
    organization: "/organisation",
    organizationDrafts: `/organisation/${OrganizationMaterialLists.Drafts}`,
    organizationActive: `/organisation/${OrganizationMaterialLists.Active}`,
    organizationFinished: `/organisation/${OrganizationMaterialLists.Finished}`,
};
