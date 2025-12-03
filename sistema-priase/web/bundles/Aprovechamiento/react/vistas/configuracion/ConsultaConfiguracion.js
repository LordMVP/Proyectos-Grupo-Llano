import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import {
  consultarConfiguracionesTipo,
  consultarTiposConfiguraciones,
  limpiarConfiguraciones
} from '../../store/actions/ConfiguracionAcciones';

import { Combo, Util, Input, Botonera, Tabla } from 'appfuture-react';
import RUTAS_VISTA from '../../global/rutas_vista';

class ConsultaConfiguracion extends Component {
  state = {
    tiposConfiguracion: null,
    criterio: '',
    configuracion: -1
  };

  /**
   * Método encargado de ejecutar una o varias acciones al momento de cargar la interfaz.
   */
  componentDidMount() {
    if (!Util.validarArreglo(this.props.tiposConfiguracion)) {
      this.props.consultarTiposConfiguraciones();
    }
  }

  /**
   * Método encargado de limpiar los campos del formulario al momento de cambiar de interfaz.
   */
  componentWillUnmount() {
    this.props.limpiarConfiguraciones();
  }

  /**
   * Método encargado de consultar las configuración por tipo.
   */
  onBuscar = () => {
    this.props.consultarConfiguracionesTipo({
      'criterio': this.state.criterio,
      'estIderegistro': this.state.configuracion
    });
  };

  /**
   * Método encargado de controlar el cambio del valor de la configuración seleccionada.
   */
  onTiposConfiguracionChange = (event) => {
    this.setState({
      configuracion: parseInt(event.target.value, 0)
    });
  };

  /**
   * Método encargado dde controlar el cambio del criterio de búsqueda.
   */
  onCriterioChange = (event) => {
    this.setState({ criterio: event.target.value });
  };

  /**
   * Método encargado de redireccionar a la interfaz de configuración básica.
   */
  editarConfiguracion = (configuracion) => {
    this.props.history.push({
      pathname: RUTAS_VISTA.GESTION_CONFIGURACION.url,
      state: {
        configuracionEditar: configuracion
      }
    });
  };

  /**
   * Método encargado de mostrar los botones de acción en el componente Tabla.
   * @returns {Object}
   */
  renderCeldaAcciones = (props, contexto) => {
    let iconoAccion = 'fa-edit';
    let tituloAccion = 'Editar';
    let funcion = contexto.editarConfiguracion;
    if (contexto.props.esModal) {
      iconoAccion = 'fa-check';
      tituloAccion = 'Seleccionar';
      funcion = contexto.props.seleccionarConfiguracion;
    }
    return (
      <span className='gestion-configuracion__link-accion'>
        <a
          href='#' className={`fa ${iconoAccion}`}
          onClick={(evento) => {
            Util.detenerEvento(evento);
            funcion.call(contexto, props.row._original);
          }}>
          {tituloAccion}
        </a>
      </span>
    );
  };

  /**
   * Método encargado de generar las columnas del componente Tabla.
   * @returns {Array}
   */
  obtenerColumnas = () => {
    const contexto = this;
    return [
      {
        Header: 'Configuraciones',
        columns: [
          {
            Header: 'Acción',
            accessor: 'uniIderegistro',
            Cell: (props) => contexto.renderCeldaAcciones(props, contexto)
          },
          {
            Header: 'Configuración',
            accessor: 'uniNombre1'
          },
          {
            Header: 'Código',
            accessor: 'uniCodigo',
            Cell: (props) => {
              const uniPropiedad = props.row._original.uniPropiedad;
              if (!uniPropiedad) {
                return '';
              }
              return JSON.parse(uniPropiedad).codigo || '';
            }
          }
        ]
      }
    ];
  };

  /**
   * Método encargado de mostrar la tabla con las configuraciones consultadas.
   * @returns {Component}
   */
  renderConfiguraciones = () => {
    if (!Util.validarArreglo(this.props.configuraciones)) {
      return <div className='text-center '>Sin resultados</div>;
    }
    return (
      <Tabla
        datos={this.props.configuraciones}
        columnas={this.obtenerColumnas()}
      />
    );
  };

  /**
   * Método encargado de limpiar los datos del formulario.
   */
  limpiarFormulario = () => {
    this.props.limpiarConfiguraciones();
    this.setState({
      criterio: '',
      configuracion: -1
    });
  };

  /**
   * Método encargado de mostrar los botones del componente Botonera.
   * @returns {Object}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Consultar', callback: this.onBuscar },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de mostrar los campos del formulario.
   * @returns {Object}
   */
  render() {
    return (
      <div>
          <Botonera funciones={this.obtenerFunciones()} />
        <div className="row mt-5">
          <Combo
            opciones={this.props.tiposConfiguracion}
            propTexto='estNombre'
            propValor='estIderegistro'
            label='Tipo de Configuración:'
            value={this.state.configuracion}
            cols={6}
            onChange={this.onTiposConfiguracionChange}
            extra={{ disabled: this.props.bloquearTipoConfiguracion }}
          />
          <Input cols={6} label='Criterio de Búsqueda' onChange={this.onCriterioChange} value={this.state.criterio} />
        </div>
        <div className='mt-5'>
          {this.renderConfiguraciones()}
        </div>
      </div>
    );
  };
}

ConsultaConfiguracion.propTypes = {
  history: PropTypes.object,
  configuraciones: PropTypes.array,
  tiposConfiguracion: PropTypes.array,
  consultarConfiguracionesTipo: PropTypes.func,
  consultarTiposConfiguraciones: PropTypes.func,
  limpiarConfiguraciones: PropTypes.func,
  esModal: PropTypes.bool,
  seleccionarConfiguracion: PropTypes.any,
  bloquearTipoConfiguracion: PropTypes.bool
};

ConsultaConfiguracion.defaultProps = {
  configuraciones: {},
  esModal: false,
  bloquearTipoConfiguracion: false
};

const mapStateToProps = state => {
  return {
    configuraciones: state.configuracion.configuraciones || [],
    error: state.configuracion.error || {},
    tiposConfiguracion: state.configuracion.tiposConfiguracion || []
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    consultarConfiguracionesTipo,
    consultarTiposConfiguraciones,
    limpiarConfiguraciones
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaConfiguracion);

export { VistaRedux as RConsultaConfiguracion };
