const express = require("express");

class ExpressController {
	constructor(path, routeHandlers) {
		this.routeHandlers = routeHandlers;
		this.router = express.Router();
		this.path = path;
	}

	routeGet(url, requestHandler) {
		this.router.get(url, this.routeHandlers, requestHandler);
	};

	routePut(url, requestHandler) {
		this.router.put(url, this.routeHandlers, requestHandler);
	};

	routeDelete(url, requestHandler) {
		this.router.delete(url, this.routeHandlers, requestHandler);
	};

	routePost(url, requestHandler) {
		this.router.post(url, this.routeHandlers, requestHandler);
	};

	routeAll(requestHandler) {
		this.router.all("*", requestHandler);
	}
}

module.exports = exports = ExpressController;