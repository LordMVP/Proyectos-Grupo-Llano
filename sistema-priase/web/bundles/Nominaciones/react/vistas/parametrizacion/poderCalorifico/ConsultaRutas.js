import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import RUTAS_API from '../../../global/rutas_api';
import { Input, Botonera } from 'appfuture-react';
import RUTAS_VISTA from '../../../global/rutas_vista';
import { TECLAS, CLASES_UNIDADES } from '../../../global/constantes';
import ConsultaGenerica from '../../../hoc/consultaGenerica/ConsultaGenerica';

class ConsultaRutas extends Component {

  consultaGenerica = null;
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
    const { criterio } = this.state;
    this.consultaGenerica.getWrappedInstance()._buscar({ criterio: criterio.trim(), idClase: CLASES_UNIDADES.RUTA_GNC_CONEXION });
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
            Header: 'Nombre',
            accessor: 'uniNombre1'
          },
          {
            Header: 'Tipo',
            accessor: 'uniPropiedad',
            Cell: (props) => contexto.renderTipoRuta(props, contexto)
          }
        ]
      }
    ];
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
      this.onBuscar();
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
          label='Buscar Rutas'
          onChange={this.onCriterioChange}
          value={this.state.criterio}
          className='row mt-3'
          extra={{ onKeyPress: this.onKeyPress }}
        />

        <ConsultaGenerica
          {...this.props}
          idEntidad='uniIderegistro'
          columnas={this.obtenerColumnas()}
          ref={ref => this.consultaGenerica = ref}
          interfazGestion={RUTAS_VISTA.GESTION_PODER_CALORIFICO.url}
          rutaConsulta={RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD}
        />

      </div>
    );
  };
}

ConsultaRutas.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array
};

ConsultaRutas.defaultProps = {
  esModal: false,
  seleccionMultiple: false,
  entidadesSeleccionadas: []
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaRutas);

export { VistaRedux as RConsultaRutas };
