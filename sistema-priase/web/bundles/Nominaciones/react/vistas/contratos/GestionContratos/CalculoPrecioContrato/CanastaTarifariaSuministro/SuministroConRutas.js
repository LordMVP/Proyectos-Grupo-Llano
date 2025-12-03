import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ComboHoras } from '../Componentes/ComboHoras';
import { Util, TextoNumerico, Combo } from 'appfuture-react';
import { get as getProp } from 'object-path';

import { SelectorRutas } from '../../../../utils/SelectorRutas';

import Modal from 'react-bootstrap4-modal';

import './SuministroConRutas.scss';

class SuministroConRuta extends Component {

  state = {
    mostrarRutas: false,
    horaFin: '',
    ultimaHora: '00:00'
  };

  /**
   * Método encargado de controlar el cambio de los componentes
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  actualizarState = (evento) => {
    let cambio = {};
    const target = evento.target;
    cambio[target.name] = target.value;
    this.setState(cambio);
  };

  /**
   * Método encargado de actualizar el objeto redux
   * @param {Event} cambio Cambio a realizar
   */
  actualizarEstadoRedux = (cambio) => {
    const llave = !this.props.intervalos ? 'canastaHorariaSuministro' : 'canastaConsumoSuministro';
    let obj = {};
    obj[llave] = { ...this.props[llave], ...cambio };
    this.props.actualizarTipoCalculoContrato(obj);
  };

  /**
   * Método encargado de obtener las rutas seleccionadas
   * @returns {Array}
   */
  obtenerRutasSeleccionadas = () => {
    const rutas = this.props.rutasGNC.filter(r => (r.seleccionado));
    return [...rutas];
  }

  /**
   * Método encargado de mostrar el buscador de rutas
   * @returns {JSX}
   */
  renderBuscadorRutas = () => {
    return (
      <SelectorRutas
        titulo='Rutas:'
        propTexto='uniNombre1'
        propValor='uniIderegistro'
        seleccionarItem={this.actualizarRutas}
        unidadesMedida={getProp(this.props, 'listaUnidadesMedida')}
        mostrarAlerta={this.props.mostrarAlerta}
        tiposContrato={getProp(this.props, 'listaTiposContrato')}
        lista={getProp(this.props, 'rutasGNC', [])}
      />
    );
  };

  /**
   * Método encargado de actualizar las rutas en el objeto redux
   * @returns {Boolean}
   */
  actualizarRutas = (rutas) => {
    let sumatoria = 0;
    rutas.forEach(ruta => {
      if (ruta.seleccionado) {
        sumatoria += (ruta.cntuValor) ? parseFloat(ruta.cntuValor) : 0;
      }
    });
    this.props.actualizarListaContratos({ rutasGNC: [...rutas], rutas: [...rutas] });
    this.actualizarCabeceraRedux({ precioContrato: sumatoria });
    this.actualizarRutasEnRangos();
  };

  /**
   * Método encargado de actualizar las rutas en los rangos en el objeto redux
   * @returns {Boolean}
   */
  actualizarRutasEnRangos = () => {
    // Si no hay rangos seleccionados, no hacer nada
    const { canastaHorariaSuministro } = this.props;
    if (!canastaHorariaSuministro || !Util.validarArreglo(canastaHorariaSuministro.canastaConRutas)) {
      return;
    }

    const rutasSeleccionadas = [...this.obtenerRutasSeleccionadas()];
    let nuevaCanasta = [...canastaHorariaSuministro.canastaConRutas];

    nuevaCanasta.forEach(canasta => {

      if (!Util.validarArreglo(canasta.rutas)) {
        return;
      }

      let nuevasRutas = [...canasta.rutas];

      // Validar que las rutas del rango coincidan con las rutas seleccionadas
      rutasSeleccionadas.forEach(ruta => {

        // Si hay más rutas seleccionadas que rutas en el rango, se agregan las nuevas rutas
        if (rutasSeleccionadas.length > nuevasRutas.length) {
          const rutaExiste = nuevasRutas.findIndex(rr => rr.uniIderegistro === ruta.uniIderegistro) > -1;
          if (!rutaExiste) {
            nuevasRutas.push({ ...ruta, valor: 0, unidadMedida: -1, porcentaje: 0, idRutaRango: Util.generarIdControl('rangoRuta') });
          }
        }

        // Si el rango tiene más rutas de las que están seleccionadas, remover la ruta sobrante
        if (nuevasRutas.length > rutasSeleccionadas.length) {
          nuevasRutas = nuevasRutas.filter(rangoRuta => rutasSeleccionadas.findIndex(r => r.uniIderegistro === rangoRuta.uniIderegistro) > -1);
        }

      });
      canasta.rutas = nuevasRutas;
    });


    this.actualizarEstadoRedux({ canastaConRutas: nuevaCanasta });
  };

  /**
   * Método encargado de agregar el rango parametrizado a la tabla
   * @returns {Boolean}
   */
  agregarRango = () => {
    // Validar si hay rutas y la hora es valida
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      const { titulo, mensaje } = validacion.mensaje;
      this.props.mostrarAlerta(titulo, mensaje);
      return;
    }

    const { canastaHorariaSuministro } = this.props;
    const { horaFin, ultimaHora } = this.state;
    let rangos = [];

    if (Util.validarArreglo(canastaHorariaSuministro.canastaConRutas)) {
      rangos = [...canastaHorariaSuministro.canastaConRutas];
    }

    // Determina cuál es la hora de inicio del rango que se va a crear
    const horaInicio = (ultimaHora !== '00:00')
      ? this.convertirValorAHora(parseInt(ultimaHora) - 1).substring(0, 4) + '1'
      : ultimaHora;

    const nuevoRango = {
      rango: {
        horaInicio: horaInicio,
        horaFin: horaFin
      },
      rutas: this.configurarRangoPorRutas()
    };

    rangos.push({ idRangoConRuta: Util.generarIdControl('canastaConRuta_'), ...nuevoRango });
    this.setState({ ultimaHora: this.obtenerNuevaHoraFin(horaFin) });
    this.actualizarEstadoRedux({ canastaConRutas: rangos });
  };

  /**
   * Método encargado de configurar los rangos dependiendo de la ruta
   * @returns {Array}
   */
  configurarRangoPorRutas = () => {
    const rutas = [...this.obtenerRutasSeleccionadas()];
    return rutas.map(r => (
      { ...r, valor: 0, porcentaje: 0, idRutaRango: Util.generarIdControl('rangoRuta') }
    ));
  };

  /**
   * Método encargado de obtener una nueva hora fin
   * @param {Number} horaFin Hora fin actual
   */
  obtenerNuevaHoraFin = (horaFin) => {
    let nuevaHoraFin = horaFin === '23:59' ? 25 : parseInt(horaFin) + 1;
    return nuevaHoraFin;
  };

  /**
   * Método encargado de pasar el valor seleccionado a hora
   * @param {String} valor Valor seleccionado
   */
  convertirValorAHora = (valor) => {
    valor = parseInt(valor);
    if (valor.toString().length === 1) {
      return `0${valor}:00`;
    }
    return `${valor}:00`;
  };

  /**
   * Método encargado de validar los campos del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    // Validar que haya rutas seleccionadas
    if (!Util.validarArreglo(this.obtenerRutasSeleccionadas())) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos una ruta.' } };
    }
    return { respuesta: true };
  };

  /**
   * Método encargado de controlar el cambio en los rangos de la ruta
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambioRangoRuta = (evento) => {
    // Controlar cambio
    const estadoContrato = getProp(this.props, 'estadoContrato', '');
    let desabilitarE = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitarE = true;
    }
    if (desabilitarE) {
      return;
    }
    const control = evento.target;
    const valor = control.value;
    const nombrePropiedad = control.name;
    const idRango = control.attributes['data-rango'].value;
    const idRuta = (control.attributes['data-ruta']) ? control.attributes['data-ruta'].value : undefined;
    const idSin = (control.attributes['data-sin']) ? control.attributes['data-sin'].value : undefined;
    const idMedidor = (control.attributes['data-medidor']) ? control.attributes['data-medidor'].value : undefined;
    const idTramo = (control.attributes['data-tramo']) ? control.attributes['data-tramo'].value : undefined;
    const nuevosRangos = !this.props.intervalos ? [...this.props.canastaHorariaSuministro.canastaConRutas] : [...this.props.canastaConsumoSuministro.canastaConRutas];
    const indexRango = nuevosRangos.findIndex(a => a.idRangoConRuta === idRango);
    const rango = { ...nuevosRangos[indexRango] };
    const rutas = [...rango.rutas];
    if (idRuta) {
      const indexRuta = nuevosRangos[indexRango].rutas.findIndex(b => b.idRutaRango === idRuta);
      const ruta = { ...rutas[indexRuta] };
      ruta[nombrePropiedad] = valor;
      rutas[indexRuta] = ruta;
    }

    if (idMedidor) {
      const indexMedidor = nuevosRangos[indexRango].rutas.findIndex(b => b.idMedidorRango === idMedidor);
      const medidor = { ...rutas[indexMedidor] };
      medidor[nombrePropiedad] = valor;
      rutas[indexMedidor] = medidor;
    }

    if (idSin) {
      const indexSin = nuevosRangos[indexRango].rutas.findIndex(b => b.idRangoSin === idSin);
      const valorSin = { ...rutas[indexSin] };
      valorSin[nombrePropiedad] = valor;
      rutas[indexSin] = valorSin;
    }

    if (idTramo) {
      const indexTramo = nuevosRangos[indexRango].rutas.findIndex(b => b.idTramoRango === idTramo);
      const tramo = { ...rutas[indexTramo] };
      if (evento.target.name == 'porcentaje') {
        tramo[nombrePropiedad] = valor;
      } else {
        tramo.cargos[nombrePropiedad] = valor;
      }
      rutas[indexTramo] = tramo;
    }

    rango.rutas = rutas;
    nuevosRangos[indexRango] = rango;
    this.actualizarEstadoRedux({ canastaConRutas: nuevosRangos });
  };

  /**
   * Método encargado de controlar el cambio del porcentaje
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambioPorcentaje = (evento) => {
    const estadoContrato = getProp(this.props, 'estadoContrato', '');
    let desabilitarE = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitarE = true;
    }
    if (desabilitarE) {
      return;
    }
    const control = evento.target;
    const valor = control.value;
    const idRango = control.attributes['data-rango'].value;
    const nuevosRangos = !this.props.intervalos ? [...this.props.canastaHorariaSuministro.canastaConRutas] : [...this.props.canastaConsumoSuministro.canastaConRutas];
    const indexRango = nuevosRangos.findIndex(a => a.idRangoConRuta === idRango);
    const rango = { ...nuevosRangos[indexRango] };
    rango.porcentaje = valor;
    nuevosRangos[indexRango] = rango;
    this.actualizarEstadoRedux({ canastaConRutas: nuevosRangos });
  }

  /**
   * Método encargado de controlar el cambio de los rangos
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
   controlarCambioRango = (evento) => {
    const estadoContrato = getProp(this.props, 'estadoContrato', '');
    let desabilitarE = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitarE = true;
    }
    if (desabilitarE) {
      return;
    }
    const control = evento.target;
    const valor = control.value;
    const idRango = control.attributes['data-rango'].value;
    const nombreRango = control.attributes['name'].value;
    const nuevosRangos = !this.props.intervalos ? [...this.props.canastaHorariaSuministro.canastaConRutas] : [...this.props.canastaConsumoSuministro.canastaConRutas];
    const indexRango = nuevosRangos.findIndex(a => a.idRangoConRuta === idRango);
    const rango = { ...nuevosRangos[indexRango] };
    if(nombreRango=='rangoinicial'){
      rango.rango.inicio = valor;
    }else if(nombreRango=='rangofinal'){
      rango.rango.fin = valor;
    }
    nuevosRangos[indexRango] = rango;
    this.actualizarEstadoRedux({ canastaConRutas: nuevosRangos });
  }

  /**
   * Método encargado de mostrar la tabla de rangos
   * @return {JSX}
   */
  renderTablaRangos = () => {
    // TODO: Si se agregan rutas después de que la tabla se ha renderizado, actualizar la tabla
    const { canastaHorariaSuministro } = this.props;
    const canastaSuministro = (!this.props.intervalos) ? this.props.canastaHorariaSuministro : this.props.canastaConsumoSuministro;

    if (!canastaSuministro || !canastaSuministro.canastaConRutas || !Util.validarArreglo(canastaSuministro.canastaConRutas)) {
      return null;
    }
    // TODO: Agregar cabecera a esta tabla
    return (
      <div className='mt-5'>
        <div className="lst-canasta-rangos">
          <div className="lst-canasta-rangos__rango header">
            <div className="text-center horas-rango">Rango</div>
          </div>
          <div className="lst-canasta-rangos__rango header">
            <div className="text-center horas-rango">%</div>
          </div>
          <div className="lst-canasta-rangos__rutas header">
            <div className="lst-canasta-rangos__rutas__fila">
              <div className="lst-canasta-rangos__rutas__fila__ruta header">Entidad</div>
              <div className='lst-canasta-rangos__rutas__fila__valor header'>Valor</div>
              {Util.validarArreglo(canastaSuministro.canastaConRutas[0].rutas.filter(r => r.trmIderegistro)) &&
                <Fragment>
                  <div className="lst-canasta-rangos__rutas__fila__ruta header">C. Variable</div>
                  <div className='lst-canasta-rangos__rutas__fila__valor header'>C. FIjo</div>
                  <div className='lst-canasta-rangos__rutas__fila__porcentaje header'>C. AO&M</div>
                </Fragment>
              }
            </div>
          </div>
        </div>
        {
          canastaSuministro.canastaConRutas.map((rango, index) => {
            return (
              <div className='lst-canasta-rangos' key={rango.idRangoConRuta}>
                <div className="lst-canasta-rangos__rango">
                <div class="container">
                    <div class="row">
                      <div class="col-5">
                        <TextoNumerico
                        aceptaDecimales={true}
                        aceptaNegativos={false}
                        value={rango.rango.inicio}
                        cols={0}
                        onChange={this.controlarCambioRango}
                        name={'rangoinicial'}
                        extra={{ 'data-rango': rango.idRangoConRuta }}
                        />
                      </div>
                      <div class="col-2">
                        <label>
                        </label>
                      <div className="text-center">-</div>
                      </div>
                      <div class="col-5">
                        <TextoNumerico
                        aceptaDecimales={true}
                        aceptaNegativos={false}
                        value={rango.rango.fin}
                        cols={0}
                        onChange={this.controlarCambioRango}
                        name={'rangofinal'}
                        extra={{ 'data-rango': rango.idRangoConRuta }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lst-canasta-rangos__rango">
                  <TextoNumerico
                    aceptaDecimales={true}
                    aceptaNegativos={false}
                    cols={12}
                    value={rango.porcentaje}
                    onChange={this.controlarCambioPorcentaje}
                    name={'porcentaje'}
                    extra={{ 'data-rango': rango.idRangoConRuta }}
                  />
                </div>
                <div className="lst-canasta-rangos__rutas">
                  {
                    rango.rutas.map(ruta => {
                      return (
                        <div key={ruta.idRutaRango} className="lst-canasta-rangos__rutas__fila">
                          <div className="lst-canasta-rangos__rutas__fila__ruta">
                            {(ruta.nombre != '') ? ruta.nombre : 'Valores skids ATR o GNCV ' + (index + 1)}
                          </div>
                          <div className="lst-canasta-rangos__rutas__fila__valor">
                            <TextoNumerico
                              aceptaDecimales={true}
                              aceptaNegativos={false}
                              label='Valor'
                              cols={12}
                              value={ruta.valor}
                              onChange={this.controlarCambioRangoRuta}
                              name={'valor'}
                              extra={{ 'data-rango': rango.idRangoConRuta, 'data-ruta': ruta.idRutaRango, 'data-medidor': ruta.idMedidorRango, 'data-sin': ruta.idRangoSin, disabled: (ruta.trmIderegistro) ? true : false }}
                            />
                          </div>
                          {Util.validarArreglo(canastaSuministro.canastaConRutas[0].rutas.filter(r => r.trmIderegistro)) &&
                            <div className="lst-canasta-rangos__rutas__fila__valor">
                              <TextoNumerico
                                aceptaDecimales={true}
                                aceptaNegativos={false}
                                label='Valor'
                                cols={12}
                                value={(ruta.cargos) ? ruta.cargos.cntrCargovariable : ' '}
                                onChange={this.controlarCambioRangoRuta}
                                name={'cntrCargovariable'}
                                extra={{ 'data-rango': rango.idRangoConRuta, 'data-ruta': ruta.idRutaRango, 'data-medidor': ruta.idMedidorRango, 'data-tramo': ruta.idTramoRango, disabled: (ruta.cargos) ? false : true }}
                              />
                            </div>
                          }
                          {Util.validarArreglo(canastaSuministro.canastaConRutas[0].rutas.filter(r => r.trmIderegistro)) &&
                            <div className="lst-canasta-rangos__rutas__fila__valor">
                              <TextoNumerico
                                aceptaDecimales={true}
                                aceptaNegativos={false}
                                label='trcaCargoaoym'
                                cols={12}
                                value={(ruta.cargos) ? ruta.cargos.trcaCargofijo : ' '}
                                name={'trcaCargoaoym'}
                                extra={{ disabled: true }}
                              />
                            </div>
                          }
                          {Util.validarArreglo(canastaSuministro.canastaConRutas[0].rutas.filter(r => r.trmIderegistro)) &&
                            <div className="lst-canasta-rangos__rutas__fila__valor">
                              <TextoNumerico
                                aceptaDecimales={true}
                                aceptaNegativos={false}
                                label='trcaCargoaoym'
                                cols={12}
                                value={(ruta.cargos) ? ruta.cargos.trcaCargoaoym : ' '}
                                name={'trcaCargoaoym'}
                                extra={{ disabled: true }}
                              />
                            </div>
                          }
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            );
          })
        }
      </div>
    );
  };

  /**
   * Método obtener los porcentajes dado un rango
   * @param {Object} rango Datos del rango
   * @returns {Object}
   */
  obtenerPorcentajeRango = (rango) => {
    let porcentaje = rango.rutas.reduce((c, r) => (c + parseFloat(r.porcentaje)), 0);
    if (isNaN(porcentaje)) {
      porcentaje = 0;
    }
    let estilo = porcentaje !== 100 ? 'red' : 'green';
    let icono = porcentaje !== 100 ? <i className='fa fa-fw fa-warning'></i> : <i className='fa fa-fw fa-check'></i>;
    return (<span className="linea-alerta" style={{ color: estilo }}>{icono} Porcentaje de Comercialización del Rango: {porcentaje}%</span>);
  }

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <div>
        <div className='row'>
        </div>
        <div>
          {this.renderTablaRangos()}
        </div>
      </div>
    );
  }
}

SuministroConRuta.propTypes = {
  listaUnidadesMedida: PropTypes.array,
  rutasGNC: PropTypes.array,
  actualizarListaContratos: PropTypes.func,
  canastaHorariaSuministro: PropTypes.object,
  actualizarCabeceraRedux: PropTypes.func,
  intervalos: PropTypes.any
};

SuministroConRuta.defaultProps = {
  canastaHorariaSuministro: {}
};

export { SuministroConRuta };
