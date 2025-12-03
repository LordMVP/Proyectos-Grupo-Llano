import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { Input, Botonera, Tabla, Util } from 'appfuture-react';
import RUTAS_API from '../../global/rutas_api';
import RUTAS_VISTA from '../../global/rutas_vista';
import { TECLAS } from '../../global/constantes';
import ConsultaGenerica from '../../hoc/consultaGenerica/ConsultaGenerica';

class ConsultaRegimenTarifas extends Component {

  consultaGenerica = null;
  state = {
    criterio: '',
    listaRegimenTarifas: []
  };

  /**
   * Método encargado de verificar si se abre como ventana modal y de seleccion multiple
   * @param {Object} props Propiedades del componente Tabla
   * @param {Component} contexto Contexto del componente ConsultaRegimenTarifas.
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
  * Método encargado de obtener el nombre de la actividad
  * @param {Object} props Propiedades del componente Tabla
  */
  obtenerFechaInicio = (props) => {
    const fechaNumero = parseInt(props.row._original.rgtaFecinivigencia);
    let fecha = new Date(fechaNumero);
    fecha = (fecha.getFullYear() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getDate());
    return (fechaNumero) ? fecha : '';
  };

  /**
  * Método encargado de obtener el nombre de la actividad
  * @param {Object} props Propiedades del componente Tabla
  */
  obtenerFechaFin = (props) => {
    const fechaNumero = parseInt(props.row._original.rgtaFecfinvigencia);
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
   * Metodo encargado de obtener columnas de la tabla
   * @returns {array}
   */
  obtenerColumnas = () => {
    const contexto = this;
    return [
      {
        Header: 'Consulta Regimen Tarifas',
        columns: [
          {
            Header: 'Nombre',
            accessor: 'rgtaNombre'
          },

          {
            Header: 'Descripción',
            accessor: 'rgtaDescripcion'
          },

          {
            Header: 'Fecha Inicio',
            accessor: 'rgtaFecinivigencia',
            Cell: contexto.obtenerFechaInicio
          },

          {
            Header: 'Fecha Fin',
            accessor: 'rgtaFecfinvigencia',
            Cell: contexto.obtenerFechaFin
          }
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
      <div className='consulta-tramos'>
        <Botonera funciones={this.obtenerFunciones()} />
        <Input
          cols={12}
          label='Nombre Régimen Tarifario'
          onChange={this.onCriterioChange}
          value={this.state.criterio}
          name='criterio'
          extra={{ onKeyPress: this.onKeyPress }}
        />

        {Util.validarArreglo(this.state.listaRegimenTarifas) && (
          <Tabla
            datos={this.state.listaRegimenTarifas}
            columnas={this.obtenerColumnas()}
          />
        )
        }
        <ConsultaGenerica
          {...this.props}
          idEntidad='rgtaIderegistro'
          columnas={this.obtenerColumnas()}
          ref={ref => this.consultaGenerica = ref}
          interfazGestion={RUTAS_VISTA.REGIMEN_TARIFAS.url}
          rutaConsulta={RUTAS_API.PARAMETRIZACION.REGIMEN_TARIFAS.CONSULTA_REGIMEN_TARIFAS}
        />
      </div>
    );
  };
}

ConsultaRegimenTarifas.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array
};

ConsultaRegimenTarifas.defaultProps = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaRegimenTarifas);

export { VistaRedux as RConsultaRegimenTarifas };
