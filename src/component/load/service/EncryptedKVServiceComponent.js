const Component = require("../../Component");

class EncryptedKVServiceComponent extends Component {
	constructor(service) {
		super("KVService", service);
	}

	destroy(done) {
		this.dao = undefined;
		done();
	}
}

module.exports = exports = EncryptedKVServiceComponent;