const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const ControllerUtil = require("../util/ControllerUtil");
const KVService = require("../services/KVService");

const jsonParser = bodyParser.json();

router.get("/all",  (request, response) => {
	KVService.getAll((err, rows) => {
		ControllerUtil.send(response, rows);
	});
});

router.get("/value/:key",  (request, response) => {
	if (!("key" in request.params)) {
		ControllerUtil.failParam(response);
		return;
	}

	const key = request.params.key;

	KVService.getValue(key, (err, keys) => {
		if (err) {
			ControllerUtil.failInternalError(response);
			return;
		}
		ControllerUtil.send(response, keys);
	});
});

router.get("/keys",  (request, response) => {
	KVService.getKeys((err, keys) => {
		if (err) {
			ControllerUtil.failInternalError(response);
			return;
		}
		ControllerUtil.send(response, keys);
	});
});

router.put("/value", jsonParser, (request, response) => {
	const model = request.body;

	if (!("key" in model) || !("value" in model)) {
		ControllerUtil.failParam(response);
	}

	const key = model.key;
	const value = model.value;

	KVService.putValue(key, value, (err) => {
		if (err) {
			ControllerUtil.failInternalError(response);
			return;
		}
		ControllerUtil.send(response);
	});
});

router.delete("/value", jsonParser, (request, response) => {
	const model = request.body;

	if (!("key" in model)) {
		ControllerUtil.failParam(response);
	}

	const key = model.key;

	KVService.deleteValue(key, (err) => {
		if (err) {
			ControllerUtil.failInternalError(response);
			return;
		}
		ControllerUtil.send(response);
	});
});

router.all("*", (request, response) => {
	ControllerUtil.failUnknownRoute(response);
});

module.exports = exports = router;
