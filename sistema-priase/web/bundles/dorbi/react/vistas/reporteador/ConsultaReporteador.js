import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { Input, Botonera } from 'appfuture-react';
import RUTAS_API from '../../global/rutas_api';
import RUTAS_VISTA from '../../global/rutas_vista';
import { TECLAS } from '../../global/constantes';
import ConsultaGenerica from '../../hoc/consultaGenerica/ConsultaGenerica';

class ConsultaReporteador extends Component {

  consultaGenerica = null;
  columnas = [
    {
      Header: 'Consulta Reporteador',
      columns: [
        {
          Header: 'XXXXXX',
          accessor: 'xxxxxx'
        },
        {
          Header: 'XXXXXX',
          accessor: 'xxxxxx'
        }
      ]
    }
  ];
  state = { criterio: '' };

  obtenerFunciones = () => {
    let funciones = [{ texto: 'Consultar', callback: this.onBuscar }];
    if (this.props.esModal && this.props.seleccionMultiple) {
      funciones.push({ texto: 'Seleccionar Datos', callback: this.onSeleccionarEntidades });
    }
    funciones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    return funciones;
  };

  onBuscar = () => {
    this.consultaGenerica.getWrappedInstance()._buscar({ 'criterio': this.state.criterio });
  };

  onSeleccionarEntidades = () => {
    this.props.seleccionarEntidades(this.consultaGenerica.getWrappedInstance()._obtenerEntidades());
  };

  limpiarFormulario = () => {
    this.setState({ criterio: '' });
    this.consultaGenerica.getWrappedInstance()._limpiarFormulario();
  };

  onCriterioChange = (event) => {
    this.setState({ criterio: event.target.value });
  };

  onKeyPress = (evento) => {
    if (evento.charCode === TECLAS.ENTER) {
      this.onBuscar();
    }
  };

  render() {
    return (
      <div className='consulta-tramos'>
        <div className='d-flex justify-content-center pt-3'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>

        <Input
          cols={12}
          label='Buscar tramos por Código Gestor o Tramo:'
          onChange={this.onCriterioChange}
          value={this.state.criterio}
          className='row mt-3'
          extra={{ onKeyPress: this.onKeyPress }}
        />

        <ConsultaGenerica
          {...this.props}
          idEntidad='facIderegistro'
          columnas={this.columnas}
          ref={ref => this.consultaGenerica = ref}
          interfazGestion={RUTAS_VISTA.X}
          rutaConsulta={RUTAS_API.X}
        />

      </div>
    );
  }
}

ConsultaReporteador.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array
};

ConsultaReporteador.defaultProps = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaReporteador);

export { VistaRedux as RConsultaReporteador };
