import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, TextoNumerico } from 'appfuture-react';
import { limpiarDatosHistorico } from '../../../../global/util_nominaciones';
import axios from 'axios';

import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import RUTAS_VISTA from '../../../../global/rutas_vista';
import { CLASES_UNIDADES } from '../../../../global/constantes';
import GestionDocumentos from '../../cambioEstadoContrato/GestionEstadoContrato/GestionDocumentos';

const ESTADO_FINALIZADO = 'F';
const ESTADO_LIQUIDADO = 'L';

const periodosCantidadContratada = [
   { id: 'D', texto: 'Diaria' },
   { id: 'S', texto: 'Semanal' },
   { id: 'M', texto: 'Mensual' },
   { id: 'A', texto: 'Anual' }
];

/**
 * Si el contrato es tipo cliente se habilita generar acta y se debe adjuntar obligatorio.
 * Si es proveedor se adjunta, es obligatorio.
 */

class GestionLiquidarContrato extends Component {

   state = {
      mostrarModalConsulta: false,
      contrato: null,
      listaEstados: [],
      adjuntos: [],
      listaTiposDocumento: [],
      listaUnidadMedida: []
   };

   /**
    * Se ejecutará cuando se cargue la interfaz/componente.
    */
   componentDidMount() {
      const { state } = this.props.history && this.props.history.location;
      if (state && state.entidadEditar) {
         this.cargarDatos(state.entidadEditar);
      }
      this.consultarListaEstados((listaEstados, listaTiposDocumento, listaUnidad) => {
         this.setState({
            listaEstados: listaEstados.data.datos,
            listaTiposDocumento: listaTiposDocumento.data.datos,
            listaUnidadMedida: listaUnidad.data.datos
         });
      });
   }

   /**
   * Consulta la lista de los estados...
   */
   consultarListaEstados = (callback) => {
      const peticiones = [
         axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_ESTADOS, { criterio: '', idClase: CLASES_UNIDADES.ESTADOS_CONTRATO }),
         axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { criterio: '', idClase: CLASES_UNIDADES.TIPO_ARCHIVO_DOCUMENTO }),
         axios.post(RUTAS_API.PARAMETRIZACION.UNIDADES_MEDIDA.CONSULTAR_UNIDAD, { criterio: '', idClase: CLASES_UNIDADES.UNIDAD_MEDIDA }),
      ];

      axios.all(peticiones)
         .then(
            axios.spread((listaEstados, listaTiposDocumento, listaUnidadMedida) => {
               callback(listaEstados, listaTiposDocumento, listaUnidadMedida);
            })
         );

   };

   /**
    * Limpiará el formulario seteando los valores del state.
    */
   limpiarFormulario = (evento) => {
      this.setState({
         contrato: null,
         estadoContrato: null,
      });
      limpiarDatosHistorico('gestion_liquidar_contrato',this.props);
   };

   /**
    * Obtiene el id específico del estado contrato finalizado.
    * @return {number}
    */
   obtenerIdEstado = (codigoEstado) => {
      const { listaEstados } = this.state;

      if (!Util.validarArreglo(listaEstados)) {
         this.props.mostrarAlerta('Error de configuración', 'No hay estados configurados.');
         return -1;
      }
      const estado = listaEstados.filter(e => (JSON.parse(e.uniPropiedad).estado == codigoEstado));
      if (!Util.validarArreglo(estado)) {
         return 0;
      }
      return estado[0].uniIderegistro;
   };

   /**
    * Obtiene los botones de la interfaz.
    * @return {array}
    */
   obtenerFunciones = () => {
      return [
         { texto: 'Buscar', callback: this.buscarContrato },
         { texto: 'Liquidar contrato', callback: this.finalizarContrato },
         { texto: 'Limpiar', callback: this.limpiarFormulario }
      ];
   };

   /**
    * Mostrará el panel de búsqueda del contrato.
    * @returns {Boolean}
    */
   buscarContrato = () => {
      const idEstado = this.obtenerIdEstado(ESTADO_FINALIZADO);
      if (idEstado < 0) {
         return;
      }
      this.props.history.push({
         pathname: RUTAS_VISTA.CONSULTA_CONTRATOS.url,
         state: {
            interfazGestion: RUTAS_VISTA.GESTION_FINALIZAR_CONTRATO.url,
            estadosContrato: [idEstado],
            inhabilitarEstado: true,
         }
      });
   };

   /**
    * Mostrará una alerta de confirmación de actualización del estado, si el usuario confirma la actualización ejecutará la actualización.
    */
   confirmarFinalizarContrato = () => {
      this.props.mostrarAlerta('Confirmar', 'Se finalizará el contrato, ¿Desea continuar?', [
         { clase: 'btn btn-primary', callback: this.ejecutarFinalizarContrato, texto: 'Sí' },
         { clase: 'btn btn-default', texto: 'No' },
      ]);
   };

   /**
    * Ejecuta la petición al servidor para Actualizar el estado...
    * @returns {Boolean}
    */
   ejecutarFinalizarContrato = () => {
      const { contrato } = this.state;
      if (!contrato) {
         this.props.mostrarAlerta('Error', 'Debe seleccionar un contrato.');
         return;
      }

      const estadoContrato = this.obtenerIdEstado(ESTADO_LIQUIDADO);
      if (estadoContrato === 0) {
         this.props.mostrarAlerta('Error de configuración', 'No se encontró el código del estado para liquidación de contrato, configure correctamente los estados para este programa.');
         return;
      }
      if(contrato.cntTiponegocio === 'C' && !Util.validarArreglo(this.state.adjuntos)){
         this.props.mostrarAlerta('Error', 'Debe Adjuntar un acta.');
         return;
      }
      const entidadGuardar = {
         cntIderegistro: contrato.cntIderegistro,
         cntVersion: contrato.cntVersion,
         uniIdeestado: {
            uniIderegistro: estadoContrato
         },
         listaDocumentos: this.obtenerListaDocumentos()
      };

      // Reemplazar con ruta del Endpoint para guardar
      axios.post(RUTAS_API.CONTRATOS.ACTUALIZAR_ESTADO_CONTRATO, entidadGuardar)
         .then(respuesta => {
            if (respuesta.data.codigo > 0) {
               this.limpiarFormulario();
            }
         });
   };

   /**
  * Obtiene la lista de documentos para registrar.
  * @return {array}
  */
   obtenerListaDocumentos = () => {
      const listaDocumentos = [...this.state.adjuntos];
      return listaDocumentos.map((f) => {
         return {
            cntdNombre: f.nombre,
            uniIdetipodocumento: {
               uniIderegistro: f.tipoDocumento
            },
            cntdFechainicio: f.fechaInicio,
            cntdFechafinal: f.fechaFin,
            cntdFechaexpedicion: f.fechaExpedicion,
            cntdIdearchivo: f.id
         };
      });
   };

   /**
    * Prepara el objeto y lo envia al servidor para actualizar el estado del contrato.
    */
   finalizarContrato = () => {
      //Confirmamos...
      this.confirmarFinalizarContrato();
   };

   /**
    * Controla el cambio de los valores de los componentes.
    * @param {Event} evento Evento ejecutado en el control de usuario
    */
   controlarCambio = (evento) => {
      let change = {};
      change[evento.target.name] = evento.target.value;
      this.setState(change);
   };

   /**
    * Método encargado de cargar los datos de la entidad seleccionada
    * @param {Object} entidad Datos de la entidad seleccionada
    */
   cargarDatos = (entidad) => {
      this.setState({
         mostrarModalConsulta: false,
         contrato: entidad,
      });
   };

   /**
    * Obtiene el tipo de agente/tercero en base al tipo de negocio.
    * @return {string}
    */
   obtenerTipoNegocio = () => {
      const { cntTiponegocio } = this.state.contrato;
      return (cntTiponegocio === 'V') ? 'Cliente' : 'Proveedor';
   };


   /**
    * Obtiene los tipos de contrato de las propiedades que recibe de la tabla.
    * @return {string}
    */
   obtenerTiposContrato = () => {
      const listaTipos = this.state.contrato.listaTipos;
      if (!Array.isArray(listaTipos) || listaTipos.length == 0) {
         return 'Indefinido';
      }
      return listaTipos.map(tipo => {
         return tipo.uniIdetipocontrato.uniNombre1;
      }).join(',');
   };

   /**
    * Método encargado de obtener el nombre de la periodicidad en caso de que exista.
    * @param {String} periodicidad Identificador de la periodicidad.
    * @returns {String}
    */
   obtenerNombrePeriodicidad = (periodicidad) => {
      if (periodicidad) {
         const periodo = periodosCantidadContratada.find(p => p.id == periodicidad);
         return periodo.texto;
      }
      return '';
   };

   /**
    * Método encargado de obtener el nombre de la unidad de medida.
    * @param {Number} idUnidadMedida Identificador de la unidad de medida.
    * @returns {String}
    */
   obtenerNombreUnidadMedida = (idUnidadMedida) => {
      const { listaUnidadMedida } = this.state;
      if (listaUnidadMedida.length > 0) {
         const unidad = listaUnidadMedida.find(p => p.uniIderegistro == idUnidadMedida);
         return (unidad) ? unidad.uniNombre1 : '';
      }
      return;
   };

   /**
    * @method
    * Método encargado de descargar el acta de liquidación
    */
   descargarActa = () => {
      const {contrato} = this.state;
      axios.post(RUTAS_API.CONTRATOS.DESCARGAR_ACTA, { idContrato: contrato.cntIderegistro })
      .then((respuesta) => {
        if (respuesta.data.codigo < 0) {
          this.props.mostrarAlerta('Archivo no existe', 'Lo sentimos el archivo no existe');
          return;
        }
        let a = document.createElement('a');
        a.href = 'data:' + { type: "Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document" }+ ';base64,' + respuesta.data.datos;
        a.download = 'Acta.docx';
        a.target = '_blank';
        a.click();
      });
   }

   /**
    * Actualiza la lista de documentos
    * @param {Object} cambio Datos del adjunto
    */
   actualizarDocumentos = (cambio) => {
      this.setState(cambio);
   };

   /**
    * Renderiza el formulario con los campos del detalle básico del contrato.
    * @return {Component}
    */
   renderFormularioDetallesContrato = () => {
      return (
         <div className="row mt-5">
            <Input
               label='Tipo Tercero:'
               value={this.obtenerTipoNegocio()}
               name='proveedor'
               extra={{ disabled: true }}
            />
            <Input
               label='Agente / Tercero:'
               value={this.state.contrato.terIdeagente.terNomcompleto}
               name='terNomcompleto'
               extra={{ disabled: true }}
            />
            <TextoNumerico
               aceptaDecimales={false}
               aceptaNegativos={false}
               label='Número Contrato:'
               cols={4}
               value={this.state.contrato.cntNumero}
               name='numeroContrato'
               extra={{ disabled: true }}
            />
            <Input
               label='Tipo Contrato:'
               value={this.obtenerTiposContrato()}
               name='tipoContrato'
               extra={{ disabled: true }}
            />
            <Input
               label='Fecha Inicio:'
               value={this.state.contrato.cntFechainicio}
               name='fechaInicio'
               extra={{ disabled: true }}
            />
            <Input
               label='Fecha Fin:'
               value={this.state.contrato.cntFechafin}
               name='fechaFin'
               extra={{ disabled: true }}
            />
            <Input
               label='Estado Contrato:'
               value={this.state.contrato.uniIdeestado.uniNombre1}
               name='uniIderegistro.uniNombre1'
               extra={{ disabled: true }}
            />
            <TextoNumerico
               aceptaDecimales={false}
               aceptaNegativos={false}
               label='Cantidad Contratada:'
               value={this.state.contrato.cntCantidadcontratada}
               name='cntCantidadcontratada'
               extra={{ disabled: true }}
            />
            <Input
               label='Unidad Medida Cantidad Contratada:'
               value={this.obtenerNombreUnidadMedida(this.state.contrato.uniIdemedidacontratada.uniIderegistro)}
               name='uniIdemedidacontratada.uniIderegistro'
               extra={{ disabled: true }}
            />
            <Input
               label='Periodicidad:'
               value={this.obtenerNombrePeriodicidad(this.state.contrato.cntPeriodo)}
               name='cntPeriodo'
               extra={{ disabled: true }}
            />
            <TextoNumerico
               aceptaDecimales={false}
               aceptaNegativos={false}
               label='Precio Contrato:'
               value={this.state.contrato.cntPrecio}
               name='cntPrecio'
               extra={{ disabled: true }}
            />
            <Input
               label='Unidad Medida Precio:'
               value={this.obtenerNombreUnidadMedida(this.state.contrato.uniIdemedidaprecio.uniIderegistro)}
               name='uniIdemedidaprecio.uniIderegistro'
               extra={{ disabled: true }}
            />
            {
               this.state.contrato.cntTiponegocio === 'V' && (
                  <div className='form-group m-t-24 mr-3'>
                     <button className='btn btn-primary' onClick={this.descargarActa}><i className='fa fa-fw fa-download'></i> Descargar acta</button>
                  </div>
               )
            }
            {this.state.contrato.cntTiponegocio === 'C' &&
               <div className='col-12 mt-5'>
                  <h2><i className='fa fa-fw fa-paperclip'></i> Adjuntar Acta</h2>
                  <hr />
                  <GestionDocumentos
                     tipoNegocio={this.state.contrato.cntTiponegocio}
                     adjuntos={this.state.adjuntos}
                     mostrarAlerta={this.props.mostrarAlerta}
                     listaTiposDocumento={this.state.listaTiposDocumento}
                     actualizarAdjuntos={this.actualizarAdjuntos}
                  />
               </div>
            }
         </div>
      );
   };

   /**
    * Método encargado de actualizar los adjuntos del componente GestionDocumentos
    * @param {Object} cambio Datos del adjunto
    */
   actualizarAdjuntos = (cambio) => {
      this.setState(cambio);
   };

   /**
    * Devuelve el contenido que reendirazará el componente.
    * @return {Component}
    */
   render() {
      return (
         <Fragment>
            <div className='d-flex justify-content-center'>
               <Botonera funciones={this.obtenerFunciones()} />
            </div>
            {!this.state.contrato && (
               <div className="alert alert-warning alert-dismissible fade show mt-5" role="alert">
                  <strong><i className='fa fa-fw fa-info'></i> Debe buscar un contrato</strong>
               </div>
            )}
            {
               this.state.contrato && this.renderFormularioDetallesContrato()
            }
         </Fragment>
      );
   }
}

GestionLiquidarContrato.propTypes = {
   history: PropTypes.object,
   mostrarAlerta: PropTypes.func
};

const mapStateToProps = state => {
   return {};
};

const mapDispatchToProps = dispatch => {
   return bindActionCreators({
      mostrarAlerta,
   }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionLiquidarContrato);

export { VistaRedux as RGestionLiquidarContrato };
