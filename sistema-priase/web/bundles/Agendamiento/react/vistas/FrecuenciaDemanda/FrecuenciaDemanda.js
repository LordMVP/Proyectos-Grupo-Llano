import React, { Component } from 'react'
import { Captcha, Combo, Tabla } from 'appfuture-react'

import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'

import Peticion from '../Assets/util/peticion'
import URL from '../../global/rutas_api'
import { SelectorMultiple } from '../utils/SelectorMultiple';
import { Util } from '../Assets/util/Util'
import Modal from '../Assets/componentes/Modal'
import PropTypes from 'prop-types';
import { mostrarAlerta } from '../../store/actions/AplicacionAcciones';

const listaZar = [{ text: 'SI', value: 'S' }, { text: 'NO', value: 'N' }];
const zonas = [{ text: 'URBANO', value: 'U' }, { text: 'RURAL', value: 'R' }];

class FrecuenciaDemanda extends Component {
    //inicialización de variables

    state = {
        lista: [],
        listaEliminar: [],
        listaZar: listaZar,
        zonas: zonas,        
        mostrar: false,
        agenda: '-1',
        proceso: '-1',
        municipio:'-1',
        zar:'-1',
        zona:'-1',
        sector:'-1',
        listaSector:[]
    }

    peticion = new Peticion(this)

    /**
     * Realiza las consultas para listar los elementos que irán en los combobox
     * @param noAplica
     * @returns {No aplica}
     */

    async componentDidMount() {
        await this.peticion.get({
            url: URL.FRECUENCIA_AGENDAMIENTO_DEMANDA.PROCESO,
            config: ['uniProceso', 'prcDescripcion'],
            json: 'procesoJson',
            value: 'proceso',
        })
        await this.peticion.get({ //este para los municipios
            url: URL.FRECUENCIA_AGENDAMIENTO_DEMANDA.LISTAR_MUNICIPIOS,
            config: ['ciudadIderegistro','ciudadCod', 'ciudadNom'],
            json: 'municipioJson',
            value: 'municipio',
        })
    }

    //Arreglo con los id y nombre de columnas para el componente Tabla

    columnas = [
        {
            Header: 'Cantidades para Agendar',

            columns: [
                { Header: 'Actividad', accessor: 'actividad' },

                { Header: 'Cantidad',accessor: 'cantidad'},
            ],
        },
    ]    

    /**
     * cambia el valor del estado asociado a cada componente
     * @param id Propiedad del componente que corresponde al identificador
     * debe corresponder al nombre del estado que se desea modificar
     * @param value Propiedad del componente correspondiente al dato
     * que se visualizará en el componente
     * @returns {No aplica}
     */

    change = async ({ target: { id, value } }) => {
        this.setState({ [id]: value }, () => { 
            if (id === 'proceso') {
                this.peticion.post({
                    url:
                        URL.FRECUENCIA_AGENDAMIENTO.LISTAR_CONFIGURACION_AGENDAMIENTO,
                    parametros: {
                        proceso: Util.obtenerId(value),
                    },
                    config: ['cagIderegistro', 'cagDescripcion'],
                    json: 'agendaJson',
                    value: 'agenda',
                })
            }else if(id==='municipio') {
                this.setState({listaSector:[]})
                var municipio = value.split('-');
                this.peticion.post({
                    url:
                        URL.FRECUENCIA_AGENDAMIENTO_DEMANDA.LISTAR_SECTORES,
                    parametros: {
                        municipio: municipio[1].trim()
                    },
                    config: ['secIderegistro', 'secDescripcion'],
                    json: 'sectorJson',
                    value: 'sector',
                })
            }        
        })             
    }

    /**
     * Crear boton para agendar
     */
    BotonAgregar = (props) => {
        const { proceso, agenda,municipio } = this.state

        return proceso === '-1' || agenda === '-1' || municipio === '-1' ? (
            <button disabled={true}>Agendar</button>
        ) : (
            <button onClick={this.confirmarAgenda}>Agendar</button>
        )
    }

    /**
     * Crear boton para consultar
     */
    BotonConsultar = (props) => {
        const { proceso, agenda, municipio } = this.state

        return proceso === '-1' || agenda === '-1' || municipio === '-1' ? (
            <button disabled={true}>Consultar</button>
        ) : (
            <button onClick={this.consultar}>Consultar</button>
        )
    }

    consultar = ()=>{
        let sectores=''
        const seleccionado = this.state.listaSector
        seleccionado.forEach(function(id){         
           sectores = Util.obtenerId(id.sector)+','+sectores
        });

        this.peticion
            .post({
                url: URL.FRECUENCIA_AGENDAMIENTO_DEMANDA.CANTIDAD_CAG,
                parametros: { agenda: Util.obtenerId(this.state.agenda),
                              proceso:Util.obtenerId(this.state.proceso),
                              municipio:Util.obtenerId(this.state.municipio),
                              zona:Util.obtenerId(this.state.zona),
                              zar:Util.obtenerId(this.state.zar),
                              sector:sectores
                            },
                })
            .then((data) => {
                if (data.length > 0) {
                    let total = 0;
                    const lista = data.map((fila) => {     
                        total +=fila.cantidad;
                        return {                     
                            cantidad:`${fila.cantidad}`,
                            actividad: `${fila.grupo} - ${fila.descripcion}`,
                        }                        
                    })
                    lista.push({cantidad:total,actividad:'TOTAL AGENDAR'})
                    this.setState({ lista })                        
                } else {
                    this.props.mostrarAlerta('Error', 'Lo sentimos no ha se encontrado información disponible.');
                    this.setState({
                        lista: [],
                        cantidad: '',
                        actividad: '',    
                    })
                }
            })
    }

    /**
     * Confirmar Agendamiento
     */
    confirmarAgenda = () => {                    
        this.setState({
            titulo: '¡ENVIAR INFORMACIÓN!',
            texto: '¿Confirma Agendamiento para SURES?',
        })
            
        this.botones.length === 1
                ? this.botones.unshift({
                    texto: 'Aceptar',
                    callback: this.agendar,
                    index: 1,
                })
                : null
            
        this.setState({ mostrar: true })        
    }

    /**
     * Funcion que lanza el Agendamiento
     */
    agendar = () => {
        let sectores=''
        const seleccionado = this.state.listaSector
        seleccionado.forEach(function(id){         
           sectores = Util.obtenerId(id.sector)+','+sectores
        });

        this.peticion
                .post({
                    url: URL.FRECUENCIA_AGENDAMIENTO_DEMANDA.AGENDAMIENTO_DEMANDA,
                    parametros: { agenda: Util.obtenerId(this.state.agenda),
                                  proceso:Util.obtenerId(this.state.proceso),
                                  municipio:Util.obtenerId(this.state.municipio),
                                  codMunicipio:Util.obtenerId(this.state.municipio,1),
                                  zona:Util.obtenerId(this.state.zona),
                                  zar:Util.obtenerId(this.state.zar),
                                  sector:sectores
                                },
                }).then((data) => {
                     this.limpiarCampos();
                })                             
    }

    limpiarCampos =() =>{
        this.setState({
            lista: [],
            agenda: '-1',
            proceso: '-1',
            municipio:'-1',
            zar:'-1',
            zona:'-1',
            listaSector:[]  
        }) 
    }


    seleccionarItem = async (evento) => {
        const lista = [...this.state.listaSector];        
        const sectores = this.state.sectorJson;
        const control = evento.target;
        const value = control.value;
        const index = sectores.findIndex(c => c.id == value);
        sectores[index].seleccionado = control.checked;        
        sectores[index].sector = evento.target.value;
        if (control.checked == true) {
          lista.push(sectores[index]);
        }
        if (control.checked == false) {
          const indexLista = lista.findIndex(a => a.id == value);
          lista.splice(indexLista, 1);
        }   
        
        this.setState({listaSector:lista})   
    };

     /**
     * Cierra el modal de la consulta
     * @method
     */

    cerrarModal = () => { }

    //Arreglo para emplearlo en el componente Modal, con sus respectivas funciones

    botones = [{ texto: 'Cerrar', callback: this.cerrarModal, index: 2 }]
  
    render() {
        return (
            <React.Fragment>
                <h1>Empresa - Frecuencia Agendamiento Demanda</h1>                
                <Modal
                    titulo={this.state.titulo}
                    texto={this.state.texto}
                    mostrar={this.state.mostrar}
                    ocultarAlerta={this.change}
                    botones={this.botones}
                />
                <div className="caja contenedor">
                    <label className="tag">Agendamiento Demanda</label>

                    <div className="formulario">
                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="proceso"
                            label="Proceso"
                            value={this.state.proceso}
                            opciones={this.state.procesoJson}
                            onChange={this.change}
                        /> 
                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="agenda"
                            label="Conf Agenda"
                            opciones={this.state.agendaJson}
                            value={this.state.agenda}
                            onChange={this.change}
                        />
                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="municipio"
                            label="Municipio"                           
                            opciones={this.state.municipioJson}
                            value={this.state.municipio}
                            onChange={this.change}
                        />     

                        <div className="contenedor">
                        <SelectorMultiple
                            titulo='Sectores:'
                            propTexto='texto'
                            propValor='id'
                            lista={this.state.sectorJson}
                            seleccionarItem={this.seleccionarItem}
                        />
                        </div>

                        <Combo
                            opciones={this.state.zonas}
                            propTexto='text'
                            propValor='value'
                            label='Zona:'
                            name='zona'
                            id='zona'
                            value={this.state.zona}
                            onChange={this.change}
                        />
                        <Combo
                            opciones={this.state.listaZar}
                            propTexto='text'
                            propValor='value'
                            label='ZAR:'
                            name='zar'
                            id='zar'
                            value={this.state.zar}
                            onChange={this.change}
                        />                       
                        
                        <div className="contenedor">  
                            <this.BotonConsultar />                        
                            <this.BotonAgregar />
                        </div>                     
                    </div>
                
                    <div className="contenedor">
                        <Tabla
                            datos={this.state.lista}
                            columnas={this.columnas}
                        />
                    </div>
                </div>

                <Captcha />
            </React.Fragment>
        )
    }
}

FrecuenciaDemanda.propTypes = {
    history: PropTypes.object,
    mostrarAlerta: PropTypes.func
}

const mapStateToProps =
    //inicialización de variables

    (state) => {
        return {}
    }

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({mostrarAlerta}, dispatch)
}

const VistaRedux = connect(
    mapStateToProps,
    mapDispatchToProps
)(FrecuenciaDemanda)

export { VistaRedux as RFrecuenciaDemanda }
