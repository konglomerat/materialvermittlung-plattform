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

namespace App\Controller\Admin;

use App\Entity\Material;
use App\Entity\Organization;
use App\Entity\Storage;
use App\Entity\User;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use EasyCorp\Bundle\EasyAdminBundle\Config\UserMenu;

class DashboardController extends AbstractDashboardController
{
    /**
     * @Route("/admin", name="admin")
     */
    public function index(): Response
    {
        return $this->render('admin/dashboard.html.twig');
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('Admin');
    }

    public function configureMenuItems(): iterable
    {
        return [
            MenuItem::linkToCrud('Organisationen', 'far fa-building', Organization::class)->setPermission('ROLE_ADMIN'),
            MenuItem::linkToCrud('Meine Organisation', 'far fa-building', Organization::class)->setPermission('ROLE_ORG_ADMIN'),
            MenuItem::linkToCrud('Accounts', 'fa fa-user', User::class),
            MenuItem::linkToCrud('Materialien', 'fas fa-sticky-note', Material::class)->setPermission('ROLE_ADMIN'),
            MenuItem::linkToCrud('Lagerorte', 'fas fa-boxes', Storage::class),
            MenuItem::linkToUrl('Zurück zur Materialvermittlung', 'far fa-caret-square-left', '/'),
        ];
    }

    public function configureUserMenu(UserInterface $user): UserMenu
    {
        return UserMenu::new();
    }
}
