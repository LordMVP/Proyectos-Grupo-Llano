import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Form, Col, Table } from "react-bootstrap";
import { BiSearch } from "react-icons/bi";
import Spinner from "react-loader-spinner";
import { toast } from "react-toastify";
//custom components
import PaginationTable from "../../../components/utils/Paginators/PaginationTable";
//action redux
import {
  loadListaActualizacionOthers,
  deleteActualizacion,
  clearDeleteActualizacion,
  loadImagenesActualizacion,
  clearImagenesActualizacion,
  loadAprobarActializacion,
  clearAprobarActializacion,
} from "../../../actions/tableGestion";

//general components
import PaginatorWithApi from "../../../components/utils/Paginators/PaginatorWithApi";
//components custom
import TableUpdateInfo from "../../../components/ManagementTable/TableUpdateInfo";
import ModalDataInfo from "../../../components/utils/ModalDataInfo";
//interface
interface Props {
  listaActualizacionOthers: any[];
  borrarActualizacion: any;
  imagenesActualizacion: any;
  aprobarActualizacion: any;
  loadListaActualizacionOthersAction: (pg: number, form: any) => void;
  deleteActualizacionAction: (id: string | number) => void;
  loadImagenesActualizacion: (id: string | number) => void;
  clearImagenesActualizacion: () => void;
  loadAprobarActializacion: (id: string | number) => void;
  clearAprobarActializacion: () => void;
  clearDeleteActualizacion: () => void;
}
function TablaIndependencia(props: Props) {
  //props
  const {
    listaActualizacionOthers,
    borrarActualizacion,
    loadListaActualizacionOthersAction,
    deleteActualizacionAction,
    loadImagenesActualizacion,
    imagenesActualizacion,
    clearImagenesActualizacion,
    aprobarActualizacion,
    loadAprobarActializacion,
    clearAprobarActializacion,
    clearDeleteActualizacion,
  } = props;
  //states
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [modalApprove, setModalApprove] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [dataDelete, setDataDelete] = useState<any>({});
  const [dataApprove, setDataApprove] = useState<any>({});
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  //methods
  const handleShowModal = (data: any) => {
    setShowModal(true);

    loadImagenesActualizacion(data.actsusIderegistro);
    setIsLoading(true);
    setSelectedRow(data);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    clearImagenesActualizacion();
    setSelectedRow(null);
  };
  const handleCloseModalApprove = () => {
    setModalApprove(false);
    setDataApprove({});
  };
  const handleShowModalDelete = (data: any) => {
    setDataDelete(data);
    setModalDelete(true);
  };
  const handleShowModalApprove = (data: any) => {
    setDataApprove(data);
    setModalApprove(true);
  };
  const deleteActualizacion = () => {
    if (dataDelete.actsusIderegistro) {
      deleteActualizacionAction(dataDelete.actsusIderegistro);
    }
  };
  const approveActualizacion = () => {
    if (dataApprove.actsusIderegistro) {
      loadAprobarActializacion(dataApprove.actsusIderegistro);
    }
  };
  const handleCloseModalDelete = () => {
    setModalDelete(false);
    setDataDelete({});
  };

  const handleChangePage = (page: number) => {
    loadListaActualizacionOthersAction(page, {
      search: searchText,
    });
  };
  //effects
  useEffect(() => {
    loadListaActualizacionOthersAction(0, {
      search: searchText,
    });
  }, [loadListaActualizacionOthersAction]);
  useEffect(() => {
    if (borrarActualizacion) {
      toast.success("Se nego la independencia con exito");
      handleCloseModalDelete();

      loadListaActualizacionOthersAction(0, {
        search: searchText,
      });
      clearDeleteActualizacion();
    }
  }, [
    borrarActualizacion,
    clearDeleteActualizacion,
    loadListaActualizacionOthersAction,
  ]);
  useEffect(() => {
    if (imagenesActualizacion) {
      setIsLoading(false);
    }
  }, [imagenesActualizacion]);
  useEffect(() => {
    if (aprobarActualizacion) {
      toast.success("Se aprobo la independencia con exito");
      handleCloseModalApprove();
      clearAprobarActializacion();
      loadListaActualizacionOthersAction(0, {
        search: searchText,
      });
    }
  }, [
    aprobarActualizacion,
    clearAprobarActializacion,
    loadListaActualizacionOthersAction,
  ]);

  return (
    <div className="w-100">
      <ModalDataInfo
        show={showModal}
        onHide={handleCloseModal}
        variant="primary"
        title="Información de la Independencia"
        size="xl"
      >
        <div className="row">
          <div className="col-6">
            <Table>
              {selectedRow && (
                <tbody>
                  <tr>
                    <td>Empresa Alterna</td>
                    <td>{selectedRow?.actsusAlterna[0]?.empNombre}</td>
                  </tr>
                  <tr>
                    <td>Codigo Emp Alterna</td>
                    <td>{selectedRow?.actsusAlterna[0]?.dsusPcodigo}</td>
                  </tr>
                  <tr>
                    <td>Direccion</td>
                    <td>{selectedRow?.proDireccion}</td>
                  </tr>
                  <tr>
                    <td>Barrio</td>
                    <td>{selectedRow?.barrio?.valor}</td>
                  </tr>
                  <tr>
                    <td>Complemento</td>
                    <td>{selectedRow?.complemento?.valor}</td>
                  </tr>
                  <tr>
                    <td>Tipo Uso</td>
                    <td>{selectedRow?.tipUsosus?.valor}</td>
                  </tr>
                  <tr>
                    <td>Condiciones Predio</td>
                    <td>
                      {selectedRow?.condsPredio?.reduce(
                        (pre, act) => pre + ` ${act.valor} -`,
                        ""
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Nombre Establecimiento</td>
                    <td>{selectedRow?.nomEstablecimiento}</td>
                  </tr>
                  <tr>
                    <td>Actividad Comercial</td>
                    <td>{selectedRow?.actComercial?.valor}</td>
                  </tr>
                </tbody>
              )}
            </Table>
          </div>
          <div className="col-6">
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
              <>
                {imagenesActualizacion &&
                  imagenesActualizacion[currentImage] && (
                    <img
                      src={`data:${imagenesActualizacion[currentImage]?.tipo};base64,${imagenesActualizacion[currentImage]?.imagen}`}
                      className="w-100"
                      alt="Esquema de planta"
                    />
                  )}
              </>
            )}
          </div>
          <div className="col-12 mt-2 d-flex justify-content-end">
            <div className="col-6">
              {imagenesActualizacion && (
                <PaginationTable
                  numPage={imagenesActualizacion.length}
                  first={currentImage === 0}
                  last={currentImage === imagenesActualizacion.length - 1}
                  numPageCurrent={currentImage}
                  isLoading={isLoading}
                  onClick={setCurrentImage}
                />
              )}
            </div>
          </div>
        </div>
      </ModalDataInfo>
      <ModalDataInfo
        show={modalDelete}
        onHide={handleCloseModalDelete}
        variant="danger"
        title="Validación de eliminación"
        onSubmit={deleteActualizacion}
        textSubmit="Eliminar"
        size="lg"
      >
        <p>
          Seguro que quiere eliminar la independencia de la dirección{" "}
          {dataDelete?.proDireccion}
        </p>
      </ModalDataInfo>
      <ModalDataInfo
        show={modalApprove}
        onHide={handleCloseModalApprove}
        variant="success"
        title="Validación de aprovación"
        onSubmit={approveActualizacion}
        textSubmit="Aprobar"
        size="lg"
      >
        <p>
          Seguro que quiere aprobar la independencia de la dirección{" "}
          {dataApprove?.proDireccion}
        </p>
      </ModalDataInfo>

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
      <div className="row">
        <TableUpdateInfo
          data={listaActualizacionOthers}
          submitShowData={handleShowModal}
          submitDeleteData={handleShowModalDelete}
          submitApproveData={handleShowModalApprove}
        />
      </div>
      {listaActualizacionOthers && Object.keys(listaActualizacionOthers).length > 0 && (
        <PaginatorWithApi
          nameItems="independencias"
          data={listaActualizacionOthers}
          handleChangePage={handleChangePage}
        />
      )}
    </div>
  );
}
const mapStateToProps = ({ tablasGestion }) => ({
  listaActualizacionOthers: tablasGestion.listaActualizacionOthers,
  borrarActualizacion: tablasGestion.borrarActualizacion,
  imagenesActualizacion: tablasGestion.imagenesActualizacion,
  aprobarActualizacion: tablasGestion.aprobarActualizacion,
});

const mapDispatchToProps = (dispatch) => ({
  loadListaActualizacionOthersAction: (pg: number, form: any) =>
    dispatch(loadListaActualizacionOthers(pg, form)),
  deleteActualizacionAction: (id: string | number) =>
    dispatch(deleteActualizacion(id)),
  loadImagenesActualizacion: (id: string | number) =>
    dispatch(loadImagenesActualizacion(id)),
  clearImagenesActualizacion: () => dispatch(clearImagenesActualizacion()),
  loadAprobarActializacion: (id: string | number) =>
    dispatch(loadAprobarActializacion(id)),
  clearAprobarActializacion: () => dispatch(clearAprobarActializacion()),
  clearDeleteActualizacion: () => dispatch(clearDeleteActualizacion()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TablaIndependencia);
