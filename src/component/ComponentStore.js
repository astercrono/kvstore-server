const ComponentAlreadyExistsError = require("../error/ComponentAlreadyExistsError");
const ComponentDestroyError = require("../error/ComponentDestroyError");

class ComponentStore {
	constructor() {
		this._data = {};
	}

	load() {
		if (Object.keys(this._data).length > 0) {
			return;
		}

		const loaders = require("./load");
		loaders.forEach((L) => {
			let loader = new L();
			let componentModel = loader.load();

			if (Array.isArray(componentModel)) {
				componentModel.forEach((c) => {
					this.add(c);
				});
			}
			else {
				this.add(componentModel);
			}
		});
	}

	getElement(name) {
		const component = this.get(name);
		if (component) {
			return component.element;
		}
		return undefined;
	}

	get(name) {
		const component = this._data[name];
		if (component) {
			return component;
		}
		return undefined;
	}

	getByType(type) {
		const components = this.getAll();
		let matches = [];

		if (!components) {
			return matches;
		}

		components.forEach((comp) => {
			if (comp.element instanceof type) {
				matches.push(comp);
			}
		});

		return matches;
	}

	getElementsByType(type) {
		const components = this.getAll();
		let matches = [];

		if (!components) {
			return matches;
		}

		components.forEach((comp) => {
			if (comp.element instanceof type) {
				matches.push(comp.element);
			}
		});

		return matches;
	}

	getAll() {
		let components = [];
		const componentNames = Object.keys(this._data);

		componentNames.forEach((name) => {
			components.push(this.get(name));
		});

		return components;
	}

	add(component) {
		if (this._data[component.name]) {
			throw new ComponentAlreadyExistsError(component.name); // getting error?
		}
		this._data[component.name] = component;
	}

	destroy(done) {
		let components = this.getAll();
		let promises = [];

		components.forEach((comp) => {
			promises.push(new Promise((resolve, reject) => {
				comp.destroy((error) => {
					if (error) {
						 return reject(new ComponentDestroyError(error));
					}
					return resolve();
				});
			}).catch((error) => { done(error); }));
		});

		Promise.all(promises).then(() => {
			this._data = [];
			done();
		});
	}
}

module.exports = exports = new ComponentStore();
