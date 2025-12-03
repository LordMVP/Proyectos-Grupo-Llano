import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Util, Input, Botonera, Tabla } from 'appfuture-react';

import RUTAS_API from '../../../global/rutas_api';
import RUTAS_VISTA from '../../../global/rutas_vista';
import { TECLAS } from '../../../global/constantes';

class ConsultaMercadosRelevantes extends Component {

  state = {
    listadoEntidad: [],
    criterio: '',
    entidadesSeleccionadas: this.props.entidadesSeleccionadas || []
  };

  /**
   * Metodo encargado de realizar la consulta
   */
  onBuscar = () => {
    axios.post(RUTAS_API.PARAMETRIZACION.MERCADOS_RELEVANTES.CONSULTAR_MERCADOS_RELEVANTES, { 'criterio': this.state.criterio })
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
      pathname: RUTAS_VISTA.GESTION_MERCADOS_RELEVANTES,
      state: {
        entidadEditar: entidad
      }
    });
  };

  /**
   * Método encargado de generar los botones de editar y seleccionar del componente Tabla
   * @param {Object} props Propiedades del componente Tabla
   * @param {Component} contexto Contexto del componente ConsultaMercadosRelevantes
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
      <span className='consulta-mercados__link-accion'>
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
        Header: 'Mercados Relevantes',
        columns: [
          {
            Header: 'Acción',
            accessor: 'merIderegistro',
            Cell: (props) => contexto.renderCeldaAcciones(props, contexto)
          },
          {
            Header: 'Nombre',
            accessor: 'merNombre'
          },
          {
            Header: 'Cód. DANE',
            accessor: 'merCoddane'
          }
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
      listadoEntidad: [],
      entidadesSeleccionadas: []
    });
  };

  /**
   * Método encargado de generar los botones del formulario
	 * @returns {Object}
   */
  obtenerFunciones = () => {
    let funciones = [{ texto: 'Consultar', callback: this.onBuscar }];
    if (this.props.esModal && this.props.seleccionMultiple) {
      funciones.push({ texto: 'Seleccionar Datos', callback: this.onSeleccionarEntidades });
    }
    funciones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    return funciones;
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
      <div className='consulta-mercados-relevantes'>
        <div className='d-flex justify-content-center pt-3'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>

        <Input
          cols={12}
          label='Buscar Mercados Relevantes'
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

ConsultaMercadosRelevantes.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionarEntidad: PropTypes.func
};

ConsultaMercadosRelevantes.defaultProps = {
  esModal: false
};

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaMercadosRelevantes);

export { VistaRedux as RConsultaMercadosRelevantes };
