import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Input, Combo, VentanaModal, Util } from 'appfuture-react';
import axios from 'axios'; RUTAS_API
import RUTAS_API from '../../../../../global/rutas_api';
import { CONFIGURACIONES } from '../../../../../global/constantes';
import { RConsultaContactosTercero } from './ConsultaContactosTercero';

const opcionesUsuarioConAcceso = [
   { texto: "Sí", valor: "S" },
   { texto: "No", valor: "N" }
];

const listaAplicaContrato = [
   { texto: 'Cliente', id: 'V' },
   { texto: 'Proveedor', id: 'C' },
   { texto: 'Ambos', id: 'A' },
]

class RegistroContacto extends Component {

   constructor(props) {
      super(props);
      if (props.contacto) {
         this.state = { ...props.contacto };
         return;
      }

      this.state = {
         terIderegistro: null,
         mostrarModalConsulta: false,
         visibilidadComponenteUsuarioAcceso: 'hidden',
         visibilidadBtnAgregarContacto: true,

         accion: 'I',
         cambiosEjecutados: false,
         idRegistro: 0,
         nombreContacto: '',
         identificacionContacto: '',
         tipoIdentificionContacto: '',
         tipoContacto: -1,
         telefonoContacto: '',
         direccionContacto: '',
         emailContacto: '',
         usuarioConAcceso: 'N',
         usuarioAcceso: '',
         claveAcceso: '',
         tipoContactoNombre: '',
         claveAccesoConfirmar: '',
         estado: 'NM',
         cargo: '',
         aplicaContrato: ''
      };
   }

   /**
    * Método encargado de controlar los cambios hechos en el componente padre
    * @param {Object} props Propiedades del componente padre
    * @param {Object} current_state State
    */
   static getDerivedStateFromProps(props, current_state) {
      if (props.contacto && (props.contacto.terIderegistro !== current_state.terIderegistro)) {
         return { ...props.contacto };
      }
      return null;
   }

   /**
    * Método encargado de controlar el cambio en los componentes
    * @param {Event} evento Evento ejecutado en el control de usuario
    */
   controlarCambio = (evento) => {
      let change = {};
      change[evento.target.name] = evento.target.value;
      change.cambiosEjecutados = true;
      if (evento.target.name === 'usuarioAcceso' || evento.target.name === 'claveAcceso') {
         if (this.state.accion === 'N') {
            change['accion'] = 'M';
         }
      }
      if (evento.target.name === 'tipoContacto') {
         change['tipoContactoNombre'] = evento.target.text;
      }
      this.setState(change);
   };

   /**
    * Método encargado de validar el formulario contacto
    * @returns {Object}
    */
   validarContacto = () => {
      const { identificacionContacto, tipoContacto, usuarioConAcceso, usuarioAcceso, claveAcceso, claveAccesoConfirmar, aplicaContrato, cargo } = this.state;
      if (identificacionContacto.trim() === '') {
         return { respuesta: false, mensaje: { titulo: 'Seleccione un contacto', mensaje: 'Debe seleccionar un contacto.' } };
      }
      if (tipoContacto === -1 || tipoContacto == '' || tipoContacto === '-1') {
         return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el tipo de contacto.' } };
      }

      if (cargo.trim() === '') {
         return { respuesta: false, mensaje: { titulo: 'Seleccione un contacto', mensaje: 'Debe digitar el cargo del contacto' } };
      }

      if (!aplicaContrato || aplicaContrato == '' || aplicaContrato == '-1' || aplicaContrato == -1) {
         return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar para que tipo de contrato aplicara el contacto' } };
      }

      if (usuarioConAcceso === 'S') {
         if (usuarioAcceso.trim() === '' || usuarioAcceso.length < 3) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar un usuario de acceso de tres o más caracteres.' } };
         }
         if (this.props.contacto != null) {
            if (this.props.contacto.usuarioAcceso == '') {
               if ((claveAcceso.trim() === '' || claveAcceso.length < 3) && this.state.cambiosEjecutados == true) {
                  return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar una clave de acceso de tres o más caracteres.' } };
               }
               if ((claveAcceso !== claveAccesoConfirmar) && this.state.cambiosEjecutados) {
                  return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Las claves no coinciden, verifique e intente nuevamente.' } };
               }
            }
         }
         if (this.props.contacto === null && usuarioAcceso === 'S') {
            if ((claveAcceso.trim() === '' || claveAcceso.length < 3) && this.state.cambiosEjecutados == true) {
               return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar una clave de acceso de tres o más caracteres.' } };
            }
            if ((claveAcceso !== claveAccesoConfirmar) && this.state.cambiosEjecutados) {
               return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Las claves no coinciden, verifique e intente nuevamente.' } };
            }
         }
      }

      return { respuesta: true };
   };

   /**
    * Método encargado de agregar un contacto al tercero seleccionado
    * @returns {Boolean}
    */
   agregarContacto = () => {
      const validacion = this.validarContacto();
      if (!validacion.respuesta) {
         const { mensaje, titulo } = validacion.mensaje;
         this.props.mostrarAlerta(titulo, mensaje);
         return;
      }
      let contacto = null;
      if (this.state.accion === 'N') {
         contacto = { ...this.state };
      } else {
         contacto = { idContacto: Util.generarIdControl('contacto'), accion: 'I', ...this.state };
      }
      this.props.agregarContacto(contacto);
      this.limpiarContacto();
   };

   /**
    * Método encargado de confirmar la edición a un contacto
    * @returns {Boolean}
    */
   confirmarCambios = () => {
      const validacion = this.validarContacto();
      if (!validacion.respuesta) {
         const { mensaje, titulo } = validacion.mensaje;
         this.props.mostrarAlerta(titulo, mensaje);
         return;
      }
      const accion = (this.state.accion === 'N') ? 'M' : this.state.accion;
      this.props.confirmarCambios({ ...this.state, accion: accion, ...validacion });
      this.limpiarContacto();
   };

   /**
    * Método encargado de descartar los cambios hechos a un contacto
    */
   descartarCambios = () => {
      this.limpiarContacto();
      this.props.descartarCambios();
   };

   /**
    * Método encargado de mostrar el modal de contacto
    */
   mostrarModalConsultaContacto = () => {
      this.setState({ mostrarModalConsulta: true });
   };

   /**
    * Método encargado de limpiar los datos del contacto del tercero
    */
   limpiarContacto = () => {
      this.setState({
         terIderegistro: null,
         mostrarModalConsulta: false,
         visibilidadBtnAgregarContacto: true,

         accion: 'I',
         idRegistro: 0,
         nombreContacto: '',
         identificacionContacto: '',
         tipoIdentificionContacto: '',
         tipoContacto: '',
         telefonoContacto: '',
         direccionContacto: '',
         emailContacto: '',
         usuarioConAcceso: 'N',
         usuarioAcceso: '',
         claveAcceso: '',
         claveAccesoConfirmar: '',
         tipoContactoNombre: '',
         cargo: '',
         aplicaContrato: '',
      });
   };

   /**
    * Método encargado de cerrar el modal de consulta
    */
   abrirCerrarModal = () => {
      this.setState({ mostrarModalConsulta: false });
   };

   /**
    * Método encargado de cargar los datos de la entidad seleccionada
    * @param {Object} entidad Datos de la entidad seleccionada
    */
   cargarDatos = (entidad) => {
      this.setState({
         mostrarModalConsulta: false,
         // Cargar datos de la entidad
         terIderegistro: entidad.terIderegistro,
         nombreContacto: entidad.terNomcompleto,
         idContacto: entidad.terIderegistro,
         identificacionContacto: entidad.terDocumento,
         telefonoContacto: entidad.terTelfijo,
         emailContacto: entidad.terCorreo,
         accion: "I",
      });
      this.props.controlarVisibilidadFormulario(true);
   };

   /**
    * Método encargado de renderizar todo los elementos HTML del componente
    * @param {JSX}
    */
   render() {
      return (
         <div>
            <div className='mt-5'>
               <div className="form-group">
                  <div className="text-left">
                     <button className="btn btn-primary" onClick={this.mostrarModalConsultaContacto}>Buscar contacto</button>
                  </div>
                  <hr />
               </div>
               {this.props.visibilidadFormulario &&
                  <div className='row'>
                     <Fragment>
                        <Input
                           label='Nombre (*):'
                           value={this.state.nombreContacto}
                           onChange={this.controlarCambio}
                           name='nombreContacto'
                           disabled={true}
                           extra={{ disabled: true }}
                        />
                        <Input
                           label='Identificación (*):'
                           value={this.state.identificacionContacto}
                           onChange={this.controlarCambio}
                           name='identificacionContacto'
                           disabled={true}
                           extra={{ disabled: true }}
                        />
                        <Input
                           label='Teléfono (*):'
                           value={this.state.telefonoContacto}
                           onChange={this.controlarCambio}
                           name='telefonoContacto'
                           disabled={true}
                           extra={{ disabled: true }}
                        />
                        <Input
                           label='Dirección:'
                           value={this.state.direccionContacto}
                           onChange={this.controlarCambio}
                           name='direccionContacto'
                           disabled={true}
                           extra={{ disabled: true }}
                        />
                        <Input
                           label='Correo:'
                           value={this.state.emailContacto}
                           onChange={this.controlarCambio}
                           name='emailContacto'
                           disabled={true}
                           extra={{ disabled: true }}
                        />
                        <Combo
                           opciones={this.props.tiposContacto}
                           propTexto='uniNombre1'
                           propValor='uniIderegistro'
                           label='Tipo contacto (*):'
                           name='tipoContacto'
                           value={this.state.tipoContacto}
                           onChange={this.controlarCambio}
                        />
                        <Combo
                           opciones={opcionesUsuarioConAcceso}
                           propTexto='texto'
                           propValor='valor'
                           label='Usuario con acceso:'
                           name='usuarioConAcceso'
                           value={this.state.usuarioConAcceso}
                           onChange={this.controlarCambio}
                        />
                        <Input
                           label='Cargo:'
                           value={this.state.cargo}
                           onChange={this.controlarCambio}
                           name='cargo'
                        />
                        <Combo
                           opciones={listaAplicaContrato}
                           propTexto='texto'
                           propValor='id'
                           label='Aplica Contratos:'
                           name='aplicaContrato'
                           value={this.state.aplicaContrato}
                           onChange={this.controlarCambio}
                        />
                     </Fragment>
                     {
                        this.state.usuarioConAcceso === 'S' &&
                        <Fragment>
                           <Input
                              label='Usuario:'
                              value={this.state.usuarioAcceso}
                              onChange={this.controlarCambio}
                              name='usuarioAcceso'
                           />

                           <Input
                              label='Clave:'
                              type='password'
                              value={this.state.claveAcceso}
                              onChange={this.controlarCambio}
                              name='claveAcceso'
                           />

                           <Input
                              label='Confirmar Clave:'
                              type='password'
                              value={this.state.claveAccesoConfirmar}
                              onChange={this.controlarCambio}
                              name='claveAccesoConfirmar'
                           />
                        </Fragment>
                     }
                     <div className="form-group col-12">
                        <hr />
                        <div className="text-right">
                           {this.state.visibilidadBtnAgregarContacto &&
                              <button className='btn btn-primary mr-2' onClick={this.agregarContacto} >Agregar contacto</button>}

                           {!this.state.visibilidadBtnAgregarContacto &&
                              <button className='btn btn-primary mr-2' onClick={this.confirmarCambios} >Confirmar cambios</button>
                           }
                           <button className="btn btn-default" onClick={this.descartarCambios}>Cancelar</button>
                        </div>
                     </div>
                  </div>
               }


            </div>
            <VentanaModal
               mostrar={this.state.mostrarModalConsulta}
               titulo='Consulta de contactos'
               cerrarModal={this.abrirCerrarModal}>
               <RConsultaContactosTercero esModal seleccionarEntidad={this.cargarDatos} mostrarAlerta={this.props.mostrarAlerta} />
            </VentanaModal>
         </div>
      );
   };
}

RegistroContacto.propTypes = {
   contacto: PropTypes.object,
   agregarContacto: PropTypes.func,
   confirmarCambios: PropTypes.func,
   descartarCambios: PropTypes.func,
   mostrarAlerta: PropTypes.func,
   tiposContacto: PropTypes.array,
   visibilidadFormulario: PropTypes.bool,
   controlarVisibilidadFormulario: PropTypes.func,
}

export { RegistroContacto };
