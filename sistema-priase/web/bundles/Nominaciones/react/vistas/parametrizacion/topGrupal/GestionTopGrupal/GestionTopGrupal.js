import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, TextoNumerico, Botonera, Combo, Tabla, VentanaModal, Util } from 'appfuture-react';
import axios from 'axios';

import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';

import { RConsultaTopGrupal } from '../ConsultaTopGrupal';
import './GestionTopGrupal.scss';

class GestionTopGrupal extends Component {

  state = {
    listaContratosAgregados: [],

    // Datos de la entidad
    idTopGrupal: null,
    nombreTopGrupal: '',
    firmezaTopGrupal: '',

    // Estado de la aplicacion
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
  };

  /**
   * Método encargado de limpiar el formulario editar al momento de salir
   */
  componentWillUnmount() {
    this.props.history.replace({ entidadEditar: null });
  };

  /**
   * Método encargado de limpiar los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  limpiarFormulario = (evento) => {
    this.setState({
      // Datos de la entidad
      idTopGrupal: null,
      nombreTopGrupal: '',
      firmezaTopGrupal: '',
      listaContratosAgregados: [],
      // Estado de la aplicacion
      mostrarModalConsulta: false,

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
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    if (!this.state.nombreTopGrupal || this.state.nombreTopGrupal.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Valor Nombre Obligatorio.' } };
    }

    if (isNaN(this.state.firmezaTopGrupal)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'La firmeza solo admite valores númericos.' } };
    }

    if (this.state.firmezaTopGrupal <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'La firmeza no puede ser menor que 0 ni 0' } };
    }

    if (this.state.firmezaTopGrupal > 100) {
      return { respuesta: false, mensaje: { titulo: 'Datos invalidos', mensaje: 'Valor Firmeza no puede ser mayor a 100.' } };
    }

    return { respuesta: true };
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

    const entidadGuardar = {
      tpgIderegistro: this.state.idTopGrupal,
      tpgNombre: this.state.nombreTopGrupal.trim(),
      tpgFirmeza: this.state.firmezaTopGrupal,
    };

    axios.post(RUTAS_API.PARAMETRIZACION.TOP_GRUPAL.GUARDAR_TOP_GRUPAL, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de abrir la ventana modal del boton consulta
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
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  /**
   * Método encargado de cerrar la ventana modal del boton de consulta
   */
  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false
    });
  };

  /**
   * Método encargado de cargar los datos seleccionados en la ventana modal
   * @param {Object} entidad Datos seleccionados de la consulta
   */
  cargarDatos = (entidad) => {
    this.setState({
      mostrarModalConsulta: false,
      idTopGrupal: entidad.tpgIderegistro,
      nombreTopGrupal: entidad.tpgNombre,
      firmezaTopGrupal: entidad.tpgFirmeza,
    });

    this.consultarContratos(entidad.tpgIderegistro);
  };

  /**
   * Método encargado de consultar los contratos del top grupal consultado
   * @param {number} idTopGrupal Identificador del top grupal consultado
   */
  consultarContratos = (idTopGrupal) => {
    axios.post(RUTAS_API.PARAMETRIZACION.TOP_GRUPAL.CONSULTAR_CONTRATOS, {
      idTopGrupal: idTopGrupal
    }).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        this.setState({
          listaContratosAgregados: respuesta.data.datos
        });
      }
    });
  };

  /**
   * Método encargado de mostrar las columnas del componente tabla
   * @returns {Object}
   */
  obtenerColumnasContratos = () => {
    return [
      {
        Header: 'Contratos',
        columns: [
          {
            Header: 'Número',
            accessor: 'cntNumero',
          },
          {
            Header: 'Nombre',
            accessor: 'terIdeagente.terNombre',
          },
          {
            Header: 'Nombre completo',
            accessor: 'terIdeagente.terNomcompleto',
          },
          {
            Header: 'Fecha inicio',
            accessor: 'cntFechainicio',
          },
          {
            Header: 'Fecha fin',
            accessor: 'cntFechafin',
          }
        ]
      }
    ];
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />

        <div className='conf-general row mt-5'>
          <Input
            label='Nombre:'
            value={this.state.nombreTopGrupal}
            onChange={this.controlarCambio}
            name='nombreTopGrupal'
          />
          <TextoNumerico
            aceptaDecimales={false}
            aceptaNegativos={false}
            label='Firmeza:'
            value={this.state.firmezaTopGrupal}
            onChange={this.controlarCambio}
            name='firmezaTopGrupal'
          />
          <div className="col-md-12">
            {this.state.listaContratosAgregados.length > 0 &&
              <Tabla
                datos={this.state.listaContratosAgregados}
                columnas={this.obtenerColumnasContratos()}
                className='mt25'
              />
            }
          </div>
        </div>

        <VentanaModal
          mostrar={this.state.mostrarModalConsulta}
          titulo='Consultar Top Grupal'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaTopGrupal esModal seleccionarEntidad={this.cargarDatos} />
        </VentanaModal>
      </Fragment>
    );
  };
}

GestionTopGrupal.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionTopGrupal);

export { VistaRedux as RGestionTopGrupal };
