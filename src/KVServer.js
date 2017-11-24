const config = require("../config").get();

const KVCrypt = require("./crypt/KVCrypt");
const Controllers = require("./controllers");
const express = require("express");
const https = require("https");
const http = require("https");
const fs = require("fs");

const serverConfig = config.server;

module.exports = exports = (overwriteKey) => {
	let serverListener = undefined;
	let app = undefined;

	return {
		start: (callback) => {
			app = express();

			if (serverConfig.sslEnabled) {
				serverListener = createHttpsServer(app, overwriteKey, callback);
			}
			else {
				serverListener = createHttpServer(app, overwriteKey, callback);
			}
		},

		close: () => {
			if (serverListener) {
				serverListener.close();
			}
		}	
	};
};

function createHttpsServer(app, overwriteKey, callback) {
	const port = serverConfig.port;
	const sslKey = fs.readFileSync(serverConfig.keyPath);
	const sslCert = fs.readFileSync(serverConfig.certPath);

	return https.createServer({
		key: sslKey,
		cert: sslCert
	}, app).listen(port, setup(app, overwriteKey, callback));
}

function createHttpServer(app, overwriteKey, callback) {
	return app.listen(serverConfig.port, setup(app, overwriteKey, callback));
}

function setup(app, overwriteKey, callback) {
	return (err) => {
		if (err) {
			callback(err);
			return;
		}

		Controllers(app);

		KVCrypt.initKeys(overwriteKey, (err) => {
			if (err) {
				callback(err);
				return;
			}

			callback(undefined, app);
		});
	};
}