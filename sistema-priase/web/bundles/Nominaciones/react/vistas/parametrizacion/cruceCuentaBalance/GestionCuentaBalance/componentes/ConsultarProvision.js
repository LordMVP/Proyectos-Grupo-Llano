import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Botonera, Tabla, Util } from 'appfuture-react';
import RUTAS_API from '../../../../../global/rutas_api';
import RUTAS_VISTA from '../../../../../global/rutas_vista';
import axios from 'axios';
import { ESTADOS_CRUCE } from '../../../../../global/constantes';
import ConsultaGenerica from '../../../../../hoc/consultaGenerica/ConsultaGenerica';
import { formatearArray } from '../../../../../global/util_nominaciones';

class ConsultarProvision extends Component {

  consultaGenerica = null;
  columnas = [
    {
      Header: 'Provisiones',
      columns: [
        {
          Header: 'Puntos de Salida',
          accessor: 'detalles',
          Cell: (props) => this.obtenerPuntosNegativos(props, this)
        },
        {
          Header: 'Estado',
          accessor: 'pcvEstado',
          Cell: (props) => this.obtenerEstado(props, this)
        },
        {
          Header: 'Fecha',
          accessor: 'ccbIderegistro.ctbIderegistro.ctbFechagen',
        },
      ]
    }
  ];

  state = { listadoEntidad: [] };

  /**
   * Método encargado de obtener el periodo
   * @param {Object} props Propiedades del componente Tabla
   */
  obtenerFecha = (props) => {
    let fecha = props.row._original.ctbIderegistro.ctbFechagen;
    fecha = fecha.substr(0, 7);
    return fecha;
  };

  /**
   * @method
   * Método encargado de ejercuitar acciones al momento de cargar el componente
   */
  componentDidMount() {
    this.onBuscar();
  }

  /**
   * Método encargado de obtener el texto del estado
   * @param {Object} props Propiedades del componente Tabla
   */
  obtenerEstado = (props) => {
    const estado = props.row._original.pcvEstado;
    switch (estado) {
      case ESTADOS_CRUCE.PENDIENTE:
        return 'Pendiente';
      case ESTADOS_CRUCE.APROBADO:
        return 'Aprobado';
      case ESTADOS_CRUCE.RECHAZADO:
        return 'Rechazado';
    }
  };

  /**
   * Método encargado de obtener los nombres de los puntos que pertenecen a esa provisión
   * @param {Object} props Propiedades del componente Tabla
   */
  obtenerPuntosNegativos = (props) => {
    const detalles = props.row._original.listaDetalles;
    return detalles.map(detalle => {
      return detalle.dccbIderegistro.ptsaIderegistro.ptsaNombre;
    }).join(',');
  };

  /**
   * Método encargado de generar los botones del formulario
   * @returns {Object}
   */
  obtenerFunciones = () => {
    let funciones = [{ texto: 'Consultar', callback: this.onBuscar }];
    funciones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    return funciones;
  };

  /**
   * Método encargado de obtener los datos seleccionados
   */
  onSeleccionarEntidades = () => {
    this.props.seleccionarEntidades(this.consultaGenerica.getWrappedInstance()._obtenerEntidades());
  };

  /**
   * Metodo encargado de realizar la consulta
   * @returns {bool}
   */
  onBuscar = () => {
    let parametros = {
      ccbIderegistro: this.props.idCruce
    }
    this.consultaGenerica.getWrappedInstance()._buscar(parametros);
  };

  /**
   * Método encargado de limpiar el formulario
   */
  limpiarFormulario = () => {
    this.consultaGenerica.getWrappedInstance()._limpiarFormulario();
    this.setState({
      listadoEntidad: []
    });
  };

  /**
   * @method
   * Método encargado de mostrar la tabla con los resultados
   * @returns {Component}
   */
  renderTabla() {
    if (!Util.validarArreglo(this.state.listadoEntidad)) {
      return <div className='text-center'>Sin resultados</div>;
    }

    return (
      <Tabla
        datos={this.state.listadoEntidad}
        columnas={this.columnas}
        className='mt-10'
      />
    );
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />
        <ConsultaGenerica
          {...this.props}
          idEntidad='pvcIderegistro'
          columnas={this.columnas}
          ref={ref => this.consultaGenerica = ref}
          interfazGestion={RUTAS_VISTA.GESTION_CUENTA_BALANCE.url}
          rutaConsulta={RUTAS_API.CRUCE_CUENTA_BALANCE.CONSULTAR_PROVISION}
        />
      </Fragment>
    );
  };
}

ConsultarProvision.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array,
  mostrarAlerta: PropTypes.func,
};

ConsultarProvision.defaultProps = {
  esModal: false
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultarProvision);

export { VistaRedux as RConsultarProvision };
