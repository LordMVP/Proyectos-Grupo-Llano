import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
// import { Form, Col, Button,  Table, Modal } from 'react-bootstrap'
import { Form, Col, Button } from 'react-bootstrap'



// import { Form, Col, Button, Table } from 'react-bootstrap'
 import BootstrapTable from "react-bootstrap-table-next";
 import paginationFactory from 'react-bootstrap-table2-paginator';
//  import filterFactory, { selectFilter } from 'react-bootstrap-table2-filter';
import '../../../assets/aforosRealizados.css'
import * as API from '../../../api/aforos/aforos'
// import * as API from '../../../api/aforosMulti'
import ModalDetallesEditar from '../../../components/utils/ModalDetalleEdit'
 import '../../../assets/editaforo.css';
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
type  changeEventElement = React.ChangeEvent<HTMLInputElement>;
type FormEvent = React.FormEvent<HTMLFormElement>;
type StateRealizados ={
    buscar:boolean;
    consulta_desde: string;
    consulta_hasta: string;
    consulta_tecnico_aforador: string;
    dataUpdate:[];
    aforos_realizados:any ;
    aforos_pendientes: any;
    total:string;
    numAforo:string;
    showModal:boolean;
    detalleSelected:any;
    observaciones:string;
    Totales:any;
    
// }
}

class DetalleRegistrosAforo extends Component<{ tecnicoAforador},StateRealizados > {
    constructor(props) {

        super(props)
        this.state = {
            buscar:false,
          consulta_desde:"",
          consulta_hasta:"",
          consulta_tecnico_aforador:"",
          dataUpdate:[],
          aforos_realizados:"",
        aforos_pendientes:[],
        total:"",
        numAforo:"",
        showModal:false,
        detalleSelected:[],
        observaciones:"",
        Totales:[]
        }
    } //end constructor

    componentDidMount(){
        this.fetchData()
    }

    fetchData=()=>{
        const numAforoToedit = window.location.pathname.split("/")[9];
        this.setState({numAforo:numAforoToedit})
        API.GetAforosRealizadosEdit(numAforoToedit)
            .then(response => {
                if(response.success===true){
                    let x =response.data
                    const aforoRealizados =x.filter((item)=>{return item.estado !=="P"});
                     const aforosPendientes =response.data.filter(item=>{return item.estado !=="T"});
                    console.log("response visitas edit",response,aforosPendientes,aforoRealizados)
                    this.setState({ aforos_realizados: aforoRealizados })
                     this.setState({ aforos_pendientes: aforosPendientes })
                     
                     this.setState({ total: response.data[0].total })
                     console.log("state response self:",response)
                     return response;
                }
                return response;
            }  //end.then-AforosRealizados
            ).catch(error => { return Promise.reject(error.status); }); //end .catch-AforosRealizados
        }
    
    handleChange = (event: changeEventElement)=> this.setState({ [event.target.name]: event.target.value } as any)

    
     columnsRealizados = [
    {
        dataField: "numeroVisita",
        text: "Numero Visita",
        sort: true,
        footer: '',
        footerAlign: 'center',
      },
      {
        dataField: "fechaVisita",
        text: "Fecha Visita",
        sort: true,
        footer: '',
        footerAlign: 'center',
      },
      {
        dataField: "dia",
        text: "Día",
        sort: true,
        footer: '',
        footerAlign: 'center',
      },
      {
        dataField: "aforador",
        text: "Aforador",
        sort: true,
        footer: '',
        footerAlign: 'center',
        // formatter: cell => AforosRealizadosTable.selectOptions[cell],
        // filter: selectFilter({
        // options: AforosRealizadosTable.selectOptions
//   })
      },
      {
        dataField: "semana",
        text: "Semana",
        sort: true,
        footer: 'TOTAL',
        footerAlign: 'center',
        footerStyle: {backgroundColor: '#70B603'}
          
      },
      {
        dataField: "volumen",
        text: "Volumen Total",
        sort: true,
        footer: () => this.state.total,
        footerAlign: 'center',
      },
      {
        dataField: "idAforadorVisitaButton",
        footerAlign: 'center',
        formatter: (rowContent, row:any) => {
          if(rowContent || row){} 
          return ( <Button variant="primary" onClick={() => this.handleOpenModal(row.numeroVisita)}>Detalles </Button> );
        }
      },
      
  ];
  columnsPendientes = [
    {
        dataField: "idAforo",
        text: "Id Aforo",
        sort: true
      },
      {
        dataField: "fechaVisita",
        text: "Fecha Programación",
        sort: true
      },
      {
        dataField: "aforador",
        text: "Tecnico Aforador",
        sort: true
      }];

  handleSubmit=(e:FormEvent)=>{
    e.preventDefault()
    const dataSend ={numAforo:this.state.numAforo,desde:this.state.consulta_desde,hasta:this.state.consulta_hasta,tecnicoAforador:this.state.consulta_tecnico_aforador}
    console.log("datasent",dataSend)

    API.GetAforoRealizadosBusqueda(dataSend).then(response => {
        if(response.success===true){
            let x =response.data
            const aforoRealizados =x.filter((item)=>{return item.estado !=="P"});
            const aforosPendientes =x.filter(item=>{return item.estado !=="T"});
            this.setState({ aforos_realizados: aforoRealizados,aforos_pendientes: aforosPendientes})
            return response;
        }
        return response;
        }  //end.then-consolidado
        ).catch(error => { return Promise.reject(error.status); }); //end .catch-consolidado


  } 
  
  handleOpenModal = (numeroVisita: any) => {
    console.log("id open modal parameter::",numeroVisita)
    const filtered = this.state.aforos_realizados.filter(data=>data.numeroVisita===numeroVisita)
    console.log("aforosrealiados:",this.state.aforos_realizados,"filtered::",filtered)
    if(filtered.length){
        const detalleSelec= [filtered[0].detalles ]
        this.setState({detalleSelected:detalleSelec[0]})
        this.setState({observaciones:detalleSelec[0][0].observaciones})
        this.setState({Totales:[detalleSelec[0][0].totalTotales,detalleSelec[0][0].totalCantidadRecipientes]})
        this.setState({showModal: true});  
    }else{ console.log("no existe datos en el detalle selecionado") }
    }

    handleModalClose=()=>{
        this.setState({ showModal: false })
    }
    render() {

        // const { data}=this.props
        const { consulta_desde,consulta_hasta,consulta_tecnico_aforador, aforos_realizados,showModal } = this.state
        return (<>
         <Form className="mb-3" onSubmit={this.handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridEmail" md="3">
                                <Form.Label>Desde</Form.Label>
                                <Form.Control placeholder="desde" type="date" name="consulta_desde" value={consulta_desde} onChange={this.handleChange}  hidden={this.state.buscar} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridEmail" md="3">
                                <Form.Label>Hasta</Form.Label>
                                <Form.Control placeholder="hasta" type="date" name="consulta_hasta" value={consulta_hasta}  onChange={this.handleChange} hidden={this.state.buscar} />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridState" md="3">
                                <Form.Label>Tecnico Aforador</Form.Label>
                                <Form.Control as="select" name="consulta_tecnico_aforador" value={consulta_tecnico_aforador} onChange={this.handleChange} hidden={this.state.buscar}>
                                    <option value=""> ————— </option>
                                     {this.props.tecnicoAforador.map((tecnico:any)=> {
                                        return(
                                            <option key={tecnico.id} value={tecnico.object}>{tecnico.object}</option>
                                            )
                                            
                                        })
                                    } 
                                </Form.Control>
                            </Form.Group>
                            <div>
                                <br />
                                <Form.Label></Form.Label>
                                <Button variant="primary" className="mr-3" type="submit" style={{marginTop:"10px",marginLeft:"10px"}}  hidden={this.state.buscar} >   Consultar</Button>
                            </div>

                        </Form.Row>
                    </Form>
              <h5>Aforos Realizados</h5>
              <BootstrapTable 
              className="table table-striped greenRealizados" 
              id="AforosrealizadosTable"
              keyField="id-AforosrealizadosTable"
              data={aforos_realizados} 
              columns={this.columnsRealizados} 
              pagination={ paginationFactory() }
              /> 

                <h5>Aforos Pendientes</h5>
                <BootstrapTable 
                className="table table-striped greenRealizados" 
                id="AforosPendientesTable"
                keyField="id-AforosPendientesTable" 
                data={this.state.aforos_pendientes} 
                columns={this.columnsPendientes} 
                pagination={ paginationFactory() }
            //  filter={ filterFactory() }
              /> 

                <ModalDetallesEditar 
                columnsData ={["Tipo recipiente","Dimensiones","Cantidad recipientes","Equivalencia (m3)","Peso","Total","Observaciones"]}
                data ={this.state.detalleSelected || []}
                columnTotal ={["TOTALES"]}
                dataTotal ={this.state.Totales}
                observaciones={this.state.observaciones}
                handleModalClose={this.handleModalClose} 
                showModal={showModal}/> 
            </>
          );
        }
    }
export default (DetalleRegistrosAforo)


