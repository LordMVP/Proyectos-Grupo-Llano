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


class ConsultaSuscripciones extends Component {

  consultaGenerica = null;
  columnas = [
    {
      Header: 'Consulta Suscripciones',
      columns: [
        {
          Header: 'ide Suscripcion',
          accessor: 'dsusIderegistr'
        },
        {
          Header: 'Documento',
          accessor: 'terDocumento'
        },
        {
          Header: 'Nombre contacto',
          accessor: 'terNomcompleto'
        },
        {
          Header: 'Condigo Anterior',
          accessor: 'dsusCodigoanterior'
        },
        {
          Header: 'Direccion',
          accessor: 'dsusDireccion'
        }
      ]
    }
  ];

  state = {
    criterio: '',
    documento: '',
    idSuscripcion: '',
    nombre: '',
    pcodigo: '',
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
      criterio: '', documento: '',
      idSuscripcion: '',
      nombre: '',
      pcodigo: ''
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
    //ojo cambiar ruta servicio
    return RUTAS_API.GESTION_CONTACTOS.CONSULTA_SUSCRICIONES;
  };

  render() {
    return (
      <div className='consulta-tramos'>
        <div className='d-flex justify-content-center pt-3'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>
        <div className='row'>
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

        </div>
        <ConsultaGenerica
          {...this.props}
          idEntidad='dsusIderegistro'
          columnas={this.columnas}
          ref={ref => this.consultaGenerica = ref}
          interfazGestion={RUTAS_VISTA.GESTION_CONTACTOS.url}
          rutaConsulta={this.getUrlConsulta}
        />

      </div>
    );
  }
}

ConsultaSuscripciones.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array
};

ConsultaSuscripciones.defaultProps = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaSuscripciones);

export { VistaRedux as RConsultaSuscripciones };
