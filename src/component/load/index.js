Config = require("../../config/Config");

if (Config.name === "test") {
	module.exports = exports = [];
}
else {
	module.exports = exports = [
		require("./DaoLoader")
	];
}
