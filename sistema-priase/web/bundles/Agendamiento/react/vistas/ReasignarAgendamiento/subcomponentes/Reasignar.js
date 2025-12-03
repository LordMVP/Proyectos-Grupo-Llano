import React, { Component } from 'react'
import { Combo, Input, Tabla, VentanaModal, TextArea } from 'appfuture-react'
import Modal from '../../Assets/componentes/Modal'
import Autocompletado from '../../Assets/componentes/Autocompletado'
import URL from '../../../global/rutas_api'
import Peticion from '../../Assets/util/peticion'
import { Util } from '../../Assets/util/Util'

/**
 *
 *
 * @class Reasignar
 * @extends {Component}
 */
class Reasignar extends Component {
    /**
     *Define estados iniciales
     * @memberof Reasignar
     */
    constructor(props) {
        super(props)
        this.state = {               
            proceso:this.props.mensaje,
            contratistaJson:this.props.contratista,
            contratista:'-1',
            unidadResponsable:'-1'
        }
    }
    peticion = new Peticion(this)

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @param {Object} prepProps - Cargar atributos del componente
     * @async
     */

    componentDidUpdate(prevProps) {
        if (this.props.proceso !== prevProps.proceso) {
            this.setState({
                proceso: this.props.proceso
            })
        }
        if (this.props.contratista !== prevProps.contratista) {
            this.setState({
                contratistaJson: this.props.contratista,
            })
        }        
        if (this.props.mostrar !== prevProps.mostrar) {
            if (this.props.mostrar) {  
                this.setState({                                
                    contratista:'-1',
                    unidadResponsable:'-1'
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
        this.setState({ [id]: value });

        if (id === 'contratista' && value!=='-1') {
            this.peticion.post({
                url: URL.REASIGNAR_AGENDAMIENTO.CUADRILLA,
                configJsonDos: ['ureIderegistro', 'cuadrilla', 'cuadrillaNom'],
                parametros: {
                    empresa: Util.obtenerId(value),
                },
                json: 'unidadResponsableJson',
                value: 'unidadResponsable',
            })
            // .then(data => {    
            //     if (data === undefined) {
            //         this.setState({ unidadResponsable: [] });
            //     }
            // });
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
        const {
            contratista,
            unidadResponsable
        } = this.state
        return contratista != '-1' &
                unidadResponsable != '-1'  ? (
            <button className="btn" onClick={this.agendar}>
                Agendar
            </button>
        ) : (
            <button className="btn" disabled>
                Agendar
            </button>
        )
    }

    agendar = async() =>{        
        const contratista = Util.obtenerId(this.state.contratista)
        const unidadResponsable = Util.obtenerId(this.state.unidadResponsable)
        const datos ={
            contratista,
            unidadResponsable
        }
        this.props.cerrarModal(datos)        
    }

    /**
     *Renderiza la vista
     * @return {JSX} componente - returna vista jsx
     */
    render() {
        return (
            <VentanaModal
                titulo="Reasignacion Agendamiento"
                mostrar={this.props.mostrar}
                cerrarModal={() => this.props.cerrarModal(undefined)}>
            
                <div className="contenedor caja formulario">
                    <label className="tag">Info Unidad Responsable</label>
                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="contratista"
                            label="contratista"
                            value={this.state.contratista}
                            opciones={this.state.contratistaJson}
                            onChange={this.change}
                        />
                        <Autocompletado
                            id="unidadResponsable"
                            label="Unidad Responsable"
                            marcaAgua={'Escribe la unidad responsable'}
                            value={this.state.unidadResponsable}
                            opciones={this.state.unidadResponsableJson}
                            onChange={this.change}
                            required={true}
                        />                        
                </div>              

                <div className="contenedor">
                    <this.BotonAgregar />
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

export default Reasignar
