import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CLASES_UNIDADES } from '../../../../global/constantes';

import { Botonera } from 'appfuture-react';
import RUTAS_API from '../../../../global/rutas_api';

import ConsultaGenerica from '../../../../hoc/consultaGenerica/ConsultaGenerica';

class ConsultaPuntosEntrada extends Component {

  consultaGenerica = null;
  columnas = [
    {
      Header: 'Puntos de Entrada',
      columns: [
        {
          Header: 'Configuración',
          accessor: 'uniNombre1'
        },
        {
          Header: 'Código',
          accessor: 'uniPropiedad.codigo',
        }
      ]
    }
  ];

  /**
   * Método encargado de mostrar los botones del componente Botonera
   * @returns {Array}
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
   * Método encargado de realizar la busqueda
   */
  onBuscar = () => {
    this.consultaGenerica.getWrappedInstance()._buscar({ 'criterio': '', idClase: CLASES_UNIDADES.PUNTO_ENTRADA });
  };

  /**
   * Método encargado de obtener las entidades seleccionadas
   */
  onSeleccionarEntidades = () => {
    this.props.seleccionarEntidades(this.consultaGenerica.getWrappedInstance()._obtenerEntidades());
  };

  /**
   * Método encargado de limpiar los datos del formulario
   */
  limpiarFormulario = () => {
    this.consultaGenerica.getWrappedInstance()._limpiarFormulario();
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

        <ConsultaGenerica
          {...this.props}
          idEntidad='uniIderegistro'
          columnas={this.columnas}
          ref={ref => this.consultaGenerica = ref}
          rutaConsulta={RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD}
          interfazGestion=''
        />

      </div>
    );
  }
}

ConsultaPuntosEntrada.propTypes = {
  history: PropTypes.object,
  esModal: PropTypes.bool,
  seleccionMultiple: PropTypes.bool,
  seleccionarEntidad: PropTypes.func,
  seleccionarEntidades: PropTypes.func,
  entidadesSeleccionadas: PropTypes.array
};

ConsultaPuntosEntrada.defaultProps = {
  esModal: false,
  seleccionMultiple: false,
  entidadesSeleccionadas: []
};

export { ConsultaPuntosEntrada };
