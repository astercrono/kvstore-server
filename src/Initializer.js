const assert = require("assert");
const express = require("express");

const Config = require("./config/Config");
const KeyStore = require("./crypt/KeyStore");
const ComponentStore = require("./component/ComponentStore");
const Component = require("./component/Component");
const ExpressController = require("./controllers/ExpressController");
const ExpressAppServerComponent = require("./ExpressAppServerComponent");

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
					this._setupDatabase(ComponentStore.getElement("KVDao"), () => {
						this._startExpressServer(done);
					});
				}
				else {
					this._startExpressServer(done);
				}
			});
		});
	}

	stop(done) {
		ComponentStore.destroy(done);
	}

	_startExpressServer(done) {
		const app = express();
		ComponentStore.add(new Component("ExpressApp", app));

		const controllers = ComponentStore.getElementsByType(ExpressController);
		controllers.forEach((c) => {
			app.use(c.path, c.router);
		});

		const appServer = app.listen(Config.httpPort(), () => {
			if (Config.name !== "test") {
				console.log("http server is istening on port " + Config.httpPort());
			}
			done();
		});
		ComponentStore.add(new ExpressAppServerComponent(appServer));
	}

	_setupDatabase(dao, callback) {
		const sql = "create table if not exists kvstore ( " +
			" key text not null primary key, " +
			" value text not null, " +
			" signature text not null " +
			") without rowid";
		dao.run(sql, [], (err) => {
			assert.ok(!err);
			callback(err);
		});
	}
}

module.exports = exports = new Initializer();