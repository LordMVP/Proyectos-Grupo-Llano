import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import { Input, Botonera, Combo, Tabla, Fecha, VentanaModal, Util } from 'appfuture-react';
import axios from 'axios';
import { get as getProp } from 'object-path';
import { SelectorMultiple } from '../../../../utils/SelectorMultiple';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { runInThisContext } from 'vm';
import RUTAS_API from '../../../../../global/rutas_api';

const listaValidaciones = [
  { texto: 'Lecturas', valor: 'L' },
  { texto: 'Facturas', valor: 'F' },
  { texto: 'Perdidas', valor: 'P' },
  { texto: 'Validar', valor: 'V' },
  { texto: 'Lecturas', valor: 'L' },
  { texto: 'Indice de Perdas', valor: 'IP' },
  { texto: 'Creg240', valor: 'C' },
];

class ProcesoValidar extends Component {

  state = {
    mostrarModalConsulta: false,
    tipoValidacion: '',
    listaLecturas: []
  };

  /**
   * Limpia el formulario...
   */
  limpiarFormulario = (evento) => {
    this.setState({

    });
  };

  validarFormulario = () => {
    // Ejemplo Validacion
    if (false) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos un cargo de tipo AO&M para poder continuar.' } };
    }

    return { respuesta: true };
  };

  /**
   * Obtiene la lista de puntos seleccionados.
   * @return {array}
   */
  obtenerPuntosConsumo = () => {
    const listaPuntosConsumo = getProp(this.props, 'listaPuntosConsumo', []);
    return listaPuntosConsumo.filter(p => p.seleccionado).map(p => {
      return p.ptcIderegistro
    });
  };

  /**
   * Consulta los valores para validar las lecturas.
   */
  consultarLecturas = (tipoValidacion) => {
    if (!this.validarParaConsulta()) {
      return;
    }
    let url = null;
    const obj = {
      puntosConsumo: this.obtenerPuntosConsumo(),
      mes: this.props.mes,
      anio: this.props.anio,
      fechaInicio: this.props.fechaInicio,
      fechaFin: this.props.fechaFin
    };
    if (!tipoValidacion) {
      tipoValidacion = this.props.tipoValidacion;
    }
    switch (tipoValidacion) {
      case 'L':
        url = RUTAS_API.CALCULO_INDICE_PERDIDAS.CONSULTAR_VALIDAR_LECTURAS;
        break;
      case 'F':
        url = RUTAS_API.CALCULO_INDICE_PERDIDAS.CONSULTAR_VALIDACION_FACTURA;
        break;
      case 'P':
        url = RUTAS_API.CALCULO_INDICE_PERDIDAS.CONSULTAR_GASIFICACIONES;
        break;
    }
    axios.post(url, obj).then(
      respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ datos: respuesta.data.datos });
        }
      }
    );
  };


  /**
   * Valida si se han seleccionado los campos necesarios para consultar las lecturas...
   * @return {boolean}
   */
  validarParaConsulta = () => {
    const puntosConsumo = this.obtenerPuntosConsumo();
    const { anio, mes } = this.props;
    if ((puntosConsumo == '') || parseInt(anio) < 0 || parseInt(mes) < 0) {
      return false;
    }
    return true;
  };

  /**
   * Controla el cambio de los componentes.
   */
  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.props.actualizarValidarCalculoPerdidas(change);
    let tipoValidacion = this.props.tipoValidacion;
    if (evento.target.name == 'tipoValidacion') {
      tipoValidacion = evento.target.value;
    }
    // this.consultarLecturas(tipoValidacion);
  };

  /**
   * Busca un punto de consumo por id y obtiene el nombre del punto de consumo.
   * @return {string}
   */
  obtenerNombrePuntoConsumo = (idPuntoConsumo) => {
    const listaPuntosConsumo = getProp(this.props, 'listaPuntosConsumo', []);
    const puntoConsumo = listaPuntosConsumo.find(p => p.ptcIderegistro === idPuntoConsumo);
    return puntoConsumo.ptcoNombre;
  };

  /**
   * Método encargado de mostrar la tabla para validar las facturas
   * @returns {}
   */
  renderTablaFacturas = (datos) => {
    if (!Util.validarArreglo(datos)) {
      return '';
    }
    return (
      <div className='col-12'>
        <h1 className='titulo-tabla'>Validar para Facturación</h1>
        <table className='table table-condensed table-striped'>
          <thead className='bg-dark text-white'>
            <tr>
              <th>Punto de Consumo</th>
              <th>Periodo</th>
              <th>Uso</th>
              <th>Cantidad de Usuarios</th>
              <th>Consumo M3</th>
              <th>Promedio Consumo por Usuario</th>
              <th>Total Ventas</th>
            </tr>
          </thead>
          <tbody>
            {
              datos.map((dato, index) => {
                const json = dato.inpFacturacion;
                return (
                  <tr key={index}>
                    <td>{this.obtenerNombrePuntoConsumo(dato.ptcIdepuntoconsumo.ptcIderegistro)}</td>
                    <td>{dato.inpPeriodo}</td>
                    <td>{dato.nombreTipoUso}</td>
                    <td>{dato.cantidadUsuarios}</td>
                    <td>{dato.consumo}</td>
                    <td>{dato.promedioConsumo}</td>
                    <td>0</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    );
  };


  /**
   * Método encargado de mostrar la tabla para validar las perdidas
   * @returns {}
   */
  renderTablaPerdidas = (datos) => {
    if (!Util.validarArreglo(datos)) {
      return '';
    }
    return (
      <div className='col-12'>
        <h1 className='titulo-tabla'>Validar para Perdidas y Gasificaciones</h1>
        <table className='table table-condensed table-striped'>
          <thead className='bg-dark text-white'>
            <tr>
              <th>Punto de Consumo</th>
              <th>Periodo</th>
              <th>Cantidad Perdidas Menores M3</th>
              <th>Cantidad Perdidas Mayores M3</th>
              <th>Cantidad Gasificaciones M3</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {
              datos.map((dato, index) => {
                return (
                  <tr key={index}>
                    <td>{dato.punto.ptcoNombre}</td>
                    <td>{this.periodo}</td>
                    <td>{dato.inpCantperdidmenor}</td>
                    <td>{dato.inpCantperdidmayor}</td>
                    <td>{dato.inpCantgasificacion}</td>
                    <td>0</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    );
  };

  /**
   * Obtiene la lista de lecturas.
   * @return {array}
   */
  obtenerLecturas = (datos) => {
    return datos.filter(d => {
      if (d.inpCantnominadambtu >= 0 || d.inpConspreliminarmbtu >= 0 || d.inpLectcertificadambtu >= 0 || d.inpLecturacertificada >= 0) {
        return d;
      }
    });
  };

  /**
   * Obtiene la lista de facturas.
   * @return {array}
   */
  obtenerFacturas = (datos) => {
    return datos.filter(d => {
      if (d.inpFacturacion >= 0) {
        return d;
      }
    });
  };

  /**
   * Obtener la lista de perdidas.
   * @return {array}
   */
  obtenerPerdidas = (datos) => {
    return datos.filter(d => {
      if (d.inpCantperdidmenor >= 0 || d.inpCantperdidmayor >= 0 || d.inpCantgasificacion >= 0) {
        return d;
      }
    });
  };

  construirTablas = () => {
    let datos = getProp(this.state, 'datos', []);
    if (!Util.validarArreglo(datos)) {
      return '';
    }
    return (
      <div className='row'>
        {getProp(this.props, 'tipoValidacion', '') === 'L' &&
          this.renderTablaLecturas(datos)
        }
        {getProp(this.props, 'tipoValidacion', '') === 'F' &&
          this.renderTablaFacturas(datos)
        }
        {getProp(this.props, 'tipoValidacion', '') === 'P' &&
          this.renderTablaPerdidas(datos)
        }
      </div>
    );
  };

  render() {
    return (
      <div>
        <div className='conf-general row mt-3'>
          <Fecha
            label='Fecha inicio:'
            name='fechaInicio'
            fecha={this.props.fechaInicio}
            onChange={this.controlarCambio}
          />
          <Fecha
            label='Fecha Fin:'
            name='fechaFin'
            fecha={this.props.fechaFin}
            onChange={this.controlarCambio}
          />
          <SelectorMultiple
            titulo='Puntos de Consumo'
            propTexto='ptcoNombre'
            propValor='ptcIderegistro'
            seleccionarItem={this.props.seleccionarItem}
            lista={getProp(this.props, 'listaPuntosConsumo', [])}
          />
        </div>
        {this.construirTablas()}
      </div>
    );
  }
}

ProcesoValidar.propTypes = {
  history: PropTypes.object,
  mostrarAlerta: PropTypes.func,
  listaPuntosConsumo: PropTypes.array,
  seleccionarItem: PropTypes.func,
  actualizarValidarCalculoPerdidas: PropTypes.func
};

const mapStateToProps = state => {
  return getProp(state, 'calculoPerdidas.validar', {});
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    mostrarAlerta,
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(ProcesoValidar);

export { VistaRedux as RProcesoValidar };
