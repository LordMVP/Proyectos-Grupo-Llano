import React, { Fragment } from "react";
import { Pagination } from "react-bootstrap";
/**
 * componente que carga el cambio de pagina
 *
 * @param {object} props - propiedades del componente
 * @param {number} props.currentPage - informacion de la paginacion actual
 * @param {requestCallback} props.setCurrentPage- funcion que indica el cambio de pagina
 * @param {object} props.numPages - numero de paginas
 * @returns
 */
export default function PaginationDinamic({
  currentPage,
  setCurrentPage,
  numPages,
}) {
  /**
   * funcion de cambio de pagina a nivel de front
   *
   * @param {number} num - numero de la pagina a cambiar
   * @returns {requestCallback}
   */
  const onPagerChange = (num) => setCurrentPage(num);

  return (
    <Fragment>
      <Pagination>
        <Pagination.First
          disabled={!(currentPage > 0)}
          onClick={() => onPagerChange(0)}
        />
        <Pagination.Prev
          disabled={!(currentPage > 0)}
          onClick={() => onPagerChange(currentPage - 1)}
        />

        {currentPage > 0 && (
          <Pagination.Item onClick={() => onPagerChange(currentPage - 1)}>
            {currentPage}
          </Pagination.Item>
        )}
        <Pagination.Item active>{currentPage + 1}</Pagination.Item>
        {currentPage < numPages && (
          <Pagination.Item onClick={() => onPagerChange(currentPage + 1)}>
            {currentPage + 2}
          </Pagination.Item>
        )}

        <Pagination.Next
          disabled={!(currentPage < numPages)}
          onClick={() => onPagerChange(currentPage + 1)}
        />
        <Pagination.Last
          disabled={!(currentPage < numPages)}
          onClick={() => onPagerChange(numPages)}
        />
      </Pagination>
    </Fragment>
  );
}
