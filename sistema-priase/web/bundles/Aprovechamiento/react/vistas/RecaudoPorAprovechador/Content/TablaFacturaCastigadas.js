import React, { Fragment } from "react";
import { Table } from "react-bootstrap";

/**
 * componente que carga el componente de la tabla de facturas castigadas
 *
 * @param {object} props - propiedades del componente
 * @param {object[]} props.data - informacion de la consulta de las facturas castigadas
 * @returns {component}
 */
export default function TablaFacturaCastigadas({ data = { content: [] } }) {
  const colums = [
    "Id. Nota",
    "Id. Factura Origen",
    "Doc. Factura Origen",
    "Tipo Doc. Factura Origen",
    "Periodo Liquidación",
    "Documento",
    "Tipo Documento",
    "Concepto",
    "Valor Castigado",
    "Periodo Castigado",
  ];
  console.log(data);
  return (
    <Fragment>
      <div
        className="d-flex flex-column w-100 mb-3 "
        style={{ overflow: "auto" }}
      >
        <Table striped bordered hover variant="info">
          <thead className="text-uppercase">
            <tr className="text-center">
              {colums.map((ele, id) => (
                <th key={id} className="text-center align-middle">
                  {ele}
                </th>
              ))}
            </tr>
          </thead>
          {data && (
            <tbody>
              {data.content.map((ele, id) => (
                <tr key={id} className="text-center">
                  <td className="align-middle">{ele.idNota}</td>
                  <td className="align-middle">{ele.idParentInvoice}</td>
                  <td className="align-middle">{ele.parentDocInvoice}</td>
                  <td className="align-middle">{ele.parentDocTypeInvoice}</td>
                  <td className="align-middle">{ele.liquidationPeriod}</td>
                  <td className="align-middle">{ele.document}</td>
                  <td className="align-middle">{ele.documentType}</td>
                  <td className="align-middle">{ele.concepto}</td>
                  <td className="align-middle">{ele.punishedValue}</td>
                  <td className="align-middle">{ele.punishedPeriod}</td>
                </tr>
              ))}
            </tbody>
          )}
        </Table>
      </div>
    </Fragment>
  );
}
