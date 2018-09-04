const assert = require("assert");
const request = require("request");
const Config = require("../src/config/Config");
const KVTestHelper = require("../src/test/KVTestHelper");
const KeyStore = require("../src/crypt/KeyStore");
const ComponentStore = require("../src/component/ComponentStore");
const KeyValue = require("../src/model/KeyValue");

describe("KVController", () => {
	before((done) => {
		KVTestHelper.initialize()(() => {
			const service = ComponentStore.getElement("KVService");
			service.putValue(new KeyValue("test", "This is a test value."), (error) => {
				assert.ok(!error);
				done();
			});
		});
	});

	function url(servicePath) {
		const controllerPath = ComponentStore.getElement("KVController").path;
		return "http://localhost:" + Config.httpPort() + controllerPath + servicePath;
	}

	it("GET /all", (done) => {
		request(url("/all"), {
			"auth": {
				"bearer": KeyStore.get("api")
			}
		}, (err, response, body) => {
			assert.ok(!err);
			assert.ok(body);
			assert.equal(response.statusCode, 200);

			let results = JSON.parse(body);
			assert.ok(results);
			assert.ok(results.data);
			assert.ok(Array.isArray(results.data));
			assert.ok(results.data.length > 0);

			done();
		});
	});

	it("GET /value", (done) => {
		request(url("/value/test"), {
			"auth": {
				"bearer": KeyStore.get("api")
			}
		}, (err, response, body) => {
			assert.ok(!err);
			assert.ok(body);
			assert.equal(response.statusCode, 200);

			let results = JSON.parse(body);
			assert.ok(results);
			assert.ok(results.data);
			assert.equal(results.data, "This is a test value.");

			done();
		});
	});

	it("GET /keys", (done) => {
		request(url("/keys"), {
			"auth": {
				"bearer": KeyStore.get("api")
			}
		}, (err, response, body) => {
			assert.ok(!err);
			assert.ok(body);
			assert.equal(response.statusCode, 200);

			let results = JSON.parse(body);
			assert.ok(results);
			assert.ok(results.data);
			assert.ok(Array.isArray(results.data));
			assert.ok(results.data.length > 0);

			done();
		});
	});

	it("PUT /value", (done) => {
		request({
			url: url("/value"),
			method: "PUT",
			json: {
				"key": "test2",
				"value": "This is a test value."
			},
			headers: {
				"Authorization": "Bearer " + KeyStore.get("api")
			}
		}, (err, response) => {
			assert.ok(!err);
			assert.ok(response.statusCode, 200);

			done();
		});
	});

	it("DELETE /value", (done) => {
		let service = ComponentStore.getElement("KVService");
		let keyValue = new KeyValue("test3", "This is a test value.");
		service.putValue(keyValue, (error) => {
			assert.ok(!error);

			request({
				url: url("/value"),
				method: "DELETE",
				json: {
					"key": "test3",
				},
				headers: {
					"Authorization": "Bearer " + KeyStore.get("api")
				}
			}, (err, response) => {
				assert.ok(!err);
				assert.ok(response.statusCode, 200);

				done();
			});
		});
	});

	after(KVTestHelper.teardown());
});