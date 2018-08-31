const ComponentAlreadyExistsError = require("../error/ComponentAlreadyExistsError");

class ComponentStore {
	constructor() {
		this._data = {};
	}

	load() {
		const loaders = require("./load");
		loaders.forEach((L) => {
			const loader = new L();
			const componentModel = loader.load();

			if (Array.isArray(componentModel)) {
				componentModel.forEach((c) => {
					c.lock();
					this.add(c);
				});
			}
			else {
				componentModel.lock();
				this.add(componentModel);
			}
		});
		Object.freeze(this._data);
	}

	get(name) {
		const component = this._data[name];
		if (component) {
			return component.element;
		}
		return undefined;
	}

	add(component) {
		if (this._data[component.name]) {
			throw new ComponentAlreadyExistsError(component.name);
		}
		this._data[component.name] = component;
	}
}

module.exports = exports = new ComponentStore();
