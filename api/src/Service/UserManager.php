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

namespace App\Service;

use App\Entity\Organization;
use App\Entity\User;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserManager {
    private $entityManager;
    private $passwordEncoder;
    private $mailService;

    public function __construct(EntityManagerInterface  $entityManager, UserPasswordEncoderInterface $passwordEncoder, MailService $mailService) {
        $this->entityManager = $entityManager;
        $this->passwordEncoder = $passwordEncoder;
        $this->mailService = $mailService;
    }

    public function createUser(string $name, string $email, string $password, array $roles = [], Organization $organization=null) {
        $user = new User();
        $user->setName($name);
        $user->setEmail($email);
        $user->setRoles($roles);
        if ($organization) {
            $user->setOrganization($organization);
        }
        if ($password !== "") {
            $encodedPassword = $this->passwordEncoder->encodePassword($user, $password);
            $user->setPassword($encodedPassword);
        } else {
            $user->setActivationToken(md5(random_bytes(50)));
            $user->setActivationTokenCreatedAt(new \DateTime());
        }

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $this->mailService->sendActivationMail($user);
    }


    public function isProvidedTokenValid($user, $providedToken)
    {
        if (!$providedToken || !$user) {
            return false;
        }
        $activationToken = $user->getActivationToken();
        if ($activationToken !== $providedToken) {
            return false;
        }
        $activationTokenCreatedAt = $user->getActivationTokenCreatedAt();
        $now = new DateTime();
        $diff = $activationTokenCreatedAt->diff($now);
        return $diff->days < 3;
    }

    public function prepareResetPasswort($user) {
        $user->setPassword(null);
        $user->setActivationToken(md5(random_bytes(50)));
        $user->setActivationTokenCreatedAt(new \DateTime());
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $this->mailService->sendPasswordResetMail($user);
    }


    public function setPassword($user, $plainPassword) {
        $encodedPassword = $this->passwordEncoder->encodePassword($user, $plainPassword);
        $user->setPassword($encodedPassword);
        $user->setActivationToken(null);
        $user->setActivationTokenCreatedAt(null);
        if (!$user->getHasAcceptedTerms()) {
            $now = new DateTime();
            $user->setHasAcceptedTerms($now);
        }
        $this->entityManager->persist($user);
        $this->entityManager->flush();
    }

    public function acceptTerms($user) {
        if (!$user->getHasAcceptedTerms()) {
            $now = new DateTime();
            $user->setHasAcceptedTerms($now);
        }
        $this->entityManager->persist($user);
        $this->entityManager->flush();
    }
}
