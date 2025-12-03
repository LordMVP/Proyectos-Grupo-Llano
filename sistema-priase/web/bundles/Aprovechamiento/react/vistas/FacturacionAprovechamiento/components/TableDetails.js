import React, { Fragment } from "react";

import TableCompleteDetails from "./TableCompleteDetails";
/**
 *esta funcion ordena el array para que toda la informacion este en un mismo
 *ademas busca el numero de documento de tercero apra asignarselo
 * @param {object[]} data
 *
 * @returns {object[]}
 */
function reorder(data) {
  let result = [];
  data.forEach((item) => {
    if (item.consolidations.length > 0) {
      item.consolidations.forEach((consolidation) => {
        result.push({
          totalGeneral: consolidation.totalGeneral,
          terIderegistro: item.terIderegistro,
          aprovechador: item.aprovechador,
          ...consolidation,
        });
      });
    } else {
      result.push({
        terIderegistro: item.terIderegistro,
        aprovechador: item.aprovechador,
      });
    }
  });
  return result;
}
/**
 * componente que muestra los aprovechadores a seleccionar y que son resultado de la busqueda
 *
 * @param {object} props - propiedades del componente
 * @param {object[]} props.data - la informacion de los aprovechadores producto de la busqueda
 * @param {object[]} props.dataNamesDocs - lista de los documentos de terceros con los nombres y id de registro
 * @param {requestCallback} props.setCurrentPage - funcion de cambio de numero de pagina
 * @param {number} props.currentPage - numero de pagina actual
 * @returns {component}
 */
export default function TableDetails({ data = [], dataNamesDocs = [] }) {
  let dataInner = reorder(data, dataNamesDocs);

  return (
    <Fragment>
      <div
        className="d-flex flex-column w-100 mb-3 "
        style={{ overflow: "auto" }}
      >
        <TableCompleteDetails data={dataInner} />
      </div>
    </Fragment>
  );
}
