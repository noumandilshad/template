# Friency-api

Friency api with NodeJs, ExpressJs & Typescript
## Requirements

### System requirements

* node >= 12
* npm
* Docker & Docker-compose (install docker desktop)
* (optional & for windows users) WSL2


### VSCode recommended plugins

* EditorConfig for VS Code
* ESLint
* TSLint


## Development 

1. Create an `.env` file form the example: `cp .env.example .env` 
2. Install dependencies `npm install`
3. Run the application `make run`

You should now be able to run `curl -X POST http://localhost:3000/auth/login`.

## Postman collection

`postman_collection.json` can be imported into postman to help test the API.


## Docker

1. `docker build . -t friency`
2. `docker run -p 3000:3000 friency`

## Test

`npm run test`
