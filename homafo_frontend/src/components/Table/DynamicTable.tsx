import React, { Component } from 'react'
import { Table, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

interface IData {
    codSuscripcion:string;
    id:number;
    idAforo: number;
    actividad: string;
    fechaFinal: string;
    tipoAforo:string;
    tipoGenerador: string;
    volumenTotal: string;
    tafna: string;
    estado: string;
};

class DynamicTable extends Component<{ data: IData[],sortBy:any }, {}> {
    

    render() {


        const { data } = this.props
        return (
            !!data.length && <div>
                <Table striped bordered hover >
                    <thead>
                        <tr>
                            <th></th>
                            <th>N° de aforo <i onClick={ ()=>this.props.sortBy("idAforo")}>⇅</i></th>
                            <th>Actividad  <i onClick={ ()=>this.props.sortBy("actividad")}>⇅</i></th>
                            <th>Fecha final aforo<i onClick={ ()=>this.props.sortBy("fechaFinal")}>⇅</i></th>
                            <th>Tipo aforo <i onClick={ ()=>this.props.sortBy("tipoAforo")}>⇅</i></th>
                            <th>Tipo generador</th>
                            <th>Volumen total aforo <i onClick={ ()=>this.props.sortBy("volumenTotal")}>⇅</i></th>
                            <th>Tafna</th>
                            <th>Estado aforo <i onClick={ ()=>this.props.sortBy("estado")}>⇅</i></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map(
                                (t: IData, i: number) => {
                                    return <tr key={i} >

                                        <td>
                                            <Link to={`/aforos/editar/${t.idAforo.toString()}` || " "} >
                                                <Button variant="success" >
                                                    Editar
                                            </Button>
                                            </Link>
                                        </td>
                                        <td >{t.idAforo.toString()}</td>
                                        <td >{t.actividad}</td>
                                        <td >{t.fechaFinal}</td>
                                        <td >{t.tipoAforo}</td>
                                        <td >{t.tipoGenerador}</td>
                                        <td >{t.volumenTotal}</td>
                                        <td >{t.tafna}</td>
                                        <td >{t.estado}</td>
                                    </tr>
                                }
                            )
                        }

                    </tbody>
                </Table>
            </div>

        )
    }
}

export default (DynamicTable)