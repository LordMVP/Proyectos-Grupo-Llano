import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import BootstrapTable from "react-bootstrap-table-next";

import paginationFactory from 'react-bootstrap-table2-paginator';


interface IData {
    idAforo:string;
    idMultiusuario:number;
    nombreTercer: number;
    direccion: string;
    fecha: string;
};

class AforoVisitasTable extends Component<{ data: IData[]}, {}> {
    constructor(props) {

        super(props)
        this.state = {
            
        }
    } //end constructor

    static  columns = [
      {
        dataField: "idAforoButton",
        text: "Editar",
        headerAlign: 'center',
        align: 'center',
        formatter: (rowContent, row:any) => {
           console.log('que tiene la visita ',row);
          if(rowContent){} 
          return (<>
            <Link to={`/aforos/visitas/RegistroVisitas/${row.idAforo.toString()}` || " "} >
              <button className="btn btn-success" >Editar</button>
            </Link>     
        </>);
        },
        headerStyle: {
          backgroundColor: '#1E90FF',
          color:'#FFFAF0'
        }
      },
    {
        dataField: "idAforo",
        headerAlign: 'center',
        align: 'center',
        text: "Id Aforado",
        sort: true,
        headerStyle: {
          backgroundColor: '#1E90FF',
          color:'#FFFAF0'
        }
      },
      {
        dataField: "claseSuscripcion",
        headerAlign: 'center',
        align: 'center',
        text: "Clase Aforo",
        sort: true,
        headerStyle: {
          backgroundColor: '#1E90FF',
          color:'#FFFAF0'
        }
      },
      {
        dataField: "actividad",
        headerAlign: 'center',
        align: 'center',
        text: "Actividad",
        sort: true,
        headerStyle: {
          backgroundColor: '#1E90FF',
          color:'#FFFAF0'
        }
      },
      {
        dataField: "tipoAforo",
        headerAlign: 'center',
        align: 'center',
        text: "Tipo Aforo",
        sort: true,
        headerStyle: {
          backgroundColor: '#1E90FF',
          color:'#FFFAF0'
        }
      },
      {
        dataField: "nombresYapellidos",
        headerAlign: 'center',
        align: 'center',
        text: "Descripción / Tercero",
        sort: true,
        headerStyle: {
          backgroundColor: '#1E90FF',
          color:'#FFFAF0'
        }
      },
      {
        dataField: "direccion",
        headerAlign: 'center',
        align: 'center',
        text: "Direccion",
        sort: true,
        headerStyle: {
          backgroundColor: '#1E90FF',
          color:'#FFFAF0'
        }
      },
      {
        dataField: "fechaInicio",
        headerAlign: 'center',
        align: 'center',
        text: "Fecha Inicio Visita",
        sort: true,
        headerStyle: {
          backgroundColor: '#1E90FF',
          color:'#FFFAF0'
        }
      },
      {
        dataField: "fechaFinal",
        headerAlign: 'center',
        align: 'center',
        text: "Fecha Final visita",
        sort: true,
        headerStyle: {
          backgroundColor: '#1E90FF',
          color:'#FFFAF0'
        }
      },
      
      
  ];
    render() {

        const { data } = this.props
        return (
              <BootstrapTable 
              className="table table-striped" 
              keyField="idAforo"
              data={data} 
              columns={AforoVisitasTable.columns} 
              pagination={ paginationFactory() } 
              headerClasses="listaBusqueda"  
              />
            
          );
        }
    }
export default (AforoVisitasTable)