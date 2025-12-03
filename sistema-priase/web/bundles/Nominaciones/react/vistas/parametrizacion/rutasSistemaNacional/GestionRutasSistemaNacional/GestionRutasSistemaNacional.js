import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util } from 'appfuture-react';
import axios from 'axios';

import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { RConsultaTramos } from '../../tramos/ConsultaTramos';

import { RConsultaRutasSistemaNacional } from '../ConsultaRutasSistemaNacional';
import './GestionRutasSistemaNacional.scss';

class GestionRutasSistemaNacional extends Component {

  state = {
    mostrarModalConsulta: false,

    // Datos de la entidad
    idRuta: null,
    nombreRuta: '',
    tramosSeleccionados: [],

    // Estado de la aplicacion
    mostrarModalTramos: false,

  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
  };

  /**
   * Método encargado de limpiar el formulario al momento de salir
   */
  componentWillUnmount() {
    this.limpiarFormulario();
    this.props.history.replace({ entidadEditar: null });
  };

  /**
   * Método encargado de limpiar los campos del formulario
	 * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  limpiarFormulario = (evento) => {
    this.setState({
      // Datos de la entidad
      nombreRuta: '',
      tramosSeleccionados: [],
      // Estado de la aplicacion
      mostrarModalConsulta: false,

    });
  };

  /**
   * Método encargado de generar los botones del formulario
	 * @returns {Object}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Guardar', callback: this.guardarEntidad },
      { texto: 'Consultar', callback: this.consultarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de validar las variables del formulario
	 * @returns {Object}
   */
  validarFormulario = () => {
    const { nombreRuta, tramosSeleccionados } = this.state;
    if (nombreRuta.trim().length === 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe escribir el nombre de la ruta' } };
    }


    if (!Util.validarArreglo(tramosSeleccionados)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un tramo' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de generar un objeto con el identificador de el tramo o tramos seleccionados
   * @returns {Object}
   */
  obtenerTramos = () => {
    const tramos = this.state.tramosSeleccionados;
    return tramos.map(t => ({ trmIderegistro: t.trmIderegistro }));
  };

  /**
   * Método encargado de guardar los datos de la entidad
	 * @returns {bool}
   */
  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    const { idRuta, nombreRuta, tramosSeleccionados } = this.state;
    const entidadGuardar = {
      // Asignar datos de la entidad
      uniIderegistro: idRuta,
      nombre: nombreRuta,
      listaTramos: this.obtenerTramos()
    };

    axios.post(RUTAS_API.PARAMETRIZACION.RUTAS_SISTEMA_NAL.GUARDAR_RUTAS_SISTEMA_NAL, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de abrir la ventana modal del botón de consulta
   */
  consultarEntidad = () => {
    this.setState({ mostrarModalConsulta: true });
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
   * Método encargado de cerrar la ventana modal del botón de consulta
   */
  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false
    });
  };

  /**
   * Método encargado de generar la tabla de tramos con los tramos consultados por ruta
   */
  asignarTramos = (tramos) => {
    this.setState({ tramosSeleccionados: tramos });
  };

  /**
   * Método encargado de consultar los tramos de la ruta seleccionada
   */
  consultarTramosRuta = (idRuta) => {
    axios.post(RUTAS_API.PARAMETRIZACION.RUTAS_SISTEMA_NAL.CONSULTAR_TRAMOS_RUTA, { idRuta: idRuta })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.asignarTramos(respuesta.data.datos);
        }
      });
  };

  /**
   * Método encargado de llenar los campos del formulario con los datos de la ruta seleccionada
   */
  cargarDatos = (entidad) => {
    this.setState({
      idRuta: entidad.uniIderegistro,
      mostrarModalConsulta: false,
      nombreRuta: entidad.uniNombre1,
    });
    this.consultarTramosRuta(entidad.uniIderegistro);
  };

  /**
   * Método encargado agregar los tramos seleccionados
   * @param {Object} tramos Tramos seleccionados por el usuario
   */
  onSeleccionarTramos = (tramos) => {
    this.setState({
      mostrarModalTramos: false,
      tramosSeleccionados: [...tramos]
    });
  };

  /**
   * Método encargado de abrir la ventana modal de la consulta de tramos
   */
  abrirModalTramos = () => {
    this.setState({
      mostrarModalTramos: true
    });
  };

  /**
  * Método encargado de eliminar el tramo seleccionado
  * @param {number} posicion Posición del tramo que se desea eliminar
  */
  eliminarTramo = (posicion) => {
    const lista = [...this.state.tramosSeleccionados];
    lista.splice(posicion, 1);
    this.setState({ tramosSeleccionados: lista });
  };

  /**
   * Método encargado de mostrar los tramos seleccionados
   * @returns {Array}
   */
  renderTramos = () => {
    return (
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Tramo</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {
            this.state.tramosSeleccionados.map((dato, index) => {
              return (
                <tr key={"tramo_" + dato.trmIderegistro}>
                  <td>{dato.trmNombre}</td>
                  <td><button className='btnEliminar' onClick={() => {
                    this.eliminarTramo(index)
                  }}>X</button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    );
  };

  /**
   * Método encargado de mostrar el formulario
	 * @returns {Object}
   */
  render() {
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />

        <div className='gestion-rutas row mt-5'>

          <Input
            label='Nombre:'
            value={this.state.nombreRuta}
            onChange={this.controlarCambio}
            name='nombreRuta'
          />

          <div className='col-6'>
            <p><b>Tramos {this.state.tramosSeleccionados.length > 0 ? ` (${this.state.tramosSeleccionados.length})` : ''}</b></p>
            <button className='btn btn-primary' onClick={this.abrirModalTramos}>Seleccionar</button>
            <div className='pt-3'>
              {this.state.tramosSeleccionados.length > 0 &&
                this.renderTramos()}
            </div>
          </div>
        </div>

        <VentanaModal
          mostrar={this.state.mostrarModalConsulta}
          titulo='Consulta Rutas Sistema Nacional'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaRutasSistemaNacional esModal seleccionarEntidad={this.cargarDatos} />
        </VentanaModal>

        <VentanaModal
          mostrar={this.state.mostrarModalTramos}
          titulo='Seleccionar Tramos'
          cerrarModal={() => this.setState({ mostrarModalTramos: false })}>
          <RConsultaTramos
            esModal
            seleccionMultiple
            entidadesSeleccionadas={this.state.tramosSeleccionados}
            seleccionarEntidades={this.onSeleccionarTramos}
          />
        </VentanaModal>
      </Fragment>
    );
  };
}

GestionRutasSistemaNacional.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionRutasSistemaNacional);

export { VistaRedux as RGestionRutasSistemaNacional };
