import React, { Component } from 'react'


/**
 *
 *
 * @class Horario
 * @extends {Component}
 */
class Horario extends Component {
    //inicialización de variables

    /**
     *Define estados iniciales
     * @memberof Horario
     */
    state = {
        //Objeto json para definir los valores
        //iniciales de lo checkbox
        horario: {
            lunes: false,
            martes: false,
            miercoles: false,
            jueves: false,
            viernes: false,
            sabado: false,
            domingo: false,
        },
    }

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @param {Object} prepProps - Cargar atributos del componente
     * @async
     */

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) {
            this.setState({
                horario: this.props.value,
            })
        }
    }
    
    /**
     *
     *Se ejecuta al momento de pulsar sobre cualquier checkbox cambiando el estado anterior
     *@method
     *@async
     *@param {int} index - ubicación en la lista 
     *@param {(int | string)} value - valor de esa ubicación
     */

    click = async (index, value) => {
        await this.setState({
            horario: { ...this.state.horario, [index]: value },
        })
        //Envia el objeto horario al método onChange del padre FrecuenciaAgendamiento
        this.props.onChange({
            target: { id: 'horario', value: this.state.horario },
        })
    }
    
    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */

    render() {
        /*
        Crea un objeto lista que contiene un label y un checkbox
        basado el objeto json horario. En la primera coloca el nombre del día
        y en segundo el checkbox con el valor por defecto false
        */
        const Lista = Object.entries(this.state.horario).map((a, b) => {
            return (
                <label>
                    <input
                        id={a[0]}
                        type="checkbox"
                        checked={a[1]}
                        onClick={(e) => this.click(a[0], !a[1])}
                    />
                    {a[0]}
                </label>
            )
        })
        //renderiza la lista creada anteriormente
        return <div className="horario">{Lista}</div>
    }
}

export default Horario
