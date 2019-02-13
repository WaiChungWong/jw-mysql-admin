"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _database = require("./database");

var db = _interopRequireWildcard(_database);

var _authenticator = require("./authenticator");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();
router.presetConnection = {};

const respond = (res, error, result) => {
  if (error) {
    error = error && error.message ? { message: error.message } : error;
    res.status(500).json({ error });
  } else {
    res.json({ result });
  }
};

const generateConnection = req => {
  let inputConnection = (0, _authenticator.getConnection)(req) || req && req.body;
  return Object.assign({}, router.presetConnection, inputConnection);
};

router.get("/", (req, res) => res.json({ result: `This is the MySQL Admin API.` }));

router.use(_authenticator.authenticate, _authenticator.unauthorizedHandler);

router.post("/connect", async (req, res) => {
  let inputConnection = (0, _authenticator.getConnection)(req) || req && req.body;
  let connection = generateConnection(req);
  let [error, result] = await db.connect(connection);

  if (result) {
    res.cookie("mysqlAdminToken", (0, _authenticator.signToken)(inputConnection), {
      httpOnly: true
    });
  }

  respond(res, error, result);
});

router.post("/disconnect", async (req, res) => {
  res.clearCookie("mysqlAdminToken", { httpOnly: true });

  respond(res, null, true);
});

router.get("/databases", async (req, res) => {
  let connection = generateConnection(req);
  let [error, result] = await db.listDatabases(connection);

  respond(res, error, result);
});

router.post("/create", async (req, res) => {
  let connection = generateConnection(req);
  let { database } = req && req.body;
  let [error, result] = await db.createDatabase(connection, database);

  respond(res, error, result);
});

router.get("/:database", async (req, res) => {
  let connection = generateConnection(req);
  let { database } = req.params;
  let [error, result] = await db.listTables(connection, database);

  respond(res, error, result);
});

router.post("/:database/execute", async (req, res) => {
  let connection = generateConnection(req);
  let { database } = req.params;
  let { sql, pageCount, pageIndex } = req && req.body;
  let [error, result] = await db.executeStatement(connection, database, sql);

  if (result) {
    result = {
      count: result.length,
      columns: result[0] && Object.keys(result[0]) || [],
      rows: result.slice(pageCount * pageIndex, pageCount * (pageIndex + 1))
    };
  }

  respond(res, error, result);
});

router.post("/:database/delete", async (req, res) => {
  let connection = generateConnection(req);
  let { database } = req.params;
  let [error, result] = await db.deleteDatabase(connection, database);

  respond(res, error, result);
});

router.post("/:database/clear", async (req, res) => {
  let connection = generateConnection(req);
  let { database } = req.params;
  let [error, result] = await db.clearDatabase(connection, database);

  respond(res, error, result);
});

router.post("/:database/copy", async (req, res) => {
  let connection = generateConnection(req);
  let { database } = req.params;
  let { newDatabase } = req && req.body;
  let [error, result] = await db.copyDatabase(connection, database, newDatabase);

  respond(res, error, result);
});

router.post("/:database/create", async (req, res) => {
  let connection = generateConnection(req);
  let { database } = req.params;
  let { table } = req && req.body;
  let [error, result] = await db.createTable(connection, database, table);

  respond(res, error, result);
});

router.get("/:database/:table", async (req, res) => {
  let connection = generateConnection(req);
  let { database, table } = req.params;
  let [error, result] = await db.getTableStructure(connection, database, table);

  respond(res, error, result);
});

router.post("/:database/:table/delete", async (req, res) => {
  let connection = generateConnection(req);
  let { database, table } = req.params;
  let [error, result] = await db.deleteTable(connection, database, table);

  respond(res, error, result);
});

router.post("/:database/:table/clear", async (req, res) => {
  let connection = generateConnection(req);
  let { database, table } = req.params;
  let [error, result] = await db.clearTable(connection, database, table);

  respond(res, error, result);
});

router.post("/:database/:table/copy", async (req, res) => {
  let connection = generateConnection(req);
  let { database, table } = req.params;
  let { newTable } = req && req.body;
  let [error, result] = await db.copyTable(connection, database, table, newTable);

  respond(res, error, result);
});

exports.default = router;