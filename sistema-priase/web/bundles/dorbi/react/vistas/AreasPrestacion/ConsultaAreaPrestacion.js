import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Tabla, Util } from 'appfuture-react';
import RUTAS_API from '../../global/rutas_api';
import RUTAS_VISTA from '../../global/rutas_vista';
import { TECLAS } from '../../global/constantes';
import ConsultaGenerica from '../../hoc/consultaGenerica/ConsultaGenerica';

class ConsultaAreaPrestacion extends Component {

  state = {
    listadoEntidad: [],
    criterio: '',
  };

  /**
  * Método encargado de obtener el nombre de la actividad
  * @param {Object} props Propiedades del componente Tabla
  */
  obtenerFechaFin = (props) => {
    const fechaNumero = parseInt(props.row._original.rgtaIderegistro.rgtaFecfinvigencia);
    let fecha = new Date(fechaNumero);
    fecha = (fecha.getFullYear() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getDate());
    return (fechaNumero) ? fecha : '';
  };

  /**
  * Método encargado de obtener el nombre de la actividad
  * @param {Object} props Propiedades del componente Tabla
  */
  obtenerFechaInicio = (props) => {
    const fechaNumero = parseInt(props.row._original.rgtaIderegistro.rgtaFecinivigencia);
    let fecha = new Date(fechaNumero);
    fecha = (fecha.getFullYear() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getDate());
    return (fechaNumero) ? fecha : '';
  };

  /**
   * Metodo encargado de realizar la consulta
   * @returns {bool}
   */
  onBuscar = () => {
    this.consultaGenerica.getWrappedInstance()._buscar({ 'criterio': this.state.criterio.trim() });
  };

  /**
   * Método encargado de obtener los datos seleccionados
   */
  onSeleccionarEntidades = () => {
    this.props.seleccionarEntidades(this.consultaGenerica._obtenerEntidades());
  };

  /**
   * Método encargado de limpiar el formulario
   */
  limpiarFormulario = () => {
    this.setState({ criterio: '' });
    this.consultaGenerica.getWrappedInstance()._limpiarFormulario();
  };

  /**
   * Método encargado de controlar el cambio del criterio
   * @param {Event} event El evento que se ejecuta en el control de usuario.
   */
  onCriterioChange = (event) => {
    this.setState({ criterio: event.target.value });
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
   * Método encargado de mostrar las columnas del componente tabla
   * @returns {Object}
   */
  obtenerColumnas = () => {
    const contexto = this;
    return [
      {
        Header: 'Consulta Area Prestación',
        columns: [
          {
            Header: 'Nombre',
            accessor: 'arprNombre'
          },

          {
            Header: 'Descripción',
            accessor: 'arprDescripcion'
          },

          {
            Header: 'Regimen Tarifa Fecha Inicio Vigencia',
            accessor: 'rgtaIderegistro.rgtaFecinivigencia',
            Cell: contexto.obtenerFechaInicio
          },

          {
            Header: 'Regimen Tarifa Fecha Final Vigencia',
            accessor: 'rgtaIderegistro.rgtaFecfinvigencia',
            Cell: contexto.obtenerFechaInicio,
          },

        ]
      }
    ];
  };

  /**
   * Método encargado de generar los botones del formulario
	 * @returns {Object}
   */
  obtenerFunciones = () => {
    let funciones = [{ texto: 'Buscar', callback: this.onBuscar }];
    if (this.props.esModal && this.props.seleccionMultiple) {
      funciones.push({ texto: 'Seleccionar Datos', callback: this.onSeleccionarEntidades });
    }
    funciones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    return funciones;
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <div className='consulta-'>
        <div className='d-flex justify-content-center pt-3'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>
        <Input
          cols={12}
          label='Buscar por el nombre del área de prestación:'
          onChange={this.onCriterioChange}
          value={this.state.criterio}
          className='row mt-3'
          extra={{ onKeyPress: this.onKeyPress }}
        />

        <ConsultaGenerica
          {...this.props}
          idEntidad='arprIderegistro'
          columnas={this.obtenerColumnas()}
          ref={ref => this.consultaGenerica = ref}
          interfazGestion={RUTAS_VISTA.AREAS_PRESTACION.url}
          rutaConsulta={RUTAS_API.PARAMETRIZACION.AREAS_PRESTACION.FILTRO}
        />

      </div>
    );
  };
}

ConsultaAreaPrestacion.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionarEntidad: PropTypes.func
};

ConsultaAreaPrestacion.defaultProps = {
  esModal: false
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaAreaPrestacion);

export { VistaRedux as RConsultaAreaPrestacion };
