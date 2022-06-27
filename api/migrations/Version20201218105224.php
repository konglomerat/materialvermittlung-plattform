<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201218105224 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE material_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE media_object_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE organization_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE reservation_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE storage_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE users_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE material (id INT NOT NULL, created_by_id INT NOT NULL, storage_id INT DEFAULT NULL, organization_id INT NOT NULL, title VARCHAR(255) DEFAULT NULL, description VARCHAR(10000) DEFAULT NULL, quantity DOUBLE PRECISION DEFAULT NULL, quantity_unit VARCHAR(255) DEFAULT NULL, dimensions VARCHAR(255) DEFAULT NULL, color VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, publish_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, visible_until TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, allow_partial_reservation BOOLEAN DEFAULT NULL, is_draft BOOLEAN DEFAULT NULL, is_fixture BOOLEAN DEFAULT NULL, storage_notes_override VARCHAR(10000) DEFAULT NULL, storage_contact_override VARCHAR(10000) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_7CBE7595B03A8386 ON material (created_by_id)');
        $this->addSql('CREATE INDEX IDX_7CBE75955CC5DB90 ON material (storage_id)');
        $this->addSql('CREATE INDEX IDX_7CBE759532C8A3DE ON material (organization_id)');
        $this->addSql('CREATE TABLE media_object (id INT NOT NULL, material_id INT DEFAULT NULL, file_path VARCHAR(255) DEFAULT NULL, sort_index INT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_14D43132E308AC6F ON media_object (material_id)');
        $this->addSql('CREATE TABLE organization (id INT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE reservation (id INT NOT NULL, material_id INT NOT NULL, reserved_by_id INT NOT NULL, quantity INT DEFAULT NULL, picked_up TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_42C84955E308AC6F ON reservation (material_id)');
        $this->addSql('CREATE INDEX IDX_42C84955BCDB4AF4 ON reservation (reserved_by_id)');
        $this->addSql('CREATE TABLE storage (id INT NOT NULL, organization_id INT NOT NULL, title VARCHAR(255) NOT NULL, address_street VARCHAR(255) DEFAULT NULL, address_postal_code VARCHAR(255) DEFAULT NULL, address_city VARCHAR(255) DEFAULT NULL, notes VARCHAR(10000) DEFAULT NULL, contact VARCHAR(10000) DEFAULT NULL, is_public BOOLEAN DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_547A1B3432C8A3DE ON storage (organization_id)');
        $this->addSql('CREATE TABLE users (id INT NOT NULL, organization_id INT DEFAULT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) DEFAULT NULL, activation_token VARCHAR(255) DEFAULT NULL, activation_token_created_at DATE DEFAULT NULL, name VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1483A5E9E7927C74 ON users (email)');
        $this->addSql('CREATE INDEX IDX_1483A5E932C8A3DE ON users (organization_id)');
        $this->addSql('ALTER TABLE material ADD CONSTRAINT FK_7CBE7595B03A8386 FOREIGN KEY (created_by_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE material ADD CONSTRAINT FK_7CBE75955CC5DB90 FOREIGN KEY (storage_id) REFERENCES storage (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE material ADD CONSTRAINT FK_7CBE759532C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE media_object ADD CONSTRAINT FK_14D43132E308AC6F FOREIGN KEY (material_id) REFERENCES material (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C84955E308AC6F FOREIGN KEY (material_id) REFERENCES material (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C84955BCDB4AF4 FOREIGN KEY (reserved_by_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE storage ADD CONSTRAINT FK_547A1B3432C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE users ADD CONSTRAINT FK_1483A5E932C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE media_object DROP CONSTRAINT FK_14D43132E308AC6F');
        $this->addSql('ALTER TABLE reservation DROP CONSTRAINT FK_42C84955E308AC6F');
        $this->addSql('ALTER TABLE material DROP CONSTRAINT FK_7CBE759532C8A3DE');
        $this->addSql('ALTER TABLE storage DROP CONSTRAINT FK_547A1B3432C8A3DE');
        $this->addSql('ALTER TABLE users DROP CONSTRAINT FK_1483A5E932C8A3DE');
        $this->addSql('ALTER TABLE material DROP CONSTRAINT FK_7CBE75955CC5DB90');
        $this->addSql('ALTER TABLE material DROP CONSTRAINT FK_7CBE7595B03A8386');
        $this->addSql('ALTER TABLE reservation DROP CONSTRAINT FK_42C84955BCDB4AF4');
        $this->addSql('DROP SEQUENCE material_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE media_object_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE organization_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE reservation_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE storage_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE users_id_seq CASCADE');
        $this->addSql('DROP TABLE material');
        $this->addSql('DROP TABLE media_object');
        $this->addSql('DROP TABLE organization');
        $this->addSql('DROP TABLE reservation');
        $this->addSql('DROP TABLE storage');
        $this->addSql('DROP TABLE users');
    }
}
