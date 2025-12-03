import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Botonera, Combo, Fecha, Tabla, Util, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import { mostrarAlerta } from '../../store/actions/AplicacionAcciones';
import RUTAS_API from '../../global/rutas_api';
import './AgendamientoManual.scss';
import { columnasTablaCuentas, columnasTablaRutas } from './ColumnasTablas';
import { SelectorMultiple } from '../utils/SelectorMultiple';

const listaZar = [{ text: 'SI', value: 'S' }, { text: 'NO', value: 'N' }];
const zonas = [{ text: 'URBANO', value: 'U' }, { text: 'RURAL', value: 'R' }];

class AgendamientoManual extends Component {

  state = {
    mostrarModalConsulta: false,
    contratantes: [],
    procesos: [],
    proyectos: [],
    listaZar: listaZar,
    zonas: zonas,
    servicios: [],
    cuentas: [],
    actividades: [],
    contratistas: [],
    unidadesReponsables: [],
    zar:'-1',
    zona:'',
    organismos:[],
    cantidad:''
  };

  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
    this.cargarDatosAplicacion();
  }

  /**
   * Comprueba una respuesta de una petición y retorna los datos que de la misma.
   * @param {Object} response
   * @param {Object|Array} defaultData
   * @return {Object|Array}
   */
  obtenerDatos = (response, defaultData = []) => {
    return response.data.codigo > 0 ? response.data.datos : defaultData;
  };

  /**
   * Carga los datos de las listas principales.
   */
  cargarDatosAplicacion() {
    const peticiones = [
      axios.post(RUTAS_API.AGENDAMIENTO_MANUAL.CONSULTAR_CONTRATANTES),
    ];
    axios.all(peticiones)
      .then(
        axios.spread((contratantes) => {
          this.setState({
            contratantes: this.obtenerDatos(contratantes),
          })
        })
      )

      //Listar  los organismo
      axios.post(RUTAS_API.AGENDAMIENTO_MANUAL.CONSULTAR_ORGANISMOS)
      .then(respuesta => {
        const datos = this.obtenerDatos(respuesta);
        this.setState({ organismos: datos });
      });  

     
      //Listar contratistas
      axios.post(RUTAS_API.AGENDAMIENTO_MANUAL.CONSULTAR_CONTRATISTAS)
        .then(respuesta => {
          const datos = this.obtenerDatos(respuesta);
          this.setState({ contratistas: datos });
        });
  }

  /**
   * Limpia el formulario...
   */
  limpiarFormulario = (evento) => {
    this.setState({
      mostrarModalConsulta: false,
      contratante: '',
      proceso: '',
      proyecto: '',
      servicio: '',
      zona: '',
      actividad: '',
      contratista: '',
      unidadResponsable: '',
      fechaProgramacion: '',
      rutas: [],
      cuentas: [],
      organismo:''
    });
  };

  /**
   * Se ejecuta cuando el componente se destruye del contenedor...
   */
  componentWillUnmount() {
    this.limpiarFormulario();
  }

  /**
   * Retorna las funciones de la botonera...
   * @return {Array}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Limpiar Formulario', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Controla el onChange de los componentes del formulario y los modifica en el state...
   */
  controlarCambio = (evento) => {
    let change = {};
    const { name, value } = evento.target;
    change[name] = value;
    this.validarConsultas(name, value);
    this.setState(change);
  };

  /**
   * Colnsulta la lista de proyectos...
   */
  consultarProyectos = (empresaContratante) => {
    axios.post(RUTAS_API.AGENDAMIENTO_MANUAL.CONSULTAR_PROYECTOS, { empresaContratante: empresaContratante })
      .then(respuesta => {
        const datos = this.obtenerDatos(respuesta);
        this.setState({ proyectos: datos });
      });
  };

  /**
   * Consulta la lista de procesos...
   */
  consultarProcesos = (empresaContratante) => {
    axios.post(RUTAS_API.AGENDAMIENTO_MANUAL.CONSULTAR_PROCESOS, { empresaContratante: empresaContratante })
      .then(respuesta => {
        const datos = this.obtenerDatos(respuesta);
        this.setState({ procesos: datos });
      });
  };

  /**
   * Consulta los servicios...
   */
  consultarServicios = (empresaContratante, uniProceso) => {
    axios.post(RUTAS_API.AGENDAMIENTO_MANUAL.CONSULTAR_SERVICIOS, { empresaCod: empresaContratante, uniProceso: uniProceso })
      .then(respuesta => {
        const datos = this.obtenerDatos(respuesta);
        this.setState({ servicios: datos });
      });
  };

  /**
   * Consulta las actividades...
   */
  consultarActividades = (empresaCod, uniProceso, servicioCod) => {
    axios.post(RUTAS_API.AGENDAMIENTO_MANUAL.CONSULTAR_ACTIVIDADES, {
      "empresaCod": empresaCod,
      "uniProceso": uniProceso,
      "servicioCod": servicioCod
    }).then(respuesta => {
      const datos = this.obtenerDatos(respuesta);
      this.setState({ actividades: datos });
    })
  };

  /**
   * Consulta las unidades responsables...
   */
  consultarUnidadesResponsables = (empresaContratante, uniProceso) => {
    axios.post(RUTAS_API.AGENDAMIENTO_MANUAL.CONSULTAR_UNIDADES_RESPONSABLES, { empresaCod: empresaContratante, uniProceso: uniProceso })
      .then(respuesta => {
        const datos = this.obtenerDatos(respuesta);
        this.setState({ unidadesReponsables: datos });
      });
  };

  /**
   * Valida las consultas y procesos que debe ejecutar cuando cambia el valor de un componente.
   */
  validarConsultas = (name, value) => {
    switch (name) {
      case 'contratante':
        this.consultarProyectos(value);
        this.consultarProcesos(value);
        break;
      case 'contratista':
        this.consultarUnidadesResponsables(value,this.state.proceso);
        break;
      case 'proceso':
        this.consultarServicios(this.state.contratante, value);
        break;  
      case 'servicio':
        this.consultarActividades(this.state.contratante, this.state.proceso, value);
        break;
    }
  };

  /**
   * Elimina los atributos vacios...
   */
  llenarAtributosVacios = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (!value || value == '' || value == '-1') {
          delete obj[key];
        }
      }
    }
    return obj;
  };

  /**
   * Valida que los datos para el filtro de las actividades se encuentre disponible.
   */
  validarFormularioFiltroActividades = () => {
    const { contratante, proceso, servicio, contratantes } = this.state;
    const objContratante = contratantes.find(c => c.empresaCod == contratante);
    if (!objContratante) {
      return { respuesta: false, mensaje: 'Debe seleccionar un contratante.' };
    }
    if (!proceso) {
      return { respuesta: false, mensaje: 'Debe seleccionar un proceso.' };
    }
    if (!servicio) {
      return { respuesta: false, mensaje: 'Debe seleccionar un servicio.' };
    }
    return { respuesta: true };
  }

  /**
   * Filtra un objeto contratante por el codigo del contratante seleccionado.
   * @return {Object}
   */
  obtenerContratante = () => {
    const { contratante, contratantes } = this.state;
    const objContratante = contratantes.find(c => c.empresaCod == contratante);
    return objContratante;
  };

  /**
   * Controla la selección de una cuenta | Checkbox de la tabla rutas.
   */
  seleccionarCuenta = (cuenta, evento) => {
    const { cuentas } = this.state;
    const cuentasNuevo = cuentas.map(c => {
      if (c.ideSuscriptor == cuenta.ideSuscriptor) {
        c.seleccionado = evento.target.checked;
      }
      return c;
    });
    this.setState({
      cuentas: cuentasNuevo
    })
  };

  obtenerActividadesSeleccionadas = () => {
    const { actividades } = this.state;
    return actividades
      .filter(actividad => actividad.seleccionado)
      .map(actividad => actividad.servicioCod).join(',');
  };

  obtenerValor = (valor) => {
    if (this.validarValor(valor)) {
      return '';
    }
    return valor;
  };

  /**
   * Retorna el objeto para consultar las rutas...
   * @return {Object}
   */
  obtenerObjetoConsultaRutas = () => {
    const { proceso, servicio, proyecto, zar, zona,organismo,cantidad } = this.state;
    const objContratante = this.obtenerContratante();
    const obj = {
      empresaSevemp: this.obtenerValor(objContratante.empresaSevemp),
      uniProceso: this.obtenerValor(proceso),
      servicioCod: this.obtenerValor(servicio),
      proyecto: this.obtenerValor(proyecto),
      zar: this.obtenerValor(zar),
      zona: this.obtenerValor(zona),
      actividad: this.obtenerValor(this.obtenerActividadesSeleccionadas()),
      organismo:this.obtenerValor(organismo),
      cantidad:cantidad
    };
    return obj;
  }

  /**
   * Consulta las rutas... (Botón Consultar).
   */
  consultarRutas = () => {
    const respuesta = this.validarFormularioFiltroActividades();
    if (!respuesta.respuesta) {
      return this.props.mostrarAlerta('Información', respuesta.mensaje);
    }

    const obj = this.obtenerObjetoConsultaRutas();
    axios.post(RUTAS_API.AGENDAMIENTO_MANUAL.CONSULTAR_RUTAS, obj).then(respuesta => {
      const datos = this.obtenerDatos(respuesta);
      this.setState({ rutas: datos });
      this.setState({cuentas:[]});
    });
  };

  obtenerObjetoModeloAsignacion = () => {
    return {
      "uniProceso": "",
      "codSuscriptor": "",
      "ideSuscriptor": 0,
      "ureIderegistro": "",
      "fechaProgramacion": "",
      "ideActividad": 0,
      "ideActividades": 0,
      "camporeferencia": "",
      "tablareferencia": "",
      "duracion": 0,
      "tipo": "",
      "observaciones": "",
      "direccion": "",
      "barrio": "",
      "telefono": "",
      "correo": ".",
      "nombrecliente": ""
    };
  };

  /**
   * Consulta las cuentas de la ruta seleccionada (btns ver de la tabla rutas);
   */
  verRuta = (ruta) => {
    const { proceso, servicio, proyecto, zar, zona, cuentas,organismo,cantidad } = this.state;
    const objContratante = this.obtenerContratante();
    if (!objContratante) {
      return this.props.mostrarAlerta('Inforamción', 'Debe seleccionar un contratante.');
    }
    axios.post(RUTAS_API.AGENDAMIENTO_MANUAL.CONSULTAR_CUENTAS, {
      "empresaSevemp": this.obtenerValor(objContratante.empresaSevemp),
      "uniProceso": this.obtenerValor(proceso),
      "servicioCod": this.obtenerValor(servicio),
      "rutaIde": this.obtenerValor(ruta.rutaIde),
      "proyecto": this.obtenerValor(proyecto),
      "zar": this.obtenerValor(zar),
      "zona": this.obtenerValor(zona),
      "actividad": this.obtenerValor(this.obtenerActividadesSeleccionadas()),
      "organismo":this.obtenerValor(organismo),
      "cantidad":cantidad
    })
      .then(respuesta => {
        const datos = cuentas.concat(this.obtenerDatos(respuesta));

        this.setState({ cuentas: datos });
      });
  };

  cambiarEstadoRangos = (estado = true) => {
    let { rangoInicial, rangoFinal } = this.state;
    if (!rangoInicial || rangoInicial < 0) {
      return this.props.mostrarAlerta('Error', 'Debe seleccionar el rango inicial.');
    }

    if (!rangoFinal || rangoFinal < 0) {
      return this.props.mostrarAlerta('Error', 'Debe seleccionar el rango final.');
    }

    if (rangoFinal < rangoInicial) {
      return this.props.mostrarAlerta('Error', 'El rango final debe ser igual o mayor al rango inicial.');
    }

    const cuentas = this.state.cuentas.map((cuenta, index) => {
      const indice = index + 1;
      if (indice >= rangoInicial && indice <= rangoFinal) {
        cuenta.seleccionado = estado;
      }
      return cuenta;
    });
    this.setState({ cuentas });
  };

  /**
   * Renderiza la tabla de las cuentas...
   */
  renderTablaCuentas = () => {
    return (
      <div className='mt-5 agendamiento-manual'>
        <div className='caja contenedor'>
          <label className='tag'>Seleccionar por Rangos</label>
          <div className='formulario'>
            <TextoNumerico
              aceptaDecimales={false}
              aceptaNegativos={false}
              label='Rango inicial:'
              cols={4}
              value={this.state.rangoInicial}
              onChange={this.controlarCambio}
              name='rangoInicial'
            />
            <TextoNumerico
              aceptaDecimales={false}
              aceptaNegativos={false}
              label='Rango Final:'
              cols={4}
              value={this.state.rangoFinal}
              onChange={this.controlarCambio}
              name='rangoFinal'
            />
            <div className='col-md-12'>
              <button className='btn btn-primary mr-3' onClick={() => this.cambiarEstadoRangos(true)}><i className='fa fa-fw fa-plus'></i> Seleccionar Rangos</button>
              <button className='btn btn-primary' onClick={() => this.cambiarEstadoRangos(false)}><i className='fa fa-fw fa-minus'></i> Deseleccionar Rangos</button>
            </div>
          </div>
        </div>
        <Tabla datos={this.state.cuentas} columnas={columnasTablaCuentas((props, evento) => this.seleccionarCuenta(props.original, evento))} />
      </div>
    )
  };

  /**
   * Renderiza la tabla de rutas...
   */
  renderTablaRutas = () => {
    return (
      <div className='pt-5 agendamiento-manual'>
        <Tabla datos={this.state.rutas} columnas={columnasTablaRutas((props) => this.verRuta(props.original))} />
      </div>
    );
  };

  /**
   * Valida que un valor sea diferente de vacio o -1.
* @return {Boolean}
    */
  validarValor = (valor) => {
    return !valor || valor == '' || valor == '-1';
  }

  /**
   * Valida que los datos necesarios para realizar la asignación se encuentren disponibles...
   */
  validarFormularioAsignacion = () => {
    const { unidadResponsable, fechaProgramacion, actividad, cuentas } = this.state;
    if (this.validarValor(unidadResponsable)) {
      return { respuesta: false, mensaje: 'Debe seleccionar una unidad responsable.' };
    }
    if (this.validarValor(fechaProgramacion)) {
      return { respuesta: false, mensaje: 'Debe seleccionar una fecha de programación.' };
    }
    if (cuentas.filter(c => c.seleccionado).length == 0) {
      return { respuesta: false, mensaje: 'Debe seleccionar como mínimo una cuenta.' };
    }
    return { respuesta: true };
  }

  /**
   * Obtiene la lista de registros que se van a asignar...
* @return {Array}
    */
  obtenerRegistrosParaAsignar = () => {
    const { proceso, unidadResponsable, fechaProgramacion, actividad } = this.state;
    return this.state.cuentas.filter(cuenta => cuenta.seleccionado)
      .map(cuenta => {
        const obj = this.obtenerObjetoModeloAsignacion();
        return {
          ...obj,
          "uniProceso": proceso,
          "codSuscriptor": cuenta.codSuscriptor,
          "ideSuscriptor": cuenta.ideSuscriptor,
          "ureIderegistro": unidadResponsable,
          "fechaProgramacion": fechaProgramacion,
          "ideActividad": actividad,
          "idActividades": this.obtenerActividadesSeleccionadas(),
          ...cuenta
        };
      });
  };

  /**
   * Ejecuta la petición para asignar las cuentas seleccionadas...
   */
  asignar = () => {
    const respuesta = this.validarFormularioAsignacion();
    if (!respuesta.respuesta) {
      return this.props.mostrarAlerta('Información', respuesta.mensaje);
    }
    const registrosParaAsignar = this.obtenerRegistrosParaAsignar();
    axios.post(RUTAS_API.AGENDAMIENTO_MANUAL.ASIGNAR, registrosParaAsignar).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        this.props.mostrarAlerta('Correcto', 'Se han asignado correctamente las cuentas.');
        this.consultarRutas();
      } else {
        this.props.mostrarAlerta('Error', 'No se han podido asignar correctamente las cuentas.');
      }
    });
  };

  seleccionarItem = (evento) => {
    const control = evento.target;
    const value = control.value;
    const actividades = this.state.actividades.map(actividad => {
      if (actividad.servicioCod == value) {
        actividad.seleccionado = control.checked;
      }
      return actividad;
    });
    this.setState({ actividades: actividades });
  };

  render() {
    return (
      <Fragment>
        <h1>Agendamiento Manual</h1>
        <Botonera funciones={this.obtenerFunciones()} />

        <div className='caja contenedor'>
          <label className='tag'>Filtro de actividades</label>
          <div className='formulario'>
            <Combo
              opciones={this.state.contratantes}
              propTexto='empresaNom'
              propValor='empresaCod'
              label='Contratante: *'
              name='contratante'
              value={this.state.contratante}
              onChange={this.controlarCambio}
            />
            <Combo
              opciones={this.state.procesos}
              propTexto='prcDescripcion'
              propValor='uniProceso'
              label='Proceso: *'
              name='proceso'
              value={this.state.proceso}
              onChange={this.controlarCambio}
            />
            <Combo
              opciones={this.state.proyectos}
              propTexto='proyectoNom'
              propValor='proyectoIdregistro'
              label='Proyecto:'
              name='proyecto'
              value={this.state.proyecto}
              onChange={this.controlarCambio}
            />
            <Combo
              opciones={this.state.listaZar}
              propTexto='text'
              propValor='value'
              label='ZAR:'
              name='zar'
              value={this.state.zar}
              onChange={this.controlarCambio}
            />
            <Combo
              opciones={this.state.zonas}
              propTexto='text'
              propValor='value'
              label='Zona:'
              name='zona'
              value={this.state.zona}
              onChange={this.controlarCambio}
            />
            <Combo
              opciones={this.state.servicios}
              propTexto='servicioNom'
              propValor='servicioCod'
              label='Servicio: *'
              name='servicio'
              value={this.state.servicio}
              onChange={this.controlarCambio}
            />
            <SelectorMultiple
              titulo='Actividades:'
              propTexto='servicioNom'
              propValor='servicioCod'
              lista={this.state.actividades}
              seleccionarItem={this.seleccionarItem}
            />
             <Combo
              opciones={this.state.organismos}
              propTexto='terNomcompleto'
              propValor='terIderegistro'
              label='Organismo Inspeccion:'
              name='organismo'
              value={this.state.organismo}
              onChange={this.controlarCambio}
            />
            <TextoNumerico
              aceptaDecimales={false}
              aceptaNegativos={false}
              label='Cantidad de  visitas  Inspeccion:'
              cols={4}
              value={this.state.cantidad}
              onChange={this.controlarCambio}
              name='cantidad'
            />
            <div className='col-md-12'>
              <button className='btn btn-primary' onClick={this.consultarRutas}><i className='fa fa-fw fa-search'></i> Consultar</button>
            </div>            
          </div>
        </div>
        <div className='caja contenedor'>
          <label className='tag'>Asignar Trabajo</label>
          <div className='formulario'>
            <Combo
              propTexto="empresaNom"
              propValor="empresaCod"
              id="contratista"
              label="contratista"
              name="contratista"
              value={this.state.contratista}
              opciones={this.state.contratistas}
              onChange={this.controlarCambio}
            />

            <Combo
              opciones={this.state.unidadesReponsables}
              propTexto='cuadrillaNom'
              propValor='ureIderegistro'
              label='Unidad Responsable: *'
              name='unidadResponsable'
              value={this.state.unidadResponsable}
              onChange={this.controlarCambio}
            />
            <Fecha
              label='Fecha Programación: *'
              name='fechaProgramacion'
              fecha={this.state.fechaProgramacion}
              onChange={this.controlarCambio}
            />
            <div className='col-md-12'>
              <button className='btn btn-primary' onClick={this.asignar}><i className='fa fa-fw fa-plus'></i> Asignar</button>
            </div>
          </div>
        </div>
        {Util.validarArreglo(this.state.rutas) && this.renderTablaRutas()}
        {Util.validarArreglo(this.state.cuentas) && this.renderTablaCuentas()}
      </Fragment>
    );
  }
}

AgendamientoManual.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(AgendamientoManual);

export { VistaRedux as RAgendamientoManual };
