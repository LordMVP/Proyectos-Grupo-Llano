import React, { Component } from 'react'
import {Combo,Input,Tabla,VentanaModal,Autocompletado,} from 'appfuture-react'

//Rutas entre la vista Edición Actividades y Symfony-EdicionActividadesController
import URL from '../../../global/rutas_api'
//LLamado de la petición por POST o GET empleando AXIOS
import Peticion from '../../Assets/util/peticion'
//Carga de funciones
import { Util } from '../../Assets/util/Util'
//Usar componente modal
import Modal from '../../Assets/componentes/Modal'
import axios from 'axios'


/**
 *
 *
 * @class ConsultaActividades
 * @extends {Component}
 */
class ConsultaActividades extends Component {

    /**
     *Inicializar estados
     * @constructor
     * @param {*} props
     * @memberof ConsultaActividades
     */

    constructor(props) {
        super(props)
        this.state = {
            lista: [],            
            // defecto

            proceso: '-1',
            contratante: '-1',
            agenda: '-1',
            etapa: '-1',
            actividad: '-1',
            descripcion: '',
            referencia: '',

            procesoJson: this.props.opcionesProceso,
            contratanteJson: this.props.opcionesContratante,
        }
    }

    peticion = new Peticion(this)
    //Arreglo con los id y nombre de columnas para el componente Tabla

    columnas = [
        {
            Header: 'Actividades',
            columns: [
                { Header: 'Item', accessor: 'item' },
                { Header: 'Descripcion', accessor: 'descripcion' },
                { Header: 'Agenda', accessor: 'agenda' },
                { Header: 'Etapa', accessor: 'etapa' },
                { Header: 'Servicio', accessor: 'servicio' },
                { Header: 'Actividad', accessor: 'actividad' },
                {
                    Header: 'Acción',
                    accesor: 'id',
                    Cell: (props) => (
                        <button onClick={(e) => this.asignar(props.index)}>
                            ver
                        </button>
                    ),
                },
            ],
        },
    ]

    /**
     *Asigna la fila seleccionada para procesarla más adelante
     *@method
     *@param {int} index - número de la fila
     */
    asignar = (index) => {        
        this.props.cerrarModal(this.state.lista[index],
            Util.obtenerId(this.state.proceso),Util.obtenerId(this.state.contratante,1))        
    }

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @param {Object} prepProps - Cargar atributos del componente
     * @async
     */

    componentDidUpdate(prevProps) {
        if (this.props.opcionesProceso !== prevProps.opcionesProceso) {
            this.setState({
                procesoJson: this.props.opcionesProceso,
            })
        }
        if (this.props.opcionesContratante !== prevProps.opcionesContratante) {
            this.setState({
                contratanteJson: this.props.opcionesContratante,
            })
        }
        if (this.props.mostrar !== prevProps.mostrar) {
            if (this.props.mostrar) {
                //restablece valores
                this.setState({
                    lista: [],
                    // defecto
                    proceso: '-1',
                    contratante: '-1',
                    agenda: '-1',
                    etapa: '-1',
                    actividad: '-1',
                    descripcion: '',
                    referencia: '',
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

    change = async ({ target: { id, value } }) => {
        await this.setState({ [id]: value })

        switch (id) {
            case 'proceso':
                this.peticion.post({
                    config: ['agendaCod', 'agendaNom'],
                    url: URL.EDICIONACTIVIDADES.AGENDA,
                    parametros: {
                        proceso: Util.obtenerId(value),
                        empresa: Util.obtenerId(this.state.contratante,1)
                    },
                    json: 'agendaJson',
                    value: 'agenda',
                })
                //restablece valores en caso de que la consulta sea nula
                this.limpiarCampos();
                break
            case 'contratante':
                this.peticion.post({
                    config: ['uniProceso', 'prcDescripcion'],
                    url: URL.EDICIONACTIVIDADES.PROCESO,
                    parametros: {
                        empresa: Util.obtenerId(value,1)                  
                    },
                    json: 'procesoJson',
                    value: 'proceso',
                })
                //restablece valores en caso de que la consulta sea nula
                this.limpiarCampos();
                break

            case 'agenda': //debe cambiar combobox etapa/servicio
                const a = await this.peticion.post({
                    url: URL.EDICIONACTIVIDADES.SERVICIO,
                    parametros: { agenda: Util.obtenerId(value),
                                  empresa: Util.obtenerId(this.state.contratante,0) },
                    config: ['servicioCod', 'servicioNom'],
                    json: 'etapaJson',
                    value: 'etapa',
                })
                //restablece valores
                this.setState({              
                    actividad: '-1',
                    actividadJson: [],
                    tarea: '-1',
                    tareaJson: [],
                })
                break
            case 'etapa': //debe cambiar actividad
                this.peticion.post({
                    url: URL.EDICIONACTIVIDADES.ACTIVIDAD,
                    parametros: {
                        agenda: Util.obtenerId(this.state.agenda),
                        servicio: Util.obtenerId(value),
                        empresa: Util.obtenerId(this.state.contratante,0)
                    },
                    config: ['servicioCod', 'servicioNom'],
                    json: 'actividadJson',
                })
                //restablece valores
                this.setState({
                    tarea: '-1',
                    tareaJson: [],
                })
                break

            case 'actividad': //debe cambiar tarea
                this.peticion.post({
                    url: URL.EDICIONACTIVIDADES.TAREA,
                    parametros: {
                        agenda: Util.obtenerId(this.state.agenda),
                        servicio: Util.obtenerId(value),
                    },
                    config: ['servicioCod', 'servicioNom'],
                    json: 'tareaJson',
                })
        }
    }

    limpiarCampos=()=>{
        this.setState({
            agenda: '-1',
            agendaJson: [],
            actividad: '-1',
            actividadJson: [],
            tarea: '-1',
            tareaJson: [],
        })
    }

    /**
     *
     *Consulta filtrando información, previa selección de varios campos para listarlos en una tabla
     *@method
     *@async
     */

    consultar = async () => {
        if(this.state.proceso === '-1' || this.state.contratante === '-1'){
            this.setState({
                titulo: '¡INFORMACIÓN INVÁLIDA!',
                texto: 'Debe seleccionar Contratante y Proceso',
            }) 
            this.setState({ mostrar: true })
        }else{
            const datos = await this.peticion.post({
                url: URL.EDICIONACTIVIDADES.LISTAR_PROCESO_ACTIVIDADES,
                parametros: {
                    proceso:
                        this.state.proceso === '-1'
                            ? ''
                            : Util.obtenerId(this.state.proceso),
                    contratante:
                        this.state.contratante === '-1'
                            ? ''
                            : Util.obtenerId(this.state.contratante),
                    agenda:
                        this.state.agenda === '-1'
                            ? ''
                            : Util.obtenerId(this.state.agenda),
                    actividad:
                        this.state.actividad === '-1'
                            ? ''
                            : Util.obtenerId(this.state.actividad),
                    etapa:
                        this.state.etapa === '-1'
                            ? ''
                            : Util.obtenerId(this.state.etapa),
                    descripcion: this.state.descripcion,
                    id: this.state.referencia,
                },
            })

            if (datos === null) {
                this.setState({ lista: [] })
            } else {
                const lista = datos.map((fila,i) => {
                    return {
                        item:i+1,
                        descripcion: `${fila.proaDescripcion}`,
                        agenda: `${fila.agendaCod} - ${fila.agendaDesc}`,
                        etapa: `${fila.agendaEtapa} - ${fila.agendaEtapaDesc}`,
                        servicio: `${fila.agendaservicioCod} - ${fila.agendaservicioCodDesc}`,
                        actividad: fila.agendaservicioCodTarea===''?'':`${fila.agendaservicioCodTarea} - ${fila.agendaservicioCodTareaDesc}`,
                        id: fila.proaIderegistro,
                    }
                })
                this.setState({ lista: lista })
            }
        }        
    }

    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */
    render() {
        return (
            <VentanaModal
                titulo="Consulta actividades"
                mostrar={this.props.mostrar}
                cerrarModal={() => this.props.cerrarModal(undefined)}>
                <div className="contenedor formulario">
                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="contratante"
                        label="contratante"
                        value={this.state.contratante}
                        opciones={this.state.contratanteJson}
                        onChange={this.change}
                    />
                    
                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="proceso"
                        label="proceso"
                        value={this.state.proceso}
                        opciones={this.state.procesoJson}
                        onChange={this.change}
                    />                    

                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="agenda"
                        label="agenda"
                        value={this.state.agenda}
                        opciones={this.state.agendaJson}
                        onChange={this.change}
                    />

                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="etapa"
                        label="etapa / servicio"
                        value={this.state.etapa}
                        opciones={this.state.etapaJson}
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
                </div>

                <div className="contenedor fila">
                    <Input
                        id="referencia"
                        label="referencia"
                        value={this.state.referencia}
                        onChange={this.change}
                    />

                    <Input
                        id="descripcion"
                        label="descripcion"
                        value={this.state.descripcion}
                        onChange={this.change}
                    />
                </div>

                <div className="contenedor">
                    <button onClick={this.consultar}>consultar</button>
                </div>

                <div className="contenedor">
                    <Tabla datos={this.state.lista} columnas={this.columnas} />
                </div>

                <Modal
                    titulo={this.state.titulo}
                    texto={this.state.texto}
                    mostrar={this.state.mostrar}
                    ocultarAlerta={this.change}
                    botones={this.botones}
                /> 
            </VentanaModal>
        )
    }
}

export default ConsultaActividades
