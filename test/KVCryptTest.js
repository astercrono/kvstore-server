const assert = require("assert");
const KeyStore = require("../src/crypt/KeyStore");
const KVTestHelper = require("./KVTestHelper");
const KVCrypt = require("../src/crypt/KVCrypt");
const EncryptedKeyValue = require("../src/model/EncryptedKeyValue");
const IVCipher = require("../src/crypt/IVCipher");

describe("KVCrypt", () => {
	before(KVTestHelper.initialize(false));

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
		const signature = KVCrypt().signKeyValue(expectedKeyValue);
		assert.ok(signature);

		const badKey = "badKey";
		const badIVCipher = new IVCipher("Contrary to popular belief. This is a bad cipherText.", "And this is a bad IV.");

		assert.ok(KVCrypt().confirmSignature(expectedKeyValue, expectedKeyValue));
		assert.ok(!KVCrypt().confirmSignature(new EncryptedKeyValue(key, badIVCipher), expectedKeyValue));
		assert.ok(!KVCrypt().confirmSignature(new EncryptedKeyValue(badKey, ivCipher), expectedKeyValue));
		assert.ok(!KVCrypt().confirmSignature(new EncryptedKeyValue(badKey, badIVCipher), expectedKeyValue));

		done();
	});

	it("API Key Confirmation", (done) => {
		const expectedKey = KeyStore.get("api");
		const badKey = "This is a very bad key.";

		assert.ok(KVCrypt().confirmApiKey(expectedKey));
		assert.ok(!KVCrypt().confirmApiKey(badKey));

		done();
	});
});