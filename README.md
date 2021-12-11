# Friency-api

Friency api with NodeJs, ExpressJs & Typescript
## Requirements

### System requirements

* node >= 12
* npm
* (optional) WSL2
* (optional) Docker


### VSCode recommended plugins

* EditorConfig for VS Code
* ESLint
* TSLint


## Development 

1. Create an `.env` file form the example: `cp .env.example .env` 
2. Install dependencies `npm install`
3. Run the application `npm start`

You should now be able to run `curl -X GET http://localhost:3000/hello-world` and obtain a successfull response.


## Docker

1. `docker build . -t friency`
2. `docker run -p 3000:3000 friency`

## Test

`npm run test`
