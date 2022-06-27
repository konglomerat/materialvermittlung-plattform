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

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTExpiredEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTInvalidEvent;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTAuthenticatedEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class JWTSubscriber implements EventSubscriberInterface
{
    const REFRESH_TIME = 1800;

    private $payload;
    private $user;
    private $jwtManager;
    private $environment;

    public function createBearerCookie(string $value = null, $expires = null) {
        if(!$expires instanceof \DateTime) {
            $expires = new \DateTime("+1 day");
        }
        return new Cookie(
            "BEARER",
            $value,
            $expires,
            "/",
            null,
            // chrome doesn't allow the set-cookie header with a secure-flag, when serving over http
            'dev' === $this->environment ? false : true,
            true,
            false,
            'strict'
        );
    }

    // This way we can logout
    public function createInvalidBearerCookie() {
        return $this->createBearerCookie(null, new \DateTime("-1000 day"));
    }

    public function __construct(JWTTokenManagerInterface $jwtManager, string $environment)
    {
        $this->jwtManager = $jwtManager;
        $this->environment = $environment;
    }
    public static function getSubscribedEvents()
    {
        return [
            Events::AUTHENTICATION_SUCCESS => 'onAuthenticationSuccess',
            Events::JWT_AUTHENTICATED => 'onAuthenticatedAccess',
            KernelEvents::RESPONSE => 'onAuthenticatedResponse',
            Events::JWT_CREATED => 'onJWTCreated',
            Events::JWT_EXPIRED => 'onJWTExpired',
            Events::JWT_INVALID => 'onJWTInvalid',
        ];
    }
    public function onAuthenticatedResponse(ResponseEvent $event)
    {
        if($this->payload && $this->user)
        {
            $expireTime = $this->payload['exp'] - time();
            if($expireTime < static::REFRESH_TIME)
            {
                // Refresh token
                $jwt = $this->jwtManager->create($this->user);
                $response = $event->getResponse();
                // Set cookie
                $this->createCookie($response, $jwt);
            }
        }
    }
    public function onAuthenticatedAccess(JWTAuthenticatedEvent $event)
    {
        $this->payload = $event->getPayload();
        $this->user = $event->getToken()->getUser();
    }
    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event)
    {
        $eventData = $event->getData();
        if(isset($eventData['token']))
        {
            $response = $event->getResponse();
            $jwt = $eventData['token'];
            // Set cookie
            $this->createCookie($response, $jwt);
        }
    }
    protected function createCookie(Response $response, $jwt)
    {
        $response->headers->setCookie(self::createBearerCookie($jwt));
    }

    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $payload = $event->getData();
        $event->setData($payload);
    }

    // We need to invalidate the cookie on the client so that we do not
    // get failing graphql requests, as we still have Material
    // that is visible without a login
    public function onJWTExpired(JWTExpiredEvent $event)
    {
        $response = $event->getResponse();
        $response->headers->setCookie(self::createInvalidBearerCookie());
    }
    public function onJWTInvalid(JWTInvalidEvent $event)
    {
        $response = $event->getResponse();
        $response->headers->setCookie(self::createInvalidBearerCookie());
    }
}
