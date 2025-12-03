import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, TextoNumerico, VentanaDialogo } from 'appfuture-react';
import axios from 'axios';

import RUTAS_VISTA from '../../../../global/rutas_vista';
import RUTAS_API from '../../../../global/rutas_api';
import { limpiarDatosHistorico } from '../../../../global/util_nominaciones';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';

import './GestionEstadoContrato.scss';
import { CLASES_UNIDADES } from '../../../../global/constantes';

const CODIGO_ANULADO = 'E';

class GestionEstadoContrato extends Component {

  state = {
    mostrarModalConsulta: false,
    contrato: null,
    listaEstados: [],
    estadoContrato: '-1'
  };

  /**
   * Se ejecutará cuando se cargue la interfaz/componente.
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.consultarListaEstados((listaEstados) => {
        this.cargarDatos(state.entidadEditar, listaEstados);
      });
      this.consultarMotivos();
    }
  }

  /**
   * Consulta la lista de los estados...
   */
  consultarListaEstados = (callback) => {
    axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { idClase: CLASES_UNIDADES.ESTADOS_CONTRATO })
      .then(respuesta => {
        callback(respuesta.data.datos);
      });
  };

  /**
   * Método encargado de consultar los motivos para contratos anulados
   */
  consultarMotivos = () => {
    axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { idClase: CLASES_UNIDADES.MOTIVOS_ANULACION })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaMotivos: respuesta.data.datos });
        }
      });
  };

  /**
   * Limpiará el formulario seteando los valores del state.
   */
  limpiarFormulario = (evento) => {
    this.setState({
      contrato: null,
      estadoContrato: null,
      mostrarAlertaDialogo: false,
      mostrarModalAnulacion: false,
    });
    limpiarDatosHistorico('gestion_estado_contrato', this.props);
  };

  /**
   * Obtiene los botones de la interfaz.
   * @return {array}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Buscar', callback: this.buscarContrato },
      { texto: 'Actualizar', callback: this.actualizarEstado },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Valida el formulario, en este caso el estado del contrato.
   * @return {object}
   */
  validarFormulario = () => {
    if (this.state.estadoContrato == '-1' || this.state.estadoContrato === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el estado.' } };
    }

    return { respuesta: true };
  };

  /**
   * Mostrará el panel de búsqueda del contrato.
   */
  buscarContrato = () => {
    this.props.history.push({
      pathname: RUTAS_VISTA.CONSULTA_CONTRATOS.url,
      state: {
        interfazGestion: RUTAS_VISTA.GESTION_ESTADO_CONTRATO.url,
      }
    });
  };

  /**
   * Mostrará una alerta de confirmación de actualización del estado, si el usuario confirma la actualización ejecutará la actualización.
   * @returns {Boolean}
   */
  confirmarActualizacion = () => {
    const estado = this.state.estadoContrato;
    const listaEstados = this.state.listaEstados;
    const estadoSeleccionado = listaEstados.find(e => e.uniIderegistro == estado);
    if (estadoSeleccionado) {
      const codigoEstado = JSON.parse(estadoSeleccionado.uniPropiedad).estado;
      if (codigoEstado == CODIGO_ANULADO) {
        this.setState({ mostrarModalAnulacion: true });
        return;
      }
    }

    this.props.mostrarAlerta('Confirmar', 'Se actualizará el estado del contrato, ¿Desea continuar?', [
      { clase: 'btn btn-primary', callback: this.ejecutarActualizacionEstado, texto: 'Sí' },
      { clase: 'btn btn-default', texto: 'No' },
    ]);
  };

  /**
   * Ejecuta la petición al servidor para Actualizar el estado...
   * @returns {Boolean}
   */
  ejecutarActualizacionEstado = (anular = false) => {
    const { contrato, estadoContrato } = this.state;

    const entidadGuardar = {
      cntIderegistro: contrato.cntIderegistro,
      cntVersion: contrato.cntVersion,
      uniIdeestado: {
        uniIderegistro: estadoContrato
      },
    };
    if (anular) {
      entidadGuardar.uniMotivo = { uniIderegistro: this.state.motivo };
      entidadGuardar.cntObservacion = this.state.descripcionMotivo;
      if (!entidadGuardar.uniMotivo.uniIderegistro || entidadGuardar.uniMotivo.uniIderegistro < 0) {
        this.mostrarAlerta('Debes seleccionar un motivo.');
        return;
      }
      if ((typeof entidadGuardar.cntObservacion === 'string' && entidadGuardar.cntObservacion.trim() == '') || !entidadGuardar.cntObservacion) {
        this.mostrarAlerta('Debes ingresar la descripción del motivo.');
        return;
      }
    }

    // Reemplazar con ruta del Endpoint para guardar
    axios.post(RUTAS_API.CONTRATOS.ACTUALIZAR_ESTADO_CONTRATO, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Prepara el objeto y lo envia al servidor para actualizar el estado del contrato.
   * @returns {Boolean}
   */
  actualizarEstado = () => {
    const validacion = this.validarFormulario();

    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    //Confirmamos...
    this.confirmarActualizacion();
  };

  /**
   * Controla el cambio de los valores de los componentes.
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    change.mostrarAlertaDialogo = false;
    this.setState(change);
  };

  /**
   * Método encargado de cargar los datos del componente externo
   * @param {Object} entidad Entidad seleccionado
   * @param {Array} listaEstados Estados de contrato
   */
  cargarDatos = (entidad, listaEstados) => {
    this.setState({
      mostrarModalConsulta: false,
      contrato: entidad,
      listaEstados: listaEstados,
      estadoContrato: entidad.uniIdeestado.uniIderegistro
    });
  };

  /**
   * Obtiene el tipo de agente/tercero en base al tipo de negocio.
   * @return {string}
   */
  obtenerTipoNegocio = () => {
    const { cntTiponegocio } = this.state.contrato;
    return (cntTiponegocio === 'V') ? 'Cliente' : 'Proveedor';
  };

  /**
   * Obtiene los tipos de contrato de las propiedades que recibe de la tabla.
   * @return {string}
   */
  obtenerTiposContrato = () => {
    const listaTipos = this.state.contrato.listaTipos;
    if (!Array.isArray(listaTipos) || listaTipos.length == 0) {
      return 'Indefinido';
    }
    return listaTipos.map(tipo => {
      return tipo.uniIdetipocontrato.uniNombre1;
    }).join(',');
  };

  /**
   * Renderiza el formulario con los campos del detalle básico del contrato.
   * @return {Component}
   */
  renderFormularioDetallesContrato = () => {
    return (
      <div className="row mt-5">
        <Input
          label='Tipo Tercero:'
          value={this.obtenerTipoNegocio()}
          name='proveedor'
          extra={{ disabled: true }}
        />
        <Input
          label='Agente / Tercero:'
          value={this.state.contrato.terIdeagente.terNomcompleto}
          name='terNomcompleto'
          extra={{ disabled: true }}
        />
        <TextoNumerico
          aceptaDecimales={false}
          aceptaNegativos={false}
          label='Número Contrato:'
          cols={4}
          value={this.state.contrato.cntNumero}
          name='numeroContrato'
          extra={{ disabled: true }}
        />
        <Input
          label='Tipo Contrato:'
          value={this.obtenerTiposContrato()}
          name='tipoContrato'
          extra={{ disabled: true }}
        />
        <Input
          label='Fecha Inicio:'
          value={this.state.contrato.cntFechainicio}
          name='fechaInicio'
          extra={{ disabled: true }}
        />
        <Input
          label='Fecha Fin:'
          value={this.state.contrato.cntFechafin}
          name='fechaFin'
          extra={{ disabled: true }}
        />
        <Combo
          opciones={this.state.listaEstados}
          propTexto='uniNombre1'
          propValor='uniIderegistro'
          label='Estado:'
          name='estadoContrato'
          value={this.state.estadoContrato}
          onChange={this.controlarCambio}
        />
      </div>
    );
  };

  /**
   * Método encargado de cerrar el modal de anulación
   */
  callbackCerrarModal = () => {
    this.setState({ mostrarModalAnulacion: false });
  };

  /**
   * Método encargado de cancerlar la anulacion del contrato
   */
  cancelarAnulacion = () => {
    this.setState({ mostrarModalAnulacion: false });
  };

  /**
   * Método encargado de ejecutar la anulación del contrato
   */
  confirmarAnulacion = () => {
    this.ejecutarActualizacionEstado(true);
  };

  /**
   * Método encargado de mostrar el componente alerta
   * @param {String} mensaje Mensaje a mostrar
   */
  mostrarAlerta = (mensaje) => {
    this.setState({
      error: mensaje,
      mostrarAlertaDialogo: true,
    });
  };

  /**
   * Método encargado de mostrar el modal de anulacion
   * @returns {JSX}
   */
  renderModalAnulacion = () => {
    if (!this.state.mostrarModalAnulacion) {
      return null;
    }
    return (
      <Fragment>
        <div className="modal show fade" style={{ display: 'block', zIndex: 1042 }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title text-bold">Anular Contrato</h4>
              </div>
              <div className="modal-body">
                {
                  this.state.mostrarAlertaDialogo &&
                  (
                    <div class="alert alert-danger" role="alert" style={{ display: 'block' }}>
                      <strong>Error: </strong>{this.state.error}
                    </div>
                  )
                }
                <div className='row text-left'>
                  <Combo
                    opciones={this.state.listaMotivos}
                    propTexto='uniNombre1'
                    propValor='uniIderegistro'
                    label='Motivo:'
                    name='motivo'
                    value={this.state.motivo}
                    onChange={this.controlarCambio}
                    cols={6}
                  />
                  <div className='col-md-12'>
                    <label>Descripción:</label>
                    <textarea
                      name='descripcionMotivo'
                      onChange={this.controlarCambio}
                      className='form-control'
                    >{this.state.descripcionMotivo}</textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn btn-primary" onClick={this.confirmarAnulacion}>Confirmar</button>
                <button type="button" className="btn btn btn-default" onClick={this.cancelarAnulacion}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop show fade" role="presentation" style={{ 'zIndex': 1041 }}></div>
      </Fragment>
    );
  };

  /**
   * Devuelve el contenido que reendirazará el componente.
   * @return {Component}
   */
  render() {
    return (
      <Fragment>
        <div className='d-flex justify-content-center'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>
        {!this.state.contrato && (
          <div className="alert alert-warning alert-dismissible fade show mt-5" role="alert">
            <strong><i className='fa fa-fw fa-info'></i> Debe buscar un contrato</strong>
          </div>
        )}
        {
          this.state.contrato && this.renderFormularioDetallesContrato()
        }
        {this.renderModalAnulacion()}
      </Fragment>
    );
  }
}

GestionEstadoContrato.propTypes = {
  history: PropTypes.object,
  mostrarAlerta: PropTypes.func
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    mostrarAlerta,
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionEstadoContrato);

export { VistaRedux as RGestionEstadoContrato };
