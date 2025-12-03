import React, { Fragment } from "react";
import { Button, Table } from "react-bootstrap";
/**
 * componente de la tabla de detalle de aprovechador consolidado
 *
 * @param {object} props - propiedades del componente
 * @param {requestCallback} props.onClicSetDetail - funcion que setea los datos de la tabla para consultar sus detalles
 * @param {object[]} props.data - lista de la informacion de la consulta de detalle de aprovechador
 * @returns {component}
 */
export default function TablaDetalleReacuidoConsolidado({
  data = [],
  onClickDetailRecuidoNA,
}) {
  const columns = [
    "Acción",
    "Periodo Prestación",
    "Periodo Liquidación",
    "Pago CC",
    "Pago TA",
    "CAmbios Vlr TA",
    "Cambios Vlr Pagado",
    "Pago Ajuste CC",
    "Pago Ajuste TA",
    "DINC",
    "Valor Recaudo Financiado",
    "Valor Intereses Mora y Corriente",
    "Pago Total",
  ];

  return (
    <Fragment>
      <div
        className="d-flex flex-column w-100 mb-3 "
        style={{ overflow: "auto" }}
      >
        <Table striped bordered hover variant="info" className="text-center">
          <thead>
            <tr>
              {columns.map((ele, id) => (
                <th key={id} className="align-middle">
                  {ele}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((ele, id) => (
              <Fragment>
                <tr key={id}>
                  <td>
                    <Button
                      onClick={() => onClickDetailRecuidoNA(ele.measured)}
                    >
                      Detalle
                    </Button>
                  </td>
                  <td>{ele.benefitPeriod}</td>
                  <td>{ele.liquidationPeriod}</td>
                  <td>{ele.paidCC}</td>
                  <td>{ele.paidTA}</td>
                  <td>{ele.valueChangeTA}</td>
                  <td>{ele.valuesChangePaid}</td>
                  <td>{ele.adjustPaidCC}</td>
                  <td>{ele.adjustPaidTA}</td>
                  <td>{ele.dinc}</td>
                  <td>{ele.valueCollectedFinanced}</td>
                  <td>{ele.interestAndCommonValue}</td>
                  <td>{ele.totalPaid}</td>
                </tr>
                {ele.totalCollectionYear !== undefined && (
                  <tr key={`A-${id}`}>
                    <td></td>
                    <td>Totales</td>
                    <td>Rec Total {ele.liquidationPeriod}</td>
                    <td>{ele.totalCollectionYear.totalAnoPagoCC}</td>
                    <td>{ele.totalCollectionYear.totalAnoPagoTA}</td>
                    <td>{ele.totalCollectionYear.totalAnoCambiosVlrTA}</td>
                    <td>{ele.totalCollectionYear.totalAnoCambiosVlrPagado}</td>
                    <td>{ele.totalCollectionYear.totalAnoPagoAjusteCC}</td>
                    <td>{ele.totalCollectionYear.totalAnoPagoAjusteTA}</td>
                    <td>{ele.totalCollectionYear.totalAnoDinc}</td>
                    <td>
                      {ele.totalCollectionYear.totalAnoValorRecaudadoFinanciado}
                    </td>
                    <td>
                      {
                        ele.totalCollectionYear
                          .totalAnoValorInteresMoraYCorriente
                      }
                    </td>
                    <td>{ele.totalCollectionYear.totalAnoPagoTotal}</td>
                  </tr>
                )}
                {ele.totalCollectionMonth !== undefined && (
                  <tr key={`B-${id}`}>
                    <td></td>
                    <td>Totales Cartera</td>
                    <td>Rec Total{ele.liquidationPeriod}</td>
                    <td>{ele.totalCollectionMonth.totalRecMesCarteraPagoCC}</td>
                    <td>
                      {ele.totalCollectionMonth.totalRecMesCarteraPagoTotal}
                    </td>
                    <td>
                      {ele.totalCollectionMonth.totalRecMesCarteraCambiosVlrTA}
                    </td>
                    <td>
                      {
                        ele.totalCollectionMonth
                          .totalRecMesCarteraCambiosVlrPagado
                      }
                    </td>
                    <td>
                      {ele.totalCollectionMonth.totalRecMesCarteraPagoAjusteCC}
                    </td>
                    <td>
                      {ele.totalCollectionMonth.totalRecMesCarteraPagoAjusteTA}
                    </td>
                    <td>{ele.totalCollectionMonth.totalRecMesCarteraDinc}</td>
                    <td>
                      {
                        ele.totalCollectionMonth
                          .totalRecMesCarteraValorRecaudadoFinanciado
                      }
                    </td>
                    <td>
                      {
                        ele.totalCollectionMonth
                          .totalRecMesCarteraValorInteresMoraYCorriente
                      }
                    </td>
                    <td>
                      {ele.totalCollectionMonth.totalRecMesCarteraPagoTotal}
                    </td>
                  </tr>
                )}
                {ele.totalCollectionAll !== undefined && (
                  <tr>
                    <td></td>
                    <td>Totales</td>
                    <td>Totales Rec</td>
                    <td>{ele.totalCollectionAll.totalesRecPagoCC}</td>
                    <td>{ele.totalCollectionAll.totalesRecPagoTA}</td>
                    <td>{ele.totalCollectionAll.totalesRecCambiosVlrTA}</td>
                    <td>{ele.totalCollectionAll.totalesRecCambiosVlrPagado}</td>
                    <td>{ele.totalCollectionAll.totalesRecPagoAjusteCC}</td>
                    <td>{ele.totalCollectionAll.totalesRecPagoAjusteTA}</td>
                    <td></td>
                    <td>
                      {
                        ele.totalCollectionAll
                          .totalesRecValorRecaudadoFinanciado
                      }
                    </td>
                    <td>
                      {
                        ele.totalCollectionAll
                          .totalesRecValorInteresMoraYCorriente
                      }
                    </td>
                    <td>{ele.totalCollectionAll.totalesRecPagoTotal}</td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </Table>
      </div>
    </Fragment>
  );
}
