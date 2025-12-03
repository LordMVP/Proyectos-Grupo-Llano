import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import { get as getProp } from 'object-path';
import PropTypes from 'prop-types';
import { Input, TextoNumerico, Botonera, Combo, Tabla, VentanaModal, Util } from 'appfuture-react';
import axios from 'axios';

import RUTAS_API from '../../../global/rutas_api';
import { mostrarAlerta } from '../../../store/actions/AplicacionAcciones';
import { SelectorMultiple } from '../../Utils/SelectorMultiple';

import { RConsultaReporteador } from '../ConsultaReporteador';
import './GestionReporteador.scss';

const formatosSalida = [
  {}
];

class GestionReporteador extends Component {

  state = {
    mostrarModalConsulta: false,

    // Datos de la entidad
    // ...

    // Estado de la aplicacion
    // ...

  };

  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
  }

  componentWillUnmount() {
    this.props.history.replace({ entidadEditar: null });
  }

  limpiarFormulario = (evento) => {
    this.setState({
      mostrarModalConsulta: false,

      // Datos de la entidad
      // ...

      // Estado de la aplicacion
      // ...

    });
  };

  componentWillUnmount() {
    this.limpiarFormulario();
  }

  obtenerFunciones = () => {
    return [
      { texto: 'Guardar', callback: this.guardarEntidad },
      { texto: 'Consultar', callback: this.consultarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  validarFormulario = () => {
    // Ejemplo Validacion
    if (false) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos un cargo de tipo AO&M para poder continuar.' } };
    }

    return { respuesta: true };
  };

  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    const entidadGuardar = {
      // Asignar datos de la entidad
    }

    // Reemplazar con ruta del Endpoint para guardar
    axios.post(RUTAS_API.XXXXXX, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  consultarEntidad = () => {
    this.setState({ mostrarModalConsulta: true });
  };

  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false
    });
  };

  cargarDatos = (entidad) => {
    this.setState({
      mostrarModalConsulta: false,
      // Cargar datos de la entidad
      // ...
    });
  };

  /**
   * Render Parámetros Generales.
   * @return {Component}
   */
  renderParametrosGenerales = () => {
    return (
      <div className='col-md-12'>
        <div className='content-grid'>
          <label className='title-grid'>Parámetros Generales</label>
          <div className='body-grid row'>
            <Combo
              opciones={formatosSalida}
              propTexto='texto'
              propValor='valor'
              label='Formato salida:'
              name='formatoSalida'
              value={this.state.formatoSalida}
              onChange={this.controlarCambio}
            />
            <Input
              label='Demilitador Registro:'
              value={this.state.demilitadorRegistro}
              onChange={this.controlarCambio}
              name='demilitadorRegistro'
            />
            <Input
              label='Demilitador Campo:'
              value={this.state.demilitadorCampo}
              onChange={this.controlarCambio}
              name='demilitadorCampo'
            />
            <TextoNumerico
              aceptaDecimales={false}
              aceptaNegativos={false}
              label='Tamaño máximo por página:'
              cols={3}
              value={this.state.tamanoPorPagina}
              onChange={this.controlarCambio}
              name='tamanoPorPagina'
            />
            <TextoNumerico
              aceptaDecimales={false}
              aceptaNegativos={false}
              label='Número máximo registros:'
              cols={3}
              value={this.state.numMaximoRegistros}
              onChange={this.controlarCambio}
              name='numMaximoRegistros'
            />
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renderiza el panel origen datos.
   * @return {Component}
   */
  renderOrigenDatos = () => {
    return (
      <div className='col-md-6 mt-5'>
        <div className='content-grid'>
          <label className='title-grid'>Origen Datos</label>
          <div className='body-grid'>
            <SelectorMultiple
              titulo='Origen Datos'
              propTexto='ptcoNombre'
              propValor='ptcIderegistro'
              seleccionarItem={this.props.seleccionarItem}
              lista={getProp(this.state, 'listaOrigenDatos', [])}
            />
            <div className='col-md-12'>
              <table className='table table-condensed table-striped table-hover'>
                <thead>
                  <tr>
                    <th>Origen</th>
                    <th>Principal</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    getProp(this.state, 'origenesDatos', []).map((origen, index) => {
                      return (
                        <tr key={index}>
                          <td>{origen.nombre}</td>
                          <td><label><input type="checkbox" value={origen.id} /> Si</label></td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renderiza el panel Celda datos.
   * @return {Component}
   */
  renderCeldaDatos = () => {
    return (
      <div className='col-md-6 mt-5'>
        <div className='content-grid'>
          <label className='title-grid'>Celda Datos</label>
          <div className='body-grid row'>
            <div className='col-11 row'>
              <Combo
                opciones={getProp(this.state, 'tablas', [])}
                propTexto='texto'
                propValor='valor'
                label='Tabla:'
                cols={6}
                name='tabla'
                value={this.state.tabla}
                onChange={this.controlarCambio}
              />
              <Combo
                opciones={getProp(this.state, 'columnas', [])}
                propTexto='texto'
                propValor='valor'
                label='Campo:'
                cols={6}
                name='columna'
                value={this.state.columna}
                onChange={this.controlarCambio}
              />
            </div>
            <div className='col-1'>
              <button className='btn btn-primary m-t-24' title='Agregar'>
                <i className='fa fa-fw fa-plus'></i>
              </button>
            </div>
            <div className='col-md-12'>
              <table className='table table-condensed table-striped table-hover'>
                <thead>
                  <tr>
                    <th>Tabla</th>
                    <th>Campo</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    getProp(this.state, 'origenesDatos', []).map((origen, index) => {
                      return (
                        <tr key={index}>
                          <td>{origen.nombre}</td>
                          <td><label><input type="checkbox" value={origen.id} /> Si</label></td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderDependenciaFuncional = () => {
    return (
      <div className='col-md-12 mt-5'>
        <div className='content-grid'>
          <label className='title-grid'>Dependencia Funcional</label>
          <div className='body-grid row'>
            <div className='col-12 row'>
              <Combo
                opciones={[]}
                propTexto='texto'
                propValor='valor'
                label='Tabla Origen Datos:'
                name='origenDatos'
                value={this.state.orgienDatos}
                onChange={this.controlarCambio}
              />
              <Combo
                opciones={[]}
                propTexto='texto'
                propValor='valor'
                label='Celda Origen Datos:'
                name='celdaOrigenDatos'
                value={this.state.celdaOrigenDatos}
                onChange={this.controlarCambio}
              />
              <div className='form-group col-3'>
                <button className='btn btn-primary m-t-24'>
                  <i className='fa fa-fw fa-plus'></i> Agregar
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderSeccionAgrupamiento = () => {
    return (
      <div className='col-md-6 mt-5'>
        <div className='content-grid'>
          <label className='title-grid'>Agrupamiento</label>
          <div className='body-grid'>
            <div className='row'>
              <Combo
                opciones={[]}
                propTexto='texto'
                propValor='valor'
                label='Tabla Origen:'
                name='tablaOrigen'
                cols={6}
                value={this.state.tablaOrigen}
                onChange={this.controlarCambio}
              />
              <Combo
                opciones={[]}
                propTexto='texto'
                propValor='valor'
                label='Campo:'
                name='campo'
                cols={6}
                value={this.state.campo}
                onChange={this.controlarCambio}
              />
              <div className='col-md-12'>
                <table className='table table-condensed table-striped table-hover'>
                  <thead>
                    <tr>
                      <th>Tabla Origen</th>
                      <th>Campo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      getProp(this.state, 'origenesDatos', []).map((origen, index) => {
                        return (
                          <tr key={index}>
                            <td>{origen.nombre}</td>
                            <td>{origen.campo}</td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderSeccionOrdenamiento = () => {
    return (
      <div className='col-md-6 mt-5'>
        <div className='content-grid'>
          <label className='title-grid'>Ordenamiento</label>
          <div className='body-grid'>
            <div className='row'>
              <Combo
                opciones={[]}
                propTexto='texto'
                propValor='valor'
                label='Tabla Origen:'
                name='tablaOrigen'
                cols={6}
                value={this.state.tablaOrigen}
                onChange={this.controlarCambio}
              />
              <Combo
                opciones={[]}
                propTexto='texto'
                propValor='valor'
                label='Campo:'
                name='campo'
                cols={6}
                value={this.state.campo}
                onChange={this.controlarCambio}
              />
              <div className='col-md-12'>
                <table className='table table-condensed table-striped table-hover'>
                  <thead>
                    <tr>
                      <th>Tabla Origen</th>
                      <th>Campo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      getProp(this.state, 'origenesDatos', []).map((origen, index) => {
                        return (
                          <tr key={index}>
                            <td>{origen.nombre}</td>
                            <td>{origen.campo}</td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <Fragment>
        <div className='d-flex justify-content-center'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>

        <div className='conf-general row mt-5'>
          {this.renderParametrosGenerales()}
          {this.renderOrigenDatos()}
          {this.renderCeldaDatos()}
          {this.renderDependenciaFuncional()}
          {this.renderSeccionAgrupamiento()}
          {this.renderSeccionOrdenamiento()}
        </div>

        <VentanaModal
          mostrar={this.state.mostrarModalConsulta}
          titulo='Consulta Reporteador'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaReporteador esModal seleccionarEntidad={this.cargarDatos} />
        </VentanaModal>
      </Fragment>
    );
  }
}

GestionReporteador.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionReporteador);

export { VistaRedux as RGestionReporteador };
