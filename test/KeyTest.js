const KVTestHelper = require("./KVTestHelper");
const KeyStore = require("../src/crypt/KeyStore");

describe("Key Store", () => {
	before(KVTestHelper.initialize(false));

	it("Load and Store Keys", (done) => {
		KeyStore.confirm();
		done();
	});
});