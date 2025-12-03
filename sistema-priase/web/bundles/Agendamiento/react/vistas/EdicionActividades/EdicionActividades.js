import React, { Component } from 'react'
import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'
import axios from 'axios'

//componentes appfuture-react
import { Botonera, Captcha, Combo, Input, Tab,Interruptor } from 'appfuture-react'
//subcomponentes vista Edición Actividades
import Unidades from './subcomponentes/Unidades'
import Municipios from './subcomponentes/Municipios'
import ConsultaActividades from './subcomponentes/ConsultaActividades'

//Rutas entre la vista Edición Actividades y Symfony-EdicionActividadesController
//LLamado de la petición por POST o GET empleando AXIOS
import URL from '../../global/rutas_api'
import Peticion from '../Assets/util/peticion'

//Componente modal
import Modal from '../Assets/componentes/Modal'

//Carga de funciones
import { Util } from '../Assets/util/Util'


/**
 *
 *
 * @class EdicionActividades
 * @extends {Component}
 */
class EdicionActividades extends Component {
    //inicialización de variables

    /**
     *Inicializar estados
     * @constructor
     * @param {*} props
     * @memberof EdicionActividades
     */
    constructor(props) {
        super(props)
        this.state = {
            contratante: '-1',
            proceso: '-1',
            referencia: '',
            descripcion: '',
            agenda: '-1',
            etapa: '-1',
            actividad: '-1',
            tarea: '-1',
            tiempo: '',
            codsec:'',
            codrec:'',    
            /*
            mostrar y mensaje, variables exclusivas para el modal
            */
            mostrar: false,
            mensaje: [],

            //estados del modal
            mostrar: false,
            mensaje: [],

            //listas de los componentes
            //municipio y unidades
            municipios: [],
            unidades: [],

            //opciones del combo en los componentes
            //unidades
            contratistaJson: [],
            cuadrillaJson: [],
            procesoJson:[],
            //Definir el estado para radicado
            estado: false,
        }
    }

    //ejemplificar objeto POST y GET axios
    peticion = new Peticion(this)

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @async
     */

    async componentDidMount() {       
        //campo contratante
        this.peticion.get({
            config: ['empresaSevemp', 'empresaCod', 'empresaNom'],
            url: URL.EDICIONACTIVIDADES.CONSULTAR_CONTRATANTE,
            json: 'contratanteJson',
            value: 'contratante',
        })

        //Opciones para subcomponente municipio
        await this.peticion.get({
            config: ['ciudadCod', 'ciudadNom'],
            url: URL.EDICIONACTIVIDADES.CIUDAD,
            json: 'ciudadJson',
            value: 'ciudad',
        })

        await this.peticion.post({
            url: URL.EDICIONACTIVIDADES.CONTRATISTA,
            config: ['empresaCod', 'empresaNom'],
            json: 'contratistaJson',
            value: 'contratista',
        })
    }

    /**
     * Cambia el valor del estado asociado a cada componente
     * @method
     * @async
     * @param {int} id - Al nombre del estado que se desea modificar
     * @param {(int|string)} value - Del componente correspondiente al dato
     * que se visualizará en el componente
     */

    change = async ({ target: { id, value } }) => {
        await this.setState({ [id]: value })
        if(value !== '-1'){
            switch (id) {
                case 'contratante':
                    const parametros = {
                        empresa: Util.obtenerId(value,1)
                    };
                    await  axios.post(URL.EDICIONACTIVIDADES.PROCESO, parametros)
                        .then(respuesta => {
                          const data = respuesta.data;
                          data.forEach(unidad => {
                            unidad.id = unidad.uniProceso + ' - ' + unidad.prcDescripcion;
                            unidad.texto = unidad.uniProceso + ' - ' + unidad.prcDescripcion;
                            unidad.id = Util.limpiarDato(unidad.id);
                            unidad.texto = Util.limpiarDato(unidad.texto);
                          });
                          this.setState({ procesoJson: data });
                        });                               
    
                    break
    
                case 'proceso':
                    this.peticion.post({
                        config: ['agendaCod', 'agendaNom'],
                        url: URL.EDICIONACTIVIDADES.AGENDA,
                        parametros: {
                            proceso: Util.obtenerId(value),
                            empresa: Util.obtenerId(this.state.contratante,1)
                        },
                        json: 'agendaJson',
                        value: 'agenda',
                    })                  
                    //restablece valores en caso de que la consulta sea nula           
                    break
                
                case 'agenda': //debe cambiar combo etapa/servicio
                    await this.peticion.post({
                        url: URL.EDICIONACTIVIDADES.SERVICIO,
                        parametros: { agenda: Util.obtenerId(value),
                                      empresa: Util.obtenerId(this.state.contratante,0) 
                        },
                        config: ['servicioCod', 'servicioNom'],
                        json: 'etapaJson',
                        value: 'etapa',
                    })
                    //restablece valores en caso de que la consulta sea nula               
                    break
                case 'etapa': //debe cambiar actividad
                    //Si el coddemp='02', la actividad tiene la  misma info que  etapa.    
                    const { proceso, procesoJson } = this.state;                
                    const unidad = procesoJson.find(unidad => unidad.id == proceso);
                    
                    if(unidad.depEmpresa==='02'){
                        this.setState({actividadJson:this.state.etapaJson})
                    }else {
                        await this.peticion.post({
                            url: URL.EDICIONACTIVIDADES.ACTIVIDAD,
                            parametros: {
                                agenda: Util.obtenerId(this.state.agenda),
                                servicio: Util.obtenerId(value),
                                empresa: Util.obtenerId(this.state.contratante,0) 
                            },
                            config: ['servicioCod', 'servicioNom'],
                            json: 'actividadJson',
                        })
                        //restablece valores                   
                    }
                    break
    
                case 'actividad': //debe cambiar tarea
                    await this.peticion.post({
                        url: URL.EDICIONACTIVIDADES.TAREA,
                        parametros: {
                            agenda: Util.obtenerId(this.state.agenda),
                            servicio: Util.obtenerId(value),
                            empresa: Util.obtenerId(this.state.contratante,0) 
                        },
                        config: ['servicioCod', 'servicioNom'],
                        json: 'tareaJson',
                    })
                    //debe cambiar la cuadrilla del componente unidades
                    this.peticion.post({
                        url: URL.EDICIONACTIVIDADES.CUADRILLA,
                        configJsonDos: [
                            'ureIderegistro',
                            'cuadrilla',
                            'cuadrillaNom',
                        ],
                        parametros: {
                            empresa: Util.obtenerId(this.state.contratante),
                            actividad: Util.obtenerId(value),
                        },
                        json: 'cuadrillaJson',
                    });
                    break            
            }
        }        
    }

    /**
     * Restablece los valores a las condiciones iniciales
     * @method
     * @param {array} data - contiene la información que se escoge en la tabla del componente ConsultaCalendario
     */

    handleConsulta = async(data,proceso,contratante) => {
        //Cambia el estado del subcomponente ConsultaActividad, ocultándolo.
        if(contratante!= undefined){
            const parametros = {
                empresa: contratante
            };
            await  axios.post(URL.EDICIONACTIVIDADES.PROCESO, parametros)
                .then(respuesta => {
                  const rta = respuesta.data;
                  rta.forEach(unidad => {
                    unidad.id = (unidad.uniProceso + ' - ' + unidad.prcDescripcion).trim();
                    unidad.texto = (unidad.uniProceso + ' - ' + unidad.prcDescripcion).trim();   
                    unidad.id = Util.limpiarDato(unidad.id);  
                    unidad.texto = Util.limpiarDato(unidad.texto);              
                  });
                  this.setState({ procesoJson: rta });
                });
        }          

        await this.peticion.post({
                config: ['agendaCod', 'agendaNom'],
                url: URL.EDICIONACTIVIDADES.AGENDA,
                parametros: {
                    proceso:proceso,
                    empresa: contratante
                },
                json: 'agendaJson',
                value: 'agenda',
            })        
        
        //Cambia el estado del subcomponente ConsultaActividad, ocultándolo.
        this.setState({
            consultaModal: !this.state.consultaModal,
        })
        //Del objeto json DATA se extrae el id para realizar la consulta

        if (data.id != undefined) {
            axios
                .post(URL.EDICIONACTIVIDADES.CONSULTAR_CARGAR_VISTA, {
                    proaideregistro: data.id,
                })
                .then((data) => {
                    return data.data
                })
                .then((arreglo) => {
                    //limpia el formulario
                    this.nuevo()
                    /**
                     * Se almacena en el estado listaConsulta la información del arreglo json data
                     * Siendo evaluado posteriormente cuando se guarde la información
                     */
                    this.setState({ listaConsulta: arreglo })
                    /**
                     * De la información en data: el arreglo ciudades se pasa al subcomponente Municipios
                     * De la información en data: el arreglo ureunidadresponsable se pasa al subcomponente Unidades
                     */
                    const { ciudades, ureunidadresponsable } = arreglo
                    /**
                     * Se hace el recorrido sobre ciudades, agregando otra propiedad para
                     * diferenciarlo de los campos nuevos: eliminarMunicipios.
                     * Posteriormente se pasa la información al subcomponente Municipios, con el
                     * estado municipios
                     */
                    const municipios = ciudades.map((elemento) => {
                        return {
                            eliminarMunicipios: true,
                            proaIderegistro:
                                arreglo.procesoactividad.proaIderegistro,
                            municipio: `${elemento.ciudadCod} - ${elemento.ciudadNom}`,
                        }
                    })
                    this.setState({
                        municipios: municipios,
                    })

                    /**
                     * Se hace el recorrido sobre ureunidadresponsable, agregando otra propiedad para
                     * diferenciarlo de los campos nuevos: eliminarUnidades.
                     * Posteriormente se pasa la información al subcomponente unidades, con el
                     * estado unidades
                     */
                    const unidades = ureunidadresponsable.map((elemento) => {
                        return {
                            eliminarUnidades: true,
                            proaIderegistro:
                                arreglo.procesoactividad.proaIderegistro,
                            ureIderegistro: elemento.ureIderegistro,
                            idContratante: this.state.contratante,
                            contratista:
                                elemento.cuadrillaCodemp +
                                ' - ' +
                                Util.limpiarDato(
                                    elemento.cuadrilla.empresa.empresaNom
                                ),
                            unidadResponsable:
                                elemento.ureIderegistro +
                                ' - ' +
                                Util.limpiarDato(
                                    elemento.cuadrilla.cuadrillaNom
                                ),
                        }
                    })
                    this.setState({ unidades })

                    /**
                     * Filtrar los datos que trae de la consulta anterior 'CONSULTAR_CARGAR_VISTA'
                     * comparándolos con las opciones de los combox para escoger el valor que
                     * corresponde. Pero previamente elimina los espacios en blanco de inicio, fin del string
                     * y cuando entre palabra existe más de un espacio.
                     */
                    let contratante = this.state.contratanteJson.filter(
                        (fila) =>
                            Util.obtenerId(fila.texto) ==
                            arreglo.procesoactividad.empIderegistro
                    )
                    contratante = Util.limpiarDato(contratante)

                    let proceso = this.state.procesoJson.filter(
                        (fila) =>
                            Util.obtenerId(fila.texto) ==
                            arreglo.procesoactividad.uniProceso
                    )
                    proceso = Util.limpiarDato(proceso)                    

                    let agenda = this.state.agendaJson.filter(
                        (fila) =>
                            Util.obtenerId(fila.texto) ==
                            arreglo.procesoactividad.agendaCod
                    )
                    agenda = Util.limpiarDato(agenda)

                    this.setState(
                        {
                            referencia: data.id,
                            tiempo: arreglo.procesoactividad.proaTiempopromedio,
                            descripcion:arreglo.procesoactividad.proaDescripcion,
                            codrec:arreglo.procesoactividad.proaCodRec,
                            codsec:arreglo.procesoactividad.proaCodSec,
                            estado:arreglo.procesoactividad.radicado
                        },
                        () => {
                            this.change({
                                target: {id: 'contratante',value: contratante},
                            })
                            this.change({
                                target: { id: 'proceso', value: proceso },
                            })                            
                            this.change({
                                target: { id: 'agenda', value: agenda },
                            }).then((e) => {
                                //Cuando cambia contratante y agenda debe modificar etapa
                                let etapa = this.state.etapaJson.filter(
                                    (fila) =>
                                        Util.obtenerId(fila.texto) ==
                                        arreglo.procesoactividad.agendaEtapa
                                )
                                etapa = Util.limpiarDato(etapa)
                                this.change({
                                    target: { id: 'etapa', value: etapa },
                                }).then((e) => {
                                    let actividad = this.state.actividadJson.filter(
                                        (fila) =>
                                            Util.obtenerId(fila.texto) ==
                                            arreglo.procesoactividad
                                                .agendaservicioCod
                                    )
                                    actividad = Util.limpiarDato(actividad)
                                    //Cuando modifiva etapa de modificar actividad y tarea
                                    this.change({
                                        target: {
                                            id: 'actividad',
                                            value: actividad,
                                        },
                                    }).then((e) => {
                                        if(this.state.tareaJson.length>0){
                                            let tarea = this.state.tareaJson.filter(
                                                (fila) =>
                                                    Util.obtenerId(fila.texto) ==
                                                    arreglo.procesoactividad
                                                        .agendaservicioCodTarea
                                            )
                                            tarea = Util.limpiarDato(tarea)                                    
                                        }                                        
                                    })
                                })
                            })
                        }
                    )
                })
        }
    }

    /**
     * Se ejecuta al momento de pulsar sobre el botón Guardar
     * @method
     * @async
     */

    guardar = async () => {
        const {
            contratante,
            proceso,
            descripcion,
            agenda,
            etapa,
            actividad,
            tiempo,
            municipios,
            unidades,
        } = this.state
        if (
            contratante === '-1' ||
            proceso === '-1' ||
            descripcion === '' ||
            agenda === '-1' ||
            etapa === '-1' ||
            actividad === '-1' ||
            tiempo === '' ||
            municipios.length <= 0 ||
            unidades.length <= 0
        ) {
            /**
             * Sí alguna de las condiciones anteriores se cumplen, entonces, agrega esa información
             * a un arreglo para mostrar un mensaje con aquellos campos o entradas que no se han
             * seleccionado o digitado
             */

            await this.setState({ mensaje: [] })
            this.state.contratante === '-1'
                ? this.state.mensaje.push('Contratante')
                : ''
            this.state.proceso === '-1'
                ? this.state.mensaje.push('Proceso')
                : ''
            this.state.descripcion === ''
                ? this.state.mensaje.push('Descripción')
                : ''
            this.state.agenda === '-1' ? this.state.mensaje.push('Agenda') : ''
            this.state.etapa === '-1'
                ? this.state.mensaje.push('Etapa/Servicio')
                : ''
                //Realizar la validacion de coddepemp
            this.state.actividad === '-1'
                ? this.state.mensaje.push('Actividad')
                : ''
            
            this.state.tiempo === '' ? this.state.mensaje.push('Tiempo') : ''
            this.state.municipios.length <= 0
                ? this.state.mensaje.push('Lista Municipio')
                : ''
            this.state.unidades.length <= 0
                ? this.state.mensaje.push('Lista Unidades')
                : ''

            //Pasa la información al modal
            this.setState({
                titulo: '¡FALTA INFORMACIÓN!',
                texto: `Falta escoger:\n ${this.state.mensaje.join(', ')}`,
            })
            //Elimina si existe un segundo botón
            this.botones.length === 2 ? this.botones.shift() : null
            //Despliega modal  de bootstrap
            this.setState({ mostrar: true })
        } else {
            //Mensaje de confirmación para el envío
            this.setState({
                titulo: '¡ENVIAR INFORMACIÓN!',
                texto: '¿Confirma Transacción?',
            })
            //Agrega botón aceptar al modal
            this.botones.length === 1
                ? this.botones.unshift({
                    texto: 'Aceptar',
                    callback: this.guardarModal,
                    index: 1,
                })
                : null
            //Oculta modal
            this.setState({ mostrar: true })
        }
    }

    /**
     * Se ejecuta al momento de pulsar en  'aceptar' del modal, desplegado en la función 'guardar'.
     * Y solo ocurre al validar los campos necesarios para registrar o actualizar la información
     * @method
     */

    guardarModal = () => {
        /**
         * Organiza el estado entregado por los subcomponentes
         * Municipios y Unidades en el objeto json
         */

        let finalCiudades = this.state.municipios.filter(
            (elemento) => elemento.eliminarMunicipios != true
        )
        finalCiudades = finalCiudades.map((elemento) => {
            return { ciudadCod: Util.obtenerId(elemento.municipio) }
        })

        let finalUnidades = this.state.unidades.filter(
            (elemento) => elemento.eliminarUnidades != true
        )

        finalUnidades = finalUnidades.map((elemento) => {
            return {
                ureIderegistro: Util.obtenerId(elemento.unidadResponsable),
                cuadrillaCodemp: Util.obtenerId(elemento.contratista),
            }
        })

        /**
         * Objeto json final para almacenar la información
         */
        const datoFinal = {
            procesoactividad: {
                empIderegistro: Util.obtenerId(this.state.contratante),
                uniProceso: Util.obtenerId(this.state.proceso),
                proaDescripcion: this.state.descripcion,
                empContratista: Util.obtenerId(this.state.contratante, 1),
                agendaCod: Util.obtenerId(this.state.agenda),
                agendaEtapa: Util.obtenerId(this.state.etapa),
                agendaservicioCod: Util.obtenerId(this.state.actividad),
                agendaservicioCodTarea: Util.obtenerId(this.state.tarea),
                proaTiempopromedio: this.state.tiempo,
                radicado:this.state.estado,
                proaCodSec:this.state.codsec,
                proaCodRec:this.state.codrec
            },
            ureunidadresponsable: finalUnidades,
            ciudades: finalCiudades,
        }
        /**
         * Agrega la propiedad 'proaIderegistro' al objeto json cuando se actualiza
         */
        this.state.referencia !== ''
            ? (datoFinal.procesoactividad.proaIderegistro = this.state.referencia)
            : null

        //Actualiza o crea un registro nuevo sí se realizo una consulta válida
        this.peticion.post({
            url:
                this.state.referencia !== ''
                    ? URL.EDICIONACTIVIDADES.EDICION_UNIDAD_ACTIVIDAD
                    : URL.EDICIONACTIVIDADES.INSPROAPROCESOACTIVIDADES,
            parametros: datoFinal,
        })
        //limpiar formulario y subcomponentes
        this.setState({
            contratante: '-1',
            proceso: '-1',
            referencia: '',
            descripcion: '',
            agenda: '-1',
            etapa: '-1',
            actividad: '-1',
            tarea: '-1',
            tiempo: '',
            municipios: [],
            unidades: [],
            limpieza: true,
            codsec:'',
            codrec:'', 
            estado: false
        })
    }

    /**
     * Restablece los valores a las condiciones iniciales
     * @method
     */

    nuevo = () => {
        this.setState({
            contratante: '-1',
            proceso: '-1',
            referencia: '',
            descripcion: '',
            agenda: '-1',
            etapa: '-1',
            actividad: '-1',
            tarea: '-1',
            tiempo: '',
            municipios: [],
            unidades: [],
            limpieza: true,
            codsec:'',
            codrec:'', 
            estado: false
        })
    }

    /**
     * Cierra el modal de la consulta
     * @method
     */

    cerrarModal = () => { }

    //Arreglo para emplearlo en el componente Modal, con sus respectivas funciones

    botones = [{ texto: 'Cerrar', callback: this.cerrarModal, index: 2 }]

    /**
     * Arreglo para el componente botonera, Se genera dos botones:
     * 'Guardar' para almacenar o actualizar informacion de la vista correspondiente
     * 'Consultar'para buscar información de edición actividades existentes
     * 'Nuevo'para limpiar el formulario y los subcomponentes
     */

    //Arreglo para emplearlo en el componente botonera, con sus respectivas funciones

    funciones = [
        { texto: 'guardar', callback: this.guardar },
        { texto: 'consultar', callback: this.handleConsulta },
        { texto: 'nuevo', callback: this.nuevo },
    ]

    //Arreglo para emplearlo en el componente Modal, con sus respectivas funciones

    botones = [{ texto: 'Cerrar', callback: this.cerrarModal, index: 2 }]

    //Arreglo para emplearlo en el componente Modal, con sus respectivas funciones

    botones = [{ texto: 'Cerrar', callback: this.cerrarModal, index: 2 }]

    //Arreglo para emplearlo en el componente Modal, con sus respectivas funciones

    botones = [{ texto: 'Cerrar', callback: this.cerrarModal, index: 2 }]

    //Arreglo para emplearlo en el componente Modal, con sus respectivas funciones

    botones = [{ texto: 'Cerrar', callback: this.cerrarModal, index: 2 }]

    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */
    render() {
        return (
            <React.Fragment>
                <ConsultaActividades
                    opcionesProceso={this.state.procesoJson}
                    opcionesContratante={this.state.contratanteJson}
                    mostrar={this.state.consultaModal}
                    cerrarModal={this.handleConsulta}
                />
                <Modal
                    titulo={this.state.titulo}
                    texto={this.state.texto}
                    mostrar={this.state.mostrar}
                    ocultarAlerta={this.change}
                    botones={this.botones}
                />

                <h1>Empresa - Edición de actividades</h1>

                <Botonera funciones={this.funciones} />

                <div className="caja contenedor">
                    <label className="tag">Información Básica</label>

                    <div className="formulario">
                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="contratante"
                            label="contratante"
                            value={this.state.contratante}
                            opciones={this.state.contratanteJson}
                            onChange={this.change}
                        />

                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="proceso"
                            label="proceso"
                            value={this.state.proceso}
                            opciones={this.state.procesoJson}
                            onChange={this.change}
                        />                        

                        <Input
                            id="referencia"
                            label="referencia"
                            value={this.state.referencia}
                            onChange={this.change}
                            extra={{ disabled: true }}
                        />

                        <Input
                            id="descripcion"
                            label="descripción"
                            value={this.state.descripcion}
                            onChange={this.change}
                        />

                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="agenda"
                            label="Tipo de visita (agenda)"
                            value={this.state.agenda}
                            opciones={this.state.agendaJson}
                            onChange={this.change}
                        />

                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="etapa"
                            label="etapa / servicio"
                            opciones={this.state.etapaJson}
                            value={this.state.etapa}
                            onChange={this.change}
                        />

                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="actividad"
                            label="actividad"
                            value={this.state.actividad}
                            opciones={this.state.actividadJson}
                            onChange={this.change}
                        />

                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="tarea"
                            label="tarea"
                            value={this.state.tarea}
                            opciones={this.state.tareaJson}
                            onChange={this.change}
                        />

                        <Input
                            id="tiempo"
                            type="number"
                            label="tiempo promedio (minutos)"
                            value={this.state.tiempo}
                            onChange={this.change}
                        />

                        <Interruptor
                            id="estado"
                            label="radicado"
                            value={this.state.estado}
                            onChange={() =>
                                this.change({
                                    target: {
                                        id: 'estado',
                                        value: !this.state.estado,
                                    },
                                })
                            }
                        />

                        <Input
                            id="codsec"
                            type="number"
                            label="codsec"
                            value={this.state.codsec}
                            onChange={this.change}
                        />

                        <Input
                            id="codrec"
                            type="number"
                            label="codrec"
                            value={this.state.codrec}
                            onChange={this.change}
                        />
                    </div>

                    <div className="contenedor">
                        <Tab>
                            <Unidades
                                id="listaUnidades"
                                label="Unidades"
                                opcionesUnidad={this.state.cuadrillaJson}
                                opcionesContratista={this.state.contratistaJson}
                                value={this.state.unidades}
                                idContratante={this.state.contratante}
                                onChange={this.change}
                            />
                            <Municipios
                                id="listaCiudades"
                                label="Municipios"
                                opciones={this.state.ciudadJson}
                                value={this.state.municipios}
                                onChange={this.change}
                                limpieza={this.state.limpieza}
                            />
                        </Tab>
                    </div>
                </div>

                <Captcha />
            </React.Fragment>
        )
    }
}

//export default EdicionActividades;
EdicionActividades.propTypes = {}
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
)(EdicionActividades)
export { VistaRedux as REdicionActividades }
