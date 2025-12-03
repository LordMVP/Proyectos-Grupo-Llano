import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Botonera, TextoNumerico, VentanaModal } from 'appfuture-react';
import ConsultaGenerica from '../../../../../hoc/consultaGenerica/ConsultaGenerica';
import RUTAS_API from '../../../../../global/rutas_api';
import RUTAS_VISTA from '../../../../../global/rutas_vista';
import { get as getProp } from 'object-path';
import { RConsultaContratos } from '../../../../contratos/ConsultaContratos';

class FacturasComponentConsulta extends Component {

  consultaGenerica = null;
  columnas = [
    {
      Header: 'Revisiones de Facturas',
      columns: [
        {
          Header: 'Número de  Contrato',
          accessor: 'cntIdecontrato.cntNumero',
        },
        {
          Header: 'Tercero Contrato',
          accessor: 'cntIdecontrato.terIdeagente.terNombre',
        },
        {
          Header: 'Periodo',
          accessor: 'refaPeriodo',
        },
        {
          Header: 'Número Factura',
          accessor: 'refaNumfactura'
        },
        {
          Header: 'Valor Factura',
          accessor: 'refaVlrfactura',
        }
      ]
    }
  ];

  state = {
    numeroFactura: '',
    contrato: null,
    modalContratos: false,
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
    const { contrato, numeroFactura } = this.state;
    let parametros = {
      idContrato: getProp(contrato, 'cntIderegistro', null),
      numeroFactura: numeroFactura == '' ? null : numeroFactura,
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
      contrato: null,
      modalContratos: false,
      numeroFactura: ''
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
  * Método encargado de abrir el modal de consultar contratos
  * @returns {Boolean}
  */
  abrirConsultaContratos = () => {
    this.setState({ modalContratos: true });
  };

  /**
   * @method
   * Método encargado de cerrar la ventana del boton de consulta
   */
  abrirCerrarModal = () => {
    this.setState({ modalContratos: false });
  };

  /**
   * @method
   * Método encargado de cargar los datos de la entidad en la variable contrato
   * @param {Object} entidad Entidad seleccioanda
   */
  onSeleccionarContrato = (entidad) => {
    this.setState({ contrato: entidad, modalContratos: false });
  };

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
      title: `${getProp(contrato, 'cntNumero', '')}-${getProp(contrato, 'cntNumero', '')}`,
      value: getProp(contrato, 'cntNumero', ''),
      type: 'text',
      disabled: true
    };
    return (
      <div className='col-4 form-group'>
        <label>Contrato:</label>
        <div className="input-group mb-3">
          <input {...propsInput} />
          <div className="input-group-prepend">
            <button className="btn-primary btn-buscador input-group-text" title='Seleccionar contrato' onClick={this.abrirConsultaContratos}><i className='fa fa-fw fa-check-square-o'></i></button>
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
          <TextoNumerico
            aceptaDecimales={false}
            aceptaNegativos={false}
            label='Número de Factura:'
            cols={4}
            value={this.state.numeroFactura}
            onChange={this.controlarCambio}
            name='numeroFactura'
          />
          {this.renderSelectorContrato()}
        </div>
        <ConsultaGenerica
          {...this.props}
          idEntidad='cbbIderegistro'
          columnas={this.columnas}
          ref={ref => this.consultaGenerica = ref}
          interfazGestion={RUTAS_VISTA.GESTION_REVISION_FACTURAS.url}
          rutaConsulta={RUTAS_API.PARAMETRIZACION.GESTION_REVISION_FACTURAS.CONSULTAR_REVISION}
        />
        <VentanaModal
          mostrar={this.state.modalContratos}
          titulo='Contratos'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaContratos
            esModal
            seleccionarEntidad={this.onSeleccionarContrato}
            inhabilitarTercero={true}
            tiposContrato={['T']}
            estadosContrato={['A', 'F']}
            inhabilitarEstado={true}
            tiposContratoDisabled={true}
            tipoNegocio={'C'}
          />
        </VentanaModal>
      </Fragment>
    );
  };
}

FacturasComponentConsulta.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array,
  mostrarAlerta: PropTypes.func,
};

FacturasComponentConsulta.defaultProps = {
  esModal: false
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FacturasComponentConsulta);

export { VistaRedux as RFacturasComponentConsulta };
