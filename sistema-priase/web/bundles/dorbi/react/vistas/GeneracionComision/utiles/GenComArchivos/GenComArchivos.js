import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import moment from 'moment';

import RUTAS_API from '../../../../global/rutas_api';
import { URL_GEN_COM } from '../../../../global/constantes';

class GenComArchivos extends Component{
  state = {
    nuevoArchivo: undefined
  }

  descargarArchivo = (evento, index) => {
    evento.preventDefault();
    const archivo =this.props.archivos[index];
    let id = 0

    if (this.props.tipo === "recaudo") id = archivo.ar_id;
    else id = archivo.ac_id;
    
    axios.post(URL_GEN_COM+RUTAS_API.GEN_COMISION.ARCHIVO+'/consultar?archivo='+id)
      .then(respuesta => {
        const archivo = respuesta.data.datos;

        const a = document.createElement('a');
        a.href = 'data:' + archivo.tipo + ';base64,' + archivo.contenido;
        a.download = archivo.nombre;
        a.target = '_blank';
        a.click();
      })
      .catch((error) => console.log(error));
  }

  eliminarArchivo = (evento, index) => {
    evento.preventDefault();
    const archivo =this.props.archivos[index];
    
    if (this.props.tipo === "recaudo") {
      const data = { ar_ideregistro: archivo.ar_ideregistro };
      axios.post(URL_GEN_COM+RUTAS_API.GEN_COMISION.ARCHIVO_REC_ELIMINAR, data)
      .then(() => this.props.obtenerNovedades())
      .catch((error) => console.log(error));
    } else {
      const data = { ac_ideregistro: archivo.ac_ideregistro };
      axios.post(URL_GEN_COM+RUTAS_API.GEN_COMISION.ARCHIVO_CARTERA_ELIMINAR, data)
        .then(() => this.props.obtenerNovedades())
        .catch((error) => console.log(error));
    }
  }

  cambiarArchivo = (evento) => {
    const nuevoArchivo = evento.target.files[0];
    
    this.setState({ nuevoArchivo });
  }

  subirArchivo = (evento) => {
    evento.preventDefault();
    const { nuevoArchivo } = this.state;
    
    const blob = nuevoArchivo.slice(0, nuevoArchivo.size, nuevoArchivo.type);
    const nombre = moment().format('YYYY_MM_DD_HH_mm_ss') + nuevoArchivo.name;
    const newFile = new File([blob], nombre, {type: nuevoArchivo.type});
    
    const formData = new FormData();
    formData.append("archivo", newFile);
    const configuracion = { headers: { 'Content-Type': 'multipart/form-data' } };
    
    axios.post(URL_GEN_COM+RUTAS_API.GEN_COMISION.ARCHIVO, formData, configuracion)
      .then((respuesta) => {
        if (this.props.tipo === "recaudo") {
          const ar_id = Number(respuesta.data.id);
          const ar_nombre = newFile.name;
          const ar_datosarchivo = `{nombre:${ar_nombre},tipo:${newFile.type},tamaño:${newFile.size}}`;
          const gcrn_ideregistro = this.props.novId;

          const data = {
            ar_id,
            ar_nombre,
            ar_datosarchivo,
            gcrn_ideregistro
          }
        
          axios.post(URL_GEN_COM+RUTAS_API.GEN_COMISION.ARCHIVO_REC_CREAR, data)
            .then(() => this.props.obtenerNovedades())
            .catch((error) => console.log(error));
        } else {
          const ac_id = Number(respuesta.data.id);
          const ac_nombre = newFile.name;
          const ac_datosarchivo = `{nombre:${ac_nombre},tipo:${newFile.type},tamaño:${newFile.size}}`;
          const gccn_ideregistro = this.props.novId;

          const data = {
            ac_id,
            ac_nombre,
            ac_datosarchivo,
            gccn_ideregistro
          }

          axios.post(URL_GEN_COM+RUTAS_API.GEN_COMISION.ARCHIVO_CARTERA_CREAR, data)
            .then(() => this.props.obtenerNovedades())
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => console.log(error));
  }

  render() {
    const { index, controlarModal, archivos } = this.props;

    return (
      <Fragment>
        <div className="modal-header">
          <h5 className="modal-title">Archivos</h5>
        </div>
        <div className="modal-body">
          {archivos && archivos.length > 0 ? 
          <table className='table'>
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {archivos.map((archivo, jindex) =>
              <tr key={`archivo-${jindex}`}>
                <td>{this.props.tipo === "recaudo" ? archivo.ar_nombre :
                  archivo.ac_nombre}</td>
                <td>
                  <button
                    onClick={evento => this.descargarArchivo(evento, jindex)}
                    className="btn btn-primary mr-2">Descargar</button>
                  <button
                    onClick={evento => this.eliminarArchivo(evento, jindex)}
                    className="btn btn-primary">Eliminar</button>
                </td>
              </tr>)}
            </tbody>
          </table> :
          "No hay archivos para esta novedad"}
          <hr/>
          <div>
            <form>
              <div className="form-group">
                <label htmlFor="file">Seleccionar nuevo archivo</label>
                <input type="file" className="form-control-file" id="file" onChange={this.cambiarArchivo}/>
              </div>
              {this.state.nuevoArchivo && <button
                className="btn btn-primary"
                onClick={this.subirArchivo}>Subir</button>}
            </form>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => controlarModal(index)}>
            Cerrar</button>
        </div>
      </Fragment>
    );
  }
}

GenComArchivos.propTypes = {
  novId: PropTypes.number,
  tipo: PropTypes.string,
  archivos: PropTypes.array,
  index: PropTypes.number,
  controlarModal: PropTypes.func,
  obtenerNovedades: PropTypes.func
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GenComArchivos);

export { VistaRedux as RGenComArchivos };