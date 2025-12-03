import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";
import { Button, Form, Row, Col } from "react-bootstrap";
import moment from "moment";

//constants
import RUTAS_API from "../../../../../global/rutas_api";
import {
  PROGRAMAS,
  ACCIONES_A_REALIZAR_AFORO,
  ERRORES_PQR,
} from "../../../../../global/constantes";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

//assets & styles
import "../FormDetalleSuscripcion.scss";

//Components
import TextBoxG from "../../../../Utils/components/TextBoxG";
import AutoSuggest from "../../../../Utils/components/AutoSuggest";
import SelectBoxG from "../../../../Utils/components/SelectBoxG";
import DateBoxG from "../../../../Utils/components/DateBoxG";
import { FormFacturacionConjunta } from "../Modales/FormFacturacionConjunta";
import ModalCambioDatos from "../Modales/ModalCambioDatos";
import TablaConsultaPQR from "../TablaConsultaPQR/TablaConsultaPQR";
import { ModalConfirmacionGenerico } from "../Modales/ModalConfirmacionGenerico";

//redux & storage
import {
  consultaGet,
  saveConsultaGet,
} from "../../../../../store/actions/Utils";
import { saveItem } from "../../../../../store/actions/Items";

class FiltroSuscripcionAforoR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accionARealizar: "1",
      openModalFacturacionConjuta: false,
      idSuscripcion: "",
      codAntSuscripcion: "",
      numCatastral: "",
      nombresApellidosTercero: "",
      documentoTercero: "",
      ciclo: "",
      documento: "",
      tipoDocumento: "",
      preLoadIdRegister: "",
      desde: moment().format("YYYY-MM-DD"),
      hasta: moment().format("YYYY-MM-DD"),
      limiteUsuario: moment().subtract(5, "M").format("YYYY-MM-DD"),
      listaDetalleSuscripcion: [],
      mostrarTablaResultados: false,
      numeroPqr: "",
      existePqr: false,
    };
  }

  componentDidMount() {
    this.obtenerDocumentos();
    this.obtenerCiclos();
    this.opcionesTercer();
    this.validarPermisosUsuario();
    this.props.saveItem("1", "AccionARealizar");
    this.props.saveItem(moment().format("YYYY-MM-DD h:mm:ss"), "desde");
    this.props.saveItem(moment().format("YYYY-MM-DD h:mm:ss"), "hasta");
    this.props.saveItem(0, "newPage");
    this.props.saveItem(false, "rrellamarServicio");
    this.mostrarToast(
      "Se debe buscar primero una PQR para luego realizar la búsqueda de aforados"
    );
  }

  // Funciones que optinene datos necesarios para el formulario
  obtenerDocumentos = () => {
    this.props.consultaGet(
      RUTAS_API.DOCUMENTO.CONSULTA_DOCUMENTOS,
      {},
      {},
      "listaDocumentos"
    );
  };
  obtenerCiclos = () => {
    this.props.consultaGet(
      RUTAS_API.CICLO.CONSULTA_CICLOS,
      {},
      {},
      "listaCiclos"
    );
  };
  opcionesTercer = () => {
    this.props.consultaGet(
      RUTAS_API.TERCEROS.CONSULTAR_NOMBRES,
      {},
      {},
      "opcionesTercero"
    );
  };
  consultarTipoDocumento = () => {
    this.props.consultaGet(
      RUTAS_API.DOCUMENTO.CONSULTA_TIPO_DOCUMENTOS,
      { uniDocumento: this.state.documento },
      {},
      "listaTiposDocumento"
    );
  };

  mostrarToast = (mensaje) => {
    const opciones = {
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      pauseOnVisibilityChange: true,
      position: "top-right",
      autoClose: 15000,
      newestOnTop: false,
      rtl: false,
    };

    toast.warning(mensaje, opciones);
  };

  //Metodos OnBlur
  handleBlurFormIdSuscripcion = () => {
    const { listaPqr } = this.props;
    if (!!listaPqr && listaPqr.data.length > 0) {
      if (this.state.idSuscripcion != "") {
        if (listaPqr.data[0].idSuscripcion != this.state.idSuscripcion) {
          this.setState({ modalCambioDatos: true });
        }
      }
    }
  };
  handleBlurFormNombreTercero = () => {
    const { listaPqr } = this.props;
    if (!!listaPqr && listaPqr.data.length > 0) {
      if (this.state.nombresApellidosTercero != "") {
        if (listaPqr.data[0].nombreTercero.toLowerCase() != this.state.nombresApellidosTercero.toLowerCase()) {
          this.setState({ modalCambioDatos: true });
        }
      }
    }
  };
  handleBlurFormDocumentoTercero = () => {
    const { listaPqr } = this.props;
    if (!!listaPqr && listaPqr.data.length > 0) {
      if (this.state.documentoTercero != "") {
        if (listaPqr.data[0].documentoTercero != this.state.documentoTercero) {
          this.setState({ modalCambioDatos: true });
        }
      }
    }
  };

  //Metodos OnClick
  handleClickFormIdSuscripcion = (e) => {
    this.setState({ idSuscripcion: e.target.value });
    if (this.props.preLoadIdRegister) {
      this.props.saveItem(undefined, "IdSuscripcion");
    }
  };

  validarPermisosUsuario = () => {
    const { tipoNota } = this.props;
    switch (tipoNota) {
      case PROGRAMAS.DESCUENTO_PUERTA_PUERTA:
        this.props.consultaGet(
          RUTAS_API.PERMISOS_USUARIO.CONSULTA_PERMISOS,
          { idPrograma: PROGRAMAS.DESCUENTO_PUERTA_PUERTA },
          {},
          "permisosUsuario"
        );
        break;
      case PROGRAMAS.DESCUENTO_DESHABITADO:
        this.props.consultaGet(
          RUTAS_API.PERMISOS_USUARIO.CONSULTA_PERMISOS,
          { idPrograma: PROGRAMAS.DESCUENTO_DESHABITADO },
          {},
          "permisosUsuario"
        );
        break;
      case PROGRAMAS.CAMBIO_ESTRATO:
        this.props.consultaGet(
          RUTAS_API.PERMISOS_USUARIO.CONSULTA_PERMISOS,
          { idPrograma: PROGRAMAS.CAMBIO_ESTRATO },
          {},
          "permisosUsuario"
        );
        break;
      case PROGRAMAS.CAMBIO_TIPOUSO:
        this.props.consultaGet(
          RUTAS_API.PERMISOS_USUARIO.CONSULTA_PERMISOS,
          { idPrograma: PROGRAMAS.CAMBIO_TIPOUSO },
          {},
          "permisosUsuario"
        );
        break;
      case PROGRAMAS.AFORO_EXTRAORDINARIO:
        this.props.consultaGet(
          RUTAS_API.PERMISOS_USUARIO.CONSULTA_PERMISOS,
          { idPrograma: PROGRAMAS.AFORO_EXTRAORDINARIO },
          {},
          "permisosUsuario"
        );
        break;
    }
  };

  actualizarVigencia = (evento) => {
    this.setState({ [evento.target.id]: evento.target.value });
    this.props.saveItem(
      moment(evento.target.value).format("YYYY-MM-DD HH:mm:ss"),
      [evento.target.id]
    );
  };

  handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    this.props.saveConsultaGet(undefined, "detallesSuscripcion");

    if (this.props.preLoadIdRegister || form.checkValidity() === true) {
      this.consultaDetalleSuscripcion();
      this.setState({ validated: true });
    } /*else if (form.checkValidity() === true) {
      this.consultaDetalleSuscripcion();
      this.setState({ validated: true });
    }*/
  };

  consultaDetalleSuscripcion = async () => {
    const { pageSize } = this.props;
    const {
      idSuscripcion,
      nombresApellidosTercero,
      documentoTercero,
      ciclo,
      documento,
      tipoDocumento,
      numCatastral,
      codAntSuscripcion,
      accionARealizar,
      desde,
      hasta,
      numeroPqr,
    } = this.state;
    const { listaPqr, tipoNota } = this.props;
    const fechaPqr = !!listaPqr ? listaPqr.data[0].fechaSolicitud : '';
    const numeroPqrR = !!listaPqr ? listaPqr.data[0].radicado : numeroPqr;
    const idSuscripcionR = !!this.props.preLoadIdRegister
      ? parseInt(this.props.preLoadIdRegister.suscripcionAseo)
      : idSuscripcion;
    const paramsTable = {
      idSuscripcion: !!this.props.preLoadIdRegister
        ? parseInt(this.props.preLoadIdRegister.suscripcionAseo)
        : idSuscripcion,
      nombreTercero: !!this.props.preLoadIdRegister
        ? this.props.preLoadIdRegister.nombreCompletoTercero.toString()
        : nombresApellidosTercero,
      documentoTercero,
      ciclo,
      documento: accionARealizar == "1" ? documento : "",
      tipoDocumento: accionARealizar == "1" ? tipoDocumento : "",
      numCatastral,
      codAntSuscripcion,
      pagina: 0,
      tamanoPagina: !!pageSize ? pageSize : 10,
      fechaDesde: accionARealizar == "1" ? desde : "",
      fechaHasta: accionARealizar == "1" ? hasta : "",
      fechaPqr: fechaPqr,
      tipoNota: tipoNota,
      numeroPqr: !!numeroPqrR ? numeroPqrR : numeroPqr,
    };
    if (this.props.preLoadIdRegister) {
      this.setState({
        idSuscripcion: parseInt(this.props.preLoadIdRegister.suscripcionAseo),
        nombresApellidosTercero: this.props.preLoadIdRegister
          .nombreCompletoTercero,
      });
      this.props.saveItem(undefined, "IdSuscripcion");
    }
    if (this.props.rrellamarServicio) {
      this.props.saveConsultaGet(undefined, "detallesSuscripcion");
      await this.props.consultaGet(
        RUTAS_API.DETALLE_SUSCRIPCION.CONSULTA_DETALLE_SUSCIPCION_AFORO,
        paramsTable,
        {},
        "detallesSuscripcion"
      );
      console.log("Entró a consultar el servicio del filtro", this.props.detalleData)
      if ((!!this.props.detalleData && this.props.detalleData.data.data.length <= 0)) {
        if (!!this.props.popUpActivo) {
          console.log("Entró a la validación de la respuesta del filtro", this.props.detalleData)
          this.setState({ modalError: true, mensajeError: "No existen Aforos de referencia para poder proceder con la reliquidación", tituloModalError: "No existen aforos de referencia" });
        }
      }
      this.props.saveItem(this.props.newPage + 1, "newPage");
    }
    this.props.saveItem(idSuscripcionR, "suscripcionIdentificador");
    this.props.saveItem(true, "banderaDeshahTabla");
    this.props.saveItem(paramsTable, "parametrosListaSuscriptores");
    this.props.saveItem(true, "mostrarTablaResultados");
    this.setState({
      mostrarTablaResultados: true,
    });
  };

  handleSubmitPqr = (event) => {
    //const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    this.consultaPqr();
    //if (form.checkValidity() === true) {
    //}
  };

  consultaPqr = async () => {
    const {
      numeroPqr,
      idSuscripcion,
      nombresApellidosTercero,
      documentoTercero,
    } = this.state;
    this.props.saveItem(numeroPqr, "PQRNumber");
    const params = {
      numeroPqr,
      idSuscripcion,
      nombreTercero: nombresApellidosTercero,
      terceroDocumento: documentoTercero,
    };
    await this.props.consultaGet(
      RUTAS_API.PQR.CONSULTA_PQR,
      params,
      {},
      "listaPqr"
    );
    this.props.saveItem(false, "mostrarTablaResultados");
    this.setState({ mostrarTablaResultados: false, });
    !!this.props.listaPqr && this.validarConsultaPqr();
  };
  validarConsultaPqr = () => {
    const { listaPqr } = this.props;
    //const { documentoTercero, nombresApellidosTercero, idSuscripcion } = this.state;
    if (listaPqr.data.length === 0 || (listaPqr.data.length > 0 && !!listaPqr.data[0].descartado)) {
      this.setState({ modalErrorListaVisible: true });
      if (listaPqr.data.length > 0 && !!listaPqr.data[0].descartado) {
        this.setState({ pqrDescartada: true });
      }
    } else if (
      !!listaPqr.data[0].response.errorClass &&
      listaPqr.data[0].response.errorClass ===
      ERRORES_PQR.CODIGO_RESPUESTA_FALLIDA
    ) {
      this.setState({ modalListaErrorDatosVisible: true, pqrDescartada: false });
    }

    //if (documentoTercero == "" || nombresApellidosTercero == "" || idSuscripcion == "") {
    this.reemplazarDatos();
    //}
  };

  //Cambios de comportamiento en filtro
  handleChangeText = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleChangeTextPqr = (e) => {
    this.setState({ [e.target.id]: e.target.value });
    if (e.target.value !== "") {
      this.setState({ existePqr: true });
    } else {
      this.setState({ existePqr: false });
    }
  };

  changeNombreTercero = (value) => {
    this.setState({ nombresApellidosTercero: value });
  };

  reemplazarCambioDatos = () => {
    this.setState({
      numeroPqr: "",
      modalCambioDatos: false,
    });
    this.props.saveConsultaGet([], "listaPqr");
  };

  //Metodos para cerrar modales
  closeModal = () => {
    this.props.saveConsultaGet([], "datallePorMedidor");
    this.setState({ openModalFacturacionConjuta: false });
  };

  cerrarModalCambioDatos = () => {
    this.setState({ modalCambioDatos: false });
    this.setState({ modalCambioDatosFacturacionConj: false });
  };

  cerrarModalPqr = () => {
    this.setState({ modalErrorListaVisible: false });
    this.props.saveConsultaGet([], "listaPqr");
  };

  cerrarModalDatosErroneos = () => {
    this.setState({
      modalListaErrorDatosVisible: false,
      numeroPqr: "",
    });
    this.props.saveConsultaGet([], "listaPqr");
  };

  cerrarModalError = () => {
    this.setState({ modalError: false });
  };

  reemplazarDatos = () => {
    const { listaPqr, preLoadIdRegister } = this.props;

    if (!!preLoadIdRegister) {
      this.props.saveItem(undefined, "IdSuscripcion");
    }

    this.setState({
      modalListaErrorDatosVisible: false,
      idSuscripcion: !!listaPqr && listaPqr.data[0].idSuscripcion,
      documentoTercero: !!listaPqr && listaPqr.data[0].documentoTercero,
      nombresApellidosTercero: !!listaPqr && listaPqr.data[0].nombreTercero,
    });

  };

  handleChangeAccionARealizar = (e) => {
    this.setState({
      accionARealizar: e.target.value,
      mostrarTablaResultados: false,
      listaDetalleSuscripcion: [],
    });
    this.props.saveItem(false, "mostrarTablaResultados");
    this.props.saveItem(e.target.value, "AccionARealizar");
  };

  validarTipoNota = (tipoNota) => {
    const { accionARealizar } = this.state;
    let accionesSegunTipoNota = ACCIONES_A_REALIZAR_AFORO;

    return (
      <SelectBoxG
        md="5"
        label="Acción a realizar"
        value={accionARealizar}
        options={!!accionesSegunTipoNota ? accionesSegunTipoNota : []}
        valueoption="id"
        labeloption="descripcion"
        emptyoption="Seleccione una opción"
        emptyoptiondisabled="true"
        onChange={(e) => {
          this.handleChangeAccionARealizar(e);
        }}
      />
    );
  };

  limpiarCampos = () => {
    const { modalCambioDatosFacturacionConj } = this.state;
    this.props.saveItem(undefined, "IdSuscripcion");
    this.props.saveConsultaGet([], "listaPqr");
    this.setState({
      idSuscripcion: "",
      codAntSuscripcion: "",
      numCatastral: "",
      nombresApellidosTercero: "",
      documentoTercero: "",
      ciclo: "",
      documento: "",
      tipoDocumento: "",
      numeroPqr: "",
      desde: moment().format("YYYY-MM-DD"),
      hasta: moment().format("YYYY-MM-DD"),
    });

    if (modalCambioDatosFacturacionConj) {
      this.setState({
        modalCambioDatosFacturacionConj: false,
        openModalFacturacionConjuta: true,
      });
    }
  };

  validarFiltro = () => {
    const {
      idSuscripcion,
      codAntSuscripcion,
      numCatastral,
      nombresApellidosTercero,
      documentoTercero,
      ciclo,
      documento,
      tipoDocumento,
    } = this.state;
    if (this.props.preLoadIdRegister ||
      idSuscripcion != "" ||
      codAntSuscripcion != "" ||
      numCatastral != "" ||
      nombresApellidosTercero != "" ||
      documentoTercero != "" ||
      ciclo != "" ||
      documento != "" ||
      tipoDocumento != ""
    ) {
      this.setState({ modalCambioDatosFacturacionConj: true });
    } else {
      this.setState({ openModalFacturacionConjuta: true });
    }
  };

  render() {
    const {
      title,
      subtitle,
      opcionesTer,
      listaCiclos,
      listaDocumentos,
      listaTiposDocumento,
      admin,
      tipoNota,
      listaPqr,
      preLoadIdRegister,
    } = this.props;
    const {
      openModalFacturacionConjuta,
      validated,
      idSuscripcion,
      codAntSuscripcion,
      numCatastral,
      nombresApellidosTercero,
      documentoTercero,
      ciclo,
      documento,
      accionARealizar,
      tipoDocumento,
      desde,
      hasta,
      limiteUsuario,
      modalCambioDatos,
      numeroPqr,
      modalErrorListaVisible,
      modalListaErrorDatosVisible,
      modalCambioDatosFacturacionConj,
      existePqr,
      pqrDescartada,
      modalError,
      mensajeError,
      tituloModalError,
    } = this.state;

    return (
      <Fragment>
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
        <Form validated={validated} onSubmit={(e) => this.handleSubmit(e)}>
          {openModalFacturacionConjuta && (
            <FormFacturacionConjunta closeModal={this.closeModal} />
          )}
          <Button
            className={"button_group"}
            value={"energia"}
            onClick={this.validarFiltro}
          >
            Buscar por <br /> factura conjunta
          </Button>
          <Form.Row>{!!tipoNota && this.validarTipoNota(tipoNota)}</Form.Row>
          {!!accionARealizar && (
            <Fragment>
              {/* primera Linea del filtro tres campos: Id de suscripción,
              Cod. Ant Suscripción y Número Catastral*/}
              <Form.Row>
                {modalCambioDatos && (
                  <ModalCambioDatos
                    cerrarModal={this.cerrarModalCambioDatos}
                    aceptarModal={this.reemplazarCambioDatos}
                    mensaje={
                      "Los criterios de búsqueda que está ingresando no corresponden a la PQR listada, ¿Desea quitar la PQR ingresada?"
                    }
                    titulo={"Resultado"}
                    aceptarOption={true}
                  />
                )}
                <TextBoxG
                  md="4"
                  label="Id de suscripción"
                  id="idSuscripcion"
                  value={
                    !!preLoadIdRegister
                      ? preLoadIdRegister.suscripcionAseo
                      : idSuscripcion
                  }
                  onChange={this.handleChangeText}
                  onBlur={this.handleBlurFormIdSuscripcion}
                  onClick={this.handleClickFormIdSuscripcion}
                  required={nombresApellidosTercero != "" ? true : false}
                  type="number"
                  placeholder="Número de la suscripción"
                  validations="Campo obligatorio si se diligencia nombres de tercero"
                />
                <TextBoxG
                  md="4"
                  label="Cod. ant de suscripción"
                  id="codAntSuscripcion"
                  value={codAntSuscripcion}
                  onChange={this.handleChangeText}
                  type="number"
                  placeholder="Código anterior"
                />
                <TextBoxG
                  md="4"
                  label="Número catastral"
                  id="numCatastral"
                  value={numCatastral}
                  onChange={this.handleChangeText}
                  type="number"
                  placeholder="Número catastral"
                />
              </Form.Row>
              {/* Segunda Linea del filtro tres campos: Nombres y apellidos,
              Documento y Ciclo*/}
              <Form.Row>
                <AutoSuggest
                  md="4"
                  label="Nombres y apellidos del tercero"
                  value={
                    !!preLoadIdRegister
                      ? preLoadIdRegister.nombreCompletoTercero
                      : nombresApellidosTercero
                  }
                  placeHolder={"Nombres y apellidos"}
                  options={!!opcionesTer ? opcionesTer.data : []}
                  changeValue={this.changeNombreTercero}
                  onBlur={this.handleBlurFormNombreTercero}
                  validation="Campo obligatorio si se diligencia id de suscripción sin
                  documento de tercero"
                />
                <TextBoxG
                  md="4"
                  label="Documento del tercero"
                  id="documentoTercero"
                  value={documentoTercero}
                  onChange={this.handleChangeText}
                  type="number"
                  placeholder="Documento"
                  onBlur={this.handleBlurFormDocumentoTercero}
                  validations="Campo obligatorio si se diligencia id de suscripción sin
              nombre de tercero"
                />
                <SelectBoxG
                  md="4"
                  label="Ciclo"
                  value={ciclo}
                  options={!!listaCiclos ? listaCiclos.data : []}
                  valueoption="cicIderegistro"
                  labeloption="cicNombre"
                  emptyoption="-- N/A --"
                  onChange={(e) => this.setState({ ciclo: e.target.value })}
                />
              </Form.Row>
              {/* Tercera Linea del filtro tres campos: Documento,
              Tipo de documento y Fecha desde
              Linea con condicional de tipo de busqueda*/}
              {accionARealizar == "1" && (
                <Fragment>
                  <Form.Row>
                    <SelectBoxG
                      md="4"
                      label="Documento"
                      value={documento}
                      options={!!listaDocumentos ? listaDocumentos.data : []}
                      valueoption="uniDocumento"
                      labeloption="uniNombre1"
                      emptyoption="-- N/A --"
                      onChange={(e) =>
                        this.setState({ documento: e.target.value }, () => {
                          this.consultarTipoDocumento();
                        })
                      }
                      validations="Campo obligatorio si se selecciona un tipo de documento"
                    />
                    <SelectBoxG
                      md="4"
                      label="Tipo de documento"
                      required={documento !== "" ? true : false}
                      value={tipoDocumento}
                      options={
                        !!listaTiposDocumento ? listaTiposDocumento.data : []
                      }
                      valueoption="uniTipDocument"
                      labeloption="uniNombre1"
                      emptyoption="-- N/A --"
                      onChange={(e) =>
                        this.setState({ tipoDocumento: e.target.value })
                      }
                      validations="Campo obligatorio si se selecciona un documento"
                    />
                    <DateBoxG
                      id={"desde"}
                      label={"Fecha desde"}
                      value={desde}
                      onChange={this.actualizarVigencia}
                      required={true}
                      max={hasta}
                    //min={!!admin ? "" : limiteUsuario}
                    />
                  </Form.Row>
                  <Form.Row>
                    {/* Cuarta Linea del filtro con campo fecha hasta*/}
                    <DateBoxG
                      id={"hasta"}
                      label={"Fecha hasta"}
                      value={hasta}
                      onChange={this.actualizarVigencia}
                      required={true}
                      min={desde}
                      max={moment().format("YYYY-MM-DD")}
                    />
                  </Form.Row>
                </Fragment>
              )}
            </Fragment>
          )}

          <hr style={{ borderTop: "1px solid #007bff" }} />
          <Form.Group as={Col} md="7" className="no-margin-bottom">
            <Form.Row className="center-vertical-items">
              <Form.Label className="margin-r">Número de radicado PQR</Form.Label>
              <Col>
                <Form.Control
                  value={numeroPqr}
                  style={{ borderColor: !existePqr && "red" }}
                  id="numeroPqr"
                  onChange={this.handleChangeTextPqr}
                  type="number"
                  placeholder="Número de PQR"
                />
              </Col>
              <Button disabled={!numeroPqr} onClick={this.consultaPqr} className="margitn-left">
                Buscar PQR
              </Button>
            </Form.Row>
          </Form.Group>
          <hr style={{ borderTop: "1px solid #007bff" }} />
          {!!listaPqr && listaPqr.data.length > 0 && (
            <TablaConsultaPQR listaPqr={listaPqr.data} tipoNota={tipoNota} />
          )}
          <Button
            className={"margin-r"}
            type="submit"
            disabled={
              !listaPqr || !!pqrDescartada || (!!listaPqr && listaPqr.data.length === 0) || !numeroPqr || (
                !idSuscripcion &&
                !ciclo &&
                !documento &&
                !documentoTercero &&
                !nombresApellidosTercero &&
                !tipoDocumento &&
                !numCatastral &&
                !codAntSuscripcion &&
                !preLoadIdRegister
              )
            }
          >
            Buscar
          </Button>
          <Button onClick={this.limpiarCampos}>Limpiar</Button>
        </Form>
        {modalErrorListaVisible && (
          <ModalCambioDatos
            cerrarModal={this.cerrarModalPqr}
            mensaje={
              !!listaPqr && listaPqr.data.length > 0
                ? ERRORES_PQR.ERROR_PQR_DESCARTADO
                : ERRORES_PQR.ERROR_SIN_RESULTADOS
            }
            titulo={"Resultado"}
            aceptarOption={false}
          />
        )}
        {modalListaErrorDatosVisible && (
          <ModalCambioDatos
            cerrarModal={this.cerrarModalDatosErroneos}
            aceptarModal={this.reemplazarDatos}
            mensaje={!!listaPqr && listaPqr.data[0].response.message}
            titulo={"Resultado"}
            aceptarOption={true}
          />
        )}
        <div className="pt-3">
          {modalCambioDatosFacturacionConj && (
            <ModalCambioDatos
              cerrarModal={this.cerrarModalCambioDatos}
              aceptarModal={this.limpiarCampos}
              mensaje={
                "¿Desea modificar los datos actuales en el filtro de búsqueda?"
              }
              titulo={"Cambio de datos"}
              aceptarOption={true}
            />
          )}
        </div>
        {!!modalError && (
          <ModalConfirmacionGenerico
            closeModal={this.cerrarModalError}
            tituloModal={tituloModalError}
            mensaje={mensajeError}
            error={true}
          />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  preLoadIdRegister: state.Items.IdSuscripcion,
  listaCiclos: state.Utils.listaCiclos,
  listaDocumentos: state.Utils.listaDocumentos,
  listaTiposDocumento: state.Utils.listaTiposDocumento,
  listaPqr: state.Utils.listaPqr,
  opcionesTer: state.Utils.opcionesTercero,
  admin: state.Utils.permisosUsuario,
  listaDetalleSuscripcion: state.Utils.listaDetalleSuscripcion,
  tipoNota: state.Items.tipoNota,
  rrellamarServicio: state.Items.rrellamarServicio,
  newPage: state.Items.newPage,
  detalleData: state.Utils.detallesSuscripcion,
  popUpActivo: state.Items.popUpActivo,
  pageSize: state.Items.pageSize,
});

const mapDispatchToProps = {
  consultaGet,
  saveItem,
  saveConsultaGet,
};

export const FiltroSuscripcionAforo = connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltroSuscripcionAforoR);
