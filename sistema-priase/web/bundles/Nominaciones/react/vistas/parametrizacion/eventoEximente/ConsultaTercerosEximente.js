import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, } from 'appfuture-react';
import ConsultaGenerica from '../../../hoc/consultaGenerica/ConsultaGenerica';
import RUTAS_API from '../../../global/rutas_api';
import RUTAS_VISTA from '../../../global/rutas_vista';
import { TECLAS } from '../../../global/constantes';

class ConsultaTercerosEximente extends Component {

  consultaGenerica = null;
  columnas = [
    {
      Header: 'Contratos',
      columns: [
        {
          Header: 'Nombre',
          accessor: 'terIdeagente.terNomcompleto'
        },
        {
          Header: 'Número de contrato',
          accessor: 'cntNumero'
        },
        {
          Header: 'Documento',
          accessor: 'terIdeagente.terDocumento'
        },
        {
          Header: 'Fecha Inicio',
          accessor: 'cntFechainicio'
        },
        {
          Header: 'Fecha Fin',
          accessor: 'cntFechafin'
        }
      ]
    }
  ];
  state = { criterio: '' };

  /**
   * Método encargado de ejecutar acciones al momento de cargar el componente
   */
  componentDidMount() {
    if (this.props.autoConsultar) {
      this.onBuscar();
    }
  }

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
    const { tipoContrato, fechaIniEvento, fechaFinEvento } = this.props;
    this.consultaGenerica.getWrappedInstance()._buscar({
      'idTipoContrato': tipoContrato,
      'fechaInicio': fechaIniEvento,
      'fechaFin': fechaFinEvento
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
    this.setState({ criterio: '' });
    this.consultaGenerica.getWrappedInstance()._limpiarFormulario();
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
        <ConsultaGenerica
          {...this.props}
          idEntidad='cntIderegistro'
          columnas={this.columnas}
          ref={ref => this.consultaGenerica = ref}
          interfazGestion={RUTAS_VISTA.GESTION_EVENTO_EXIMENTE.url}
          rutaConsulta={RUTAS_API.PARAMETRIZACION.GESTION_EVENTO_EXIMENTE.CONSULTAR_CONTRATO_PADRE}
        />
      </div>
    );
  }

}

ConsultaTercerosEximente.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  tipoContrato: PropTypes.string,
  fechaIniEvento: PropTypes.string,
  fechaFinEvento: PropTypes.string,
  autoConsultar: PropTypes.bool
};

ConsultaTercerosEximente.defaultProps = {
  esModal: false
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaTercerosEximente);

export { VistaRedux as RConsultaTercerosEximente };
