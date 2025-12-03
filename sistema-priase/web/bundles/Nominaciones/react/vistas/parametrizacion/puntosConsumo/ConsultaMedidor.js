import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Util, Input, Botonera, Tabla } from 'appfuture-react';
import ConsultaGenerica from '../../../hoc/consultaGenerica/ConsultaGenerica';
import RUTAS_API from '../../../global/rutas_api';
import RUTAS_VISTA from '../../../global/rutas_vista';
import { TECLAS } from '../../../global/constantes';
import { toast } from 'react-toastify';
class ConsultaMedidor extends Component {

  consultaGenerica = null;
  columnas = [
    {
      Header: 'Medidores',
      columns: [
        {
          Header: 'Nombre',
          accessor: 'mesuNombre'
        }
      ]
    }
  ];
  state = { criterio: '' };

  /**
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
   * Metodo encargado de realizar la consulta
   * @returns {bool}
   */
  onBuscar = () => {
    const { listaContratos, listaTipoDeConsumo, idTipoConsumo } = this.props;
    const idsContratos = listaContratos.map(c => {
      return c.cntIderegistro;
    });
    const tipoConsumoSeleccionado = listaTipoDeConsumo.find(tc => tc.uniIderegistro == idTipoConsumo);
    if (tipoConsumoSeleccionado == null) {
      const opciones = {
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      };
      toast.error('El tipo de consumo no se encuentra parametrizado', opciones);
      return;
    }
    const parametros = {
      parametro1: idsContratos,
      parametro2: tipoConsumoSeleccionado.listaPropiedades.tipoconsumo
    };
    this.consultaGenerica.getWrappedInstance()._buscar(parametros);
  };

  /**
   * Método encargado de obtener los datos seleccionados
   */
  onSeleccionarEntidades = () => {
    this.props.seleccionarEntidades(this.consultaGenerica.getWrappedInstance()._obtenerEntidades());
  };

  /**
   * Método encargado de limpiar el formulario
   */
  limpiarFormulario = () => {
    this.setState({ criterio: '' });
    this.consultaGenerica.getWrappedInstance()._limpiarFormulario();
  };

  /**
   * Método encargado de controlar el cambio del criterio
   * @param {Event} event El evento que se ejecuta en el control de usuario.
   */
  onCriterioChange = (event) => {
    this.setState({ criterio: event.target.value });
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
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <div className='consulta-tramos'>
        <div className='d-flex justify-content-center pt-3'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>

        {this.props.sinCriterio != true && (
          <Input
            cols={12}
            label='Buscar por nombre del medidor:'
            onChange={this.onCriterioChange}
            value={this.state.criterio}
            className='row mt-3'
            extra={{ onKeyPress: this.onKeyPress }}
          />
        )}

        <ConsultaGenerica
          {...this.props}
          idEntidad='mesuIderegistro'
          columnas={this.columnas}
          ref={ref => this.consultaGenerica = ref}
          interfazGestion={RUTAS_VISTA.GESTION_PUNTOS_CONSUMO.url}
          rutaConsulta={RUTAS_API.PARAMETRIZACION.GESTION_PUNTOS_CONSUMO.CONSULTAR_MEDIDOR}
        />

      </div>
    );
  };

}

ConsultaMedidor.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array,
  mostrarAlerta: PropTypes.func,
  listaContratos: PropTypes.array,
  listaTipoDeConsumo: PropTypes.array,
  idTipoConsumo: PropTypes.number
};

ConsultaMedidor.defaultProps = {
  listaContratos: [],
  esModal: false,
  seleccionMultiple: false,
  entidadesSeleccionadas: [],
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaMedidor);

export { VistaRedux as RConsultaMedidor };
