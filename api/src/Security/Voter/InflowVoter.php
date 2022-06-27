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

namespace App\Security\Voter;

use App\Doctrine\RestrictInflowExtension;
use App\Entity\Inflow;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class InflowVoter extends Voter
{
    protected function supports($attribute, $subject)
    {
        return in_array($attribute, ['INFLOW_CREATE', 'INFLOW_UPDATE', 'INFLOW_DELETE', 'INFLOW_READ'])
            && $subject instanceof Inflow;
    }

    protected function voteOnAttribute($attribute, $subject, TokenInterface $token)
    {
        /* @var $inflow Inflow */
        $inflow = $subject;
        $user = $token->getUser();

        // only logged in user should see inflows
        if ($user instanceof User) {
            if($user->hasRoleAdmin()) return true;

            /**
             * Both item_query and collection_query are protected using the corresponding extension.
             * {@see RestrictInflowExtension::applyToCollection()}
             * {@see RestrictInflowExtension::applyToItem()}
             */

            switch ($attribute) {
                case 'INFLOW_DELETE':
                case 'INFLOW_CREATE':
                case 'INFLOW_UPDATE':
                    if($user->getOrganization() === $inflow->getMaterial()->getOrganization()) {
                        return true;
                    }
                    break;
            }
        }

        // inflows will not be visible if not logged in
        // only computed numbers e.g. the sum will be visible
        return false;
    }
}
