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

import { Tooltip } from "antd";
import Unit from "../Unit/Unit";

type Props = {
    total: number;
    reserved: number;
    pickedUp: number;
    unit: string;
};

const FlowProgress: FC<Props> = (props) => {
    const pickedUpPercent = (props.pickedUp / props.total) * 100;
    const reservedPercent = (props.reserved / props.total) * 100;
    const allPickedUp = props.pickedUp >= props.total;
    return (
        <div className="flowProgress">
            <Tooltip
                title={
                    !allPickedUp ? (
                        <span>
                            {props.pickedUp} <Unit unit={props.unit} /> abgeholt
                        </span>
                    ) : (
                        <span>
                            alles ({props.pickedUp} <Unit unit={props.unit} />)
                            abgeholt
                        </span>
                    )
                }
            >
                <div
                    className={
                        !allPickedUp
                            ? "flowProgress__pickedup"
                            : "flowProgress__allpickedup"
                    }
                    style={{
                        width: `${pickedUpPercent}%`,
                    }}
                />
            </Tooltip>

            <Tooltip
                title={
                    <span>
                        {props.pickedUp} <Unit unit={props.unit} /> reserviert
                    </span>
                }
            >
                <div
                    className="flowProgress__reserved"
                    style={{
                        width: `${reservedPercent}%`,
                    }}
                />
            </Tooltip>
        </div>
    );
};

export default FlowProgress;
