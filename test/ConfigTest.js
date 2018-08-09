const assert = require("assert");

const Config = require("../src/config/Config");

describe("Configuration Test", () => {
	it("Load Config", () => {
		Config.load("test");
		assert.equal(Config.databasePath(), ":memory:");
		assert.equal(Config.secretPath(), ":memory:");
		assert.equal(Config.encryptionKeyIterations(), 1000000);
		assert.equal(Config.signingKeyIterations(), 1000000);
		assert.equal(Config.apiKeyIterations(), 1000000);
	});
});