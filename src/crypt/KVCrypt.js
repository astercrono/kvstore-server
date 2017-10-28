const config = require("../../config");

const crypto = require("crypto");
const async = require("async");

const KeyStore = require("./KeyStore");
const KeyOptions = require("./KeyOptions");
const KeyGenerator = require("./KeyGenerator");
const KVSigner = require("./KVSigner");
const KeysInitializedError = require("../error/KeysInitializedError");
const EncryptionError = require("../error/EncryptionError");
const DecryptionError = require("../error/DecryptionError");

const encryptionConfig = config.crypt.encryption;
const signingConfig = config.crypt.signing;
const apiConfig = config.crypt.api;

const ivConfig = encryptionConfig.iv;
ivConfig.saltLength = 16;
ivConfig.passwordLength = 16;

const ivGenerator = KeyGenerator(KeyOptions(ivConfig));

let keyStore = undefined;
let kvSigner = undefined;

const KVCrypt = {
	initKeys: (overwrite, callback) => {
		if (keyStore) {
			callback();
			return;
		}

		keyStore = KeyStore();
		keyStore.init(overwrite, (err, keys) => {
			if (err) {
				keyStore = undefined;
				kvSigner = undefined;

				callback(err);
				return;
			}

			kvSigner = KVSigner(keyStore.get("signing"));

			callback();
		});
	},

	encrypt: (plaintext, callback) => {
		const algorithm = encryptionConfig.algorithm;
		const encryptionKey = keyStore.get("encryption");

		ivGenerator.generate((err, iv) => {
			if (err) {
				callback(err);
				return;
			}

			const ivBuffer = Buffer.from(iv, "hex");
			const cipher = crypto.createCipheriv(algorithm, encryptionKey, ivBuffer);
			cipher.update(plaintext, "utf8");

			const cipherText = cipher.final("hex");
			const ivString = ivBuffer.toString("hex");
			const fullCipherText = addIVToCipherText(cipherText, ivString);

			callback(undefined, fullCipherText);
		});
	},

	decrypt: (cipherText, callback) => {
		const algorithm = encryptionConfig.algorithm;
		const encryptionKey = keyStore.get("encryption");

		const secret = separateIVFromCipherText(cipherText);
		const ivBuffer = Buffer.from(secret.iv, "hex");
		const splitCipherText = secret.cipherText;

		const decipher = crypto.createDecipheriv(algorithm, encryptionKey, ivBuffer);
		decipher.update(splitCipherText, "hex");
	
		const plaintext = decipher.final("utf8");
		callback(undefined, plaintext);
	},

	signKV: (key, value) => {
		return kvSigner.sign(key, value);
	},

	confirmKVSignature: (key, value, expectedSignature) => {
		return kvSigner.confirm(key, value, expectedSignature);
	}
};

function addIVToCipherText(cipherText, iv) {
	return iv + encryptionConfig.keyDelimiter + cipherText;
}

function separateIVFromCipherText(fullCipherText) {
	const index = fullCipherText.indexOf(encryptionConfig.keyDelimiter);
	const iv = fullCipherText.substring(0, index);
	const cipherText = fullCipherText.substring(index + 1, fullCipherText.length);

	return {
		"iv": iv,
		"cipherText": cipherText
	};
}

module.exports = exports = KVCrypt;