class KVService {
	constructor(kvdao) {
		this.dao = kvdao;
	}

	getAll(callback) { };
	getValue(key, callback) { };
	putValue(keyValue, callback) { };
	getKeys(callback) { };
	deleteValue(key, callback) { };
}