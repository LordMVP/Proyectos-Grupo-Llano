import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Util, Input, Botonera, Tabla } from 'appfuture-react';
import RUTAS_API from '../../../global/rutas_api';
import RUTAS_VISTA from '../../../global/rutas_vista';
import { TECLAS, CLASES_UNIDADES } from '../../../global/constantes';
import ConsultaGenerica from '../../../hoc/consultaGenerica/ConsultaGenerica';

class ConsultaRutasGNC extends Component {

  state = {
    listadoEntidad: [],
    criterio: '',
  };

  /**
   * Metodo encargado de realizar la consulta
   */
  onBuscar = () => {
    axios.post(
      RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD,
      { 'criterio': this.state.criterio, idClase: CLASES_UNIDADES.RUTA_GNC_CONEXION })
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
      pathname: RUTAS_VISTA.GESTION_RUTAS_GNC.url,
      state: {
        entidadEditar: entidad
      }
    });
  };

  /**
   * Método encargado de generar los botones de editar y seleccionar del componente Tabla
   * @param {Object} props Propiedades del componente Tabla
   * @param {Component} contexto Contexto del componente ConsultaRutasGNC
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
   * Método encargado de mostrar le nombre de la ruta
   * @param {Object} props Propiedades del componente Tabla
   * @param {Component} contexto Contexto del componente ConsultaRutasGNC
   * @returns {Object}
   */
  renderTipoRuta = (props, contexto) => {
    if (!!props.value && props.value.length > 0) {
      let tipoRuta = JSON.parse(props.value).tipo;
      switch (tipoRuta) {
        case 'G':
          return 'GNC';
        case 'C':
          return 'Conexión';
      }
    }
    return '';
  };

  /**
   * Método encargado de obtener las columnas del componente Tabla
   * @returns {Object}
   */
  obtenerColumnas = () => {
    const contexto = this;
    return [
      {
        Header: 'Rutas GNC',
        columns: [
          {
            Header: 'Acción',
            accessor: 'uniIderegistro',
            Cell: (props) => contexto.renderCeldaAcciones(props, contexto)
          },
          {
            Header: 'Nombre',
            accessor: 'uniNombre1'
          },
          {
            Header: 'Tipo',
            accessor: 'uniPropiedad',
            Cell: (props) => contexto.renderTipoRuta(props, contexto)
          },
          {
            Header: 'Codigo Interno',
            accessor: 'uniCodigo'
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
      <div className='consulta-rutas-gnc'>
        <div className='d-flex justify-content-center pt-3'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>

        <Input
          cols={12}
          label='Buscar Rutas:'
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

ConsultaRutasGNC.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionarEntidad: PropTypes.func
};

ConsultaRutasGNC.defaultProps = {
  esModal: false
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaRutasGNC);

export { VistaRedux as RConsultaRutasGNC };
