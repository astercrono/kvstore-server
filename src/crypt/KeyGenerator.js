const crypto = require("crypto");

const KeyGenerationError = require("../error/KeyGenerationError");
const KeyLengthTooLargeError = require("../error/KeyLengthTooLargeError");

class KeyGenerator {
	constructor(options) {
		this.keyLength = options.keyLength;
		this.algorithm = options.algorithm;
		this.iterations = options.iterations;
		this.saltLength = options.saltLength;
		this.passwordLength = options.passwordLength;
	}

	generate(callback) {
		let saltLength = this.saltLength;
		let passwordLength = this.passwordLength;
		let iterations = this.iterations;
		let keyLength = this.keyLength;
		let algorithm = this.algorithm;

		this._generateRandomBytes(saltLength, (err, saltBuffer) => {
			if (err) {
				callback(new KeyGenerationError(err));
				return;
			}

			this._generateRandomBytes(passwordLength, (err, passwordBuffer) => {
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
						buff = this._cutBuffer(buff, keyLength);
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

	_generateRandomBytes(length, callback) {
		crypto.randomBytes(length, (err, buff) => {
			if (err) {
				callback(err);
				return;
			}
			callback(undefined, buff);
		});
	}

	_cutBuffer(buff, length) {
		return Buffer.from(buff.toString("hex").substring(0, length * 2), "hex");
	}
}

module.exports = exports = KeyGenerator;