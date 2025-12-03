import React, { Component } from 'react'
import { Combo, Input } from 'appfuture-react'

import axios from 'axios'
import URL from '../../../global/rutas_api'
import Peticion from '../../Assets/util/peticion'
import Autocompletado from '../../Assets/componentes/Autocompletado'
import { Util } from '../../Assets/util/Util'
import Modal from '../../Assets/componentes/Modal'


/**
 *
 *
 * @class Pendientes
 * @extends {Component}
 */
class Pendientes extends Component {
    //inicialización de variables
   /**
     *Define estados iniciales
     * @memberof SolicitudAgendamiento
     */
    state = {
        mostrar: false,
        contratista: '-1',
        contratante: '-1',
        contratanteJson:[],
        proceso: '-1',
        cliente: '',
        agenda: '-1',
        servicio: '-1',
        municipio: '-1',
        reprogramar:false
    }

    peticion = new Peticion(this)

    // interno

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @async
     */

    async componentDidMount() {
        this.peticion.get({
            url: URL.PROGRAMACION_MANUAL.LISTAR_PROCESOS,
            config: ['uniProceso', 'prcDescripcion'],
            json: 'procesoJson',
            value: 'proceso',
        })
        this.peticion.get({
            url: URL.PROGRAMACION_MANUAL.LISTAR_MUNICIPIOS,
            config: ['ciudadCod', 'ciudadNom'],
            json: 'municipioJson',
            value: 'municipio',
        })
    }

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @param {Object} prepProps - Cargar atributos del componente
     * @async
     */

    componentDidUpdate(prepProps) {
        if (this.props.contratanteJson !== prepProps.contratanteJson) {
                this.setState({
                    contratanteJson: this.props.contratanteJson
                })
        }
        if (this.props.limpiar !== prepProps.limpiar) {
            if (this.props.limpiar) {
                this.setState({
                    agenda: '-1',
                    proceso: '-1',
                    autocompletadoMunicipio: undefined,
                    servicio: '-1',
                    actividad: '-1',
                    cliente: '',
                    venta: '',
                })
                this.props.onChange({ target: { id: 'limpiar', value: false } })
            }
        }
        if (this.props.idCont !== prepProps.idCont) {
            this.setState({
                contratante: this.props.idCont.idContratante,
                contratista: this.props.idCont.idContratista,
            })          

            if (this.props.idCont.idContratante === '-1' || this.state.proceso==='-1') {
                this.setState({
                    agendaJson: [],
                    agenda: '-1'
                })
            }
        }
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
        switch (id) {
            case 'contratante':
                this.props.onChange({ target: { id: 'contratante', value } })
                break;
            case 'proceso':
                this.props.onChange({ target: { id: 'proceso', value } })
                if (value === '-1' || this.props.idCont.idContratante === '-1') {
                    this.setState({
                        agendaJson: [],
                        agenda: '-1'
                    })
                } else {
                    this.peticion.post({
                        url: URL.PROGRAMACION_MANUAL.LISTAR_AGENDAS,
                        parametros: {
                            proceso: Util.obtenerId(value),
                            empresa: Util.obtenerId(this.props.idCont.idContratante, 1)
                        },
                        config: ['agendaCod', 'agendaNom'],
                        json: 'agendaJson',
                        value: 'agenda',
                    })
                }
                break;
            case 'agenda':
                if (value === '-1') return false
                //Crear lista servicios
                this.peticion.post({
                    url: URL.PROGRAMACION_MANUAL.LISTAR_SERVICIOS,
                    parametros: {
                        empresaContratante: Util.obtenerId(
                            this.props.idCont.idContratante
                        ),
                        agenda: Util.obtenerId(value),
                    },
                    config: ['servicioCod', 'servicioNom'],
                    json: 'servicioJson',
                    value: 'servicio',
                })               
                break
            case 'servicio':
                if (this.state.agenda === '-1') return false
                this.peticion.post({
                    url: URL.PROGRAMACION_MANUAL.LISTAR_ACTIVIDADES,
                    parametros: {
                        agenda: Util.obtenerId(this.state.agenda),
                        servicio: Util.obtenerId(value),
                        empresa:Util.obtenerId(this.props.idCont.idContratante, 0)
                    },
                    config: ['servicioCod', 'servicioNom'],
                    json: 'actividadJson',
                })

                break
        }
    }

    /**
     * Consultar Agendamiento que ya tiene el suscriptor
     */
    consultarAgendamiento = async () =>{
        await this.peticion
                    .post({
                        url: URL.SOLICITUD_AGENDAMIENTO.LISTAR_AGENDAMIENTO,
                        parametros: { 
                                    suscripcion: this.state.cliente,
                                    empresa:Util.obtenerId(this.state.contratante,1)
                                    }
                    })
                    .then((data) => {
                        this.setState({listaAgendamiento:data})
                        if(this.state.listaAgendamiento.length > 0){
                            const filtrarLista = this.state.listaAgendamiento;                        
                            let cadena = filtrarLista.map((fila) => {                           
                                return(
                                `Suscriptor: ${Util.obtenerId(fila.suscriptor)} ` +
                                `Fecha Programacion: ${Util.obtenerId(fila.fechaProgramacion)} ` +
                                `Cuadrilla: ${Util.obtenerId(fila.cuadrilla)} ` +
                                `Actividad: ${Util.obtenerId(fila.actividad)} ` +
                                `Usuario: ${Util.obtenerId(fila.usuario)} `      
                                
                                )
                            })
                            
                            this.setState({
                                titulo: '¡AGENDAMIENTO! Ya se encuentra agendamiento:',
                                texto: `${cadena}`,
                            })                            
                            this.setState({ mostrar: true,reprogramar:true })
                            
                        }else{this.setState({reprogramar:false})}
                    })    
    }

    /**
     *
     *Buscar filtrando información, previa selección de varios campos para listarlos en una tabla
     *@method
     */

    buscar = async () => {
        const { contratista, contratante, proceso, cliente } = this.state
        if (
            proceso === '-1' || 
            contratante === '-1' ||
            cliente === ''
        ) {
            await this.setState({ mensaje: [] })
            proceso === '-1' ? this.state.mensaje.push('Proceso') : ''
            contratante === '-1' ? this.state.mensaje.push('Contratante') : ''
            cliente === ''?this.state.mensaje.push(' Digitar suscriptor '):''
            //Modal
            this.setState({
                titulo: '¡FALTA INFORMACIÓN!',
                texto: `Para la búsqueda como mínimo debe escoger: ${this.state.mensaje.join(
                    ', '
                )}`,
            })
            //despliega modal
            this.setState({ mostrar: true })
            return false
        }

        await this.consultarAgendamiento();

        const datos = await this.peticion.post({
            url: URL.PROGRAMACION_MANUAL.CONSULTAR_ACTIVIDADES_PENDIENTES,
            parametros: {
                empContratante:
                    this.state.contratante === '-1' || this.state.contrante === ''
                        ? ''
                        : Util.obtenerId(this.state.contratante),
                idProceso:
                    this.state.proceso === '-1' || this.state.proceso === ''
                        ? ''
                        : Util.obtenerId(this.state.proceso),
                suscripcion:
                    this.state.cliente === '' ? '' : this.state.cliente,
                agenda:
                    this.state.agenda === '-1'
                        ? ''
                        : Util.obtenerId(this.state.agenda),
                servicio:
                    this.state.servicio === '-1'
                        ? ''
                        : Util.obtenerId(this.state.servicio),
                ciudad:
                    this.state.municipio === '-1'
                        ? ''
                        : Util.obtenerId(this.state.municipio),
            },
        })

        if (datos === null) {
            const lista = []
            this.props.onChange({ target: { id: 'lista', value: lista } })
        } else {
            const lista = datos.map((fila) => {
                return {
                    sigueIde: fila.sigueIde,
                    agenda: `${fila.agendas.agendaCod} - ${fila.agendas.agendaNom}`,
                    servicio: `${fila.servicios.servicioCod} - ${fila.servicios.servicioNom}`,
                    observacion: fila.venVenta.venObservacion,
                    cliente: fila.tercero.terNomcompleto,
                    direccion: fila.propiedad.proDireccion,
                    municipio: `${fila.ciudades.ciudadCod} - ${fila.ciudades.ciudadNom}`,
                    telefono: `${fila.tercero.terTelcelular}${
                        fila.tercero.terTelfijo != '.'
                            ? -fila.tercero.terTelcelular
                            : ''
                        }`,
                    cuadrilla: '',
                    fechaProg: '',
                    idprocesoactividad:
                        fila.proaProcesoactividades.proaIderegistro,
                    duracion: fila.proaProcesoactividades.proaTiempopromedio,
                    correo: fila.tercero.terCorreo,
                    proceso: this.state.proceso,
                    idsuscripcion: this.state.cliente,
                    actividad: fila.servicios.servicioNom,
                    terIderegistro: fila.tercero.terIderegistro,
                    suscripcion: fila.suscriptores.clienteCodsus,
                    ciudadCod: fila.ciudades.ciudadCod,
                    reprogramar:this.state.reprogramar
                }
            })
            this.props.onChange({ target: { id: 'lista', value: lista } })
        }        
    }

    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */
    render() {
        return (
            <div className="contenedor">
                <Modal
                    titulo={this.state.titulo}
                    texto={this.state.texto}
                    mostrar={this.state.mostrar}
                    ocultarAlerta={this.change}
                    botones={this.botones}
                />

                <label className="tag">actividades pendientes</label>

                <div className="formulario">
                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="contratante"
                        label="contratante*"
                        value={this.state.contratante}
                        opciones={this.state.contratanteJson}
                        onChange={this.change}
                    />
                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="proceso"
                        label="proceso*"
                        value={this.state.proceso}
                        opciones={this.state.procesoJson}
                        onChange={this.change}
                    />

                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="agenda"
                        label="Tipo de visita (agenda)"
                        value={this.state.agenda}
                        opciones={this.state.agendaJson}
                        onChange={this.change}
                    />

                    <Autocompletado
                        id="municipio"
                        label="municipio"
                        marcaAgua={'Escriba el código o el municipio'}
                        opciones={this.state.municipioJson}
                        onChange={this.change}
                        value={this.state.municipio}
                    />

                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="servicio"
                        label="Etapa Servicio"
                        value={this.state.servicio}
                        opciones={this.state.servicioJson}
                        onChange={this.change}
                    />

                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="actividad"
                        label="actividad"
                        value={this.state.actividad}
                        opciones={this.state.actividadJson}
                        onChange={this.change}
                    />

                    <Input
                        id="cliente"
                        label="Referencia Cliente*"
                        type="number"
                        value={this.state.cliente}
                        onChange={this.change}
                    />

                    <Input
                        id="fechaVenta"
                        label="fecha de venta"
                        type="date"
                        value={this.state.venta}
                        onChange={this.change}
                    />
                </div>

                <div className="contenedor" >
                    <div>
                        <button onClick={this.buscar}>buscar</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Pendientes
