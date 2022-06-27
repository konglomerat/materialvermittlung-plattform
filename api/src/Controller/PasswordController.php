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

use App\Service\UserManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

/**
 * TODO: migrate this to a GraphQL-mutation
 * Class PasswordController
 * @package App\Controller
 */
class PasswordController extends AbstractController
{
    private $userManager;
    private $security;

    public function __construct(UserManager $userManager, Security $security) {
        $this->userManager = $userManager;
        $this->security = $security;
    }

    /**
     * @Route("/api/token-info", name="token-info", methods={"POST"})
     * @param Request $request
     */
    public function tokenInfo(Request $request)
    {
        $activationToken = $request->request->get('activationToken');
        $user = $this->getDoctrine()
            ->getRepository('App:User')
            ->findOneByActivationToken($activationToken);

        if (!$this->userManager->isProvidedTokenValid($user, $activationToken)) {
            return new Response("The provided token is invalid", 400);
        } else {
            return new Response(json_encode(["email" => $user->getEmail(), "name" => $user->getName(), "hasAcceptedTerms" => !!$user->getHasAcceptedTerms()]), 200);
        }
    }

    /**
     * @Route("/api/reset-password", name="reset-password", methods={"POST"})
     * @param Request $request
     */
    public function resetPassword(Request $request)
    {
        $email = $request->request->get('email');
        $user = $this->getDoctrine()
            ->getRepository('App:User')
            ->findOneByEmail($email);

        if (!$email || !$user) {
            return new Response("No user found for this email", 404);
        } else {
            $this->userManager->prepareResetPasswort($user);

            return new Response($user->getEmail(), 200);
        }
    }

    /**
     * @Route("/api/set-password", name="set-password", methods={"POST"})
     * @param Request $request
     */
    public function setPassword(Request $request)
    {
        $activationToken = $request->request->get('activationToken');
        $password = $request->request->get('password');
        $hasAcceptedTerms = $request->request->get('hasAcceptedTerms');

        $user = $this->getDoctrine()
            ->getRepository('App:User')
            ->findOneByActivationToken($activationToken);

        if ($hasAcceptedTerms !== "true" && !$user->getHasAcceptedTerms()) {
            return new Response("The user has to accept the terms and conditions", 400);
        }

        $user = $this->getDoctrine()
            ->getRepository('App:User')
            ->findOneByActivationToken($activationToken);

        if (!$this->userManager->isProvidedTokenValid($user, $activationToken)) {
            return new Response("The provided token is invalid", 400);
        } else {
            $this->userManager->setPassword($user, $password);

            return new Response($user->getEmail(), 201);
        }
    }

    /**
     * @Route("/api/user_accept_terms")
     */
    public function acceptTerms()
    {
        $user = $this->security->getUser();

        if($user) {
            $this->userManager->acceptTerms($user);
            return new Response("accepted terms", 200);
        } else {
            return new Response("terms can only be accepted after logging in", 403);
        }
    }
}
