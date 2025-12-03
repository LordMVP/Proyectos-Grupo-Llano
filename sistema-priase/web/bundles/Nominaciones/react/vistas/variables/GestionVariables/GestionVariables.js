import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Combo, Botonera, TextArea, TextoNumerico, VentanaModal, Util } from 'appfuture-react';
import { mostrarAlerta } from '../../../store/actions/AplicacionAcciones';
import axios from 'axios';
import RUTAS_API from '../../../global/rutas_api';
import { RConsultaVariables } from '../ConsultaVariables';
import { formatearArray, limpiarHistorico } from '../../../global/util_nominaciones';
import Calculadora from './Calculadora/Calculadora';
import { CLASES_UNIDADES } from '../../../global/constantes';
import { SelectorMultiple } from '../../utils/SelectorMultiple';
import RUTAS_VISTA from '../../../global/rutas_vista';

const tiposCalculo = [
  { valor: 'F', tipo: 'Fórmula' },
  { valor: 'V', tipo: 'Valor' },
];

const estadosVariables = [
  { valor: 'A', estado: 'Activo' },
  { valor: 'E', estado: 'Eliminado' },
];

const tiposVariable = [
  { valor: 'B', tipo: 'Base' },
  { valor: 'N', tipo: 'Constantes' },
  { valor: 'C', tipo: 'Costos' },
  { valor: 'E', tipo: 'Económica' },
  { valor: 'F', tipo: 'Formula' },
];

const frecuencias = [
  { valor: 'D', texto: 'Dias' },
  { valor: 'S', texto: 'Semanas' },
  { valor: 'M', texto: 'Meses' },
  { valor: 'A', texto: 'Años' },
];

class GestionVariables extends Component {

  calculadora = null;

  state = {
    funciones: [],
    variables: [],
    unidadesMedida: [],
    programas: [],
    categorias: [],
    mostrarModalVariables: false,
    idVariable: null,
    variable: '',
    alias: '',
    abreviatura: '',
    tipoCalculo: '-1',
    tipoVariable: '-1',
    unidadMedida: '-1',
    valor: '',
    formula: null,
    decimalesVisualizar: '',
    estado: '-1',
    precision: '',
    periodicidad: '',
    frecuencia: '',
    descripcion: '',
    idPrograma: '',
    categoria: '',
  };

  /**
   * Método encargado de ejecutar acciones al momento de cargar el componente
   */
  componentDidMount() {
    window.addEventListener('beforeunload', this.limpiarFormulario);
    const { state } = this.props.history && this.props.history.location;
    this.consultarObjetos(state);
  }

  /**
   * Método encargado de ejecutar acciones al desmontar el componente
   */
  componentWillUnmount() {
    this.limpiarFormulario();
    window.removeEventListener('beforeunload', this.limpiarFormulario);
  }

  /**
   * Consulta la lista de variables y funciones y las setea en el state.
   */
  consultarListas = () => {
    const params = { criterio: '' };
    const peticiones = [
      axios.post(RUTAS_API.VARIABLES.CONSULTAR_VARIABLES, params),
      axios.post(RUTAS_API.VARIABLES.CONSULTAR_FUNCIONES, params),
    ];
    axios.all(peticiones)
      .then(axios.spread((variables, funciones) => {
        const listaFunciones = formatearArray(funciones.data.datos);
        const listaVariables = formatearArray(variables.data.datos);
        this.setState({ variables: listaVariables, funciones: listaFunciones });
      }));
  };

  /**
   * Consulta las listas que necesitan los combox al iniciar el programa...
   */
  consultarObjetos = (state) => {
    const callBack = () => {
      const data = (state && state.variableEditar) ? state.variableEditar : null;
      this.cargarDatosVariable(data);
    }
    const params = { criterio: '' };
    const peticiones = [
      axios.post(RUTAS_API.VARIABLES.CONSULTAR_FUNCIONES, params),
      axios.post(RUTAS_API.VARIABLES.CONSULTAR_VARIABLES, params),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { ...params, idClase: CLASES_UNIDADES.UNIDAD_MEDIDA }),
      axios.post(RUTAS_API.VARIABLES.CONSULTAR_PROGRAMAS),
      axios.post(RUTAS_API.VARIABLES.CONSULTAR_CATEGORIAS),
    ];
    axios.all(peticiones)
      .then(axios.spread((funciones, variables, unidadesMedida, programas, categorias) => {
        const func = formatearArray(funciones.data.datos);
        const vars = formatearArray(variables.data.datos);
        const unidades = formatearArray(unidadesMedida.data.datos);
        const progs = formatearArray(programas.data.datos);
        const categs = formatearArray(categorias.data.datos);
        this.setState({
          funciones: func,
          variables: vars,
          unidadesMedida: unidades,
          programas: progs,
          categorias: categs
        }, callBack)
      }));
  };

  /**
   * Limpia el objeto state y a su vez el formulario...
   * @param {Function} callback Funcion a ejecutar
   */
  limpiarFormulario = (callback = null) => {
    const obj = {
      mostrarModalVariables: false,
      idVariable: null,
      variable: '',
      alias: '',
      abreviatura: '',
      tipoCalculo: '-1',
      valor: '',
      formula: null,
      estado: '-1',
      precision: '',
      idPrograma: '',

      // Falta asignar estos campos
      tipoVariable: '-1',
      unidadMedida: '-1',
      decimalesVisualizar: '',
      periodicidad: '',
      descripcion: '',
      frecuencia: '-1',
      categoria: '',
      variables: this.quitarSeleccionVariables(),
    };
    if (typeof callback === 'function') {
      this.setState(obj, callback);
      return;
    }
    limpiarHistorico(this.props);
    this.setState(obj);
  };

  /**
   * Elimina un estado (seleccionado) de los objetos de la lista variables
   * y retorna dicha lista modificada.
   * @return {Array}
   */
  quitarSeleccionVariables = () => {
    return this.state.variables.map(v => {
      delete v.seleccionado;
      return v;
    });
  };


  /**
   * Retorna la lista de botones que tendrá el formulario.
   * @return {Array}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Guardar', callback: this.guardarVariable },
      { texto: 'Consultar', callback: this.consultarVariables },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Obtiene el id del concepto o variable.
   * @return {number}
   */
  obtenerId = (formula) => {
    if (formula.tipo == 'con') {
      return (formula.idconcepto) ? formula.idconcepto : formula.id;
    } else if (formula.tipo == 'fun') {
      return (formula.idVariable) ? formula.idVariable : formula.id;
    }
  };

  /**
   * Obtiene la formula que se va a guardar en la base de datos.
   * @return {string}
   */
  obtenerFormula = () => {
    if (this.state.tipoCalculo === 'V') {
      return null;
    }
    let formulas = this.calculadora.obtenerFormula();
    formulas.forEach(formula => {
      formula.id = this.obtenerId(formula);
      delete formula.extra;
      delete formula.idconcepto;
      delete formula.idVariable;
    });
    return JSON.stringify(formulas);
  };

  /**
   * Setea la formula
   * @param {Object} formula Formula a setear
   */
  setFormula = (formula) => {
    this.setState({ formula: formula });
  };

  /**
   * Obtiene la lista de variables que ha agregado el usuario.
   * @return {Array}
   */
  obtenerVariablesRelacionadas = () => {
    return this.state.variables.filter(v => v.seleccionado).map(v => {
      return v.uniConcepto;
    });
  };

  /**
   * Validara el formulario.
   * @return {Object}
   */
  validarFormulario = () => {
    const { variable, alias, abreviatura, tipoCalculo, precision, idPrograma, categoria } = this.state;
    if (!Util.validarStringsRequeridos([variable, alias, abreviatura, tipoCalculo, precision])) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe diligenciar toda la información de la variable para poder continuar' } };
    }

    const { periodicidad, decimalesVisualizar, descripcion, tipoVariable, unidadMedida } = this.state;
    if (!Util.validarStringsRequeridos([periodicidad, decimalesVisualizar, descripcion, tipoVariable, unidadMedida])) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe diligenciar toda la información de la variable para poder continuar' } };
    }

    if (tipoVariable === '' || tipoVariable === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe elegir el tipo de variable' } };
    }

    if (categoria === '' || categoria === '-1' || categoria === -1) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe elegir la categoria' } };
    }

    if (idPrograma === '' || idPrograma === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el programa al cual desea asignar la variable' } };
    }

    if (tipoCalculo === 'F') {
      const formula = this.calculadora.obtenerFormula();
      if (!Util.validarArreglo(formula)) {
        return { respuesta: false, mensaje: { titulo: 'Fórmula inválida', mensaje: 'Debe diligenciar una fórmula para la variable de con tipo cálculo: fórmula' } };
      }
      if (!this.calculadora.validarFormula()) {
        return { respuesta: false, mensaje: { titulo: 'Fórmula inválida', mensaje: 'Verifique la fórmula, se ha encontrado un error en la estructura' } };
      }
    }

    if (tipoCalculo === 'V') {
      const valor = this.state.valor;
      if (isNaN(valor)) {
        return { respuesta: false, mensaje: { titulo: 'Valor Inválido', mensaje: 'El valor de la variable no es válido. Debe ser un número.' } };
      }
    }

    return { respuesta: true };
  };

  /**
   * Guardará el formulario.
   * @returns {Boolean}
   */
  guardarVariable = () => {
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    const variableGuardar = {
      prgIderegistro: this.state.idPrograma,
      uniConcepto: this.state.idVariable || null,
      conNombre: this.state.variable,
      conAlias: this.state.alias.trim(),
      conAbreviatura: this.state.abreviatura.trim(),
      conTipcalculo: this.state.tipoCalculo,
      conValor: this.state.valor || null,
      conFormula: this.obtenerFormula(),
      conPrecision: this.state.precision,
      conEstado: this.state.estado,
      uniPropiedad: JSON.stringify({
        periodicidad: this.state.periodicidad,
        decimalesVisualiza: this.state.decimalesVisualizar,
        descripcion: this.state.descripcion,
        tipoVariable: this.state.tipoVariable,
        unidadMedida: this.state.unidadMedida,
        frecuencia: this.state.frecuencia
      }),
      estConcepto: {
        estIderegistro: this.state.categoria
      },
      listaRelacionados: this.obtenerVariablesRelacionadas()
    };

    axios.post(RUTAS_API.VARIABLES.GUARDAR_VARIABLE, variableGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
          this.consultarListas();
        }
      });

  };

  /**
   * Al establecer la propiedad mostrarModalVariables en true mostrará el modal variables.
   */
  consultarVariables = () => {
    this.setState({ mostrarModalVariables: true });
  };

  /**
   * Controlará el cambio de los campos del formmluario...
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    const { name, value } = evento.target;
    change[name] = value;
    if (name === 'tipoCalculo' && value !== 'F' && this.validarFormula()) {
      this.confirmarCambio(change);
      return;
    }
    this.setState(change);
  };

  /**
   * Validará la formula...
   * @return {Boolean}
   */
  validarFormula = () => {
    if (!this.calculadora) {
      return false;
    }
    return Util.validarArreglo(this.calculadora.obtenerFormula());
  };

  /**
   * Confirmará el cambio de selección de tipo de calculo.
   * @param {Object} change Cambio a ejecutar
   * @param {Object} mensaje Mensaje a mostrar
   * @param {Boolean} borrarFormula Determinara si borrar o no la formula
   */
  confirmarCambio = (change, mensaje = null, borrarFormula) => {
    const botones = [
      {
        clase: 'btn btn-primary',
        texto: 'Aceptar',
        callback: () => {
          if (mensaje == null) {
            change.variables = this.quitarSeleccionVariables();
          }
          this.setState(change, () => {
            if (!this.calculadora || !borrarFormula) {
              return;
            }
            this.calculadora.borrarFormulaActual();
          });
        },
      },
      {
        clase: 'btn btn-default',
        texto: 'Cancelar',
      }
    ];
    this.props.mostrarAlerta('Confirmar', ((mensaje) ? mensaje : 'Se perderá la fórmulas y demás cambios, ¿Desea continuar?'), botones);
  };

  /**
   * Abrirá o cerrará el modal variables.
   */
  abrirCerrarModalVariables = () => {
    this.setState({
      mostrarModalVariables: false
    });
  };

  /**
   * Controlará la selección de variables.
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  seleccionarVariable = (evento) => {
    const variables = [...this.state.variables];
    const value = evento.target.value;
    const index = variables.findIndex(c => c.uniConcepto == value);
    const variableActual = { ...variables[index] };
    variableActual.seleccionado = evento.target.checked;
    variables[index] = variableActual;
    if (Util.validarArreglo(this.state.formula)) {
      const index = this.state.formula.findIndex(f => f.id == variableActual.uniConcepto);
      if (index >= 0 && !evento.target.checked) {
        this.confirmarCambio({ variables: variables, formula: [] }, 'La variable se encuentra agregada en la fórmula, al eliminarla se limpiará la fórmula. ¿Desea continuar?', true);
        return;
      }
    }
    this.setState({ variables: variables });
  };

  /**
   * Autoseleccionará una variable cambiando el estado (seleccionado) de dicha a true
   * y retorna la nueva lista con dichos cambios.
   * @param {Object} variable Datos de la variable seleccionada
   * @return {Array}
   */
  autoSeleccionarVariables = (variable) => {
    let { variables } = this.state;
    variables = this.quitarSeleccionVariables();
    variable.listaRelacionados.forEach(idVariable => {
      const index = variables.findIndex(v => {
        return v.uniConcepto == idVariable;
      })
      if (index >= 0) {
        variables[index].seleccionado = true;
      }
    });
    return variables;
  };

  /**
   * Cargará los datos de la variable...
   * @param {Object} variable Datos de la variable seleccionada
   */
  cargarDatosVariable = (variable) => {
    if (variable == null) {
      return;
    }
    this.limpiarFormulario(() => {
      let uniPropiedad = {};
      try {
        uniPropiedad = JSON.parse(variable.uniUnidad.uniPropiedad);
      } catch (err) {
        console.log('Error al convertir la propiedad: ', variable.uniUnidad.uniPropiedad);
      }

      this.setState({
        mostrarModalVariables: false,

        idVariable: variable.uniConcepto,
        variable: variable.uniUnidad.uniNombre1,
        alias: variable.conAlias,
        abreviatura: variable.conAbreviatura,
        tipoCalculo: variable.conTipcalculo,
        valor: variable.conValor || '',
        formula: (variable.conFormula && JSON.parse(variable.conFormula)) || null,
        estado: variable.conEstado,
        precision: (variable.conPrecision || variable.conPrecision == 0) ? variable.conPrecision : '',
        idPrograma: variable.prgIderegistro,
        variables: this.autoSeleccionarVariables(variable),
        categoria: variable.estConcepto,
        // Falta asignar estos campos
        tipoVariable: (uniPropiedad.tipoVariable) ? uniPropiedad.tipoVariable : '-1',
        unidadMedida: (uniPropiedad.unidadMedida) ? uniPropiedad.unidadMedida : '-1',
        decimalesVisualizar: (uniPropiedad.decimalesVisualiza) ? uniPropiedad.decimalesVisualiza : 0,
        periodicidad: (uniPropiedad.periodicidad) ? uniPropiedad.periodicidad : 0,
        frecuencia: (uniPropiedad.frecuencia) ? uniPropiedad.frecuencia : '-1',
        descripcion: (uniPropiedad.descripcion) ? uniPropiedad.descripcion : '',
      });
    });
  };

  /**
   * Render principal del programa.
   * @return {Component}
   */
  render() {
    return (
      <Fragment>
        <div className="d-flex justify-content-center">
          <Botonera funciones={this.obtenerFunciones()} />
        </div>
        <div className="conf-general row mt-5">

          <Input
            label='Variable:'
            placeholder='Nombre de la variable'
            value={this.state.variable}
            onChange={this.controlarCambio}
            required
            name="variable"
          />

          <Input
            label='Alias:'
            placeholder='Alias de la Variable'
            value={this.state.alias}
            onChange={this.controlarCambio}
            extra={{ maxlength: '10' }}
            required
            name="alias"
          />

          <Input
            label='Abreviatura:'
            placeholder='Abreviatura'
            value={this.state.abreviatura}
            onChange={this.controlarCambio}
            extra={{ maxlength: '20' }}
            required
            name="abreviatura"
          />

          <Combo
            opciones={tiposCalculo}
            propTexto='tipo'
            propValor='valor'
            label='Tipo de Cálculo:'
            value={this.state.tipoCalculo}
            onChange={this.controlarCambio}
            name="tipoCalculo"
          />

          <Combo
            opciones={tiposVariable}
            propTexto='tipo'
            propValor='valor'
            label='Tipo de Variable:'
            value={this.state.tipoVariable}
            onChange={this.controlarCambio}
            name="tipoVariable"
          />

          <Combo
            opciones={this.state.unidadesMedida}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Unidad de Medida:'
            value={this.state.unidadMedida}
            onChange={this.controlarCambio}
            name="unidadMedida"
          />

          {
            this.state.tipoCalculo === 'V' &&
            <TextoNumerico
              label='Valor:'
              placeholder='Valor del concepto'
              value={this.state.valor}
              onChange={this.controlarCambio}
              required
              name="valor"
            />
          }

          <TextoNumerico
            aceptaNegativos={false}
            aceptaDecimales={false}
            label='Décimales Visualizar:'
            placeholder='Número de décimales'
            value={this.state.decimalesVisualizar}
            onChange={this.controlarCambio}
            required
            name="decimalesVisualizar"
          />

          <Combo
            opciones={estadosVariables}
            propTexto='estado'
            propValor='valor'
            label='Estado:'
            name="estado"
            value={this.state.estado}
            onChange={this.controlarCambio}
          />

          <TextoNumerico
            aceptaNegativos={false}
            aceptaDecimales={false}
            label='Precisión:'
            name="precision"
            value={this.state.precision}
            onChange={this.controlarCambio}
            required
          />

          <TextoNumerico
            aceptaNegativos={false}
            label='Periodicidad:'
            name="periodicidad"
            value={this.state.periodicidad}
            onChange={this.controlarCambio}
            required
          />

          <Combo
            opciones={frecuencias}
            propTexto='texto'
            propValor='valor'
            label='Frecuencia periodicidad:'
            name='frecuencia'
            value={this.state.frecuencia}
            onChange={this.controlarCambio}
          />

          <Combo
            opciones={this.state.programas}
            propTexto='prgNombre'
            propValor='prgIderegistro'
            label='Programa:'
            name='idPrograma'
            value={this.state.idPrograma}
            onChange={this.controlarCambio}
          />

          <Combo
            opciones={this.state.categorias}
            propTexto='estNombre'
            propValor='estIderegistro'
            label='Categoria:'
            name='categoria'
            value={this.state.categoria}
            onChange={this.controlarCambio}
          />

          <TextArea
            label="Descripción:"
            name="descripcion"
            value={this.state.descripcion}
            onChange={this.controlarCambio}
          />
        </div>

        {
          this.state.tipoCalculo.toUpperCase() === 'F' &&
          <div className="mt-3 mb-5">
            <SelectorMultiple
              lista={this.state.variables}
              propTexto='uniUnidad.uniNombre1'
              propValor='uniConcepto'
              titulo='Variables'
              seleccionarItem={this.seleccionarVariable}
              cols={4}
            />
            <div className='col-12'>
              <Calculadora ref={(ref) => this.calculadora = ref} mostrarAlerta={this.props.mostrarAlerta} funciones={this.state.funciones} formula={this.state.formula} variables={this.state.variables} setFormula={this.setFormula} />
            </div>
          </div>
        }

        <VentanaModal
          mostrar={this.state.mostrarModalVariables}
          titulo={'Consultar Variables'}
          cerrarModal={this.abrirCerrarModalVariables}
        >
          <RConsultaVariables esModal seleccionarVariable={this.cargarDatosVariable} />
        </VentanaModal>

      </Fragment>
    );
  }

}

GestionVariables.propTypes = {
  history: PropTypes.object,
  mostrarAlerta: PropTypes.func
};

const mapStateToProps = state => {
  return {
    configuracion: state.configuracion.data,
    error: state.configuracion.error,
    tiposConfiguracion: state.configuracion.tiposConfiguracion || []
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    mostrarAlerta,
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionVariables);

export { VistaRedux as RGestionVariable };
