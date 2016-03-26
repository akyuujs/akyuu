MOCHA_PATH = ./node_modules/.bin/_mocha

test:
	@NODE_ENV=test $(MOCHA_PATH) --recursive \
		--require should

.PHONY: test
