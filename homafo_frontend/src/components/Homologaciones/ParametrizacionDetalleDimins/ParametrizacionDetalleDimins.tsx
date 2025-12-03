import React from 'react';
import parametrosApi from '../../../api/homologaciones/ParParametrosApi';
import { Row, Col ,  Container } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import paginationFactory from "react-bootstrap-table2-paginator";
import basicoDefault from '../../../api/homologaciones/BasicoDefault';
import update from 'immutability-helper';

interface IProps {
    value?: any,
    informacion:any,
    cambioValor:(e:any)=>void
    //guardarInfoGestion:(e:any)=>void
}

class ParametrizacionDetalleDimins extends React.Component<IProps, any>
{
    constructor(props: IProps) {
        super(props);
        this.state={
            cargando:false,
            estadoLista:false,
            listaEncabezado:['nombreColumna','tipoResolucion','obligatorio'],
            tiposResolucion:[],
            lista:[],
            seleccion:'',
            tiposDatos:[]
        }
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
        let basico:basicoDefault=new basicoDefault();
        await this.setState({
            tiposResolucion:await JSON.parse(basico.buscarParametro('tipo_resolucion_importacion',this.state.parametros)),
            tiposDatos:await JSON.parse(basico.buscarParametro('tipo_dato_importacion',this.state.parametros)),
            lista:this.props.informacion
        })
    }

    async cambioValor(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        let valorTmp=this.state.lista.filter(item => item.nombreColumna === this.state.seleccion);
        valorTmp[0][name]=value;
        let index=this.state.lista.findIndex(item => item.nombreColumna === this.state.seleccion);
        let updateRegistro=update(this.state.lista, {$splice: [[index, 1, valorTmp[0]]]});
        await this.setState({
            crear:{
                lista:updateRegistro
            }
        })
        this.props.cambioValor(this.state.lista);
    }

    getEncabezado()
    {
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
                    {row} - (Click detalles)
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
        if(isExpand)
        {
            await this.setState({
                busqueda:[],
                seleccion:rowKey
            })
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
                                                    <input className="form-control" onChange={e=>this.cambioValor(e)} name='json' value={e.json} type='text' />
                                            </div>
                                </Col>                                
                            </Row>
                            <Row>
                            <Col>
                                            <div className="form-group">
                                                    <label >Tipo Resolucion (* Requerido)</label>                                                    
                                                    <select onChange={e=>this.cambioValor(e)} className="form-control" name='tipoResolucion' value={e.tipoResolucion} >
                                                            <option value="--" key="0"></option>
                                                            {this.state.tiposResolucion.map((e : any, key : number) => {
                                                                    return <option key={key} value={e.valor}>{e.valor}</option>;
                                                                })}
                                                        </select>
                                            </div>
                                </Col>
                                <Col>
                                            <div className="form-group">
                                                    <label >Tipo de Dato (* Requerido)</label>
                                                    <select onChange={e=>this.cambioValor(e)} className="form-control" name='tipoDato' value={e.tipoDato}>
                                                                    <option value="--" key="0"></option>
                                                                    {this.state.tiposDatos.map((a : any, key : number) => {
                                                                            return <option key={key} value={a.valor}>{a.valor}</option>;
                                                                        })}
                                                                </select>
                                            </div>
                                </Col>
                                <Col>
                                            <div className="form-group">
                                                    <label >Validador</label>
                                                    <input className="form-control" onChange={e=>this.cambioValor(e)} name='validador' value={e.validador} type='text' />
                                            </div>
                                </Col>                               
                            </Row>
                            <Row>
                                <Col>
                                            <div className="form-group">
                                                    <label >Obligatorio</label>                                                    
                                                    <select onChange={e=>this.cambioValor(e)} className="form-control" name='obligatorio' value={e.obligatorio} >
                                                            <option value="--" key="0"></option>
                                                            <option value="false" key="2">FALSO</option>    
                                                            <option value="true" key="1">VERDADERO</option>    
                                                        </select>
                                            </div>
                                </Col>
                                <Col>
                                            <div className="form-group">
                                                    <label >Longitud</label>
                                                    <input className="form-control" onChange={e=>this.cambioValor(e)} name='longitud' value={e.longitud} type='number' />
                                            </div>
                                </Col>  
                            </Row>
                            <Row>
                                <Col>
                                            <div className="form-group">
                                                    <label >Editable</label>                                                    
                                                    <select onChange={e=>this.cambioValor(e)} className="form-control" name='diminseditable' value={e.diminseditable} >
                                                            <option value="--" key="0"></option>
                                                            <option value="false" key="2">FALSO</option>    
                                                            <option value="true" key="1">VERDADERO</option>    
                                                        </select>
                                            </div>
                                </Col>
                                <Col>
                                            <div className="form-group">
                                                    <label >Sugerido</label>                                                    
                                                    <select onChange={e=>this.cambioValor(e)} className="form-control" name='diminsSugerido' value={e.diminsSugerido} >
                                                            <option value="--" key="0"></option>
                                                            <option value="false" key="2">FALSO</option>    
                                                            <option value="true" key="1">VERDADERO</option>    
                                                        </select>
                                            </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                            <div className="form-group">
                                                    <label >Json Sugerido</label>
                                                    <input className="form-control" onChange={e=>this.cambioValor(e)} name='diminsJsonSugerido' value={e.diminsJsonSugerido} type='text' />
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
                <Row>
                            <Col>
                                <BootstrapTable wrapperClasses="table" data={this.state.lista} striped={true} hover={true} pagination={paginationFactory({})} keyField="nombreColumna"
                                options={tableOptions} expandColumnOptions={expandColumnOptions} expandableRow={() => true} expandComponent={this.cargarDetalle}>                      
                                                            {this.getEncabezado()}                
                                </BootstrapTable>
                            </Col>
                </Row>
            </div>
        )
    }

}
export default ParametrizacionDetalleDimins;