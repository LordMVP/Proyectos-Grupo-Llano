import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Col, Form, Table } from "react-bootstrap";
import { BiSearch } from "react-icons/bi";
import Spinner from "react-loader-spinner";
import { toast } from "react-toastify";
import { AiOutlineArrowRight } from "react-icons/ai";
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
  loadBuscarActualizacion,
  clearBuscarActualizacion,
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
  actualizacion: any;
  loadListaActualizacionOthersAction: (pg: number, form: any) => void;
  deleteActualizacionAction: (id: string | number) => void;
  loadImagenesActualizacion: (id: string | number) => void;
  clearImagenesActualizacion: () => void;
  loadAprobarActializacion: (id: string | number) => void;
  clearAprobarActializacion: () => void;
  clearDeleteActualizacion: () => void;
  loadBuscarActualizacion: (id: string | number) => void;
  clearBuscarActualizacion: () => void;
}
function TablaActualizacionOther(props: Props) {
  //props
  const {
    listaActualizacionOthers,
    borrarActualizacion,
    actualizacion,
    loadListaActualizacionOthersAction,
    deleteActualizacionAction,
    loadImagenesActualizacion,
    imagenesActualizacion,
    clearImagenesActualizacion,
    aprobarActualizacion,
    loadAprobarActializacion,
    clearAprobarActializacion,
    clearDeleteActualizacion,
    loadBuscarActualizacion,
    clearBuscarActualizacion,
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
    loadBuscarActualizacion(data.dsusPcodigoAseo);
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
  }, [loadListaActualizacionOthersAction, searchText]);

  useEffect(() => {
    if (borrarActualizacion) {
      toast.success("Se nego la actualización con exito");
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
      loadListaActualizacionOthersAction(0, {
        search: searchText,
      });
    }
  }, [
    aprobarActualizacion,
    clearAprobarActializacion,
    loadListaActualizacionOthersAction,
  ]);

  // Componente reutilizable para comparar conceptos
  const CompararConceptos = ({ titulo, conceptoActual, conceptoSeleccionado }) => {
    const esDiferente = (conceptoActual ?? null) !== (conceptoSeleccionado ?? null);
    const clase = `font-weight-bold ${esDiferente ? "text-danger" : "text-success"}`;

    return (
      <tr>
        <td>{titulo}</td>
        <td className={clase}>
          {esDiferente && (
            <>
              {conceptoActual ? "SI" : "NO"} <AiOutlineArrowRight width="20" />{" "}
            </>
          )}
          {conceptoSeleccionado ? "SI" : "NO"}
        </td>
      </tr>
    );
  };

  // Componente reutilizable para servicios
  const CompararServicios = ({ titulo, actualizacion, seleccionado }) => {
    switch (actualizacion) {
      case 299:
        actualizacion = "EMSA";
        break;
      case 322:
        actualizacion = "GAS";
        break;
    }
    const esDiferente = (actualizacion ?? null) !== (seleccionado ?? null);
    const clase = `font-weight-bold ${esDiferente ? "text-danger" : "text-success"}`;

    return (
      <tr>
        <td>{titulo}</td>
        <td className={clase}>
          {esDiferente && (
            <>
              {actualizacion ? "SI" : "NO"} <AiOutlineArrowRight width="20" />{" "}
            </>
          )}
          {seleccionado ? "SI" : "NO"}
        </td>
      </tr>
    );
  };

  // Componente reutilizable para servicios
  const CompararNumerosServicios = ({ titulo, actualizacion, seleccionado }) => {
    const esDiferente = (actualizacion ?? null) !== (seleccionado ?? null);
    const clase = `font-weight-bold ${esDiferente ? "text-danger" : "text-success"}`;
    return (
      <tr>
        <td>{titulo}</td>
        <td className={clase}>
          {esDiferente && (
            <>
              {actualizacion===undefined ? "N/A" : actualizacion} <AiOutlineArrowRight width="20" />{" "}
            </>
          )}
          {seleccionado}
        </td>
      </tr>
    );
  };

  return (
    <div className="w-100">
      <ModalDataInfo
        show={showModal}
        onHide={handleCloseModal}
        variant="primary"
        title={
          selectedRow?.actsusTipo === "Independencia"
            ? " Información de la independencia"
            : "Información de la actualización"
        }
        size="xl"
      >
        <div className="row">
          <div className="col-6">
            <Table>
              {selectedRow && (
                <tbody>
                  <CompararServicios
                    titulo="SERVICIO EMSA"
                    actualizacion={actualizacion?.dsusAlterna?.find(
                      alterna => alterna.idempresa === 299 
                    )?.idempresa}
                    seleccionado={selectedRow?.actsusAlterna?.find(alterna => alterna.servicio_alterno === "EMSA")?.servicio_alterno}
                  />

                  <CompararNumerosServicios
                    titulo="CODIGO ALTERNO EMSA"
                    actualizacion={actualizacion?.dsusAlterna?.find(
                      alterna => alterna.idempresa === 299 
                    )?.pcodigo}
                    seleccionado={selectedRow?.actsusAlterna?.find(alterna => alterna.servicio_alterno === "EMSA")?.codigo_alterno}
                  />

                  <CompararNumerosServicios
                    titulo="NÚMERO MEDIDOR ALTERNO EMSA"
                    actualizacion={actualizacion?.dsusAlterna?.find(
                      alterna => alterna.idempresa === 299 
                    )?.medidor}
                    seleccionado={selectedRow?.actsusAlterna?.find(alterna => alterna.servicio_alterno === "EMSA")?.medidor_alterno}
                  />

                  <CompararServicios
                    titulo="SERVICIO GAS"
                    actualizacion={actualizacion?.dsusAlterna?.find(
                      alterna => alterna.idempresa === 322 
                    )?.idempresa}
                    seleccionado={selectedRow?.actsusAlterna?.find(alterna => alterna.servicio_alterno === "GAS")?.servicio_alterno}
                  />
                  <CompararNumerosServicios
                    titulo="CODIGO ALTERNO GAS"
                    actualizacion={actualizacion?.dsusAlterna?.find(
                      alterna => alterna.idempresa === 322 
                    )?.pcodigo}
                    seleccionado={selectedRow?.actsusAlterna?.find(alterna => alterna.servicio_alterno === "GAS")?.codigo_alterno}
                  />

                  <CompararNumerosServicios
                    titulo="NÚMERO MEDIDOR ALTERNO GAS"
                    actualizacion={actualizacion?.dsusAlterna?.find(
                      alterna => alterna.idempresa === 322 
                    )?.medidor}
                    seleccionado={selectedRow?.actsusAlterna?.find(alterna => alterna.servicio_alterno === "GAS")?.medidor_alterno}
                  />

                  <tr>
                    <td>Dirección</td>
                    <td
                      className={
                        actualizacion &&
                        actualizacion?.proDireccion !==
                          selectedRow?.proDireccion
                          ? "font-weight-bold text-danger"
                          : "font-weight-bold text-success"
                      }
                    >
                      {actualizacion &&
                      actualizacion?.proDireccion !==
                        selectedRow?.proDireccion ? (
                        <>
                          {actualizacion?.proDireccion || "N/A"}
                          <AiOutlineArrowRight width="20" />
                        </>
                      ) : null}
                      {selectedRow?.proDireccion}
                    </td>
                  </tr>
                  <tr>
                    <td>Barrio</td>
                    <td
                      className={
                        actualizacion &&
                        actualizacion?.barrio?.valor !==
                          selectedRow?.barrio?.valor
                          ? "font-weight-bold text-danger"
                          : "font-weight-bold text-success"
                      }
                    >
                      {actualizacion &&
                      actualizacion?.barrio?.valor !==
                        selectedRow?.barrio?.valor ? (
                        <>
                          {actualizacion?.barrio?.valor || "N/A"}
                          <AiOutlineArrowRight width="20" />
                        </>
                      ) : null}
                      {selectedRow?.barrio?.valor}
                    </td>
                  </tr>
                  
                  <tr>
                    <td>Estrato</td>
                    <td
                      className={
                        actualizacion &&
                        actualizacion?.estrato?.valor !==
                          selectedRow?.estrato?.valor
                          ? "font-weight-bold text-danger"
                          : "font-weight-bold text-success"
                      }
                    >
                      {actualizacion &&
                      actualizacion?.estrato?.valor !==
                        selectedRow?.estrato?.valor ? (
                        <>
                          {actualizacion?.estrato?.valor || "N/A"}
                          <AiOutlineArrowRight width="20" />
                        </>
                      ) : null}
                      {selectedRow?.estrato?.valor}
                    </td>
                  </tr>

                  <tr>
                    <td>Tipo Uso</td>
                    <td
                      className={
                        actualizacion &&
                        actualizacion?.tipoUso?.valor !==
                          selectedRow?.tipUsosus?.valor
                          ? "font-weight-bold text-danger"
                          : "font-weight-bold text-success"
                      }
                    >
                      {actualizacion &&
                      actualizacion?.tipoUso?.valor !==
                        selectedRow?.tipUsosus?.valor ? (
                        <>
                          {actualizacion?.tipoUso?.valor || "N/A"}
                          <AiOutlineArrowRight width="20" />
                        </>
                      ) : null}
                      {selectedRow?.tipUsosus?.valor}
                    </td>
                  </tr>
                  <tr>
                    <td>Nombre Establecimiento</td>
                    <td
                      className={
                        actualizacion &&
                        actualizacion?.nomEstablecimiento !==
                          selectedRow?.nomEstablecimiento
                          ? "font-weight-bold text-danger"
                          : "font-weight-bold text-success"
                      }
                    >
                      {" "}
                      {actualizacion &&
                      actualizacion?.nomEstablecimiento !==
                        selectedRow?.nomEstablecimiento ? (
                        <>
                          {actualizacion?.nomEstablecimiento || "N/A"}
                          <AiOutlineArrowRight width="20" />
                        </>
                      ) : null}
                      {selectedRow?.nomEstablecimiento}
                    </td>
                  </tr>
                  <tr>
                    <td>Actividad Comercial</td>
                    <td
                      className={
                        actualizacion &&
                        actualizacion?.actividadComercial?.valor !==
                          selectedRow?.actComercial?.valor
                          ? "font-weight-bold text-danger"
                          : "font-weight-bold text-success"
                      }
                    >
                      {actualizacion &&
                      actualizacion?.actividadComercial?.valor !==
                        selectedRow?.actComercial?.valor ? (
                        <>
                          {actualizacion?.actividadComercial?.valor || "N/A"}
                          <AiOutlineArrowRight width="20" />
                        </>
                      ) : null}
                      {selectedRow?.actComercial?.valor}
                    </td>
                  </tr>
                  <tr>
                    <td>Liquidación</td>
                    <td
                      className={
                        actualizacion &&
                        actualizacion?.liquidacion?.llave !==
                          selectedRow?.liquidacion?.llave
                          ? "font-weight-bold text-danger"
                          : "font-weight-bold text-success"
                      }
                    >
                      {actualizacion &&
                      actualizacion?.liquidacion?.llave !==
                        selectedRow?.liquidacion?.llave ? (
                        <>
                          {actualizacion?.liquidacion?.valor || "N/A"}
                          <AiOutlineArrowRight width="20" />
                        </>
                      ) : null}
                      {selectedRow?.liquidacion?.valor || "N/A"}
                    </td>
                  </tr>

                  <CompararConceptos
                    titulo="DESHABITADO"
                    conceptoActual={actualizacion?.conceptosLiquidacion?.find(
                      concepto => concepto.orden === 1 && concepto.cosuIdregistr !== 0
                    )?.uniConcepto}
                    conceptoSeleccionado={selectedRow?.conceptosLiquidacion?.deshabitado}
                  />
                  
                  <CompararConceptos
                    titulo="AFORADO"
                    conceptoActual={actualizacion?.conceptosLiquidacion?.find(
                      concepto => concepto.orden === 2 && concepto.cosuIdregistr !== 0
                    )?.uniConcepto}
                    conceptoSeleccionado={selectedRow?.conceptosLiquidacion?.aforado}
                  />

                  <CompararConceptos
                    titulo="DESCUENTO PAP"
                    conceptoActual={actualizacion?.conceptosLiquidacion?.find(
                      concepto => concepto.orden === 3 && concepto.cosuIdregistr !== 0
                    )?.uniConcepto}
                    conceptoSeleccionado={selectedRow?.conceptosLiquidacion?.descuento_pap}
                  />

                  {selectedRow?.actsusTipo === "Actualizacion" || selectedRow?.actsusTipo === "Independencia" ? (
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
          nameItems="actualizaciones"
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
  actualizacion: tablasGestion.actualizacion,
});

const mapDispatchToProps = (dispatch) => ({
  loadBuscarActualizacion: (id: string | number) =>
    dispatch(loadBuscarActualizacion(id)),
  clearBuscarActualizacion: () => dispatch(clearBuscarActualizacion()),
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

export default connect(mapStateToProps, mapDispatchToProps)(TablaActualizacionOther);