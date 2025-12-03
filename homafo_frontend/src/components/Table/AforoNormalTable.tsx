import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import BootstrapTable from "react-bootstrap-table-next";

import paginationFactory from 'react-bootstrap-table2-paginator';

interface IData {
    codSuscripcion:string;
    idSuscripcion:string;
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

class AforoNormalTable extends Component<{ data: IData[],urlLinkButton:string},{}> {
    constructor(props) {

        super(props)
        this.state = {
          sizePerPage: 10
        }
    } //end constructor

      columns = [
      {
        dataField: "idAforoButton",
        formatter: (rowContent, row:any) => {
          // console.log(rowContent);
          if(rowContent){} 
          return (<> 
          {this.props.urlLinkButton == "/aforos/multiusuario/editar"?
            <Link to={{pathname: this.props.urlLinkButton,
                       state: {
                         idAforo: row.idAforo.toString()
                      }
                      }} >
                        <button className="btn btn-success" >Editar</button>
             </Link>      
            :
            <Link to={`${this.props.urlLinkButton}/${row.idAforo.toString()}` || " "} >
              <button className="btn btn-success" >Editar</button>
             </Link>      
          }          
        </>);
        }
      },
    {
        dataField: "idAforo",
        text: "Id Aforo",
        sort: true
      },
      {
        dataField: "codSuscripcion",
        text: "Codigo Suscripcion",
        sort: true
      },
      /*{
        dataField: "nombresYapellidos",
        text: "Nombres",
        sort: true
      },*/
      {
        dataField: "volumenPromedio",
        text: "Vol Promedio",
        sort: true,
        hidden:true

      },
      /*{
        dataField: "direccion",
        text: "Direccion",
        sort: true
      },*/
      {
        dataField: "fechaInicio",
        text: "Fecha Inicial",
        sort: true
      },
      {
        dataField: "fechaFinal",
        text: "Fecha Vigencia Aforo",
        sort: true
      },
      {
        dataField: "tipoGenerador",
        text: "Tipo Generador",
        sort: true,
        hidden:true
      },
      {
        dataField: "factorProduccion",
        text: "Factor Prod.",
        sort: true
      },
      {
        dataField: "tafna",
        text: "Tafna",
        sort: true,
        hidden:true
      },
      {
        dataField: "tipoAforo",
        text: "Tipo Aforo",
        sort: true
      },
      /*{
        dataField: "volumenTotal",
        text: "Volumen Total",
        sort: true
      },*/
      {
        dataField: "estado",
        text: "Estado",
        sort: true
      }
      
  ];
  
    render() {

        const { data } = this.props
        return (<>{
          !!data.length?
            <div style={{ padding: "20px" }}>
              <h1 className="h2">Consulta Resultados de Aforos </h1>
              <BootstrapTable 
              className="table table-striped"
              id="consultaAforoNormal" 
              keyField="id" data={data} 
              columns={this.columns} 
              pagination={ paginationFactory() }   
              /></div>:<div>No se han encontrado Resultados</div>
            }
            </>
          );
        }
    }
export default (AforoNormalTable)