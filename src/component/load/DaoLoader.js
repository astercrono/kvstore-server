const fs = require("fs");
const ComponentLoader = require("../ComponentLoader");
const Config = require("../../config/Config");
const SqliteKVDao = require("../../dataaccess/SqliteKVDao");

class DaoLoader extends ComponentLoader {
	load() {
		const dao = new SqliteKVDao(Config.databasePath());
		return super.createComponent("KVDao", dao);
	}
}

module.exports = exports = DaoLoader;