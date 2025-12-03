import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Combo, Fecha, Tabla, Util } from 'appfuture-react';
import axios from 'axios';
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
   * Método encargado de actualizar los adjuntos en el componente padre
   * @param {Object} nuevoCambio Cambio a ejecutar
   */
  actualizarAdjuntos = (nuevoCambio) => {
    this.props.actualizarAdjuntos({
      ...this.props.adjuntos,
      ...nuevoCambio
    })
  };

  /**
   * Método encargado de limpiar los datos del formulario
   */
  limpiarFormulario = (evento) => {
    this.setState({});
  };

  /**
   * Método encargado de controlar el cambio de los componentes
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambio = (evento) => {
    const control = evento.target;
    let nuevoEstado = {};
    nuevoEstado[control.name] = control.value;
    this.setState(nuevoEstado);
  }

  /**
   * Método encargado de controlar el cambio de los archivos
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambioArchivo = (evento) => {
    const validacion = this.validarDocumento();
    if (!validacion.respuesta) {
      const { titulo, mensaje } = validacion.mensaje;
      this.props.mostrarAlerta(titulo, mensaje);
      return;
    }
    const adjunto = evento.target.files[0];
    const { tipoDocumento, fechaInicio, fechaFin, fechaExpedicion } = this.state;
    let nuevoArchivo = { tipoDocumento, fechaInicio, fechaFin, fechaExpedicion };
    nuevoArchivo.archivo = adjunto;

    const { adjuntos } = this.props;
    if (Util.validarArreglo(adjuntos)) {
      return this.actualizarAdjuntos({ adjuntos: [...adjuntos, nuevoArchivo] });
    }
    this.actualizarAdjuntos({ adjuntos: [nuevoArchivo] });
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
   * @returns {String}
   */
  obtenerTipoDocumento = (tipoDocumento) => {
    const { listaTiposDocumento } = this.props;
    const index = listaTiposDocumento.findIndex(d => d.uniIderegistro == tipoDocumento);
    return listaTiposDocumento[index].uniNombre1;
  };

  /**
   * Método encargado de obtener el nombre del archivo
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
    const listaArchivos = this.props.adjuntos;
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
                    <td><button className='btn btn-link' onClick={() => { this.obtenerEnlaceDescarga(archivo) }}>Descargar</button></td>
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
   * Método encargado de subir los archivos seleccionados
   * @returns {Boolean}
   */
  subirArchivos = () => {
    const listaArchivos = this.props.adjuntos;
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
          this.mostrarError(respuesta.data.datos);
          return;
        }
        this.procesarArchivos(respuesta.data.datos);
      });
  };

  /**
   * Método encargado de procesar los datos de los archivos
   * @returns {Object}
   */
  procesarArchivos = (datos) => {
    const listaArchivos = this.props.adjuntos;
    const i = listaArchivos.findIndex(archivo => archivo.archivo.name == datos[0].nombreOriginal);
    listaArchivos[i].id = datos[0].id;
    listaArchivos[i].tipo = datos[0].tipo;
    listaArchivos[i].nombre = datos[0].nombreOriginal;
    this.actualizarAdjuntos({ adjuntos: [...listaArchivos] });
  };

  /**
   * Método encargado de mostrar lista de errores al adjuntar el archivo
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
   */
  obtenerlistaTiposDocumento = () => {
    const { listaTiposDocumento, tipoNegocio } = this.props;
    if (!Array.isArray(listaTiposDocumento)) {
      return [];
    }
    return listaTiposDocumento.filter((tipoDocumento) => {
      const uniPropiedad = JSON.parse(tipoDocumento.uniPropiedad);
      const propiedad = getProp(uniPropiedad, 'negocio', '');
      if (propiedad.search(tipoNegocio) >= 0) {
        return tipoDocumento;
      }
    });
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    const { tipoNegocio } = this.props;
    if (!tipoNegocio || tipoNegocio === '-1') {
      return (<div className='text-center'>Debe seleccionar un tipo de Negocio para continuar con esta opción</div>)
    }
    return (
      <div>
        <div className='row col-12 contratos-documentos'>

          <Combo
            opciones={this.obtenerlistaTiposDocumento()}
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

          <button className="btn btn-primary contratos-documentos__btn-archivo" onClick={this.abrirSelectorArchivo}>Seleccionar archivo</button>
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
          Util.validarArreglo(this.props.adjuntos) &&
          <div className='contratos-documentos__tabla-archivos'>
            {this.renderTablaArchivos()}
            <button className="btn btn-primary" onClick={this.subirArchivos}>
              Subir archivos
            </button>
          </div>
        }
      </div>
    );
  }

}

GestionDocumentos.propTypes = {
  listaTiposDocumento: PropTypes.array,
  adjuntos: PropTypes.array,
  mostrarAlerta: PropTypes.func,
  actualizarAdjuntos: PropTypes.func,
};

export default GestionDocumentos;
