PATH  			:= $(PATH):node_modules/.bin
SHELL           := /bin/bash

modules			:= ./node_modules
src				:= ./src
test			:= ./test
data_script     := ./script/data.js
key_script      := ./script/keys.js

.PHONY: clean destroy init build test

all: init build

clean:
	@echo "Cleaning up installed modules"
	@rm -rf $(modules)

init:
	@npm install

build: init
	@echo "Linting src"
	@eslint $(src)/ --ext .js
	@echo "Linting test"
	@eslint $(test)/ --ext .js

data: build
	@echo "Creating database"
	@node $(data_script) $(profile)

keys: build
	@echo "Creating keys"
	@node $(key_script) $(profile)

test: build
	@mocha
