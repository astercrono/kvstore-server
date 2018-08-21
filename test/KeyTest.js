const assert = require("assert");
const Config = require("../src/config/Config");
const KeyStore = require("../src/crypt/KeyStore");

describe("Key Loading and Storage", () => {
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
		keyStore.confirm();
		done();
	});
});