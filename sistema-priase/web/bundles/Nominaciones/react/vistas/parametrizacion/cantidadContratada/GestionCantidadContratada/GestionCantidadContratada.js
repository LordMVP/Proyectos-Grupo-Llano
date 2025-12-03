import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { formatearArray, limpiarJson, TIPOS_UNIDADES_MEDIDA } from '../../../../global/util_nominaciones';
import { get as getProp } from 'object-path';
import './GestionCantidadContratada.scss';
import { RConsultaContratos } from '../../..';
import { toast } from 'react-toastify';
import { RConsultaCantidadContratada } from '../ConsultaCantidadContratada';

class GestionCantidadContratada extends Component {

  state = {
    // Datos de la entidad
    fecha: '',
    fechaInicio: '',
    fechaFin: '',
    contrato: null,
    modalConsulta: false,
    consultasTerminadas: false,
    // Listas de la aplicacion
    listaMedidores: [],

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
      axios.post(RUTAS_API.GLOBAL.CONSULTAR_FECHA_ACTUAL),
    ];
    axios.all(peticiones)

      .then(axios.spread((fechaActual) => {
        const datosAplicacion = {
          fecha: '',
        };

        if (fechaActual.data.codigo >= 0) {
          let fecha = new Date(fechaActual.data.datos);
          fecha = (fecha.getFullYear() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getDate());
          datosAplicacion.fecha = fecha;
        }

        this.setState({ ...datosAplicacion, consultasTerminadas: true });
      }));
  };

  /**
   * @method
   * Método encargado de limpiar los campos del formulario
   */
  limpiarFormulario = () => {
    this.setState({
      // Datos de la entidad
      fechaInicio: '',
      fechaFin: '',
      contrato: null,
      modalConsulta: false,
      modalContratos: false,
      listaMedidores: [],
    });
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
      { texto: 'Consultar', callback: this.abrirConsultaModal },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * @method
   * Método encargado de cambiar entre interfaces
   */
  abrirConsultaModal = () => {
    this.setState({ modalConsulta: true });
  }

  /**
   * @method
   * Método encargado de validar la tabla de medidores
   * @returns {Object}
   */
  validarTablaMedidores = () => {
    const { listaMedidores } = this.state;
    for (let index = 0; index < listaMedidores.length; index++) {
      const medidor = listaMedidores[index];
      if (medidor.mesuCapacidadmaxima == '') {
        return { respuesta: false, mensaje: 'Debe ingresar una capacidad máxima' };
      }
      if (parseInt(medidor.mesuCapacidadmaxima) == 0) {
        return { respuesta: false, mensaje: 'La cantidad contratada debe ser mayor a 0' };
      }
    }
    return { respuesta: true };
  };

  /**
   * @method
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    const { contrato } = this.state;
    if (contrato === null) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un contrato' } };
    }
    return { respuesta: true };
  };

  /**
   * Método encargado de guardar los datos de la entidad
   * @returns {bool}
   */
  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    const validacionTabla = this.validarTablaMedidores();
    if (!validacion.respuesta) {
      toast.error(validacion.mensaje.mensaje);
      return false;
    }
    if (!validacionTabla.respuesta) {
      toast.error(validacion.mensaje);
      return false;
    }
    let { contrato, listaMedidores } = this.state;
    contrato = { cntIderegistro: contrato.cntIderegistro, listaMedidores: listaMedidores };
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_CANTIDAD_CONTRATADA.GUARDAR, limpiarJson(contrato))
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
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
   * @method
   * Método encargado de controlar el cambio de la cantidad contratada por medidor
   */
  controlarCambioTabla = (e) => {
    const lista = [...this.state.listaMedidores];
    const { name, value } = e.target;
    const index = e.target.attributes['data-index'].value;
    lista[index][name] = value
    this.setState({ listaMedidores: lista });
  };

  /**
   * @method
   * Método encargado de mostrar la tabla de medidores
   * @returns {JSX}
   */
  renderTablaMedidores = () => {
    if (!Util.validarArreglo(this.state.listaMedidores)) {
      return;
    }
    return (
      <table className="table table-striped mt-5">
        <thead className='bg-dark text-white'>
          <tr>
            <th>Número de Contrato</th>
            <th>Medidor</th>
            <th>Fecha</th>
            <th>Cantidad Contratada</th>
            <th>Unidad de Medida</th>
          </tr>
        </thead>
        <tbody>
          {this.state.listaMedidores.map((m, index) => (
            <tr key={m.mesuIderegistro}>
              <td>{m.cntNumero}</td>
              <td>{m.mesuNombre}</td>
              <td>{this.state.fecha}</td>
              <td>
                <TextoNumerico
                  aceptaDecimales={true}
                  aceptaNegativos={false}
                  cols={12}
                  value={m.mesuCapacidadmaxima}
                  onChange={this.controlarCambioTabla}
                  extra={{ 'data-index': index }}
                  name='mesuCapacidadmaxima'
                />
              </td>
              <td>{m.uniIdemedida.uniNombre1}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  };

  /**
   * @method
   * Método encargado de cargar los datos de la entidad en la variable contrato
   * @param {Object} contrato Contrato seleccionado
   */
  onSeleccionarContrato = async (contrato) => {
    const { data: { datos } } = await axios.post(RUTAS_API.CONTRATOS.CONSULTAR_DETALLE_CONTRATO, { idContrato: contrato.cntIderegistro });
    const clase = datos.uniIdeclasecontrato;
    if (clase.uniNombre1 === 'Contrato C2' || clase.uniNombre1 === 'Contrato C1') {
      const medidores = datos.listaMedidores.map(m => {
        m.cntNumero = datos.cntNumero;
        m.uniIdemedida = {
          uniIderegistro: m.uniIdemedida.uniIderegistro,
          uniNombre1:m.uniIdemedida.uniNombre1
        }
        m.uniIdemedidaprecio = {
          uniIderegistro: m.uniIdemedidaprecio.uniIderegistro,
          uniNombre1:m.uniIdemedidaprecio.uniNombre1
        }
        return m;
      });
      this.setState({
        modalContratos: false,
        contrato: datos,
        listaMedidores: medidores
      });
      return;
    }
    toast.error('La Clase de contrato debe ser C1 o C2');
    return;
  };

  /**
   * @method
   * Método encargado de abrir el modal de consultar contratos
   * @returns {Boolean}
   */
  abrirConsultaContratos = () => {
    this.setState({ modalContratos: true });
  };

  /**
   * @method
   * Método encargado de limpiar el contrato
   */
  limpiarContrato = () => {
    this.setState({ contrato: null });
  }

  /**
   * @method
   * Método encargado de mostrar el componente selector de contratos
   * @returns {Object}
   */
  renderSelectorContrato = () => {
    const contrato = getProp(this.state, 'contrato', null);
    const propsInput = {
      placeholder: 'Seleccione un contrato',
      className: 'form-control',
      onChange: this.controlarCambio,
      name: 'contrato',
      title: getProp(contrato, 'cntNumero', ''),
      value: getProp(contrato, 'cntNumero', ''),
      type: 'text',
      disabled: true
    };
    return (
      <div className='col-6 form-group'>
        <label>Contrato:</label>
        <div className="input-group mb-3">
          <input {...propsInput} />
          <div className="input-group-prepend">
            <button className="btn-primary input-group-text" title='Limpiar Contrato' onClick={this.limpiarContrato}><i className='fa fa-fw fa-trash'></i></button>
            <button className="btn-primary btn-buscador input-group-text" title='Seleccionar contrato' onClick={this.abrirConsultaContratos}><i className='fa fa-fw fa-check-square-o'></i></button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    if (!this.state.consultasTerminadas) {
      return (<p className='text-center'>Cargando...</p>);
    }

    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />
        <div className='conf-general row mt-5'>
          <Input
            label='Fecha Actual:'
            value={this.state.fecha}
            extra={{ disabled: true, readOnly: true }}
            cols={6}
            name='fecha'
          />
          {this.renderSelectorContrato()}
        </div>

        <div className='row mt28'>
          <Input
            label='Agente:'
            value={getProp(this.state.contrato, 'terIdeagente.terNomcompleto', '')}
            onChange={this.controlarCambio}
            extra={{ disabled: true, readOnly: true }}
            name='agente'
          />
          <Input
            label='Fecha inicio:'
            value={getProp(this.state.contrato, 'cntFechainicio', '')}
            onChange={this.controlarCambio}
            extra={{ disabled: true, readOnly: true }}
            name='fechaInicio'
          />
          <Input
            label='Fecha fin:'
            value={getProp(this.state.contrato, 'cntFechafin', '')}
            onChange={this.controlarCambio}
            extra={{ disabled: true, readOnly: true }}
            name='fechaFin'
          />
          <Input
            label='Tipo de uso:'
            value={getProp(this.state.contrato, 'uniIdetipouso.uniNombre1', '')}
            onChange={this.controlarCambio}
            extra={{ disabled: true, readOnly: true }}
            name='tipoUso'
          />
        </div>
        {this.renderTablaMedidores()}
        <VentanaModal
          mostrar={this.state.modalContratos}
          titulo='Seleccionar Contrato'
          cerrarModal={() => this.setState({ modalContratos: false })}>
          <RConsultaContratos
            esModal
            seleccionarEntidad={this.onSeleccionarContrato}
            inhabilitarTercero={true}
            tiposContrato={['S']}
            estadosContrato={['A']}
            inhabilitarEstado={true}
            tiposContratoDisabled={true}
            tipoNegocio={'C'}
          />
        </VentanaModal>
        <VentanaModal
          mostrar={this.state.modalConsulta}
          titulo='Cambios a la Cantidad Contratada'
          cerrarModal={() => this.setState({ modalConsulta: false })}>
          <RConsultaCantidadContratada
            esModal
            inhabilitarTercero={true}
            tiposContrato={['S']}
            estadosContrato={['A']}
            inhabilitarEstado={true}
            tiposContratoDisabled={true}
            tipoNegocio={'C'}
          />
        </VentanaModal>
      </Fragment>
    );
  };
}

GestionCantidadContratada.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionCantidadContratada);

export { VistaRedux as RGestionCantidadContratada };
