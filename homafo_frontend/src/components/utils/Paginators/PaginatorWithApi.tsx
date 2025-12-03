import React from "react";
import { Button } from "react-bootstrap";
type Props = {
  data: any;
  handleChangePage: (page: number) => void;
  isLoading?: boolean;
  nameItems?: string;
};

export default function PaginatorWithApi(props: Props) {
  //props
  const {
    data,
    handleChangePage,
    isLoading = false,
    nameItems = "items",
  } = props;
  //methods
  const CustomTotal = ({ page, lastIndex, numElements }) => (
    <span>
      pagina {page + 1} de {lastIndex}, total de {nameItems} : {numElements}
    </span>
  );

  return (
    <div className="px-1 py-3 row">
      <div className="pl-3 col-12- col-md-6 ">
        <CustomTotal
          page={data?.number}
          lastIndex={data?.totalPages}
          numElements={data?.totalElements}
        />
      </div>
      <div className="pr-3 col-12- col-md-6 d-flex justify-content-end">
        <Button
          color={"primary"}
          size="sm"
          onClick={() => handleChangePage(data.number - 1)}
          disabled={isLoading || data.first}
          className="px-4"
        >
          Anterior
        </Button>
        <Button
          color={"primary"}
          size="sm"
          onClick={() => handleChangePage(data.number + 1)}
          disabled={isLoading || data.last}
          className="px-4 ml-2"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
