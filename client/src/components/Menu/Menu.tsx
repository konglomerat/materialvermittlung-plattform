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

import React, { FC, useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Button } from "antd";
import OutsideClickHandler from "react-outside-click-handler";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import user from "../../userInfo";
import { routes } from "../../history";

interface MenuGroupProps {
    children?: string;
}

const MenuGroup: FC<MenuGroupProps> = ({ children }) => {
    return <small className="menu__group">{children}</small>;
};

const Menu: FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    // we prevent body scroll if a modal is opened
    // currently we assume that only one modal is open at the same time
    // and that the modal is closed by unmounting the component
    // TODO: check if other modal is open before removing the body scroll lock
    function onItemClick(callback?: () => void) {
        setIsOpen(false);
        if (callback) {
            callback();
        }
    }

    function renderMenu() {
        return (
            <div className="menu__container">
                <div className="menu__panel">
                    {user && (
                        <>
                            <div className="menu__user-info">
                                <small>Hallo {user.username}</small>
                            </div>
                            <MenuGroup />
                        </>
                    )}
                    <Link
                        to={routes.help}
                        className="menu__item"
                        onClick={() => onItemClick()}
                    >
                        <FormattedMessage id="menu.help" />
                    </Link>
                    <Link
                        to={routes.donate}
                        className="menu__item donation-link"
                        onClick={() => onItemClick()}
                    >
                        <FormattedMessage id="menu.donate" />
                    </Link>
                    <Link
                        to={routes.stories}
                        className="menu__item"
                        onClick={() => onItemClick()}
                    >
                        <FormattedMessage id="menu.materialgeschichten" />
                    </Link>
                    <Link
                        to={routes.index}
                        className="menu__item"
                        onClick={() => onItemClick()}
                    >
                        <FormattedMessage id="menu.allMaterial" />
                    </Link>
                    {!user ? (
                        <>
                            <MenuGroup />
                            <Link
                                to={routes.login}
                                className="menu__item"
                                onClick={() => onItemClick()}
                            >
                                <FormattedMessage id="menu.login" />
                            </Link>
                        </>
                    ) : null}
                    {user && (
                        <>
                            {!user.isAdmin && (
                                <>
                                    <MenuGroup>
                                        Material & Reservierungen
                                    </MenuGroup>
                                    <Link
                                        to={routes.organization}
                                        className="menu__item"
                                        onClick={() => onItemClick()}
                                    >
                                        <FormattedMessage id="menu.ourMaterial" />
                                    </Link>
                                    <Link
                                        to={
                                            routes.reservationsOnForeignMaterial
                                        }
                                        className="menu__item"
                                        onClick={() => onItemClick()}
                                    >
                                        <FormattedMessage id="menu.ourReservations" />
                                    </Link>
                                </>
                            )}

                            {(user.isAdmin || user.isOrgAdmin) && (
                                <>
                                    <MenuGroup>Administration</MenuGroup>
                                    <Link
                                        to={routes.admin.organization}
                                        className="menu__item"
                                        onClick={() => onItemClick()}
                                    >
                                        {user.isAdmin ? (
                                            <FormattedMessage id="menu.admin.organizations" />
                                        ) : (
                                            <FormattedMessage id="menu.admin.organization" />
                                        )}
                                    </Link>
                                    <Link
                                        to={routes.admin.accounts}
                                        className="menu__item"
                                        onClick={() => onItemClick()}
                                    >
                                        <FormattedMessage id="menu.admin.accounts" />
                                    </Link>
                                    <Link
                                        to={routes.admin.storage}
                                        className="menu__item"
                                        onClick={() => onItemClick()}
                                    >
                                        <FormattedMessage id="menu.admin.storage" />
                                    </Link>
                                </>
                            )}
                            <MenuGroup />
                            <Link
                                to={routes.logout}
                                className="menu__item"
                                onClick={() => onItemClick()}
                            >
                                <FormattedMessage id="menu.logout" />
                            </Link>
                        </>
                    )}
                    <MenuGroup />
                    <Link
                        to={routes.terms}
                        className="menu__item menu__item--small"
                        onClick={() => onItemClick()}
                    >
                        <FormattedMessage id="menu.terms" />
                    </Link>
                    {user ? (
                        <Link
                            to={routes.materialGuidelines}
                            className="menu__item menu__item--small"
                            onClick={() => onItemClick()}
                        >
                            <FormattedMessage id="menu.specialMaterialTerms" />
                        </Link>
                    ) : null}
                    <Link
                        to={routes.dataProtection}
                        className="menu__item menu__item--small"
                        onClick={() => onItemClick()}
                    >
                        <FormattedMessage id="menu.dataProtection" />
                    </Link>
                    <Link
                        to={routes.imprint}
                        className="menu__item menu__item--small"
                        onClick={() => onItemClick()}
                    >
                        <FormattedMessage id="menu.imprint" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
                <Button
                    className="menu__button"
                    onClick={() => setIsOpen(!isOpen)}
                    type="text"
                    icon={
                        <MenuOutlined
                            style={{
                                fontSize: "20px",
                            }}
                        />
                    }
                />
                {isOpen && renderMenu()}
            </OutsideClickHandler>
        </div>
    );
};

export default Menu;
