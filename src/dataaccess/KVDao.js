const config = require("../../config.js");

const sqlite = require("sqlite3");
const db = new sqlite.Database(config.database.path);

const getAllSql = "select key, value from kvstore";
const getValueSql = "select value from kvstore where key = ?";
const putValueSql = "insert or replace into kvstore (key, value) values (?, ?)";
const getKeysSql = "select key from kvstore";
const getKeysWithValueSql = "select key from kvstore where value = ?";
const deleteValueSql = "delete from kvstore where key = ?";
const createKVStoreSql = " " +
		"create table if not exists kvstore ( " +
		"    key text not null primary key, " +
		"    value text " +
		") without rowid ";
const dropKVStoreSql = "drop table if exists kvstore";

module.exports = exports = {
	getAll: (callback) => {
		db.all(getAllSql, (err, rows) => {
			if (err) {
				callback(err);
				return;
			}

			callback(undefined, rows);
		});
	},

	getValue: (key, callback) => {
		db.get(getValueSql, [key], (err, row) => {
			if (err) {
				callback(err);
				return;
			}

			if (row) {
				callback(undefined, row.value);
				return;
			}
				
			callback();
		});
	},

	putValue: (key, value, callback) => {
		db.run(putValueSql, [key, value], (err) => {
			if (err) {
				callback(err);
				return;
			}

			callback();
		});
	},

	getKeys: (callback) => {
		db.all(getKeysSql, (err, rows) => {
			if (err) {
				callback(err);
				return;
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

	deleteValue: (key, callback) => {
		db.run(deleteValueSql, [key], (err) => {
			if (err) {
				callback(err);
				return;
			}

			callback();
		});
	},

	createKVStore: (callback) => {
		db.run(createKVStoreSql, [], (err) => {
			if (err) {
				callback(err);
				return;
			}
			callback();
		});
	},

	dropKVStore: (callback) => {
		db.run(dropKVStoreSql, [], (err) => {
			if (err) {
				callback(err);
				return;
			}
			callback();
		});
	}
};