import React, { Component } from 'react'
import { Combo, Input, Interruptor } from 'appfuture-react'

//opciones por defecto
import * as defaultOptions from '../defaultOptions'

//api
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
 * @class Informacion
 * @extends {Component}
 */
class Informacion extends Component {
    //inicialización de variables

     /**
     *Define estados iniciales
     * @memberof Informacion
     */  
    state = {
        habilitarEstado: true,
        mostarTipoValor: false,
        requerido: false,
        mostrarAmbitoValor: 'combo',
        codigoUnidad: '',
        descripcion: '',
        ambito: '-1',
        ambitoValor: '-1',
        unidadTiempo: '-1',
        tipo: '-1',
        tipoValor: '-1',
        desde: '',
        hasta: '',
        origenDatos: '-1',
        referenciaModelo: '-1',
        tipoSalida: '-1',
    }

    peticion = new Peticion(this)

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @async
     */

    async componentDidMount() {
        await this.peticion.get({
            url: URL.EDICIONPARAMETROS.LISTAR_PARAMETROS_MODELO,
            config: ['llave', 'valor'],
            json: 'referenciaModeloJson',
            value: 'referenciaModelo',
        })
    }

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @param {Object} prepProps - Cargar atributos del componente
     * @async
     */

    async componentDidUpdate(prevProps) {
        if (this.props.limpieza !== prevProps.limpieza) {
            if (this.props.limpieza) {
                this.setState({
                    codigoUnidad: '',
                    descripcion: '',
                    ambito: '-1',
                    ambitoValor: '',
                    unidadTiempo: '',
                    tipo: '-1',
                    tipoValor:'',
                    desde: '',
                    hasta: '',
                    origenDatos: '-1',
                    referenciaModelo: '-1',
                    tipoSalida: '-1',
                    requerido: false,
                    autocompletado: '-1',
                })
                this.props.onChange({
                    target: { id: 'limpieza', value: false },
                })
            }
        }
        if (this.props.value !== prevProps.value) {
            const {
                codigoUnidad,
                descripcion,
                ambito,
                ambitoValor,
                unidadTiempo,
                tipo,
                tipoValor,
                desde,
                hasta,
                origenDatos,
                referenciaModelo,
                tipoSalida,
                requerido,
            } = this.props.value
            await this.setState(
                {
                    codigoUnidad,
                    descripcion,
                    unidadTiempo,
                    desde,
                    hasta,
                    origenDatos:
                        origenDatos === 'P'
                            ? 'Parámetros'
                            : origenDatos === 'R'
                            ? 'Reglas'
                            : 'Proceso',
                    tipoSalida:
                        tipoSalida === 'U'
                            ? 'Valor Único'
                            : tipoSalida === 'M'
                            ? 'Valor Múltiple'
                            : tipoSalida === 'NA'
                            ? 'No aplica'
                            : '',
                    requerido: requerido === 'S' ? true : false,
                },
                () => {
                    let referenciaM = this.state.referenciaModeloJson.filter(
                        (fila) => Util.obtenerId(fila.texto) == referenciaModelo
                    )

                    referenciaM =
                        referenciaM.length > 0
                            ? Util.limpiarDato(referenciaM)
                            : '-1'
                    this.setState({
                        referenciaModelo: referenciaM,
                    })
                    this.change({ target: { id: 'ambito', value: ambito } })
                        .then((e) => {
                            let ambitoV = this.state.ambitoValorJson.filter(
                                (fila) =>
                                    Util.obtenerId(fila.texto) == ambitoValor
                            )

                            ambitoV =
                                ambitoV.length > 0
                                    ? Util.limpiarDato(ambitoV)
                                    : '-1'
                            this.setState({
                                ambitoValor: ambitoV,
                            })
                        })
                        .then((e) => {
                            this.change({ target: { id: 'tipo', value: tipo } })
                                .then((e) => {
                                    if (tipo != 'Valor') {
                                        let tipoV = this.state.tipoValorJson.filter(
                                            (fila) =>
                                                Util.obtenerId(fila.texto) ==
                                                tipoValor
                                        )
                                        tipoV =
                                            tipoV.length > 0
                                                ? Util.limpiarDato(tipoV)
                                                : ''

                                        this.setState({
                                            tipoValor: tipoV,
                                        })
                                    } else {
                                        this.setState({
                                            tipoValor,
                                        })
                                    }
                                })
                                .then((e) => {
                                    this.props.onChange({
                                        target: {
                                            id: 'informacion',
                                            value: this.state,
                                        },
                                    })
                                })
                        })
                }
            )
        }
    }

    /**
     *
     *Modificar componente dependiendo del TipoValor
     *@method
     *@return {jsx} Componente - Input o Combo
     */
    tipoValor = () => {
        return this.state.mostrarTipoValor ? (
            <Input
                id="tipoValor"
                label="tipo valor"
                value={this.state.tipoValor}
                onChange={this.change}
            />
        ) : (
            <Combo
                propTexto="texto"
                propValor="id"
                id="tipoValor"
                label="tipo valor"
                opciones={this.state.tipoValorJson}
                name="tipo valor"
                value={this.state.tipoValor}
                onChange={this.change}
            />
        )
    }

    /**
     *
     *Modificar componente dependiendo del TipoValor
     *@method
     *@return {jsx} Componente - Input o Autocompletado
     */
    ambitoValor = () => {
        return this.state.mostrarAmbitoValor == 'combo' ? (
            <Combo
                propTexto="texto"
                propValor="id"
                id="ambitoValor"
                label="ámbito valor"
                opciones={this.state.ambitoValorJson}
                value={this.state.ambitoValor}
                onChange={this.change}
            />
        ) : this.state.mostrarAmbitoValor == 'municipio' ? (
            <Autocompletado
                id="ambitoValor"
                label="ámbito valor"
                marcaAgua={'Escriba el código o el municipio'}
                opciones={this.state.ambitoValorJson}
                onChange={this.change}
                value={this.state.autocompletado}
            />
        ) : (
            <div></div>
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
        await this.setState({ [id]: value })
        this.props.onChange({
            target: { id: 'informacion', value: this.state },
        })

        switch (id) {
            case 'ambito':
                switch (value) {
                    case 'Proceso':
                        this.setState({ mostrarAmbitoValor: 'combo' })
                        const resProceso = await this.peticion.get({
                            url: URL.EDICIONPARAMETROS.PROCESO,
                            config: ['uniProceso', 'prcDescripcion'],
                            json: 'ambitoValorJson',
                            value: 'ambitoValor',
                        })
                        break
                    case 'Actividad':
                        this.setState({ mostrarAmbitoValor: 'combo' })
                        const resActividad = await this.peticion.get({
                            url: URL.EDICIONPARAMETROS.CONSULTAR_ACTIVIDADES,
                            config: ['proaIderegistro', 'agendaservicioCod'],
                            json: 'ambitoValorJson',
                            value: 'ambitoValor',
                        })
                        break
                    case 'Municipio':
                        this.setState({ mostrarAmbitoValor: 'municipio' })
                        const resMunicipio = await this.peticion.get({
                            url: URL.EDICIONPARAMETROS.CONSULTAR_CIUDADES,
                            config: ['ciudadCod', 'ciudadNom'],
                            json: 'ambitoValorJson',
                            value: 'ambitoValor',
                        })
                        break
                    case 'Contratista':
                        this.setState({ mostrarAmbitoValor: 'combo' })
                        const resContratista = await this.peticion.get({
                            url: URL.EDICIONPARAMETROS.CONSULTAR_CONTRATISTA,
                            config: ['empresaCod', 'empresaNom'],
                            json: 'ambitoValorJson',
                            value: 'ambitoValor',
                        })
                        break
                    case 'Unidad Responsable':
                        this.setState({ mostrarAmbitoValor: 'combo' })
                        const resUnidadResponsable = await this.peticion.get({
                            url: URL.EDICIONPARAMETROS.UNIDADES_RESPONSABLES,
                            config: ['cuadrillaCod', 'cuadrillaNom'],
                            json: 'ambitoValorJson',
                            value: 'ambitoValor',
                        })
                        break
                    case 'Genérica':
                        this.setState({ mostrarAmbitoValor: 'input' })
                        break
                }

                break
            case 'tipo':
                if (value == 'Valor') {
                    this.setState({
                        mostrarTipoValor: true,
                        tipoValor: '',
                    })
                } else if (value != '-1') {
                    this.setState({
                        mostrarTipoValor: false,
                        tipoValor: '-1',
                        tipoValorJson: [],
                    })
                    const tipoFuncion =
                        value === 'Función SQL'
                            ? 'SQL'
                            : value === 'Función PHP'
                            ? 'PHP'
                            : value === 'Fórmula'
                            ? 'F'
                            : ''
                    await this.peticion.post({
                        url: URL.EDICIONPARAMETROS.CONSULTAR_FUNCIONES,
                        parametros: {
                            tipo: tipoFuncion,
                        },
                        config: ['afnIderegistro', 'afnNombre'],
                        json: 'tipoValorJson',
                        value: 'tipoValor',
                    })
                } else {
                    this.setState({
                        mostrarTipoValor: false,
                        tipoValor: '-1',
                        tipoValorJson: [],
                    })
                }
                break
        }
    }

    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */

    render() {
        return (
            <div className="caja columna">
                <label className="tag">Informacion básica</label>

                <Input
                    id="codigoUnidad"
                    label="codigo unidad"
                    value={this.state.codigoUnidad}
                    name="código unidad"
                    extra={{ disabled: true }}
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
                    id="ambito"
                    label="ámbito"
                    opciones={defaultOptions.opcionesAmbito}
                    value={this.state.ambito}
                    onChange={this.change}
                />

                <this.ambitoValor />

                <Combo
                    propTexto="texto"
                    propValor="id"
                    id="unidadTiempo"
                    label="unidad tiempo"
                    opciones={defaultOptions.opcionesUnidadTiempo}
                    name="unidad de tiempo"
                    value={this.state.unidadTiempo}
                    onChange={this.change}
                />

                <Combo
                    propTexto="texto"
                    propValor="id"
                    id="tipo"
                    label="tipo"
                    opciones={defaultOptions.opcionesTipo}
                    value={this.state.tipo}
                    onChange={this.change}
                />

                <this.tipoValor />

                <div className="contenedor caja">
                    <label className="tag">vigencia</label>

                    <div className="fila">
                        <Input
                            id="desde"
                            label="desde"
                            type="date"
                            value={this.state.desde}
                            onChange={this.change}
                        />

                        <Input
                            id="hasta"
                            label="hasta"
                            type="date"
                            value={this.state.hasta}
                            onChange={this.change}
                        />
                    </div>
                </div>

                <Combo
                    propTexto="texto"
                    propValor="id"
                    id="origenDatos"
                    label="oriden de datos"
                    opciones={defaultOptions.opcionesOrigenDatos}
                    value={this.state.origenDatos}
                    onChange={this.change}
                />
                <Combo
                    propTexto="texto"
                    propValor="id"
                    id="referenciaModelo"
                    label="referencia modelo"
                    opciones={this.state.referenciaModeloJson}
                    value={this.state.referenciaModelo}
                    onChange={this.change}
                />
                <Combo
                    propTexto="texto"
                    propValor="id"
                    id="tipoSalida"
                    label="tipoSalida"
                    value={this.state.tipoSalida}
                    opciones={defaultOptions.opcionesTipoSalida}
                    onChange={this.change}
                />
                <Interruptor
                    id="requerido"
                    label="requerido"
                    value={this.state.requerido}
                    onChange={() =>
                        this.change({
                            target: {
                                id: 'requerido',
                                value: !this.state.requerido,
                            },
                        })
                    }
                />
            </div>
        )
    }
}

export default Informacion
