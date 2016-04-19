MOCHA_PATH = ./node_modules/.bin/_mocha
NODEMON_PATH = ./node_modules/.bin/nodemon

test:
	@NODE_ENV=test $(MOCHA_PATH) --recursive \
		--require should

demo:
	@NODE_ENV=demo $(NODEMON_PATH) --ignore lib/config ./example/demo/src/app.js

.PHONY: test
