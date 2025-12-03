import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { Input, Botonera, TextoNumerico } from 'appfuture-react';
import RUTAS_API from '../../../global/rutas_api';
import RUTAS_VISTA from '../../../global/rutas_vista';
import { TECLAS } from '../../../global/constantes';
import './GestionContactos.scss';
import ConsultaGenerica from '../../../hoc/consultaGenerica/ConsultaGenerica';

const TIPOS_FILTRO = {
  CONTACTO: 'C',
  SUSCRIPCION: 'S',
  TERCERO: 'T'
};

class ConsultaContactos extends Component {

  consultaGenerica = null;
  columnas = [
    {
      Header: 'Consulta Contactos',
      columns: [
        {
          Header: 'Documento',
          accessor: 'terDocumento'
        },
        {
          Header: 'Nombre contacto',
          accessor: 'terNomcompleto'
        },
        {
          Header: 'Fecha Nacimiento',
          accessor: 'terFecnacimiento'
        },
        {
          Header: 'Fecha Creacion',
          accessor: 'conFechaCreacion'
        },
        {
          Header: 'Origen',
          accessor: 'conOrigenDato'
        }, 
        {
          Header: 'Celular',
          accessor: 'terTelcelular'
        },
        {
          Header: 'Codigo Anterior',
          accessor: 'dsusPcodigo'
        },
      ]
    }
  ];

  state = {
    criterio: '',
    documento: '',
    idSuscripcion: '',
    nombre: '',
    pcodigo: '',
    tipo_filtro: TIPOS_FILTRO.CONTACTO
  };

  obtenerFunciones = () => {
    let funciones = [{ texto: 'Consultar', callback: this.onBuscar }];
    if (this.props.esModal && this.props.seleccionMultiple) {
      funciones.push({ texto: 'Seleccionar Datos', callback: this.onSeleccionarEntidades });
    }
    funciones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    return funciones;
  };

  onBuscar = () => {
    const { documento, nombre, idSuscripcion, pcodigo } = this.state;
    this.consultaGenerica.getWrappedInstance()._buscar(
      {
        "terDocumento": (documento) ? documento : '',
        "terNomcompleto": (nombre) ? nombre : null,
        "dsusIderegistr": (idSuscripcion) ? idSuscripcion : null,
        "dsusPcodigo": (pcodigo) ? pcodigo : null,
      }
    );
  };

  onSeleccionarEntidades = () => {
    this.props.seleccionarEntidades(this.consultaGenerica.getWrappedInstance()._obtenerEntidades());
  };

  limpiarFormulario = () => {
    this.setState({
      criterio: '',
      documento: '',
      idSuscripcion: '',
      nombre: '',
      pcodigo: '',
    });
    this.consultaGenerica.getWrappedInstance()._limpiarFormulario();
  };

  // onCriterioChange = (event) => {
  //   this.setState({ criterio: event.target.value });
  // };


  /**
   * Método encargado de controlar el cambio del valor de las variables.
   * @param {Event} evento Evento ejecutado en el control de usuario.
   */
  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  getUrlConsulta = () => {
    if (this.state.tipo_filtro === TIPOS_FILTRO.CONTACTO) {
      return RUTAS_API.GESTION_CONTACTOS.CONSULTA_CONTACTOS;
    }
    if (this.state.tipo_filtro === TIPOS_FILTRO.TERCERO) {
      return RUTAS_API.GESTION_CONTACTOS.CONSULTA_TERCERO;
    }
    return RUTAS_API.GESTION_CONTACTOS.CONSULTA_SUSCRIPCION_CONTACTOS;
  };

  render() {
    return (
      <div className='consulta-tramos'>
        <div className='d-flex justify-content-center pt-3'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>
        <div className='row'>
          <div className='col-12 pt-3 form-group'>
            <label className='m-t28'>
              <input type="radio" name="tipo_filtro"
                value={TIPOS_FILTRO.CONTACTO}
                checked={this.state.tipo_filtro == TIPOS_FILTRO.CONTACTO}
                onChange={this.controlarCambio} /> Consultar x Contacto
              </label>
            <label className='m-t28 m-l-15'>
              <input type="radio" name="tipo_filtro"
                value={TIPOS_FILTRO.SUSCRIPCION}
                checked={this.state.tipo_filtro == TIPOS_FILTRO.SUSCRIPCION}
                onChange={this.controlarCambio} /> Consultar x Suscripción
              </label>
            {/* <label className='m-t28 m-l-15'>
              <input type="radio" name="tipo_filtro"
                value={TIPOS_FILTRO.TERCERO}
                checked={this.state.tipo_filtro == TIPOS_FILTRO.TERCERO}
                onChange={this.controlarCambio} /> Crear Contacto
              </label> */}
          </div>

          {this.state.tipo_filtro == TIPOS_FILTRO.CONTACTO
            && (
              <Fragment>
                <Input
                  label='Documento Contacto:'
                  onChange={this.controlarCambio}
                  value={this.state.documento}
                  name='documento'
                />

                <Input
                  label='Nombre Contacto:'
                  value={this.state.nombre}
                  onChange={this.controlarCambio}
                  name='nombre'
                />
              </Fragment>
            )}

          {this.state.tipo_filtro == TIPOS_FILTRO.SUSCRIPCION
            && (
              <Fragment>
                <Input
                  label='Documento Suscriptor:'
                  onChange={this.controlarCambio}
                  value={this.state.documento}
                  name='documento'
                />

                <Input
                  label='Nombre Suscriptor:'
                  value={this.state.nombre}
                  onChange={this.controlarCambio}
                  name='nombre'
                />
                <TextoNumerico
                  aceptaDecimales={false}
                  aceptaNegativos={false}
                  label='Id Suscripción:'
                  cols={4}
                  value={this.state.idSuscripcion}
                  onChange={this.controlarCambio}
                  name='idSuscripcion'
                />

                <Input
                  label='Codigo Anterior:'
                  onChange={this.controlarCambio}
                  value={this.state.pcodigo}
                  name='pcodigo'
                />
              </Fragment>
            )}

          {this.state.tipo_filtro == TIPOS_FILTRO.TERCERO
            && (
              <Fragment>
                <TextoNumerico
                  aceptaDecimales={false}
                  aceptaNegativos={false}
                  label='Documento Tercero:'
                  onChange={this.controlarCambio}
                  cols={4}
                  value={this.state.documento}
                  name='documento'
                />

                <Input
                  label='Nombre Tercero:'
                  value={this.state.nombre}
                  onChange={this.controlarCambio}
                  name='nombre'
                />
              </Fragment>
            )}

        </div>
        <ConsultaGenerica
          {...this.props}
          idEntidad='contIderegistro'
          extra={this.state.tipo_filtro}
          columnas={this.columnas}
          ref={ref => this.consultaGenerica = ref}
          interfazGestion={RUTAS_VISTA.GESTION_CONTACTOS.url}
          rutaConsulta={this.getUrlConsulta}
        />

      </div>
    );
  }
}

ConsultaContactos.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array
};

ConsultaContactos.defaultProps = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaContactos);

export { VistaRedux as RConsultaContactos };
