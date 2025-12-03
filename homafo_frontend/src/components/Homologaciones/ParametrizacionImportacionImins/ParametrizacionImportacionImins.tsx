import React from 'react';
import parametrosApi from '../../../api/homologaciones/ParParametrosApi';
import { Container, Row, Col , Button , Card , Form} from 'react-bootstrap';
//import basicoDefault from '../../../api/homologaciones/BasicoDefault';
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import paginationFactory from "react-bootstrap-table2-paginator";
import homoApi from '../../../api/homologaciones/Homologacion';
import update from 'immutability-helper';

interface IProps {
    value?: any,
    informacion:any,
    eliminarDetalle:(e:any)=>void,
    agregarDetalle:(e:any)=>void,
    listaTablas:any,
    tipoOperacion?:number,
    idImarcpadre:number
    //guardarInfoGestion:(e:any)=>void
}

class ParametrizacionImportacionImins extends React.Component<IProps, any>
{
    constructor(props: IProps) {
        super(props);
        this.state={
            cargando:false,
            estadoLista:false,
            lista:[],
            detalle:{
                idImins:0,
                tabla:'',
                orden:0,
                json:'',
                detalleDimins:[]
            },
            listaEncabezado:['tabla','orden'],
            seleccion:'',
            idImarcPadre:0
        }
        this.getEncabezado=this.getEncabezado.bind(this);
        this.formatoBotton=this.formatoBotton.bind(this);
    }

    async componentDidMount()
    {
        await this.cargarParametros();
        await this.cargarDefecto();
        await this.setState({
            lista:this.props.informacion,
            idImarcpadre:this.props.idImarcpadre
        });
        //console.log('que llego al imins...'+this.state.idImarcpadre);
        //console.log('que llego de empresas ',this.state.listaTablas);
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
                
    }

    async cambioValor(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        await this.setState({
            detalle:{
                ...this.state.detalle,[name]:value         
            }
        })
    }

    formatoBotton( cell:any,row:any)
    {
        return <Button variant="outline-danger" key={cell} onClick={this.seleccion.bind(this,row)} disabled={this.props.idImarcpadre>0 ? true : false}>Eliminar</Button>;
    }

    async seleccion(e:any)
    {
        let filtro=this.state.lista.filter(item => item.tabla !== e.tabla)
        await this.setState({
                lista:filtro
        })
        await this.props.eliminarDetalle(this.state.lista);
    }

    agregarColumna=async()=>
    {
        //let buscarNumero=this.state.lista.filter(item => item.Orden !== this.state.detalle.Orden);
        let busqueda= this.state.lista.filter(item => item.tabla !== this.state.detalle.tabla) 
        let tmp=busqueda;
        await this.setState({
            detalle:{
                ...this.state.detalle,detalleDimins:await this.agregarColumnas()
            }
        })
        tmp.push(this.state.detalle);
        await this.setState({
            lista:tmp,
            detalle:{
                idImins:0,
                tabla:'',
                orden:0,
                json:'',
                detalleDimins:[]
            }
        })
        await this.props.agregarDetalle(this.state.lista);
        console.log(this.state.lista);
    }

    async cambioValorColumnaLista(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {

        const {value, name}=e.target;
        let valorTmp=this.state.lista.filter(item => item.tabla === this.state.seleccion);
        valorTmp[0][name]=value;
        let index=this.state.lista.findIndex(item => item.tabla === this.state.seleccion);
        let updateRegistro=update(this.state.lista, {$splice: [[index, 1, valorTmp[0]]]});
        await this.setState({
            lista:updateRegistro
        })
    }

    agregarColumnas=async()=>
    {
        let array:any=[];
        let apiHomo:homoApi =new homoApi();
        let resultado=await apiHomo.columnasTabla(this.state.detalle.tabla);
        let listaTmp=await resultado.data;
        for(let item in listaTmp)
        {
            array.push({nombreColumna:listaTmp[item].columna,json:'',tipoResolucion:'NULL',tipoDato:'',validador:'',obligatorio:false,longitud:0,idDimins:0,diminseditable:false,diminsSugerido:false,diminsJsonSugerido:''});
        }
        return array;

    }

    metodoNuevaColumna=():any=>
    {
        if(this.props.idImarcpadre === 0)
        {
            return(
                <Card>
                    <Card.Body>
                        <Row>
                                <Col>
                                                <div className="form-group">
                                                    <Form.Group controlId="form1">
                                                        <label >Tabla</label>                                                        
                                                        <select onChange={e=>this.cambioValor(e)} className="form-control" name='tabla' value={this.state.detalle.tabla}>
                                                                <option value="--" key="0"></option>
                                                                {this.props.listaTablas.map((e : any, key : number) => {
                                                                        return <option key={key} value={e.valor}>{e.valor}</option>;
                                                                    })}
                                                            </select>
                                                        <Form.Text className="text-muted">
                                                            Este Campo es Obligatorio...
                                                        </Form.Text>
                                                    </Form.Group>  
                                                </div>
                                </Col>
                                <Col>
                                                <div className="form-group">
                                                    <Form.Group controlId="form2">
                                                        <label >orden</label>
                                                        <input className="form-control" onChange={e=>this.cambioValor(e)} name='orden' value={this.state.detalle.orden} type='number' placeholder=""/>
                                                        <Form.Text className="text-muted">
                                                            Este Campo es Obligatorio...
                                                        </Form.Text>
                                                    </Form.Group>                
                                                </div>
                                </Col>
                        </Row>
                        <Row>
                                <Col>
                                                <div className="form-group">
                                                        <label >Json Consulta</label>
                                                        <input className="form-control" onChange={e=>this.cambioValor(e)} name='json' value={this.state.detalle.json} type='text' placeholder="sintaxis JSON" />             
                                                </div>
                                </Col> 
                        </Row>
                        <Row>
                            <Col>
                                    <Button variant="primary" onClick={this.agregarColumna} disabled={this.state.detalle.tabla.length>0 && this.state.detalle.orden>0 ? false : true}>Agregar</Button>
                            </Col>
                        </Row>
                            </Card.Body>    
                    </Card>    
            )
        }
        else
        {
            return(
                <div></div>
            )
        }
    }

    getEncabezado()
    {
        //var encabezado = ['CODIGO','UBICACION','ESTRATO','MUNICIPIO','NOMBRE','IDENTIFICACION','DIRECCION','CICLO'];
        var encabezado = this.state.listaEncabezado;
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

    handleExpand=async(rowKey, isExpand)=> {
        //this.expandedRows[rowKey] = isExpand;
        //console.log('que seleccione...'+rowKey);
        //console.log('que seleccione2...'+isExpand);
        if(isExpand)
        {
            await this.setState({
                busqueda:[],
                seleccion:rowKey
            })
            //await this.cargarBarrios();
            //this.actualizarSeleccion(rowKey);
        }
        else
        {
           await this.setState({
                busqueda:[]
            })
        }
      }

      cargarDetalle=(e):any=>
    {
        return(
            <div>
                <Container>
                            <Row>
                                <Col>
                                            <div className="form-group">
                                                    <label >Json Consulta</label>
                                                    <input className="form-control" name='json' value={e.json} type='text' onChange={e=>this.cambioValorColumnaLista(e)} disabled={this.props.idImarcpadre >0 ? false : true} />
                                            </div>
                                </Col>                                
                            </Row>
                </Container>
            </div>
        ) 
    }

    render() {
        const tableOptions = {
            expandBy: "column",
            onExpand: this.handleExpand,
            onlyOneExpanding: true,
          };

          const expandColumnOptions = {
            //expandColumnVisible: true
          };

        return(
            <div>
                {this.metodoNuevaColumna()}   
                        <br/>
                        <br/>
                        <Row>
                                <Col>
                                    <BootstrapTable wrapperClasses="table" data={this.state.lista} striped={true} hover={true} pagination={paginationFactory({})} keyField="tabla"
                                    options={tableOptions} expandColumnOptions={expandColumnOptions} expandableRow={() => true} expandComponent={this.cargarDetalle}>                      
                                                <TableHeaderColumn dataAlign="center" dataField="button" dataFormat={this.formatoBotton}>Eliminar</TableHeaderColumn>           
                                                                {this.getEncabezado()}                
                                    </BootstrapTable>
                                </Col>
                        </Row>   
            </div>
        )
    }

}
export default ParametrizacionImportacionImins;