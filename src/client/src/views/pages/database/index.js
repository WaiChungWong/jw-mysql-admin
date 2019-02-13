import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { getFormData } from "../../../utils";
import {
  executeStatement,
  getTables,
  createTable,
  deleteTable,
  copyTable,
  clearTable
} from "../../../controller";

import { DATABASES } from "../../../sitemap";

import PromptDialog from "../../components/promptdialog";
import ConfirmDialog from "../../components/confirmdialog";
import MessageDialog from "../../components/messagedialog";
import ClearImportIcon from "../../../resources/clear-import.png";
import ImportIcon from "../../../resources/import.png";
import ClearIcon from "../../../resources/clear.png";
import DeleteIcon from "../../../resources/close.png";
import CopyIcon from "../../../resources/copy.png";
import ExportIcon from "../../../resources/export.png";

import "./style.css";

class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tables: []
    };
  }

  async componentDidMount() {
    await this.listTables();
  }

  async listTables() {
    const { match } = this.props;
    const { database } = match.params;
    const [error, tables] = await getTables(database);

    if (tables) {
      this.setState({ tables });
    } else if (error) {
      this.messageDialog.message(error);
    }
  }

  async submitStatement({ sql }) {
    if (sql) {
      const { match } = this.props;
      const { database } = match.params;

      const [error] = await executeStatement(database, sql);

      if (error) {
        this.messageDialog.message(error);
      } else {
        await this.listTables();
      }
    }
  }

  createButtonHandler() {
    this.promptDialog.prompt(
      "Please enter the table name:",
      [
        {
          name: "table",
          type: "text",
          placeholder: "table name",
          required: true
        }
      ],
      async ({ table }) => {
        const { database } = this.props.match.params;

        await createTable(database, table);
        await this.listTables();
      }
    );
  }

  deleteButtonHandler(table) {
    this.confirmDialog.confirm(
      `Delete "${table}"?`,
      "Deleting a table cannot be undone.",
      async () => {
        const { database } = this.props.match.params;

        await deleteTable(database, table);
        await this.listTables();
      }
    );
  }

  copyButtonHandler(table) {
    this.promptDialog.prompt(
      `Please enter the table name as a copy of "${table}":`,
      [
        {
          name: "table",
          type: "text",
          placeholder: "table name",
          required: true
        }
      ],
      async ({ table: newTable }) => {
        const { database } = this.props.match.params;

        await copyTable(database, table, newTable);
        await this.listTables();
      }
    );
  }

  clearButtonHandler(table) {
    this.confirmDialog.confirm(
      `Clear the content in "${table}"?`,
      "Clearing table content cannot be undone.",
      async () => {
        const { database } = this.props.match.params;

        await clearTable(database, table);
        await this.listTables();
      }
    );
  }

  render() {
    const { match, header } = this.props;
    const { database } = match.params;
    const { tables } = this.state;

    return (
      <div>
        <div className="paper-wrapper">
          <div id="database" className="paper">
            {header}
            <div className="breadcrumb">
              <Link to={DATABASES}>Databases</Link>
            </div>
            <h2>{database}</h2>
            <form
              className="execute-statement"
              onSubmit={event => {
                event.preventDefault();
                this.submitStatement(getFormData(event.currentTarget));
              }}
            >
              <textarea name="sql" />
              <button type="submit">Execute Statement</button>
            </form>
            <div className="content-wrapper">
              <div className="content">
                <button onClick={() => this.createButtonHandler()}>
                  Create
                </button>
                {tables.length > 0 ? (
                  <ul className="results">
                    {tables.map(({ name, count }, index) => (
                      <li key={`table_${index}`}>
                        <Link to={`${database}/${name}`}>{name}</Link>
                        <div className="button-wrapper">
                          <div className="count">{count} rows</div>
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
                            title="Copy table"
                            className="button copy-image hide"
                            style={{
                              backgroundImage: `url(${CopyIcon})`
                            }}
                          />
                          <div
                            title="Clear table"
                            className="button clear-image"
                            style={{
                              backgroundImage: `url(${ClearIcon})`
                            }}
                            onClick={() => this.clearButtonHandler(name)}
                          />
                          <div
                            title="Delete table"
                            className="button delete-image"
                            style={{
                              backgroundImage: `url(${DeleteIcon})`
                            }}
                            onClick={() => this.deleteButtonHandler(name)}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-results">No tables</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <PromptDialog ref={dialog => (this.promptDialog = dialog)} />
        <ConfirmDialog ref={dialog => (this.confirmDialog = dialog)} />
        <MessageDialog ref={dialog => (this.messageDialog = dialog)} />
      </div>
    );
  }
}

Table.propTypes = {
  match: PropTypes.shape({ params: { database: PropTypes.string } }),
  header: PropTypes.node
};

export default Table;
