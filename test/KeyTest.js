const assert = require("assert");
const Config = require("../src/config/Config");
const KeyStore = require("../src/crypt/KeyStore");

describe("Key Loading Test", () => {
	let keyStore = undefined;

	before((done) => {
		Config.load("test");
		keyStore = KeyStore();

		keyStore.init((err, keys) => {
			assert.ok(!err);
			assert.ok(keys);

			keyStore.load((err, keys) => {
				assert.ok(!err);
				assert.ok(keys);

				done();
			});
		});
	});

	it("Check Keys", (done) => {
		assert.ok(keyStore);
		assert.ok(keyStore.keys);
		assert.ok(keyStore.get("encryption"));
		assert.ok(keyStore.get("signing"));
		assert.ok(keyStore.get("api"));
		done();
	});
});