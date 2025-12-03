import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Botonera, Fecha, Combo, VentanaModal } from 'appfuture-react';
import ConsultaGenerica from '../../../../hoc/consultaGenerica/ConsultaGenerica';
import RUTAS_API from '../../../../global/rutas_api';
import RUTAS_VISTA from '../../../../global/rutas_vista';
import { get as getProp } from 'object-path';
import axios from 'axios';
import { TIPOS_NEGOCIO, ESTADOS_CRUCE } from '../../../../global/constantes';
import { RConsultaContratos } from '../../../contratos/ConsultaContratos';

const listaEstados = [
  { texto: 'Pendiente', id: 'P' },
  { texto: 'Aprobado', id: 'A' },
  { texto: 'Rechazado', id: 'R' }
]

class ConsultarCompensacion extends Component {

  consultaGenerica = null;
  columnas = [
    {
      Header: 'Compensación Cuenta Balance',
      columns: [
        {
          Header: 'Punto de Consumo',
          accessor: 'ptcIderegistro.ptcoNombre'
        },
        {
          Header: 'Contrato',
          accessor: 'cntIderegistro.cntNumero',
          Cell: (props) => this.obtenerFecha(props, this)
        },
        {
          Header: 'Estado',
          accessor: 'ccbEstado',
          Cell: (props) => this.obtenerEstado(props, this)
        },
        {
          Header: 'Periodo',
          accessor: 'cmcbPeriodo',
        },
      ]
    }
  ];

  state = {
    puntoConsumo: '',
    contrato: null,
    periodo: '',
    modalContratos: false,
    estado: '',
    listaPuntosConsumo: []
  };

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
   * Método encargado de obtener el texto del estado
   * @param {Object} props Propiedades del componente Tabla
   */
  obtenerEstado = (props) => {
    const estado = props.row._original.ccbEstado;
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
   * Método encargado de generar los botones del formulario
   * @returns {Object}
   */
  obtenerFunciones = () => {
    let funciones = [{ texto: 'Consultar', callback: this.onBuscar }];
    funciones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    return funciones;
  };

  /**
   * Metodo encargado de realizar la consulta
   * @returns {bool}
   */
  onBuscar = () => {
    const { contrato, periodo, puntoConsumo, estado } = this.state;
    let parametros = {
      contrato: getProp(contrato, 'cntIderegistro', null),
      puntoConsumo: (puntoConsumo == '' || puntoConsumo == '-1') ? null : puntoConsumo,
      periodo: periodo,
      estado: estado,
    }
    this.consultaGenerica.getWrappedInstance()._buscar(parametros);
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
      periodo: '',
      contrato: null,
      puntoConsumo: '',
      modalContratos: false,
      estado: '',
      listaPuntosConsumo: []
    });
    this.consultaGenerica.getWrappedInstance()._limpiarFormulario();
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
  * @method
  * Método encargado de abrir el modal de consultar contratos
  * @returns {Boolean}
  */
  abrirConsultaContratos = () => {
    this.setState({ modalContratos: true });
  };

  /**
   * @method
   * Método encargado de cerrar la ventana del boton de consulta
   */
  abrirCerrarModal = () => {
    this.setState({ modalContratos: false });
  };

  /**
   * @method
   * Método encargado de cargar los datos de la entidad en la variable contrato
   * @param {Object} entidad Entidad seleccioanda
   */
  onSeleccionarContrato = (entidad) => {
    this.consultarPuntosConsumo(entidad.cntIderegistro);
    this.setState({
      contrato: entidad,
      modalContratos: false
    });
  };

  /**
   * @method
   * Método encargado de consultar los puntos de consumo por contrato
   * @param {Number} idContrato Identificador del contrato seleccionado
   */
  consultarPuntosConsumo = (idContrato) => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PUNTOS_CONSUMO.CONSULTAR_PUNTOS_BALANCE, { idContrato: idContrato })
      .then(respuesta => {
        this.setState({ listaPuntosConsumo: [...formatearArray(respuesta.data.datos)] });
      });
  }

  /**
  * @method
  * Método encargado de mostrar el componente selector de contratos
  * @returns {Object}
  */
  renderSelectorContrato = () => {
    const contrato = getProp(this.state, 'contrato', null);
    const propsInput = {
      placeholder: 'Seleccione un contrato',
      className: 'form-control',
      onChange: this.controlarCambio,
      name: 'contrato',
      title: `${getProp(contrato, 'cntNumero', '')}-${getProp(contrato, 'cntNumero', '')}`,
      value: getProp(contrato, 'cntNumero', ''),
      type: 'text',
      disabled: true
    };
    return (
      <div className='col-4 form-group mt-1'>
        <label>Contrato:</label>
        <div className="input-group mb-3">
          <input {...propsInput} />
          <div className="input-group-prepend">
            <button className="btn-primary btn-buscador input-group-text" title='Seleccionar contrato' onClick={this.abrirConsultaContratos}><i className='fa fa-fw fa-check-square-o'></i></button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <Fragment>
        <div className='conf-general row mt-5'>
          <Botonera funciones={this.obtenerFunciones()} />
          <Fecha
            label="Periodo:"
            onChange={this.controlarCambio}
            name='periodo'
            fecha={this.state.periodo}
            sinDia={true}
          />
          <Combo
            opciones={listaEstados}
            propTexto='texto'
            propValor='id'
            label='Estado:'
            name='estado'
            value={this.state.estado}
            onChange={this.controlarCambio}
          />
          {this.renderSelectorContrato()}
          <Combo
            opciones={this.state.listaPuntosConsumo}
            propTexto='ptcoNombre'
            propValor='ptcIderegistro'
            label='Puntos de consumo:'
            name='puntoConsumo'
            value={this.state.puntoConsumo}
            onChange={this.controlarCambio}
          />
        </div>
        <ConsultaGenerica
          {...this.props}
          idEntidad='cmcbIderegistro'
          columnas={this.columnas}
          ref={ref => this.consultaGenerica = ref}
          interfazGestion={RUTAS_VISTA.GESTION_LIQUIDACION_CUENTA_BALANCE.url}
          rutaConsulta={RUTAS_API.COMPENSACION_CUENTA_BALANCE.CONSULTAR}
        />
        <VentanaModal
          mostrar={this.state.modalContratos}
          titulo='Contratos'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaContratos
            esModal
            seleccionarEntidad={this.onSeleccionarContrato}
            inhabilitarTercero={true}
            estadosContrato={['A', 'F']}
            inhabilitarEstado={true}
            tipoNegocio={'V'}
          />
        </VentanaModal>
      </Fragment>
    );
  };
}

ConsultarCompensacion.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array,
  mostrarAlerta: PropTypes.func,
};

ConsultarCompensacion.defaultProps = {
  esModal: false
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultarCompensacion);

export { VistaRedux as RConsultarCompensacion };
