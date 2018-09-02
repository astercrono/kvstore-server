const assert = require("assert");
const Config = require("./config/Config");
const KeyStore = require("./crypt/KeyStore");
const ComponentStore = require("./component/ComponentStore");

class Initializer {
	run(profile, done) {
		Config.load(profile);
		assert.ok(KeyStore);

		KeyStore.reinit(Config.secretPath(), (err, keys) => {
			assert.ok(!err);
			assert.ok(keys);

			KeyStore.load(Config.secretPath(), (err, keys) => {
				assert.ok(!err);
				assert.ok(keys);

				ComponentStore.load();

				if (Config.databasePath() === ":memory:") {
					this._setupDatabase(ComponentStore.get("KVDao"), done);
				}
				else {
					done();
				}
			});
		});
	}

	_setupDatabase(dao, callback) {
		const sql = "create table if not exists kvstore ( " +
			" key text not null primary key, " +
			" value text not null, " +
			" signature text not null " +
			") without rowid";
		dao.run(sql, [], (err) => {
			callback(err);
		});
	}
}

module.exports = exports = new Initializer();