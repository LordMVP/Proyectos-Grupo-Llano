import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Col, Form } from "react-bootstrap";
import { BiSearch } from "react-icons/bi";
import Spinner from "react-loader-spinner";
import { toast } from "react-toastify";
//redux actions
import {
  loadListaNovedad,
  loadImagenesNovedad,
  clearImagenesNovedad,
  aprobarNovedades,
  clearAprobarNovedad,
  deleteNovedades,
  clearDeleteNovedad,
} from "../../../actions/tableGestion";
//custom components
import PaginatorWithApi from "../../../components/utils/Paginators/PaginatorWithApi";
import TableNewness from "../../../components/ManagementTable/TableNewness";
import ModalDataInfo from "../../../components/utils/ModalDataInfo";
import PaginationTable from "../../../components/utils/Paginators/PaginationTable";

interface Props {
  listaNovedad: any;
  imagenesNovedad: any[];
  aprobarNovedad: any;
  borrarNovedad: any;
  loadListaNovedadAction: (pg: number, form: any) => void;
  loadImagenesNovedadAction: (id: string | number) => void;
  clearImagenesNovedadAction: () => void;
  aprobarNovedadesAction: (id: string | number) => void;
  clearAprobarNovedadAction: () => void;
  deleteNovedadesAction: (id: string | number) => void;
  clearDeleteNovedadAction: () => void;
}

function TablaNovedad(props: Props) {
  //props
  const {
    imagenesNovedad,
    listaNovedad,
    aprobarNovedad,
    borrarNovedad,
    loadListaNovedadAction,
    loadImagenesNovedadAction,
    clearImagenesNovedadAction,
    deleteNovedadesAction,
    clearDeleteNovedadAction,
    aprobarNovedadesAction,
    clearAprobarNovedadAction,
  } = props;
  //states
  const [searchText, setSearchText] = useState<string>("");
  const [modal, setModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [modalApprove, setModalApprove] = useState<boolean>(false);
  const [dataDelete, setDataDelete] = useState<any>({});
  const [dataApprove, setDataApprove] = useState<any>({});

  const [isLoading, setisLoading] = useState<boolean>(false);
  //methods
  const handleShowImage = (data: any) => {
    setModal(true);
    loadImagenesNovedadAction(data.dsnovIderegistro);
    setisLoading(true);
    console.log(data);
  };
  const handleChangePage = (page: number) => {
    loadListaNovedadAction(page, {
      search: searchText,
    });
  };
  const handleCloseModal = () => {
    setModal(false);
    setCurrentPage(0);
    clearImagenesNovedadAction();
    setisLoading(false);
  };

  const handleShowModalDelete = (data: any) => {
    setDataDelete(data);
    setModalDelete(true);
  };
  const handleShowModalApprove = (data: any) => {
    setDataApprove(data);
    setModalApprove(true);
  };

  const handleCloseModalApprove = () => {
    setModalApprove(false);
    setDataApprove({});
  };
  const handleCloseModalDelete = () => {
    setModalDelete(false);
    setDataDelete({});
  };

  const approveNovedad = () => {
    if (dataApprove.dsnovIderegistro) {
      aprobarNovedadesAction(`${dataApprove.dsnovIderegistro}`);
    }
  };
  const deleteNovedad = () => {
    if (dataDelete.dsnovIderegistro) {
      deleteNovedadesAction(`${dataDelete.dsnovIderegistro}`);
    }
  };
  //effects
  useEffect(() => {
    loadListaNovedadAction(0, {
      search: searchText,
    });
  }, [loadListaNovedadAction, searchText]);
  useEffect(() => {
    if (imagenesNovedad) {
      setisLoading(false);
    }
  }, [imagenesNovedad]);

  useEffect(() => {
    if (aprobarNovedad) {
      toast.success("Novedad aprobada con exito");
      clearAprobarNovedadAction();
      handleCloseModalApprove();
      loadListaNovedadAction(0, {
        search: searchText,
      });
    }
  }, [aprobarNovedad, clearAprobarNovedadAction, loadListaNovedadAction]);
  useEffect(() => {
    if (borrarNovedad) {
      toast.success("Novedad eliminada con exito");
      clearDeleteNovedadAction();
      handleCloseModalDelete();
      loadListaNovedadAction(0, {
        search: searchText,
      });
    }
  }, [borrarNovedad, clearDeleteNovedadAction, loadListaNovedadAction]);
  return (
    <div className="w-100">
      {/*modal images */}
      <ModalDataInfo
        show={modal}
        onHide={handleCloseModal}
        variant="primary"
        title="Imagen de la novedad"
        size="lg"
      >
        <>
          {isLoading ? (
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <Spinner
                type="Oval"
                color="#007bff"
                height={35}
                width={55}
                strokeWidth={30}
              />
            </div>
          ) : (
            <div className="w-100">
              {imagenesNovedad && imagenesNovedad[currentPage] && (
                <img
                  src={`data:${imagenesNovedad[currentPage]?.tipo};base64,${imagenesNovedad[currentPage]?.imagen}`}
                  className="w-100"
                  alt="Esquema de planta"
                />
              )}
            </div>
          )}

          {imagenesNovedad && (
            <PaginationTable
              numPage={imagenesNovedad.length}
              first={currentPage === 0}
              last={currentPage === imagenesNovedad.length - 1}
              numPageCurrent={currentPage}
              isLoading={isLoading}
              onClick={setCurrentPage}
            />
          )}
        </>
      </ModalDataInfo>
      {/*modal aprove */}
      <ModalDataInfo
        show={modalApprove}
        onHide={handleCloseModalApprove}
        variant="success"
        title="Validación de aprovación"
        onSubmit={approveNovedad}
        textSubmit="Aprobar"
        size="lg"
      >
        <p>
          Seguro que quiere aprobar la novedad creada el{" "}
          {dataApprove?.dsnovFecha}
        </p>
      </ModalDataInfo>
      {/*modal Delete */}
      <ModalDataInfo
        show={modalDelete}
        onHide={handleCloseModalDelete}
        variant="danger"
        title="Validación de eliminación"
        onSubmit={deleteNovedad}
        textSubmit="Eliminar"
        size="lg"
      >
        <p>
          Seguro que quiere aprobar la novedad creada el{" "}
          {dataApprove?.dsnovFecha}
        </p>
      </ModalDataInfo>
      {/*table */}
      <div className="row">
        <Form.Group as={Col} md="8">
          <Form.Control
            type="number"
            placeholder="Buscar"
            onChange={(e: any) => setSearchText(e?.target?.value)}
            value={searchText}
          />
        </Form.Group>

        <Form.Group as={Col} md="4">
          <BiSearch size={30} color="#007bff" />
        </Form.Group>
      </div>
      <TableNewness
        submitShowData={handleShowImage}
        data={listaNovedad}
        submitDeleteData={handleShowModalDelete}
        submitApproveData={handleShowModalApprove}
      />
      {listaNovedad && Object.keys(listaNovedad).length > 0 && (
        <PaginatorWithApi
          nameItems="actualizaciones"
          data={listaNovedad}
          handleChangePage={handleChangePage}
        />
      )}
    </div>
  );
}
const mapStateToProps = ({ tablasGestion }) => ({
  listaNovedad: tablasGestion.listaNovedad,
  imagenesNovedad: tablasGestion.imagenesNovedad,
  aprobarNovedad: tablasGestion.aprobarNovedad,
  borrarNovedad: tablasGestion.borrarNovedad,
});

const mapDispatchToProps = (dispatch) => ({
  loadListaNovedadAction: (pg: number, form: any) =>
    dispatch(loadListaNovedad(pg, form)),
  loadImagenesNovedadAction: (id: string | number) =>
    dispatch(loadImagenesNovedad(id)),
  clearImagenesNovedadAction: () => dispatch(clearImagenesNovedad()),
  aprobarNovedadesAction: (id: string | number) =>
    dispatch(aprobarNovedades(id)),
  clearAprobarNovedadAction: () => dispatch(clearAprobarNovedad()),
  deleteNovedadesAction: (id: string | number) => dispatch(deleteNovedades(id)),
  clearDeleteNovedadAction: () => dispatch(clearDeleteNovedad()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TablaNovedad);
