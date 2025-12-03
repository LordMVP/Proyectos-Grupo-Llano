import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
//common
import ModalDataInfo from "../../../../utils/ModalDataInfo";
import PaginationTable from "../../../../utils/Paginators/PaginationTable";
//import methods

import { reOrderTablePages } from "../../methods";
type Props = {
  show: boolean;
  onHide: () => void;
  list?: any[];
  onSelect: (data: any) => void;
};
export const ModalListSuscriptions = (props: Props) => {
  //props
  const { show, onHide, list, onSelect } = props;
  //states
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  //methods
  const handleSelect = (data: any) => {
    onSelect(data);
    onHide();
  };
  //effects

  useEffect(() => {
    if (list && Array.isArray(list)) {
      const newArray = reOrderTablePages(list, 5);
      setCurrentPage(0);
      setDataTable(newArray);
    }
  }, [list]);

  return (
    <ModalDataInfo
      show={show}
      onHide={onHide}
      size="xl"
      variant="success"
      title="Suscripciones"
    >
      <>
        <div className="w-100">
          <Table striped bordered>
            <thead className="bg-success text-white text-center">
              <tr>
                <th>Id</th>
                <th>Dirección</th>
                <th>Código Cliente</th>
                <th>Nombre del Usuario</th>
                <th>Medidor</th>

                <th>Seleccionar</th>
              </tr>
            </thead>
            <tbody>
              {dataTable[currentPage] &&
                Array.isArray(dataTable[currentPage]) &&
                dataTable[currentPage].map((it) => (
                  <tr
                    key={`suscripcio-${it.dsusIderegistr}`}
                    className="text-center"
                  >
                    <td>{it.dsusIderegistr}</td>
                    <td>{it?.proDireccion}</td>
                    <td>{it?.dsusPcodigo}</td>
                    <td>{it?.terNomCompleto}</td>
                    <td>{it?.proIdepropieda}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleSelect(it)}
                      >
                        Seleccionar
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>

          <PaginationTable
            numPage={dataTable.length}
            first={currentPage === 0}
            last={currentPage === dataTable.length - 1}
            onClick={setCurrentPage}
            numPageCurrent={currentPage}
          />
        </div>
      </>
    </ModalDataInfo>
  );
};

export default ModalListSuscriptions;
