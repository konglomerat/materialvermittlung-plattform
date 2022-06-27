<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210125141342 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP SEQUENCE reservation_id_seq CASCADE');
        $this->addSql('CREATE SEQUENCE inflow_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE outflow_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE inflow (id INT NOT NULL, material_id INT NOT NULL, created_on TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, comment TEXT DEFAULT NULL, quantity DOUBLE PRECISION NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_CBBF3F71E308AC6F ON inflow (material_id)');
        $this->addSql('CREATE TABLE outflow (id INT NOT NULL, material_id INT NOT NULL, reserving_organization_id INT DEFAULT NULL, created_on TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, comment TEXT DEFAULT NULL, quantity DOUBLE PRECISION DEFAULT NULL, picked_up_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_C4AB3063E308AC6F ON outflow (material_id)');
        $this->addSql('CREATE INDEX IDX_C4AB30635F6A8D7C ON outflow (reserving_organization_id)');
        $this->addSql('ALTER TABLE inflow ADD CONSTRAINT FK_CBBF3F71E308AC6F FOREIGN KEY (material_id) REFERENCES material (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE outflow ADD CONSTRAINT FK_C4AB3063E308AC6F FOREIGN KEY (material_id) REFERENCES material (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE outflow ADD CONSTRAINT FK_C4AB30635F6A8D7C FOREIGN KEY (reserving_organization_id) REFERENCES organization (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('DROP TABLE reservation');
        $this->addSql('ALTER TABLE material ADD is_finished BOOLEAN DEFAULT NULL');
        $this->addSql('ALTER TABLE material DROP allow_partial_reservation');
        $this->addSql('ALTER TABLE material DROP is_fixture');
        $this->addSql('ALTER TABLE material DROP storage_notes_override');
        $this->addSql('ALTER TABLE material DROP storage_contact_override');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE inflow_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE outflow_id_seq CASCADE');
        $this->addSql('CREATE SEQUENCE reservation_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE reservation (id INT NOT NULL, material_id INT NOT NULL, reserved_by_id INT NOT NULL, quantity INT DEFAULT NULL, picked_up TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX idx_42c84955e308ac6f ON reservation (material_id)');
        $this->addSql('CREATE INDEX idx_42c84955bcdb4af4 ON reservation (reserved_by_id)');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT fk_42c84955e308ac6f FOREIGN KEY (material_id) REFERENCES material (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT fk_42c84955bcdb4af4 FOREIGN KEY (reserved_by_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('DROP TABLE inflow');
        $this->addSql('DROP TABLE outflow');
        $this->addSql('ALTER TABLE material ADD is_fixture BOOLEAN DEFAULT NULL');
        $this->addSql('ALTER TABLE material ADD storage_notes_override VARCHAR(10000) DEFAULT NULL');
        $this->addSql('ALTER TABLE material ADD storage_contact_override VARCHAR(10000) DEFAULT NULL');
        $this->addSql('ALTER TABLE material RENAME COLUMN is_finished TO allow_partial_reservation');
    }
}
