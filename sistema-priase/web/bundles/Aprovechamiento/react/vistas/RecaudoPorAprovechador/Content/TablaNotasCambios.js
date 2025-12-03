import React, { Fragment } from "react";
import { Table } from "react-bootstrap";

/**
 *  componente que carga el componente de la tabla de notas cambios
 *
 * @param {object} props - propiedades del componente
 * @param {object} props.data - lista de la informacion de la consulta de detalle de notas cambios
 * @returns {component}}
 */
export default function TablaNotasCambios({ data }) {
  if (data === null) data = { content: [] };
  const columns = [
    "Fecha Reg. Notas",
    "Id. Nota",
    "Periodo Liquidación",
    "Documento",
    "Tipo Documento",
    "Concepto",
    "Cambio Vlr TA",
    "Cambio Vlr Pagado",
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
                <td className="align-middle">{el.dateRegisterNote}</td>
                <td className="align-middle">{el.idNote}</td>
                <td className="align-middle">{el.liquidationPeriod}</td>
                <td className="align-middle">{el.document}</td>
                <td className="align-middle">{el.documentType}</td>
                <td className="align-middle">{el.concept}</td>
                <td className="align-middle">{el.valueChangeTA}</td>
                <td className="align-middle">{el.changeValuePaid}</td>
                <td className="align-middle">{el.collectedPeriod}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Fragment>
  );
}
