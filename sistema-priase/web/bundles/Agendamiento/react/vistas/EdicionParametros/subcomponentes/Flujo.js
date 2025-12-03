import React, { Component } from 'react'
import { Combo, Input, Interruptor, Tabla } from 'appfuture-react'

//opciones por defecto
import * as defaultOptions from '../defaultOptions'

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
 * @class Flujo
 * @extends {Component}
 */
class Flujo extends Component {
    //inicialización de variables

    /**
     *Define estados iniciales
     * @memberof Flujo
     */   
    state = {
        valor: '',
        referencia: '',
        descripcion: '',

        tipo: '-1',
        tipodato: '-1',

        entradas: [],
        salidas: [],
    }

    columnasEntradas = [
        {
            Header: 'Entradas',

            columns: [
                { Header: 'Descripcion', accessor: 'descripcion' },
                { Header: 'Valor', accessor: 'valor' },
                { Header: 'Referencia', accessor: 'referencia' },
                {
                    Header: 'Acción',
                    accessor: 'id',
                    Cell: (props) => (
                        <button
                            className="entradas"
                            onClick={(e) => this.remover(props.index, e)}>
                            ELIMINAR
                        </button>
                    ),
                },
            ],
        },
    ]

    columnasSalidas = [
        {
            Header: 'Salidas',

            columns: [
                { Header: 'Descripcion', accessor: 'descripcion' },
                { Header: 'Valor', accessor: 'valor' },
                { Header: 'Tipo Dato', accessor: 'tipodato' },
                { Header: 'Referencia', accessor: 'referencia' },
                {
                    Header: 'Acción',
                    accessor: 'id',
                    Cell: (props) => (
                        <button
                            className="salidas"
                            onClick={(e) => this.remover(props.index, e)}>
                            ELIMINAR
                        </button>
                    ),
                },
            ],
        },
    ]

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @param {Object} prepProps - Cargar atributos del componente
     * @async
     */

    componentDidUpdate(prevProps) {
        if (this.props.limpieza !== prevProps.limpieza) {
            if (this.props.limpieza) {
                this.setState({
                    entradas: [],
                    salidas: [],
                    tipo: '-1',
                    tipodato: '-1',
                    valor: '',
                    descripcion: '',
                    referencia: '',
                })
                this.props.onChange({
                    target: { id: 'limpieza', value: false },
                })
            }
        }
        if (this.props.value !== prevProps.value) {
            this.setState(
                {
                    entradas: this.props.value.entradas,
                    salidas: this.props.value.salidas,
                },
                () => {
                    this.props.onChange({
                        target: { id: 'flujo', value: this.state },
                    })
                }
            )
        }
    }

    /**
     *
     *Habilita el botón agregar
     *@method
     *@param {Object} props
     *@return {JSX} Componente - Button
     */

    BotonAgregar = () => {
        const { descripcion, valor, referencia, tipo } = this.state

        return descripcion === '' ||
            valor === '' ||
            referencia === '' ||
            tipo === '-1' ||
            (tipo === 'Salida' && tipodato === '-1') ? (
            <button disabled={true}>agregar</button>
        ) : (
            <button onClick={this.agregar}>agregar</button>
        )
    }

    /**
     *Asigna la fila seleccionada para procesarla más adelante
     *@method
     *@async
     *@param {int} index - número de la fila
     */

    agregar = async () => {
        const { descripcion, valor, referencia, tipo, tipodato } = this.state
        if (descripcion === '' || valor === '' || referencia == '') return null

        const filtrarEntradas = this.state.entradas.filter(
            (fila) => fila.valor === valor && fila.referencia === referencia
        )
        const filtrarSalidas = this.state.salidas.filter(
            (fila) => fila.valor === valor && fila.referencia === referencia
        )

        if (
            (filtrarEntradas.length > 0 && tipo === 'Entrada') ||
            (filtrarSalidas.length > 0 && tipo === 'Salida')
        ) {
            this.setState({
                titulo: '¡INFORMACIÓN REPETIDA!',
                texto: `El valor y la referencia se repiten en la lista actual de: ${
                    filtrarEntradas.length > 0 && tipo === 'Entrada'
                        ? 'Entradas'
                        : 'Salidas'
                }`,
            })
            //despliega modal
            this.setState({ mostrar: true })
            return false
        }

        if (tipo === 'Entrada') {
            const entradas = [
                ...this.state.entradas,
                { descripcion, valor, referencia },
            ]
            await this.setState({ entradas }, () => {
                this.setState({
                    tipo: '-1',
                    valor: '',
                    descripcion: '',
                    referencia: '',
                })
            })
        } else if (tipo === 'Salida') {
            const salidas = [
                ...this.state.salidas,
                { descripcion, valor, referencia, tipodato },
            ]
            await this.setState({ salidas }, () => {
                this.setState({
                    tipo: '-1',
                    tipodato: '-1',
                    valor: '',
                    descripcion: '',
                    referencia: '',
                })
            })
        }

        this.props.onChange({ target: { id: 'flujo', value: this.state } })
    }

    /**
     * Elimina la fila seleccionada en la tabla
     * @method
     * @async
     * @param {int} index -Índice que corresponde al número de la fila que se desea eliminar
     * @param {Array} event -Obtener información de la fila eliminada
     */

    remover = async (index, event) => {
        const valor = this.state[event.target.className].filter(
            (a, b) => index !== b
        )
        await this.setState({ [event.target.className]: valor })
        this.props.onChange({ target: { id: 'flujo', value: this.state } })
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
        this.props.onChange({ target: { id: 'flujo', value: this.state } })
    }

    /**
     *
     *Modificar componente, previo valor de la entrada Tipo
     *@return {jsx} Componente - Combo o nulo
     */
    salida = () => {
        const salida = this.state.tipo
        return salida === 'Salida' ? (
            <Combo
                propTexto="texto"
                propValor="id"
                id="tipodato"
                label="tipo dato"
                value={this.state.tipodato}
                opciones={defaultOptions.opcionesTipoDato}
                onChange={this.change}
            />
        ) : null
    }
    
    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */
    render() {
        return (
            <div className="caja">
                <Modal
                    titulo={this.state.titulo}
                    texto={this.state.texto}
                    mostrar={this.state.mostrar}
                    ocultarAlerta={this.change}
                    botones={this.botones}
                />

                <label className="tag">Flujo datos</label>

                <div class="columna">
                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="tipo"
                        label="tipo"
                        value={this.state.tipo}
                        opciones={defaultOptions.opcionesTipoFlujo}
                        onChange={this.change}
                    />
                    {this.salida()}
                    <Input
                        id="valor"
                        label="valor"
                        value={this.state.valor}
                        onChange={this.change}
                    />

                    <Input
                        id="descripcion"
                        label="descripcion"
                        value={this.state.descripcion}
                        onChange={this.change}
                    />

                    <Input
                        id="referencia"
                        label="referencia"
                        value={this.state.referencia}
                        onChange={this.change}
                    />

                    <div className="contenedor">
                        <this.BotonAgregar />
                    </div>

                    <div className="caja">
                        <label className="tag">entradas</label>

                        <Tabla
                            datos={this.state.entradas}
                            columnas={this.columnasEntradas}
                        />
                    </div>

                    <div className="caja">
                        <label className="tag">salidas</label>

                        <Tabla
                            datos={this.state.salidas}
                            columnas={this.columnasSalidas}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default Flujo
