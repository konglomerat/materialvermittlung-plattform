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
import client from "./graphql/client";
import {
    Redirect,
    Route,
    Router,
    Switch,
    match,
    RouteProps,
} from "react-router-dom";
import history, { routes } from "./history";
import { ApolloProvider } from "@apollo/react-hooks";
import { IntlProvider } from "react-intl";
import de from "./de";
import moment from "moment";

import { ConfigProvider } from "antd";

import deDE from "antd/lib/locale/de_DE";

import OrganizationMaterialsPage from "./pages/OrganizationMaterialsPage/OrganizationMaterialsPage";
import NewMaterialPage from "./pages/NewMaterialPage";
import ActivateAccountPage from "./pages/ActivateAccountPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import EditMaterialPage from "./pages/EditMaterialPage/EditMaterialPage";
import OrganizationReservationsPage from "./pages/OrganizationReservationsPage/OrganizationReservationsPage";
import NotFoundPage from "./pages/NotFoundPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import TermsPage from "./pages/LegalPages/TermsPage";
import DataProtectionPage from "./pages/LegalPages/DataProtectionPage";
import MaterialGuidelinesPage from "./pages/LegalPages/MaterialGuidelinesPage";
import AcceptTermsPage from "./pages/AcceptTermsPage";
import DonationPage from "./pages/DonationPage";
import ImprintPage from "./pages/LegalPages/ImprintPage";

import logout from "./helper/logout";
import user from "./userInfo";

// Moment Localization
import "moment/locale/de";
import Layout from "./components/Layouts/Layout";
import { serverUrls } from "./clientConfig";
import OrganizationNotFullyDefined from "./pages/OrganizationNotFullyDefined";
import LoggedInAsSuperAdmin from "./pages/LoggedInAsSuperAdmin";
import DonationButton from "./components/DonationButton/DonationButton";
import HelpPage from "./pages/HelpPage";

moment.locale("de");

function redirectToAdminUi(
    location: match<{ subMenu: "accounts" | "storage" | "organization" }>
) {
    let adminUrl;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        adminUrl = "https://localhost:443/admin";
    } else {
        adminUrl = "/admin";
    }
    const subMenu = location.params.subMenu;
    if (subMenu) {
        switch (subMenu) {
            case "accounts":
                adminUrl = serverUrls.admin.accounts;
                break;
            case "storage":
                adminUrl = serverUrls.admin.storage;
                break;
            case "organization":
                adminUrl = serverUrls.admin.organization;
                break;
        }
    }

    window.location.href = adminUrl;
    return null;
}

const ValidateUserRoute: FC<RouteProps & { isPrivate?: boolean }> = ({
    isPrivate,
    children,
    component,
    ...rest
}) => {
    const originalPathname = window.location.pathname;
    const redirectPathname = (() => {
        if (!user && isPrivate) {
            return routes.login;
        }
        if (user && user.isAdmin) {
            return routes.userIsSuperAdmin;
        }
        if (user && !user.hasAcceptedTerms) {
            return routes.acceptTerms;
        }
        if (
            user?.organization &&
            !(
                user.organization.hasNotificationMailAddresses &&
                user.organization.hasImprint
            )
        ) {
            return routes.organizationHasMissingInformation;
        }

        // No redirect needed
        return null;
    })();

    const shouldRedirect =
        redirectPathname && redirectPathname !== originalPathname;

    if (!shouldRedirect) {
        return <Route {...rest} component={component} />;
    } else {
        return (
            <Route
                {...rest}
                render={({ location }) => {
                    return (
                        <Redirect
                            to={{
                                pathname: redirectPathname || "/",
                                state: { from: location },
                            }}
                        />
                    );
                }}
            />
        );
    }
};

const App: FC = () => {
    //const pathname = window.location.pathname;
    return (
        <IntlProvider messages={de} locale="de" defaultLocale="de">
            <ApolloProvider client={client}>
                <ConfigProvider locale={deDE}>
                    <Router history={history}>
                        <Layout>
                            <DonationButton />
                            <Switch>
                                {
                                    // ############ MAIL REDIRECTS ###########
                                    // As we cannot change the links in a mail once we send it
                                    // we use aliases instead this way we can easily reafactor later.
                                }
                                <Route
                                    exact
                                    path="/mail-link/deine-reservierten-materialien"
                                >
                                    <Redirect to="/reservierungen" />
                                </Route>
                                <Route
                                    exact
                                    path="/mail-link/reservierte-materialien"
                                >
                                    <Redirect to="/organisation/reservierungen" />
                                </Route>
                                <Route exact path="/mail-link/material">
                                    <Redirect to="/" />
                                </Route>

                                {
                                    // ############ ACCOUNTS ###########
                                    // should not be protected as we need the user to be able to load the UI
                                }
                                <Route
                                    path="/account/aktivieren"
                                    component={ActivateAccountPage}
                                />

                                <Route
                                    path="/account/passwort-vergessen"
                                    component={ForgotPasswordPage}
                                />

                                {
                                    // ############ PUBLIC PAGES ###########
                                    // you can see the pages if not logged in but if you login and e.g. have missing
                                    // information for your organization you will not see anything but a page with a notification
                                    // The user can log out again to see public pages. This way we force the user to provide
                                    // the needed information. It would be harder to display the material list as we would have
                                    // to disable some functionality for other components if the user is logged in but
                                    // but is not valid.
                                }

                                <ValidateUserRoute
                                    path={[
                                        routes.index,
                                        routes.login,
                                        routes.stories,
                                        "/material/:materialId?",
                                    ]}
                                    exact
                                    strict
                                    component={LandingPage}
                                />

                                <ValidateUserRoute
                                    isPrivate
                                    path={routes.acceptTerms}
                                    component={AcceptTermsPage}
                                />

                                <ValidateUserRoute
                                    isPrivate
                                    path={
                                        routes.organizationHasMissingInformation
                                    }
                                    component={OrganizationNotFullyDefined}
                                />

                                {
                                    // ############ LEGAL STUFF ###########
                                    // should always be accessible
                                }

                                <Route
                                    exact
                                    path={routes.terms}
                                    component={TermsPage}
                                />
                                <Route
                                    exact
                                    path={routes.dataProtection}
                                    component={DataProtectionPage}
                                />
                                <Route
                                    exact
                                    path={routes.imprint}
                                    component={ImprintPage}
                                />
                                {/* only visible for logged in users as they create material */}
                                <ValidateUserRoute
                                    isPrivate
                                    exact
                                    path={routes.materialGuidelines}
                                    component={MaterialGuidelinesPage}
                                />

                                {
                                    // ############ LOGOUT / PREVENT DEADLOCK ###########
                                    // should always be accessible
                                }

                                <Route
                                    path={routes.logout}
                                    render={() => {
                                        logout();
                                        return null;
                                    }}
                                />

                                {
                                    // ############ LOGGED IN / WORKING WITH MATERIAL ###########
                                    // you can only do so if your user an organization is valid
                                }

                                <ValidateUserRoute
                                    isPrivate
                                    path="/material/:materialId/bearbeiten/:editTab?"
                                    component={EditMaterialPage}
                                />

                                <ValidateUserRoute
                                    isPrivate
                                    path="/neu/:editTab?"
                                    component={NewMaterialPage}
                                />

                                <ValidateUserRoute
                                    isPrivate
                                    path="/organisation/:tab?/:materialId?"
                                    exact
                                    component={OrganizationMaterialsPage}
                                />
                                <ValidateUserRoute
                                    isPrivate
                                    path="/reservierungen/:tab?"
                                    exact
                                    component={OrganizationReservationsPage}
                                />

                                {
                                    // ############ ADMIN ###########
                                    // As a super admin your should not use the react ui. This is why we will always
                                    // redirect the user to a page with the corresponding notification.
                                    //
                                    // The other routes should be accessible as we want the user to be abled to fix the
                                    // issues stated on a page e.g. if the imprint is missing. This is to prevent a deadlock.
                                }

                                <ValidateUserRoute
                                    isPrivate
                                    path={routes.userIsSuperAdmin}
                                    exact
                                    component={LoggedInAsSuperAdmin}
                                />

                                <Route
                                    path="/admin/:subMenu?"
                                    render={
                                        user?.isAdmin || user?.isOrgAdmin
                                            ? (routeProps) =>
                                                  redirectToAdminUi(
                                                      routeProps.match
                                                  )
                                            : () => <NotFoundPage />
                                    }
                                />
                                <Route
                                    path={routes.donate}
                                    component={DonationPage}
                                />

                                <Route
                                    path={routes.help}
                                    component={HelpPage}
                                />

                                {
                                    // ######### Not Found #########
                                }
                                <Route component={NotFoundPage} />
                            </Switch>
                        </Layout>
                    </Router>
                </ConfigProvider>
            </ApolloProvider>
        </IntlProvider>
    );
};

export default App;
