const async = require("async");

const KeyStoreInitError = require("../error/KeyStoreInitError");
const KeysReader = require("./KeysReader");
const KeysWriter= require("./KeysWriter");
const KeyGenerator = require("./KeyGenerator");
const Keys = require("./Keys");
const KeyOptions = require("./KeyOptions");

const config = require("../../config");
const path = config.crypt.keystore.path;
const encryptionConfig = config.crypt.encryption;
const signingConfig = config.crypt.signing;
const apiConfig = config.crypt.api;

function KeyStore() {
	let keys = undefined;

	return {
		init: (overwrite, callback) => {
			KeysReader().read(path, (err, existingKeys) => {
				if (err || overwrite) {
					initNewKeys((err, newKeys) => {
						if (err) {
							callback(err);
							return;
						}

						keys = newKeys;
						callback(undefined, keys);
					});
					return;
				}

				keys = existingKeys;
				callback(undefined, keys);
			});
		},

		get: (name) => {
			if (keys) {
				return keys.get(name);
			}
			return undefined;
		},

		getKeys: () => {
			return keys;
		},

		equals: (otherStore) => {
			if (!keys || !otherStore || !otherStore.getKeys()) {
				return false;
			}
			return keys.equals(otherStore.getKeys());
		}
	};
}

function initNewKeys(callback) {
	let keys = Keys();

	async.parallel([
		(asyncCallback) => {
			initKey(path, encryptionConfig.iv, (err, key) => {
				if (err) {
					asyncCallback(err);
					return;
				}

				keys.set("encryption", key);
				asyncCallback();
			});
		},
		(asyncCallback) => {
			initKey(path, signingConfig, (err, key) => {
				if (err) {
					asyncCallback(err);
					return;
				}

				keys.set("signing", key);
				asyncCallback();
			});
		},
		(asyncCallback) => {
			initKey(path, apiConfig, (err, key) => {
				if (err) {
					asyncCallback(err);
					return;
				}

				keys.set("api", key);
				asyncCallback();
			});
		}
	], (err, results) => {
		if (err) {
			callback(new KeyStoreInitError(err));
			return;
		}

		KeysWriter().write(path, keys, (err) => {
			if (err) {
				callback(err);
				return;
			}
			callback(undefined, keys);
		});
	});
}

function initKey(path, options, callback) {
	KeyGenerator(KeyOptions(options)).generate((err, newKey) => {
		if (err) {
			callback(err);
			return;							
		}
		callback(undefined, newKey);
	});
}

module.exports = exporst = KeyStore;