import React, { Fragment } from "react";
import { Button, Table } from "react-bootstrap";
import { FaCloudDownloadAlt } from "react-icons/fa";
/**
 *
 * @param {object} props - propiedades del componente
 * @param {object[]} props.data - informacion de la consulta de porte pago
 * @returns {component}
 */
export default function SoportePagos({ data = [] }) {
  const columns = [
    "Fecha",
    "Id oficio",
    "Oficio PAgo",
    "Acta",
    "Fecha Giro",
    "Observaciones",
    "Acción",
  ];
  //const column2 = ["Id oficio", "Oficio PAgo", "Acción"];
  return (
    <Fragment>
      <div
        className="d-flex flex-column w-100 mb-3 "
        style={{ overflow: "auto" }}
      >
        <Table striped bordered hover variant="info">
          <thead>
            <tr className="text-center">
              {columns.map((ele, id) => (
                <th key={id}>{ele}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((ele, id) => (
              <tr key={id} className="text-center">
                <td>{ele.supportDate}</td>
                <td>{ele.letterId}</td>
                <td>
                  <FaCloudDownloadAlt className="mr-3 w-6 text-primary" />
                  {ele.letterPaid}
                </td>
                <td>
                  <FaCloudDownloadAlt className="mr-3 w-6 text-primary" />
                  {ele.minutes}
                </td>
                <td>{ele.turnDate}</td>
                <td>{ele.observation}</td>
                <td>
                  <Button className="mb-3">Editar </Button>
                  <Button className="mb-3">Ajustar Oficio Firmado </Button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr className="text-center">
                <td colSpan={7}>
                  <div className="w-100 d-flex justify-content-center">
                    <h2>No hay datos</h2>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Fragment>
  );
}
