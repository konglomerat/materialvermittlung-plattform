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

use App\Entity\User;
use App\Service\UserManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\QueryBuilder;
use EasyCorp\Bundle\EasyAdminBundle\Collection\FieldCollection;
use EasyCorp\Bundle\EasyAdminBundle\Collection\FilterCollection;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Dto\EntityDto;
use EasyCorp\Bundle\EasyAdminBundle\Dto\SearchDto;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\EmailField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Orm\EntityRepository;
use Symfony\Component\Config\Definition\Exception\Exception;

class UserCrudController extends AbstractCrudController
{
    private $userManager;

    public function __construct(UserManager $userManger)
    {
        $this->userManager = $userManger;
    }

    public static function getEntityFqcn(): string
    {
        return User::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Account')
            ->setEntityLabelInPlural('Accounts');
    }


    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('name', "Name")->setRequired(true),
            EmailField::new('email', "Email")->setRequired(true),
            ChoiceField::new('roles', "Rolle")->setChoices(array('Admin' => 'ROLE_ADMIN', 'Organisations-Admin' => 'ROLE_ORG_ADMIN'))->allowMultipleChoices()->setRequired(false)->setPermission('ROLE_ADMIN'),
            AssociationField::new('organization', "Organisation")->setPermission('ROLE_ADMIN')->setRequired(true)
        ];
    }

    public function configureActions(Actions $actions): Actions
    {
        return $actions
            ->disable(Action::DELETE);
//            ->setPermission(Action::DELETE, 'ROLE_ADMIN');
    }

    public function createIndexQueryBuilder(SearchDto $searchDto, EntityDto $entityDto, FieldCollection $fields, FilterCollection $filters): QueryBuilder
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $queryBuilder =  $this->get(EntityRepository::class)->createQueryBuilder($searchDto, $entityDto, $fields, $filters);
        if (!$this->isGranted("ROLE_ADMIN")) {
            $organization = $user->getOrganization();
            if ($organization) {
                $queryBuilder->andWhere("entity.organization = ".$organization->getId());
            } else {
                throw new Exception("This user has no organization");
            }
        }
        return $queryBuilder;
    }

    public function persistEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        if (!$this->isGranted('ROLE_ADMIN')) {
            $organization = $user->getOrganization();
        } else {
            $organization = $entityInstance->getOrganization();
        }
        // TODO: is this really the best way to persist a user with an encrypted password?
        $this->userManager->createUser($entityInstance->getName(), $entityInstance->getEmail(), $entityInstance->getPassword(), $entityInstance->getRoles(), $organization);
    }
}
