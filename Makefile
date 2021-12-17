.DEFAULT_GOAL := help

# target: help - Display available recipes.
.PHONY: help
help:
	@egrep "^# target:" [Mm]akefile

# target: run - runs the application
.PHONY: run
run: dependencies
	npm run start

# target: dependencies - set up local dependencies for the API (minikube, docker-compose)
.PHONY: dependencies
dependencies:
	docker-compose up -d

.PHONY: build
build:
	docker-compose up -d

# target: ngrok - Creates a ngrok tunnel for the API
.PHONY: ngrok
ngrok:
	npm run ngrok

