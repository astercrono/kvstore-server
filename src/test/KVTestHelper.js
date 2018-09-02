const assert = require("assert");
const Config = require("../config/Config");
const KeyStore = require("../crypt/KeyStore");
const ComponentStore = require("../component/ComponentStore");

module.exports = exports = {
	initialize: () => {
		return (done) => {
			Config.load("test");
			assert.ok(KeyStore);

			KeyStore.reinit(Config.secretPath(), (err, keys) => {
				assert.ok(!err);
				assert.ok(keys);

				KeyStore.load(Config.secretPath(), (err, keys) => {
					assert.ok(!err);
					assert.ok(keys);

					ComponentStore.load();

					done();
				});
			});
		};
	}
};
