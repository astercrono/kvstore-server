const async = require("async");
const assert = require("assert");

const Config = require("../config/Config");
const KeyStoreInitError = require("../error/KeyStoreInitError");
const KeysInitializedError = require("../error/KeysInitializedError");
const KeysUninitializedError = require("../error/KeysUninitializedError");
const KeysReader = require("./KeysReader");
const KeysWriter= require("./KeysWriter");
const KeyGenerator = require("./KeyGenerator");
const Keys = require("./Keys");

const MemoryPath = ":memory:";

class KeyStore {
	constructor() {
		this.path = undefined;
		this._keys = undefined;
	}

	set keys (keys) { this._keys = keys; }
	get keys () { return this._keys; }

	confirm () {
		assert.ok(this.keys);
		assert.ok(this.keys.get("encryption"));
		assert.ok(this.keys.getBuffer("encryption").length === Config.encryptionKeyLength());
		assert.ok(this.keys.get("signing"));
		assert.ok(this.keys.getBuffer("signing").length === Config.signingKeyLength());
		assert.ok(this.keys.get("api"));
		assert.ok(this.keys.getBuffer("api").length === Config.apiKeyLength());
	}

	load(path, callback) {
		this.path = path;

		if (this.path === MemoryPath) {
			if (!this.keys) {
				callback(undefined, new KeysUninitializedError());
				return;
			}
			callback(undefined, this.keys);
			return;
		}

		new KeysReader(this.path).read((err, readKeys) => {
			if (err) {
				callback(err);
				return;
			}

			this.keys = readKeys;
			callback(undefined, this.keys);
		});
	}

	init(path, callback) {
		this.path = path;

		if (this.keys) {
			callback(KeysInitializedError());
			return;
		}

		if (this.path === MemoryPath) {
			this._initNewKeys(this.path, (err, newKeys) => {
				if (err) {
					callback(err);
					return;
				}

				this.keys = newKeys;
				callback(undefined, this.keys);
			});
			return;
		}

		new KeysReader(this.path).read((err, readKeys) => {
			if (!err && readKeys) {
				callback(KeysInitializedError(err));
				return;
			}

			this._initNewKeys(path, (err, newKeys) => {
				if (err) {
					callback(err);
					return;
				}

				this.keys = newKeys;
				callback(undefined, this.keys);
			});
		});
	}

	get(name) {
		if (this.keys) {
			return this.keys.get(name);
		}
		return undefined;
	}

	getBuffer(name) {
		if (this.keys) {
			return this.keys.getBuffer(name);
		}
		return undefined;
	}

	equals(otherStore) {
		if (!this.keys || !otherStore || !otherStore.keys) {
			return false;
		}
		return this.keys.equals(otherStore.keys);
	}

	_initNewKeys(path, callback) {
		this.keys = new Keys();

		async.parallel([
			(asyncCallback) => {
				this._initKey(Config.encryptionKeyOptions(), (err, key) => {
					if (err) {
						asyncCallback(err);
						return;
					}

					this.keys.set("encryption", key);
					asyncCallback();
				});
			},
			(asyncCallback) => {
				this._initKey(Config.signingKeyOptions(), (err, key) => {
					if (err) {
						asyncCallback(err);
						return;
					}

					this.keys.set("signing", key);
					asyncCallback();
				});
			},
			(asyncCallback) => {
				this._initKey(Config.apiKeyOptions(), (err, key) => {
					if (err) {
						asyncCallback(err);
						return;
					}

					this.keys.set("api", key);
					asyncCallback();
				});
			}
		], (err) => {
			if (err) {
				callback(new KeyStoreInitError(err));
				return;
			}

			if (path === MemoryPath) {
				callback(undefined, this.keys);
				return;
			}

			new KeysWriter(this.path).write(this.keys, (err) => {
				if (err) {
					callback(err);
					return;
				}
				callback(undefined, this.keys);
			});
		});
	}

	_initKey(options, callback) {
		new KeyGenerator(options).generate((err, newKey) => {
			if (err) {
				callback(err);
				return;
			}
			callback(undefined, newKey.toString("hex"));
		});
	}
}

module.exports = exports = new KeyStore();