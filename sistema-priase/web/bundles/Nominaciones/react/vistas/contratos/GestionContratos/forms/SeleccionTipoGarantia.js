import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Combo, Input, Util } from 'appfuture-react';
import { actualizarGarantia, actualizarCabeceraContrato } from '../../../../store/actions/ContratosAcciones';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { get as getProp } from 'object-path';
import { GarantiaPrepago } from './GarantiaPrepago';
import { GarantiaBancaria } from './GarantiaBancaria';
import PolizaContratos from './PolizaContratos';

const tiposContrato = {
  SUMINISTRO: { codigo: 'S', descripcion: 'Suministro' },
  GNV_SUMINISTRO: { codigo: 'GNCV', descripcion: 'GNV Suministro' },
  TRANSPORTE: { codigo: 'T', descripcion: 'Transporte' },
  ATR: { codigo: 'ATR', descripcion: 'ATR' },
  CONEXION: { codigo: 'CNX', descripcion: 'Conexión' },
  GNC: { codigo: 'GNC', descripcion: 'GNC' },
  GNV: { codigo: 'GNV', descripcion: 'GNV' },
};

class SeleccionTipoGarantia extends Component {

  state = {
    // Datos de la entidad
    tipoGarantia: '',

  };

  /**
   * Método encargado de controlar el cambio de los componentes
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    if (evento.target.name === 'tipoGarantia') {
      this.actualizarGarantiaRedux({ tipoGarantia: evento.target.value });
    }
  };

  /**
   * Método encargado de actualizar el objeto redux de garantias
   * @param {Event} nuevoCambio Cambio a realizar
   */
  actualizarGarantiaRedux = (nuevoCambio) => {
    this.props.actualizarGarantia({
      ...nuevoCambio
    });
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Component}
   */
  renderGarantia = () => {
    const tipoGarantia = getProp(this.props, 'garantia.tipoGarantia', '');
    const TIPOS_GARANTIA = this.props.tiposGarantia;
    const { listaUnidadesMedida } = this.props;
    switch (tipoGarantia) {
      case TIPOS_GARANTIA.BANCARIA:
        return (
          <GarantiaBancaria
            mostrarAlerta={this.props.mostrarAlerta}
            actualizarGarantia={this.props.actualizarGarantia}
            tipoGarantia={tipoGarantia}
            garantia={this.props.garantia}
            cabecera={this.props.cabecera}
            listas={this.props.listas}
            tipoCalculo={this.props.tipoCalculo}
            tiposContrato={tiposContrato}
            listaUnidadesMedida={listaUnidadesMedida}
            estadoContrato={getProp(this.props, 'cabecera.estadoContrato', '')}
            valoresGarantia={getProp(this.props, 'cabecera.valoresGarantia', '')}
          />
        );
      case TIPOS_GARANTIA.PREPAGO:
        return <GarantiaPrepago
          mostrarAlerta={this.props.mostrarAlerta}
          actualizarGarantia={this.props.actualizarGarantia}
          tipoGarantia={tipoGarantia}
          garantia={this.props.garantia}
          cabecera={this.props.cabecera}
          listas={this.props.listas}
          tiposContrato={tiposContrato}
          tipoCalculo={this.props.tipoCalculo}
          actualizarCabecera={this.props.actualizarCabeceraContrato}
          listaUnidadesMedida={listaUnidadesMedida}
          estadoContrato={getProp(this.props, 'cabecera.estadoContrato', '')}
          valoresGarantia={getProp(this.props, 'cabecera.valoresGarantia', '')}
        />;
      case TIPOS_GARANTIA.POLIZA:
        return <PolizaContratos
          mostrarAlerta={this.props.mostrarAlerta}
          actualizarGarantia={this.props.actualizarGarantia}
          tipoGarantia={tipoGarantia}
          garantia={this.props.garantia}
          cabecera={this.props.cabecera}
          listas={this.props.listas}
          tipoCalculo={this.props.tipoCalculo}
          tiposContrato={tiposContrato}
          listaUnidadesMedida={listaUnidadesMedida}
          estadoContrato={getProp(this.props, 'cabecera.estadoContrato', '')}
          valoresGarantia={getProp(this.props, 'cabecera.valoresGarantia', '')}
        />;
    };
  };

  /**
   * Filtra las garantias para obtener las que tienen tipo
   * @returns {Array}
   */
  obtenerGarantias = () => {
    const { tiposGarantias } = this.props.listas;
    return tiposGarantias.filter(garantia => {
      if (garantia.listaPropiedades.tipo && garantia.listaPropiedades.tipo != '') {
        return garantia;
      }
    });
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    const cantidadesContratadas = getProp(this.props, 'cabecera.listaCantidad', '');
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitar = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitar = true;
    }
    if (!Util.validarArreglo(cantidadesContratadas)) {
      return (
        <div className='conf-general mt-3 text-center'>
          <i className='fa fa-fw fa-warning'></i> No hay una cantidad contratada válida para continuar.
        </div>
      );
    }
    return (
      <div className='conf-general row mt-5'>
        <Combo
          opciones={this.obtenerGarantias()}
          propTexto='uniNombre1'
          propValor='listaPropiedades.tipo'
          label='Seleccione el tipo garantia:'
          name='tipoGarantia'
          value={getProp(this.props, 'garantia.tipoGarantia', '')}
          onChange={this.controlarCambio}
          extra={{ disabled: desabilitar }}
        />
        <div className="col-12">
          {this.renderGarantia()}
        </div>
      </div>
    );
  }
}

SeleccionTipoGarantia.propTypes = {
  history: PropTypes.object,
  mostrarAlerta: PropTypes.func,
  tiposGarantia: PropTypes.object
};


SeleccionTipoGarantia.defaultProps = {
  garantia: {}
};


const mapStateToProps = state => {
  const { cabecera, garantia, listas, tipoCalculo } = state.contratos;
  return { cabecera, garantia, listas, tipoCalculo };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    mostrarAlerta,
    actualizarGarantia,
    actualizarCabeceraContrato,
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(SeleccionTipoGarantia);
export { VistaRedux as RSeleccionTipoGarantia };
