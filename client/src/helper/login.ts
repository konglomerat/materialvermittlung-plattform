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

import axios from "axios";
import history from "../history";

export const login = (
    email: String,
    password: String,
    failureCallback?: () => void,
    finallyCallback?: () => void
) => {
    axios
        // we lowercase the email here, because syomfony handles the login and we can't lowercase it there before being used
        .post("/api/authentication_token", {
            email: email.toLowerCase(),
            password,
        })
        .then((response) => {
            const urlSearchParams = new URLSearchParams(window.location.search);
            let redirectTo = "/";
            if (urlSearchParams.has("redirect")) {
                // @ts-ignore
                redirectTo = urlSearchParams.get("redirect");
            }
            history.push(redirectTo);
            // we trigger a hard reload of the page to get the corresponding
            // immutable user config -> `/client/public/index.html`
            window.location.reload();
        })
        .catch((response) => {
            if (failureCallback) {
                failureCallback();
            }
        })
        .finally(() => {
            if (finallyCallback) {
                finallyCallback();
            }
        });
};
