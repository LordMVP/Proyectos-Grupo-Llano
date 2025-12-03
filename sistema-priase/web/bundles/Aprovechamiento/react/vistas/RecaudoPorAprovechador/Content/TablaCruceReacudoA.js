import React, { Fragment } from "react";
import { Table } from "react-bootstrap";
/**
 * componente que carga el componente de la tabla de cruce de recaudos aforado
 *
 * @param {object} props - propiedades del componente
 *  @param {object[]} props.data - informacion de la consulta de cruce recaudo aforado
 * @returns {component}
 */
export default function TablaCruceReacudoA({ data }) {
  if (data === null) data = { content: [] };
  const columns = [
    "Id. Factura",
    "Cod. Suscripción",
    "Periodo Prestación",
    "Documento",
    "Tipo Documento",
    "Concepto",
    "Valor Pagado",
    "Periodo Recaudo",
    "TAFA (ton)",
  ];
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
            {data.content.map((el, id) => (
              <tr key={id} className="text-center">
                <td className="align-middle">{el.idInvoice}</td>
                <td className="align-middle">{el.codSubscription}</td>
                <td className="align-middle">{el.liquidationPeriod}</td>
                <td className="align-middle">{el.document}</td>
                <td className="align-middle">{el.documentType}</td>
                <td className="align-middle">{el.concept}</td>
                <td className="align-middle">{el.valuePaid}</td>
                <td className="align-middle">{el.periodCollected}</td>
                <td className="align-middle">{el.tara}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Fragment>
  );
}
