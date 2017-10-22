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
		const originalKey = "helloKey";
		const originalValue = "Hello World.";

		const goodKey = "helloKey";
		const goodValue = "Hello World.";

		const badKey = "helluKey";
		const badValue = "Hellu World";

		const signature = KVCrypt.sign(originalKey, originalValue);
		assert.ok(signature);

		confirmGoodSignature(goodKey, goodValue, signature);
		confirmBadSignature(goodKey, badValue, signature);
		confirmBadSignature(badKey, goodValue, signature);
		confirmBadSignature(badKey, badValue, signature);

		done();
	});
});

function confirmGoodSignature(key, value, expectedSignature) {
	const goodSignature = KVCrypt.sign(key, value);
	assert.ok(goodSignature);
	assert.equal(goodSignature, expectedSignature);	
}

function confirmBadSignature(key, value, expectedSignature) {
	let badSignature = KVCrypt.sign(key, value);
	assert.ok(badSignature);
	assert.notEqual(badSignature, expectedSignature);
}