import React, { Component } from 'react';

import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';

import PropTypes from 'prop-types';

import { Input, Botonera } from 'appfuture-react';
import RUTAS_API from '../../../global/rutas_api';
import RUTAS_VISTA from '../../../global/rutas_vista';
import { TECLAS } from '../../../global/constantes';
import ConsultaGenerica from '../../../hoc/consultaGenerica/ConsultaGenerica';

class ConsultaRutasSistemaNacional extends Component {

  consultaGenerica = null;
  columnas = [
    {
      Header: 'Rutas del Sistema Nacional de Transporte',
      columns: [
        {
          Header: 'Nombre',
          accessor: 'uniNombre1'
        },
        {
          Header: 'Código',
          accessor: 'uniCodigo'
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
      funciones.push({ texto: 'Seleccionar datos', callback: this.onSeleccionarEntidades });
    }
    funciones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    return funciones;
  };

  /**
   * Metodo encargado de realizar la consulta
   * @returns {bool}
   */
  onBuscar = () => {
    this.consultaGenerica.getWrappedInstance()._buscar({ 'criterio': this.state.criterio });
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
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    console.info('Actualizacion en criterio');
    return (
      <div className='consulta-tramos'>
        <Botonera funciones={this.obtenerFunciones()} />

        <Input
          cols={12}
          label='Buscar Rutas del Sistema Nacional de Transporte:'
          onChange={this.onCriterioChange}
          value={this.state.criterio}
          className='row mt-3'
          extra={{ onKeyPress: this.onKeyPress }}
        />

        <ConsultaGenerica
          {...this.props}
          idEntidad='uniIderegistro'
          columnas={this.columnas}
          ref={ref => this.consultaGenerica = ref}
          interfazGestion={RUTAS_VISTA.GESTION_RUTAS_SISTEMA_NAL.url}
          rutaConsulta={RUTAS_API.PARAMETRIZACION.RUTAS_SISTEMA_NAL.CONSULTAR_RUTAS_SISTEMA_NAL}
        />

      </div>
    );
  };
}

ConsultaRutasSistemaNacional.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array
};

ConsultaRutasSistemaNacional.defaultProps = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaRutasSistemaNacional);

export { VistaRedux as RConsultaRutasSistemaNacional };
