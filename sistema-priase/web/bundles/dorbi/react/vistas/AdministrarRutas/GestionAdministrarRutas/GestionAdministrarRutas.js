import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util } from 'appfuture-react';
import axios from 'axios';
import { formatearArray } from '../../../global/util_nominaciones';
import RUTAS_API from '../../../global/rutas_api';
import { mostrarAlerta } from '../../../store/actions/AplicacionAcciones';
import './GestionAdministrarRutas.scss';
import { RConsultaEmpresa } from '../ConsultaEmpresas';
import { RConsultaRutas } from '../ConsultaRutas';
import { CLASES_UNIDADES } from '../../../global/constantes';


const ACTIVO = 'A';
class GestionAdministrarRutas extends Component {

  state = {
    // Datos de la entidad
    idRegistro: '',
    nombre: '',
    tipoRuta: '',
    ciclo: '',
    codigo: '',
    listaTipoRuta: [],
    listaCiclo: [],
    empresasSeleccionadas: [],
    listaFiltrada: [],
    // Estado de la aplicacion
    mostrarModalConsulta: false,
    mostrarModalEmpresa: false,

  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
    const peticiones = [
      axios.post(RUTAS_API.PARAMETRIZACION.ADMINISTRAR_RUTAS.CONSULTAR_CICLO),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { idClase: CLASES_UNIDADES.TIPO_RUTA }),
    ];
    axios.all(peticiones)

      .then(axios.spread((ciclos, tipoRutas, ) => {
        const datosAplicacion = {
          listaCiclo: [],
          listaTipoRuta: [],
        };
        if (ciclos.data.codigo > 0) {
          datosAplicacion.listaCiclo = formatearArray(ciclos.data.datos);
        }
        if (tipoRutas.data.codigo > 0) {
          datosAplicacion.listaTipoRuta = formatearArray(tipoRutas.data.datos);
        }
        this.setState({ ...datosAplicacion });
      }));
  };

  /**
   * Método encargado de armar un objeto con los datos necesarios para los tipos de ruta
   * @returns {Array}
   */
  armarObjeto = (listaRutas) => {
    const lista = listaRutas.map((dato, index) => {
      return {
        informacionNombre: dato.info.tipo,
        terNomcompleto: dato.terNomcompleto,
        terIderegistro: dato.terIderegistro,
        terInfoadicional: dato.terInfoadicional,
        uniIderegistro: dato.uniTiptercero.uniIderegistro
      }
    });
    return lista;
  };

  /**
   * Método encargado ejecutar una acción cuando se elimina el componente
   */
  componentWillUnmount() {
    this.props.history.replace({ entidadEditar: null });
  };

  /**
   * Método encargado de limpiar los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  limpiarFormulario = (evento) => {
    this.setState({
      // Datos de la entidad
      idRegistro: '',
      nombre: '',
      tipoRuta: '',
      ciclo: '',
      codigo: '',
      empresasSeleccionadas: [],
      // Estado de la aplicacion
      mostrarModalConsulta: false,
      mostrarModalEmpresa: false,

    });
  };

  /**
   * Método encargado de limpiar el formulario al momento de salir
   */
  componentWillUnmount() {
    this.limpiarFormulario();
  };

  /**
   * Método encargado de generar los botones del formulario
   * @returns {Object}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Guardar', callback: this.guardarEntidad },
      { texto: 'Consultar', callback: this.consultarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    const { nombre, tipoRuta, empresasSeleccionadas, ciclo, codigo ,idRegistro } = this.state;

    const empresasActivas = empresasSeleccionadas.filter(p => p.ruem_estado == 'A');

    // Validaciones
    if (nombre.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar el nombre' } };
    }

    if (tipoRuta <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el tipo de ruta' } };
    }

    if (ciclo <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el ciclo' } };
    }

    if (codigo.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar el codigo o numicro de la ruta' } };
    }

    if (!Util.validarArreglo(empresasSeleccionadas)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe agregar al menos una empresa' } };
    }

    if (idRegistro != '') {
      if (!Util.validarArreglo(empresasActivas)) {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe agregar al menos una empresa' } };
      }
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de obtener un objeto con los datos necesarios de las empresas
   * @returns {Array}
   */
  obtenerEmpresas = () => {
    const lista = this.state.empresasSeleccionadas.map((dato, index) => {
      return {
        ruemIderegistr: (dato.ruem_ideregistro) ? dato.ruem_ideregistro : null,
        empIderegistro: {
          empresaSevemp: (dato.empresaSevemp) ? dato.empresaSevemp : dato.empresaSevemp,
        },
        accion: dato.ruem_estado
      }
    });
    return lista;
  };

  /**
   * Método encargado de guardar los datos de la entidad
   * @returns {bool}
   */
  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    const { idRegistro, nombre, ciclo, codigo ,tipoRuta, listaTipoRuta } = this.state;
    const rutaSeleccionada = listaTipoRuta.find(p => p.uniIderegistro == tipoRuta);
    const entidadGuardar = {
      rutIderegistro: idRegistro,
      rutNombre: nombre,
      rutCodigo: codigo ,
      uniTiporuta: tipoRuta,
      cicIderegistro: {
        cicIderegistro: (ciclo === '') ? null : parseInt(ciclo),
      },
      listaValores: this.obtenerEmpresas(),
    };

    axios.post(RUTAS_API.PARAMETRIZACION.ADMINISTRAR_RUTAS.GUARDAR, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de abrir la ventana modal del boton consulta
   */
  consultarEntidad = () => {
    this.setState({ mostrarModalConsulta: true });
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  /**
  * Método encargado de eliminar la empresa seleccionada seleccionado
  * @param {number} posicion Posición del punto de entrada que se desea eliminar
  */
  eliminarEmpresa = (posicion) => {
    const lista = [...this.state.empresasSeleccionadas];
    lista.splice(posicion, 1);
    this.setState({ empresasSeleccionadas: lista });
  };

  /**
   * Método encargado de abrir el modal de empresas
   */
  abrirModalEmpresas = () => {
    this.setState({
      mostrarModalEmpresa: true
    });
  };

  /**
  * Método encargado de eliminar la empresa seleccionada
  * @param {number} posicion Posición del estrato que se desea eliminar
  * @param {Object} listaFiltrada Lista con las empresas inactivas
  */
  eliminarEmpresaEditar = (posicion, listaFiltrada) => {
    const lista = [...this.state.empresasSeleccionadas];
    const listaF = listaFiltrada;
    listaF[posicion].ruem_estado = 'E';
    if (!lista[posicion].ruem_estado || !lista[posicion].ruem_ideregistro) {
      lista.splice(posicion, 1);
      this.setState({ empresasSeleccionadas: lista, listaFiltrada: listaF });
      return;
    }
    lista[posicion].ruem_estado = 'E';
    this.setState({ empresasSeleccionadas: lista, listaFiltrada: listaF });
  };

  /**
   * Método encargado de mostrar una tabla con las empresas seleccionadas
   * @returns {Array}
   */
  renderEmpresas = () => {
    const { empresasSeleccionadas, idRegistro } = this.state;
    let { listaFiltrada } = this.state;
    listaFiltrada = empresasSeleccionadas.filter(p => p.ruem_estado == 'A');
    if (idRegistro != '') {
      return (
        <table className='table table-striped'>
          <thead>
            <tr>
              <th>Empresa</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {listaFiltrada.map((dato, index) => {
              return (
                <tr key={`empresa_${dato.empresa_nom}`}>
                  <td>{dato.empresa_nom}</td>
                  <td><button className='btnEliminar' onClick={() => {
                    this.eliminarEmpresaEditar(index, listaFiltrada)
                  }}>X</button>
                  </td>
                </tr>
              )
            })
            }
          </tbody>
        </table>
      )
    }
    return (
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Empresa</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {this.state.empresasSeleccionadas.map((dato, index) => {
            return (
              <tr key={`empresa_${dato.empresaNom}`}>
                <td>{dato.empresaNom}</td>
                <td><button className='btnEliminar' onClick={() => {
                  this.eliminarEmpresa(index)
                }}>X</button>
                </td>
              </tr>
            )
          })
          }
        </tbody>
      </table>
    )
  };

  /**
   * Método encargado de agregar el estado a las empresas seleccionadas
   * @returns {Array}
   */
  obtenerEmpresasActivas = (empresas) => {
    const { empresasSeleccionadas } = this.state;
    let lista = [];
    for (let index = 0; index < empresas.length; index++) {
      const empresa = empresas[index];
      lista.push(empresa);
      if (empresa.empresa_nom || empresa.ruem_estado) {
        continue;
      } else {
        lista[index].ruem_estado = 'A';
        lista[index].empresa_nom = empresa.empresaNom;
        lista[index].empresaNom = empresa.empresaNom;
      }
    }
    return lista;
  };

  /**
   * Método encargado de llenar la tabla con las empresas seleccionadas
   * @param {Object} empresas Datos de las empresas seleccionadas
   */
  onSeleccionarEmpresas = (empresas) => {
    this.setState({
      empresasSeleccionadas: this.obtenerEmpresasActivas(empresas),
      mostrarModalEmpresa: false,
    });
  };

  /**
   * Método encargado de devolver un arreglo con loas empresas de la ruta seleccionada
   * @returns {Array}
   */
  obtenerEmpresasConsultadas = (empresas) => {
    return empresas.map(dato => (
      {
        empresaCod: dato.empresa_cod,
        empresa_nom: dato.empresa_nom,
        empresaNom: dato.empresa_nom,
        empresa_cod: dato.empresa_cod,
        ruem_ideregistro: dato.ruem_ideregistr,
        ruem_estado: ACTIVO,
        empresaSevemp: dato.empresa_sevemp
      }
    ));
  };

  /**
   * Método encargado de cargar los datos de la ventana modal de consulta
   * @param {Object} entidad Datos seleccionados de la consulta
   */
  cargarDatos = (entidad) => {
    const empresas = (entidad.info) ? JSON.parse(entidad.info) : [];
    this.setState({
      mostrarModalConsulta: false,
      idRegistro: entidad.rutIderegistro,
      ciclo: entidad.cicIderegistro.cicIderegistro,
      tipoRuta: entidad.uniTiporuta,
      nombre: entidad.rutNombre,
      codigo: (entidad.rutCodigo) ? entidad.rutCodigo : '',
      empresasSeleccionadas: this.obtenerEmpresasConsultadas(empresas),
    });
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />
        <div className='conf-general row mt-5'>
          <Input
            label='Nombre:'
            value={this.state.nombre}
            onChange={this.controlarCambio}
            name='nombre'
          />
          <Input
            label='Codigo (Nu_Micro):'
            value={this.state.codigo}
            onChange={this.controlarCambio}
            name='codigo'
          />
          <Combo
            opciones={this.state.listaTipoRuta}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Tipo de Ruta:'
            name='tipoRuta'
            value={this.state.tipoRuta}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={this.state.listaCiclo}
            propTexto='cicNombre'
            propValor='cicIderegistro'
            label='Ciclo:'
            name='ciclo'
            value={this.state.ciclo}
            onChange={this.controlarCambio}
          />
        </div>
        <div className='col-6'>
          <p><b>Empresas</b></p>
          <button className='btn btn-primary' onClick={this.abrirModalEmpresas}>Seleccionar</button>
          <div className='pt-3'>
            {this.state.empresasSeleccionadas.length > 0 &&
              this.renderEmpresas()
            }
          </div>
        </div>
        <VentanaModal
          mostrar={this.state.mostrarModalEmpresa}
          titulo='Seleccionar Empresas'
          cerrarModal={() => this.setState({ mostrarModalEmpresa: false })}>
          <RConsultaEmpresa
            esModal
            seleccionMultiple
            entidadesSeleccionadas={this.state.empresasSeleccionadas}
            seleccionarEntidades={this.onSeleccionarEmpresas}
          />
        </VentanaModal>

        <VentanaModal
          mostrar={this.state.mostrarModalConsulta}
          titulo='Seleccionar Ruta'
          cerrarModal={() => this.setState({ mostrarModalConsulta: false })}>
          <RConsultaRutas
            esModal
            seleccionarEntidad={this.cargarDatos}
            listaCiclo={this.state.listaCiclo}
            listaTipo={this.state.listaTipoRuta}
          />
        </VentanaModal>
      </Fragment>
    );
  };
}

GestionAdministrarRutas.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionAdministrarRutas);

export { VistaRedux as RGestionAdministrarRutas };
