import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { RConsultaRegimenTarifas } from '../RegimenTarifas/ConsultaRegimenTarifas';
import { Input, Botonera, VentanaModal, Combo, TextoNumerico, Fecha, Tabla, Util } from 'appfuture-react';
import { mostrarAlerta } from '../../store/actions/AplicacionAcciones';
import RUTAS_API from '../../global/rutas_api';
import GestionDocumentos from '../Utils/GestionDocumentos/GestionDocumentos';
import '../RegimenTarifas/RegimenTarifas.scss';

class RegimenTarifas extends Component {

  gestionDocumentos = null;

  state = {
    mostrarModalConsulta: false,
    criterio: '',
    nombreRegistroTarifa: '',
    descripcionRegistroTarifa: '',
    fechaInicialRegistroTarifa: '',
    fechaFinalRegistroTarifa: '',
    idRegimen: null,
    adjuntos: [],
  };

  /**
   * Método encargado de mostrar los botones del formulario
   * @returns {Array}
   */
  obtenerFunciones = () => {
    let funciones = [];
    funciones.push({ texto: 'Guardar', callback: this.guardarTarifa });
    funciones.push({ texto: 'Consultar', callback: this.consultarTarifa });
    funciones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    return funciones;
  };

  /**
   * Método encargado de armar un objeto con los datos de los archivos consultados
   * @returns {Array}
   */
  obtenerObjeto = (datos) => {
    let lista = [];
    if (datos.length === 0) {
      return lista;
    }
    for (let i = 0; i < datos.length; i++) {
      const element = datos[i];
      let obj = {
        archivo: { name: element.dctaNombre },
        descripcion: element.dctaDescripcion,
        entidadEmite: element.terIderegistro,
        fechaEmision: element.dctaFecemision,
        fechaFin: element.dctaFecfinvigencia,
        fechaInicio: element.dctaFecinivigencia,
        fechaPublicacion: element.dctaFecpublicacion,
        id: element.dctaIderegistro,
        nombre: element.dctaNombre,
        numero: element.dctaNumero,
        tipoDocumento: element.uniIdetipodocumento,
        estado: element.dctaEstado
      };
      if (element.dctaUrldocumento) {
        const infoUrl = JSON.parse(element.dctaUrldocumento);
        obj.idArchivo = infoUrl.id;
      }
      lista.push(obj);
    }
    return lista;
  };

  /**
   * Método encargado de limpiar los datos del formulario de régimen tarifas
   */
  limpiarFormulario = () => {
    this.setState({
      criterio: '',
      nombreRegistroTarifa: '',
      descripcionRegistroTarifa: '',
      fechaInicialRegistroTarifa: ' ',
      fechaFinalRegistroTarifa: ' ',
      adjuntos: [],
      listaRegimenTarifas: [],
      idRegimen: null,
    });
    this.gestionDocumentos.limpiarFormulario();
  };

  /**
   * Método encargado de abrir la ventana modal del botón de consulta
   */
  consultarTarifa = () => {
    this.setState({ mostrarModalConsulta: true });
  };

  /**
   * Método encargado de devolver un objeto con los datos del adjunto
   * @param {Object} adjunto Datos de los adjuntos
   * @returns {string}
   */
  obtenerObjetoAdjuntos = (adjunto) => {
    return JSON.stringify({
      id: adjunto.idArchivo,
      nombre: adjunto.archivo.name,
      nombreOriginal: adjunto.nombre,
      tipo: adjunto.tipo,
    });
  };

  /**
   * Método encargado de devolver un objeto con los datos del documento.
   * @returns {Object}
   */
  obtenerDocumentos = () => {
    return this.state.adjuntos.map((documento) => {
      return {
        "dctaIderegistro": (documento.id),
        "terIderegistro": {
          "terIderegistro": documento.entidadEmite
        },
        "dctaNombre": documento.nombre,
        "dctaDescripcion": documento.descripcion,
        "dctaFecinivigencia": documento.fechaInicio,
        "dctaFecfinvigencia": documento.fechaFin,

        "uniIdetipodocumento": {
          "uniIderegistro": documento.tipoDocumento
        },
        "dctaNumero": documento.numero,
        "dctaFecemision": documento.fechaEmision,
        "dctaFecpublicacion": documento.fechaPublicacion,
        "dctaUrldocumento": this.obtenerObjetoAdjuntos(documento),
        "dctaEstado": documento.estado,
      }
    });
  };

  /**
   * Método encargado de guardar la tarifa diligenciada
   * @returns {bool}
   */
  guardarTarifa = () => {
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    const { idRegimen, nombreRegistroTarifa, descripcionRegistroTarifa, fechaInicialRegistroTarifa, fechaFinalRegistroTarifa } = this.state;
    let params = {
      'rgtaIderegistro': idRegimen,
      'rgtaNombre': nombreRegistroTarifa,
      'rgtaDescripcion': descripcionRegistroTarifa,
      'rgtaFecinivigencia': fechaInicialRegistroTarifa,
      'rgtaFecfinvigencia': fechaFinalRegistroTarifa,
      'listaValores': this.obtenerDocumentos(),
    };

    if (this.state.idRegimen != null) {
      params.rgtaIderegistro = this.state.idRegimen;
    }

    const contexto = this;

    axios.post(RUTAS_API.PARAMETRIZACION.REGIMEN_TARIFAS.GUARDAR_REGIMEN_TARIFAS, params)
      .then(respuesta => {
        if (respuesta.data.codigo < 0) {
          return;
        }
        contexto.limpiarFormulario();
      })
      .catch(error => {
        console.log(error);
      });
  };

  /**
   * Método encargado de validar los campos del formulario de régimen tarifas
   * @returns {Object}
   */
  validarFormulario = () => {
    const { nombreRegistroTarifa, fechaInicialRegistroTarifa, fechaFinalRegistroTarifa, adjuntos } = this.state;
    if (nombreRegistroTarifa.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El campo nombre es obligatorio.' } };
    }

    if (fechaInicialRegistroTarifa.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El campo fecha incial es obligatorio.' } };
    }

    if (fechaFinalRegistroTarifa.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El campo fecha final es obligatorio.' } };
    }

    if (adjuntos.length == 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe cargar como mínimo un archivo.' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de controlar el cambio en el valor de los campos del formulario
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  /**
   * Método encargado de comprar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
  };

  /**
   * Obtiene la fecha en string de las propiedades que recibe de la tabla.
   * @return {string}
   */
  convertirFecha = (fecha) => {
    const dateConverter = new Date(fecha);
    const anio = dateConverter.getFullYear();
    const dia = dateConverter.getDate();
    const mes = dateConverter.getMonth();
    return `${anio}-${(mes < 9) ? '0' : ''}${mes + 1}-${((dia < 9) ? '0' : '')}${dia}`;
  };

  /**
   * Método encargado de llenar el formulario con los datos de la tarifa seleccionada
   * @param {Object} entidad Datos de la tarifa seleccionada
   */
  cargarDatos = (entidad) => {
    const informacion_adicional = (entidad.info) ? JSON.parse(entidad.info) : [];
    this.setState(
      {
        idRegimen: entidad.rgtaIderegistro,
        mostrarModalConsulta: false,
        nombreRegistroTarifa: entidad.rgtaNombre,
        descripcionRegistroTarifa: entidad.rgtaDescripcion,
        fechaInicialRegistroTarifa: this.convertirFecha(entidad.rgtaFecinivigencia),
        fechaFinalRegistroTarifa: this.convertirFecha(entidad.rgtaFecfinvigencia),
        adjuntos: this.obtenerObjeto(informacion_adicional)
      }
    )
  };

  /**
   * Método encargado de cerrar la ventana modal del botón de consulta
   */
  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false
    });
  };

  /**
   * Método encargado de actualizar el state cuando se da un cambio en los adjuntos
   * @param {Object} cambio Datos de los nuevos adjuntos
   */
  actualizarAdjuntos = (cambio) => {
    this.setState(cambio);
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <div className='consulta-tramos'>
        <div className='d-flex justify-content-center pt-3'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>
        <h2 className='mt-4 ml-3'>
          <i className='fa fa-file-text-o mr-2'></i>
          Información Régimen Tarifario
        </h2>
        <div className='row'>
          <div className='col-6'>
            <Input
              cols={12}
              label='Nombre:'
              value={this.state.nombreRegistroTarifa}
              onChange={this.controlarCambio}
              name='nombreRegistroTarifa'
            />
            <div className='col-12'>
              <div className='form-group'>
                <label htmlFor='descripcionRegistroTarifa'>
                  Descripción:
                </label>

                <textarea
                  name='descripcionRegistroTarifa'
                  id='descripcionRegistroTarifa'
                  value={this.state.descripcionRegistroTarifa}
                  className='form-control'
                  rows='3'
                  placeholder='Descripción'
                  onChange={this.controlarCambio}
                >
                </textarea>
              </div>
            </div>
          </div>
          <div className="grupo-campos col-6">
            <legend className='title'>
              Vigencia:
            </legend>
            <Fecha
              label='Fecha Inicial:'
              name='fechaInicialRegistroTarifa'
              fecha={this.state.fechaInicialRegistroTarifa}
              onChange={this.controlarCambio}
              cols={12}
              className='mt-3 mb-3'
            />
            <Fecha
              label='Fecha Final:'
              name='fechaFinalRegistroTarifa'
              fecha={this.state.fechaFinalRegistroTarifa}
              onChange={this.controlarCambio}
              cols={12}
              className='mt-3 mb-3'
            />
          </div>
        </div>
        <VentanaModal
          mostrar={this.state.mostrarModalConsulta}
          titulo='Filtrar Regimen Tarifario'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaRegimenTarifas esModal seleccionarEntidad={this.cargarDatos} />
        </VentanaModal>

        <div className='col-12 mt-5'>
          <h2>
            <i className='fa fa-fw fa-paperclip'></i>
            Agregar Documentos
          </h2>

          <hr />

          <GestionDocumentos
            ref={ref => this.gestionDocumentos = ref}
            adjuntos={this.state.adjuntos}
            accept='application/pdf'
            mostrarAlerta={this.props.mostrarAlerta}
            actualizarAdjuntos={this.actualizarAdjuntos}
          />
        </div>
      </div>
    );
  };
}

RegimenTarifas.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array,
  mostrarAlerta: PropTypes.func
};

RegimenTarifas.defaultProps = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(RegimenTarifas);

export { VistaRedux as RegimenTarifas };
