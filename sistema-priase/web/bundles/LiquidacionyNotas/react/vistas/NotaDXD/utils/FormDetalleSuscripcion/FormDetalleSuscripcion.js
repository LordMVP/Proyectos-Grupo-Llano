import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";
import { Button, Form, Col } from "react-bootstrap";

//assets & styles
import "react-table/react-table.css";
import "./FormDetalleSuscripcion.scss";

//Constants
import {
  ERRORES_PQR,
  PROGRAMAS,
  ACCIONES_A_REALIZAR_DESHABITADO,
  ACCIONES_A_REALIZAR_PUERTA_PUERTA,
} from "../../../../global/constantes";
import RUTAS_API from "../../../../global/rutas_api";

//Components
import RTablaDetalleSuscripcion from "../TablaDetalleSuscripcion/TablaDetalleSucripcion";
import { FormFacturacionConjunta } from "./Modales/FormFacturacionConjunta";
import ModalCambioDatos from "./Modales/ModalCambioDatos";
import TablaConsultaPQR from "./TablaConsultaPQR/TablaConsultaPQR";
import DateBoxG from "../../../Utils/components/DateBoxG";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import AutoSuggest from "../../../Utils/components/AutoSuggest";

//Actions Redux
import { saveItem } from "../../../../store/actions/Items";
import { consultaGet, saveConsultaGet } from "../../../../store/actions/Utils";

class RFormDetalleSuscripcion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //Variables de control de validación de los formularios
      validated: false,
      //Variables de control de formulario de búsqueda
      idSuscripcion: "",
      nombresApellidosTercero: "",
      documentoTercero: "",
      ciclo: "",
      documento: "",
      tipoDocumento: "",
      numeroPqr: "",
      listaDetalleSuscripcion: [],
      pages: 0,
      codAntSuscripcion: "",
      numCatastral: "",
      openModalFacturacionConjuta: false,
      //Variables de control de los campos de fecha en el formulario de búsqueda
      admin: "",
      desde: moment().format("YYYY-MM-DD"),
      hasta: moment().format("YYYY-MM-DD"),
      limiteUsuario: moment().subtract(5, "M").format("YYYY-MM-DD"),
      accionARealizar: "",
      modalCambioDatos: false,
    };
  }

  componentDidMount() {
    this.obtenerDocumentos();
    this.obtenerCiclos();
    this.mostrarTablaDeshabitado();
    this.validarPermisosUsuario();
    this.cargarFechasProps();
    this.opcionesTercer();
    this.props.saveItem(0, "newPage");
    this.props.saveItem(false, "rrellamarServicio");
  }

  opcionesTercer = () => {
    this.props.consultaGet(
      RUTAS_API.TERCEROS.CONSULTAR_NOMBRES,
      {},
      {},
      "opcionesTercero"
    );
  };

  mostrarTablaDeshabitado() {
    this.props.saveItem(true, "banderaDeshahTabla");
  }
  /**
   * Método encargado de cargar los documentos disponibles para seleccionar en el formulario de búsuqueda
   */
  obtenerDocumentos = () => {
    this.props.consultaGet(
      RUTAS_API.DOCUMENTO.CONSULTA_DOCUMENTOS,
      {},
      {},
      "listaDocumentos"
    );
  };

  /**
   * Método encargado de cargar los ciclos disponibles para seleccionar en el formulario de búsuqueda
   */
  obtenerCiclos = () => {
    this.props.consultaGet(
      RUTAS_API.CICLO.CONSULTA_CICLOS,
      {},
      {},
      "listaCiclos"
    );
  };

  /**
   * Método encargado de consultar los tipos de documento disponibles según el documento seleccionado previamente
   *
   * @param {event} event Parámetro que se recibe para que el método solo se ejecute cuando se hace el llamado al evento de onChange
   */
  consultarTipoDocumento = () => {
    this.props.consultaGet(
      RUTAS_API.DOCUMENTO.CONSULTA_TIPO_DOCUMENTOS,
      { uniDocumento: this.state.documento },
      {},
      "listaTiposDocumento"
    );
  };

  /**
   * Método encargado de manejar la validación del formulario de búsqueda de detalle suscripción
   *
   * @param {event} event Parámetro que se recibe para que el método solo se ejecute cuando se hace el llamado al evento de onChange
   */
  handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (this.props.preLoadIdRegister) {
      this.consultaDetalleSuscripcion();
    } else if (form.checkValidity() === true) {
      this.consultaDetalleSuscripcion();
      this.setState({ validated: true });
    }
  };

  /**
   * Método encargado de manejar la validación del formulario de búsqueda de consulta de PQR
   *
   * @param {event} event Parámetro que se recibe para que el método solo se ejecute cuando se hace el llamado al evento de onChange
   */
  handleSubmitPqr = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      this.consultaPqr();
    }
  };

  /**
   * Método encargado de consumir el servicio de consultar PQR
   */
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
    !!this.props.listaPqr && this.validarConsultaPqr();
  };

  /**
   * Método encargado de validar la respuesta de la consulta de PQR,
   * Si existe la PQR pero los datos del formulario de tercero están equivocados
   * Si no existe la PQR
   * Si la PQR está descartada
   */
  validarConsultaPqr = () => {
    const { listaPqr } = this.props;
    const { documentoTercero, nombresApellidosTercero, idSuscripcion } = this.state;
    if (listaPqr.data.length === 0 || (listaPqr.data.length > 0 && !!listaPqr.data[0].descartado)) {
      this.setState({ modalErrorListaVisible: true });
    } else if (
      !!listaPqr.data[0].response.errorClass &&
      listaPqr.data[0].response.errorClass ===
      ERRORES_PQR.CODIGO_RESPUESTA_FALLIDA
    ) {
      this.setState({ modalListaErrorDatosVisible: true });
    }

    if (documentoTercero == "" || nombresApellidosTercero == "" || idSuscripcion == "") {
      this.reemplazarDatos();
    }
  };

  /**
   * Método encargado de modificar el state para cerrar el modal de PQR
   */
  cerrarModalPqr = () => {
    this.setState({ modalErrorListaVisible: false });
    this.props.saveConsultaGet([], "listaPqr");
  };

  /**
   * Método encargado de reemplazar los datos equivocados por los correctos cuando se consulta una PQR
   * existente pero con datos de tercero equivocados
   */
  reemplazarDatos = () => {
    const { listaPqr } = this.props;
    this.setState({
      modalListaErrorDatosVisible: false,
      idSuscripcion: !!listaPqr && listaPqr.data[0].idSuscripcion,
      documentoTercero: !!listaPqr && listaPqr.data[0].documentoTercero,
      nombresApellidosTercero: !!listaPqr && listaPqr.data[0].nombreTercero,
    });
  };

  /**
   * Métdodo encargado de cerrar el modal de consulta de PQR
   */
  cerrarModalDatosErroneos = () => {
    this.setState({
      modalListaErrorDatosVisible: false,
      numeroPqr: "",
    });
    this.props.saveConsultaGet([], "listaPqr");
  };

  /**
   * Método encargado de consultar los detalle suscripción con base en la información diligenciada en el formulario
   */
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
    } = this.state;
    const params = {
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
    };
    if (this.props.preLoadIdRegister) {
      this.setState({
        idSuscripcion: parseInt(this.props.preLoadIdRegister.suscripcionAseo),
        nombresApellidosTercero: this.props.preLoadIdRegister
          .nombreCompletoTercero,
      });
      this.props.saveItem(undefined, "IdSuscripcion");
    }
    this.props.saveItem(params.idSuscripcion, "suscripcionIdentificador");
    if (this.props.rrellamarServicio) {
      await this.props.consultaGet(
        RUTAS_API.DETALLE_SUSCRIPCION.CONSULTA_DETALLE_SUSCRIPCION,
        params,
        {},
        "detallesSuscripcion"
      );
      this.props.saveItem(this.props.newPage + 1, "newPage");
      let returnPage = this.props.returnPage;
      this.props.saveItem(returnPage + 1, "returnPage");
    }
    // await this.props.consultaGet(
    //   RUTAS_API.DETALLE_SUSCRIPCION.CONSULTA_DETALLE_SUSCRIPCION,
    //   params,
    //   {},
    //   "listaDetalleSuscripcion"
    // );
    this.props.saveItem(true, "banderaDeshahTabla");
    // if (!!this.props.listaDetalleSuscripcion) {
    this.setState({
      // listaDetalleSuscripcion: this.props.listaDetalleSuscripcion.data.data,
      mostrarTablaResultados: true,
      // pages: this.props.listaDetalleSuscripcion.data.pages,
    });
    // }
  };

  /**
   * Métodos encargados de validar el cambio en el campo de id suscripción, para que tras dejar la seleccion del campo
   * y el valor no corresponda con lo que se trajo al consultar PQR, aparezca
   * una alerta
   */
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

  handleClickFormIdSuscripcion = (e) => {
    this.setState({ idSuscripcion: e.target.value });
    if (this.props.preLoadIdRegister) {
      this.props.saveItem(undefined, "IdSuscripcion");
    }
  };

  /**
   * Métodos encargados de validar el cambio en el campo de nombres de tercero, para que tras dejar la seleccion del campo
   * y el valor no corresponda con lo que se trajo al consultar PQR, aparezca
   * una alerta
   */
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

  handleClickFormNombreTercero = (e) => {
    this.setState({
      nombresApellidosTercero: e.target.value,
    });
    if (this.props.preLoadIdRegister) {
      this.props.saveItem(undefined, "IdSuscripcion");
    }
  };

  /**
   * Método encargado de validar el cambio en el campo de documento tercero, para que tras deseleccionar el campo
   *  y el valor no corresponda con lo que se trajo al consultar PQR, aparezca
   * una alerta
   */

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

  /**
   * Método encargado de cambiar el State de la variable de visualización del modal para cerrarlo
   */
  cerrarModalCambioDatos = () => {
    this.setState({ modalCambioDatos: false });
    this.setState({ modalCambioDatosFacturacionConj: false });
  };

  /**
   * Método encargado de borrar los datos de la PQR cuando el usuario ingresa datos de tercero que no
   * pertenecen a la PQR listada
   */
  reemplazarCambioDatos = () => {
    this.setState({
      numeroPqr: "",
      modalCambioDatos: false,
    });
    this.props.saveConsultaGet([], "listaPqr");
  };

  // para los cambios de un campo de texto
  handleChangeText = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  changeToggle = (valueToggle, inactiveToggle) => {
    this.setState({ [valueToggle]: true });
    this.setState({ [inactiveToggle]: false });
  };

  closeModal = () => {
    this.props.saveConsultaGet([], "datallePorMedidor");
    this.setState({ openModalFacturacionConjuta: false });
  };

  /**
   * Método encargado de validar si el usuario cuenta con permisos
   * para tener libertad de selección de fecha en los campos de
   * Fecha desde y Fecha hasta del filtro
   *
   */
  validarPermisosUsuario = () => {
    const { tipoNota } = this.props;
    if (tipoNota == PROGRAMAS.DESCUENTO_PUERTA_PUERTA) {
      this.props.consultaGet(
        RUTAS_API.PERMISOS_USUARIO.CONSULTA_PERMISOS,
        { idPrograma: PROGRAMAS.DESCUENTO_PUERTA_PUERTA },
        {},
        "permisosUsuario"
      );
    } else if (tipoNota == PROGRAMAS.DESCUENTO_DESHABITADO) {
      this.props.consultaGet(
        RUTAS_API.PERMISOS_USUARIO.CONSULTA_PERMISOS,
        { idPrograma: PROGRAMAS.DESCUENTO_DESHABITADO },
        {},
        "permisosUsuario"
      );
    }
  };

  /**
   * Método encargado de modificar en el state el valor de la fecha seleccionada en el
   * filtro de búsqueda de detalle de suscripción
   *
   * @param {*} evento
   */
  actualizarVigencia = (evento) => {
    this.setState({ [evento.target.id]: evento.target.value });
    this.props.saveItem(
      moment(evento.target.value).format("YYYY-MM-DD HH:mm:ss"),
      [evento.target.id]
    );
  };

  /**
   * Método encargado de limpiar las búsquedas realizadas de detalles de suscripción
   * y actualización del state para el valor del campo de accionARealizar
   *
   * @param {*} e
   */
  handleChangeAccionARealizar = (e) => {
    this.setState(
      {
        accionARealizar: e.target.value,
        mostrarTablaResultados: false,
        listaDetalleSuscripcion: [],
      },
      () => this.props.saveItem(this.state.accionARealizar, "AccionARealizar")
    );
  };

  changeNombreTercero = (value) => {
    this.setState({ nombresApellidosTercero: value });
  };

  cargarFechasProps = () => {
    const { desde, hasta } = this.state;
    this.props.saveItem(moment(desde).format("YYYY-MM-DD HH:mm:ss"), "desde");
    this.props.saveItem(moment(hasta).format("YYYY-MM-DD HH:mm:ss"), "hasta");
  };

  validarTipoNota = (tipoNota) => {
    const { accionARealizar } = this.state;
    let accionesSegunTipoNota = [];
    if (tipoNota == PROGRAMAS.DESCUENTO_DESHABITADO) {
      accionesSegunTipoNota = ACCIONES_A_REALIZAR_DESHABITADO;
    } else if (tipoNota == PROGRAMAS.DESCUENTO_PUERTA_PUERTA) {
      accionesSegunTipoNota = ACCIONES_A_REALIZAR_PUERTA_PUERTA;
    }
    return (
      <Form.Group as={Col} md="5">
        <Form.Label>Acción a realizar</Form.Label>
        <Form.Control
          as="select"
          custom
          value={accionARealizar}
          onChange={this.handleChangeAccionARealizar}
        >
          <option value={""}>Seleccione una opción</option>
          {accionesSegunTipoNota.map((accion, index) => (
            <option key={`accion-${index}`} value={accion.id}>
              {accion.descripcion}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    );
  };

  /**
   * Toast de validación cuando se ingresan fechas equivocadas
   *
   * @param {*} mensaje
   */
  mostrarToast = (mensaje) => {
    const opciones = {
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    toast.error(mensaje, opciones);
  };

  limpiarCampos = () => {
    const { modalCambioDatosFacturacionConj } = this.state;
    this.props.saveItem(undefined, "IdSuscripcion");
    this.setState({
      idSuscripcion: "",
      codAntSuscripcion: "",
      numCatastral: "",
      nombresApellidosTercero: "",
      documentoTercero: "",
      ciclo: "",
      documento: "",
      tipoDocumento: "",
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
      validated,
      idSuscripcion,
      ciclo,
      documento,
      documentoTercero,
      mostrarTablaResultados,
      nombresApellidosTercero,
      tipoDocumento,
      listaDetalleSuscripcion,
      numeroPqr,
      modalCambioDatos,
      pages,
      modalErrorListaVisible,
      modalListaErrorDatosVisible,
      numCatastral,
      codAntSuscripcion,
      openModalFacturacionConjuta,
      desde,
      hasta,
      limiteUsuario,
      admin,
      accionARealizar,
      modalCambioDatosFacturacionConj,
    } = this.state;

    const {
      preLoadIdRegister,
      listaCiclos,
      listaDocumentos,
      listaTiposDocumento,
      tittle,
      listaPqr,
      tipoNota,
      opcionesTer,
    } = this.props;

    return (
      <Fragment>
        <h1>{tittle}</h1>
        <h2>Formulario de búsqueda de los detalles de suscripción</h2>
        <Form validated={validated} onSubmit={this.handleSubmit}>
          {openModalFacturacionConjuta && (
            <FormFacturacionConjunta closeModal={this.closeModal}
              /*changeFilterValues={this.changeFilterValues}*/ />
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
            <div>
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
                <Form.Group as={Col} md="4">
                  <Form.Label>Id de suscripción</Form.Label>
                  <Form.Control
                    id="idSuscripcion"
                    value={
                      !!preLoadIdRegister
                        ? preLoadIdRegister.suscripcionAseo
                        : idSuscripcion
                    }
                    onChange={this.handleChangeText}
                    required={nombresApellidosTercero != "" ? true : false}
                    type="number"
                    placeholder="Número de la suscripción"
                    onBlur={this.handleBlurFormIdSuscripcion}
                    onClick={this.handleClickFormIdSuscripcion}
                  />

                  <Form.Control.Feedback type="invalid">
                    Campo obligatorio si se diligencia nombres de tercero
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Cod. ant de suscripción</Form.Label>
                  <Form.Control
                    id={"codAntSuscripcion"}
                    value={codAntSuscripcion}
                    onChange={this.handleChangeText}
                    type="number"
                    placeholder="Código anterior"
                  />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Número catastral</Form.Label>
                  <Form.Control
                    id={"numCatastral"}
                    value={numCatastral}
                    onChange={this.handleChangeText}
                    type="number"
                    placeholder="Número catastral"
                  />
                </Form.Group>
              </Form.Row>
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
                />

                <Form.Group as={Col} md="4">
                  <Form.Label>Documento del tercero</Form.Label>
                  <Form.Control
                    id={"documentoTercero"}
                    value={documentoTercero}
                    required={
                      idSuscripcion != "" &&
                        nombresApellidosTercero == "" &&
                        !preLoadIdRegister
                        ? true
                        : false
                    }
                    onChange={this.handleChangeText}
                    type="number"
                    placeholder="Documento"
                    onBlur={this.handleBlurFormDocumentoTercero}
                  />
                  <Form.Control.Feedback type="invalid">
                    Campo obligatorio si se diligencia id de suscripción sin
                    nombre de tercero
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Ciclo</Form.Label>
                  <Form.Control
                    as="select"
                    custom
                    value={ciclo}
                    disabled={
                      idSuscripcion ||
                        (documento &&
                          tipoDocumento) /*|| (!periodoDesde && !periodoHasta)*/
                        ? false
                        : true
                    }
                    onChange={(e) => this.setState({ ciclo: e.target.value })}
                  >
                    <option value={""}>-- N/A --</option>
                    {!!listaCiclos &&
                      listaCiclos.data.map((cicloX, index) => (
                        <option
                          key={`ciclo-${index}`}
                          value={cicloX.cicIderegistro}
                        >
                          {cicloX.cicNombre}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </Form.Row>
              {!!accionARealizar && accionARealizar == "1" && (
                <Form.Row>
                  <Form.Group as={Col} md="4">
                    <Form.Label>Documento</Form.Label>
                    <Form.Control
                      as="select"
                      custom
                      required={tipoDocumento != "" ? true : false}
                      value={documento}
                      onChange={(e) =>
                        this.setState({ documento: e.target.value }, () => {
                          this.consultarTipoDocumento();
                        })
                      }
                    >
                      <option value={""}>-- N/A --</option>
                      {!!listaDocumentos &&
                        listaDocumentos.data.map((documentoX, index) => (
                          <option
                            key={`doc-${index}`}
                            value={documentoX.uniDocumento}
                          >
                            {documentoX.uniNombre1}
                          </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Campo obligatorio si se selecciona un tipo de documento
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>Tipo de documento</Form.Label>
                    <Form.Control
                      as="select"
                      required={documento != "" ? true : false}
                      value={tipoDocumento}
                      onChange={(e) =>
                        this.setState({ tipoDocumento: e.target.value })
                      }
                    >
                      <option value={""}>-- N/A --</option>
                      {!!listaTiposDocumento &&
                        listaTiposDocumento.data.map((tipoDocumentoX, index) => (
                          <option
                            key={`tipDoc-${index}`}
                            value={tipoDocumentoX.uniTipDocument}
                          >
                            {tipoDocumentoX.uniNombre1}
                          </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Campo obligatorio si se selecciona un documento
                    </Form.Control.Feedback>
                  </Form.Group>
                  <DateBoxG
                    id={"desde"}
                    label={"Fecha desde"}
                    value={desde}
                    onChange={this.actualizarVigencia}
                    required={true}
                    max={hasta}
                    min={!!admin ? "" : limiteUsuario}
                  />
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
              )}
              <Button
                className={"margin-r"}
                type="submit"
                disabled={
                  !idSuscripcion &&
                  !ciclo &&
                  !documento &&
                  !documentoTercero &&
                  !nombresApellidosTercero &&
                  !tipoDocumento &&
                  !numCatastral &&
                  !codAntSuscripcion &&
                  !preLoadIdRegister
                }
              >
                Buscar
              </Button>
              <Button onClick={this.limpiarCampos}>Limpiar</Button>
            </div>
          )}
        </Form>
        <hr style={{ borderTop: "1px solid #007bff" }} />

        <Form className="inline-form" inline onSubmit={this.handleSubmitPqr}>
          <Form.Group controlId="validacionRdicadoPqr">
            <Form.Label>Número de radicado PQR</Form.Label>
            <Form.Control
              value={numeroPqr}
              onChange={(e) => this.setState({ numeroPqr: e.target.value })}
              type="number"
              placeholder="Número de PQR"
            />
          </Form.Group>
          <Button type="submit" disabled={!numeroPqr}>
            Buscar PQR
          </Button>
        </Form>

        <hr style={{ borderTop: "1px solid #007bff" }} />
        <div className="mt-2">
          {!!listaPqr && listaPqr.data.length > 0 && (
            <TablaConsultaPQR listaPqr={listaPqr.data} tipoNota={tipoNota} />
          )}
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
        </div>
        <div className="pt-3">
          {mostrarTablaResultados && (
            <RTablaDetalleSuscripcion
              listaDetalleSuscripcion={listaDetalleSuscripcion}
              idSuscripcion={idSuscripcion}
              nombresApellidosTercero={nombresApellidosTercero}
              documentoTercero={documentoTercero}
              ciclo={ciclo}
              documento={documento}
              tipoDocumento={tipoDocumento}
              fechaDesde={accionARealizar == "1" ? desde : ""}
              fechaHasta={accionARealizar == "1" ? hasta : ""}
              codAntSuscripcion={codAntSuscripcion}
              numCatastral={numCatastral}
              pages={pages}
            />
          )}
        </div>
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
        <ToastContainer
          position="top-right"
          autoClose={4500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  preLoadIdRegister: state.Items.IdSuscripcion,
  listaDocumentos: state.Utils.listaDocumentos,
  listaCiclos: state.Utils.listaCiclos,
  listaTiposDocumento: state.Utils.listaTiposDocumento,
  listaPqr: state.Utils.listaPqr,
  listaDetalleSuscripcion: state.Utils.listaDetalleSuscripcion,
  admin: state.Utils.permisosUsuario,
  banderaDeshahTabla: state.Items.banderaDeshahTabla,
  tipoNota: state.Items.tipoNota,
  opcionesTer: state.Utils.opcionesTercero,
  rrellamarServicio: state.Items.rrellamarServicio,
  newPage: state.Items.newPage,
  returnPage: state.Items.returnPage,
  pageSize: state.Items.pageSize,
});

const mapDispatchToProps = {
  saveItem,
  consultaGet,
  saveConsultaGet,
};

export const FormDetalleSuscripcion = connect(
  mapStateToProps,
  mapDispatchToProps
)(RFormDetalleSuscripcion);
