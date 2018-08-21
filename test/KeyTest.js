const assert = require("assert");
const Config = require("../src/config/Config");
const KeyStore = require("../src/crypt/KeyStore");

describe("Key Loading and Storage", () => {
	before((done) => {
		Config.load("test");
		assert.ok(KeyStore);

		KeyStore.init(Config.secretPath(), (err, keys) => {
			assert.ok(!err);
			assert.ok(keys);

			KeyStore.load(Config.secretPath(), (err, keys) => {
				assert.ok(!err);
				assert.ok(keys);

				done();
			});
		});
	});

	it("Check Keys", (done) => {
		KeyStore.confirm();
		done();
	});
});