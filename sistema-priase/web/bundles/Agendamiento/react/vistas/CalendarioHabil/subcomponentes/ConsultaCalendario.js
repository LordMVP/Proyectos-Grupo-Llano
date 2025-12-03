import React, { Component } from 'react'
import { Combo, Input, Tabla, VentanaModal, TextArea } from 'appfuture-react'
import axios from 'axios'
import URL from '../../../global/rutas_api'
import Peticion from '../../Assets/util/peticion'
import { Util } from '../../Assets/util/Util'


/**
 *
 *
 * @class ConsultaCalendario
 * @extends {Component}
 */
class ConsultaCalendario extends Component {
    /**
     *Define estados iniciales
     * @memberof ConsultaCalendario
     */
    constructor(props) {
        super(props)
        this.state = {
          //  lista: [],
            fechaInicio: '',
         //   fechaFinal: '',
         //   id: '',
            proceso: '-1',
         //   contratista: '-1',
         //   unidadResponsable: '-1',
         //   municipio: '',
         //   descripcion: '',
         //   idMunicipio: '-1',
            calendario:'-1',

            procesoJson: this.props.opcionesProceso,
            //contratanteJson: this.props.opcionesContratante,
            //agendaJson: this.props.opcionesAgenda,
//            municipioJson: this.props.opcionesMunicipio,
            calendarioJson:[]
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
        if (this.props.opcionesProceso !== prevProps.opcionesProceso) {
            this.setState({
                procesoJson: this.props.opcionesProceso,
            })
        }
        if (this.props.opcionesContratista !== prevProps.opcionesContratista) {
            this.setState({
                contratistaJson: this.props.opcionesContratista,
            })
        }
        if (
            this.props.opcionesUnidadResponsable !==
            prevProps.opcionesUnidadResponsable
        ) {
            this.setState({
                unidadResponsableJson: this.props.opcionesUnidadResponsable,
            })
        }
        if (this.props.opcionesMunicipio !== prevProps.opcionesMunicipio) {
            this.setState({
                municipioJson: this.props.opcionesMunicipio,
            })
        }
        if (this.props.mostrar !== prevProps.mostrar) {
            if (this.props.mostrar) {
                //restablece valores
                this.setState({
                 //   lista: [],                    
                    proceso: '-1',
                   // contratante: '-1',
                   // agenda: '-1',
                   // etapa: '-1',
                   // actividad: '-1',
                   // descripcion: '',
                   // referencia: '',
                   calendario:'-1',
                   fechaInicio:'',
                   calendarioJson:[]
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
     *Asigna la fila seleccionada para procesarla más adelante
     *@method
     *@param {int} index - número de la fila
     */
    asignar = (index) => {
        this.props.cerrarModal(this.state.lista[index])
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
            proceso,       
            fechaInicio,
            calendario
        } = this.state
        return  calendario != '-1' ? (
            <button className="btn" onClick={this.consultar}>
                consultar
            </button>
        ) : (
            <button className="btn" disabled>
                consultar
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
        await this.setState({ [id]: value })

        if(value != '-1'){
            switch (id) {
                case 'proceso': 
                case 'fechaInicio':                 
                    axios.post(URL.CALENDARIO_HABIL.CONSULTAR_CALENDARIO_HABIL, {
                        chaIdregistro: this.state.id != '' ? this.state.id : '',
                        uniProceso: {
                            uniProceso:
                                this.state.proceso != '-1'
                                    ? Util.obtenerId(this.state.proceso)
                                    : '',
                        },                   
                        fechaDesde:
                            this.state.fechaInicio != ''
                                ? this.state.fechaInicio + 'T00:00:00.000+0000'
                                : '',                               
                    })
                    .then(respuesta => {
                        if (respuesta.data.length > 0) {
                            this.setState({
                                calendarioJson: respuesta.data
                            });
                        }else{
                            this.setState({
                                calendarioJson: []
                            });
                        }
                    });
                    break
            }
        }
    }

    consultar = () => {
        const data ={id:this.state.calendario}
        this.props.cerrarModal(data)
    }

    /**
     *
     *Consulta filtrando información, previa selección de varios campos para listarlos en una tabla
     *@method
     */

    /*consultar = () => {
        this.peticion
            .post({
                url: URL.CALENDARIO_HABIL.CONSULTAR_CALENDARIO_HABIL,
                parametros: {
                    chaIdregistro: this.state.id != '' ? this.state.id : '',
                    uniProceso: {
                        uniProceso:
                            this.state.proceso != '-1'
                                ? Util.obtenerId(this.state.proceso)
                                : '',
                    },                   
                    fechaDesde:
                        this.state.fechaInicio != ''
                            ? this.state.fechaInicio + 'T00:00:00.000+0000'
                            : '',                    
                    municipio:
                        this.state.idMunicipio != '-1'
                            ? Util.obtenerId(this.state.idMunicipio)
                            : '',
                    unidadResponsable:
                        this.state.unidadResponsable != '-1'
                            ? Util.obtenerId(this.state.unidadResponsable)
                            : '',
                },
            })
            .then((data) => {
                if (data == null) {
                    this.setState({ lista: [] })
                    return false
                }
               
                let dataTabla =[]
                data.forEach(function(id){
                    const detalle = id.dChaCalendario;
                    detalle.forEach(function(element){
                        let fechas = ''
                        element.chaFecha.forEach(function(id) {
                            fechas = fechas+" \n"+id.fecha.replace('T10:00:00.000+0000','')
                        });

                        let municipios = ''
                        element.chaMunicipios.forEach(function(id){
                            municipios = municipios+" \n"+id.nombreMunicipio
                        });

                        let unidadesres = ''
                        element.chaUnidadesresponsables.forEach(function(id){                           
                            unidadesres = unidadesres+" \n"+id.nombreUnidadResponsable
                        });

                        let jornadas = ''
                        element.chaJornada.forEach(function(id){
                            jornadas = jornadas+" "+id.horaInicio+" "+id.horaFin+" "+id.jornada
                        });

                        dataTabla.push({
                            key:(dataTabla.length)+1,
                            municipios:municipios,
                            unidades:unidadesres,
                            fechas:fechas,
                            jornadas:jornadas
                        })
                    })
                });    

                this.setState({ listaDetalle:dataTabla})
            })
    }*/

    /**
     *Renderiza la vista
     * @return {JSX} componente - returna vista jsx
     */
    render() {
        return (
            <VentanaModal
                titulo="Consulta Calendario Hábil Proceso"
                mostrar={this.props.mostrar}
                cerrarModal={() => this.props.cerrarModal(undefined)}>

                <div className="contenedor formulario">
                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="proceso"
                        label="proceso *"
                        opciones={this.state.procesoJson}
                        value={this.state.proceso}
                        onChange={this.change}
                    />                                   

                    <Input
                        id="fechaInicio"
                        type="date"
                        label="Mes *"
                        value={this.state.fechaInicio}
                        onChange={this.change}
                    />

                    <div className="formulario">
                    <Combo
                        id="calendario"
                        label="calendario"
                        propValor='chaIdregistro'
                        propTexto='chaDescripcion'
                        name='calendario'
                        value={this.state.calendario}
                        onChange={this.change}
                        opciones={this.state.calendarioJson}
                        required={true}
                    />
                    </div>                    
                </div>    
                <div className="contenedor">
                    <this.BotonAgregar />
                </div>            
            </VentanaModal>
        )
    }
}

export default ConsultaCalendario
