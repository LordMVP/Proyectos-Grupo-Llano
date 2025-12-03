import React, { Component } from 'react'
import { Combo, Input, Fecha, Tabla, TextArea } from 'appfuture-react'

import Autocompletado from '../../../Assets/componentes/Autocompletado'
import API from '../../../../global/rutas_api'
import Peticion from '../../../../global/peticion'
import { toast } from 'react-toastify'
import Util from '../../../../global/util'
import axios from 'axios';

const opciones = {
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

/**
 *
 *
 * @class Actividades
 * @extends {Component}
 */
class Actividades extends Component {

  /**
  *Define estados iniciales
  * @memberof Actividades
  */
  state = {
    lista: [],
    colaboradorJson: this.props.colaboradorJson || [],
    actividadJson: [],
    lista: this.props.lista || [],
    // defecto
    observaciones: '',
    colaborador: '',
    actividad: '',
    fechaActividad: '',
    cantidad: '',
    estado: false,
    idActividad:''
  }

  columnas = [
    {
      Header: 'Actividades',

      columns: [
        { Header: 'Actividad', accessor: 'actDescripci' },
        { Header: 'Cantidad', accessor: 'ejeCantactiv' },
        { Header: 'Colaborador', accessor: 'conNomcontra' },

        {
          Header: 'Fecha',
          accessor: 'ejeFechejec',
          Cell: (props) => {
            return props.value;
          }
        },
        {
          Header: 'Acción',
          accessor: 'actDescripci',
          Cell: (props) => {
            const click = () => {
              if (props.original.ancIderegistro) {
                this.setState({ idActividad: props.original.ancIderegistro })
                this.eliminar();
                let mensaje = 'No se puede eliminar una actividad liquida';
                toast.error(mensaje, opciones); // Falta incluir la confirmacion cuando si se puede eliminar
              }

              else {
                // eliminar
                let datos = this.props.value
                const indice = props.index - this.state.lista.length

                datos = datos.filter(function (value, index) {
                  return index !== indice
                })

                this.props.onChange({ target: { id: 'actividades', value: datos } })
              }
            }

            return (
              <button className="btn" onClick={click}>
                <span>eliminar</span>
              </button>
            )
          },
        },
      ],
    },
  ]

	/**
     *
     *Habilita el botón agregar
     *@method
     *@param {Object} props
     *@return {JSX} Componente - Button
     */

  BotonAgregar = () => {
    /* prettier-ignore */
    const { colaboradorJson, actividadJson, lista,
      colaborador, actividad, fechaActividad, cantidad } = this.state;
    return Util.validarObjeto({
      colaboradorJson, actividadJson, lista,
      colaborador, actividad, fechaActividad, cantidad
    })
      ? <button className="btn" onClick={this.agregar}>agregar</button>
      : <button className="btn" disabled={true}>agregar</button>
  };

  /**
   * Método encargado de renderizar el botón de guardar.
   */

  /**
 *
 *Habilita el botón guardar
 *@method
 *@param {Object} props
 *@return {JSX} Componente - Button
 */
  BotonGuardar = () => {
    return (this.props.value.length > 0)
      ? <button className="btn" onClick={this.guardar}>Guardar</button>
      : <button className="btn" disabled={true}>Guardar</button>
  };

  /**
   * Método encargado de guardar las actividades
   * @returns {Boleean}
   */
  guardar = async () => {
    //this.limpiarCampos();
    this.props.onChange({ target: { id: 'actividades', value: [] } });
    await this.props.guardar();
    this.obtenerLista();
  };

  // interno
  componentDidUpdate(prev) {
    if (prev.servicio.id !== this.props.servicio.id) {
      this.obtenerLista()
    }
    if (prev.colaboradorJson !== this.props.colaboradorJson) {
      this.setState({ colaboradorJson: this.props.colaboradorJson })
    }
  }

  eliminar = ()=>{
      
  }

  /**
   * Realiza las consultas previas para listar los elementos que irán en los combobox
   * @method
   * @async
   */
  componentDidMount() {
    const { servicio } = this.props
    if (this.props.colaboradorJson != null && this.props.colaboradorJson.length == 0) {
      let mensaje = 'No se encontro ningún colaborador';
      toast.info(mensaje, opciones);
    }
    // lista
  }

  /**
   * Cambia el valor del estado asociado a cada componente
   * @method
   * @async
   * @param {int} id al nombre del estado que se desea modificar
   * @param {(int|string)} value del componente correspondiente al dato
   * que se visualizará en el componente
   */
  change = async ({ target: { id, value } }) => {
    await this.setState({ [id]: value });
    if (id == 'colaborador') {
      const { colaboradorJson } = this.state;
      const colaboradorSeleccionado = colaboradorJson.find(c => c.valor == value);
      if (colaboradorSeleccionado != null || !typeof colaboradorSeleccionado === 'undefined') {
        this.consultarActividadesPorColaborador(colaboradorSeleccionado);
      }
    }
  }

  /**
   * Método encargado de construir un objeto con las actividades consultadas.
   * @param {Array} datos Datos de las actividades consultadas.
   */
  obtenerObjeto = (datos) => {
    if (datos.length == 0) {
      return [];
    }
    return datos.map((dato) => {
      dato.texto = dato.actIdeactivi + ' - ' + dato.actDescripci;
      dato.valor = dato.actIdeactivi + ' - ' + dato.actDescripci;
      return dato;
    });
  };

  /**
   * Método encargado de consultar las actividades por colaborador
   * @param {Object} colaboradorSeleccionado Datos del colaborador seleccionado.
   */
  consultarActividadesPorColaborador = (colaboradorSeleccionado) => {
    const parametros = {
      empresaContratante: this.props.servicio.contratante,
      empresaContratista: this.props.servicio.contratista,
      cargo: colaboradorSeleccionado.cargCodcargo
    };
    axios.post(API.BUSQUEDA_SERVICIOS.LISTAR_ACTIVIDADES, parametros)
      .then(respuesta => {
        const datos = this.obtenerObjeto(respuesta.data);
        this.setState({ actividadJson: datos });
      });
  };

  /**
   * Validar formulario para relacionar actividades a suscripciones.
   * @returns {Boolean}
   */
  validarFormulario = () => {
    const { colaboradorJson, colaborador, actividad, actividadJson } = this.state;
    if (colaboradorJson.length == 0) {
      toast.error('No se encontro el colaborador en la lista', opciones);
      return false;
    }
    if (actividadJson.length == 0) {
      toast.error('No se encontro la actividad en la lista', opciones);
      return false;
    }
    if (colaborador != '') {
      const colaboradorSeleccionado = colaboradorJson.find(c => c.valor == colaborador);
      if (colaboradorSeleccionado == null || typeof colaboradorSeleccionado === 'undefined') {
        toast.error('El colaborar digitado no existe', opciones);
        return false;
      }
    }
    if (actividad != '') {
      const actividadSeleccionada = actividadJson.find(c => c.valor == actividad);
      if (actividadSeleccionada == null || typeof actividadSeleccionada === 'undefined') {
        toast.error('La actividad digitada no existe', opciones);
        return false;
      }
    }
    return true;
  };

  /**
   *
   *
   *Agregar información de actividades en la lista y a su vez en la tabla
   *@method
   */
  agregar = () => {
    const servicio = this.props.servicio
    const fecha = this.state.fechaActividad
    const validacion = this.validarFormulario();
    if (!validacion) {
      return false;
    }
    const datos = [
      ...this.props.value,
      {
        empCodempresa: servicio.contratante,
        actIdeactivi: Util.obtenerId(this.state.actividad),
        colCodiemple: Util.obtenerId(this.state.colaborador),
        colNumContr: Util.obtenerId(this.state.colaborador, 1),
        sigueIde: this.props.sigueIde,
        sigueCodsus: servicio.suscriptor,
        etaIdeetapa: servicio.id,
        conIdecontra: servicio.contratista,
        dsusIderegistro: servicio.ideSuscriptor,
        ejeCantactiv: this.state.cantidad,
        ejeFechejec: fecha,
        ejeObservaciones: this.state.observaciones,
        proyectoIderegistro: this.props.idRegistro,

        //uso de la tabla
        actDescripci: Util.obtenerId(this.state.actividad, 1),
        conNomcontra: Util.obtenerId(this.state.colaborador, 2),

      },
    ]

    this.props.onChange({ target: { id: 'actividades', value: datos } });

    // final

    this.limpiarCampos()
  }

  /**
   * Encargado de limpiar el formulario de actividades
   * @method
   */
  limpiarCampos = () => {
    this.setState({
      observaciones: '',
      actividad: '',
      fechaActividad: '',
      cantidad: '',
      colaborador: ''
    });
  }

  /**
  * Realizar petición con los parámetros del formulario para llenar la tabla de actividades
  * @method
  */
  async obtenerLista() {
    const { servicio } = this.props

    // peticion
    let lista = await Peticion.post({
      url: API.BUSQUEDA_SERVICIOS.CONSULTAR_ACTIVIDADES,
      parametros: {
        ordenTrabajo: servicio.ordenTrabajo,
        servicio: servicio.id,
        contratante: servicio.contratante
      },
    })

    if (lista.length == undefined) return // no hay datos

    lista = lista.map(function (dato) {
      let { actividad, colaborador } = dato

      return {
        actDescripci: actividad.actDescripci,
        ejeCantactiv: dato.ejeCantactiv,
        conNomcontra: `${colaborador.colMombres.trim()} ${colaborador.colApellidos.trim()}`,
        ejeFechejec: dato.ejeFechejec,
      }
    })

    this.setState({ lista })
  }

  /**
   * Método encargado de consultar las actividades por servicio.
   * @method
   */
  consultarActividadesServicio = () => {
    let listaConsultaActividades = Peticion.post({
      url: API.BUSQUEDA_SERVICIOS.CONSULTAR_ACTIVIDADES,
      parametros: {
        ordenTrabajo: this.props.servicio.ordenTrabajo,
        servicio: this.props.servicio.id,
        contratante: this.props.servicio.contratante,
      },
    });

    listaConsultaActividades = listaConsultaActividades.map(function (dato) {
      let { actividad, colaborador } = dato
      return {
        actDescripci: actividad.actDescripci,
        ejeCantactiv: dato.ejeCantactiv,
        conNomcontra: `${colaborador.colMombres.trim()} ${colaborador.colApellidos.trim()}`,
        ejeFechejec: dato.ejeFechejec,
      }
    });
    this.setState({ lista: listaConsultaActividades });
  };

  /**
   * Método encargado de validar que se seleccione un colaborador
   *@method
   * @returns {Boleean}
   */
  validarColaborador = () => {
    const { colaborador, colaboradorJson } = this.state;
    if (colaboradorJson.length == 0) {
      return false;
    }
    if (!colaborador || colaborador == '') {
      return false;
    }
    const colaboradorSeleccionado = colaboradorJson.find(c => c.valor == colaborador);
    if (colaboradorSeleccionado == null || typeof colaboradorSeleccionado === 'undefined') {
      return false;
    }
    return true;
  };

  /**
   *Renderiza la vista 
   * @return {JSX} componente - returna vista jsx 
   */
  render() {
    return (
      <React.Fragment>
        <div className="contenedor formulario">
          <Autocompletado
            id="colaborador"
            label="colaborador"
            marcaAgua={'Escribe el colaborador'}
            opciones={this.state.colaboradorJson}
            onChange={this.change}
            value={this.state.colaborador}
            required={true}
            extra={{ disabled: (this.state.colaboradorJson.length == 0) ? true : false }}
          />
          {this.validarColaborador() === true &&
            <Autocompletado
              id="actividad"
              label="actividad"
              marcaAgua={'Escribe la actividad'}
              value={this.state.actividad}
              opciones={this.state.actividadJson}
              onChange={this.change}
              required={true}
            />
          }

          <Fecha
            id='fechaActividad'
            label='Fecha Actividad:'
            fecha={this.state.fechaActividad}
            onChange={this.change}
          />

          <Input
            id="cantidad"
            label="cantidad"
            type="number"
            value={this.state.cantidad}
            onChange={this.change}
          />
        </div>

        <div className="contenedor">
          <Input
            id="observaciones"
            label="observaciones"
            value={this.state.observaciones}
            onChange={this.change}
          />
        </div>

        <div className="contenedor botones">
          <this.BotonAgregar />
          <this.BotonGuardar />
        </div>

        <div className="contenedor">
          <Tabla
            datos={[...this.state.lista, ...this.props.value]}
            columnas={this.columnas}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default Actividades
