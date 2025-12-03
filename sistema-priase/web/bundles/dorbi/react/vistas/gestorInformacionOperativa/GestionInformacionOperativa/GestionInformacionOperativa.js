import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Fecha, Botonera, Combo, Tabla, VentanaModal, Util } from 'appfuture-react';
import axios from 'axios';

import RUTAS_API from '../../../global/rutas_api';
import { mostrarAlerta } from '../../../store/actions/AplicacionAcciones';

// import { RConsultaGestionInformacionOperativa } from '../ConsultaGestionInformacionOperativa';
import './GestionInformacionOperativa.scss';

class GestionGestionInformacionOperativa extends Component {

  state = {
    mostrarModalConsulta: false,

    // Datos de la entidad
    // ...

    // Estado de la aplicacion
    // ...

  };

  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
  }

  componentWillUnmount() {
    this.props.history.replace({ entidadEditar: null });
  }

  limpiarFormulario = (evento) => {
    this.setState({
      mostrarModalConsulta: false,

      // Datos de la entidad
      // ...

      // Estado de la aplicacion
      // ...

    });
  };

  componentWillUnmount() {
    this.limpiarFormulario();
  }

  obtenerFunciones = () => {
    return [
      { texto: 'Guardar', callback: this.guardarEntidad },
      { texto: 'Consultar', callback: this.consultarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  validarFormulario = () => {
    // Ejemplo Validacion
    if (false) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos un cargo de tipo AO&M para poder continuar.' } };
    }

    return { respuesta: true };
  };

  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    const entidadGuardar = {
      // Asignar datos de la entidad
    }

    // Reemplazar con ruta del Endpoint para guardar
    axios.post(RUTAS_API.XXXXXX, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  consultarEntidad = () => {
    this.setState({ mostrarModalConsulta: true });
  };

  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

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

  renderColumnasContrato = () => {
    return (
      <div className='col-5 items'>
        <div className=''></div>
      </div>
    )
  };

  renderBotonesComponente = () => {
    return (
      <div className='col-2 botones'>
        <button className='btn btn-primary'><i className='fa fa-fw fa-angle-right'></i></button>
        <button className='btn btn-primary'><i className='fa fa-fw fa-angle-doble-right'></i></button>
        <button className='btn btn-primary'><i className='fa fa-fw fa-angle-right'></i></button>
        <button className='btn btn-primary'><i className='fa fa-fw fa-angle-doble-right'></i></button>
      </div>
    );
  };

  renderColumnasReporte = () => {
    <div className='col-5 items'>

    </div>
  };

  render() {
    return (
      <Fragment>
        <div className='d-flex justify-content-center'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>

        <div className='conf-general row mt-5'>
          <Fecha
            label='Fecha inicial:'
            name='fechaIni'
            fecha={this.state.fechaIni}
            onChange={this.controlarCambio}
          />
          <Fecha
            label='Fecha final:'
            name='fechaFinal'
            fecha={this.state.fechaFinal}
            onChange={this.controlarCambio}
          />
        </div>

        {this.renderColumnasContrato}
        {this.renderColumnasReporte}

        {/* <VentanaModal
          mostrar={this.state.mostrarModalConsulta}
          titulo='Información Operativa'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaGestionInformacionOperativa esModal seleccionarEntidad={this.cargarDatos} />
        </VentanaModal> */}
      </Fragment>
    );
  }
}

GestionGestionInformacionOperativa.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionGestionInformacionOperativa);

export { VistaRedux as RGestionGestionInformacionOperativa };
