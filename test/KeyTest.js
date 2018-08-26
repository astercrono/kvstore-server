const assert = require("assert");
const Config = require("../src/config/Config");
const KeyStore = require("../src/crypt/KeyStore");

describe("Key Store", () => {
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

	it("Load and Store Keys", (done) => {
		KeyStore.confirm();
		done();
	});
});