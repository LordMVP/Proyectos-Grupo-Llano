import React, { Component } from 'react';
import PropTypes from 'prop-types';

// REDUX
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import { actualizarDocumentosContrato } from '../../../../store/actions/ContratosAcciones';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';

import { Combo, Fecha, Tabla, Util } from 'appfuture-react';
import axios from 'axios';
import './GestionDocumentos.scss';
import RUTAS_API from '../../../../global/rutas_api';
import { get as getProp } from 'object-path';

class GestionDocumentos extends Component {

  state = {
    tipoDocumento: '',
    fechaInicio: '',
    fechaFin: '',
    fechaExpedicion: '',
  };

  /**
   * Método encargado de actualizar los adjuntos en el objeto redux
   * @param {Object} nuevoCambio Cambio a ejecutar
   */
  actualizardocumentosRedux = (nuevoCambio) => {
    this.props.actualizarDocumentosContrato({
      ...getProp(this.props, 'documentos', []),
      ...nuevoCambio
    })
  };

  /**
   * Método encargado de controlar el cambio de los componentes
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambio = (evento) => {
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitarE = false;
    let desabilitarActivo = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitarE = true;
    }
    if (estadoContrato == 'A') {
      desabilitarActivo = true;
    }

    if (desabilitarActivo) {
      return;
    }

    if (desabilitarE) {
      return;
    }
    const control = evento.target;
    let nuevoEstado = {};
    nuevoEstado[control.name] = control.value;
    this.setState(nuevoEstado);
  }

  /**
   * Método encargado de controlar el cambio en los archivos
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambioArchivo = (evento) => {
    const validacion = this.validarDocumento();
    if (!validacion.respuesta) {
      const { titulo, mensaje } = validacion.mensaje;
      this.props.mostrarAlerta(titulo, mensaje);
      return;
    }
    if (evento.target.files.length == 0) {
      return;
    }
    const adjunto = evento.target.files[0];
    let { adjuntos } = getProp(this.props, 'documentos', []);
    const { tipoDocumento, fechaInicio, fechaFin, fechaExpedicion } = this.state;
    let nuevoArchivo = { tipoDocumento, fechaInicio, fechaFin, fechaExpedicion };
    nuevoArchivo.archivo = adjunto;
    if (typeof adjuntos == 'undefined') {
      adjuntos = [];
      nuevoArchivo.idEliminar = Util.generarIdControl((adjuntos.length + 1));
      this.actualizardocumentosRedux({ adjuntos: [nuevoArchivo] });
      return;
    }
    nuevoArchivo.idEliminar = Util.generarIdControl((adjuntos.length + 1));
    if (Util.validarArreglo(adjuntos)) {
      return this.actualizardocumentosRedux({ adjuntos: [...adjuntos, nuevoArchivo] });
    }
    this.actualizardocumentosRedux({ adjuntos: [nuevoArchivo] });
  };

  /**
   * Método encargado de abrir el selector de archivos
   * @returns {Boolean}
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
   * Método encargado de validar los datos necesarios para subir un archivo
   * @returns {Object}
   */
  validarDocumento = () => {
    const { tipoDocumento, fechaInicio, fechaFin, fechaExpedicion } = this.state;
    if (tipoDocumento === '' || tipoDocumento === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un tipo de documento' } };
    }

    if (fechaInicio === '' || fechaFin === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una fecha de inicio y una fecha de fin' } };
    }

    if (fechaExpedicion == '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una fecha de expedición' } };
    }
    return { respuesta: true };
  }

  /**
   * Método encargado de obtener el tipo de documento
   * @param {String} tipoDocumento Tipo de documento seleccionado
   * @returns {String}
   */
  obtenerTipoDocumento = (tipoDocumento) => {
    const { listaTiposDocumentos } = this.props.listas;
    const index = listaTiposDocumentos.findIndex(d => d.uniIderegistro == tipoDocumento);
    return listaTiposDocumentos[index].uniNombre1;
  };

  /**
   * Método encargado de obtener el nombre del archivo
   * @param {Object} archivo Datos del archivo
   * @returns {String}
   */
  obtenerNombreArchivo = (archivo) => {
    return archivo.archivo.name;
  }

  /**
   * Método encargado de mostrar la tabla de archivos
   * @returns {JSX}
   */
  renderTablaArchivos = () => {
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitarE = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitarE = true;
    }
    let desabilitarActivo = false;
    if (estadoContrato == 'A') {
      desabilitarActivo = true;
    }
    const listaArchivos = getProp(this.props, 'documentos.adjuntos', []);
    return (
      <div>
        <table className="table table-condensed table-striped table-hover">
          <thead>
            <tr>
              <th>Tipo Documento</th>
              <th>Archivo</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Expedición</th>
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
                    <td>{archivo.fechaExpedicion}</td>
                    <td><button className='btn btn-link' disabled={(desabilitarE || desabilitarActivo == true)} onClick={() => { this.obtenerEnlaceDescarga(archivo) }}>Descargar</button>
                      <button className='btn btn-link' disabled={(desabilitarE || desabilitarActivo == true)} onClick={() => { this.confimarEliminar(archivo) }}>Eliminar</button>
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
   * Método encargado de inactivar el archivo seleccionado
   * @param {Object} archivo datos del archivo seleccionado
   */
  eliminarArchivo = (archivo) => {
    const { adjuntos } = getProp(this.props, 'documentos', []);
    const index = adjuntos.findIndex(p => p.id == archivo.id);
    adjuntos.splice(index, 1);
    this.actualizardocumentosRedux({ adjuntos: [...adjuntos] });
  };

  /**
   * Método encargado de mostrar la alerta de confirmación para eliminar un adjunto
   * @param {Object} archivo Datos del archivo seleccionado
   */
  confimarEliminar = (archivo) => {
    if (!archivo.id || archivo.id == '') {
      const { adjuntos } = getProp(this.props, 'documentos', []);
      const index = adjuntos.findIndex(p => p.idEliminar == archivo.idEliminar);
      adjuntos.splice(index, 1);
      this.actualizardocumentosRedux({ adjuntos: [...adjuntos] });
      return;
    }
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
   * Método encargado de limpiar los adjuntos que no se han subido.
   */
  limpiarTabla = () => {
    let { adjuntos } = getProp(this.props, 'documentos', []);
    for (let index = adjuntos.length - 1; index >= 0; index--) {
      const adjunto = adjuntos[index];
      if (!adjunto.id || adjunto.id == '') {
        adjuntos.splice(index, 1);
      }
    }
    this.actualizardocumentosRedux({ adjuntos: [...adjuntos] });
  };

  /**
   * Método encargado de subir los archivos seleccionados
   * @returns {Boolean}
   */
  subirArchivos = () => {
    const listaArchivos = getProp(this.props, 'documentos.adjuntos', []);
    const data = new FormData();
    let archivosParaSubir = 0;
    for (let i = 0; i < listaArchivos.length; i++) {
      const archivo = listaArchivos[i];
      if (!archivo.id) {
        data.append('archivo[]', archivo.archivo);
        archivosParaSubir++;
      }
    }
    if (archivosParaSubir == 0) {
      this.props.mostrarAlerta('No hay archivos', 'No se adjuntaron archivos nuevos para subir.');
    }
    const configuracion = { headers: { 'Content-Type': 'multipart/form-data' } };
    axios.post(RUTAS_API.CONTRATOS.SUBIR_ARCHIVOS, data, configuracion)
      .then((respuesta) => {
        if (respuesta.data.codigo < 0) {
          this.limpiarTabla();
          this.mostrarError(respuesta.data.datos);
          return;
        }
        this.procesarArchivos(respuesta.data.datos);
      });
  };

  /**
   * Método encargado de procesar los datos de los archivos
   * @param {Array} datos Datos de los archivos subidos
   * @returns {Object}
   */
  procesarArchivos = (datos) => {
    const listaArchivos = getProp(this.props, 'documentos.adjuntos', []);
    for (let i = 0; i < listaArchivos.length; i++) {
      const index = datos.findIndex(d => d.nombreOriginal == listaArchivos[i].archivo.name);
      if (index == -1) {
        continue;
      }
      listaArchivos[i].id = datos[index].id;
      listaArchivos[i].tipo = datos[index].tipo;
      listaArchivos[i].nombre = datos[index].nombreOriginal;
      this.actualizardocumentosRedux({ adjuntos: [...listaArchivos] });
    }
  };

  /**
   * Método encargado de mostrar los errores al momento de adjuntar los archivos
   * @param {Array} errores Lista de errores
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
   * @returns {Array}
   */
  obtenerListaTiposDocumentos = () => {
    const { listaTiposDocumentos } = this.props.listas;
    const { cabecera } = this.props;
    return listaTiposDocumentos.filter((tipoDocumento) => {
      const uniPropiedad = JSON.parse(tipoDocumento.uniPropiedad);
      const propiedad = getProp(uniPropiedad, 'negocio', '');
      if (propiedad.search(cabecera.tipoNegocio) >= 0) {
        return tipoDocumento;
      }
    });
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitarE = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitarE = true;
    }
    let desabilitarActivo = false;
    if (estadoContrato == 'A') {
      desabilitarActivo = true;
    }
    const { tipoNegocio } = getProp(this.props, 'cabecera', {});
    if (!tipoNegocio || tipoNegocio === '-1') {
      return (<div className='text-center'>Debe seleccionar un tipo de Negocio para continuar con esta opción</div>)
    }
    return (
      <div>
        <div className='row col-12 contratos-documentos'>

          <Combo
            opciones={this.obtenerListaTiposDocumentos()}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Tipo de Documento:'
            name='tipoDocumento'
            value={this.state.tipoDocumento}
            onChange={this.controlarCambio}
            cols={3}
          />

          <Fecha
            label='Fecha Expedición:'
            name='fechaExpedicion'
            fecha={this.state.fechaExpedicion || ''}
            onChange={this.controlarCambio}
            cols={3}
          />

          <div className="grupo-campos col-6">
            <legend className="title">Vigencia:</legend>
            <div className="row">
              <Fecha
                label='Fecha inicio:'
                name='fechaInicio'
                fechaInicio={null}
                fechaFin={this.state.fechaFin}
                fecha={this.state.fechaInicio || ''}
                onChange={this.controlarCambio}
                cols={6}
              />
              <Fecha
                label='Fecha fin:'
                name='fechaFin'
                fechaInicio={this.state.fechaInicio}
                fechaFin={null}
                fecha={this.state.fechaFin || ''}
                onChange={this.controlarCambio}
                cols={6}
              />
            </div>
          </div>

          <button className="btn btn-primary contratos-documentos__btn-archivo" disabled={(desabilitarE || desabilitarActivo == true)} onClick={this.abrirSelectorArchivo}>Seleccionar archivo</button>
          <input
            type="file"
            id='selectorArchivo'
            accept='application/pdf'
            ref={ref => (this.selectorArchivo = ref)}
            className='contratos-documentos__input-file'
            onChange={this.controlarCambioArchivo}
          />
        </div>

        {
          Util.validarArreglo(getProp(this.props, 'documentos.adjuntos', [])) &&
          <div className='contratos-documentos__tabla-archivos'>
            {this.renderTablaArchivos()}
            <button className="btn btn-primary" disabled={(desabilitarE || desabilitarActivo == true)} onClick={this.subirArchivos}>
              Subir archivos
            </button>
          </div>
        }
      </div>
    );
  }

}

GestionDocumentos.propTypes = {
  documentos: PropTypes.object,
  cabecera: PropTypes.object,
  mostrarAlerta: PropTypes.func,
  actualizarDocumentosContrato: PropTypes.func,
};

const mapStateToProps = state => {
  const { documentos, cabecera, listas } = state.contratos;
  return { documentos, cabecera, listas };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actualizarDocumentosContrato,
    mostrarAlerta
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionDocumentos);

export { VistaRedux as RGestionDocumentos };
