import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, TextoNumerico, Util } from 'appfuture-react';
import axios from 'axios';
import { formatearArray, TIPOS_UNIDADES_MEDIDA } from '../../../../global/util_nominaciones';
import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { RConsultaPuntosSalida } from '../ConsultaPuntosSalida';
import { RConsultaTramos } from '../../tramos/ConsultaTramos';
import { RConsultaConfiguraciones } from '../../../configuracion/ConsultaConfiguraciones';
import { ConsultaPuntosEntrada } from './ConsultaPuntosEntrada';
import './GestionPuntosSalida.scss';
import { CLASES_UNIDADES } from '../../../../global/constantes';

const listaTipoCompresion = [
  { id: 'S', texto: 'Con Compresion' },
  { id: 'N', texto: 'Sin Compresion' },
];
const listaSino = [
  { id: 'S', texto: 'Si' },
  { id: 'N', texto: 'No' },
];
const tipoPoderCalorifico = [
  { id: 'S', valor: 'Superior' }
];

class GestionPuntosSalida extends Component {

  state = {
    // Datos de la entidad
    idPuntoSalida: null,
    nombrePuntoSalida: '',
    tipoPoderCalorifico: '',
    tipoMercado: '',
    porcentajeDemandaReguladaResidencial: '',
    porcentajeDemandaReguladaComercial: '',
    porcentajeDemandaReguladaIndustrial: '',
    identificacionBEO: '',
    identificacionGestor: '',
    mercadoRelevante: '',
    consultasTerminadas: false,
    tipoCompresion: '',
    unidadMedida: '',
    capacidad: '',
    demandaGNV: '',
    valorMaximoNominacion: '',
    unidadMedidaValorMaximo: '',
    calculaIndice: '',
    puntoCreg: '',
    cuentaBalance: '',
    tramosSeleccionados: [],
    puntosEntradaSeleccionados: [],
    listaUnidadMedida: [],
    // Estado de la aplicacion
    mostrarModalConsulta: false,
    mostrarModalPuntosEntrada: false,
    mostrarModalTramos: false,

    //tipos de mercadoCo
    tiposMercado: [],
    mercadosRelevantes: [],
  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }

    const peticiones = [
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { criterio: '', idClase: CLASES_UNIDADES.TIPO_DEMANDA_MERCADO }),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_TIPOS_MERCADO, { criterio: '' }),
      axios.post(RUTAS_API.PARAMETRIZACION.UNIDADES_MEDIDA.CONSULTAR_POR_ESTRUCTURA, { criterio: '', 'categoria': TIPOS_UNIDADES_MEDIDA.CANTIDAD })
    ];

    axios.all(peticiones)
      .then(axios.spread((tiposMercadoConsulta, mercadosRelevantesConsulta, unidadMedida) => {
        const datosAplicacion = {
          tiposMercado: [],
          mercadosRelevantes: [],
          listaUnidadMedida: [],
        };
        if (tiposMercadoConsulta.data.codigo >= 0) {
          datosAplicacion.tiposMercado = formatearArray(tiposMercadoConsulta.data.datos);
        }
        if (mercadosRelevantesConsulta.data.codigo >= 0) {
          datosAplicacion.mercadosRelevantes = formatearArray(mercadosRelevantesConsulta.data.datos);
        }
        if (unidadMedida.data.codigo >= 0) {
          datosAplicacion.listaUnidadMedida = formatearArray(unidadMedida.data.datos);
        }
        this.setState({ ...datosAplicacion, consultasTerminadas: true });
      }));
  };

  /**
   * Método encargado de limpiar la entidadEditar al momento se salir
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
      idPuntoSalida: null,
      nombrePuntoSalida: '',
      tipoPoderCalorifico: '',
      tipoMercado: '',
      porcentajeDemandaReguladaResidencial: '',
      porcentajeDemandaReguladaComercial: '',
      porcentajeDemandaReguladaIndustrial: '',
      identificacionBEO: '',
      identificacionGestor: '',
      mercadoRelevante: '',
      tipoCompresion: '',
      tramosSeleccionados: [],
      puntosEntradaSeleccionados: [],
      capacidad: '',
      unidadMedida: '',
      demandaGNV: '',
      valorMaximoNominacion: '',
      unidadMedidaValorMaximo: '',
      calculaIndice: '',
      puntoCreg: '',
      cuentaBalance: '',
      // Estado de la aplicacion
      mostrarModalConsulta: false,
      mostrarModalPuntosEntrada: false,
      mostrarModalTramos: false
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
    // Validaciones
    const {
      nombrePuntoSalida,
      tipoPoderCalorifico,
      tipoMercado,
      mercadoRelevante,
      porcentajeDemandaReguladaResidencial,
      porcentajeDemandaReguladaComercial,
      porcentajeDemandaReguladaIndustrial,
      identificacionBEO,
      identificacionGestor,
      tipoCompresion,
      unidadMedida,
      capacidad,
      demandaGNV,
      puntoCreg,
      valorMaximoNominacion,
      unidadMedidaValorMaximo,
      calculaIndice,
      cuentaBalance
    } = this.state;

    const strings = [
      nombrePuntoSalida,
      identificacionBEO,
      tipoPoderCalorifico,
      tipoMercado,
      porcentajeDemandaReguladaResidencial,
      porcentajeDemandaReguladaComercial,
      porcentajeDemandaReguladaIndustrial,
      identificacionGestor
    ];

    if (!Util.validarStringsRequeridos(strings)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Todos los datos son requeridos.' } };
    }

    if (tipoPoderCalorifico <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un Tipo de Poder Calorífico' } };
    }

    if (!tipoMercado || tipoMercado <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un Tipo de Demanda' } };
    }

    if (!mercadoRelevante || mercadoRelevante <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un Mercado Relevante' } };
    }

    if (tipoCompresion === '-1' || tipoCompresion === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar si el punto es con o sin compresión' } };
    }

    const residencial = parseFloat(porcentajeDemandaReguladaResidencial);
    const comercial = parseFloat(porcentajeDemandaReguladaComercial);
    const industrial = parseFloat(porcentajeDemandaReguladaIndustrial);
    const gnv = parseFloat(demandaGNV);

    if (isNaN(residencial) || isNaN(comercial) || isNaN(industrial) || isNaN(gnv)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Verifique los valores de los porcentajes de demanda, deben ser valores numéricos.' } };
    }

    if (residencial < 0 || comercial < 0 || industrial < 0 || gnv < 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Verifique los valores de los porcentajes de demanda, deben ser valores positivos.' } };
    }

    if ((residencial + comercial + industrial + gnv) !== 100) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'La sumatoría de los porcentajes de demanda debe ser exactamente 100%.' } };
    }

    if (!Util.validarArreglo(this.state.puntosEntradaSeleccionados) && !Util.validarArreglo(this.state.tramosSeleccionados)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos un punto de entrada o un tramo.' } };
    }

    if (capacidad === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar la capacidad del punto de salida.' } };
    }

    if (isNaN(capacidad)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'La capacidad del punto debe ser un valor númerico' } };
    }

    if (demandaGNV === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar el porcentaje de demanda GNV del punto de salida.' } };
    }

    if (unidadMedida <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar la unidad de medida para la capacidad' } };
    }

    if (puntoCreg == '' || puntoCreg == '-1' || puntoCreg == -1) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe especificar si el punto es CREG 114 o no' } };
    }

    if (puntoCreg == 'N') {
      if (valorMaximoNominacion == '') {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar el valor máximo de nominación' } };
      }
      if (unidadMedidaValorMaximo == '' || unidadMedidaValorMaximo == '-1' || unidadMedidaValorMaximo == -1) {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar la unidad de medida para el valor máximo' } };
      }
    }

    if (calculaIndice == '' || calculaIndice == '-1' || calculaIndice == -1) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe especificar si el punto calcula índice de pérdidas o no' } };
    }

    if (cuentaBalance == '' || cuentaBalance == '-1' || cuentaBalance == -1) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe especificar si el punto aplica para cuenta balance o no' } };
    }

    let tramos = this.state.tramosSeleccionados;
    if (tramos.length > 1) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El punto de salida solo debe tener un tramo asociado' } };
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

    const {
      idPuntoSalida,
      nombrePuntoSalida,
      tipoPoderCalorifico,
      tipoMercado,
      porcentajeDemandaReguladaResidencial,
      porcentajeDemandaReguladaComercial,
      porcentajeDemandaReguladaIndustrial,
      identificacionBEO,
      identificacionGestor,
      mercadoRelevante,
      tipoCompresion,
      capacidad,
      unidadMedida,
      demandaGNV,
      calculaIndice,
      cuentaBalance,
      puntoCreg,
      valorMaximoNominacion,
      unidadMedidaValorMaximo
    } = this.state;

    const entidadGuardar = {
      ptsaIderegistro: idPuntoSalida,
      ptsaNombre: nombrePuntoSalida,
      ptsaTipocalorifico: tipoPoderCalorifico,
      pstaCompresion: tipoCompresion,
      uniIdetipomercado: {
        uniIderegistro: tipoMercado
      },
      ptsaCreg114: puntoCreg,
      ptsaAplindperdidas: calculaIndice,
      ptsaAplictabalance: cuentaBalance,
      merIderelevante: mercadoRelevante,
      uniIdemedvlrmax: (puntoCreg == 'N') ? {
        uniIderegistro: unidadMedidaValorMaximo
      } : null,
      ptsaVlrmaxnom: (puntoCreg == 'N') ? valorMaximoNominacion : null,
      pstaRegresidencial: porcentajeDemandaReguladaResidencial,
      pstaRegcomercial: porcentajeDemandaReguladaComercial,
      pstaRegindustrial: porcentajeDemandaReguladaIndustrial,
      pstaCodigobeo: identificacionBEO,
      pstaCodigogestor: identificacionGestor,
      pstaCapacidad: new Number(capacidad),
      pstaDemandaporcentajegnv: demandaGNV,
      uniIdemedida: {
        uniIderegistro: parseInt(unidadMedida)
      },
      listaPuntosEntrada: this.obtenerListaPuntosEntradaGuardar(),
      listaTramos: this.obtenerListaTramosGuardar()
    }

    axios.post(RUTAS_API.PARAMETRIZACION.PUNTOS_SALIDA.GUARDAR_PUNTOS_SALIDA, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de generar un objeto con los identificadores de los puntos de entrada seleccionados
   * @returns {Object}
   */
  obtenerListaPuntosEntradaGuardar = () => {
    return this.state.puntosEntradaSeleccionados.map(a => (
      { uniIdepuntoentrada: { uniIderegistro: a.uniIderegistro } }
    ));
  };

  /**
   * Método encargado de generar un objeto con los identificadores de los tramos seleccionados
   * @returns {Object}
   */
  obtenerListaTramosGuardar = () => {
    return this.state.tramosSeleccionados.map(a => (
      { trmIderegistro: { trmIderegistro: a.trmIderegistro } }
    ));
  };

  /**
   * Método encargado de abrir la ventana modal del boton de consultar
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
   * Método encargado de abrir la ventana modal del boton consultar
   */
  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false
    });
  };

  /**
   * Método encargado de abrir la ventana modal de la consulta de puntos de entrada
   */
  abrirModalPuntosEntrada = () => {
    this.setState({
      mostrarModalPuntosEntrada: true
    });
  };

  /**
   * Método encargado de abrir la ventana modal de la consulta de tramos
   */
  abrirModalTramos = () => {
    this.setState({
      mostrarModalTramos: true
    });
  };

  /**
   * Método encargado de llenar el formulario con los datos consultados
   */
  cargarDatos = (entidad) => {
    this.setState({
      mostrarModalConsulta: false,

      // Cargar datos de la entidad
      idPuntoSalida: entidad.ptsaIderegistro,
      nombrePuntoSalida: entidad.ptsaNombre,
      tipoPoderCalorifico: entidad.ptsaTipocalorifico,
      tipoMercado: entidad.uniIdetipomercado.uniIderegistro,
      porcentajeDemandaReguladaResidencial: entidad.pstaRegresidencial,
      porcentajeDemandaReguladaComercial: entidad.pstaRegcomercial,
      porcentajeDemandaReguladaIndustrial: entidad.pstaRegindustrial,
      identificacionBEO: entidad.pstaCodigobeo,
      identificacionGestor: entidad.pstaCodigogestor,
      mercadoRelevante: entidad.merIderelevante,
      tipoCompresion: entidad.pstaCompresion,
      puntosEntradaSeleccionados: entidad.listaPuntosEntrada.map(a => a.uniIdepuntoentrada),
      tramosSeleccionados: entidad.listaTramos.map(a => a.trmIderegistro),
      capacidad: entidad.pstaCapacidad,
      unidadMedida: entidad.uniIdemedida.uniIderegistro,
      demandaGNV: entidad.pstaDemandaporcentajegnv,
      puntoCreg: entidad.ptsaCreg114,
      cuentaBalance: entidad.ptsaAplictabalance,
      calculaIndice: entidad.ptsaAplindperdidas,
      valorMaximoNominacion: (entidad.ptsaVlrmaxnom) ? entidad.ptsaVlrmaxnom : '',
      unidadMedidaValorMaximo: (Object.keys(entidad.uniIdemedvlrmax).length > 0) ? entidad.uniIdemedvlrmax.uniIderegistro : ''
    });
  };

  /**
   * Método encargado agregar los tramos seleccionados
   * @param {Object} tramos Tramos seleccionados por el usuario
   */
  onSeleccionarTramos = (tramos) => {
    this.setState({
      mostrarModalTramos: false,
      tramosSeleccionados: [...tramos]
    });
  };

  /**
   * Método encargado agregar los puntos de entrada seleccionados
   * @param {Object} puntosEntrada Puntos de entrada seleccionados por el usuario
   */
  onSeleccionarPuntosEntrada = (puntosEntrada) => {
    this.setState({
      mostrarModalPuntosEntrada: false,
      puntosEntradaSeleccionados: [...puntosEntrada]
    });
  };

  /**
   * Método encargado de eliminar el punto de entrada seleccionado
   * @param {number} posicion Posición del punto de entrada que se desea eliminar
   */
  eliminarPuntoEntrada = (posicion) => {
    const lista = [...this.state.puntosEntradaSeleccionados];
    lista.splice(posicion, 1);
    this.setState({ puntosEntradaSeleccionados: lista });
  };

  /**
   * Método encargado de mostrar los puntos de entrada seleccionados
   * @returns {Array}
   */
  renderPuntosEntrada = () => {
    return (
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Punto de entrada</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {
            this.state.puntosEntradaSeleccionados.map((dato, index) => {
              return (
                <tr key={"pentrada" + dato.uniIderegistro}>
                  <td>{dato.uniNombre1}</td>
                  <td><button className='btnEliminar' onClick={() => {
                    this.eliminarPuntoEntrada(index)
                  }}>X</button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  };

  /**
   * Método encargado de eliminar el tramo seleccionado
   * @param {number} posicion Posición del tramo que se desea eliminar
   */
  eliminarTramo = (posicion) => {
    const lista = [...this.state.tramosSeleccionados];
    lista.splice(posicion, 1);
    this.setState({ tramosSeleccionados: lista });
  };

  /**
   * Método encargado de mostrar los tramos seleccionados
   * @returns {Array}
   */
  renderTramos = () => {
    return (
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Tramo</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {
            this.state.tramosSeleccionados.map((dato, index) => {
              return (
                <tr key={"tramo_" + dato.trmIderegistro}>
                  <td>{dato.trmNombre}</td>
                  <td><button className='btnEliminar' onClick={() => {
                    this.eliminarTramo(index)
                  }}>X</button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    );
  };

  /**
   * Método encargado de mostrar el formulario
	 * @returns {Object}
   */
  render() {
    if (!this.state.consultasTerminadas) {
      return (<p className='text-center'>Cargando...</p>);
    }
    return (
      <Fragment>
        <div className='d-flex justify-content-center'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>

        <div className='conf-general row mt-5'>
          <Input
            label='Nombre:'
            value={this.state.nombrePuntoSalida}
            onChange={this.controlarCambio}
            name='nombrePuntoSalida'
          />
          <Combo
            opciones={tipoPoderCalorifico}
            propTexto='valor'
            propValor='id'
            label='Tipo Poder Calorífico:'
            name='tipoPoderCalorifico'
            value={this.state.tipoPoderCalorifico}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={this.state.tiposMercado}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Tipo de Demanda:'
            name='tipoMercado'
            value={this.state.tipoMercado}
            onChange={this.controlarCambio}
          />
          <TextoNumerico
            aceptaNegativos={false}
            label='% Dem. Reg. Residencial:'
            value={this.state.porcentajeDemandaReguladaResidencial}
            onChange={this.controlarCambio}
            name='porcentajeDemandaReguladaResidencial'
          />
          <TextoNumerico
            aceptaNegativos={false}
            label='% Dem. Reg. Comercial:'
            value={this.state.porcentajeDemandaReguladaComercial}
            onChange={this.controlarCambio}
            name='porcentajeDemandaReguladaComercial'
          />
          <TextoNumerico
            aceptaNegativos={false}
            label='% Dem. Reg. Industrial:'
            value={this.state.porcentajeDemandaReguladaIndustrial}
            onChange={this.controlarCambio}
            name='porcentajeDemandaReguladaIndustrial'
          />
          <TextoNumerico
            aceptaDecimales={false}
            aceptaNegativos={false}
            label='% Dem. GNV:'
            value={this.state.demandaGNV}
            onChange={this.controlarCambio}
            name='demandaGNV'
          />
          <Input
            label='Identificación BEO:'
            value={this.state.identificacionBEO}
            onChange={this.controlarCambio}
            name='identificacionBEO'
          />
          <Input
            label='Identificación Gestor:'
            value={this.state.identificacionGestor}
            onChange={this.controlarCambio}
            name='identificacionGestor'
          />
          <Combo
            opciones={this.state.mercadosRelevantes}
            propTexto='merNombre'
            propValor='merIderegistro'
            label='Mercado Relevante:'
            name='mercadoRelevante'
            value={this.state.mercadoRelevante}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={listaTipoCompresion}
            propTexto='texto'
            propValor='id'
            label='Tipo:'
            name='tipoCompresion'
            value={this.state.tipoCompresion}
            onChange={this.controlarCambio}
          />
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='Capacidad:'
            value={this.state.capacidad}
            onChange={this.controlarCambio}
            name='capacidad'
          />
          <Combo
            opciones={this.state.listaUnidadMedida}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Unidad Medida:'
            name='unidadMedida'
            value={this.state.unidadMedida}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={listaSino}
            propTexto='texto'
            propValor='id'
            label='Calcula Índice de Pérdidas:'
            name='calculaIndice'
            value={this.state.calculaIndice}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={listaSino}
            propTexto='texto'
            propValor='id'
            label='Punto CREG 114'
            name='puntoCreg'
            value={this.state.puntoCreg}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={listaSino}
            propTexto='texto'
            propValor='id'
            label='Cuenta Balance'
            name='cuentaBalance'
            value={this.state.cuentaBalance}
            onChange={this.controlarCambio}
          />
          {this.state.puntoCreg == 'N' &&
            <Fragment>
              <TextoNumerico
                aceptaDecimales={false}
                aceptaNegativos={false}
                label='Valor Máximo de Nominación:'
                value={this.state.valorMaximoNominacion}
                onChange={this.controlarCambio}
                name='valorMaximoNominacion'
              />
              <Combo
                opciones={this.state.listaUnidadMedida}
                propTexto='uniNombre1'
                propValor='uniIderegistro'
                label='Unidad Medida Valor Máximo de la Nominación:'
                name='unidadMedidaValorMaximo'
                value={this.state.unidadMedidaValorMaximo}
                onChange={this.controlarCambio}
              />
            </Fragment>
          }
        </div>

        <div className='row mt-2'>
          <div className='col-6'>
            <p><b>Puntos de Entrada {this.state.puntosEntradaSeleccionados.length > 0 ? ` (${this.state.puntosEntradaSeleccionados.length})` : ''}</b></p>
            <button className='btn btn-primary' onClick={this.abrirModalPuntosEntrada}>Seleccionar</button>
            <div className='pt-3'>
              {this.state.puntosEntradaSeleccionados.length > 0 &&
                this.renderPuntosEntrada()
              }
            </div>
          </div>
          <div className='col-6'>
            <p><b>Tramos {this.state.tramosSeleccionados.length > 0 ? ` (${this.state.tramosSeleccionados.length})` : ''}</b></p>
            <button className='btn btn-primary' onClick={this.abrirModalTramos}>Seleccionar</button>
            <div className='pt-3'>
              {this.state.tramosSeleccionados.length > 0 &&
                this.renderTramos()
              }
            </div>
          </div>
        </div>

        <VentanaModal
          mostrar={this.state.mostrarModalConsulta}
          titulo='Consulta de Puntos de Salida'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaPuntosSalida esModal seleccionarEntidad={this.cargarDatos} />
        </VentanaModal>

        <VentanaModal
          mostrar={this.state.mostrarModalPuntosEntrada}
          titulo='Seleccionar Puntos de Entrada'
          cerrarModal={() => this.setState({ mostrarModalPuntosEntrada: false })}>
          <ConsultaPuntosEntrada
            esModal
            bloquearTipoConfiguracion
            seleccionMultiple
            entidadesSeleccionadas={this.state.puntosEntradaSeleccionados}
            seleccionarEntidades={this.onSeleccionarPuntosEntrada}
          />
        </VentanaModal>

        <VentanaModal
          mostrar={this.state.mostrarModalTramos}
          titulo='Seleccionar Tramos'
          cerrarModal={() => this.setState({ mostrarModalTramos: false })}>
          <RConsultaTramos
            esModal
            seleccionMultiple
            entidadesSeleccionadas={this.state.tramosSeleccionados}
            seleccionarEntidades={this.onSeleccionarTramos}
          />
        </VentanaModal>

      </Fragment>
    );
  };
}

GestionPuntosSalida.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionPuntosSalida);

export { VistaRedux as RGestionPuntosSalida };
