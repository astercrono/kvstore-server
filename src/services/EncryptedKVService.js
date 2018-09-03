const KVService = require("./KVService");
const KVCrypt = require("../crypt/KVCrypt");
const IVCipher = require("../crypt/IVCipher");
const EncryptedKeyValue = require("../model/EncryptedKeyValue");
const KVSignatureError = require("../error/KVSignatureError");
const EncryptionError = require("../error/EncryptionError");
const DecryptionError = require("../error/DecryptionError");

class EncryptedKVService extends KVService {
	constructor(kvdao) {
		super(kvdao);
	}

	getAll(callback) {
		this.dao.getAll((error, keyValues) => {
			if (error) {
				callback(error);
				return;
			}

			this._decryptKeyValues(keyValues, (error) => {
				if (error) {
					callback(error);
					return;
				}

				if (keyValues.length > 0) {
					keyValues.forEach((kv) => {
						kv.signature = undefined;
					});
				}

				callback(undefined, keyValues);
			});
		});
	}

	getValue(key, callback) {
		this.dao.getValue(key, (error, keyValue) => {
			if (error) {
				callback(error);
				return;
			}

			if (!keyValue) {
				callback();
				return;
			}

			this._decryptKeyValue(keyValue, (error) => {
				if (error) {
					callback(error);
					return;
				}

				callback(undefined, keyValue.value);
			});
		});
	}

	putValue(newKeyValue, callback) {
		this.getValue(newKeyValue.key, (error, existingKeyValue) => {
			if (error) {
				callback(error);
				return;
			}

			this._encryptKeyValue(newKeyValue, (error, encryptedKeyValue) => {
				if (error) {
					callback(error);
					return;
				}

				this.dao.putValue(encryptedKeyValue, callback);
			});
		});
	}

	getKeys(callback) {
		this.dao.getKeys(callback);
	}

	deleteValue(key, callback) {
		this.getValue(key, (error, value) => {
			if (error) {
				callback(error);
				return;
			}

			if (!value) {
				callback();
			}

			this.dao.deleteValue(key, callback);
		});
	}

	_decryptKeyValues(keyValues, callback) {
		let promises = [];

		keyValues.forEach((kv) => {
			promises.push(new Promise((resolve, reject) => {
				this._decryptKeyValue(kv, (error) => {
					if (error) {
						reject(error);
						return;
					}
					resolve();
				});
			}).catch((error) => { callback(error); }));
		});

		Promise.all(promises).then(() => {
			callback();
		});
	}

	_encryptKeyValue(keyValue, callback) {
		KVCrypt().encrypt(keyValue.value, (error, ivCipher) => {
			if (error) {
				callback(new EncryptionError(keyValue.key, error));
				return;
			}

			const ekv = new EncryptedKeyValue(keyValue.key, ivCipher);
			ekv.signature = KVCrypt().signKeyValue(ekv);

			callback(undefined, ekv);
		});
	}

	_decryptKeyValue(keyValue, callback) {
		const ivCipher = IVCipher.decode(keyValue.value);
		const ekv = new EncryptedKeyValue(keyValue.key, ivCipher, keyValue.signature);

		if (!this._confirmKeyValueSignature(ekv)) {
			callback(new KVSignatureError(ekv.key));
			return;
		}

		KVCrypt().decrypt(ivCipher, (error, plaintext) => {
			if (error) {
				callback(new DecryptionError(keyValue.key, error));
				return;
			}
			keyValue.value = plaintext;
			callback();
		});
	}

	_confirmKeyValueSignature(encryptedKeyValue) {
		const expected = KVCrypt().signKeyValue(encryptedKeyValue);
		const actual = encryptedKeyValue.signature;
		return expected === actual;
	}
}

module.exports = exports = EncryptedKVService;
