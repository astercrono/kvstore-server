const Config = require("../src/config/Config");
const exec = require("child_process").exec;
const assert = require("assert");

let profile = "default";

if (process.argv.length === 3) {
	profile = process.argv[2];
}

console.log("Loading profile: " + profile);
Config.load(profile);

console.log("Creating keys at " + Config.secretPath());
const KeyStore = require("../src/crypt/KeyStore");
KeyStore.init(Config.secretPath(), (err, keys) => {
	if (err) {
		console.log("Error creating keys.");
		console.log(err);
		return;
	}

	assert.ok(keys);
	KeyStore.confirm();
});
