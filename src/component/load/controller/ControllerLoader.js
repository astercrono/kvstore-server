const ComponentLoader = require("../../ComponentLoader");
const ComponentStore = require("../../ComponentStore");
const KVController = require("../../../controllers/KVController");
const KVControllerComponent = require("./KVControllerComponent");

class ControllerLoader extends ComponentLoader {
	load() {
		const service = ComponentStore.getElement("KVService");
		const controller = new KVController(service);
		return new KVControllerComponent(controller);
	}
}

module.exports = exports = ControllerLoader;