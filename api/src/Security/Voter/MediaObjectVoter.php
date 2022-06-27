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

use App\Entity\MediaObject;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class MediaObjectVoter extends Voter
{
    protected function supports($attribute, $subject)
    {
        return in_array($attribute, ['MEDIA_OBJECT_DELETE', 'MEDIA_OBJECT_UPDATE'])
            && $subject instanceof MediaObject;
    }

    protected function voteOnAttribute($attribute, $subject, TokenInterface $token)
    {
        /* @var $mediaObject MediaObject */
        $mediaObject = $subject;
        $user = $token->getUser();

        if ($user instanceof User) {
            if($user->hasRoleAdmin()) return true;

            switch ($attribute) {
                case 'MEDIA_OBJECT_DELETE':
                case 'MEDIA_OBJECT_UPDATE':
                    if($user->getOrganization() === $mediaObject->getMaterial()->getOrganization()) {
                        return true;
                    }
                    break;
            }
        }

        return false;
    }
}
