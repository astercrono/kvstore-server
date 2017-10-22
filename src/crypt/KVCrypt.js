const config = require("../../config");
const KVSecrets = require("../model/KVSecrets");

const fs = require("fs");
const crypto = require("crypto");
const async = require("async");

const encryptionConfig = config.crypt.encryption;
const signingConfig = config.crypt.signing;
const pbkdf2Config = config.crypt.pbkdf2;

module.exports = exports = {
	encrypt: (plaintext, callback) => {
		const path = encryptionConfig.path;
		const ivLength = encryptionConfig.ivLength;
		const algorithm = encryptionConfig.algorithm;

		readKeyFile(path, (err, keyBuffer) => {
			if (err) {
				callback(err);
				return;
			}

			pbkdf2(ivLength, (err, ivBuffer) => {
				const cipher = crypto.createCipheriv(algorithm, keyBuffer, ivBuffer);
				cipher.update(plaintext, "utf8");

				const cipherText = cipher.final("hex");
				const ivString = ivBuffer.toString("hex");
				const fullCipherText = addIVToCipherText(cipherText, ivString);

				callback(undefined, fullCipherText);
			});
		});
	},

	decrypt: (cipherText, callback) => {
		const path = encryptionConfig.path;
		const algorithm = encryptionConfig.algorithm;

		readKeyFile(path, (err, key) => {
			if (err) {
				callback(err);
				return;
			}

			const secret = separateIVFromCipherText(cipherText);
			const ivBuffer = Buffer.from(secret.iv, "hex");
			const splitCipherText = secret.cipherText;

			const decipher = crypto.createDecipheriv(algorithm, key, ivBuffer);
			decipher.update(splitCipherText, "hex");
		
			const plaintext = decipher.final("utf8");
			callback(undefined, plaintext);
		});
	},

	initSecrets: (overwrite, callback) => {
		let encryptionKey = undefined;
		let signingKey = undefined;

		async.parallel([
			(asyncCallback) => {
				const length = encryptionConfig.keyLength;
				const path = encryptionConfig.path;

				initKey(path, length, overwrite, (err, key) => {
					if (err) {
						asyncCallback(err);
						return;
					}

					asyncCallback(undefined, key);
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

					asyncCallback(undefined, key);
				});
			}
		], (err, results) => {
			if (err) {
				callback(err);
				return;
			}

			const secrets = KVSecrets(encryptionKey, signingKey);
			callback(undefined, secrets);
		});
	},

	sign: (value, callback) => {
		const path = signingConfig.path;

		readKeyFile(path, (err, key) => {
			if (err) {
				callback(err);
				return;
			}

			const signature = hmac(value, key);
			callback(undefined, signature);
		});
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

					callback(undefined, newKey);
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

function hmac(value, key) {
	const algorithm = signingConfig.algorithm;

	const hash = crypto.createHash(algorithm);
	hash.update(value);
	const hashValue = hash.digest("hex");

	const hmac = crypto.createHmac(algorithm, key);
	hmac.update(hashValue);
	return hmac.digest("hex");
}