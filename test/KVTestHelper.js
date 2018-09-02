const assert = require("assert");
const Config = require("../src/config/Config");
const KeyStore = require("../src/crypt/KeyStore");
const ComponentStore = require("../src/component/ComponentStore");

module.exports = exports = {
	initialize: (loadComponents) => {
		return (done) => {
			Config.load("test");
			assert.ok(KeyStore);

			KeyStore.reinit(Config.secretPath(), (err, keys) => {
				assert.ok(!err);
				assert.ok(keys);

				KeyStore.load(Config.secretPath(), (err, keys) => {
					assert.ok(!err);
					assert.ok(keys);

					if (loadComponents) {
						ComponentStore.load();
					}

					done();
				});
			});
		};
	}
};
