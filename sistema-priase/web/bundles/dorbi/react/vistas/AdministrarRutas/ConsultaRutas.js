import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { Input, Botonera, Combo, TextoNumerico } from 'appfuture-react';
import RUTAS_API from '../../global/rutas_api';
import RUTAS_VISTA from '../../global/rutas_vista';
import { TECLAS } from '../../global/constantes';
import ConsultaGenerica from '../../hoc/consultaGenerica/ConsultaGenerica';

class ConsultaRutas extends Component {

  consultaGenerica = null;
  columnas = [
    {
      Header: 'Rutas',
      columns: [
        {
          Header: 'Nombre',
          accessor: 'rutNombre'
        },
        {
          Header: 'Codigo',
          accessor: 'rutCodigo'
        },
        {
          Header: 'Tipo De Ruta',
          accessor: 'rutTipo'
        },
        {
          Header: 'Ciclo',
          accessor: 'cicIderegistro.cicNombre'
        },
      ]
    }
  ];

  state = {
    criterio: '',
    ciclo: '',
    tipoRuta: '',
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
    const { criterio, tipoRuta, ciclo } = this.state;
    this.consultaGenerica.getWrappedInstance()._buscar({
      criterio: (criterio === '') ? null : criterio,
      tipo: (tipoRuta === '') ? 0 : tipoRuta,
      ciclo: (ciclo === '') ? 0 : tipoRuta,
    });
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
    this.setState({
      criterio: '',
      ciclo: '',
      tipoRuta: '',
    });
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
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.setState(change);
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
        <div className='row'>
          <Input
            label='Nombre'
            onChange={this.onCriterioChange}
            value={this.state.criterio}
            extra={{ onKeyPress: this.onKeyPress }}
          />
          <Combo
            opciones={this.props.listaTipo}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Tipo de Ruta:'
            name='tipoRuta'
            value={this.state.tipoRuta}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={this.props.listaCiclo}
            propTexto='cicNombre'
            propValor='cicIderegistro'
            label='Ciclo:'
            name='ciclo'
            value={this.state.ciclo}
            onChange={this.controlarCambio}
          />
        </div>

        <ConsultaGenerica
          {...this.props}
          idEntidad='idRegistro'
          columnas={this.columnas}
          ref={ref => this.consultaGenerica = ref}
          interfazGestion={RUTAS_VISTA.ADMINISTRAR_RUTAS.url}
          rutaConsulta={RUTAS_API.PARAMETRIZACION.ADMINISTRAR_RUTAS.CONSULTAR_RUTAS}
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
  entidadesSeleccionadas: PropTypes.array,
  listaCiclo: PropTypes.array,
  listaTipo: PropTypes.array,
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
