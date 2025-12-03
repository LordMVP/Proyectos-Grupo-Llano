import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal } from 'appfuture-react';
import axios from 'axios';
import { get as getProp } from 'object-path';
import Autocompletado from '../Assets/componentes/Autocompletado';
import RUTAS_API from '../../global/rutas_api';
import { mostrarAlerta } from '../../store/actions/AplicacionAcciones';
import './UnidadesResponsables.scss';

class CrearUnidadResponsable extends Component {

  state = {
    mostrarModalConsulta: false,
    proceso:'-1',
    cuadrilla:'',
    listaCuadrillas:[]
  };

  componentDidMount() {
    this.consultarEmpresas();
  }

  consultarEmpresas = () => {

  };

  componentWillUnmount() {
    this.props.history.replace({ entidadEditar: null });
  }

  limpiarFormulario = (evento) => {
    this.setState({
      empresa:'-1',
      proceso:'-1',
      cuadrilla: '',
      listaCuadrillas: [],
      mostrarModalConsulta: false,
    });
  };

  componentWillUnmount() {
    this.limpiarFormulario();
  }

  obtenerFunciones = () => {
    return [
      { texto: 'Guardar', callback: this.guardarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  validarFormulario = () => {
    const { empresa, cuadrilla } = this.state;
    if (!empresa || empresa.trim() == '-1' || empresa == '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar la empresa.' } };
    }

    if (!cuadrilla || cuadrilla.trim() == '-1' || cuadrilla == '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar la cuadrilla.' } };
    }

    return { respuesta: true };
  };

  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    const { empresa, cuadrilla } = this.state;
    const codigo = cuadrilla.split("-")
    const entidadGuardar = {
      cuadrilla: {
        cuadrillaCod: codigo[0].trim()
      },
      cuadrillaCodemp: empresa
    };

    // Reemplazar con ruta del Endpoint para guardar
    axios.post(RUTAS_API.UNIDADES_RESPONSABLES.INSETAR_UNIDAD_RESPONSABLE, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {          
          this.props.terminar();
        } else {
          this.props.mostrarAlerta('Error', 'No se pudo crear la unidad responsable');
        }
        this.limpiarFormulario();
      });
  };

  consultarEntidad = () => {
    this.setState({ mostrarModalConsulta: true });
  };

  change = ({ target: { id, value } }) => {
    this.setState({ [id]: value })
  }

  controlarCambio = (evento) => {
    let change = {};
    const { id, name, value } = evento.target;
    change[name] = value;    
    this.validarConsultas(name, value);
    this.setState(change);
  };

  validarConsultas = (name, value) => {
    switch (name) {
      case 'empresa':
        this.consultarCuadrillas(value,this.state.proceso);
        break;
      case 'proceso':        
        this.consultarCuadrillas(this.state.empresa, value);
        break;   
      case 'cuadrilla':
        break;     
    }
  };

  consultarCuadrillas = (empresa,proceso) => {
    if(empresa != -1 && proceso != -1){
      axios.post(RUTAS_API.UNIDADES_RESPONSABLES.LISTAR_CUADRILLAS, {
        empresaCod:empresa,
        proceso:proceso
      }).then(respuesta => {
        /*const lista = getProp(respuesta.data, 'datos', []);
        const listaCuadrillas = lista.map(item => {
          return {
            ...item,
            nombre: `${item.cuadrillaCod} - ${item.cuadrillaNom}`
          }
        });
        this.setState({ listaCuadrillas: listaCuadrillas });*/
       const data = getProp(respuesta.data, 'datos', []);
        data.forEach(unidad => {
          unidad.id = unidad.cuadrillaCod;
          unidad.texto = unidad.cuadrillaCod + ' - ' + unidad.cuadrillaNom;
        });
        this.setState({ listaCuadrillas: data});
      });
    }   
  }

  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false
    });
  };

  cargarDatos = (entidad) => {
    this.setState({
      mostrarModalConsulta: false,
      // Cargar datos de la entidad
      // ...
    });
  };

  render() {
    return (
      <Fragment>
        <div className='d-flex justify-content-center'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>

        <div className="caja contenedor">
          <label className="tag">Unidad responsable</label>

          <div className="formulario">
            <Combo
              opciones={getProp(this.props, 'listaEmpresasContrantes', [])}
              propTexto='empresaNom'
              propValor='empresaCod'
              label='Empresa:'
              name='empresa'
              value={this.state.empresa}
              onChange={this.controlarCambio}
            />
            <Combo
                opciones={getProp(this.props, 'listaProcesos', [])}
                propTexto="prcDescripcion"
                propValor="uniProceso"                
                label="proceso:"
                name='proceso'
                value={this.state.proceso}                
                onChange={this.controlarCambio}
            />
           
              <Autocompletado
                  id="cuadrilla"
                  label="Cuadrilla:"                  
                  marcaAgua={'Escribe la cuadrilla'}
                  value={this.state.cuadrilla}
                  opciones={this.state.listaCuadrillas}             
                  onChange={this.change}                  
                //propTexto='nombre'
                //propValor='cuadrillaCod'              
              />                              
          </div>
        </div>
      </Fragment>
    );
  }
}

CrearUnidadResponsable.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(CrearUnidadResponsable);

export { VistaRedux as RCrearUnidadResponsable };
