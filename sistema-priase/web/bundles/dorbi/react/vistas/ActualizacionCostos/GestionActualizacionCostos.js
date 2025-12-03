import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes, { element } from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, Fecha } from 'appfuture-react';
import axios from 'axios';
import { formatearArray } from '../../global/util_nominaciones';
import RUTAS_API from '../../global/rutas_api';
import { mostrarAlerta } from '../../store/actions/AplicacionAcciones';
import './GestionActualizacionCostos';
import './GestionActualizacionCostos.scss';
import Switch from "react-switch";
import moment from 'moment';


class GestionActualizacionCostos extends Component {
  REGEX_DECIMAL = /^[+-]?\d*\.?\d{0,99}$/g;
  REGEX_DECIMAL_20 = /^[+-]?\d*\.?\d{0,20}$/g;
  constructor(props) {
    super(props);
    this.state = {
      areaPrestacionSelected: '',
      periodoSelected: '',
      mesPeriodoSelected: '',
      indicadorSelected: '',
      AProductividadCheckeado: false,
      listaAreaPrestacion: [],
      listaPeriodo: [],
      listaPeriodoSinSeleccionar: [],
      listaAnio: [],
      listaIndicador: [],
      listaInfoTabla: [],
      listaDatosTabla: [],
      listaDatosTabla2: [],
      areaFSelected: false,
      anioFSelected: false,
      periodoFSelected: false,
      indicadorFSelected: false,
      valorIndicador: '',
      idMesSelected: 0,
      valorProductividad: '',
      verTabla: false,
      VariacionTotal: 0,
    };
  }

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    this.setState({ valorIndicador: '', valorProductividad: '', });
    this.consultarAreaPrestacion();
    this.consultarIndicador();
  };

  consultarAreaPrestacion = () => {
    axios.post(RUTAS_API.PARAMETRIZACION.AREAS_PRESTACION.FILTRO, { criterio: "" })
      .then(respuesta => {
        this.setState({ listaAreaPrestacion: respuesta.data.datos });
      });
  }

  /**
 * Método encargado de consultar los periodos semestrales por área de prestación.
 * @param {Number} idArea Identificador del área de prestación.
 */
  consultarAnioDePeriodo = (idArea) => {
    axios.post(RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS.CONSULTAR_MESES_PERIODO, { idArea: idArea })
      .then(respuesta => {
        const { listaAnio, listaPeriodo } = this.construirObjetoAniosPeriodos(respuesta.data.datos);
        listaPeriodo.sort((a, b) => (a.numeroMes > b.numeroMes) ? 1 : -1);
        this.setState({
          listaAnio: formatearArray(listaAnio),
          listaPeriodoSinSeleccionar: formatearArray(listaPeriodo),
        });
      });
  };

  /**
    * Método encargado de consultar liquidacion
  */
  consultarIndicador = () => {
    //TODO: verificar este 2408
    axios.post(RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS.CONSULTAR_CONCEPTOS_INDICADOR_PRODUCTIVIDAD,)
      .then(respuesta => {
        this.setState({ listaIndicador: formatearArray(this.construirObjetIndicador(respuesta.data.datos)) });
        console.log("indicador:dsa", this.state.listaIndicador);
      });
  };

  filtrarPeriodos(value) {
    console.log("lista eriodo sin seleccionar:", this.state.listaPeriodoSinSeleccionar);
    this.setState({ listaPeriodo: formatearArray(this.state.listaPeriodoSinSeleccionar.filter(x => x.idPeriodo === +value)) });
  }

  /**
    * Método encargado de contruir un objeto con los periodos consultados.
    * @param {Object} periodos Datos de los periodos consultados.
    * @returns {Object}
    */
  construirObjetoAniosPeriodos = (periodos) => {
    let listaPeriodo = [], listaAnio = [];
    periodos.map((dato) => {
      listaPeriodo.push({
        idRegistroMes: dato.perIdeRegistro,
        titulo: `${dato.smperDescripcion}`,
        anio: dato.perFecInicial,
        idPeriodo: dato.perIdEPadre,
        numeroMes: dato.smperNumero,
      })
      listaAnio.push({
        titulo: `${dato.perFecInicial} - ${dato.nombrePeriodo}`,
        perIderegistro: dato.perIdEPadre,
      });
    });
    listaAnio = [...new Map(listaAnio.map(item => [item["perIderegistro"], item])).values()];
    console.log(listaPeriodo);
    return { listaPeriodo, listaAnio }
  };

  /**
 * Método encargado de construir un objeto con los años consultados
 * @param {Object} anios Años consultados
 * @returns {Array}
 */
  construirObjetIndicador = (listaIndicador) => {
    const listaVariaciones = listaIndicador.filter(x => x.conAlias.includes('VAR_'));
    const listaIndicadores = listaIndicador.filter(x => !x.conAlias.includes('VAR_'));
    return listaIndicadores.map((indicador) => (
      {
        titulo: indicador.conNombre,
        perIdIndicador: indicador.uniConcepto,
        perNombre: indicador.conAlias,
        idVariacion: listaVariaciones.filter(x => x.conAlias === `VAR_${indicador.conAlias}`)[0].uniConcepto,
      }));
  }


  /**
   * Método encargado de limpiar los campos del formulario
   */
  limpiarFormulario = () => {
    //TODO: limpiar check
    this.setState({
      areaPrestacionSelected: -1,
      periodoSelected: -1,
      mesPeriodoSelected: -1,
      indicadorSelected: -1,
      areaFSelected: false,
      anioFSelected: false,
      periodoFSelected: false,
      indicadorFSelected: false,
    });
  };

  /**
   * Método encargado de limpiar los datos del formulario al momento de cambiar de interfaz.
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
      { texto: 'Guardar', callback: this.guardar },
      { texto: 'Cancelar', callback: this.limpiarFormulario }
    ];
  };


  validarPeriodoIngresado = () => {
    let resultado = this.state.listaDatosTabla2.filter(item => item.perIdRegistro == this.state.mesPeriodoSelected);
    return resultado;
  };

  /**
   * Método encargado de guardar los datos de la entidad
   * @returns {bool}
   */
  guardar = (e) => {
    e.preventDefault();

    const resultadoValidacion = this.validarPeriodoIngresado();

    if (resultadoValidacion.length > 0 && this.state.valorIndicador != 0) {
      const peticion = {
        valorActualizacion: this.state.valorIndicador,
        idVariacion: resultadoValidacion[0].idRegistro,
      };
      axios.post(RUTAS_API.GESTION_COSTOS_PRODUCTIVIDAD.CAMBIO_BASE_VARIACIONES, peticion)
        .then(respuesta => {
          this.calcularValoresTabla(this.state.indicadorSelected)
        });
    } else {
      if (this.state.indicadorSelected != '' &&
        this.state.areaPrestacionSelected != '' &&
        this.state.periodoSelected != '' &&
        this.state.mesPeriodoSelected != '' &&
        this.state.valorIndicador != 0) {
        let valorProductividadTotal = (this.state.valorProductividad != 0 && this.state.AProductividadCheckeado) ? this.obtenerUltimaVariacion() : null;
        const peticion = {
          idArea: this.state.areaPrestacionSelected,
          idConcepto: this.state.indicadorSelected,
          idPeriodo: this.state.periodoSelected,
          idMes: this.state.mesPeriodoSelected,
          valorIngresado: this.state.valorIndicador,
          valorProductividad: valorProductividadTotal || 0,
          tieneProductividad: this.state.AProductividadCheckeado,
          valorAcumulado: Number(this.state.valorIndicador / this.obtenerUltimaVariacion()) || 0,
          idIndicadorVariacion: this.state.listaIndicador.filter(x => x.perIdIndicador == this.state.indicadorSelected)[0].idVariacion || 0,
          valorFactorProductividad: this.state.valorProductividad || 0,
        }
        axios.post(RUTAS_API.GESTION_COSTOS_PRODUCTIVIDAD.INSERTAR_VALORES, peticion)
          .then(respuesta => {
            this.calcularValoresTabla(this.state.indicadorSelected)
          });
      } else {
        this.props.mostrarAlerta("Error", "faltan datos por ingresar al sistema");
      }

    }
    this.setState({ valorIndicador: '', valorProductividad: '' });
  };

  obtenerUltimaVariacion() {
    let resultado = this.state.listaDatosTabla2.filter(x => x.bandera && x.bandera.trim() === 'A');
    if (resultado.length === 0) { return 0 };
    let valorResultado = resultado.sort((a, b) => (a.idRegistro > b.idRegistro) ? 1 : -1)[resultado.length - 1];
    if (valorResultado.perIdRegistro === +this.state.mesPeriodoSelected) {
      //return this.state.valorIndicador - Number(this.state.valorProductividad);
      return this.state.valorIndicador;
    }
    console.log("valor acumulado: ", valorResultado.valor)
    //return valorResultado.valor - Number(this.state.valorProductividad);
    return valorResultado.valor;
    //}
  }

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    console.log(evento.target);
    const { name, value } = evento.target;
    const sel = value != -1 ? true : false;
    if (name === "indicador") {
      this.setState({
        indicadorSelected: value,
        indicadorFSelected: sel,
      });
      this.calcularValoresTabla(value);
    }
    if (name === "areaPrestacion") {
      this.setState({
        areaPrestacionSelected: value,
        listaPeriodo: [],
        mesPeriodoSelected: '',
        areaFSelected: sel,
        periodoFSelected: false,
        indicadorFSelected: false,
        indicadorSelected: '',
        listaAnio: [],
        periodoSelected: '',
      });
      sel && this.consultarAnioDePeriodo(value);
    }
    if (name === "anio") {
      this.setState({
        periodoSelected: value,
        anioFSelected: sel,
        listaPeriodo: [],
        mesPeriodoSelected: '',
        periodoFSelected: false,
        indicadorFSelected: false,
        indicadorSelected: '',
      });
      this.filtrarPeriodos(value);
    }
    if (name === "periodo") {
      this.setState({
        mesPeriodoSelected: value,
        periodoFSelected: sel,
        indicadorFSelected: false,
        indicadorSelected: '',
      });
    }
    change[evento.target.name] = evento.target.value;
    this.setState(change, this.controlarConsulta);
  };

  calcularValoresTabla(value) {
    const idVariacion = this.state.listaIndicador.filter(x => x.perIdIndicador == value)[0].idVariacion;
    console.log("--", idVariacion)
    this.calculoTotalAcumulado(idVariacion)
    axios.post(RUTAS_API.GESTION_COSTOS_PRODUCTIVIDAD.OBTENER_VARIACIONES, {
      idArea: this.state.areaPrestacionSelected,
      idPeriodo: this.state.periodoSelected,
      idConcepto: value
    })
      .then(respuesta => {
        this.setState({ verTabla: true });
        let listaInfoTabla = [], listaDatosTabla = []
        let datosTabla1 = {}, datosTabla2 = {};
        if (respuesta.data.datos == null) {
          this.setState({ verTabla: false });
          return;
        }
        // respuesta.data.datos.sort((a, b) => (a.perIdRegistro > b.perIdRegistro) ? 1 : -1);

        respuesta.data.datos.map((item, i) => {
          console.log(item, i)
          listaDatosTabla.push({
            idRegistro: item.idRegistro,
            valor: item.valor,
            perIdRegistro: item.perIdRegistro,
            accessor: item.accessor,
            header: item.header,
            bandera: item.bandera,
          });
          if (item.bandera && item.bandera.trim() == 'A') {
            listaInfoTabla.push({ Header: item.header, accessor: item.accessor + i });
            console.log("Datos TABLA", 1, datosTabla1 === {});
            datosTabla1 = { ...datosTabla1, [item.accessor + i]: Number(item.valor) }
            return {
              listaDatosTabla, listaInfoTabla
            }
          }

        });

        listaInfoTabla.unshift({
          Header: this.state.listaIndicador.filter(item => item.perIdIndicador == value)[0].perNombre,
          accessor: 'inicial'
        });
        listaInfoTabla.push({
          Header: 'Acumulado Total',
          accessor: 'totalAcumulado'
        });

        axios.post(RUTAS_API.GESTION_COSTOS_PRODUCTIVIDAD.OBTENER_VARIACIONES, {
          idArea: this.state.areaPrestacionSelected,
          idPeriodo: this.state.periodoSelected,
          idConcepto: idVariacion
        }).then(respuesta => {
          console.log("resppuesta acumulado", respuesta.data.datos)
          respuesta.data.datos.sort((a, b) => (a.perIdRegistro > b.perIdRegistro) ? 1 : -1);
          listaDatosTabla.map((item, i) => {
            if (item.bandera && item.bandera.trim() == 'A') {
              const dato = respuesta.data.datos.filter(x => x.perIdRegistro == item.perIdRegistro).length > 0 ? 
              respuesta.data.datos.filter(x => x.perIdRegistro == item.perIdRegistro)[0].varceIdConceptoAplicado==null
              ?
              Number(respuesta.data.datos.filter(x => x.perIdRegistro == item.perIdRegistro)[0].valor).toFixed(4)
              : Number(respuesta.data.datos.filter(x => x.perIdRegistro == item.perIdRegistro)[0].valor).toFixed(4)
              : 0;
              datosTabla2 = { ...datosTabla2, [item.accessor + i]: dato }
            }
          });
          console.log("datos2: ", datosTabla2)
          let tablaRender = [{ inicial: 'Valor Indicador', ...datosTabla1, totalAcumulado: '' },
          { inicial: 'Acumulado', ...datosTabla2, totalAcumulado: this.state.VariacionTotal }];
          this.setState({ listaInfoTabla: listaInfoTabla, listaDatosTabla: tablaRender, listaDatosTabla2: listaDatosTabla })
        });
      });

  }
    /**
   * Método encargado de consultar los periodos semestrales por área de prestación.
   * @param {Number} idArea Identificador del área de prestación.
   */
   /*   calculoTotalAcumulado = async (value) => {
      console.log("🚀 ~ file: GestionActualizacionCostos.js:384 ~ calculoTotalAcumulado= ~ value", value)
      console.log("🚀 ~ file: GestionActualizacionCostos.js:384 ~ calculoTotalAcumulado= ~ this.state.periodoSelected", this.state.periodoSelected)
      console.log("🚀 ~ file: GestionActualizacionCostos.js:384 ~ calculoTotalAcumulado= ~ this.state.areaPrestacionSelected", this.state.areaPrestacionSelected)      
      const respuesta = axios.post(RUTAS_API.GESTION_COSTOS_PRODUCTIVIDAD.OBTENER_VARIACIONES_TOTALES, {
        idArea: this.state.areaPrestacionSelected,
        idPeriodo: this.state.periodoSelected,
        idConcepto: value
      });
      console.log("🚀 ~ file: GestionActualizacionCostos.js:386 ~ calculoTotalAcumulado= ~ respuesta", respuesta)
      if (respuesta.data.codigo > 0) {
        this.setState({ VariacionTotal: respuesta.datos });
      }
    };
 */

  /**
 * Método encargado de calcular el total acumulado
 * @param {Object} datosTablaAcumulados Listado de variaciones ingresadas por todos los periodos
 */
  calculoTotalAcumulado = (value) => {

    axios.post(RUTAS_API.GESTION_COSTOS_PRODUCTIVIDAD.OBTENER_VARIACIONES_TOTALES, {
      idArea: this.state.areaPrestacionSelected,
      idPeriodo: this.state.periodoSelected,
      idConcepto: value
    }).then(respuesta => {
      this.setState({ VariacionTotal: respuesta.data.datos });
    });
  };



  /**
 * Método encargado de controlar el cambio del seleccionador de Aplica CAmbio
 * @param {Event} evento El evento que se ejecuta en el control de usuario
 */
  controlaCheck = (evento) => {
    this.setState({ AProductividadCheckeado: evento });
    // this.props.mostrarAlerta("modal/", "El indicador ingresado no/si presenta variación porcentual");
  }

  /**
  * Metodo encargado de obtener columnas de la tabla
  * @returns {array}
  */
  obtenerColumnas = () => {

    return [
      {
        Header: '',
        columns: this.state.listaInfoTabla
      }
    ];
  };

  validarNumerosDecimales = (e, regex) => {
    if (e.key === ',') {
      e.preventDefault();
      return false;
    }
    const value = e.target.value;
    if (value.match(regex) == null) {
      return value.substr(0, value.length - 1);
    } else {
      return value;
    }
  };

  renderFaltantes = () => {
    return (
      <div className="tabla">
        {
          this.state.verTabla ?
            <div className='scroll-table'>
            <Tabla
              className='anchoTabla'
              datos={this.state.listaDatosTabla}
              columnas={this.obtenerColumnas()}
            />
            </div>
            :
            <div></div>
        }
        <div>
          <div className='form-group text-center mt-25'>
            <label className='col-12'>Aplica productividad</label>
            <Switch
              onChange={this.controlaCheck}
              checked={this.state.AProductividadCheckeado}
              onColor='#408BC4' />
          </div>
          <div className='form-group text-center'>
            <label>Valor de productividad</label>
            <input disabled={!this.state.AProductividadCheckeado}
              className="form-control" id="valorProductividad" placeholder="valor productividad" type="text"
              value={this.state.valorProductividad} onChange={(e) => { this.setState({ valorProductividad: this.validarNumerosDecimales(e, this.REGEX_DECIMAL) }) }} />
          </div>
          <div className='form-group text-center'>
            <label>Valor del Indicador</label>
            <input className="form-control" id="valorIndicador" placeholder="valor" type="text"
              value={this.state.valorIndicador} onChange={(e) => { this.setState({ valorIndicador: this.validarNumerosDecimales(e, this.REGEX_DECIMAL_20) }) }}></input>
          </div>
        </div>
      </div>
    );
  }


  /**
   * Método encargado de cerrar la ventana modal del botón de consulta
   */
  abrirCerrarModal = () => {
    this.setState({
      AProductividadCheckeado: true
    });
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
          <Combo
            opciones={this.state.listaAreaPrestacion}
            propTexto='arprNombre'
            propValor='arprIderegistro'
            label='&Aacute;rea prestación'
            name='areaPrestacion'
            value={this.state.areaPrestacionSelected}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={this.state.listaAnio}
            propTexto='titulo'
            propValor='perIderegistro'
            label='Año:'
            name='anio'
            value={this.state.periodoSelected}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={this.state.listaPeriodo}
            key='idRegistroMes'
            propTexto='titulo'
            propValor='idRegistroMes'
            label='Período'
            name='periodo'
            value={this.state.mesPeriodoSelected}
            onChange={this.controlarCambio}
          />
          {(this.state.periodoFSelected && this.state.periodoFSelected != -1) ?
            <Combo
              opciones={this.state.listaIndicador}
              propTexto='perNombre'
              propValor='perIdIndicador'
              label='Indicador:'
              name='indicador'
              value={this.state.indicadorSelected}
              onChange={this.controlarCambio}
            /> : <div></div>
          }

        </div>
        {
          this.state.indicadorFSelected ? this.renderFaltantes() : <div></div>
        }
      </Fragment>
    );
  };
}

GestionActualizacionCostos.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionActualizacionCostos);

export { VistaRedux as RGestionActualizacionCostos };
