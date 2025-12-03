import React, { Fragment } from "react";
import { Button, Table } from "react-bootstrap";
/**
 * componente de la tabla de detalle de aprovechador
 *
 * @param {object} props - propiedades del componente
 * @param {requestCallback} props.onClicSetDetail - funcion que setea los datos de la tabla para consultar sus detalles
 * @param {object[]} props.data - lista de la informacion de la consulta de detalle de aprovechador
 * @returns {component}
 */
export default function TablaDetalle({ onClicSetDetail, data = [] }) {
  const columns = [
    "Aprovechador",
    "Acción",
    "Pago CC",
    "Pago TA",
    "Cambios Vlr TA",
    "CAmbios Vlr Pagado",
    "Pago Ajuste CC",
    "Pago Ajuste TA",
    "DINC",
    "Valor Recaudo Financiado",
    "Valor Interés Mora",
    "Valor Interés Corriente",
    "Pago Total",
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
            {data && (
              <tr className="text-center">
                <td>{data.thirdPartyName}</td>
                <td>
                  <Button onClick={() => onClicSetDetail(data)}>Detalle</Button>
                </td>
                <td>{data.paidCC || 0}</td>
                <td>{data.paidTA || 0}</td>
                <td>{data.valueChangeTA || 0}</td>
                <td>{data.valuesChangePaid || 0}</td>
                <td>{data.adjustPaidCC || 0}</td>
                <td>{data.adjustPaidTA || 0}</td>
                <td>{data.dinc || 0}</td>
                <td>{data.valueCollectedFinanced || 0}</td>
                <td>{data.interestValue || 0}</td>
                <td>{data.interestAndCommonValue || 0}</td>
                <td>{data.totalPaid || 0}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Fragment>
  );
}
