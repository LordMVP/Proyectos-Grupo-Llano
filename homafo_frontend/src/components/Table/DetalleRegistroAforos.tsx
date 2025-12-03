import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
// import { Form, Col, Button,  Table, Modal } from 'react-bootstrap'
import { Form, Col, Button, Card, Row } from 'react-bootstrap'
// import { Form, Col, Button, Table } from 'react-bootstrap'
 import BootstrapTable from "react-bootstrap-table-next";
 import paginationFactory from 'react-bootstrap-table2-paginator';
//  import filterFactory, { selectFilter } from 'react-bootstrap-table2-filter';
import '../../assets/aforosRealizados.css'
import * as API from '../../api/aforos/aforos'
import ModalDetallesEditar from '../../components/utils/ModalDetalleEdit'
import '../../assets/editaforo.css';
import ModalCargando from '../../components//utils/ModalCargando/ModalCargando';
import { IoMdList, IoMdPhotos, IoMdSearch  } from "react-icons/io";
import ModalSlideFotos from '../../containers/aforos/visitas/ModalSlideFotos';

type  changeEventElement = React.ChangeEvent<HTMLInputElement>;
type FormEvent = React.FormEvent<HTMLFormElement>;
type StateRealizados ={
    buscar:boolean;
    consulta_desde: string;
    consulta_hasta: string;
    consulta_tecnico_aforador: string;
    dataUpdate:[];
    aforos_originales:any;
    aforos_realizados:any ;
    aforos_pendientes: any;
    aforos_cancelados:any;
    total:string;
    numAforo:string;
    showModal:boolean;
    detalleSelected:any;
    observaciones:string;
    Totales:any;
    aforos_realizadosBasico:any;
    cargando:boolean;
    ShowModalSlideFotos:boolean;
    datosFotos:any;
    
// }
}

class DetalleRegistroAforos extends Component<{ data: any[],tecnicoAforador,aforos_pendientes,aforoId},StateRealizados > {
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
            aforos_cancelados:[],
            aforos_originales:[],
            total:"",
            numAforo:"",
            showModal:false,
            detalleSelected:[],
            observaciones:"",
            Totales:[],
            aforos_realizadosBasico:[],
            cargando:false,
            ShowModalSlideFotos:false,
            datosFotos:{
              dia:'',
              semana:'',
              idDmaf:0,
              fechaEjecucion:'',
              observaciones:''
            },
        }
    } //end constructor

    async componentDidMount(){
        await this.fetchData()
    }

    fetchData=async()=>{
        await this.setState({
          cargando:true
        })
        const numAforoToedit = this.props.aforoId;//window.location.pathname.split("/")[9];
        await this.setState({numAforo:numAforoToedit})
        debugger;

        await API.GetAforosRealizadosEdit(numAforoToedit)
            .then(response => {
                if(response.success===true){
                  debugger;

                    let x =response.data
                    const aforoRealizados =x.filter((item)=>{return item.estado ==="T"});
                     const aforosPendientes =x.filter(item=>{return item.estado ==="P"});
                     const aforosCancelados =x.filter(item=>{return item.estado ==="C"});
                    console.log("response visitas edit",response,aforosPendientes,aforoRealizados)
                    this.setState({ aforos_realizados: aforoRealizados, aforos_realizadosBasico: aforoRealizados})
                     this.setState({ aforos_pendientes: aforosPendientes })
                      this.setState({ aforos_cancelados: aforosCancelados })
                     
                     this.setState({ total: response.data[0].total })
                     console.log("state response self:",response)
                     return response;
                }
                return response;
            }  //end.then-AforosRealizadosdebug
            ).catch(error => { return Promise.reject(error.status);console.log('estoy en error...'); }); //end .catch-AforosRealizados
            await this.setState({
              cargando:false
            })
        }
    
    handleChange = (event: changeEventElement)=> this.setState({ [event.target.name]: event.target.value } as any)

    
     columnsRealizados = [    
      {
        dataField: "consecutivo",
        text: "N° Visita",
        sort: true,
        align: 'center',
        headerAlign: 'center',
        footer: '',
        footerAlign: 'center',
      },
     {
        dataField: "numeroVisita",
        text: "Id Visita",
        align: 'center',
        headerAlign: 'center',
        sort: true,
        footer: '',
        footerAlign: 'center',
      },
      {
        dataField: "fechaVisita",
        text: "Fecha Visita",
        align: 'center',
        sort: true,
        headerAlign: 'center',
        footer: '',
        footerAlign: 'center',
      },
      {
        dataField: "dia",
        text: "Día",
        align: 'center',
        sort: true,
        headerAlign: 'center',
        footer: '',
        footerAlign: 'center',
      },
      {
        dataField: "aforador",
        text: "Aforador",
        align: 'center',
        sort: true,
        headerAlign: 'center',
        footer: '',
        footerAlign: 'center',
      },
      {
        dataField: "semana",
        text: "Semana",
        align: 'center',
        sort: true,
        headerAlign: 'center',
        footer: 'TOTAL',
        footerAlign: 'center',          
      },
      {
        dataField: "volumen",
        formatter:row=>(row as number)?.toFixed(3),
        text: "Volumen Total",
        align: 'center',
        sort: true,
        headerAlign: 'center',
        footer: () => Number(this.state.total)?.toFixed(3),
        footerAlign: 'center',
      },
      {
        dataField: "idAforadorVisitaButton",
        text: "Detalles",
        align: 'center',
        headerAlign: 'center',
        footerAlign: 'center',
        formatter: (rowContent, row:any) => {
          if(rowContent || row){} 
          return ( <Button variant="primary" size='sm' onClick={() => this.handleOpenModal(row.numeroVisita)}>    <IoMdList className="mr-1" /> Detalles </Button> );
        }
      },
      {
        dataField: "idAforadorVisitaButton",
        text: "Ver Fotos",
        align: 'center',
        footerAlign: 'center',
        headerAlign: 'center',
        formatter: (rowContent, row:any) => {
          return ( <Button variant="outline-primary" size ='sm' key={rowContent}  onClick={()=>this.cargarfotosDatos(row)} ><IoMdPhotos/> Ver</Button> );
        }
      },
      
  ];

  columnsPendientes = [
    {
      dataField: "consecutivo",
      text: "N° Visita",
      sort: true,
      align: 'center',
      headerAlign: 'center',
    },
    {
        dataField: "numeroVisita",
        text: "Id Visita",
        sort: true,
        align: 'center',
        headerAlign: 'center',
      },
      {
        dataField: "fechaVisita",
        text: "Fecha Programación",
        sort: true,
        align: 'center',
        headerAlign: 'center',
      },
      {
        dataField: "aforador",
        text: "Tecnico Aforador",
        sort: true,
        align: 'center',
        headerAlign: 'center',
    }];
  columnsCancelados = [
    {
      dataField: "consecutivo",
      text: "N° Visita",
      sort: true,
      align: 'center',
      headerAlign: 'center',
    },
    {
      dataField: "numeroVisita",
      text: "Id Visita",
      sort: true,
      align: 'center',
      headerAlign: 'center',
    },
    {
      dataField: "fechaVisita",
      text: "Fecha Programación",
      sort: true,
      align: 'center',
      headerAlign: 'center',
    },
    {
      dataField: "aforador",
      text: "Tecnico Aforador",
      sort: true,
      align: 'center',
      headerAlign: 'center',
    },
    {
      dataField: "dia",
      text: "Día",
      sort: true,
      align: 'center',
      headerAlign: 'center',
    },
    {
      dataField: "semana",
      text: "Semana",
      sort: true,
      align: 'center',
      headerAlign: 'center',
    }
  ];

  handleSubmit=(e:FormEvent)=>{
    e.preventDefault()
    const numAforoToedit = this.props.aforoId;//window.location.pathname.split("/")[9];
    this.setState({numAforo:numAforoToedit,aforos_realizados: this.state.aforos_realizadosBasico });
    const dataSend ={numAforo:numAforoToedit,desde:this.state.consulta_desde,hasta:this.state.consulta_hasta,tecnicoAforador:this.state.consulta_tecnico_aforador}
    console.log('que tiene el datasend ',dataSend);
    console.log('que tiene realizados ',this.state.aforos_realizados);
    console.log('que tiene basico ',this.state.aforos_realizadosBasico);

    /*esta mal por que hace las condiciones sobre el maestro y no en el detalle...
    API.GetAforoRealizadosBusqueda(dataSend).then(response => {
      console.log('que teine response ',response);
        if(response.success===true){
            let x =response.data
            console.log('que llego ',x);
            const aforoRealizados =x.filter((item)=>{return item.estado !=="P"});
            const aforosPendientes =x.filter(item=>{return item.estado !=="T"});
            this.setState({ aforos_realizados: aforoRealizados,aforos_pendientes: aforosPendientes})
            return response;
        }
        return response;
        }  //end.then-consolidado
        ).catch(error => { return Promise.reject(error); }); //end .catch-consolidado

        console.log('que hay en pendientes ',this.state.aforos_pendientes);
        console.log('que hay en realizados ',this.state.aforos_realizados);
        */
        if(this.state.consulta_desde.length>0 && this.state.consulta_hasta.length>0)
        {
          let filtro=this.state.aforos_realizadosBasico.filter((item:any)=>
          this.convertStringToDate(item.fechaVisita) >= this.convertStringToDate(this.state.consulta_desde) && this.convertStringToDate(item.fechaVisita) <= this.convertStringToDate(this.state.consulta_hasta)
          );
          this.setState({
            aforos_realizados:filtro,
            total:this.obtenerTotal(filtro)
          })
        }
        if(this.state.consulta_desde.length>0 && this.state.consulta_hasta.length>0 && this.state.consulta_tecnico_aforador.length>0)
        {
          let filtro=this.state.aforos_realizadosBasico.filter((item:any)=>
          this.convertStringToDate(item.fechaVisita) >= this.convertStringToDate(this.state.consulta_desde) && this.convertStringToDate(item.fechaVisita) <= this.convertStringToDate(this.state.consulta_hasta) &&  item.aforador===this.state.consulta_tecnico_aforador
          );
          this.setState({
            aforos_realizados:filtro,
            total:this.obtenerTotal(filtro)
          })
        }
        if(this.state.consulta_desde.length===0 && this.state.consulta_hasta.length===0 && this.state.consulta_tecnico_aforador.length===0)
        {
          this.setState({
            aforos_realizados:this.state.aforos_realizadosBasico,
            total:this.obtenerTotal(this.state.aforos_realizadosBasico)
          })
        }
        
        //aforador  fechaVisita   volumen
        
       console.log('que hay en pendientes ',this.state.aforos_realizados);
  } //end handleSubmit

  convertStringToDate=(valor:any)=>
  {
    let fecha:any =valor.split('-');
    return new Date(fecha[0], fecha[1] - 1, fecha[2]);
  }

  obtenerTotal=(lista:any)=>
  {
    let cuenta=0;
    for(let item in lista)
    {
      cuenta=cuenta+lista[item].volumen;
    }
    return cuenta.toString();
  }
  
  handleOpenModal = (numeroVisita: any) => {
    console.log("id open modal parameter::",numeroVisita)
    const filtered = this.state.aforos_realizados.filter(data=>data.numeroVisita===numeroVisita)
    if(filtered.length){
        const detalleSelec= [filtered[0].detalles ]
        if(detalleSelec.length){

            this.setState({detalleSelected:detalleSelec[0]})
            this.setState({observaciones:filtered[0].observaciones})
             //this.setState({observaciones:detalleSelec[0][0].observaciones})
             this.setState({Totales:[detalleSelec[0][0].totalTotales,detalleSelec[0][0].totalCantidadRecipientes]})
            this.setState({showModal: true});  
        }
    }else{ console.log("no existe datos en el detalle selecionado") }
    }

    handleModalClose=()=>{
        this.setState({ showModal: false })
    }

    mostrarCargando = (): any => {
        if (this.state.cargando) {
            return (
                <ModalCargando estado={this.state.cargando}></ModalCargando>
            )
        }
    }

    cargarfotosDatos=async(row:any)=>
    {
        //console.log('que llego de row ',row);
        await this.setState({
          datosFotos:{
              ...this.state.datosFotos,dia:row.dia,semana:row.semana,fechaEjecucion:row.fechaVisita,observaciones:row.observaciones,idDmaf:row.numeroVisita
          },
          ShowModalSlideFotos:true
      })
      //console.log('que tiene datosFotos ',this.state.datosFotos);
    }  

    render() {

        // const { data}=this.props
        const { consulta_desde,consulta_hasta,consulta_tecnico_aforador, aforos_realizados,showModal,aforos_pendientes ,aforos_cancelados} = this.state
        return (<>
        {this.mostrarCargando()}
         <Card className="shadow-sm mb-4">
            <Card.Header className="py-2">
                <h6 className="mb-0">Filtros de Búsqueda</h6>
            </Card.Header>
            <Card.Body className="py-3">
                <Form onSubmit={this.handleSubmit} className="mb-0">
                    <Row>
                        <Col md={3}>
                            <Form.Group className="mb-0">
                                <Form.Label>Desde</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    name="consulta_desde" 
                                    value={consulta_desde} 
                                    onChange={this.handleChange} 
                                    hidden={this.state.buscar} 
                                    
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-0">
                                <Form.Label>Hasta</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    name="consulta_hasta" 
                                    value={consulta_hasta}  
                                    onChange={this.handleChange} 
                                    hidden={this.state.buscar} 
                                    
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-0">
                                <Form.Label >Técnico Aforador</Form.Label>
                                <Form.Control 
                                    as="select" 
                                    name="consulta_tecnico_aforador" 
                                    value={consulta_tecnico_aforador} 
                                    onChange={this.handleChange} 
                                    hidden={this.state.buscar}
                                    
                                >
                                    <option value=""> ————— </option>
                                    {this.props.tecnicoAforador.map((tecnico:any)=> (
                                        <option key={tecnico.id} value={tecnico.object}>
                                            {tecnico.object}
                                        </option>
                                    ))} 
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={2} className="d-flex align-items-end">
                            <Button 
                                variant="primary" 
                                size="sm" 
                                type="submit" 
                                hidden={this.state.buscar}
                                className="px-3 w-100"
                            >
                        <IoMdSearch className="mr-1" /> Consultar
                        </Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
          <Card className="shadow-sm mb-4">
            <Card.Header className="">
              <h6 className="mb-0">Aforos Realizados</h6>
              <span className="badge badge-light">{aforos_realizados?.length || 0} registros</span>
            </Card.Header>
            <Card.Body className="p-3">
              <BootstrapTable
                bootstrap4
                className="table table-sm table-hover border-0 m-0"
                wrapperClasses="table-responsive"
                id="AforosrealizadosTable2"
                keyField="id-AforosrealizadosTable"
                data={aforos_realizados}
                columns={this.columnsRealizados}
                pagination={paginationFactory({
                  sizePerPage: 5,
                  sizePerPageList: [5, 10, 15],
                })}
                rowClasses="small"

              />
            </Card.Body>
          </Card>
          <Card className="mb-4">
            <Card.Header className="">
              <h6 className="mb-0">Aforos Pendientes</h6>
              <span className="badge badge-light">{aforos_pendientes?.length || 0} registros</span>
            </Card.Header>
            <Card.Body className="p-3">
              <BootstrapTable
                className="table table-sm table-hover border-0 m-0"
                wrapperClasses="table-responsive"
                id="AforosPendientesTable2"
                keyField="id-AforosPendientesTable"
                data={aforos_pendientes}
                columns={this.columnsPendientes}
                pagination={paginationFactory({
                  sizePerPage: 5,
                  sizePerPageList: [5, 10, 15],
                })}
                rowClasses="small"
              />
            </Card.Body>
          </Card>
          <Card className="mb-4">
            <Card.Header className="">
              <h6 className="mb-0">Aforos Cancelados</h6>
              <span className="badge badge-light">{aforos_cancelados?.length || 0} registros</span>
            </Card.Header>
            <Card.Body className="p-3">
              <BootstrapTable
                className="table table-sm table-hover border-0 m-0"
                wrapperClasses="table-responsive"
                id="AforosPendientesTable2"
                keyField="id-AforosPendientesTable"
                data={aforos_cancelados}
                columns={this.columnsCancelados}
                pagination={paginationFactory({
                  sizePerPage: 5,
                  sizePerPageList: [5, 10, 15],
                })}
                rowClasses="small"
              />
            </Card.Body>
          </Card>
                <ModalDetallesEditar 
                columnsData ={["Tipo recipiente","Dimensiones","Cantidad recipientes","Equivalencia (m3)","Peso","Total","Observaciones"]}
                data ={this.state.detalleSelected || []}
                columnTotal ={["TOTALES"]}
                dataTotal ={this.state.Totales}
                observaciones={this.state.observaciones}
                handleModalClose={this.handleModalClose} 
                showModal={showModal}/> 

            < ModalSlideFotos
               dia={this.state.datosFotos.dia}
               semana={this.state.datosFotos.semana}
                data={{}}
                idVisita={this.state.datosFotos.idDmaf}
                fechaEjecucion={this.state.datosFotos.fechaEjecucion}
                observaciones={this.state.datosFotos.observaciones}
                 showModalConceptos={this.state.ShowModalSlideFotos}
                 handleModalConceptosClose={()=>{this.setState({ShowModalSlideFotos:false})}}
               
               ></ModalSlideFotos>    
            </>
          );
        }
    }
export default (DetalleRegistroAforos)