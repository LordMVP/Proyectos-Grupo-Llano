import React from "react";
import { Button } from "react-bootstrap";
type Props = {
  numPage: number;
  first: boolean;
  last: boolean;
  isLoading?: boolean;
  numPageCurrent: number;
  onClick: (numPage: number) => void;
};

export default function PaginationTable(props: Props) {
  const {
    numPage,
    first,
    last,
    numPageCurrent,
    isLoading = false,
    onClick,
  } = props;
  const backPage = () => onClick(numPageCurrent - 1);
  const nextPage = () => onClick(numPageCurrent + 1);
  return (
    <div className="w-100 d-flex justify-content-between ">
      <div>
        Numero de paginas - {numPage} pagina actual - {numPageCurrent + 1}
      </div>
      <div>
        <Button
          variant="primary"
          className="mr-2"
          onClick={backPage}
          disabled={isLoading || first}
        >
          Anterior
        </Button>
        <Button
          variant="primary"
          onClick={nextPage}
          disabled={isLoading || last}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
