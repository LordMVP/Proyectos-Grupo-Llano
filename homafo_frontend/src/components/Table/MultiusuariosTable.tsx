import React, { Component } from 'react'
import {  Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from 'react-bootstrap-table2-paginator';



// interface IData { 
//     codMultiusuario: number;
//     codActualizacion: number; 
//     nombre: string; 
//     direccion: string; 
//     fechaInicio: string; 
//     pesoToneladas: string ;
//     cantidadUsuarios: string ;
//     };
    
export default class MultiusuariosTable extends Component<{ data: any,urlLinkButton?:string }, {}> {
    constructor(props) {
        console.log("data",props.data)
    super(props)
        this.state = {
          sizePerPage: 10
            
        }
    } //end constructor

    static  columns = [
        
      {
          dataField: "codMultiusuario",
          text: "Codigo Multiusuario",
          sort: true
        },
        
        {
          dataField: "codActualizacion",
          text: "Codigo Actualización",
          sort: true
        },
        {
            dataField: "nombre",
            text: "Nombre",
            sort: true
        },
        {
            dataField: "direccion",
            text: "Dirección",
            sort: true
          },
          {
              dataField: "fechaInicio",
              text: "Fecha Inicio aforo",
              sort: true
            },
       
        {
          dataField: "pesoToneladas",
          text: "Peso (m3) Toneladas",
          sort: true
        },
        {
          dataField: "cantidadUsuarios",
          text: "Cantidad Usuarios",
          sort: true
        },
        {
            dataField: "codMultiusuarioButton",
            formatter: (rowContent, row:any) => {
              // console.log(rowContent);
              if(rowContent || row){} 
              return (<>
                 <Link to={`/aforos/multiusuario/editar/${row.codMultiusuario.toString()}` || " "} > 
                 {/* <Link to={`${this.props.urlLinkButton}${row.codMultiusuario.toString()}` || " "} > */}
                {/* <Link to={"aforosmultiusuario/editar/321" || " "} > */}
                  <Button variant="primary"> Detalles</Button>
                </Link>     
            </>);
            }
          }
        
    ];
    render() {


        const { data } = this.props

        
          
                  
                
             
        return (
             <> 
             {!!data.length &&

               <BootstrapTable 
               className="table table-striped" 
               keyField="id-2344" data={data} 
               columns={MultiusuariosTable.columns} 
               pagination={ paginationFactory() }   
               />
              }
            
</>
        )
    }
}

