import React from "react";
import PropTypes from "prop-types";
import ClassNames from "classnames";
import { connect } from "react-redux";

import "./style.css";

const LoadingScreen = ({ isLoading, message }) => (
  <div id="loading-screen-overlay" className={ClassNames({ show: isLoading })}>
    <div className="loader" />
    <div className="message">{message}</div>
  </div>
);

LoadingScreen.propTypes = {
  isLoading: PropTypes.bool,
  message: PropTypes.string
};

export default connect(({ loading }) => loading)(LoadingScreen);
