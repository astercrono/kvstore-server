let profile = "default";

if (process.argv.length === 3) {
	profile = process.argv[2];
}

const Config = require("./src/config/Config");
const KeyStore = require("./src/crypt/KeyStore");
const Initializer = require("./src/Initializer");

console.log("starting kvstore-server");
Initializer.run(profile, () => {
	console.log("kvstore-server is up and running");

	if (Config.name === "test") {
		console.log("API Key = " + KeyStore.get("api"));
	}
});
