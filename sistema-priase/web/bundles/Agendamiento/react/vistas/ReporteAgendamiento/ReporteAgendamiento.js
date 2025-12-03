import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Botonera, Combo, Fecha, Util } from 'appfuture-react';
import axios from 'axios';

import RUTAS_API from '../../global/rutas_api';
import { mostrarAlerta } from '../../store/actions/AplicacionAcciones';

class ReporteAgendamiento extends Component {

  state = {
    mostrarModalConsulta: false,
    listaEmpresas: [],
    listaUnidadesResponsables: [],
    listaProcesos: [],
    listaMunicipios: [],
    listaUggi: [],
    municipio:'-1',
    unidadResponsable:'-1'
  };

  componentDidMount() {
    this.ejecutarConsultas();
  }

  /**
 * Comprueba una respuesta de una petición y retorna los datos que de la misma.
 * @param {Object} response
 * @param {Object|Array} defaultData
 * @return {Object|Array}
 */
  obtenerDatos = (response, defaultData = []) => {
    return Array.isArray(response.data) ? response.data : defaultData;
  };

  /**
   * Consultará las empresas...
   */
  listarEmpresas = () => {
    axios.get(RUTAS_API.REPORTE_AGENDAMIENTO.LISTAR_EMPRESAS)
      .then(respuesta => {
        const datos = this.obtenerDatos(respuesta);
        console.log(datos, respuesta);
        this.setState({ listaEmpresas: datos });
      });
  };

  /**
   * Consultará los procesos...
   */
  listarProcesos = () => {
    axios.get(RUTAS_API.REPORTE_AGENDAMIENTO.LISTAR_PROCESO)
      .then(respuesta => {
        const datos = this.obtenerDatos(respuesta);
        this.setState({ listaProcesos: datos });
      })
  }

  /**
   * Consultará los municipios...
   */
  listarMunicipios = () => {
    axios.get(RUTAS_API.REPORTE_AGENDAMIENTO.LISTAR_MUNICIPIOS)
      .then(respuesta => {
        const datos = this.obtenerDatos(respuesta);
        this.setState({ listaMunicipios: datos });
      })
  }

  /**
   * Listará las unidades responsables...
   */
  listarUnidadesResponsables = () => {
    const { proceso } = this.state;
    axios.post(RUTAS_API.REPORTE_AGENDAMIENTO.LISTAR_UNIDADES_RESPONSABLES, {
      proceso: proceso,
      idempresa: ''
    })
      .then(respuesta => {
        const datos = this.obtenerDatos(respuesta);
        this.setState({ listaUnidadesResponsables: datos });
      })
  };

  /**
   * Ejecutará las consultas...
   */
  ejecutarConsultas = () => {
    this.listarEmpresas();
    this.listarProcesos();
    this.listarMunicipios();    
  };

  componentWillUnmount() {
    this.props.history.replace({ entidadEditar: null });
  }

  limpiarFormulario = (evento) => {
    this.setState({
      mostrarModalConsulta: false,
      listaUggi: [],
      empresa: '',
      proceso: '',
      municipio: '',
      unidadResponsable: '',
      fechaInicial: '',
      fechaFinal: '',
    });
  };

  componentWillUnmount() {
    this.limpiarFormulario();
  }

  /**
   * Obtiene las opciones de la sección menú del programa.
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Limpiar Formulario', callback: this.limpiarFormulario }
    ];
  };


  /**
   * Valida que un valor sea diferente de vacio o -1.
   * @return {Boolean}
   */
  validarValor = (valor) => {
    return !valor || valor == '' || valor == '-1';
  }

  /**
   * Validará el formulario
   * @return {Object}
   */
  validarFormulario = () => {
    const { empresa, proceso, fechaInicial, fechaFinal } = this.state;
    if (this.validarValor(empresa)) {
      return { respuesta: false, mensaje: 'Debe seleccionar una empresa.' };
    }
    if (this.validarValor(proceso)) {
      return { respuesta: false, mensaje: 'Debe seleccionar un proceso.' };
    }
    if (this.validarValor(fechaInicial)) {
      return { respuesta: false, mensaje: 'Debe seleccionar una fecha inicial.' };
    }
    if (this.validarValor(fechaFinal)) {
      return { respuesta: false, mensaje: 'Debe seleccionar una fecha final.' };
    }
    return { respuesta: true };
  };


  consultarEntidad = () => {
    this.setState({ mostrarModalConsulta: true });
  };

  controlarCambio = (evento) => {
    let change = {};
    const { name, value } = evento.target;
    change[name] = value;
    this.setState(change, () => {
      this.validarConsultas(name, value);
    });
  };

  /**
  * Valida las consultas y procesos que debe ejecutar cuando cambia el valor de un componente.
  */
  validarConsultas = (name, value) => {
    switch (name) {
      case 'proceso':    
        this.listarUnidadesResponsables();
        break;
      case 'empresa':
        break;
    }
  }

  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false
    });
  };

  consultar = () => {
    const respuesta = this.validarFormulario();
    if (!respuesta.respuesta) {
      this.props.mostrarAlerta('Información', respuesta.mensaje);
      return;
    }
    const { empresa, proceso, fechaInicial, fechaFinal,municipio,unidadResponsable } = this.state;
    axios.post(RUTAS_API.REPORTE_AGENDAMIENTO.CONSULTAR_UGUII, {
      "empresa": empresa,
      "proceso": proceso,
      "fechaini": fechaInicial,
      "fechafin": fechaFinal,
      "municipio":municipio,
      "unidadresponsable":unidadResponsable
    }).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        this.setState({ listaUggi: respuesta.data.datos.ugii });
      } else {
        this.props.mostrarAlerta('Error', 'Lo sentimos no ha se encontrado información disponible.');
      }
    });
  };

  /**
   * Escribe el archivo y ejecuta la descarga...
   */
  generarArchivo = (respuesta) => {
    let a = document.createElement('a');
    a.href = 'data:' + { type: "Content-Type: application/vnd.ms-excel" } + ';base64,' + respuesta.data.datos;
    a.download = "Agendamiento_Ugii.xls";
    a.target = '_blank';
    a.click();
  };

  /**
   * Consulta el reporte en el sistema y ejecuta la función de descarga...
   */
  descargarReporte = () => {
    const respuesta = this.validarFormulario();
    if (!respuesta.respuesta) {
      this.props.mostrarAlerta('Información', respuesta.mensaje);
      return;
    }
    const { empresa, proceso, fechaInicial, fechaFinal, municipio, unidadResponsable } = this.state;
    axios.post(RUTAS_API.REPORTE_AGENDAMIENTO.EXPORTAR_REPORTE, {
      "empresa": empresa,
      "proceso": proceso,
      "fechaInicial": fechaInicial,
      "fechaFinal": fechaFinal,
      "nombreReporte": "Agendamiento_Ugii",
      "municipio": municipio,
      "unidadResponsable": unidadResponsable
    }).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        this.generarArchivo(respuesta);
      } else {
        this.props.mostrarAlerta('Error', 'Lo sentimos, no hemos podido generar el reporte.');
      }
    });
  }

  /**
   * Ordena las fechas de la tabla uguui.
   * @returns {Array}
   */
  ordenarFechas = (listaFechas) => {
    let fechas = listaFechas.map(fecha => {
      return (new Date(fecha.agauFechaasigancion)).getTime();
    });
    let listaFinal = [];
    fechas = fechas.sort();
    fechas.forEach((fecha, index) => {
      const item = listaFechas.find(f => {
        if ((new Date(f.agauFechaasigancion)).getTime() == fecha) {
          return f;
        }
      });
      if (item != null) {
        listaFinal.push(item);
      }
    });
    return listaFinal;
  };

  /**
   * Parsea una fecha en el formato estandar usado en el sistema.
   * @return {String}
   */
  parsearFecha = (fecha) => {
    /*const date = new Date(fecha);
    let dia = date.getDate() + 1;
    let mes = date.getMonth() + 1;
    let anio = date.getFullYear();
    if (dia < 10) {
      dia = '0' + dia;
    }
    if (mes < 10) {
      mes = '0' + mes;
    }*/
    const date = fecha.split("-")
    let dia = date[2];
    let mes = date[1];
    let anio = date[0];
    return `${dia}/${mes}/${anio}`;
  };

  /**
   * Crea los grupos de la consulta que ha generado la consulta Ugii y ordena las fechas...
   * @return {Array} listaFechas
   * @return {Array} grupos
   */
  obtenerGruposYFechasOrdenadas = (lista) => {
    let listaFechas = [];
    let grupos = [];
    //Hacemos un foreach a la lista...
    lista.forEach((item, index) => {
      //Buscamos las fechas...
      const indice = listaFechas.findIndex(i => i.agauFechaasigancion == item.agauFechaasigancion);
      if (indice < 0) {
        listaFechas.push(item);
      }
      //Aqui buscamos los grupos...
      let indiceGrupo = grupos.findIndex(g => g.name == item.proyectoNom);
      if (indiceGrupo < 0) {
        grupos.push({ name: item.proyectoNom, array: [] });
        indiceGrupo = (grupos.length - 1);
      }
      grupos[indiceGrupo].array.push(item);
    });

    listaFechas = this.ordenarFechas(listaFechas);

    return { listaFechas, grupos };
  };

  /**
   * Renderiza la tabla Ugii
   * @return {Component}
   */
  renderTablaUgii = () => {
    const lista = this.state.listaUggi;
    if (!Util.validarArreglo(lista)) {
      return null;
    }

    const { listaFechas, grupos } = this.obtenerGruposYFechasOrdenadas(lista);

    return (
      <div className='table-responsive'>
        <table className='table table-striped table-bordered table-hover table-condensed'>
          <thead className='text-center'>
            <tr>
              <th>Municipio</th>
              {
                listaFechas.map(item => {
                  return <th>{this.parsearFecha(item.agauFechaasigancion)}</th>
                })
              }
            </tr>
          </thead>
          <tbody className='text-center'>
            {
              grupos.map(grupo => {
                return (
                  <tr key={grupo.name}>
                    <td>{grupo.name}</td>
                    {
                      listaFechas.map(itemFecha => {
                        const item = grupo.array.find(i => i.agauFechaasigancion == itemFecha.agauFechaasigancion);
                        const valor = (item) ? item.catindad : '---';
                        return (<td>{valor}</td>);
                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    )
  }

  render() {
    return (
      <Fragment>
        <h1>Reporte Agendamiento</h1>
        <Botonera funciones={this.obtenerFunciones()} />

        <div className='caja contenedor'>
          <label className='tag'>Filtro</label>
          <div className='formulario'>
            <Combo
              opciones={this.state.listaEmpresas}
              propTexto='empresaNom'
              propValor='empresaCod'
              label='Empresa: *'
              name='empresa'
              value={this.state.empresa}
              onChange={this.controlarCambio}
            />
            <Combo
              opciones={this.state.listaProcesos}
              propTexto='prcDescripcion'
              propValor='uniProceso'
              label='Proceso: *'
              name='proceso'
              value={this.state.proceso}
              onChange={this.controlarCambio}
            />
            <Combo
              opciones={this.state.listaUnidadesResponsables}
              propTexto='cuadrillaNom'
              propValor='ureIderegistro'
              label='Unidad Responsable:'
              name='unidadResponsable'
              value={this.state.unidadResponsable}
              onChange={this.controlarCambio}
            />
            <Combo
              opciones={this.state.listaMunicipios}
              propTexto='ciudadNom'
              propValor='ciudadIderegistro'
              label='Municipio:'
              name='municipio'
              value={this.state.municipio}
              onChange={this.controlarCambio}
            />
            <Fecha
              label='Fecha Inicial: *'
              name='fechaInicial'
              fecha={this.state.fechaInicial}
              onChange={this.controlarCambio}
            />
            <Fecha
              label='Fecha Final: *'
              name='fechaFinal'
              fecha={this.state.fechaFinal}
              onChange={this.controlarCambio}
            />
            <div className='col-md-12'>
              <button className='btn btn-primary mr-3' onClick={this.consultar}>Consultar</button>
            </div>
          </div>
        </div>
        <div className='row pl-3 pr-3 pt-5'>
          <div className='col-md-12'>
            {this.renderTablaUgii()}
          </div>
        </div>
      </Fragment>
    );
  }
}

ReporteAgendamiento.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ReporteAgendamiento);

export { VistaRedux as RReporteAgendamiento };
