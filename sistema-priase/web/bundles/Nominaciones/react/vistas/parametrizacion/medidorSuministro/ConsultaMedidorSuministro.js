import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Util, Input, Botonera, Tabla } from 'appfuture-react';

import RUTAS_API from '../../../global/rutas_api';
import RUTAS_VISTA from '../../../global/rutas_vista';
import { TECLAS } from '../../../global/constantes';

class ConsultaMedidorSuministro extends Component {

  state = {
    listadoEntidad: [],
    criterio: '',
  };

  /**
   * Metodo encargado de realizar la consulta
   */
  onBuscar = () => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_MEDIDOR_SUMINISTRO.CONSULTAR_MEDIDOR_SUMINISTRO, { 'criterio': this.state.criterio.trim() })
      .then(respuesta => {
        this.setState({ listadoEntidad: respuesta.data.datos });
      });
  };

  /**
   * Método encargado de controlar el cambio del criterio
   * @param {Event} event El evento que se ejecuta en el control de usuario.
   */
  onCriterioChange = (event) => {
    this.setState({ criterio: event.target.value });
  };

  /**
   * Método encargado de enviar los datos seleccionados para editar
   * @param {Object} entidad Datos del medidor seleccionado
   */
  editarEntidad = (entidad) => {
    this.props.history.push({
      pathname: RUTAS_VISTA.GESTION_MEDIDORES_SUMINISTRO,
      state: {
        entidadEditar: entidad
      }
    });
  };

  /**
   * Método encargado de generar los botones de editar y seleccionar del componente Tabla
   * @param {Object} props Propiedades del componente Tabla
   * @param {Component} contexto Contexto del componente ConsultaMedidorSuministro
   * @returns {Object}
   */
  renderCeldaAcciones = (props, contexto) => {
    let iconoAccion = 'fa-edit';
    let tituloAccion = 'Editar';
    let funcion = contexto.editarEntidad;

    if (contexto.props.esModal) {
      iconoAccion = 'fa-check';
      tituloAccion = 'Seleccionar';
      funcion = contexto.props.seleccionarEntidad;
    }

    return (
      <span className='consulta-tramos__link-accion'>
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
   * Método encargado de obtener las columnas del componente Tabla
   * @returns {Object}
   */
  obtenerColumnas = () => {
    const contexto = this;
    return [
      {
        Header: 'Medidores de suministro',
        columns: [
          {
            Header: 'Acción',
            accessor: 'mesuIderegistro',
            Cell: (props) => contexto.renderCeldaAcciones(props, contexto)
          },
          {
            Header: 'Medidor Suministro',
            accessor: 'mesuNombre'
          },
          {
            Header: 'Capacidad Máx.',
            accessor: 'mesuCapacidadmaxima',
          },
        ]
      }
    ];
  };

  /**
   * Método encargado de generar el componente Tabla
   * @returns {Component}
   */
  renderTabla = () => {
    if (!Util.validarArreglo(this.state.listadoEntidad)) {
      return <div className='text-center '>Sin resultados</div>;
    }

    return (
      <Tabla
        datos={this.state.listadoEntidad}
        columnas={this.obtenerColumnas()}
      />
    );
  };

  /**
   * Método encargado de limpiar el formulario
   */
  limpiarFormulario = () => {
    this.setState({
      criterio: '',
      listadoEntidad: []
    });
  };

  /**
   * Método encargado de generar los botones del formulario
	 * @returns {Object}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Consultar', callback: this.onBuscar },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Metodo encargado de realizar la consulta cuando se preciona la tecla enter
   * @returns {bool}
   */
  onKeyPress = (evento) => {
    if (evento.charCode === TECLAS.ENTER) {
      this.onBuscar();
    }
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <div className='consulta-medidores'>
        <Botonera funciones={this.obtenerFunciones()} />

        <Input
          cols={12}
          label='Buscar por nombre del medidor:'
          onChange={this.onCriterioChange}
          value={this.state.criterio}
          className='row mt-3'
          extra={{ onKeyPress: this.onKeyPress }}
        />

        <div className='mt-5'>
          {this.renderTabla()}
        </div>

      </div>
    );
  };

}

ConsultaMedidorSuministro.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionarEntidad: PropTypes.func
};

ConsultaMedidorSuministro.defaultProps = {
  esModal: false
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaMedidorSuministro);

export { VistaRedux as RConsultaMedidorSuministro };
