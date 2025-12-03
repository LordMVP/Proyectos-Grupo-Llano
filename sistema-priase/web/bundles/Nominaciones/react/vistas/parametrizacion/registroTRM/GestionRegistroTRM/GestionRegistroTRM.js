import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Botonera, Combo, Tabla, Util, Fecha, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import { formatearArray } from '../../../../global/util_nominaciones';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { PROGRAMAS } from '../../../../global/constantes'
import './GestionRegistroTRM.scss';

class GestionRegistroTRM extends Component {

  state = {
    mostrarModalConsulta: false,

    // Datos de la entidad
    idVariable: '-1',
    valorTRM: '',
    idUnidadMedida: '-1',
    fecha: '',
    listaUnidadesMedida: [],
    listaTRM: [],
    consultasTerminadas: false,
  };

  /**
   * Consulta las TRM por Variable seleccionada.
   */
  consultarTRM = (idVariable) => {
    axios.post(RUTAS_API.PARAMETRIZACION.REGISTRO_TRM.CONSULTAR_TRM_DIAS, { idconcepto: idVariable })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaTRM: this.ordernarObjecto(formatearArray(respuesta.data.datos)) });
        }
      });
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
      axios.post(RUTAS_API.PARAMETRIZACION.REGISTRO_TRM.CONSULTAR_VARIABLES, { idPrograma: PROGRAMAS.REGISTRO_TRM_DENSIDAD, criterio: '' }),
      axios.post(RUTAS_API.PARAMETRIZACION.REGISTRO_TRM.CONSULTAR_FECHA),
    ];
    axios.all(peticiones)

      .then(axios.spread((variables, fechaActual) => {
        const datosAplicacion = {
          listaVariables: [],
          listaTRM: [],
          fecha: '',
        };
        if (variables.data.codigo > 0) {
          datosAplicacion.listaVariables = formatearArray(variables.data.datos);
        }

        if (fechaActual.data.codigo > 0) {
          let fecha = new Date(fechaActual.data.datos);
          fecha = this.formatearFecha(fecha);
          datosAplicacion.fecha = fecha;
        }

        this.setState({ ...datosAplicacion, consultasTerminadas: true });
      }));

  };

  /**
   * Método encargado de consultar la fecha actual.
   */
  consultarFechaActual = async () => {
    const respuesta = await axios.post(RUTAS_API.PARAMETRIZACION.REGISTRO_TRM.CONSULTAR_FECHA);
    if (respuesta.data.codigo > 0) {
      let fecha = new Date(respuesta.data.datos);
      fecha = this.formatearFecha(fecha);
      this.setState({ fecha: (fecha == '') ? '' : fecha });
    }
  };

  /**
   * Método encargado de organizar el arreglo por fecha de modificación
   * @returns {Object}
   */
  ordernarObjecto = (datosHistorico) => {
    if (datosHistorico.length === 0) {
      return [];
    }
    datosHistorico.sort((a, b) => {
      let dateA = Date.parse(a.covlFechavalor);
      let dateB = Date.parse(b.covlFechavalor);
      return dateA > dateB ? -1 : 1;
    });
    return datosHistorico;
  };

  /**
   * Método encargado de generar las columnas del componente tabla
   * @returns {Array}
   */
  obtenerColumnas = () => {
    return [
      {
        Header: 'Valores ' + this.obtenerNombreVariable(this.state.idVariable),
        columns: [
          {
            Header: 'Valor',
            accessor: 'covlValor'
          },
          {
            Header: 'Fecha',
            accessor: 'covlFechavalor'
          },
        ]
      }
    ];
  };

  /**
   * Método encargado de convertir la fecha a formato YYYY/MM/DD
   * @returns {String}
   */
  formatearFecha = (fecha) => {
    const anio = fecha.getFullYear();
    let mes = (1 + fecha.getMonth()).toString();
    mes = mes.length > 1 ? mes : '0' + mes;
    let dia = fecha.getDate().toString();
    dia = dia.length > 1 ? dia : '0' + dia;
    return anio + '-' + mes + '-' + dia;
  };

  /**
   * Método encargado de limpiar los campos del formulario
	 * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  limpiarFormulario = (evento) => {
    this.setState({
      // Datos de la entidad
      idVariable: '-1',
      idUnidadMedida: '-1',
      listaUnidadesMedida: [],
      valorTRM: '',
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
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de validar las variables del formulario
	 * @returns {Object}
   */
  validarFormulario = () => {
    const { idVariable, valorTRM, idUnidadMedida, fecha } = this.state;
    if (idVariable === '-1' || idVariable === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una variable.' } };
    }

    if (valorTRM.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar un valor' } };
    }

    if (isNaN(valorTRM)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El valor de la TRM debe ser un número' } };
    }

    if (valorTRM <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El valor de la TRM debe ser un número positivo y diferente de 0' } };
    }

    if (idUnidadMedida === '-1' || idUnidadMedida === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una unidad de medida.' } };
    }

    if (fecha.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una fecha.' } };
    }

    return { respuesta: true };
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

    const { idVariable, idUnidadMedida, valorTRM, fecha } = this.state;

    const entidadGuardar = {
      uniIdeconcepto: {
        uniConcepto: idVariable,
      },
      uniIdemedida: {
        uniIderegistro: idUnidadMedida
      },
      trcoValor: valorTRM,
      trcoFecha: fecha
    };

    axios.post(RUTAS_API.PARAMETRIZACION.REGISTRO_TRM.GUARDAR, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
          this.consultarFechaActual();
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
    if (evento.target.name === 'idVariable') {
      this.consultarTRM(evento.target.value);
      this.consultarUnidades(evento.target.value);
    }
  };

  /**
   * Método encargado de consultar las unidades de medida de la variable seleccionada
   * @param {number} idVariable Identificador de la variable seleccionada
   */
  consultarUnidades = (idVariable) => {
    axios.post(RUTAS_API.PARAMETRIZACION.REGISTRO_TRM.CONSULTAR_UNIDADES_MEDIDA, { idVariable: idVariable })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaUnidadesMedida: respuesta.data.datos });
        }
      });
  };

  /**
   * Obtiene el nombre variable.
   * @return {string}
   */
  obtenerNombreVariable = (idVariable) => {
    const variable = this.state.listaVariables.find(v => v.uniConcepto == idVariable);
    if (variable) {
      return variable.conNombre;
    }
    return null;
  };

  /**
   * Método encargado de mostrar el formulario
	 * @returns {Object}
   */
  render() {
    if (!this.state.consultasTerminadas) {
      return (<p className='text-center'>Cargando...</p>);
    }

    const nombreVariable = this.obtenerNombreVariable(this.state.idVariable);

    return (
      <Fragment>
        <div className='d-flex justify-content-center'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>

        <div className='conf-general row mt-5'>
          <Combo
            opciones={this.state.listaVariables}
            propTexto='conNombre'
            propValor='uniConcepto'
            label='Variable:'
            name='idVariable'
            value={this.state.idVariable}
            onChange={this.controlarCambio}
          />
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='Valor:'
            value={this.state.valorTRM}
            onChange={this.controlarCambio}
            name='valorTRM'
          />
          <Combo
            opciones={this.state.listaUnidadesMedida}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Unidad medida:'
            name='idUnidadMedida'
            value={this.state.idUnidadMedida}
            onChange={this.controlarCambio}
          />
          <Fecha
            label="Fecha:"
            onChange={this.controlarCambio}
            name='fecha'
            fecha={this.state.fecha}
          />

        </div>
        {
          (nombreVariable) && (<Tabla
            datos={this.state.listaTRM}
            columnas={this.obtenerColumnas()}
          />)
        }
      </Fragment>
    );
  };
}

GestionRegistroTRM.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionRegistroTRM);

export { VistaRedux as RGestionRegistroTRM };
