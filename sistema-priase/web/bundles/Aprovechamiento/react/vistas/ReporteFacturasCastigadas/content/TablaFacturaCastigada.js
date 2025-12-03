import React, { Fragment, useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { REORDER_PAGES_DATA } from "../../../global/constantes";
import PaginationDinamic from "./PaginationDinamic";
/**
 *
 * @param {*} param0
 * @returns {component}
 */
export default function TablaFacturaCastigada(props) {
  //props
  const { data = [] } = props;
  //const
  const columns = [
    "Id Factura",
    "Fecha Expedición",
    "Valor",
    "Edad",
    "Total % Participación",
    "% CC",
    "Valor a Castigar CC",
    "% TA",
    "Valor a Castigar TA",
    "% Ajuste CC",
    "Valor a Castigar Ajuste CC",
    "% Ajuste TA",
    "Valor a Castigar Ajuste TA",
  ];
  //states
  const [showDataOrder, setshowDataOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  //effects
  useEffect(() => {
    //setea el orden de la tabla
    if (data && data.length > 0) {
      setCurrentPage(0);
      setshowDataOrder(REORDER_PAGES_DATA(data, 10));
    }
  }, [data]);

  if (showDataOrder) {
    return (
      <Fragment>
        <div
          className="d-flex flex-column w-100 mb-3 "
          style={{ overflow: "auto" }}
        >
          <Table striped bordered hover variant="info">
            <thead className="text-uppercase">
              <tr className="text-center">
                {columns.map((ele, id) => (
                  <th key={id} className="text-center align-middle">
                    {ele}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {showDataOrder[currentPage].map((ele, id) => (
                <tr key={id} className="text-center">
                  <td className="align-middle">{ele.invoiceId}</td>
                  <td className="align-middle">{ele.expeditionDate}</td>
                  <td className="align-middle">{ele.value}</td>
                  <td className="align-middle">{ele.age}</td>
                  <td className="align-middle">{ele.totalPercent}</td>
                  <td className="align-middle">{ele.percentCC}</td>
                  <td className="align-middle">{ele.percentTA}</td>
                  <td className="align-middle">{ele.percentAdjustCC}</td>
                  <td className="align-middle">{ele.percentAdjustTA}</td>
                  <td className="align-middle">{ele.paidCC}</td>
                  <td className="align-middle">{ele.paidTA}</td>
                  <td className="align-middle">{ele.adjustPaidCC}</td>
                  <td className="align-middle">{ele.adjustPaidTA}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="w-100 d-flex justify-content-center">
          {showDataOrder && (
            <PaginationDinamic
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              numPages={showDataOrder.length - 1}
            />
          )}
        </div>
      </Fragment>
    );
  }

  return <h2>Seleccione un detalle </h2>;
}
