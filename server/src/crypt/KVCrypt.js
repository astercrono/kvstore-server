const config = require("../../config");
const fs = require("fs");
const crypto = require("crypto");

const IV_KEY_DELIMETER = "$";
const ALGORITHM = "aes-" + config.crypt.keyLength + "-" + config.crypt.blockMode;

module.exports = exports = {
	encrypt: (plaintext, callback) => {
		readKeyFile((err, key) => {
			if (err) {
				callback(err);
				return;
			}

			pbkdf2((err, iv) => {
				const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
				cipher.update(plaintext, "base64");

				const cipherText = cipher.final("base64");
				const fullCipherText = addIVToKey(key, iv);

				callback(undefined, fullCipherText);
			});
		});
	},

	decrypt: (cipherText, callback) => {
		readKeyFile((err, key) => {
			if (err) {
				callback(err);
				return;
			}

			var secret = separateIVFromKey(key);			

			const cipher = crypto.createDecipheriv(ALGORITHM, secret.key, secret.iv);
			cipher.update(cipherText, "base64");
		
			const plaintext = cipher.final("base64");
			return plaintext;
		});
	},

	initKey: (overwrite, callback) => {
		readKeyFile((err, key) => {
			if (err || !key || key === "" || key.length === 0) {
				if (!overwrite) {
					callback(undefined, key);
					return;
				}

				createKey((err, newKey) => {
					if (err) {
						callback(err);
						return;
					}

					fs.writeFile(config.crypt.path, newKey, callback);
				});
			}
		});
	}
};

function createKey(callback) {
	pbkdf2((err, key) => {
		if (err) {
			callback(err);
			return;
		}

		callback(undefined, key);
	});
}

function readKeyFile(callback) {
	fs.readFile(config.crypt.path, "utf8", (err, key) => {
		if (err) {
			callback(err);
			return;
		}

		callback(undefined, key);
	});
}

function generateRandomValue(length, callback) {
	crypto.randomBytes(length, (err, buff) => {
		if (err) {
			callback(err);
			return;
		}

		const value = buff.toString("base64");
		callback(undefined, value);
	});
}

function pbkdf2(callback) {
	generateRandomValue(config.crypt.saltLength, (err, salt) => {
		generateRandomValue(config.crypt.passwordLength, (err, password) => {
			const algorithm = "sha" + config.crypt.keyLength;
			const iterations = config.crypt.pbkdf2Iterations;
			const keyLength = config.crypt.keyLength;

			crypto.pbkdf2(password, salt, iterations, keyLength, algorithm, (err, cipher) => {
				if (err) {
					callback(err);
					return;
				}

				callback(undefined, cipher.toString("base64"));
			});
		});
	});
}

function addIVToKey(key, iv) {
	return iv + IV_KEY_DELIMETER + key;
}

function separateIVFromKey(fullKey) {
	const index = fullKey.indexOf(IV_KEY_DELIMETER);
	const iv = fullKey.substring(0, index);
	const key = fullKey.substring(index + 1, fullKey.length);

	return {
		"iv": iv,
		"key": key
	};
}