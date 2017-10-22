const assert = require("assert");
const async = require("async");

const KVCrypt = require("../src/crypt/KVCrypt");

const config = require("../config");
config.crypt.path = "kvstore-test.secret";

describe("KVCrypt", () => {
	before((done) => {
		KVCrypt.initSecrets(true, (err, key) => {
			assert.ok(!err);
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

	it("sign()", (done) => {
		const originalValue = "Hello World.";
		const goodValue = "Hello World.";
		const badValue = "Hellu World";

		const signature = KVCrypt.sign(originalValue);
		assert.ok(signature);

		const goodSignature = KVCrypt.sign(goodValue);
		assert.ok(goodSignature);
		assert.equal(goodSignature, signature);

		const badSignature = KVCrypt.sign(badValue);
		assert.ok(badSignature);
		assert.notEqual(badSignature, signature);

		done();
	});
});