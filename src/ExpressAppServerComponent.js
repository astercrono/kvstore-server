const Component = require("./component/Component");

class ExpressAppServerComponent extends Component {
	constructor(server) {
		super("ExpressAppServerComponent", server);
	}

	destroy(done) {
		const server = this.element;
		if (server) {
			server.close(() => {
				done();
			});
		}
	}
}

module.exports = exports = ExpressAppServerComponent;