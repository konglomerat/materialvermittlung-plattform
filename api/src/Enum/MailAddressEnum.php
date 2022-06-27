<?php
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

namespace App\Enum;


abstract class MailAddressEnum {
    // is used by the MailService to send mails
    const RESERVATION_SENDER = 'zuendstoffe@materialvermittlung.org';

    // will be accessible in the frontend to report material
    const REPORT_VIOLATION = 'abuse@materialvermittlung.org';
}
