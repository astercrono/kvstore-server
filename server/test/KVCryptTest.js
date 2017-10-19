const assert = require("assert");
const KVCrypt = require("../src/crypt/KVCrypt");

const config = require("../config");
config.crypt.path = "kvstore-test.secret";

describe("KVCrypt", () => {
	before((done) => {
		KVCrypt.initKey(true, (err, key) => {
			assert.ok(!err);
			assert.ok(key);
			done();
		});
	});

	it("encrypt() / decrypt()", (done) => {
		const originalPlaintext = "Hello World";

		KVCrypt.encrypt(originalPlaintext, (err, cipherText) => {
			assert.ok(!err);

			KVCrypt.decrypt(cipherText, (err, plaintext) => {
				assert.ok(!err);
				assert.equal(plaintext, originalPlaintext);

				done();
			});
		});
	});
});