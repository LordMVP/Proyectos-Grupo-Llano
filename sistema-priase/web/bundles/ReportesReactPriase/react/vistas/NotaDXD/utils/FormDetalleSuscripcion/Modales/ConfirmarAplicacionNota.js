import React, { Component, Fragment } from "react";
import moment from "moment";
import connect from "react-redux/es/connect/connect";
import { Button, Form, Col, Row } from "react-bootstrap";
import Modal from "react-bootstrap4-modal";
import {
  postServiceR,
  savePutService,
  consultaGet,
} from "../../../../../store/actions/Utils";
import { saveItem } from "../../../../../store/actions/Items";
import RUTAS_API from "../../../../../global/rutas_api";
import { TIPO_ATENCION_NOTAS } from "../../../../../global/constantes";
import "../FormDetalleSuscripcion.scss";
import {
  validarLista,
  differentsValues,
} from "../../../../Utils/StandarMethods";

class ConfirmarAplicacionNotaR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      observacion: (!!this.props.pqr && this.props.pqr.data.length > 0) ? this.props.pqr.data[0].observaciones : "",
      tipoNotaV: (!!this.props.pqr && this.props.pqr.data.length > 0) ? this.props.pqr.data[0].tipoNota : "",
      motivoNotaV: "",
      codNovedadV: "",
      PQRSaveSi: false,
      PQRSaveNo: true,
      accedeSi: false,
      accesedePArcial: true,
      modalAviso: false,
      modalError: false,
    };
  }

  componentDidMount() {
    !!!this.props.tipoNota && this.listTipoNotas();
    !!!this.props.motivoNota && this.listMotivoNotas();
    !!!this.props.codNovedad && this.listCodNovedad();
  }

  listTipoNotas = () => {
    this.props.consultaGet(RUTAS_API.NOTAS.TIPO_NOTAS, {}, {}, "tipoNotaList");
  };

  listMotivoNotas = () => {
    this.props.consultaGet(
      RUTAS_API.NOTAS.MOTIVO_NOTAS,
      {},
      {},
      "motivoNotaList"
    );
  };

  listCodNovedad = () => {
    this.props.consultaGet(
      RUTAS_API.NOTAS.CODIGO_NOVEDAD,
      {},
      {},
      "codNovedadList"
    );
  };

  handleChangeValue = (checked, nameActual, nameOther) => {
    this.setState({ [nameActual]: !checked, [nameOther]: checked });
  };

  handleChangeText = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleClickObservacion = (e) => {
    this.setState({ observacion: e.target.value });
  };

  handleSubmit = async () => {
    const suscripcionList = this.props.listaSuscripcion;
    const idSuscriptList = differentsValues(suscripcionList, "idSuscripcion");

    const selectList = validarLista(this.props.selection);
    let observacion = this.state.observacion;

    await this.props.postServiceR(
      RUTAS_API.NOTAS.LIQUIDAR_NOTA,
      {
        facturas: selectList,
        observacion: this.state.observacion,
        tipoNota: parseInt(this.props.tipoNotaItem),
        reclamacion: parseInt(this.state.tipoNotaV),
        uniMotnota: parseInt(this.state.motivoNotaV),
      },
      {},
      "liquidarNota"
    );
    for (let i = 0; i < idSuscriptList.length; i++) {
      let paramsNot = {
        fecha: moment().format("YYYY-MM-DD hh:mm:ss"),
        observacion: observacion,
        uniMotnota: parseInt(this.state.motivoNotaV),
        dsusIdregistr: idSuscriptList[i],
        facturas: selectList,
      };
      await this.props.postServiceR(
        RUTAS_API.NOTAS.AGREGAR_NOTA_NOFA,
        paramsNot,
        {},
        "newNotNota"
      );
    }
    if (!!this.props.pqr && this.state.PQRSaveSi) {
      let params = {
        accede: this.state.accesedePArcial ? "ACCEDE PARCIALMENTE" : "ACCEDE",
        codigoNovedad: parseInt(this.state.motivoNotaV),
        idSuscripcion: parseInt(this.props.pqr.data[0].idSuscripcion),
        numeroPqr: this.props.pqr.data[0].radicado,
        observacion: observacion,
      };
      await this.props.postServiceR(
        RUTAS_API.NOTAS.AGREGAR_VISITAS_SOL,
        params,
        {},
        "newVisitasSol"
      );
    }
    this.props.closeModal();
  };

  cerrarModalAviso = () => {
    this.setState({ modalAviso: false });
  };

  cerrarModalError = () => {
    this.setState({ modalError: false });
  };

  render() {
    const { closeModal, pqr, tipoNota, motivoNota, codNovedad } = this.props;
    const {
      observacion,
      PQRSaveSi,
      PQRSaveNo,
      accedeSi,
      accesedePArcial,
      tipoNotaV,
      motivoNotaV,
      codNovedadV,
    } = this.state;
    return (
      <Fragment>
        <Modal
          size="lg"
          visible={true}
          onClickBackdrop={closeModal}
          dialogClassName="custom-dialog"
        >
          <div className="modal-header">
            <h2 className="modal-title">Notas - Descuentos </h2>
          </div>
          <div className="blue-separator"></div>
          <div className={"container"}>
            <div className="modal-body">
              <h5 className="modal-title">Confirmar aplicación de la Nota</h5>
              <div>
                <Form.Row>
                  <Form.Group as={Col} md="12">
                    <Form.Label>Observación</Form.Label>
                    <Form.Control
                      as={"textarea"}
                      row={6}
                      id={"observacion"}
                      value={observacion}
                      onChange={this.handleChangeText}
                      type="text"
                      placeholder="Texto"
                      onClick={this.handleClickObservacion}
                      maxLength={500}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row className={"center"}>
                  <Form.Group as={Col} md="12">
                    <Form.Label className={"margin-text"}>
                      ¿Retroalimentación sistemas PQRS?
                    </Form.Label>
                  </Form.Group>
                  <Form.Group as={Col} md="12">
                    <div className={"box_check"}>
                      <label htmlFor="retro" className={"margin-space"}>
                        Si
                      </label>
                      <input
                        id={"retro"}
                        type="radio"
                        checked={PQRSaveSi}
                        className={"margin-space"}
                        onChange={() => {
                          this.handleChangeValue(
                            PQRSaveSi,
                            "PQRSaveSi",
                            "PQRSaveNo"
                          );
                        }}
                        disabled={!!!pqr || pqr.data.length == 0}
                      />
                      <label htmlFor="retroNo" className={"margin-space"}>
                        No
                      </label>
                      <input
                        id={"retroNo"}
                        type="radio"
                        checked={PQRSaveNo}
                        className={"margin-space"}
                        onChange={() => {
                          this.handleChangeValue(
                            PQRSaveNo,
                            "PQRSaveNo",
                            "PQRSaveSi"
                          );
                        }}
                      />
                    </div>
                  </Form.Group>
                </Form.Row>
                {!!pqr &&
                  PQRSaveSi &&
                  pqr.data[0].tipoAtencionCod !=
                  TIPO_ATENCION_NOTAS.ATENCION_CORREO &&
                  pqr.data[0].tipoAtencionCod !=
                  TIPO_ATENCION_NOTAS.ATENCION_ESCRITA && (
                    <Form.Row className={"center"}>
                      <Form.Group as={Col} md="12">
                        <Form.Label className={"margin-text"}>
                          ¿Accede?
                        </Form.Label>
                      </Form.Group>
                      <Form.Group as={Col} md="12">
                        <div className={"box_check"}>
                          <label htmlFor="accedeSi" className={"margin-space"}>
                            Si
                          </label>
                          <input
                            id={"accedeSi"}
                            type="radio"
                            checked={accedeSi}
                            className={"margin-space"}
                            onChange={() =>
                              this.handleChangeValue(
                                accedeSi,
                                "accedeSi",
                                "accesedePArcial"
                              )
                            }
                          />
                          <label
                            htmlFor="retroParcialmente"
                            className={"margin-space"}
                          >
                            Parcialmente
                          </label>
                          <input
                            id={"retroParcialmente"}
                            type="radio"
                            checked={accesedePArcial}
                            className={"margin-space"}
                            onChange={() =>
                              this.handleChangeValue(
                                accesedePArcial,
                                "accesedePArcial",
                                "accedeSi"
                              )
                            }
                          />
                        </div>
                      </Form.Group>
                    </Form.Row>
                  )}
                <Form.Row className={"center"}>
                  <Form.Group as={Col} md="12">
                    <Form.Label>Tipo Nota</Form.Label>
                    <Form.Control
                      as="select"
                      custom
                      value={tipoNotaV}
                      onChange={this.handleChangeText}
                      id={"tipoNotaV"}
                    >
                      <option value={""} disabled>
                        Seleccione una opción
                      </option>
                      {!!tipoNota &&
                        tipoNota.data.map((accion, index) => (
                          <option key={index} value={accion.idParametro}>
                            {accion.descParametro}
                          </option>
                        ))}
                    </Form.Control>
                  </Form.Group>
                </Form.Row>
                <Form.Row className={"center"}>
                  <Form.Group as={Col} md="12">
                    <Form.Label>Motivo Nota</Form.Label>
                    <Form.Control
                      as="select"
                      custom
                      value={motivoNotaV}
                      onChange={this.handleChangeText}
                      id={"motivoNotaV"}
                    >
                      <option value={""} disabled>
                        Seleccione una opción
                      </option>
                      {!!motivoNota &&
                        motivoNota.data.map((accion, index) => (
                          <option key={index} value={accion.idParametro}>
                            {accion.descParametro}
                          </option>
                        ))}
                    </Form.Control>
                  </Form.Group>
                </Form.Row>
                {PQRSaveSi && (
                  <Form.Row className={"center"}>
                    <Form.Group as={Col} md="12">
                      <Form.Label>Codigo Novedad</Form.Label>
                      <Form.Control
                        as="select"
                        custom
                        value={codNovedadV}
                        onChange={this.handleChangeText}
                        id={"codNovedadV"}
                      >
                        <option value={""} disabled>
                          Seleccione una opción
                        </option>
                        {!!codNovedad &&
                          codNovedad.data.map((accion, index) => (
                            <option key={index} value={accion.idParametro}>
                              {accion.descParametro}
                            </option>
                          ))}
                      </Form.Control>
                    </Form.Group>
                  </Form.Row>
                )}
                <Form.Row>
                  <Button
                    style={{ marginRight: "15px" }}
                    onClick={this.handleSubmit}
                    disabled={
                      PQRSaveSi
                        ? !(codNovedadV !== "" && motivoNotaV !== "")
                        : motivoNotaV === ""
                    }
                  >
                    Continuar
                  </Button>
                  <Button onClick={closeModal}>Regresar</Button>
                </Form.Row>
              </div>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  pqr: state.Utils.listaPqr,
  PQRNumber: state.Items.PQRNumber,
  resultConsult: state.Utils.newPqr,
  tipoNota: state.Utils.tipoNotaList,
  motivoNota: state.Utils.motivoNotaList,
  codNovedad: state.Utils.codNovedadList,
  tipoNotaItem: state.Items.tipoNota,
  responeLiquidarNota: state.Utils.liquidarNota,
  responseNewNotNota: state.Utils.newNotNota,
  newVisitasSol: state.Utils.newVisitasSol,
});

const mapDispatchToProps = {
  saveItem,
  savePutService,
  consultaGet,
  postServiceR,
};

const ConfirmarAplicacionNota = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmarAplicacionNotaR);

export default ConfirmarAplicacionNota;
