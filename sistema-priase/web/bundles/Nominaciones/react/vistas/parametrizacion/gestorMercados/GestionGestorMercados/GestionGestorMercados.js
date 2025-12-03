import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import { formatearArray } from '../../../../global/util_nominaciones';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { RConsultaReportes } from '../ConsultaReportes';
import './GestionGestorMercados.scss';

const listaSiNo = [
  { texto: 'Si', valor: 'S' },
  { texto: 'No', valor: 'N' }
];

class GestionGestorMercados extends Component {

  state = {
    // Datos de la entidad
    listaSeleccionados: [],
    listaContratos: [],
    listaOpciones: [],
    contrato: '',
    campo: '',
    campoSeleccionado: '',
    indicadorContrato: '',
    nombreReporte: '',
    fechaInicio: '',
    fechaFin: '',
    tipoUso: '',
    agente: '',
    //Estado de la aplicación
    mostrarModalConsulta: false,

  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }

    const peticiones = [
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_GESTOR_MERCADOS.CONSULTAR_CAMPOS),
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_GESTOR_MERCADOS.CONSULTAR_CONTRATOS),
    ];
    axios.all(peticiones)

      .then(axios.spread((campos, contratros) => {
        const datosAplicacion = {
          listaOpciones: [],
          listaOpcionesCompletas: [],
          listaContratos: [],
        };
        if (campos.data.codigo > 0) {
          const camposContrato = JSON.parse(campos.data.datos.repcCampos);
          const listaCampos = camposContrato
          datosAplicacion.listaOpciones = formatearArray(listaCampos);
        }
        if (contratros.data.codigo > 0) {
          datosAplicacion.listaContratos = formatearArray(contratros.data.datos);
        }
        this.setState({ ...datosAplicacion });
      }));

  };

  /**
   * Método encargado de consultar los campos del contrato cuando se limpia el formulario
   * @param {Object} datosDiferenciaCampos Campos del reporte seleccionado
   */
  consultarCampos = (datosDiferenciaCampos) => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_GESTOR_MERCADOS.CONSULTAR_CAMPOS)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          const listaCampos = JSON.parse(respuesta.data.datos.repcCampos);
          this.setState({ listaOpciones: listaCampos, contrato: '' });
          if (!datosDiferenciaCampos) {
            return false
          }
          this.diferenciaCampos(datosDiferenciaCampos);
        }
      });
  };

  /**
   * Método encargado de limpiar los campos del formulario
   */
  limpiarFormulario = () => {
    this.consultarCampos();
    this.setState({
      // Datos de la entidad
      contrato: '-1',
      campo: '',
      campoSeleccionado: '',
      indicadorContrato: '-1',
      nombreReporte: '',
      listaSeleccionados: [],
      fechaInicio: '',
      fechaFin: '',
      tipoUso: '',
      agente: '',
    });
  };

  /**
   * Método encargado de limpiar el formulario al momento de salir
   */
  componentWillUnmount() {
    this.limpiarFormulario();
  };

  /**
   * Método encargado de generar los botones del formulario
	 * @returns {Object}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Guardar', callback: this.guardarEntidad },
      { texto: 'Consultar', callback: this.consultarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario },
    ];
  };

  /**
   * Método encargado de validar las variables del formulario
	 * @returns {Object}
   */
  validarFormulario = () => {
    //Validaciones
    const { listaSeleccionados, nombreReporte } = this.state;
    if (nombreReporte.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar un nombre para el reporte' } };
    }

    if (!Util.validarArreglo(listaSeleccionados)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe agregar al menos un campo' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de validar los campos al momento de generar el archivo CSV
   * @returns {Object}
   */
  validarGenerarCSV = () => {
    const { listaSeleccionados, indicadorContrato, contrato } = this.state;
    //Validaciones
    if (contrato === '' || contrato === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un contrato' } };
    }
    if (!Util.validarArreglo(listaSeleccionados)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe agregar al menos un campo' } };
    }

    if (indicadorContrato === '' || indicadorContrato === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe especificar el indicador del contrato' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de generar el objeto para guardar el reporte
   * @returns {Object}
   */
  obtenerDatosGuardar = () => {
    const { listaSeleccionados, nombreReporte } = this.state;
    let objetoParaEnviar = {
      repNombre: nombreReporte,
      repCampos: {},
    };
    const campos = listaSeleccionados.map((dato) => {
      return {
        alias: dato.alias,
        secuencia: dato.secuencia,
        valor: dato.valor,
      }
    });
    const campoSeleccionado = { camposseleccionados: campos };
    objetoParaEnviar.repCampos = JSON.stringify(campoSeleccionado);
    return objetoParaEnviar;
  };

  /**
   * Método encargado de guardar los datos de la entidad
	 * @returns {bool}
   */
  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    const entidadGuardar = this.obtenerDatosGuardar();
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_GESTOR_MERCADOS.GUARDAR, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de abrir la ventana modal del boton de consulta
   */
  consultarEntidad = () => {
    this.setState({ mostrarModalConsulta: true });
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
	 * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    const { name, value } = evento.target;
    change[name] = value;
    this.controlarCambioContrato(name, value);
    this.setState(change);
  };

  /**
   * Método encargado de validar si se esta cambiando el valor de la varaible
   * @param {string} name Propiedad nombre
   * @param {string} value Valor seleccionado
   */
  controlarCambioContrato = (name, value) => {
    if (name == 'contrato') {
      this.consultarDatosContrato(value);
    }
  };

  /**
   * Método encargado de convertir la fecha ingresada a Date
   * @param {string} fechaContrato fecha seleccionada por el usuario
   * @returns {Date}
   */
  obtenerFecha = (fechaContrato) => {
    let fecha = new Date(fechaContrato);
    fecha = (fecha.getFullYear() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getDate());
    return fecha;
  };

  /**
   * Método encargado de consultar los datos del contrato seleccionado
   * @param {number} idContrato contrato seleccionado por el usuario
   * @returns {bool}
   */
  consultarDatosContrato = (idContrato) => {
    if (!Util.validarArreglo(this.state.listaContratos)) {
      return;
    }
    if (idContrato === '-1') {
      this.setState({
        fechaInicio: '',
        fechaFin: '',
        tipoUso: '',
        agente: '',
      });
      return
    }
    const contrato = this.state.listaContratos.find(p => idContrato == p.cntIderegistro);
    this.setState({
      fechaInicio: this.obtenerFecha(contrato.cntFechainicio),
      fechaFin: this.obtenerFecha(contrato.cntFechafin),
      tipoUso: contrato.uniIdetipouso.uniNombre1,
      agente: contrato.terIdeagente.terNomcompleto,
    });
  };

  /**
   * Método encargado de cerrar la ventana del boton de consulta
   */
  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false
    });
  };

  /**
   * Método encargado de generar un objeto con los campos seleccionados por el usuario
   * @param {Object} listaCampos Campos seleccionados por el usuario
   */
  obtenerCampos = (listaCampos) => {
    const objetoCampos = listaCampos.map(dato => {
      return {
        alias: dato.alias,
        secuencia: dato.secuencia,
        valor: dato.valor,
      }
    });

    return JSON.stringify(objetoCampos);
  };

  /**
   * Método encargado de obtener los datos del contrato seleccionado
   * @param {Array} listaCampos Campos seleccionados
   * @param {String} indicadorContrato Indicador del contrato
   * @param {number} idContrato Identificador del contrato seleccionado
   */
  obtenerDatos = (listaCampos, indicadorContrato, idContrato) => {
    const { listaContratos } = this.state;
    const contratoSeleccionado = listaContratos.find(p => idContrato == p.cntIderegistro);
    let objetoEnviar = {
      reporteSeleccionado: {
        repCampos: this.obtenerCampos(listaCampos),
      },
      contrato: {
        cntIderegistro: contratoSeleccionado.cntIderegistro,
        cntNumero: contratoSeleccionado.cntNumero,
      },
      indicadorVariable: indicadorContrato
    }
    return objetoEnviar;
  };

  /**
   * Método encargado de generar el archivo con los campos seleccionados
   * @returns {bool}
   */
  generarArchivo = () => {
    const { listaSeleccionados, indicadorContrato, contrato } = this.state;
    const validarFormularioCSV = this.validarGenerarCSV();
    if (!validarFormularioCSV.respuesta) {
      this.props.mostrarAlerta(validarFormularioCSV.mensaje.titulo, validarFormularioCSV.mensaje.mensaje);
      return false;
    }
    const entidadGenerar = this.obtenerDatos(listaSeleccionados, indicadorContrato, contrato);
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_GESTOR_MERCADOS.GENERAR_ARCHIVO, entidadGenerar)
      .then(respuesta => {
        if(respuesta.data.codigo < 0){
          return;
        }
        let a = document.createElement('a');
        a.href = 'data:' + { type: "text/csv;charset=utf-8;" } + ';base64,' + respuesta.data.datos;
        a.download = "Reporte.csv";
        a.target = '_blank';
        a.click();
      });
  };

  /**
   * Método encargado de obtener un arreglo con la diferencia de campos
   * @param {Object} listaCamposConsulta Campos del reporte seleccionado
   */
  diferenciaCampos = (listaCamposConsulta) => {
    const { listaOpciones } = this.state;
    for (let index = 0; index < listaCamposConsulta.camposseleccionados.length; index++) {
      const campoSeleccionado = listaCamposConsulta.camposseleccionados[index];
      for (let e = 0; e < listaOpciones.camposseleccionados.length; e++) {
        const opciones = listaOpciones.camposseleccionados[e];
        if (campoSeleccionado.valor == opciones.valor) {
          listaOpciones.camposseleccionados.splice(e, 1);
        }
      }
    }
    this.setState({ listaOpciones: listaOpciones });
  };

  /**
   * Método encargado de agregar todos los campos a la lista de seleccionados
   * @returns {bool}
   */
  agregarTodos = () => {
    let { listaSeleccionados, listaOpciones } = this.state;
    const length = listaOpciones.camposseleccionados.length;
    const camposseleccionados = [];
    if (!Util.validarArreglo(listaOpciones.camposseleccionados)) {
      return false
    }
    for (var i = 0; i < length; i++) {
      listaSeleccionados.push({
        alias: listaOpciones.camposseleccionados[i].alias,
        valor: listaOpciones.camposseleccionados[i].valor,
        secuencia: listaOpciones.camposseleccionados[i].secuencia,
      });
    }
    this.setState({ listaSeleccionados: listaSeleccionados, listaOpciones: { camposseleccionados } });
  };

  /**
   * Método encargado de agregar el campo seleccionado a la lista de seleccionados
   * @returns {bool}
   */
  agregarCampo = () => {
    let { listaSeleccionados, listaOpciones, campo } = this.state;
    const valorCampoSeleccionado = listaOpciones.camposseleccionados.find(p => campo == p.valor);
    const indexSeleccionado = listaSeleccionados.findIndex(p => campo == p.valor);
    const index = listaOpciones.camposseleccionados.findIndex(p => campo == p.valor);
    if (campo === '' || campo === '-1') {
      this.props.mostrarAlerta('Atención', 'Debe seleccionar un campo primero');
      return false
    }
    if (indexSeleccionado >= 0) {
      this.props.mostrarAlerta('Alerta', 'El campo seleccionado ya se encuentra en la lista');
      return false
    }
    listaSeleccionados.push({
      alias: valorCampoSeleccionado.alias,
      valor: campo,
      secuencia: valorCampoSeleccionado.secuencia
    });
    listaOpciones.camposseleccionados.splice(index, 1);
    this.setState({ listaSeleccionados: listaSeleccionados, listaOpciones: listaOpciones, campoSeleccionado: '', campo: '' });
  };

  /**
   * Método encargado de quitar de la el campo seleccionado
   * @returns {bool}
   */
  quitarCampo = () => {
    let { listaSeleccionados, listaOpciones, campoSeleccionado } = this.state;
    const valorCampoSeleccionado = listaSeleccionados.find(p => campoSeleccionado == p.valor);
    const indexSeleccionado = listaOpciones.camposseleccionados.findIndex(p => campoSeleccionado == p.valor);
    const index = listaSeleccionados.findIndex(p => campoSeleccionado == p.valor);
    if (!Util.validarArreglo(listaSeleccionados)) {
      this.props.mostrarAlerta('Atención', 'Primero debe agregar un campo');
      return false
    }
    if (campoSeleccionado === '' || campoSeleccionado === '-1') {
      this.props.mostrarAlerta('Atención', 'Debe seleccionar un campo primero');
      return false
    }
    if (indexSeleccionado >= 0) {
      this.props.mostrarAlerta('Alerta', 'El campo seleccionado ya se encuentra en la lista');
      return false
    }
    listaOpciones.camposseleccionados.push({
      alias: valorCampoSeleccionado.alias,
      valor: campoSeleccionado,
      secuencia: valorCampoSeleccionado.secuencia,
    });
    listaSeleccionados.splice(index, 1);
    this.setState({ listaSeleccionados: listaSeleccionados, listaOpciones: listaOpciones, campoSeleccionado: '', campo: '' });
  };

  /**
   * Método encargado de eliminar todos los campos a la lista de seleccionados
   * @returns {bool}
   */
  quitarTodos = () => {
    let { listaSeleccionados, listaOpciones } = this.state;
    if (!Util.validarArreglo(listaSeleccionados)) {
      return false
    }
    for (var i = 0; i < listaSeleccionados.length; i++) {
      listaOpciones.camposseleccionados.push({
        alias: listaSeleccionados[i].alias,
        valor: listaSeleccionados[i].valor,
        secuencia: listaSeleccionados[i].secuencia,
      });
    }
    this.setState({ listaSeleccionados: [], listaOpciones: listaOpciones });
  };

  /**
   * Método encargado de cargar los datos de la ventana modal de consulta
   * @param {Object} entidad Datos seleccionados de la consulta
   */
  cargarDatos = (entidad) => {
    const datosSeleccionados = JSON.parse(entidad.repCampos);
    this.consultarCampos(datosSeleccionados);
    this.setState({
      mostrarModalConsulta: false,
      listaSeleccionados: datosSeleccionados.camposseleccionados,
      nombreReporte: entidad.repNombre,
      configuracion: entidad.repcIdeconfiguracion.repcIderegistro,
      fechaInicio: '',
      fechaFin: '',
      tipoUso: '',
      agente: '',
      contrato: '-1',
    });
  };

  /**
   * Método encargado de mostrar los campos de los contratos
   * @returns {Object}
   */
  renderCamposContrato = () => {
    const { contrato, listaContratos } = this.state;
    return (
      <div className='conf-general row mt-5'>
        <Input
          label='Nombre Reporte:'
          value={this.state.nombreReporte}
          onChange={this.controlarCambio}
          name='nombreReporte'
        />
        <div className='form-group col-4'>
          <label htmlFor='contrato'>Contratos</label>
          <select className='form-control' name='contrato' id="contrato" onChange={this.controlarCambio}>
            <option value='-1'>Seleccione una opción</option>
            {listaContratos.map(dato => {
              return (
                <option {...(contrato == dato.cntIderegistro) ? 'selected' : ''} value={dato.cntIderegistro}>{`${dato.cntNumero}--${dato.terIdeagente.terNombre}`}</option>
              )
            })}
          </select>
        </div>
        <Input
          label='Agente:'
          value={this.state.agente}
          onChange={this.controlarCambio}
          extra={{ disabled: true, readOnly: true }}
          name='agente'
        />
        <Input
          label='Fecha inicio:'
          value={this.state.fechaInicio}
          onChange={this.controlarCambio}
          extra={{ disabled: true, readOnly: true }}
          name='fechaInicio'
        />
        <Input
          label='Fecha fin:'
          value={this.state.fechaFin}
          onChange={this.controlarCambio}
          extra={{ disabled: true, readOnly: true }}
          name='fechaFin'
        />
        <Input
          label='Tipo de uso:'
          value={this.state.tipoUso}
          onChange={this.controlarCambio}
          extra={{ disabled: true, readOnly: true }}
          name='tipoUso'
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
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />
        {this.renderCamposContrato()}
        <div className='conf-general row mt-5'>
          <Combo
            opciones={this.state.listaOpciones.camposseleccionados}
            propTexto='alias'
            propValor='valor'
            label='Campos del Contrato'
            onChange={this.controlarCambio}
            size={12}
            value={this.state.campo}
            name='campo'
          />

          <div className='col-2 mt-20 divBotones'>
            <button className='btn btn-primary botones' onClick={this.agregarTodos} title="Agregar Todos"><i className='fa fa-fw fa-angle-double-right'></i></button>
            <button className='btn btn-primary botones' onClick={this.agregarCampo} title="Agregar Campo"><i className='fa fa-fw fa-angle-right'></i></button>
            <button className='btn btn-primary botones' onClick={this.quitarTodos} title="Quitar todos"><i className='fa fa-fw fa-angle-double-left'></i></button>
            <button className='btn btn-primary botones' onClick={this.quitarCampo} title="Quitar Campo"><i className='fa fa-fw fa-angle-left'></i></button>
          </div>
          <Combo
            opciones={this.state.listaSeleccionados}
            propTexto='alias'
            propValor='valor'
            label='Campos Seleccionados'
            onChange={this.controlarCambio}
            size={12}
            value={this.state.campoSeleccionado}
            name='campoSeleccionado'
          />
        </div>

        <div className='conf-general row mt-5'>
          <Combo
            opciones={listaSiNo}
            propTexto='texto'
            propValor='valor'
            label='Indicador Variable Contrato:'
            name='indicadorContrato'
            value={this.state.indicadorContrato}
            onChange={this.controlarCambio}
          />
          <div className='form-group'>
            <button className='btn btn-primary m-t-24' onClick={this.generarArchivo}>Generar Archivo</button>
          </div>
        </div>
        <VentanaModal
          mostrar={this.state.mostrarModalConsulta}
          titulo={'Consultar Reportes'}
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaReportes esModal seleccionarEntidad={this.cargarDatos} />
        </VentanaModal>
      </Fragment>
    );
  };
}

GestionGestorMercados.propTypes = {
  history: PropTypes.object,
  mostrarAlerta: PropTypes.func
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    mostrarAlerta,
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionGestorMercados);

export { VistaRedux as RGestionGestorMercados };
