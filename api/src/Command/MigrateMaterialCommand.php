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

namespace App\Command;

use App\Entity\Inflow;
use App\Entity\Material;
use App\Repository\MaterialRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class MigrateMaterialCommand extends Command
{
    protected static $defaultName = 'app:migrate-material';
    private $entityManager;

    protected function configure()
    {
        $this->setDescription('Example Command Controller');
    }

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;

        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        // CAN BE USED TO HELP TO MIGRATE

        // Last Example:
        /*
        $materials = $this->entityManager->getRepository(Material::class)->findAll();

        foreach ($materials as $material) {
            if($material->getIsFinished() === null) {
                $material->setIsFinished(false);
                $this->entityManager->persist($material);
                $this->entityManager->flush();
            }
            if(!sizeof($material->getInflows()->toArray())) {
                $output->writeln('...');
                $inflow = new Inflow();
                $inflow->setMaterial($material);
                $inflow->setQuantity($material->getQuantity());
                $inflow->setComment(Inflow::COMMENT_OTHER);
                $inflow->setCreatedOn($material->getCreatedAt());
                $this->entityManager->persist($inflow);
                $this->entityManager->persist($material);
                $this->entityManager->flush();
            }
        }

        $output->writeln(sizeof($materials).' Materials found');
        $output->writeln('Materials successfully generated!');
        */
        return 0;
    }
}
