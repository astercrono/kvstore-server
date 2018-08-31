const config = require("../../config.js").get();
let path = config.database.path;

if (config.testmode) {
	path = config.database.testPath;
}

const KVCrypt = require("../crypt/KVCrypt");
const KVSignatureError = require("../error/KVSignatureError");
const KeyValue = require("../model/KeyValue");

const sqlite = require("sqlite3");
const db = new sqlite.Database(config.database.path);

const getAllSql = "select * from kvstore order by key ";
const getValueSql = "select * from kvstore where key = ?";
const putValueSql = "insert or replace into kvstore (key, value, signature) values (?, ?, ?)";
const getKeysSql = "select * from kvstore order by key ";
const deleteValueSql = "delete from kvstore where key = ?";
const createKVStoreSql = " " +
		"create table if not exists kvstore ( " +
		"    key text not null primary key, " +
		"    value text not null, " +
		"    signature text not null " +
		") without rowid ";
const dropKVStoreSql = "drop table if exists kvstore";

module.exports = exports = {
	getAll: (callback) => {
		db.all(getAllSql, (err, rows) => {
			if (err) {
				callback(err);
				return;
			}

			if (!confirmSignatureOfRows(rows)) {
				callback(new KVSignatureError());
				return;
			}

			const keyValues = [];
			rows.forEach((row) => {
				keyValues.push(KeyValue(row.key, row.value));
			});

			callback(undefined, keyValues);
		});
	},

	getValue: (key, callback) => {
		db.get(getValueSql, [key], (err, row) => {
			if (err) {
				callback(err);
				return;
			}

			if (!row) {
				callback();
				return;
			}

			if (!confirmSignatureOfRow(row)) {
				callback(new KVSignatureError());
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
		const signature = KVCrypt.signKV(key, value);

		db.run(putValueSql, [key, value, signature], (err) => {
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

			if (!confirmSignatureOfRows(rows)) {
				callback(new KVSignatureError());
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

function confirmSignatureOfRows(rows) {
	let valid = true;

	rows.every((row) => {
		if (!confirmSignatureOfRow(row)) {
			valid = false;
			return false;
		}
		return true;
	});

	return valid;
}

function confirmSignatureOfRow(row) {
	const key = row.key;
	const value = row.value;
	const signature = row.signature;

	return KVCrypt.confirmKVSignature(key, value, signature);
}