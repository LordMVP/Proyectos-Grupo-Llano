import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util } from 'appfuture-react';
import axios from 'axios';
import md5 from 'md5';

import RUTAS_API from '../../global/rutas_api';
import { mostrarAlerta } from '../../store/actions/AplicacionAcciones';

import './GestionLogin.scss';
import { toast } from 'react-toastify';

class GestionLogin extends Component {

  state = {
    mostrarModalConsulta: false,
    listaEmpresas: [],
    usuario: '',
  };

  validarFormulario = () => {
    const { usuario, contrasena, empresa, listaEmpresas } = this.state;
    if (!usuario || usuario.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar el usuario.' } };
    }

    if (!Util.validarArreglo(listaEmpresas)) {
      this.consultarEmpresas();
      return { respuesta: false };
    }

    if (!contrasena || contrasena.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar la contraseña.' } };
    }

    if (!empresa || empresa.trim() === '' || empresa < 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar seleccionar la empresa.' } };
    }

    return { respuesta: true };
  };

  controlarCambio = (evento) => {
    let change = {};
    if (evento.target.name == 'usuario') {
      change.listaEmpresas = [];
      change.empresa = '';
    }
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  /**
   * Método encargado de consultar las empresas para el login de terceros
   */
  consultarEmpresas = () => {
    axios.post(RUTAS_API.GLOBAL.CONSULTAR_EMPRESAS_USUARIO, { usuario: this.state.usuario })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          let lista = respuesta.data.datos;
          if (!Util.validarArreglo(lista)) {
            lista = [];
          }
          this.setState({ listaEmpresas: lista });
        }
      });
  };


  enter = (event) => {
    if (event.key === 'Enter') {
      this.consultarEmpresas();
    }
  }

  acceder = (evento) => {
    evento.preventDefault();
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      if (!validacion.mensaje) {
        return;
      }
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return;
    }
    const { usuario, contrasena, empresa } = this.state;
    axios.post(RUTAS_API.GLOBAL.INICIAR_SESION_TERCERO, {
      idEmpresa: empresa,
      usuario: usuario,
      clave: md5(contrasena)
    })
      .then(respuesta => {
        if (respuesta.data.codigo >= 0) {
          localStorage.setItem('tipoUsuario', 'EXTERNO');
          location.href = 'gestion_ingreso_nominaciones';
        }
      });
  };

  render() {
    return (
      <Fragment>
        <h1 className='mt-5 login-title'>Ingresa tus datos para acceder a la cuenta</h1>
        <div class="login-card">
          <h1>Iniciar sesión</h1>
          <form key='form_login' method="POST" onSubmit={this.acceder} accept-charset="UTF-8">
            <div className='form-group col-12'>
              <label></label>
              <input
                value={this.state.usuario}
                onChange={this.controlarCambio}
                placeholder='Ingresa tu usuario'
                name='usuario'
                type='text'
                className='form-control col-12'
                onBlur={() => { this.consultarEmpresas() }}
              />
            </div>
            <Input
              type='password'
              value={this.state.contrasena}
              placeholder='Ingresa tu contraseña'
              onChange={this.controlarCambio}
              name='contrasena'
              cols={12}
            />
            <Combo
              opciones={this.state.listaEmpresas}
              propTexto='empresaNom'
              propValor='empresaSevemp'
              name='empresa'
              value={this.state.empresa}
              onChange={this.controlarCambio}
              cols={12}
            />
            <input type="submit" name="login" className="login login-submit" value="Acceder" />
          </form>
        </div>
      </Fragment>
    );
  }
}

GestionLogin.propTypes = {
  history: PropTypes.object,
  mostrarAlerta: PropTypes.func,
};


const mapStateToProps = state => { };

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    mostrarAlerta,
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionLogin);

export { VistaRedux as RGestionLogin };
