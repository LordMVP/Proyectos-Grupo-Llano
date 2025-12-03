import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import ConsultaGenerica from '../../../hoc/consultaGenerica/ConsultaGenerica';
import RUTAS_API from '../../../global/rutas_api';
import RUTAS_VISTA from '../../../global/rutas_vista';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { Util, Combo, Botonera, Fecha, VentanaModal } from 'appfuture-react';
import { limpiarJson } from '../../../global/util_nominaciones';
import { mostrarProgramaModal } from '../../../store/actions/AplicacionAcciones';
import { get as getProp } from 'object-path';
import { Fragment } from 'react';
import { RConsultaAgentesTerceros } from '../agentesTerceros/ConsultaAgentesTerceros';
import { RConsultaContratos } from '../../contratos/ConsultaContratos';

const listaOpciones = [
  { texto: 'Certificado', valor: 'C' },
  { texto: 'Aprobado', valor: 'A' },
  { texto: 'Pendiente', valor: 'P' }
];

class ConsultaLiquidacionSuministro extends Component {
  consultaGenerica = null;
  state = {
    periodo: '',
    estado: '',
    contrato: null,
    tercero: null,
    modalContratos: false
  };

  /**
   * @method
   * Método encargado de ejecutar la peticion de consulta
   */
  onBuscar = () => {
    const { contrato, tercero, estado, periodo } = this.state;
    const parametros = {
      contrato: limpiarJson(contrato),
      tercero: limpiarJson(tercero),
      estado: estado,
      periodo: periodo
    };
    this.consultaGenerica.getWrappedInstance()._buscar(parametros);
  };

  columnas = [
    {
      Header: 'Liquidaciones',
      columns: [
        {
          Header: 'Tercero',
          accessor: 'terIderegistro.terNomcompleto'
        },
        {
          Header: 'Periodo',
          accessor: 'lqnsPeriodo'
        },
        {
          Header: 'Total Factura',
          accessor: 'lqnsTotalfactura',
        },
        {
          Header: 'Tipo Renumeración',
          accessor: 'tipoRemuneracion',
        },
        {
          Header: 'Estado',
          accessor: 'lqnsEstado',
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
    switch (row._original.lqnsEstado) {
      case 'C':
        return 'Certificado';
      case 'P':
        return 'Pendiente';
      case 'A':
        return 'Aprobado';
    }
  };

  /**
   * @method
   * Método encargado de limpiar la tabla
   */
  limpiarFormulario = () => {
    this.setState({
      contrato: null,
      tercero: null,
      estado: '',
      periodo: '',
      modalContratos: false
    });
    this.consultaGenerica.getWrappedInstance()._limpiarFormulario();
  };

  /**
   * @method
   * Método encargado de generar los botones para el componente Botonera
   * @returns {Array}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Consultar', callback: this.onBuscar },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * @method
   * Método encargado de cargar los datos de la entidad en la variable contrato
   * @param {Object} entidad Entidad seleccioanda
   */
  onSeleccionarContrato = (entidad) => {
    this.setState({ contrato: { ...entidad } });
  };

  /**
   * @method
   * Método encargado de limpiar los contratos seleccionados
   */
  limpiarContrato = () => {
    this.setState({ contrato: null });
  }

  /**
   * @method
   * Método encargado de abrir le modal de consultar
   * @returns {Boolean}
   */
  abrirConsultaContratos = () => {
    this.setState({ modalContratos: true });
  };

  /**
   * @method
   * Método encargado de mostrar el componente selector de contratos
   * @returns {Object}
   */
  renderSelectorContrato = () => {
    const propsInput = {
      placeholder: 'Buscar Contrato',
      className: 'form-control',
      name: 'contrato',
      title: getProp(this.state.contrato, 'cntNumero', ''),
      value: getProp(this.state.contrato, 'cntNumero', ''),
      type: 'text',
      disabled: true
    };
    return (
      <div className='col-4 form-group mt-1'>
        <label>Contrato:</label>
        <div className="input-group mb-3">
          <input {...propsInput} />
          <div className="input-group-prepend">
            <button className="btn-primary input-group-text" title='Limpiar Contrato' onClick={this.limpiarContrato}><i className='fa fa-fw fa-trash'></i></button>
            <button className="btn-primary btn-buscador input-group-text" title='Seleccionar contrato' onClick={this.abrirConsultaContratos}><i className='fa fa-fw fa-check-square-o'></i></button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * @method
   * Método encargado de actualizar el objeto redux con el tercero seleccionado
   * @param {Object} agente Tercero seleccionado
   */
  seleccionarAgente = (agente) => {
    this.setState({ tercero: { ...agente } });
  };

  /**
   * @method
   * Método encargado de limpiar los datos del campo selector terceros
   */
  limpiarAgenteTercero = () => {
    this.setState({ tercero: null });
  };

  /**
   * @method
   * Método encargado de cerrar el componente ventana modal de la consulta terceros
   */
  abrirConsultaTerceros = () => {
    const consultaAgentes = <RConsultaAgentesTerceros esModal seleccionarEntidad={this.seleccionarAgente} />;
    this.props.mostrarProgramaModal(consultaAgentes);
  };

  /**
   * @method
   * Método encargado de mostrar el campo selector de agentes tercero
   * @returns {JSX}
   */
  renderBuscadorTercero = () => {
    const tercero = getProp(this.state, 'tercero', '');
    const propsInput = {
      placeholder: 'Seleccione un agente',
      className: 'form-control',
      onChange: this.controlarCambio,
      name: 'tercero',
      title: getProp(tercero, 'terNomcompleto', ''),
      value: getProp(tercero, 'terNomcompleto', ''),
      type: 'text',
      disabled: true
    };
    return (
      <div className='col-4 form-group'>
        <label>Agente Tercero:</label>
        <div className="input-group mb-3">
          <input {...propsInput} />
          <div className="input-group-prepend">
            <button className="btn-primary input-group-text" title='Limpiar Agente' onClick={this.limpiarAgenteTercero}><i className='fa fa-fw fa-trash'></i></button>
            <button className="btn-primary btn-buscador input-group-text" title='Seleccionar Agente Tercero' onClick={this.abrirConsultaTerceros}><i className='fa fa-fw fa-check-square-o'></i></button>
          </div>
        </div>
      </div>
    );
  };

  /**
    * @method
    * Método encargado de controlar el cambio del valor de los campos del formulario
    * @param {Event} evento El evento que se ejecuta en el control de usuario
    */
   controlarCambio = (evento) => {
      let change = {};
      const { name, value } = evento.target;
      change[name] = value;
      this.setState(change);
   };

  /**
   * Método encargado de mostrar el formulario principal
   * @param {JSX}
   */
  render() {
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />
        <div className='conf-general row mt-5'>
          <Combo
            opciones={listaOpciones}
            propTexto='texto'
            propValor='valor'
            label='Estados Liquidación:'
            name='estado'
            value={this.state.estado}
            onChange={this.controlarCambio}
          />
          {this.renderBuscadorTercero()}
          {this.renderSelectorContrato()}
          <Fecha
            label='Periodo'
            name='periodo'
            fecha={this.state.periodo}
            onChange={this.controlarCambio}
            sinDia={true}
          />

        </div>
        <ConsultaGenerica
          {...this.props}
          idEntidad='lqnsIderegistro'
          columnas={this.columnas}
          ref={ref => this.consultaGenerica = ref}
          interfazGestion={RUTAS_VISTA.GESTION_LIQUIDACION_FACTURAS_SUMINISTRO_NEGOCIACION_DIRECTA.url}
          rutaConsulta={RUTAS_API.PARAMETRIZACION.GESTION_LIQUIDACION_FACTURAS_SUMINISTRO_NEGOCIACION_DIRECTA.CONSULTAR_LIQUIDACION}
        />
        <VentanaModal
          mostrar={this.state.modalContratos}
          titulo='Seleccionar Contrato'
          cerrarModal={() => this.setState({ modalContratos: false })}>
          <RConsultaContratos
            esModal
            seleccionarEntidad={this.onSeleccionarContrato}
            tiposContrato={['S']}
            estadosContrato={['A', 'F']}
            inhabilitarTercero={true}
            tipoNegocio={'V'}
            inhabilitarEstado={true}
            tiposContratoDisabled={true}
          />
        </VentanaModal>
      </Fragment>

    );
  }

}

ConsultaLiquidacionSuministro.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  mostrarProgramaModal: PropTypes.func,
};

ConsultaLiquidacionSuministro.defaultProps = {
  esModal: false
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ mostrarProgramaModal }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaLiquidacionSuministro);

export { VistaRedux as RConsultaLiquidacionSuministro };
