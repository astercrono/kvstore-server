const assert = require("assert");
const Config = require("../src/config/Config");
const KeyStore = require("../src/crypt/KeyStore");
const KVCrypt = require("../src/crypt/KVCrypt");

describe("KVCrypt", () => {
	before((done) => {
		Config.load("test");
		assert.ok(KeyStore);

		KeyStore.reinit(Config.secretPath(), (err, keys) => {
			assert.ok(!err);
			assert.ok(keys);

			KeyStore.load(Config.secretPath(), (err, keys) => {
				assert.ok(!err);
				assert.ok(keys);

				done();
			});
		});
	});

	it("Encryption / Decryption", (done) => {
		const plaintext = "Contrary to popular belief, Lorem Ipsum is not simply random text. ";

		KVCrypt().encrypt(plaintext, (err, ivCipher) => {
			assert.ok(!err);
			assert.ok(ivCipher);
			assert.ok(ivCipher.cipherText);
			assert.ok(ivCipher.iv);
			assert.notEqual(ivCipher.cipherText, plaintext);

			KVCrypt().decrypt(ivCipher, (err, decryptedPlaintext) => {
				assert.ok(!err);
				assert.ok(decryptedPlaintext);
				assert.equal(decryptedPlaintext, plaintext);
				done();
			});
		});
	});
});