import React from "react";
import { Button, Table } from "react-bootstrap";

/**
 * componente de la tabla de detalle de ala tabla de recaudo consolidado por aprovechador
 *
 * @param {object} props - propiedades del componente
 * @param {object[]} props.data - lista de la informacion de la consulta de detalle de aprovechador consolidado
 * @returns {components}
 */
export default function TablaReacudoConsolidadoporAprovechador({ data = [] }) {
  const columns = [
    "Acción",
    "Periodo Prestación",
    "Periodo Liquidación",
    "Pago CC",
    "Pago TA",
    "Cambios Vlr TA",
    "Cambios Vlr Pagado",
    "Pago Ajuste CC",
    "DINC",
    "Valor Recaudo Financiado",
    "Valor Intereses MAro y Corriente",
    "Pago Total",
  ];

  return (
    <div
      className="d-flex flex-column w-100 mb-3 "
      style={{ overflow: "auto" }}
    >
      <Table>
        <thead>
          <tr>
            {columns.map((ele, id) => (
              <th key={id}>{ele}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((ele, id) => (
              <tr key={id}>
                <td>
                  <Button onClick={() => console.log(ele)}>Detalle</Button>
                </td>
                <td>{ele.periodoPrestacion}</td>
                <td>{ele.periodoLiquidacion}</td>
                <td>{ele.pagoCC}</td>
                <td>{ele.pagota}</td>
                <td>{ele.cambiosVlrTA}</td>
                <td>{ele.cambiosVlrPagado}</td>
                <td>{ele.pagoAjusteCC}</td>
                <td>{ele.dinc}</td>
                <td>{ele.valorRecaudadoFinanciado}</td>
                <td>{ele.valorInteresMora}</td>
                <td>{ele.valorInteresCorriente}</td>
                <td>{ele.pagoTotal}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}
