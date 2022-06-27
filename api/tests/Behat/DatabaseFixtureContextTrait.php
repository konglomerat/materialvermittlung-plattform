<?php

declare(strict_types=1);

namespace App\Tests\Behat;

use Behat\Behat\Tester\Exception\PendingException;
use Behat\Gherkin\Node\TableNode;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;

trait DatabaseFixtureContextTrait
{
    protected EntityManagerInterface $entityManager;

    /**
     * @BeforeScenario @fixtures
     */

    public function resetTestFixtures(): void
    {
        $this->entityManager->clear();

        $schemaTool = new SchemaTool($this->entityManager);
        $schemaTool->dropDatabase();

        $app = new Application($this->kernel);
        $cmd = $app->find('doctrine:migrations:migrate');
        $input = new ArrayInput([]);
        $input->setInteractive(false);
        $cmd->run($input, new NullOutput());
    }
}
