import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Util, Input, Botonera, Tabla } from 'appfuture-react';

import RUTAS_API from '../../../global/rutas_api';
import RUTAS_VISTA from '../../../global/rutas_vista';
import { TECLAS } from '../../../global/constantes';

class ConsultaPuntosSalida extends Component {

  state = {
    listadoEntidad: [],
    criterio: '',
    entidadesSeleccionadas: this.props.entidadesSeleccionadas || []
  };

  /**
   * Metodo encargado de realizar la consulta
   */
  onBuscar = () => {
    axios.post(
      RUTAS_API.PARAMETRIZACION.PUNTOS_SALIDA.CONSULTAR_PUNTOS_SALIDA,
      { 'criterio': this.state.criterio })
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
      pathname: RUTAS_VISTA.GESTION_PUNTOS_SALIDA.url,
      state: {
        entidadEditar: entidad
      }
    });
  };

  /**
   * Método encargado de obtener los datos seleccionados
   */
  onSeleccionarEntidades = () => {
    this.props.seleccionarEntidades(this.state.entidadesSeleccionadas);
  };

  /**
   * Método encargado de generar los botones de editar y seleccionar del componente Tabla
   * @param {Object} props Propiedades del componente Tabla
   * @param {Component} contexto Contexto del componente ConsultaMedidorSuministro
   * @returns {Object}
   */
  renderCeldaAcciones = (props, contexto) => {
    // Se verifica si el programa se abre como modal y de selección múltiple
    if (contexto.props.seleccionMultiple && contexto.props.esModal) {
      return (
        <span className='consulta-tramos__link-accion'>
          <label><input type='checkbox' onChange={contexto.onCheckEntidad} /> Seleccionar</label>
        </span>
      );
    }

    // Se ejecuta en caso de que el programa no sea de seleccion multiple
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
        Header: 'Puntos de Salida',
        columns: [
          {
            Header: 'Acción',
            accessor: 'ptsaIderegistro',
            Cell: (props) => contexto.renderCeldaAcciones(props, contexto)
          },
          {
            Header: 'Nombre',
            accessor: 'ptsaNombre'
          },
          {
            Header: 'Dem. Reg. Residencial',
            accessor: 'pstaRegresidencial'
          },
          {
            Header: 'Dem. Reg. Comercial',
            accessor: 'pstaRegcomercial'
          },
          {
            Header: 'Dem. Reg. Industrial',
            accessor: 'pstaRegindustrial'
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
      <div className='consulta-puntos-salida'>
        <div className='d-flex justify-content-center pt-3'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>

        <Input
          cols={12}
          label='Buscar Puntos de Salida:'
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

ConsultaPuntosSalida.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array
};

ConsultaPuntosSalida.defaultProps = {
  esModal: false,
  seleccionMultiple: false,
  entidadesSeleccionadas: []
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaPuntosSalida);

export { VistaRedux as RConsultaPuntosSalida };
