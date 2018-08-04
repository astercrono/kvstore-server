PATH  			:= $(PATH):node_modules/.bin
SHELL 			:= /bin/bash

modules			:= ./node_modules
data			:= ./data

.PHONY: clean init build test

all: init
	@echo "building... this line is temporary"

clean:
	@echo "cleaning up installed modules"
	@rm -rf node_modules

destroy: clean
	@echo "deleting data"
	@rm -rf data

init:
	@npm install
	@mkdir -p data

test: init
	@mocha

