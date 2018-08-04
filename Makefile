PATH  			:= $(PATH):node_modules/.bin
SHELL 			:= /bin/bash

modules			:= ./node_modules
data			:= ./data

.PHONY: clean destroy init build test

all: init build

clean:
	@echo "Cleaning up installed modules"
	@rm -rf node_modules

destroy: clean
	@echo "Deleting data"
	@rm -rf data

init:
	@npm install
	@mkdir -p data

build: init
	@echo "Linting src"
	@eslint src/ --ext .js
	@echo "Linting test"
	@eslint test/ --ext .js

test: build
	@mocha

