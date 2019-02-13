import express from "express";

import mysqlAdmin from "./module";

const app = express();
const port = process.env.PORT || 3000;

app.use("/mysql-admin", mysqlAdmin());

app.listen(port);

module.exports = app;
