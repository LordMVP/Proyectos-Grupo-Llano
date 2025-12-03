import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
/**
 *  muestra la tabla de analisis con presupuesto
 * @param {object} props  - propiedades del componente
 * @param {object[]} props.data - datos de la tabla
 * @returns {component}
 */
export default function TablaAnalisisconPresupuesto(props) {
  //props
  const { data = [] } = props;
  //states
  const [total, setTotal] = useState(null);
  //methods
  const formatDate = (dateRaw) => {
    //formatea la fecha
    const date = new Date(dateRaw);
    return `${
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    }-${date.getFullYear()}`;
  };
  //effects
  useEffect(() => {
    //calcula el total
    setTotal({
      executedTotal: data.reduce(
        (acc, cur) => acc + cur.analysisReportBudget.executedTotal,
        0
      ),
      analysisVariation: data.reduce(
        (acc, cur) => acc + cur.analysisReportBudget.analysisVariation,
        0
      ),
      totalValueBudgetThirdPartiesUse: data.reduce(
        (acc, cur) =>
          acc + cur.analysisReportBudget.totalValueBudgetThirdPartiesUse,
        0
      ),
      analysisPercentageVariation: data.reduce(
        (acc, cur) =>
          acc + cur.analysisReportBudget.analysisPercentageVariation,
        0
      ),
    });
  }, [data]);
  return (
    <div
      className="d-flex flex-column w-100 mb-3 "
      style={{ overflow: "auto" }}
    >
      <Table striped bordered hover>
        <thead className="text-uppercase">
          <tr className="text-center">
            <th
              className="text-center align-middle text-white bg-primary"
              style={{ minWidth: "230px" }}
            >
              Componentes Ingreso
            </th>
            {data.map((el, id) => (
              <th
                key={`date-${id}`}
                className="text-center align-middle"
                style={{ minWidth: "100px" }}
              >
                {formatDate(el.start)}
              </th>
            ))}
            <th
              className="text-center align-middle "
              style={{ minWidth: "100px" }}
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td className="align-middle bg-primary text-white">
              Valor Total Ppto Terceros Aprovechamiento
            </td>
            {data.map((ele, id) => (
              <td key={`data-${id}`} className="align-middle ">
                {ele.analysisReportBudget.totalValueBudgetThirdPartiesUse}
              </td>
            ))}
            {total && (
              <td className="align-middle ">
                {total.totalValueBudgetThirdPartiesUse}
              </td>
            )}
          </tr>{" "}
          <tr className="text-center">
            <td className="align-middle bg-primary text-white">
              Ejecitado Total
            </td>
            {data.map((ele, id) => (
              <td key={`data-${id}`} className="align-middle ">
                {ele.analysisReportBudget.executedTotal}
              </td>
            ))}
            {total && <td className="align-middle ">{total.executedTotal}</td>}
          </tr>
          <tr className="text-center">
            <td className="align-middle bg-primary text-white">Variacion</td>
            {data.map((ele, id) => (
              <td key={`data-${id}`} className="align-middle ">
                {ele.analysisReportBudget.analysisVariation}
              </td>
            ))}
            {total && (
              <td className="align-middle ">{total.analysisVariation}</td>
            )}
          </tr>
          <tr className="text-center">
            <td className="align-middle bg-primary text-white">Variacion %</td>
            {data.map((ele, id) => (
              <td key={`data-${id}`} className="align-middle ">
                {ele.analysisReportBudget.analysisPercentageVariation}
              </td>
            ))}
            {total && (
              <td className="align-middle ">
                {total.analysisPercentageVariation}
              </td>
            )}
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
