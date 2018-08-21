class Keys {
	constructor() {
		this._keys = {};
		this._locked = false;
	}

	set(name, value) {
		if (!this._locked) {
			this._keys[name] = value;
		}
	}

	get(name) {
		return this._keys[name];
	}

	getBuffer(name) {
		return Buffer.from(this._keys[name], "hex");
	}

	lock () {
		Object.freeze(this._keys);
		this._locked = true;
	}

	json() {
		return JSON.stringify(this._keys);
	}

	equals(otherKeys) {
		const keySet = Object.keys(this._keys);
		const otherKeySet = Object.keys(otherKeys);

		if (keySet.length !== otherKeySet.length) {
			return false;
		}

		return keySet.every((k) => {
			return this._keys[k] === otherKeys[k];
		});
	}
}

module.exports = exports = Keys;