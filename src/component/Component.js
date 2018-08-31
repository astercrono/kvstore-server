class Component {
	constructor(name, element) {
		this.name = name;
		this.element = element;
	}

	lock() {
		Object.freeze(this);
	}
}

module.exports = exports = Component;