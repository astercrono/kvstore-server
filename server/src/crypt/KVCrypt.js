const config = require("../../config");
const fs = require("fs");
const crypto = require("crypto");
const KVSecret = require("./KVSecret");

module.exports = exports = {
	encrypt: (plaintext, callback) => {
		readSecretFile((err, model) => {
			if (err) {
				callback(err);
				return;
			}

			encryptText(plaintext, model, callback);
		});
	},

	decrypt: (ciphertext, callback) => {
		readSecretFile((err, model) => {
			if (err) {
				callback(err);
				return;
			}

			decryptText(ciphertext, model, callback);
		});
	},

	initSecret: (callback) => {
		readSecretFile((err, model) => {
			if (err || !model || !model.validate()) {
				createSecret((err, secret) => {
					if (err) {
						callback(err);
						return;
					}

					const secretJson = JSON.stringify({
						"key": secret.key,
						"iv": secret.iv
					});

					fs.writeFile(config.crypt.path, secretJson, (err) => {
						if (err) {
							callback(err);
							return;
						}

						callback(undefined, secret);
					});
				});

				callback(err);
				return;
			}

			callback(undefined, model);
		});
	}
};

function createSecret(callback) {
	pbkdf2((err, key) => {
		if (err) {
			callback(err);
			return;
		}

		pbkdf2((err, iv) => {
			if (err) {
				callback(err);
				return;
			}

			callback(undefined, KVSecret.create(key, iv));
		});
	});
}

function readSecretFile(callback) {
	fs.readFile(config.crypt.path, "utf8", (err, data) => {
		if (err) {
			callback(err);
			return;
		}

		const model = JSON.parse(data);
		const secret = KVSecret.create(model.key, model.iv);

		callback(undefined, secret);
	});
}

function encryptText(plaintext, secret, callback) {
	const keyLength = config.crypt.keyLength;
	const blockMode = config.crypt.blockMode;

	const cipher = crypto.createCipheriv("aes-" + keyLength + "-" + blockMode, secret.key, secret.iv);
	cipher.update(plaintext, "base64");

	return cipher.final("base64");
}

function decryptText(ciphertext, secret, callback) {
	const keyLength = config.crypt.keyLength;
	const blockMode = config.crypt.blockMode;

	const cipher = crypto.createDecipheriv("aes-" + keyLength + "-" + blockMode, secret.key, secret.iv);
	cipher.update(ciphertext, "base64");

	return cipher.final("base64");
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