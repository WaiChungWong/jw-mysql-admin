import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { executeStatement } from "../../../controller";
import { DATABASES } from "../../../sitemap";

import MessageDialog from "../../components/messagedialog";

import "./style.css";

class Table extends Component {
  constructor(props) {
    super(props);

    const { match } = props;
    const { table } = match.params;

    this.state = {
      sql: `SELECT * FROM \`${table}\``,
      count: 0,
      columns: [],
      rows: [],
      pageCount: 100,
      pageIndex: 0
    };
  }

  async componentDidMount() {
    await this.listContent();
  }

  async listContent() {
    const { match } = this.props;
    const { database, table } = match.params;
    const { sql, pageCount, pageIndex } = this.state;
    let [error, result] = await executeStatement(
      database,
      sql,
      pageCount,
      pageIndex
    );

    if (!sql.toLowerCase().startsWith("select")) {
      [error, result] = await executeStatement(
        database,
        `SELECT * FROM \`${table}\``,
        pageCount,
        pageIndex
      );
    }

    if (error) {
      this.messageDialog.message(error);
    } else {
      this.setState(result);
    }
  }

  async submitStatement() {
    const { sql } = this.state;

    if (sql) {
      await this.setState({ sql });
      await this.listContent();
    }
  }

  async changePageSettings(settings) {
    await this.setState(settings);
    await this.listContent();
  }

  render() {
    const { match } = this.props;
    const { database, table } = match.params;
    const { sql, count, columns, rows, pageCount, pageIndex } = this.state;

    return (
      <div>
        <div className="paper-wrapper">
          <div id="table" className="paper">
            <div className="breadcrumb">
              <Link to={DATABASES}>Databases</Link>
              <span>{">"}</span>
              <Link to={`/${database}`}>{database}</Link>
            </div>
            <h2>{table}</h2>
            <div className="content-wrapper">
              <div className="content">
                <form className="execute-statement">
                  <textarea
                    value={sql}
                    onChange={event =>
                      this.setState({ sql: event.currentTarget.value })
                    }
                  />
                  <button onClick={() => this.submitStatement()}>
                    Execute Statement
                  </button>
                </form>
                {rows.length > 0 ? (
                  <div className="results">
                    <div className="count">Total {count} rows</div>
                    <form className="page-settings">
                      {(() => {
                        let elements = [];
                        let pageLength = Math.ceil(count / pageCount);

                        for (let i = 0; i < pageLength; i++) {
                          if (pageIndex === i) {
                            elements.push(
                              <span key={`item_${i}`}>{i + 1}</span>
                            );
                          } else if (
                            i === 0 ||
                            i === pageLength - 1 ||
                            (pageIndex !== i && Math.abs(pageIndex - i) < 3)
                          ) {
                            elements.push(
                              <button
                                key={`item_${i}`}
                                onClick={() =>
                                  this.changePageSettings({ pageIndex: i })
                                }
                              >
                                {i + 1}
                              </button>
                            );
                          } else if (Math.abs(pageIndex - i) === 3) {
                            elements.push(<span key={`item_${i}`}>...</span>);
                          }
                        }

                        return elements;
                      })()}
                      <select
                        name="count"
                        value={pageCount}
                        onChange={event =>
                          this.changePageSettings({
                            pageCount: event.currentTarget.value
                          })
                        }
                      >
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value="500">500</option>
                      </select>
                    </form>
                    <div className="table-content-wrapper">
                      <table className="table-content">
                        <thead>
                          <tr>
                            {columns.map((column, index) => (
                              <th key={`column_${index}`}>{column}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row, rowIndex) => (
                            <tr key={`row_${rowIndex}`}>
                              {Object.keys(row).map((cell, cellIndex) => (
                                <td key={`cell_${cellIndex}`}>{row[cell]}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="no-results">No results</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <MessageDialog ref={dialog => (this.messageDialog = dialog)} />
      </div>
    );
  }
}

Table.propTypes = {
  match: PropTypes.shape({ itemId: PropTypes.string })
};

export default Table;
