import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import RUTAS_API from '../../../global/rutas_api';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { Util, Botonera, Fecha, VentanaModal, Tabla } from 'appfuture-react';
import { limpiarJson } from '../../../global/util_nominaciones';
import { get as getProp } from 'object-path';
import { Fragment } from 'react';
import { RConsultaContratos } from '../../contratos/ConsultaContratos';
import { toast } from 'react-toastify';

class ConsultaCantidadContratada extends Component {
  state = {
    fechaInicio: '',
    fechaFin: '',
    contrato: null,
    modalContratos: false,
    listadoEntidad: [],
  };

  /**
   * @method
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    const { contrato, fechaFin, fechaInicio } = this.state;
    if (contrato === null) {
      return { respuesta: false, mensaje: 'Debe seleccionar un contrato' };
    }
    if (fechaInicio === '') {
      return { respuesta: false, mensaje: 'Debe seleccionar una fecha inicio' };
    }
    if (fechaFin === '') {
      return { respuesta: false, mensaje: 'Debe seleccionar una fecha fin' };
    }
    return { respuesta: true };
  };

  /**
   * @method
   * Método encargado de ejecutar la peticion de consulta
   */
  onBuscar = () => {
    const { contrato, fechaInicio, fechaFin } = this.state;
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      toast.error(validacion.mensaje);
      return;
    }
    const parametros = {
      idContrato: contrato.cntIderegistro,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin
    };
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_CANTIDAD_CONTRATADA.CONSULTAR, parametros)
      .then(respuesta => {
        this.setState({ listadoEntidad: respuesta.data.datos });
      });
  };

  /**
   * @method
   * Método encargado de obtener las columnas del componente Tabla
   * @returns {Object}
   */
  obtenerColumnas = () => {
    return [
      {
        Header: 'Medidores',
        columns: [
          {
            Header: 'Fecha',
            accessor: 'mesuFecha'
          },
          {
            Header: 'Medidor',
            accessor: 'mesuNombre'
          },
          {
            Header: 'Capacidad',
            accessor: 'mesuCapacidadmaxima'
          },
          {
            Header: 'Unidad de Medida',
            accessor: 'uniIdemedida.uniNombre1'
          },

        ]
      }
    ];
  };

  /**
   * @method
   * Método encargado de limpiar la tabla
   */
  limpiarFormulario = () => {
    this.setState({
      contrato: null,
      fechaInicio: '',
      fechaFin: '',
      modalContratos: false,
      listadoEntidad: [],
    });
  };

  /**
   * @method
   * Método encargado de generar los botones para el componente Botonera
   * @returns {Array}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Consultar', callback: this.onBuscar },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * @method
   * Método encargado de cargar los datos de la entidad en la variable contrato
   * @param {Object} entidad Entidad seleccioanda
   */
  onSeleccionarContrato = (entidad) => {
    this.setState({ contrato: { ...entidad }, modalContratos: false });
  };

  /**
   * @method
   * Método encargado de limpiar los contratos seleccionados
   */
  limpiarContrato = () => {
    this.setState({ contrato: null });
  }

  /**
   * @method
   * Método encargado de abrir le modal de consultar
   * @returns {Boolean}
   */
  abrirConsultaContratos = () => {
    this.setState({ modalContratos: true });
  };

  /**
   * @method
   * Método encargado de mostrar el componente selector de contratos
   * @returns {Object}
   */
  renderSelectorContrato = () => {
    const propsInput = {
      placeholder: 'Buscar Contrato',
      className: 'form-control',
      name: 'contrato',
      title: getProp(this.state.contrato, 'cntNumero', ''),
      value: getProp(this.state.contrato, 'cntNumero', ''),
      type: 'text',
      disabled: true
    };
    return (
      <div className='col-4 form-group mt-1'>
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
   * Método encargado de generar el componente Tabla
   * @returns {Component}
   */
  renderTabla = () => {
    if (!Util.validarArreglo(this.state.listadoEntidad)) {
      return <div className='text-center '>Sin resultados</div>;
    }

    return (
      <Tabla
        datos={this.state.listadoEntidad}
        columnas={this.obtenerColumnas()}
      />
    );
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
   * Método encargado de mostrar el formulario principal
   * @param {JSX}
   */
  render() {
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />
        <div className='conf-general row mt-5'>
          {this.renderSelectorContrato()}
          <Fecha
            label='Fecha Inicio'
            name='fechaInicio'
            fecha={this.state.fechaInicio}
            onChange={this.controlarCambio}
          />
          <Fecha
            label='Fecha Fin'
            name='fechaFin'
            fecha={this.state.fechaFin}
            onChange={this.controlarCambio}
          />
        </div>
        <div className='mt-5'>
          {this.renderTabla()}
        </div>
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
      </Fragment>

    );
  }

}

ConsultaCantidadContratada.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
};

ConsultaCantidadContratada.defaultProps = {
  esModal: false
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaCantidadContratada);

export { VistaRedux as RConsultaCantidadContratada };
