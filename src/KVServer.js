const KVCrypt = require("./crypt/KVCrypt");
const Controllers = require("./controllers");
const express = require("express");
const https = require("https");
const fs = require("fs");

module.exports = exports = (overwriteKey) => {
	let serverListener = undefined;
	let app = undefined;

	return {
		start: (options, callback) => {
			app = express();

			const port = options.port;
			const sslOptions = options.ssl;

			const sslKey = fs.readFileSync(sslOptions.keyPath);
			const sslCert = fs.readFileSync(sslOptions.certPath);

			serverListenger = https.createServer({
				key: sslKey,
				cert: sslCert
			}, app).listen(port, (err) => {
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

					callback(undefined, serverListener);
				});
			});
		},

		close: () => {
			if (serverListener) {
				serverListener.close();
			}
		}	
	};
};