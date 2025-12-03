import React from 'react';
import parametrosApi from '../../../api/homologaciones/ParParametrosApi';
import { Container, Row, Col , Button  } from 'react-bootstrap';
import homoApi from '../../../api/homologaciones/Homologacion';
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import paginationFactory from "react-bootstrap-table2-paginator";
import ModalCargando from '../../../components/utils/ModalCargando/ModalCargando';

interface IProps {
    value?: any,
    informacion?:any,
    //guardarInfoGestion:(e:any)=>void
}

class ImportacionGas extends React.Component<IProps, any>
{
    constructor(props: IProps) {
        super(props);
        this.state={
            cargando:false,
            desde:'',
            hasta:'',
            ciclo:0,
            ciclos:[],
            estadoLista:false,
            lista:[],
            listaEnviar:[]
        }
        this.getEncabezado=this.getEncabezado.bind(this);
    }

    async componentDidMount()
    {
        await this.cargarParametros();
        await this.cargarDefecto();
    }

    cargarParametros=async()=>
    {
        let paraApi:parametrosApi=new parametrosApi();
        let tmp=await paraApi.listaParametros();
        await this.setState({
            parametros:tmp.data
        })
    }

    cargarDefecto=async()=>
    {
        let api:homoApi =new homoApi();
        let tmp=await api.listaCiclosOtros(322);
        await this.setState({
            ciclos:tmp.data
        })
    }

    async cambioValor(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        await this.setState({
               [name]:value
        })
    }

    buscarInformacion=async()=>
    {
        await this.setState({
            cargando:true
        })
        let api:homoApi =new homoApi();
        let tmp=await api.datosLlanogas(this.state.desde,this.state.hasta,this.state.ciclo);
        await this.setState({
            lista:tmp.data,
            estadoLista:true,
            cargando:false
        })
    }

    formatoGeneral2(cell:any)
    {
        let resultado='';
        for(let tmp in cell)
        {
            if(typeof cell[tmp] === 'string')
            {
                resultado=cell[tmp];
            }
        }
        return resultado;
        
        
    }

    mostrarCargando = (): any => {
        if (this.state.cargando) {
            return (
                <ModalCargando estado={this.state.cargando}></ModalCargando>
            )
        }
    }

    formatoBotton( cell:any)
    {
        return <Button variant="primary" key={cell}>Detalles</Button>;
    }

    getEncabezado()
    {
        //var encabezado = ['CODIGO','UBICACION','ESTRATO','MUNICIPIO','NOMBRE','IDENTIFICACION','DIRECCION','CICLO'];
        var encabezado = ['codigo','nombre','identificacion','direccion','ciclo'];
        return encabezado.map((row : any, index : number)=>{
            var tmp=row;
            var tmp2=tmp.lastIndexOf(".");
            if(tmp2>0)
            {
                let nombre1=row.substring(0, tmp2);
                return <TableHeaderColumn key={index} dataAlign="center" dataField={nombre1} dataFormat={this.formatoGeneral2} dataSort={true} >
                    {nombre1}
                    </TableHeaderColumn>
            }
            else
            {
            return <TableHeaderColumn key={index} dataAlign="center" dataField={row} dataSort={true}>
                    {row}
                    </TableHeaderColumn>
            }        
        })
    }

    handleExpand=async(rowKey, isExpand)=> {
        //this.expandedRows[rowKey] = isExpand;
        console.log('que seleccione...'+rowKey);
        //console.log('que seleccione2...'+isExpand);
        if(isExpand)
        {
            await this.setState({
            })
        }
        else
        {
           await this.setState({
                busqueda:[]
            })
        }
      }

    ver=()=>
    {
        console.log(this.state.listaEnviar);
    }  

    cargarDetalle=(e):any=>
    {
        return(
            <div>
                <Row>
                    <Col>
                                <div className="form-group">
                                        <label >Ubicacion</label>
                                        <input className="form-control" disabled={true} name='ubicacion' value={e.ubicacion} type='text' placeholder=""/>
                                </div>
                    </Col>
                    <Col>
                                <div className="form-group">
                                        <label >Estrato</label>                                
                                        <input className="form-control" disabled={true} name='estrato' value={e.estrato} type='text' placeholder=""/>
                                </div>
                    </Col>
                    <Col>
                                <div className="form-group">
                                        <label >Municipio</label>
                                        <input className="form-control" disabled={true} name='municipio' value={e.municipio} type='text' placeholder=""/>
                                </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                                <div className="form-group">
                                        <label >Ciclo</label>
                                        <input className="form-control" disabled={true} name='ciclo' value={e.ciclo} type='text' placeholder=""/>
                                </div>
                    </Col>
                    <Col>
                                <div className="form-group">
                                        <label >Clase Servicio</label>
                                        <input className="form-control" disabled={true} name='tipoUso' value={e.tipoUso} type='text' placeholder=""/>
                                </div>
                    </Col>
                    <Col>
                                <div className="form-group">
                                        <label ># Contador</label>
                                        <input className="form-control" disabled={true} name='contador' value={e.contador} type='text' placeholder=""/>
                                </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                                <div className="form-group">
                                        <label >Catastral</label>
                                        <input className="form-control" disabled={true} name='catastral' value={e.catastral} type='text' placeholder=""/>
                                </div>
                    </Col>
                    <Col>
                                <div className="form-group">
                                        <label >Fecha Matricula</label>
                                        <input className="form-control" disabled={true} name='fechaInicio' value={e.fechaInicio} type='text' placeholder=""/>
                                </div>
                    </Col>
                </Row>
            </div>
        ) 
    }

    modificarListaEnviar=async(row, isSelect, rowIndex, e)=>
    {
        //console.log('que llego ',row);
        //console.log('selecciono si '+isSelect);
        console.log('index ',rowIndex);
        console.log('que llego de e '+e);
        let valorTmp=[];//listaEnviar
        if(isSelect)
        {
            //valorTmp=this.state.lista.filter(item => item[this.state.indexColumna] === this.state.seleccion);
            let tmp=this.state.listaEnviar;
            tmp.push(row);
            await this.setState({
                listaEnviar:tmp
            })

        }
        else
        {
            valorTmp=this.state.listaEnviar.filter(item => item.codigo !== row.codigo);
            await this.setState({
                listaEnviar:valorTmp
            })
        }
    }

    renderLista = (): any => {
        const tableOptions = {
            expandBy: "column",
            onExpand: this.handleExpand,
            onlyOneExpanding: true,
          };

          const expandColumnOptions = {
            //expandColumnVisible: true
          }; 

        const selectRow = {
            mode: 'checkbox',
            clickToSelect: true,
            onSelect:this.modificarListaEnviar
        };

          if(this.state.estadoLista)
        {
            return(
                <div>
                    <BootstrapTable wrapperClasses="table" data={this.state.lista} striped={true} hover={true} pagination={paginationFactory({})} keyField="codigo"
                    options={tableOptions} expandColumnOptions={expandColumnOptions} expandableRow={() => true} expandComponent={this.cargarDetalle} selectRow={ selectRow }>                                
                                            {this.getEncabezado()}
                            <TableHeaderColumn dataAlign="center" dataField="button" dataFormat={this.formatoBotton}>Detalles</TableHeaderColumn>                
                    </BootstrapTable>
                </div>
            )
        }  
    }      

    render() {
        return(
            <div>
                {this.mostrarCargando()}
                <Container>
                    <Row className="text-center">
                        <Col>
                            <h2>Importación Información Emsa</h2>
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col>
                                <div className="form-group">
                                            <label >Desde</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='desde' value={this.state.desde} type='date' placeholder=""/>
                                </div>
                        </Col>
                        <Col>
                                <div className="form-group">
                                            <label >Hasta</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='hasta' value={this.state.hasta} type='date' placeholder=""/>
                                </div>
                        </Col>
                        <Col>
                                <div className="form-group">
                                            <label>Ciclo</label>
                                            <select onChange={e=>this.cambioValor(e)} className="form-control" name='ciclo' value={this.state.ciclo} >
                                                    <option value="" key="0"></option>
                                                    {this.state.ciclos.map((e : any, key : number) => {
                                                        return <option key={key} value={e.cic_ideregistro}>{e.cic_nombre}</option>;
                                                    })}
                                            </select>  
                                </div> 
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="primary" onClick={this.buscarInformacion} disabled={this.state.desde.length>0 && this.state.hasta.length>0 && this.state.ciclo>0 ? false : true}>Importar</Button>
                        </Col>
                        <Col>
                            <Button variant="primary" onClick={this.ver}>Importar</Button>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                        </Col>
                    </Row>
                    <Row>
                        {this.renderLista()}
                    </Row>
                </Container>
            </div>
        )
    }
}
export default ImportacionGas;
