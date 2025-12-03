import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { get as getProp } from 'object-path';
import { Input, Botonera, Combo, TextoNumerico, Util, Fecha } from 'appfuture-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import RUTAS_API from '../../../global/rutas_api';
import { UNIDADES_CALCULO_VOLUMEN } from '../../../global/constantes';
import { mostrarAlerta } from '../../../store/actions/AplicacionAcciones';
const VALOR_CONVERSION_DIAMETRO = 0.0254;

class CalculoVolumen extends Component {

  state = {
    tramo: '',
    temperatura: '',
    diametro: '',
    longitud: '',
    presion: '',
    fechaCalculo: '',
    patm: '',
    listaTramos: [],
    datosCalculo: null,
    mostrarModalConsulta: false,
  };

  /**
   * @method
   * Método encargado de ejecutar acciones al momento de cargar el componente
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
    this.ejecutarPeticiones();
  }

  /**
   * @method
   * Método encargado de ejecutar las consultar al cargar el componente
   */
  ejecutarPeticiones = () => {
    const peticiones = [
      axios.post(RUTAS_API.PARAMETRIZACION.CALCULO_VOLUMEN.TRAMOS_CONSULTAR, { criterio: '' }),
      axios.post(RUTAS_API.PARAMETRIZACION.CALCULO_VOLUMEN.CONSULTAR_PATM),
    ];

    axios.all(peticiones)
      .then(axios.spread((tramos, compuestos) => {
        const datosAplicacion = {
          listaTramos: [],
          patm: [],
        };
        if (tramos.data.codigo > 0) {
          datosAplicacion.listaTramos = tramos.data.datos;
        }
        if (compuestos.data.codigo > 0) {
          datosAplicacion.patm = compuestos.data.datos.conValor;
        }
        this.setState({ ...datosAplicacion });
      }));
  }

  /**
   * @method
   * Método encargado de ejecutar acciones al desmontar el componente
   */
  componentWillUnmount() {
    this.limpiarFormulario();
    this.props.history.replace({ entidadEditar: null });
  }

  /**
   * @method
   * Método encargado de consultar el valor de la variable patm
   */
  consultarPatm = () => {
    axios.post(RUTAS_API.PARAMETRIZACION.CALCULO_VOLUMEN.CONSULTAR_PATM)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ patm: respuesta.data.datos.conValor });
        }
      });
  };

  /**
   * @method
   * Método encargado de limpiar los datos del formulario
   */
  limpiarFormulario = () => {
    this.setState({
      mostrarModalConsulta: false,
      tramo: '',
      temperatura: '',
      diametro: '',
      longitud: '',
      presion: '',
      fechaCalculo: '',
      patm: '',
      datosCalculo: null,
    }, this.consultarPatm);
  };

  /**
   * @method
   * Método encargado de mostrar los botones del componente Botonera
   * @returns {Array}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Calcular', callback: this.calcular },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * @method
   * Método encargado de validar los valores obligatorios para calcular
   * @returns {Object}
   */
  validarDatosCalculo = () => {
    const { tramo, longitud, diametro, presion, temperatura, patm, fechaCalculo } = this.state;
    if (tramo == '-1' || tramo == '') {
      return { respuesta: false, mensaje: 'Debe seleccionar un tramo' };
    }

    if (fechaCalculo == '') {
      return { respuesta: false, mensaje: 'Debe seleccionar una fecha' };
    }

    if (temperatura == '') {
      return { respuesta: false, mensaje: 'Debe ingresar el valor de la temperatura' };
    }

    if (diametro == '') {
      return { respuesta: false, mensaje: 'Debe ingresar el valor del diamétro' };
    }

    if (longitud == '') {
      return { respuesta: false, mensaje: 'Debe ingresar el valor de la longitud' };
    }

    if (presion == '') {
      return { respuesta: false, mensaje: 'Debe ingresar el valor de la presión' };
    }

    if (patm == '') {
      return { respuesta: false, mensaje: 'Debe ingresar el valor para el patm' };
    }


    return { respuesta: true };
  }

  /**
   * @method
   * Método encargado de procesar el objeto de cromatografia
   * @param {Object} data Datos del calculo del volumen
   */
  procesarObjeto = (data) => {
    const objetoFinal = {
      volumenCorregido: data.volumenCorregido,
      cromatografiaIdeal: {},
      cromatografiaReal: {},
    };
    let total = 0;
    for (let index = 0; index < data.cromatografiaIdeal.length; index++) {
      const concepto = data.cromatografiaIdeal[index];
      total += concepto.trcoValor;
      objetoFinal.cromatografiaIdeal[`concepto${index}`] = { ...concepto };
    }
    objetoFinal.cromatografiaIdeal.total = total;
    total = 0;
    for (let index = 0; index < data.cromatografiaReal.length; index++) {
      const concepto = data.cromatografiaReal[index];
      total += concepto.trcoValor;
      objetoFinal.cromatografiaReal[`concepto${index}`] = { ...concepto };
    }
    objetoFinal.cromatografiaReal.total = total;
    return objetoFinal;
  }

  /**
   * @method
   * Método encargado de realizar el calculo
   * @returns {Boolean}
   */
  calcular = () => {
    const { tramo, longitud, diametro, presion, temperatura, patm, fechaCalculo } = this.state;
    const validar = this.validarDatosCalculo();
    let conversionDiametro = diametro.split('/');
    if (conversionDiametro.length == 1) {
      conversionDiametro = conversionDiametro[0] * VALOR_CONVERSION_DIAMETRO;
    } else if (conversionDiametro.length == 2) {
      conversionDiametro = (conversionDiametro[0] / conversionDiametro[1]) * VALOR_CONVERSION_DIAMETRO;
    } else {
      this.props.mostrarAlerta('Error', 'El diamétro es inválido');
      return;
    }
    if (!validar.respuesta) {
      toast.error(validar.mensaje);
      return;
    }
    axios.post(RUTAS_API.PARAMETRIZACION.CALCULO_VOLUMEN.CALCULAR, {
      diametro: conversionDiametro,
      temperatura: temperatura,
      presion: presion,
      longitud: longitud,
      idTramo: tramo,
      fecha: fechaCalculo,
      patm: patm
    })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ datosCalculo: this.procesarObjeto(respuesta.data.datos) });
        }
      });
  };

  /**
   * @method
   * Método encargado de controlar el cambio de los componentes
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    const { name, value } = evento.target;
    change[name] = value;
    if (name == 'diametro') {
      var regular = new RegExp(/^[0-9./]{0,16}$/);
      var v = regular.test(value);
      if (!v) {
        this.setState({ diametro: this.state.diametro });
        return;
      }
    }
    this.setState(change);
  };

  /**
   * @method
   * Método encargado de mostrar la tabla de tramos
   * @returns {JSX}
   */
  renderListaConceptos = () => {
    let dataCalculo = null;
    if (this.state.datosCalculo == null) {
      return null;
    }
    return (
      <table className='table table-condensed table-striped table-bordered mt-5'>
        <thead className='bg-dark text-white'>
          <tr>
            <th>Tipo Cromatografia</th>
            <th>METANO</th>
            <th>ETANO</th>
            <th>PROPANO</th>
            <th>I-BUTANO</th>
            <th>N-BUTANO</th>
            <th>I-PENTANO</th>
            <th>N-PENTANO</th>
            <th>N-HEXANO</th>
            <th>DIOXIDO DE CARBONO</th>
            <th>NITROGENO</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {
            Array.from({ length: 2 }).map((data, index) => {
              dataCalculo = index == 0 ? this.state.datosCalculo.cromatografiaIdeal : this.state.datosCalculo.cromatografiaReal;
              return (
                <tr key={index}>
                  <td>{(index == 0) ? 'Cromatografia Ideal' : 'Cromatografia real'}</td>
                  <td>{dataCalculo.concepto0.trcoValor}</td>
                  <td>{dataCalculo.concepto1.trcoValor}</td>
                  <td>{dataCalculo.concepto2.trcoValor}</td>
                  <td>{dataCalculo.concepto3.trcoValor}</td>
                  <td>{dataCalculo.concepto4.trcoValor}</td>
                  <td>{dataCalculo.concepto5.trcoValor}</td>
                  <td>{dataCalculo.concepto6.trcoValor}</td>
                  <td>{dataCalculo.concepto7.trcoValor}</td>
                  <td>{dataCalculo.concepto8.trcoValor}</td>
                  <td>{dataCalculo.concepto9.trcoValor}</td>
                  <td>{dataCalculo.total}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    );
  };

  /**
   * @method
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />
        <div className='conf-general row mt-5'>
          <Combo
            opciones={this.state.listaTramos}
            propTexto='trmNombre'
            propValor='trmIderegistro'
            label='Tramo :'
            name='tramo'
            value={this.state.tramo}
            onChange={this.controlarCambio}
          />
          <Fecha
            label='Fecha Calculo:'
            name='fechaCalculo'
            fecha={this.state.fechaCalculo}
            onChange={this.controlarCambio}
          />
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='Temperatura:'
            cols={4}
            value={this.state.temperatura}
            onChange={this.controlarCambio}
            name='temperatura'
          />
          <Input
            label='Unidad Medida Temperatura:'
            value={UNIDADES_CALCULO_VOLUMEN.UNIDAD_TEMPERATURA}
            name='unidadTemperatura'
            extra={{ disabled: true, readOnly: true }}
          />
          <Input
            label='Diámetro:'
            value={this.state.diametro}
            onChange={this.controlarCambio}
            name='diametro'
          />
          <Input
            label='Unidad Medida Diamétro:'
            value={UNIDADES_CALCULO_VOLUMEN.UNIDAD_DIAMETRO}
            name='unidadDiametro'
            extra={{ disabled: true, readOnly: true }}
          />
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='Logitud:'
            cols={4}
            value={this.state.longitud}
            onChange={this.controlarCambio}
            name='longitud'
          />
          <Input
            label='Unidad Medida Longitud:'
            value={UNIDADES_CALCULO_VOLUMEN.UNIDAD_LONGITUD}
            name='unidadLongitud'
            extra={{ disabled: true, readOnly: true }}
          />
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='Presión:'
            cols={4}
            value={this.state.presion}
            onChange={this.controlarCambio}
            name='presion'
          />
          <Input
            label='Unidad Medida Presión:'
            value={UNIDADES_CALCULO_VOLUMEN.UNIDAD_PRESION}
            name='unidadPresion'
            extra={{ disabled: true, readOnly: true }}
          />
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='Patm:'
            cols={4}
            value={this.state.patm}
            onChange={this.controlarCambio}
            name='patm'
          />
          <TextoNumerico
            aceptaDecimales={false}
            aceptaNegativos={false}
            label='Valor corregido:'
            cols={4}
            value={getProp(this.state, 'datosCalculo.volumenCorregido', '')}
            name='valorCorregido'
            extra={{ disabled: true }}
          />
          {this.renderListaConceptos()}
        </div>
      </Fragment>
    );
  }
}

CalculoVolumen.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(CalculoVolumen);

export { VistaRedux as RCalculoVolumen };
