
/**
   * Método encargado de controlar el cambio de los componentes
   * @param {Event} evento Evento ejecutado en el control de usuario
   */import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, Fecha, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import { formatearArray } from '../../../../global/util_nominaciones';
import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { RConsultaTramos } from '../../tramos/ConsultaTramos';
import { ConsultaPuntosEntrada } from '../../puntosSalida/GestionPuntosSalida/ConsultaPuntosEntrada';
import { RConsultaRutas } from '../ConsultaRutas';
import './GestionPoderCalorifico.scss';

class GestionPoderCalorifico extends Component {

  state = {
    // Datos de la entidad
    variable: '',
    fecha: '',
    valor: '',
    unidadMedida: '',
    consultasTerminadas: false,
    //Listas de la aplicación.
    listaVariables: null,
    listaUnidadesMedida: [],
    tramosSeleccionados: [],
    puntosEntradaSeleccionados: [],
    rutasSeleccionadas: [],
    // Estado de la aplicacion
    mostrarModalTramos: false,
    mostrarModalPuntosEntrada: false,
    mostrarModalRutas: false,
  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
    //Consultamos y listamos las variables...
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PODER_CALORIFICO.CONSULTAR_VARIABLES, { criterio: '' })
      .then((respuesta) => {
        if (respuesta.data.codigo >= 0) {
          this.setState({ listaVariables: formatearArray(respuesta.data.datos), consultasTerminadas: true });
        }
      });
  };

  /**
   * Método encargado de limpiar los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  limpiarFormulario = (evento) => {
    this.setState({
      // Datos de la entidad
      variable: '',
      fecha: ' ',
      valor: '',
      unidadMedida: '',
      tramosSeleccionados: [],
      puntosEntradaSeleccionados: [],
      rutasSeleccionadas: [],
      // Estado de la aplicacion
      mostrarModalTramos: false,
      mostrarModalPuntosEntrada: false,
      mostrarModalRutas: false,

    });
  };

  /**
   * Método encargado de limpiar el formulario al momento de salir
   */
  componentWillUnmount() {
    this.limpiarFormulario();
  };

  /**
   * Método encargado de generar los botones del formulario",
	 * @returns {Object}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Guardar', callback: this.guardarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de validar las variables del formulario",
	 * @returns {Object}
   */
  validarFormulario = () => {
    const { variable, fecha, valor, unidadMedida, tramosSeleccionados, puntosEntradaSeleccionados, rutasSeleccionadas } = this.state;

    if (variable === '-1' || variable === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una variable.' } };
    }

    if (fecha.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una fecha' } };
    }

    if (valor.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar un valor' } };
    }

    if (isNaN(valor)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Solo se permiten valores númericos' } };
    }

    if (valor <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Solo se permiten valores positivos' } };
    }

    if (unidadMedida === '-1' || unidadMedida === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una unidad medida' } };
    }

    if (!Util.validarArreglo(tramosSeleccionados) && !Util.validarArreglo(puntosEntradaSeleccionados) && !Util.validarArreglo(rutasSeleccionadas)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar por lo menos un tramo o un punto de consumo o una ruta' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de obtener un objeto con los identificadores de ruta
   * @returns {Object}
   */
  obtenerRutas = () => {
    const listaRutas = this.state.rutasSeleccionadas.map(a => {
      return { uniIderegistro: a.uniIderegistro }
    });
    return listaRutas;
  };

  /**
   * Método encargado de guardar los datos de la entidad",
	 * @returns {bool}
   */
  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    const { variable, fecha, valor, unidadMedida } = this.state;
    const entidadGuardar = {
      uniIdeconcepto: {
        uniConcepto: variable
      },
      uniIdemedida: {
        uniIderegistro: unidadMedida
      },
      trcoValor: valor,
      listaTramos: this.obtenerTramos(),
      listaPuntosEntrada: this.obtenerPuntosEntrada(),
      listaRutaGNC: this.obtenerRutas(),
      trcoFecha: fecha,
    }

    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PODER_CALORIFICO.GUARDAR, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de generar un objeto con los identificadores de los tramos seleccionados
   * @returns {Object}
   */
  obtenerTramos = () => {
    const listaTramos = this.state.tramosSeleccionados.map(a => {
      return { trmIderegistro: a.trmIderegistro }
    });
    return listaTramos;
  };

  /**
   * Método encargado de generar un objeto con los identificadores de los puntos de entrada seleccionados
   * @returns {Object}
   */
  obtenerPuntosEntrada = () => {
    const listaPuntosEntrada = this.state.puntosEntradaSeleccionados.map(a => {
      return { uniIderegistro: a.uniIderegistro }
    });
    return listaPuntosEntrada;
  };

  /**
   * Método encargado de controlar el cambio de los componentes
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    const { name, value } = evento.target;
    change[name] = value;
    this.controlarCambioVariable(name, value);
    this.setState(change);
  };

  /**
   * Método encargado de validar si se esta cambiando el valor de la varaible
   * @param {string} name Propiedad nombre
   * @param {string} value Valor seleccionado
   */
  controlarCambioVariable = (name, value) => {
    if (name == 'variable') {
      this.consultarUnidadesMedida(value);
    }
  };

  /**
   * Método encargado de consultar las unidades de medida de la variable seleccionada
   * @param {string} value Valor de la variable seleccionada
   * @returns {bool}
   */
  consultarUnidadesMedida = (value) => {
    const variable = value;
    if (variable === '' || variable === '-1') {
      this.setState({ listaUnidadesMedida: [] });
      return;
    }

    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PODER_CALORIFICO.CONSULTAR_UNIDADES_MEDIDA, { idVariable: variable })
      .then((respuesta) => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaUnidadesMedida: respuesta.data.datos });
        }
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
   * Método encargado de abrir la ventana modal de la consulta de tramos
   */
  abrirModalRutas = () => {
    this.setState({
      mostrarModalRutas: true
    });
  };

  /**
   * Método encargado de abrir la ventana modal de la consulta de puntos de entrada
   */
  abrirModalPuntosEntrada = () => {
    this.setState({
      mostrarModalPuntosEntrada: true
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
   * Método encargado de eliminar la ruta seleccionado
   * @param {number} posicion Posición de la ruta que se desea eliminar
   */
  eliminarRuta = (posicion) => {
    const lista = [...this.state.rutasSeleccionadas];
    lista.splice(posicion, 1);
    this.setState({ rutasSeleccionadas: lista });
  };

  /**
  * Método encargado de eliminar el punto de entrada seleccionado
  * @param {number} posicion Posición del punto de entrada que se desea eliminar
  */
  eliminarPuntoEntrada = (posicion) => {
    const lista = [...this.state.puntosEntradaSeleccionados];
    lista.splice(posicion, 1);
    this.setState({ puntosEntradaSeleccionados: lista });
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
   * Método encargado de mostrar las rutas seleccionadas
   * @returns {Array}
   */
  renderRutas = () => {
    return (
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Ruta</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {
            this.state.rutasSeleccionadas.map((dato, index) => {
              return (
                <tr key={`ruta_${dato.uniIderegistro}`}>
                  <td>{dato.uniNombre1}</td>
                  <td><button className='btnEliminar' onClick={() => {
                    this.eliminarRuta(index)
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
   * Método encargado agregar las rutas seleccionadas
   * @param {Object} rutas Rutas seleccionadas por el usuario
   */
  onSeleccionarRutas = (rutas) => {
    this.setState({
      mostrarModalRutas: false,
      rutasSeleccionadas: [...rutas]
    });
  };

  /**
   * Método encargado agregar los puntos de entrada seleccionados
   * @param {Object} puntosEntrada Puntos de entrada seleccionados por el usuario
   */
  onSeleccionarPuntosEntrada = (puntosEntrada) => {
    this.setState({
      mostrarModalPuntosEntrada: false,
      puntosEntradaSeleccionados: [...puntosEntrada]
    });
  };

  /**
   * Método encargado de mostrar los puntos de entrada seleccionados
   * @returns {Array}
   */
  renderPuntosEntrada = () => {
    return (
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Punto de entrada</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {
            this.state.puntosEntradaSeleccionados.map((dato, index) => {
              return (
                <tr key={"pentrada" + dato.uniIderegistro}>
                  <td>{dato.uniNombre1}</td>
                  <td><button className='btnEliminar' onClick={() => {
                    this.eliminarPuntoEntrada(index)
                  }}>X</button>
                  </td>
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
    if (!this.state.consultasTerminadas) {
      return (<p className='text-center'>Cargando...</p>);
    }
    return (
      <Fragment>
        <div className='d-flex justify-content-center'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>
        <div className='conf-general row mt-5'>
          <Combo
            opciones={this.state.listaVariables}
            propTexto='conNombre'
            propValor='uniConcepto'
            label='Variable:'
            name='variable'
            value={this.state.variable}
            onChange={this.controlarCambio}
          />
          <Fecha
            label='Fecha:'
            name='fecha'
            fecha={this.state.fecha}
            onChange={this.controlarCambio}
          />
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='Valor:'
            value={this.state.valor}
            onChange={this.controlarCambio}
            name='valor'
          />
          <Combo
            opciones={this.state.listaUnidadesMedida}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Unidad medida:'
            name='unidadMedida'
            value={this.state.unidadMedida}
            onChange={this.controlarCambio}
          />

        </div>

        <div className='row mt-2'>
          <div className='col-4'>
            <p><b>Puntos de Entrada {this.state.puntosEntradaSeleccionados.length > 0 ? ` (${this.state.puntosEntradaSeleccionados.length})` : ''}</b></p>
            <button className='btn btn-primary' onClick={this.abrirModalPuntosEntrada}>Seleccionar</button>
            <div className='pt-3'>
              {this.state.puntosEntradaSeleccionados.length > 0 &&
                this.renderPuntosEntrada()
              }
            </div>
          </div>
          <div className='col-4'>
            <p><b>Tramos {this.state.tramosSeleccionados.length > 0 ? ` (${this.state.tramosSeleccionados.length})` : ''}</b></p>
            <button className='btn btn-primary' onClick={this.abrirModalTramos}>Seleccionar</button>
            <div className='pt-3'>
              {this.state.tramosSeleccionados.length > 0 &&
                this.renderTramos()
              }
            </div>
          </div>
          <div className='col-4'>
            <p><b>Rutas GNC {this.state.rutasSeleccionadas.length > 0 ? ` (${this.state.rutasSeleccionadas.length})` : ''}</b></p>
            <button className='btn btn-primary' onClick={this.abrirModalRutas}>Seleccionar</button>
            <div className='pt-3'>
              {this.state.rutasSeleccionadas.length > 0 &&
                this.renderRutas()
              }
            </div>
          </div>
        </div>

        <VentanaModal
          mostrar={this.state.mostrarModalPuntosEntrada}
          titulo='Seleccionar Puntos Recibo'
          cerrarModal={() => this.setState({ mostrarModalPuntosEntrada: false })}>
          <ConsultaPuntosEntrada
            esModal
            bloquearTipoConfiguracion
            seleccionMultiple
            entidadesSeleccionadas={this.state.puntosEntradaSeleccionados}
            seleccionarEntidades={this.onSeleccionarPuntosEntrada}
          />
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

        <VentanaModal
          mostrar={this.state.mostrarModalRutas}
          titulo='Seleccionar Rutas'
          cerrarModal={() => this.setState({ mostrarModalRutas: false })}>
          <RConsultaRutas
            esModal
            seleccionMultiple
            entidadesSeleccionadas={this.state.rutasSeleccionadas}
            seleccionarEntidades={this.onSeleccionarRutas}
          />
        </VentanaModal>

      </Fragment>
    );
  };
}

GestionPoderCalorifico.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionPoderCalorifico);

export { VistaRedux as RGestionPoderCalorifico };
