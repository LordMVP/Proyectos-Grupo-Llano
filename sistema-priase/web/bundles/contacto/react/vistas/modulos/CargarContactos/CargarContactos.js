import React, { Component, Fragment , useState } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import { DragDropFile } from "../../../Componentes/DragAndDrop/DragAndDrop";
import { mostrarAlerta } from '../../../store/actions/AplicacionAcciones';
import { Input, Botonera, TextoNumerico } from 'appfuture-react';
import RUTAS_API from '../../../global/rutas_api';
import RUTAS_VISTA from '../../../global/rutas_vista';
import './css/style.css';


class CargarContactos extends Component {

  state = {
    documento: false,
    infoDocumento: '',
    formatosAceptados: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    textoFormatosAceptados: '.xlsx',
  };


  limpiarFormulario = () => {
    this.setState({
      documento: false,
      infoDocumento: '',
    });
    this.consultaGenerica.getWrappedInstance()._limpiarFormulario();
  };

  bytesToSize = (bytes) => {
    var sizes = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }

  eliminarDocumento = () => {
    console.log("entra eliminar documento....");
    this.setState({
        documento:false,
        infoDocumento:'',
    })
  }


  subirArchivo = () => {

    try {

      const configuracion = { headers: { 'Content-Type': 'multipart/form-data' } };
      const data = new FormData();
      data.append('archivo', this.state.infoDocumento);
  
      axios.post(RUTAS_API.GESTION_CONTACTOS.CARGAR_CONTACTOS, data, configuracion)
      .then((respuesta) => {
        if (respuesta.data.codigo > 0) {
          this.setState({listaTabs:[],contacto:null});  
          // this.props.mostrarAlerta('Correcto', respuesta.data.mensaje);
          this.eliminarDocumento();
        }else{
          // this.props.mostrarAlerta('Error', respuesta.data.mensaje);

        }
      });
    } catch (error) {
      console.log(error);
    }
    
  }

  

  controlarArchivo = (evento) => {
    console.log(evento);
    let documentoOK = false
    this.state.formatosAceptados.forEach(element => {
      if (element === evento[0].type) {
        documentoOK = true;
      }
    });

    if ( !documentoOK ) {
      alert("....")
      return false;
    }
    if (evento.lenght !== 0) {
      this.setState({infoDocumento:evento[0]})  
      this.setState({documento:true})
    }
  };

  documentoCargado() {
    return(
      <div className='div-file-uploaded' >
        <table className='table table-striped'>
          <thead>
            <tr>
              <th colSpan={4}>Información documento</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.state.infoDocumento.name}</td>
              <td>{this.state.infoDocumento.type}</td>
              <td>{this.bytesToSize(this.state.infoDocumento.size) }</td>
              <td> <button  onClick={ () => this.eliminarDocumento() }  className='btn btn-delete'> X </button> </td>
            </tr>
          </tbody>
        </table>

        <div className='uploadFile'>
          <button onClick={ this.subirArchivo } className='btn btn-primary' > 
            <i className='fas fa-upload'></i> Cargar documento 
          </button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <hr></hr>
        <div className='center'>
          { !this.state.documento 
          ? <DragDropFile 
              controlarArchivo={this.controlarArchivo } 
              multiple={false} 
              AcceptsFile={this.state.textoFormatosAceptados}
            /> 
          : this.documentoCargado() } 
        </div>

        {/* <button onClick={() =>  this.setState({documento:!this.state.documento}) } > boton </button> */}
        
      </div>

    );
  }
}

CargarContactos.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array,
  mostrarAlerta: PropTypes.func,
};

CargarContactos.defaultProps = {
  esModal: false,
  seleccionMultiple: false,
  entidadesSeleccionadas: []
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    mostrarAlerta,
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(CargarContactos);

export { VistaRedux as RCargarContactos };
