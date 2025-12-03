import React, { Component } from 'react'
import { Combo, Input, Interruptor, VentanaModal, Tabla } from 'appfuture-react'
import axios from 'axios'

//Rutas entre la vista Edición Actividades y Symfony-EdicionActividadesController
import URL from '../../../global/rutas_api'
//LLamado de la petición por POST o GET empleando AXIOS
import Peticion from '../../Assets/util/peticion'
//Componente de Prueba Autocompletado
import Autocompletado from '../../Assets/componentes/Autocompletado'
//Carga de funciones
import { Util } from '../../Assets/util/Util'
//Usar componente modal
import Modal from '../../Assets/componentes/Modal'


/**
 *
 *
 * @class ConsultaFrecuencia
 * @extends {Component}
 */
class ConsultaFrecuencia extends Component {
    //inicialización de variables

    /**
     *Define estados iniciales
     * @memberof ConsultaFrecuencia
     */

    state = {
        lista: [],
        frecuenciaJson: this.props.opcionesFrecuencia,
        estado: false,
        proceso:-1
    }

    //Arreglo con los id y nombre de columnas para el componente Tabla

    columnas = [
        {
            Header: 'Consulta frecuencia agendamiento',

            columns: [
                { Header: 'Id Crond', accessor: 'idCrond' },
                { Header: 'Descripción', accessor: 'descripcion' },
                { Header: 'Frecuencia', accessor: 'frecuencia' },
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
        this.props.cerrarModal(this.state.lista[index])
    }

    peticion = new Peticion(this)

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @async
     */

    async componentDidMount() {
        const res = await this.peticion.get({
            url: URL.FRECUENCIA_AGENDAMIENTO.PROCESO,
            config: ['uniProceso', 'prcDescripcion'],
            json: 'procesoJson',
            value: 'proceso',
        })
    }

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @param {Object} prepProps - Cargar atributos del componente
     * @async
     */

    componentDidUpdate(prevProps) {
        if (prevProps.opcionesJson !== this.props.opcionesJson) {
            this.setState({
                procesoJson: this.props.opcionesProceso,
            })
        }
        if (prevProps.opcionesAgenda !== this.props.opcionesAgenda) {
            this.setState({
                agendaJson: this.props.opcionesAgenda,
            })
        }
        if (prevProps.opcionesFrecuencia !== this.props.opcionesFrecuencia) {
            this.setState({
                frecuenciaJson: this.props.opcionesFrecuencia,
            })
        }
        if (prevProps.mostrar !== this.props.mostrar) {
            this.setState({
                frecuencia: '-1',
                agenda: '-1',
                descripcion: '',
                lista: [],
                estado: false,
            })
        }
    }

    /**
     *
     *Consulta filtrando información, previa selección de varios campos para listarlos en una tabla
     *@method
     *@param {Array} lista -
     */
    consultar = async () => {
        const { agenda, descripcion, frecuencia, estado,proceso } = this.state

        axios
            .post(
                URL.FRECUENCIA_AGENDAMIENTO.BUSCAR_CONFIGURACION_AGENDAMIENTO,
                {
                    cacIderegistro: null,
                    cagIdregistro: {
                        cagIderegistro:
                            this.state.agenda !== '-1'
                                ? Util.obtenerId(this.state.agenda)
                                : null,
                    },
                    cacFrecuencia:
                        this.state.frecuencia !== '-1'
                            ? this.state.frecuencia
                            : null,
                    cacValcahabil: this.state.estado ? 'A' : 'I',
                    cacDescripcion:
                        this.state.descripcion !== ''
                            ? this.state.descripcion
                            : null,
                    uniProceso:{uniProceso:Util.obtenerId(this.state.proceso)}
                }
            )
            .then((json) => {
                return json.data
            })
            .then((data) => {

                if (data.hasOwnProperty("datos")) {
                    if (data.datos == null) {
                        this.setState({ lista: [] })
                        return false
                    }
                }
                const lista = data.map((fila) => {
                    let frecuencia = []
                    fila.cacLunes === '1' ? frecuencia.push('Lun') : null
                    fila.cacMartes === '1' ? frecuencia.push('Mar') : null
                    fila.cacMiercoles === '1' ? frecuencia.push('Mie') : null
                    fila.cacJueves === '1' ? frecuencia.push('Jue') : null
                    fila.cacViernes === '1' ? frecuencia.push('Vie') : null
                    fila.cacSabado === '1' ? frecuencia.push('Sab') : null
                    fila.cacDomingo === '1' ? frecuencia.push('Dom') : null
                    frecuencia.push(
                        'cada ' +
                        fila.cacValfrecuencia +
                        ' ' +
                        fila.cacFrecuencia
                    )

                    return {
                        id: fila.cacIderegistro,
                        idCrond: `${fila.cacIderegistro} - ${fila.cacIderegistro}`,
                        descripcion: `${fila.cacDescripcion}`,
                        frecuencia: frecuencia.join(' - '),
                        diaFrecuencia: [
                            fila.cacLunes,
                            fila.cacMartes,
                            fila.cacMiercoles,
                            fila.cacJueves,
                            fila.cacViernes,
                            fila.cacSabado,
                            fila.cacDomingo,
                        ],
                    }
                })

                this.setState({
                    lista,
                })
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

    change = async ({ target: { id, value } }) => {
        this.setState({ [id]: value })
        if (id === 'proceso') {
            await this.peticion.post({
                url:
                    URL.FRECUENCIA_AGENDAMIENTO
                        .LISTAR_CONFIGURACION_AGENDAMIENTO,
                parametros: {
                    proceso: Util.obtenerId(value),
                },
                config: ['cagIderegistro', 'cagDescripcion'],
                json: 'agendaJson',
                value: 'agenda',
            })
        }
        if (id === 'validarCalendario') {
            this.setState({ validarCalendario: !this.state.validarCalendario })
        }
    }

    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */

    render() {
        return (
            <VentanaModal
                titulo="Consulta frecuencia agendamiento"
                mostrar={this.props.mostrar}
                cerrarModal={this.props.cerrarModal}>
                <div className="caja">
                    <label className="tag">Filtro Consulta</label>

                    <div className="formulario">
                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="proceso"
                            label="proceso"
                            opciones={this.state.procesoJson}
                            value={this.state.proceso}
                            onChange={this.change}
                        />

                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="agenda"
                            label="conf. agenda"
                            value={this.state.agenda}
                            opciones={this.state.agendaJson}
                            onChange={this.change}
                        />

                        <Input
                            id="descripcion"
                            label="descripcion"
                            value={this.state.descripcion}
                            onChange={this.change}
                        />

                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="frecuencia"
                            label="frecuencia"
                            value={this.state.frecuencia}
                            opciones={this.state.frecuenciaJson}
                            onChange={this.change}
                        />

                        <Interruptor
                            id="estado"
                            label="Valida Cal. Hábil"
                            value={this.state.estado}
                            onChange={this.change}
                        />
                    </div>
                    <div className="contenedor">
                        <button onClick={this.consultar}>consultar</button>
                    </div>
                    <div className="contenedor">
                        <Tabla
                            datos={this.state.lista}
                            columnas={this.columnas}
                        />
                    </div>
                </div>
            </VentanaModal>
        )
    }
}

export default ConsultaFrecuencia
