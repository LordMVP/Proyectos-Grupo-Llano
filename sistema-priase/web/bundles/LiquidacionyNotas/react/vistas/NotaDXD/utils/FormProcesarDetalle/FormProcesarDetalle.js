import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";

//Componentes
import moment from "moment";
import DateBoxG from "../../../Utils/components/DateBoxG";
import { Button, Form, Col } from "react-bootstrap";
import RTablaDetalleFuturo from "../TablaDetalleFuturo/TablaDetalleFuturo";
import RTablaSuscripcionesReliquidadas from "../TablaSuscripcionesReliquidadas/TablaSuscripcionesReliquidadas";
import ColsTablaSuscripsREstrato from "../../../cambiosDeEstrato/ColsTablaSuscripsREstrato";
import ColsTablaSuscripsRDeshab from "../../../descuentoDeshabitado/ColsTablaSuscripsRDeshab";
import ColsTablaSuscripsRPaP from "../../../descuentoPuertaPuerta/ColsTablaSuscripsRPaP";
import ColsTablaSuscripsRTipoUso from "../../../cambiosTipoDeUso/ColsTablaSuscripsRTipoUso";
import ColsTablaSuscripsRAforo from "../../../aforoExtraordinario/ColsTablaSuscripsRAforo";
import ColsTablaSuscripsRDeudaEliminar from "../../../adicionEliminacionDeuda/ColsTablaSuscripsRDeudaEliminar";
import ColsTablaSuscripsRDeudaAdicionar from "../../../adicionEliminacionDeuda/ColsTablaSuscripsRDeudaAdicionar";
import { mostrarCargador } from "../../../../store/actions/AplicacionAcciones";
import { ModalConfirmacionGenerico } from "../FormDetalleSuscripcion/Modales/ModalConfirmacionGenerico";

//assets & styles
import "./FormProcesarDetalle.scss";

//Constants
import RUTAS_API from "../../../../global/rutas_api";
import {
  CONCEPTO_NOTA,
  SERVICIO_RELIQUIDACION,
  ACCIONES_A_REALIZAR_GENERAL,
  PROGRAMAS,
  ERRORES_PQR,
} from "../../../../global/constantes";

//Actions Redux
import { saveItem } from "../../../../store/actions/Items";
import {
  consultaGet,
  saveConsultaGet,
  postServiceR,
  savePostService,
} from "../../../../store/actions/Utils";

const accionRetroactivo = {
  id: ACCIONES_A_REALIZAR_GENERAL[0].id,
  descripcion: ACCIONES_A_REALIZAR_GENERAL[0].descripcion,
};

const accionTarifas = {
  id: ACCIONES_A_REALIZAR_GENERAL[1].id,
  descripcion: ACCIONES_A_REALIZAR_GENERAL[1].descripcion,
};

class RFormProcesarDetalle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pintarTablaMarcacion: false,
      pintarTablaReliquidadas: false,
      vigenciaDesde: moment().format("YYYY-MM-DD"),
      vigenciaHasta: moment().format("YYYY-MM-DD"),
      listaMarcacionTarifa: [],
      columns: [],
      holguraInicioVigencia: 0,
      timerid: "",
      eliminarSuscripcion: false,
      modalFacturasEnCero: false,
    };
  }

  componentDidMount() {
    this.cargarFechasProps();
    this.consultarHolguraInicioVigencia();
  }

  /**
   * Método encargado de actualizar en el state el valor de las fechas seleccionadas
   *
   * @param {*} evento
   */
  actualizarVigencia = (evento) => {
    this.setState({ [evento.target.id]: evento.target.value });
    this.props.saveItem(evento.target.value, [evento.target.id]);
  };

  /**
   * Método encargado de consultar los servicios de marcación o reliquidación según
   * la opción escogida en el select de accionARealizar
   *
   * @param {*} event
   */
  handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const {
      listaSuscripSeleccionadas,
      accionARealizar,
      tipoNota,
      fechaDesde,
      fechaHasta,
    } = this.props;
    const { eliminarSuscripcion } = this.state;
    let listaOriginal = this.validarLista(listaSuscripSeleccionadas);

    switch (tipoNota) {
      case PROGRAMAS.DESCUENTO_DESHABITADO:
        this.setState({ columns: ColsTablaSuscripsRDeshab });
        break;
      case PROGRAMAS.DESCUENTO_PUERTA_PUERTA:
        this.setState({ columns: ColsTablaSuscripsRPaP });
        break;
      case PROGRAMAS.CAMBIO_ESTRATO:
        this.setState({ columns: ColsTablaSuscripsREstrato });
        break;
      case PROGRAMAS.CAMBIO_TIPOUSO:
        this.setState({ columns: ColsTablaSuscripsRTipoUso });
        break;
      case PROGRAMAS.AFORO_EXTRAORDINARIO:
        this.setState({ columns: ColsTablaSuscripsRAforo });
        break;
      case PROGRAMAS.ADICION_ELIMINACION_DEUDA:
        if (accionARealizar == 1) {
          this.setState({ columns: ColsTablaSuscripsRDeudaAdicionar });
        } else {
          this.setState({ columns: ColsTablaSuscripsRDeudaEliminar });
        }
        break;
      default:
        break;
    }

    await this.props.saveItem(listaOriginal, "listaOriginal");

    const paramsReliquida = {
      liquidar: SERVICIO_RELIQUIDACION.RELIQUIDAR_SUSCRIPCIONES,
      suscripciones: listaOriginal,
      desde: fechaDesde,
      hasta: fechaHasta,
      tipnota: tipoNota,
    };

    if (!!accionARealizar && tipoNota == PROGRAMAS.ADICION_ELIMINACION_DEUDA) {
      if (accionARealizar == 2) {
        if (!!eliminarSuscripcion) {
          this.setState({ modalSuscripEliminadaConfirmacion: true, aceptarFacturasCero: true });
        } else {
          let listaFacturasEnCero = this.validarFacturasEnCero(listaOriginal, "valorEmitidoFactura");
          if (listaFacturasEnCero.length > 0) {
            this.setState({ modalFacturasEnCero: true, mensajeFacturasCero: "Solo se pueden procesar facturas cuyo valor sea superior a cero", aceptarFacturasCero: false })
          } else {
            this.procesarAdicionEliminacionDeuda(listaOriginal);
          }
        }
      } else {
        let listaFacturasEnCero = this.validarFacturasEnCero(listaOriginal, "valorAAjustar");
        if (listaFacturasEnCero.length > 0) {
          this.setState({ modalFacturasEnCero: true, mensajeFacturasCero: "Debe incluir valor a adicionar en todas las facturas seleccionadas", aceptarFacturasCero: false })
        } else {
          this.procesarAdicionEliminacionDeuda(listaOriginal);
        }
      }

    } else if (accionARealizar == accionTarifas.id) {

      this.props.savePostService(undefined, "listaMarcacionTarifa");
      this.props.saveItem(false, "pintarTablaReliquidadas");
      this.props.saveItem(true, "pintarTablaMarcacion");
      this.props.saveItem(false, "banderaDeshahTabla");

    } else if (accionARealizar == accionRetroactivo.id) {
      this.props.savePostService(undefined, "listaSuscripcionesReliquidadas");
      await this.props.postServiceR(
        RUTAS_API.LIQUIDACION.RELIQUIDACION,
        paramsReliquida,
        {},
        "reliquidacion"
      );

      if (!!this.props.reliquidacion && this.props.reliquidacion.status === 500) {
        this.setState({ modalFacturasEnCero: true, mensajeFacturasCero: "Hay un proceso en ejecución para el mismo tipo de nota, usuario y empresa", aceptarFacturasCero: false })
      } else {
        this.props.mostrarCargador(true);
        await this.validacionRecursiva();
      }

    }
  };

  /**
   * Método encargado de validar tras la selección de eliminación de código
   * si existen facturas con valor a cero, para permitir o no procesar
   */
  confirmarEliminacion = () => {
    const { listaSuscripSeleccionadas } = this.props;
    let listaOriginal = this.validarLista(listaSuscripSeleccionadas);
    this.setState({ modalSuscripEliminadaConfirmacion: false })
    let listaFacturasEnCero = this.validarFacturasEnCero(listaOriginal, "valorEmitidoFactura");
    if (listaFacturasEnCero.length > 0) {
      this.setState({ modalFacturasEnCero: true, mensajeFacturasCero: "Para proceder con la eliminación del código, debe seleccionar al menos una factura susceptible a eliminación de deuda", aceptarFacturasCero: false/*modalFacturasEnCero: true, mensajeFacturasCero: "Dado que existe/n una/s factura/s seleccionada/s cuyo valor es cero, solo se procederá con la eliminación del código, ¿Desea continuar?", aceptarFacturasCero: true*/ })
    } else {
      this.procesarAdicionEliminacionDeuda(listaOriginal);
    }
  }

  /**
   * Método encargado de hacer el llamado al modal que indicará cuando una o más facturas
   * a eliminar cuentan con un valor igual a cero
   */
  confirmarFacturasEnCero = () => {
    let listaOriginal = [];
    this.setState({ modalFacturasEnCero: false })
    this.procesarAdicionEliminacionDeuda(listaOriginal);
  }

  /**
   * Método encargado de cerrar los modales para los casos que se presentan con las validaciones
   * para eliminación de deuda
   */
  closeModalSuscripEliminada = () => {
    this.setState({ modalSuscripEliminada: false, modalSuscripEliminadaConfirmacion: false, modalFacturasEnCero: false });
  }

  /**
   * Método encargado de hacer el llamado al servicio de procesar una vez se cumplen todas las
   * validaciones en adición o eliminación de deuda
   * @param {*} listaOriginal 
   */
  procesarAdicionEliminacionDeuda = async (listaOriginal) => {
    const { accionARealizar, tipoNota, suscripcion, } = this.props;
    const { eliminarSuscripcion } = this.state;

    const paramsReliqDeuda = {
      adiciona: accionARealizar,
      facturas: listaOriginal,
      suselimina: eliminarSuscripcion,
      tiponota: tipoNota,
      suscripcion: suscripcion,
    }

    this.props.savePostService(undefined, "listaSuscripcionesReliquidadas");
    await this.props.postServiceR(
      RUTAS_API.LIQUIDACION.RELIQUIDACION_ADICION_ELIMINACION_DEUDA,
      paramsReliqDeuda,
      {},
      "reliquidacionDeuda"
    );

    this.props.mostrarCargador(true);
    await this.validacionRecursiva();
  }

  /**
   * Método encargado de validar en una lista los valores que se encuentren en cero a partir
   * del parámetro que recibe el método
   * @param {*} listaOriginal 
   * @param {*} parametro 
   * @returns 
   */
  validarFacturasEnCero = (listaOriginal, parametro) => {
    let resultadoDetallesSuscripcion =
      !!this.props.detallesSuscripcion.data &&
      this.props.detallesSuscripcion.data.data;
    let listaConCero = [];
    for (let i = 0; i < listaOriginal.length; i++) {
      const factura = resultadoDetallesSuscripcion.filter(
        (item) => item.facNumero == listaOriginal[i] && item[parametro] == 0
      );
      listaConCero = [...listaConCero, ...factura];
    }
    let listaServicioSuscripcion = listaConCero.map((item) => {
      return item;
    });
    return listaServicioSuscripcion;
  }

  /**
   * Método creado para ser recursivo y hacer el llamado a un servicio cada 30 segundos
   * que se detiene hasta recibir una respuesta específica, por motivos de negocio
   * 
   * El método se utiliza para validar el momento en que el proceso de reliquidación finaliza
   */
  validacionRecursiva = async () => {
    const { tipoNota } = this.props;
    const params = {
      tipoNota: tipoNota,
    };

    let timerId = setTimeout(async () => {
      await this.props.consultaGet(
        RUTAS_API.LIQUIDACION.CONSULTA_PROCESO_RELIQUIDACION,
        params,
        {},
        "validacionReliquidacion"
      );
      this.props.mostrarCargador(true);
      if (
        this.props.validacionReliquidacionR.data.codResp ==
        ERRORES_PQR.CODIGO_RESPUESTA_EXITOSA
      ) {
        this.props.mostrarCargador(false);
        this.props.saveItem(false, "pintarTablaMarcacion");
        this.props.saveItem(true, "pintarTablaReliquidadas");
        this.props.saveItem(false, "banderaDeshahTabla");
        clearTimeout(timerId);
      } else {
        this.validacionRecursiva();
      }
    }, 10000);
  };


  /**
   * Método encargado de retornar una lista limpia de los id de suscripción seleccionados
   * en la tabla de resultados de la aplicación
   *
   * @param {*} listaSuscripSeleccionadas
   */
  validarLista = (listaSuscripSeleccionadas) => {
    let listaReplace = [];
    listaSuscripSeleccionadas.forEach((item) => {
      item = item.replace("select-", "");
      listaReplace.push(item);
    });
    return listaReplace;
  };

  /**
   * Método encargado de cargar un valor inicial a las fechas
   */
  cargarFechasProps = () => {
    const { vigenciaDesde, vigenciaHasta } = this.state;
    this.props.saveItem(vigenciaDesde, "vigenciaDesde");
    this.props.saveItem(vigenciaHasta, "vigenciaHasta");
  };

  /**
   * Método encargado de consultar el parámetro de holgura correspondiente
   * a la fecha de vigencia desde, para definirlo como límite de selección
   */
  consultarHolguraInicioVigencia = async () => {
    const parametroHolgura = await this.props.consultaGet(
      RUTAS_API.PAR_PARAMETRO.CONSULTA_HOLGURA_INICIO_VIGENCIA,
      {},
      {},
      "parametroHolguraR"
    );
    this.setState({
      holguraInicioVigencia: parametroHolgura,
      vigenciaHasta: moment().add(parametroHolgura, "d").format("YYYY-MM-DD"),
    });
  };

  /**
   * Método encargado de manejar el cambio de valor del check de Eliminar suscripción
   * y de validar si ya se encuentra eliminada o no la suscripción
   * 
   * @param {*} checked 
   */
  onChangeCheckEliminarSuscripcion = (checked) => {
    const { detallesSuscripcion } = this.props;
    if (!!detallesSuscripcion && detallesSuscripcion.data.data.length > 0) {
      let suscripcionActual = detallesSuscripcion.data.data[0].estado;
      if (suscripcionActual != "E") {
        this.setState({ eliminarSuscripcion: !checked });
        this.props.saveItem(!checked, "eliminarSuscripcion");
      } else {
        this.setState({ modalSuscripEliminada: true });
      }
    }
  }

  /**
   * Método encargado de renderizar el formulario para que cuando se de clic en procesar
   * se oculte y cuando se realice una nueva búsqueda se muestre.
   * @returns
   */
  renderFormProcess = () => {
    const { vigenciaDesde, vigenciaHasta, holguraInicioVigencia, eliminarSuscripcion } = this.state;
    const { accionARealizar, listaSuscripSeleccionadas, tipoNota } = this.props;

    return (
      <Fragment>
        <h2>Tabla de resultados</h2>
        <Form onSubmit={this.handleSubmit}>
          <Form.Row>
            {!!accionARealizar && tipoNota == PROGRAMAS.ADICION_ELIMINACION_DEUDA && accionARealizar == 2 && (
              <div className="div-check-eliminar-suscrip">
                <input className="check-eliminar-suscrip" type="checkbox" id="checkEliminarSuscripcion"
                  onChange={() => { this.onChangeCheckEliminarSuscripcion(eliminarSuscripcion) }} checked={eliminarSuscripcion} />
                <label className="form-check-label" htmlFor="checkEliminarSuscripcion">Eliminar código</label>
              </div>
            )}
            {!!accionARealizar && tipoNota != PROGRAMAS.ADICION_ELIMINACION_DEUDA && accionARealizar == accionTarifas.id && (
              <Fragment>
                <DateBoxG
                  id={"vigenciaDesde"}
                  label={"Vigencia desde"}
                  value={vigenciaDesde}
                  onChange={this.actualizarVigencia}
                  min={moment().format("YYYY-MM-DD")}
                  max={moment()
                    .add(holguraInicioVigencia, "d")
                    .format("YYYY-MM-DD")}
                />
                <DateBoxG
                  id={"vigenciaHasta"}
                  label={"Vigencia hasta"}
                  value={vigenciaHasta}
                  onChange={this.actualizarVigencia}
                  min={vigenciaDesde}
                  max={moment().add(3, "M").format("YYYY-MM-DD")}
                />
              </Fragment>
            )}
            <Form.Group className="process-btn-container" as={Col} md="4">
              <Button
                type="submit"
                className="process-btn"
                disabled={
                  (!!listaSuscripSeleccionadas &&
                    listaSuscripSeleccionadas.length > 0)/* || !!eliminarSuscripcion*/
                    ? false
                    : true
                }
              >
                Procesar
              </Button>
            </Form.Group>
          </Form.Row>
        </Form>
        <hr style={{ borderTop: "1px solid #007bff" }} />
      </Fragment>
    );
  };

  render() {
    const {
      listaMarcacionTarifa,
      paginas,
      listaSuscripcionesReliquidadas,
      columns,
      listaSuscripSeleccionadas,
      modalSuscripEliminada,
      modalSuscripEliminadaConfirmacion,
      modalFacturasEnCero,
      mensajeFacturasCero,
      aceptarFacturasCero,
    } = this.state;
    const {
      banderaDeshahTabla,
      pintarTablaReliquidadas,
      pintarTablaMarcacion,
    } = this.props;
    return (
      <Fragment>
        {!!banderaDeshahTabla && this.renderFormProcess()}
        <div className="mt-2">
          {!!pintarTablaMarcacion && !banderaDeshahTabla && (
            <RTablaDetalleFuturo
              listaMarcacionTarifa={listaMarcacionTarifa}
              paginas={paginas}
            />
          )}
          {!!pintarTablaReliquidadas && !banderaDeshahTabla && (
            <RTablaSuscripcionesReliquidadas
              columns={columns}
              listaSuscripcionesReliquidadas={listaSuscripcionesReliquidadas}
              paginas={paginas}
              listaSuscripSeleccionadas={listaSuscripSeleccionadas}
            />
          )}
        </div>
        {!!modalSuscripEliminada && (
          <ModalConfirmacionGenerico
            closeModal={this.closeModalSuscripEliminada}
            tituloModal={"Aviso"}
            mensaje={"La suscripción ya se encuentra eliminada"}
            error={true}
          />
        )}
        {!!modalSuscripEliminadaConfirmacion && (
          <ModalConfirmacionGenerico
            aceptar={true}
            aceptModal={this.confirmarEliminacion}
            closeModal={this.closeModalSuscripEliminada}
            tituloModal={"Aviso"}
            mensaje={"Se eliminará el código de la suscripción, ¿Desea continuar?"}
            error={true}
          />
        )}
        {!!modalFacturasEnCero && (
          <ModalConfirmacionGenerico
            aceptar={aceptarFacturasCero}
            aceptModal={this.confirmarFacturasEnCero}
            closeModal={this.closeModalSuscripEliminada}
            tituloModal={"Aviso"}
            mensaje={mensajeFacturasCero}
            error={true}
          />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  accionARealizar: state.Items.AccionARealizar,
  banderaDeshahTabla: state.Items.banderaDeshahTabla,
  fechaDesde: state.Items.desde,
  fechaHasta: state.Items.hasta,
  tipoNota: state.Items.tipoNota,
  listaMarcacionTarifa: state.Utils.listaMarcacionTarifa,
  listaSuscripcionesReliquidadas: state.Utils.listaSuscripcionesReliquidadas,
  parametroHolgura: state.Utils.parametroHolguraR,
  pintarTablaMarcacion: state.Items.pintarTablaMarcacion,
  pintarTablaReliquidadas: state.Items.pintarTablaReliquidadas,
  validacionReliquidacionR: state.Utils.validacionReliquidacion,
  detallesSuscripcion: state.Utils.detallesSuscripcion,
  listaOriginal: state.Items.listaOriginal,
  reliquidacion: state.Utils.reliquidacion,
});

const mapDispatchToProps = {
  saveItem,
  consultaGet,
  saveConsultaGet,
  postServiceR,
  savePostService,
  mostrarCargador,
};

export const FormProcesarDetalle = connect(
  mapStateToProps,
  mapDispatchToProps
)(RFormProcesarDetalle);
