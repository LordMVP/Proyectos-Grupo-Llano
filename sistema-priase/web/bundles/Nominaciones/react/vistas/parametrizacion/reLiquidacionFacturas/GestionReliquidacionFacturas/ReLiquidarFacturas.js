import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import RUTAS_VISTA from '../../../../global/rutas_vista';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { limpiarHistorico } from '../../../../global/util_nominaciones';
import './GestionReliquidacionFacturas.scss';

class ReLiquidarFacturas extends Component {

  state = {
    // Datos de la entidad
    listaContratos: [],
    cargoAomNuevo: '',
    cargoFijoNuevo: '',
    cargoVariableNuevo: '',
    cargoVariableActual: '',
    cargoFijoActual: '',
    cargoAomActual: '',
    descripcion: '',
    idEditar: '',
    tercero: {},
    // Estado de la aplicacion
    mostrarModalConsulta: false,
    mostrarFormularioEditar: false,
  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.consultarContratosTercero(state.entidadEditar);
    }
  };

  /**
   * Método encargado de formar el objeto con los contratos consultados
   * @param {Object} datos Datos de los contratos consultados
   * @returns {Object}
   */
  agregarIdEditar = (datos) => {
    const objeto = JSON.parse(datos);
    if (!objeto.detalleFactura) {
      this.props.mostrarAlerta('Atención', 'No se encontraron datos de facturación.');
      return [];
    }
    objeto.detalleFactura.forEach(dato => {
      dato.idEditar = Util.generarIdControl(dato.contrato.cntIderegistro);
    });
    return objeto.detalleFactura;
  };

  /**
   * Método encargado de cargar los datos del tercero seleccionado
   * @param {Object} tercero Datos del tercero seleccionado
   */
  consultarContratosTercero = async (tercero) => {
    const respuesta = await axios.post(RUTAS_API.PARAMETRIZACION.RELIQUIDACION_TRANSPORTE.CONSULTAR_DATOS_TERCERO, { idtercero: tercero.terIderegistro });
    if (respuesta.data.codigo > 0) {
      let datos = this.agregarIdEditar(respuesta.data.datos);
      this.setState({
        listaContratos: datos,
        tercero: tercero
      });
    }
  };

  /**
   * Método encargado ejecutar una acción cuando se elimina el componente
   */
  componentWillUnmount() {
    this.props.history.replace({ entidadEditar: null });
  };

  /**
   * Método encargado de limpiar los campos del formulario
   */
  limpiarFormulario = () => {
    this.setState({
      // Datos de la entidad
      listaContratos: [],
      cargoAomNuevo: '',
      cargoFijoNuevo: '',
      cargoVariableNuevo: '',
      cargoVariableActual: '',
      cargoFijoActual: '',
      cargoAomActual: '',
      descripcion: '',
      idEditar: '',
      tercero: {},
      // Estado de la aplicacion
      mostrarModalConsulta: false,
      mostrarFormularioEditar: false,
    });
    limpiarHistorico(this.props);
  };

  /**
   * Método encargado de limpiar el formulario al momento de salir
   */
  componentWillUnmount() {
    this.limpiarFormulario();
  };

  /**
   * Método encargado de generar los botones del formulario
   * @returns {Object}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Guardar', callback: this.guardarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    const { listaContratos } = this.state;
    const listaSeleccionados = listaContratos.filter(p => p.seleccionado);
    if (!Util.validarArreglo(listaSeleccionados)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos un contrato' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de validar las variables del formulario para reliquidar
   * @returns {Object}
   */
  validarFormularioReliquidar = () => {
    const { cargoAomNuevo, cargoFijoNuevo, cargoVariableNuevo, descripcion } = this.state;
    if (cargoAomNuevo == '' || cargoAomNuevo == null) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar un valor para el cargo AOM.' } };
    }
    if (cargoFijoNuevo == '' || cargoFijoNuevo == null) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar un valor para el cargo fijo.' } };
    }
    if (cargoVariableNuevo == '' || cargoVariableNuevo == null) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar un valor para el cargo variable.' } };
    }
    if (descripcion == '' || descripcion == null) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar una descripción.' } };
    }
    return { respuesta: true };
  };

  /**
   * Método encargado de construir el objeto para guardar la renominación
   * @returns {Object}
   */
  construirObjetoGuardar = () => {
    return this.state.listaContratos.filter(p => p.seleccionado).map(dato => {
      return {
        cargoAom: dato.lqcCargoaom,
        cargoVariable: dato.lqcCargovariable,
        cargoFijo: dato.lqcCargofijo,
        saldoCargo: {
          cntIdecontrato: {
            cntIderegistro: dato.contrato.cntIderegistro
          },
          slcDiferenciacargoaom: (dato.lqcCargoaomDiferencia) ? dato.lqcCargoaomDiferencia : 0,
          slcDiferenciacargovariable: (dato.lqcCargovariableDiferencia) ? dato.lqcCargovariableDiferencia : 0,
          slcDiferenciacargofijo: (dato.lqcCargofijoDiferencia) ? dato.lqcCargofijoDiferencia : 0,
          slcDescripcion: dato.descripcion
        }
      }
    });
  }

  /**
   * Método encargado de guardar los datos de la entidad
   * @returns {bool}
   */
  guardarEntidad = async () => {
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    const entidadGuardar = this.construirObjetoGuardar();

    const respuesta = await axios.post(RUTAS_API.PARAMETRIZACION.RELIQUIDACION_TRANSPORTE.GUARDAR, entidadGuardar);
    if (respuesta.data.codigo > 0) {
      this.limpiarFormulario();
    }
  };

  /**
    * Método encargado de abrir la interfaz de consulta de terceros.
    */
  consultarTercero = () => {
    this.props.history.push({
      pathname: RUTAS_VISTA.CONSULTA_TERCEROS.url,
      state: {
        interfazGestion: RUTAS_VISTA.RELIQUIDACION_TRANSPORTE.url,
      }
    });
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambioCargos = (evento) => {
    const { idEditar, listaContratos } = this.state;
    let { cargoAomActual, cargoFijoActual, cargoVariableActual,
      cargoAomNuevo, cargoFijoNuevo, cargoVariableNuevo
    } = this.state;
    const index = listaContratos.findIndex(p => p.idEditar == idEditar);
    const contrato = { ...listaContratos[index] };
    const { name, value } = evento.target;
    if (name == 'cargoFijoNuevo') {
      cargoFijoActual = (contrato.lqcCargofijo - value);
      cargoFijoNuevo = value;
    }
    if (name == 'cargoVariableNuevo') {
      cargoVariableActual = (contrato.lqcCargovariable - value);
      cargoVariableNuevo = value;
    }
    if (name == 'cargoAomNuevo') {
      cargoAomActual = (contrato.lqcCargoaom - value);
      cargoAomNuevo = value;
    }
    this.setState({
      cargoFijoActual: cargoFijoActual,
      cargoAomActual: cargoAomActual,
      cargoVariableActual: cargoVariableActual,
      cargoVariableNuevo: cargoVariableNuevo,
      cargoAomNuevo: cargoAomNuevo,
      cargoFijoNuevo: cargoFijoNuevo
    });
  };

  /**
   * Método encargado de reliquidar el contrato seleccionado
   * @returns {bool}
   */
  reliquidar = () => {
    const { cargoAomNuevo, cargoFijoNuevo, cargoVariableNuevo,
      cargoAomActual, cargoFijoActual, cargoVariableActual,
      idEditar, listaContratos, descripcion } = this.state;
    const validarReliquidar = this.validarFormularioReliquidar();
    if (!validarReliquidar.respuesta) {
      this.props.mostrarAlerta(validarReliquidar.mensaje.titulo, validarReliquidar.mensaje.mensaje);
      return false;
    }
    const index = listaContratos.findIndex(p => p.idEditar == idEditar);
    listaContratos[index].lqcCargoaom = cargoAomNuevo;
    listaContratos[index].lqcCargovariable = cargoVariableNuevo;
    listaContratos[index].lqcCargofijo = cargoFijoNuevo;
    listaContratos[index].lqcCargoaomDiferencia = cargoAomActual;
    listaContratos[index].lqcCargovariableDiferencia = cargoFijoActual;
    listaContratos[index].lqcCargofijoDiferencia = cargoVariableActual;
    listaContratos[index].descripcion = descripcion;
    this.setState({
      listaContratos: listaContratos,
      cargoAomNuevo: '',
      cargoFijoNuevo: '',
      cargoVariableNuevo: '',
      idEditar: '',
      descripcion: '',
      mostrarFormularioEditar: false
    });
  };

  /**
   * Método encargado de mostrar el formulario para editar los cargos
   * @returns {Object}
   */
  renderEditarCargos = () => {
    return (
      <Fragment>
        <TextoNumerico
          aceptaDecimales={false}
          aceptaNegativos={false}
          label='Cargo Fijo:'
          cols={3}
          value={this.state.cargoFijoNuevo}
          onChange={this.controlarCambioCargos}
          name='cargoFijoNuevo'
        />
        <TextoNumerico
          aceptaDecimales={false}
          aceptaNegativos={false}
          label='Cargo Variable:'
          cols={3}
          value={this.state.cargoVariableNuevo}
          onChange={this.controlarCambioCargos}
          name='cargoVariableNuevo'
        />
        <TextoNumerico
          aceptaDecimales={false}
          aceptaNegativos={false}
          label='Cargo Fijo:'
          cols={3}
          value={this.state.cargoAomNuevo}
          onChange={this.controlarCambioCargos}
          name='cargoAomNuevo'
        />
        <div className='form-group col-3'>

          <button className='btn btn-primary form-control botonCentrado' onClick={this.reliquidar}>Editar</button>
        </div>
        <Input
          label='Diferencia Cargo Fijo:'
          cols={4}
          value={this.state.cargoFijoActual}
          extra={{ disabled: true, readOnly: true }}
          name='cargoFijoActual'
        />
        <Input
          label='Diferencia Cargo Variable:'
          cols={4}
          value={this.state.cargoVariableActual}
          extra={{ disabled: true, readOnly: true }}
          name='cargoVariableActual'
        />
        <Input
          label='Diferencia Cargo AOM:'
          cols={4}
          value={this.state.cargoAomActual}
          extra={{ disabled: true, readOnly: true }}
          name='cargoAomActual'
        />
        <label htmlFor='descripcion'>
          Descripción:
                </label>
        <textarea
          name='descripcion'
          id='descripcion'
          value={this.state.descripcion}
          onChange={this.controlarCambio}
          className='form-control'
          rows='3'
          placeholder='Descripción'
        >
        </textarea>
      </Fragment>
    );
  };

  /**
   * Método encargado de mostrar el formulario para editar con los respectivos valores de los cargos
   * @param {number} posicion Posicion de la lista.
   */
  mostrarEditar = (posicion) => {
    const lista = [...this.state.listaContratos];
    const contrato = { ...lista[posicion] };
    this.setState({
      cargoVariableActual: contrato.lqcCargovariable,
      cargoFijoActual: contrato.lqcCargofijo,
      cargoAomActual: contrato.lqcCargoaom,
      cargoAomNuevo: contrato.lqcCargoaom,
      cargoFijoNuevo: contrato.lqcCargofijo,
      cargoVariableNuevo: contrato.lqcCargoaom,
      idEditar: contrato.idEditar,
      mostrarFormularioEditar: true
    });
  };

  /**
   * Controla el evento change de los checks de la tabla usuarios.
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambioCheck = (evento) => {
    const contratos = [...this.state.listaContratos];
    const value = evento.target.value;
    const index = contratos.findIndex(c => c.contrato.cntIderegistro == value);
    const contrato = { ...contratos[index] };
    contrato.seleccionado = evento.target.checked;
    contratos[index] = contrato;
    this.setState({ listaContratos: contratos });
  };

  /**
   * Método encargado de mostrar la tabla con los contratos del tercero seleccionado
   * @returns {Component}
   */
  renderTablaContratosTercero = () => {
    return (
      <table className='table-normaliced table table-condensed table-bordered'>
        <thead>
          <tr>
            <th>Seleccion</th>
            <th>Contrato</th>
            <th>Fecha Inicial</th>
            <th>Fecha Final</th>
            <th>Cargo Fijo</th>
            <th>Cargo Variable</th>
            <th>Cargo AOM</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {this.state.listaContratos.map((dato, index) => {
            return (
              <tr key={Util.generarIdControl(dato.contrato.cntIderegistro)}>
                <td>
                  <label>
                    <input
                      type="checkbox"
                      name={Util.generarIdControl('check_' + index)} checked={dato.seleccionado || false}
                      value={dato.contrato.cntIderegistro}
                      onChange={this.controlarCambioCheck} />
                    Seleccionar</label>
                </td>
                <td>{dato.contrato.cntNumero}</td>
                <td>{dato.lcfFechainicio}</td>
                <td>{dato.lcfFechafinal}</td>
                <td>{dato.lqcCargofijo}</td>
                <td>{dato.lqcCargovariable}</td>
                <td>{dato.lqcCargoaom}</td>
                <td><a href="javascript:;" onClick={() => { this.mostrarEditar(index) }} title='Editar Cargos'>Editar</a></td>
              </tr>
            )
          })
          }
        </tbody>
      </table>
    )
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />
        <div className='conf-general row mt-5'>
          <div className='form-group col-4'>
            <label>Tercero:</label>
            <div className='input-group'>
              <input
                type='text'
                disabled={true}
                className='form-control'
                onChange={this.controlarCambio}
                name='tercero'
                placeholder='Seleccionar Tercero'
                value={(this.state.tercero.terNomcompleto) ? this.state.tercero.terNomcompleto : ''}
              />
              <div className='input-group-btn'>
                <button className='btn btn-primary' onClick={this.consultarTercero}><i className='fa fa-fw fa-search'></i></button>
              </div>
            </div>
          </div>
          {Util.validarArreglo(this.state.listaContratos) &&
            this.renderTablaContratosTercero()
          }
          {this.state.mostrarFormularioEditar &&
            this.renderEditarCargos()
          }
        </div>
      </Fragment>
    );
  };
}

ReLiquidarFacturas.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ReLiquidarFacturas);

export { VistaRedux as RReLiquidarFacturas };
