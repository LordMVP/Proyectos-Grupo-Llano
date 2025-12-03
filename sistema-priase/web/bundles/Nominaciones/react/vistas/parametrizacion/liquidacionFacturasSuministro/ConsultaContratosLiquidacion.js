import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Util, Input, Botonera, Tabla } from 'appfuture-react';
import ConsultaGenerica from '../../../hoc/consultaGenerica/ConsultaGenerica';
import RUTAS_API from '../../../global/rutas_api';
import RUTAS_VISTA from '../../../global/rutas_vista';
import moment from 'moment';

class ConsultaLiquidacionSuministro extends Component {
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
          Header: 'Tercero',
          accessor: 'cntIdecontrato.terIdeagente.terNomcompleto'
        },
        {
          Header: 'Contrato',
          accessor: 'cntIdecontrato.cntNumero'
        },
        {
          Header: 'Periodo',
          accessor: 'lqnsPeriodo'
        },
        {
          Header: 'Fecha Inicio',
          accessor: 'lqnsFechainicio',
          alias: 'fechaIni',
          Cell: (props) => this.obtenerValores(props, this)
        },
        {
          Header: 'Fecha Fin',
          accessor: 'lqnsFechafinal',
          alias: 'fechaFin',
          Cell: (props) => this.obtenerValores(props, this)
        },
        {
          Header: 'Tipo Remuneracion',
          accessor: 'lqnsTiporemuneracion',
          alias: 'renumeracion',
          Cell: (props) => this.obtenerValores(props, this)
        },
        {
          Header: 'Tipo de Mercado',
          accessor: 'lqnsTipomercado',
          alias: 'tipoMercado',
          Cell: (props) => this.obtenerValores(props, this)
        },
      ]
    }
  ];

  /**
   * Método encargado de obtener los valores de los props
   * @returns {String}
   */
  obtenerValores = (props) => {
    const { column, row } = props;
    if (column.alias == 'fechaIni') {
      return moment(row._original.lqnsFechainicio).format("YYYY/MM/DD");
    }
    if (column.alias == 'fechaFin') {
      return moment(row._original.lqnsFechafinal).format("YYYY/MM/DD");
    }
    if (column.alias == 'renumeracion') {
      return (row._original.lqnsTiporemuneracion) == 'PL' ? 'Plana' : 'Ponderada';
    }
    if (column.alias == 'tipoMercado') {
      if (row._original.lqnsTipomercado == null) {
        return '';
      }
      return (row._original.lqnsTipomercado) == 'REG' ? 'Regulado' : 'No Regulado';
    }
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
      <div className='conf-general row mt-5'>
        <Botonera funciones={this.obtenerFunciones()} />
        <Combo
          opciones={this.state.tiposMercado}
          propTexto='uniNombre1'
          propValor='uniIderegistro'
          label='Tipo Mercado:'
          name='tipoMercado'
          value={this.state.tipoMercado}
          onChange={this.controlarCambio}
        />
        <ConsultaGenerica
          {...this.props}
          idEntidad='lqnsIderegistro'
          columnas={this.columnas}
          ref={ref => this.consultaGenerica = ref}
          interfazGestion={RUTAS_VISTA.GESTION_LIQUIDACION_FACTURAS_SUMINISTRO_NEGOCIACION_DIRECTA.url}
          rutaConsulta={RUTAS_API.PARAMETRIZACION.GESTION_LIQUIDACION_FACTURAS_SUMINISTRO_NEGOCIACION_DIRECTA.CONSULTAR_LIQUIDACION}
        />

      </div>
    );
  }

}

ConsultaLiquidacionSuministro.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  idContrato: PropTypes.number
};

ConsultaLiquidacionSuministro.defaultProps = {
  esModal: false
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaLiquidacionSuministro);

export { VistaRedux as RConsultaLiquidacionSuministro };
