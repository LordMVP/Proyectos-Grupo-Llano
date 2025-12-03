import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import RUTAS_VISTA from '../../../../global/rutas_vista';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { get as getProp } from 'object-path'
import { limpiarHistorico, limpiarJson } from '../../../../global/util_nominaciones';
import { Botonera, Util, Fecha } from 'appfuture-react';

import './GestionCalcularConsumoSinTakeOrPay.scss';

class GestionCalcularConsumoSinTakeOrPay extends Component {

  state = {
    // Datos de la entidad
    listaIdContrato: [],
    listaContratos: [],
    contrato: '',
    fechaInicial: '',
    fechaFinal: '',
    tipoUso: '',
    agente: '',
    codigoContrato: '',
    ultimoRangoConsultado: '',
    calculo: false,
  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    window.addEventListener('beforeunload', this.limpiarFormulario);
    const { state } = this.props.history && this.props.history.location;
    if (state && state.listaContratos) {
      this.cargarDatos(state);
    }
  };

  /**
   * Método encargado de cargar los datos que vienen desde otro componente
   * @param {*} state Datos del componente padre
   */
  cargarDatos(state) {
    const listaContratos = state.listaContratos.map(contrato => {
      contrato.seleccionado = true;
      return contrato;
    });
    this.setState({
      listaContratos: listaContratos
    });
  };

  /**
   * Método encargado de limpiar los campos del formulario
   */
  limpiarFormulario = () => {
    this.setState({
      // Datos de la entidad
      codigoContrato: '',
      listaIdContrato: [],
      listaContratos: [],
      contrato: '-1',
      fechaInicial: ' ',
      fechaFinal: ' ',
      tipoUso: '',
      agente: '',
      fechaInicio: '',
      fechaFin: '',
      calculo: false,
    });
    limpiarHistorico(this.props);
  };

  /**
   * Método encargado de limpiar el formulario al momento de salir
   */
  componentWillUnmount() {
    this.limpiarFormulario();
    window.removeEventListener('beforeunload', this.limpiarFormulario);
  };

  /**
   * Método encargado de generar los botones del formulario
   * @returns {Object}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Guardar', callback: this.guardarEntidad },
      { texto: 'Calcular Consumo', callback: this.calcularConsumo },
      { texto: 'Limpiar', callback: this.limpiarFormulario },
    ];
  };

  /**
   * Método encargado de guardar los datos de la entidad
   * @returns {bool}
   */
  validarFormularioConsultar = () => {
    const { fechaInicial, fechaFinal, listaContratos } = this.state;
    const fechaIniDate = new Date(fechaInicial);
    const fechaFinDate = new Date(fechaFinal);
    //Validaciones
    if (!Util.validarArreglo(listaContratos)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un contrato' } };
    }

    if (fechaInicial.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar la fecha inicial.' } };
    }

    if (fechaFinal.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar la fecha final.' } };
    }

    if (fechaIniDate > fechaFinDate) {
      return { respuesta: false, mensaje: { titulo: 'Error', mensaje: 'La fecha inicial no puede ser mayor que la final' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    const { listaContratos, calculo } = this.state;
    //Validaciones
    if (!Util.validarArreglo(listaContratos)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe agregar al menos un contrato.' } };
    }

    if (!calculo) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe realizar el calculo' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de obtener el valor de la cantidad firme.
   * @param {number} cantidadFirme La cantidad firme del contrato consultado.
   * @param {number} cantidadReal La cantidad real del contrato consultado.
   * @returns {number}
   */
  obtenerCantidadFirme = (cantidadFirme, cantidadReal) => {
    let cantidadF = cantidadFirme;
    let cantidadR = cantidadReal;
    if (!cantidadF || cantidadF === null) {
      cantidadF = cantidadR
    }
    return cantidadF;
  };

  /**
   * Método encargado de construir el objeto con los datos para guardar.
   * @returns {Object}
   */
  obtenerObjeto = () => {
    const { listaContratos, fechaInicial, fechaFinal } = this.state;
    let objetoDevoler = {};
    const valores = listaContratos.map((dato) => {
      return {
        cntIdecontrato: {
          cntIderegistro: dato.tipoContrato.cntIdecontrato.cntIderegistro
        },
        nvcCantidadreal: dato.cantidadReal,
        nvcCantidadfirme: this.obtenerCantidadFirme(dato.cantidadFirme, dato.cantidadReal),
        nvcConsumoocacional: dato.consumoOcasional,
        nvcFechainicialcalculo: fechaInicial,
        nvcFechafinalcalculo: fechaFinal,
        nvcCantidaddeficiente: dato.cantidadDeficiente
      }
    });
    objetoDevoler.listaValores = valores;
    return objetoDevoler
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
    const entidadGuardar = this.obtenerObjeto();
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_CONSUMO_SIN_TAKE_OR_PAY.GUARDAR, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    const listaContratos = this.state.listaContratos;
    const { name } = evento.target;
    if (name == 'seleccionado') {
      listaContratos[evento.target.attributes['data-index'].value].seleccionado = evento.target.checked;
    }
    change[name] = evento.target.value;
    this.setState(change);
  };

  /**
   * Método encargado de construir un objeto para realizar el calculo.
   * @returns {Object}
   */
  contruirObjetoCalcular = () => {
    const { listaContratos, fechaInicial, fechaFinal } = this.state;
    const lista = listaContratos
      .filter(contrato => contrato.seleccionado)
      .map(dato => (
        {
          contrato: limpiarJson(dato),
          fechaInicial: fechaInicial,
          fechaFinal: fechaFinal
        }
      ));
    return lista;
  };

  /**
   * Método encargado de consultar los calculos del contrato seleccionado a una lista.
   * @returns {bool}
   */
  calcularConsumo = () => {
    const { listaContratos, fechaInicial, fechaFinal, ultimoRangoConsultado } = this.state;
    const validar = this.validarFormularioConsultar();
    if (!validar.respuesta) {
      this.props.mostrarAlerta(validar.mensaje.titulo, validar.mensaje.mensaje);
      return false;
    }

    const rangoRepetido = `${fechaInicial}-${fechaFinal}` == ultimoRangoConsultado;
    if (rangoRepetido) {
      this.props.mostrarAlerta('Error', 'El rango actual ya ha sido consultado.');
      return false;
    }

    const entidadConsultar = this.contruirObjetoCalcular();
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_CONSUMO_SIN_TAKE_OR_PAY.CONSULTAR_CONTRATOS_CALCULO, entidadConsultar)
      .then(respuesta => {
        if (respuesta.data.codigo == 0) {
          this.setState({ listaContratosSeleccionados: [] });
          return;
        }
        if (respuesta.data.codigo > 0) {
          const listaNueva = listaContratos.filter(contrato=>contrato.seleccionado).map(contrato => {
            let contratoNuevo = {};
            for (let index = 0; index < respuesta.data.datos.length; index++) {
              const contratoCalculo = respuesta.data.datos[index];
              if (contrato.cntIderegistro == contratoCalculo.tipoContrato.cntIdecontrato.cntIderegistro) {
                contratoNuevo = { ...contrato, ...contratoCalculo };
              }
            }
            return contratoNuevo;
          });
          this.setState({
            listaContratos: listaNueva,
            ultimoRangoConsultado: ultimoRangoConsultado,
            calculo: true
          });
        }
      });
  };

  /**
   * Método encargado de redireccionar a la interfaz de consultar contratos.
   */
  seleccionarContrato = () => {
    this.props.history.push({
      pathname: RUTAS_VISTA.CONSULTA_CONTRATOS.url,
      state: {
        interfazGestion: RUTAS_VISTA.GESTION_CONSUMO_SIN_TAKE_OR_PAY.url,
        seleccionMultiple: true,
        mostrarTablaSeleccionados: true,
        estadosContrato: ['A', 'F'],
        tiposContrato: ['GNCV', 'S'],
        takeOrPay: 'N',
        estadoContratoDisabled: true,
        takeOrPayDisabled: true,
        tiposContratoDisabled: true,
        tipoAgente: 'V',
        inhabilitarTercero: true
      }
    });
  };
  x
  /**
   * Método encargado mostrar una tabla con los contratos seleccionados en la interfaz de contrato
   * @returns {JSX}
   */
  renderContratosSeleccionados = () => {
    if (!Util.validarArreglo(this.state.listaContratos)) {
      return;
    }
    return (
      <div className='table-responsive'>
        <table className='table table-hover table-striped table-bordered mt-5'>
          <thead className='bg-dark text-white'>
            <tr>
              <th className='text-center'>*</th>
              <th>Agente - Número de Contrato</th>
              <th>Tipo de Agente</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Tipo de uso</th>
              {this.state.calculo &&
                <Fragment>
                  <th>Cantidad Deficiente</th>
                  <th>Unidad de Medida</th>
                  <th>Cantidad Real</th>
                  <th>Cantidad Firme</th>
                  <th>Cantidad Ocasional</th>
                  <th>Cantidad Contratada * Porcentaje de Firmeza</th>
                </Fragment>
              }
            </tr>
          </thead>
          <tbody>
            {
              this.state.listaContratos.map((contrato, index) => {
                return (
                  <tr key={index}>
                    <td><input type="checkbox" checked={contrato.seleccionado} onChange={this.controlarCambio} name='seleccionado' data-index={index} /> </td>
                    <td>{getProp(contrato.terIdeagente,'terNomcompleto','')} - {contrato.cntNumero}</td>
                    <td>{(contrato.cntTiponegocio) == 'C' ? 'Proveedor' : 'Cliente'}</td>
                    <td>{contrato.cntFechainicio}</td>
                    <td>{contrato.cntFechafin}</td>
                    <td>{contrato.uniIdetipouso.uniNombre1}</td>
                    {this.state.calculo &&
                      <Fragment>
                        <td>{getProp(contrato, 'cantidadDeficiente', '')}</td>
                        <td>{getProp(contrato, 'unidadDestino.uniNombre1', '')}</td>
                        <td>{getProp(contrato, 'cantidadReal', '')}</td>
                        <td>{getProp(contrato, 'cantidadContratada', '')}</td>
                        <td>{getProp(contrato, 'consumoOcasional', '')}</td>
                        <td>{getProp(contrato, 'cantidadFirme', '')}</td>
                      </Fragment>
                    }
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
   * Método encargado de mostrar el formulario.
   * @returns {Object}
   */
  render() {
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />
        <div className='conf-general row mt-5'>
          <div className='form-group col-4'>
            <label>Contrato:</label>
            <div className='input-group'>
              <input
                type="text"
                disabled={true}
                className='form-control'
                onChange={this.controlarCambio}
                name='codigoContrato'
                placeholder='Seleccionar contrato'
                value={Util.validarArreglo(this.state.listaContratos) ? (this.state.listaContratos.length + ' Contratos seleccionados') : 'Seleccione un contrato'}
              />
              <div className='input-group-btn'>
                <button className='btn btn-primary' onClick={this.seleccionarContrato}><i className='fa fa-fw fa-search'></i></button>
              </div>
            </div>
          </div>
          <Fecha
            label='Fecha Inicio:'
            name='fechaInicial'
            fecha={this.state.fechaInicial}
            onChange={this.controlarCambio}
          />
          <Fecha
            label='Fecha Fin:'
            name='fechaFinal'
            fecha={this.state.fechaFinal}
            onChange={this.controlarCambio}
          />
          {this.renderContratosSeleccionados()}
        </div>
      </Fragment>
    );
  };
}

GestionCalcularConsumoSinTakeOrPay.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionCalcularConsumoSinTakeOrPay);

export { VistaRedux as RGestionCalcularConsumoSinTakeOrPay };
