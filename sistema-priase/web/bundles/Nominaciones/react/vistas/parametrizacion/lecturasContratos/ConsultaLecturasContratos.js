import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import RUTAS_API from '../../../global/rutas_api';
import axios from 'axios';
import { TECLAS } from '../../../global/constantes';
import { Fragment } from 'react';
import { mostrarAlerta, mostrarProgramaModal } from '../../../store/actions/AplicacionAcciones';
import { CLASES_UNIDADES } from '../../../global/constantes';
import { bindActionCreators } from 'redux';
import { VentanaModal, Botonera, Fecha, Combo, Util, Tabla } from 'appfuture-react';
import { RConsultaContratos } from '../../contratos/ConsultaContratos';
import { get as getProp } from 'object-path';
import { formatearArray } from '../../../global/util_nominaciones';
import { RConsultaAgentesTerceros } from '../agentesTerceros/ConsultaAgentesTerceros';
import { toast } from 'react-toastify';

class ConsultaLecturasContratos extends Component {

  state = {
    fechaInicial: '',
    fechaFinal: '',
    puntoConsumo: '',
    tercero: null,
    contratosSeleccionados: [],
    listadoEntidad: [],
    listaPuntosConsumo: [],
  };

  /**
   * @method
   * Método encargado de mostrar las columnas del componente tabla
   * @returns {Array}
   */
  obtenerColumnas = () => {
    return [
      {
        Header: 'Consulta Lecturas',
        columns: [
          {
            Header: 'Contrato',
            accessor: 'ptcIdepuntoconsumo.cntIdetercero.cntNumero'
          },
          {
            Header: 'Punto de Consumo',
            accessor: 'ptcIdepuntoconsumo.ptcoNombre'
          },
          {
            Header: 'Fecha',
            accessor: 'lcdFechalectura',
          },
          {
            Header: 'Lectura ',
            accessor: 'lcdLectura',
          },
          {
            Header: 'Unidad de Medida ',
            accessor: 'uniIdemedida.uniNombre1',
          }
        ]
      }
    ];
  };

  /**
   * @method
   * Método encargado de generar los botones del formulario
   * @returns {Object}
   */
  obtenerFunciones = () => {
    let funciones = [{ texto: 'Consultar', callback: this.onBuscar }];
    funciones.push({ texto: 'Generar Documento', callback: this.generarDocumento });
    funciones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    return funciones;
  };

  /**
   * Método encargado de generar el excel con los datos seleccionados
   * @returns {bool}
   */
  generarDocumento = () => {
    const { fechaInicial, fechaFinal, contratosSeleccionados, puntoConsumo } = this.state;
    const validarFechas = this.validarFechas();
    if (!validarFechas.respuesta) {
      this.props.mostrarAlerta(validarFechas.mensaje.titulo, validarFechas.mensaje.mensaje);
      return false;
    }
    const parametros = {
      idsContrato: contratosSeleccionados.map(c => c.cntIderegistro),
      fechaInicio: fechaInicial,
      fechaFin: fechaFinal,
      idPuntoConsumo: puntoConsumo == '' ? null : puntoConsumo,
    };

    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LECTURAS_CONTRATOS.GENERAR_LECTURA_CONTRATO, parametros)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          let a = document.createElement('a');
          a.href = 'data:' + { type: "Content-Type: application/vnd.ms-excel" } + ';base64,' + respuesta.data.datos;
          a.download = "Reporte.xls";
          a.target = '_blank';
          a.click();
        }
      });
  };

  /**
   * Método encargado de validar las fechas para las peticiones
   * @returns {Object}
   */
  validarFechas = () => {
    const { fechaInicial, contratosSeleccionados, fechaFinal, tercero } = this.state;
    if (tercero === null) {
      return { respuesta: false, mensaje: { titulo: 'Datos Incompletos', mensaje: 'Debe seleccionar el tercero' } }
    };

    if (fechaInicial.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos Incompletos', mensaje: 'Debe seleccionar la fecha inicial' } }
    }

    if (fechaFinal.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos Incompletos', mensaje: 'Debe seleccionar la fecha final' } }
    };

    return { respuesta: true }
  };

  /**
   * @method
   * Metodo encargado de realizar la consulta
   * @returns {bool}
   */
  onBuscar = () => {
    const { fechaInicial, fechaFinal, contratosSeleccionados, puntoConsumo } = this.state;
    const validarFechas = this.validarFechas();
    if (!validarFechas.respuesta) {
      this.props.mostrarAlerta(validarFechas.mensaje.titulo, validarFechas.mensaje.mensaje);
      return false;
    }
    const parametros = {
      idsContrato: (contratosSeleccionados.length === 0) ? null :contratosSeleccionados.map(c => c.cntIderegistro),
      fechaInicio: fechaInicial,
      fechaFin: fechaFinal,
      idPuntoConsumo: (puntoConsumo == '' || puntoConsumo == '-1') ? null : puntoConsumo,
    };

    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LECTURAS_CONTRATOS.CONSULTAR_LECTURA_CONTRATO, parametros)
      .then(respuesta => {
        this.setState({ listadoEntidad: respuesta.data.datos });
      });
  };

  /**
   * @method
   * Método encargado de limpiar el formulario
   */
  limpiarFormulario = () => {
    this.setState({
      fechaInicial: '',
      fechaFinal: '',
      puntoConsumo: '',
      tercero: null,
      contratosSeleccionados: [],
      listaPuntosConsumo: [],
      listadoEntidad: [],
    });
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
   * @method
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
   * @method
   * Metodo encargado de realizar la consulta cuando se preciona la tecla enter
   * @returns {bool}
   */
  onKeyPress = (evento) => {
    if (evento.charCode === TECLAS.ENTER) {
      this.onBuscar()
    }
  };

  /**
   * @method
   * Método encargado de consultar los puntos de consumo por contrato
   */
  consultarPuntosConsumo = (identificadores) => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PUNTOS_CONSUMO.CONSULTAR_PUNTOS_CONTRATOS, identificadores)
      .then(respuesta => {
        this.setState({ listaPuntosConsumo: [...formatearArray(respuesta.data.datos)] });
      });
  };

  /**
   * @method
   * Método encargado de cargar los datos de la entidad en la variable contrato
   * @param {Object} entidad Entidad seleccioanda
   */
  onSeleccionarContrato = (entidades) => {
    this.consultarPuntosConsumo(entidades.map(c => c.cntIderegistro));
    this.setState({
      modalContratos: false,
      contratosSeleccionados: entidades
    });
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
   * Método encargado de actualizar el objeto redux con el tercero seleccionado
   * @param {Object} agente Tercero seleccionado
   */
  seleccionarAgente = (agente) => {
    this.setState({
      tercero: { ...agente },
      contratosSeleccionados: [] ,
      listaPuntosConsumo: []
    });
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
   * Método encargado de abrir el modal de consultar contratos
   * @returns {Boolean}
   */
  abrirConsultaContratos = () => {
    if (this.state.tercero === null) {
      toast.error('Debe seleccionar un tercero');
      return;
    }
    this.setState({ modalContratos: true });
  };

  /**
   * @method
   * Método encargado de limpiar el contrato
   */
  limpiarContrato = () => {
    this.setState({ contrato: null });
  }


  /**
   * @method
   * Método encargado de mostrar el componente selector de contratos
   * @returns {Object}
   */
  renderSelectorContrato = () => {
    const propsInput = {
      placeholder: 'Buscar Contratos',
      className: 'form-control',
      name: 'contrato',
      title: (Util.validarArreglo(this.state.contratosSeleccionados)) ? this.state.contratosSeleccionados.length + ' contratos seleccionados' : '',
      value: (Util.validarArreglo(this.state.contratosSeleccionados)) ? this.state.contratosSeleccionados.length + ' contratos seleccionados' : '',
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
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />
        <div className='row mt-5'>
          {this.renderBuscadorTercero()}
          {this.renderSelectorContrato()}
          <Fecha
            label='Fecha Inicial:'
            name='fechaInicial'
            fecha={this.state.fechaInicial}
            onChange={this.controlarCambio}
          />
          <Fecha
            label='Fecha Final:'
            name='fechaFinal'
            fecha={this.state.fechaFinal}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={this.state.listaPuntosConsumo}
            propTexto='ptcoNombre'
            propValor='ptcIderegistro'
            label='Puntos de Consumo:'
            name='puntoConsumo'
            value={this.state.puntoConsumo}
            onChange={this.controlarCambio}
          />
          <div className='mt-5 col-12'>
            {this.renderTabla()}
          </div>
        </div>
        <VentanaModal
          mostrar={this.state.modalContratos}
          titulo='Seleccionar Contrato'
          cerrarModal={() => this.setState({ modalContratos: false })}>
          <RConsultaContratos
            esModal
            seleccionMultiple
            seleccionarEntidades={this.onSeleccionarContrato}
            tipoNegocio={'V'}
            inhabilitarTercero={true}
            inhabilitarAgente={true}
            nombreAgente={getProp(this.state.tercero, 'terNomcompleto', '')}
          />
        </VentanaModal>
      </Fragment>
    );
  };
}

ConsultaLecturasContratos.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array,
  mostrarAlerta: PropTypes.func,
  mostrarProgramaModal: PropTypes.func,
};

ConsultaLecturasContratos.defaultProps = {
  esModal: false
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    mostrarAlerta,
    mostrarProgramaModal
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaLecturasContratos);

export { VistaRedux as RConsultaLecturasContratos };
