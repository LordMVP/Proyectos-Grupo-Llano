import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import ConsultaGenerica from '../../../hoc/consultaGenerica/ConsultaGenerica';
import RUTAS_API from '../../../global/rutas_api';
import RUTAS_VISTA from '../../../global/rutas_vista';
import { Botonera } from 'appfuture-react';
import { Fragment } from 'react';
import { bindActionCreators } from 'redux';


class ConsultaSaldos extends Component {
   consultaGenerica = null;
   state = {};

   /**
    * @method
    * Método encargado de realizar acciones al momento de montar el componente
    */
   componentDidMount() {
      this.onBuscar();
   }

   /**
    * @method
    * Método encargado de ejecutar la peticion de consulta
    */
   onBuscar = () => {
      this.consultaGenerica.getWrappedInstance()._buscar({ idTercero: this.props.idTercero });
   };

   columnas = [
      {
         Header: 'Saldos',
         columns: [
            {
               Header: 'Fecha',
               accessor: 'rccFecharecaudo'
            },
            {
               Header: 'Valor Ingresado',
               accessor: 'rccValor'
            },
            {
               Header: 'Valor Aplicado',
               accessor: 'rccTotaplicado',
            },
            {
               Header: 'Saldo',
               accessor: 'rccVlrsdo',
            },
         ]
      }
   ];

   /**
    * @method
    * Método encargado de limpiar la tabla
    */
   limpiarFormulario = () => {
      this.consultaGenerica.getWrappedInstance()._limpiarFormulario();
   };

   /**
    * Método encargado de obtener los datos seleccionados
    */
   onSeleccionarEntidades = () => {
      this.props.seleccionarEntidades(this.consultaGenerica.getWrappedInstance()._obtenerEntidades());
   };

   /**
    * @method
    * Método encargado de generar los botones para el componente Botonera
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
    * @method
    * Método encargado de mostrar el formulario principal
    * @param {JSX}
    */
   render() {
      return (
         <Fragment>
            <Botonera funciones={this.obtenerFunciones()} />
            <ConsultaGenerica
               {...this.props}
               idEntidad='rccIderegistro'
               columnas={this.columnas}
               ref={ref => this.consultaGenerica = ref}
               interfazGestion={RUTAS_VISTA.GESTION_LIQUIDACION_FACTURAS_TRANSPORTE_KPC.url}
               rutaConsulta={RUTAS_API.PARAMETRIZACION.GESTION_LIQUIDACION_FACTURAS_TRANSPORTE_KPC.CONSULTAR_SALDOS}
            />
         </Fragment>
      );
   }

}

ConsultaSaldos.propTypes = {
   history: PropTypes.object,
   esModal: PropTypes.bool,
   seleccionarEntidad: PropTypes.func,
   seleccionMultiple: PropTypes.bool,
   seleccionarEntidades: PropTypes.func,
   entidadesSeleccionadas: PropTypes.array,
};

ConsultaSaldos.defaultProps = {
   esModal: false
};

const mapStateToProps = state => {
   return {};
};

const mapDispatchToProps = dispatch => {
   return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaSaldos);

export { VistaRedux as RConsultaSaldos };
