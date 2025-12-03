import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
/**
 * muestra la tabla de analisis del comportamiento por mes
 * @param {object} props
 * @returns {component}
 */
export default function TablaComportamiento(props) {
  //props
  const { data = [] } = props;
  //states
  const [total, setTotal] = useState(null);
  //methods
  const formatDate = (dateRaw) => {
    const date = new Date(dateRaw);
    return `${
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    }-${date.getFullYear()}`;
  };
  //effects
  useEffect(() => {
    if (data && data.length > 0) {
      console.table(data);
      setTotal({
        generalPptValueAchievement: data.reduce(
          (acc, curr) => acc + curr.budgetReport.generalPptValueAchievement,
          0
        ),
        useVbaBudgetSeven: data.reduce(
          (acc, curr) => acc + curr.budgetReport.useVbaBudgetSeven,
          0
        ),
        variationVIAT: data.reduce(
          (acc, curr) => acc + curr.budgetReport.variationVIAT,
          0
        ),
        variation: data.reduce(
          (acc, curr) => acc + curr.budgetReport.variation,
          0
        ),
        collectionUseVba: data.reduce(
          (acc, curr) => acc + curr.budgetReport.collectionUseVba,
          0
        ),
        variationVba: data.reduce(
          (acc, curr) => acc + curr.budgetReport.variationVba,
          0
        ),
        collectionUseMarketingValue: data.reduce(
          (acc, curr) => acc + curr.budgetReport.collectionUseMarketingValue,
          0
        ),
        compliance: data.reduce(
          (acc, curr) => acc + curr.budgetReport.compliance,
          0
        ),
        useCommercializationBudgetSeven: data.reduce(
          (acc, curr) =>
            acc + curr.budgetReport.useCommercializationBudgetSeven,
          0
        ),
        percentageVariation: data.reduce(
          (acc, curr) => acc + curr.budgetReport.percentageVariation,
          0
        ),
        turnUse: data.reduce((acc, curr) => acc + curr.budgetReport.turnUse, 0),
        percentageVariationVIAT: data.reduce(
          (acc, curr) => acc + curr.budgetReport.percentageVariationVIAT,
          0
        ),
        incentiveForTreatmentAndUseBudget: data.reduce(
          (acc, curr) =>
            acc + curr.budgetReport.incentiveForTreatmentAndUseBudget,
          0
        ),
        collectionIncentiveOfUse: data.reduce(
          (acc, curr) => acc + curr.budgetReport.collectionIncentiveOfUse,
          0
        ),
        percentageVariationVba: data.reduce(
          (acc, curr) => acc + curr.budgetReport.percentageVariationVba,
          0
        ),
      });
    }
  }, [data]);
  //render
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
              Aprovechamiento Comercializacón Ppto
            </td>
            {data.map((ele, id) => (
              <td key={`data-${id}`} className="align-middle ">
                {ele.budgetReport.useCommercializationBudgetSeven}
              </td>
            ))}
            {total && (
              <td className="align-middle ">
                {total.useCommercializationBudgetSeven}
              </td>
            )}
          </tr>

          <tr className="text-center">
            <td className="align-middle bg-primary text-white">
              Recaudo Aprovechamiento Comercialización
            </td>
            {data.map((ele, id) => (
              <td key={`data-${id}`} className="align-middle ">
                {ele.budgetReport.collectionUseMarketingValue}
              </td>
            ))}{" "}
            {total && (
              <td className="align-middle ">
                {total.collectionUseMarketingValue}
              </td>
            )}
          </tr>
          <tr className="text-center">
            <td className="align-middle bg-primary text-white">Variación</td>{" "}
            {data.map((ele, id) => (
              <td key={`data-${id}`} className="align-middle ">
                {ele.budgetReport.variation}
              </td>
            ))}{" "}
            {total && <td className="align-middle ">{total.variation}</td>}
          </tr>
          <tr className="text-center">
            <td className="align-middle bg-primary text-white">Variacion %</td>{" "}
            {data.map((ele, id) => (
              <td key={`data-${id}`} className="align-middle ">
                {ele.budgetReport.percentageVariation}
              </td>
            ))}{" "}
            {total && (
              <td className="align-middle ">{total.percentageVariation}</td>
            )}
          </tr>
          <tr className="text-center">
            <td className="align-middle bg-primary text-white">
              Aprovechamiento VBA Ppto
            </td>{" "}
            {data.map((ele, id) => (
              <td key={`data-${id}`} className="align-middle ">
                {ele.budgetReport.useVbaBudgetSeven}
              </td>
            ))}{" "}
            {total && (
              <td className="align-middle ">{total.useVbaBudgetSeven}</td>
            )}
          </tr>
          <tr className="text-center">
            <td className="align-middle bg-primary text-white">
              Recaudo Aprovechamiento VBA
            </td>{" "}
            {data.map((ele, id) => (
              <td key={`data-${id}`} className="align-middle ">
                {ele.budgetReport.collectionUseVba}
              </td>
            ))}{" "}
            {total && (
              <td className="align-middle ">{total.collectionUseVba}</td>
            )}
          </tr>
          <tr className="text-center">
            <td className="align-middle bg-primary text-white">Variación</td>{" "}
            {data.map((ele, id) => (
              <td key={`data-${id}`} className="align-middle ">
                {ele.budgetReport.variationVba}
              </td>
            ))}{" "}
            {total && <td className="align-middle ">{total.variationVba}</td>}
          </tr>
          <tr className="text-center">
            <td className="align-middle bg-primary text-white">Variacion %</td>{" "}
            {data.map((ele, id) => (
              <td key={`data-${id}`} className="align-middle ">
                {ele.budgetReport.percentageVariationVba}
              </td>
            ))}{" "}
            {total && (
              <td className="align-middle ">{total.percentageVariationVba}</td>
            )}
          </tr>
          <tr className="text-center">
            <td className="align-middle bg-primary text-white">
              Valor Ppto General Aprovechamiento
            </td>
            {data.map((ele, id) => (
              <td key={`data-${id}`} className="align-middle">
                {ele.budgetReport.generalPptValueAchievement}
              </td>
            ))}{" "}
            {total && (
              <td className="align-middle ">
                {total.generalPptValueAchievement}
              </td>
            )}
          </tr>
          <tr className="text-center">
            <td className="align-middle bg-primary text-white">
              Giro Aprovechamiento
            </td>{" "}
            {data.map((ele, id) => (
              <td key={`data-${id}`} className="align-middle ">
                {ele.budgetReport.turnUse}
              </td>
            ))}{" "}
            {total && <td className="align-middle ">{total.turnUse}</td>}
          </tr>
          <tr className="text-center">
            <td className="align-middle bg-primary text-white">Cumplimiento</td>{" "}
            {data.map((ele, id) => (
              <td key={`data-${id}`} className="align-middle ">
                {ele.budgetReport.compliance}
              </td>
            ))}{" "}
            {total && <td className="align-middle ">{total.compliance}</td>}
          </tr>
          <tr className="text-center">
            <td className="align-middle bg-primary text-white">
              VIAT - Incentivo al tratamiento
            </td>{" "}
            {data.map((ele, id) => (
              <td key={`data-${id}`} className="align-middle ">
                {ele.budgetReport.incentiveForTreatmentAndUseBudget}
              </td>
            ))}{" "}
            {total && (
              <td className="align-middle ">
                {total.incentiveForTreatmentAndUseBudget}
              </td>
            )}
          </tr>
          <tr className="text-center">
            <td className="align-middle bg-primary text-white">
              Reacudo Incentivo de Aprovechamiento
            </td>{" "}
            {data.map((ele, id) => (
              <td key={`data-${id}`} className="align-middle ">
                {ele.budgetReport.collectionIncentiveOfUse}
              </td>
            ))}{" "}
            {total && (
              <td className="align-middle ">
                {total.collectionIncentiveOfUse}
              </td>
            )}
          </tr>
          <tr className="text-center">
            <td className="align-middle bg-primary text-white">Variación</td>{" "}
            {data.map((ele, id) => (
              <td key={`data-${id}`} className="align-middle e">
                {ele.budgetReport.variationVIAT}
              </td>
            ))}{" "}
            {total && <td className="align-middle ">{total.variationVIAT}</td>}
          </tr>
          <tr className="text-center">
            <td className="align-middle bg-primary text-white">Variacion %</td>{" "}
            {data.map((ele, id) => (
              <td key={`data-${id}`} className="align-middle">
                {ele.budgetReport.percentageVariationVIAT}
              </td>
            ))}{" "}
            {total && (
              <td className="align-middle ">{total.percentageVariationVIAT}</td>
            )}
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
