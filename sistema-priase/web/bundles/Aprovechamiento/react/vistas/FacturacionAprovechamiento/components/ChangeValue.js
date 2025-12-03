import React, { Fragment } from "react";
import { Table } from "react-bootstrap";
/**
 * muestra la tabla de cambio de valor con los valores de los aprovechadores
 *
 * @param {object} props - propiedades del componente
 * @param {object} props.data - array con los datos de poner en la tabla
 * @returns {component}
 */
export default function ChangeValue({ data = [] }) {
  /**
   * esta funcion hace una suma interna de los valores de cada aprovechador
   *
   * @param {object[]} array - array de datos de los aprovechadores
   * @returns {object}
   */
  const sumInner = (array) => {
    let totalInner = {
      valorCC: 0,
      valorAjusteCC: 0,
    };
    array.forEach((ele) => {
      totalInner["valorCC"] += ele["valorCC"] || 0;
      totalInner["valorAjusteCC"] += ele["valorAjusteCC"] || 0;
    });
    return totalInner;
  };
  /**
   * esta funcion hace una suma total de los valores de cada aprovechador
   *
   * @param {object[]} array - array de datos de los aprovechadores
   * @returns {object}
   */
  const sumTotal = (array) => {
    let totalGeneral = {
      valorCC: 0,
      valorAjusteCC: 0,
    };
    array.forEach((ele) => {
      ele.consolidations.forEach((el) => {
        totalGeneral["valorCC"] += el["valorCC"] || 0;
        totalGeneral["valorAjusteCC"] += el["valorAjusteCC"] || 0;
      });
    });
    return totalGeneral;
  };
  return (
    <Fragment>
      <Table striped bordered hover variant="info" className="mb-0">
        <thead className="text-center">
          <tr>
            <th>Periodo Liquidación </th>
            <th>Cambios Valor Corriente </th>
            <th>Cambios Valor Pago Corriente</th>
          </tr>
        </thead>
      </Table>
      <div className="w-100" style={{ maxHeight: "686px", overflowY: "auto" }}>
        {data.map((ele, idx) => (
          <Fragment>
            <Table
              striped
              bordered
              hover
              variant="info"
              className="mb-0"
              key={idx}
            >
              <thead className="text-center ">
                <tr className="bg-white">
                  <th colSpan={3} className="text-center">
                    {ele.aprovechador}
                  </th>
                </tr>
              </thead>
            </Table>
            <div
              className="w-100"
              style={{ maxHeight: "147px", overflowY: "auto" }}
            >
              <Table striped bordered hover variant="info" className="mb-0">
                <tbody className="text-center ">
                  {ele.consolidations.map((el, id) => (
                    <tr key={id}>
                      <td style={{ minWidth: "258px" }}>
                        {el.periodoLiquidacionString}
                      </td>
                      <td style={{ minWidth: "307px" }}>{el.valorCC}</td>
                      <td style={{ minWidth: "370px" }}>{el.valorAjusteCC}</td>
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <b>Total</b>
                    </td>
                    <td>{sumInner(ele.consolidations).valorCC}</td>
                    <td>{sumInner(ele.consolidations).valorAjusteCC}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Fragment>
        ))}
      </div>
      <Table
        striped
        bordered
        hover
        variant="info"
        style={{ maxWidth: "calc( 100% - 18px)" }}
      >
        <tbody className="text-center">
          <tr>
            <td style={{ width: "27.5%" }}>
              <b>Totales General</b>
            </td>
            <td style={{ width: "32.1%" }}>{sumTotal(data).valorCC}</td>
            <td>{sumTotal(data).valorAjusteCC}</td>
          </tr>
        </tbody>
      </Table>
    </Fragment>
  );
}
