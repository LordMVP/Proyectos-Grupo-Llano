import React, { Component } from 'react';
import { Combo, Input, VentanaDialogo } from 'appfuture-react';

import Peticion from '../../../global/peticion';
import Util from '../../../global/util';
import API from '../../../global/rutas_api';

/**
 *
 *
 * @class Gestion
 * @extends {Component}
 */
class Gestion extends Component {
	/**
     *Define estados iniciales
     * @memberof Gestion
     */
    state = {
        dialogoModal: false,

        // defecto

        liquidacionJson: [
            { valor: 'LN', texto: 'LN' },
            { valor: 'LS', texto: 'LS' }
        ],

        liquidacion: '',

        periodo: '',
        fechaInicial: '',
        fechaFinal: '',

        estado: 0,
        estadoJson: [
            { texto: 'Activo', valor: 1 },
            { texto: 'Inactivo', valor: 0 }
        ]
    }

	/**
     *
     *Habilita el botón guardar
     *@method
     *@return {JSX} Componente - Button
     */
    BotonGuardar = () => {
        const { dialogoModal, ...estado } = this.state

        /* prettier-ignore */

        return Util.validarObjeto(estado)
            ? <button className="btn" onClick={this.handleDialogo}>guardar</button>
            : <button className="btn" disabled={true}>guardar</button>
    }

	/**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @async
     */
    async componentDidMount() {
        const { id } = this.props.value

        if (id) {
            let datos = await Peticion.post({
                url: API.CONSULTA_PERIODOS.CONSULTAR_PERIODO_POR_ID,
                parametros: {
                    ppeIderegistro: id
                }
            })

            if (!datos.ppeIderegistro) return // no hay datos

            this.setState({
                periodo: datos.ppeDescripcion,
                liquidacion: datos.ppeTipo,
                estado: parseInt(datos.ppeEstado),
                fechaInicial: datos.ppeMinvalue,
                fechaFinal: datos.ppeMaxvalue,
            })
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
    change = ({ target: { id, value } }) => this.setState({ [id]: value })

    /**
     *
     * Cancela gestión y actualiza al componente padre
     * @method
     */
    cancelar = () => this.props.onChange(null)

    /**
     *
     * Crea gestión y actualiza al componente padre
     * @method
     */
    crear = () => {
        Peticion.post({
            url: API.CONSULTA_PERIODOS.REGISTRAR_PERIODO,
            parametros: {
                ppeMinvalue: this.state.fechaInicial,
                ppeMaxvalue: this.state.fechaFinal,
                ppeDescripcion: this.state.periodo,
                ppeTipo: this.state.liquidacion,
                ppeEstado: this.state.estado
            }
        })

        // final

        this.cancelar()
    }


    /**
     *
     * Despliega modal
     * @method
     */
    handleDialogo = () => this.setState({ dialogoModal: !this.state.dialogoModal })

	/**
	 *
	 * Permite guardar las actividades asociadas a los municipios
	 * @method
	 * 
	 */
    guardar = () => {
        const { id } = this.props.value

        if (!id) { this.crear() }

        else {
            Peticion.post({
                url: API.CONSULTA_PERIODOS.ACTUALIZAR_PERIODO,
                parametros: {
                    ppeIderegistro: id,
                    ppeMinvalue: this.state.fechaInicial,
                    ppeMaxvalue: this.state.fechaFinal,
                    ppeDescripcion: this.state.periodo,
                    ppeTipo: this.state.liquidacion,
                    ppeEstado: this.state.estado
                }
            })

            this.cancelar()
        }
    }

    botones = [
        { texto: 'guardar', callback: this.guardar },
        { texto: 'cancelar', callback: this.handleDialogo }
    ]

    /**
 *Renderiza la vista 
 * @return {JSX} componente - returna vista jsx 
 */
    render() {
        return (
            <React.Fragment>
                <VentanaDialogo
                    titulo="Confirmación"
                    texto="¿Confirma transacción?"
                    mostrar={this.state.dialogoModal}
                    botones={this.botones}
                />

                <h1>Parametrizacion rangos de fecha vigente</h1>

                <div className="contenedor d-flex justify-content-center btn-group">
                    <this.BotonGuardar />
                    <button className="btn" onClick={this.cancelar}>cancelar</button>
                </div>

                <div className="contenedor formulario">
                    <Input
                        id="periodo"
                        label="periodo"
                        value={this.state.periodo}
                        onChange={this.change} />

                    <Combo
                        id="liquidacion"
                        label="liquidacion"
                        value={this.state.liquidacion}
                        opciones={this.state.liquidacionJson}
                        onChange={this.change} />

                    <Input
                        type="date"
                        id="fechaInicial"
                        label="fecha inicial"
                        value={this.state.fechaInicial}
                        onChange={this.change} />

                    <Input
                        type="date"
                        id="fechaFinal"
                        label="fecha final"
                        value={this.state.fechaFinal}
                        onChange={this.change} />

                    <Combo
                        id="estado"
                        label="estado"
                        value={this.state.estado}
                        opciones={this.state.estadoJson}
                        onChange={this.change} />
                </div>
            </React.Fragment>
        );
    }
}

export default Gestion;
