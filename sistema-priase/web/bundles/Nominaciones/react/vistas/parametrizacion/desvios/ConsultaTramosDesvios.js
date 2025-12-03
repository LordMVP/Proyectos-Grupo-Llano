import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, } from 'appfuture-react';
import ConsultaGenerica from '../../../hoc/consultaGenerica/ConsultaGenerica';
import RUTAS_API from '../../../global/rutas_api';
import RUTAS_VISTA from '../../../global/rutas_vista';
import { TECLAS } from '../../../global/constantes';

class ConsultaTramosDesvios extends Component {

  consultaGenerica = null;
  columnas = [
    {
      Header: 'Tramos',
      columns: [
        {
          Header: 'Nombre',
          accessor: 'trmNombre'
        },
        {
          Header: 'Cód. Gestor',
          accessor: 'trmCodgestor'
        }
      ]
    }
  ];
  state = { criterio: '' };

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
   * Metodo encargado de realizar la consulta
   * @returns {bool}
   */
  onBuscar = () => {
    const ruta = this.props.rutaSeleccionada;
    if (ruta === '' || ruta === '-1') {
      this.props.mostrarAlerta('Error', 'Debe seleccionar una ruta');
      return;
    }
    this.consultaGenerica.getWrappedInstance()._buscar({ 'criterio': this.state.criterio.trim(), 'ruta': this.props.rutaSeleccionada });
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
      const ruta = this.props.rutaSeleccionada;
      if (ruta === '' || ruta === '-1') {
        this.props.mostrarAlerta('Error', 'Debe seleccionar una ruta');
        return;
      }
      this.consultaGenerica.getWrappedInstance()._buscar({ 'criterio': this.state.criterio.trim(), 'ruta': this.props.rutaSeleccionada });
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

        <Input
          cols={12}
          label='Buscar tramos nombre del tramo:'
          onChange={this.onCriterioChange}
          value={this.state.criterio}
          className='row mt-3'
          extra={{ onKeyPress: this.onKeyPress }}
        />

        <ConsultaGenerica
          {...this.props}
          idEntidad='trmIderegistro'
          columnas={this.columnas}
          ref={ref => this.consultaGenerica = ref}
          interfazGestion={RUTAS_VISTA.GESTION_DESVIOS.url}
          rutaConsulta={RUTAS_API.PARAMETRIZACION.GESTION_DESVIOS.CONSULTAR_TRAMOS}
        />

      </div>
    );
  };
}

ConsultaTramosDesvios.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array,
  rutaSeleccionada: PropTypes.string.isRequired,
  mostrarAlerta: PropTypes.func,
};

ConsultaTramosDesvios.defaultProps = {
  esModal: false
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaTramosDesvios);

export { VistaRedux as RConsultaTramosDesvios };
