const config = require("./config");

const express = require("express");
const app = express();

require("./src/controllers")(app);

app.listen(config.server.port);
console.log("KVStore server is running.");
