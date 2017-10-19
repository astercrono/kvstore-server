module.exports = exports = (app) => {
	const KVController = require("./KVController");
	app.use("", KVController);
};
