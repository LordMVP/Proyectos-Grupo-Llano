import {TAforosConsolidados} from '../../models/types/aforos/AforosNormalConsolidadosEdit'
import React, { Component } from 'react'
import { /*Form, Col, Button,*/ Table } from 'react-bootstrap'
import '../../assets/aforosRealizados.css'
import * as API from '../../api/aforos/aforos'
import TableRotated from '../../components/Table/TableRotated'
// import '../../../assets/aforosVisitas.css';
// interface IData {
//     id:number;
//     numero_visita:string;
//     fecha_visita: string;
//     dia: string;
//     aforador:string;
//     tipoGenerador: string;
//     semana: string;
//     volumen_total: string;
//     totales:{};
//     detalles_observaciones:string;
//     detalles_totales:string;
//     detalles:[];
// };
type FormEvent = React.FormEvent<HTMLFormElement>;
type  changeEventElement = React.ChangeEvent<HTMLInputElement>;
type StateRealizados ={
    consulta_desde: string;
    consulta_hasta: string;
    consulta_tipo_aforo: string;
    aforos_consolidados:any;
    buscar:boolean;
    numAforo:string;
    // handleOpenModal: (number:unknown)=>void;
  }

class ConsolidadoAforos extends Component<{ data?: any[],tiposAforo,totales?,idAforo:any},StateRealizados > {
    constructor(props) {

        super(props)
        this.state = {
          consulta_desde:"",
          consulta_hasta:"",
          consulta_tipo_aforo:"",
          aforos_consolidados:{} as TAforosConsolidados,
          buscar:false,
          numAforo:""
          
        }
        
    } //end constructor
    fetchData=()=>{
        //const numAforoToedit = window.location.pathname.split("/")[5];
        const numAforoToedit = this.props.idAforo;
        this.setState({numAforo:numAforoToedit})
        API.GetAforoConsolidadoEdit(numAforoToedit).then(response => {
            
            if(response.success===true){
                

                    this.setState({ aforos_consolidados: response.data[0] })
                
                    console.log("aforos_consolidados=======T=====>",this.state.aforos_consolidados)
                    return response;
            }
            return response;
            }  //end.then-consolidado
            ).catch(error => { return Promise.reject(error.status); }); //end .catch-consolidado
    }
    componentDidMount(){
        this.fetchData();
       
    }
    
    handleChange = (event: changeEventElement)=> {
    console.log([event.target.name])
    console.log(event.target.value )
        this.setState({ [event.target.name]: event.target.value } as any)}

    static selectOptions = {
        0: '--',
        1: '--',
        2: '--'
      };
      handleSubmit=(e:FormEvent)=>{
        e.preventDefault()
        // API.buscarafrpscpmspñodadps()
        const dataSend ={numAforo:this.state.numAforo,desde:this.state.consulta_desde,hasta:this.state.consulta_hasta,tipoAforo:this.state.consulta_tipo_aforo}
        console.log("datasent",dataSend)

        API.GetAforoConsolidadoBusqueda(dataSend).then(response => {
            if(response.success===true){

                this.setState({ aforos_consolidados: response.data[0] })
                return response;
            }
            return response;
            }  //end.then-consolidado
            ).catch(error => { return Promise.reject(error.status); }); //end .catch-consolidado
        
          } 
//     static  columns = [
      
//     {
//         dataField: "numero_visita",
//         text: "Numero Visita",
//         sort: true
//       },
//       {
//         dataField: "fecha_visita",
//         text: "Fecha Visita",
//         sort: true
//       },
//       {
//         dataField: "dia",
//         text: "Día",
//         sort: true
//       },
//       {
//         dataField: "aforador",
//         text: "Aforador",
//         sort: true,
//         formatter: cell => AforosRealizadosTable.selectOptions[cell],
//         filter: selectFilter({
//         options: AforosRealizadosTable.selectOptions
//   })
//       },
//       {
//         dataField: "semana",
//         text: "Semana",
//         sort: true
//       },
//       {
//         dataField: "volumen_total",
//         text: "Volumen Total",
//         sort: true
//       },
//       {
//         dataField: "idAforadorVisitaButton",
//         formatter: (rowContent, row:any) => {
//           // console.log(rowContent);
//           if(rowContent || row){} 
//           return (<>
//               {/* <td ><Button variant="primary" onClick={() => this.props.handleOpenModal(row.id)}>Detalles </Button></td>     */}
//         </>);
//         }
//       },
      
//   ];

  // static options = {
  //   onSizePerPageChange: (sizePerPage, page) => {
  //   },
  //   onPageChange: (page, sizePerPage) => {
  //   }
  // };
        
    render() {

        // const { data}=this.props
        const { /*consulta_desde, consulta_hasta, consulta_tipo_aforo,*/ aforos_consolidados } = this.state
        return (< >
        
              <br/>
                                    {/* <h5>Aforos Realizados</h5>
              <BootstrapTable 
              className="table table-striped" 
              keyField="id" 
              data={data} 
              columns={AforosRealizadosTable.columns} 
              pagination={ paginationFactory() }
             filter={ filterFactory() }
              
              /> */}
              <div style={{overflowY:"scroll",height:"250px",textAlign:"center"}}>

                            <Table striped bordered hover  >
                        <thead>
                            <tr>
                            <th scope='col'>Mes</th>
                            <th scope='col'>Numero de visitas</th>
                            <th scope='col'>Volumen (m3)</th>
                            <th scope='col'>Peso(K) </th>
                            </tr>
                        </thead>
                        <tbody>
                             {
                                 
                                 !!aforos_consolidados.detalles ?aforos_consolidados.detalles.map(
                                     (t: any, i: number) => {
                                         return <tr key={i} >
                                        <td scope='row' >{t.mes}</td>
                                        <td scope='row'>{t.numeroVisitas}</td>
                                        <td scope='row'>{Math.round(t.volumenM3 * 100) / 100}</td>
                                        <td scope='row'>{t.volumenMes}</td>
                                    </tr>
                                }
                                ):[]
                            }
                        <tr>
                            <td><strong>TOTALES:</strong></td>   
                            <td><strong>{aforos_consolidados.totalNumeroVisitas}</strong></td>
                            <td><strong>{Math.round(aforos_consolidados.totalVolumenM3 * 100) / 100}</strong></td>
                            <td><strong>{aforos_consolidados.totalVolumenMes }</strong></td>
                            
                            </tr> 
                        </tbody>
                    </Table>
                            </div>

                    <TableRotated
                    colums={["Factor produccion", "Tipo","Tafna"]} 
                    data={[aforos_consolidados.factorProduccion, aforos_consolidados.tipo,aforos_consolidados.tafna]} 
                    />  
            </>
          );
        }
    }
export default (ConsolidadoAforos)