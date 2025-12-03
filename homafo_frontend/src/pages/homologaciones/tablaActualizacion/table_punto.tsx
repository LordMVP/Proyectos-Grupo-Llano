import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Table } from "react-bootstrap";
import Spinner from "react-loader-spinner";
import { toast } from "react-toastify";

//custom components
import PaginationTable from "../../../components/utils/Paginators/PaginationTable";
//action redux
import {
  loadListaActualizacionPunto,
  deleteActualizacion,
  clearDeleteActualizacion,
  loadImagenesActualizacion,
  clearImagenesActualizacion,
  loadUpdateActualizacion,
  loadAprobarActializacion,
  clearAprobarActializacion,
  clearBuscarActualizacion,
} from "../../../actions/tableGestion";

//general components
import PaginatorWithApi from "../../../components/utils/Paginators/PaginatorWithApi";
//components custom
import TableUpdateInfoEdit from "../../../components/ManagementTable/TableUpdateInfoEdit";
import ModalDataInfo from "../../../components/utils/ModalDataInfo";
//interface
interface Props {
  listaActualizacionPunto: any[];
  borrarActualizacion: any;
  imagenesActualizacion: any;
  aprobarActualizacion: any;
  updateActualizacion: any;
  actualizacion: any;
  loadListaActualizacionPuntoAction: (pg: number) => void;
  deleteActualizacionAction: (id: string | number) => void;
  loadImagenesActualizacion: (id: string | number) => void;
  clearImagenesActualizacion: () => void;
  loadUpdateActualizacion: (form: any) => void;
  loadAprobarActializacion: (id: string | number) => void;
  clearAprobarActializacion: () => void;
  clearDeleteActualizacion: () => void;
  clearBuscarActualizacion: () => void;
}
function TablaActualizacionPunto(props: Props) {
  //props
  const {
    listaActualizacionPunto,
      borrarActualizacion,
      loadListaActualizacionPuntoAction,
      deleteActualizacionAction,
      loadImagenesActualizacion,
      imagenesActualizacion,
      clearImagenesActualizacion,
      updateActualizacion,
      loadUpdateActualizacion,
      aprobarActualizacion,
      loadAprobarActializacion,
      clearAprobarActializacion,
      clearDeleteActualizacion,
      clearBuscarActualizacion,
    } = props;

    //states
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalDelete, setModalDelete] = useState<boolean>(false);
    const [modalApprove, setModalApprove] = useState<boolean>(false);
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
      clearBuscarActualizacion();
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
    const actualizarActualizacion = (formData: any) => {
      if (formData.actsusIderegistro) {
        loadUpdateActualizacion(formData);
      }
    };
    const handleCloseModalDelete = () => {
      setModalDelete(false);
      setDataDelete({});
    };
  
    const handleChangePage = (page: number) => {
      loadListaActualizacionPuntoAction(page);
    };
  
    //effects
    useEffect(() => {
      loadListaActualizacionPuntoAction(0);
    }, [loadListaActualizacionPuntoAction]);

    useEffect(() => {
      if (borrarActualizacion) {
        toast.success("Se eliminó el registro con exito");
        handleCloseModalDelete();
  
        loadListaActualizacionPuntoAction(0);
        clearDeleteActualizacion();
      }
    }, [
      borrarActualizacion,
      clearDeleteActualizacion,
      loadListaActualizacionPuntoAction,
    ]);

    useEffect(() => {
      if (imagenesActualizacion) {
        setIsLoading(false);
      }
    }, [imagenesActualizacion]);
    
    useEffect(() => {
      if (aprobarActualizacion) {
        console.log(aprobarActualizacion);
        toast.success(
          aprobarActualizacion.responseApprove ||
            `Se aprobo la ${
              aprobarActualizacion.actsusTipo
            } con exito`
        ,{
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      });
        handleCloseModalApprove();
        clearAprobarActializacion();
        loadListaActualizacionPuntoAction(0);
      }
    }, [
      aprobarActualizacion,
      clearAprobarActializacion,
      loadListaActualizacionPuntoAction,
    ]);

    useEffect(() => {
      if (updateActualizacion) {
        console.log(updateActualizacion);
        toast.success(
          updateActualizacion.responseApprove ||
            `Se aprobo la ${
              updateActualizacion.actsusTipo
            } con exito`
        ,{
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      });
        loadListaActualizacionPuntoAction(0);
      }
    }, [
      updateActualizacion,
      loadListaActualizacionPuntoAction,
    ]);

  return (
    <div className="w-100">
      <ModalDataInfo
        show={showModal}
        onHide={handleCloseModal}
        variant="primary"
        title={
          selectedRow?.actsusTipo
        }
        size="xl"
      >
        <div className="row">
          <div className="col-6">
            <Table>
              {selectedRow && (
                <tbody>
                  <tr>
                    <td>SERVICIO EMSA</td>
                    <td className="font-weight-bold text-danger">
                      {selectedRow?.actsusAlterna?.find(alterna => alterna.servicio_alterno === "EMSA")?.servicio_alterno ? "SI" : "NO"}
                    </td>
                  </tr>

                  <tr>
                    <td>CODIGO ALTERNO EMSA</td>
                    <td className="font-weight-bold text-danger">
                      {selectedRow?.actsusAlterna?.find(alterna => alterna.servicio_alterno === "EMSA")?.codigo_alterno}
                    </td>
                  </tr>

                  <tr>
                    <td>NÚMERO MEDIDOR ALTERNO EMSA</td>
                    <td className="font-weight-bold text-danger">
                      {selectedRow?.actsusAlterna?.find(alterna => alterna.servicio_alterno === "EMSA")?.medidor_alterno}
                    </td>
                  </tr>

                  <tr>
                    <td>SERVICIO GAS</td>
                    <td className="font-weight-bold text-danger">
                      {selectedRow?.actsusAlterna?.find(alterna => alterna.servicio_alterno === "GAS")?.servicio_alterno ? "SI" : "NO"}
                    </td>
                  </tr>

                  <tr>
                    <td>CODIGO ALTERNO GAS</td>
                    <td className="font-weight-bold text-danger">
                      {selectedRow?.actsusAlterna?.find(alterna => alterna.servicio_alterno === "GAS")?.codigo_alterno}
                    </td>
                  </tr>

                  <tr>
                    <td>NÚMERO MEDIDOR ALTERNO GAS</td>
                    <td className="font-weight-bold text-danger">
                      {selectedRow?.actsusAlterna?.find(alterna => alterna.servicio_alterno === "GAS")?.medidor_alterno}
                    </td>
                  </tr>

                  <tr>
                    <td>Dirección</td>
                    <td className="font-weight-bold text-danger">
                      {selectedRow?.proDireccion}
                    </td>
                  </tr>

                  <tr>
                    <td>Barrio</td>
                    <td className="font-weight-bold text-danger">
                      {selectedRow?.barrio?.valor}
                    </td>
                  </tr>

                  <tr>
                    <td>Estrato</td>
                    <td className="font-weight-bold text-danger">
                      {selectedRow?.estrato?.valor}
                    </td>
                  </tr>

                  <tr>
                    <td>Tipo Uso</td>
                    <td className="font-weight-bold text-danger">
                      {selectedRow?.tipUsosus?.valor}
                    </td>
                  </tr>

                  <tr>
                    <td>Nombre Establecimiento</td>
                    <td className="font-weight-bold text-danger">
                      {selectedRow?.nomEstablecimiento}
                    </td>
                  </tr>

                  <tr>
                    <td>Actividad Comercial</td>
                    <td className="font-weight-bold text-danger">
                      {selectedRow?.actComercial?.valor}
                    </td>
                  </tr>

                  <tr>
                    <td>Liquidación</td>
                    <td className="font-weight-bold text-danger">
                      {selectedRow?.liquidacion?.valor || "N/A"}
                    </td>
                  </tr>

                  <tr>
                    <td>DESHABITADO</td>
                    <td className="font-weight-bold text-danger">
                      {selectedRow?.conceptosLiquidacion?.deshabitado ? "SI" : "NO"}
                    </td>
                  </tr>

                  <tr>
                    <td>AFORADO</td>
                    <td className="font-weight-bold text-danger">
                      {selectedRow?.conceptosLiquidacion?.aforado ? "SI" : "NO"}
                    </td>
                  </tr>
                  
                  <tr>
                    <td>DESCUENTO PAP</td>
                    <td className="font-weight-bold text-danger">
                      {selectedRow?.conceptosLiquidacion?.descuento_pap ? "SI" : "NO"}
                    </td>
                  </tr>

                  {selectedRow?.actsusTipo === "Punto" ? (
                    <tr>
                      <td>Observación</td>
                      <td className="font-weight-bold text-danger">
                        {selectedRow?.observacion}
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}

                </tbody>
              )}
            </Table>
            <p>
              El texto en
              <b className="font-weight-bold text-danger">{` rojo`}</b> muestra
              el valor antiguo junto al nuevo, mientra que el
              <b className="font-weight-bold  text-success">{` verde`}</b> que
              no existen cambios entre la version actual a la de la modificación
            </p>
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
          Seguro que quiere eliminar la {dataDelete?.actsusTipo} de la dirección{" "}
          {dataDelete?.proDireccion}
        </p>
      </ModalDataInfo>
      <ModalDataInfo
        show={modalApprove}
        onHide={handleCloseModalApprove}
        variant="success"
        title="Validación de aprobación"
        onSubmit={approveActualizacion}
        textSubmit="Aprobar"
        size="lg"
      >
        <p>
          Seguro que quiere aprobar la {dataApprove?.actsusTipo} de la dirección{" "}
          {dataApprove?.proDireccion}
        </p>
      </ModalDataInfo>

      <div className="row">
        <TableUpdateInfoEdit
          data={listaActualizacionPunto}
          submitShowData={handleShowModal}
          submitDeleteData={handleShowModalDelete}
          submitApproveData={handleShowModalApprove}
          submitUpdateData={actualizarActualizacion}
        />
      </div>

      {listaActualizacionPunto && Object.keys(listaActualizacionPunto).length > 0 && (
        <PaginatorWithApi
          nameItems="actualizaciones"
          data={listaActualizacionPunto}
          handleChangePage={handleChangePage}
        />
      )}
    </div>
  );
}
const mapStateToProps = ({ tablasGestion }) => ({
  listaActualizacionPunto: tablasGestion.listaActualizacionPunto,
  borrarActualizacion: tablasGestion.borrarActualizacion,
  imagenesActualizacion: tablasGestion.imagenesActualizacion,
  aprobarActualizacion: tablasGestion.aprobarActualizacion,
  updateActualizacion: tablasGestion.updateActualizacion,
  actualizacion: tablasGestion.actualizacion,
});

const mapDispatchToProps = (dispatch) => ({
  clearBuscarActualizacion: () => dispatch(clearBuscarActualizacion()),
  loadListaActualizacionPuntoAction: (pg: number) =>
    dispatch(loadListaActualizacionPunto(pg)),
  deleteActualizacionAction: (id: string | number) =>
    dispatch(deleteActualizacion(id)),
  loadImagenesActualizacion: (id: string | number) =>
    dispatch(loadImagenesActualizacion(id)),
  clearImagenesActualizacion: () => dispatch(clearImagenesActualizacion()),
  loadAprobarActializacion: (id: string | number) =>
    dispatch(loadAprobarActializacion(id)),
  loadUpdateActualizacion: (form: any) => dispatch(loadUpdateActualizacion(form)),
  clearAprobarActializacion: () => dispatch(clearAprobarActializacion()),
  clearDeleteActualizacion: () => dispatch(clearDeleteActualizacion()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TablaActualizacionPunto);