<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210325104722 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE material ADD terms_and_conditions_accepted_by_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE material ADD terms_and_conditions_accepted_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('ALTER TABLE material ADD CONSTRAINT FK_7CBE75951B327D4 FOREIGN KEY (terms_and_conditions_accepted_by_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_7CBE75951B327D4 ON material (terms_and_conditions_accepted_by_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE material DROP CONSTRAINT FK_7CBE75951B327D4');
        $this->addSql('DROP INDEX IDX_7CBE75951B327D4');
        $this->addSql('ALTER TABLE material DROP terms_and_conditions_accepted_by_id');
        $this->addSql('ALTER TABLE material DROP terms_and_conditions_accepted_at');
    }
}
