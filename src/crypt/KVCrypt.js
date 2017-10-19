const config = require("../../config");
const fs = require("fs");
const crypto = require("crypto");


const IV_LENGTH = config.crypt.ivLength;
const KEY_LENGTH = config.crypt.keyLength;
const IV_KEY_DELIMETER = "$";
const ALGORITHM = config.crypt.encryptAlgrorithm;

module.exports = exports = {
	encrypt: (plaintext, callback) => {
		readKeyFile((err, keyBuffer) => {
			if (err) {
				callback(err);
				return;
			}

			pbkdf2(IV_LENGTH, (err, ivBuffer) => {
				const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, ivBuffer);
				cipher.update(plaintext, "utf8");

				const cipherText = cipher.final("hex");
				const ivString = ivBuffer.toString("hex");
				const fullCipherText = addIVToCipherText(cipherText, ivString);

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

			const secret = separateIVFromCipherText(cipherText);
			const ivBuffer = Buffer.from(secret.iv, "hex");
			const splitCipherText = secret.cipherText;

			const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuffer);
			decipher.update(splitCipherText, "hex");
		
			const plaintext = decipher.final("utf8");
			callback(undefined, plaintext);
		});
	},

	initKey: (overwrite, callback) => {
		readKeyFile((err, key) => {
			if (err || overwrite) {
				createKey((err, buffer) => {
					if (err) {
						callback(err);
						return;
					}

					const newKey = buffer.toString("hex");

					fs.writeFile(config.crypt.path, newKey, (err) => {
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
};

function createKey(callback) {
	pbkdf2(KEY_LENGTH, (err, key) => {
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
	generateRandomHexString(config.crypt.saltLength, (err, salt) => {
		generateRandomHexString(config.crypt.passwordLength, (err, password) => {
			const algorithm = config.crypt.pbkdf2Algorithm;
			const iterations = config.crypt.pbkdf2Iterations;
			const keyLength = config.crypt.keyLength;

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
	return iv + IV_KEY_DELIMETER + cipherText;
}

function separateIVFromCipherText(fullCipherText) {
	const index = fullCipherText.indexOf(IV_KEY_DELIMETER);
	const iv = fullCipherText.substring(0, index);
	const cipherText = fullCipherText.substring(index + 1, fullCipherText.length);

	return {
		"iv": iv,
		"cipherText": cipherText
	};
}