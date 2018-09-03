let profile = "default";

if (process.argv.length === 3) {
	profile = process.argv[2];
}

console.log("starting kvstore-server");

const Initializer = require("./src/Initializer");
Initializer.run(profile, () => {
	console.log("kvstore-server is up and running");
});
