import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { formatearArray } from '../../../../global/util_nominaciones';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { Botonera, Combo, Fecha, TextoNumerico, Input, Util } from 'appfuture-react';
import RUTAS_API from '../../../../global/rutas_api';

class GestionInformacionFacturacion extends Component {

  state = {
    //Datos de la entidad
    fecha: '',
    tipoUsuario: '-1',
    puntoConsumo: '-1',
    cantUsuarios: '',
    m3Facturados: '',
    //Listas de la entidad
    listaPuntosConsumo: [],
    listaTipoUsuario: [],
    rango: [],
  }

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }

    const peticiones = [
      axios.post(RUTAS_API.PARAMETRIZACION.INFORMACION_FACTURACION.CONSULTAR_TIPO_USUARIO),
      axios.post(RUTAS_API.PARAMETRIZACION.INFORMACION_FACTURACION.CONSULTAR_PUNTOS_CONSUMO, { criterio: '' }),
      axios.post(RUTAS_API.PARAMETRIZACION.INFORMACION_FACTURACION.CONSULTAR_RANGO),
    ];
    axios.all(peticiones)

      .then(axios.spread((tipoUsuario, puntosConsumo, rangos) => {
        const datosAplicacion = {
          listaTipoUsuario: [],
          listaPuntosConsumo: [],
          rango: [],
        };
        if (tipoUsuario.data.codigo > 0) {
          datosAplicacion.listaTipoUsuario = this.armarObjectoTipoUsuario(formatearArray(tipoUsuario.data.datos));
        }

        if (puntosConsumo.data.codigo > 0) {
          datosAplicacion.listaPuntosConsumo = formatearArray(puntosConsumo.data.datos);
        }

        if (rangos.data.codigo > 0) {
          datosAplicacion.rango = this.obtenerObjectoRangos(formatearArray(rangos.data.datos));
        }
        this.setState({ ...datosAplicacion });
      }));

  };

  /**
   * Método encargado de generar un objeto con los rangos consultados
   * @param {Object} rangosConsultados
   * @returns {Object}
   */
  obtenerObjectoRangos = (rangosConsultados) => {
    const objeto = rangosConsultados.map(dato => {
      return {
        anio: dato.anio,
        idOrden: dato.idOrden,
        info: dato.info,
        nombre: dato.nombre,
        unico: Util.generarIdControl("per")
      }
    });
    return objeto;
  };

  /**
   * Método encargado de generar los botones del formulario
	 * @returns {Object}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Consultar', callback: this.consulta },
      { texto: 'Limpiar', callback: this.limpiarFormulario },
    ];
  };

  /**
   * Método encargado de validar las variables del formulario
	 * @returns {Object}
   */
  validarFormulario = () => {
    const { fecha, tipoUsuario, puntoConsumo } = this.state;
    if (fecha === '-1' || fecha === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una fecha.' } };
    }

    if (puntoConsumo === '-1' || puntoConsumo === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un punto de consumo.' } };
    }

    if (tipoUsuario === '-1' || tipoUsuario === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un tipo de usuario' } };
    }

    return { respuesta: true };

  };

  /**
   * Método encargado de limpiar los campos del formulario
   */
  limpiarFormulario = () => {
    this.setState({
      fecha: '-1',
      tipoUsuario: '-1',
      puntoConsumo: '-1',
      cantUsuarios: '',
      m3Facturados: '',
    });
  };

  /**
   * Método encargado de armar un objecto con los tipos de usuario consultados
   * @returns {Object}
   */
  armarObjectoTipoUsuario = (tiposUsuario) => {
    if (!Util.validarArreglo(tiposUsuario)) {
      return false;
    }
    const objectoADevolver = tiposUsuario.map(dato => {
      return {
        valor: dato,
        texto: dato
      }
    });
    return objectoADevolver;
  };

  /**
   * Método encargado de realizar la consulta de la cantidad de usuarios y los m3 facturados
   * @returns {bool}
   */
  consulta = () => {
    const validar = this.validarFormulario();
    let m3Facturados = '';
    if (!validar.respuesta) {
      this.props.mostrarAlerta(validar.mensaje.titulo, validar.mensaje.mensaje);
      return false;
    }
    const entidadConsultar = this.obtenerDatosConsulta();
    axios.post(RUTAS_API.PARAMETRIZACION.INFORMACION_FACTURACION.CONSULTA_INFORMACION_PRISMA, entidadConsultar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({
            m3Facturados: (respuesta.data.datos.cantidadConsumo) ? respuesta.data.datos.cantidadConsumo : 0,
            cantUsuarios: (respuesta.data.datos.cantidadUsuarios) ? respuesta.data.datos.cantidadUsuarios : 0,
          });
        }
      });
  };

  /**
   * Método encargado de armar un objeto con los datos necesarios para consultar la cantidad de usuarios y los m3 facturados
   * @returns {Object}
   */
  obtenerDatosConsulta = () => {
    const { puntoConsumo, tipoUsuario, fecha, rango } = this.state;
    const fechaSelecionada = rango.find(p => p.unico == fecha);
    const objetoADevolver = {
      idPuntoConsumo: puntoConsumo,
      anio: fechaSelecionada.anio,
      idOrden: fechaSelecionada.idOrden,
      tipoUsuario: tipoUsuario,
    }
    return objetoADevolver;
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
   * Método encargado de generar el select de rango
   * @returns {Object}
   */
  renderCombo = () => {
    const { rango, fecha } = this.state;
    return (
      <div className='form-group col-4'>
        <label htmlFor='fecha'>Fecha:</label>
        <select className='form-control' name='fecha' id="fecha" onChange={this.controlarCambio}>
          <option value='-1'>Seleccione una opción</option>
          {rango.map(dato => {
            return (
              <option {...(fecha == dato.unico) ? 'selected' : ''} value={dato.unico}>{`${dato.nombre}--${dato.anio}`}</option>
            )
          })}
        </select>
      </div>
    )
  };

  /**
   * Método encargado de mostrar el formulario
	 * @returns {Object}
   */
  render() {
    return (
      <Fragment>
        <div className='registro-informacion-facturacion'>
          <Botonera funciones={this.obtenerFunciones()} />
          <div className='row mt-4'>
            {
              this.renderCombo()
            }
            <Combo
              opciones={this.state.listaPuntosConsumo}
              propTexto='ptcoNombre'
              propValor='ptcIderegistro'
              label='Punto de consumo:'
              name='puntoConsumo'
              value={this.state.puntoConsumo}
              onChange={this.controlarCambio}
            />
            <Combo
              opciones={this.state.listaTipoUsuario}
              propTexto='texto'
              propValor='valor'
              label='Tipo de Usuario:'
              name='tipoUsuario'
              value={this.state.tipoUsuario}
              onChange={this.controlarCambio}
            />
            <TextoNumerico
              aceptaDecimales={false}
              aceptaNegativos={false}
              label='Cant Usuarios:'
              value={this.state.cantUsuarios}
              name='cantUsuarios'
              extra={{ disabled: true, readOnly: true }}
            />
            <TextoNumerico
              aceptaDecimales={false}
              aceptaNegativos={false}
              label='M3 Facturados:'
              value={this.state.m3Facturados}
              name='m3Facturados'
              extra={{ disabled: true, readOnly: true }}
            />
          </div>
        </div>
      </Fragment>
    );
  };
}


GestionInformacionFacturacion.propTypes = {
  mostrarAlerta: PropTypes.func
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ mostrarAlerta }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionInformacionFacturacion);
export { VistaRedux as RGestionInformacionFacturacion };
