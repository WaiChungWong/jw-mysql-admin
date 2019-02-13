import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";

import { AUTHORIZED } from "./actiontypes";
import { disconnect } from "./controller";

import Login from "./views/pages/login";
import Databases from "./views/pages/databases";
import Database from "./views/pages/database";
import Table from "./views/pages/table";

export const LOGIN = "/";
export const DATABASES = "/databases";
export const DATABASE = "/:database";
export const TABLE = "/:database/:table";

const Guest = ({ component: Component, ...props }) => (
  <Route
    {...props}
    render={p =>
      props.state === AUTHORIZED ? (
        <Redirect to={DATABASES} />
      ) : (
        <Component {...p} />
      )
    }
  />
);

Guest.propTypes = {
  component: PropTypes.func,
  state: PropTypes.string
};

const GuestRoute = connect(({ connection }) => connection)(Guest);

const User = ({ component: Component, ...props }) => (
  <Route
    {...props}
    render={p =>
      props.state === AUTHORIZED ? (
        <Component
          {...p}
          header={
            <button className="secondary sign-out" onClick={() => disconnect()}>
              Sign out
            </button>
          }
        />
      ) : (
        <Redirect to={LOGIN} />
      )
    }
  />
);

User.propTypes = {
  component: PropTypes.func,
  state: PropTypes.string
};

const UserRoute = connect(({ connection }) => connection)(User);

export default () => (
  <Switch>
    <GuestRoute path={LOGIN} exact component={Login} />
    <UserRoute path={DATABASES} exact component={Databases} />
    <UserRoute path={DATABASE} exact component={Database} />
    <UserRoute path={TABLE} exact component={Table} />
    <Route render={() => <Redirect to={DATABASES} />} />
  </Switch>
);
