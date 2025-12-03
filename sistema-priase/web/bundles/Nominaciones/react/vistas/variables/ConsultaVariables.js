import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';
import { Util, Input, Botonera, Tabla } from 'appfuture-react';
import RUTAS_VISTA from '../../global/rutas_vista';
import { TECLAS } from '../../global/constantes';

class ConsultaVariables extends Component {

  state = {
    variables: [],
    criterio: '',
  };

  /**
   * Metodo encargado de realizar la consulta
   */
  onBuscar = () => {
    axios.post(
      RUTAS_API.VARIABLES.CONSULTAR_VARIABLES,
      { 'criterio': this.state.criterio })
      .then(respuesta => {
        this.setState({ variables: respuesta.data.datos });
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
   * @param {Object} variable Datos del medidor seleccionado
   */
  editarVariable = (variable) => {
    this.props.history.push({
      pathname: RUTAS_VISTA.GESTION_VARIABLE.url,
      state: {
        variableEditar: variable
      }
    });
  };

  /**
   * Método encargado de generar los botones de editar y seleccionar del componente Tabla
   * @param {Object} props Propiedades del componente Tabla
   * @param {Component} contexto Contexto del componente ConsultaVariables
   * @returns {Object}
   */
  renderCeldaAcciones = (props, contexto) => {
    let iconoAccion = 'fa-edit';
    let tituloAccion = 'Editar';
    let funcion = contexto.editarVariable;

    if (contexto.props.esModal) {
      iconoAccion = 'fa-check';
      tituloAccion = 'Seleccionar';
      funcion = contexto.props.seleccionarVariable;
    }

    return (
      <span className='consulta-variables__link-accion'>
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
        Header: 'Variables',
        columns: [
          {
            Header: 'Acción',
            accessor: 'uniConcepto',
            Cell: (props) => contexto.renderCeldaAcciones(props, contexto)
          },
          {
            Header: 'Nombre',
            accessor: 'uniUnidad.uniNombre1'
          },
          {
            Header: 'Alias',
            accessor: 'conAlias'
          },
          {
            Header: 'Abreviatura',
            accessor: 'conAbreviatura'
          },
          {
            Header: 'Estado',
            accessor: 'conEstado',
            Cell: (props) => (
              props.original.conEstado.toUpperCase() === 'A' ? 'Activa' : 'Eliminada'
            )
          },
          {
            Header: 'Tipo Cálculo',
            accessor: 'conTipcalculo',
            Cell: (props) => (
              props.original.conTipcalculo.toUpperCase() === 'F' ? 'Fórmula' : 'Valor'
            )
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
    if (!Util.validarArreglo(this.state.variables)) {
      return <div className='text-center '>Sin resultados</div>;
    }

    return (
      <Tabla
        datos={this.state.variables}
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
      variables: []
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
      <div className='consulta-variables'>
        <div className="d-flex justify-content-center pt-3">
          <Botonera funciones={this.obtenerFunciones()} />
        </div>

        <Input
          cols={12}
          label='Buscar variables por Nombre, Alias o Abreviatura:'
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

ConsultaVariables.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionarVariable: PropTypes.func
};

ConsultaVariables.defaultProps = {
  esModal: false
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaVariables);

export { VistaRedux as RConsultaVariables };
