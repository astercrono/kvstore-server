const server = () => {
	const config = require("./config");

	const express = require("express");
	const app = express();

	require("./src/controllers")(app);

	const server = app.listen(config.server.port);
	console.log("KVStore server is running.");

	return server;
};

module.exports = exports = server();