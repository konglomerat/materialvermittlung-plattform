# Contributing to Materialvermittlung

Want to improve this software and make it better? We love to see your Pull Requests.
Below you'll find all information to get started with development.

Please note that this software has been developed on macOS and for deployment on a kubernetes Cluster, 
we are happy to accept PRs with additional setups.

## Prerequisites

For development you need to have the following dependencies installed:

* `docker` and `docker-compose`
* `node` and `nvm`
* `yarn`
* [Font Awesome Pro](https://fontawesome.com/docs/web/setup/packages)

## Technologies

We are using [Api-Plattform](https://api-platform.com/), wich is a REST and GraphQL framework to build modern API-driven projects. It uses Symfony 4.

The client for the enduser is an SPA. Here we use React with TypeScript. We also provide an Admin UI that is build using the [easyadmin-bundle](https://symfony.com/doc/current/bundles/EasyAdminBundle/index.html) for Symfony.

The client uses the graphql endpoint provided by the api.

- **Client:** [React](https://reactjs.org/) in [TypeScript](https://www.typescriptlang.org/) with the [Ant Design component library](https://ant.design/) and [Apollo Client ](https://www.apollographql.com/docs/) for GraphQL requests
- **API:** [API Platform](https://api-platform.com/),
  which is basically a preconfigured [Symfony](https://symfony.com/)
  with [GraphQL-support](https://api-platform.com/docs/core/graphql/#graphql-support)
- **Admin UI:** [EasyAdmin](https://symfony.com/doc/master/bundles/EasyAdminBundle/index.html) served by [Symfony](https://symfony.com/)

## Setup

We provide an easy to use [Makefile](./Makefile) for the setup and development.

### Backend

* `make setup` This will remove old docker containers and build new ones using `docker-compose`.
* run `make start` to start the containers
* once the container runs `make schema-reset` this will drop any current schema and create a new one
* You can use `make fixtures` populate the database with generated testing data.

### Frontend

* in `/`
  * `yarn install`: installs [husky](https://github.com/typicode/husky), [lint-staged](https://github.com/okonet/lint-staged), and [prettier](https://prettier.io/) for linting files on commit
* `cd client`
  * `nvm use && yarn`

## Development

* in `client/`
* `yarn theme:watch`: compiles the less-stylesheets and antd-overrides to css
* `yarn start`: starts the react-dev-server at [localhost:3000](http://localhost:3000)
* `make start` This will start all needed containers and will start the client locally using `yarn start`
* `make shell` Opens a shell for running commands inside the api container
* `make migration` generates a new migration
* `make migrate` runs all unexecuted migrations
* `make fixtures` Populates the database with random values
TODO: changing the model -> generating Typescript


## Build

* `cd client && nvm use && yarn build`

### Entering the DB

* run `sku ns materialvermittlung` to switch to the correct namespace
* run `sku postgres beekeeper` to start Beekeeper Studio. You need to copy the url from the CLI.

run `sku postgres`to see other options on your system

### Creating users in production

`php bin/console app:create-user admin@example.org password --admin`
