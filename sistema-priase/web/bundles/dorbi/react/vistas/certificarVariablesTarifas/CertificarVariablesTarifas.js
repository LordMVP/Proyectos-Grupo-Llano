import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, Fecha } from 'appfuture-react';
import axios from 'axios';
import { formatearArray } from '../../global/util_nominaciones';
import RUTAS_API from '../../global/rutas_api';
import { mostrarAlerta } from '../../store/actions/AplicacionAcciones';
import './CertificarVariablesTarifas.scss';

const CERTIFICADO = 'CE';
const ANULADO = 'CA';

class CertificarVariablesTarifas extends Component {

  state = {
    // Datos de la entidad
    areaPrestacion: '',
    periodo: '',
    listaAreaPrestacion: [],
    listaPeriodo: [],
    listaConsultados: [],
    // Estado de la aplicacion
    estadoCampo: false
  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    this.consultarAreaPrestacion();
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
  };

  /**
   * Método encargado de consultar las áreas de prestación.
   */
  consultarAreaPrestacion = () => {
    axios.post(RUTAS_API.PARAMETRIZACION.AREAS_PRESTACION.FILTRO, { criterio: '' })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({
            listaAreaPrestacion: formatearArray(respuesta.data.datos)
          });
        }
      });
  };

  /**
   * Método encargado de convertir la fecha del desvio a formato DD/MM/YYYY
   * @param {number} fechaNumero Fecha parseada a número
   * @returns {string}
   */
  obtenerFecha = (fechaNumero) => {
    let fecha = new Date(fechaNumero);
    const anio = fecha.getFullYear();
    return anio;
  };

  /**
   * Método encargado de contruir un objeto con los periodos consultados.
   * @param {Object} periodos Datos de los periodos consultados.
   * @returns {Object}
   */
  construirObjetoPeriodos = (periodos) => {
    return periodos.map((dato) => ({
      idRegistro: dato.perIderegistro.perIderegistro,
      nombre: `${dato.perIderegistro.perNombre}-${this.obtenerFecha(dato.perIderegistro.perFecinicial)}`
    }));
  };

  /**
   * Método encargado ejecutar una acción cuando se elimina el componente
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
      areaPrestacion: '',
      periodo: '',
      listaConsultados: [],
      // Estado de la aplicacion
      estadoCampo: false
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
      { texto: 'Consultar', callback: this.consultarEntidad },
      { texto: 'Certificar', callback: this.certificarEntidad },
      { texto: 'Anular', callback: this.anularEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    const { listaConsultados } = this.state;
    const listaFiltrada = listaConsultados.filter(p => p.seleccionado === true);
    if (listaFiltrada.length === 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos una variable' } };
    }
    return { respuesta: true };
  };

  /**
   * Método encargado de obtener las variables seleccionadas para cancelación o certificación.
   * @param {String} estado Estado el cual se asignara a las variables seleccionadas.
   * @returns {Object}
   */
  obtenerObjeto = (estado) => {
    let { listaConsultados, periodo, areaPrestacion } = this.state;
    let listaFinal = [];
    const lista = listaConsultados.filter(p => p.seleccionado === true);
    return lista.map(dato => {
      return {
        varcIderegistro: dato.idVariable,
        perIderegistro: {
          perIderegistro: periodo
        },
        conIderegistro: {
          uniConcepto: {
            uniIderegistro: dato.idConcepto
          }
        },
        arprIderegistro: {
          arprIderegistro: areaPrestacion
        },
        racoIderegistro: {
          racoIderegistr: dato.idRango
        },
        varcValor: dato.valConcepto ,
        varcDescripcion: dato.observacion,
        varcEstado: estado
      }
    });
  };

  /**
   * Método encargado de anular las variables seleccionadas.
   * @returns {Bool}
   */
  anularEntidad = () => {
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    const entidadGuardar = this.obtenerObjeto(ANULADO);
    axios.post(RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS.GUARDAR, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de certificar los datos de la entidad.
   * @returns {bool}
   */
  certificarEntidad = () => {
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    const entidadGuardar = this.obtenerObjeto(CERTIFICADO);
    axios.post(RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS.GUARDAR, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de validar los parametros necesarios para consultar.
   * @returns {Object}
   */
  validarFormularioConsultar = () => {
    const { areaPrestacion, periodo } = this.state;
    if (areaPrestacion <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos Incompletos', mensaje: 'Debe seleccionar el área de prestación.' } }
    }
    if (periodo <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos Incompletos', mensaje: 'Debe seleccionar el periodo.' } }
    }
    return { respuesta: true };
  };

  /**
   * Método encargado de contruir un objeto con los conceptos consultados.
   * @param {Object} conceptos Datos de los conceptos consultados.
   * @returns {Object}
   */
  construirObjetoVariables = (conceptos) => {
    return conceptos.map((dato, index) => {
      return {
        idConcepto: dato.idConcepto,
        idVariable: dato.idVcalculo,
        idRango: dato.idRango,
        nombreConcepto: dato.nombreConcepto,
        fechaGrabacion: dato.fecGrabacion , 
        valConcepto: dato.valor , 
        estConcepto: dato.estado , 
        observacion: (dato.observacion != '') ? dato.observacion : '' ,
        ranInical: (dato.ranInical != '') ? dato.ranInical : '' ,
        ranFinal: (dato.ranFinal != '') ? dato.ranFinal : '' , 
        valorAnt: (dato.valorAnt != '') ? dato.valorAnt : '' ,         
        identificadorRegistro: Util.generarIdControl(`variable_${index}`)       
      }
    });
  };

  /**
   * Método encargado de abrir la ventana modal del boton consulta
   */
  consultarEntidad = () => {
    const { areaPrestacion, periodo } = this.state;
    const validar = this.validarFormularioConsultar();
    if (!validar.respuesta) {
      this.props.mostrarAlerta(validar.mensaje.titulo, validar.mensaje.mensaje);
      return false;
    }
    const parametros = {
      areaPrestacion: areaPrestacion,
      periodo: periodo,
    };
    axios.post(RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS.CONSULTAR_VARIABLES_PENDIENTES, parametros)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({
            listaConsultados: this.construirObjetoVariables(respuesta.data.datos),
            estadoCampo: true
          });
        }
      });
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    const { name, value } = evento.target;
    if (name === "areaPrestacion") {
      this.consultarPeriodos(value);
    }
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  /**
   * Método encargado de consultar los periodos por área de prestación.
   * @param {Integer} idArea Identificador del área de prestación.
   * @returns {bool}
   */
  consultarPeriodos = (idArea) => {
    if (idArea === '' || idArea === '-1') {
      this.setState({
        listaPeriodo: []
      });
      return false;
    }
    axios.post(RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS.CONSULTAR_PERIODOS, { idArea: idArea })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({
            listaPeriodo: this.construirObjetoPeriodos(respuesta.data.datos)
          });
          return;
        }
        this.setState({
          listaPeriodo: []
        });
      });
  };

  /**
   * Método encargado de seleccionar el punto.
   */
  seleccionarPunto = (evento) => {
    const lista = [...this.state.listaConsultados];
    const index = lista.findIndex(p => p.identificadorRegistro == evento.target.value);
    lista[index].seleccionado = evento.target.checked;
    this.setState({ listaConsultados: lista });
  };

  /**
   * Método encargado de generar la tabla
   * @returns {Object}
   */
  renderTabla = () => {
    const lista = [...this.state.listaConsultados];
    if (!Util.validarArreglo(lista)) {
      return null;
    }    
    return (
      <table className='table table-striped mt-8'>
        <thead className='thead-dark'>
          <tr>
              <th scope='col'>Seleccionar</th>
              <th scope='col'>Variable</th>
              <td scope='col'>Rango Inicial</td>
              <td scope='col'>Rango Final</td>
              <td scope='col'>Valor</td>
              <td scope='col'>Valor Anterior</td>
              <td scope='col'>Estado</td>
          </tr>
        </thead>
        <tbody>
          {
            lista.map((dato, index) => {
              return (
                <tr key={Util.generarIdControl(index)}>
                  <td>
                    <input value={dato.identificadorRegistro} type="checkbox" checked={dato.seleccionado || false} onChange={(evento) => {
                      this.seleccionarPunto(evento)
                    }} />
                  </td>
                  <td>{dato.nombreConcepto}</td>
                  <td>{dato.ranInical}</td>
                  <td>{dato.ranFinal}</td>
                  <td>{dato.valConcepto}</td>
                  <td>{dato.valorAnt}</td>
                  <td>{(dato.estConcepto.trim() == 'P') ? 'Pendiente' : ''}</td>
                </tr>
              );
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
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />
        <div className='conf-general row mt-5'>
          <Combo opciones={this.state.listaAreaPrestacion}
            propTexto='arprNombre'
            propValor='arprIderegistro'
            label='Área de Prestación:'
            name='areaPrestacion'
            value={this.state.areaPrestacion}
            onChange={this.controlarCambio}
            extra={
              { disabled: this.state.estadoCampo, readOnly: this.state.estadoCampo }
            }
          />
          <Combo opciones={this.state.listaPeriodo}
            propTexto='nombre'
            propValor='idRegistro'
            label='Periodo:'
            name='periodo'
            value={this.state.periodo}
            onChange={this.controlarCambio}
            extra={
              { disabled: this.state.estadoCampo, readOnly: this.state.estadoCampo }
            }
          />
        </div>
        {this.state.listaConsultados.length > 0 &&
          this.renderTabla()
        }
      </Fragment>
    );
  };
}

CertificarVariablesTarifas.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(CertificarVariablesTarifas);

export { VistaRedux as RCertificarVariablesTarifas };
