import React, { useEffect, useState, Fragment } from "react";
import { Table } from "react-bootstrap";
import moment from "moment";

export default function TableDetalle(props) {
  //props
  const { data = [] } = props;

  //states
  const [listNames, setlistNames] = useState({});
  const [listDate, setlistDate] = useState([]);
  const [totalList, setTotalList] = useState([]);
  //methods
  const formatDate = (dateRaw) => {
    return moment(dateRaw).format("MM-YYYY");
  };
  //componente interno
  const TableDetalle = (props) => {
    const { data } = props;
    let dataUse = [];
    for (const item of Object.entries(data)) {
      dataUse.push(item);
    }

    return (
      <Fragment>
        {dataUse.map((el) => (
          <tr key={`tr-${el[0]}`}>
            <td className="text-center align-middle text-white bg-primary">
              {el[0]}
            </td>
            {el[1].map((el, id) => (
              <td
                key={`data-td-${id}-${el[0]}`}
                className="text-center align-middle"
              >
                {el.total}
              </td>
            ))}
            <td className="text-center align-middle">
              {el[1].reduce((a, b) => a + b.total, 0)}
            </td>
          </tr>
        ))}
      </Fragment>
    );
  };

  //effects
  useEffect(() => {
    let lisTemp = [];
    let listDateTemp = [];
    let totals = [];
    let object = {};
    data.forEach((element) => {
      if (!lisTemp.includes(element.name)) {
        lisTemp.push(element.association);
      }

      if (!listDateTemp.includes(formatDate(element.start))) {
        listDateTemp.push(formatDate(element.start));
      }
    });

    lisTemp.forEach((element) => {
      object[element] = [];
    });

    data.forEach((element) => {
      if (object[element.association]) {
        const tempData = {
          ...element,
          start: formatDate(element.start),
          end: formatDate(element.end),
        };

        object[element.association].push(tempData);
      }
    });

    let tempObject = object;

    listDateTemp.forEach((elementDate, index) => {
      let tempTotal = 0;
      for (const item of Object.entries(object)) {
        if (item[1][index].start === elementDate) {
          tempObject[item[0]][index] = item[1][index];
          tempTotal += item[1][index].total;
        }
        if (item[1][index].start !== elementDate) {
          let tempNewData = [];

          object[item[0]].forEach((ele, idx) => {
            if (idx === index) {
              tempNewData.push({
                association: ele.association,
                total: 0,
                start: elementDate,
                end: elementDate,
              });
              tempNewData.push(ele);
            } else {
              tempNewData.push(ele);
            }
          });
          tempObject[item[0]] = tempNewData;
        }
      }
      totals.push(tempTotal);
    });
    setTotalList(totals);
    setlistDate(listDateTemp);
    setlistNames(tempObject);
  }, [data]);
  return (
    <div
      className="d-flex flex-column w-100 mt-3 "
      style={{ overflow: "auto" }}
    >
      <Table striped bordered hover>
        <thead className="text-uppercase">
          <th
            className="text-center align-middle text-white bg-primary"
            style={{ minWidth: "230px" }}
          >
            Asociación
          </th>
          {listDate.map((el, id) => (
            <th
              key={`date-${id}`}
              className="text-center align-middle"
              style={{ minWidth: "100px" }}
            >
              {`${el}`.substring(3, 7)}
            </th>
          ))}
          <th className="text-center align-middle text-white bg-primary">
            Total
          </th>
        </thead>
        <tbody>
          <TableDetalle data={listNames} />
          <tr>
            <td className="text-center align-middle text-white bg-primary">
              Totales
            </td>
            {totalList.map((el, id) => (
              <td key={`total-${id}`} className="text-center align-middle">
                {el}
              </td>
            ))}
            <td className="text-center align-middle">
              {totalList.reduce((a, b) => a + b, 0)}
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
