import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import BootstrapTable from "react-bootstrap-table-next";

import paginationFactory from 'react-bootstrap-table2-paginator';
import ParparametrosAforoApi from "../../api/aforos/ParParametrosAforoApi";
import basicoDefault from '../../api/homologaciones/BasicoDefault';

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

interface IDistribucion {
    nombre:string,
    valor:string
}

class AforoMultiTable extends Component<{ data: IData[],urlLinkButton:string},{parametros:[],sizePerPage:number,tiposDistribucion:[IDistribucion]}> {
    constructor(props) {
        super(props)
        this.state = {
          sizePerPage: 10,
          parametros:[],
          tiposDistribucion:[{nombre:"",valor:""}],
        }
    } //end constructor

        componentDidMount = async ()=>{

          let paraApiAforo: ParparametrosAforoApi = new ParparametrosAforoApi();
          let tmp = await paraApiAforo.listaParametros();
          await this.setState({
            parametros: tmp.data
          })


        let basico: basicoDefault = new basicoDefault();

        await this.setState({
          tiposDistribucion: await JSON.parse(basico.buscarParametro('tipos_distribucion', this.state.parametros))
        })
      }

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
        dataField: "uniComplemento",
        text: "Id Multiusuario",
        sort: true
      },
    {
        dataField: "idAforo",
        text: "Id Aforo",
        sort: true
      },
      {
        dataField: "nombreMultiusuario",
        text: "Nomb Multiusuario",
        sort: true
      },
      {
        dataField: "fechaFinal",
        text: "Fecha Final",
        sort: true
      },
      {
        dataField: "tipoAforo",
        text: "Tipo Aforo",
        sort: true
      },
      {
        dataField: "distribucion",
        formatter:(r)=>r=='2'?'Coeficiente Simple' : r=='4' ? 'Distribución Porcentual' : r=='6' ? 'Coeficiente de propiedad horizontal' : '',
        text: "Tipo Distribucion",
        sort: true
      },
      {
        dataField: "cantidadUsuarios",
        text: "Cant Usuarios",
        sort: true
      },
      {
        dataField: "actividad",
        text: "Actividad",
        sort: true,
        hidden:true
      },
      {
        dataField: "tipoGenerador",
        text: "Tipo Generador",
        sort: true,
        hidden:true
      },
      {
        dataField: "volumenTotal",
        text: "Volumen Total",
        sort: true,
        hidden:true
      },
      {
        dataField: "tafna",
        text: "Tafna",
        sort: true,
        hidden:true
      },
      {
        dataField: "estado",
        text: "Estado",
        sort: true
      },{
        dataField: "observaciones",
        text: "Observaciones",
        sort: true
      }
      
  ];
  
    render() {

        const { data } = this.props
        return (<>{
          !!data.length?

              <BootstrapTable 
              className="table table-striped"
              id="consultaAforoNormal" 
              keyField="id" data={data} 
              columns={this.columns} 
              pagination={ paginationFactory() }   
              />:<div>No se han encontrado Resultados</div>
            }
            </>
          );
        }
    }
export default (AforoMultiTable)