import React, { Component } from 'react'

import { Combo, Input, Tabla } from 'appfuture-react'

import Autocompletado from '../../Assets/componentes/Autocompletado'
import API from '../../../global/rutas_api'
import Peticion from '../../../global/peticion'
import Util from '../../../global/util.js'

import { toast } from 'react-toastify'

/**
 *
 *
 * @class Busqueda
 * @extends {Component}
 */
class Busqueda extends Component {
 
	/**
     *Define estados iniciales
     * @memberof class Busqueda
     */  
  state = {
    lista: [],

    // defecto

    agenda: '-1',
    servicio: '',
    cuadrilla: '',
    suscriptor: '', // 0194700240101
    ordenTrabajo: '',
  }

  montado = false

	/**
     *
     *Habilita el botón guardar
     *@method
     *@param {Object} props
     *@return {JSX} Componente - Button
     */

  BotonBuscar = () => {
    return this.state.suscriptor
      ? <button className="btn" onClick={this.buscar}>buscar</button>
      : <button className="btn" disabled={true}>buscar</button>
  }

 	/**
     *
     *Habilita el botón limpiar filtro
     *@method
     *@param {Object} props
     *@return {JSX} Componente - Button
     */ 
  BotonLimpiarFiltro = () => {
    return this.state.suscriptor
      ? <button className="btn" onClick={this.limpiarFiltro}>limpiar filtro</button>
      : <button className="btn" disabled={true}>limpiar filtro</button>
  }

	/**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @async
     */
  componentDidMount() {
    // cuadrillaJson

    Peticion.get({
      url: API.BUSQUEDA_SERVICIOS.FILTRAR_CUADRILLAS,
      config: {
        valor: 'cuadrillaCod',
        texto: 'cuadrillaNom',
      },
      callback: (cuadrillaJson) => this.setState({ cuadrillaJson }),
    })
  }

 	/**
     * Cambia el valor del estado asociado a cada componente
     * @method
     * @async
     * @param {int} id al nombre del estado que se desea modificar
     * @param {(int|string)} value del componente correspondiente al dato
     * que se visualizará en el componente
     */ 
  change = ({ target: { id, value } }) => {
    this.setState({ [id]: value })
  }

 	/**
     * Cambia el valor del estado asociado al filtro
     * @method
     * @async
     * @param {int} id al nombre del estado que se desea modificar
     * @param {(int|string)} value del componente correspondiente al dato
     * que se visualizará en el componente
     */   
  changeFilter = async ({ target: { id, value } }) => {
    await this.setState({ [id]: value })
    await this.consultar()
  }

    /**
     *Detecta el cambio de estado, al digitar en el campo de texto
     *@method
     *@param {Object} e - Adjudicado a un campo de texto
     */  
  changeBlur = async ({ target: { id, value } }) => {
    if (this.state.suscriptor) this.consultar()
  }

  // vista

  /**
   *
   *Busca por suscriptor y lista las agendas y servicios para colovarlo en los combobox
   * @async
   * @method
   * 
   */
  buscar = async () => {
    // agendaJson

    await Peticion.post({
      url: API.BUSQUEDA_SERVICIOS.FILTRAR_AGENDAS,
      parametros: {
        suscriptor: this.state.suscriptor,
      },
      config: {
        valor: 'agendaCod',
        texto: 'agendaNom',
      },
      callback: (agendaJson) => this.setState({ agendaJson }),
    });

    // serviciosJson

    await Peticion.postCustom({
      url: API.BUSQUEDA_SERVICIOS.FILTRAR_SERVICIOS,
      parametros: {
        suscripcion: this.state.suscriptor,
      },
      config: {
        valor: 'servicioCod',
        texto: 'servicioNom',
      },
      callback: (servicioJson) => this.setState({ servicioJson }),
    });

    // consultar

    this.consultar()
  }

  /**
   *
   *Realiza la consulta conlos campos diligenciados en el formulario y los lista en la tabla
   * @method
   * @async
   * 
   */
  consultar = async () => {

    let lista = await Peticion.post({
      url: API.BUSQUEDA_SERVICIOS.BUSCAR_SERVICIO,
      parametros: {
        suscriptor: this.state.suscriptor,
        servicio: Util.obtenerId(this.state.servicio),
        agenda: Util.obtenerId(this.state.agenda),
        ordenTrabajo: this.state.ordenTrabajo,
        cuadrilla: Util.obtenerId(this.state.cuadrilla),
      },
    });

    if (lista.length == 0 || lista.length == undefined) {
      // no hay datos

      const mensaje = 'La consulta no retorno ningun registro'
      const opciones = {
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }

      //limpiar tabla
      this.setState({ lista: [] })
      toast.info(mensaje, opciones)
      return
    }

    lista = lista.map(function (servicio) {
      let { suscriptores, servicios, desuscriptor } = servicio

      return {
        id: servicios.servicioCod,
        agenda: servicio.sigueCodage,
        nombreAgenda: `${servicio.sigueCodage} - ${servicio.sigueCodageNom}`,
        contratante: servicio.sigueCodemp,
        contratista: servicio.sigueEmpcon,
        cuadrilla: (servicio.sigueCodcua && servicio.sigueCodcuaNom) ? `${servicio.sigueCodcua} - ${servicio.sigueCodcuaNom}` : '',
        ordenTrabajo: servicio.sigueOrdtra,
        suscriptor: suscriptores.clienteCodsus,
        suscriptorNombre:suscriptores.clienteNomsus,
        servicioNombre: servicios.servicioNom,
        sigueIde: servicio.sigueIde,
        sigueCoddepemp: servicio.sigueCoddepemp,
        suscriptorCodigo:suscriptores.clienteCodsus,
        suscriptorDireccion:suscriptores.clienteCoddir,
        suscriptorTelefono:suscriptores.clienteCodtel,
        ideSuscriptor:desuscriptor.dsusIderegistr
      }
    });

    await this.setState({ lista });
    this.props.onChangeLista(lista);
  }

	/**
	 *
	 *Limpiar el formulario
	 * @method
	 * 
	 */  
  limpiarFiltro = async () => {
    // limpiar

    await this.setState({
      agenda: '-1',
      servicio: '-1',
      cuadrilla: '-1',
      ordenTrabajo: '',
    })

    // consultar

    await this.consultar()
  }

  /**
   *
   *
   * Deshabilita el elemento de la tabla
   * @method
   * @return {boolean}  
   */
  get deshabilitarElemento() {
    const { lista, suscriptor } = this.state

    return !(Util.validarArreglo(lista) && suscriptor.length)
  }

   /**
   *
   *
   * Deshabilita la agenda de la tabla
   * @method
   * @return {boolean}  
   */ 
  get deshabilitarAgenda() {
    const { agendaJson } = this.state
    const valido = Util.validarArreglo(agendaJson)

    return !(valido && !this.deshabilitarElemento)
  }

    /**
   *
   *
   * Deshabilita el servicio de la tabla
   * @method
   * @return {boolean}  
   */ 
  get deshabilitarServicio() {
    const { servicioJson } = this.state
    const valido = Util.validarArreglo(servicioJson)

    return !(valido && !this.deshabilitarElemento)
  }

     /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */ 
  render() {
    const { BotonBuscar, BotonLimpiarFiltro } = this

    return (
      <React.Fragment>
        <h1>Busqueda de servicios</h1>

        <div className="contenedor fila">
          <Input
            id="suscriptor"
            label="Suscripción"
            value={this.state.suscriptor}
            onChange={this.change}
            required={true}
          />

          <span>
            <BotonBuscar />
          </span>
        </div>

        <fieldset className="contenedor">
          <legend>filtros</legend>

          <span className="formulario">
            <Combo
              id="servicio"
              label="servicio"
              value={this.state.servicio}
              opciones={this.state.servicioJson}
              onChange={this.changeFilter}
              extra={{
                disabled: this.deshabilitarServicio
              }}
            />

            <Input
              id="ordenTrabajo"
              label="orden trabajo"
              value={this.state.ordenTrabajo}
              onChange={this.change}
              extra={{
                onBlur: this.changeBlur,
                disabled: this.deshabilitarElemento,
              }}
            />

            <Combo
              id="agenda"
              label="agenda"
              value={this.state.agenda}
              opciones={this.state.agendaJson}
              onChange={this.changeFilter}
              extra={{
                disabled: this.deshabilitarAgenda
              }}
            />

            <Autocompletado
              id="cuadrilla"
              label="cuadrilla"
              marcaAgua={'Escribe el número de la cuadrilla'}
              opciones={this.state.cuadrillaJson}
              onChange={this.changeFilter}
              value={this.state.cuadrilla}
              required={true}
              extra={{
                disabled: false
              }}
            />
            <div>
              <BotonLimpiarFiltro />
            </div>
          </span>
        </fieldset>      
      </React.Fragment>
    )
  }
}

export default Busqueda
