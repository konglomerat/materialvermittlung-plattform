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

use App\Service\MailService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MailTemplatePreviewController extends AbstractController {
    /**
     * @Route("/dev/mailpreview")
     */
    public function index(): Response {
        return
            $this->render('emails/mailTemplate.html.twig', array_merge([
            'contentTitle' => 'Awesome Title',
            'contentText' => 'Lorem ipsum dolor sit amet, <strong>consetetur sadipscing</strong> elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam <strong>erat</strong>, sed diam voluptua.',
            'contentButtonText' => 'Call to Action',
            'contentButtonLink' => '#',
            'contentTextAfterButton' => 'Sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam <strong>erat</strong>, sed diam voluptua.',
        ], MailService::MAIL_BRANDING));
    }
}
