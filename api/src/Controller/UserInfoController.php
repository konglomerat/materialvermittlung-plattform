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

namespace App\Controller;

use App\Entity\Organization;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class UserInfoController {

    private $security;
    /**
     * UserInfoController constructor.
     */
    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    /**
     * @Route("/api/user_info")
     */
    public function index()
    {
        $response = new Response();
        $user = $this->security->getUser();

        if($user) {
            /** @var $organization Organization */
            $organization = $user->getOrganization();

            if ($organization) {
                $organizationId = $organization->getId();
                $organizationArray = [
                    "id" => $organizationId,
                    "iri" => "/organizations/".$organizationId,
                    "name" => $organization->getName(),
                    "hasImprint" => !!$organization->getImprint(),
                    "hasNotificationMailAddresses" => !!$organization->getNotificationMailAddresses()
                ];
            } else {
                $organizationArray = null;
            }

            $userConfig = json_encode([
                "username" => $user->getUsername(),
                "id" => $user->getId(),
                "iri" => "/users/".$user->getId(),
                "roles" => $user->getRoles(),
                "isAdmin" => in_array("ROLE_ADMIN", $user->getRoles()),
                "isOrgAdmin" => in_array("ROLE_ORG_ADMIN", $user->getRoles()),
                "hasAcceptedTerms" => $user->getHasAcceptedTerms(),
                "organization" => $organizationArray,
            ]);
            $content = "window.materialvermittlung__user = $userConfig";
            $response->setContent($content);
        } else {
            $response->setContent("undefined");
        }

        return $response;
    }
}
