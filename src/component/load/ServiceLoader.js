const ComponentLoader = require("../ComponentLoader");
const ComponentStore = require("../ComponentStore");
const EncryptedKVService = require("../../services/EncryptedKVService");

class ServiceLoader extends ComponentLoader {
	load() {
		const dao = ComponentStore.add("KVDao");
		const service = new EncryptedKVService(dao);
		return super.createComponent("KVService", service);
	}
}

module.exports = exports = ServiceLoader;