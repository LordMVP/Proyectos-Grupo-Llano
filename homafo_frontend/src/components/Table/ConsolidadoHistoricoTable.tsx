import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import BootstrapTable from "react-bootstrap-table-next";

import paginationFactory from 'react-bootstrap-table2-paginator';
import { Link } from 'react-router-dom'


interface IData {
    idAforo:string;
    idMultiusuario:number;
    nombreTercer: number;
    direccion: string;
    fecha: string;
};

class ConsolidadoHistoricoTable extends Component<{ data: IData[]}, {}> {
    constructor(props) {

        super(props)
        this.state = {
            
        }
    } //end constructor
    static  columns = [
    //   {
    //     dataField: "idAforoButton",
    //     formatter: (rowContent, row:any) => {
    //       // console.log(rowContent);
    //       if(rowContent){} 
    //       return (<>
    //         <Link to={`/aforos/visitas/RegistroVisitas/${row.idAforo.toString()}` || " "} >
    //           <button className="btn btn-success" >Editar</button>
    //         </Link>     
    //     </>);
    //     }
    //   },
    {
        dataField: "idAforo",
        text: "Id Aforo",
        sort: true,
        align: 'center',
        headerAlign: 'center',
      },
      {
        dataField: "claseSuscripcion",
        text: "Clase Aforo",
        sort: true,
        align: 'center',
        headerAlign: 'center',
      },

      {
        dataField: "fechaInicio",
        text: "Fecha Inicio",
        sort: true,
        align: 'center',
        headerAlign: 'center',
      },
      {
        dataField: "fechaFinal",
        text: "Fecha Vigencia",
        sort: true,
        align: 'center',
        headerAlign: 'center',
      },
      {
        dataField: "tipoAforo",
        text: "Tipo de Aforo",
        sort: true,
        align: 'center',
        headerAlign: 'center',
      },
      {
        dataField: "estado",
        text: "Estado",
        sort: true,
        align: 'center',
        headerAlign: 'center',
      },
      {
        dataField: "idAforoButton",
        text: "Visualizar",
        align: 'center',
        headerAlign: 'center',
        formatter: (rowContent, row:any) => {
          //console.log(rowContent);
          if(rowContent){} 
          return (<> 
             <Link to={{pathname: '/aforos/historicos/visualizar/',
                       state: {
                         idAforo: row.idAforo.toString(),
                         numAforoPadre: row.numAforoPadre.toString()
                      }
                      }} >
                        <button className="btn btn-success" >Visualizar</button>
             </Link>      

        </>);
        }
      }
      
      
  ];
    render() {
        const { data } = this.props

        return (
              <BootstrapTable 
              className="table table-striped" 
              keyField="id-visitas-table" data={data} 
              columns={ConsolidadoHistoricoTable.columns} 
              pagination={ paginationFactory() }   
              />
            
          );
        }
    }
export default (ConsolidadoHistoricoTable)