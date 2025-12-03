import React, { Component,Fragment } from 'react'
import { Botonera, Captcha, Combo, Input, Tabla } from 'appfuture-react'
import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'
import axios from 'axios'
//Rutas entre la vista Solicitud Agendamiento y Symfony-SolicitudAgendamientoController
import URL from '../../global/rutas_api'
//LLamado de la petición por POST o GET empleando AXIOS
import Peticion from '../Assets/util/peticion'
//Carga funciones
import { Util } from '../Assets/util/Util'
//Usar componente modal
import Modal from '../Assets/componentes/Modal'

const tipo =[{ text: 'Usuario', value: 'usuario' }, { text: 'OIA', value: 'oia' },{text: 'Proceso', value: 'proceso' }]
/**
 * @class CancelarAgendamiento
 * @extends {Component}
 */
class CancelarAgendamiento extends Component {

    /**
     *Define estados iniciales
     * @memberof CancelarAgendamiento
     */
    state = {
        proceso: '-1',  
        suscriptor:'',
        lista:[],
        listaFinal:[],
        consultaModal:false,
        observacion:'',
        tipoJson:tipo,
        tipo:'-1'
    }

    peticion = new Peticion(this)
    
    columnas = [
        {
            Header: 'Agendamiento',

            columns: [
                { Header: 'Municipio',accessor: 'municipio' },
                { Header: 'Fecha programacion',accessor: 'fechaProgramacion'}, 
                { Header: 'Suscriptor',accessor: 'suscriptor'},
                { Header: 'Direccion',accessor: 'direccion'},                
                { Header: 'Actividad',accessor: 'actividad'},                
                {
                    Header: 'Acción',
                    accessor: 'id',
                    Cell: (props) => (
                        <input                                                       
                            type="checkbox"
                            unchecked
                            name="disponibilidad"
                            onChange={(e) => this.asignar(e, props.index)}
                        />
                    ),
                  }
            ],
        },
    ]

    async componentDidMount() {    
        await this.peticion.get({
            url: URL.REASIGNAR_AGENDAMIENTO.LISTAR_PROCESO,
            config: ['uniProceso', 'prcDescripcion'],
            json: 'procesoJson',
            value: 'proceso',
        });          
    } 

    cerrarModal = () => {
        this.setState({ mostrar: false });
    };

    botones = [{ texto: 'Cerrar', callback: this.cerrarModal, index: 2 }]

    /**
     * Funcion que renderiza  el boton para consultar
     */
    BotonConsultar = () => {
        const {
            proceso,
            suscriptor
        } = this.state
        return proceso != '-1' &
                suscriptor != ''  ? (
            <button className="btn" onClick={this.consultar}>Consultar</button>
        ) : (
            <button className="btn" disabled>Consultar</button>
        )
    }

    /**
     * Funcion para renderizar el boton de cancelar
     */
    BotonCancelar = () => {
        const {
            tipo,
            observacion
        } = this.state
        return tipo != '-1' &
                observacion != ''  ? (
            <button className="btn" onClick={this.cancelar}>Cancelar</button>
        ) : (
            <button className="btn" disabled>Cancelar</button>
        )
    }


    /**
     *Asigna la fila seleccionada para procesarla más adelante
     *@method
     *@param {int} index - número de la fila
     */
    asignar =async (e, index) => {
        let data = this.state.listaFinal;
        if(event.target.checked === true){
            let newData = [
                ...data,
                {        
                    agau_ide:this.state.lista[index].agau_ide
                }
              ]        
            await this.setState({ listaFinal : newData });   
        }else{           
            let i=0
            data.map((elemento) => {
                if(this.state.lista[index].agau_ide == elemento.id){
                    index = i
                }
                i=i+1
            })

            let newData = [
                ...data.slice(0, index),
                ...data.slice(index + 1),
            ]
            await this.setState({ listaFinal : newData });            
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
        this.setState({ [id]: value })         
    }

    consultar = async() =>{
        await axios.post(URL.REASIGNAR_AGENDAMIENTO.CONSULTAR_SUSCRIPTOR,{
            suscriptor: this.state.suscriptor, 
            proceso: Util.obtenerId(this.state.proceso)
        })
        .then(respuesta => {   
            const datos = respuesta.data                                             
            if (datos.length > 0) {                        
                const lista = datos.map((fila) => {                            
                    return {              
                        agau_ide:`${fila.idactividad}`,       
                        municipio:`${fila.municipio}`,
                        fechaProgramacion: `${fila.fechaProgramacion}`,
                        suscriptor:`${fila.suscriptor}`,
                        actividad:`${fila.actividad}`,
                        direccion:`${fila.direccion}`
                    }
                })
                this.setState({ lista })
            } else {                                      
                this.setState({
                    titulo: '¡SIN AGENDAMIENTO!',
                    texto: `El Suscriptor no tiene Actividades pendientes`,
                })             
                this.setState({ mostrar: true })

                this.setState({listaFinal:[]})
                this.setState({lista:[]})
            }
        });  
    }

    cancelar = () =>{
        const check = this.state.listaFinal        
        
        if(check.length>0){     
            
            this.setState({
                titulo: '¡ENVIAR INFORMACIÓN!',
                texto: '¿Confirma Transacción?',
              })
              //Agrega botón
              this.botones.length === 1
                ? this.botones.unshift({
                  texto: 'Aceptar',
                  callback: this.guardar,
                  index: 1,
                })
                : null
              //despliega modal
              this.setState({ mostrar: true })            
        }else{
            this.setState({
                titulo: '¡NO SELECCIONO!',
                texto: `No hay actividades seleccionadas para cancelar`,
            })             
            this.setState({ mostrar: true }) 
        }        
    }

    
    /**
     * Realizar la cancelacion despues  de confirmar
     */
    guardar = ()=>{
        const check = this.state.listaFinal        

        const actividades = check.map((id)=>{
            return id.agau_ide
        })

        const datos = {    
            tipo:'C',
            motivo:this.state.tipo,
            observacion:this.state.observacion,            
            ure:0,
            actividades:actividades,
            proceso:Util.obtenerId(this.state.proceso)
        }
       
        //Realizar peticion para cancelar  agendamiento
        axios.post(URL.REASIGNAR_AGENDAMIENTO.REASIGNAR, datos)
        .then(respuesta => {
            const data = respuesta.data;
            if(data.codigo>0){
                this.nuevo()
            }        
        });
    }

    /**
     * Restablece los valores a las condiciones iniciales
     * @method
     */

    nuevo = () => {
        this.setState({           
           proceso:'-1',
           lista:[],
           listaFinal:[],
           observacion:'',
           tipoJson:tipo,
           tipo:'-1'           
        })
    }
        
    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */
    render() {
        return (
            <React.Fragment>              

                <Modal
                    titulo={this.state.titulo}
                    texto={this.state.texto}
                    mostrar={this.state.mostrar}
                    ocultarAlerta={this.change}
                    botones={this.botones}
                />

                <h1>Empresa - Cancelar Agendamiento</h1>                

                <div className="contenedor caja formulario">
                    <label className="tag">Consultar</label>                  

                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="proceso"
                        label="proceso *"
                        value={this.state.proceso}
                        opciones={this.state.procesoJson}
                        onChange={this.change}
                    />

                    <Input
                        id="suscriptor"
                        type="number"
                        label="Referencia cliente *"
                        value={this.state.suscriptor}
                        onChange={this.change}
                    />
                   
                    <div className="contenedor">
                        <this.BotonConsultar />
                    </div>  
                    <div className="contenedor">
                        <this.BotonCancelar />
                    </div>                     
                </div>

                <div className="caja contenedor">
                    <label className="tag">Cancelar</label>                  

                    <div className="formulario">
                        <Combo
                            propTexto="text"
                            propValor="value"   
                            id="tipo"                
                            label="Tipo *:"                                                     
                            value={this.state.tipo}
                            opciones={this.state.tipoJson}
                            onChange={this.change}
                        />

                        <Input
                            id="observacion"
                            type="text"
                            label="Observacion *"
                            value={this.state.observacion}
                            onChange={this.change}
                        />   
                    </div>                         
                     
                    <div className="contenedor">                        
                        <Tabla datos={this.state.lista} columnas={this.columnas} />                        
                    </div>                
                </div>        
                {/* <Captcha /> */}
            </React.Fragment>
        )
    }
}

CancelarAgendamiento.propTypes = {}

const mapStateToProps =
    //inicialización de variables

    (state) => {
        return {}
    }

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch)
}

const VistaRedux = connect(
    mapStateToProps,
    mapDispatchToProps
)(CancelarAgendamiento)

export { VistaRedux as RCancelarAgendamiento }
