import React, { Component } from "react";

import Dialog from "../dialog";

import { getFormData } from "../../../utils";

import "./style.css";

class PromptDialog extends Component {
  constructor(props) {
    super(props);

    this.state = { message: "", fields: [], callback: () => {} };
  }

  prompt(message, fields, callback = () => {}) {
    this.setState({ message, fields, callback });
    this.dialog.show();
  }

  close() {
    this.dialog.hide();
  }

  submit(data) {
    this.state.callback(data);
    this.close();
  }

  render() {
    const { message, fields } = this.state;

    return (
      <Dialog ref={dialog => (this.dialog = dialog)} className="prompt-dialog">
        <h4>{message}</h4>
        <form
          onSubmit={event => {
            event.preventDefault();
            this.submit(getFormData(event.currentTarget));
          }}
        >
          {fields.map((field, index) => (
            <input key={`input_${index}`} {...field} />
          ))}
          <div className="button-panel">
            <button
              type="button"
              className="secondary"
              onClick={() => this.close()}
            >
              Cancel
            </button>
            <button type="submit">Submit</button>
          </div>
        </form>
      </Dialog>
    );
  }
}

export default PromptDialog;
