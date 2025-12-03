import React, { Component } from "react";
import { Table } from "react-bootstrap";
import "./ComponentsStyles.scss";

export default class SimpleTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeColor: true,
    };
  }

  calculatedTotals(data, keyData) {
    let totalSum = 0;
    for (let i = 0; i < data.length; i++) {
      totalSum = totalSum + data[i][keyData];
    }
    return totalSum.toFixed(2);
  }

  render() {
    const { columns, headers, data, totals } = this.props;

    return (
      <Table>
        <thead>
          <tr className={"table-header"}>
            {!!headers ? (
              headers.map((header, indexH) => <th key={indexH}>{header}</th>)
            ) : (
              <th colSpan={columns.length - 1}>No Data</th>
            )}
          </tr>
        </thead>
        <tbody>
          {!!data &&
            data.map((row, indexrow) => (
              <tr
                key={indexrow}
                className={indexrow % 2 == 0 ? "table-body-1" : "table-body-2"}
              >
                {columns.map((info, indexdat) => (
                  <td key={indexdat}>{row[columns[indexdat]]} </td>
                ))}
              </tr>
            ))}
          {!!totals && !!data && (
            <tr className={"table-header"}>
              {columns.map((column, indexcolumn) => {
                if (typeof totals[column] === "string") {
                  return <td key={indexcolumn}>{totals[column]} </td>;
                } else if (totals[column] === true) {
                  const total = this.calculatedTotals(data, column);
                  return <td key={indexcolumn}>{total} </td>;
                } else {
                  return <td key={indexcolumn}></td>;
                }
              })}
            </tr>
          )}
        </tbody>
      </Table>
    );
  }
}
