import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Combo, Fecha, Tabla, TextoNumerico, Util } from 'appfuture-react';
import axios from 'axios';
import { CLASES_UNIDADES, URL_AXIOS } from '../../../global/constantes';
import RUTAS_API from '../../../global/rutas_api';
import '../GestionDocumentos/GestionDocumentos.scss';
import { descargarArchivo } from './../../../global/util_nominaciones';

class GestionDocumentos extends Component {

  state = {
    tipoDocumento: '',
    numero: '',
    entidadEmite: '',
    fechaEmision: '',
    fechaPublicacion: '',
    nombre: '',
    fechaInicio: '',
    fechaFin: '',
    descripcion: '',
    idArchivo: '',
    listaTipoDocumentos: [],
    listaEntidades: []
  };

  /**
   * Método encargado de comprar si el componente ya cargo
   */
  componentDidMount() {
    this.consultarListaEntidad();
    this.consultarListaTipoDocumentos();
  };

  /**
   * Método encargado de realizar la consulta de las entidades
   */
  consultarListaEntidad = () => {
    axios
      .post(RUTAS_API.PARAMETRIZACION.REGIMEN_TARIFAS.CONSULTA_ENTIDAD, { criterio: "" })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaEntidades: respuesta.data.datos });
        }
      })
  };

  /**
   * Método encargado de realizar la consulta de los tipos de documento
   */
  consultarListaTipoDocumentos = () => {
    axios
      .post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { idClase: CLASES_UNIDADES.TIPO_DOCUMENTOS_GENERALES })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaTipoDocumentos: respuesta.data.datos });
        }
      })
  };
  /**
   * Método encargado de actualizar los adjuntos en el componente regimen tarifas
   * @param {Object} nuevoCambio Datos de los adjuntos
   */
  actualizarAdjuntos = (nuevoCambio) => {
    this.limpiarFormulario();
    this.props.actualizarAdjuntos({
      ...this.props.adjuntos,
      ...nuevoCambio
    })
  };

  /**
   * Método encargado de limpiar los campos del formulario de gestión de documentos
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  limpiarFormulario = (evento) => {
    this.setState({
      numero: '',
      nombre: '',
      fechaInicio: '',
      fechaFin: '',
      fechaEmision: '',
      fechaPublicacion: '',
      tipoDocumento: '',
      entidadEmite: '',
      descripcion: ''
    });
  };

  /**
   * Método encargado de controlar el cambio del valor en los campos del formulario
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambio = (evento) => {
    const control = evento.target;
    let nuevoEstado = {};
    nuevoEstado[control.name] = control.value;
    this.setState(nuevoEstado);
  };

  /**
   * Método encargado de realizar la edición del documento seleccionado
   */
  editarDocumento = () => {
    const { idArchivo } = this.state;
    const listaArchivos = this.props.adjuntos;
    const index = listaArchivos.findIndex(p => p.id == idArchivo);
    if (index >= 0) {
      listaArchivos[index].estado = "I"
      this.actualizarAdjuntos(listaArchivos);
    }
  };

  /**
   * Método encargado de controlar el cambio al momento de seleccionar un archivo
   * @param {Event} evento Evento ejecutado en el control de usuario
   * @returns {bool}
   */
  controlarCambioArchivo = (evento) => {
    const validacion = this.validarDocumento();
    this.editarDocumento();
    if (!validacion.respuesta) {
      const { titulo, mensaje } = validacion.mensaje;
      this.props.mostrarAlerta(titulo, mensaje);
      return;
    }
    const adjunto = evento.target.files[0];
    const { tipoDocumento, entidadEmite, fechaInicio, fechaFin, fechaExpedicion, fechaEmision, fechaPublicacion, descripcion, numero, nombre } = this.state;
    let nuevoArchivo = { tipoDocumento, entidadEmite, fechaInicio, fechaFin, fechaExpedicion, fechaEmision, fechaPublicacion, descripcion, numero, nombre, };
    nuevoArchivo.archivo = adjunto;
    nuevoArchivo.estado = "A";

    const { adjuntos } = this.props;
    if (Util.validarArreglo(adjuntos)) {
      return this.actualizarAdjuntos({ adjuntos: [...adjuntos, nuevoArchivo] });
    }
    this.actualizarAdjuntos({ adjuntos: [nuevoArchivo] });
  };

  /**
   * Método encargado de abrir el input file
   * @returns {bool}
   */
  abrirSelectorArchivo = () => {
    const validacion = this.validarDocumento();
    if (!validacion.respuesta) {
      const { titulo, mensaje } = validacion.mensaje;
      this.props.mostrarAlerta(titulo, mensaje);
      return;
    }

    this.selectorArchivo.click();
  };

  /**
   * Método encargado de validar los campos del formulario
   * @returns {Object}
   */
  validarDocumento = () => {
    const { tipoDocumento, fechaPublicacion, numero, entidadEmite, fechaEmision, nombre, fechaInicio, fechaFin, descripcion } = this.state;

    if (tipoDocumento <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El campo tipo es obligatorio.' } };
    }

    if (numero.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El campo número es obligatorio.' } };
    }

    if (entidadEmite <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El campo entidad que emite es obligatorio.' } };
    }

    if (fechaEmision.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El campo fecha de emisión es obligatorio.' } };
    }

    if (fechaPublicacion.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El campo fecha de publicación es obligatorio.' } };
    }

    if (nombre.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El campo nombre es obligatorio.' } };
    }

    if (fechaInicio.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El campo fecha inicio es obligatorio.' } };
    }

    if (fechaFin.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El campo fecha fin es obligatorio.' } };
    }

    if (descripcion.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'La descripción del documento es obligatoria' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de obtener el nombre del tipo de documento para los archivos consultados
   * @param {number} tipoDocumento Identificador del tipo de documento
   * @returns {string}
   */
  obtenerTipoDocumento = (tipoDocumento) => {
    const { listaTipoDocumentos } = this.state;
    const index = listaTipoDocumentos.findIndex(d => d.uniIderegistro == tipoDocumento);
    if (index == -1) {
      return ' ';
    }
    return listaTipoDocumentos[index].uniNombre1;
  };

  /**
   * Método encargado de obtener el nombre de la entidad consultada
   * @param {number} entidadEmite Identificador de la entidad que emite
   * @returns {string}
   */
  obtenerEntidadEmite = (entidadEmite) => {
    const { listaEntidades } = this.state;
    const entidad = listaEntidades.find(d => d.terIderegistro == entidadEmite);
    if (!entidad) {
      return '';
    }
    return entidad.terIderegistro;
  };

  /**
   * Método encargado de obtener el nombre del tipo de documento para los archivos consultados
   * @param {number} tipoDocumento Identificador del tipo de documento
   * @returns {string}
   */
  obtenerTipoDocumentoEditar = (tipoDocumento) => {
    const { listaTipoDocumentos } = this.state;
    const entidad = listaTipoDocumentos.find(d => d.uniIderegistro == tipoDocumento);
    if (!entidad) {
      return '';
    }
    return entidad.uniIderegistro;
  };

  /**
   * Método encargado de obtener el nombre de los archivos consultados
   * @param {Object} archivo datos del archivo seleccionado
   * @returnsOb
   */
  obtenerNombreArchivo = (archivo) => {
    return archivo.archivo.name;
  };

  /**
   * Método encargado de inactivar el archivo seleccionado
   * @param {Object} archivo datos del archivo seleccionado
   */
  eliminarArchivo = (archivo) => {
    let listaArchivos = this.props.adjuntos;
    const index = listaArchivos.findIndex(p => p.id == archivo.id);
    listaArchivos[index].estado = "I";
    this.actualizarAdjuntos(listaArchivos);
  };

  /**
   * Método encargado de mostrar la alerta de confirmación para eliminar un adjunto
   * @param {Object} archivo Datos del archivo seleccionado
   */
  confimarEliminar = (archivo) => {
    this.props.mostrarAlerta('Confirmación Eliminar', 'Confirmar que desea eliminar el documento', [
      {
        clase: 'btn btn-primary',
        callback: () => this.eliminarArchivo(archivo),
        texto: 'Aceptar'
      },
      {
        clase: 'btn btn-default',
        texto: 'Cancelar'
      }
    ]);
  };

  /**
   * Método encargado de obtener los datos del archivo a editar
   * @param {Object} archivo Datos del archivo seleccionado
   */
  obtenerDatosArchivo = (archivo) => {
    this.setState({
      tipoDocumento: this.obtenerTipoDocumentoEditar(archivo.tipoDocumento),
      numero: archivo.numero,
      entidadEmite: this.obtenerEntidadEmite(archivo.entidadEmite),
      fechaEmision: archivo.fechaEmision,
      fechaPublicacion: archivo.fechaPublicacion,
      nombre: archivo.nombre,
      fechaInicio: archivo.fechaInicio,
      fechaFin: archivo.fechaFin,
      descripcion: archivo.descripcion,
      idArchivo: archivo.id,
    });
  };

  /**
   * Método encargado de filtrar los documentos activos
   * @returns {Object}
   */
  filtrarEstadoDocumento = () => {
    const listaArchivos = this.props.adjuntos;
    return listaArchivos.filter(p => p.estado == "A");
  };

  /**
   * Método encargado de mostrar la tabla con los adjuntos consultados.
   * @returns {Object}
   */
  renderTablaArchivos = () => {
    const listaArchivos = this.filtrarEstadoDocumento();
    return (
      <div>
        <table className="table table-condensed table-striped table-hover">
          <thead>
            <tr>
              <th>Tipo Documento</th>
              <th>Archivo</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {
              listaArchivos.map((archivo, index) => {
                return (
                  <tr key={index}>
                    <td>{this.obtenerTipoDocumento(archivo.tipoDocumento)}</td>
                    <td>{this.obtenerNombreArchivo(archivo)}</td>
                    <td>{archivo.fechaInicio}</td>
                    <td>{archivo.fechaFin}</td>
                    <td>
                      <button className='btn btn-link' onClick={() => { this.obtenerEnlaceDescarga(archivo) }}>Descargar</button>
                      <button className='btn btn-link' onClick={() => { this.obtenerDatosArchivo(archivo) }}>Editar</button>
                      <button className='btn btn-link' onClick={() => { this.confimarEliminar(archivo) }}>Eliminar</button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    );
  };

  /**
   * Método encargado de obtener el enlace para la descarga del adjunto seleccionado
   * @returns {bool}
   */
  obtenerEnlaceDescarga = (archivo) => {
    if (!archivo.idArchivo) {
      this.props.mostrarAlerta('Descarga no disponible', 'Lo sentimos la descarga no está disponible, para descargar el archivo tiene que subirlo.');
      return;
    }
    descargarArchivo(archivo.idArchivo);
  };

  /**
   * Método encargado de subir los archivos seleccionados
   * @returns {bool}
   */
  subirArchivos = () => {
    const listaArchivos = this.props.adjuntos;
    const data = new FormData();
    let archivosParaSubir = 0;

    for (let i = 0; i < listaArchivos.length; i++) {
      const archivo = listaArchivos[i];
      if (!archivo.id) {
        data.append('archivo', archivo.archivo);
        archivosParaSubir++;
      }
    }

    if (archivosParaSubir == 0) {
      this.props.mostrarAlerta('No hay archivos', 'No se adjuntaron archivos nuevos para subir.');
    }

    const configuracion = { headers: { 'Content-Type': 'multipart/form-data' } };
    axios.post(RUTAS_API.DOCUMENTOS.SUBIR_ARCHIVO, data, configuracion)
      .then((respuesta) => {
        if (respuesta.data.codigo < 0) {
          this.mostrarError(respuesta.data.datos);
          return;
        }
        this.procesarArchivos(respuesta.data.datos);
      });
  };

  /**
   * Método encargado de actualizar los adjuntos en régimen tarifas
   * @param {Object} datos Datos de los adjuntos subidos
   */
  procesarArchivos = (datos) => {
    const listaArchivos = this.props.adjuntos;
    const i = listaArchivos.findIndex(archivo => archivo.archivo.name == datos[0].nombreOriginal);
    listaArchivos[i].idArchivo = datos[0].id;
    listaArchivos[i].tipo = datos[0].tipo;
    this.actualizarAdjuntos({ adjuntos: [...listaArchivos] });
  };

  /**
   * Método encargado de mostrar los errores al moemnto de subir el archivo
   * @param {Object} errores
   */
  mostrarError = (errores) => {
    let strMensaje = errores.map((err, index) => (<li key={index}>{`Línea ${err.linea}: ${err.mensaje}`}</li>));
    let mensaje = (
      <Fragment>
        <span>{`Ocurrieron uno o varios errores al subir el archivo, verifique el archivo e intente nuevamente.`}</span>
        <ul className='container mt-2 pl-5'>{strMensaje}</ul>
      </Fragment>
    );
    this.props.mostrarAlerta('Error', mensaje);
  };

  /**
   * Obtiene la lista de los tipos de documento para archivos filtrando por el tipo de negocio.
   * @returns {number}
   */
  obtenerlistaTiposDocumento = () => {
    const { listaTiposDocumento, tipoNegocio } = this.props;
    if (!Array.isArray(listaTiposDocumento)) {
      return [];
    }
    return listaTiposDocumento.filter((tipoDocumento) => {
      const uniPropiedad = JSON.parse(tipoDocumento.uniPropiedad);
      if (uniPropiedad.negocio.search(tipoNegocio) >= 0) {
        return tipoDocumento;
      }
    });
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <div>
        <div className='row gestion-documentos'>
          <div className='col-6'>
            <Combo
              opciones={this.state.listaTipoDocumentos}
              propTexto='uniNombre1'
              propValor='uniIderegistro'
              label='Tipo:'
              name='tipoDocumento'
              value={this.state.tipoDocumento}
              onChange={this.controlarCambio}
              cols={12}
            />
            <Input
              label='Número:'
              value={this.state.numero}
              onChange={this.controlarCambio}
              name='numero'
              cols={12}
            />
            <Combo
              opciones={this.state.listaEntidades}
              propTexto='terNomcompleto'
              propValor='terIderegistro'
              label='Entidad que Emite:'
              name='entidadEmite'
              value={this.state.entidadEmite}
              onChange={this.controlarCambio}
              cols={12}
              mostrarOpcionPorDefecto={true}
              textoPorDefecto='Seleccione Una Opción'
              placeholder='Seleccione Una Opción'
            />
            <Fecha
              label='Fecha de emisión:'
              name='fechaEmision'
              fecha={this.state.fechaEmision}
              onChange={this.controlarCambio}
              cols={12}
            />
            <Fecha
              label='Fecha de publicación:'
              name='fechaPublicacion'
              fecha={this.state.fechaPublicacion}
              onChange={this.controlarCambio}
              cols={12}
            />
          </div>
          <div className='col-6'>
            <Input
              label='Nombre:'
              value={this.state.nombre}
              onChange={this.controlarCambio}
              cols={12}
              name='nombre'
            />
            <div className="grupo-campos col-12 mt-3">
              <legend className='title'>
                Vigencia:
              </legend>
              <div className="row">
                <Fecha
                  label='Fecha inicio:'
                  name='fechaInicio'
                  fechaInicio={null}
                  fechaFin={this.state.fechaFin}
                  fecha={this.state.fechaInicio || ''}
                  onChange={this.controlarCambio}
                  cols={12}
                  className='mt-2 mb-2'
                />
                <Fecha
                  label='Fecha fin:'
                  name='fechaFin'
                  fechaInicio={this.state.fechaInicio}
                  fechaFin={null}
                  fecha={this.state.fechaFin || ''}
                  onChange={this.controlarCambio}
                  cols={12}
                  className='mt-2 mb-2'
                />
              </div>
            </div>
            <div className='mt-3 ml-3'>
              <div className='form-group'>
                <label htmlFor='descripcion'>
                  Descripción:
                </label>
                <textarea
                  name='descripcion'
                  id='descripcion'
                  value={this.state.descripcion}
                  onChange={this.controlarCambio}
                  className='form-control'
                  rows='3'
                  placeholder='Descripción'
                >
                </textarea>
              </div>
            </div>
          </div>
          <button className='btn btn-primary gestion-documentos__btn-archivo' onClick={this.abrirSelectorArchivo}>
            <i className='fa fa-save mr-2'></i>
            Seleccionar archivo
          </button>
          <input
            type='file'
            id='selectorArchivo'
            accept={this.props.accept ? this.props.accept : 'application/pdf'}
            ref={ref => (this.selectorArchivo = ref)}
            className='gestion-documentos__input-file'
            onChange={this.controlarCambioArchivo}
          />
        </div>
        {
          Util.validarArreglo(this.filtrarEstadoDocumento()) &&
          <div className='gestion-documentos__tabla-archivos'>
            {this.renderTablaArchivos()}
            <button className="btn btn-primary" onClick={this.subirArchivos}>
              Subir archivos
            </button>
          </div>
        }
      </div>
    );
  };

}

GestionDocumentos.propTypes = {
  adjuntos: PropTypes.array,
  mostrarAlerta: PropTypes.func,
  actualizarAdjuntos: PropTypes.func,
};

export default GestionDocumentos;
