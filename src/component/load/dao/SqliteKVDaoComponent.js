const Component = require("../../Component");

class SqliteKVDaoComponent extends Component {
	constructor(dao) {
		super("KVDao", dao);
	}

	destroy(done) {
		this.element.db.close();
		this.element.db = undefined;
		this.element = undefined;
		done();
	}
}

module.exports = exports = SqliteKVDaoComponent;