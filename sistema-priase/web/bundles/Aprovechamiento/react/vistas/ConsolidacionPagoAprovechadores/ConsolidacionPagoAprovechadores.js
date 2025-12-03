import React, {Component, Fragment} from "react";
import connect from "react-redux/es/connect/connect";
import {Button, Col, Form, Row} from "react-bootstrap";
import {SpinnerDotted} from 'spinners-react';
import './ConsolidacionPagoAprovechadores.scss'
import RUTAS_API from "../../global/rutas_api";
import {consultaGetAprovechamiento, postServiceR} from "../../store/actions/Utils";
import ModalCambioDatos from "../ParametrizacionLiquidacion/utils/Modals/ModalCambioDatos"
import moment from "moment";
import { saveItem } from "../../store/actions/Items";
import { PROGRAMAS } from "../../global/constantes"
import { RTablaConsolidadoFacturas } from './ResumenConsolidado/TablaConsolidadoAprovechamiento'
import {RTablaConsolidadoIncentivoApro} from './ResumenConsolidado/TablaConsolidadoIncentivoApro'
import { mostrarCargador } from "../../store/actions/AplicacionAcciones";

class ConsolidacionPagoAprovechadoresInt extends Component {

  constructor(props) {
    super(props);

  }

  state = {
    isLoading: false,
    cantidadProcesada: 0,
    deshabilitarLiquidacion: false,
    //Variables de control de validación de los formularios
    validated: false,
    // Variables de control de los campos de fecha en el formulario de búsqueda
    from: moment().format("YYYY-MM-DD"),
    to: moment().format("YYYY-MM-DD"),
    tab1: 'nav-link tab-liquidacion active',
    tab2: 'nav-link tab-liquidacion',
    mensajeError: '',
    mensajeProgreso: 'Un momento por favor se está procesando la consolidación de información de incentivo de aprovechamiento ',
    tipoApro: 'TIPO_APROVECHAMIENTO'

  };
  mensajeTermino = 'El proceso ha terminado ';
  nombreTimer;
  //tipoApro = 'TIPO_APROVECHAMIENTO';


  componentDidMount() {
    this.validarEstadoInicial();
    this.cargarPeriodo();
  }

  cargarPeriodo = async () => {
    await this.props.consultaGetAprovechamiento(
      RUTAS_API.LIQUIDACION_APROVECHAMIENTO.CONSULTA_PERIODO_LIQUIDAR,
      {},
      {},
      "periodoLiquidacion"
    );
    if (this.props.periodoLiquidacion && this.props.periodoLiquidacion.data.mensaje) {
      this.setState({ mensajeError: this.props.periodoLiquidacion.data.mensaje, deshabilitarLiquidacion: true });
    }
  };

  validarEstadoInicial = async () => {
    await this.consultarEstado(this.state.tipoApro);
    if (this.props.estadoLiquidacion &&
      this.props.estadoLiquidacion.data.estadoProceso == '1') {
      await this.validacionRecursiva();
    }
  }

  consultarEstado = async (tipoApro) => {
    const params = {
      programa: !!tipoApro && tipoApro == 'TIPO_APROVECHAMIENTO' ? PROGRAMAS.PAR_LIQ_APROVE : PROGRAMAS.PAR_LIQ_INCEN_APROVE,
      tipoAprovechamiento: tipoApro
    }
    await this.props.consultaGetAprovechamiento(
      RUTAS_API.LIQUIDACION_APROVECHAMIENTO.PROGRESO_LIQUIDACION,
      params,
      {},
      "estadoLiquidacion"
    );

    if (this.props.estadoLiquidacion &&
      this.props.estadoLiquidacion.data.estadoProceso == '1'
    ) {
      this.setState({ deshabilitarLiquidacion: true, isLoading:true});
      if (this.props.estadoLiquidacion.data.cantidadRegistros) {
        this.setState({ cantidadProcesada: this.props.estadoLiquidacion.data.cantidadRegistros });
      }
    }

    if (this.props.estadoLiquidacion &&
      this.props.estadoLiquidacion.data.estadoProceso == '2'
    ) {
      this.setState({ deshabilitarLiquidacion: true, isLoading:true, mensajeProgreso: this.mensajeTermino});
      if (this.props.estadoLiquidacion.data.cantidadRegistros) {
        this.setState({ cantidadProcesada: this.props.estadoLiquidacion.data.cantidadRegistros});
      }
    }
  };

  validacionRecursiva = async (tipoAproParam) => {
    if (tipoAproParam) {
      this.setState({ tipoApro: tipoAproParam });
    }
    const { tipoApro } = this.state;
    let timerId = setTimeout(async () => {
      if (tipoAproParam) {
        await this.consultarEstado(tipoAproParam);
      } else {
        await this.consultarEstado(tipoApro);
      }
      if (
        this.props.estadoLiquidacion.data.estadoProceso == '0'
      ) {
        this.setState({ deshabilitarLiquidacion: false, isLoading: false });
        clearTimeout(timerId);
      }else if (
        this.props.estadoLiquidacion.data.estadoProceso == '2'
      ) {
        this.setState({ deshabilitarLiquidacion: false, isLoading: true });
        clearTimeout(timerId);
      }else {
        await this.validacionRecursiva();
      }
    }, 10000);
    this.nombreTimer = timerId
  };

  iniciarliquidacion = async () => {
    this.setState({ deshabilitarLiquidacion: true });
    const { tipoApro } = this.state;
    const { periodoLiquidacion } = this.props;

    const iniciarProceso = {
      idPeriodo: periodoLiquidacion.data.periodo.idPeriodo,
      anoCiclo: periodoLiquidacion.data.periodo.anoCiclo,
      idCiclo: periodoLiquidacion.data.periodo.idCiclo,
      fechaCorteFacturacion: periodoLiquidacion.data.periodo.fechaCorteFacturacion,
      fechaLimiteProcesamiento: periodoLiquidacion.data.periodo.fechaLimiteProcesamiento,
      programa: !!tipoApro && tipoApro == 'TIPO_APROVECHAMIENTO' ? PROGRAMAS.PAR_LIQ_APROVE : PROGRAMAS.PAR_LIQ_INCEN_APROVE,
      tipoAprovechamiento: tipoApro
    }
    await this.props.postServiceR(
      RUTAS_API.LIQUIDACION_APROVECHAMIENTO.INICIAR_LIQUIDACION,
      iniciarProceso,
      {},
      "liquidarProceso"
    );
    if (this.props.liquidarProceso && this.props.liquidarProceso.data.mensaje) {
      this.setState({
        mensajeError: this.props.liquidarProceso.data.mensaje,
        deshabilitarLiquidacion: false,
      });
    }else{
      this.validacionRecursiva();
      this.setState({isLoading: true});
    }

  };

  /**
   * Renderiza los tabs...
   */
  renderTabs = () => {

    return (
      <div>
        <ul className="nav nav-tabs">
          <li className="nav-item" onClick={(event => this.controlarTab(event, "tab1"))}>
            <a className={this.state.tab1} data-toggle="tab" href="#aprovechamiento" >Aprovechamiento</a>
          </li>
          <li className="nav-item" onClick={(event => this.controlarTab(event, "tab2"))}>
            <a className={this.state.tab2} data-toggle="tab" href="#incentivoAprovechamiento" >Incentivo
              Aprovechamiento</a>
          </li>
        </ul>
        <div className="contenedorLiquidacion">
          <div className="tab-content">
            <div id="aprovechamiento" className="container m-0 tab-pane active">
              {this.renderFormulario()}
            </div>
            <div id="incentivoAprovechamiento" className="container m-0 tab-pane fade">
              {this.renderFormulario()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderFormulario = () => {
    const {
      periodoLiquidacion,
    } = this.props;
    const { tipoApro} = this.state;
    return (
      <Form.Group>
        <Form.Row>
          <Form.Group as={Col} className="col-3">
            <Form.Label>Periodo</Form.Label>
            <Form.Control
              value={!!periodoLiquidacion && !!periodoLiquidacion.data.periodo ? periodoLiquidacion.data.periodo.perNombre : ""}
              readOnly={true}>
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col} className="col-3">
            <Form.Label>Fecha corte facturacion</Form.Label>
            <Form.Control value={
              !!periodoLiquidacion && !!periodoLiquidacion.data.periodo &&
                !!periodoLiquidacion.data.periodo.fechaCorteFacturacion ?
                moment(periodoLiquidacion.data.periodo.fechaCorteFacturacion).format("YYYY-MM-DD") : ""
            } readOnly={true}>
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col} className="col-3">
            <Form.Label>Fecha limite procesamiento</Form.Label>
            <Form.Control value={
              !!periodoLiquidacion && !!periodoLiquidacion.data.periodo &&
                !!periodoLiquidacion.data.periodo.fechaLimiteProcesamiento ?
                moment(periodoLiquidacion.data.periodo.fechaLimiteProcesamiento).format("YYYY-MM-DD") : ""
            } readOnly={true}>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} className="col-3">
            {
              !!periodoLiquidacion && !!!periodoLiquidacion.data.error &&
              <Button className="ml-2 butonLiquidar" disabled={this.state.deshabilitarLiquidacion} onClick={this.handleLiquidar}>Consolidar</Button>
            }
          </Form.Group>
        </Form.Row>
        {
          this.mostrarMsgLiquidacion()
        }
        {!!tipoApro && tipoApro == 'TIPO_APROVECHAMIENTO' && <RTablaConsolidadoFacturas param={tipoApro}/>}
        {!!tipoApro && tipoApro == 'TIPO_INCENTIVO_APROVECHAMIENTO' && <RTablaConsolidadoIncentivoApro param={tipoApro} />}
      </Form.Group>
    );
  }

  /**
   * @method
   * Método encargado de controlar el cambio de tabs
   * @param {String} tab Nombre del tab nuevo
   */
  controlarTab = (e, tab) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ isLoading: false, deshabilitarLiquidacion: false });
    
    if (tab == 'tab1') {
      //this.cambiarTab1();
      this.setState({
        tab1: 'nav-link tab-liquidacion active',
        tab2: 'nav-link tab-liquidacion',
        tipoApro: 'TIPO_APROVECHAMIENTO'
      });
      this.reimbocarConsultaEstado('TIPO_APROVECHAMIENTO');
    } else if (tab == 'tab2') {
      //this.cambiarTab2();
      this.setState({
        tab1: 'nav-link tab-liquidacion',
        tab2: 'nav-link tab-liquidacion active',
        tipoApro: 'TIPO_INCENTIVO_APROVECHAMIENTO'
      });
      this.reimbocarConsultaEstado('TIPO_INCENTIVO_APROVECHAMIENTO');
    }
  }
  reimbocarConsultaEstado = (tipoApro) => {
    if (this.nombreTimer) {
      clearTimeout(this.nombreTimer);
    }
    this.consultarEstado(tipoApro);
    this.validacionRecursiva(tipoApro);
  }

  cerrarModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ mensajeError: '' })
  }

  mostrarError = () => {
    const { mensajeError } = this.state
    if (mensajeError) {
      return (
        <ModalCambioDatos
          aceptarModal={this.cerrarModal}
          mensaje={mensajeError}
          titulo={"Algo salió mal"}
          aceptarOption={true}
          cancelar={false} />
      );
    }
  }

  mostrarMsgLiquidacion = () => {
    const { isLoading } = this.state
    if (isLoading) {
      return (
        <Fragment>
          <Row>
            <Col></Col>
            <Col xs={6} className='p-0'>
              <div className="text-center">
                <p className='text-primary'>
                  {`${this.state.mensajeProgreso} (Registros procesados: ${this.state.cantidadProcesada})`}
                </p>
              </div>
            </Col>
            {
              this.mostrarSpinner()
            }
            <Col></Col>
          </Row>
        </Fragment>
      );
    }
  }

  render() {
    return (
      <Fragment>
        {this.renderTabs()}
        {this.mostrarError()}
      </Fragment>
    );
  }

  handleLiquidar = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.saveItem(true, "deshabilitarLiquidacion");
    this.iniciarliquidacion();
  }

  mostrarSpinner() {
    const {isLoading} = this.state
    if (isLoading && this.props.estadoLiquidacion.data.estadoProceso == '1') {
      return (
        <Col xs={1} className='m-auto'>
          <div>
            <SpinnerDotted color='#007bff' size='30px'/>
          </div>
        </Col>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  periodoLiquidacion: state.Utils.periodoLiquidacion,
  estadoLiquidacion: state.Utils.estadoLiquidacion,
  liquidarProceso: state.Utils.liquidarProceso,
  deshabilitarLiquidacion: state.Items.deshabilitarLiquidacion,
});

const mapDispatchToProps = {
  consultaGetAprovechamiento,
  postServiceR,
  saveItem,
  mostrarCargador
};

export const ConsolidadoPagoAprovechador = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConsolidacionPagoAprovechadoresInt);

