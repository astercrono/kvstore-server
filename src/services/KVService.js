const KVDao = require("../dataaccess/KVDao");
const KVCrypt = require("../crypt/KVCrypt");

const async = require("async");

module.exports = exports = {
	getAll: (callback) => {
		KVDao.getAll((err, allRows) => {
			if (err) {
				callback(err);
				return;
			}

			if (!allRows|| allRows.length === 0) {
				callback(undefined, rows);
			}

			const decryptOperations = [];

			allRows.forEach((row, index) => {
				decryptOperations.push((decryptCallback) => {
					KVCrypt.decrypt(row.value, (err, plaintext) => {
						allRows[index].value = plaintext;
						decryptCallback();
					});
				});
			});

			async.parallel(decryptOperations, (err, results) => {
				if (err) {
					callback(err);
					return;
				}

				callback(undefined, allRows);
			});
		});
	},

	getValue: (key, callback) => {
		KVDao.getValue(key, (err, value) => {
			if (err) {
				callback(err);
				return;
			}

			if (!value) {
				callback();
				return;
			}

			KVCrypt.decrypt(value, (err, plaintext) => {
				if (err) {
					callback(err);
					return;
				}

				callback(undefined, plaintext);
			});
		});
	},

	putValue: (key, value, callback) => {
		KVCrypt.encrypt(value, (err, cipherText) => {
			if (err) {
				callback(err);
				return;
			}

			KVDao.putValue(key, cipherText, callback);
		});
	},

	getKeys: (callback) => {
		KVDao.getKeys(callback);
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
