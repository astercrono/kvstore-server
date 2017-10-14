const config = require("../../config.js");

const sqlite = require("sqlite3");
const db = new sqlite.Database(config.database.path);

const getAllSql = "select key, value from kvstore";
const getValueSql = "select value from kvstore where key = ?";
const putValueSql = "insert or replace into kvstore (key, value) values (?, ?)";
const getKeysSql = "select key from kvstore";
const getKeysWithValueSql = "select key from kvstore where value = ?";

module.exports = exports = {
	getAll: (callback) => {
		db.all(getAllSql, (err, rows) => {
			if (err) {
				callback(err);
			}

			callback(undefined, rows);
		});
	},

	getValue: (key, callback) => {
		db.get(getValueSql, [key], (err, row) => {
			if (err) {
				callback(err);
			}

			callback(undefined, row);
		});
	},

	putValue: (key, value, callback) => {
		db.run(putValueSql, [key, value], (err) => {
			if (err) {
				callback(err);
			}

			callback();
		});
	},

	getKeys: (callback) => {
		db.all(getKeysSql, (err, rows) => {
			if (err) {
				callback(err);
			}

			var keys = [];

			rows.forEach((row) => {
				keys.push(row.key);
			});

			if (keys.length === 0) {
				keys = undefined;
			}

			callback(undefined, keys);
		});
	},

	getKeysWithValue: (value, callback) => {
		db.all(getKeysWithValueSql, [value], (err, rows) => {
			if (err) {
				callback(err);
			}

			var keys = [];

			rows.forEach((row) => {
				keys.push(row.key);
			});

			if (keys.length === 0) {
				keys = undefined;
			}

			callback(undefined, keys);
		});
	}
};
