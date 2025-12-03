import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Botonera, TextoNumerico, VentanaModal } from 'appfuture-react';
import ConsultaGenerica from '../../../../../hoc/consultaGenerica/ConsultaGenerica';
import RUTAS_API from '../../../../../global/rutas_api';
import RUTAS_VISTA from '../../../../../global/rutas_vista';
import { get as getProp } from 'object-path';
import { RFacturasComponentConsulta } from './FacturasComponentConsulta'

class DispercionConsumosConsulta extends Component {

  consultaGenerica = null;
  columnas = [
    {
      Header: 'Dispersión',
      columns: [
        {
          Header: 'Número de  Contrato',
          accessor: 'contrato',
          Cell: (props) => this.obtenerContrato(props, this)
        },
        {
          Header: 'Periodo',
          accessor: 'refaPeriodo',
          Cell: (props) => this.obtenerPeriodo(props, this)
        },
        {
          Header: 'Puntos de Salida',
          accessor: 'puntos',
          Cell: (props) => this.obtenerPuntosNegativos(props, this)
        }
      ]
    }
  ];

  /**
     * Método encargado de obtener los nombres de los puntos que pertenecen a esa provisión
     * @param {Object} props Propiedades del componente Tabla
     */
  obtenerPuntosNegativos = (props) => {
    let detalles = props.row._original.info;
    detalles = JSON.parse(detalles);
    return detalles.map(detalle => {
      return detalle.ptsa_nombre;
    }).join(',');
  };

  /**
   * @method
   * Método encargado de obtener el periodo
   * @returns {String}
   */
  obtenerPeriodo = () => {
    return getProp(this.state, 'factura.refaPeriodo', '');
  }

  /**
   * @method
   * Método encargado de obtener el contrato
   * @returns {String}
   */
  obtenerContrato = () => {
    return getProp(this.state, 'factura.cntIdecontrato.cntNumero', '');
  }

  state = {
    factura: null,
    modalConsultaValidacion: false
  };

  /**
   * @method
   * Método encargado de generar los botones del formulario
   * @returns {Object}
   */
  obtenerFunciones = () => {
    let funciones = [{ texto: 'Consultar', callback: this.onBuscar }];
    funciones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    return funciones;
  };

  /**
   * @method
   * Metodo encargado de realizar la consulta
   * @returns {bool}
   */
  onBuscar = () => {
    const { factura } = this.state;
    let parametros = {
      idRevision: getProp(factura, 'refaIderegistro', null),
    }
    this.consultaGenerica.getWrappedInstance()._buscar(parametros);
  };

  /**
   * @method
   * Método encargado de obtener los datos seleccionados
   */
  onSeleccionarEntidades = () => {
    this.props.seleccionarEntidades(this.consultaGenerica.getWrappedInstance()._obtenerEntidades());
  };

  /**
   * @method
   * Método encargado de limpiar el formulario
   */
  limpiarFormulario = () => {
    this.setState({
      factura: null,
      modalConsultaValidacion: false,
    });
    this.consultaGenerica.getWrappedInstance()._limpiarFormulario();
  };

  /**
   * @method
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  /**
   * @method
   * Método encargado de abrir el modal de facturas
   */
  abrirConsultaFacturas = () => {
    this.setState({ modalConsultaValidacion: true });
  }

  /**
   * @method
   * Método encargado de consultar la factura para la disperción
   * @param {Object} entidad Datos de la factura seleccionada
   */
  onSeleccionarEntidad = (entidad) => {
    this.setState({ factura: entidad, modalConsultaValidacion: false });
  }

  /**
    * @method
    * Método encargado de mostrar el componente selector de contratos
    * @returns {Object}
    */
  renderSelectorRevision = () => {
    let desabilitado = false;
    if (getProp(this.props, 'cabecera.idRevision', '') != '') {
      desabilitado = true;
    }
    let value = '';
    const factura = getProp(this.state, 'factura', null);
    if (factura != null) {
      value = `Periodo: ${getProp(factura, 'refaPeriodo', '')} - Contrato: ${getProp(factura, 'cntIdecontrato.cntNumero', '')} - Número Factura ${getProp(factura, 'refaNumfactura', '')}`;
    }
    const propsInput = {
      placeholder: 'Seleccione una Revisión de Factura',
      className: 'form-control',
      name: 'factura',
      title: value,
      value: value,
      type: 'text',
      disabled: true
    };
    return (
      <div className='col-6 form-group'>
        <label>Revisión Factura:</label>
        <div className="input-group mb-3">
          <input {...propsInput} />
          <div className="input-group-prepend">
            <button className="btn-primary btn-buscador input-group-text" disabled={desabilitado} title='Seleccionar Factura' onClick={this.abrirConsultaFacturas}><i className='fa fa-fw fa-check-square-o'></i></button>
          </div>
        </div>
      </div>
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
        <div className='conf-general row mt-5'>
          <Botonera funciones={this.obtenerFunciones()} />
          {this.renderSelectorRevision()}
        </div>
        <ConsultaGenerica
          {...this.props}
          idEntidad='cbbIderegistro'
          columnas={this.columnas}
          ref={ref => this.consultaGenerica = ref}
          interfazGestion={RUTAS_VISTA.GESTION_REVISION_FACTURAS.url}
          rutaConsulta={RUTAS_API.PARAMETRIZACION.GESTION_REVISION_FACTURAS.DISPERCION.CONSULTAR}
        />
        <VentanaModal
          mostrar={this.state.modalConsultaValidacion}
          titulo='Seleccionar Revisión de Factura'
          cerrarModal={() => this.setState({ modalConsultaValidacion: false })}>
          <RFacturasComponentConsulta
            esModal
            seleccionarEntidad={this.onSeleccionarEntidad}
          />
        </VentanaModal>
      </Fragment>
    );
  };
}

DispercionConsumosConsulta.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array,
  mostrarAlerta: PropTypes.func,
};

DispercionConsumosConsulta.defaultProps = {
  esModal: false
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(DispercionConsumosConsulta);

export { VistaRedux as RDispercionConsumosConsulta };
