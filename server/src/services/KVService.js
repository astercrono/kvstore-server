const KVDao = require("../dataaccess/KVDao");

module.exports = exports = {
	getAll: (callback) => {
		KVDao.getAll(callback);
	},

	getValue: (key, callback) => {
		KVDao.getValue(key, callback);
	},

	putValue: (key, value, callback) => {
		KVDao.putValue(key, value, callback);
	},

	getKeys: (callback) => {
		KVDao.getKeys(callback);
	},

	getKeysWithValue: (value, callback) => {
		KVDao.getKeysWithValue(value, callback);
	},

	deleteValue: (key, callback) => {
		KVDao.deleteValue(key, callback);
	},

	refreshDatabase: (callback) => {
		KVDao.dropKVStore((err) => {
			if (err) {
				callback(err);
				return;
			}

			KVDao.createKVStore(callback);
		});
	}
};
