const KVTestHelper = require("../src/test/KVTestHelper");
const KeyStore = require("../src/crypt/KeyStore");

describe("Key Store", () => {
	before(KVTestHelper.initialize());

	it("Load and Store Keys", (done) => {
		KeyStore.confirm();
		done();
	});

	after(KVTestHelper.teardown());
});