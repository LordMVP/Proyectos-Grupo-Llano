import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Tabla, Input, Botonera, VentanaModal, Fecha, Util } from 'appfuture-react';
import RUTAS_API from '../../../global/rutas_api';
import RUTAS_VISTA from '../../../global/rutas_vista';
import { TECLAS } from '../../../global/constantes';
import axios from 'axios';
import { RConsultaContratos } from '../../contratos/ConsultaContratos'
import { limpiarJson } from '../../../global/util_nominaciones';
import { get as getProp } from 'object-path';
class ConsultaPrepago extends Component {

  state = {
    agente: '',
    contrato: null,
    periodoRecaudo: '',
    modalContratos: false,
    listadoEntidad: [],
    estadoConsulta: false,
    recaudoConsultado: null,
    detalles: []
  };

  /**
   * @method
   * Método encargado de generar la botonera
   * @returns {Object}
   */
  obtenerFunciones = () => {
    let funciones = [{ texto: 'Consultar', callback: this.onBuscar }];
    funciones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    return funciones;
  };

  /**
   * @method
   * Método encargado de generar los botones de editar y seleccionar del componente Tabla
   * @param {Object} props Propiedades del componente Tabla
   * @param {Component} contexto Contexto del componente ConsultaMedidorSuministro
   * @returns {Object}
   */
  renderCeldaAcciones = (props, contexto) => {
    const iconoAccion = 'fa-check';
    const tituloAccion = 'Seleccionar';
    const funcion = contexto.seleccionarEntidad;
    return (
      <span className='consulta-tramos__link-accion'>
        <a
          href='#' className={`fa ${iconoAccion}`}
          onClick={(evento) => {
            Util.detenerEvento(evento);
            funcion.call(contexto, props.row._original);
          }}>
          {tituloAccion}
        </a>
      </span>
    );
  }

  /**
   * @method
   * Método encargado de ejecutar una acción cuando se seleccione un recaudo
   * @param {Object} entidad Recaudo Seleccionado
   */
  seleccionarEntidad = (entidad) => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PAGO_PREPAGO.CONSULTAR_DETALLES, { idRecaudo: entidad.rccIderegistro })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({
            estadoConsulta: true,
            recaudoConsultado: entidad,
            detalles: respuesta.data.datos.listaDetalles
          });
        }
      })
  }

  /**
   * @method
   * Método encargado de limpiar el formulario
   */
  limpiarFormulario = () => {
    this.setState({
      agente: '',
      contrato: null,
      periodoRecaudo: '',
      modalContratos: false,
      listadoEntidad: [],
      estadoConsulta: false,
      recaudoConsultado: null,
      detalles: []
    });
  };

  /**
   * @method
   * Método encargado de generar los botones del formulario
   * @returns {Object}
   */
  obtenerFunciones = () => {
    let funciones = [{ texto: 'Consultar', callback: this.onBuscar }];
    if (this.props.esModal && this.props.seleccionMultiple) {
      funciones.push({ texto: 'Seleccionar Datos', callback: this.onSeleccionarEntidades });
    }
    funciones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    return funciones;
  };

  /**
   * @method
   * Metodo encargado de realizar la consulta
   */
  onBuscar = () => {
    const { contrato, periodoRecaudo, agente } = this.state;
    axios.post(
      RUTAS_API.PARAMETRIZACION.GESTION_PAGO_PREPAGO.CONSULTAR_RECAUDOS,
      {
        contrato: contrato == null ? contrato : limpiarJson(contrato),
        tercero: agente,
        periodo: periodoRecaudo,
      })
      .then(respuesta => {
        this.setState({ listadoEntidad: respuesta.data.datos });
      });
  };

  /**
  * Método encargado de obtener las columnas del componente Tabla
  * @returns {Object}
  */
  obtenerColumnas = () => {
    const contexto = this;
    return [
      {
        Header: 'Prepagos',
        columns: [
          {
            Header: 'Acción',
            accessor: 'ptsaIderegistro',
            Cell: (props) => contexto.renderCeldaAcciones(props, contexto)
          },
          {
            Header: 'Número Recaudo',
            accessor: 'rccNumero'
          },
          {
            Header: 'Número Contrato',
            accessor: 'contratos',
            Cell: (props) => this.obtenerContratos(props, this)
          },
          {
            Header: 'Agente',
            accessor: 'terIderegistro.terNomcompleto'
          },
          {
            Header: 'Fecha RecaUdo',
            accessor: 'rccFecharecaudo',
          },
          {
            Header: 'Valor',
            accessor: 'rccValor'
          },
        ]
      }
    ];
  };

  /**
   * Método encargado de obtener los nombres de los puntos que pertenecen a esa provisión
   * @param {Object} props Propiedades del componente Tabla
   */
  obtenerContratos = (props) => {
    let detalles = props.row._original.info;
    detalles = JSON.parse(detalles);
    return detalles.map(detalle => {
      return detalle.cnt_numero;
    }).join(',');
  };

  /**
   * @method
   * Método encargado de controlar los cambios hechos por el usuario
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  /**
   * @method
   * Método encargado de setear la entidad seleccionada
   * @param {Object} entidad Entidad seleccionada
   */
  onSeleccionarContrato = (entidad) => {
    this.setState({
      modalContratos: false,
      contrato: entidad
    });
  }

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
   * Método encargado de mostrar la tabla detalle
   * @returns {JSX}
   */
  renderTablaDetalle = () => {
    return (
      <Fragment>
        <table id='puntosSalida' className='table-normal table table-condensed table-bordered text-center'>
          <thead className='bg-dark text-white'>
            <tr>
              <th colSpan='7'>Detalles </th>
            </tr>
            <tr>
              <th>Número de Contrato </th>
              <th>Valor del Prepago </th>
              <th>Fecha Inicio Cobertura </th>
              <th>Fecha Fin Cobertura </th>
              <th>Fecha de Aplicación </th>
              <th>Otros Pagos </th>
              <th>Saldo </th>
            </tr>
          </thead>
          <tbody>
            {this.state.detalles.map((dato, index) => {
              return (
                <tr key={dato.drccIderegistro}>
                  <td>{dato.cntIdecontrato.cntNumero}</td>
                  <td>{dato.cntgIderegistro.cntgVlrgarantia}</td>
                  <td>{dato.cntgIderegistro.cntgFechainicio}</td>
                  <td>{dato.cntgIderegistro.cntgFechafin}</td>
                  <td>{dato.drccFecha}</td>
                  <td>{(dato.info.valorPagado - dato.drccValor)}</td>
                  <td>{(dato.info.valorGarantia - dato.info.valorPagado)}</td>
                </tr>
              )
            }
            )}
          </tbody>
        </table>
      </Fragment>
    );
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
      title: getProp(contrato, 'cntNumero', ''),
      value: getProp(contrato, 'cntNumero', ''),
      type: 'text',
      disabled: true
    };
    return (
      <div className='col-4 form-group mt-1'>
        <label>Contrato:</label>
        <div className="input-group mb-3">
          <input {...propsInput} />
          <div className="input-group-prepend">
            <button className="btn-primary input-group-text" title='Limpiar Contrato' onClick={() => { this.setState({ contrato: null }) }}><i className='fa fa-fw fa-trash'></i></button>
            <button className="btn-primary btn-buscador input-group-text" title='Seleccionar contrato' onClick={this.abrirConsultaContratos}><i className='fa fa-fw fa-check-square-o'></i></button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * @method
   * Método encargado de mostrar el encabezado del detalle
   * @returns {JSX}
   */
  renderDetalles = () => {
    return (
      <Fragment>
        <Input
          label='Agente o Tercero:'
          value={getProp(this.state.recaudoConsultado, 'terIderegistro.terNomcompleto')}
          name='agente'
          extra={{ disabled: true, readOnly: true }}
          cols={3}
        />
        <Input
          label='Mes de Servicio:'
          value={getProp(this.state.recaudoConsultado, 'rccPeriodo')}
          name='rccPeriodo'
          extra={{ disabled: true, readOnly: true }}
          cols={3}
        />
        <Input
          label='Número de Recaudo:'
          value={getProp(this.state.recaudoConsultado, 'rccNumero')}
          name='rccNumero'
          extra={{ disabled: true, readOnly: true }}
          cols={3}
        />
        <Input
          label='Valor Recaudo:'
          value={getProp(this.state.recaudoConsultado, 'rccValor')}
          name='rccValor'
          extra={{ disabled: true, readOnly: true }}
          cols={3}
        />
        <Input
          label='Total Aplicado:'
          value={getProp(this.state.recaudoConsultado, 'rccTotaplicado')}
          name='rccTotaplicado'
          extra={{ disabled: true, readOnly: true }}
          cols={3}
        />
        <Input
          label='Saldo:'
          value={getProp(this.state.recaudoConsultado, 'rccVlrsdo')}
          name='rccVlrsdo'
          extra={{ disabled: true, readOnly: true }}
          cols={3}
        />
        <Input
          label='Fecha Recaudo:'
          value={getProp(this.state.recaudoConsultado, 'rccFecharecaudo')}
          name='rccFecharecaudo'
          extra={{ disabled: true, readOnly: true }}
          cols={3}
        />
      </Fragment>
    )
  }

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
   * @method
   * Método encargado de renderizar el componente
   * @returns {JSX}
   */
  render() {
    return (
      <div className='consulta-tramos'>
        <Botonera funciones={this.obtenerFunciones()} />
        {!this.state.estadoConsulta &&
          <Fragment>
            <div className='row mt-5'>
              <Input
                label='Agente:'
                value={this.state.agente}
                onChange={this.controlarCambio}
                name='agente'
              />
              <Fecha
                label='Periodo Recaudo:'
                name='periodoRecaudo'
                sinDia={true}
                fecha={this.state.periodoRecaudo}
                onChange={this.controlarCambio}
              />
              {this.renderSelectorContrato()}
            </div>
            <div className='mt-5'>
              {this.renderTabla()}
            </div>
          </Fragment>
        }
        {this.state.estadoConsulta &&
          <div className='row mt-5'>
            {this.renderDetalles()}
          </div>
        }
        {this.state.estadoConsulta &&
          <div className='mt-5'>
            {this.renderTablaDetalle()}
          </div>
        }
        <VentanaModal
          mostrar={this.state.modalContratos}
          titulo='Seleccionar Contrato'
          cerrarModal={() => this.setState({ modalContratos: false })}>
          <RConsultaContratos
            esModal
            seleccionarEntidad={this.onSeleccionarContrato}
            estadosContrato={['A']}
            inhabilitarEstado={true}
            tipoNegocio={'V'}
            tipoGarantia={'PR'}
          />
        </VentanaModal>
      </div>
    );
  };

}

ConsultaPrepago.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array
};

ConsultaPrepago.defaultProps = {
  esModal: false,
  seleccionMultiple: false,
  entidadesSeleccionadas: []
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaPrepago);

export { VistaRedux as RConsultaPrepago };
