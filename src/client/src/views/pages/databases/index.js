import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import {
  getDatabases,
  createDatabase,
  deleteDatabase,
  copyDatabase,
  clearDatabase
} from "../../../controller";

import PromptDialog from "../../components/promptdialog";
import ConfirmDialog from "../../components/confirmdialog";

import ClearImportIcon from "../../../resources/clear-import.png";
import ImportIcon from "../../../resources/import.png";
import ClearIcon from "../../../resources/clear.png";
import DeleteIcon from "../../../resources/close.png";
import CopyIcon from "../../../resources/copy.png";
import ExportIcon from "../../../resources/export.png";

import "./style.css";

class Databases extends Component {
  constructor(props) {
    super(props);

    this.state = {
      databases: []
    };
  }

  async componentDidMount() {
    await this.listDatabases();
  }

  async listDatabases() {
    const [error, databases] = await getDatabases();

    if (databases) {
      this.setState({ databases });
    } else if (error) {
    }
  }

  createButtonHandler() {
    this.promptDialog.prompt(
      "Please enter the database name:",
      [
        {
          name: "database",
          type: "text",
          placeholder: "database name",
          required: true
        }
      ],
      async ({ database }) => {
        await createDatabase(database);
        await this.listDatabases();
      }
    );
  }

  deleteButtonHandler(database) {
    this.confirmDialog.confirm(
      `Delete "${database}"?`,
      "Deleting a database cannot be undone.",
      async () => {
        await deleteDatabase(database);
        await this.listDatabases();
      }
    );
  }

  copyButtonHandler(database) {
    this.promptDialog.prompt(
      `Please enter the database name as a copy of "${database}":`,
      [
        {
          name: "database",
          type: "text",
          placeholder: "database name",
          required: true
        }
      ],
      async ({ database: newDatabase }) => {
        await copyDatabase(database, newDatabase);
        await this.listDatabases();
      }
    );
  }

  clearButtonHandler(database) {
    this.confirmDialog.confirm(
      `Clear all table content in "${database}"?`,
      "Clearing table content cannot be undone.",
      async () => {
        await clearDatabase(database);
        await this.listDatabases();
      }
    );
  }

  render() {
    const { header } = this.props;
    const { databases } = this.state;

    return (
      <div>
        <div className="paper-wrapper">
          <div id="databases" className="paper">
            {header}
            <h2>Databases</h2>
            <div className="content-wrapper">
              <div className="content">
                <button onClick={() => this.createButtonHandler()}>
                  Create
                </button>
                {databases.length > 0 ? (
                  <ul className="results">
                    {databases.map((database, index) => (
                      <li key={`database_${index}`}>
                        <Link to={database}>{database}</Link>
                        <div className="button-wrapper">
                          <div
                            title="Clear & import data from file"
                            className="button clear-import-image hide"
                            style={{
                              backgroundImage: `url(${ClearImportIcon})`
                            }}
                          />
                          <div
                            title="Import data from file"
                            className="button import-image hide"
                            style={{
                              backgroundImage: `url(${ImportIcon})`
                            }}
                          />
                          <div
                            title="Export to CSV"
                            className="button export-image hide"
                            style={{
                              backgroundImage: `url(${ExportIcon})`
                            }}
                          />
                          <div
                            title="Copy database"
                            className="button copy-image hide"
                            style={{
                              backgroundImage: `url(${CopyIcon})`
                            }}
                            onClick={() => this.copyButtonHandler(database)}
                          />
                          <div
                            title="Clear database"
                            className="button clear-image"
                            style={{
                              backgroundImage: `url(${ClearIcon})`
                            }}
                            onClick={() => this.clearButtonHandler(database)}
                          />
                          <div
                            title="Delete database"
                            className="button delete-image"
                            style={{
                              backgroundImage: `url(${DeleteIcon})`
                            }}
                            onClick={() => this.deleteButtonHandler(database)}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-results">No databases</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <PromptDialog ref={dialog => (this.promptDialog = dialog)} />
        <ConfirmDialog ref={dialog => (this.confirmDialog = dialog)} />
      </div>
    );
  }
}

Databases.propTypes = {
  header: PropTypes.node
};

export default Databases;
