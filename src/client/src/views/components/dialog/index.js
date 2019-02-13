import React, { Component } from "react";
import PropTypes from "prop-types";
import ClassNames from "classnames";

import "./style.css";

class Dialog extends Component {
  constructor(props) {
    super(props);

    this.state = { show: false };
  }

  show() {
    this.setState({ show: true });
  }

  hide() {
    this.setState({ show: false });
  }

  closeHandler(event) {
    const { onClose } = this.props;

    if (/dialog-overlay|close-button/.test(event.target.className)) {
      onClose();
      this.hide();
    }

    event.stopPropagation();
  }

  render() {
    const { children, className } = this.props;
    const { show } = this.state;

    return (
      <div
        className={ClassNames("dialog-overlay", { show }, className)}
        onClick={event => this.closeHandler(event)}
      >
        <div className="dialog">
          <div
            className="close-button"
            onClick={event => this.closeHandler(event)}
          >
            &times;
          </div>
          {children}
        </div>
      </div>
    );
  }
}

Dialog.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func
};

Dialog.defaultProps = {
  onClose: () => {}
};

export default Dialog;
