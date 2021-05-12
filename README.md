# Synatic Project

REST API written in NodeJS that produces customer data

---

## Prerequisites

1. Node v10.x or above
2. create .env and get variables from .env.example in this repo

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development, testing purposes as well as deploying to porduction

## Getting the source code

    $ git clone https://github.com/rselebalo/synatic-api
    $ cd synatic-api
    $ npm i install

## Configure app

-   Create a file: `/src/.env`;
-   Copy variables from .env.example
-   Update variable values with yours

## Running the project

    $ npm run start:dev

## Simple build for production

    $ npm run build

## Production deployment

    $ docker-compose build --no-cache && docker-compose up -d --force-recreate

## Author

-   **Rethabile Selebalo** <rethabileselebal@gmail.com>
