import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Fecha, Util } from 'appfuture-react';
import axios from 'axios';

import RUTAS_API from '../../global/rutas_api';
import { mostrarAlerta } from '../../store/actions/AplicacionAcciones';

// import { RConsultaActividadesColaborador } from '../ConsultaActividadesColaborador';
import './ReporteAgendas.scss';

const TIPOS_REPORTE = {
  ACTIVIDADES_COLABORADOR: 'ActividadesColaborador',
  DISTRIBUCION_CONTABLE: 'DistribucionContable',
  DETALLE_DISTRIBUCION_CONTABLE: 'DetalleDistribucionContable'
};

class ReporteAgendas extends Component {

  state = {
    mostrarModalConsulta: false,
    listaContratantes: [],
    listaContratistas: [],
    listaACtividades: [],
    listaColaboradores: [],
    listaProyectos: [],
    listaEtapas: [],
    listaServicios: [],
    listaDistribucion: [],
    listaDistribucion: [],
    fechaInicio:'',
    fechaFin:'',
    colaborador:'',
  };

  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
    this.consultarContratantes();
    this.consultarContratistas();    
  }

  consultarColaboradores = (contratista) => {
    axios.post(RUTAS_API.REPORTE_ACTIVIDADES_COLABORADOR.CONSULTAR_COLABORADORES,
      {
        contratista: contratista
      }
    )
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          let listaColaboradores = respuesta.data.datos;
          listaColaboradores = listaColaboradores.map(colaborador => {
            colaborador.colNomCompleto = colaborador.colMombres + ' ' + colaborador.colApellidos;
            return colaborador;
          });
          this.setState({ listaColaboradores: listaColaboradores });
        }
      });
  };

  consultarEtapas = (contratante) => {
    axios.post(RUTAS_API.REPORTE_ACTIVIDADES_COLABORADOR.CONSULTAR_ETAPAS, {
      contratante: contratante
    }).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        this.setState({ listaEtapas: respuesta.data.datos });
      }
    });
  };

  consultarServicios = (contratante) => {
    axios.post(RUTAS_API.REPORTE_ACTIVIDADES_COLABORADOR.CONSULTAR_SERVICIOS, {
      contratante: contratante
    }).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        this.setState({ listaServicios: respuesta.data.datos });
      }
    });
  };

  consultarProyectos = (contratante) => {
    axios.post(RUTAS_API.REPORTE_ACTIVIDADES_COLABORADOR.CONSULTAR_PROYECTOS, {
      contratante: contratante
    }).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        this.setState({ listaProyectos: respuesta.data.datos });
      }
    });
  };

  consultarActividades = (contratante, contratista) => {
    axios.post(RUTAS_API.REPORTE_ACTIVIDADES_COLABORADOR.CONSULTAR_ACTIVIDADES, {
      contratante: contratante,
      contratista: contratista
    })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaACtividades: respuesta.data.datos });
        }
      });
  };

  consultarContratantes = () => {
    axios.post(RUTAS_API.REPORTE_ACTIVIDADES_COLABORADOR.CONSULTAR_CONTRATANTES)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaContratantes: respuesta.data.datos });
        }
      });
  };

  consultarContratistas = () => {
    axios.post(RUTAS_API.REPORTE_ACTIVIDADES_COLABORADOR.CONSULTAR_CONTRATISTAS)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaContratistas: respuesta.data.datos });
        }
      });
  };

  componentWillUnmount() {
    this.props.history.replace({ entidadEditar: null });
  }

  limpiarFormulario = (evento) => {
    this.setState({
      mostrarModalConsulta: false,
      contratante: '',
      contratista: '',
      desde: '',
      hasta: '',
      colaborador:''
    });
  };

  componentWillUnmount() {
    this.limpiarFormulario();
  }

  obtenerFunciones = () => {
    return [
      { texto: 'Buscar', callback: this.buscar },
     // { texto: 'Exportar XLS', callback: this.exportarXLS },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  validarYObtenerValor = (valor) => {
    const esStringValido = (typeof valor === 'string' && valor.trim() != '');
    const esNumeroValido = (typeof valor == 'number');
    return (esStringValido || esNumeroValido) ? (valor === '-1' ? '' : valor) : '';
  };

  obtenerCriterioBusqueda = () => {
    const { contratante, contratista, desde, hasta, colaborador } = this.state;
    this.setState({fechaInicio:this.validarYObtenerValor(desde)});
    this.setState({fechaFin:this.validarYObtenerValor(hasta)});
    return {
      "contratante": this.validarYObtenerValor(contratante),
      "contratista": this.validarYObtenerValor(contratista),
      "fechainicio": this.validarYObtenerValor(desde),
      "fechafin": this.validarYObtenerValor(hasta),
      "actividad": "",
      "colaborador": this.validarYObtenerValor(colaborador),
      "proyecto": "",
      "etapa": "",
      "servicio": ""
    };
  };

  buscar = () => {
    axios.post(RUTAS_API.REPORTE_ACTIVIDADES_COLABORADOR.NOMINA_GENERAL,
      {
        ...this.obtenerCriterioBusqueda(),
        nombreReporte: TIPOS_REPORTE.ACTIVIDADES_COLABORADOR
      }
    ).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        this.setState({ listaACtividadesColaborador: respuesta.data.datos });
      } else {
        this.setState({ listaACtividadesColaborador:[] });
      }
    });
  };

  guardarArchivo = (respuesta) => {
    let a = document.createElement('a');
    a.href = 'data:' + { type: "Content-Type: application/vnd.ms-excel" } + ';base64,' + respuesta.data.datos;
    a.download = "Reporte.xls";
    a.target = '_blank';
    a.click();
  };

  exportarXLS = () => {
    axios.post(RUTAS_API.REPORTE_ACTIVIDADES_COLABORADOR.NOMINA_GENERAL, {
      ...this.obtenerCriterioBusqueda(),
    }).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        this.guardarArchivo(respuesta);
      }
    });
  };

  validarFormulario = () => {
    // Ejemplo Validacion
    if (false) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos un cargo de tipo AO&M para poder continuar.' } };
    }

    return { respuesta: true };
  };

  consultarEntidad = () => {
    this.setState({ mostrarModalConsulta: true });
  };

  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.verificarConsultas(evento.target.name, evento.target.value);
    this.setState(change);
  };

  verificarConsultas = (nombrePropiedad, valorPropiedad) => {
    const { contratante, contratista } = this.state;
    
    if ((nombrePropiedad == 'contratista' && (typeof contratante == 'string' && contratante.trim() != ''))) {
      this.consultarActividades(contratante, valorPropiedad);
      this.consultarColaboradores(valorPropiedad);
      this.setState({ listaDistribucion: [] });
    }
    if ((typeof contratista == 'string' && contratista.trim() != '' && nombrePropiedad == 'contratante')) {
      this.consultarActividades(valorPropiedad, contratista);
      this.consultarColaboradores(contratista);
      this.setState({ listaDistribucion: [] });
    }
  };

  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false
    });
  };

  renderTablaActividadesColaborador = () => {
    const formatterPeso = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });
    const lista = this.state.listaACtividadesColaborador;
    if (!Util.validarArreglo(lista)) {
      return null;
    }

    let totales = [1];
    let totalCant = 0;
    let totalValor= 0;
    return (
      <div className='table-responsive'>
        <table className='table table-hover table-condensed table-striped table-bordered'>         
          <thead></thead>
          <tbody>
            {
              lista.map((distribucion, index) => {
                totalCant = 0;
                totalValor= 0;
                const valores = distribucion.listaActividades;
                //let valorTotalLinea = 0;
                return (
                  <Fragment>
                    <tr key={distribucion.cedula} className='bg-dark text-white'>
                      <td>Cedula: {distribucion.cedula}</td>
                      <td>{distribucion.nombre}</td>
                      <td>Contrato: {distribucion.contrato}</td>
                      <td>Cargo: {distribucion.cargo}</td>
                      <td colSpan={2}>{distribucion.descCargo}</td>
                      <td>Desde: {this.state.fechaInicio}</td>
                      <td>Hasta: {this.state.fechaFin}</td>
                    </tr> 
                    <tr>
                      <td><b>Actividad</b></td>
                      <td><b>Cantidad</b></td>
                      <td><b>Valor Unit</b></td>
                      <td><b>Municipio</b></td>
                      <td><b>Servicio</b></td>
                      <td><b>Etapa</b></td>
                      <td><b>Fecha</b></td>
                      <td><b>Total</b></td>
                    </tr>                                       
                      {                      
                        valores.map((actividades, index) => {                          
                          totalCant += actividades.cantidad;                        
                          totalValor += actividades.total;
                          return <tr key={actividades.actividad}>
                                  <td>{actividades.actividad}</td>
                                  <td>{actividades.cantidad}</td>
                                  <td>{formatterPeso.format(actividades.valorUnitario)}</td>
                                  <td>{actividades.proyecto}</td>
                                  <td>{actividades.agenda}</td>
                                  <td>{actividades.servicio}</td>                     
                                  <td>{actividades.fechaEjecucion}</td>
                                  <td>{formatterPeso.format(actividades.total)}</td>
                                </tr>
                        })
                      }{
                        totales.map((cantidad, index) => {                  
                          return <tr key={cantidad}>                                  
                                  <td><b>Total Actividades</b></td>
                                  <td><b>{totalCant}</b></td>   
                                  <td colSpan={5}><b>Total Devengado</b></td>                                  
                                  <td><b>{formatterPeso.format(totalValor)}</b></td>                              
                                </tr>
                        })
                      }                  
                  </Fragment>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  };

  cargarDatos = (entidad) => {
    this.setState({
      mostrarModalConsulta: false,
      // Cargar datos de la entidad
      // ...
    });
  };

  render() {
    return (
      <Fragment>
        <h1>Reporte Actividades por Colaborador</h1>
        <div className='d-flex justify-content-center'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>

        <div className='Contratante'>
          <div className='contenedor formulario mt-5'>
            <Combo
              opciones={this.state.listaContratantes}
              propTexto='empresaNom'
              propValor='empresaCod'
              label='Contratante:*'
              name='contratante'
              value={this.state.contratante}
              onChange={this.controlarCambio}
            />
            <Combo
              opciones={this.state.listaContratistas}
              propTexto='empresaNom'
              propValor='empresaCod'
              label='Contratista:*'
              name='contratista'
              value={this.state.contratista}
              onChange={this.controlarCambio}
            />
            <Fecha
              label='Desde*:'
              name='desde'
              fecha={this.state.desde}
              onChange={this.controlarCambio}
            />
            <Fecha
              label='Hasta*:'
              name='hasta'
              fecha={this.state.hasta}
              onChange={this.controlarCambio}
            />
            <Combo
              opciones={this.state.listaColaboradores}
              propTexto='colNomCompleto'
              propValor='colCodiemple'
              label='Colaborador:'
              name='colaborador'
              value={this.state.colaborador}
              onChange={this.controlarCambio}
            />
          </div>
          <div className='row mt-5'>
            <div className='col-12'>
              {this.renderTablaActividadesColaborador()}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

ReporteAgendas.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ReporteAgendas);

export { VistaRedux as RReporteAgendas };
