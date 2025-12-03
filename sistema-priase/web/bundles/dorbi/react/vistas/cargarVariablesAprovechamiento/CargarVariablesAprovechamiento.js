import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, Fecha, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import { formatearArray } from '../../global/util_nominaciones';
import { CLASES_UNIDADES } from '../../global/constantes';
import RUTAS_API from '../../global/rutas_api';
import { mostrarAlerta } from '../../store/actions/AplicacionAcciones';
import './CargarVariablesAprovechamiento.scss';

const CERTIFICADO = 'CE';
const ANULADO = 'CA';
const PENDIENTE = 'P';

const listaCertificado = [
  { texto: 'Certificado', id: 'CE' },
  { texto: 'Pendiente', id: 'P' },
  { texto: 'Cancelado', id: 'CA' },
];

class CargarVariablesAprovechamiento extends Component {

  state = {
    // Datos de la entidad
    valor: '',
    observacion: '',
    periodo: '',
    areaPrestacion: '',
    variable: '',
    idEditar: '',
    aprovechador: '',
    // Listas de la aplicación
    listaVariables: [],
    listaDatos: [],
    listaAreaPrestacion: [],
    listaPeriodo: [],
    listaAprovechador: [],
    // Estado de la aplicacion
    estadoCampo: false,
    estadoFormulario: false,
    /** Variable para validar si ya se consulto y si la consulta devolvio resultados */
    estadoConsulta: {
      estado: false,
      resultados: '',
      controlEditarRaco: false,
    },
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
      axios.post(RUTAS_API.PARAMETRIZACION.AREAS_PRESTACION.FILTRO, { criterio: '' }),
      axios.post(RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS_APROVECHAMINETO.CONSULTAR_APROVECHADORES),
    ];
    axios.all(peticiones)

      .then(axios.spread((areaPrestacion, terceros) => {
        const datosAplicacion = {
          listaAreaPrestacion: [],
          listaAprovechador: []
        };
        if (areaPrestacion.data.codigo > 0) {
          datosAplicacion.listaAreaPrestacion = formatearArray(areaPrestacion.data.datos);
        }
        if (terceros.data.codigo >= 0) {
          datosAplicacion.listaAprovechador = formatearArray(terceros.data.datos);
        }
        this.setState({ ...datosAplicacion });
      }));
  };

  /**
   * Método encargado de contruir un objeto con los conceptos consultados.
   * @param {Object} conceptos Datos de los conceptos consultados.
   * @returns {Object}
   */
  construirObjetoVariables = (conceptos) => {
    let gruposRaco = {};
    conceptos.filter(a => {
      const idConcepto = a.uniConcepto.uniIderegistro;
      if (!gruposRaco[idConcepto]) {
        gruposRaco[idConcepto] = [];
      }
      gruposRaco[idConcepto].push(a);
    });
    let listaFinal = [];
    for (const idConcepto in gruposRaco) {
      let listaRaco = [];
      const grupoRaco = gruposRaco[idConcepto];
      for (let index = 0; index < grupoRaco.length; index++) {
        const racoCon = grupoRaco[index];
        if (racoCon.raco.racoIderegistr) {
          listaRaco.push({
            racoIderegistr: racoCon.raco.racoIderegistr,
            racoValor: racoCon.raco.racoValor,
            nombre: racoCon.conNombre,
            rangoIni: racoCon.raco.racoRaninicial,
            rangoFin: racoCon.raco.racoRanfinal,
            observacion: '',
          });
        }
      }
      let obj = {
        idConcepto: idConcepto,
        nombre: (listaRaco.length > 0) ? listaRaco[0].nombre : grupoRaco[0].conNombre,
        listaRaco: listaRaco,
      };
      listaFinal.push(obj);
    }
    return listaFinal;
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
   */
  limpiarFormulario = () => {
    this.setState({
      // Datos de la entidad
      valor: '',
      observacion: '',
      periodo: '',
      areaPrestacion: '',
      variable: '',
      idEditar: '',
      aprovechador: '',
      estadoCampo: false,
      estadoFormulario: false,
      estadoConsulta: {
        estado: false,
        resultados: '',
        controlEditarRaco: false,
      },
      listaDatos: [],
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
    funciones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    return funciones;
  };


  /**
   * Método encargado de consultar las variables por área de prestación, concepto y periodo
   */
  consultarEntidad = () => {
    const { periodo, areaPrestacion, variable, aprovechador } = this.state;
    const validacion = this.validarFormularioConsultar();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    const parametros = {
      periodo: periodo,
      areaPrestacion: areaPrestacion,
      concepto: variable,
      tercero: aprovechador
    };
    axios.post(RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS_APROVECHAMINETO.CONSULTAR_VARIABLES_APROVECHAMIENTO, parametros)
      .then(respuesta => {
        const variable = this.retornarVariableSeleccionada();
        if (respuesta.data.codigo > 0) {
          
          if (variable.listaRaco.length > 0) {
            this.setState({
              listaDatos: this.construirObjetoTabla(respuesta.data.datos),
              estadoCampo: true,
              estadoFormulario: true,
              estadoConsulta: {
                estado: true,
                resultados: 'MOSTRARDOS',
                controlEditarRaco: false,
              },
              idControl: false,
            });
            return;
          }
          this.setState({
            listaDatos: this.construirObjetoTabla(respuesta.data.datos),
            estadoCampo: true,
            estadoFormulario: false,
            estadoConsulta: {
              estado: true,
              resultados: 'CONRESULTADOS'
            }
          });
          return;
        }
        
        const formulario = (variable.listaRaco.length > 0)? true : false; //se valida el tipo de formulario a mostrar
        this.setState({
          estadoFormulario:formulario,
          estadoConsulta: {
            estado: true,
            resultados: 'SINRESULTADOS',
            idControl: true
          }    
        });
      });
  };

  /**
   * Método encargado de construir un objeto para mostrar los datos de las variables.
   * @param {Object} datosVariables Datos de las variables consultadas.
   * @returns {Array}
   */
  construirObjetoTabla = (datosVariables) => {
    let textoEstado = '';
    return datosVariables.map((dato) => {
      textoEstado = listaCertificado.find(p => p.id == dato.vrtaEstado.trim())
      return {
        racoValor: dato.vrtaValor,
        estado: textoEstado.texto,
        observacion: (dato.vrtaDescripcion != '') ? dato.vrtaDescripcion : '',
        vrtaIderegistro: dato.vrtaIderegistro,
        idEstado: textoEstado.id,
        idEditar: Util.generarIdControl("datos")
      }
    });
  };


  /**
   * Método encargado de validar las variables para consultar.
   * @returns {Object}
   */
  validarFormularioConsultar = () => {
    const { areaPrestacion, periodo, variable, tercero } = this.state;
    // Validaciones
    if (areaPrestacion <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el área de prestación.' } };
    }

    if (periodo <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el periodo.' } };
    }

    if (variable <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar la variable.' } };
    }

    if (tercero <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el aprovechador.' } };
    }

    return { respuesta: true };
  };

  /**
    * Método encargado de validar las variables del formulario.
    * @returns {Object}
    */
  validarFormulario = () => {
    const { areaPrestacion, periodo, variable, listaDatos, aprovechador, estadoConsulta } = this.state;
    const variableSeleccionada = this.retornarVariableSeleccionada();
    // Validaciones
    if (areaPrestacion <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el área de prestación.' } };
    }

    if (periodo <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el periodo.' } };
    }

    if (aprovechador <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el aprovechador.' } };
    }

    if (variable <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar la variable.' } };
    }

    if (variableSeleccionada.listaRaco.length <= 0 && estadoConsulta.resultados == 'SINRESULTADOS') {
      if (listaDatos.length === 0) {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe agregar al menos una pareja de datos' } };
      }
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de devolver la variable seleccionada.
   * @returns {Object}
   */
  retornarVariableSeleccionada = () => {
    const { listaVariables, variable } = this.state;
    const variableSeleccionada = listaVariables.find(p => p.idConcepto == variable);
    return variableSeleccionada;
  };

  /**
   * Método encargado de validar que se ingresen todos los porcentajes
   * @returns {Object}
   */
  validarTablaRaco = () => {
    const variables = this.retornarVariableSeleccionada();
    for (let index = 0; index < variables.listaRaco.length; index++) {
      const variable = variables.listaRaco[index];
      if (variable.racoValor === '') {
        return { respuesta: false, mensaje: { titulo: `Debe ingresar una valor para el rango de la variable` } }
      }
    }
    return { respuesta: true };
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormularioTabla = () => {
    const { valor } = this.state;
    // Validaciones
    if (valor === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar el valor.' } };
    }
    return { respuesta: true };
  };

  /**
   * Método encargado de obtener el objeto para guardar.
   * @returns {Array}
   */
  obtenerObjetoGuardar = () => {
    const { listaDatos, periodo, areaPrestacion, variable, aprovechador, estadoConsulta } = this.state;
    const variableSeleccionada = this.retornarVariableSeleccionada();
    if (variableSeleccionada.listaRaco.length > 0 && estadoConsulta.resultados == 'MOSTRARDOS'
      && estadoConsulta.controlEditarRaco == true) {
      for (let index = 0; index < variableSeleccionada.listaRaco.length; index++) {
        const variable = variableSeleccionada.listaRaco[index];
        variable.idEstado = 'P';
        listaDatos.push(variable);
      }
      return listaDatos.map(dato => {
        return {
          vrtaIderegistro: (dato.vrtaIderegistro) ? dato.vrtaIderegistro : null,
          perIderegistro: {
            perIderegistro: periodo  //se modifica el identificador del periodo
          },
          conIderegistro: {
            uniConcepto: {
              uniIderegistro: variable
            }
          },
          arprIderegistro: {
            arprIderegistro: areaPrestacion
          },
          vrtaValor: dato.racoValor,
          vrtaDescripcion: (dato.observacion != '') ? dato.observacion : '',
          vrtaEstado: dato.idEstado,
          racoIderegistro: {
            racoIderegistr: dato.racoIderegistr
          }
        }
      });
    }
    if (variableSeleccionada.listaRaco.length > 0 && estadoConsulta.resultados == 'SINRESULTADOS') {
      return variableSeleccionada.listaRaco.map(dato => {
        return {
          vrtaIderegistro: (dato.vrtaIderegistro) ? dato.vrtaIderegistro : null,
          perIderegistro: {
            perIderegistro: periodo //se modifica el identificador del periodo
          },
          conIderegistro: {
            uniConcepto: {
              uniIderegistro: variable
            }
          },
          arprIderegistro: {
            arprIderegistro: areaPrestacion
          },
          terIderegistro: {
            terIderegistro: aprovechador
          },
          vrtaValor: dato.racoValor,
          vrtaDescripcion: (dato.observacion != '') ? dato.observacion : '',
          vrtaEstado: PENDIENTE,
          racoIderegistro: {
            racoIderegistr: dato.racoIderegistr
          }
        }
      });
    };
    return listaDatos.map(dato => {
      return {
        vrtaIderegistro: (dato.vrtaIderegistro) ? dato.vrtaIderegistro : null,
        perIderegistro: {
          perIderegistro: periodo //se modifica el identificador del periodo
        },
        conIderegistro: {
          uniConcepto: {
            uniIderegistro: variable
          }
        },
        arprIderegistro: {
          arprIderegistro: areaPrestacion
        },
        terIderegistro: {
          terIderegistro: aprovechador
        },
        vrtaValor: dato.racoValor,
        vrtaDescripcion: (dato.observacion != '') ? dato.observacion : '',
        vrtaEstado: dato.idEstado,
        racoIderegistro: {
          racoIderegistr: dato.racoIderegistr
        }
      }
    });
  };

  /**
   * Método encargado de guardar los datos de la entidad
   * @returns {bool}
   */
  guardarEntidad = () => {
    const { estadoConsulta } = this.state;
    const validacion = this.validarFormulario();
    const validacionTablaRaco = this.validarTablaRaco();
    const variableSeleccionada = this.retornarVariableSeleccionada();
    if (variableSeleccionada.listaRaco.length > 0 && estadoConsulta.resultados == 'SINRESULTADOS') {
      if (!validacionTablaRaco.respuesta) {
        this.props.mostrarAlerta(validacionTablaRaco.mensaje.titulo, validacionTablaRaco.mensaje.mensaje);
        return false;
      }
    }
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    const entidadGuardar = this.obtenerObjetoGuardar();
    axios.post(RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS_APROVECHAMINETO.GUARDAR, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };


  /**
   * Método encargado de agregar los datos ingresados a la tabla
   * @returns {bool}
   */
  agregarDatos = () => {
    const { observacion, valor, listaDatos } = this.state;
    const validacion = this.validarFormularioTabla();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    const textoEstado = listaCertificado.find(p => p.id == 'P');
    listaDatos.push({
      racoValor: valor,
      estado: textoEstado.texto,
      observacion: (observacion != '') ? observacion : '',
      idEstado: textoEstado.id,
      idEditar: Util.generarIdControl("datos")
    });
    this.setState({
      listaDatos: listaDatos,
      valor: '',
      observacion: ''
    });
  };

  /**
   * Método encargado de verificar si la variable tiene raco.
   * @param {Integer}idConcepto Identificador del concepto del concepto.
   */
  controlarVariableRaco = (idConcepto) => {
    let { listaVariables, estadoFormulario } = this.state;
    const conceptoSeleccionado = listaVariables.find(p => p.idConcepto == idConcepto);
    if (conceptoSeleccionado.listaRaco.length > 0) {
      estadoFormulario = true;
    }
    this.setState({
      estadoFormulario: estadoFormulario
    });
  };

  /**
   * Método encargado de consultar las variables.
   */
  controlarConsulta = () => {
    const { areaPrestacion, variable, periodo, aprovechador } = this.state;
    if (areaPrestacion > 0, variable > 0, periodo, aprovechador > 0) {
      this.consultarEntidad();
    }
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambioFormulario = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    const { name, value } = evento.target;
    if (name === "areaPrestacion") {
      this.consultarDatosArea(value);
    }
    if (name === "variable") {
      if (value != '-1' && value != '') {
        this.controlarVariableRaco(value);
      }
    }
    change[evento.target.name] = evento.target.value;
    this.setState(change, this.controlarConsulta);
  };

  /**
   * Método encargado de consultar los periodos por área de prestación.
   * @param {Integer} idArea Identificador del área de prestación.
   * @returns {bool}
   */
  consultarDatosArea = (idArea) => {
    if (idArea === '' || idArea === '-1') {
      this.setState({
        listaPeriodo: [],
        listaVariables: [],
      });
      return false;
    }
    const areaSeleccionada = this.state.listaAreaPrestacion.find(p => p.arprIderegistro == idArea);
    const peticiones = [
      axios.post(RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS.CONSULTAR_PERIODOS, { idArea: idArea }),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTA_UNIDAD_PROGRAMA, { critero: '', idClase: CLASES_UNIDADES.CONCEPTOS_ASEO_APROVECHADORES }),
    ];
    axios.all(peticiones)
      .then(axios.spread((periodos, conceptos) => {
        const datosAplicacion = {
          listaPeriodo: [],
          listaVariables: [],
        };
        if (periodos.data.codigo > 0) {
          datosAplicacion.listaPeriodo = this.construirObjetoPeriodos(periodos.data.datos);
        } else {
          datosAplicacion.listaPeriodo = []
        }
        if (conceptos.data.codigo > 0) {
          datosAplicacion.listaVariables = this.construirObjetoVariables(conceptos.data.datos);
        } else {
          datosAplicacion.listaVariables = [];
        }
        this.setState({ ...datosAplicacion });
      }));
  };

  /**
   * Método encargado de editar la variable seleccionada.
   * @returns {Bool}
   */
  editarDatosRegistro = () => {
    const { listaDatos, valor, observacion, idEditar } = this.state;
    const validacion = this.validarFormularioTabla();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    const index = listaDatos.findIndex(p => p.idEditar == idEditar);
    listaDatos[index].racoValor = valor;
    listaDatos[index].observacion = observacion;
    this.setState({
      listaDatos: listaDatos,
      idEditar: '',
      valor: '',
      observacion: '',
    });
  };

  /**
   * Método encargado de cargar los datos para la edición de la variable.
   * @param {Number} posicion Posición de la lista.
   */
  cargarDatosEditar = (posicion) => {
    const lista = [...this.state.listaDatos];
    const dato = lista[posicion];
    this.setState({
      idEditar: dato.idEditar,
      valor: dato.racoValor,
      observacion: dato.observacion
    });
  };

  /**
   * Método encargado de mostrar la tabla con los datos agregados
   * @returns {Array}
   */
  renderTabla = () => {
    return (
      <table className='table table-striped mt-5'>
        <thead>
          <tr>
            <th>Valor</th>
            <th>Observación</th>
            <th>Estado</th>
            <th>Editar</th>
          </tr>
        </thead>
        <tbody>
          {this.state.listaDatos.map((dato, index) => {
            return (
              <tr key={dato.idEditar}>
                <td>{dato.racoValor}</td>
                <td>{dato.observacion}</td>
                <td>{dato.estado}</td>
                {(dato.idEstado != CERTIFICADO && dato.idEstado != ANULADO) &&
                  <td>
                    <button className='btn btn-primary' onClick={() => {
                      this.cargarDatosEditar(index)
                    }}>Editar</button>
                  </td>
                }
              </tr>
            );
          })
          }
        </tbody>
      </table>
    );
  };

  /**
   * Método encargado de mostrar el formulario de variables sin registros en raco
   * @returns {Object}
   */
  renderFormularioSinRaco = () => {
    return (
      <Fragment>
        <TextoNumerico aceptaDecimales={true}
          aceptaNegativos={false}
          label='Valor :'
          cols={6}
          value={this.state.valor}
          onChange={this.controlarCambioFormulario}
          name='valor'
        />
        <div className='col-12' >
          <div className='form-group' >
            <label htmlFor='descripcionRegistroTarifa'>
              Observación:
                </label>
            <textarea name='observacion'
              id='observacion'
              value={this.state.observacion}
              className='form-control'
              rows='3'
              placeholder='Observación'
              onChange={this.controlarCambioFormulario} >
            </textarea>
          </div>
        </div>
        {this.state.idEditar != '' &&
          <button className='btn btn-primary centrado' onClick={this.editarDatosRegistro}>Editar Variable</button>
        }
        {this.state.idEditar === '' &&
          <button className='btn btn-primary centrado' onClick={this.agregarDatos}>Agregar Variable</button>
        }
      </Fragment>
    );
  };

  /**
   * Método encargado de controlar el cambio del valor de las variables con raco.
   */
  controlarCambioValor = (evento, posicion, variable) => {
    const listaVariables = [...this.state.listaVariables];
    const index = listaVariables.findIndex(p => p.idConcepto == variable.idConcepto);
    listaVariables[index].listaRaco[posicion].racoValor = evento.target.value;
    this.setState({ listaVariables });
  };

  /**
   * Método encargado de controlar el cambio de la descripción las variables con raco.
   */
  controlarCambioObservacion = (evento, posicion, variable) => {
    const listaVariables = [...this.state.listaVariables];
    const index = listaVariables.findIndex(p => p.idConcepto == variable.idConcepto);
    listaVariables[index].listaRaco[posicion].observacion = evento.target.value;
    this.setState({ listaVariables });
  };

  /**
   * Método encargado de controlar el estado cuando se quieren ingresar nuevas variables.
   */
  controlNuevos = () => {
    this.setState({
      estadoConsulta: {
        resultados: 'MOSTRARDOS',
        controlEditarRaco: true,
        estado: true
      }
    });
  };

  /**
   * Método encargado de mostrar el formulario para variables con registros en raco.
   * @returns {Object}
   */
  renderFormularioConRaco = () => {
    let { estadoConsulta } = this.state;
    const variableSeleccionada = this.retornarVariableSeleccionada();
    if (estadoConsulta.resultados == 'MOSTRARDOS' && estadoConsulta.controlEditarRaco == false) {
      return (
        <Fragment>
          <div className='col-12'>
            <button onClick={this.controlNuevos} className='btn btn-primary centrado'><i className='fa fa-fw fa-info'></i>¿Desea agregar nuevas variables?</button>
          </div>
        </Fragment>
      );
    }
    return (
      <table className='table table-striped mt-8'>
        <thead className='thead-dark'>
          <tr>
            <th scope="col">Concepto</th>
            <th scope="col">Valor Rango</th>
            <th scope="col">Observación</th>
          </tr>
        </thead>
        <tbody>
          {variableSeleccionada.listaRaco.map((dato, index) => (
            <tr key={`raco-${dato.racoIderegistr}`}>
              <td>{`${dato.nombre}(${dato.rangoIni}-${dato - rangoFin})`}</td>
              <td><TextoNumerico
                aceptaDecimales={false}
                aceptaNegativos={false}
                cols={12}
                value={dato.racoValor}
                onChange={(evento) => {
                  this.controlarCambioValor(evento, index, variableSeleccionada)
                }}
                name='racoValor'
              /></td>
              <td>
                <textarea
                  name='observacion'
                  id='observacion'
                  value={dato.observacion}
                  className='form-control'
                  rows='3'
                  placeholder='Observación'
                  onChange={(evento) => {
                    this.controlarCambioObservacion(evento, index, variableSeleccionada)
                  }}>
                </textarea>
              </td>
            </tr>
          ))}
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
        <div className='group-section'>
          <label className='legend-section'>Información De Variables</label>
          <div className='body-section'>
            <div className='row'>
              <Botonera funciones={this.obtenerFunciones()} />
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
              <Combo opciones={this.state.listaVariables}
                propTexto='nombre'
                propValor='idConcepto'
                label='Variable:'
                name='variable'
                value={this.state.variable}
                onChange={this.controlarCambio}
                extra={
                  { disabled: this.state.estadoCampo, readOnly: this.state.estadoCampo }
                }
              />
              <Combo
                opciones={this.state.listaAprovechador}
                propTexto='terNomcompleto'
                propValor='terIderegistro'
                label='Aprovechador:'
                name='aprovechador'
                value={this.state.aprovechador}
                onChange={this.controlarCambio}
                extra={
                  { disabled: this.state.estadoCampo, readOnly: this.state.estadoCampo }
                }
              /><br />
            </div>
            {(this.state.estadoFormulario == false && this.state.variable != '' &&
              this.state.estadoConsulta.estado == true) &&
              this.renderFormularioSinRaco()
            }
            {(this.state.estadoFormulario == true && this.state.variable != ''
              && this.state.estadoConsulta.estado == true && this.state.estadoConsulta.resultados == 'SINRESULTADOS') &&
              this.renderFormularioConRaco()
            }
            {(this.state.estadoFormulario == true && this.state.variable != ''
              && this.state.estadoConsulta.estado == true && this.state.estadoConsulta.resultados == 'MOSTRARDOS') &&
              this.renderFormularioConRaco()
            }
            {(this.state.estadoFormulario == true && this.state.variable != ''
              && this.state.estadoConsulta.estado == true && this.state.estadoConsulta.resultados == 'MOSTRARDOS') &&
              this.renderFormularioSinRaco()
            }
            {this.state.listaDatos.length > 0 &&
              this.renderTabla()
            }
          </div>
        </div>
      </Fragment>
    );
  };
}

CargarVariablesAprovechamiento.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(CargarVariablesAprovechamiento);

export { VistaRedux as RCargarVariablesAprovechamiento };
