import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';
import { mostrarAlerta } from '../../store/actions/AplicacionAcciones';

import './IndicadoresCalidad.scss';
//import { NULL } from 'node-sass';

const listaCertificado = [
  { texto: 'Certificado', id: 'CE' },
  { texto: 'Pendiente', id: 'P' },
  { texto: 'Cancelado', id: 'CA' },
];

const listaCategoriasIcircf = [
  { texto: 'Aseo', id: '1' },
  { texto: 'Energia', id: '2' }
];

const listaVarAbreviaturas = [
  { id: 'vb' },
  { id: 'P' },
  { id: 'CA' },
];

const CERTIFICADO = 'CE';
const ANULADO = 'CA';
const PENDIENTE = 'P';


class IndicadoresCalidad extends Component {

  state = {
    // Datos de la entidad
    valor: '',
    observacion: '',
    periodo: '',
    areaPrestacion: '',
    variable: '',
    idEditar: '',
    // Listas de la aplicación
    listaVariables: [],
    listaAreaPrestacion: [],
    listaPeriodo: [],
    listaDatos: [],
    // Estado de la aplicacion
    estadoCampo: false,
    estadoFormulario: false,
    idControl: true,
    /** Variable para validar si ya se consulto y si la consulta devolvio resultados */
    estadoConsulta: {
      estado: false,
      resultados: '',
      controlEditarRaco: false,
    },
    estadoIndice:''
  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
    axios.post(RUTAS_API.PARAMETRIZACION.AREAS_PRESTACION.FILTRO, { criterio: '' })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({
            listaAreaPrestacion: respuesta.data.datos
          });
        }
      });
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
      console.log("a->",a);
      gruposRaco[idConcepto].push(a);
    });
    let listaFinal = [];
    for (const idConcepto in gruposRaco) {
      let listaRaco = [];
      let listaRuta = [];
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
      if(idConcepto==3190){//AJUSTE
        axios.post(RUTAS_API.PARAMETRIZACION.ADMINISTRAR_RUTAS_RECOLECCION.CONSULTAR_TIPO_RUTA,{ tipoRuta : 'MicroRuta'  })
        .then(respuesta => {
          if (respuesta.data.codigo > 0) {
              respuesta.data.datos.map((dato)=>{
                listaRuta.push({
                  rutIderegistro: dato.rutIderegistro,
                  rutNombre: dato.rutNombre,
                  rutValor: 0
                })
              }

              )
              console.log("listaRuta->"+listaRuta);
          }
        });
      }
      let obj = {
        idConcepto: idConcepto,
        nombre: (listaRaco.length > 0) ? listaRaco[0].nombre : grupoRaco[0].conNombre,
        listaRaco: listaRaco,
        listaRuta: listaRuta
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
   * Método encargado de convertir la fecha ingresada a Date
   * @param {string} fechaNumero fecha seleccionada por el usuario
   * @returns {Date}
   */
     obtenerFechaCompleta = (fechaNumero) => {
      let fecha = new Date(fechaNumero);
      fecha = (fecha.getFullYear() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getDate());
      return fecha;
    };

  /**
   * Método encargado de contruir un objeto con los periodos consultados.
   * @param {Object} periodos Datos de los periodos consultados.
   * @returns {Object}
   */
  construirObjetoPeriodos = (periodos) => {
    return periodos.map((dato) => ({
      idRegistro: dato.perIdepadre.perIderegistro, //se actualiza identificador del periodo
      nombre: `${dato.perIdepadre.perNombre}-${this.obtenerFecha(dato.perIdepadre.perFecinicial)}`
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
      estadoCampo: false,
      estadoFormulario: false,
      idControl: true,
      estadoConsulta: {
        estado: false,
        resultados: '',
        controlEditarRaco: false,
      },
      listaDatos: [],
      estadoIndice:''
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
    const { estadoIndice } = this.state;
    let funciones = [];
    if (estadoIndice != "CERTIFICADO") {
      funciones.push({ texto: 'Guardar', callback: this.guardarEntidad });
    }
    funciones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    return funciones;
  };

  /**
   * Método encargado de consultar las variables por área de prestación, concepto y periodo
   */
  consultarEntidad = () => {
    const { periodo, areaPrestacion, variable } = this.state;
    const validacion = this.validarFormularioConsultar();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    const parametros = {
      periodo: periodo,
      areaPrestacion: areaPrestacion,
      concepto: variable
    };
    axios.post(RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS.CONSULTAR_VARIABLES, parametros)
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
              estadoIndice: 'CERTIFICADO'
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
            },
            estadoIndice: 'CERTIFICADO'
          });
          return;
        }
        
        const formulario = (variable.listaRaco.length > 0)? true : false;//se valida el tipo de formulario a mostrar 
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
   * Método encargado de consultar las variables por área de prestación, concepto y periodo
   */
   consultarEntidadRutas = () => {
    const { periodo, areaPrestacion, variable } = this.state;
    const validacion = this.validarFormularioConsultar();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    const parametros = {
      periodo: periodo,
      areaPrestacion: areaPrestacion,
      concepto: variable,
      tipoRuta: 'micro'
    };
    console.log("adentro de entidades")
    axios.post(RUTAS_API.PARAMETRIZACION.ADMINISTRAR_RUTAS.CONSULTAR_RUTAS_INDICADORES_CERTIFICADOS, parametros)
      .then(respuesta => {
        const variable = this.retornarVariableSeleccionada();
        if (respuesta.data.codigo > 0) {
          // if (variable.listaRuta.length > 0) {
          //   this.setState({
          //     listaDatos: this.construirObjetoTabla(respuesta.data.datos),
          //     estadoCampo: true,
          //     estadoFormulario: true,
          //     estadoConsulta: {
          //       estado: true,
          //       resultados: 'MOSTRARDOS',
          //       controlEditarRaco: false,
          //     },
          //     idControl: false,
          //   });
          //   return;
          // }
          this.setState({
            listaDatos: this.construirObjetoTablaRuta(respuesta.data.datos),
            estadoCampo: true,
            estadoFormulario: true,
            estadoConsulta: {
              estado: true,
              resultados: 'CONRESULTADOSRUTAS',
              idControl: true
            },
            estadoIndice: 'CERTIFICADO'
          });
          return;
        }
        
        // const formulario = (variable.listaRaco.length > 0)? true : false;//se valida el tipo de formulario a mostrar 
        this.setState({
          estadoFormulario:true,
          estadoConsulta: {
            estado: true,
            resultados: 'SINRESULTADOSRUTAS',
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
    return datosVariables.map((dato, index) => {
      textoEstado = listaCertificado.find(p => p.id == dato.varcEstado.trim())
      return {
        racoValor: dato.varcValor,
        estado: textoEstado.texto,
        observacion: (dato.varcDescripcion != '') ? dato.varcDescripcion : '',
        varcIderegistro: dato.varcIderegistro,
        idEstado: textoEstado.id,
        idEditar: Util.generarIdControl("datos"),
        racoIderegistr: dato.racoIderegistro.racoIderegistr ,
        rangoIni: dato.racoIderegistro.racoRaninicial ,
        rangoFin: dato.racoIderegistro.racoRanfinal
      }
    });
  }; 


  /**
   * Método encargado de construir un objeto para mostrar los datos de las variables.
   * @param {Object} datosVariables Datos de las variables consultadas.
   * @returns {Array}
   */
   construirObjetoTablaRuta = (datosVariables) => {
    let textoEstado = '';
    return datosVariables.map((dato, index) => {
      textoEstado = listaCertificado.find(p => p.id == dato.vrmrEstado.trim())
      return {
        rutValor: dato.vrmrValor,
        rutNombre:  dato.rutIdemicroruta.rutNombre,
        rutFechaCertificacion: dato.vrmrFeccerficicacion,
        estado: textoEstado.texto,
        observacion: (dato.varcDescripcion != '') ? dato.varcDescripcion : '',
        varcIderegistro: dato.varcIderegistro,
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
    const { areaPrestacion, periodo, variable } = this.state;
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

    return { respuesta: true };
  };

  /**
   * Método encargado de validar las variables del formulario.
   * @returns {Object}
   */
  validarFormulario = () => {
    const { areaPrestacion, periodo, variable, listaDatos, estadoConsulta } = this.state;
    const variableSeleccionada = this.retornarVariableSeleccionada();
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
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingregar el valor.' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de obtener el objeto para guardar.
   * @returns {Array}
   */
  obtenerObjetoGuardar = () => {
    console.log("objetoguardar");
    const { listaDatos, periodo, areaPrestacion, variable, estadoConsulta } = this.state;
    const variableSeleccionada = this.retornarVariableSeleccionada();
    console.log("variableselected->"+estadoConsulta.resultados);
    if (variableSeleccionada.listaRaco.length > 0 && estadoConsulta.resultados == 'MOSTRARDOS'
      && estadoConsulta.controlEditarRaco == true) {
      for (let index = 0; index < variableSeleccionada.listaRaco.length; index++) {
        const variable = variableSeleccionada.listaRaco[index];
        variable.idEstado = 'P';
        listaDatos.push(variable);
      }
      return listaDatos.map(dato => {
        return {
          varcIderegistro: (dato.varcIderegistro) ? dato.varcIderegistro : null,
          perIderegistro: {
            perIderegistro: periodo //se actualiza identificador del periodo
          },
          conIderegistro: {
            uniConcepto: {
              uniIderegistro: variable
            }
          },
          arprIderegistro: {
            arprIderegistro: areaPrestacion
          },
          varcValor: dato.racoValor,
          varcDescripcion: (dato.observacion != '') ? dato.observacion : '',
          varcEstado: CERTIFICADO,
          racoIderegistro: {
            racoIderegistr: dato.racoIderegistr
          }
        }
      });
    }
    if (variableSeleccionada.listaRaco.length > 0 && estadoConsulta.resultados == 'SINRESULTADOS') {
      return variableSeleccionada.listaRaco.map(dato => {
        return {
          varcIderegistro: (dato.varcIderegistro) ? dato.varcIderegistro : null,
          perIderegistro: {
            perIderegistro: periodo //se actualiza identificador del periodo
          },
          conIderegistro: {
            uniConcepto: {
              uniIderegistro: variable
            }
          },
          arprIderegistro: {
            arprIderegistro: areaPrestacion
          },
          varcValor: dato.racoValor,
          varcDescripcion: (dato.observacion != '') ? dato.observacion : '',
          varcEstado: CERTIFICADO,
          racoIderegistro: {
            racoIderegistr: dato.racoIderegistr
          }
        }
      });
    };
    if (estadoConsulta.resultados == 'SINRESULTADOSRUTAS') {
      console.log("dentro de sinresultadorutas");
      return variableSeleccionada.listaRuta.map(dato => {
        return {
          vrmrIderegistro: null,
          perIderegistro: {
            perIderegistro: periodo //se actualiza identificador del periodo
          },
          conIderegistro: {
            uniConcepto: {
              uniIderegistro: variable
            }
          },
          arprIderegistro: {
            arprIderegistro: areaPrestacion
          },
          vrmrValor: dato.rutValor,
          varcDescripcion: (dato.observacion != '') ? dato.observacion : '',
          varcEstado: CERTIFICADO,
          rutIdemicroruta: {
            rutIderegistro: dato.rutIderegistro
          }
        }
      });
    }
    return listaDatos.map(dato => {
      return {
        varcIderegistro: (dato.varcIderegistro) ? dato.varcIderegistro : null,
        perIderegistro: {
          perIderegistro: periodo //se actualiza identificador del periodo
        },
        conIderegistro: {
          uniConcepto: {
            uniIderegistro: variable
          }
        },
        arprIderegistro: {
          arprIderegistro: areaPrestacion
        },
        varcValor: dato.racoValor,
        varcDescripcion: (dato.observacion != '') ? dato.observacion : '',
        varcEstado: CERTIFICADO,
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
    let rutaguardar="";
    const { estadoConsulta } = this.state;
    const validacion = this.validarFormulario();
    const variableSeleccionada = this.retornarVariableSeleccionada();
    //console.log("variable retornada-------------------------\n "+variableSeleccionada.idConcepto)
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    if(variableSeleccionada.idConcepto!=3190){
      const validacionTablaRaco = this.validarTablaRaco();
      if (variableSeleccionada.listaRaco.length > 0 && estadoConsulta.resultados == 'SINRESULTADOS') {
        if (!validacionTablaRaco.respuesta) {
          this.props.mostrarAlerta(validacionTablaRaco.mensaje.titulo, validacionTablaRaco.mensaje.mensaje);
          return false;
        }
      }
      rutaguardar = RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS.GUARDAR;
    }else{
      rutaguardar = RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS.GUARDAR_MICRO;
    }
    console.log("obtenerobjeto->"+this.obtenerObjetoGuardar());
    const entidadGuardar = this.obtenerObjetoGuardar();

    axios.post(rutaguardar, entidadGuardar)
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
    const textoEstado = listaCertificado.find(p => p.id === 'P');
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
    estadoFormulario = false;
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
    const { areaPrestacion, variable, periodo } = this.state;
    if (areaPrestacion > 0, variable > 0, periodo > 0) {
      if(variable==3190){
        this.consultarEntidadRutas();
      }else{
        console.log("variables->"+variable);
        this.consultarEntidad();
      }
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
      axios.post(RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS.CONSULTAR_PERIODOS_SEMESTRALES, { idArea: idArea }),
      axios.post(RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS.CONSULTAR_CONCEPTOS_INDICADORES),
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
        console.log("listaVariables-------\n"+JSON.stringify(datosAplicacion.listaVariables))
        this.setState({ ...datosAplicacion });
      }));
  };

  /**
   * Método encargado de editar la variable seleccionada.
   * @returns {Bool}
   */
  editarDatosRegistro = () => {
    const { listaDatos, valor, observacion, idEditar } = this.state;
    let { idControl } = this.state;
    const validacion = this.validarFormularioTabla();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    const index = listaDatos.findIndex(p => p.idEditar == idEditar);
    listaDatos[index].racoValor = valor;
    listaDatos[index].observacion = observacion;
    const variable = this.retornarVariableSeleccionada();
    if (variable.listaRaco.length > 0) {
      idControl = false
    }
    this.setState({
      listaDatos: listaDatos,
      estado: '',
      idEditar: '',
      valor: '',
      observacion: '',
      idControl: idControl
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
      <table className='table table-bordered mt-8'>
          <thead className='thead-dark'>
            <tr>
              <th scope="col">Rango</th>
              <th scope="col">Valor</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
        <tbody> {
          this.state.listaDatos.map((dato, index) => {
            return (
              <tr key={dato.idEditar}>
                <td>{((dato.rangoIni != '') ||(dato.rangoIni != NULL) || (dato.rangoIni != undefined)) ? listaCategoriasIcircf.find(p => p.id == dato.rangoIni).texto : '-'}</td>
                <td>{dato.racoValor}</td>
                <td>{dato.estado}</td>
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
    console.log("renderFormularioSinRaco 1");
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
        {(this.state.idEditar === '' && this.state.idControl == true) &&
          <button className='btn btn-primary centrado' onClick={this.agregarDatos}>Agregar Variable</button>
        }
      </Fragment>
    );
  };

  /**
   * Método encargado de controlar el cambio del valor de las variables con raco.
   */
  controlarCambioValorRuta = (evento, posicion, variable) => {
    const listaVariables = [...this.state.listaVariables];
    const index = listaVariables.findIndex(p => p.idConcepto == variable.idConcepto);
    listaVariables[index].listaRuta[posicion].rutValor = evento.target.value;
    this.setState({ listaVariables });
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
    console.log("renderFormularioConRaco 2");
    let { estadoConsulta,variable} = this.state;
    let textoMostrar = '';
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
    //Se valida que la variable tenga rangos
    if(!Util.validarArreglo(variableSeleccionada.listaRaco)){
      return;
    }
    //const listadoCategorias = listaCategoriasIcircf.find(e => e.id =  );
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
          { variableSeleccionada.listaRaco.map((dato, index) => 
          (
            <tr key={`raco-${dato.racoIderegistr}`}>
              <td>{`${dato.nombre} - ${listaCategoriasIcircf.find(p => p.id == dato.rangoIni).texto}`}</td>
              <td><TextoNumerico
                aceptaDecimales={true}
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
   * Método encargado de mostrar el formulario para variables con registros en raco.
   * @returns {Object}
   */
     renderFormulariosinRuta = () => {
      let { estadoConsulta,variable } = this.state;
      let textoMostrar = '';
      const variableSeleccionada = this.retornarVariableSeleccionada();
      // if (estadoConsulta.resultados == 'MOSTRARDOS' && estadoConsulta.controlEditarRaco == false) {
      //   return (
      //     <Fragment>
      //       <div className='col-12'>
      //         <button onClick={this.controlNuevos} className='btn btn-primary centrado'><i className='fa fa-fw fa-info'></i>¿Desea agregar nuevas variables?</button>
      //       </div>
      //     </Fragment>
      //   );
      // }
      //Se valida que la variable tenga rangos
      // if(!Util.validarArreglo(variableSeleccionada.listaRaco)){
      //   return;
      // }

      console.log('VariableSeleccionada->'+JSON.stringify(variableSeleccionada));
      return (
        <table className='table table-bordered mt-8'>
          <thead className='thead-dark'>
            <tr>
              <th scope="col">N°</th>
              <th scope="col">Micro Ruta</th>
              <th scope="col">Valor</th>
            </tr>
          </thead>
          <tbody>
            { variableSeleccionada.listaRuta.map((dato, index) => 
            (
              <tr key={`raco-${dato.rutIderegistro}`}>
                <td>{`${index} `}</td>
                <td>{`${dato.rutNombre} `}</td>
                <td><TextoNumerico
                  aceptaDecimales={true}
                  aceptaNegativos={false}
                  cols={12}
                  value={dato.rutValor}
                  onChange={(evento) => {
                    this.controlarCambioValorRuta(evento, index, variableSeleccionada)
                  }}
                  name='rutValor'
                /></td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    };

    /**
   * Método encargado de mostrar el formulario para variables con registros en raco.
   * @returns {Object}
   */
     renderFormularioconRuta = () => {
      console.log("conRuta");
      let { estadoConsulta,variable } = this.state;
      let textoMostrar = '';
      const variableSeleccionada = this.retornarVariableSeleccionada();
      // if (estadoConsulta.resultados == 'MOSTRARDOS' && estadoConsulta.controlEditarRaco == false) {
      //   return (
      //     <Fragment>
      //       <div className='col-12'>
      //         <button onClick={this.controlNuevos} className='btn btn-primary centrado'><i className='fa fa-fw fa-info'></i>¿Desea agregar nuevas variables?</button>
      //       </div>
      //     </Fragment>
      //   );
      // }
      //Se valida que la variable tenga rangos
      // if(!Util.validarArreglo(variableSeleccionada.listaRaco)){
      //   return;
      // }

      console.log('VariableSeleccionada->'+JSON.stringify(variableSeleccionada));
      return (
        <table className='table table-bordered mt-8'>
          <thead className='thead-dark'>
            <tr>
              <th scope="col">N°</th>
              <th scope="col">Micro Ruta</th>
              <th scope="col">Valor</th>
              <th scope="col">Fecha Certificacion</th>
            </tr>
          </thead>
          <tbody> {
          this.state.listaDatos.map((dato, index) => {
            return (
              <tr key={dato.idEditar}>
                <td>{index+1}</td>
                <td>{dato.rutNombre}</td>
                <td> {dato.rutValor} </td>
                <td> {this.obtenerFechaCompleta(dato.rutFechaCertificacion)} </td>
              </tr >
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
        <div className='group-section'>
          <label className='legend-section' > Información De Variables </label>
          <div className='body-section'>
            <Botonera funciones={this.obtenerFunciones()} />
            <div className='row mt-8'>
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
              {/*(this.state.estadoFormulario == false && this.state.variable != '' &&//resultados=CONRESULTADOS
                this.state.estadoConsulta.estado == true) &&
                this.renderFormularioSinRaco()*/
              }
              {(this.state.estadoFormulario == true && this.state.variable != ''
                && this.state.estadoConsulta.estado == true && this.state.estadoConsulta.resultados == 'SINRESULTADOS') &&
                this.renderFormularioConRaco()
              }
              {/*(this.state.estadoFormulario == true && this.state.variable != ''
                && this.state.estadoConsulta.estado == true && this.state.estadoConsulta.resultados == 'MOSTRARDOS') &&
                this.renderFormularioConRaco()*/
              }
              {/*(this.state.estadoFormulario == true && this.state.variable != ''
                && this.state.estadoConsulta.estado == true && this.state.estadoConsulta.resultados == 'MOSTRARDOS') &&
                this.renderFormularioSinRaco()*/
              }
              {(this.state.estadoFormulario == true && this.state.variable != ''
                && this.state.estadoConsulta.estado == true && this.state.estadoConsulta.resultados == 'SINRESULTADOSRUTAS') &&
                this.renderFormulariosinRuta()
              }
              {(this.state.estadoFormulario == true && this.state.variable != ''
                && this.state.estadoConsulta.estado == true && this.state.estadoConsulta.resultados == 'CONRESULTADOSRUTAS') &&
                this.renderFormularioconRuta()
              }
              {
                (this.state.listaDatos.length > 0 && this.state.estadoConsulta.resultados != 'CONRESULTADOSRUTAS') &&
                this.renderTabla()
              }
            </div>
          </div >
        </div>
      </Fragment>
    );
  };
}

IndicadoresCalidad.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IndicadoresCalidad);

export { VistaRedux as RIndicadoresCalidad };
