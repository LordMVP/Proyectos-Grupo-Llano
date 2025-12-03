import React, { Fragment, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
/**
 * componente de la tabla de detalle de aprovechador
 *
 * @param {object} props - propiedades del componente
 * @param {requestCallback} props.onClicSetDetail - funcion que setea los datos de la tabla para consultar sus detalles
 * @param {object[]} props.data - lista de la informacion de la consulta de detalle de aprovechador
 * @returns {component}
 */
export default function TablaDetallePeriodos({ onClicSetDetail, data = [] }) {
  if (data === null) data = { content: [] };
  const columns = [
    "Acción",
    "Periodo Prestación",
    "Periodo Liquidación",
    "Saldo Anterior IAT",
    "Cambio Vlr IAT",
    "Cambios Vlr Pagados",
    "Valor Recaudo Financiado",
    "Pago IAT",
    "Pago Ajuste IAT",
    "Pago Interes Mora Y corriente",
    "Pago Total",
    "Saldo Final pend. Fact IAT",
  ];
  const [totalCal, setTotalCal] = useState(null);
  useEffect(() => {
    if (data && data.content && data.content.length > 0) {
      setTotalCal({
        saldoAnterio: data.content.reduce(
          (acc, cur) => acc + cur.totals.totalSaldoAnterior,
          0
        ),
        cambioVlrIAT: data.content.reduce(
          (acc, cur) => acc + cur.totals.totalCambioVlr,
          0
        ),
        cambioVlrPagado: data.content.reduce(
          (acc, cur) => acc + cur.totals.totalCambioVlrPagado,
          0
        ),
        valorRecaudoFinanciado: data.content.reduce(
          (acc, cur) => acc + cur.totals.totalValorRecaudo,
          0
        ),
        pagoIAT: data.content.reduce(
          (acc, cur) => acc + cur.totals.totalPagoIAT,
          0
        ),
        pagoAjusteIAT: data.content.reduce(
          (acc, cur) => acc + cur.totals.totalPagoAjuste,
          0
        ),
        pagoInteresMoraCorriente: data.content.reduce(
          (acc, cur) => acc + cur.totals.totalPagoInteres,
          0
        ),
        pagoTotal: data.content.reduce(
          (acc, cur) => acc + cur.totals.totalPagoTotal,
          0
        ),
        saldoFinalPendFactIAT: data.content.reduce(
          (acc, cur) => acc + cur.totals.totalSaldoFinal,
          0
        ),
      });
    }
  }, [data]);

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
              <Fragment key={id}>
                <tr className="text-center">
                  <td>
                    <Button onClick={() => onClicSetDetail(ele)}>
                      Detalle
                    </Button>
                  </td>
                  <td>{ele.benefitPeriod}</td>
                  <td>{ele.liquidationPeriod}</td>
                  <td>{ele.totals.totalSaldoAnterior}</td>
                  <td>{ele.totals.totalCambioVlr}</td>
                  <td>{ele.totals.totalCambioVlrPagado}</td>
                  <td>{ele.totals.totalValorRecaudo}</td>
                  <td>{ele.totals.totalPagoIAT}</td>
                  <td>{ele.totals.totalPagoAjuste}</td>
                  <td>{ele.totals.totalPagoInteres}</td>
                  <td>{ele.totals.totalPagoTotal}</td>
                  <td>{ele.totals.totalSaldoFinal}</td>
                </tr>
              </Fragment>
            ))}
            {totalCal && (
              <tr className="text-center">
                <td colSpan={2}></td>
                <td>
                  <b>Totales</b>
                </td>
                <td>{totalCal.saldoAnterio}</td>
                <td>{totalCal.cambioVlrIAT}</td>
                <td>{totalCal.cambioVlrPagado}</td>
                <td>{totalCal.valorRecaudoFinanciado}</td>
                <td>{totalCal.pagoIAT}</td>
                <td>{totalCal.pagoAjusteIAT}</td>
                <td>{totalCal.pagoInteresMoraCorriente}</td>
                <td>{totalCal.pagoTotal}</td>
                <td>{totalCal.saldoFinalPendFactIAT}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Fragment>
  );
}
