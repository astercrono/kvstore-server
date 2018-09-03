class Component {
	constructor(name, element) {
		this.name = name;
		this.element = element;
	}

	destroy(done) {
		this.element = undefined;
		done();
	}
}

module.exports = exports = Component;