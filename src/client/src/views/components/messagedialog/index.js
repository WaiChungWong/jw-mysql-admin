import React, { Component } from "react";

import Dialog from "../dialog";

import "./style.css";

class MessageDialog extends Component {
  constructor(props) {
    super(props);

    this.state = { message: "", callback: () => {} };
  }

  message(message, callback = () => {}) {
    this.setState({ message, callback });
    this.dialog.show();
  }

  close() {
    this.state.callback();
    this.dialog.hide();
  }

  render() {
    const { message } = this.state;

    return (
      <Dialog ref={dialog => (this.dialog = dialog)} className="message-dialog">
        <h4>{message}</h4>
        <div className="button-panel">
          <button
            type="button"
            className="secondary"
            onClick={() => this.close()}
          >
            Close
          </button>
        </div>
      </Dialog>
    );
  }
}

export default MessageDialog;
