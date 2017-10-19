const KVCrypt = require("./crypt/KVCrypt");
const Controllers = require("./controllers");
const express = require("express");

module.exports = exports = (overwriteKey) => {
	let serverListener = undefined;
	let app = undefined;

	return {
		start: (port, callback) => {
			app = express();

			serverListener = app.listen(port, (err) => {
				if (err) {
					callback(err);
					return;
				}

				Controllers(app);

				KVCrypt.initKey(overwriteKey, (err, key) => {
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