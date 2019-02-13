import { createStore } from "redux";
import createHistory from "history/createHashHistory";

import reducer from "./reducers";

const reduxDevtoolsExtension =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(reducer, reduxDevtoolsExtension);

export const history = createHistory();

export const dispatch = store.dispatch;

export default store;
