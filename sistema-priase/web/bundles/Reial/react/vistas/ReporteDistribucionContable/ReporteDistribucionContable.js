import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Fecha, Util } from 'appfuture-react';
import axios from 'axios';

import RUTAS_API from '../../global/rutas_api';
import { mostrarAlerta } from '../../store/actions/AplicacionAcciones';

import './ReporteDistribucionContable.scss';

const TIPOS_REPORTE = {
  DISTRIBUCION_CONTABLE: 'DistribucionContable',
  DETALLE_DISTRIBUCION_CONTABLE: 'DetalleDistribucionContable'
};

class ReporteDistribucionContable extends Component {

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

  limpiarFormulario = () => {
    this.setState({
      mostrarModalConsulta: false,
      contratante: '',
      contratista: '',
      desde: '',
      hasta: '',
      actividad: '',
      colaborador: '',
      proyecto: '',
      etapa: '',
      servicio: ''
    });
  };

  componentWillUnmount() {
    this.limpiarFormulario();
  }

  obtenerFunciones = () => {
    return [
      { texto: 'Buscar', callback: this.buscar },
      { texto: 'Exportar XLS', callback: this.exportarXLS },
      { texto: 'Exportar Detalle XLS', callback: this.exportarDetalleXLS },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  validarYObtenerValor = (valor) => {
    const esStringValido = (typeof valor === 'string' && valor.trim() != '');
    const esNumeroValido = (typeof valor == 'number');
    return (esStringValido || esNumeroValido) ? (valor === '-1' ? null : valor) : null;
  };

  obtenerCriterioBusqueda = () => {
    const { contratante, contratista, desde, hasta, actividad, colaborador, proyecto, etapa, servicio } = this.state;
    return {
      "contratante": this.validarYObtenerValor(contratante),
      "contratista": this.validarYObtenerValor(contratista),
      "fechainicio": this.validarYObtenerValor(desde),
      "fechafin": this.validarYObtenerValor(hasta),
      "actividad": this.validarYObtenerValor(actividad),
      "colaborador": this.validarYObtenerValor(colaborador),
      "proyecto": this.validarYObtenerValor(proyecto),
      "etapa": this.validarYObtenerValor(etapa),
      "servicio": this.validarYObtenerValor(servicio)
    };
  };

  buscar = () => {
    axios.post(RUTAS_API.REPORTE_ACTIVIDADES_COLABORADOR.GENERAR_REPORTE,
      this.obtenerCriterioBusqueda()
    ).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        this.setState({ listaDistribucion: respuesta.data.datos });
      } else {
        this.setState({ listaDistribucion: [] });
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
    axios.post(RUTAS_API.REPORTE_ACTIVIDADES_COLABORADOR.GENERAR_REPORTE_DISTRIBUCION, {
      ...this.obtenerCriterioBusqueda(),
      "nombreReporte": TIPOS_REPORTE.DISTRIBUCION_CONTABLE,
    }).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        this.guardarArchivo(respuesta);
      }
    });
  };

  exportarDetalleXLS = () => {
    axios.post(RUTAS_API.REPORTE_ACTIVIDADES_COLABORADOR.GENERAR_REPORTE_DISTRIBUCION, {
      ...this.obtenerCriterioBusqueda(),
      "nombreReporte": TIPOS_REPORTE.DETALLE_DISTRIBUCION_CONTABLE,
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

  ejecutarConsultas = (contratante) => {
    this.setState({ listaDistribucion: [] });
    this.consultarEtapas(contratante);
    this.consultarServicios(contratante);
    this.consultarProyectos(contratante);
  };

  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.verificarConsultas(evento.target.name, evento.target.value);
    this.setState(change);
  };

  verificarConsultas = (nombrePropiedad, valorPropiedad) => {
    const { contratante, contratista } = this.state;
    if (nombrePropiedad == 'contratante') {
      this.ejecutarConsultas(valorPropiedad);
    }
    if (nombrePropiedad == 'contratante' && (typeof contratista == 'string' && contratista.trim() != '')) {
      this.ejecutarConsultas(valorPropiedad);
    }
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

  renderTablaDistribucion = () => {
    const formatterPeso = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });

    if (!Util.validarArreglo(this.state.listaDistribucion)) {
      return null;
    }
    return (
      <table className='table table-hover table-condensed table-striped table-bordered'>
        <thead className='bg-dark text-white'>
          <tr>
            <th>Cédula</th>
            <th>Nombres</th>
            <th>Contrato</th>
            <th>Código Cargo</th>
            <th>Descripción Cargo</th>
            <th>Centro Costos</th>
            <th>Centro Costos Contabilidad</th>
            <th>Sucursal Homologa Contable</th>
            <th>Area Negocio Homologa</th>
            <th>Valor Distribución</th>
            <th>% Distribución</th>
            <th>% Acomulado</th>
            <th>Valor Total Denominador</th>
          </tr>
        </thead>
        <tbody>
          {
            this.state.listaDistribucion.map(distribucion => {
              return (
                <tr key={distribucion.codigo}>
                  <td>{distribucion.cedula}</td>
                  <td>{distribucion.nombre}</td>
                  <td>{distribucion.contrato}</td>
                  <td>{distribucion.codigo}</td>
                  <td>{distribucion.cargo}</td>
                  <td>{distribucion.centroCosto}</td>
                  <td>{distribucion.centroCostosContabilidad}</td>
                  <td>{distribucion.sucursal}</td>
                  <td>{distribucion.areaNegocio}</td>
                  <td>{formatterPeso.format(distribucion.valorDistribucion)}</td>
                  <td>{distribucion.porcentajeDistribucion}</td>
                  <td>{distribucion.porcentajeAcomulado}</td>
                  <td>{formatterPeso.format(distribucion.valorTotalDenominador)}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
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
        <h1>Reporte Distribución Contable</h1>
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
              {this.renderTablaDistribucion()}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

ReporteDistribucionContable.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ReporteDistribucionContable);

export { VistaRedux as RReporteDistribucionContable };
