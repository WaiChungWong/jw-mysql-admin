import { combineReducers } from "redux";
import loading from "./reducer.loading";
import connection from "./reducer.connection";

export default combineReducers({
  loading,
  connection
});
