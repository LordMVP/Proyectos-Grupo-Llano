import React, { Component } from 'react'
import { Form, Col, Button, Table } from 'react-bootstrap'
import '../../../assets/aforosRealizados.css'
import * as API from '../../../api/aforos/aforosMulti'
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
    buscar:boolean;
    consulta_desde: string;
    consulta_hasta: string;
    consulta_tipo_aforo: string;
    aforos_consolidados:any;
  }

class ConsolidadoAforosMulti extends Component<{ tiposAforo},StateRealizados > {
    constructor(props) {

        super(props)
        this.state = {
            buscar:true,
          consulta_desde:"",
          consulta_hasta:"",
          consulta_tipo_aforo:"",
          aforos_consolidados:""
        }
  global = Function('return this')() || (42, eval)('this');

        
    } //end constructor
    fetchData=()=>{
        let numAforoToedit = window.location.pathname.split("/")[9];
        API.GetAforoConsolidadoEdit(numAforoToedit).then(response => {
            this.setState({ aforos_consolidados: response.data })
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
        const { consulta_desde,
        consulta_hasta,
        consulta_tipo_aforo,aforos_consolidados } = this.state
        return (<>
         <Form className="mb-3" onSubmit={this.handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridEmail" md="3">
                                <Form.Label hidden={this.state.buscar}> Desde</Form.Label>
                                <Form.Control placeholder="desde" type="date" name="consulta_desde" value={consulta_desde} onChange={this.handleChange}  hidden={this.state.buscar}/>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridEmail" md="3">
                                <Form.Label hidden={this.state.buscar}>Hasta</Form.Label>
                                <Form.Control placeholder="hasta" type="date" name="consulta_hasta" value={consulta_hasta} onChange={this.handleChange}  hidden={this.state.buscar}/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridState" md="3">
                            <Form.Label hidden={this.state.buscar}>Tipo de Aforo</Form.Label>
                                <Form.Control as="select" name="consulta_tipo_aforo" value={consulta_tipo_aforo} onChange={this.handleChange}  hidden={this.state.buscar}>
                                    <option value=""> ————— </option>
                                     {this.props.tiposAforo.map((aforo:any)=> {
                                        return(
                                            <option key={aforo.id} value={aforo.object}>{aforo.object}</option>
                                            ) 
                                        })
                                    } 
                                </Form.Control>
                            </Form.Group>
                            <div>
                                <br />
                                <Form.Label></Form.Label>
                                <Button variant="primary" className="mr-3" type="submit" style={{marginTop:"10px",marginLeft:"10px"}}  hidden={this.state.buscar}>   Consultar</Button>
                            </div>

                        </Form.Row>
                    </Form>
                                    {/* <h5>Aforos Realizados</h5>
              <BootstrapTable 
              className="table table-striped" 
              keyField="id" 
              data={data} 
              columns={AforosRealizadosTable.columns} 
              pagination={ paginationFactory() }
             filter={ filterFactory() }
              
              /> */}
                            <Table striped bordered hover >
                        <thead className="green-header">
                            <tr>
                            <th>Mes</th>
                            <th>Numero de visitas</th>
                            <th>Volumen (m3)</th>
                            <th>Volumen Medio</th>
                            <th>Toneladas</th>
                            </tr>
                        </thead>
                        <tbody>
                             {

                            !!aforos_consolidados.length && aforos_consolidados.map(
                                (t: any, i: number) => {
                                    return <tr key={i} >
                                        <td >{t.mes}</td>
                                        <td >{t.numeroVisitas}</td>
                                        <td >{t.volumen}</td>
                                        <td >{t.volumenMedio}</td>
                                        <td >{t.toneladas}</td>
                                    </tr>
                                }
                            )
                        }
                        <tr>
                            <td ></td>   
                            <td></td>
                            <td></td>
                            <td className="green-header"><strong>Ton Media:</strong></td>   
                            <td></td>
                            {/* <td><strong>{this.props.totales.volumenMedia}</strong></td> */}
                            
                            </tr> 
                        </tbody>
                    </Table>
            </>
          );
        }
    }
export default (ConsolidadoAforosMulti)