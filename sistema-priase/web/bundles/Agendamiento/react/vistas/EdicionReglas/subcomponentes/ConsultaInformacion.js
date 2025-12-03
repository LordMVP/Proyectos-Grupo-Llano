import React, { Component } from 'react'
import { Combo, Input, Tabla, VentanaModal } from 'appfuture-react'


/**
 *
 *
 * @class ConsultaInformacion
 * @extends {Component}
 */
class ConsultaInformacion extends Component {
    //inicialización de variables

    /**
     *Define estados iniciales
     * @memberof ConsultaInformacion
     */
    state = {
        lista: [],

        // defecto

        proceso: '-1',
    }

    //Arreglo con los id y nombre de columnas para el componente Tabla

    columnas = [
        {
            Header: 'Consulta información',

            columns: [
                {
                    Header: 'Regla',
                    accessor: 'regla',
                },

                {
                    Header: 'Descripcion',
                    accessor: 'descripcion',
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

    change = ({ target: { id, value } }) => this.setState({ [id]: value })

    // vista

    consultar = () => {}

    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */

    render() {
        return (
            <VentanaModal
                titulo="Consulta informacion"
                mostrar={this.props.mostrar}
                cerrarModal={this.props.cerrarModal}>
                <div className="caja">
                    <label className="tag">informacion consulta</label>

                    <div className="columna">
                        <Input
                            id="regla"
                            label="regla"
                            value={this.state.regla}
                            onChange={this.change}
                        />

                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="proceso"
                            label="proceso"
                            value={this.state.proceso}
                            onChange={this.change}
                        />
                    </div>

                    <div className="contenedor">
                        <button onClick={this.consultar}>consultar</button>
                    </div>

                    <div className="contenedor">
                        <Tabla
                            datos={this.state.lista}
                            columnas={this.columnas}
                        />
                    </div>
                </div>
            </VentanaModal>
        )
    }
}

export default ConsultaInformacion
