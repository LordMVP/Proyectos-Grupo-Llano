import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Util, Input, Botonera, Tabla } from 'appfuture-react';
import ConsultaGenerica from '../../../hoc/consultaGenerica/ConsultaGenerica';
import RUTAS_API from '../../../global/rutas_api';
import RUTAS_VISTA from '../../../global/rutas_vista';

class ConsultaLiquidacionEspecial extends Component {
  consultaGenerica = null;
  state = {
    listadoEntidad: [],
    criterio: '',
  };

  /**
   * Método encargado de ejecutar la peticion de consulta
   */
  onBuscar = () => {
    this.consultaGenerica.getWrappedInstance()._buscar({ 'idcontratoventa': this.props.idContrato });
  };

  columnas = [
    {
      Header: 'Liquidaciones',
      columns: [
        {
          Header: 'Contrato',
          accessor: 'numContrato',
          Cell: (props) => this.obtenerValores(props, this)
        },
        {
          Header: 'Tercero',
          accessor: 'tercero',
          Cell: (props) => this.obtenerValores(props, this)
        },
        {
          Header: 'Fecha Inicio',
          accessor: 'fatFechainicio'
        },
        {
          Header: 'Fecha Fin',
          accessor: 'fatFechafin'
        }
      ]
    }
  ];

  /**
   * Método encargado de obtener los valores de los props
   * @returns {String}
   */
  obtenerValores = (props) => {
    const { tercero, numeroContrato } = this.props;
    const { column } = props;
    if (column.Header == 'Tercero') {
      return tercero.terNomcompleto;
    }
    return numeroContrato;
  };

  /**
   * Método encargado de limpiar la tabla
   */
  limpiarFormulario = () => {
    this.consultaGenerica.getWrappedInstance()._limpiarFormulario();
  };

  /**
   * Método encargado de generar los botones para el componente Botonera
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Consultar', callback: this.onBuscar },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };


  /**
   * Método encargado de mostrar el formulario principal
   * @param {JSX}
   */
  render() {
    return (
      <div className='consulta-'>
        <div className='d-flex justify-content-center pt-3'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>

        <ConsultaGenerica
          {...this.props}
          idEntidad='fatIderegistro'
          columnas={this.columnas}
          ref={ref => this.consultaGenerica = ref}
          interfazGestion={RUTAS_VISTA.GESTION_LIQUIDACION_ESPECIAL_SUMINISTRO.url}
          rutaConsulta={RUTAS_API.PARAMETRIZACION.LIQUIDACION_CUSIANA.CONSULTAR}
        />

      </div>
    );
  }

}

ConsultaLiquidacionEspecial.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  idContrato: PropTypes.number
};

ConsultaLiquidacionEspecial.defaultProps = {
  esModal: false
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaLiquidacionEspecial);

export { VistaRedux as RConsultaLiquidacionEspecial };
