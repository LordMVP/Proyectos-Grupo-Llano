import React, { Component } from 'react'
import { Combo, Input, Tabla, VentanaModal, TextArea } from 'appfuture-react'

//Usar componente Autocompletado

import Autocompletado from '../../Assets/componentes/Autocompletado'

//Rutas entre la vista Edición Actividades y Symfony-EdicionActividadesController

import URL from '../../../global/rutas_api'

//LLamado de la petición por POST o GET empleando AXIOS

import Peticion from '../../Assets/util/peticion'

//Carga de funciones

import { Util } from '../../Assets/util/Util'


/**
 *
 *
 * @class DetalleCalendario
 * @extends {Component}
 */
class DetalleCalendario extends Component {
    /**
     *Define estados iniciales
     * @memberof DetalleCalendario
     */
    constructor(props) {
        super(props)
        this.state = {
           // lista: [],
            fechaInicio: '',
           // fechaFinal: '',
           // id: '',
            proceso: '-1',
          //  contratista: '-1',
          //  unidadResponsable: '-1',
            municipio: '',
          //  descripcion: '',
            idMunicipio: '-1',

            procesoJson: this.props.opcionesProceso,
            contratanteJson: this.props.opcionesContratante,
            agendaJson: this.props.opcionesAgenda,
            municipioJson: this.props.opcionesMunicipio,
            listaDetalle:[]
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
                    listaDetalle:[],
                    fechaInicio:'',                
                    proceso: '-1',
                    municipio: '',
                    idMunicipio: '-1'
                /*,
                    contratante: '-1',
                    agenda: '-1',
                    etapa: '-1',
                    actividad: '-1',
                    descripcion: '',
                    referencia: '',*/
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
    /*asignar = (index) => {
        this.props.cerrarModal(this.state.lista[index])
    }*/

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
            contratista,
            unidadResponsable,
            id,
            idMunicipio,
            fechaInicio,
            fechaFinal,
            descripcion,
        } = this.state
        return proceso != '-1' ||
            contratista != '-1' ||
            unidadResponsable != '-1' ||
            id != '' ||
            idMunicipio != '-1' ||
            fechaInicio != '' ||
            fechaFinal != '' ||
            descripcion != '' ? (
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

        switch (id) {
            case 'contratista':
                const a = await this.peticion
                    .post({
                        url: URL.CALENDARIO_HABIL.LISTAR_CUADRILLAS_CONTRATISTA,
                        parametros: {
                            idContratista: Util.obtenerId(value),
                        },
                        config: [
                            'ureIderegistro',
                            'cuadrillaCod',
                            'cuadrillaNom',
                        ],
                        json: 'unidadResponsableJson',
                    })
                    .then((data) => {
                        if (data === undefined) {
                            this.setState({ unidadResponsableJson: [] })
                        }
                    })
                break
        }
    }

    /**
     *
     *Consulta filtrando información, previa selección de varios campos para listarlos en una tabla
     *@method
     */

    consultar = () => {
        this.peticion
            .post({
                url: URL.CALENDARIO_HABIL.CONSULTAR_DETALLE_CALENDARIO,
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
                            ? this.state.fechaInicio //+ 'T00:00:00.000+0000'
                            : '',                    
                    municipio:
                        this.state.idMunicipio != '-1'
                            ? Util.obtenerId(this.state.idMunicipio)
                            : ''
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
                            unidadesres = id.nombreUnidadResponsable+" - "+unidadesres//+" \n"+id.nombreUnidadResponsable
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
    }

    renderTablaDatos = () => {  
    
        if (this.state.listaDetalle.length===0) {
          return null;
        }
        return (
          <div className="table-responsive-xl">
              <table id='table' data-toggle='table' className='table table-hover table-condensed table-bordered table-sm' data-pagination='true' data-search='true'>
                <thead className='bg-light text-black'>
                  <tr>
                    <th>Municipio</th>
                    <th>Unidades Responsables</th>
                    <th>Fechas</th>
                    <th>Jornadas</th>                    
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.listaDetalle.map(elemento => {              
                      return (
                        <tr key={elemento.key}>
                          <td>{elemento.municipios}</td>
                          <td>{elemento.unidades}</td>
                          <td>{elemento.fechas}</td>                  
                          <td>{elemento.jornadas}</td>                                                          
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
          </div>      
        );
      };

    /**
     *Renderiza la vista
     * @return {JSX} componente - returna vista jsx
     */
    render() {
        return (
            <VentanaModal
                titulo="Consulta Detalle Calendario Hábil Proceso"
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
                        label="fecha inicio *"
                        value={this.state.fechaInicio}
                        onChange={this.change}
                    />

                    <div className="formulario">
                        <Autocompletado
                            id="idMunicipio"
                            label="Municipio:"
                            marcaAgua={'Escriba el código o el municipio'}
                            opciones={this.state.municipioJson}
                            value={this.state.idMunicipio}
                            onChange={this.change}
                        />
                    </div>

                </div>                

                <div className="contenedor">
                    <this.BotonAgregar />
                </div>

                <div className="contenedor">
                    {this.renderTablaDatos()}
                </div>
            </VentanaModal>
        )
    }
}

export default DetalleCalendario
