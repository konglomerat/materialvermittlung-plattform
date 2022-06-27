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

use App\Doctrine\RestrictMaterialExtension;
use App\Entity\Material;
use App\Entity\User;
use App\ORM\MaterialListener;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class MaterialVoter extends Voter
{
    protected function supports($attribute, $subject)
    {
        return in_array($attribute, ['MATERIAL_CREATE', 'MATERIAL_UPDATE', 'MATERIAL_READ'])
            && $subject instanceof Material;
    }

    protected function voteOnAttribute($attribute, $subject, TokenInterface $token)
    {
        /* @var $material Material */
        $material = $subject;
        $user = $token->getUser();

        if($attribute === 'MATERIAL_READ') {
            /**
             * We use this Voter in the annotation, to lead the developer here
             * Both item_query and collection_query are protected using the corresponding extension.
             * Entities that are not being filtered will be public on default.
             * {@see RestrictMaterialExtension::applyToCollection()}
             * {@see RestrictMaterialExtension::applyToItem()}
             */
            return true;
        }

        if($user instanceof User) {
            if($user->hasRoleAdmin()) return true;

            switch ($attribute) {
                case 'MATERIAL_CREATE':
                    /**
                     * A user needs an organization to create material through the api
                     * The organization will be set by {@see MaterialListener::prePersist()}
                     * using the current user.
                     */
                    if($user->getOrganization()) {
                        return true;
                    }
                    break;
                case 'MATERIAL_UPDATE':
                    /**
                     * The user should only be able to create or update material
                     * with the same organization.
                     */
                    if($material->getOrganization() === $user->getOrganization()) {
                        return true;
                    }

                    break;
            }

        }
        return false;
    }
}
