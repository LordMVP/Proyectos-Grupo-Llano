import React, { Component } from 'react'
import { Botonera, Combo, Input, Tabla } from 'appfuture-react'

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
//Valida el resumén de la fórmula


/**
 *
 *
 * @class Asignacion
 * @extends {Component}
 */
class Asignacion extends Component {

    /**
     *Inicializar estados
     * @constructor
     * @param {*} props
     * @memberof Asignacion
     */  
    constructor(props) {
        super(props)
        this.state = {
            editarAgregar: false,
            lista: this.props.lista,
            value: this.props.value,
            secuencia: '0',
            condicion: '(',
            descripcion: '',
            valor: '',
            campoValor: '-1',
            parametro: '-1',
            operador: '-1',
            valorParametro: '',
            listaIndex: -1,
            parametro: [],

            operadoresJson: [
                { id: '=', texto: 'igual' },
                { id: '>', texto: 'mayor que' },
                { id: '<', texto: 'menor que' },
                { id: '<=', texto: 'menor igual que' },
                { id: '>=', texto: 'mayor igual que' },
            ],
        }
    }

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @param {Object} prepProps - Cargar atributos del componente
     * @async
     */

    componentDidUpdate(prepProps) {
        if (this.props.value !== prepProps.value) {
            this.setState({
                value: this.props.value,
            })
        }
        if (this.props.lista !== prepProps.lista) {
            this.setState({
                lista: this.props.lista,
            })
        }
        if (this.props.limpieza !== prepProps.limpieza) {
            if (this.props.limpieza) {
                this.setState({
                    parametro: '-1',
                    operador: '-1',
                    valorParametro: '',
                    valor: '-1',
                    campoValor: '',
                    condicion: '(',
                    secuencia: '0',
                    descripcion: '',
                    lista: [],
                    listaIndex: -1,
                })
                this.props.onChange({
                    target: { id: 'limpieza', value: false },
                })
            }
        }
    }

    /**
     *
     *Definir columnas de la lista Selección
     *@method
     *@return {array} Configuración Columnas y ID
     */
    columnas = () => {
        const contexto = this
        function funciones(index, contexto) {
            return [
                { texto: 'eliminar', callback: (e) => contexto.remover(index) },
                { texto: 'editar', callback: (e) => contexto.editar(index) },
            ]
        }

        return [
            {
                Header: 'Condiciones',

                columns: [
                    { Header: 'Secuencia', accessor: 'secuencia' },

                    { Header: 'Descripcion', accessor: 'descripcion' },

                    { Header: 'Resumen formula', accessor: 'condicion' },

                    {
                        Header: 'Acción',
                        accessor: 'id',
                        Cell: (props) => (
                            <Botonera
                                funciones={funciones(props.index, this)}
                            />
                        ),
                    },
                ],
            },
        ]
    }

    peticion = new Peticion(this)

    /**
     *
     *Habilita el botón agregar
     *@method
     *@param {Object} props
     *@return {JSX} Componente - Button
     */

    BotonAgregar = (props) => {
        const { descripcion, condicion, secuencia } = this.state

        return condicion === '' || secuencia === '' || descripcion === '' ? (
            <button disabled={true}>Agregar Condición</button>
        ) : (
            <button
                onClick={
                    this.state.editarAgregar
                        ? this.consultarEditar
                        : this.agregar
                }
                {...props}>
                {this.state.editarAgregar ? 'Editar' : 'Agregar'}
            </button>
        )
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
        if (id === 'parametro') {
            const salida = this.props.value.filter((elemento) => {
                return elemento.id === value
            })

            await this.setState({
                campoValor: value != '-1' ? salida[0].salida : '-1',
            })
            const valorParametro = await this.peticion.post({
                url: URL.EDICIONREGLAS.VALOR_PARAMETRO,
                parametros: { idParametro: Util.obtenerId(value) },
                config: ['codigo', 'descripcion'],
                json: 'valorParametroJson',
                value: 'valorParametro',
            })

            if (valorParametro == null) {
                this.setState({
                    valorParametro: salida === 'M' ? '' : '',//considerar el campo por modificar
                })
            } else if (valorParametro[0].hasOwnProperty('valor')) {
                this.setState({
                    valorParametro: valorParametro[0].valor.descripcion,
                })
            }
        }
    }

    /**
     * Edita una nueva fila a la tabla. Evaluando previamente que la información no este repetida.
     * @method
     */

    consultarEditar = () => {
        // limpieza
        this.agregar()
    }

    /**
     *
     *Modifica el componente, previo filtro del la entrada CampoValor
     *@method
     *@return {jsx} Componente - Input, ComboBox
     */
    campoValor = () => {
        const { campoValor } = this.state
        if (campoValor === 'M') {
            return (
                <Combo
                    propTexto="texto"
                    propValor="id"
                    id="valorParametro"
                    label="valor"
                    value={this.state.valorParametro}
                    opciones={this.state.valorParametroJson}
                    onChange={this.change}
                />
            )
        } else if (campoValor === 'U') {
            return (
                <Input
                    id="valorParametro"
                    label="valor"
                    value={this.state.valorParametro}
                    extra={{ disabled: true }}
                />
            )
        } else if (campoValor === 'T') {
            return (
                <Input
                    id="valorParametro"
                    label="valor"
                    value={this.state.valorParametro}
                    onChange={this.change}
                />
            )
        } else {
            return (
                <div className={'contenedor fila'}>
                    <span>
                        <b>ESCOJA UN PARÁMETRO</b>
                    </span>
                </div>
            )
        }
    }

    /**
     * Agrega una nueva fila a la tabla. Evaluando previamente que la información no este repetida.
     * @method
     * @async
     */

    agregar = async () => {
        const { descripcion, secuencia, regla, listaIndex } = this.state
        const condicion = this.state.condicion

        // validacion
        const validar = Util.validarFormula(condicion)

        if (validar != true) {
            //Modal
            const { arregloOperador, arregloOperando } = validar.vOperando

            this.setState({
                titulo: '¡RESUMÉN INVÁLIDO!',
                texto: `El resumen contiene los siguentes errores:\n
                        ${
                            validar.vParentesis !== true
                                ? 'Errores paréntesis: ' +
                                  validar.vParentesis +
                                  '\n'
                                : ''
                        }
                        ${
                            typeof arregloOperador == 'undefined'
                                ? ''
                                : arregloOperador.length !== 0
                                ? 'Errores en operadores: ' +
                                  arregloOperador +
                                  '\n'
                                : ''
                        }
                        ${
                            typeof arregloOperador == 'undefined'
                                ? ''
                                : arregloOperando.length !== 0
                                ? 'Errores en operando: ' +
                                  arregloOperando +
                                  '\n'
                                : ''
                        }
                        `,
            })
            //despliega modal
            this.setState({ mostrar: true })
            return
        }

        let existencias = []

        if (listaIndex == -1) {
            existencias = this.state.lista.filter(
                (el) => el.secuencia == secuencia
            )
        } else {
            existencias = this.state.lista.filter(
                (el, index) => el.secuencia == secuencia && index != listaIndex
            )
        }

        if (existencias.length) {
            //Modal
            this.setState({
                titulo: '¡SECUENCIA DUPLICADA!',
                texto: `La secuencia ya se encuentra relacionada en la lista`,
            })
            //despliega modal
            this.setState({ mostrar: true })
            return
        }

        //escritura
        let lista
        if (listaIndex == -1) {
            lista = [...this.state.lista, { secuencia, descripcion, condicion }]
        } else {
            lista = this.state.lista
            lista[listaIndex].secuencia = secuencia
            lista[listaIndex].descripcion = descripcion
            lista[listaIndex].condicion = condicion
        }

        this.setState({ lista, editarAgregar: false })
        this.props.onChange({ target: { id: 'asignacion', value: lista } })

        // limpieza
        this.setState({
            descripcion: '',
            condicion: '(',
            secuencia: '0',
            valor: '',
            listaIndex: -1,
        })
    }

    /**
     * Elimina la fila seleccionada en la tabla
     * @method
     * @param {int} index -Índice que corresponde al número de la fila que se desea eliminar
     */

    remover = (index) => {
        const confirmar = this.state.lista[index]
        if (confirmar.hasOwnProperty('dcrIderegistro')) {
            this.peticion.post({
                url: URL.EDICIONREGLAS.ELIMINAR_CONDICION,
                parametros: {
                    idCondicion: confirmar.dcrIderegistro,
                },
            })
        }
        const lista = this.state.lista.filter((a, b) => index !== b)
        this.setState({ lista })
        this.props.onChange(
            { target: { id: 'asignacion', value: lista } },
            () => {
                // limpieza
                this.setState({
                    descripcion: '',
                    condicion: '(',
                    secuencia: '0',
                    valor: '',
                })
            }
        )
    }

    /**
     *
     *Habilitar funcionalidad Componente Button
    *@method
    *@return {jsx} Componente - Button
    */

    BotonAgregarFormula = () => {
        const { parametro, operador, valorParametro } = this.state
        return parametro == '-1' ||
            operador == '-1' ||
            (valorParametro == '-1' || valorParametro == '') ? (
            <button disabled={true}>agregar fórmula</button>
        ) : (
            <button onClick={(e) => this.setState({ resumen: this.resumir() })}>
                agregar fórmula
            </button>
        )
    }

    /**
     *
     *Carga la información seleccionada para ser editada
     *@param {int} index - posición de la lista
     */

    editar = (index) => {
        const lista = this.state.lista

        this.setState(
            {
                descripcion: lista[index].descripcion,
                condicion: lista[index].condicion,
                secuencia: lista[index].secuencia,
                valor: '-1',
                operador: '-1',
                editarAgregar: true,
                listaIndex: index,
            },
            () => {}
        )
    }

    /**
     * Cierra el modal de la consulta
     * @method
     */
    cerrarModal = () => {}

    //Arreglo para emplearlo en el componente Modal, con sus respectivas funciones

    botones = [{ texto: 'Cerrar', callback: this.cerrarModal, index: 2 }]

    /**
     *
     *Obtener fórmula de la sentencia SQL
     *@param {string} texto - Fórmula
     */
    resumir = (texto = '') => {
        if(texto !==''){
            const condicion=this.state.condicion+`${texto}`
            this.setState({condicion})
            return
        }
        const { parametro, operador, valorParametro} = this.state

         if(
             parametro !== '-1' && 
             operador !== '-1' && 
             valorParametro !=='-1'
            ){
            const condicion=this.state.condicion+`\$${Util.obtenerId(parametro)}-${Util.obtenerId(parametro,-1)} ${operador} '${Util.obtenerId(valorParametro)===false?valorParametro:Util.obtenerId(valorParametro)}'`
            this.setState({condicion})
         }
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
                <label className="tag">Condiciones</label>

                <button onClick={(e) => this.resumir('(')}>(</button>

                <div className="contenedor formulario">
                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="parametro"
                        label="parametro"
                        value={this.state.parametro}
                        opciones={this.state.value}
                        onChange={this.change}
                    />

                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="operador"
                        label="operador"
                        value={this.state.operador}
                        opciones={this.state.operadoresJson}
                        onChange={this.change}
                    />

                    <this.campoValor />

                    <div className="botones">
                        <button onClick={(e) => this.resumir(' AND ')}>
                            AND
                        </button>
                        <button onClick={(e) => this.resumir(' OR ')}>
                            OR
                        </button>
                        <button onClick={(e) => this.resumir(')')}>)</button>
                        <this.BotonAgregarFormula />
                    </div>
                </div>

                <div className="contenedor fila">
                    <Input
                        id="resumen"
                        label="Resumen de la condición:"
                        value={this.state.condicion}
                        extra={{ disabled: true }}
                    />
                </div>
                <div className="contenedor fila">
                    <button onClick={(e) => this.setState({ condicion: '(' })}>
                        limpiar
                    </button>
                </div>

                <div className="contenedor fila">
                    <Input
                        id="secuencia"
                        label="Secuencia:"
                        type="number"
                        min="0"
                        max="10"
                        value={this.state.secuencia}
                        onChange={this.change}
                    />

                    <Input
                        id="descripcion"
                        label="Descripcion:"
                        value={this.state.descripcion}
                        onChange={this.change}
                    />

                    <this.BotonAgregar className="opcion" />
                </div>

                <div className="contenedor">
                    <Tabla
                        datos={this.state.lista}
                        columnas={this.columnas()}
                    />
                </div>
            </div>
        )
    }
}

export default Asignacion
