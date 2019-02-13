import {
  LOADING,
  IDLE,
  DISCONNECTED,
  UNAUTHORIZED,
  AUTHORIZED
} from "./actiontypes";
import { dispatch } from "./store";
import {
  get,
  post,
  ERROR_NO_RESPOND,
  ERROR_DATABASE_NO_RESPOND,
  ERROR_HOST_NOT_FOUND,
  ERROR_AUTHORIZE_FAILED,
  ERROR_INVALID_TOKEN
} from "./utils";

const isConnectionfailure = error => {
  let type, requiredFields;

  switch (error) {
    case ERROR_INVALID_TOKEN:
      connect();
      return true;
    case ERROR_NO_RESPOND:
    case ERROR_DATABASE_NO_RESPOND:
      type = DISCONNECTED;
      break;
    case ERROR_HOST_NOT_FOUND:
      type = UNAUTHORIZED;
      requiredFields = [
        { name: "host", required: true },
        { name: "port", required: false },
        { name: "user", required: true },
        { name: "password", required: true }
      ];
      break;
    case ERROR_AUTHORIZE_FAILED:
      type = UNAUTHORIZED;
      requiredFields = [
        { name: "user", required: true },
        { name: "password", required: true }
      ];
      break;
    default:
      break;
  }

  if (type) {
    dispatch({ type, requiredFields, message: error });
    return true;
  } else {
    return false;
  }
};

const sendGet = async (path, message = "") => {
  dispatch({ type: LOADING, message });

  let [error, result] = await get(path);

  dispatch({ type: IDLE });

  if (!isConnectionfailure(error)) {
    return [error, result];
  } else {
    return [null, null];
  }
};

const sendPost = async (path, data, message = "") => {
  dispatch({ type: LOADING, message });

  let [error, result] = await post(path, data);

  dispatch({ type: IDLE });

  if (!isConnectionfailure(error)) {
    if (error) {
      return [error, null];
    } else {
      return [null, result];
    }
  } else {
    return [null, null];
  }
};

export const connect = async data => {
  let [error, result] = await sendPost("connect", data, "connecting...");

  if (error || result) {
    if (error) {
      dispatch({ type: UNAUTHORIZED, message: error });
    } else if (result) {
      dispatch({ type: AUTHORIZED });
    }
  }
};

export const disconnect = async () => {
  await sendPost("disconnect", {}, "disconnecting...");
  await connect();
};

export const getDatabases = async () =>
  await sendGet("databases", "retrieving databases...");

export const createDatabase = async database =>
  await sendPost("create", { database }, "creating database...");

export const executeStatement = async (
  database,
  sql,
  pageCount = 100,
  pageIndex = 0
) =>
  await sendPost(
    `${database}/execute`,
    { sql, pageCount, pageIndex },
    "loading..."
  );

export const deleteDatabase = async database =>
  await sendPost(`${database}/delete`, {}, "deleting database...");

export const clearDatabase = async database =>
  await sendPost(`${database}/clear`, {}, "clearing database...");

export const copyDatabase = async (database, newDatabase) =>
  await sendPost(`${database}/copy`, { newDatabase }, "copying database...");

export const clearImportDatabase = async database =>
  await sendPost(`${database}/clearImport`, {}, "importing database...");

export const importDatabase = async database =>
  await sendPost(`${database}/import`, {}, "importing database...");

export const exportDatabase = async database =>
  await sendPost(`${database}/export`, {}, "exporting database...");

export const getTables = async database =>
  await sendGet(database, `retrieving tables from "${database}"...`);

export const createTable = async (database, table) =>
  await sendPost(`${database}/create`, { table }, "creating table...");

export const deleteTable = async (database, table) =>
  await sendPost(`${database}/${table}/delete`, {}, "deleting table...");

export const clearTable = async (database, table) =>
  await sendPost(`${database}/${table}/clear`, {}, "clearing table...");

export const copyTable = async (database, table, newTable) =>
  await sendPost(`${database}/${table}/copy`, { newTable }, "copying table...");

export const clearImportTable = async (database, table) =>
  await sendPost(`${database}/${table}/clearImport`, {}, "importing table...");

export const importTable = async (database, table) =>
  await sendPost(`${database}/${table}/import`, {}, "importing table...");

export const exportTable = async (database, table) =>
  await sendPost(`${database}/${table}/export`, {}, "exporting table...");
