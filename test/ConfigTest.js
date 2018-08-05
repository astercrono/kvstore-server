const path = require("path");
const assert = require("assert");

const Config = require("../src/config/Config");
const configPath = path.join(__dirname, "/../config.json");
const profileName = "test";

describe("ConfigurationTest", () => {
	it("Load Config", () => {
		Config.load(configPath, profileName);
		assert.equal(Config.databasePath(), ":memory:");
		assert.equal(Config.secretPath(), ":memory:");
		assert.equal(Config.encryptionKeyIterations(), 1000000);
		assert.equal(Config.apiKeyIterations(), 1000000);
	});
});