const Config = require("../src/config/Config");
const exec = require("child_process").exec;

let profile = "default";

if (process.argv.length === 3) {
	profile = process.argv[2];
}

console.log("Loading profile: " + profile);
Config.load(profile);

console.log("Creating database at " + Config.databasePath());
exec("sqlite3 " + Config.databasePath() + " < ./script/createsql.sql")
