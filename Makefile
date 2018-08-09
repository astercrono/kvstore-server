PATH  			:= $(PATH):node_modules/.bin
SHELL 			:= /bin/bash

modules			:= ./node_modules
src				:= ./src
test			:= ./test
app				:= ./app.js

.PHONY: clean destroy init build test

all: init build

clean:
	@echo "Cleaning up installed modules"
	@rm -rf $(modules)

destroy: clean
	@echo "Deleting data" #TODO - write node script to do this
	@echo "Deleting keys" #TODO - write node script to do this

init:
	@npm install

build: init
	@echo "Linting src"
	@eslint $(src)/ --ext .js
	@echo "Linting test"
	@eslint $(test)/ --ext .js

data: build
	@echo "Initializing data store" #TODO - write node script to do this

keys: build
	@echo "Initializing keys" #TODO - write node script to do this

run: $(modules) $(app)
	@echo "running" #TODO - run app.js

test: build
	@mocha

