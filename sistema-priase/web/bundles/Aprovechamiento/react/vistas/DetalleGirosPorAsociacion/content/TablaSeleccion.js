import React, { Fragment, useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { COLUMNS_TABLA_SELECTION } from "../../../global/constantes";
import PaginationDinamic from "./PaginationDinamic";
import { REORDER_PAGES_DATA } from "../../../global/constantes";

/**
 * componente interno que muestra dada fila a mostrar en la tabla
 *
 * @param {object} props - propiedades del documento
 * @param {object} props.data - objeto con los datos en crudo del servidor
 * @param {requestCallback} props.deleteOneSelect - funcion que borra los datos de una selecciones en la tabla de selección
 * @returns {component}
 */
const Row = ({ data, deleteOneSelect }) => {
  return (
    <Fragment>
      <tr className={`bg-primary text-white`}>
        <td>
          <div className="d-flex justify-content-center">
            {data.terDocumento || 0}
          </div>
        </td>
        <td>
          <div className="d-flex justify-content-center">
            {data.terDigverificacion || 0}
          </div>
        </td>
        <td>
          <div className="d-flex justify-content-center">{data.terNombre}</div>
        </td>
        <td>
          <div className="d-flex justify-content-center">
            {data.terDocumento || 0}
          </div>
        </td>
        <td>
          <div className="d-flex justify-content-center">
            <Button
              className="bg-info border-0"
              onClick={() => {
                return deleteOneSelect(data);
              }}
            >
              Deseleccionar
            </Button>
          </div>
        </td>
      </tr>
    </Fragment>
  );
};
/**
 * muestra la tabla de aprovechadores a seleccionar
 *
 * @param {object} props - propiedades del componente

 * @param {requestCallback} props.onAction - funcion de agregar datos a la tabla selección
 * @param {requestCallback} props.deleteAllSelect - funcion de eliminar todos los datos de la tabla selección
 * @param {requestCallback} props.deleteOneSelect - funcion de eliminar un dato de la tabla selección
 * @param {object[]} props.dataNamesDocs - array de la numeros de documento
 * @param {object[]} props.dataSelect - datos actuales de la seleccion
 * @returns {component}
 */
export default function TablaSeleccion({
  deleteAllSelect,
  deleteOneSelect,

  dataSelect = [],
}) {
  dataSelect = REORDER_PAGES_DATA(dataSelect);
  const [currentPage, setCurrentPage] = useState(0);
  return (
    <Fragment>
      <div className="w-100 d-flex justify-content-end mb-3 ">
        <Button
          onClick={() => {
            deleteAllSelect();
          }}
        >
          Deseleccionar Todo
        </Button>
      </div>
      <Table striped bordered hover variant="info">
        <thead className="text-uppercase">
          <tr className="text-center">
            {COLUMNS_TABLA_SELECTION.map((ele, idx) => (
              <th key={idx} className="text-center">
                {ele}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataSelect.length > 0 ? (
            dataSelect.length > 1 ? (
              dataSelect[currentPage].map((ele, id) => (
                <Row key={id} data={ele} deleteOneSelect={deleteOneSelect} />
              ))
            ) : (
              dataSelect[0].map((ele, id) => (
                <Row key={id} data={ele} deleteOneSelect={deleteOneSelect} />
              ))
            )
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                Sin datos por favor seleccione un Tercero
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <div className="w-100 d-flex justify-content-center">
        <PaginationDinamic
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          numPages={dataSelect.length - 1}
        />
      </div>
    </Fragment>
  );
}
