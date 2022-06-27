<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210609142608 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE organization ADD notification_mail_addresses TEXT DEFAULT NULL');
        $this->addSql('COMMENT ON COLUMN organization.notification_mail_addresses IS \'(DC2Type:array)\'');
        $this->addSql('ALTER TABLE outflow ADD reservation_approved_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE organization DROP notification_mail_addresses');
        $this->addSql('ALTER TABLE outflow DROP reservation_approved_at');
    }
}
