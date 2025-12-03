import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, Fecha, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import './GenerarPronosticoConsumo.scss';
import { toast } from 'react-toastify';

class GestionGenerarPronostico extends Component {

  state = {
    // Datos de la entidad
    puntoConsumo: '',
    listaPuntosConsumo: this.props.listaPuntos,
    nominacionSugerida: '',
    fechaPronostico: '',
    listaDatos: [],
    // Estado de la aplicacion
    estadoPuntos: false,
    estadoCampo: false,
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
   * Método encargado de limpiar los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  limpiarFormulario = (evento) => {
    this.setState({
      // Datos de la entidad
      nominacionSugerida: '',
      fechaPronostico: '',
      puntoConsumo: '-1',
      listaDatos: [],
      // Estado de la aplicacion
      estadoCampo: false,
      estadoPuntos: false,
    });
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
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    const { puntoConsumo } = this.state;
    //Validaciones
    if (puntoConsumo <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un punto de consumo' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    const { name, value } = evento.target;
    change[name] = value;
    this.setState(change);
  };

  /**
   * Método encargado de controlar el cambio del valor del checkbox.
   * @param {Event} evento Evento ejecutado en el control de usuario.
   */
  controlarCambioCheck = (evento) => {
    let { estadoCampo, puntoConsumo } = this.state;
    this.setState({
      estadoPuntos: evento.target.checked,
      puntoConsumo: (estadoCampo === false) ? '-1' : puntoConsumo,
      estadoCampo: (estadoCampo === true) ? false : true,
    })
  };

  /**
   * Método encargado de validar la información necesaria para generar la nominación sugerida
   * @returns {Object}
   */
  validarNominacionSugerida = () => {
    const { fechaPronostico, estadoPuntos, puntoConsumo } = this.state;
    if (fechaPronostico.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar la fecha a pronosticar.' } };
    }
    if (estadoPuntos === false) {
      if (puntoConsumo <= 0) {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un punto de consumo.' } };
      }
    }
    return { respuesta: true }
  };

  /**
   * Método encargado de construir un objeto para generar el pronostico automatico
   * @returns {Object}
   */
  obtenerObjetoEntidad = () => {
    const { puntoConsumo, estadoPuntos, listaPuntosConsumo, fechaPronostico } = this.state;
    if (estadoPuntos === true) {
      return listaPuntosConsumo.map(dato => {
        return {
          fecha: fechaPronostico,
          puntoConsumo: {
            ptcIderegistro: dato.ptcIderegistro
          }
        }
      });
    }
    return [{
      fecha: fechaPronostico,
      puntoConsumo: {
        ptcIderegistro: puntoConsumo
      }
    }];
  };

  /**
   * Método encargado de validar si se generara la nominación sugerida con o sin compresión
   * @returns {bool}
   */
  generarNominacionSugerida = () => {
    const validar = this.validarNominacionSugerida();
    if (!validar.respuesta) {
      this.props.mostrarAlerta(validar.mensaje.titulo, validar.mensaje.mensaje);
      return;
    }
    const entidad = this.obtenerObjetoEntidad();
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PRONOSTICO_CONSUMO.GENERAR_NOMINACIONES_SUGERIDA, entidad)
      .then(respuesta => {
        const datos = respuesta.data.datos;
        if (respuesta.data.codigo > 0) {
          if (datos.length == 1 && (datos[0].cantidadRegistros < datos[0].limite)) {
            let punto = this.obtenerPuntoConsumo(datos[0]);
            toast.info('El punto ' + punto + ' se ha calculado con ' + datos[0].cantidadRegistros + ' lecturas');
          }
          this.setState({
            listaDatos: (datos.length > 1) ? datos : [],
            nominacionSugerida: (datos.length === 1) ? datos[0].cantidadNominacion : ''
          });
        }
      });
  };

  /**
   * Método encargado de obtener el nombre del punto de consumo.
   * @param {Object} props Propiedades del componente tabla.
   * @returns {String}
   */
  obtenerPuntoConsumo = (dato) => {
    const { listaPuntosConsumo } = this.state;
    const idPunto = parseInt(dato.puntoConsumo.ptcIderegistro);
    const punto = listaPuntosConsumo.find(p => p.ptcIderegistro === idPunto);
    return (punto) ? punto.ptcoNombre : '';
  };

  /**
   * Método encargado de mostrar la tabla con los valores sugeridos
   * @returns {Component}
   */
  renderTabla = () => {
    const { listaDatos } = this.state;
    return (
      <table className='table table-bordered table-condensed mt-5'>
        <thead className='thead-dark'>
          <tr>
            <th>Punto de Consumo</th>
            <th>Cantidad Sugerida</th>
            <th>Fecha</th>
            <th>Cantidad Lecturas</th>
          </tr>
        </thead>
        <tbody>
          {listaDatos.map(dato => {
            let estilo = '';
            if (dato.cantidadRegistros < dato.limite) {
              estilo = 'table-danger';
            }
            return (
              <tr className={estilo}>
                <td >{this.obtenerPuntoConsumo(dato)}</td>
                <td>{dato.cantidadNominacion}</td>
                <td>{dato.fecha}</td>
                <td>{dato.cantidadRegistros}</td>
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
        <div className='conf-general row mt-5 zIndex3'>
          <Combo
            opciones={this.state.listaPuntosConsumo}
            propTexto='ptcoNombre'
            propValor='ptcIderegistro'
            label='Punto de consumo:'
            name='puntoConsumo'
            value={this.state.puntoConsumo}
            onChange={this.controlarCambio}
            extra={{ disabled: this.state.estadoCampo, readOnly: this.state.estadoCampo }}
          />
          <div className='mt30 col-8'>
            <label>
              <input
                type='checkbox'
                name='estadoPuntos'
                id='estadoPuntos'
                value={this.state.estadoCampo || false}
                onChange={this.controlarCambioCheck}
              />
              Todos los Puntos de Consumo
          </label>
          </div>
          <Fecha
            label='Fecha A Pronosticar:'
            name='fechaPronostico'
            fecha={this.state.fechaPronostico}
            onChange={this.controlarCambio}
          />
          <div className='col-4 mt25'>
            <button className='btn btn-primary btnArchivo' onClick={this.generarNominacionSugerida}>Generar Nominación Sugerida</button>
          </div>
          <Input
            label='Nominación Sugerida MBTU:'
            value={this.state.nominacionSugerida}
            extra={{ disabled: true, readOnly: true }}
            name='nominacionSugerida'
          />
        </div>
        {this.state.listaDatos.length > 0 &&
          this.renderTabla()
        }
      </Fragment>
    );
  };
}

GestionGenerarPronostico.propTypes = {
  history: PropTypes.object,
  mostrarAlerta: PropTypes.func,
  listaPuntos: PropTypes.array,
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    mostrarAlerta,
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionGenerarPronostico);

export { VistaRedux as RGestionGenerarPronostico };
