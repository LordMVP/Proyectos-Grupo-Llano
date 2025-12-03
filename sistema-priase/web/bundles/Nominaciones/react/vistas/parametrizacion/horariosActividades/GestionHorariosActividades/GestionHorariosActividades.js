import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, Fecha, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { CLASES_UNIDADES } from '../../../../global/constantes';
import './GestionHorariosActividades.scss';

const opcionesTipo = [
  {
    texto: 'Actual',
    valor: '0',
  },
  {
    texto: 'Siguiente',
    valor: '1',
  },
];

class GestionHorariosActividades extends Component {

  state = {
    // Datos de la entidad
    idActividad: '',
    actividad: '',
    horaInicial: '',
    horaFinal: '',
    tipo: '',
    listaActividadesCreadas: [],
    listaActividades: [],

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
      axios.post(RUTAS_API.PARAMETRIZACION.HORARIOS_ACTIVIDADES.CONSULTAR_ACTIVIDADES),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { criterio: '', idClase: CLASES_UNIDADES.ACTIVIDADES }),
    ];
    axios.all(peticiones)
      .then(axios.spread((actividadesCreadas, actividades) => {
        const datosAplicacion = {
          listaActividadesCreadas: [],
          listaActividades: [],
        };
        if (actividadesCreadas.data.codigo > 0) {
          datosAplicacion.listaActividadesCreadas = actividadesCreadas.data.datos;
        }
        if (actividades.data.codigo > 0) {
          datosAplicacion.listaActividades = actividades.data.datos;
        }
        this.setState({ ...datosAplicacion });
      }));

  }

  /**
   * Método encargado de limpiar los campos del formulario
	 * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  limpiarFormulario = (evento) => {
    this.setState({
      // Datos de la entidad
      actividad: '',
      horaInicial: '',
      horaFinal: '',
      tipo: '',
      idActividad: '',
    });
  };

  /**
   * Método encargado de limpiar el formulario al momento de salir
   */
  componentWillUnmount() {
    this.limpiarFormulario();
  }

  /**
   * Método encargado de generar los botones del formulario
	 * @returns {Object}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Guardar', callback: this.guardarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario },
    ];
  };

  /**
   * Método encargado de validar las variables del formulario
	 * @returns {Object}
   */
  validarFormulario = () => {
    const { actividad, horaInicial, horaFinal, tipo } = this.state;
    const regExp = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])/;
    // Validacion
    if (actividad === '' || actividad === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar la actividad' } };
    }

    if (horaInicial.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar la hora inicial de la actividad' } };
    }

    if (horaFinal.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar la hora final la actividad' } };
    }

    if (!regExp.test(horaInicial) || !regExp.test(horaFinal)) {
      return { respuesta: false, mensaje: { titulo: 'Datos Erroneos', mensaje: 'Las horas deben estar en formato 24 horas hh:mm:ss' } };
    }

    if (tipo === '' || tipo === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el tipo' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de consultar las actividades creadas
   */
  consultarActividades = () => {
    axios.post(RUTAS_API.PARAMETRIZACION.HORARIOS_ACTIVIDADES.CONSULTAR_ACTIVIDADES)
      .then(respuesta => {
        this.setState({ listaActividadesCreadas: respuesta.data.datos });
      });
  };

  /**
   * Método encargado de editar los datos de la actividad seleccionada
   * @param {Object} datos Datos de la actividad seleccionada
   */
  editarEntidad = (datos) => {
    axios.post(RUTAS_API.PARAMETRIZACION.HORARIOS_ACTIVIDADES.EDITAR, datos)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
          this.consultarActividades();
        }
      });
  };

  /**
   * Método encargado de guardar los datos de la entidad
	 * @returns {bool}
   */
  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    const { actividad, horaInicial, horaFinal, tipo, idActividad } = this.state;
    if (idActividad === null || idActividad === '') {
      const entidadGuardar = {
        uniIdeactividad: parseInt(actividad),
        actHorainicio: horaInicial,
        actHorafinal: horaFinal,
        actLimite: tipo,
      };

      axios.post(RUTAS_API.PARAMETRIZACION.HORARIOS_ACTIVIDADES.GUARDAR, entidadGuardar)
        .then(respuesta => {
          if (respuesta.data.codigo > 0) {
            this.limpiarFormulario();
            this.consultarActividades();
          }
        });
      return
    }
    const entidadEditar = {
      actIderegistro: idActividad,
      uniIdeactividad: parseInt(actividad),
      actHorainicio: horaInicial,
      actHorafinal: horaFinal,
      actLimite: tipo,
    }
    this.editarEntidad(entidadEditar);
  };

  /**
   * Método encargado de mostrar las columnas de la tabla
   * @returns {Object}
   */
  obtenerColumnas = () => {
    const contexto = this;
    return [
      {
        Header: 'Actividades',
        columns: [
          {
            Header: 'Acción',
            accessor: 'actIderegistro',
            Cell: (props) => contexto.renderCeldaAcciones(props, contexto)
          },
          {
            Header: 'Nombre Actividad',
            accessor: 'uniIdeactividad.uniIderegistro',
            Cell: contexto.obtenerTextoNombreActividad
          },
          {
            Header: 'Hora Inicial',
            accessor: 'actHorainicio'
          },
          {
            Header: 'Hora Final',
            accessor: 'actHorafinal'
          },
          {
            Header: 'Día limite',
            accessor: 'actLimite',
            Cell: contexto.obtenerTextoLimiteActividad
          },
        ]
      }
    ];
  };

  /**
   * Método encargado de obtener el nombre de la actividad
   * @param {Object} props Propiedades del componente Tabla
   */
  obtenerTextoNombreActividad = (props) => {
    const idNombreActividad = parseInt(props.row._original.uniIdeactividad.uniIderegistro);
    const nombreActividad = this.state.listaActividades.find(a => a.uniIderegistro === idNombreActividad);
    return (nombreActividad) ? nombreActividad.uniNombre1 : '';
  };

  /**
   * Método encargado de obtener el del día limite de la actividad
   * @param {Object} props Propiedades del componente Tabla
   */
  obtenerTextoLimiteActividad = (props) => {
    const idLimiteActividad = parseInt(props.row._original.actLimite);
    const textoLimiteActividad = opcionesTipo.find(a => a.valor == idLimiteActividad);
    return (textoLimiteActividad) ? textoLimiteActividad.texto : '';
  };

  /**
   * Método encargado de generar los botones de editar y borrar de la tabla de actividades
   * @param {Object} props Propiedades del componente Tabla
   * @param {Component} contexto Contexto del componente GestionHorariosActividades
   * @returns {Object}
   */
  renderCeldaAcciones = (props, contexto) => {
    return (
      <div className='text-center'>
        <a href='#' className='gestion-tramos__link-tabla' onClick={(evento) => {
          Util.detenerEvento(evento);
          contexto.editarActividad.call(contexto, props.row._original);
        }}>Editar</a>

        <a href='#' className='gestion-tramos__link-tabla' onClick={(evento) => {
          Util.detenerEvento(evento);
          contexto.borrarActividad.call(contexto, props.row._original);
        }}>
          Borrar
        </a>
      </div>
    );
  };

  /**
   * Metodo encargado de eliminar la actividad seleccionada
   * @param {Object} actividad Datos de la actividad seleccionada
   */
  borrarActividad = (actividad) => {
    const callback = () => {
      const index = this.state.listaActividadesCreadas.findIndex(a => a.actIderegistro === actividad.actIderegistro);
      let nuevasActividades = [...this.state.listaActividadesCreadas];
      nuevasActividades.splice(index, 1);
      axios.post(RUTAS_API.PARAMETRIZACION.HORARIOS_ACTIVIDADES.ELIMINAR_ACTIVIDAD, { idActividad: actividad.actIderegistro })
        .then(respuesta => {
          if (respuesta.data.codigo > 0) {
            this.setState({ listaActividadesCreadas: [...nuevasActividades] });
            this.props.mostrarAlerta('Proceso satisfactorio', 'Registro eliminado satisfactoriamente.');
          }
        });
    }
    this.props.mostrarAlerta('Confirmar', '¿Desea eliminar la actividad?', [
      { texto: 'Eliminar', callback: callback, clase: 'btn-danger' },
      { texto: 'Cancelar' }
    ]);
  };

  /**
   * Método encargado de cargar los datos de la actividad seleccionada
   * @param {Object} actividadSeleccionada Datos de la actividad seleccionada
   */
  editarActividad = (actividadSeleccionada) => {
    this.setState({
      idActividad: actividadSeleccionada.actIderegistro,
      actividad: actividadSeleccionada.uniIdeactividad.uniIderegistro,
      horaInicial: actividadSeleccionada.actHorainicio,
      horaFinal: actividadSeleccionada.actHorafinal,
      tipo: actividadSeleccionada.actLimite,
    })
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
	 * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    const { name, value } = evento.target;
    change[name] = value;
    this.setState(change);
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
            opciones={this.state.listaActividades}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Actividades:'
            name='actividad'
            value={this.state.actividad}
            onChange={this.controlarCambio}
          />
          <Input
            label='Hora Inicial:'
            value={this.state.horaInicial}
            onChange={this.controlarCambio}
            name='horaInicial'
            placeholder='00:00:00'
          />
          <Input
            label='Hora Final:'
            value={this.state.horaFinal}
            onChange={this.controlarCambio}
            name='horaFinal'
            placeholder='23:59:00'
          />
          <Combo
            opciones={opcionesTipo}
            propTexto='texto'
            propValor='valor'
            label='Día limite:'
            name='tipo'
            value={this.state.tipo}
            onChange={this.controlarCambio}
          />
        </div>
        <Tabla
          datos={this.state.listaActividadesCreadas}
          columnas={this.obtenerColumnas()}
        />
      </Fragment>
    );
  };
}

GestionHorariosActividades.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionHorariosActividades);

export { VistaRedux as RGestionHorariosActividades };
