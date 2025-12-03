import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, VentanaModal, Util, Tabla } from 'appfuture-react';
import RUTAS_API from '../../../global/rutas_api';
import axios from 'axios';
import RUTAS_VISTA from '../../../global/rutas_vista';
import { TECLAS } from '../../../global/constantes';
import './GenerarPronosticoConsumo/GenerarPronosticoConsumo.scss';
class ConsultaCalendario extends Component {

  state = {
    anio: '',
    listaAnios: this.props.listaAnios,
    listaMostrar: [],
    listaEntidad: [],
  };

  /**
  * Método encargado de generar los botones de editar y borrar de la tabla de actividades
  * @param {Object} props Propiedades del componente Tabla
  * @param {Component} contexto Contexto del componente GestionHorariosActividades
  * @returns {Object}
  */
  renderCeldaAcciones = (props, contexto) => {
    return (
      <div className='text-center'>
        <a href='#' className='gestion-tramos__link-tabla' onClick={(evento) => {
          Util.detenerEvento(evento);
          contexto.props.seleccionarEntidad.call(contexto, this.state.listaEntidad);
        }}>Seleccionar</a>
      </div>
    );
  };

  /**
   * Método encargado de obtener las columnas de tabla.
   * @returns {Array}
   */
  obtenerColumnas = () => {
    const contexto = this;
    return [
      {
        Header: 'Calendarios',
        columns: [
          {
            Header: 'Acción',
            accessor: 'idRegistro',
            Cell: (props) => contexto.renderCeldaAcciones(props, contexto)
          },
          {
            Header: 'Calendario',
            accessor: 'nombre',
          },
        ]
      }
    ];
  };

  /**
   * Método encargado de generar los botones del formulario.
	 * @returns {Object}
   */
  obtenerFunciones = () => {
    let funciones = [{ texto: 'Consultar', callback: this.onBuscar }];
    funciones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    return funciones;
  };

  /**
   * Metodo encargado de realizar la consulta.
   * @returns {bool}
   */
  onBuscar = () => {
    const { anio } = this.state;
    if (anio <= 0) {
      this.props.mostrarAlerta('Datos Incompletos', 'Debe seleccionar el año que desea consultar');
      return false;
    }
    const parametros = {
      'anio': anio,
    };
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PRONOSTICO_CONSUMO.CONSULTAR_CALENDARIOS, parametros)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({
            listaEntidad: JSON.parse(respuesta.data.datos),
            listaMostrar: [{
              nombre: `Calendario-${anio}`,
              idRegistro: Util.generarIdControl('calendario')
            }]
          });
        }
      });
  };

  /**
   * Método encargado de limpiar el formulario
   */
  limpiarFormulario = () => {
    this.setState({
      anio: '',
      listaEntidad: [],
      listaMostrar: [],
    });
  };

  /**
   * Metodo encargado de realizar la consulta cuando se preciona la tecla enter.
   * @returns {bool}
   */
  onKeyPress = (evento) => {
    if (evento.charCode === TECLAS.ENTER) {
      this.onBuscar()
    }
  };

  /**
   * Método encargado de generar el componente Tabla.
   * @returns {Component}
   */
  renderTabla = () => {
    if (!Util.validarArreglo(this.state.listaEntidad)) {
      return <div className='text-center'>Sin resultados</div>;
    }

    return (
      <Tabla
        datos={this.state.listaMostrar}
        columnas={this.obtenerColumnas()}
      />
    );
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
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <div className='consulta-tramos zIndex3'>
        <Botonera funciones={this.obtenerFunciones()} />
        <div className='row'>
          <Combo
            opciones={this.state.listaAnios}
            propTexto='texto'
            propValor='valor'
            label='Año:'
            name='anio'
            value={this.state.anio}
            onChange={this.controlarCambio}
          />
          <div className='mt-5 col-12'>
            {this.renderTabla()}
          </div>
        </div>
      </div>
    );
  };
}

ConsultaCalendario.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array,
  mostrarAlerta: PropTypes.func,
  listaAnios: PropTypes.array,
};

ConsultaCalendario.defaultProps = {
  esModal: false
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaCalendario);

export { VistaRedux as RConsultaCalendario };
