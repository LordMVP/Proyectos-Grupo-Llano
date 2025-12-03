import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Fecha, Combo, Util, Tabla } from 'appfuture-react';
import RUTAS_API from '../../../global/rutas_api';
import RUTAS_VISTA from '../../../global/rutas_vista';
import { TECLAS } from '../../../global/constantes';
import axios from 'axios';

const listaEstados = [
  { texto: 'Pendiente', id: 'P' },
  { texto: 'Aprovado', id: 'A' },
  { texto: 'Rechazado', id: 'I' },
];

class ConsultaPuntos extends Component {

  /**
   * Método encargado de obtener las columnas del componente Tabla
   * @returns {Array}
   */
  obtenerColumnas = () => {
    const contexto = this;
    return [
      {
        Header: 'Puntos Aprobados',
        columns: [
          {
            Header: 'Punto de Salida',
            accessor: 'ptsaIdepositivo.ptsaNombre'
          },
          {
            Header: 'Estado',
            accessor: 'ctbEstado',
            Cell: contexto.obtenerEstado,
          },
          {
            Header: 'Fecha Cruce',
            accessor: 'ctbFechacruce'
          },
          {
            Header: 'Descripción Cruce',
            accessor: 'ctbDescripcion'
          },
        ]
      }
    ];
  };

  state = {
    criterio: '',
    listadoEntidad: []
  };

  /**
   * Método encargado de obtener el texto de estado aprobado
   * @returns {string}
   */
  obtenerEstado = (props) => {
    const estado = props.row._original.ctbEstado;
    const estadoAprobado = listaEstados.find(p => p.id == estado);
    return estadoAprobado.texto;
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
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_APROBACION_CUENTA_BALANCE.CONSULTAR_PUNTOS, { estado: 'A' })
      .then(respuesta => {
        this.setState({ listadoEntidad: respuesta.data.datos });
      });
  };

  /**
   * Método encargado de limpiar el formulario
   */
  limpiarFormulario = () => {
    this.setState({
      criterio: '',
      listadoEntidad: '',
    });
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
      this.onBuscar();
    }
  };

  /**
  * Método encargado de generar el componente Tabla
  * @returns {Component}
  */
  renderTabla = () => {
    if (!Util.validarArreglo(this.state.listadoEntidad)) {
      return <div className='text-center'>Sin resultados</div>;
    }

    return (
      <Tabla
        datos={this.state.listadoEntidad}
        columnas={this.obtenerColumnas()}
      />
    );
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

        {this.renderTabla()}

      </div>
    );
  };

}

ConsultaPuntos.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array,
  mostrarAlerta: PropTypes.func,
};

ConsultaPuntos.defaultProps = {
  esModal: false
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaPuntos);

export { VistaRedux as RConsultaPuntos };
