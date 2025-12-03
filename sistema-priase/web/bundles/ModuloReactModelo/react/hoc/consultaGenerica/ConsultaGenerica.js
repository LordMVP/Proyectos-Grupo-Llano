import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import { ocultarProgramaModal } from '../../store/actions/AplicacionAcciones';
import axios from 'axios';
import { Util, Tabla } from 'appfuture-react';

class ConsultaGenerica extends Component {

  _columnas = null;

  constructor(props) {
    super(props);
    this.construirColumnas();
  }
  state = {
    listadoEntidad: [],
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
    if (this.props.seleccionMultiple && this.props.esModal) {
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
        this.setState({ listadoEntidad: respuesta.data.datos });
      });
  };

  _obtenerEntidades() {
    return [...this.state.entidadesSeleccionadas];
  };

  _editarEntidad(entidad) {
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

  render() {
    return (
      <div className='mt-5'>
        {this._renderTabla()}
      </div>
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
