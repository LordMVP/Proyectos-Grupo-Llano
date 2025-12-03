import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { connect } from "react-redux";
import { clearBuscarHomologaciones } from "../../../../../actions/suscripcionHomologacion";
//custom components
import ModalDataInfo from "../../../../utils/ModalDataInfo";
import PaginationTable from "../../../../utils/Paginators/PaginationTable";
//methods
import { reOrderTablePages } from "../../methods";
type Props = {
  show: boolean;
  onHide: () => void;
  listData: any[];
  onSelect: (data: any) => void;
  clearBuscarHomologaciones: () => void;
};

function ModalResultFilter(props: Props) {
  //props
  const { show, onHide, listData, onSelect, clearBuscarHomologaciones } = props;
  //states
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  //methods
  const customonClose = () => {
    clearBuscarHomologaciones();
    onHide();
  };
  //effects
  useEffect(() => {
    if (listData && Array.isArray(listData) && listData.length > 0) {
      const newData = reOrderTablePages(listData, 5);
      setCurrentPage(0);
      setDataTable(newData);
    }
  }, [listData]);

  return (
    <ModalDataInfo
      show={show}
      onHide={customonClose}
      variant="success"
      size="lg"
      title="Resultado de la busqueda para homologar"
    >
      <>
        <Table striped bordered>
          <thead className="bg-primary text-white text-center">
            <tr>
              <th>Tipo de uso</th>
              <th>Codigo</th>
              <th>Medidor </th>
              <th>Convenio nombre </th>
              <th>Seleccionar</th>
            </tr>
          </thead>
          <tbody>
            {dataTable[currentPage] &&
              Array.isArray(dataTable[currentPage]) &&
              dataTable[currentPage].map((it, idx) => (
                <tr className="text-center" key={`ssss-${idx}`}>
                  <td>{it?.uniNombre1}</td>
                  <td>{it?.dsusPcodigo}</td>
                  <td>{it?.proIdepropieda}</td>
                  <td>{it?.cnreNombre}</td>
                  <td>
                    <Button onClick={() => onSelect(it)}>Seleccionar</Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        <PaginationTable
          numPage={dataTable.length}
          first={currentPage === 0}
          last={currentPage === dataTable.length - 1}
          numPageCurrent={currentPage}
          onClick={setCurrentPage}
        />
      </>
    </ModalDataInfo>
  );
}

const mapDispatchToProps = (dispatch) => ({
  clearBuscarHomologaciones: () => dispatch(clearBuscarHomologaciones()),
});
export default connect(null, mapDispatchToProps)(ModalResultFilter);
