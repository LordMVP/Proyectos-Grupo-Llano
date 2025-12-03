import React, { Fragment } from "react";
import { Button, Table } from "react-bootstrap";
/**
 * componente que carga el componente de la tabla de cruce de recaudos
 *
 * @param {object} props - propiedades del componente
 *  @param {object[]} props.data - informacion de la consulta de cruce recaudo
 * @returns {component}
 */
export default function TablaCruceRecaudo({ data = [] }) {
  if (data === null) data = { content: [] };
  const columns = [
    "Id. Factura",
    "Cod Suscripción",
    "Periodo Prestación",
    "Periodo Liquidación",
    "Documento",
    "Tipo Documento",
    "Concepto",
    "Valor Pagado",
    "Periodo Recaudo",
  ];
  return (
    <Fragment>
      <div
        className="d-flex flex-column w-100 mb-3 "
        style={{ overflow: "auto" }}
      >
        <Table striped bordered hover variant="info">
          <thead className="text-uppercase">
            <tr className="text-center ">
              {columns.map((ele, id) => (
                <th key={id} className="align-middle">
                  {ele}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.content.map((ele, id) => (
              <tr key={id} className="text-center">
                <td>{ele.idInvoice}</td>
                <td>{ele.subscriptionCode}</td>
                <td>{ele.benefitPeriod}</td>
                <td>{ele.liquidationPeriod}</td>
                <td>{ele.document}</td>
                <td>{ele.documentType}</td>
                <td>{ele.concept}</td>
                <td>{ele.valuePaid}</td>
                <td>{ele.collectionPeriod}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Fragment>
  );
}
