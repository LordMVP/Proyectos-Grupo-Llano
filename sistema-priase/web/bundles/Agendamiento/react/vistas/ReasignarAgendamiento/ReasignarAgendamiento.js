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
import Reasignar from './subcomponentes/Reasignar'

const tipoSolicitante = [{ text: 'Propietario', value: 'Propietario' }, { text: 'Arrendatario', value: 'Arrendatario' }, { text: 'Otro', value: 'Otro' }];
const jornada =[{ text: 'Mañana', value: 'mañana' }, { text: 'Tarde', value: 'tarde' }]

/**
 * @class ReasignarAgendamiento
 * @extends {Component}
 */
class ReasignarAgendamiento extends Component {

    /**
     *Define estados iniciales
     * @memberof ReasignarAgendamiento
     */
    state = {
        proceso: '-1',  
        lista:[],
        listaFinal:[],
        consultaModal:false,
        contratistaJson:[],
        reasAll:false
    }

    peticion = new Peticion(this)
    
    columnas = [
        {
            Header: 'Agendamiento',

            columns: [
                { Header: 'Id',accessor: 'item' },
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
        await this.peticion.get({
            config: ['empresaCod', 'empresaNom'],
            url: URL.REASIGNAR_AGENDAMIENTO.LISTAR_CONTRATISTAS,
            resultado: 1,
            json: 'contratistaJson',
        });
        //this.corregirLista(this.state.contratistaJson, 'contratistaJson');
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

        if(id==='fecha' && value !== '-1'){            
            await axios.post(URL.REASIGNAR_AGENDAMIENTO.LISTAR_URE,{
                fecha: value, 
                proceso: Util.obtenerId(this.state.proceso)
            })
            .then(respuesta => {                                               
                if (respuesta.data.length > 0) {                        
                    this.setState({ unidadResponsableJson: respuesta.data });
                } else {     
                    this.setState({ unidadResponsableJson: [] })                   
                    this.setState({
                        titulo: '¡SIN AGENDAMIENTO!',
                        texto: `La URE no tiene agendamiento para  la fecha seleccionada`,
                    })             
                    this.setState({ mostrar: true })                   
                }
                this.setState({listaFinal:[]})
                this.setState({lista:[]})
            });            
        }else if(id==='unidadResponsable' && value !=='-1'){
            await axios.post(URL.REASIGNAR_AGENDAMIENTO.LISTAR_AGENDAMIENTO,{
                fecha: this.state.fecha, 
                proceso: Util.obtenerId(this.state.proceso),
                ure:value
            })
            .then(respuesta => {   
                const datos = respuesta.data                                             
                if (datos.length > 0) {                        
                    const lista = datos.map((fila,i) => {                            
                        return {    
                            item:i+1,         
                            agau_ide:`${fila.agau_ideregistro}`,       
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
                        texto: `La URE no tiene agendamiento para  la fecha seleccionada`,
                    })             
                    this.setState({ mostrar: true })

                    this.setState({listaFinal:[]})
                    this.setState({lista:[]})
                }
            });  
        }    
    }

    reasignar = () =>{
        const check = this.state.listaFinal        
        
        if(check.length>0){
            this.setState({reasAll:false})
            this.handleConsulta()
        }else{
            this.setState({
                titulo: '¡NO SELECCIONO!',
                texto: `No hay actividades seleccionadas para reasignar`,
            })             
            this.setState({ mostrar: true }) 
        }        
    }

    reasignarTodo = () =>{
        const todo = this.state.lista        
        
        if(todo.length>0){            
            this.setState({reasAll:true})
            this.handleConsulta()
        }else{
            this.setState({
                titulo: '¡LISTA VACIA!',
                texto: `Sin actividades para reasignar`,
            })             
            this.setState({ mostrar: true }) 
        }        
    }

    
    /**
     * Despliega el modal para realizar la consulta
     * @method
     */

    handleConsulta = (data) =>{
        this.setState({ consultaModal: !this.state.consultaModal })
        if(data != undefined){
            let lista = []
            if(this.state.reasAll===true){
               lista = this.state.lista
            }else{
               lista = this.state.listaFinal
            }

            const actividades = lista.map((id)=>{
                return id.agau_ide
            })

            const datos = {    
                tipo:'R',
                motivo:'',
                observacion:'',            
                ure:data.unidadResponsable,
                actividades:actividades,
                proceso:Util.obtenerId(this.state.proceso)
            }
           
            //Realizar peticion para guardar reasignacion
            axios.post(URL.REASIGNAR_AGENDAMIENTO.REASIGNAR, datos)
            .then(respuesta => {
                const data = respuesta.data;
                if(data.codigo>0){
                    this.nuevo()
                }        
            });
        }        
    }
   

    /**
     * Restablece los valores a las condiciones iniciales
     * @method
     */

    nuevo = () => {
        this.setState({
           fecha:'-1',
           proceso:'-1',
           lista:[],
           listaFinal:[],
           unidadResponsable:'-1'
        })
    }
        
    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */
    render() {
        return (
            <React.Fragment>
                <Reasignar
                    proceso={this.state.proceso}
                    contratista={this.state.contratistaJson}                
                    mostrar={this.state.consultaModal}
                    cerrarModal={this.handleConsulta}/>

                <Modal
                    titulo={this.state.titulo}
                    texto={this.state.texto}
                    mostrar={this.state.mostrar}
                    ocultarAlerta={this.change}
                    botones={this.botones}
                />

                <h1>Empresa - Reasignar Agendamiento</h1>                

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
                        id="fecha"
                        type="date"
                        label="fecha programacion *"
                        value={this.state.fecha}
                        onChange={this.change}
                    />

                    <Combo
                        propTexto="cuadrilla.cuadrillaNom"
                        propValor="ureIderegistro"
                        id="unidadResponsable"
                        label="unidad responsable"
                        value={this.state.unidadResponsable}
                        opciones={this.state.unidadResponsableJson}
                        onChange={this.change}
                    /> 
                    <div className="contenedor">
                        <div>
                            <button onClick={this.reasignarTodo}>Reasignar Todo</button>
                      
                            <button onClick={this.reasignar}>Reasignar</button>
                        </div>
                    </div>                    
                </div>

                <div className='row mt-5'>
                    <div className='col-12'>
                        <Tabla datos={this.state.lista} columnas={this.columnas} />
                    </div>
                </div>

                {/* <Captcha /> */}
            </React.Fragment>
        )
    }
}

ReasignarAgendamiento.propTypes = {}

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
)(ReasignarAgendamiento)

export { VistaRedux as RReasignarAgendamiento }
