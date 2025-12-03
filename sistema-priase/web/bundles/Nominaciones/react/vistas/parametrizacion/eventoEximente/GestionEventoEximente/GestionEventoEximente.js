import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes, { element } from 'prop-types';
import { Botonera, Combo, VentanaModal, Util, Fecha, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import { RConsultaTercerosEximente } from '../ConsultaTercerosEximente';
import { RConsultaEventosEximentes } from '../ConsultaEventosEximentes';
import RUTAS_API from '../../../../global/rutas_api';
import { CLASES_UNIDADES } from '../../../../global/constantes';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import './GestionEventoEximente.scss';
import { TIPOS_UNIDADES_MEDIDA, obtenerDatosRespuesta } from '../../../../global/util_nominaciones';
import { toast } from 'react-toastify'
import { get as getProp } from 'object-path';

class GestionEventoEximente extends Component {

  state = {
    // Datos de la entidad
    tipoContrato: '',
    contrato: null,
    idEvento: '',
    fechaIniEvento: '',
    fechaFinEvento: '',
    nombreAdjunto: '',
    tipoContrato: '',
    valorAgregar: '',
    puntoConsumo: '',
    listaMedidores: [],
    listaPuntosSalida: [],
    listaPuntosConsumo: [],
    listaAgregados: [],
    listaPuntosAgregados: [],
    listaAdjuntos: [],
    listaTipoContrato: [],
    // Estado de la aplicacion
    estadoModalContrato: false,
    estadoModal: false,
  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
    const params = { criterio: '' };
    const peticiones = [
      axios.post(RUTAS_API.PARAMETRIZACION.UNIDADES_MEDIDA.CONSULTAR_POR_ESTRUCTURA, { ...params, categoria: TIPOS_UNIDADES_MEDIDA.CANTIDAD }),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD_PROGRAMA, { ...params, idClase: CLASES_UNIDADES.TIPO_CONTRATO }),
    ];

    axios.all(peticiones)
      .then(axios.spread((unidadMedida, tipoContrato) => {
        let datosAplicacion = {
          listaUnidades: [],
          listaTipoContrato: [],
        }
        datosAplicacion.listaUnidades = obtenerDatosRespuesta(unidadMedida);
        datosAplicacion.listaTipoContrato = obtenerDatosRespuesta(tipoContrato);
        this.setState({ ...datosAplicacion });
      }));
  };

  /**
   * Método encargado de limpiar los campos del formulario
   */
  limpiarFormulario = () => {
    this.setState({
      // Datos de la entidad
      listaAdjuntos: [],
      listaMedidores: [],
      listaPuntosSalida: [],
      listaAgregados: [],
      listaPuntosConsumo: [],
      listaPuntosAgregados: [],
      fechaIniEvento: '',
      fechaFinEvento: '',
      valorAgregar: '',
      puntoConsumo: '',
      tipoContrato: '-1',
      idEvento: '',
      contrato: null,
      // Estado de la aplicacion
      estadoModalContrato: false,
      estadoModal: false,
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
    let botones = [];
    if (this.state.idEvento == '') {
      botones.push({ texto: 'Guardar', callback: this.guardarEntidad })
    }
    if (this.state.idEvento != '') {
      botones.push({ texto: 'Inactivar', callback: this.inactivarEvento })
    }
    botones.push({ texto: 'Consultar', callback: this.consultarEntidad });
    botones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    return botones;
  };

  /**
   * Método encargado de mostrar el modal de consulta de eventos eximentes
   */
  consultarEntidad = () => {
    this.setState({ estadoModal: true });
  };

  /**
   * Método encargado de validar los valores de la tabla agentes
   * @return {bool}
   */
  validarDetalles = () => {
    for (let i = 0; i < this.state.listaAgregados.length; i++) {
      const elemento = this.state.listaAgregados[i];
      if (!elemento.cantidadHabilitada || elemento.cantidadHabilitada === '') {
        let complemento = (elemento.mesuIderegistro) ? 'medidores' : 'puntos de salida';
        this.props.mostrarAlerta('Datos Incompletos', 'Debe ingresar una cantidad habilidata para todos los ' + complemento);
        return false;
      }
    };
    for (let index = 0; index < this.state.listaPuntosAgregados.length; index++) {
      const punto = this.state.listaPuntosAgregados[index];
      if (!punto.cantidadHabilitada || punto.cantidadHabilitada === '') {
        this.props.mostrarAlerta('Datos Incompletos', 'Debe ingresar una cantidad habilidata para todos los puntos de consumo');
        return false;
      }
    }
    return true
  };

  /**
   * Método encargado de validar las variables del formulario
	 * @returns {Object}
   */
  validarFormulario = () => {
    //Variables
    const { fechaIniEvento,
      fechaFinEvento,
      contrato,
      listaAdjuntos,
      tipoContrato, listaAgregados, listaPuntosAgregados } = this.state;
    const fechaIni = new Date(fechaIniEvento);
    const fechaFin = new Date(fechaFinEvento);
    //Validaciones
    if (tipoContrato === '' || tipoContrato === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un tipo de contrato' } };
    }

    if (fechaIniEvento.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar la fecha inicial' } };
    }

    if (fechaFinEvento.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar la fecha final' } };
    }

    if (fechaIniEvento.localeCompare(fechaFinEvento) != 0) {
      return { respuesta: false, mensaje: { titulo: 'Atención', mensaje: 'La fecha fin debe ser igual a la fecha inicio' } };
    }

    if (!contrato) {
      return { respuesta: false, mensaje: { titulo: 'Datos Incompletos', mensaje: 'Debe seleccionar el contrato' } };
    }

    if (!Util.validarArreglo(listaAgregados)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos un punto de salida o medidor' } };
    }

    if (!Util.validarArreglo(listaPuntosAgregados)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos un punto de consumo' } };
    }

    if (!Util.validarArreglo(listaAdjuntos)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe adjuntar al menos un documento' } };
    }
    return { respuesta: true };
  };

  /**
   * Método encargado de formar la lista de detalles a enviar
   * @returns {Array}
   */
  obtenerDetalles = () => {
    const { listaAgregados, listaPuntosAgregados } = this.state;
    let listaFinal = [];
    let detalles = [];
    listaFinal.push(...listaAgregados);
    listaFinal.push(...listaPuntosAgregados);
    listaFinal.map(lf => {
      if (lf.mesuIderegistro) {
        detalles.push({
          mesuIderegistro: {
            mesuIderegistro: lf.mesuIderegistro
          },
          uniIdemedida: {
            uniIderegistro: lf.uniIdemedida.uniIderegistro
          },
          dteeCantidad: lf.cantidadHabilitada
        });
      }
      if (lf.ptsaIderegistro) {
        detalles.push({
          ptsaIderegistro: {
            ptsaIderegistro: lf.ptsaIderegistro
          },
          uniIdemedida: {
            uniIderegistro: lf.uniIdemedida.uniIderegistro
          },
          dteeCantidad: lf.cantidadHabilitada
        });
      }
      if (lf.ptcIderegistro) {
        detalles.push({
          ptcIderegistro: {
            ptcIderegistro: lf.ptcIderegistro
          },
          uniIdemedida: {
            uniIderegistro: lf.uniIdemedidanomin.uniIderegistro
          },
          dteeCantidad: lf.cantidadHabilitada
        });
      }
    });
    return detalles;
  };

  /**
   * Método encargado de generar un JSON con los valores ingresados
   * @returns {Object}
   */
  obtenerDatos = () => {
    const { fechaIniEvento, fechaFinEvento, contrato, tipoContrato, listaAdjuntos } = this.state;
    let datos = {
      cntIdecontrato: {
        cntIderegistro: contrato.cntIderegistro
      },
      eveFechainicio: fechaIniEvento,
      eveFechafin: fechaFinEvento,
      eveAdjunto: JSON.stringify(listaAdjuntos),
      uniIdetipocontrato: {
        uniIderegistro: tipoContrato
      },
      detalles: this.obtenerDetalles()
    }
    return datos;
  };

  /**
   * Método encargado de inactivar el evento seleccionado
   */
  inactivarEvento = () => {
    const { idEvento } = this.state;
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_EVENTO_EXIMENTE.INACTIVAR_EVENTO, { idEvento: idEvento })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      })
  }

  /**
   * Método encargado de guardar los datos de la entidad
	 * @returns {bool}
   */
  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    const validarTabla = this.validarDetalles();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    if (!validarTabla) {
      return false;
    }

    const entidadGuardar = this.obtenerDatos();

    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_EVENTO_EXIMENTE.GUARDAR, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de validar que no se encuentre ningun adjunto repetido
   * @returns {bool}
   */
  verificarArchivo = (archivo) => {
    const lista = [...this.state.listaAdjuntos];
    const index = lista.findIndex(p => p.nombreOriginal.trim() == archivo.name.trim());
    return index >= 0;
  };

  /**
   * Método encargado de subir el archivo adjunto
   * @param {Array} adjunto Contiene los datos del adjunto seleccionado
   * @param {number} contrato número de contrato al cual se le adjuntara el archivo
   * @returns {bool}
   */
  subirArchivo = (adjunto) => {
    if (this.verificarArchivo(adjunto)) {
      this.props.mostrarAlerta('Error', 'El archivo ya se encuentra en la lista');
      return;
    }
    const data = new FormData();
    data.append('archivo[]', adjunto);
    const configuracion = { headers: { 'Content-Type': 'multipart/form-data' } };
    axios.post(RUTAS_API.GLOBAL.SUBIR_ARCHIVOS, data, configuracion)
      .then((respuesta) => {
        this.procesarArchivo(respuesta.data.datos);
      });
  };

  /**
   * Método encargado de agregar el adjunto seleccionado a una lista
   * @param {Array} adjunto Contiene los datos del adjunto seleccionado
   * @param {number} contrato número de contrato al cual se le adjuntara el archivo
   */
  procesarArchivo = (adjunto) => {
    adjunto = adjunto[0];
    let { listaAdjuntos } = this.state;
    listaAdjuntos.push(adjunto);
    this.setState({ listaAdjuntos: listaAdjuntos, nombreAdjunto: adjunto.nombreOriginal });
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
	 * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    const { idEvento } = this.state;
    let change = {};
    if (idEvento != '') {
      return;
    }
    if (evento.target.name == 'tipoContrato') {
      change[evento.target.name] = evento.target.value;
      change.contrato = null;
      change.listaMedidores = [];
      change.listaPuntosSalida = [];
      change.listaAgregados = [];
      change.listaPuntosConsumo = [];
      change.fechaIniEvento = '';
      change.fechaFinEvento = '';
      change.puntoConsumo = '';
      change.valorAgregar = '';
      change.listaAdjuntos = [];
      this.setState(change);
      return;
    }
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  /**
   * Método encargado de controlar el cambio al seleccionar un adjunto
   * @param {number} contrato Posición número de contrato que se le va a adjuntar el archivo
   * @param {Event} evento El evento que se ejecuta en el control de usuario.
   * @returns {bool}
   */
  controlarCambioArchivo = (evento) => {
    if (evento.target.files.length === 0) {
      return;
    }
    const adjunto = evento.target.files[0];
    this.subirArchivo(adjunto);
  };

  /**
   * Método encargado de generar la carta de notificación al tercero que tenga un contacto tipo Representante Legal
   * @param {number} idContrato Identificador del contrato del tercero
   * @returns {bool}
   */
  generarDocumento = (idContrato) => {
    const { fechaIniEvento, fechaFinEvento } = this.state;
    const fecha1 = new Date(fechaIniEvento);
    const fecha2 = new Date(fechaFinEvento);
    if (fechaIniEvento.trim() === '') {
      this.props.mostrarAlerta('Datos Incompletos', 'Debe ingresar la fecha inicial');
      return false;
    }

    if (fechaFinEvento.trim() === '') {
      this.props.mostrarAlerta('Datos Incompletos', 'Debe ingresar la fecha final');
      return false;
    }

    if (fecha1 > fecha2) {
      this.props.mostrarAlerta('Datos Erroneos', 'La fecha final debe ser mayor que la inicial');
      return false;
    }

    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_EVENTO_EXIMENTE.GENERAR_DOCUMENTO, { 'idContrato': idContrato, 'fechaInicio': fechaIniEvento, 'fechaFinal': fechaFinEvento })
      .then(respuesta => {
        let a = document.createElement('a');
        a.href = 'data:' + { type: "Content-Type: application/msword" } + ';base64,' + respuesta.data.datos;
        a.download = "Notificacion.docx";
        a.target = '_blank';
        a.click();
      });
  };

  /**
   * Método encargado de eliminar el adjunto seleccionado
   * @param {number} index Posición que se desea eliminar
   */
  eliminarAdjunto = (index) => {
    const lista = [...this.state.listaAdjuntos];
    lista.splice(index, 1);
    this.setState({ listaAdjuntos: lista });
  };

  /**
   * Método encargado de obtener el link de descarga de un archivo
   * @param {Object} archivo Datos del archivo
   * @returns {Object}
   */
  obtenerEnlaceDescarga = (archivo) => {
    if (!archivo.id) {
      this.props.mostrarAlerta('Descarga no disponible', 'Lo sentimos la descarga no está disponible, para descargar el archivo tiene que subirlo.');
      return;
    }
    axios.post(RUTAS_API.CONTRATOS.DESCARGAR_ARCHIVO, { id: archivo.id })
      .then((respuesta) => {
        if (respuesta.data.codigo < 0) {
          this.props.mostrarAlerta('Archivo no existe', 'Lo sentimos el archivo no existe');
          return;
        }
        let a = document.createElement('a');
        a.href = 'data:' + archivo.tipo + ';base64,' + respuesta.data.datos.contenido;
        a.download = archivo.nombre;
        a.target = '_blank';
        a.click();
      });
  };

  /**
   * Método encargado de mostrar los adjuntos seleccionados
   * @returns {Array}
   */
  renderAdjuntos = () => {
    const { idEvento } = this.state;
    let desabilitar = false;
    if (idEvento != '') {
      desabilitar = true;
    }
    const { listaAdjuntos } = this.state;
    return (
      <table className='table table-striped mt-5'>
        <thead>
          <tr>
            <th>Documento</th>
            <th>Descargar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {
            listaAdjuntos.map((adjunto, index) => {
              return (
                <tr key={"Adjunto_" + index}>
                  <td>{adjunto.nombreOriginal}</td>
                  <td>
                    <button className='btn btn-info' onClick={() => {
                      this.obtenerEnlaceDescarga(adjunto);
                    }}>Descargar</button>
                  </td>
                  <td>
                    <button className='btn btn-danger' disabled={desabilitar} onClick={() => {
                      this.eliminarAdjunto(index);
                    }}>Eliminar</button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  };

  /**
   * Método encargado de limpiar el contrato
   */
  limpiarContrato = () => {
    this.setState({
      contrato: null,
      listaMedidores: [],
      listaPuntosSalida: [],
    });
  }

  /**
   * Método encargado de mostrar el componente selector de contratos
   * @returns {Object}
   */
  renderSelectorContrato = () => {
    const { idEvento } = this.state;
    let desabilitar = false;
    if (idEvento != '') {
      desabilitar = true;
    }
    const contrato = getProp(this.state, 'contrato', null);
    const propsInput = {
      placeholder: 'Seleccione un contrato',
      className: 'form-control',
      onChange: this.controlarCambio,
      name: 'contrato',
      title: getProp(contrato, 'cntNumero', ''),
      value: getProp(contrato, 'cntNumero', ''),
      type: 'text',
      disabled: true
    };
    return (
      <div className='col-3 form-group'>
        <label>Contrato:</label>
        <div className="input-group mb-3">
          <input {...propsInput} />
          <div className="input-group-prepend">
            <button className="btn-primary input-group-text" title='Limpiar Agente' disabled={desabilitar} onClick={this.limpiarContrato}><i className='fa fa-fw fa-trash'></i></button>
            <button className="btn-primary btn-buscador input-group-text" title='Seleccionar Agente Tercero' disabled={desabilitar} onClick={this.abrirConsultaContratos}><i className='fa fa-fw fa-check-square-o'></i></button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Método encargado de abrir el modal de consultar contratos
   * @returns {Boolean}
   */
  abrirConsultaContratos = () => {
    if (this.state.tipoContrato === '' || this.state.tipoContrato === '-1') {
      toast.error('Debe seleccionar un tipo de contrato');
      return;
    }

    if (this.state.fechaIniEvento === '') {
      toast.error('Debe seleccionar la fecha inicio del evento');
      return;
    }

    if (this.state.fechaFinEvento === '') {
      toast.error('Debe seleccionar la fecha fin del evento');
      return;
    }

    if (this.state.fechaIniEvento.localeCompare(this.state.fechaFinEvento) != 0) {
      toast.error('La fecha fin del evento debe ser igual a la fecha inicial');
      return;
    }
    this.setState({ estadoModalContrato: true });
  };

  /**
   * Método encargado de consultar las listas del contrato
   * @param {Integer} idContrato Identificador del contrato
   */
  consultarListas = (idContrato) => {
    const { fechaFinEvento, fechaIniEvento } = this.state;
    let parametros = {
      idContrato: idContrato,
      fechaInicio: fechaIniEvento,
      fechaFin: fechaFinEvento
    }
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_EVENTO_EXIMENTE.CONSULTAR_DETALLE_CONTRATO, parametros)
      .then(respuesta => {
        let data = obtenerDatosRespuesta(respuesta);
        this.setState({
          listaMedidores: data.listaMedidor,
          listaPuntosSalida: data.listaPuntoSalida
        });
      });
  };

  /**
   * Método encargado de cargar los datos de la entidad en la variable contrato
   * @param {Object} entidad Entidad seleccioanda
   */
  onSeleccionarContrato = (entidad) => {
    this.setState({
      contrato: entidad,
      estadoModalContrato: false
    });
    let idRegistro = entidad.cntIderegistro;
    this.consultarListas(idRegistro);
  };

  /**
   * Método encargado de organizar los detalles del evento
   * @param {Array} detalles Detalles del evento seleccionado
   * @param {String} tipo Tipo usado para saber que lista formar
   */
  obtenerLista = (detalles, tipo = null) => {
    let listaDevolver = [];
    let elementoNuevo = {};
    for (let index = 0; index < detalles.length; index++) {
      const elemento = detalles[index];
      if (tipo == null) {
        if (elemento.ptsaIderegistro) {
          elementoNuevo = elemento.ptsaIderegistro;
          elementoNuevo.cantidadHabilitada = elemento.dteeCantidad;
          listaDevolver.push({ ...elementoNuevo });
        }
        if (elemento.mesuIderegistro) {
          elementoNuevo = elemento.mesuIderegistro;
          elementoNuevo.cantidadHabilitada = elemento.dteeCantidad;
          listaDevolver.push({ ...elementoNuevo });
        }
      }
      if (tipo == 'punto') {
        if (elemento.ptcIderegistro) {
          elementoNuevo = elemento.ptcIderegistro;
          elementoNuevo.cantidadHabilitada = elemento.dteeCantidad;
          listaDevolver.push({ ...elementoNuevo });
        }
      }
    }
    return listaDevolver;
  }

  /**
   * Método encargado de cargar los datos del evento eximente para inactivar
   * @param {Object} entidad Datos del evento eximente
   */
  onSeleccionarEvento = (entidad) => {
    let lista = this.obtenerLista(entidad.detalles);
    let listaPuntos = this.obtenerLista(entidad.detalles, 'punto');
    this.setState({
      tipoContrato: entidad.uniIdetipocontrato.uniIderegistro,
      idEvento: entidad.eveIderegistro,
      contrato: entidad.cntIdecontrato,
      fechaIniEvento: entidad.eveFechainicio,
      fechaFinEvento: entidad.eveFechafin,
      listaAdjuntos: JSON.parse(entidad.eveAdjunto),
      listaAgregados: lista,
      listaPuntosAgregados: listaPuntos,
      estadoModal: false
    });
  }

  /**
   * Método encargado de eliminar los medidores o puntos de salida
   * @param {Event} identificador Identificador del elemento
   * @param {Event} tipo Tipo que identifica si es medidor o punto
   */
  eliminarElemento = (identificador, tipo) => {
    let lista = [...this.state.listaAgregados];
    let index;
    if (tipo == 'medidor') {
      index = lista.findIndex(m => m.mesuIderegistro == identificador);
    }
    if (tipo == 'punto') {
      index = lista.findIndex(m => m.ptsaIderegistro == identificador);
    }
    if (tipo == 'punto de consumo') {
      let listaPuntos = [...this.state.listaPuntosAgregados];
      index = listaPuntos.findIndex(m => m.ptcIderegistro == identificador);
      listaPuntos.splice(index, 1);
      this.setState({ listaPuntosAgregados: [...listaPuntos] });
      return;
    }
    lista.splice(index, 1);
    this.consultarPuntosConsumo(lista);
    this.setState({ listaAgregados: [...lista], listaPuntosAgregados: [] });
  }

  /**
   * Método encargado de mostrar la alerta para confirmar la eliminación del medidor o punto de salida
   * @param {Integer} identificador Identificador del medidor o punto de salida
   * @param {String} tipo Cambio identificador para saber si es un medidor o un punto de salida
   */
  renderAlerta = (identificador, tipo) => {
    return (this.props.mostrarAlerta('Confirmar', 'Se eliminara el ' + tipo + ', ¿Desea continuar?', [
      { clase: 'btn btn-primary', callback: () => { this.eliminarElemento(identificador, tipo) }, texto: 'Sí' },
      { clase: 'btn btn-default', texto: 'No' },
    ]));
  }

  /**
   * Método encargado de controlar el cambio en la tabla de medidores o puntos de consumo
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambioTabla = (evento) => {
    const { idEvento } = this.state;
    if (idEvento != '') {
      return;
    }
    const control = evento.target;
    const tipo = control.attributes['data-tipo'].value
    const identificador = control.attributes['data-id'].value
    if (tipo == 'medidor') {
      let medidores = [...this.state.listaAgregados];
      const indexMedidor = medidores.findIndex(m => m.mesuIderegistro == identificador);
      medidores[indexMedidor][control.name] = control.value;
      this.setState({ listaAgregados: [...medidores] });
      return;
    }
    if (tipo == 'puntoC') {
      let puntosConsumo = [...this.state.listaPuntosAgregados];
      const indexPunto = puntosConsumo.findIndex(p => p.ptcIderegistro == identificador);
      puntosConsumo[indexPunto][control.name] = control.value;
      this.setState({ listaPuntosAgregados: [...puntosConsumo] });
      return;
    }
    let puntosSalida = [...this.state.listaAgregados];
    const indexPunto = puntosSalida.findIndex(p => p.ptsaIderegistro == identificador);
    puntosSalida[indexPunto][control.name] = control.value;
    this.setState({ listaAgregados: [...puntosSalida] });
  }

  /**
   * Método encargado de mostrar la tabla de medidores y/o puntos de consumo segun sea el caso
   * @returns {Object}
   */
  renderTabla = () => {
    const { idEvento } = this.state;
    let desabilitar = false;
    if (idEvento != '') {
      desabilitar = true;
    }
    const { listaAgregados, tipoContrato, listaTipoContrato } = this.state;
    let tipo = listaTipoContrato.find(lt => lt.uniIderegistro == tipoContrato);
    return (
      <table className='table table-hover table-striped table-condensed labels-hidden'>
        <thead>
          <tr>
            <th>{(tipo && tipo.listaPropiedades.tipocontrato == 'S') ? 'Medidor' : 'Punto de Salida'}</th>
            <th>Cantidad Contratada</th>
            <th>Unidad de Medida</th>
            <th>Cantidad Habilitada</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {(Util.validarArreglo(listaAgregados)) &&
            listaAgregados.map(elemento => {
              return (
                <tr key={(elemento.mesuIderegistro) ? elemento.mesuIderegistro : elemento.ptsaIderegistro}>
                  <td>{(elemento.mesuNombre) ? elemento.mesuNombre : elemento.ptsaNombre}</td>
                  <td>{(elemento.mesuCapacidadmaxima) ? elemento.mesuCapacidadmaxima : elemento.pstaCapacidad}</td>
                  <td>{(elemento.mesuIderegistro) ? getProp(elemento, 'uniIdemedida.uniNombre1', 'Indefinido') : getProp(elemento, 'uniIdemedida.uniNombre1', 'Indefinido')}</td>
                  <td>
                    <TextoNumerico
                      aceptaDecimales={true}
                      aceptaNegativos={false}
                      cols={12}
                      value={elemento.cantidadHabilitada}
                      onChange={this.controlarCambioTabla}
                      name='cantidadHabilitada'
                      extra={{ 'data-tipo': (elemento.mesuIderegistro) ? 'medidor' : 'punto', 'data-id': (elemento.mesuIderegistro) ? elemento.mesuIderegistro : elemento.ptsaIderegistro }}
                    />
                  </td>
                  <td>
                    <button
                      className="btn-primary btn-buscador input-group-btn"
                      title='Eliminar'
                      disabled={desabilitar}
                      onClick={() => {
                        this.renderAlerta((elemento.mesuIderegistro) ? elemento.mesuIderegistro : elemento.ptsaIderegistro, (elemento.mesuIderegistro) ? 'medidor' : 'punto')
                      }}><i className='fa fa-fw fa-minus'></i>
                    </button>
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );
  }

  /**
   * Método encargado de validar que no se ingrese un punto de consumo repetido
   * @returns {Boolean}
   */
  validarRepetidoPunto = () => {
    const { listaPuntosAgregados, puntoConsumo } = this.state;
    let index;
    index = listaPuntosAgregados.findIndex(la => la.ptcIderegistro == puntoConsumo);
    return index >= 0;
  };

  /**
   * Método encargado de agregar el punto de consumo seleccionado
   * @returns {Boolean}
   */
  agregarPuntoSeleccionado = () => {
    const { listaPuntosAgregados, puntoConsumo, listaPuntosConsumo } = this.state;
    if (puntoConsumo == '' || puntoConsumo == '1-' || puntoConsumo == -1) {
      this.props.mostrarAlerta('Datos Incompletos', 'Debe seleccionar el punto de consumo que desea agregar');
      return;
    }
    if (this.validarRepetidoPunto()) {
      this.props.mostrarAlerta('Datos Incompletos', 'Este punto de consumo ya se encuentra agregado');
      return;
    }
    const elemento = listaPuntosConsumo.find(m => m.ptcIderegistro == puntoConsumo);
    listaPuntosAgregados.push({ ...elemento });
    this.setState({ listaPuntosAgregados: listaPuntosAgregados });
  }

  /**
   * Método encargado de mostrar el formulario de puntos de consumo
   * @returns {Object}
   */
  renderFormularioPuntosConsumo = () => {
    const { idEvento } = this.state;
    let desabilitar = false;
    if (idEvento != '') {
      desabilitar = true;
    }
    return (
      <div className='row col-12 mt-5'>
        {Util.validarArreglo(this.state.listaPuntosConsumo) &&
          <div className="input-group mb-3">
            <Combo
              opciones={this.state.listaPuntosConsumo}
              propTexto='ptcoNombre'
              propValor='ptcIderegistro'
              label='Puntos de Consumo:'
              name='puntoConsumo'
              value={this.state.puntoConsumo}
              onChange={this.controlarCambio}
            />
            <button
              className="btnSuma"
              title='Agregar Puntos de Consumo'
              onClick={() => this.agregarPuntoSeleccionado()}><i className='fa fa-fw fa-plus'></i></button>
          </div>
        }
        {Util.validarArreglo(this.state.listaPuntosAgregados) &&
          <table className='table table-hover table-striped table-condensed labels-hidden mt-5'>
            <thead>
              <tr>
                <th>Puntos de Consumo</th>
                <th>Tipo de Consumo</th>
                <th>Cantidad Contratada</th>
                <th>Unidad de medida</th>
                <th>Cantidad Habilitada</th>
                <th>Generar Carta</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {Util.validarArreglo(this.state.listaPuntosAgregados) &&
                this.state.listaPuntosAgregados.map(puntoC => {
                  return (
                    <tr key={puntoC.ptcIderegistro}>
                      <td>{puntoC.ptcoNombre}</td>
                      <td>{puntoC.uniIdetipoconsumo.uniNombre1}</td>
                      <td>{puntoC.ptcMaxnominacion}</td>
                      <td>{puntoC.uniIdemedidanomin.uniNombre1}</td>
                      <td>
                        <TextoNumerico
                          aceptaDecimales={true}
                          aceptaNegativos={false}
                          cols={12}
                          value={puntoC.cantidadHabilitada}
                          onChange={this.controlarCambioTabla}
                          name='cantidadHabilitada'
                          extra={{ 'data-tipo': 'puntoC', 'data-id': puntoC.ptcIderegistro }}
                        />
                      </td>
                      <td>
                        <button className='btnAdjuntar' onClick={() => {
                          this.generarDocumento(puntoC.cntIdetercero.cntIderegistro)
                        }}>Generar Carta</button>
                      </td>
                      <td>
                        <button
                          className="btn-primary btn-buscador input-group-btn"
                          title='Eliminar'
                          disabled={desabilitar}
                          onClick={() => {
                            this.renderAlerta(puntoC.ptcIderegistro, 'punto de consumo')
                          }}><i className='fa fa-fw fa-minus'></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        }
      </div>
    )
  }

  /**
   * Método encargado de validar si el elemento se encuentra repetido en la lista de agregados
   * @param {Object} tipo Datos del tipo de contrato seleccionado
   * @returns {Boolean}
   */
  validarRepetido = (tipo) => {
    const { listaAgregados, valorAgregar } = this.state;
    let index;
    if ((tipo && tipo.listaPropiedades.tipocontrato == 'S')) {
      index = listaAgregados.findIndex(la => la.mesuIderegistro == valorAgregar);
      return index >= 0;
    }
    if ((tipo && tipo.listaPropiedades.tipocontrato == 'T')) {
      index = listaAgregados.findIndex(la => la.ptsaIderegistro == valorAgregar);
      return index >= 0;
    }
  };

  /**
   * Método encargado de consultar los puntos de consumo
   * @param {Array} lista Lista de puntos de salida o medidores
   */
  consultarPuntosConsumo = (lista) => {
    if (!Util.validarArreglo(lista)) {
      this.setState({ listaPuntosConsumo: [] })
      return;
    }
    const { contrato, tipoContrato, listaTipoContrato, fechaFinEvento, fechaIniEvento } = this.state;
    let tipo = listaTipoContrato.find(lt => lt.uniIderegistro == tipoContrato);
    let listaIds = [];
    let enviar = {
      idContrato: contrato.cntIderegistro,
      fechaInicio: fechaIniEvento,
      fechaFin: fechaFinEvento,
    }
    if ((tipo && tipo.listaPropiedades.tipocontrato == 'S')) {
      listaIds = lista.map(l => {
        return parseInt(l.mesuIderegistro)
      });
      enviar.medidores = listaIds;
    }
    if ((tipo && tipo.listaPropiedades.tipocontrato == 'T')) {
      listaIds = lista.map(l => {
        return parseInt(l.ptsaIderegistro)
      });
      enviar.puntosSalida = listaIds;
    }

    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_EVENTO_EXIMENTE.CONSULTAR_PUNTOS_CONSUMO, enviar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaPuntosConsumo: respuesta.data.datos });
        }
      });
  }

  /**
   * Método encargado de agregar el medidor o punto de salida a la lista de agregados
   * @param {Object} tipo Datos del tipo de contrato seleccionado
   */
  agregarElemento = (tipo) => {
    const { listaAgregados, valorAgregar, listaMedidores, listaPuntosSalida } = this.state;
    if (valorAgregar == '' || valorAgregar == '1-' || valorAgregar == -1) {
      if ((tipo && tipo.listaPropiedades.tipocontrato == 'S')) {
        this.props.mostrarAlerta('Datos Incompletos', 'Debe seleccionar el medidor que desea agregar');
        return;
      }
      if ((tipo && tipo.listaPropiedades.tipocontrato == 'T')) {
        this.props.mostrarAlerta('Datos Incompletos', 'Debe seleccionar el punto de salida que desea agregar');
        return;
      }
    }
    if (this.validarRepetido(tipo)) {
      if ((tipo && tipo.listaPropiedades.tipocontrato == 'S')) {
        this.props.mostrarAlerta('Datos Incompletos', 'Este medidor ya se encuentra agregado');
        return;
      }
      if ((tipo && tipo.listaPropiedades.tipocontrato == 'T')) {
        this.props.mostrarAlerta('Datos Incompletos', 'Este punto de salida ya se encuentra agregado');
        return;
      }
    }
    let elemento;
    if ((tipo && tipo.listaPropiedades.tipocontrato == 'S')) {
      elemento = listaMedidores.find(m => m.mesuIderegistro == valorAgregar);
    }
    if ((tipo && tipo.listaPropiedades.tipocontrato == 'T')) {
      elemento = listaPuntosSalida.find(m => m.ptsaIderegistro == valorAgregar);
    }
    listaAgregados.push({ ...elemento });
    this.consultarPuntosConsumo(listaAgregados);
    this.setState({ listaAgregados: listaAgregados, listaPuntosAgregados: [] });
  }

  /**
   * Método encargado de mostrar el selector para medidores o puntos de salida
   * @returns {Object}
   */
  renderSelector = () => {
    const { listaMedidores, listaPuntosSalida, tipoContrato, listaTipoContrato } = this.state;
    let tipo = listaTipoContrato.find(lt => lt.uniIderegistro == tipoContrato);
    return (
      <div className="grupo input-group mb-3 mt-5">
        {(tipo && tipo.listaPropiedades.tipocontrato == 'S') &&
          <Combo
            opciones={listaMedidores}
            propTexto='mesuNombre'
            propValor='mesuIderegistro'
            label='Medidores:'
            name='valorAgregar'
            value={this.state.valorAgregar}
            onChange={this.controlarCambio}
          />
        }
        {(tipo && tipo.listaPropiedades.tipocontrato == 'T') &&
          <Combo
            opciones={listaPuntosSalida}
            propTexto='ptsaNombre'
            propValor='ptsaIderegistro'
            label='Puntos de Salida:'
            name='valorAgregar'
            value={this.state.valorAgregar}
            onChange={this.controlarCambio}
          />
        }
        <button
          className="btnSuma"
          title='Agregar'
          onClick={() => this.agregarElemento(tipo)}><i className='fa fa-fw fa-plus'></i></button>
      </div>
    );
  }

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    const { idEvento } = this.state;
    let desabilitar = false;
    if (idEvento != '') {
      desabilitar = true;
    }
    return (
      <Fragment>
        <div className='d-flex justify-content-center'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>
        <div className='conf-general row mt-5'>
          <Combo
            opciones={this.state.listaTipoContrato}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Tipo de contrato:'
            name='tipoContrato'
            cols={3}
            value={this.state.tipoContrato}
            onChange={this.controlarCambio}
          />
          <Fecha
            label='Fecha inicial del evento:'
            name='fechaIniEvento'
            cols={3}
            fecha={this.state.fechaIniEvento}
            onChange={this.controlarCambio}
          />
          <Fecha
            label='Fecha Fin del Evento:'
            name='fechaFinEvento'
            cols={3}
            fecha={this.state.fechaFinEvento}
            onChange={this.controlarCambio}
          />
          {this.renderSelectorContrato()}
          {
            <div className="upload-btn-wrapper">
              <button disabled={desabilitar} className="btnAdjuntar">Adjuntar Documento</button>
              <input
                type='file'
                id='selectorArchivo'
                accept='application/pdf'
                ref={ref => (this.selectorArchivo = ref)}
                className='adjunto'
                disabled={desabilitar}
                onChange={(evento) => {
                  this.controlarCambioArchivo(evento)
                }}
              />
            </div>
          }

          {(Util.validarArreglo(this.state.listaMedidores) || Util.validarArreglo(this.state.listaPuntosSalida)) &&
            this.renderSelector()
          }
          {(Util.validarArreglo(this.state.listaAgregados)) &&
            this.renderTabla()
          }
          {
            this.renderFormularioPuntosConsumo()
          }
        </div>
        {Util.validarArreglo(this.state.listaAdjuntos) &&
          this.renderAdjuntos()
        }
        <VentanaModal
          mostrar={this.state.estadoModalContrato}
          titulo='Seleccionar Contrato'
          cerrarModal={() => this.setState({ estadoModalContrato: false })}>
          <RConsultaTercerosEximente
            esModal
            seleccionarEntidad={this.onSeleccionarContrato}
            tipoContrato={this.state.tipoContrato}
            fechaIniEvento={this.state.fechaIniEvento}
            fechaFinEvento={this.state.fechaFinEvento}
            autoConsultar={true}
          />
        </VentanaModal>

        <VentanaModal
          mostrar={this.state.estadoModal}
          titulo='Inactivar evento'
          cerrarModal={() => this.setState({ estadoModal: false })}>
          <RConsultaEventosEximentes
            esModal
            listaTipoContrato={this.state.listaTipoContrato}
            seleccionarEntidad={this.onSeleccionarEvento}
          />
        </VentanaModal>
      </Fragment>
    );
  };
}

GestionEventoEximente.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionEventoEximente);

export { VistaRedux as RGestionEventoEximente };
