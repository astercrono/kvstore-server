const async = require("async");

const Config = require("../config/Config");
const KeyStoreInitError = require("../error/KeyStoreInitError");
const KeysInitializedError = require("../error/KeysInitializedError");
const KeysUninitializedError = require("../error/KeysUninitializedError");
const KeysReader = require("./KeysReader");
const KeysWriter= require("./KeysWriter");
const KeyGenerator = require("./KeyGenerator");
const Keys = require("./Keys");

const MemoryPath = ":memory:";

function KeyStore() {
	const path = Config.secretPath();
	let keys = undefined;

	return {
		load: (callback) => {
			if (path === MemoryPath) {
				if (!keys) {
					callback(undefined, new KeysUninitializedError());
					return;
				}
				callback(undefined, keys);
				return;
			}

			KeysReader().read(path, (err, readKeys) => {
				if (err) {
					callback(err);
					return;
				}

				keys = readKeys;
				callback(undefined, keys);
			});
		},

		init: (callback) => {
			if (keys) {
				callback(KeysInitializedError());
				return;
			}

			if (path === MemoryPath) {
				initNewKeys(path, (err, newKeys) => {
					if (err) {
						callback(err);
						return;
					}

					keys = newKeys;
					callback(undefined, keys);
				});
				return;
			}

			KeysReader().read(path, (err, readKeys) => {
				if (!err && readKeys) {
					callback(KeysInitializedError(err));
					return;
				}

				initNewKeys(path, (err, newKeys) => {
					if (err) {
						callback(err);
						return;
					}

					keys = newKeys;
					callback(undefined, keys);
				});
			});
		},

		get: (name) => {
			if (keys) {
				return keys.get(name);
			}
			return undefined;
		},

		keys: () => {
			return keys;
		},

		equals: (otherStore) => {
			if (!keys || !otherStore || !otherStore.keys()) {
				return false;
			}
			return keys.equals(otherStore.keys());
		}
	};
}

function initNewKeys(path, callback) {
	let keys = Keys();

	async.parallel([
		(asyncCallback) => {
			initKey(Config.encryptionKeyOptions(), (err, key) => {
				if (err) {
					asyncCallback(err);
					return;
				}

				keys.set("encryption", key);
				asyncCallback();
			});
		},
		(asyncCallback) => {
			initKey(Config.signingKeyOptions(), (err, key) => {
				if (err) {
					asyncCallback(err);
					return;
				}

				keys.set("signing", key);
				asyncCallback();
			});
		},
		(asyncCallback) => {
			initKey(Config.apiKeyOptions(), (err, key) => {
				if (err) {
					asyncCallback(err);
					return;
				}

				keys.set("api", key);
				asyncCallback();
			});
		}
	], (err) => {
		if (err) {
			callback(new KeyStoreInitError(err));
			return;
		}

		if (path === MemoryPath) {
			callback(undefined, keys);
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

function initKey(options, callback) {
	KeyGenerator(options).generate((err, newKey) => {
		if (err) {
			callback(err);
			return;							
		}
		callback(undefined, newKey.toString("hex"));
	});
}

module.exports = exports = KeyStore;