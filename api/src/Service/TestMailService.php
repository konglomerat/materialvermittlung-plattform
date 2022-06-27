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

use App\Entity\Outflow;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;

class TestMailService extends MailService {

    /**
     * @var TemplatedEmail[]
     */
    private $lastMails = [];

    private $sendMailsForReal = false;

    /**
     * @param TemplatedEmail $email
     */
    public function sendMail($email) {
        array_push($this->lastMails, $email);
        if(!$this->sendMailsForReal) {
            parent::sendMail($email);
        }
    }

    /**
     * @param bool $sendMailsForReal
     */
    public function setSendMailsForReal(bool $sendMailsForReal): void {
        $this->sendMailsForReal = $sendMailsForReal;
    }


    /**
     * @return TemplatedEmail[]
     */
    public function getLastMails(): array {
        return $this->lastMails;
    }

    /**
     * @param TemplatedEmail[] $lastMails
     */
    public function reset(): void {
        $this->lastMails = [];
        $this->sendMailsForReal = false;
    }
}
