import React from "react";
import { Table, Button } from "react-bootstrap";
import { COLUMNS_TABLA_DETAILS } from "../../../global/constantes";
/**
 * muestra la tabla completa para los datos seleccionados
 *
 * @param {object} props
 * @param {object[]} props.data - array que tiene los datos de la pagina
 * @returns {component}
 */
export default function TableCompleteDetails({ data }) {
  let resultValorCC = 0;
  let resultCCpor = 0;
  let resultValorTa = 0;
  let resultTapor = 0;
  let resultValorTaAfo = 0;
  let resultTotalFaCo = 0;
  let resultValorAjuCC = 0;
  let resultAjusCCpor = 0;
  let resultValorAjusTa = 0;
  let resultAjusTapor = 0;
  let resultTotalFaAju = 0;
  let resultDinc = 0;
  let resultTotalFac = 0;
  /**
   * este for hace la sumatoria de los datos a mostrar en la tabla
   */
  data.forEach((ele) => {
    if (resultCCpor + ele.porcentajeCC > 100) {
      resultCCpor = 100;
    } else {
      resultCCpor += ele.porcentajeCC;
    }

    if (resultTapor + ele.porcentajeTA > 100) {
      resultTapor = 100;
    } else {
      resultTapor += ele.porcentajeTA;
    }

    if (resultValorTaAfo + ele.porcentajeTAAforado > 100) {
      resultValorTaAfo = 100;
    } else {
      resultValorTaAfo += ele.porcentajeTAAforado;
    }

    if (resultAjusCCpor + ele.porcentajeAjusteCC > 100) {
      resultAjusCCpor = 100;
    } else {
      resultAjusCCpor += ele.porcentajeAjusteCC;
    }

    if (resultAjusTapor + ele.porcentajeAjusteTA > 100) {
      resultAjusTapor = 100;
    } else {
      resultAjusTapor += ele.porcentajeAjusteTA;
    }
    resultValorTa += ele.valorTA;
    resultValorCC += ele.valorCC;
    resultTotalFaCo += ele.totalesCorriente;
    resultValorAjuCC += ele.valorAjusteCC;

    resultValorAjusTa += ele.valorAjusteTA;

    resultTotalFaAju += ele.totales;
    resultDinc += ele.dinc;
    resultTotalFac += ele.totalFacturado;
  });
  return (
    <Table striped bordered hover variant="info" className="mb-0">
      <thead className="text-uppercase">
        <tr>
          <th colSpan={3} className="border-0 bg-white"></th>
          <th colSpan={6} className="bg-success text-center">
            Factura Corriente
          </th>
          <th colSpan={5} className="bg-warning  text-center ">
            Factura Ajuste
          </th>
          <th colSpan={3} className="border-0 bg-white"></th>
        </tr>
        <tr>
          {COLUMNS_TABLA_DETAILS.map((ele, id) => (
            <th key={id} className="align-middle">
              {ele}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((ele, id) => (
          <tr key={id} className="align-middle text-center">
            <td>
              <div className="d-flex flex-column">
                <div>{ele.aprovechador}</div>
                <div>
                  <b>NIT: </b>
                  {ele.nit || 0}
                </div>
              </div>
            </td>
            <td>{ele.periodoPrestacionString}</td>
            <td>{ele.periodoLiquidacionString}</td>
            <td>{ele.valorCC}</td>
            <td>{ele.porcentajeCC}%</td>
            <td>{ele.valorTA || 0}</td>
            <td>{ele.porcentajeTA}%</td>
            <td>{ele.porcentajeTAAforado}</td>
            <td>{ele.totalesCorriente}</td>
            <td>{ele.valorAjusteCC}</td>
            <td>{ele.porcentajeAjusteCC}%</td>
            <td>{ele.valorAjusteTA}</td>
            <td>{ele.porcentajeAjusteTA}%</td>
            <td>{ele.totales || 0}</td>
            <td>{ele.dinc}</td>
            <td>{ele.totalFacturado}</td>
            <td>
              <Button
                onClick={() => {
                  console.log("Detalle Aforado");
                }}
              >
                Detalle Aforado
              </Button>
            </td>
          </tr>
        ))}
        <tr className="align-middle text-center">
          <td colSpan={2} className="bg-white border-0"></td>
          <td className="text-uppercase  font-weight-bold">Totales</td>
          <td>{resultValorCC}</td>
          <td>{resultCCpor}%</td>
          <td>{resultValorTa}</td>
          <td>{resultTapor}%</td>
          <td>{resultValorTaAfo}</td>
          <td>{resultTotalFaCo}</td>
          <td>{resultValorAjuCC}</td>
          <td>{resultAjusCCpor}%</td>
          <td>{resultValorAjusTa}</td>
          <td>{resultAjusTapor}%</td>
          <td>{resultTotalFaAju}</td>
          <td>{resultDinc}</td>
          <td>{resultTotalFac}</td>
          <td>
            <Button
              onClick={() => {
                console.log("Detalle Aforado T-T");
              }}
            >
              Detalle Aforado
            </Button>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
