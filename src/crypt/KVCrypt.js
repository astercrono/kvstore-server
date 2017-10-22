const config = require("../../config");
const KVKeysInitializedError = require("../model/KVKeysInitializedError");

const fs = require("fs");
const crypto = require("crypto");
const async = require("async");

const encryptionConfig = config.crypt.encryption;
const signingConfig = config.crypt.signing;
const pbkdf2Config = config.crypt.pbkdf2;

let encryptionKey = undefined;
let signingKey = undefined;

module.exports = exports = {
	encrypt: (plaintext, callback) => {
		const path = encryptionConfig.path;
		const ivLength = encryptionConfig.ivLength;
		const algorithm = encryptionConfig.algorithm;

		pbkdf2(ivLength, (err, ivBuffer) => {
			const cipher = crypto.createCipheriv(algorithm, encryptionKey, ivBuffer);
			cipher.update(plaintext, "utf8");

			const cipherText = cipher.final("hex");
			const ivString = ivBuffer.toString("hex");
			const fullCipherText = addIVToCipherText(cipherText, ivString);

			callback(undefined, fullCipherText);
		});
	},

	decrypt: (cipherText, callback) => {
		const path = encryptionConfig.path;
		const algorithm = encryptionConfig.algorithm;

		const secret = separateIVFromCipherText(cipherText);
		const ivBuffer = Buffer.from(secret.iv, "hex");
		const splitCipherText = secret.cipherText;

		const decipher = crypto.createDecipheriv(algorithm, encryptionKey, ivBuffer);
		decipher.update(splitCipherText, "hex");
	
		const plaintext = decipher.final("utf8");
		callback(undefined, plaintext);
	},

	initSecrets: (overwrite, callback) => {
		async.parallel([
			(asyncCallback) => {
				const length = encryptionConfig.keyLength;
				const path = encryptionConfig.path;

				initKey(path, length, overwrite, (err, key) => {
					if (err) {
						asyncCallback(err);
						return;
					}

					encryptionKey = key;
					asyncCallback(undefined);
				});
			},
			(asyncCallback) => {
				const length = signingConfig.keyLength;
				const path = signingConfig.path;

				initKey(path, length, overwrite, (err, key) => {
					if (err) {
						asyncCallback(err);
						return;
					}

					signingKey = key;
					asyncCallback(undefined);
				});
			}
		], (err, results) => {
			if (err) {
				callback(err);
				return;
			}

			if (!encryptionKey || !signingKey) {
				callback(KVKeysInitializedError());
				return;
			}

			callback();
		});
	},

	sign: (key, value) => {
		return hmac(key, value, signingKey);
	},

	confirmSignature: (key, value, expectedSignature) => {
		if (!value) {
			return false;
		}

		const signature = hmac(key, value, signingKey);

		if (!signature) {
			return false;
		}

		return signature === expectedSignature;
	}
};

function initKey(path, length, overwrite, callback) {
	readKeyFile(path, (err, key) => {
		if (err || overwrite) {
			createKey(length, (err, buffer) => {
				if (err) {
					callback(err);
					return;
				}

				const newKey = buffer.toString("hex");

				fs.writeFile(path, newKey, (err) => {
					if (err) {
						callback(err);
						return;
					}

					callback(undefined, buffer);
				});
			});
			return;
		}

		callback(undefined, key);
	});
}

function createKey(length, callback) {
	pbkdf2(length, (err, key) => {
		if (err) {
			callback(err);
			return;
		}

		callback(undefined, key);
	});
}

function readKeyFile(path, callback) {
	fs.readFile(path, "utf8", (err, key) => {
		if (err) {
			callback(err);
			return;
		}

		callback(undefined, Buffer.from(key, "hex"));
	});
}

function generateRandomHexString(length, callback) {
	crypto.randomBytes(length, (err, buff) => {
		if (err) {
			callback(err);
			return;
		}

		const value = buff.toString("hex");
		callback(undefined, value);
	});
}

function pbkdf2(length, callback) {
	const saltLength = pbkdf2Config.saltLength;
	const passwordLength = pbkdf2Config.passwordLength;
	const algorithm = pbkdf2Config.algorithm;
	const iterations = pbkdf2Config.iterations;

	generateRandomHexString(saltLength, (err, salt) => {
		generateRandomHexString(passwordLength, (err, password) => {
			crypto.pbkdf2(password, salt, iterations, length, algorithm, (err, buffer) => {
				if (err) {
					callback(err);
					return;
				}

				callback(undefined, buffer);
			});
		});
	});
}

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

function hmac(key, value) {
	const algorithm = signingConfig.algorithm;

	const hash = crypto.createHash(algorithm);
	hash.update(key); 
	hash.update(value);
	const hashValue = hash.digest("hex");

	const hmac = crypto.createHmac(algorithm, signingKey);
	hmac.update(hashValue);
	return hmac.digest("hex");
}