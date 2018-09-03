const ComponentLoader = require("../../ComponentLoader");
const Config = require("../../../config/Config");
const SqliteKVDao = require("../../../dataaccess/SqliteKVDao");
const SqliteKVDaoComponent = require("./SqliteKVDaoComponent");

class DaoLoader extends ComponentLoader {
	load() {
		const dao = new SqliteKVDao(Config.databasePath());
		return new SqliteKVDaoComponent(dao);
	}
}

module.exports = exports = DaoLoader;