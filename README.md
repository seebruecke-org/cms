# Seebrücke CMS

The Seebrücke CMS is build on top of Strapi, a headless CMS.

## Minimal development setup

With the minimal setup you can create a new strapi instance, which uses sqlite as database. The database file will be stored in `.tmp/data.db`.

The database setup is pre-configured in [`config/env/development/database.js`](/config/env/development/database.js).

1. Install npm dependencies

`npm run install`

2. Start the application

`npm run develop`


## Production setup

### Setup the proper node environment variable

`NODE_ENV` needs to be set to `production`.

1. Install npm dependencies

`npm run install`

2. Build the application

`npm run build`

3. Start the the application

`npm run start`


### Setup the vercel deployment webhook

Some content changes (e.g. redirects) needs to trigger a rebuild of the frontend. For that, strapi needs to call a webhook provided by vercel.

1. If you haven't already copy the `.env.example` file:

`cp .env.example .env`

2. Enter your Algolia credentials into rout `.env` file

- VERCEL_PRODUCTION_WEBHOOK


## Setup algolia synchronization (optional)

1. If you haven't already copy the `.env.example` file:

`cp .env.example .env`

2. Enter your Algolia credentials into rout `.env` file

- ALGOLIA_PROJECT
- ALGOLIA_ACCESS_TOKEN
- ALGOLIA_INDEX


## Connect your strapi instance to the production database (optional)

The configuration database of the production environment is set in [`config/env/production/database.js`](/config/env/production/database.js).

1. If you haven't already copy the `.env.example` file:

`cp .env.example .env`

2. Enter the following credentials into your `.env` file

- DATABASE_HOST
- DATABASE_NAME
- DATABASE_USERNAME
- DATABASE_PASSWORD
