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
			callback(new KeysInitializedError());
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
			if (err) {
				callback(new KeysInitializedError(err));
				return;
			}

			if (readKeys) {
				this.keys = readKeys;
				callback(undefined, this.keys);
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

	reinit(path, callback) {
		this.keys = undefined;
		this.init(path, callback);
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

		let promises = [
			this._createKeyPromise(Config.encryptionKeyOptions()).catch((error) => { callback(new KeyStoreInitError(error)); }),
			this._createKeyPromise(Config.signingKeyOptions()).catch((error) => { callback(new KeyStoreInitError(error)); }),
			this._createKeyPromise(Config.apiKeyOptions()).catch((error) => { callback(new KeyStoreInitError(error)); })
		];
		Promise.all(promises).then(() => {
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

	_createKeyPromise(keyOptions) {
		return new Promise((resolve, reject) => {
			this._initKey(keyOptions, (err, key) => {
				if (err) {
					return reject(err);
				}

				this.keys.set(keyOptions.name, key);
				return resolve();
			});
		});
	}

	_initKey(options, callback) {
		new KeyGenerator(options).generate((err, newKey) => {
			if (err) {
				callback(err);
				return;
			}
			callback(undefined, newKey);
		});
	}
}

module.exports = exports = new KeyStore();