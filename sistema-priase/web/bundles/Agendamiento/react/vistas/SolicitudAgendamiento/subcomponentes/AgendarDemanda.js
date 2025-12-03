import React, { Component } from 'react'
import { Combo, Input, Tabla, VentanaModal, TextArea } from 'appfuture-react'
import Modal from '../../Assets/componentes/Modal'
import { Util } from '../../Assets/util/Util'

/**
 *
 *
 * @class AgendarDemanda
 * @extends {Component}
 */
class AgendarDemanda extends Component {
    /**
     *Define estados iniciales
     * @memberof AgendarDemanda
     */
    constructor(props) {
        super(props)
        this.state = { 
            listaDetalle:[],
            aviso:this.props.mensaje,
            tipoSolicitante:this.props.opcionesSolicitante,
            solicitante:'-1',
            observacion: '',
            correo: '',
            numero: '',
            nombre: '',
            cedula:'',            
            numero2: '',
            reprogramacionJson:this.props.reprogramacion,
            value:true,
            reprogramacion:'-1',
            observacionrp:'',
            tipoAtencion:'-1',
            listTipoAtencion:this.props.opcionesAtencion,
            cedulatercero:'',
            nombretercero:'',
            numerotercero:'',
            correotercero:''
        }
    }

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @param {Object} prepProps - Cargar atributos del componente
     * @async
     */

    componentDidUpdate(prevProps) {
        if (this.props.mensaje !== prevProps.mensaje) {
            this.setState({
                aviso: this.props.mensaje,
            })
        }
        if (this.props.opcionesSolicitante !== prevProps.opcionesSolicitante) {
            this.setState({
                tipoSolicitante: this.props.opcionesSolicitante,
            })
        }  
        if (this.props.reprogramacionJson !== prevProps.reprogramacionJson) {
            this.setState({
                reprogramacionJson: this.props.reprogramacionJson,
            })
        }
        if (this.props.reprogramar !== prevProps.reprogramar) {
            this.setState({
                value: !this.props.reprogramar,
            })
        }  
        if (this.props.opcionesAtencion !== prevProps.opcionesAtencion) {
            this.setState({
                listTipoAtencion: this.props.opcionesAtencion,
            })
        }          
        if (this.props.mostrar !== prevProps.mostrar) {
            if (this.props.mostrar && !this.props.error) {  
                this.setState({                                
                    solicitante:'-1',
                    observacion: '',
                    correo: '',
                    numero: '',
                    nombre: '',
                    cedula:'',            
                    numero2: '',
                    reprogramacion:'-1',
                    observacionrp:'',
                    tipoAtencion:'-1',
                    cedulatercero:'',
                    nombretercero:'',
                    numerotercero:'',
                    correotercero:''
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

    change = ({ target: { id, value } }) => this.setState({ [id]: value })

    /**
     *
     *Habilita el botón agregar
     *@method
     *@param {Object} props
     *@return {JSX} Componente - Button
     */
    BotonAgregar = () => {
        const {
            cedula,
            nombre,
            numero,
            numero2,
            correo,
            observacion,            
            solicitante,
            tipoAtencion
        } = this.state
        return solicitante != '-1' &
            cedula != '' &
            nombre != '' &
            numero != '' &
            //correo != '' &
            tipoAtencion != '-1' &
            observacion != '' ? (
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
        //Validar integridad informacion que se digita
        if (
           // Util.validarCorreo(this.state.correo) ||
            Util.validarTelefono(this.state.numero)
        ) {
            await this.setState({ mensaje: [] })
            Util.validarTelefono(this.state.numero)
                ? this.state.mensaje.push(
                      'Número telefónico inválido. Se permite de 7 a 10 dígitos númericos'
                  )
                : ''
            Util.validarCorreo(this.state.correo)
                ? this.state.mensaje.push(
                      'Correo electrónico inválido. Ejemplo: ejemplo@ejemplo.com'
                  )
                : ''
            
            this.setState({
                titulo: '¡INFORMACIÓN INVÁLIDA!',
                texto: `${this.state.mensaje.join(', ')}`,
            }) 
            this.setState({ mostrar: true })
        } else if(this.state.value===false && (this.state.observacionrp==='' || this.state.reprogramacion==='-1')){
            await this.setState({ mensaje: [] })
            this.state.mensaje.push(
                'Debe registrar el motivo y observacion de la Reprogramacion'
            )
            this.setState({
                titulo: '¡INFORMACIÓN INVÁLIDA!',
                texto: `${this.state.mensaje.join(', ')}`,
            }) 
            this.setState({ mostrar: true })
        }else {
            const {
                cedula,
                nombre,
                numero,
                numero2,
                correo,
                observacion,            
                solicitante,
                reprogramacion,
                observacionrp,
                tipoAtencion,
                cedulatercero,
                nombretercero,
                numerotercero,
                correotercero
            } = this.state
            const datos ={
                cedula,nombre,numero,numero2,correo,observacion,solicitante,reprogramacion,observacionrp,tipoAtencion,cedulatercero,nombretercero,numerotercero,correotercero
            }
            this.props.cerrarModal(datos)
        }
    }

    /**
     *Renderiza la vista
     * @return {JSX} componente - returna vista jsx
     */
    render() {
        return (
            <VentanaModal
                titulo="Agendar Visita - Agendamiento Demanda"
                mostrar={this.props.mostrar}
                cerrarModal={() => this.props.cerrarModal(undefined)}>

                <div className="contenedor formulario">
                    <p class="bg-info"><b>{this.state.aviso}</b></p>
                </div>    

                <div className="contenedor caja formulario">
                    <label className="tag">Informacion solicitante</label>
                        <Input
                            id="cedula"
                            label="Cedula solicitante *:"
                            type="number"
                            value={this.state.cedula}
                            onChange={this.change}
                        />
                        <Input
                            id="nombre"
                            label="Nombre solicitante *:"
                            value={this.state.nombre}
                            onChange={this.change}
                        />
                        <Input
                            id="numero"      
                            type="number"                      
                            label="Número telefónico solicitante 1 *:"                            
                            value={this.state.numero}
                            onChange={this.change}
                        />
                        <Input
                            id="numero2"      
                            type="number"                      
                            label="Número telefónico solicitante 2:"                            
                            value={this.state.numero2}
                            onChange={this.change}
                        />
                        <Input
                            id="correo"
                            label="Correo solicitante :"
                            value={this.state.correo}
                            onChange={this.change}
                        />
                        <Input
                            id="observacion"
                            label="Observaciones *:"
                            value={this.state.observacion}
                            onChange={this.change}
                        />
                        <Combo
                            propTexto="text"
                            propValor="value"   
                            id="solicitante"                
                            label="Tipo solicitante *:"
                            value={this.state.solicitante}
                            opciones={this.state.tipoSolicitante}
                            onChange={this.change}
                        />

                        <Combo
                            id="tipoAtencion"
                            label="Tipo Atencion *"
                            propValor='tipAtencionCod'
                            propTexto='tipAtencionDesc'
                            name='tipoAtencion'
                            value={this.state.tipoAtencion}
                            onChange={this.change}
                            opciones={this.state.listTipoAtencion}                            
                        />

                        <Combo
                            propTexto="text"
                            propValor="value"   
                            id="reprogramacion"                
                            label="Tipo reprogramacion *:"
                            extra={{
                                disabled:this.state.value
                              }}                            
                            value={this.state.reprogramacion}
                            opciones={this.state.reprogramacionJson}
                            onChange={this.change}
                        />

                        <Input
                            id="observacionrp"
                            label="Observaciones Reprogramacion *:"
                            value={this.state.observacionrp}
                            extra={{
                                disabled:this.state.value
                              }}
                            onChange={this.change}
                        />
                </div>    


                <div className="contenedor caja formulario">
                    <label className="tag">Informacion tercero</label>
                        <Input
                            id="cedulatercero"
                            label="Cedula tercero :"
                            type="number"
                            value={this.state.cedulatercero}
                            onChange={this.change}
                        />
                        <Input
                            id="nombretercero"
                            label="Nombre tercero :"
                            value={this.state.nombretercero}
                            onChange={this.change}
                        />
                        <Input
                            id="numerotercero"      
                            type="number"                      
                            label="Celular tercero :"                            
                            value={this.state.numerotercero}
                            onChange={this.change}
                        />
                        
                        <Input
                            id="correotercero"
                            label="Correo tercero :"
                            value={this.state.correotercero}
                            onChange={this.change}
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

export default AgendarDemanda
