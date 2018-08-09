const crypto = require("crypto");

const KeyGenerationError = require("../error/KeyGenerationError");
const KeyLengthTooLargeError = require("../error/KeyLengthTooLargeError");

function KeyGenerator(options) {
	let keyLength = options.keyLength;
	let algorithm = options.algorithm;
	let iterations = options.iterations;
	let saltLength = options.saltLength;
	let passwordLength = options.passwordLength;

	return {
		generate: (callback) => {
			generateRandomBytes(saltLength, (err, saltBuffer) => {
				if (err) {
					callback(new KeyGenerationError(err));
					return;
				}

				generateRandomBytes(passwordLength, (err, passwordBuffer) => {
					if (err) {
						callback(new KeyGenerationError(err));
						return;
					}

					crypto.pbkdf2(passwordBuffer, saltBuffer, iterations, keyLength, algorithm, (err, buff) => {
						if (err) {
							callback(new KeyGenerationError(err));
							return;
						}

						if (buff.length > keyLength) {
							buff = cutBuffer(buff, keyLength);
						}
						else if (buff.length < keyLength) {
							callback(new KeyLengthTooLargeError());
							return;
						}

						callback(undefined, buff);
					});
				});
			});
		}
	};
}

function generateRandomBytes(length, callback) {
	crypto.randomBytes(length, (err, buff) => {
		if (err) {
			callback(err);
			return;
		}
		callback(undefined, buff);
	});
}

function cutBuffer(buff, length) {
	return Buffer.from(buff.toString("hex").substring(0, length * 2), "hex");
}

module.exports = exports = KeyGenerator;