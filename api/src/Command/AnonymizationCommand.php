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

use App\Entity\Material;
use App\ORM\MaterialListener;
use App\Repository\MaterialRepository;
use DateInterval;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class AnonymizationCommand extends Command
{
    protected static $defaultName = 'app:anonymize';
    protected static $defaultDescription = 'Anonymize stale models';

    private $materialRepository;
    private $entityManager;

    public function __construct(MaterialRepository $materialRepository, EntityManagerInterface $entityManager)
    {
        $this->materialRepository = $materialRepository;
        $this->entityManager = $entityManager;
        parent::__construct();
    }

    protected function configure()
    {
        $this->setDescription(self::$defaultDescription);
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $removedMaterials = self::anonymize($this->entityManager);

        $io->success('Removed all personal information from '.$removedMaterials.' materials, that were six months or older');

        return Command::SUCCESS;
    }

    static public function anonymize(EntityManagerInterface $entityManager): int {
        $twelveMonths = new DateInterval('P12M');
        $now = new \DateTime();
        $twelveMonthsAgo = $now->sub($twelveMonths);

        $removedMaterials = 0;

        /**
         * @var $materialRepository MaterialRepository
         */
        $materialRepository = $entityManager->getRepository(Material::class);
        // TODO: filter for isFinished as a performance optimization and not anonymized
        foreach ($materialRepository->findAll() as $material) {
            if ($material->getWasAnonymizedAt() === null && $material->getIsFinished() && $material->getUpdatedAt() < $twelveMonthsAgo) {
                $material->setStoragePostalCode($material->getStorage()->getAddressPostalCode());

                $material->setOrganization(null);
                $material->setStorage(null);
                $material->setCreatedBy(null);
                $material->setTermsAndConditionsAcceptedBy(null);

                $outflows = $material->getOutflows();
                echo "OUTFLOWS:" . sizeof($outflows->getValues()) . "\n";
                foreach ($outflows as $outflow) {
                    $outflow->setReservingOrganization(null);

                    $entityManager->persist($outflow);
                    $entityManager->flush();
                }

                $images = $material->getImages();

                echo "IMAGES:" . sizeof($images->getValues());
                echo("\n");

                foreach ($images as $image) {
                    $image->setUploadedBy(null);

                    $entityManager->persist($image);
                    $entityManager->flush();
                }

                $material->setWasAnonymizedAt($now);

                $entityManager->persist($material);
                $entityManager->flush();

                $removedMaterials++;
            }
        }
        return $removedMaterials;
    }
}
