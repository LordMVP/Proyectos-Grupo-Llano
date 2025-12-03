import React, { Fragment } from "react";
import { Pagination } from "react-bootstrap";
export default function PaginationDinamic({
  currentPage,
  setCurrentPage,
  numPages,
}) {
  /**
   * funcion de cambio de pagina
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
