"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearTable = exports.deleteTable = exports.createTable = exports.executeStatement = exports.listTables = exports.clearDatabase = exports.deleteDatabase = exports.createDatabase = exports.listDatabases = exports.connect = undefined;

var _promise = require("mysql2/promise");

const ERROR_DATABASE_NO_RESPOND = "Database connection failed";
const ERROR_HOST_NOT_FOUND = "Host not found";
const ERROR_AUTHORIZE_FAILED = "Incorrect user or password";

const parseError = error => {
  if (error.message.startsWith("connect ECONNREFUSED")) {
    return new Error(ERROR_DATABASE_NO_RESPOND);
  } else if (error.message.startsWith("getaddrinfo ENOTFOUND")) {
    return new Error(ERROR_HOST_NOT_FOUND);
  } else if (error.message.startsWith("Access denied for user")) {
    return new Error(ERROR_AUTHORIZE_FAILED);
  } else {
    return error;
  }
};

const query = async (connection, sql, callback = r => r) => {
  const { host, port, user, password, database } = connection;

  try {
    const client = await (0, _promise.createConnection)({
      host,
      port,
      user,
      password,
      database,
      dateStrings: true
    });
    let results = true;

    if (sql) {
      results = callback((await client.query(sql)));
    }

    await client.end();

    return [null, results];
  } catch (error) {
    return [parseError(error), null];
  }
};

const execute = async (connection, sqlList, callback = r => r) => {
  const { host, port, user, password, database } = connection;

  try {
    const client = await (0, _promise.createConnection)({
      host,
      port,
      user,
      password,
      database,
      dateStrings: true
    });
    await client.beginTransaction();

    try {
      let results = true;

      if (sqlList.length > 0) {
        for (let i = 0; i < sqlList.length; i++) {
          results = await client.query(sqlList[i]);
        }

        results = callback(results);
      }

      await client.commit();

      return [null, results];
    } catch (error) {
      await client.rollback();
      throw error;
    } finally {
      await client.end();
    }
  } catch (error) {
    return [parseError(error), null];
  }
};

const connect = exports.connect = async connection => await query(connection);

const listDatabases = exports.listDatabases = async connection => await query(connection, `SHOW DATABASES`, r => r && r[0] && r[0].map(({ Database }) => Database).filter(d => d !== "information_schema" && d !== "performance_schema" && d !== "mysql" && d !== "sys"));

const createDatabase = exports.createDatabase = async (connection, database) => await query(connection, `CREATE DATABASE \`${database}\``);

const deleteDatabase = exports.deleteDatabase = async (connection, database) => await query(connection, `DROP DATABASE \`${database}\``);

const clearDatabase = exports.clearDatabase = async (connection, database) => {
  const databaseConnection = Object.assign({}, connection, { database });
  let [error, tables] = await listTables(connection, database);

  if (tables) {
    return execute(databaseConnection, tables.map(table => `TRUNCATE TABLE \`${table}\``));
  } else {
    return [error, null];
  }
};

const listTables = exports.listTables = async (connection, database) => {
  const databaseConnection = Object.assign({}, connection, { database });

  let [error, tables] = await query(databaseConnection, "SHOW TABLES", r => r && r[0] && r[0].map(({ [`Tables_in_${database}`]: name }) => name));

  if (error) {
    return [error, null];
  }

  let results = [];

  for (let i = 0; i < tables.length; i++) {
    let name = tables[i];
    let columns, count;

    [error, columns] = await query(databaseConnection, `DESCRIBE \`${name}\``, r => r && r[0] && r[0].map(({ Field }) => Field));

    [error, count] = await query(databaseConnection, `SELECT COUNT(*) AS \`count\` FROM \`${name}\``, r => r && r[0] && r[0][0] && r[0][0].count);

    if (error) {
      return [error, null];
    }

    results.push({ name, columns, count });
  }

  return [null, results];
};

const executeStatement = exports.executeStatement = async (connection, database, sql) => await query(Object.assign({}, connection, { database }), sql, r => r && r[0]);

const createTable = exports.createTable = async (connection, database, table) => await query(Object.assign({}, connection, { database }), `CREATE TABLE \`${table}\` (id INT NOT NULL, PRIMARY KEY (id))`);

const deleteTable = exports.deleteTable = async (connection, database, table) => await query(Object.assign({}, connection, { database }), `DROP TABLE \`${table}\``);

const clearTable = exports.clearTable = async (connection, database, table) => await query(Object.assign({}, connection, { database }), `TRUNCATE TABLE \`${table}\``);