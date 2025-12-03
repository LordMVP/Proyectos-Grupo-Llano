import React, { Component } from 'react'
import { Input, Tabla, VentanaModal } from 'appfuture-react'

//Rutas entre la vista Edición Actividades y Symfony-EdicionActividadesController
import URL from '../../../global/rutas_api'
//LLamado de la petición por POST o GET empleando AXIOS
import Peticion from '../../Assets/util/peticion'
//Carga de funciones
import { Util } from '../../Assets/util/Util'
//Usar componente modal
import Modal from '../../Assets/componentes/Modal'
import axios from 'axios'


/**
 *
 *
 * @class ConsultaEntrada
 * @extends {Component}
 */
class ConsultaEntrada extends Component {
    //inicialización de variables

    /**
     *Define estados iniciales
     * @memberof ConsultaEntrada
     */
    state = {
        lista: [],
        parametro: '',
        descripcion: '',
    }

    //Arreglo con los id y nombre de columnas para el componente Tabla

    columnas = [
        {
            Header: 'Parametros de entrada',

            columns: [
                { Header: 'Id', accessor: 'aparIderegistro' },
                { Header: 'Descripcion', accessor: 'aparDescripcion' },
                {
                    Header: 'Acción',
                    accesor: 'aparIderegistro',
                    Cell: (props) => (
                        <button onClick={(e) => this.asignar(props.index)}>
                            ver
                        </button>
                    ),
                },
            ],
        },
    ]

    /**
     *Asigna la fila seleccionada para procesarla más adelante
     *@method
     *@param {int} index - número de la fila
     */
    asignar = (index) => {
        this.props.cerrarModal(this.state.lista[index])
    }

    peticion = new Peticion(this)

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @param {Object} prepProps - Cargar atributos del componente
     * @async
     */

    componentDidUpdate(prevProps) {
        if (this.props.mostrar !== prevProps.mostrar) {
            if (this.props.mostrar) {
                //restablece valores
                this.setState({
                    lista: [],
                    // defecto
                    parametro: '',
                    descripcion: '',
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
     *Obtener listado de consulta, previa selección de parámetros
     *@method
     */

    consultar = () => {
        this.peticion
            .post({
                url: URL.EDICIONPARAMETROS.BUSCAR_PARAMETROS,
                parametros: {
                    idParametro: this.state.parametro,
                    descripcionParametro: this.state.descripcion,
                },
            })
            .then((data) => {
                const lista = data.map((elemento) => {
                    return {
                        aparIderegistro: elemento.aparIderegistro,
                        aparDescripcion: elemento.aparDescripcion,
                    }
                })
                this.setState({
                    lista,
                })
            })
    }

    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */
    
    render() {
        return (
            <VentanaModal
                titulo="Consulta parametros entrada"
                mostrar={this.props.mostrar}
                cerrarModal={this.props.cerrarModal}>
                <div className="caja">
                    <div className="formulario">
                        <label className="tag">Información filtro</label>

                        <Input
                            id="parametro"
                            label="parametro"
                            value={this.state.parametro}
                            onChange={this.change}
                        />

                        <Input
                            id="descripcion"
                            label="descripcion"
                            value={this.state.descripcion}
                            onChange={this.change}
                        />
                    </div>
                </div>

                <div className="contenedor">
                    <button onClick={this.consultar}>consultar</button>
                </div>

                <div className="contenedor">
                    <Tabla datos={this.state.lista} columnas={this.columnas} />
                </div>
            </VentanaModal>
        )
    }
}

export default ConsultaEntrada
