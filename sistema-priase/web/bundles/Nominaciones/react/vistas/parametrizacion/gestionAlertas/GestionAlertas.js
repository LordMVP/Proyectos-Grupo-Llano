import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util } from 'appfuture-react';
import axios from 'axios';

import RUTAS_API from '../../../global/rutas_api';
import { mostrarAlerta } from '../../../store/actions/AplicacionAcciones';

import './GestionAlertas.scss';

const UNIDADES_MEDIDA_TIEMPO = {
  MINUTO: 'MN',
  HORA: 'HO',
  DIAS: 'DD',
  SEMANAS: 'SN',
  MESES: 'MM',
  ANIOS: 'AA',
};

class GestionAlertas extends Component {

  state = {
    mostrarModalConsulta: false,
    listaIndicesParametrizacion: [],
    tiposEmision: [{ texto: 'Únicamente por la plataforma', valor: 'PT' }, { texto: 'Plataforma y Correo', valor: 'PC' }],
    listaDescripcionIndicesParametrizacion: [
      { texto: 'Minuto', valor: UNIDADES_MEDIDA_TIEMPO.MINUTO },
      { texto: 'Hora', valor: UNIDADES_MEDIDA_TIEMPO.HORA },
      { texto: 'Días', valor: UNIDADES_MEDIDA_TIEMPO.DIAS },
      { texto: 'Semanas', valor: UNIDADES_MEDIDA_TIEMPO.SEMANAS },
      { texto: 'Meses', valor: UNIDADES_MEDIDA_TIEMPO.MESES },
      { texto: 'Años', valor: UNIDADES_MEDIDA_TIEMPO.ANIOS }
    ],
    listaPeriodos: [],
    listaAlertas: [],
    listaAlertasAgregadas: [],
    listaDiasSemana: [],
    indiceInicio: '0',
    indiceFin: '0',
    medidaIndiceInicio: UNIDADES_MEDIDA_TIEMPO.MINUTO,
    medidaIndiceFin: UNIDADES_MEDIDA_TIEMPO.MINUTO,
    periodo: '-1',
    diaSemana: '-1',
    tipoEmision: '-1',
    mensaje: '',
    listaRangos: [],
    tipoAlerta: '-1',
  };

  /**
   * Método encargado de ejecutar acciones al momento de cargar el componente
   */
  componentDidMount() {
    this.consultarListaAlerta((obj) => {
      this.setState({
        listaIndicesParametrizacion: this.obtenerlistaIndicesParametrizacion(),
        listaPeriodos: this.obtenerListaPeriodos(),
        listaDiasSemana: this.obtenerListaDiasSemana(),
        listaAlertas: obj.listaAlertas,
        listaUsuarios: obj.listaUsuarios
      }, this.ejecutarCargarDatos);
    });
  }

  /**
   * Método encargado de ejecutar acciones al desmontar el componente
   */
  componentWillUnmount() {
    this.props.history.replace({ entidadEditar: null });
  }

  /**
   * Consulta la lista de alertas...
   */
  consultarListaAlerta = (callback) => {
    const peticiones = [
      axios.post(RUTAS_API.ALERTAS.CONSULTAR_ALERTAS),
      axios.post(RUTAS_API.ALERTAS.CONSULTAR_USUARIOS)
    ];

    axios.all(peticiones)
      .then(
        axios.spread((alertas, usuarios) => {
          const listaAlertas = Util.validarArreglo(alertas.data.datos) ? alertas.data.datos : [];
          const listaUsuarios = Util.validarArreglo(usuarios.data.datos) ? usuarios.data.datos : [];
          callback({
            listaAlertas: listaAlertas,
            listaUsuarios: listaUsuarios
          });
        })
      );
  };

  /**
   * Método encargado de cargar los datos del componente externo
   */
  ejecutarCargarDatos = () => {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
  };

  /**
   * Método encargado de formar una lista de indices de parametrización
   * @returns {Array}
   */
  obtenerlistaIndicesParametrizacion = () => {
    let lista = [];
    for (let i = 0; i <= 100; i++) {
      lista.push(i);
    }
    return lista;
  };

  /**
   * Método encargado de mostrar una lista de periodos
   * @returns {Array}
   */
  obtenerListaPeriodos = () => {
    let lista = [
      { texto: 'Cada Minuto', valor: 'MN' },
      { texto: 'Cada Hora', valor: 'HO' },
      { texto: 'Díario', valor: 'DD' },
      { texto: 'Semanal', valor: 'SN' },
      { texto: 'Mensual', valor: 'MS' },
      { texto: 'Anual', valor: 'AA' },
    ];
    return lista;
  };

  /**
  * Método encargado de mostrar una lista de días de la semana
  * @returns {Array}
  */
  obtenerListaDiasSemana = () => {
    let lista = [
      { texto: 'Domingo', valor: '0' },
      { texto: 'Lunes', valor: '1' },
      { texto: 'Martes', valor: '2' },
      { texto: 'Miércoles', valor: '3' },
      { texto: 'Jueves', valor: '4' },
      { texto: 'Viernes', valor: '5' },
      { texto: 'Sábado', valor: '6' },
    ];
    return lista;
  };

  /**
   * Método encargado de limpiar los de los usuarios
   * @returns {Array}
   */
  limpiarListaUsuarios = () => {
    return this.state.listaUsuarios.map(u => {
      delete u.seleccionado;
      return u;
    });
  };

  /**
   * Método encargado de limpiar los datos del formulario
   */
  limpiarFormulario = () => {
    this.setState({
      tipoAlerta: '',
      tipoEmision: '',
      mensaje: '',
      mostrarModalConsulta: false,
      listaRangos: [],
      indiceInicio: '1',
      medidaIndiceInicio: 'MN',
      indiceFin: '1',
      medidaIndiceFin: 'MN',
      listaUsuarios: this.limpiarListaUsuarios(),
    });
  };

  /**
    * Método encargado de limpiar los datos del formulario
    */
  componentWillUnmount() {
    this.limpiarFormulario();
  }

  /**
   * Método encargado de obtener los botones del componente botonera
   * @returns {Array}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Guardar', callback: this.guardarEntidad },
      { texto: 'Ejecutar Servicio', callback: this.ejecutarServicio },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de ejecutar el proceso de alertas
   */
  ejecutarServicio = () => {
    axios.post(RUTAS_API.ALERTAS.EJECUTAR_SERVICIO, { detener: false })
      .then(respuesta => {
        console.log(respuesta);
      });
  };

  /**
   * Obtiene el objeto que se enviará para actualizar la configuración de la alerta.
   * @return {Object}
   */
  obtenerEntidadGuardar = () => {
    const { tipoAlerta, mensaje, listaUsuarios } = this.state;
    const configuracion = {
      listaRangos: this.state.listaRangos.map(dato => {
        if (dato.indiceInicio == 'V') {
          dato.indiceInicio = -1
        }
        return dato;
      })
    };

    const usuarios = listaUsuarios
      .filter(usuario => usuario.seleccionado)
      .map(usuario => { return usuario.usuIderegistro });

    const obj = {
      altIderegistro: tipoAlerta,
      altAsunto: mensaje,
      altConfiguracion: JSON.stringify(configuracion),
      usuIdesnotifica: JSON.stringify(usuarios)
    };
    return obj;
  };

  /**
   * Método encargado de guardar la entidad
   * @returns {Boolean}
   */
  guardarEntidad = () => {
    const validacion = this.validarFormularioGuardar();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    const entidadGuardar = this.obtenerEntidadGuardar();

    // Reemplazar con ruta del Endpoint para guardar
    axios.post(RUTAS_API.ALERTAS.EDITAR, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de controlar el cambio de los componentes
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    const propiedad = evento.target.name;
    const valor = evento.target.value;
    change[propiedad] = valor;
    if (propiedad == 'tipoAlerta') {
      this.consultarDetalleAlerta(valor);
    }
    this.setState(change);
  };

  /**
   *  Método encargado de consultar los detalles por identificador de alerta
   * @param {Number} valor Identificador de la alerta
   */
  consultarDetalleAlerta = (valor) => {
    axios.post(RUTAS_API.ALERTAS.CONSULTAR_DETALLE_ALERTA, {
      altIderegistro: valor
    }).then(async respuesta => {
      if (respuesta.data.codigo > 0) {
        const obj = respuesta.data.datos;
        let configuracion = null;
        if (obj.altConfiguracion) {
          configuracion = JSON.parse(obj.altConfiguracion);
          const lista = this.state.listaUsuarios.map(usu => {
            usu.seleccionado = false;
            return usu;
          })
          await this.setState({
            listaUsuarios: lista
          });
        } else {
          configuracion = {};
        }

        await this.setState({
          indiceInicio: '1',
          medidaIndiceInicio: 'MN',
          indiceFin: '1',
          medidaIndiceFin: 'MN',
          periodo: '',
          mensaje: obj.altAsunto,
          tipoEmision: obj.altEmision,
          listaUsuarios: this.autoSeleccionarUsuarios(JSON.parse(obj.usuIdesnotifica)),
          listaRangos:
            Util.validarArreglo(configuracion.listaRangos) ? configuracion.listaRangos.map(dato => {
              if (dato.indiceInicio == '-1') {
                dato.indiceInicio = 'V'
              }
              return dato;
            }) : []
        });
      }
    });
  };

  /**
   * Método encargado de seleccionar los usuarios parametrizados para un usuario
   * @param {Array} listaUsuarios Lista de usuarios
   */
  autoSeleccionarUsuarios = (listaUsuarios) => {
    return this.state.listaUsuarios.map(usuario => {
      const index = listaUsuarios.findIndex(idUsuario => idUsuario == usuario.usuIderegistro);
      if (index >= 0) {
        usuario.seleccionado = true;
      }
      return usuario;
    });
  };

  /**
   * Método encargado de cerrar el componente ventana modal
   */
  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false
    });
  };

  /**
   * Método encargado de cargas los datos de componentes externos
   * @param {Object} entidad Datos del componente externo
   */
  cargarDatos = (entidad) => {
    this.setState({
      mostrarModalConsulta: false,
    });
  };

  /**
   * Método encargado de parsear la medida a minutos para calcular la diferencia
   * @param {String} indice Indice inicial
   * @param {String} medidaindice Calculo de indice
   */
  calcularMinutos = (indice, medidaindice) => {
    let minutos = indice;
    if (medidaindice == UNIDADES_MEDIDA_TIEMPO.HORA) {
      minutos = indice * 60;
    } else if (medidaindice == UNIDADES_MEDIDA_TIEMPO.DIAS) {
      minutos = (indice * 60) * 24;
    } else if (medidaindice == UNIDADES_MEDIDA_TIEMPO.SEMANAS) {
      minutos = (indice * 60) * 24 * 7;
    } else if (medidaindice == UNIDADES_MEDIDA_TIEMPO.MESES) {
      minutos = (indice * 60) * 24 * 30;
    } else if (medidaindice == UNIDADES_MEDIDA_TIEMPO.ANIOS) {
      minutos = (medidaindice * 60) * 24 * 365;
    }
    return minutos;
  };

  /**
   * Método encargado de procesar los rangos
   */
  parsearRango = (rango = null) => {
    let { indiceInicio, medidaIndiceInicio, indiceFin, medidaIndiceFin } = (rango == null) ? this.state : rango;
    return {
      inicio: this.calcularMinutos(indiceInicio, medidaIndiceInicio),
      fin: this.calcularMinutos(indiceFin, medidaIndiceFin)
    };
  };

  /**
   * Método encargado de agregar la alerta parametrizada
   */
  agregarAlerta = () => {
    const { listaAlertasAgregadas, tipoAlerta, indiceInicio, medidaIndiceInicio, indiceFin, medidaIndiceFin, periodo, diaSemana } = this.state;
    const obj = {
      tipoAlerta: tipoAlerta,
      rangoInicial: { indice: indiceInicio, medida: medidaIndiceInicio },
      rangoFin: { indice: indiceFin, medida: medidaIndiceFin },
      rangos: this.parsearRango(),
      periodo: periodo,
      diaSemana: diaSemana
    };
    let agregarValido = 0;
    listaAlertasAgregadas.forEach(alerta => {
      //Primero validamos si la alerta que se desea agregar está por debajo de los demás rangos...
      if (alerta.rangos.fin > obj.rangos.fin) {
        agregarValido++;
      }
      if (alerta.rangos.inicio > obj.rangos.inicio) {
        agregarValido++;
      }
    });

    if (agregarValido > 0) {
      this.mostrarAlerta('Alerta duplicada', 'La alerta que intenta agregar no puede cruzar los rangos con las que ya se encuentran agregada.');
      return;
    }

    listaAlertasAgregadas.push(obj);
    this.setState({ listaAlertasAgregadas: listaAlertasAgregadas });
  };

  /**
   * Método encargado de mostrar el selector de rangos inicial
   * @returns {JSX}
   */
  renderSelectorRangoInicial = () => {
    return (
      <div className='form-group col-3'>
        <label>Rango Inicial:</label>
        <div className='grupo-componente'>
          <div className='componente indice'>
            <select className='form-control'
              key={Util.generarIdControl('medidaIndiceInicio')}
              name='indiceInicio'
              value={this.state.indiceInicio}
              onChange={this.controlarCambio}>
              {
                this.state.listaIndicesParametrizacion.map(i => {
                  return <option key={Util.generarIdControl(i)} value={i}>{i}</option>;
                })
              }
              <option key={Util.generarIdControl('v')} value='V'>Vencido</option>
            </select>
          </div>
          <div className='componente descrip'>
            <select className='form-control'
              key={Util.generarIdControl('medidaIndiceInicio')}
              name='medidaIndiceInicio'
              value={this.state.medidaIndiceInicio}
              onChange={this.controlarCambio}
              disabled={this.state.indiceInicio === 'V'}
            >
              {
                this.state.listaDescripcionIndicesParametrizacion.map(d => {
                  return <option key={Util.generarIdControl(d.valor)} value={d.valor}>{d.texto}</option>
                })
              }
            </select>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Método encargado de mostrar el selector de rangos final
   * @returns {JSX}
   */
  renderSelectorRangoFinal = () => {
    return (
      <div className='form-group col-3'>
        <label>Rango Final:</label>
        <div className='grupo-componente'>
          <div className='componente indice'>
            <select className='form-control'
              key={Util.generarIdControl('indiceFin')}
              name='indiceFin'
              value={this.state.indiceFin}
              onChange={this.controlarCambio}>
              {
                this.state.listaIndicesParametrizacion.map(i => {
                  return <option key={Util.generarIdControl(i)} value={i}>{i}</option>;
                })
              }
            </select>
          </div>
          <div className='componente descrip'>
            <select className='form-control'
              key={Util.generarIdControl('medidaIndiceFin')}
              name='medidaIndiceFin'
              value={this.state.medidaIndiceFin}
              onChange={this.controlarCambio}
            >
              {
                this.state.listaDescripcionIndicesParametrizacion.map(d => {
                  return <option key={Util.generarIdControl(d.valor)} value={d.valor}>{d.texto}</option>
                })
              }
            </select>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Controla el evento change de los checks de la tabla usuarios.
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambioCheckTablaUsuarios = (evento) => {
    const usuarios = [...this.state.listaUsuarios];
    if (evento.target.name == 'checkSeleccionarTodos') {
      //Recorremos la lista y asignamos todos los usuarios como seleccionados...
      usuarios.forEach(usuario => {
        usuario.seleccionado = evento.target.checked;
      });
      this.setState({ listaUsuarios: usuarios });
      return;
    }
    const value = evento.target.value;
    const index = usuarios.findIndex(u => u.usuIderegistro == value);
    const usuarioActual = { ...usuarios[index] };
    usuarioActual.seleccionado = evento.target.checked;
    usuarios[index] = usuarioActual;
    this.setState({ listaUsuarios: usuarios });
  };

  /**
   * Método encargado de mostrar la tabla de usuarios
   * @returns {JSX}
   */
  renderTablaUsuarios = () => {
    return (
      <table className='table table-hover table-condensed table-striped table-bordered'>
        <thead>
          <tr className='bg-dark text-white'>
            <th><label><input type="checkbox" onChange={this.controlarCambioCheckTablaUsuarios} name='checkSeleccionarTodos' /> Seleccionar todos</label></th>
            <th>Nombre Usuario:</th>
            <th><i className='fa fa-fw fa-envelope'></i> Correo</th>
          </tr>
        </thead>
        <tbody>
          {Util.validarArreglo(this.state.listaUsuarios) && this.state.listaUsuarios.map((usuario, index) => {
            return (
              <tr key={Util.generarIdControl('tr_tablausuarios_' + index)}>
                <td><label><input type="checkbox" name={Util.generarIdControl('check_' + index)} checked={usuario.seleccionado || false} value={usuario.usuIderegistro} onChange={this.controlarCambioCheckTablaUsuarios} /> Seleccionar</label></td>
                <td>{usuario.usuarioNom}</td>
                <td>{usuario.usuarioMail}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    );
  };

  /**
   * Elimina de la lista rangos un indice.
   */
  quitarRango = (index) => {
    let { listaRangos } = this.state;
    listaRangos.splice(index, 1);
    this.setState({ listaRangos: listaRangos });
  };

  /**
   * Busca una unidad medida por código y retorna el nombre.
   * @return {string}
   */
  obtenerNombreUnidadMedida = (codigo) => {
    const unidad = this.state.listaDescripcionIndicesParametrizacion.find(obj => obj.valor == codigo);
    if (!unidad) {
      return 'No definido';
    }
    return unidad.texto;
  };

  /**
   * Busca un periodo por código y retorna el nombre.
   * @return {string}
   */
  obtenerNombrePeriodo = (codigo) => {
    const periodo = this.state.listaPeriodos.find(obj => obj.valor == codigo);
    if (!periodo) {
      return 'No definido';
    }
    return periodo.texto;
  };

  /**
   * Busca un día de la semana por código y retorna el nombre.
   * @return {string}
   */
  obtenerNombreDiaSemana = (codigo) => {
    const diaSemana = this.state.listaDiasSemana.find(obj => obj.valor == codigo);
    if (!diaSemana) {
      return 'No definido';
    }
    return diaSemana.texto;
  };

  /**
   * Renderiza la tabla de los rangos.
   * @return {Component}
   */
  renderTablaRangos = () => {
    return (
      <div className='col-md-12'>
        <table className='table table-condensed table-striped table-hover table-bordered'>
          <thead className='bg-dark text-white'>
            <tr>
              <th>Rango Inicial</th>
              <th>Rango Final</th>
              <th>Periodo</th>
              <th>Día semana</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {
              Util.validarArreglo(this.state.listaRangos) && this.state.listaRangos.map((rango, index) => {
                return (
                  <tr key={Util.generarIdControl(index)}>
                    <td>{(rango.indiceInicio == 'V') ? 'Vencido' : rango.indiceInicio + ' ' + this.obtenerNombreUnidadMedida(rango.medidaIndiceInicio)}</td>
                    <td>{(rango.indiceFin == '-1') ? 'No definido' : rango.indiceFin + ' ' + this.obtenerNombreUnidadMedida(rango.medidaIndiceFin)}</td>
                    <td>{this.obtenerNombrePeriodo(rango.periodo)}</td>
                    <td>{this.obtenerNombreDiaSemana(rango.diaSemana)}</td>
                    <td><a href="javascript:;" onClick={() => { this.quitarRango(index) }} title='Quitar rango'>Quitar</a></td>
                  </tr>
                )
              })
            }
            {!Util.validarArreglo(this.state.listaRangos) && (<tr><td colSpan='5'><i className='fa fa-fw fa-warning'></i> No se han agregado Rangos</td></tr>)}
          </tbody>
        </table>
      </div>
    )
  };

  /**
   * Evalua si un valor es inválido.
   * @return {boolean}
   */
  valorInvalido = (valor) => {
    if (!valor || valor == '-1' || valor.trim() == '') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Método encargado de validar los campos necesarios para guardar la alerta
   * @returns {Object}
   */
  validarFormularioGuardar = () => {
    const { listaRangos, listaUsuarios, tipoEmision, tipoAlerta, mensaje } = this.state;
    const listaFiltrada = listaUsuarios.filter(p => p.seleccionado == true);
    if (this.valorInvalido(tipoAlerta)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el tipo de alerta.' } };
    }

    if (this.valorInvalido(tipoEmision)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el tipo de emisión.' } };
    }

    if (this.valorInvalido(mensaje)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar el asunto de la notificación' } };
    }

    if (!Util.validarArreglo(listaRangos)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe agregar al menos un rango' } };
    }

    if (!Util.validarArreglo(listaFiltrada)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos un usuario.' } };
    }
    return { respuesta: true };
  };

  /**
   * Validará el formulario de los rangos.
   * @return {Object}
   */
  validarFormulario = () => {
    // Ejemplo Validacion
    const { indiceInicio, medidaIndiceInicio, indiceFin, medidaIndiceFin, periodo, diaSemana } = this.state;
    if (this.valorInvalido(indiceInicio)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un valor para el rango inicial.' } };
    }

    if (this.valorInvalido(medidaIndiceInicio)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una unidad de medida para el rango inicial.' } };
    }

    if (this.valorInvalido(indiceFin)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un valor para el rango final.' } };
    }

    if (this.valorInvalido(medidaIndiceFin)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una unidad de medida para el rango final.' } };
    }

    if (this.valorInvalido(periodo)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el periodo.' } };
    }

    if (this.valorInvalido(diaSemana) && periodo == 'S') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el día de la semana.' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de limpiar el detalle de rangos
   */
  limpiarDetallesRango = () => {
    this.setState({
      rangoInicial: '1',
      medidaIndiceInicio: 'MN',
      rangoFin: '1',
      medidaIndiceFin: 'MN',
    });
  };

  /**
   * Método para validar que no hayan lecturas repetidas
   * @param {number} indiceInicio Rango inicial
   * @returns {bool}
   */
  validarVencido = (indiceInicio) => {
    const index = this.state.listaRangos.findIndex(p => p.indiceInicio == indiceInicio);
    return index >= 0;
  };

  /**
   * Valida si el rango que se va a agregar se cruza con los existentes.
   * @param {array} listaRangos Lista de rangos
   * @param {object} configuracion Configuración actual
   * @returns {bool}
   */
  validarRangos = (listaRangos, configuracion) => {
    let cruces = 0;
    listaRangos.filter(rango => rango.indiceInicio != "V").forEach(rango => {
      if (!rango.rangos) {
        rango.rangos = this.parsearRango(rango);
      }
      const rangoInicioIgualOMenorAExistente = configuracion.rangos.inicio <= rango.rangos.inicio;
      const rangoFinIgualOMenorAExistente = configuracion.rangos.fin <= rango.rangos.fin;
      const rangoInicioIgualOMenorARangoFinExistente = configuracion.rangos.inicio <= rango.rangos.fin;
      const rangoFinMayorOIgualARangoInicioExistente = configuracion.rangos.fin <= rango.rangos.inicio
      if (rangoInicioIgualOMenorAExistente || rangoFinIgualOMenorAExistente || rangoInicioIgualOMenorARangoFinExistente || rangoFinMayorOIgualARangoInicioExistente) {
        cruces++;
      }
    });
    return (cruces == 0);
  };

  /**
   * Agregará un nuevo rango a la lista de rangos.
   * @returns {Boolean}
   */
  agregarRango = () => {
    const respuesta = this.validarFormulario();
    if (!respuesta.respuesta) {
      this.props.mostrarAlerta(respuesta.mensaje.titulo, respuesta.mensaje.mensaje);
      return;
    }
    const { indiceInicio, medidaIndiceInicio, indiceFin, medidaIndiceFin, periodo, diaSemana } = this.state;

    let { listaRangos } = this.state;
    const configuracion = {
      indiceInicio: indiceInicio,
      medidaIndiceInicio: medidaIndiceInicio,
      indiceFin: (indiceInicio == 'V') ? '-1' : indiceFin,
      rangos: this.parsearRango(),
      medidaIndiceFin: medidaIndiceFin,
      periodo: periodo,
      diaSemana: diaSemana,
    };

    if (parseInt(configuracion.rangos.inicio) > parseInt(configuracion.rangos.fin)) {
      this.props.mostrarAlerta('Error', 'El rango final debe ser superior al rango inicial.');
      return;
    }
	 const indiceVencidoExiste = listaRangos.findIndex(lr=>lr.indiceInicio == 'V');
	 if(indiceVencidoExiste >=0 && indiceInicio == 'V'){
		this.props.mostrarAlerta('Alerta duplicada', 'Solo puede haber una alerta con el rango vencido');
		return;
	 }
	 if(indiceInicio != 'V'){
		 if (!this.validarRangos(listaRangos, configuracion)) {
			 this.props.mostrarAlerta('Alerta duplicada', 'La alerta que intenta agregar no puede cruzar los rangos con las que ya se encuentran agregadas.');
			 return;
			}
		}
		if(indiceInicio == 'V'){
			listaRangos.unshift(configuracion);
			this.setState({ listaRangos: listaRangos });
			return;
		}
		listaRangos.push(configuracion);
		this.setState({ listaRangos: listaRangos });
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <Fragment>
        <div className='d-flex justify-content-center'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>

        <div className='conf-general row mt-5'>
          <Combo
            opciones={this.state.listaAlertas}
            propTexto='altNombre'
            propValor='altIderegistro'
            label='Tipo Alerta:'
            name='tipoAlerta'
            cols={6}
            value={this.state.tipoAlerta}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={this.state.tiposEmision}
            propTexto='texto'
            propValor='valor'
            label='Tipo Emisión:'
            name='tipoEmision'
            cols={6}
            value={this.state.tipoEmision}
            onChange={this.controlarCambio}
          />
          <div className='form-group col-12'>
            <label htmlFor='mensajeAlerta'>Asunto de la notificación: </label>
            <textarea
              id='mensajeAlerta'
              className='form-control'
              placeholder='Mensaje de notificación'
              name='mensaje'
              onChange={this.controlarCambio}
              value={this.state.mensaje}
            >{this.state.mensaje}</textarea>
          </div>
          <div className='col-12 bordered-alertas p-3 mt-3 mb-3'>
            <div className='row'>
              {this.renderSelectorRangoInicial()}
              {this.state.indiceInicio !== 'V' && this.renderSelectorRangoFinal()}
              <Combo
                opciones={this.state.listaPeriodos}
                propTexto='texto'
                propValor='valor'
                label='Periodo:'
                name='periodo'
                value={this.state.periodo}
                cols={3}
                onChange={this.controlarCambio}
              />
              {
                this.state.periodo === 'SN' && (
                  <Combo
                    opciones={this.state.listaDiasSemana}
                    propTexto='texto'
                    propValor='valor'
                    label='Día de la semana:'
                    name='diaSemana'
                    cols={3}
                    value={this.state.diaSemana}
                    onChange={this.controlarCambio}
                  />
                )
              }
              <div className='form-group col-3'>
                <button className='btn btn-primary m-t-24' onClick={this.agregarRango}><i className='fa fa-fw fa-plus'></i> Agregar</button>
              </div>
            </div>
          </div>
          {this.renderTablaRangos()}
          <div className='col-12 mt-3'>
            {this.renderTablaUsuarios()}
          </div>
        </div>
      </Fragment>
    );
  }
}

GestionAlertas.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionAlertas);

export { VistaRedux as RGestionAlertas };
