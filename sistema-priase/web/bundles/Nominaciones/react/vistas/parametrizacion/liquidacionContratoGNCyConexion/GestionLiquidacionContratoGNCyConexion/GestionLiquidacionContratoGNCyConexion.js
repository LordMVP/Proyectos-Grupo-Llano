import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { get as getProp } from 'object-path';
import { Input, Botonera, Combo, Fecha, TextoNumerico, Tabla, VentanaModal, Util } from 'appfuture-react';
import axios from 'axios';

import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';

import './GestionLiquidacionContratoGNCyConexion.scss';
import { SelectorMultiple } from '../../../utils/SelectorMultiple';
import RUTAS_VISTA from '../../../../global/rutas_vista';
import { CLASES_UNIDADES } from '../../../../global/constantes';
import { limpiarHistorico } from '../../../../global/util_nominaciones';

class GestionLiquidacionContratosGNCyConexion extends Component {

  state = {
    periodoInicial: '',
    periodoFinal: '',
    trm: '',
    contrato: null,
    listaEstados: [],
    listaContratosSeleccionados: [],
    mostrarModalConsulta: false,
    habilitarDescargaInorme: false,
  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.setState({ contrato: state.entidadEditar }, this.consultarRutasContratos);
    }
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
      periodoInicial: '',
      periodoFinal: '',
      contrato: null,
      trm: '',
      // Estado de la aplicacion
      mostrarModalConsulta: false,
      listaContratos: [],
      listaContratosSeleccionados: [],
      habilitarDescargaInorme: false,
    });
    limpiarHistorico(this.props);
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
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    // Ejemplo Validacion
    if (false) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos un cargo de tipo AO&M para poder continuar.' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargo de obtener el tipo de contrato
   * @param {Number} idContrato Identificador del contrato
   * @returns {Object}
   */
  obtenerIdTipoContrato = (idContrato) => {
    const { listaContratos } = this.state.contrato;
//    let listaContratos = this.state.contrato];
//    let listaRutas = [...this.state.contrato.listaRutas];
    console.log("listacontratos->"+listaContratos);
    const index = listaContratos.findIndex(contrato => contrato.cntIderegistro == idContrato);
    if (index < 0) {
      return null;
    }
    const listaTipos = getProp(listaContratos[index], 'listaTipos', []);
    if (!Util.validarArreglo(listaTipos)) {
      return null;
    }
    return { uniIderegistro: getProp(listaTipos[0], 'uniIdetipocontrato.uniIderegistro', 0) };
  };

  /**
   * Método encargado de guardar los datos de la entidad
   * @returns {bool}
   */
  guardarEntidad = () => {
    const variables = this.validarParaLecturas();
    if (!variables) {
      return;
    }
    const { listaCalculo } = this.state;
    console.log("OBJ1->",JSON.stringify(listaCalculo));
    let lista = [];
    listaCalculo.forEach(calculo => {
      const idruta = {
          uniIderegistro: calculo.uniIderuta.uniIderegistro,
          uniNombre1: calculo.uniIderuta.uniNombre1
      }
      const idtipocontrato = {
          uniIderegistro: calculo.cntIderegistro.cntIderegistro          
      }
    
      const obj = {
        ligcPerfechainicial: variables.periodoInicial,
        ligcPerfechafinal: variables.periodoFinal,
        cntIderegistro: calculo.cntIderegistro,
        uniIderuta: idruta,
        ligcTipotrm: calculo.ligcTipotrm,
        ligcValortrm: calculo.ligcValortrm,
        ligcUsbmbtu: calculo.ligcUsbmbtu,
        ligcMbtu: calculo.ligcMbtu,
        ligcUsbmbtu: calculo.ligcUsbmbtu,
        ligcPesosmbtu: calculo.ligcPesosmbtu,
        ligcMbtu: calculo.ligcMbtu,
        ligcTotalusb: calculo.ligcTotalusb,
        ligcEstado: calculo.ligcEstado,
        empIderegistro: calculo.empIderegistro,
        ligcFecha: calculo.ligcFecha,
        ligcNumerofactura: calculo.numeroFactura,
        ligcFormapagodias: calculo.diasPago,
        ligcTotalpesos: calculo.ligcTotalpesos,
        ligcTipotrm: 'T',
        uniIdetipocontrato: idtipocontrato
      };
      lista.push(obj);
    });
console.log("obj-->"+JSON.stringify(lista));
    // Reemplazar con ruta del Endpoint para guardar
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LIQUIDACION_CONTRATOS_GNC_Y_CONEXION.GUARDAR, lista)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ habilitarDescargaInorme: true });
        }
      });
  };

  /**
   * Método encargado de abrir la ventana modal del boton consulta
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
   * Consulta las listas de todos los contratos...
   */
  consultarRutasContratos = () => {
    const { contrato } = this.state;
    axios.post(RUTAS_API.CONTRATOS.CONSULTAR_DETALLE_CONTRATO, { idContrato: contrato.cntIderegistro })
      .then(({ data }) => {
        if (data.codigo > 0) {
          this.setState({ contrato: data.datos });
        }
      });

  };

  /**
   * Método encargado de eliminar el contrato seleccionado
   * @param {number} posicion Posicion de la lista que se desea eliminar
   */
  eliminarContrato = (posicion) => {
    const lista = [...this.state.listaContratos];
    lista.splice(posicion, 1);
    this.setState({ listaContratos: lista });
  };

  obtenerTiposContrato = (contrato) => {
    const listaTipos = contrato.listaTipos.map(tipo => {
      return tipo.uniIdetipocontrato.uniNombre1;
    });
    return listaTipos.join(',');
  };

  /**
   * Gestiona el cambio de la selección de las rutas de los contratos...
   * @param {Number} idContrato Identificador del contrato
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  gestionarCambioRuta = (idContrato, evento) => {
    const { listaContratos } = this.state;
    const indexContrato = listaContratos.findIndex(contrato => contrato.cntIderegistro == idContrato);
    if (indexContrato < 0) {
      return;
    }
    const listaRutas = listaContratos[indexContrato].listaRutas;
    const value = evento.target.value;
    const index = listaRutas.findIndex(ruta => ruta.uniIderegistro == value);
    listaRutas[index].seleccionado = evento.target.checked;
    listaContratos[indexContrato].listaRutas = listaRutas;
    this.setState({ listaContratos: listaContratos });
    console.log("gestionarcambio->"+listaContratos+"|")
  };

  /**
   * Método encargado para validar los campos necesarios para las lecturas
   * @param {Boolean} agregarTRM Validacion para la TRM
   */
  validarParaLecturas = (agregarTRM = false) => {
    const { contrato, periodoInicial, periodoFinal } = this.state;
    if (!contrato) {
      this.props.mostrarAlerta('Error', 'Debe seleccionar un contrato.');
      return;
    }
    if (!periodoInicial || (typeof periodoInicial === 'string' && periodoInicial.trim() == '')) {
      this.props.mostrarAlerta('Error', 'Seleccione el periodo inicial.');
      return;
    }
    if (!periodoFinal || (typeof periodoFinal === 'string' && periodoFinal.trim() == '')) {
      this.props.mostrarAlerta('Error', 'Seleccione el periodo final.');
      return;
    }
    let listaRegistros = [];
    const obj = {
      cntIderegistro: contrato.cntIderegistro
    };
      obj.listaRutas = (Util.validarArreglo(contrato.listaRutas)) ? contrato.listaRutas.filter(r => r.seleccionado).map(r => {
        const ruta = { uniIderutagnc: r.uniIderegistro };
        if (agregarTRM == true) {
          ruta.cntuTrm = contrato.usaTRM;
        }
        return ruta;
      }) : [];
      listaRegistros.push(obj);
    return {
      periodoInicial: periodoInicial,
      periodoFinal: periodoFinal,
      listaRegistros: listaRegistros
    };
  };

  /**
   * Método encargado de consultar las lecturas para los contratos seleccionados
   */
  consultarLecturas = () => {
    let variables = this.validarParaLecturas();
    const peticiones = [];

    peticiones.push(axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LIQUIDACION_CONTRATOS_GNC_Y_CONEXION.CONSULTAR_LECTURAS_CONSUMO, {
      fechaInicio: variables.periodoInicial,
      fechaFinal: variables.periodoFinal,
      listaContrato: variables.listaRegistros,
    }));
    variables = this.validarParaLecturas(true);
    peticiones.push(axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LIQUIDACION_CONTRATOS_GNC_Y_CONEXION.CALCULO, {
      fechaInicio: variables.periodoInicial,
      fechaFinal: variables.periodoFinal,
      listaContrato: variables.listaRegistros,
    }));

    axios.all(peticiones)
      .then(axios.spread((lecturas, calculo) => {
        const obj = {
          listaConsumoRutas: [],
          listaCalculo: []
        };
        if (lecturas.data.codigo > 0) {
          obj.listaConsumoRutas = lecturas.data.datos;
        }
        if (calculo.data.codigo > 0) {
          obj.listaCalculo = calculo.data.datos;
        }
        this.setState(obj);
      }));
  };

  /**
   * Método encargado de mostrar la tabla con el calculo
   * @returns {JSX}
   */
  renderTablaCalculo = () => {
    if (!Util.validarArreglo(this.state.listaCalculo)) {
      return null;
    }
    return (
      <div className='col-12 mt-3'>
        <h2>Validar Liquidación</h2>
        <hr />
        <table className='table table-condensed table-striped table-bordered table-hover nolabel'>
          <thead className='bg-primary text-white'>
            <tr>
              <td>Contrato No.</td>
              <td>TRM</td>
              <td>Factura No.</td>
              <td>USO/MBTU</td>
              <td>$/MTBU</td>
              <td>MBTU</td>
              <td>TOTAL USD</td>
              <td>TOTAL $</td>
              <td>FORMA DE PAGO Días después de radicado</td>
              <td>Estado</td>
            </tr>
          </thead>
          <tbody>
            {
              this.state.listaCalculo.map(calculo => {
                return (
                  <tr>
                    <td>{getProp(calculo, 'cntIderegistro.cntNumero', 0)}</td>
                    <td>{getProp(calculo, 'ligcValortrm', 0)}</td>
                    <td>
                      <Input
                        value={calculo.numeroFactura}
                        name='numeroFactura'
                        cols={12}
                        onChange={this.controlarCambioTablaCalculo}
                        extra={{ 'data-idcontrato': getProp(calculo, 'cntIderegistro.cntIderegistro', '0'), 'data-idruta': getProp(calculo, 'uniIderuta.uniIderegistro', '0') }}
                      />
                    </td>
                    <td>{getProp(calculo, 'ligcUsbmbtu', 0)}</td>
                    <td>{getProp(calculo, 'ligcPesosmbtu', 0)}</td>
                    <td>{getProp(calculo, 'ligcMbtu', 0)}</td>
                    <td>{getProp(calculo, 'ligcTotalusb', 0)}</td>
                    <td>{getProp(calculo, 'ligcTotalpesos', 0)}</td>
                    <td>
                      <TextoNumerico
                        aceptaDecimales={false}
                        aceptaNegativos={false}
                        cols={12}
                        value={calculo.diasPago}
                        onChange={this.controlarCambioTablaCalculo}
                        extra={{ 'data-idcontrato': getProp(calculo, 'cntIderegistro.cntIderegistro', '0'), 'data-idruta': getProp(calculo, 'uniIderuta.uniIderegistro', '0') }}
                        name='diasPago'
                      />
                    </td>
                    <td>{getProp(calculo, 'ligcEstado', 0)}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div >
    );
  };

  /**
   * Convierte un timestamp en una fecha string legible.
   * @param {number}
   * @returns {string}
   */
  parsearFecha = (fecha) => {
    const date = new Date(fecha);
    let dia = date.getDate();
    let mes = date.getMonth();
    let anio = date.getFullYear();
    if (dia < 10) {
      dia = '0' + dia;
    }
    if (mes < 10) {
      mes = '0' + mes;
    }
    return `${dia}/${mes}/${anio}`;
  };

  /**
   * Método encargado de construir una lista con las rutas
   * @param {Array} listaConsumoRutas Lista de consumo por rutas
   */
  reconstruirListaConsumo = (listaConsumoRutas) => {
    let lista = {};
    //Recorremos las rutas...
    listaConsumoRutas.forEach(registro => {
      //Recorremos las lecturas de cada ruta.
      registro.lecturasConsumo.forEach(lectura => {
        const fecha = this.parsearFecha(lectura.fechaLectura);
        //Creamos el grupo fecha...
        if (!lista[fecha]) {
          lista[fecha] = [];
          //Buscamos los datos para esta fecha...
          listaConsumoRutas.forEach(ruta => {
            const rutaTemp = {
              idRuta: ruta.ruta.uniIderegistro,
              nombreRuta: ruta.ruta.uniNombre1,
              lecturas: []
            };
            ruta.lecturasConsumo.forEach(lec => {
              const fechaLectura = this.parsearFecha(lec.fechaLectura);
              if (fechaLectura === fecha) {
                rutaTemp.lecturas.push(lec);
              }
            });
            lista[fecha].push(rutaTemp);
          });
        }
      });
    });

    //Reconstruimos la lista...
    let listaFinal = [];
    for (const key in lista) {
      if (lista.hasOwnProperty(key)) {
        const item = { fecha: key, datos: lista[key] };
        listaFinal.push(item);
      }
    }
    return listaFinal;
  };

  /**
   * Renderiza la cantidad de consumo de las rutas consultadas...
   * @returns {JSX}
   */
  renderConsumoRutas = () => {
    const { listaConsumoRutas } = this.state;
    const listaFinal = this.reconstruirListaConsumo(listaConsumoRutas);
    return (
      <div className='col-12 mt-5'>
        <table className='table table-condensed table-striped table-hover'>
          <thead className='bg-primary text-white'>
            <tr>
              <td><i className='fa fa-fw fa-calendar'></i> Fecha</td>
              {
                listaConsumoRutas.map(registro => {
                  return (
                    <td>{getProp(registro, 'ruta.uniNombre1', 'Indefinido')}</td>
                  );
                })
              }
            </tr>
          </thead>
          <tbody>
            {
              listaFinal.map(fecha => {
                return (
                  <tr key={fecha.fecha}>
                    <td>{fecha.fecha}</td>
                    {
                      fecha.datos.map(ruta => {
                        return (
                          <td>{Util.validarArreglo(ruta.lecturas) ? ruta.lecturas[0].cantidadLectura : '0'}</td>
                        )
                      })
                    }
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  };

  /**
   * @method
   * Método encargado de controlar el cambio de los componentes de la tabla
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambioTabla = (evento) => {
    let listaRutas = [...this.state.contrato.listaRutas];
    const idRuta = (evento.target.attributes['data-idruta']) ? evento.target.attributes['data-idruta'].value : null;
    if (!idRuta) {
      return;
    }
    const posicion = listaRutas.findIndex(ruta => ruta.uniIderegistro == idRuta);
    if (posicion < 0) {
      return;
    }
    if (evento.target.name == 'seleccionadoRut') {
      listaRutas[posicion][evento.target.name] = !listaRutas[posicion][evento.target.name];
    } else {
      listaRutas[posicion][evento.target.name] = evento.target.value;
    }
    const contrato = { ...this.state.contrato, listaRutas: [...listaRutas] }
    this.setState({ contrato: contrato });
  };

  /**
   * Controlar cambio tabla calculo.
   */
  controlarCambioTablaCalculo = (evento) => {
    let listaCalculo = [...this.state.listaCalculo];
    const idRuta = evento.target.attributes['data-idruta'] ? evento.target.attributes['data-idruta'].value : null;
    if (!idRuta) {
      return;
    }
    const posicion = listaCalculo.findIndex(contrato => contrato.uniIderuta.uniIderegistro == idRuta);
    if (posicion < 0) {
      return;
    }
    listaCalculo[posicion][evento.target.name] = evento.target.value;
    this.setState({ listaCalculo: listaCalculo });
  };


  /**
   * Método encargado de mostrar la tabla con los contratos a liquidar seleccionados
   * @returns {Array}
   */
  renderTablaRutas = () => {
    if (!this.state.contrato.listaRutas) {
      return;
    }
    return (
      <div className='col-12'>
        <table className='table nolabel table-striped table-condensed table-bordered nolabel'>
          <thead>
            <tr>
              <th>Ruta</th>
              <th>Trm</th>
              <th>TRM Usar</th>
            </tr>
          </thead>
          <tbody>
            {
              (this.state.contrato.listaRutas) && this.state.contrato.listaRutas.filter(dato => dato.seleccionado).map((dato, index) => {
                if (typeof dato.seleccionadoRut == 'undefined') {
                  dato.seleccionadoRut = true;
                }
                if (typeof dato.usaTRM == 'undefined') {
                  dato.usaTRM = "TRMD";
                }
                return (
                  <tr key={"ruta" + dato.uniIderegistro}>
                    <td>
                      <label><input
                        checked={dato.seleccionadoRut || false}
                        type="checkbox"
                        name="seleccionadoRut"
                        data-idruta={dato.uniIderegistro}
                        onChange={this.controlarCambioTabla} /> Seleccionar
                    </label>
                    </td>
                    <td>{dato.uniNombre1}</td>
                    <td>
                      <Combo
                        opciones={[{ texto: "Trm Ultimo Día Periodo", valor: "TRMD" }, { texto: "TRM Techo", valor: "N" }]}
                        propTexto='texto'
                        propValor='valor'
                        name='usaTRM'
                        value={dato.usaTRM}
                        cols={12}
                        onChange={this.controlarCambioTabla}
                        extra={{
                          disabled: (this.state.contrato.cntUsatrmtecho == 'S' ? false : true),
                          'data-idruta': dato.uniIderegistro
                        }}
                      />
                    </td>
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
   * Redirecciona al panel de consulta de contratos.
   */
  buscarContratos = () => {
    let url = RUTAS_VISTA.GESTION_LIQUIDACION_CONTRATOS_GNC.url;
    if (location.pathname.search('_conexion') >= 0) {
      url = RUTAS_VISTA.GESTION_LIQUIDACION_CONTRATOS_CONEXION.url;
    }
    const tiposContrato = ['CNX'];
    this.props.history.push({
      pathname: RUTAS_VISTA.CONSULTA_CONTRATOS.url,
      state: {
        interfazGestion: url,
        inhabilitarEstado: true,
        estadosContrato: ['A', 'F'],
        tiposContrato: tiposContrato,
      }
    });
  };

  /**
   * Invoca el routing de generación de documento para descargar el informe...
   */
  descargarInforme = () => {
    const variables = this.validarParaLecturas();
    if (!variables) {
      return;
    }
    const { periodoInicial, periodoFinal,listaRegistros} = variables;
    let con = listaRegistros.find(item => item.cntIderegistro === 2);
    console.log("periodoInicial->"+periodoInicial+"-periodoFinal->"+periodoFinal+"-listaRegistros->"+listaRegistros[0].cntIderegistro);
//    const idtipocontrato = this.obtenerIdTipoContrato(this.state.listaContratos[0].cntIderegistro);
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LIQUIDACION_CONTRATOS_GNC_Y_CONEXION.GENERAR_DOCUMENTO, {
      fechainicial: periodoInicial,
      fechafinal: periodoFinal,
      idtipocontrato: listaRegistros[0].cntIderegistro,
    })
      .then(respuesta => {
          this.forzarDescargaInforme(respuesta.data.datos);
      });
  };

  /**
   * Forzará la descarga del archivo en base64 que devuelve el servidor.
   */
  forzarDescargaInforme = (contenido) => {
    let a = document.createElement('a');
    a.href = 'data:' + { type: "Content-Type: application/vnd.ms-excel" } + ';base64,' + contenido;
    a.download = "Informe.xls";
    a.target = '_blank';
    a.click();
    return;
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
          <div className='form-group col-4'>
            <label>Contratos:</label>
            <div className='input-group'>
              <input
                type='text'
                className='form-control'
                value={(this.state.contrato != null) ? `${getProp(this.state.contrato, 'cntNumero', '')}--${getProp(this.state.contrato, 'terIdeagente.terNomcompleto', '')}` : 'Seleccionar contrato'}
                disabled={true}
              />
              <div className='input-group-btn'>
                <button className='btn btn-primary' onClick={this.buscarContratos}><i className='fa fa-fw fa-check-square-o'></i></button>
              </div>
            </div>
          </div>
          <Fecha
            label='Fecha Inicial'
            name='periodoInicial'
            fecha={this.state.periodoInicial}
            onChange={this.controlarCambio}
          />
          <Fecha
            label='Fecha Final'
            name='periodoFinal'
            fecha={this.state.periodoFinal}
            onChange={this.controlarCambio}
          />
          {
            this.state.contrato != null &&
            <Fragment>
              {this.renderTablaRutas()}
              <div class='col-md-12'>
                <button className='btn btn-primary' onClick={this.consultarLecturas}><i className='fa fa-fw fa-calculator'></i> Validar Liquidación</button>
              </div>
            </Fragment>
          }
          {
            Util.validarArreglo(this.state.listaConsumoRutas) && this.renderConsumoRutas()
          }
          {this.renderTablaCalculo()}
          {this.state.habilitarDescargaInorme === true && (
            <div className='col-12'>
              <button className='btn btn-primary' onClick={this.descargarInforme}><i className='fa fa-fw fa-download'></i> Descargar Informe</button>
            </div>
          )}
        </div>
      </Fragment >
    );
  };
}

GestionLiquidacionContratosGNCyConexion.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionLiquidacionContratosGNCyConexion);

export { VistaRedux as RGestionLiquidacionContratosGNCyConexion };
