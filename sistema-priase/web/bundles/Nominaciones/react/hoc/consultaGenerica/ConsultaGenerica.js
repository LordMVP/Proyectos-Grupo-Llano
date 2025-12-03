import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import { ocultarProgramaModal } from '../../store/actions/AplicacionAcciones';
import axios from 'axios';
import { Util, Tabla } from 'appfuture-react';
import { parsearJSONUniPropiedad } from '../../global/util_nominaciones';

class ConsultaGenerica extends Component {

  _columnas = null;

  constructor(props) {
    super(props);
    this.construirColumnas();
  }

  state = {
    listadoEntidad: [],
    listadoSeleccionados: [],
    entidadesSeleccionadas: this.props.entidadesSeleccionadas
  };

  construirColumnas = () => {
    const contexto = this;
    this._columnas = this.props.columnas;
    this._columnas[0].columns.splice(0, 0, {
      Header: 'Acción',
      accessor: this.idEntidad,
      Cell: (props) => contexto.renderCeldaAcciones.call(contexto, props)
    });
  };

  renderCeldaAcciones = (props) => {
    const entidad = props.row._original;
    const contexto = this;
    // Se verifica si el programa se abre como modal y de selección múltiple
    if (this.props.seleccionMultiple) {
      return (
        <span className='consulta-tramos__link-accion'>
          <label>
            <input
              type='checkbox'
              checked={this.validarEntidadSeleccionada(entidad)}
              onChange={
                (evento) => contexto.onCheckEntidad.call(contexto, evento, entidad)
              }
            />
            <span className='ml-1'>Seleccionar</span>
          </label>
        </span>
      );
    }

    // Se ejecuta en caso de que el programa no sea de seleccion multiple
    let iconoAccion = 'fa-edit';
    let tituloAccion = 'Editar';
    let funcion = this._editarEntidad;

    if (this.props.esModal) {
      iconoAccion = 'fa-check';
      tituloAccion = 'Seleccionar';
      funcion = (entidad) => {
        this.props.seleccionarEntidad(entidad);
        this.props.ocultarProgramaModal();
      }
    }

    return (
      <span className='consulta-tramos__link-accion'>
        <a
          href='#' className={`fa ${iconoAccion}`}
          onClick={(evento) => {
            Util.detenerEvento(evento);
            funcion.call(contexto, entidad);
          }}>
          {tituloAccion}
        </a>
      </span>
    );
  };

  onCheckEntidad = (evento, entidad) => {
    if (evento.currentTarget.checked) {
      // Agregar Entidad
      const nuevasEntidades = [...this.state.entidadesSeleccionadas, entidad];
      this.setState({ entidadesSeleccionadas: nuevasEntidades });
      return;
    }

    // Remover Entidad
    let nuevasEntidades = [...this.state.entidadesSeleccionadas];
    const index = nuevasEntidades.findIndex(a => a[this.props.idEntidad] === entidad[this.props.idEntidad]);
    nuevasEntidades.splice(index, 1);
    this.setState({ entidadesSeleccionadas: [...nuevasEntidades] });
  };

  validarEntidadSeleccionada = (entidad) => {
    const index = this.state.entidadesSeleccionadas.findIndex(a => a[this.props.idEntidad] === entidad[this.props.idEntidad]);
    return index !== -1;
  };

  _buscar(params) {
    axios.post(this.props.rutaConsulta, params)
      .then(respuesta => {
        this.setState({ listadoEntidad: parsearJSONUniPropiedad(respuesta.data.datos) });
      });
  };

  /**
   * Método encargado de redireccionar a la interfaz de origen.
   */
  _cancelar() {
    this.props.history.push({
      pathname: this.props.interfazGestion,
    });
  };

  _obtenerEntidades() {
    return [...this.state.entidadesSeleccionadas];
  };

  _editarEntidad(entidad) {
    if (location.href.endsWith(this.props.interfazGestion)) {
      (typeof this.props.seleccionarEntidad == 'function') && this.props.seleccionarEntidad(entidad);
    }
    this.props.history.push({
      pathname: this.props.interfazGestion,
      state: {
        entidadEditar: entidad
      }
    });
  };

  _limpiarFormulario() {
    this.setState({
      listadoEntidad: [],
      entidadesSeleccionadas: []
    });
  };

  _renderTabla() {
    if (!Util.validarArreglo(this.state.listadoEntidad)) {
      return <div className='text-center'>Sin resultados</div>;
    }

    return (
      <Tabla
        datos={this.state.listadoEntidad}
        columnas={this._columnas}
      />
    );
  };

  _renderTablaSeleccionados() {
    const columnas = [...this._columnas];
    columnas[0].Header = 'Registros seleccionados';
    return (
      <Tabla
        datos={this.state.entidadesSeleccionadas}
        columnas={columnas}
      />
    )
  };

  render() {
    return (
      <Fragment>
        <div className='mt-5'>
          {this._renderTabla()}
        </div>
        <div className='mt-5'>
          {this.props.mostrarTablaSeleccionados == true && Util.validarArreglo(this.state.entidadesSeleccionadas) && this._renderTablaSeleccionados()}
        </div>
      </Fragment>
    );
  }

}

ConsultaGenerica.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array,
  idEntidad: PropTypes.string.isRequired,
  columnas: PropTypes.array.isRequired,
  interfazGestion: PropTypes.string.isRequired,
  rutaConsulta: PropTypes.string.isRequired,
  ocultarProgramaModal: PropTypes.func
};

ConsultaGenerica.defaultProps = {
  esModal: false,
  seleccionMultiple: false,
  entidadesSeleccionadas: [],
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ ocultarProgramaModal }, dispatch);
};

export default connect(null, mapDispatchToProps, null, { withRef: true })(ConsultaGenerica);
