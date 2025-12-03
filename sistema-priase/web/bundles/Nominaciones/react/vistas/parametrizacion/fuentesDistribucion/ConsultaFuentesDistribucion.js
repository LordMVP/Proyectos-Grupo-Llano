import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { get as getProp } from 'object-path';
import { Input, Botonera } from 'appfuture-react';

import RUTAS_API from '../../../global/rutas_api';
import RUTAS_VISTA from '../../../global/rutas_vista';
import { TECLAS } from '../../../global/constantes';
import ConsultaGenerica from '../../../hoc/consultaGenerica/ConsultaGenerica';

class ConsultaFuentesDistribucion extends Component {

   consultaGenerica = null;
   columnas = [
      {
         Header: 'Fuentes de Distribución',
         columns: [
            {
               Header: 'Nombre',
               accessor: 'uniNombre1'
            },
            {
               Header: 'Tipo Fuente',
               accessor: 'uniPropiedad',
               Cell: (props) => this.obtenerTipo(props, this)
            },
            {
               Header: 'Código Gestor',
               accessor: 'uniPropiedad',
               Cell: (props) => this.obtenerCodGes(props, this)
            }
         ]
      }
   ];

   state = { criterio: '' };

   /**
    * Método encargado de obtener el tipo de la fuente de distribución
    * @param {Object} props Propiedades del componente tabla
    */
   obtenerTipo = (props) => {
      const tipo = getProp(props.row._original.uniPropiedad, 'tipo', '');
      if (tipo === '') {
         return '';
      }
      return (tipo == 'T') ? 'Transporte' : 'Suministro';
   };

   /**
    * Método encargado de obtener el codigo gestor de la fuente de distribución
    * @param {Object} props Propiedades del componente tabla
    */
   obtenerCodGes = (props) => {
      const tipo = getProp(props.row._original.uniPropiedad, 'codigo', '');
      if (tipo === '') {
         return '';
      }
      return (tipo) ? tipo : '';
   };

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
      this.consultaGenerica.getWrappedInstance()._buscar({ 'criterio': this.state.criterio.trim() });
   };

   /**
    * Método encargado de obtener los datos seleccionados
    */
   onSeleccionarEntidades = () => {
      this.props.seleccionarEntidades(this.consultaGenerica._obtenerEntidades());
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

            <Input
               cols={12}
               label='Buscar Fuentes de Distribución:'
               onChange={this.onCriterioChange}
               value={this.state.criterio}
               className='row mt-3'
               extra={{ onKeyPress: this.onKeyPress }}
            />

            <ConsultaGenerica
               {...this.props}
               idEntidad='uniIderegistro'
               columnas={this.columnas}
               ref={ref => this.consultaGenerica = ref}
               interfazGestion={RUTAS_VISTA.GESTION_FUENTES_DISTRIBUCION.url}
               rutaConsulta={RUTAS_API.CONFIGURACION.FUENTES_DISTRIBUCION.CONSULTAR_FUENTES_DISTRIBUCION}
            />
         </div>
      );
   };
}

ConsultaFuentesDistribucion.propTypes = {
   history: PropTypes.object,
   esModal: PropTypes.bool,
   seleccionMultiple: PropTypes.bool,
   seleccionarEntidad: PropTypes.func,
   seleccionarEntidades: PropTypes.func,
   entidadesSeleccionadas: PropTypes.array
};

ConsultaFuentesDistribucion.defaultProps = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaFuentesDistribucion);

export { VistaRedux as RConsultaFuentesDistribucion };
