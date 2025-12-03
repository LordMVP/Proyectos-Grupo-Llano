import React, { Fragment, useState } from "react";
import { Button, Table } from "react-bootstrap";
import PaginationComponent from "../../../components/PaginationTableApi";
/**
 * componente interno que muestra dada fila a mostrar en la tabla
 *
 * @param {object} props  - propiedades del documento tiene los datos de la fila
 * @returns
 */
function Row(props) {
  //stado de la fila
  const [stateSevent, setstateSevent] = useState(props.exportSeven);
  const [stateOffice, setstateOffice] = useState(props.paidLetter);
  return (
    <tr className="text-center">
      <td>{props.nit}</td>
      <td>{props.use}</td>
      <td>{props.valuePaid}</td>
      <td>{props.account}</td>
      <td>{props.stateSeven}</td>
      <td>
        <input
          type="checkbox"
          aria-label="Checkbox for following text input"
          defaultChecked={stateSevent}
          onChange={() => setstateSevent(!stateSevent)}
        />
      </td>
      <td>
        <input
          type="checkbox"
          aria-label="Checkbox for following text input"
          defaultChecked={stateOffice}
          onChange={() => setstateOffice(!stateOffice)}
        />
      </td>
      <td>
        <div className="w-100 d-flex flex-column">
          <Button
            className="mt-3"
            onClick={() => props.onClickDetailValue(props.idThirdParty)}
          >
            Detalle
          </Button>
          <Button
            className="mt-3"
            onClick={() => props.onClickSoporte(props.idConsolidation)}
          >
            Detalle soporte
          </Button>
        </div>
      </td>
    </tr>
  );
}
/**
 * componente que se encarga de mostrar la tabla de los aprovechamientos
 *
 * @param {object} props
 * @param {object[]} props.data - objeto con los datos a mostrar en la tabla
 * @param {object} props.raw - objeto con los datos en crudo del servidor
 * @param {requestCallback} props.onClickDetailValue - funcion que muestra el detalle de un aprovechamiento
 * @param {requestCallback} props.onPagerChange - funcion que cambia la pagina de la tabla
 * @param {requestCallback} props.onShowModal - funcion que muestra el modal del pdf
 * @param {requestCallback} props.onClickSoporte - funcion que muestra el detalle de los soportes
 * @param {string} props.titleTable - titulo de la tabla a cambiar
 * @returns
 */
export default function TableAprovechamientoTercero({
  data = [],
  raw,
  onClickDetailValue,
  onPagerChange,
  onShowModal,
  onClickSoporte,
  titleTable,
}) {
  const columns = [
    "Nit",
    titleTable,
    "Valor de Pago",
    "Cuenta Bancaria",
    "Estado Seven",
    "Exportar Seven",
    "Oficio Pago",
    "Acción",
  ];
  let total = 0;

  data.forEach((element) => {
    total += element.valorPago || 0;
  });

  return (
    <Fragment>
      <div
        className="d-flex flex-column w-100 mb-3 "
        style={{ overflow: "auto" }}
      >
        <Table striped bordered hover variant="info">
          <thead className="text-uppercase">
            <tr className="text-center">
              {columns.map((ele, id) => (
                <th key={id} className="text-center">
                  {ele}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((el, id) => (
              <Row
                key={id}
                {...el}
                onClickDetailValue={onClickDetailValue}
                onClickSoporte={onClickSoporte}
              />
            ))}
          </tbody>
          <tbody>
            <tr className="bg-primary text-white text-center border-0">
              <td></td>
              <td>TOTALES</td>

              <td>{total}</td>
              <td colSpan={6}></td>
            </tr>
          </tbody>
        </Table>
      </div>
      <PaginationComponent data={raw} onPagerChange={onPagerChange} />
      <div className="w-100 d-flex justify-content-end">
        <Button className="mr-3 mt-3">Exportar Seven</Button>
        <Button className="mr-3 mt-3" onClick={onShowModal}>
          Oficio Pago
        </Button>
      </div>
    </Fragment>
  );
}
