const KVCrypt = require("./src/crypt/KVCrypt");

const server = () => {
	const config = require("./config");

	const express = require("express");
	const app = express();

	require("./src/controllers")(app);

	const server = app.listen(config.server.port);
	console.log("KVStore server is running.");

	KVCrypt.initKey(true, (err, key) => {
		console.log("Key initialized");
	});

	return server;
};

module.exports = exports = server();