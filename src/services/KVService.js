const KVDao = require("../dataaccess/KVDao");
const KVCrypt = require("../crypt/KVCrypt");
const KVRebuildError = require("../error/KVRebuildError");

const async = require("async");

module.exports = exports = {
	getAll: (callback) => {
		getAllRows(callback);
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
		saveValue(key, value, callback);
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
	},

	rebuild: (callback) => {
		let workingRows = undefined;

		async.series([
			(asyncCallback) => {
				getAllRows((err, allRows) => {
					if (err) {
						asyncCallback(err);
						return;
					}

					if (!allRows) {
						workingRows = [];
					}
					else {
						workingRows = allRows;
					}

					asyncCallback();
				});
			},
			(asyncCallback) => {
				KVCrypt.initKeys(true, (err) => {
					if (err) {
						asyncCallback(err);
						return;
					}

					asyncCallback();
				});
			},
			(asyncCallback) => {
				saveRecords(workingRows, asyncCallback);
			}
		], (err) => {
			if (err) {
				callback(new KVRebuildError(err));
				return;
			}
			callback();
		});
	}
};

function saveRecords(records, callback) {
	let saveOperations = [];

	records.forEach((row) => {
		saveOperations.push((asyncCallback) => {
			saveValue(row.key, row.value, asyncCallback);
		});
	});

	async.parallel(saveOperations, (err) => {
		if (err) {
			callback(err);
			return;
		}
		callback();
	});
}

function getAllRows(callback) {
	KVDao.getAll((err, allRows) => {
		if (err) {
			callback(err);
			return;
		}

		if (!allRows|| allRows.length === 0) {
			callback(undefined, allRows);
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
}

function saveValue(key, value, callback) {
	KVCrypt.encrypt(value, (err, cipherText) => {
		if (err) {
			callback(err);
			return;
		}

		KVDao.putValue(key, cipherText, callback);
	});
}