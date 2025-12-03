import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, TextoNumerico, Util } from 'appfuture-react';
import { formatearArray, limpiarJson } from '../../../../global/util_nominaciones';
import { mostrarAlerta, mostrarProgramaModal } from '../../../../store/actions/AplicacionAcciones';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import { RConsultaTramos } from '../ConsultaTramos';

import './GestionTramos.scss';

const tiposCargo = [
  { id: 'F', nombre: 'Cargo Fijo' },
  { id: 'V', nombre: 'Cargo Variable' },
  { id: 'A', nombre: 'Cargo AO&M' }
];

const TIPOS_UNIDADES_MEDIDA = {
  MONEDA: 'MONEDA',
  CANTIDAD: 'CANTIDAD',
  PRECIO_CAPACIDAD: 'PRECIO_CAPACIDAD'
};

class GestionTramo extends Component {

  calculadora = null;

  state = {
    mostrarModalTramos: false,
    unidadesMedida: [],
    idTramo: null,
    nombreTramo: '',
    porcentajeFijo: 0,
    porcentajeVariable: 0,
    codigoGestor: '',
    cargos: [],
    consultasTerminadas: false,

    // Estado de la aplicacion
    mostrarBotonCancelarCargo: false,

    // Campos para el Cargo actual
    idCargoActual: null,
    tipoCargoActual: '-1',
    nombreCargoActual: '',
    valorCargoActual: '',
    unidadMedida: '-1',
    porcentajeFijoCargo: '',
    porcentajeVariableCargo: '',
  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
    axios.post(RUTAS_API.PARAMETRIZACION.UNIDADES_MEDIDA.CONSULTAR_POR_ESTRUCTURA, { criterio: '', 'categoria': TIPOS_UNIDADES_MEDIDA.PRECIO_CAPACIDAD })
      .then(respuesta => {
        if (respuesta.data.codigo >= 0) {
          this.setState({ unidadesMedida: formatearArray(respuesta.data.datos), consultasTerminadas: true });
        }
      });
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
      mostrarBotonCancelarCargo: false,

      idTramo: null,
      nombreTramo: '',
      porcentajeFijo: 0,
      porcentajeVariable: 0,
      codigoGestor: '',
      cargos: [],
      idCargoActual: null,
      tipoCargoActual: '-1',
      nombreCargoActual: '',
      valorCargoActual: '',
      unidadMedidaCargoFijo: '-1',
      unidadMedidaCargoVariable: '-1',
      unidadMedidaCargoAOM: '-1',
      porcentajeFijoCargo: '',
      porcentajeVariableCargo: '',

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
      { texto: 'Guardar', callback: this.guardarTramo },
      { texto: 'Consultar', callback: this.consultarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de procesar los cargos
   * @param {Array} cargos Cargos agregados y consultados
   * @returns {Array}
   */
  procesarCargos = (cargos) => {
    cargos.forEach(cargo => {
      if (typeof cargo.trcaIderegistro === 'string') {
        cargo.trcaIderegistro = null
      }
      cargo.uniIdemedidafijo.uniPropiedad = JSON.stringify(cargo.uniIdemedidafijo.uniPropiedad);
      cargo.uniIdemedidaoym.uniPropiedad = JSON.stringify(cargo.uniIdemedidaoym.uniPropiedad);
      cargo.uniIdemedidavariable.uniPropiedad = JSON.stringify(cargo.uniIdemedidavariable.uniPropiedad);
    });
    return limpiarJson(cargos);
  };
  /**
   * Método encargado de guardar los datos de la entidad
   * @returns {bool}
   */
  guardarTramo = () => {
    const validacion = this.validarCabecera();
    if (!validacion) {
      return false;
    }

    const tramoGuardar = {
      trmIderegistro: this.state.idTramo,
      trmNombre: this.state.nombreTramo,
      trmCodgestor: this.state.codigoGestor,
      listaCargos: this.procesarCargos(this.state.cargos)
    }

    axios.post(RUTAS_API.PARAMETRIZACION.TRAMOS.GUARDAR_TRAMO, tramoGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de abrir la ventana modal del boton de consultar
   */
  consultarEntidad = () => {
    const componente = (<RConsultaTramos esModal seleccionarEntidad={this.cargarDatos} />);
    this.props.mostrarProgramaModal(componente);
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
   * Método encargado de llenar el formulario con los datos del treamo seleccionado
   */
  cargarDatos = (tramo) => {
    this.setState({
      idTramo: tramo.trmIderegistro,
      nombreTramo: tramo.trmNombre,
      codigoGestor: tramo.trmCodgestor,
      porcentajeFijo: tramo.trmPorcentajefijo,
      porcentajeVariable: tramo.trmPorcentajevariable,
      cargos: formatearArray(tramo.listaCargos),
      mostrarBotonCancelarCargo: false,
      tipoCargoActual: '-1',
      nombreCargoActual: '',
      valorCargoActual: '',
      unidadMedida: '-1'
    });
  };

  /**
   * Método encargado de generar los botones de editar y borrar del componente Tabla
   * @param {Object} props Propiedades del componente Tabla
   * @param {Component} contexto Contexto del componente GestionTramo
   * @returns {Object}
   */
  renderCeldaAcciones = (props, contexto) => {
    return (
      <div className='text-center'>
        <a href='#' className='gestion-tramos__link-tabla' onClick={(evento) => {
          Util.detenerEvento(evento);
          contexto.editarCargo.call(contexto, props.row._original);
        }}>Editar</a>

        <a href='#' className='gestion-tramos__link-tabla' onClick={(evento) => {
          Util.detenerEvento(evento);
          contexto.borrarCargo.call(contexto, props.row._original);
        }}>
          Borrar
        </a>
      </div>
    );
  };

  /**
   * Método encargado de llenar el formulario con los datos del cargo seleccionado
   */
  editarCargo = (cargo) => {
    this.setState({
      idCargoActual: cargo.trcaIderegistro,
      valorCargoFijo: cargo.trcaCargofijo,
      valorCargoVariable: cargo.trcaCargovariable,
      valorCargoAOM: cargo.trcaCargoaoym,
      unidadMedidaCargoFijo: cargo.uniIdemedidafijo.uniIderegistro,
      unidadMedidaCargoVariable: cargo.uniIdemedidavariable.uniIderegistro,
      unidadMedidaCargoAOM: cargo.uniIdemedidaoym.uniIderegistro,
      porcentajeFijoCargo: cargo.trcaPorcentajefijo,
      porcentajeVariableCargo: cargo.trcaPorcentajevariable,
      mostrarBotonCancelarCargo: true
    })
  };

  /**
   * Método encargado de eliminar el cargo seleccionado
   * @param {Object} cargo Datos del cargo seleccionado
   */
  borrarCargo = (cargo) => {
    const index = this.state.cargos.findIndex(a => a.trcaIderegistro === cargo.trcaIderegistro);
    let nuevosCargos = [...this.state.cargos];
    nuevosCargos.splice(index, 1);
    this.setState({ cargos: [...nuevosCargos] });
  };

  /**
   * Método encargado de obtener las columnas del componente Tabla
   * @returns {Object}
   */
  obtenerColumnas = () => {
    const contexto = this;
    return [
      {
        Header: 'Cargos',
        columns: [
          {
            Header: 'Acción',
            accessor: 'trcaIderegistro',
            Cell: (props) => contexto.renderCeldaAcciones(props, contexto)
          },
          {
            Header: 'Cargo Fijo',
            accessor: 'trcaCargofijo',
          },
          {
            Header: 'Cargo Variable',
            accessor: 'trcaCargovariable'
          },
          {
            Header: 'Cargo AO&M',
            accessor: 'trcaCargoaoym'
          },
          {
            Header: 'Porcentaje Fijo',
            accessor: 'trcaPorcentajefijo'
          },
          {
            Header: 'Porcentaje Variable',
            accessor: 'trcaPorcentajevariable'
          }
        ]
      }
    ];
  };

  /**
   * Método encargado de obtener el nombre de la unidad de medida del cargo
   * @returns {String}
   */
  obtenerTextoUnidadMedida = (props) => {
    const idUnidadMedida = parseInt(props.original.uniIdemedida.uniIderegistro);
    const unidad = this.state.unidadesMedida.find(u => u.uniIderegistro === idUnidadMedida).uniNombre1 || '';
    return unidad;
  };


  /**
   * Método encargado de validar los campos del formulario agregar cargos
   * @returns {bool}
   */
  validarCargo = () => {
    const { valorCargoFijo, valorCargoVariable, valorCargoAOM, unidadMedidaCargoFijo, unidadMedidaCargoVariable, unidadMedidaCargoAOM, porcentajeFijoCargo, porcentajeVariableCargo } = this.state;

    if (isNaN(valorCargoFijo)) {
      this.props.mostrarAlerta('Error', 'Debe ingresar el valor cargo fijo');
      return false;
    }

    if (isNaN(valorCargoVariable)) {
      this.props.mostrarAlerta('Error', 'Debe ingresar el valor cargo variable');
      return false;
    }

    if (isNaN(valorCargoAOM)) {
      this.props.mostrarAlerta('Error', 'Debe ingresar el valor cargo AO&M');
      return false;
    }

    if (isNaN(porcentajeFijoCargo)) {
      this.props.mostrarAlerta('Error', 'Debe ingresar el porcentaje fijo del cargo');
      return false;
    }

    if (porcentajeFijoCargo < 0 || porcentajeFijoCargo > 100) {
      this.props.mostrarAlerta('Error', 'El porcentaje fijo del cargo debe estar entre 0 y 100');
      return false;
    }

    if (isNaN(porcentajeVariableCargo)) {
      this.props.mostrarAlerta('Error', 'Debe ingresar el porcentaje variable del cargo');
      return false;
    }

    if (porcentajeVariableCargo < 0 || porcentajeVariableCargo > 100) {
      this.props.mostrarAlerta('Error', 'El porcentaje variable del cargo debe estar entre 0 y 100');
      return false;
    }

    if (parseFloat(porcentajeFijoCargo) + parseFloat(porcentajeVariableCargo) !== 100) {
      this.props.mostrarAlerta('Error', 'La sumatoria del porcentaje fijo y el porcentaje variable debe ser exactamente igual a 100%.');
      return false;
    }

    if (unidadMedidaCargoFijo === '-1') {
      this.props.mostrarAlerta('Error', 'Debe seleccionar una unidad de medidad para cargo fijo para continuar');
      return false;
    }

    if (unidadMedidaCargoVariable === '-1') {
      this.props.mostrarAlerta('Error', 'Debe seleccionar una unidad de medidad para cargo variable para continuar');
      return false;
    }

    if (unidadMedidaCargoAOM === '-1') {
      this.props.mostrarAlerta('Error', 'Debe seleccionar una unidad de medidad para cargo AO&M para continuar');
      return false;
    }

    return true;
  };

  /**
   * Valida la cabecera del formulario.
   * @returns {Boolean}
   */
  validarCabecera = () => {
    if (this.state.codigoGestor == '') {
      this.props.mostrarAlerta('Error', 'Debe ingresar el código gestor.');
      return false;
    }
    if (this.state.nombreTramo == '') {
      this.props.mostrarAlerta('Error', 'Debe seleccionar el tramo.');
      return false;
    }
    if (!Util.validarArreglo(this.state.cargos)) {
      this.props.mostrarAlerta('Error', 'Debe seleccionar los cargos.');
      return false;
    }
    return true;
  };

  /**
   * Método encargado de guardar los datos del cargo ingresado
   * @returns {bool}
   */
  guardarCargo = () => {
    if (!this.validarCargo()) {
      return;
    }

    let nuevosCargos = [...this.state.cargos];
    const objeto = {
      trcaCargofijo: this.state.valorCargoFijo,
      trcaCargovariable: this.state.valorCargoVariable,
      trcaCargoaoym: this.state.valorCargoAOM,
      trcaPorcentajefijo: this.state.porcentajeFijoCargo,
      trcaPorcentajevariable: this.state.porcentajeVariableCargo,
      uniIdemedidavariable: { uniIderegistro: this.state.unidadMedidaCargoVariable },
      uniIdemedidafijo: { uniIderegistro: this.state.unidadMedidaCargoFijo },
      uniIdemedidaoym: { uniIderegistro: this.state.unidadMedidaCargoAOM },
    };

    if (this.state.idCargoActual) {
      const index = nuevosCargos.findIndex(a => a.trcaIderegistro === this.state.idCargoActual);
      nuevosCargos[index] = { ...nuevosCargos[index], ...objeto };
    } else {
      nuevosCargos.push({ trcaIderegistro: Util.generarIdControl('cargo_'), ...objeto });
    }

    this.setState({
      valorCargoVariable: '',
      valorCargoFijo: '',
      valorCargoAOM: '',
      unidadMedida: '-1',
      cargos: nuevosCargos,
      mostrarBotonCancelarCargo: false,
      porcentajeFijoCargo: 0,
      porcentajeVariableCargo: 0,
      idCargoActual: ''
    });
  };

  /**
   * Método encargado de limpiar los datos del cargo seleccionado
   */
  cancelarEdicionCargo = () => {
    this.setState({
      tipoCargoActual: '-1',
      nombreCargoActual: '',
      valorCargoActual: '',
      unidadMedidaCargoFijo: '-1',
      unidadMedidaCargoVariable: '-1',
      unidadMedidaCargoAOM: '-1',
      valorCargoFijo: '',
      valorCargoVariable: '',
      valorCargoAOM: '',
      mostrarBotonCancelarCargo: false,
      porcentajeFijoCargo: 0,
      porcentajeVariableCargo: 0,
      idCargoActual: ''
    });
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    if (!this.state.consultasTerminadas) {
      return <div>Cargando...</div>
    }
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />
        <div className="conf-general row mt-5">

          <Input
            label='Código Gestor:'
            value={this.state.codigoGestor}
            onChange={this.controlarCambio}
            name="codigoGestor"
          />

          <Input
            label='Nombre Tramo:'
            value={this.state.nombreTramo}
            onChange={this.controlarCambio}
            name="nombreTramo"
          />
        </div>

        <div>
          <h3 className='mb-3'>Agregar Cargos</h3>
          <div className='row container'>

            <TextoNumerico
              aceptaNegativos={false}
              cols={2}
              label='Cargo Fijo:'
              value={this.state.valorCargoFijo}
              onChange={this.controlarCambio}
              name="valorCargoFijo"
            />

            <Combo
              opciones={this.state.unidadesMedida}
              cols={2}
              textoPorDefecto='Seleccione'
              propTexto='uniNombre1'
              propValor='uniIderegistro'
              label='Unidad Medida:'
              name="unidadMedidaCargoFijo"
              value={this.state.unidadMedidaCargoFijo}
              onChange={this.controlarCambio}
            />

            <TextoNumerico
              aceptaNegativos={false}
              cols={2}
              label='Cargo Variable:'
              value={this.state.valorCargoVariable}
              onChange={this.controlarCambio}
              name="valorCargoVariable"
            />

            <Combo
              opciones={this.state.unidadesMedida}
              cols={2}
              textoPorDefecto='Seleccione'
              propTexto='uniNombre1'
              propValor='uniIderegistro'
              label='Unidad Medida:'
              name="unidadMedidaCargoVariable"
              value={this.state.unidadMedidaCargoVariable}
              onChange={this.controlarCambio}
            />

            <TextoNumerico
              aceptaNegativos={false}
              cols={2}
              label='Cargo AO&M:'
              value={this.state.valorCargoAOM}
              onChange={this.controlarCambio}
              name="valorCargoAOM"
            />

            <Combo
              opciones={this.state.unidadesMedida}
              cols={2}
              textoPorDefecto='Seleccione'
              propTexto='uniNombre1'
              propValor='uniIderegistro'
              label='Unidad Medida:'
              name="unidadMedidaCargoAOM"
              value={this.state.unidadMedidaCargoAOM}
              onChange={this.controlarCambio}
            />

            <TextoNumerico
              aceptaNegativos={false}
              label='% Fijo:'
              cols={2}
              value={this.state.porcentajeFijoCargo}
              onChange={this.controlarCambio}
              name="porcentajeFijoCargo"
            />

            <TextoNumerico
              aceptaNegativos={false}
              label='% Variable:'
              cols={2}
              value={this.state.porcentajeVariableCargo}
              onChange={this.controlarCambio}
              name="porcentajeVariableCargo"
            />
            <hr />
          </div>

          <div className='text-right pr-5'>
            {
              this.state.mostrarBotonCancelarCargo &&
              <button className='btn btn-danger' onClick={this.cancelarEdicionCargo}>Cancelar Edición</button>
            }
            <button
              className='btn btn-primary ml-3'
              onClick={this.guardarCargo}>
              {this.state.mostrarBotonCancelarCargo ? 'Editar Cargo' : 'Agregar Cargo'}
            </button>

          </div>

          {

            this.state.cargos.length > 0 &&
            <div className='mt-3'>
              <Tabla
                datos={this.state.cargos}
                columnas={this.obtenerColumnas()}
              />
            </div>
          }

        </div>

      </Fragment>
    );
  };

}

GestionTramo.propTypes = {
  history: PropTypes.object,
  mostrarAlerta: PropTypes.func,
  mostrarProgramaModal: PropTypes.func
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    mostrarAlerta,
    mostrarProgramaModal
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionTramo);

export { VistaRedux as RGestionTramo };
