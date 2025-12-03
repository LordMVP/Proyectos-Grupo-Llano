import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, TextoNumerico, Fecha, Tabla, VentanaModal, Util } from 'appfuture-react';
import axios from 'axios';

import RUTAS_API from '../../../global/rutas_api';
import { mostrarAlerta } from '../../../store/actions/AplicacionAcciones';

import './GestionInterfazActualizacion.scss';

class GestionInterfazActualizacion extends Component {

  state = {
    mostrarModalConsulta: false,
    panelActivo: 'H',
  };

  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
  }

  componentWillUnmount() {
    this.props.history.replace({ entidadEditar: null });
  }

  limpiarFormulario = (evento) => {
    this.setState({
      mostrarModalConsulta: false,

      // Datos de la entidad
      // ...

      // Estado de la aplicacion
      // ...

    });
  };

  componentWillUnmount() {
    this.limpiarFormulario();
  }

  obtenerFunciones = () => {
    return [
      { texto: 'Guardar', callback: this.guardarEntidad },
      { texto: 'Consultar', callback: this.consultarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  validarFormulario = () => {
    // Ejemplo Validacion
    if (false) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos un cargo de tipo AO&M para poder continuar.' } };
    }

    return { respuesta: true };
  };

  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    const entidadGuardar = {
      // Asignar datos de la entidad
    }

    // Reemplazar con ruta del Endpoint para guardar
    axios.post(RUTAS_API.XXXXXX, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  consultarEntidad = () => {
    this.setState({ mostrarModalConsulta: true });
  };

  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false
    });
  };

  cargarDatos = (entidad) => {
    this.setState({
      mostrarModalConsulta: false,
      // Cargar datos de la entidad
      // ...
    });
  };

  renderSeccionInformacionTercero = () => {
    return (
      <div className='group-section'>
        <label className='legend-section'>Información Tercero</label>
        <div className='body-section'>
          <div className='row'>
            <Combo
              opciones={[]}
              propTexto='texto'
              propValor='valor'
              label='Tipo documento:'
              name='tipoDocumento'
              value={this.state.tipoDocumento}
              onChange={this.controlarCambio}
            />
            <TextoNumerico
              aceptaDecimales={false}
              aceptaNegativos={false}
              label='Documento:'
              cols={4}
              value={this.state.tipoDocumento}
              onChange={this.controlarCambio}
              name='tipoDocumento'
            />
            <Input
              label='Lugar Expedicón:'
              value={this.state.lugarExpedicion}
              onChange={this.controlarCambio}
              name='lugarExpedicion'
            />
            <Input
              label='Nombres:'
              value={this.state.nombres}
              onChange={this.controlarCambio}
              name='nombres'
            />
            <Input
              label='Apellidos:'
              value={this.state.apellidos}
              onChange={this.controlarCambio}
              name='apellidos'
            />
            <Input
              label='Teléfono:'
              value={this.state.telefono}
              onChange={this.controlarCambio}
              name='telefono'
            />
            <Input
              label='Celular:'
              value={this.state.celular}
              onChange={this.controlarCambio}
              name='celular'
            />
          </div>
        </div>
      </div>
    );
  };

  renderSeccionInformacionSuscripcion = () => {
    return (
      <div className='group-section mt-1'>
        <label className='legend-section'>Información Suscripión</label>
        <div className='body-section'>
          <div className='row'>
            <Combo
              opciones={[]}
              propTexto='texto'
              propValor='valor'
              label='Tipo Uso:'
              name='tipoUso'
              value={this.state.tipoUso}
              onChange={this.controlarCambio}
            />
            <TextoNumerico
              aceptaDecimales={false}
              aceptaNegativos={false}
              label='Estrato:'
              cols={2}
              value={this.state.estrato}
              onChange={this.controlarCambio}
              name='estrato'
            />
            <TextoNumerico
              aceptaDecimales={false}
              aceptaNegativos={false}
              label='Id Suscripción:'
              cols={3}
              value={this.state.idSuscripcion}
              onChange={this.controlarCambio}
              name='idSuscripcion'
            />
            <TextoNumerico
              aceptaDecimales={false}
              aceptaNegativos={false}
              label='Código:'
              cols={3}
              value={this.state.codigo}
              onChange={this.controlarCambio}
              name='codigo'
            />
            <Input
              label='Dirección:'
              value={this.state.direccion}
              onChange={this.controlarCambio}
              name='direccion'
            />
            <Combo
              opciones={[]}
              propTexto='texto'
              propValor='valor'
              label='Municipio:'
              name='municipio'
              value={this.state.municipio}
              onChange={this.controlarCambio}
            />
            <Input
              label='Barrio:'
              value={this.state.barrio}
              onChange={this.controlarCambio}
              name='barrio'
            />
          </div>
        </div>
      </div>
    )
  };

  /**
   * Renderiza la secciòn de búsqueda.
   * @return {Component}
   */
  renderCabeceraBusqueda = () => {
    return (
      <Fragment>
        {this.renderSeccionInformacionTercero()}
        {this.renderSeccionInformacionSuscripcion()}
      </Fragment>
    )
  };

  controlCambioNavTabs = (evento) => {
    console.log(evento);
    const control = evento.target;
    const panel = control.attributes['data-panel'].value;
    console.log('PANEL', panel);
    this.setState({ panelActivo: panel });
  };

  renderSeccionHomologacion = () => {
    return (
      <div className='row'>
        <div className='col-12'>
          <h1 className='title-panel'>Homologación</h1>
        </div>
        <Combo
          opciones={[]}
          propTexto='texto'
          propValor='valor'
          label='Empresa Alterna:'
          name='empresaAlterna'
          value={this.state.empresaAlterna}
          onChange={this.controlarCambio}
        />
        <Combo
          opciones={[]}
          propTexto='texto'
          propValor='valor'
          label='Convenio:'
          name='convenio'
          value={this.state.convenio}
          onChange={this.controlarCambio}
        />
        <Combo
          opciones={[]}
          propTexto='texto'
          propValor='valor'
          label='Suscriptor:'
          name='suscriptor'
          value={this.state.suscriptor}
          onChange={this.controlarCambio}
        />
        <Input
          label='Suscripción:'
          value={this.state.suscripcion}
          onChange={this.controlarCambio}
          name='suscripcion'
        />
        <Input
          label='Número Medidor:'
          value={this.state.numeroMedidor}
          onChange={this.controlarCambio}
          name='numeroMedidor'
        />
        <Input
          label='Dirección:'
          value={this.state.direccion}
          onChange={this.controlarCambio}
          name='direccion'
        />
        <Combo
          opciones={[]}
          propTexto='texto'
          propValor='valor'
          label='Estado:'
          name='estado'
          value={this.state.estado}
          onChange={this.controlarCambio}
        />
        <Input
          label='Facturando:'
          value={this.state.facturando}
          onChange={this.controlarCambio}
          name='facturando'
        />
        <div className='col-12'>
          <button className='btn btn-primary mr-2'>Actualizar Homologación</button>
          <button className='btn btn-primary mr-2'>Consultar</button>
          <button className='btn btn-primary mr-2'>Buscar Coincidencias</button>
          <button className='btn btn-primary'>Guardar Homologación</button>
        </div>
        <div className='col-12 pt-5'>
          <div className='group-section'>
            <label className='legend-section'>Historial Homologaciones</label>
            <div className='body-section'>
              <table className='table table-condensed table-hover table-bordered table-striped'>
                <thead>
                  <tr>
                    <th>Empresa Alterna</th>
                    <th>Convenio</th>
                    <th>Fecha</th>
                    <th>Medidor</th>
                    <th>Código Suscripción Alterna</th>
                  </tr>
                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  };

  renderSeccionActualizacion = () => {
    return (
      <div className='row'>
        <div className='col-12'>
          <h1 className='title-panel'>Actualización</h1>
        </div>
        <Combo
          opciones={[]}
          propTexto='texto'
          propValor='valor'
          label='Empresa Alterna:'
          name='empresaAlterna'
          value={this.state.empresaAlterna}
          onChange={this.controlarCambio}
        />
        <div className='group-section'>
          <label className='legend-section'>Información Tercero</label>
          <div className='body-section'>
            <div className='row'>
              <Input
                label='Identificación:'
                value={this.state.identificacion}
                onChange={this.controlarCambio}
                name='identificacion'
              />
              <Combo
                opciones={[]}
                propTexto='texto'
                propValor='valor'
                label='Tipo identificación:'
                name='tipoIdentificacion'
                value={this.state.tipoIdentificacion}
                onChange={this.controlarCambio}
              />
              <Combo
                opciones={[]}
                propTexto='texto'
                propValor='valor'
                label='Lugar Expedición:'
                name='lugarExpedicion'
                value={this.state.lugarExpedicion}
                onChange={this.controlarCambio}
              />
              <Input
                label='Nombres:'
                value={this.state.nombres}
                onChange={this.controlarCambio}
                name='nombres'
              />
              <Input
                label='Apellidos:'
                value={this.state.apellidos}
                onChange={this.controlarCambio}
                name='apellidos'
              />
              <Input
                label='Correo:'
                value={this.state.correoActualizacion}
                onChange={this.controlarCambio}
                name='correoActualizacion'
              />
              <Input
                label='Número Contacto:'
                value={this.state.numeroContactoActualizacion}
                onChange={this.controlarCambio}
                name='numeroContactoActualizacion'
              />
              <Combo
                opciones={[]}
                propTexto='texto'
                propValor='valor'
                label='Tipo:'
                name='tipoActualizacion'
                value={this.state.tipoActualizacion}
                onChange={this.controlarCambio}
              />
            </div>
          </div>
        </div>
        <div className='group-section mt-3'>
          <label className='legend-section'>Información Propiedad</label>
          <div className='body-section'>
            <div className='row'>
              <Input
                label='Número Medidor:'
                value={this.state.numeroMedidor}
                onChange={this.controlarCambio}
                name='numeroMedidor'
              />
              <Input
                label='Dirección:'
                value={this.state.direccion}
                onChange={this.controlarCambio}
                name='direccion'
              />
              <Combo
                opciones={[]}
                propTexto='texto'
                propValor='valor'
                label='Barrio:'
                name='barrioActualizacion'
                value={this.state.barrioActualizacion}
                onChange={this.controlarCambio}
              />
              <Input
                label='Cédula Catastral:'
                value={this.state.cedulaCatastralActualizacion}
                onChange={this.controlarCambio}
                name='cedulaCatastralActualizacion'
              />
              <Input
                label='Matricula Inmobiliaria:'
                value={this.state.matriculaInmobiliariaActualizacion}
                onChange={this.controlarCambio}
                name='matriculaInmobiliariaActualizacion'
              />
              <TextoNumerico
                aceptaDecimales={false}
                aceptaNegativos={false}
                label='Número Contador:'
                cols={4}
                value={this.state.numeroContadorActualizacion}
                onChange={this.controlarCambio}
                name='numeroContadorActualizacion'
              />
              <Combo
                opciones={[]}
                propTexto='texto'
                propValor='valor'
                label='Tipo Vivienda:'
                name='tipoViviendaActualizacion'
                value={this.state.tipoViviendaActualizacion}
                onChange={this.controlarCambio}
              />
              <Combo
                opciones={[]}
                propTexto='texto'
                propValor='valor'
                label='Inquilinato:'
                name='inquilinatoActualizacion'
                value={this.state.inquilinatoActualizacion}
                onChange={this.controlarCambio}
              />
              <Combo
                opciones={[]}
                propTexto='texto'
                propValor='valor'
                label='Independencia:'
                name='independenciaActualizacion'
                value={this.state.independenciaActualizacion}
                onChange={this.controlarCambio}
              />
              <TextoNumerico
                aceptaDecimales={false}
                aceptaNegativos={false}
                label='Número independencia:'
                cols={4}
                value={this.state.numeroIndependencia}
                onChange={this.controlarCambio}
                name='numeroIndependencia'
              />
            </div>
          </div>
        </div>
        <div className='group-section mt-3'>
          <label className='legend-section'>Información Suscripción</label>
          <div className='body-section'>
            <div className='row'>
              <Combo
                opciones={[]}
                propTexto='texto'
                propValor='valor'
                label='Tipo de Uso:'
                name='tipoUso'
                value={this.state.tipoUso}
                onChange={this.controlarCambio}
              />
              <Combo
                opciones={[]}
                propTexto='texto'
                propValor='valor'
                label='Tipo Generador:'
                name='tipoGeneradorActualizacion'
                value={this.state.tipoGeneradorActualizacion}
                onChange={this.controlarCambio}
              />
              <Combo
                opciones={[]}
                propTexto='texto'
                propValor='valor'
                label='Estrato:'
                name='estratoActualizacion'
                value={this.state.estratoActualizacion}
                onChange={this.controlarCambio}
              />
              <Combo
                opciones={[]}
                propTexto='texto'
                propValor='valor'
                label='Macroruta:'
                name='macroRutaActualizacion'
                value={this.state.macroRutaActualizacion}
                onChange={this.controlarCambio}
              />
              <Combo
                opciones={[]}
                propTexto='texto'
                propValor='valor'
                label='Microruta:'
                name='microRutaActualizacion'
                value={this.state.microRutaActualizacion}
                onChange={this.controlarCambio}
              />
              <Combo
                opciones={[]}
                propTexto='texto'
                propValor='valor'
                label='Ciclo:'
                name='cicloActualizacion'
                value={this.state.cicloActualizacion}
                onChange={this.controlarCambio}
              />
              <Combo
                opciones={[]}
                propTexto='texto'
                propValor='valor'
                label='Ruta:'
                name='ruta'
                value={this.state.ruta}
                onChange={this.controlarCambio}
              />
              <Fecha
                label='Fecha Inscripción:'
                name='fechaInscripcionActualizacion'
                fecha={this.state.fechaInscripcion}
                onChange={this.controlarCambio}
              />
              <Combo
                opciones={[]}
                propTexto='texto'
                propValor='valor'
                label='Estado:'
                name='estadoActualizacion'
                value={this.state.estadoActualizacion}
                onChange={this.controlarCambio}
              />
            </div>
          </div>
        </div>
        <div className='col-12'>
          <button className='btn btn-primary'><i className='fa fa-fw fa-save'></i> Guardar</button>
          <button className='btn btn-primary'><i className='fa fa-fw fa-search'></i> Consultar</button>
        </div>
      </div>
    );
  };

  renderSeccionGestionVisitas = () => {
    return (
      <div className='row'>
        <div className='col-12'>
          <h1 className='title-panel'>Gestión Vistas</h1>
        </div>
        <Input
          label='Radicado:'
          value={this.state.radicadoVisitas}
          onChange={this.controlarCambio}
          name='radicadoVisitas'
        />
        <Combo
          opciones={[]}
          propTexto='texto'
          propValor='valor'
          label='Novedad Visita:'
          name='novedadVisita'
          value={this.state.novedadVisita}
          onChange={this.controlarCambio}
        />
        <Combo
          opciones={[]}
          propTexto='texto'
          propValor='valor'
          label='Novedad Liquidación:'
          name='novedadLiquidacion'
          value={this.state.novedadLiquidacion}
          onChange={this.controlarCambio}
        />
        <Combo
          opciones={[]}
          propTexto='texto'
          propValor='valor'
          label='Estado:'
          name='estadoVisita'
          value={this.state.estadoVisita}
          onChange={this.controlarCambio}
        />
        <Fecha
          label='Fecha Programación:'
          name='fechaProgramacionVisita'
          fecha={this.state.fechaProgramacionVisita}
          onChange={this.controlarCambio}
        />
        <div className='col-4'>
          <div className='input-group'>
            <label>Radicado PQR:</label>
            <input type="text" className='form-control' />
            <div className='input-group-btn'>
              <button className='btn btn-primary'>Ver</button>
            </div>
          </div>
        </div>
        <Combo
          opciones={[]}
          propTexto='texto'
          propValor='valor'
          label='Técnico:'
          name='tecnicoVisita'
          value={this.state.tecnicoVisita}
          onChange={this.controlarCambio}
        />
        <Fecha
          label='Fecha Ejecución:'
          name='fechaEjecucion'
          fecha={this.state.fechaEjecucion}
          onChange={this.controlarCambio}
        />
        <div className='col-4'>
          <label>Archivo:</label>
          <div className='input-group'>
            <input type="text" className='form-control' />
            <div className='input-group-btn'>
              <button><i className='fa fa-fw fa-paperclip'></i> Cargar Archivo</button>
            </div>
          </div>
        </div>
        <Combo
          opciones={[]}
          propTexto='texto'
          propValor='valor'
          label='Instalación Nueva:'
          name='instalacionNuevaVisita'
          value={this.state.instalacionNuevaVisita}
          onChange={this.controlarCambio}
        />
        <TextoNumerico
          aceptaDecimales={false}
          aceptaNegativos={false}
          label='Nro Medidor:'
          cols={4}
          value={this.state.numeroMedidorVisita}
          onChange={this.controlarCambio}
          name='numeroMedidorVisita'
        />
        <TextoNumerico
          aceptaDecimales={false}
          aceptaNegativos={false}
          label='Nro Contador:'
          cols={4}
          value={this.state.numeroContadorVisita}
          onChange={this.controlarCambio}
          name='numeroContadorVisita'
        />
        <Input
          label='Consumo Adicional:'
          value={this.state.consumoAdicionalVisita}
          onChange={this.controlarCambio}
          name='consumoAdicionalVisita'
        />
        <div className='col-6'>
          <textarea></textarea>
        </div>
      </div>
    );
  };

  renderSeccionTabs = () => {
    return (
      <Fragment>
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <a className={`nav-item nav-link ${(this.state.panelActivo === 'H') ? 'active' : ''}`} data-panel='H' onClick={this.controlCambioNavTabs}>Homologación</a>
            <a className={`nav-item nav-link ${(this.state.panelActivo === 'A') ? 'active' : ''}`} data-panel='A' onClick={this.controlCambioNavTabs}>Actualización</a>
            <a className={`nav-item nav-link ${(this.state.panelActivo === 'V') ? 'active' : ''}`} data-panel='V' onClick={this.controlCambioNavTabs}>Gestión Visitas</a>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div className="tab-pane fade show active" >
            {(this.state.panelActivo === 'H') && (this.renderSeccionHomologacion())}
            {(this.state.panelActivo === 'A') && (this.renderSeccionActualizacion())}
            {(this.state.panelActivo === 'V') && (this.renderSeccionGestionVisitas())}
          </div>
        </div>
      </Fragment>
    )
  };

  render() {
    return (
      <Fragment>
        <div className='d-flex justify-content-center'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>

        <div className='conf-general row mt-5'>
          <div className='col-12'>
            {this.renderCabeceraBusqueda()}
          </div>
          <div className='col-12 pt-3'>
            <button className='btn btn-primary'><i className='fa fa-fw fa-search'></i> Consultar</button>
          </div>
          <div className='col-12 mt-5'>
            {this.renderSeccionTabs()}
          </div>
        </div>
      </Fragment>
    );
  }
}

GestionInterfazActualizacion.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionInterfazActualizacion);

export { VistaRedux as RGestionInterfazActualizacion };
