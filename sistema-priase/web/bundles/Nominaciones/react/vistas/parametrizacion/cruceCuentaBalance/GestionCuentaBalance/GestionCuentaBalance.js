import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, VentanaModal, Util, Fecha, TextoNumerico, typeOf } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import { formatearArray } from '../../../../global/util_nominaciones';
import { ESTADOS_CRUCE, TIPOS_NEGOCIO } from '../../../../global/constantes';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { get as getProp } from 'object-path';
import './GestionCuentaBalance.scss';
import { toast } from 'react-toastify';
import { RGenerarProvision } from './componentes/GenerarProvision';
import { RConsultaCruce } from './componentes/ConsultarCruce';
import { RConsultaContratos } from '../../../contratos/ConsultaContratos';

class GestionCuentaBalance extends Component {

  state = {
    // Datos de la entidad
    periodo: '',
    contrato: null,
    puntoPositivo: '',
    puntoNegativo: '',
    desbalance: '',
    totalCruzado: 0,
    nuevoDesbalance: '',
    idCuenta: null,
    tramo: '',
    puntoSalidaNombre: '',
    //Listas
    listaPuntosPositivos: [],
    listaPuntosNegativos: [],
    //Estados
    modalContratos: false,
    modalConsulta: false,
    provision: false,
    estadoCruce: ''

  };

  /**
   * @method
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
  };

  /**
   * @method
   * Método encargado de limpiar el formulario al momento de cambiar de interfaz
   */
  componentWillUnmount() {
    this.limpiarFormulario();
  };

  /**
   * @method
   * Método encargado de generar los botones del formulario
   * @returns {Object}
   */
  obtenerFunciones = () => {
    let botones = [];
    if (this.state.estadoCruce == ESTADOS_CRUCE.APROBADO) {
      botones.push({ texto: 'Gen. Provisión', callback: this.actualizarProvisionBoton });
      botones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
      return botones;
    }
    if (this.state.estadoCruce == '') {
      botones.push({ texto: 'Guardar', callback: this.guardarEntidad });
    }
    if (this.state.estadoCruce == ESTADOS_CRUCE.PENDIENTE) {
      botones.push({ texto: 'Aprobar', callback: () => { this.mostrarAlertaConfirmar('A') } });
      botones.push({ texto: 'Rechazar', callback: () => { this.mostrarAlertaConfirmar('R') } });
    }
    botones.push({ texto: 'Consultar', callback: this.consultarEntidad });
    botones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });

    return botones;
  };

  /**
   * @method
   * Método encargado de abrir el modal para consultar cruces
   */
  consultarEntidad = () => {
    this.setState({ modalConsulta: true });
  }

  /**
   * @method
   * Método encargado de mostrar la alerta para cambiar de estado al cruce
   * @param {String} estado Estado al que se cambiara el cruce
   */
  mostrarAlertaConfirmar = (estado) => {
    if (estado == 'R') {
      this.props.mostrarAlerta('Confirmar', 'Se actualizará el estado del cruce, ¿Desea continuar?', [
        { clase: 'btn btn-primary', callback: this.rechazar, texto: 'Sí' },
        { clase: 'btn btn-default', texto: 'No' },
      ]);
      return;
    }
    this.props.mostrarAlerta('Confirmar', 'Se actualizará el estado del cruce, ¿Desea continuar?', [
      { clase: 'btn btn-primary', callback: this.aprobar, texto: 'Sí' },
      { clase: 'btn btn-default', texto: 'No' },
    ]);

  }

  /**
   * @method
   * Método encargado de aprobar el cruce guardado
   */
  aprobar = () => {
    const { idCuenta } = this.state;
    axios.post(RUTAS_API.CRUCE_CUENTA_BALANCE.APROBAR, { idCruce: idCuenta })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  }

  /**
   * @method
   * Método encargado de rechazar el cruce guardado
   */
  rechazar = () => {
    const { idCuenta } = this.state;
    axios.post(RUTAS_API.CRUCE_CUENTA_BALANCE.RECHAZAR, { idCruce: idCuenta })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  }

  /**
   * @method
   * Método encargado de cambiar el estado del formulario
   */
  actualizarProvisionBoton = () => {
    this.setState({ provision: true })
  }

  /**
   * @method
   * Método encargado de cambiar el estado del formulario
   * @param {Object} nuevoEstado Nuevo estado de la provisión
   */
  actualizarProvision = (nuevoEstado) => {
    this.setState(nuevoEstado);
  }

  /**
   * @method
   * Método encargado de cerrar la ventana del boton de consulta
   */
  abrirCerrarModal = () => {
    this.setState({
      modalContratos: false,
      modalConsulta: false
    });
  };

  /**
   * @method
   * Método encargado de limpiar los campos del formulario
   */
  limpiarFormulario = () => {
    this.setState({
      periodo: '',
      contrato: null,
      puntoPositivo: '-1',
      puntoNegativo: '-1',
      desbalance: '',
      totalCruzado: 0,
      nuevoDesbalance: '',
      tramo: '',
      idCuenta: null,
      provision: false,
      modalContratos: false,
      modalConsulta: false,
      estadoCruce: '',
      listaPuntosPositivos: [],
      listaPuntosNegativos: [],
      puntoSalidaNombre: '',
    });
  };

  /**
   * @method
   * Método encargado de validar las variables necesarias para guardar
   * @returns {Object}
   */
  validarFormulario = () => {
    const { puntoPositivo, listaPuntosNegativos, contrato, periodo } = this.state;
    const lista = listaPuntosNegativos.filter(p => p.seleccionado);
    if (periodo == '') {
      return { respuesta: false, mensaje: { mensaje: 'Debe seleccionar un periodo', titulo: 'Datos Incompletos' } };
    }

    if (contrato == null) {
      return { respuesta: false, mensaje: { mensaje: 'Debe seleccionar un contrato', titulo: 'Datos Incompletos' } };
    }

    if (puntoPositivo == '' || puntoPositivo == '-1') {
      return { respuesta: false, mensaje: { mensaje: 'Debe seleccionar un punto de salida positivo', titulo: 'Datos Incompletos' } };
    }

    if (!Util.validarArreglo(lista)) {
      return { respuesta: false, mensaje: { mensaje: 'Debe agregar al menos un punto negativo ', titulo: 'Datos Incompletos' } };
    }

    for (let index = 0; index < lista.length; index++) {
      const punto = lista[index];
      if (parseFloat(punto.valorCruzado) > Math.abs(punto.desbalance.cantidad)) {
        return { respuesta: false, mensaje: { mensaje: 'El valor a cruzar debe ser menor al saldo disponible en todos los puntos', titulo: 'Error' } };
      }
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de generar un objeto para guardar el cruce o cruces
   * @returns {Object}
   */
  obtenerObjetoGuardar = () => {
    const { listaPuntosNegativos, listaPuntosPositivos, periodo, contrato, puntoPositivo, idCuenta, totalCruzado, nuevoDesbalance } = this.state;
    const unidad = listaPuntosPositivos.find(p => p.puntoSalida.ptsaIderegistro == puntoPositivo);
    const objetoGuardar = {
      ccbIderegistro: idCuenta,
      cntIderegistro: {
        cntIderegistro: contrato.cntIderegistro
      },
      ptsaIderegistro: {
        ptsaIderegistro: puntoPositivo
      },
      ccbTotdesbalance: nuevoDesbalance,
      ccbCantidad: totalCruzado,
      uniIdemedida: {
        uniIderegistro: unidad.desbalance.unidadMedida.uniIderegistro
      },
      periodo: periodo
    }
    objetoGuardar.detalles = listaPuntosNegativos.filter(p => p.seleccionado).map(p => {
      return {
        ptsaIderegistro: {
          ptsaIderegistro: p.puntoSalida.ptsaIderegistro
        },
        dccbTotdesbalance: p.desbalance.cantidad,
        dccbCantidad: p.valorCruzado,
        uniIdemedida: {
          uniIderegistro: p.desbalance.unidadMedida.uniIderegistro
        },
      }
    });
    return objetoGuardar;
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

    const entidadGuardar = this.obtenerObjetoGuardar();
    axios.post(RUTAS_API.CRUCE_CUENTA_BALANCE.GUARDAR, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * @method
   * Método encargado de consultar los puntos de salida por contrato
   * @param {Number} idContrato Identificador del contrato seleccionado
   */
  consultarPuntosSalida = (idContrato) => {
    axios.post(RUTAS_API.CRUCE_CUENTA_BALANCE.CONSULTAR_PUNTOS_POSITIVOS, { idContrato: idContrato, periodo: this.state.periodo })
      .then(respuesta => {
        this.setState({ listaPuntosPositivos: formatearArray(respuesta.data.datos) });
      });
  };

  /**
   * @method
   * Método encargado de cargar los datos de la entidad en la variable contrato
   * @param {Object} entidad Entidad seleccioanda
   */
  onSeleccionarContrato = (entidad) => {
    this.consultarPuntosSalida(entidad.cntIderegistro);
    this.setState({
      contrato: entidad,
      modalContratos: false,
    });
  };

  /**
   * @method
   * Método encargado de ejecutar las consultas necesarias para mostrar los datos
   * @param {Object} entidad Datos del cruce seleccionado
   */
  ejecutarConsultas = (entidad) => {
    const periodo = entidad.ctbIderegistro.ctbFechagen.substr(0, 7);
    const peticiones = [
      axios.post(RUTAS_API.CRUCE_CUENTA_BALANCE.CONSULTAR_PUNTOS_POSITIVOS, { idContrato: entidad.cntIderegistro.cntIderegistro, periodo: periodo }),
      axios.post(RUTAS_API.CRUCE_CUENTA_BALANCE.CONSULTAR_PUNTOS_NEGATIVOS, { periodo: periodo, idTramo: entidad.ptsaIderegistro.tramo.trmIderegistro }),
    ]
    axios.all(peticiones)
      .then(axios.spread((puntosPositivos, puntosNegativos) => {
        const datosAplicacion = {
          listaPuntosPositivos: [],
          listaPuntosNegativos: [],
          puntoPositivo: ''
        };
        if (puntosPositivos.data.codigo > 0) {
          datosAplicacion.listaPuntosPositivos = formatearArray(puntosPositivos.data.datos);
          datosAplicacion.puntoPositivo = entidad.ptsaIderegistro.ptsaIderegistro;
        }
        if (puntosNegativos.data.codigo > 0) {
          datosAplicacion.listaPuntosNegativos = formatearArray(puntosNegativos.data.datos);
        }
        this.setState({ ...datosAplicacion }, this.consultarDetalle(entidad));
      }));
  }

  /**
   * @method
   * Método encargado de selecionar los puntos de salida
   * @param {Array} puntosSeleccionados Puntos negativos del cruce
   */
  seleccionPuntosSalida = (puntosSeleccionados) => {
    const lista = puntosSeleccionados.map(puntoNegativo => {
      puntoNegativo.seleccionado = true;
      puntoNegativo.puntoSalida = puntoNegativo.ptsaIderegistro;
      puntoNegativo.valorCruzado = puntoNegativo.dccbCantidad;
      puntoNegativo.desbalance = {
        cantidad: puntoNegativo.dccbTotdesbalance,
        unidadMedida: puntoNegativo.uniIdemedida
      };
      puntoNegativo.nuevoSaldo = (puntoNegativo.dccbCantidad - Math.abs(puntoNegativo.dccbTotdesbalance));
      return puntoNegativo;
    });
    return lista;
  }

  /**
   * @method
   * Método encargado de consultar los puntos negativos seleccionados
   * @param {Object} entidad Datos del cruce seleccionado
   */
  consultarDetalle = (entidad) => {
    axios.post(RUTAS_API.CRUCE_CUENTA_BALANCE.CONSULTAR_DETALLE, { idCruce: entidad.ccbIderegistro })
      .then(respuesta => {
        this.setState({ listaPuntosNegativos: this.seleccionPuntosSalida(respuesta.data.datos) });
      });
  }

  /**
   * @method
   * Método encargado de llenar los datos con el cruce seleccionado
   * @param {Object} entidad Datos del cruce
   */
  onSeleccionarCruce = (entidad) => {
    this.setState({
      modalConsulta: false,
      periodo: entidad.ctbIderegistro.ctbFechagen.substr(0, 7),
      totalCruzado: entidad.ccbCantidad,
      contrato: entidad.cntIderegistro,
      desbalance: entidad.ccbTotdesbalance,
      idCuenta: entidad.ccbIderegistro,
      tramo: entidad.ptsaIderegistro.tramo.trmNombre,
      puntoSalidaNombre: entidad.ptsaIderegistro.ptsaNombre,
      nuevoDesbalance: (parseFloat(entidad.ccbTotdesbalance) - parseFloat(entidad.ccbCantidad)),
      estadoCruce: entidad.ccbEstado,
      puntoPositivo: entidad.ptsaIderegistro.ptsaIderegistro
    }, this.consultarDetalle(entidad));
  }

  /**
   * @method
   * Método encargado de obtener los puntos negativos de un punto de salida
   * @param {Object} puntoSalida Datos del punto de salida
   */
  consultarPuntosNegativos = (puntoSalida) => {
    const { periodo } = this.state;
    const objetoEnviar = {
      periodo: periodo,
      idTramo: puntoSalida.tramo.trmIderegistro,
    }
    axios.post(RUTAS_API.CRUCE_CUENTA_BALANCE.CONSULTAR_PUNTOS_NEGATIVOS, objetoEnviar)
      .then(respuesta => {
        this.setState({ listaPuntosNegativos: formatearArray(respuesta.data.datos) });
      });
  };

  /**
   * @method
   * Método encargado de procesar los datos del punto de salida
   * @param {Object} cambio Cambios a realizar en el state
   */
  procesarPuntoSalida = (cambio) => {
    const { listaPuntosPositivos } = this.state;
    const punto = listaPuntosPositivos.find(p => p.puntoSalida.ptsaIderegistro == cambio['puntoPositivo']);
    cambio.desbalance = getProp(punto.desbalance, 'cantidad', '');
    cambio.tramo = getProp(punto.tramo, 'trmNombre', '');
    punto.desbalanceCalculo = getProp(punto.desbalance, 'cantidad', '');
    this.consultarPuntosNegativos(punto);
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    if (this.state.idCuenta != null) {
      return;
    }
    let change = {};
    const control = evento.target;
    change[control.name] = control.value;
    if (control.name == 'puntoPositivo' && control.value != '-1') {
      this.procesarPuntoSalida(change);
    }
    if (control.name == 'puntoPositivo' && control.value == '-1') {
      change.desbalance = '';
      change.tramo = '';
      change.listaPuntosNegativos = [];
    }
    this.setState(change);
  };

  /**
   * @method
   * Método encargado de quitar los puntos de salida negativos
   * @param {Event} identificador Identificador del punto de salida
   */
  cambiarEstadoPunto = (identificador) => {
    if (this.state.idCuenta != null) {
      return;
    }
    this.calcularCruce(ESTADOS_CRUCE.ELIMINAR, identificador);
  }

  /**
   * @method
   * Método encargado de controlar el cambio del valor a cruzar del punto de salida
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambioValorCruzado = (evento) => {
    const { listaPuntosPositivos, puntoPositivo } = this.state;
    const puntoPositivoObjeto = listaPuntosPositivos.find(p => p.puntoSalida.ptsaIderegistro == puntoPositivo);
    const listaPuntosNegativos = [...this.state.listaPuntosNegativos];
    const control = evento.target;
    const idPuntoSalida = control.attributes['data-idSalida'].value;
    const index = listaPuntosNegativos.findIndex(p => p.puntoSalida.ptsaIderegistro == idPuntoSalida);
    listaPuntosNegativos[index].valorCruzado = control.value;
    let nuevoSaldo = listaPuntosNegativos[index].desbalance.cantidad;
    if (control.value != '') {
      nuevoSaldo = (listaPuntosNegativos[index].desbalance.cantidad + parseFloat(control.value));
    }
    listaPuntosNegativos[index].nuevoSaldo = nuevoSaldo;
    let totalCruzado = 0;
    listaPuntosNegativos.forEach(p => {
      if (p.seleccionado) {
        const valorCruzado = (p.valorCruzado == "") ? 0 : parseFloat(p.valorCruzado);
        totalCruzado += valorCruzado;
      }
    });
    totalCruzado = (isNaN(totalCruzado)) ? 0 : totalCruzado;
    const nuevoDesbalance = (puntoPositivoObjeto.desbalance.cantidad - totalCruzado);
    puntoPositivoObjeto.desbalanceCalculo = nuevoDesbalance;
    this.setState({
      listaPuntosNegativos: [...listaPuntosNegativos],
      totalCruzado: totalCruzado,
      nuevoDesbalance: nuevoDesbalance
    });
  }

  /**
   * Método encargado de mostrar la tabla con los tramos y puntos negativos agregados
   * @returns {Object}
   */
  renderTablaNegativos = () => {
    let desabilitado = false;
    if (this.state.idCuenta != null) {
      desabilitado = true;
    }
    const { listaPuntosNegativos } = this.state
    let lista = listaPuntosNegativos.filter(p => p.seleccionado);
    if (!Util.validarArreglo(lista)) {
      return (<div className='text-center'>No se ha Agregado ningun punto</div>);
    }
    return (
      <table className='table table-hover table-striped table-condensed labels-hidden mt-5'>
        <thead>
          <tr>
            <th>Punto de Salida</th>
            <th>Saldo</th>
            <th>Unidad de Medida</th>
            <th>Valor A Cruzar</th>
            <th>Nuevo Saldo</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {
            lista.map((dato, index) => {
              return (
                <tr key={getProp(dato.puntoSalida, 'ptsaIderegistro', '')}>
                  <td>{getProp(dato.puntoSalida, 'ptsaNombre', '')}</td>
                  <td>{getProp(dato.desbalance, 'cantidad', '')}</td>
                  <td>{getProp(dato.desbalance, 'unidadMedida.uniNombre1', '')}</td>
                  <td>{
                    <TextoNumerico
                      aceptaDecimales={true}
                      aceptaNegativos={false}
                      cols={12}
                      value={getProp(dato, 'valorCruzado', '')}
                      onChange={this.controlarCambioValorCruzado}
                      extra={{ 'data-idsalida': getProp(dato.puntoSalida, 'ptsaIderegistro', ''), disabled: desabilitado, readOnly: desabilitado }}
                      name='valorCruzado'
                    />
                  }
                  </td>
                  <td>{getProp(dato, 'nuevoSaldo', '')}</td>
                  <td>
                    <button
                      disabled={desabilitado}
                      className='btn-primary btn-buscador input-group-text'
                      onClick={() => {
                        this.cambiarEstadoPunto(getProp(dato.puntoSalida, 'ptsaIderegistro', ''))
                      }}><i className="fa fa-fw fa-minus"></i></button>
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );
  };

  /**
   * @method
   * Método encargado de limpiar el contrato
   */
  limpiarContrato = () => {
    if (this.state.idCuenta != null) {
      return;
    }
    this.setState({
      contrato: null,
      listaPuntosPositivos: [],
      listaPuntosNegativos: [],
      desbalance: '',
      totalCruzado: 0,
      nuevoDesbalance: '',
      tramo: ''
    });
  }

  /**
   * @method
   * Método encargado de abrir el modal de consultar contratos
   * @returns {Boolean}
   */
  abrirConsultaContratos = () => {
    if (this.state.idCuenta != null) {
      return;
    }
    if (this.state.periodo == '') {
      toast.error('Debe seleccionar un periodo');
      return;
    }
    this.setState({ modalContratos: true });
  };

  /**
   * @method
   * Método encargado de mostrar el componente selector de contratos
   * @returns {Object}
   */
  renderSelectorContrato = () => {
    const contrato = getProp(this.state, 'contrato', null);
    const propsInput = {
      placeholder: 'Seleccione un contrato',
      className: 'form-control',
      onChange: this.controlarCambio,
      name: 'contrato',
      title: `${getProp(contrato, 'cntNumero', '')}-${getProp(contrato, 'cntNumero', '')}`,
      value: getProp(contrato, 'cntNumero', ''),
      type: 'text',
      disabled: true
    };
    return (
      <div className='col-4 form-group mt-1'>
        <label>Contrato:</label>
        <div className="input-group mb-3">
          <input {...propsInput} />
          <div className="input-group-prepend">
            <button className="btn-primary btn-buscador input-group-text" title='Seleccionar contrato' onClick={this.abrirConsultaContratos}><i className='fa fa-fw fa-check-square-o'></i></button>
            <button className="btn-primary input-group-text" title='Limpiar Contrato' onClick={this.limpiarContrato}><i className='fa fa-fw fa-trash'></i></button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * @method
   * Método encargado de mostrar el formulario
   */
  renderData = () => {
    let desabilitar = false;
    if (this.state.idCuenta != null) {
      desabilitar = true;
    }
    return (
      <Fragment>
        <TextoNumerico
          aceptaDecimales={false}
          aceptaNegativos={false}
          label='Desbalance:'
          cols={3}
          value={this.state.desbalance}
          onChange={this.controlarCambio}
          name='desbalance'
          extra={{ disabled: true, readOnly: true }}
        />
        <Input
          label='Total Cruzado:'
          cols={3}
          value={this.state.totalCruzado}
          name='totalCruzado'
          extra={{ disabled: true, readOnly: true }}
        />
        <Input
          label='Nuevo Desbalance:'
          cols={3}
          value={this.state.nuevoDesbalance}
          name='nuevoDesbalance'
          extra={{ disabled: true, readOnly: true }}
        />
        <Input
          label='Tramo:'
          value={this.state.tramo}
          onChange={this.controlarCambio}
          name='tramo'
          cols={3}
          extra={{ disabled: true, readOnly: true }}
        />
      </Fragment>
    );
  }

  /**
   * @method
   * Método encargado de hacer las validaciones para agregar puntos negativos
   * @returns {Object}
   */
  validarPuntosNegativos = () => {
    const { puntoNegativo, listaPuntosNegativos } = this.state;
    if (puntoNegativo == '' || puntoNegativo == '-1') {
      return { respuesta: false, mensaje: 'Debe selecionar un punto negativo' };
    }
    const index = listaPuntosNegativos.findIndex(p => (p.puntoSalida.ptsaIderegistro == puntoNegativo && p.seleccionado));
    if (index >= 0) {
      return { respuesta: false, mensaje: 'El punto seleccionado ya se encuentra en la lista' };
    }
    return { respuesta: true };
  }

  /**
   * @method
   * Método encargado de realizar el calculo del cruce
   * @param {String} operacion Tipo de operación si se esta agregando o eliminando un punto
   * @param {Number} idNegativo Identificador del punto negativo en el caaso de eliminar
   */
  calcularCruce = (operacion, idNegativo = null) => {
    const { puntoNegativo, listaPuntosPositivos, puntoPositivo } = this.state;
    const lista = [...this.state.listaPuntosNegativos];
    const puntoPositivoObjeto = listaPuntosPositivos.find(p => p.puntoSalida.ptsaIderegistro == puntoPositivo);
    let totalCruzado = this.state.totalCruzado;
    let valorCruzado, index;
    if (typeof totalCruzado == 'string') {
      parseFloat(totalCruzado);
    }
    if (operacion == ESTADOS_CRUCE.AGREGAR) {
      index = lista.findIndex(p => p.puntoSalida.ptsaIderegistro == puntoNegativo);
      valorCruzado = Math.abs(Math.min(puntoPositivoObjeto.desbalanceCalculo, lista[index].desbalance.cantidad));
      puntoPositivoObjeto.desbalanceCalculo = (puntoPositivoObjeto.desbalanceCalculo - valorCruzado);
      totalCruzado = (puntoPositivoObjeto.desbalance.cantidad - puntoPositivoObjeto.desbalanceCalculo);
      lista[index].seleccionado = true;
      lista[index].valorCruzado = valorCruzado;
      lista[index].nuevoSaldo = (lista[index].desbalance.cantidad + valorCruzado);
    }
    if (operacion == ESTADOS_CRUCE.ELIMINAR) {
      index = lista.findIndex(p => p.puntoSalida.ptsaIderegistro == idNegativo);
      const punto = { ...lista[index] };
      valorCruzado = Math.abs(Math.min(puntoPositivoObjeto.desbalanceCalculo, punto.desbalance.cantidad));
      puntoPositivoObjeto.desbalanceCalculo = (puntoPositivoObjeto.desbalanceCalculo + valorCruzado);
      totalCruzado = (puntoPositivoObjeto.desbalance.cantidad - puntoPositivoObjeto.desbalanceCalculo);
      punto.seleccionado = false;
      punto.valorCruzado = '';
      punto.nuevoSaldo = '';
      lista[index] = punto;
    }
    this.setState({ listaPuntosNegativos: [...lista], totalCruzado: totalCruzado, nuevoDesbalance: puntoPositivoObjeto.desbalanceCalculo });
  };

  /**
   * @method
   * Método encargado de agregar el punto negativo a la lista
   * @returns {Boolean}
   */
  agregarPuntoNegativo = () => {
    const validarPuntos = this.validarPuntosNegativos();
    if (!validarPuntos.respuesta) {
      toast.error(validarPuntos.mensaje);
      return;
    }
    this.calcularCruce(ESTADOS_CRUCE.AGREGAR);
  };

  /**
   * @method
   * Método encargado de mostrar el selector para medidores o puntos de salida
   * @returns {Object}
   */
  renderSelector = () => {
    return (
      <div className="grupo input-group mb-3 mt-5">
        <Combo
          opciones={this.state.listaPuntosNegativos}
          propTexto='puntoSalida.ptsaNombre'
          propValor='puntoSalida.ptsaIderegistro'
          label='Puntos de Salida Negativos:'
          name='puntoNegativo'
          value={this.state.puntoNegativo}
          onChange={this.controlarCambio}
        />
        <button
          className="btnSuma"
          title='Agregar'
          onClick={() => this.agregarPuntoNegativo()}><i className='fa fa-fw fa-plus'></i></button>
      </div>
    );
  }

  /**
   * @method
   * Método encargado de mostrar el formulario de cruce
   * @returns {Object}
   */
  renderFormulario = () => {
    let desabilitar = false;
    if (this.state.idCuenta != null) {
      desabilitar = true;
    }
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />
        <div className='conf-general row mt-5'>
          <Fecha
            label="Periodo:"
            onChange={this.controlarCambio}
            name='periodo'
            fecha={this.state.periodo}
            sinDia={true}
          />
          {this.renderSelectorContrato()}
          {this.state.idCuenta == null &&
            < Combo
              opciones={this.state.listaPuntosPositivos}
              propTexto='puntoSalida.ptsaNombre'
              propValor='puntoSalida.ptsaIderegistro'
              label='Puntos de Salida Positivos:'
              name='puntoPositivo'
              value={this.state.puntoPositivo}
              onChange={this.controlarCambio}
              extra={{ disabled: desabilitar, readOnly: desabilitar }}
            />
          }

          {this.state.idCuenta != null &&
            <Input
              label='Punto de Salida:'
              value={this.state.puntoSalidaNombre}
              onChange={this.controlarCambio}
              name='puntoSalidaNombre'
              extra={{ disabled: desabilitar, readOnly: desabilitar }}
            />
          }

          {
            this.renderData()
          }
          {this.state.idCuenta == null &&
            this.renderSelector()
          }
          {(Util.validarArreglo(this.state.listaPuntosNegativos) && this.state.listaPuntosNegativos.filter(p => p.seleccionado).length > 0) &&
            this.renderTablaNegativos()
          }
        </div>
      </Fragment>
    );
  }

  /**
   * @method
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <Fragment>
        {!this.state.provision &&
          this.renderFormulario()
        }
        {this.state.provision &&
          <RGenerarProvision
            periodo={this.state.periodo}
            listaPuntosNegativos={this.state.listaPuntosNegativos}
            idCruce={this.state.idCuenta}
            actualizarProvision={this.actualizarProvision}
          />
        }
        <VentanaModal
          mostrar={this.state.modalContratos}
          titulo='Contratos'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaContratos
            esModal
            seleccionarEntidad={this.onSeleccionarContrato}
            estadosContrato={['A']}
            inhabilitarEstado={true}
            inhabilitarTercero={true}
            tipoNegocio={TIPOS_NEGOCIO.COMPRA}
            tiposContrato={['T']}
            tiposContratoDisabled={true}
          />
        </VentanaModal>
        <VentanaModal
          mostrar={this.state.modalConsulta}
          titulo='Cruce de cuentas'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaCruce
            esModal
            seleccionarEntidad={this.onSeleccionarCruce}
          />
        </VentanaModal>
      </Fragment>
    );
  };
}

GestionCuentaBalance.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionCuentaBalance);

export { VistaRedux as RGestionCuentaBalance };
