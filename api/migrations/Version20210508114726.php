<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210508114726 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE inflow ALTER created_on DROP NOT NULL');
        $this->addSql('ALTER TABLE material DROP quantity');
        $this->addSql('ALTER TABLE outflow ALTER material_id DROP NOT NULL');
        $this->addSql('ALTER TABLE outflow ALTER created_on DROP NOT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE material ADD quantity DOUBLE PRECISION DEFAULT NULL');
        $this->addSql('ALTER TABLE inflow ALTER created_on SET NOT NULL');
        $this->addSql('ALTER TABLE outflow ALTER material_id SET NOT NULL');
        $this->addSql('ALTER TABLE outflow ALTER created_on SET NOT NULL');
    }
}
