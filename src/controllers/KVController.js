const ExpressRouter = require("./ExpressController");
const bodyParser = require("body-parser");
const AuthenticationInterceptor = require("./AuthenticationInterceptor");
const KeyValue = require("../model/KeyValue");

const ResponseSender = require("./ResponseSender");
const jsonParser = bodyParser.json();

class KVController extends ExpressRouter {
	constructor(service) {
		super("kvstore", [AuthenticationInterceptor.createDefault(), bodyParser]);
		this.service = service;

		super.routeGet("/all", this.getAll);
		super.routeGet("/value/:key", this.getValue);
		super.routeGet("/keys", this.getKeys);
		super.routePut("/value", this.putValue);
		super.routeDelete("/value", this.deleteValue);
		super.routeAll((request, response) => { new ResponseSender(response).failUnknownRoute(); });
	}

	getAll(request, response) {
		const sender = new ResponseSender(response);

		this.service.getAll((error, keyValues) => {
			if (error) {
				sender.failInternalError();
				return;
			}
			sender.send(keyValues);
		});
	}

	getValue(request, response) {
		const sender = new ResponseSender(response);
		const key = request.params.key;

		if (!this._hasRequestParam(request, "key")) {
			sender.failParam();
			return;
		}

		this.service.getValue(key, (error, value) => {
			if (error) {
				sender.failInternalError();
				return;
			}
			sender.send(value);
		});
	}

	getKeys(request, response) {
		const sender = new ResponseSender(response);

		this.service.getKeys((error, keys) => {
			if (error) {
				sender.failInternalError();
				return;
			}
			sender.send(keys);
		});
	}

	putValue(request, response) {
		const sender = new ResponseSender(response);

		if (!this._hasRequestModelValues(request, ["key", "value"])) {
			sender.failParam();
			return;
		}

		const keyValue = new KeyValue(request.body.key, request.body.value);
		this.service.putValue(keyValue, (error) => {
			if (error) {
				sender.failInternalError();
				return;
			}
			sender.send();
		});
	}

	deleteValue(request, response) {
		const sender = new ResponseSender(response);

		if (!this._hasRequestModelValues(request, ["key"])) {
			sender.failParam();
			return;
		}

		this.service.deleteValue(request.body.key, (error) => {
			if (error) {
				sender.failInternalError();
				return;
			}
			sender.send();
		});
	}

	_hasRequestParam(request, key) {
		return "key" in request.params;
	}

	_hasRequestModelValues(request, keys) {
		return keys.every((k) => {
			return k in request.body;
		});
	}
}

module.exports = exports = KVController;