const assert = require("assert");
const Config = require("../src/config/Config");
const KeyStore = require("../src/crypt/KeyStore");
const KVCrypt = require("../src/crypt/KVCrypt");
const EncryptedKeyValue = require("../src/model/EncryptedKeyValue");
const IVCipher = require("../src/crypt/IVCipher");

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

	it("Key-Value Signing", (done) => {
		const key  = "key1";
		const ivCipher = new IVCipher("Contrary to popular belief, Lorem Ipsum is not simply random text.", "This is a sample IV string blah blah lorem ipsum. Test. Test.");
		const expectedKeyValue = new EncryptedKeyValue(key, ivCipher);
		const signature = KVCrypt().sign(expectedKeyValue);
		assert.ok(signature);

		const badKey = "badKey";
		const badIVCipher = new IVCipher("Contrary to popular belief. This is a bad cipherText.", "And this is a bad IV.");

		assert.ok(KVCrypt().confirm(expectedKeyValue, expectedKeyValue));
		assert.ok(!KVCrypt().confirm(new EncryptedKeyValue(key, badIVCipher), expectedKeyValue));
		assert.ok(!KVCrypt().confirm(new EncryptedKeyValue(badKey, ivCipher), expectedKeyValue));
		assert.ok(!KVCrypt().confirm(new EncryptedKeyValue(badKey, badIVCipher), expectedKeyValue));

		done();
	});
});