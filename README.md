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

## Testing Examples

-   Example endpoints calls http://localhost:4000/api/customers?emails=email1@gmail.com,email2@hotmail.com
-   Example endpoints calls http://localhost:4000/api/enriched_customers?emails=email1@gmail.com,email2@hotmail.com
-   Example endpoints calls http://localhost:4000/api/accounts
-   Example endpoints calls http://localhost:4000/api/accounts?account_id=409845
-   Example endpoints calls http://localhost:4000/api/transactions?
-   Example endpoints calls http://localhost:4000/api/transactions?account_id=371138

## Running the project

    $ npm run start:dev

## Simple build for production

    $ npm run build

## Production deployment

    $ docker-compose build --no-cache && docker-compose up -d --force-recreate

## Author

-   **Rethabile Selebalo** <rethabileselebal@gmail.com>
