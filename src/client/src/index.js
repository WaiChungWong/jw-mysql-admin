import React from "react";
import { render } from "react-dom";

import { connect } from "./controller";
import App from "./app";

connect().then(() => render(<App />, document.getElementById("root")));
