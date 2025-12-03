import React, { Fragment, useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import PaginationDinamic from "./PaginationDinamic";
export default function TableGirosDetallePeriodos(props) {
  //props
  const { data = [] } = props;
  //state
  const [totalData, settotalData] = useState({
    orderValueCC: 0,
    orderValueTA: 0,
    orderValueTotal: 0,
  });
  const [dataTable, setDataTable] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  //effects
  useEffect(() => {
    const total = {
      orderValueCC: data.reduce((acc, cur) => acc + cur.orderValueCC, 0),
      orderValueTA: data.reduce((acc, cur) => acc + cur.orderValueTA, 0),
      orderValueTotal: data.reduce((acc, cur) => acc + cur.orderValueTotal, 0),
    };

    let infoData = [];
    let arrayTemp = [];
    let num = 0;
    for (let i = 0; i < data.length; i++) {
      arrayTemp.push(data[i]);
      if ((i + 1) % 5 === 0 && data.length > 8) {
        if (arrayTemp.length !== 0) {
          infoData[num] = arrayTemp;
          arrayTemp = [];
          num++;
        }
      }
      if (i + 1 === data.length && data.length < 8 + 1) {
        if (arrayTemp.length !== 0) {
          infoData[num] = arrayTemp;
          arrayTemp = [];
          num++;
        }
      }
      if ((i + 1) % 8 !== 0 && i === data.length - 1) {
        if (arrayTemp.length !== 0) {
          infoData[num] = arrayTemp;
          arrayTemp = [];
          num++;
        }
      }
    }
    setCurrentPage(0);
    settotalData(total);
    setDataTable(infoData);
  }, [data]);

  return (
    <Fragment>
      <Table>
        <thead className="text-uppercase">
          <tr className="text-center bg-primary text-white">
            <th className="text-center">No Oficio Pago</th>
            <th className="text-center">Acto No</th>
            <th className="text-center">Periodo</th>
            <th className="text-center">Valor girado CC</th>
            <th className="text-center">Valor Girado TA</th>
            <th className="text-center">Valor A Girar</th>
            <th className="text-center">Fecha Giro</th>
          </tr>
        </thead>
        <tbody>
          {dataTable[currentPage]
            ? dataTable[currentPage].map((ele, id) => (
                <tr key={id}>
                  <td className="text-center">{ele.paymentTradeNumber}</td>
                  <td className="text-center">{ele.minuteNumber}</td>
                  <td className="text-center">{ele.period}</td>
                  <td className="text-center">{ele.orderValueCC}</td>
                  <td className="text-center">{ele.orderValueTA}</td>
                  <td className="text-center">{ele.orderValueTotal}</td>
                  <td className="text-center">{ele.orderDate}</td>
                </tr>
              ))
            : null}
          <tr>
            <td colSpan={2}></td>
            <td>Totales</td>
            <td className="text-center">{totalData.rotatedValueCC}</td>
            <td className="text-center">{totalData.orderValueTA}</td>
            <td className="text-center">{totalData.orderValueTotal}</td>
            <td></td>
          </tr>
        </tbody>
      </Table>
      {dataTable.length > 1 && (
        <PaginationDinamic
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          numPages={dataTable.length - 1}
        />
      )}
    </Fragment>
  );
}
