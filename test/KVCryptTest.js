const assert = require("assert");
const async = require("async");

const KVCrypt = require("../src/crypt/KVCrypt");

const config = require("../config");
config.crypt.path = "kvstore-test.secret";

describe("KVCrypt", () => {
	before((done) => {
		KVCrypt.initSecrets(true, (err, key) => {
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

	it("sign()", (done) => {
		const originalValue = "Hello World.";
		const goodValue = "Hello World.";
		const badValue = "Hellu World";

		KVCrypt.sign(originalValue, (err, signature) => {
			assert.ok(!err);
			assert.ok(signature);

			async.parallel([
				(asyncCallback) => {
					KVCrypt.sign(goodValue, (err, goodSignature) => {
						assert.ok(!err);
						assert.ok(goodSignature);
						assert.equal(goodSignature, signature);
						asyncCallback(undefined, goodSignature);
					});
				},
				(asyncCallback) => {
					KVCrypt.sign(badValue, (err, badSignature) => {
						assert.ok(!err);
						assert.ok(badSignature);
						assert.notEqual(badSignature, signature);
						asyncCallback(undefined, badSignature);
					});
				}
			], (err, results) => {
				assert.ok(!err);
				assert.equal(results.length, 2);
				done();
			});
		});
	});
});