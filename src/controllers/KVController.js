const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const AuthenticationInterceptor = require("./AuthenticationInterceptor");

const ResponseSender = require("./ResponseSender");
const KVService = require("../services/KVService2");

const jsonParser = bodyParser.json();
const authInterceptor = AuthenticationInterceptor();

router.get("/all",  authInterceptor, (request, response) => {
	KVService.getAll((err, rows) => {
		ResponseSender.send(response, rows);
	});
});

router.get("/value/:key",  authInterceptor, (request, response) => {
	if (!("key" in request.params)) {
		ResponseSender.failParam(response);
		return;
	}

	const key = request.params.key;

	KVService.getValue(key, (err, keys) => {
		if (err) {
			ResponseSender.failInternalError(response);
			return;
		}
		ResponseSender.send(response, keys);
	});
});

router.get("/keys",  authInterceptor, (request, response) => {
	KVService.getKeys((err, keys) => {
		if (err) {
			ResponseSender.failInternalError(response);
			return;
		}
		ResponseSender.send(response, keys);
	});
});

router.put("/value", [authInterceptor, jsonParser], (request, response) => {
	const model = request.body;

	if (!("key" in model) || !("value" in model)) {
		ResponseSender.failParam(response);
	}

	const key = model.key;
	const value = model.value;

	KVService.putValue(key, value, (err) => {
		if (err) {
			ResponseSender.failInternalError(response);
			return;
		}
		ResponseSender.send(response, {"key": key, "value": value});
	});
});

router.delete("/value", [authInterceptor, jsonParser], (request, response) => {
	const model = request.body;

	if (!("key" in model)) {
		ResponseSender.failParam(response);
	}

	const key = model.key;

	KVService.deleteValue(key, (err) => {
		if (err) {
			ResponseSender.failInternalError(response);
			return;
		}
		ResponseSender.send(response);
	});
});

router.post("/rebuild", [authInterceptor], (request, response) => {
	KVService.rebuild((err) => {
		if (err) {
			ResponseSender.failInternalError(response);
			return;
		}
		ResponseSender.send(response);
	});
});

router.all("*", (request, response) => {
	ResponseSender.failUnknownRoute(response);
});

module.exports = exports = router;
