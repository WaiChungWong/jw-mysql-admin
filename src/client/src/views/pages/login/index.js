import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getFormData,
  ERROR_NO_RESPOND,
  ERROR_DATABASE_NO_RESPOND
} from "../../../utils";
import { connect as connectAPI } from "../../../controller";

import { DISCONNECTED, UNAUTHORIZED } from "../../../actiontypes";

import Logo from "../../components/logo";
import NoConnectionIcon from "../../../resources/disconnected.png";

import "./style.css";

class Login extends Component {
  render() {
    const { state, requiredFields, message } = this.props;

    if (state === DISCONNECTED) {
      return (
        <div className="paper-wrapper">
          <div id="no-connection" className="paper">
            <img src={NoConnectionIcon} alt="No Connection" />
            <h2>{message}</h2>
            <p>
              {message === ERROR_NO_RESPOND &&
                "Seems like there is no respond from the API."}
              {message === ERROR_DATABASE_NO_RESPOND &&
                "Seems like there is no respond from the database."}
              <br />
              Click the button below to try again.
            </p>
            <button onClick={() => connectAPI()}>Try again</button>
          </div>
        </div>
      );
    } else if (state === UNAUTHORIZED) {
      return (
        <div className="paper-wrapper">
          <div id="fields-required" className="paper">
            <Logo className="logo" />
            <h1>MySQL Admin</h1>
            <form
              onSubmit={event => {
                event.preventDefault();
                connectAPI(getFormData(event.currentTarget));
              }}
            >
              {requiredFields &&
                requiredFields.map(({ name, required }, index) => (
                  <input
                    key={`input_${index}`}
                    type={name === "password" ? "password" : "text"}
                    name={name}
                    placeholder={name}
                    required={required}
                  />
                ))}
              <div id="login-error">{message}</div>
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      );
    } else {
      return <Logo id="login-logo" />;
    }
  }
}

Login.propTypes = {
  state: PropTypes.string,
  requiredFields: PropTypes.arrayOf(PropTypes.string),
  message: PropTypes.string
};

export default connect(({ connection }) => connection)(Login);
