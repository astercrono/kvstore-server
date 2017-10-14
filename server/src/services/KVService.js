const kvdao = require("../dataaccess/KVDao");

module.exports = exports = {
	getAll: (callback) => {
		kvdao.getAll(callback);
	},

	getValue: (key, callback) => {
		kvdao.getValue(key, callback);
	},

	putValue: (key, value, callback) => {
		kvdao.putValue(key, value, callback);
	},

	getKeys: (callback) => {
		kvdao.getKeys(callback);
	},

	getKeysWithValue: (value, callback) => {
		kvdao.getKeysWithValue(value, callback);
	}
};
