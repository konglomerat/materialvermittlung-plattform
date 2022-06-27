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

use App\Controller\Admin\DashboardController;
use App\Controller\Admin\OrganizationCrudController;
use App\Controller\Admin\StorageCrudController;
use App\Controller\Admin\UserCrudController;
use App\Enum\MailAddressEnum;
use App\Enum\MaterialFlowCommentsEnum;
use App\Enum\MaterialUnitEnum;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;

class ClientConfigController {

    private $adminUrlGenerator;

    public function __construct(AdminUrlGenerator $adminUrlGenerator)
    {
        $this->adminUrlGenerator = $adminUrlGenerator;
    }

    /**
     * @Route("/api/client_config")
     */
    public function index()
    {
        $response = new Response();

        # see https://symfony.com/doc/current/bundles/EasyAdminBundle/crud.html#generating-crud-urls-from-outside-easyadmin
        $adminAccountUrl = $this->adminUrlGenerator
            ->setDashboard(DashboardController::class)
            ->setController(UserCrudController::class)
            ->setAction(Action::INDEX)
            ->generateUrl();

        $adminStorageUrl = $this->adminUrlGenerator
            ->setDashboard(DashboardController::class)
            ->setController(StorageCrudController::class)
            ->setAction(Action::INDEX)
            ->generateUrl();

        $adminOrganizationUrl = $this->adminUrlGenerator
            ->setDashboard(DashboardController::class)
            ->setController(OrganizationCrudController::class)
            ->setAction(Action::INDEX)
            ->generateUrl();


        // ###########################################################################
        // IMPORTANT: when making changes also change corresponding ts file in client
        // -> see clientConfig.ts
        // ###########################################################################
        $config = [
            "dropdowns" => [
                "materialUnits" => MaterialUnitEnum::toDropdownOptions(),
                "inflowComments" => MaterialFlowCommentsEnum::toInflowDropdownOptions(),
                "outflowComments" => MaterialFlowCommentsEnum::toOutflowDropdownOptions(),
            ],
            "enumTextMappings" => [
                "units" => MaterialUnitEnum::toEnumTextMapping(),
                "materialFlows" => MaterialFlowCommentsEnum::toEnumTextMapping(),
            ],
            "defaults" => [
                "materialUnit" => MaterialUnitEnum::DEFAULT
            ],
            "urls" => [
                "admin" => [
                    "accounts" => $adminAccountUrl,
                    "storage" => $adminStorageUrl,
                    "organization" => $adminOrganizationUrl,
                ]
            ],
            "mailAddresses" => [
                "reportViolation" => MailAddressEnum::REPORT_VIOLATION
            ]
        ];

        $encodedConfig = json_encode($config);

        $content = "window.materialvermittlung__config = $encodedConfig";
        $response->setContent($content);

        return $response;
    }
}
