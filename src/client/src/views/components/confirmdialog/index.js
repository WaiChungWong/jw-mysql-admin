import React, { Component } from "react";

import Dialog from "../dialog";

import "./style.css";

class ConfirmDialog extends Component {
  constructor(props) {
    super(props);

    this.state = { message: "", callback: () => {} };
  }

  confirm(message, description, callback = () => {}) {
    this.setState({ message, description, callback });
    this.dialog.show();
  }

  close() {
    this.dialog.hide();
  }

  submit() {
    this.state.callback();
    this.close();
  }

  render() {
    const { message, description } = this.state;

    return (
      <Dialog ref={dialog => (this.dialog = dialog)} className="confirm-dialog">
        <h4>{message}</h4>
        <p>{description}</p>
        <form
          onSubmit={event => {
            event.preventDefault();
            this.submit();
          }}
        >
          <div className="button-panel">
            <button
              type="button"
              className="secondary"
              onClick={() => this.close()}
            >
              Cancel
            </button>
            <button type="submit">Confirm</button>
          </div>
        </form>
      </Dialog>
    );
  }
}

export default ConfirmDialog;
