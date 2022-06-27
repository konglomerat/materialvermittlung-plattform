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

namespace App\ORM;

use App\Entity\Outflow;
use App\Service\MailService;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class OutflowListener
{
    private $mailService;

    public function __construct(MailService $mailService) {
        $this->mailService = $mailService;
    }

    // first creation of an outflow
    public function prePersist(Outflow $outflow, LifecycleEventArgs $args)
    {
        // if needed for fixture generation
        if (!$outflow->getCreatedOn()) {
            $outflow->setCreatedOn(new \DateTime());
        }
    }
}
