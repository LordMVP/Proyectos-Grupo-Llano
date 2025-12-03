import React, { Component, Fragment} from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../global/rutas_api';
import { formatearArray } from '../../../global/util_nominaciones';
import { mostrarAlerta } from '../../../store/actions/AplicacionAcciones';
//import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import './GestionCalculoTarifasSemestrales.scss';

const CALCULADO = 'CALCULADO';

class GestionCalculoTarifasSemestrales extends Component {

  state = {
    // Datos de la entidad
    panelActivo: 'VC',
    areaPrestacion: '',
    periodo: '',
    listaAreaPrestacion: [],
    listaPeriodo: [],
    listaBalanceMasas: [],
    listaConceptosBase: [],
    listaConceptosAprBase: [],
    listaVariablesCalculadas: [],
  };

  /**
   * Método encargado de ejecutar una o varias acciones al momento de cargar el componente.
   */
  componentDidMount() {
    this.consultarAreaPrestacion();
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
  };

  /**
   * Método encargado de consultar las área de prestación
   */
  consultarAreaPrestacion = async () => {
    const respuesta = await axios.post(RUTAS_API.PARAMETRIZACION.AREAS_PRESTACION.FILTRO, { criterio: '' });
    if (respuesta.data.codigo > 0) {
      this.setState({ listaAreaPrestacion: formatearArray(respuesta.data.datos) });
    }
  };

  /**
   * Método encargado de contruir un objeto con los periodos consultados.
   * @param {Object} periodos Datos de los periodos consultados.
   * @returns {Object}
   */
  construirObjetoPeriodos = (periodos) => {
    let anio;
    const lista = periodos.map((dato) => {
      anio = new Date(dato.perIdepadre.perFecinicial).getUTCFullYear();
      console.log("seleccion año->",anio);
      return {
        idRegistro: dato.perIdepadre.perIderegistro,
        titulo: `${dato.perIdepadre.perNombre}-${anio}`
      }
    });
    return lista;
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
      panelActivo: 'VC',
      listaBalanceMasas: [],
      listaConceptosBase: [],
      listaPeriodos: [],
      listaVariablesCalculadas: [],
    });
  };

  /**
   * Método encargado de limpiar los datos del formulario al momneto de cambiar de interfaz.
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
      { texto: 'Consultar', callback: this.consultarVariables },
      { texto: 'Calcular', callback: this.calcularEntidad },
      { texto: 'Aprobar', callback: this.aprobarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de consultar los conceptos base y las variables calculadas
   */
  consultarVariables = () => {
    const { areaPrestacion, periodo } = this.state;
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    const parametros = {
      idArea: areaPrestacion,
      idPeriodo: periodo
    }
    this.consultarConceptosBase();
    this.consultarVariablesCalculadas(parametros);
  };

  /**
   * Método encargado de consultar las variables calculadas
   * @param {Object} parametros Parametros necesarios para realizar la petición
   */
  consultarVariablesCalculadas = (parametros) => {
    axios.post(RUTAS_API.CALCULO_TARIFAS.CALCULO_SEMESTRAL.CONSULTAR_VARIABLES_CALCULADAS, parametros)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaVariablesCalculadas: respuesta.data.datos });
        }
      });
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    const { areaPrestacion, periodo } = this.state;
    if (!areaPrestacion || areaPrestacion == '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un área de prestación.' } };
    }
    if (!periodo || periodo == '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe un periodo semestral.' } };
    }
    return { respuesta: true };
  };

  /**
   * Método encargado de generar el balance de masas.
   * @returns {boolean}
   */
  generarBalance = () => {
    const { areaPrestacion, periodo } = this.state;
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    const parametros = {
      idArea: areaPrestacion,
      idPeriodo: periodo
    }
    axios.post(RUTAS_API.CALCULO_TARIFAS.CALCULO_SEMESTRAL.BALANCE_MASAS, parametros)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({
            listaBalanceMasas: respuesta.data.datos,
            panelActivo: 'BM'
          });
        }
      });
  };

  /**
   * Método encargado de certificar las variables
   * @returns {bool}
   */
  aprobarEntidad = () => {
    const { areaPrestacion, periodo } = this.state;
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    const parametros = {
      idArea: areaPrestacion,
      idPeriodo: periodo
    }

    axios.post(RUTAS_API.CALCULO_TARIFAS.CALCULO_SEMESTRAL.CERTIFICAR_VARIABLES, parametros)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaVariablesCalculadas: [] });
        }
      });
  };

  /**
   * Método encargado de guardar los datos de la entidad
   * @returns {bool}
   */
  calcularEntidad = () => {
    const { areaPrestacion, periodo } = this.state;
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    const parametros = {
      idArea: areaPrestacion,
      idPeriodo: periodo
    }

    axios.post(RUTAS_API.CALCULO_TARIFAS.CALCULO_SEMESTRAL.CALCULAR, parametros)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.consultarVariablesCalculadas(parametros);
        }
      });
  };

  /**
   * Método encargado de controlar el cambio de la barra de navegación.
   */
  controlCambioNavTabs = (evento) => {
    const control = evento.target;
    const panel = control.attributes['data-panel'].value;
    this.setState({ panelActivo: panel });
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    if (evento.target.name == 'areaPrestacion') {
      this.consultarPeriodos(evento.target.value);
    }
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  /**
   * Método encargado de consultar las variables base para el calculo.
   */
  consultarConceptosBase = async () => {
    const { periodo, areaPrestacion, listaAreaPrestacion } = this.state;
    const area = listaAreaPrestacion.find(a => a.arprIderegistro == areaPrestacion);
    const parametros = {
      uniLiquidacion: area.liqIderegistro.uniLiquidacion,
      idPeriodo: periodo ,
      idArea: area.arprIderegistro
    }
    const respuesta = await axios.post(RUTAS_API.CALCULO_TARIFAS.CALCULO_SEMESTRAL.CONSULTAR_VARIABLES_BASE, parametros);
    if (respuesta.data.codigo > 0) {
      this.setState({
        listaConceptosBase: respuesta.data.datos.listaVariables,
        listaConceptosAprBase : respuesta.data.datos.listaVarApr,
        listaPeriodos: (respuesta.data.datos.periodos != null) ? JSON.parse(respuesta.data.datos.periodos) : [],
      });
    }
  };

  /**
   * Método encargado de consultar los periodos semestrales por área de prestación.
   * @param {Number} idArea Identificador del área de prestación.
   */
  consultarPeriodos = async (idArea) => {
    const respuesta = await axios.post(RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS.CONSULTAR_PERIODOS_SEMESTRALES, { idArea: idArea });
    if (respuesta.data.codigo > 0) {
      this.setState({ listaPeriodo: formatearArray(this.construirObjetoPeriodos(respuesta.data.datos)) });
    }
  };

  /**
   * Método encargado de convertir la fecha ingresada a Date
   * @param {string} fechaContrato fecha seleccionada por el usuario
   * @returns {Date}
   */
  obtenerFecha = (fechaContrato) => {
    let fecha = new Date(fechaContrato);
    fecha = (fecha.getFullYear() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getDate());
    return fecha;
  };

  /**
   * Método encargado de mostrar la tabla con las variables calculadas
   * @returns {Component}
   */
  renderSeccionVariablesCalculadas = () => {
    const lista = this.state.listaVariablesCalculadas;
    if (!Util.validarArreglo(lista)) {
      return <div className='text-center'>Sin resultados</div>
    }
    return (
      <div>
        {/*<div>
          <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="btn primary"
                    table="table-to-xls"
                    filename="Calculos Semestrales"
                    sheet="hoja 1"
                    buttonText="Descargar"/>
    </div>*/}
      <table className='table-normaliced table table-condensed table-bordered' id="table-to-xls">
        <thead className='bg-dark text-white'>
          <tr>
            <th className='text-center'>Variable</th>
            <th className='text-center'>Abreviatura</th>
            <th className='text-center'>Fecha Grabación</th>
            <th className='text-center'>Valor</th>
            <th className='text-center'>Estado</th>
            <th colSpan={2} className='text-center'>Datos Rango</th>
          </tr>
        </thead>
        <tbody>
          {Util.validarArreglo(lista) && (
            lista.map((dato, index) => {
              let tamanioFilas = 1;
              if (Util.validarArreglo(dato.listaRangos)) {
                dato.listaRangos.forEach(rango => {
                  tamanioFilas++;
                });
              }
              return (
                <Fragment key={(dato.conIderegistro.uniConcepto.uniIderegistro)}>
                  <tr key={(dato.conIderegistro.uniConcepto.uniIderegistro)}>
                    <td rowSpan={tamanioFilas}>{dato.conIderegistro.conNombre}</td>
                    <td rowSpan={tamanioFilas}>{dato.conIderegistro.conAbreviatura}</td>
                    <td rowSpan={tamanioFilas}>{this.obtenerFecha(dato.varprFecgrabacion)}</td>
                    <td rowSpan={tamanioFilas}>{dato.varprValor}</td>
                    <td rowSpan={tamanioFilas}>{CALCULADO}</td>
                    {(dato.listaRangos.length <= 0) &&
                      <td colSpan='2'><i className='fa fa-fw fa-warning'></i>La variable no presenta rangos</td>
                    }
                    {(dato.listaRangos && dato.listaRangos.length > 0) &&
                      (
                        <Fragment>
                          <td className='th-sub bg-dark text-white'>Rango Inicial</td>
                          <td className='th-sub bg-dark text-white'>Rango Final</td>
                        </Fragment>
                      )
                    }
                  </tr>
                  {
                    Util.validarArreglo(dato.listaRangos) && (
                      dato.listaRangos.map((rango, indexRango) => {
                        return (
                          <Fragment key={(rango.racoIderegistro.racoIderegistr + indexRango)}>
                            <tr key={(rango.racoIderegistro.racoIderegistr + indexRango + 'TR')}>
                              <td>{rango.racoIderegistro.racoRaninicial}</td>
                              <td>{rango.racoIderegistro.racoRanfinal}</td>
                            </tr>
                          </Fragment>
                        );
                      })
                    )
                  }
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>
      </div>
    );
  };

  /**
   * Método encargado de mostrar la seccion del calculo de balance de masas.
   * @returns {Component}
   */
/**  renderSeccionBalanceMasas = () => {
    const lista = this.state.listaBalanceMasas;
    if (!Util.validarArreglo(lista)) {
      return <div className='text-center'>Sin resultados</div>
    }
    return (
      <table className='table table-bordered'>
        <thead className='bg-dark text-white'>
          <tr>
            <th className='text-center'>Variable</th>
            <th className='text-center'>Valor Concepto</th>
            <th className='text-center'>Valor Total</th>
            <th className='text-center'>Valor Real</th>
            <th className='text-center'>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {Util.validarArreglo(lista) && (
            lista.map((dato, index) => {
              return (
                <Fragment key={(dato.concepto.uniConcepto.uniIderegistro)}>
                  <tr key={(dato.concepto.uniConcepto.uniIderegistro)}>
                    <td>{dato.concepto.conNombre}</td>
                    <td>{dato.concepto.conValor}</td>
                    <td>{dato.valorTotal}</td>
                    <td>{dato.valorReal}</td>
                    <td>{dato.cantidad}</td>
                  </tr>
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>
    );
  };*/

  /**
   * Método encargado de mostrar la seccion con los conceptos base.
   * @returns {Component}
   */
  renderSeccionConceptosBase = () => {
    const lista = this.state.listaConceptosBase;
    if (!Util.validarArreglo(lista)) {
      return <div className='text-center'>Sin resultados</div>
    }
    lista.forEach(dato => {
      if (dato.valorPeriodos && typeof dato.valorPeriodos == 'string') {
        dato.valorPeriodos = JSON.parse(dato.valorPeriodos);
      }
    });
    return (
      //<div></div>
      <div>
        {/*<div>
          <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="btn primary"
                    table="table-to-xls"
                    filename="Valores Base"
                    sheet="hoja 1"
                    buttonText="Descargar"/>
    </div>*/}
      <table className='table-normaliced table table-condensed table-bordered' id="table-to-xls">
        <thead className='bg-dark text-white'>
          <tr>
            <th className='text-center'>Variable------</th>
            <th className='text-center'>Rango </th>
            {
              this.state.listaPeriodos.map((periodo, index) => {
                  return (<th className='text-center'>{periodo.per_nombre} </th>);
              })
            }         
          </tr>
        </thead>
        <tbody>
          {Util.validarArreglo(lista) && (
            lista.map((dato, index) => {
              let tamanioFilas = 1;
              return (
                <Fragment key={(dato.idConcepto + dato.idRango)}>
                  <tr key={(dato.idConcepto + dato.idRango)}>
                    <td rowSpan={tamanioFilas}>{dato.nombreConcepto}</td>
                    <td rowSpan={tamanioFilas}>{dato.ranInical} - {dato.ranFinal} </td>                
                    {
                      Util.validarArreglo(dato.valorPeriodos) && (
                        dato.valorPeriodos.map((periodo, indexRango) => {
                          return (                          
                                <td>{periodo.varc_valor}</td>                  
                          );
                        })
                      )
                    }
                  </tr>
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>
      </div>
    );
  };

  /**
   * Método encargado de mostrar la seccion con los conceptos base de Aprovechamiento.
   * @returns {Component}
   */
  renderSeccionConceptosAprBase = () => {
    const lista = this.state.listaConceptosAprBase;
    if (!Util.validarArreglo(lista)) {
      return <div className='text-center'>Sin resultados</div>
    }
    lista.forEach(dato => {
      if (dato.valorPeriodos && typeof dato.valorPeriodos == 'string') {
        dato.valorPeriodos = JSON.parse(dato.valorPeriodos);
      }
    });
    return (
      <div>
        <div>
          {/*<ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="btn primary"
                    table="table-to-xls"
                    filename="Valores aprovechamiento"
                    sheet="hoja 1"
                    buttonText="Descargar"/>*/}
          </div>
      <table className='table-normaliced table table-condensed table-bordered' id="table-to-xls">
        <thead className='bg-dark text-white'>
          <tr>
            <th className='text-center'>Variable</th>
            <th className='text-center'>Rango </th>
            <th className='text-center'>Tercero </th>
            {
              this.state.listaPeriodos.map((periodo, index) => {
                  return (<th className='text-center'>{periodo.per_nombre} </th>);
              })
            }         
          </tr>
        </thead>
        <tbody>
          {Util.validarArreglo(lista) && (
            lista.map((dato, index) => {
              let tamanioFilas = 1;
              if (Util.validarArreglo(dato.valorPeriodos)) {
                dato.valorPeriodos.forEach(tercero => {
                  tamanioFilas++; 
                  if (tercero.valor_per_apr && typeof tercero.valor_per_apr == 'string') {
                    tercero.valor_per_apr = JSON.parse(tercero.valor_per_apr);
                  }                
                });
              }
              return (
                <Fragment key={(dato.idConcepto + dato.idRango)}>
                  <tr key={(dato.idConcepto + dato.idRango)}>
                    <td rowSpan={tamanioFilas}>{dato.nombreConcepto}</td>
                    <td rowSpan={tamanioFilas}>{dato.ranInical} - {dato.ranFinal} </td> 
                    {(!dato.valorPeriodos) &&
                      <td colSpan='3'><i className='fa fa-fw fa-warning'></i>La variable no tiene datos para los terceros</td>
                    }  
                  </tr>
                  {
                    Util.validarArreglo(dato.valorPeriodos) && (
                      dato.valorPeriodos.map((tercero, indexTercero) => {
                        return (
                          <Fragment key={(dato.idConcepto + dato.idRango + tercero.ter_ideregistro)}>
                            <tr key={(dato.idConcepto + dato.idRango + tercero.ter_ideregistro + 'TR')}>
                              <td>{tercero.ter_nomcompleto}</td>   
                              {
                                Util.validarArreglo(tercero.valor_per_apr) && (
                                  tercero.valor_per_apr.map((valPeriodo, indexRango) => {
                                    return (                          
                                          <td>{valPeriodo.vrta_valor}</td>                  
                                    );
                                  })
                                )
                              }
                            </tr>
                          </Fragment>
                        );
                      })
                    )
                  }
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>
      </div>
    );
  };

  /**
   * Método encargado de mostrar la barra de navegación
   * @returns {Object}
   */
  renderSeccionTabs = () => {
    return (
      <Fragment>
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <a className={`nav-item nav-link ${(this.state.panelActivo === 'VC') ? 'active' : ''}`} data-panel='VC' onClick={this.controlCambioNavTabs}>Variables Calculadas</a>
            <a className={`nav-item nav-link ${(this.state.panelActivo === 'CB') ? 'active' : ''}`} data-panel='CB' onClick={this.controlCambioNavTabs}>Conceptos Base</a>
            <a className={`nav-item nav-link ${(this.state.panelActivo === 'CA') ? 'active' : ''}`} data-panel='CA' onClick={this.controlCambioNavTabs}>Conceptos Base Aprovechamiento</a>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div className="tab-pane fade show active" >
          {/*<ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="btn primary "
                    table="table-to-xls"
                    filename="tablexls"
                    sheet="tablexls"
                    buttonText="Download as XLS"/>*/}
            {(this.state.panelActivo === 'VC') && (this.renderSeccionVariablesCalculadas())}
            {(this.state.panelActivo === 'CB') && (this.renderSeccionConceptosBase())}
            {(this.state.panelActivo === 'CA') && (this.renderSeccionConceptosAprBase())}
          </div>
        </div>
      </Fragment>
    )
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
            label='Área de Prestación:'
            name='areaPrestacion'
            value={this.state.areaPrestacion}
            onChange={this.controlarCambio}
            cols={6}
          />
          <Combo
            opciones={this.state.listaPeriodo}
            propTexto='titulo'
            propValor='idRegistro'
            label='Periodo:'
            name='periodo'
            value={this.state.periodo}
            onChange={this.controlarCambio}
            cols={6}
          />
        </div>
        <div className='col-12 mt-5'>
          {this.renderSeccionTabs()}
        </div>
      </Fragment>
    );
  };
}

GestionCalculoTarifasSemestrales.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionCalculoTarifasSemestrales);

export { VistaRedux as RGestionCalculoTarifasSemestrales };
