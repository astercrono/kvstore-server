const sqlite = require("sqlite3");

const KVDao = require("./KVDao");
const KeyValue = require("../model/KeyValue");

const getAllSql = "select key, value, signature from kvstore order by key ";
const getValueSql = "select value from kvstore where key = ?";
const putValueSql = "insert or replace into kvstore (key, value, signature) values (?, ?, ?)";
const getKeysSql = "select key from kvstore order by key ";
const deleteValueSql = "delete from kvstore where key = ?";

class SqliteKVDao extends KVDao {
	constructor(path) {
		super();
		this.db = new sqlite.Database(path);
	}

	getAll(callback) {
		this.db.all(getAllSql, (err, rows) => {
			if (err) {
				callback(err);
				return;
			}

			const keyValues = [];
			rows.forEach((row) => {
				keyValues.push(new KeyValue(row.key, row.value, row.signature));
			});
			callback(undefined, keyValues);
		});
	}

	getValue(key, callback) {
		this.db.get(getValueSql, [key], (err, row) => {
			if (err) {
				callback(err);
				return;
			}

			if (!row) {
				callback();
				return;
			}

			callback(undefined, new KeyValue(row.value));
		});
	}

	putValue(keyValue, callback) {
		this.db.run(putValueSql, [keyValue.key, keyValue.value, keyValue.signature], (err) => {
			if (err) {
				callback(err);
				return;
			}
			callback();
		});
	}

	getKeys(callback) {
		this.db.all(getKeysSql, (err, rows) => {
			if (err) {
				callback(err);
				return;
			}

			let keys = [];
			rows.forEach((r) => {
				keys.push(r.key);
			});

			callback(undefined, keys);
		});
	}

	deleteValue(key, callback) {
		this.db.run(deleteValueSql, [key], (err) => {
			if (err) {
				callback(err);
				return;
			}
			callback();
		});
	}


	run(sql, params, callback) {
		this.db.run(sql, params, (err) => {
			if (err) {
				callback(err);
				return;
			}
			callback();
		});
	}
}

module.exports = exports = SqliteKVDao;
