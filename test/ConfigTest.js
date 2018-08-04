const path = require("path");
const assert = require("assert");

const Config = require("../src/config/Config");
const configPath = path.join(__dirname, "/../config.json");
const profileName = "test";

describe("ConfigurationTest", () => {
	it("Load Config", () => {
		Config.load(configPath, profileName);
		assert.equal(Config.signingSecretPath(), ":memory:");
		assert.equal(Config.databasePath(), ":memory:");
		assert.equal(Config.encryptionSecretPath(), ":memory:");
	});
});