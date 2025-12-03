import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, TextoNumerico, Tabla, Util, VentanaModal } from 'appfuture-react';
import { mostrarAlerta } from '../../../store/actions/AplicacionAcciones';
import './AreasPrestacion.scss';
import RUTAS_API from '../../../global/rutas_api';
import axios from 'axios';
import { RConsultaAreaPrestacion } from '../ConsultaAreaPrestacion';
import { RConsultaProyectos } from '../ConsultaProyectos';

class AreasPrestacion extends Component {

  state = {
    idAreaPrestacion: null,
    nuapInfoAreaPrestacion: '',
    nombreInfoAreaPrestacion: '',
    regimenTarifarioInfoAreaPrestacion: '',
    nusdInfoAreaPrestacion: '',
    sitioDisponibilidadFinalInfoAreaPrestacion: '',
    pgirsInfoAreaPrestacion: '',
    descripcionInfoAreaPrestacion: '',
    estrato: '',
    liquidacion: '',
    listaEstratosSeleccionados: [],
    listaProyectosSeleccionados: [],
    listaRegimenTarifas: [],
    listaDocumentos: [],
    listaFiltrada: [],
    listaFiltradaEstrato: [],
    listaLiquidacion: [],
    mostrarModalConsulta: false,
    mostrarModalProyectos: false,
  };

  /**
   * Método encargado de generar los botones del formulario
   * @returns {Object}
   */
  obtenerFunciones = () => {
    let funciones = [];
    funciones.push({ texto: 'Guardar', callback: this.guardarEntidad });
    funciones.push({ texto: 'Consultar', callback: this.consultaModal });
    funciones.push({ texto: 'Limpiar', callback: this.limpiarFormulario })
    return funciones;
  };

  /**
   * Método encargado de limpiar los campos del formulario
   */
  limpiarFormulario = () => {
    this.setState({
      idAreaPrestacion: null,
      nuapInfoAreaPrestacion: '',
      nombreInfoAreaPrestacion: '',
      regimenTarifarioInfoAreaPrestacion: '-1',
      nusdInfoAreaPrestacion: '',
      sitioDisponibilidadFinalInfoAreaPrestacion: '',
      pgirsInfoAreaPrestacion: '',
      descripcionInfoAreaPrestacion: '',
      liquidacion: '',
      listaEstratosSeleccionados: [],
      listaProyectosSeleccionados: [],
      mostrarModalConsulta: false,
      mostrarModalProyectos: false,
    });
  };

  /**
   * Método encargado de abrir la ventana modal del botón de consulta
   */
  consultaModal = () => {
    this.setState({ mostrarModalConsulta: true });
  };

  /**
   * Método encargado de abrir la ventana modal del botón de consulta
   */
  consultaModalProyecto = () => {
    this.setState({ mostrarModalProyectos: true });
  };

  /**
   * Método encargado de controlar cambio en el valor de los campos del formulario
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    const { name, value } = evento.target;
    change[name] = value;
    this.controlarCambioRegimenTarifario(name, value);
    this.setState(change);
  };

  /**
   * Método encargado de validar si se esta cambiando el régimen tarifario
   * @param {string} name Atributo nombre
   * @param {number} value Identificador del régimen tarifario seleccionado
   */
  controlarCambioRegimenTarifario = (name, value) => {
    if (name == 'regimenTarifarioInfoAreaPrestacion') {
      this.consultarDocumentos(value);
    }
  };

  /**
   * Método encargado de consultar los documentos del régimen tarifario seleccionado
   * @param {number} value Identificador del régimen tarifario seleccionado
   * @returns {bool}
   */
  consultarDocumentos = (value) => {
    const { listaRegimenTarifas } = this.state;
    const regimen = value;
    if (regimen === '' || regimen === '-1') {
      this.setState({ listaDocumentos: [] });
      return;
    }
    const regimenSeleccionado = listaRegimenTarifas.find(p => p.rgtaIderegistro == regimen);
    this.setState({
      listaDocumentos: (regimenSeleccionado.info) ? JSON.parse(regimenSeleccionado.info) : []
    })
  };

  /**
   * Método encargado de comprobar si el componente ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
    const peticiones = [
      axios.post(RUTAS_API.PARAMETRIZACION.AREAS_PRESTACION.CONSULTAR_REGIMEN_TARIFARIO, { criterio: '' }),
      axios.post(RUTAS_API.PARAMETRIZACION.AREAS_PRESTACION.CONSULTAR_LIQUIDACION, { criterio: '' })
    ];
    axios.all(peticiones)
      .then(axios.spread((regimen, liquidacion) => {
        const datosAplicacion = {
          listaRegimenTarifas: [],
          listaLiquidacion: [],
        };
        if (regimen.data.codigo > 0) {
          datosAplicacion.listaRegimenTarifas = regimen.data.datos;
        }
        if (liquidacion.data.codigo > 0) {
          datosAplicacion.listaLiquidacion = liquidacion.data.datos;
        }
        this.setState({ ...datosAplicacion });
      }));
  };

  /**
   * Método encargado de devolver un arreglo con los proyectos del área de prestación seleccionada
   * @returns {Array}
   */
  obtenerProyectosConsultados = (proyectos) => {
    return proyectos.map(dato => (
      {
        proyectoIderegistro: dato.infoproyecto[0].proyectoIderegistro,
        proyectoLlacom: dato.proyectoIderegistro,
        apprIderegistro: dato.apprIderegistro,
        apprSwtestado: dato.apprSwtestado,
        apprFecgrabacion: dato.apprFecgrabacion,
        proyectoNom: dato.infoproyecto[0].proyectoNom
      }
    ));
  };

  /**
   * Método encargado de llenar el formulario con los datos del área de prestación seleccionada
   * @param {Object} entidad Datos del área de prestación consultada
   */
  cargarDatos = (entidad) => {
    const proyectos = (entidad.proyectos) ? JSON.parse(entidad.proyectos) : [];
    const estratos = (entidad.estratos) ? JSON.parse(entidad.estratos) : [];
    this.consultarDocumentos(entidad.rgtaIderegistro.rgtaIderegistro);
    this.setState({
      mostrarModalConsulta: false,
      idAreaPrestacion: entidad.arprIderegistro,
      nuapInfoAreaPrestacion: entidad.arprNuap,
      nusdInfoAreaPrestacion: entidad.arprNusd,
      nombreInfoAreaPrestacion: entidad.arprNombre,
      descripcionInfoAreaPrestacion: entidad.arprDescripcion,
      regimenTarifarioInfoAreaPrestacion: entidad.rgtaIderegistro.rgtaIderegistro,
      pgirsInfoAreaPrestacion: entidad.dctaIderegistro.dctaIderegistro,
      sitioDisponibilidadFinalInfoAreaPrestacion: entidad.arprNomdisfinal,
      listaProyectosSeleccionados: this.obtenerProyectosConsultados(proyectos),
      listaEstratosSeleccionados: estratos,
      liquidacion: entidad.liqIderegistro.uniLiquidacion
    });
  };

  /**
   * Método encargado de cerrar la ventana modal del botón de consulta
   */
  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false,
      mostrarModalProyectos: false,
    });
  };

  /**
   * Método encargado de validar los campos del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    const { nuapInfoAreaPrestacion,
      nombreInfoAreaPrestacion,
      regimenTarifarioInfoAreaPrestacion,
      nusdInfoAreaPrestacion,
      sitioDisponibilidadFinalInfoAreaPrestacion,
      pgirsInfoAreaPrestacion,
      descripcionInfoAreaPrestacion,
      listaEstratosSeleccionados,
      listaProyectosSeleccionados,
      idAreaPrestacion,
      liquidacion
    } = this.state;

    const listaEstratosActivos = listaEstratosSeleccionados.filter(p => p.ettaSwtestado == 'A');
    const listaProyectoActivos = listaProyectosSeleccionados.filter(p => p.apprSwtestado == 'A');

    if (nuapInfoAreaPrestacion.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar el NUAP' } };
    }

    if (nombreInfoAreaPrestacion.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar un nombre' } };
    }

    if (regimenTarifarioInfoAreaPrestacion <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el régimen tarifario' } };
    }

    if (nusdInfoAreaPrestacion.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar el NUSD' } };
    }

    if (sitioDisponibilidadFinalInfoAreaPrestacion.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar el sitio de disponibilidad final' } };
    }

    if (pgirsInfoAreaPrestacion <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el documento PGIRLS' } };
    }

    if (descripcionInfoAreaPrestacion.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar una descripción' } };
    }

    if (liquidacion <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una liquidación' } };
    }

    if (!Util.validarArreglo(listaEstratosSeleccionados)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos un estrato' } };
    }

    if (!Util.validarArreglo(listaProyectosSeleccionados)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos un proyecto' } };
    }

    if (idAreaPrestacion != null) {
      if (!Util.validarArreglo(listaProyectoActivos)) {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos un proyecto' } };
      }
    }

    if (idAreaPrestacion != null) {
      if (!Util.validarArreglo(listaEstratosActivos)) {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos un estrato' } };
      }
    }
    return { respuesta: true }
  };

  /**
   * Método encargado de armar un objeto con los proyectos del área de prestación
   * @return {Object}
   */
  obtenerProyectos = () => {
    const lista = this.state.listaProyectosSeleccionados.map((dato) => {
      return {
        "apprIderegistro": (dato.apprIderegistro) ? dato.apprIderegistro : '',
        "proyectoIderegistro": {
          "proyectoIderegistro": dato.proyectoIderegistro
        },
        "apprSwtestado": (dato.apprSwtestado) ? dato.apprSwtestado : '',
        "apprFecgrabacion": (dato.apprFecgrabacion) ? dato.apprFecgrabacion : '',
      }
    });
    return lista;
  };

  /**
   * Método encargado de armar un objeto con los estratos del área de prestación
   * @return {Object}
   */
  obtenerEstratos = () => {
    const lista = this.state.listaEstratosSeleccionados.map((dato) => {
      return {
        "ettaIderegistro": dato.ettaIderegistro,
        "ettaNombre": dato.ettaNombre,
        "ettaSwtestado": dato.ettaSwtestado,
      }
    });
    return lista;
  };

  /**
  * Método encargado de eliminar el proyecto seleccionado
  * @param {number} posicion Posición del proyecto que se desea eliminar
  */
  eliminarProyecto = (posicion) => {
    const lista = [...this.state.listaProyectosSeleccionados];
    lista.splice(posicion, 1);
    this.setState({ listaProyectosSeleccionados: lista });
  };

  /**
  * Método encargado de eliminar el proyecto seleccionado
  * @param {number} posicion Posición del proyecto que se desea eliminar
  * @param {Object} listaFiltrada Lista con los proyectos inactivos
  */
  eliminarEditarProyecto = (posicion, listaFiltrada) => {
    const lista = [...this.state.listaProyectosSeleccionados];
    const listaF = listaFiltrada;
    listaF[posicion].apprSwtestado = 'I';
    if (!lista[posicion].apprIderegistro) {
      lista.splice(posicion, 1);
      this.setState({ listaProyectosSeleccionados: lista, listaFiltrada: listaF });
      return;
    }
    lista[posicion].apprSwtestado = 'I';
    this.setState({ listaProyectosSeleccionados: lista, listaFiltrada: listaF });
  };

  /**
  * Método encargado de eliminar estrato seleccionado
  * @param {number} posicion Posición del estrato que se desea eliminar
  * @param {Object} listaFiltrada Lista con los estratos inactivos
  */
  eliminarEstratoEditar = (posicion, listaFiltrada) => {
    const lista = [...this.state.listaEstratosSeleccionados];
    const listaF = listaFiltrada;
    listaF[posicion].ettaSwtestado = 'I';
    if (!lista[posicion].ettaIderegistro) {
      lista.splice(posicion, 1);
      this.setState({ listaEstratosSeleccionados: lista, listaFiltradaEstrato: listaF });
      return;
    }
    lista[posicion].ettaSwtestado = 'I';
    this.setState({ listaEstratosSeleccionados: lista, listaFiltradaEstrato: listaF });
  };

  /**
  * Método encargado de eliminar el estrato seleccionado
  * @param {number} posicion Posición del estrato que se desea eliminar
  */
  eliminarEstrato = (posicion) => {
    const lista = [...this.state.listaEstratosSeleccionados];
    lista.splice(posicion, 1);
    this.setState({ listaEstratosSeleccionados: lista });
  };

  /**
   * Método encargado de obtener el objeto con los datos necesarios para guardar
   * @returns {Object}
   */
  obtenerObjeto = () => {
    const { idAreaPrestacion,
      nuapInfoAreaPrestacion,
      nusdInfoAreaPrestacion,
      nombreInfoAreaPrestacion,
      descripcionInfoAreaPrestacion,
      regimenTarifarioInfoAreaPrestacion,
      sitioDisponibilidadFinalInfoAreaPrestacion,
      pgirsInfoAreaPrestacion,
      liquidacion } = this.state;

    const objetoDevolver = {
      arprIderegistro: idAreaPrestacion,
      dctaIderegistro: {
        dctaIderegistro: pgirsInfoAreaPrestacion
      },
      arprNombre: nombreInfoAreaPrestacion,
      arprDescripcion: descripcionInfoAreaPrestacion,
      arprNuap: nuapInfoAreaPrestacion,
      arprNusd: nusdInfoAreaPrestacion,
      arprNomdisfinal: sitioDisponibilidadFinalInfoAreaPrestacion,
      rgtaIderegistro: {
        rgtaIderegistro: regimenTarifarioInfoAreaPrestacion
      },
      liqIderegistro: {
        uniLiquidacion: liquidacion
      },
      listaEstratos: this.obtenerEstratos(),
      listaProyectos: this.obtenerProyectos()
    }
    return objetoDevolver;
  };

  /**
   * Método encargado de mostrar una tabla con los estratos seleccionados
   * @returns {Array}
   */
  renderTablaEstratos = () => {
    const { listaEstratosSeleccionados, idAreaPrestacion } = this.state;
    let { listaFiltradaEstrato } = this.state;
    listaFiltradaEstrato = listaEstratosSeleccionados.filter(p => p.ettaSwtestado == 'A')
    if (idAreaPrestacion != null) {
      return (
        <table className='table table-striped mt-28'>
          <thead>
            <tr>
              <th>Estrato</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {listaFiltradaEstrato.map((dato, index) => {
              return (
                <tr key={'estrato_' + dato.ettaNombre}>
                  <td>{dato.ettaNombre}</td>
                  <td>
                    <button className='btnEliminar' onClick={() => {
                      this.eliminarEstratoEditar(index, listaFiltradaEstrato)
                    }}>X
                  </button>
                  </td>
                </tr>
              )

            })
            }
          </tbody>
        </table>
      );
    }
    return (
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Estrato</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {listaEstratosSeleccionados.map((dato, index) => {
            return (
              <tr key={'estrato_' + dato.ettaNombre}>
                <td>{dato.ettaNombre}</td>
                <td>
                  <button className='btnEliminar' onClick={() => {
                    this.eliminarEstrato(index)
                  }}>X
                </button>
                </td>
              </tr>
            )

          })
          }
        </tbody>
      </table>
    );
  };

  /**
   * Método encargado de mostrar una tabla con los proyectos seleccionados
   * @returns {Array}
   */
  renderTablaProyectos = () => {
    const { listaProyectosSeleccionados, idAreaPrestacion } = this.state;
    let { listaFiltrada } = this.state;
    listaFiltrada = listaProyectosSeleccionados.filter(p => p.apprSwtestado == 'A');
    if (idAreaPrestacion != null) {
      return (
        <table className='table table-striped'>
          <thead>
            <tr>
              <th>Proyecto</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {listaFiltrada.map((dato, index) => {
              return (
                <tr key={'proyecto_' + dato.proyectoNom}>
                  <td>{dato.proyectoNom}</td>
                  <td>
                    <button className='btnEliminar' onClick={() => {
                      this.eliminarEditarProyecto(index, listaFiltrada)
                    }}>X
                  </button>
                  </td>
                </tr>
              )

            })
            }
          </tbody>
        </table>
      );
    }
    return (
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Proyecto</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {listaProyectosSeleccionados.map((dato, index) => {
            return (
              <tr key={'proyecto_' + dato.proyectoNom}>
                <td>{dato.proyectoNom}</td>
                <td>
                  <button className='btnEliminar' onClick={() => {
                    this.eliminarProyecto(index)
                  }}>X
                </button>
                </td>
              </tr>
            )

          })
          }
        </tbody>
      </table>
    );
  };

  /**
   * Método encargado de guardar el área de prestación
   * @returns {bool}
   */
  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    const entidadGuardar = this.obtenerObjeto();

    axios.post(RUTAS_API.PARAMETRIZACION.AREAS_PRESTACION.GUARDAR, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de validar que no se ingresen estratos repetidos
   * @returns {number}
   */
  validarNombreRepetido = (estrato) => {
    const lista = [...this.state.listaEstratosSeleccionados];
    const index = lista.findIndex(p => p.ettaNombre.trim() == estrato.trim());
    return index >= 0;
  };

  /**
   * Método encargado de agregar el estrato ingresado
   * @returns {bool}
   */
  agregarEstrato = () => {
    const { estrato, listaEstratosSeleccionados } = this.state;
    if (this.validarNombreRepetido(estrato)) {
      this.props.mostrarAlerta('Error', 'Ya hay un estrato con ese nombre agregado en la tabla');
      return;
    }
    if (estrato.trim() === '') {
      this.props.mostrarAlerta('Datos Incompletos', 'Debe ingresar el nombre del estrato');
      return false;
    }
    listaEstratosSeleccionados.push({
      ettaIderegistro: null,
      ettaNombre: estrato,
      ettaSwtestado: 'A',
    });
    this.setState({ listaEstratosSeleccionados: listaEstratosSeleccionados, estrato: '' });
  };

  /**
   * Método encargado de agregar el estado a los proyectos seleccionados
   * @returns {Array}
   */
  obtenerProyectosActivos = (proyectos) => {
    let lista = [];
    for (let index = 0; index < proyectos.length; index++) {
      const proyecto = proyectos[index];
      lista.push(proyecto);
      lista[index].apprSwtestado = 'A';
    }
    return lista;
  };

  /**
   * Método encargado agregar los proyectos seleccionados
   * @param {Object} proyectos Proyectos seleccionados por el usuario
   */
  onSeleccionarProyectos = (proyectos) => {
    this.setState({
      mostrarModalProyectos: false,
      listaProyectosSeleccionados: this.obtenerProyectosActivos(proyectos)
    });
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Array}
   */
  render() {
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />
        <div className='conf-general row mt-5'>
          <Input
            label='NUAP:'
            value={this.state.nuapInfoAreaPrestacion}
            onChange={this.controlarCambio}
            name='nuapInfoAreaPrestacion'
          />
          <Input
            label='Nombre'
            value={this.state.nombreInfoAreaPrestacion}
            onChange={this.controlarCambio}
            name='nombreInfoAreaPrestacion'
          />
          <Combo
            opciones={this.state.listaRegimenTarifas}
            propTexto='rgtaNombre'
            propValor='rgtaIderegistro'
            label='Régimen Tarifario'
            name='regimenTarifarioInfoAreaPrestacion'
            value={this.state.regimenTarifarioInfoAreaPrestacion}
            onChange={this.controlarCambio}
          />
          <Input
            label='NUSD:'
            value={this.state.nusdInfoAreaPrestacion}
            onChange={this.controlarCambio}
            name='nusdInfoAreaPrestacion'
          />
          <Input
            label='Sitio de disponibilidad final'
            value={this.state.sitioDisponibilidadFinalInfoAreaPrestacion}
            onChange={this.controlarCambio}
            name='sitioDisponibilidadFinalInfoAreaPrestacion'
          />
          <Combo
            opciones={this.state.listaDocumentos}
            propTexto='dctaNombre'
            propValor='dctaIderegistro'
            label='Documento PGIRS'
            name='pgirsInfoAreaPrestacion'
            value={this.state.pgirsInfoAreaPrestacion}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={this.state.listaLiquidacion}
            propTexto='liqNombre'
            propValor='uniLiquidacion'
            label='Liquidación de Tarifas:'
            name='liquidacion'
            value={this.state.liquidacion}
            onChange={this.controlarCambio}
          />
        </div>
        <label htmlFor='descripcionInfoAreaPrestacion'>
          Descripción:
                </label>
        <textarea
          name='descripcionInfoAreaPrestacion'
          id='descripcionInfoAreaPrestacion'
          value={this.state.descripcionInfoAreaPrestacion}
          onChange={this.controlarCambio}
          className='form-control'
          rows='3'
          placeholder='Descripción'
        >
        </textarea>
        <div className='row mt-2'>
          <Input
            label='Nombre estrato'
            value={this.state.estrato}
            onChange={this.controlarCambio}
            name='estrato'
            cols={3}
          />
          <div className='form-group col-3 mt-23'>
            <button className='btn btn-primary' onClick={this.agregarEstrato}>Agregar</button>
          </div>

        </div>
        <div className='row mt-2'>
          <div className='col-6'>
            <p><b>Estratos</b></p>
            <div className='pt-3 mt-39'>
              {this.state.listaEstratosSeleccionados.length > 0 &&
                this.renderTablaEstratos()
              }
            </div>
          </div>
          <div className='col-6'>
            <p><b>Proyectos</b></p>
            <button className='btn btn-primary' onClick={this.consultaModalProyecto}>Seleccionar</button>
            <div className='pt-3'>
              {this.state.listaProyectosSeleccionados.length > 0 &&
                this.renderTablaProyectos()
              }
            </div>
          </div>
        </div>

        <VentanaModal
          mostrar={this.state.mostrarModalConsulta}
          titulo='Consulta Área de Prestación'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaAreaPrestacion esModal seleccionarEntidad={this.cargarDatos} />
        </VentanaModal>

        <VentanaModal
          mostrar={this.state.mostrarModalProyectos}
          titulo='Seleccionar Proyectos'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaProyectos
            esModal
            seleccionMultiple
            entidadesSeleccionadas={this.state.listaProyectosSeleccionados}
            seleccionarEntidades={this.onSeleccionarProyectos}
            mostrarAlerta={this.props.mostrarAlerta}
          />
        </VentanaModal>

      </Fragment>
    );
  };
}

AreasPrestacion.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array,
  mostrarAlerta: PropTypes.func
};

AreasPrestacion.defaultProps = {
  esModal: false,
  seleccionMultiple: false,
  entidadesSeleccionadas: []
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    mostrarAlerta
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(AreasPrestacion);

export { VistaRedux as RAreasPrestacion };
