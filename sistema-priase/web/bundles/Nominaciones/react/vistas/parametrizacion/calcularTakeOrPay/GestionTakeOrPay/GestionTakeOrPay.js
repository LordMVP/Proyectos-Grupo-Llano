import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, Fecha } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import './GestionTakeOrPay.scss';
import { get as getProp } from 'object-path';
import { RConsultaTopGrupal } from '../../topGrupal/ConsultaTopGrupal';

class GestionTakeOrPay extends Component {

  state = {
    // Datos de la entidad
    listaContratos: null,
    fechaInicio: '',
    fechaFin: '',
    idTopGrupal: '',
    nombreTopGrupal: '',
    // Estado de la aplicacion
    mostrarModalConsulta: false,
    estado: true,
  };

  /**
   * Método encargado de limpiar los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  limpiarFormulario = (evento) => {
    this.setState({
      // Datos de la entidad
      fechaInicio: ' ',
      fechaFin: ' ',
      nombreTopGrupal: '',
      idTopGrupal: '',
      listaContratos: null,
      // Estado de la aplicacion
      mostrarModalConsulta: false,
      estado: true,
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
    let funciones = [{ texto: 'Guardar', callback: this.guardarEntidad }];
    funciones.push({ texto: 'Consultar Top Grupal', callback: this.consultarEntidad });
    funciones.push({ texto: 'Calcular', callback: this.calcular });
    funciones.push({ texto: 'Generar Reporte', callback: this.generarReporte });
    funciones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    return funciones;
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    const { fechaFin, fechaInicio, listaContratos } = this.state;
    const fechaInicioDate = Date.parse(fechaInicio);
    const fechaFinDate = Date.parse(fechaFin);
    const fechaActual = Date.now();
    // Ejemplo Validacion
    if (fechaInicio.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar la fecha inicial' } };
    }

    if (fechaFin.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar la fecha final' } };
    }

    if (fechaInicioDate > fechaFinDate) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'La fecha inicial no puede ser mayor a la fecha final' } };
    }

    if (fechaFinDate > fechaActual) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'La fecha final no puede ser mayor al día de hoy' } };
    }

    if (!Util.validarArreglo(listaContratos.listaTakeOrPayContrato)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe consultar un top grupal antes de guardar' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormularioConsultarContratos = () => {
    const { fechaFin, fechaInicio, listaContratos, nombreTopGrupal } = this.state;
    const fechaInicioDate = Date.parse(fechaInicio);
    const fechaFinDate = Date.parse(fechaFin);
    const fechaActual = Date.now();
    // Ejemplo Validacion
    if (fechaInicio.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar la fecha inicial' } };
    }

    if (fechaFin.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar la fecha final' } };
    }

    if (fechaInicioDate > fechaFinDate) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'La fecha inicial no puede ser mayor a la fecha final' } };
    }

    if (fechaFinDate > fechaActual) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'La fecha final no puede ser mayor al día de hoy' } };
    }

    if (nombreTopGrupal.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el top grupal' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de generar el JSON de guardar
   * @returns {Object}
   */
  obtenerDatos = () => {
    const { listaContratos, fechaInicio, fechaFin, idTopGrupal } = this.state;
    let objetoDevolver = {};
    const lista = listaContratos.listaTakeOrPayContrato.filter(p => p.cantidadReal != null && p.cantidadFirme != null);
    const objeto = lista.map((dato, index) => {
      return {
        cntIdecontrato: { cntIderegistro: dato.contrato.cntIderegistro },
        tpgIdetopgrupal: { tpgIderegistro: idTopGrupal },
        nvcCantidadreal: dato.cantidadReal,
        nvcCantidadfirme: this.obtenerCantidadFirme(dato.cantidadFirme, dato.cantidadReal),
        nvcConsumoocacional: dato.consumoOcasional,
        nvcFechainicialcalculo: fechaInicio,
        nvcFechafinalcalculo: fechaFin,
      }
    });
    objetoDevolver.listaValores = objeto;
    return objetoDevolver;
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

    const entidadGuardar = this.obtenerDatos();

    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_CALCULAR_TAKE_OR_PAY.GUARDAR, entidadGuardar);
  };

  /**
   * Método encargado de abrir la ventana modal del boton consulta
   * @returns {bool}
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
   * Método encargado de cerrar la ventana modal del boton consulta
   */
  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false
    });
  };

  /**
   * Método encargado de consultar los contratos del top grupal
   * @returns {Boolean}
   */
  calcular = () => {
    const { fechaFin, fechaInicio, idTopGrupal } = this.state;
    const validacion = this.validarFormularioConsultarContratos();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_CALCULAR_TAKE_OR_PAY.CONSULTAR_CONTRATOS, { 'topgrupal': idTopGrupal, 'fechaInicial': fechaInicio, 'fechaFinal': fechaFin })
      .then((respuesta) => {
        if (respuesta.data.codigo === 0) {
          return false;
        }
        if (respuesta.data.codigo > 0) {
          this.setState({ listaContratos: respuesta.data.datos, });
        }
      });
  };

  /**
   * Método encargado de generar el reporte
   * @returns {Boolean}
   */
  generarReporte = () => {
    const { idTopGrupal, fechaFin, fechaInicio } = this.state;
    if (idTopGrupal == '') {
      this.props.mostrarAlerta("Datos Incompletos", "Debe seleccionar el top grupal");
      return false;
    }
    if (fechaInicio == '') {
      this.props.mostrarAlerta("Datos Incompletos", "Debe selecciona la fecha inicio");
      return false;
    }
    if (fechaFin == '') {
      this.props.mostrarAlerta("Datos Incompletos", "Debe selecciona la fecha fin");
      return false;
    }
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_CALCULAR_TAKE_OR_PAY.GENERAR_DOCUMENTO, { 'idTopGrupal': idTopGrupal, 'fechaInicio': fechaInicio, 'fechaFinal': fechaFin })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          let a = document.createElement('a');
          a.href = 'data:' + { type: "Content-Type: application/vnd.ms-excel" } + ';base64,' + respuesta.data.datos;
          a.download = "Reporte.xls";
          a.target = '_blank';
          a.click();
          return;
        }
        if (respuesta.data.codigo == 0) {
          this.props.mostrarAlerta("Atención", "Debe guardar el registro primero.");
        }
      });
  };

  /**
   * Método encargado de cargar los datos de la ventana modal de consulta
   * @param {Object} entidad Datos seleccionados de la consulta
   */
  cargarDatos = (entidad) => {
    this.setState({
      mostrarModalConsulta: false,
      estado: false,
      idTopGrupal: entidad.tpgIderegistro,
      nombreTopGrupal: entidad.tpgNombre,
    });
  };

  /**
   * Método encargado de obtener el valor de la cantidad firme
   * @param {number} cantidadFirme La cantidad firme del contrato consultado
   * @param {number} cantidadReal La cantidad real del contrato consultado
   */
  obtenerCantidadFirme = (cantidadFirme, cantidadReal) => {
    let cantidadF = cantidadFirme;
    let cantidadR = cantidadReal;
    if (!cantidadF || cantidadF === null) {
      cantidadF = cantidadR;
    }
    return cantidadF;
  };

  /**
   * Método encargado de mostrar la tabla para el calculo del consumo
   * @returns {array}
   */
  renderTablaConsumo = () => {
    return (
      <table className='table table-striped mt30'>
        <thead>
          <tr>
            <th>Calculo Consumo Ocacional</th>
          </tr>
          <tr>
            <th>Top Grupal</th>
            <th>Contrato</th>
          </tr>
        </thead>
        <tbody>
          {this.state.listaContratos.map((dato, index) => {
            return (
              <tr key={dato.contrato.cntIderegistro}>
                <td>{dato.contrato.tpgIdetopgrupal.tpgNombre}</td>
                <td>{dato.contrato.cntNumero}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  /**
   * Método encargado de obtener el porcentaje dado el valor decimal
   * @param {number} porcentajeDeficiente Valor decimal
   * @returns {number}
   */
  obtenerPorcentaje = (porcentajeDeficiente) => {
    if (porcentajeDeficiente) {
      return porcentajeDeficiente * 100;
    }
    return 0;
  };

  /**
   * Método encargado de generar la tabla con los contratos del top grupal seleccionado
   * @returns {array}
   */
  renderTabla = () => {
    return (
      <div className='col-12 mt-3'>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th>Top Grupal</th>
              <th>Número Contrato</th>
              <th>Agente</th>
              <th>Cantidad Contratada</th>
              <td>% Top</td>
              <td>Consumo real (m3)</td>
              <td>Cantidad Deficiente</td>
              <td>% Participación cantidad deficiente</td>
              <td>Asignaciòn de la cantidad deficiente</td>
              <th>Cantidad Firme</th>
              <th>Consumo Ocacional</th>
              <th>% Firmeza</th>
            </tr>
          </thead>
          <tbody>
            {this.state.listaContratos.listaTakeOrPayContrato.map((dato, index) => {
              return (
                <tr key={dato.contrato.cntIderegistro}>
                  <td>{dato.contrato.tpgIdetopgrupal.tpgNombre}</td>
                  <td>{dato.contrato.cntNumero}</td>
                  <td>{dato.contrato.terIdeagente.terNomcompleto}</td>
                  <td>{dato.cantidadContratada}</td>
                  <td>{dato.cantidadTop}</td>
                  <td>{dato.cantidadReal}</td>
                  <td>{dato.cantidadDeficiente}</td>
                  <td>{this.obtenerPorcentaje(dato.porcentajeParticipacion)}</td>
                  <td>{dato.asignacionCantidadDeficiente}</td>
                  <td>{dato.cantidadFirme}</td>
                  <td>{dato.cantidadOcasional}</td>
                  <td>{dato.firmeza}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  /**
   * Método encargado de mostrar el formulario con el detalle del calculo del top crupal
   * @returns {JSX}
   */
  renderDetalleTop = () => {
    return (
      <div className="grupo-campos col-12 mt-5">
        <legend className='title'>
          Top Grupal
          </legend>
        <div className='row mt-5'>
          <Input
            label='Cantidad Mínima:'
            value={getProp(this.state.listaContratos, 'cantidadMinimaTop')}
            onChange={this.controlarCambio}
            extra={{ disabled: true }}
          />
          <Input
            label='Cantidad Contratada:'
            value={getProp(this.state.listaContratos, 'cantidadContatadaTop')}
            onChange={this.controlarCambio}
            extra={{ disabled: true }}
          />
          <Input
            label='Consumo Real:'
            value={getProp(this.state.listaContratos, 'cantidadRealTop')}
            onChange={this.controlarCambio}
            extra={{ disabled: true }}
          />
          <Input
            label='Cantidad Deficiente:'
            value={getProp(this.state.listaContratos, 'cantidadDeficienteTop')}
            onChange={this.controlarCambio}
            extra={{ disabled: true }}
          />
        </div>
      </div>
    );
  }

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
            label='Nombre Top Grupal:'
            value={this.state.nombreTopGrupal}
            extra={{ disabled: true, readOnly: true }}
            name='nombreTopGrupal'
          />
          <Fecha
            label='Fecha Inicio:'
            name='fechaInicio'
            fecha={this.state.fechaInicio}
            onChange={this.controlarCambio}
          />
          <Fecha
            label='Fecha Fin:'
            name='fechaFin'
            fecha={this.state.fechaFin}
            onChange={this.controlarCambio}
          />
          {
            getProp(this.state, 'listaContratos.listaTakeOrPayContrato', []).length > 0 &&
            this.renderTabla()
          }
        </div>
        {this.state.listaContratos != null &&
          this.renderDetalleTop()
        }
        <VentanaModal
          mostrar={this.state.mostrarModalConsulta}
          titulo='Top Grupal'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaTopGrupal
            esModal
            seleccionarEntidad={this.cargarDatos}
          />
        </VentanaModal>
      </Fragment>
    );
  };
}

GestionTakeOrPay.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionTakeOrPay);

export { VistaRedux as RGestionTakeOrPay };
