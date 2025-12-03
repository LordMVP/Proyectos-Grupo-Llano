import React from "react";
import { Pagination } from "react-bootstrap";
/**
 *muestra la paginación a usar para navegar entre los datos
 *
 * @param {object} props -propiedades del componente
 * @param {requestCallback} props.onPagerChange - funcion encargada del cambio de pagina con peticion al serrvidor
 * @param {object} props.data - datos de la paginacion traida desde el servidro
 * @returns {component}
 */
export default function PaginationComponent({ onPagerChange, data }) {
  return (
    <React.Fragment>
      <div className="w-100 d-flex justify-content-center">
        <Pagination>
          <Pagination.First
            disabled={data.first}
            onClick={() => onPagerChange(0)}
          />
          <Pagination.Prev
            disabled={data.first}
            onClick={() => onPagerChange(data.number - 1)}
          />

          {!data.first && <Pagination.Ellipsis />}
          {!data.first && (
            <Pagination.Item onClick={() => onPagerChange(data.number - 1)}>
              {data.number}
            </Pagination.Item>
          )}
          <Pagination.Item active>{data.number + 1}</Pagination.Item>
          {!data.last && (
            <Pagination.Item onClick={() => onPagerChange(data.number + 1)}>
              {data.number + 2}
            </Pagination.Item>
          )}
          {!data.last && <Pagination.Ellipsis />}

          <Pagination.Next
            disabled={data.last}
            onClick={() => onPagerChange(data.number + 1)}
          />
          <Pagination.Last
            disabled={data.last}
            onClick={() => onPagerChange(data.totalPages - 1)}
          />
        </Pagination>
      </div>
    </React.Fragment>
  );
}
