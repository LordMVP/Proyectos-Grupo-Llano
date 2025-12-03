import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, Fecha } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../global/rutas_api';
import { CLASES_UNIDADES } from '../../../global/constantes';
import { mostrarAlerta } from '../../../store/actions/AplicacionAcciones';
import { toast } from 'react-toastify'
import './ReportePoderCalorifico.scss';

class ReportePoderCalorifico extends Component {

  state = {
    // Datos de la entidad
    listaMercado: [],
    listaModalidad: [],
    listaTercero: [],
    listaModalidadRueda: [],
    fechaContrato: '',
    modalidad: '',
    modalidadRueda: '',
    tercero: '',
    mercado: '',
  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
    const params = { criterio: '' };
    const peticiones = [
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { ...params, idClase: CLASES_UNIDADES.TIPO_MERCADO }),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { ...params, idClase: CLASES_UNIDADES.TIPOS_MODALIDAD_CONTRATO }),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { ...params, idClase: CLASES_UNIDADES.MODALIDAD_CONTRATO_RUEDA }),
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_AGENTES_TERCEROS.CONSULTAR_TERCEROS, { ...params }),
    ]
    axios.all(peticiones)
      .then(axios.spread((tiposMercado, tiposModalidad, tiposModalidadRueda, terceros) => {
        const datosAplicacion = {
          listaMercado: [],
          listaModalidad: [],
          listaModalidadRueda: [],
          listaTercero: [],
        };
        if (tiposMercado.data.codigo > 0) {
          datosAplicacion.listaMercado = tiposMercado.data.datos;
        }
        if (tiposModalidad.data.codigo > 0) {
          datosAplicacion.listaModalidad = tiposModalidad.data.datos;
        }
        if (tiposModalidadRueda.data.codigo > 0) {
          datosAplicacion.listaModalidadRueda = tiposModalidadRueda.data.datos;
        }
        if (terceros.data.codigo > 0) {
          datosAplicacion.listaTercero = terceros.data.datos;
        }
        this.setState({ ...datosAplicacion });
      })
      );
  };

  /**
   * Método encargado limpiar el formulario al momento de salir de la interfaz.
   */
  componentWillUnmount() {
    this.limpiarFormulario();
  };

  /**
   *  Método encargado de limpiar los campos del formulario
   */
  limpiarFormulario = () => {
    this.setState({
      // Datos de la entidad
      fechaContrato: '',
      modalidad: '',
      modalidadRueda: '',
      tercero: '',
      mercado: '',
    });
  };

  /**
   * Método encargado de generar los botones del formulario
   * @returns {Object}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Generar Reporte', callback: this.guardarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    const { fechaContrato, modalidad, modalidadRueda, tercero, mercado } = this.state;
    // Validaciones
    if (!fechaContrato || fechaContrato == '') {
      toast.error('Debe seleccionar la fecha del contrato.');
      return false;
    }

    if (!modalidadRueda || modalidadRueda == '') {
      toast.error('Debe seleccionar la modalidad rueda.');
      return false;
    }

    if (!mercado || mercado == '') {
      toast.error('Debe seleccionar el tipo de mercado.');
      return false;
    }

    if (!tercero || tercero == '') {
      toast.error('Debe seleccionar el operador o contraparte.');
      return false;
    }

    if (!modalidad || modalidad == '') {
      toast.error('Debe seleccionar la modalidad contractual.');
      return false;
    }
    return true;
  };

  /**
   * Método encargado de generar el reporte con los datos.
   * @param {Object} respuesta Datos del reporte.
   */
  generarReporte = (respuesta) => {
    let a = document.createElement('a');
    a.href = 'data:' + { type: "Content-Type: application/vnd.ms-excel" } + ';base64,' + respuesta.data.datos;
    a.download = "Reporte.xls";
    a.target = '_blank';
    a.click();
  };

  /**
   * Método encargado de guardar los datos de la entidad
   * @returns {bool}
   */
  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    if (!validacion) {
      return false;
    }
    const { fechaContrato, modalidad, mercado, modalidadRueda, tercero } = this.state;
    const objetoGenerar = {
      fechaContrato: fechaContrato,
      idemodalidad: modalidadRueda,
      ideTipoMercado: mercado,
      idModalidadContractual: modalidad,
      idTercero: tercero
    }
    axios.post(RUTAS_API.GESTION_REPORTES.REPORTE_PODER_CALORIFICO.GENERAR_REPORTE, objetoGenerar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.generarReporte(respuesta);
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
          <Fecha
            label='Fecha Contrato:'
            name='fechaContrato'
            fecha={this.state.fechaContrato}
            onChange={this.controlarCambio}
            sinDia={true}
          />
          <Combo
            opciones={this.state.listaModalidadRueda}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Tipo de Modalidad:'
            name='modalidadRueda'
            value={this.state.modalidadRueda}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={this.state.listaMercado}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Tipo de Mercado:'
            name='mercado'
            value={this.state.mercado}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={this.state.listaTercero}
            propTexto='terNomcompleto'
            propValor='terIderegistro'
            label='Operador o Contraparte:'
            name='tercero'
            value={this.state.tercero}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={this.state.listaModalidad}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Modalidad Contractual:'
            name='modalidad'
            value={this.state.modalidad}
            onChange={this.controlarCambio}
          />
        </div>
      </Fragment>
    );
  };
}

ReportePoderCalorifico.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ReportePoderCalorifico);

export { VistaRedux as RReportePoderCalorifico };
