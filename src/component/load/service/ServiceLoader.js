const ComponentLoader = require("../../ComponentLoader");
const ComponentStore = require("../../ComponentStore");
const EncryptedKVService = require("../../../services/EncryptedKVService");
const EncryptedKVServiceComponent = require("./EncryptedKVServiceComponent");

class ServiceLoader extends ComponentLoader {
	load() {
		const dao = ComponentStore.getElement("KVDao");
		const service = new EncryptedKVService(dao);
		return new EncryptedKVServiceComponent(service);
	}
}

module.exports = exports = ServiceLoader;