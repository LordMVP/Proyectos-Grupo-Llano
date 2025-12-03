import React, { Component } from 'react'
import { Combo, Tabla } from 'appfuture-react'

import axios from 'axios'
import URL from '../../../global/rutas_api'
import Peticion from '../../Assets/util/peticion'
import Autocompletado from '../../Assets/componentes/Autocompletado'
import { Util } from '../../Assets/util/Util'
import Modal from '../../Assets/componentes/Modal'


/**
 *
 *
 * @class Muncipios
 * @extends {Component}
 */
class Muncipios extends Component {
    //inicialización de variables

    /**
     *Define estados iniciales
     * @memberof SolicitudAgendamiento
     */
    state = {
        lista: this.props.listaTabla || [],
        municipioJson: this.props.value || [],
        municipio: '',
        sector: '-1',
    }

    peticion = new Peticion(this)

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @async
     */

    componentDidUpdate(prepProps) {
        if (this.props.value !== prepProps.value) {
            this.setState({
                municipioJson: this.props.value,
            })
        }
        if (this.props.listaTabla !== prepProps.listaTabla) {
            this.setState({ lista: this.props.listaTabla })
        }
        if (this.props.limpiezaMunicipio !== prepProps.limpiezaMunicipio) {
            if (this.props.limpiezaMunicipio) {
                this.setState({
                    lista: [],
                    municipio: '',
                    sector: '-1',
                })
            }
            this.props.onChange({
                target: { id: 'limpiezaMunicipio' },
                value: false,
            })
        }
    }

    //Arreglo con los id y nombre de columnas para el componente Tabla

    columnas = [
        {
            Header: 'Municipio - Sector',

            columns: [
                { Header: 'Municipio', accessor: 'municipio' },
                { Header: 'Sector', accessor: 'sector' },

                {
                    Header: 'Acción',
                    accessor: 'id',
                    Cell: (props) => (
                        <button onClick={(e) => this.remover(props.index)}>
                            eliminar
                        </button>
                    ),
                },
            ],
        },
    ]

    /**
     * Cambia el valor del estado asociado a cada componente
     * @method
     * @async
     * @param {int} id al nombre del estado que se desea modificar
     * @param {(int|string)} value del componente correspondiente al dato
     * que se visualizará en el componente
     */

    change = ({ target: { id, value } }) => {
        this.setState({ [id]: value })
        if (id == 'municipio') {
            const buscarCiudad = this.state.municipioJson.filter(
                (ciudad) => ciudad.texto == value
            )
            if (buscarCiudad.length === 1) {
                this.peticion.post({
                    url: URL.UNIDADES_RESPONSABLES.LISTAR_SECTORES_POR_CIUDAD,
                    parametros: {
                        codigoCiudad: Util.obtenerId(value),
                    },
                    config: ['secIderegistro', 'secDescripcion'],
                    json: 'sectorJson',
                })
            }      
        }
    }

    /**
     *
     *Habilita el botón agregar
     *@method
     *@param {Object} props
     *@return {JSX} Componente - Button
     */

    BotonAgregar = (props) => {
        const { municipio, sector } = this.state

        return municipio === '' || sector === '-1' ? (
            <button disabled={true}>agregar</button>
        ) : (
            <button onClick={this.agregar}>agregar</button>
        )
    }

    /**
     * Agrega una nueva fila a la tabla. Evaluando previamente que la información no este repetida.
     * @method
     */

    agregar = () => {
        // ... obtener datos
        const { municipio, sector } = this.state
        const filtrar = this.state.lista.map((fila) => {
            return fila.municipio === municipio && fila.sector === sector
                ? true
                : false
        })
        if (filtrar.includes(true)) {
            this.setState({
                titulo: '¡INFORMACIÓN REPETIDA!',
                texto: 'El municipio y la actividad ya están asociados',
            }) //despliega modal
            this.setState({ mostrar: true })
        } else {           
            if(sector=='0 - Todos'){
                const lista = [...this.state.lista];
                const {sectorJson} = this.state;
                const sectores = sectorJson.map((elemento) => {               
                    return {
                        municipio: this.state.municipio,
                        sector:elemento.id
                    }                    
                })

                sectores.splice(0,1)
            
                sectores.forEach(function(id){
                    lista.push(id)        
                })

                this.setState({ lista }, () => {
                    this.setState({ municipio: '', sector: '-1' })
                })
             
                this.props.onChange({
                    target: { id: 'listaMunicipio', value: lista },
                })                
            }else{
                const lista = [
                    ...this.state.lista,
                    { municipio, sector},
                ]
                this.setState({ lista }, () => {
                    this.setState({ municipio: '', sector: '-1' })
                })
                this.props.onChange({
                    target: { id: 'listaMunicipio', value: lista },
                })
            }
        }
    }

    /**
     * Elimina la fila seleccionada en la tabla
     * @method
     * @param {int} index -Índice que corresponde al número de la fila que se desea eliminar
     */

    remover = (index) => {
        const lista = this.state.lista.filter((a, b) => index !== b)

        this.setState({ lista })
        this.props.onChange({ target: { id: 'listaMunicipio', value: lista } })
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
                <div className="fila">
                    <Autocompletado
                        id="municipio"
                        label="Municipio:"
                        marcaAgua={'Escriba el código o el municipio'}
                        opciones={this.state.municipioJson}
                        onChange={this.change}
                        value={this.state.municipio}
                    />
                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="sector"
                        label="sector"
                        value={this.state.sector}
                        opciones={this.state.sectorJson}
                        onChange={this.change}
                    />

                    <div className="contenedor">
                        <this.BotonAgregar />
                    </div>
                </div>

                <div className="contenedor">
                    <Tabla datos={this.state.lista} columnas={this.columnas} />
                </div>
            </React.Fragment>
        )
    }
}

export default Muncipios
