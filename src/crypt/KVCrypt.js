const config = require("../../config");
const fs = require("fs");
const crypto = require("crypto");

const encryptionConfig = config.crypt.encryption;
const signingConfig = config.crypt.signing;

module.exports = exports = {
	encrypt: (plaintext, callback) => {
		const ivLength = encryptionConfig.ivLength;
		const algorithm = encryptionConfig.algorithm;

		readKeyFile((err, keyBuffer) => {
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
		const algorithm = encryptionConfig.algorithm;

		readKeyFile((err, key) => {
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

	initKey: (overwrite, callback) => {
		readKeyFile((err, key) => {
			if (err || overwrite) {
				createKey((err, buffer) => {
					if (err) {
						callback(err);
						return;
					}

					const newKey = buffer.toString("hex");

					fs.writeFile(encryptionConfig.path, newKey, (err) => {
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
	pbkdf2(encryptionConfig.keyLength, (err, key) => {
		if (err) {
			callback(err);
			return;
		}

		callback(undefined, key);
	});
}

function readKeyFile(callback) {
	fs.readFile(encryptionConfig.path, "utf8", (err, key) => {
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
	const saltLength = encryptionConfig.saltLength;
	const passwordLength = encryptionConfig.passwordLength;
	const algorithm = encryptionConfig.pbkdf2Algorithm;
	const iterations = encryptionConfig.pbkdf2Iterations;

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