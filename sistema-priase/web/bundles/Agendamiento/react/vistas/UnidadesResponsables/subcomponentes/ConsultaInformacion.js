import React, { Component } from 'react'
import { Combo, Tabla, VentanaModal } from 'appfuture-react'


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
     * @memberof SolicitudAgendamiento
     */
    state = {
        // defecto

        agenda: '-1',
        estado: '-1',
        frecuencia: '-1',
        unidadResponsable: '-1',
    }

    //Arreglo con los id y nombre de columnas para el componente Tabla

    columnas = [
        {
            Header: 'Consulta frecuencia',

            columns: [
                { Header: 'Empresa Contratante', accessor: 'CAMBIAR_ESTO' },
                { Header: 'Unidad responsable', accessor: 'CAMBIAR_ESTO' },
                { Header: 'Estado', accessor: 'CAMBIAR_ESTO' },
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

    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */
    
    render() {
        return (
            <VentanaModal
                titulo="Consulta Unidades Responsables"
                mostrar={this.props.mostrar}
                cerrarModal={this.props.cerrarModal}>
                <div className="caja formulario">
                    <label className="tag">Filtro consulta</label>

                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="contratista"
                        label="contratante"
                        value={this.state.contratista}
                        opciones={this.state.contratistaJson}
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

                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="unidadResponsable"
                        label="unidad responsable"
                        value={this.state.unidadResponsable}
                        opciones={this.state.unidadResponsableJson}
                        onChange={this.change}
                    />

                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="estado"
                        label="estado"
                        value={this.state.estado}
                        opciones={this.state.estadoJson}
                        onChange={this.change}
                    />
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

export default ConsultaInformacion
