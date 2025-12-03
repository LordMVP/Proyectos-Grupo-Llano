import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { SelectorMultiple } from '../utils/SelectorMultiple';
import axios from 'axios';
import Modal from 'react-bootstrap4-modal';
import { CLASES_UNIDADES } from '../../global/constantes';
import { parsearJSONUniPropiedad, esObjetoVacio } from '../../global/util_nominaciones';
import { Input, Botonera, Combo, TextoNumerico, Fecha, Util } from 'appfuture-react';
import RUTAS_API from '../../global/rutas_api';
import RUTAS_VISTA from '../../global/rutas_vista';
import { TECLAS } from '../../global/constantes';
import ConsultaGenerica from '../../hoc/consultaGenerica/ConsultaGenerica';

const tiposAgente = [
  { valor: 'V', texto: 'Cliente' }, //Si cntTiponegocio es V es cliente
  { valor: 'C', texto: 'Proveedor' } //Si cntTiponegocio es C es proveedor
];

const opcionesTakeOrPay = [
  { valor: 'S', texto: 'Sí' },
  { valor: 'N', texto: 'No' }
];

const tiposGarantia = [
  { texto: 'No Aplica', valor: 'NA' },
  { texto: 'Garantía Bancaria', valor: 'GB' },
  { texto: 'Garantía Prepago', valor: 'PR' },
  { texto: 'Poliza Contratos', valor: 'PO' },
];

class ConsultaContratos extends Component {


  state = {
    criterio: '',
    tiposDeUso: [],
    tiposMercado: [],
    tiposContrato: [],
    estadosContrato: [],
    tiposModalidadContrato: [],
    interfazGestion: RUTAS_VISTA.GESTION_CONTRATOS.url,
    seleccion: false,
    mostrarEstados: false,
    estadoContrato: '',
    seleccionMultiple: false,
    tiposContratoProps: (this.props.tiposContrato) ? this.props.tiposContrato : '',
    tipoAgente: (this.props.tipoNegocio) ? this.props.tipoNegocio : '',
    estadosContratoProps: this.props.estadosContrato,
    mostrarTablaSeleccionados: (this.props.mostrarTablaSeleccionados) ? this.props.mostrarTablaSeleccionados : false,
    estadoContratoDisabled: (this.props.estadoContratoDisabled) ? this.props.estadoContratoDisabled : false,
    tiposContratoDisabled: (this.props.tiposContratoDisabled) ? this.props.tiposContratoDisabled : false,
    inhabilitarTercero: (this.props.inhabilitarTercero) ? this.props.inhabilitarTercero : false,
    inhabilitarAgente: (this.props.inhabilitarAgente) ? this.props.inhabilitarAgente : false,
    tipoGarantia: (this.props.tipoGarantia) ? this.props.tipoGarantia : '',
    periodoSeleccionado: (this.props.periodoSeleccionado) ? this.props.periodoSeleccionado : null,
    nombreAgente: (this.props.nombreAgente) ? this.props.nombreAgente : ''
  };

  consultaGenerica = null;

  columnas = [
    {
      Header: 'Consulta contratos',
      columns: [
        {
          Header: 'Tipo Agente/Tercero',
          accessor: 'cntTiponegocio',
          Cell: (props) => this.obtenerTipoNegocio(props, this)
        },
        {
          Header: 'Agente/Tercero',
          accessor: 'terIdeagente.terNomcompleto'
        },
        {
          Header: 'No. Contrato',
          accessor: 'cntNumero'
        },
        {
          Header: 'Tipo contrato',
          accessor: 'listaTipos',
          Cell: (props) => this.obtenerTiposContrato(props, this)
        },
        {
          Header: 'Fecha inicio',
          accessor: 'cntFechainicio',
        },
        {
          Header: 'Fecha Fin',
          accessor: 'cntFechafin',
        },
        {
          Header: 'Estado',
          accessor: 'uniIdeestado.uniNombre1'
        }
      ]
    }
  ];

  /**
   * Obtiene los tipos de contrato de las propiedades que recibe de la tabla.
   * @return {string}
   */
  obtenerTiposContrato = (props) => {
    const { original, column } = props;
    const listaTipos = original[column.id];
    if (!Array.isArray(listaTipos) || listaTipos.length == 0) {
      return 'Indefinido';
    }
    return listaTipos.map(tipo => {
      return tipo.uniIdetipocontrato.uniNombre1;
    }).join(',');
  };

  /**
   * Obtiene el tipo de agente/tercero en base al tipo de negocio.
   * @return {string}
   */
  obtenerTipoNegocio = (props) => {
    const { original } = props;
    const cntTiponegocio = original.cntTiponegocio;
    return (cntTiponegocio === 'V') ? 'Cliente' : 'Proveedor';
  };

  /**
   * Método encargado de ejecutar acciones al momento de cargar el componente
   */
  componentDidMount() {
    this.cargarDatosAplicacion();
    if (!this.props.history) {
      return;
    }
    const { state } = this.props.location;
    if (state && state.interfazGestion) {
      this.cargarDatos(state);
    }
  }

  /**
   * Método encargado de cargar los datos de un componente externo
   * @param {Object} entidad Datos componente externo
   */
  cargarDatos = (state) => {
    this.setState({
      interfazGestion: state.interfazGestion,
      seleccion: true,
      estadoContrato: state.estadoContrato,
      tipoGarantia: state.tipoGarantia,
      tipoGarantiaDisabled: (state.tipoGarantia) ? true : false,
      estadoContratoDisabled: (state.estadoContrato || state.estadoContratoDisabled) ? true : false,
      tipoContrato: (state.tipoContrato) ? state.tipoContrato : -1,
      seleccionMultiple: (state.seleccionMultiple),
      estadosContratoProps: state.estadosContrato,
      mostrarTablaSeleccionados: state.mostrarTablaSeleccionados,
      tiposContratoProps: state.tiposContrato,
      autoconsultar: state.autoconsultar,
      ocultarFiltros: state.ocultarFiltros,
      takeOrPay: state.takeOrPay,
      takeOrPayDisabled: state.takeOrPayDisabled,
      tiposContratoDisabled: state.tiposContratoDisabled,
      inhabilitarEstado: state.inhabilitarEstado,
      tipoAgente: state.tipoAgente,
      inhabilitarTercero: state.inhabilitarTercero,
      tipoPrecio: state.tipoPrecio,
    });
  };

  /**
   * Cargará la información principal del módulo, en este caso consultará las listas necesariaas y demás información que necesite del servidor para empezar.
   * @returns {Boolean}
   */
  cargarDatosAplicacion = () => {
    //Si las listas necesarias vienen en los props, se toman y se retorna.
    if (this.validarPropsPrograma()) {
      this.setState({
        tiposDeUso: this.props.tiposUso,
        tiposMercado: this.props.tiposMercado,
        tiposContrato: this.props.tiposContrato,
        tiposModalidadContrato: this.props.tiposModalidadContrato
      });
      return;
    }

    const params = { criterio: '' };
    const peticiones = [
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { ...params, idClase: CLASES_UNIDADES.TIPO_USO_CONTRATO }),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { ...params, idClase: CLASES_UNIDADES.TIPO_MERCADO }),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { ...params, idClase: CLASES_UNIDADES.TIPO_CONTRATO }),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { ...params, idClase: CLASES_UNIDADES.TIPOS_MODALIDAD_CONTRATO }),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { ...params, idClase: CLASES_UNIDADES.ESTADOS_CONTRATO }),
    ];
    axios.all(peticiones)
      .then(
        axios.spread((tiposUso, tiposMercado, tiposContrato, tiposModalidadContrato, estadosContrato) => {
          this.setState({
            tiposDeUso: parsearJSONUniPropiedad(tiposUso.data.datos),
            tiposMercado: parsearJSONUniPropiedad(tiposMercado.data.datos),
            tiposContrato: this.autoseleccionarTiposContrato(tiposContrato.data.datos),
            tiposModalidadContrato: parsearJSONUniPropiedad(tiposModalidadContrato.data.datos),
            estadosContrato: this.autoseleccionarEstado(parsearJSONUniPropiedad(estadosContrato.data.datos)),
          }, this.autoConsultar);
        }), (err) => {
          console.log(err);
        }
      );
  };

  /**
   * Si se ha configurado la autoconsulta este método invocará la consulta de los contratos tras haber consultado los datos necesarios para mostrar la interfaz.
   */
  autoConsultar = () => {
    if (this.props.autoconsultar || this.state.autoconsultar) {
      this.onBuscar();
    }
  };

  /**
   * Método encargado de seleccionar los tipos de un contrato ya parametrizado
   * @param {Array} listaTiposContrato Lista de tipos del contrato seleccionado
   * @returns {Array}
   */
  autoseleccionarTiposContrato = (listaTiposContrato) => {
    listaTiposContrato = parsearJSONUniPropiedad(listaTiposContrato);
    let tiposContratoSeleccionados = Util.validarArreglo(this.props.tiposContrato) ? this.props.tiposContrato : [];
    if (!Util.validarArreglo(tiposContratoSeleccionados)) {
      tiposContratoSeleccionados = (Util.validarArreglo(this.state.tiposContratoProps)) ? this.state.tiposContratoProps : [];
    }
    return listaTiposContrato.map(tipoContrato => {
      tiposContratoSeleccionados.forEach(codigoTipoContrato => {
        if (tipoContrato.uniPropiedad.tipocontrato === codigoTipoContrato) {
          tipoContrato.seleccionado = true;
        }
      });
      return tipoContrato;
    });
  };

  /**
   * Busca los estados en la lista y autoselecciona el estado recibido...
   * @param {Array} listaEstados Lista de estados del contrato seleccionado
   * @return {array}
   */
  autoseleccionarEstado = (listaEstados) => {
    const estados = this.props.estadoContrato ? [this.props.estadoContrato] : (Util.validarArreglo(this.state.estadosContratoProps) ? this.state.estadosContratoProps : []);
    return listaEstados.map(estado => {
      estados.forEach(idEstado => {
        if (estado.uniIderegistro == idEstado || estado.uniPropiedad.codigo == idEstado || estado.uniPropiedad.estado == idEstado) {
          estado.seleccionado = true;
        }
      });
      return estado;
    });
  };

  /**
   * Método encargado de mostrar los botones del componente Botonera
   * @returns {Array}
   */
  obtenerFunciones = () => {
    let funciones = [{ texto: 'Consultar', callback: this.onBuscar }];
    if ((this.state.seleccionMultiple) ? this.state.seleccionMultiple : this.props.seleccionMultiple) {
      funciones.push({ texto: 'Seleccionar Datos', callback: this.onSeleccionarEntidades });
    }

    if (this.state.interfazGestion != RUTAS_VISTA.GESTION_CONTRATOS.url) {
      funciones.push({ texto: 'Cancelar', callback: this.cancelar });
    }
    funciones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    return funciones;
  };

  /**
   * Valida si las listas requeridas y demás información necesaria viene en los props.
   * @returns {Boolean}
   */
  validarPropsPrograma = () => {
    const { tiposDeUso, tiposMercado, tiposContrato, tiposModalidadContrato } = this.props;
    return (
      Util.validarArreglo(tiposDeUso) &&
      Util.validarArreglo(tiposMercado) &&
      Util.validarArreglo(tiposContrato) &&
      Util.validarArreglo(tiposModalidadContrato) &&
      true
    );
  };

  /**
   * Controla el cambio de los componentes y lo setea en el state.
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  /**
   * Obtiene un arreglo de ids de los estados seleccionados.
   * @return {Array}
   */
  obtenerEstadosSeleccionados = () => {
    return this.state.estadosContrato.filter(estado => estado.seleccionado).map(estado => {
      return estado.uniIderegistro;
    });
  };

  /**
   * Obtiene un arreglo de ids de los tipos de contrato seleccionados.
   * @return {Array}
   */
  obtenerListaTiposContrato = () => {
    return this.state.tiposContrato.filter(tipocontrato => tipocontrato.seleccionado).map(tipocontrato => {
      return tipocontrato.uniIderegistro;
    });
  };

  /**
   * Método encargado de realizar la busqueda con los filtros seleccionados
   */
  onBuscar = () => {
    const { identificacion, tipoAgente, nombreAgente, tipoContrato, tipoGarantia, tipoMercado, numeroContrato, tipoUso, modalidad, fechaInicio, fechaFin, takeOrPay } = this.state;
    let estadosSeleccionados = this.obtenerEstadosSeleccionados();
    this.consultaGenerica.getWrappedInstance()._buscar(
      {
        criterio: (this.state.criterio) == '' ? null : this.state.criterio,
        nombreCompleto: nombreAgente,
        listaTiposContratos: this.obtenerListaTiposContrato(),
        documento: identificacion,
        tipoTercero: (tipoAgente == '-1' || tipoAgente == '') ? null : tipoAgente,
        numeroContrato: numeroContrato,
        idTipoMercado: tipoMercado,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        idModalidadContrato: modalidad,
        idTipoUsoContrato: tipoUso,
        takeOrPay: takeOrPay,
        tipoGarantia: (tipoGarantia) == '' ? null : tipoGarantia,
        estadosContrato: (estadosSeleccionados.join(',') == '') ? null : estadosSeleccionados.join(','),
        periodoFinaliza: this.state.periodoSeleccionado
      }
    );
  };

  /**
   * Método encargado de realizar la lista de contratos seleccionados
   * @returns {Boolean}
   */
  onSeleccionarEntidades = () => {
    const lista = this.consultaGenerica.getWrappedInstance()._obtenerEntidades();
    if (this.props.esModal) {
      this.props.seleccionarEntidades(lista);
      return;
    }
    this.props.history.push({
      pathname: this.state.interfazGestion,
      state: {
        listaContratos: lista,
        tipo: (this.state.interfazGestion == RUTAS_VISTA.GESTION_ACTUALIZAR_PRECIO.url) ? this.state.tipoPrecio : null
      }
    });
    //this.props.seleccionarEntidades();
  };

  /**
   * Método encargado de limpiar los datos del formulario
   */
  limpiarFormulario = () => {
    this.setState({
      criterio: '',
      tipoAgente: '',
      indentificacion: '',
      nombreAgente: '',
      tipoMercado: '',
      numeroContrato: '',
      tipoUso: '',
      modalidad: '',
      fechaInicio: '',
      fechaFin: '',
      takeOrPay: '',
      tipoGarantia: '',
      tiposContrato: this.eliminarSeleccionContratos(),
      estadosContrato: this.eliminarSeleccionEstados()
    });
    this.consultaGenerica.getWrappedInstance()._limpiarFormulario();
  };

  /**
   * Método encargado de redireccionar a la interfaz origen
   */
  cancelar = () => {
    this.consultaGenerica.getWrappedInstance()._cancelar();
  };

  /**
   * Renderiza el modal pera seleccionar las estados...
   * @returns {JSX}
   */
  renderModalestados = () => {
    return (
      <Modal visible={this.state.mostrarEstados}>
        <div className="modal-header">
          <h4 className="modal-title"><b>Seleccionar estados</b></h4>
        </div>
        <div className="modal-body">
          <div>
            <p>Seleccione los estados</p>
            {
              this.state.estadosContrato.map(r => {
                return (
                  <div key={`estados_${r.uniIderegistro}`}>
                    <label>
                      <input type="checkbox" value={r.uniIderegistro} checked={r.seleccionado || false} onChange={this.seleccionarEstado} />
                      <span> {r.uniNombre1}</span>
                    </label>
                  </div>
                );
              })
            }
          </div>
        </div>
        <div className="modal-footer">
          <button className='btn btn-primary' onClick={() => { this.setState({ mostrarEstados: false }) }}>Aceptar</button>
        </div>
      </Modal>
    );
  };

  /**
   * Recibe el evento change de los selectores de las estados y setea un atributo llamado seleccionado = true, en el medidor específico.
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  seleccionarEstado = (event) => {
    const estados = [...this.state.estadosContrato];
    const idEstado = parseInt(event.target.value);
    const index = estados.findIndex(r => r.uniIderegistro === idEstado);
    estados[index].seleccionado = event.target.checked;
    this.setState({ estadosContrato: [...estados] });
  };

  /**
   * Eliminará los estados seleccionados de la lista.
   * @returns {Array}
   */
  eliminarSeleccionEstados = () => {
    return this.state.estadosContrato.map(estado => {
      estado.seleccionado = false;
      return estado;
    });
  };

  /**
   * Eliminará los estados seleccionados de la lista.
   * @returns {Array}
   */
  eliminarSeleccionContratos = () => {
    return this.state.tiposContrato.map(tipoContrato => {
      tipoContrato.seleccionado = false;
      return tipoContrato;
    });
  };

  /**
   * Renderiza el componente selector de estados.
   * @returns {JSX}
   */
  renderSelectorEstados = () => {
    const textoEstados = '';
    const estadosSeleccionados = this.state.estadosContrato.reduce((total, tipo) => { return total + (tipo.seleccionado ? 1 : 0) }, 0);
    const placeholder = `(${estadosSeleccionados}) seleccionados`;
    return (
      <div className='col-3 form-group'>
        <label>Estados:</label>
        <div className="input-group mb-3">
          <input value={textoEstados} disabled={true} type="text" className="form-control" placeholder={placeholder} />
          <div className="input-group-prepend">
            <button
              className="btn-primary btn-buscador input-group-btn"
              title='Seleccionar Estados'
              disabled={this.state.estadoContratoDisabled || this.state.inhabilitarEstado}
              onClick={() => this.setState({ mostrarEstados: true })}><i className='fa fa-fw fa-check-square-o'></i></button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Marca como seleccionado un item de la lista de tipos contrato.
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  seleccionarContrato = (evento) => {
    const tiposContrato = this.state.tiposContrato;
    const value = evento.target.value;
    const index = tiposContrato.findIndex(c => c.uniIderegistro == value);
    tiposContrato[index].seleccionado = evento.target.checked;
    this.setState({ tiposContrato: tiposContrato });
  };

  /**
   * Renderiza los componentes de los filtros del componente.
   * @return {Component}
   */
  renderFiltros = () => {
    return (
      <div className='row mt-5'>
        <Combo
          opciones={tiposAgente}
          propTexto='texto'
          propValor='valor'
          label='Tipo de Agente o tercero:'
          name='tipoAgente'
          value={this.state.tipoAgente}
          onChange={this.controlarCambio}
          extra={{ disabled: this.state.inhabilitarTercero }}
        />
        <Input
          label='Identificación:'
          value={this.state.indentificacion}
          onChange={this.controlarCambio}
          name='indentificacion'
        />
        <Combo
          opciones={tiposGarantia}
          propTexto='texto'
          propValor='valor'
          label='Seleccione el tipo garantia:'
          name='tipoGarantia'
          value={this.state.tipoGarantia}
          onChange={this.controlarCambio}
          extra={{ disabled: this.state.tipoGarantiaDisabled }}
        />
        <Input
          label='Nombre del Agente o Tercero:'
          value={this.state.nombreAgente}
          onChange={this.controlarCambio}
          extra={{ disabled: this.state.inhabilitarAgente, readOnly: this.state.inhabilitarAgente }}
          name='nombreAgente'
        />
        <Combo
          opciones={this.state.tiposMercado}
          propTexto='uniNombre1'
          propValor='uniIderegistro'
          label='Tipo Mercado:'
          name='tipoMercado'
          value={this.state.tipoMercado}
          onChange={this.controlarCambio}
        />
        <Input
          label='No. Contrato:'
          value={this.state.numeroContrato}
          onChange={this.controlarCambio}
          name='numeroContrato'
        />
        <Combo
          opciones={this.state.tiposDeUso}
          propTexto='uniNombre1'
          propValor='uniIderegistro'
          label='Tipos Uso:'
          name='tipoUso'
          value={this.state.tipoUso}
          onChange={this.controlarCambio}
        />
        <SelectorMultiple
          lista={this.state.tiposContrato}
          propValor='uniIderegistro'
          propTexto='uniNombre1'
          titulo='Tipos Contrato'
          seleccionarItem={this.seleccionarContrato}
          cols={4}
          extra={{ disabled: this.state.tiposContratoDisabled }}
        />
        <Combo
          opciones={this.state.tiposModalidadContrato}
          propTexto='uniNombre1'
          propValor='uniIderegistro'
          label='Modalidad:'
          name='modalidad'
          value={this.state.modalidad}
          onChange={this.controlarCambio}
        />
        {this.renderSelectorEstados()}
        <Fecha
          label='Fecha inicio:'
          name='fechaInicio'
          fecha={this.state.fechaInicio}
          onChange={this.controlarCambio}
        />
        <Fecha
          label='Fecha Finalización:'
          name='fechaFin'
          fecha={this.state.fechaFin}
          onChange={this.controlarCambio}
        />
        <Combo
          opciones={opcionesTakeOrPay}
          propTexto='texto'
          propValor='valor'
          label='Take Or Pay:'
          name='takeOrPay'
          value={this.state.takeOrPay}
          onChange={this.controlarCambio}
          extra={{ disabled: this.state.takeOrPayDisabled }}
        />
        <Input
          label='Periodo:'
          value={this.state.periodoSeleccionado}
          name='periodoSeleccionado'
        />
      </div>
    );
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <div className='consulta-tramos'>
        <div className={`d-flex justify-content-center pt-3 ${(this.props.ocultarFiltros === true || this.state.ocultarFiltros === true) ? '' : 'mb-5'}`}>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>
        {
          this.props.ocultarFiltros != true && this.renderFiltros()
        }

        {this.renderModalestados()}
        <div className='row'>
          <div className='col-md-12'>
            <ConsultaGenerica
              {...this.props}
              idEntidad='cntIderegistro'
              columnas={this.columnas}
              ref={ref => this.consultaGenerica = ref}
              interfazGestion={this.state.interfazGestion}
              seleccion={this.state.seleccion}
              rutaConsulta={RUTAS_API.CONTRATOS.CONSULTAR_CONTRATOS}
              seleccionMultiple={(this.state.seleccionMultiple) ? (this.state.seleccionMultiple) : this.props.seleccionMultiple}
              mostrarTablaSeleccionados={this.state.mostrarTablaSeleccionados}
            />
          </div>
        </div>
      </div>
    );
  }
}

ConsultaContratos.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array,
  tipoContrato: PropTypes.number,
  estadosContrato: PropTypes.array,
  tipoNegocio: PropTypes.string,
  inhabilitarEstado: PropTypes.bool
};

ConsultaContratos.defaultProps = {
  esModal: false,
  seleccionMultiple: false,
  entidadesSeleccionadas: [],
  estadosContratoProps: [],
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaContratos);

export { VistaRedux as RConsultaContratos };
