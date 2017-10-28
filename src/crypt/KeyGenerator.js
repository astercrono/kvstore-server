const crypto = require("crypto");

const KeyGenerationError = require("../error/KeyGenerationError");

function KeyGenerator(options) {
	let keyLength = options.keyLength;
	let algorithm = options.algorithm;
	let iterations = options.iterations;
	let saltLength = options.saltLength;
	let passwordLength = options.passwordLength;

	return {
		generate: (callback) => {
			generateRandomHexString(saltLength, (err, salt) => {
				if (err) {
					callback(new KeyGenerationError(err));
					return;
				}

				generateRandomHexString(passwordLength, (err, password) => {
					if (err) {
						callback(new KeyGenerationError(err));
						return;
					}

					crypto.pbkdf2(password, salt, iterations, keyLength, algorithm, (err, buffer) => {
						if (err) {
							callback(new KeyGenerationError(err));
							return;
						}

						callback(undefined, buffer.toString("hex"));
					});
				});
			});
		}
	};
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

function pbkdf2(length, algorithm, callback) {
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

module.exports = exports = KeyGenerator;