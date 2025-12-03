import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Combo, Botonera, Fecha, Util, Tabla } from 'appfuture-react';
import ConsultaGenerica from '../../../hoc/consultaGenerica/ConsultaGenerica';
import RUTAS_API from '../../../global/rutas_api';
import RUTAS_VISTA from '../../../global/rutas_vista';
import axios from 'axios';
import { TECLAS } from '../../../global/constantes';

class ConsultaEventosEximentes extends Component {

  consultaGenerica = null;
  columnas = [
    {
      Header: 'Eventos Eximentes',
      columns: [
        {
          Header: 'Contrato',
          accessor: 'cntIdecontrato.cntNumero'
        },
        {
          Header: 'Fecha Inicio evento',
          accessor: 'eveFechainicio'
        },
        {
          Header: 'Fecha Fin evento',
          accessor: 'eveFechafin'
        }
      ]
    }
  ];

  state = {
    fechaIniEvento: '',
    fechaFinEvento: '',
    tipoContrato: '',
    contrato: '',
    puntoConsumo: '',
    puntosConsumo: [],
    listaContratos: [],
  };

  /**
   * Método encargado de ejecutar acciones al momento de cargar el componente
   */
  componentDidMount() {
    const peticiones = [
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PUNTOS_CONSUMO.CONSULTAR_PUNTOS_CONSUMO, { criterio: '' }),
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_EVENTO_EXIMENTE.CONSULTAR_CONTRATOS_EVENTO, { criterio: '' })
    ];
    axios.all(peticiones)
      .then(axios.spread((puntosConsumo, contratos) => {
        let datosApp = {
          puntosConsumo: [],
          listaContratos: []
        }
        if (puntosConsumo.data.codigo > 0) {
          datosApp.puntosConsumo = puntosConsumo.data.datos;
        }
        if (contratos.data.codigo > 0) {
          datosApp.listaContratos = contratos.data.datos;
          datosApp.listaContratos.forEach(c => {
            c.titulo = c.cntNumero + ' - ' + c.terIdeagente.terNomcompleto
            return c;
          })
        }
        this.setState({ ...datosApp })
      }));
  }

  /**
   * Método encargado de generar los botones de la interfaz
   * @returns {Object}
   */
  obtenerFunciones = () => {
    let funciones = [{ texto: 'Consultar', callback: this.onBuscar }];
    funciones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    return funciones;
  };

  /**
   * Metodo encargado de realizar la consulta
   * @returns {bool}
   */
  onBuscar = () => {
    const { tipoContrato, contrato, fechaFinEvento, fechaIniEvento, puntoConsumo } = this.state;
    let parametros = {
      idTipoContrato: (tipoContrato == '' || tipoContrato == '-1') ? null : tipoContrato,
      idContrato: (contrato == '') ? null : contrato,
      fechaFin: (fechaFinEvento == '') ? null : fechaFinEvento,
      fechaInicio: (fechaIniEvento == '') ? null : fechaIniEvento,
      idPuntoConsumo: (puntoConsumo == '') ? null : puntoConsumo
    }
    this.consultaGenerica.getWrappedInstance()._buscar(parametros)
  };

  /**
   * Método encargado de limpiar el formulario
   */
  limpiarFormulario = () => {
    this.setState({
      fechaIniEvento: '',
      fechaFinEvento: '',
      tipoContrato: '-1',
      contrato: '',
      puntoConsumo: '',
    });
    this.consultaGenerica.getWrappedInstance()._limpiarFormulario();
  };

  /**
  * Metodo encargado de realizar la consulta cuando se preciona la tecla enter
  * @returns {bool}
  */
  onKeyPress = (evento) => {
    if (evento.charCode === TECLAS.ENTER) {
      this.onBuscar();
    }
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
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <div className='consulta-tramos'>
        <div className='d-flex justify-content-center pt-3'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>
        <div className='row'>
          <Combo
            opciones={this.props.listaTipoContrato}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Tipo de contrato:'
            name='tipoContrato'
            value={this.state.tipoContrato}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={this.state.puntosConsumo}
            propTexto='ptcoNombre'
            propValor='ptcIderegistro'
            label='Puntos de Consumo:'
            name='puntoConsumo'
            value={this.state.puntoConsumo}
            onChange={this.controlarCambio}
          />
          <Fecha
            label='Rango inicial Fecha inicial evento:'
            name='fechaIniEvento'
            fecha={this.state.fechaIniEvento}
            onChange={this.controlarCambio}
          />
          <Fecha
            label='Rango Final Fecha Inicial evento:'
            name='fechaFinEvento'
            fecha={this.state.fechaFinEvento}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={this.state.listaContratos}
            propTexto='titulo'
            propValor='cntIderegistro'
            label='Contrato:'
            name='contrato'
            value={this.state.contrato}
            onChange={this.controlarCambio}
          />
        </div>
        <ConsultaGenerica
          {...this.props}
          idEntidad='eveIderegistro'
          columnas={this.columnas}
          ref={ref => this.consultaGenerica = ref}
          interfazGestion={RUTAS_VISTA.GESTION_EVENTO_EXIMENTE.url}
          rutaConsulta={RUTAS_API.PARAMETRIZACION.GESTION_EVENTO_EXIMENTE.CONSULTAR_EVENTOS_EXIMENTES}
        />
      </div>
    );
  }
}

ConsultaEventosEximentes.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  listaTipoContrato: PropTypes.array
};

ConsultaEventosEximentes.defaultProps = {
  esModal: false
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaEventosEximentes);

export { VistaRedux as RConsultaEventosEximentes };
