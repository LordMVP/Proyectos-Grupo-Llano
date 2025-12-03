import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Util, Input, Botonera, Tabla } from 'appfuture-react';
import ConsultaGenerica from '../../../hoc/consultaGenerica/ConsultaGenerica';
import RUTAS_API from '../../../global/rutas_api';
import RUTAS_VISTA from '../../../global/rutas_vista';
import { TECLAS } from '../../../global/constantes';

class ConsultaCompresiones extends Component {
  consultaGenerica = null;
  columnas = [
    {
      Header: 'Tramos',
      columns: [
        {
          Header: 'Punto de Compresión',
          accessor: 'puntoCompresion.ptcuIdepuntoubicacion.idepuntoconsumo.ptcoNombre'
        },
        {
          Header: 'Municipio',
          accessor: 'municipio.nombre'
        },
        {
          Header: 'Fecha',
          accessor: 'puntoCompresion.ptcmFechacompresion',
          Cell: (props) => this.convertirFecha(props, this)
        },
        {
          Header: 'Cantidad Comprimida',
          accessor: 'puntoCompresion.ptcmCantidad'
        },
        {
          Header: 'Unidad de Medida',
          accessor: 'puntoCompresion.uniIdemedida.uniNombre1'
        },
      ]
    }
  ];
  state = { criterio: '' };

  /**
   * Obtiene la fecha en string de las propiedades que recibe de la tabla.
   * @return {string}
   */
  convertirFecha = (props) => {
    const fecha = new Date(props.row._original.puntoCompresion.ptcmFechacompresion);
    const anio = fecha.getFullYear();
    const dia = fecha.getDate();
    const mes = fecha.getMonth();
    return `${((dia < 9) ? '0' : '')}${(dia + 1)}/${(mes < 9) ? '0' : ''}${mes + 1}/${anio}`;
  };

  /**
   * Método encargado de generar los botones de la interfaz
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
    this.props.seleccionarEntidades(this.consultaGenerica.getWrappedInstance()._obtenerEntidades());
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
   * @param {Event} event El evento que se ejecuta en el control de usuario
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
      this.consultaGenerica.getWrappedInstance()._buscar({ 'criterio': this.state.criterio.trim() });
    }
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <div className='consulta-tramos'>
        <div className="d-flex justify-content-center pt-3">
          <Botonera funciones={this.obtenerFunciones()} />
        </div>

        <ConsultaGenerica
          {...this.props}
          idEntidad='ptcmIderegistro'
          columnas={this.columnas}
          ref={ref => this.consultaGenerica = ref}
          interfazGestion={RUTAS_VISTA.GESTION_INGRESO_COMPRESIONES.url}
          rutaConsulta={RUTAS_API.PARAMETRIZACION.GESTION_INGRESO_COMPRESIONES.CONSULTAR_COMPRESIONES}
        />

      </div>
    );
  };

}

ConsultaCompresiones.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array,
  mostrarAlerta: PropTypes.func,
};

ConsultaCompresiones.defaultProps = {
  esModal: false
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaCompresiones);

export { VistaRedux as RConsultaCompresiones };
