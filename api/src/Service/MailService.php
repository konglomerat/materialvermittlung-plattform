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
use App\Entity\User;
use App\Enum\MailAddressEnum;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Mailer\MailerInterface;

class MailService {
    private $entityManager;
    private $mailer;
    private $logger;

    private $requestStack;

    const MAIL_BRANDING = [
        'branding_colorPrimary' => '#cb5133',
        'branding_fontSizeH1' => '28px',
        'branding_fontSizeText' => '14px',
        'branding_fontFamily' => 'helvetica',
        'branding_alignment' => 'center'
    ];

    public function __construct(EntityManagerInterface $entityManager, MailerInterface $mailer, LoggerInterface $logger, RequestStack $requestStack) {
        $this->entityManager = $entityManager;
        $this->mailer = $mailer;
        $this->logger = $logger;
        $this->requestStack = $requestStack;
    }

    private function baseUrl(): string {
        return $this->requestStack->getCurrentRequest()->getSchemeAndHttpHost();
    }

    private function buildMailLink(string $path): string {
        // we create links that can be identified as links send via mail to make life a little bit easier
        // when e.g. refactoring routes. All these links will have a redirect set up in the nginx config.
        return $this->baseUrl() . "/mail-link/" . $path;
    }

    private function buildActivationLink(User $user): string {
        // this link will be routed via Symfony and not nginx
        return $this->baseUrl() . "/account/aktivieren?t=" . $user->getActivationToken();
    }

    private function deineReserviertenMaterialienLink(): string {
        return $this->buildMailLink("deine-reservierten-materialien");
    }

    private function reservierteMaterialienLink(): string {
        return $this->buildMailLink("reservierte-materialien");
    }

    private function materialSucheLink(): string {
        return $this->buildMailLink("material");
    }

    protected function prepareAndSendMail(
        string $from,
        array $toAddresses,
        string $subject,
        string $contentTitle = "",
        string $contentText = "",
        string $contentButtonText = "",
        string $contentButtonLink = "",
        string $contentTextAfterButton = ""
    ) {
        foreach ($toAddresses as $address) {
            // we create a mail for each recipient to not leak any mail addresses and to be able to resend an email
            // if we get an exception -> e.g. if the mailserver could not reach one specific receiver.
            $email = (new TemplatedEmail())
                ->from(MailAddressEnum::RESERVATION_SENDER)
                ->to($address)
                ->subject($subject)
                ->htmlTemplate('emails/mailTemplate.html.twig')
                ->context(array_merge([
                    'contentTitle' => $contentTitle,
                    'contentText' => $contentText,
                    'contentButtonText' => $contentButtonText,
                    'contentButtonLink' => $contentButtonLink,
                    'contentTextAfterButton' => $contentTextAfterButton,
                ], self::MAIL_BRANDING));

            $this->sendMail($email);
        }
    }

    protected function sendMail(TemplatedEmail $email) {
        try {
            $this->mailer->send($email);
        } catch (\Exception $exception) {
            // We retry exactly once and the log the exception
            // as we do not want to be blocking.
            // otherwise we might see endless spinners in the UI.
            // MAYBE LATER: refactor sending mails to be async
            $message = $exception->getMessage();
            $trace = $exception->getTraceAsString();
            $subject = $email->getSubject();

            $this->logger->alert("
                Retried Sending mail with subject '$subject' \n
                Message: $message \n
                Trance: $trace \n
            ");
            $this->retrySendMail($email);
        }

    }

    private function retrySendMail(TemplatedEmail $email){
        try {
            $this->mailer->send($email);
        } catch (\Exception $exception) {
            $message = $exception->getMessage();
            $trace = $exception->getTraceAsString();
            $subject = $email->getSubject();

            $this->logger->alert("
                Sending mail with subject '$subject' FAILED \n
                Message: $message \n
                Trance: $trace \n
            ");
        }
    }

    #########################################
    # Reservation Mails
    #########################################

    private static function getReservingOrganizationRecipients(Outflow $outflow): ?array {
        if($outflow->getReservingOrganization() && sizeof($outflow->getReservingOrganization()->getNotificationMailAddresses()) > 0) {
            return $outflow->getReservingOrganization()->getNotificationMailAddresses();
        } else {
            return null;
        }
    }

    private static function getOrganizationRecipients(Outflow $outflow): ?array {
        if(
            $outflow->getMaterial()->getOrganization() &&
            sizeof($outflow->getMaterial()->getOrganization()->getNotificationMailAddresses()) > 0
        ) {
            return $outflow->getMaterial()->getOrganization()->getNotificationMailAddresses();
        } else {
            return null;
        }
    }

    public function sendToReservingOrganization_newReservation(Outflow $outflow) {
        $recipients = self::getReservingOrganizationRecipients($outflow);

        if($recipients) {
            $materialTitle = $outflow->getMaterial()->getTitle();
            $reservedQuantity = $outflow->getQuantity();
            $quantityUnit = $outflow->getMaterial()->getReadableQuantityUnit();
            $organizationName = $outflow->getMaterial()->getOrganization()->getName();

            $this->prepareAndSendMail(
                MailAddressEnum::RESERVATION_SENDER,
                $recipients,
                "Deine Reservierung",
                "Du hast reserviert.",
                "
                    Deine Reservierung von <strong>$reservedQuantity $quantityUnit $materialTitle</strong>
                    ist bei <strong>$organizationName</strong> eingegangen.
                ",
                "Deine Reservierungen",
                $this->deineReserviertenMaterialienLink(),
                "Du bekommst eine Bestätigung deiner Reservierung, wenn die Organisation diese angenommen hat."
            );
        }
    }

    public function sendToOrganization_newReservation(Outflow $outflow) {
        $recipients = self::getOrganizationRecipients($outflow);

        if($recipients){
            $organizationName = $outflow->getReservingOrganization()->getName();
            $materialTitle = $outflow->getMaterial()->getTitle();
            $reservedQuantity = $outflow->getQuantity();
            $quantityUnit = $outflow->getMaterial()->getReadableQuantityUnit();

            $this->prepareAndSendMail(
                MailAddressEnum::RESERVATION_SENDER,
                $recipients,
                'Reservierungsanfrage',
                "Reservierungsanfrage",
                "
                    Die Organisation <strong>$organizationName</strong> hat
                    <strong>$reservedQuantity $quantityUnit $materialTitle</strong> reserviert.
                    <br/> Bitte entscheide, ob du die Reservierung annehmen oder ablehnen möchtest.
                ",
                "Reservierungen für dein Material",
                $this->reservierteMaterialienLink()
            );
        }
    }

    public function sendToReservingOrganization_approvedReservation(Outflow $outflow) {
        $recipients = self::getReservingOrganizationRecipients($outflow);

        if($recipients) {
            $materialTitle = $outflow->getMaterial()->getTitle();
            $reservedQuantity = $outflow->getQuantity();
            $quantityUnit = $outflow->getMaterial()->getReadableQuantityUnit();
            $organizationName = $outflow->getMaterial()->getOrganization()->getName();

            $this->prepareAndSendMail(
                MailAddressEnum::RESERVATION_SENDER,
                $recipients,
                "Reservierungsbestätigung",
                "Deine Reservierung wurde bestätigt.",
                "
                    Deine Reservierung für <strong>$reservedQuantity $quantityUnit $materialTitle</strong>
                    wurde von Organisation <strong>$organizationName</strong> angenommen.
                    Jetzt darfst du das Material abholen. Information zur Abholung und oder Kontakt findest du in den Details deiner Reservierung.
                ",
                "Deine Reservierungen",
                $this->deineReserviertenMaterialienLink(),
            );
        }
    }

    public function sendToReservingOrganization_updatedReservation(Outflow $outflow) {
        $recipients = self::getReservingOrganizationRecipients($outflow);

        if($recipients) {
            $materialTitle = $outflow->getMaterial()->getTitle();
            $reservedQuantity = $outflow->getQuantity();
            $quantityUnit = $outflow->getMaterial()->getReadableQuantityUnit();
            $organizationName = $outflow->getMaterial()->getOrganization()->getName();

            $this->prepareAndSendMail(
                MailAddressEnum::RESERVATION_SENDER,
                $recipients,
                "Deine Reservierungsänderung",
                "Du hast deine Reservierung geändert.",
                "
                    Deine Reservierungsänderung von <strong>$reservedQuantity $quantityUnit $materialTitle</strong>
                    ist bei <strong>$organizationName</strong> eingegangen.
                ",
                "Deine Reservierungen",
                $this->deineReserviertenMaterialienLink(),
                "Du bekommst eine Bestätigung deiner Reservierung, wenn die Organisation diese angenommen hat."
            );
        }
    }

    public function sendToOrganization_updatedReservation(Outflow $outflow) {
        $recipients = self::getOrganizationRecipients($outflow);

        if($recipients){
            $organizationName = $outflow->getReservingOrganization()->getName();
            $materialTitle = $outflow->getMaterial()->getTitle();
            $reservedQuantity = $outflow->getQuantity();
            $quantityUnit = $outflow->getMaterial()->getReadableQuantityUnit();

            $this->prepareAndSendMail(
                MailAddressEnum::RESERVATION_SENDER,
                $recipients,
                'Reservierungsänderung',
                "In der Reservierung Deines Materials gab es eine Änderung.",
                "
                    Die Organisation <strong>$organizationName</strong> hat ihre Reservierung geändert.<br/>
                    Aktuell ist <strong>$reservedQuantity $quantityUnit $materialTitle</strong> reserviert.
                    <br/> Bitte entscheide, ob du die Reservierung annehmen oder ablehnen möchtest.
                ",
                "Reservierungen für dein Material",
                $this->reservierteMaterialienLink()
            );
        }
    }

    public function sendToOrganization_removedReservation(Outflow $outflow) {
        $recipients = self::getOrganizationRecipients($outflow);

        if($recipients){
            $organizationName = $outflow->getReservingOrganization()->getName();
            $materialTitle = $outflow->getMaterial()->getTitle();
            $reservedQuantity = $outflow->getQuantity();
            $quantityUnit = $outflow->getMaterial()->getReadableQuantityUnit();

            $this->prepareAndSendMail(
                MailAddressEnum::RESERVATION_SENDER,
                $recipients,
                'Reservierung wurde zurückgenommen',
                "Die Reservierung deines Materials wurde zurückgenommen.",
                "
                    Die Organisation <strong>$organizationName</strong> hat sich anders entschieden und die Reservierung für<br/>
                    <strong>$reservedQuantity $quantityUnit $materialTitle</strong> zurückgenommen.<br/>
                    Es steht jetzt wieder für andere Teilnehmerinnen zu Verfügung.
                ",
                "Weitere Reservierungen für dein Material",
                $this->reservierteMaterialienLink()
            );
        }
    }

    public function sendToReservingOrganization_removedReservation(Outflow $outflow) {
        $recipients = self::getReservingOrganizationRecipients($outflow);

        if($recipients){
            $organizationName = $outflow->getMaterial()->getOrganization()->getName();
            $materialTitle = $outflow->getMaterial()->getTitle();
            $reservedQuantity = $outflow->getQuantity();
            $quantityUnit = $outflow->getMaterial()->getReadableQuantityUnit();

            $this->prepareAndSendMail(
                MailAddressEnum::RESERVATION_SENDER,
                $recipients,
                'Deine Reservierung wurde abgelehnt',
                "Deine Reservierung würde abgelehnt",
                "
                    Deine Reservierung von <strong>$reservedQuantity $quantityUnit $materialTitle</strong>
                    wurde leider von der Organisation <strong>$organizationName</strong> abgelehnt.<br/>
                    Weiters Material findest du hier:
                ",
                "Alle Zündstoffe",
                $this->materialSucheLink()
            );
        }
    }

    #########################################
    # Account Mails
    #########################################

    public function sendActivationMail($user) {
        $address = $user->getEmail();
        $activationLink = $this->buildActivationLink($user);

        $this->prepareAndSendMail(
            MailAddressEnum::RESERVATION_SENDER,
            [$address],
            'Willkommen bei der Materialvermittlung',
            'Willkommen' . $user->getName(),
            'Für dich wurde ein Account in der Materialvermittlung angelegt.',
            'Klick hier, um deinen Account zu aktivieren.',
            $activationLink,
            'Oder kopiere diesen Link in deinen Browser: ' . $activationLink
        );
    }

    public function sendPasswordResetMail($user) {
        $address = $user->getEmail();
        $activationLink = $this->buildActivationLink($user);

        $this->prepareAndSendMail(
            MailAddressEnum::RESERVATION_SENDER,
            [$address],
            'Passwort zurücksetzen',
            'Passwort zurücksetzen',
            'Bitte hier klicken, um dein Passwort zurückzusetzen',
            'Passwort zurückzusetzen',
            $activationLink,
            'Oder kopiere diesen Link in deinen Browser: ' . $activationLink
        );
    }
}
