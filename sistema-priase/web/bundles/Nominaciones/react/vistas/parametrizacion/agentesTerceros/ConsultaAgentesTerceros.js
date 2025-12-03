import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { Input, Botonera } from 'appfuture-react';
import RUTAS_API from '../../../global/rutas_api';
import RUTAS_VISTA from '../../../global/rutas_vista';
import { TECLAS } from '../../../global/constantes';
import ConsultaGenerica from '../../../hoc/consultaGenerica/ConsultaGenerica';

class ConsultaAgentesTerceros extends Component {

  consultaGenerica = null;
  columnas = [
    {
      Header: 'Agentes Terceros',
      columns: [
        {
          Header: 'Documento',
          accessor: 'terDocumento'
        },
        {
          Header: 'Tercero',
          accessor: 'terNomcompleto'
        },
        {
          Header: 'Tipo',
          accessor: 'info.lista_tipo',
          Cell: (props) => this.obtenerTiposContrato(props, this)
        },
      ]
    }
  ];
  state = { criterio: '' };

  /**
    * Obtiene los tipos de contrato de las propiedades que recibe de la tabla.
    * @return {string}
    */
  obtenerTiposContrato = (props) => {
    const listaTipos = JSON.parse(props.row._original.info.lista_tipo);
    if (!Array.isArray(listaTipos) || listaTipos.length == 0) {
      return 'Indefinido';
    }
    return listaTipos.map(tipo => {
      return tipo.uni_nombre1;
    }).join(',');
  };

  /**
   * Método encargado de verificar si se abre como ventana modal y de seleccion multiple
   * @param {Object} props Propiedades del componente Tabla
   * @param {Component} contexto Contexto del componente ConsultaAgentesTerceros
   */
  renderCeldaAcciones = (props, contexto) => {
    //Se verifica si el programa se abre como modal y de selección múltiple.
    if (contexto.props.seleccionMultiple && this.contexto.props.esModal) {
      return (
        <span className='consulta-tramos__link-accion'>
          <label><input type='checkbox' onChange={contexto.onCheckEntidad} /> Seleccionar</label>
        </span>
      )
    }
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
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <div className='consulta-tramos'>
        <div className='d-flex justify-content-center pt-3'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>

        <Input
          cols={12}
          label='Buscar terceros por Nombre o Nit:'
          onChange={this.onCriterioChange}
          value={this.state.criterio}
          className='row mt-3'
          extra={{ onKeyPress: this.onKeyPress }}
        />

        <ConsultaGenerica
          {...this.props}
          idEntidad='idRegistro'
          columnas={this.columnas}
          seleccionMultiple={false}
          ref={ref => this.consultaGenerica = ref}
          interfazGestion={RUTAS_VISTA.GESTION_AGENTES_TERCEROS.url}
          rutaConsulta={RUTAS_API.PARAMETRIZACION.GESTION_AGENTES_TERCEROS.CONSULTAR_TERCEROS}
        />

      </div>
    );
  };
}

ConsultaAgentesTerceros.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array
};

ConsultaAgentesTerceros.defaultProps = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaAgentesTerceros);

export { VistaRedux as RConsultaAgentesTerceros };
