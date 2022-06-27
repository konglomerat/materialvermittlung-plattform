REQUIRED_BINS := node yarn docker-compose docker
$(foreach bin,$(REQUIRED_BINS),\
    $(if $(shell which $(bin) 2> /dev/null),,$(error Please install `$(bin)`, by running brew install `$(bin)` )))

.PHONY: setup-client setup-api setup start build shell fixtures migration-generate migrate

# set up all dependencies


setup:
	@yarn install
	make setup-api

stop:
	@docker-compose stop

open:
	@open http://localhost:3000/
open-admin:
	@open http://localhost/admin
open-mailhog:
	@open http://localhost:8025/

setup-api:
	@docker-compose down
	@docker-compose build --pull

start:
	@docker-compose up -d

shell:
	@docker-compose exec api /bin/sh

tests:
	@docker-compose exec api vendor/bin/behat

tests-dev:
	# add an @dev before a Scenario to tag it
	@docker-compose exec api vendor/bin/behat --tags @dev

fixtures:
	@docker-compose exec api rm -rf /srv/api/public/media/*
	@docker-compose exec api php bin/console doctrine:fixtures:load

schema-reset:
	@docker-compose exec api php bin/console doctrine:schema:drop --force
	@docker-compose exec api php bin/console doctrine:schema:create

migrate:
	@docker-compose exec api php bin/console doctrine:migrations:migrate

entity:
	@docker-compose exec api php bin/console make:entity

migration:
	@docker-compose exec api php bin/console make:migration

cache-flush:
	@docker-compose exec api php bin/console cache:clear

image-cache-flush:
	@docker-compose exec api php bin/console liip:imagine:cache:remove

image-cache-resolve:
	@docker-compose exec api ./warmupImageCache.sh

reset-db:
	@docker-compose exec api php bin/console doctrine:database:drop --force
	@docker-compose exec api php bin/console doctrine:database:create
	@make migrate
