import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";

export default function TablaResumen(props) {
  //props
  const { data, onAction } = props;
  if (!data) data = { content: [] };
  //const
  const columns = [
    "Aprovechador",
    "Cantidad FCR",
    "Valor a Castigar CC",
    "Valor a Castigar TA",
    "Valor a Castigar Ajuste TA",
    "Valor a Castigar Ajuste CC",
    "Valor Castigo Aprovechamiento",
    "Acción",
  ];
  //states
  const [total, setTotal] = useState(null);
  //effects
  useEffect(() => {
    //setea el orden de la tabla
    if (data) {
      setTotal({
        penalizedValueTA: data.content.reduce(
          (a, b) => a + b.penalizedValueTA,
          0
        ),
        penalizedValueCC: data.content.reduce(
          (a, b) => a + b.penalizedValueCC,
          0
        ),
        penalizedValueAdjustTA: data.content.reduce(
          (a, b) => a + b.penalizedValueAdjustTA,
          0
        ),
        penalizedValueAdjustCC: data.content.reduce(
          (a, b) => a + b.penalizedValueAdjustCC,
          0
        ),
        penalizedValueUse: data.content.reduce(
          (a, b) => a + b.penalizedValueUse,
          0
        ),
      });
    }
  }, [data]);
  return (
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
              <td className="align-middle">{el.use}</td>
              <td className="align-middle">{el.quantityFcr}</td>
              <td className="align-middle">{el.penalizedValueCC}</td>
              <td className="align-middle">{el.penalizedValueTA}</td>
              <td className="align-middle">{el.penalizedValueAdjustTA}</td>
              <td className="align-middle">{el.penalizedValueAdjustCC}</td>
              <td className="align-middle">{el.penalizedValueUse}</td>
              <td className="align-middle">
                <Button onClick={() => onAction(el.detail)}>Detalle</Button>
              </td>
            </tr>
          ))}
          {total && (
            <tr className="text-center">
              <td className="align-middle">
                <b>Totales</b>
              </td>
              <td className="align-middle"></td>
              <td className="align-middle">{total.penalizedValueCC}</td>
              <td className="align-middle">{total.penalizedValueTA}</td>
              <td className="align-middle">{total.penalizedValueAdjustTA}</td>
              <td className="align-middle">{total.penalizedValueAdjustCC}</td>
              <td className="align-middle">{total.penalizedValueUse}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
