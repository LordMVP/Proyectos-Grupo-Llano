import React,{ Suspense } from 'react';
import parametrosApi from '../../../api/homologaciones/ParParametrosApi';
import ModalCargando from '../../../components/utils/ModalCargando/ModalCargando';
import { Container, Row, Col , Button , Card , Form} from 'react-bootstrap';
import homoApi from '../../../api/homologaciones/Homologacion';
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import paginationFactory from "react-bootstrap-table2-paginator";
import basicoDefault from '../../../api/homologaciones/BasicoDefault';
import ModalGuardar from '../../../components/utils/ModalGuardar/ModalGuardar';
import ParametrizacionImportacionImins from '../ParametrizacionImportacionImins/ParametrizacionImportacionImins';
import ParametrizacionImportacionDimins from '../../../components/Homologaciones/ParametrizacionImportacionDimins/ParametrizacionImportacionDimins';
import update from 'immutability-helper';
import Alerta from '../../../components/utils/AlertaComponent/AlertaComponent';

interface IProps {
    value?: any,
    informacion?:any,
    permisos?:any
    //guardarInfoGestion:(e:any)=>void
}

class ParametrizacionImportActualizar extends React.Component<IProps, any>
{
    constructor(props: IProps) {
        super(props);
        this.state={
            cargando:false,
            estadoLista:false,
            estadoWizard:0,
            crear:{
                idImarc:0,
                imarcNombreArchivo:'',
                imarcTipoArchivo:'XLSX',
                imarcTipoProceso:'1',
                imarcEstado:'',
                detallesImcol:[],
                detallesImins:[]
            },
            agregarColumna:{
                idImcol:0,
                nombre:'',
                descripcion:'',
                tipoDato:'',
                obligatorio:false,
                validador:'',
                tipoResolucion:'',
                json:''
            },
            tiposDatos:[],
            tiposResolucion:[],
            parametros:[],
            jsonColumna:true,
            listaEncabezado:['nombre','descripcion','tipoDato'],
            seleccion:'',
            listaTablas:[],
            estadoModal:false,
            tiposArchivos:[],
            tipoArchivo:0,
            alerta:{
                variante:'',
                estado:false,
                valor:''
            }
        }
        this.getEncabezado=this.getEncabezado.bind(this);
        this.formatoBotton=this.formatoBotton.bind(this);
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
        let apiHomo:homoApi =new homoApi();
        let resultado=await apiHomo.tiposArchivoImportacion();
        await this.setState({
            tiposDatos:await JSON.parse(basico.buscarParametro('tipo_dato_importacion',this.state.parametros)),
            tiposResolucion:await JSON.parse(basico.buscarParametro('tipo_resolucion_importacion',this.state.parametros)),
            listaTablas:await JSON.parse(basico.buscarParametro('tablas_parametrizacion_importacion',this.state.parametros)),
            tiposArchivos:resultado.data
        })
    }

    buscar=async()=>
    {
        await this.setState({
            cargando:true
        })
        let apiHomo:homoApi =new homoApi();
        let resultado=await apiHomo.buscarParametrizacion(this.state.tipoArchivo);
        let final=resultado.data;
        await this.setState({
            crear:final[0],
            estadoWizard:1,
            cargando:false
        })
        console.log('que llego de crear ',this.state.crear);
    }

    async cambioValorBuscar(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        await this.setState({
            [name]:value
        })
    }

    async cambioValor(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        await this.setState({
            crear:{
                ...this.state.crear,[name]:value
            }
            
        })
    }

    async cambioValorColumna(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        await this.setState({
            agregarColumna:{
                ...this.state.agregarColumna,[name]:value
            }
            
        })
    }

    async cambioValorColumnaLista(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {

        const {value, name}=e.target;
        let valorTmp=this.state.crear.detallesImcol.filter(item => item.nombre === this.state.seleccion);
        valorTmp[0][name]=value;
        let index=this.state.crear.detallesImcol.findIndex(item => item.nombre === this.state.seleccion);
        let updateRegistro=update(this.state.crear.detallesImcol, {$splice: [[index, 1, valorTmp[0]]]});
        await this.setState({
            crear:{
                ...this.state.crear,detallesImcol:updateRegistro
            }
        })
    }

    async cambioValorColumnaJson(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        let buscarTmp=this.state.tiposResolucion.filter(item => item.valor === value);
        console.log(buscarTmp);
        if(buscarTmp[0] != undefined && buscarTmp[0].texto === 1)
        {
            await this.setState({
                jsonColumna:false
            })
        }
        else
        {
            await this.setState({
                jsonColumna:true,
                agregarColumna:{
                    ...this.state.agregarColumna,imcolJason:''
                }
            })
        }
        await this.setState({
            agregarColumna:{
                ...this.state.agregarColumna,[name]:value
            }
            
        })
    }

    agregarColumna=async()=>
    {
        let busqueda=this.state.crear.detallesImcol.filter(item => item.nombre !== this.state.agregarColumna.nombre)
        let tmp=busqueda;//this.state.crear.detallesImcol;
        tmp.push(this.state.agregarColumna);
        await this.setState({
            crear:{
                ...this.state.crear,detallesImcol:tmp
            },
            agregarColumna:{
                idImcol:0,
                nombre:'',
                descripcion:'',
                tipoDato:'',
                obligatorio:false,
                validador:'',
                tipoResolucion:'',
                json:''
            }
        })

    }

    ////imins
    eliminarImins=async(e:any)=>
    {
        await this.setState({
            detallesImins:e
        })
    }

    agregarImins=async(e:any)=>
    {
        await this.setState({
            crear:{
                ...this.state.crear,detallesImins:e
            }
            
        })
        //console.log('imins en crear ',this.state.detallesImins);
    }

    eliminarDimins=async(e:any)=>
    {
        await this.setState({
            crear:{
                ...this.state.crear,detallesImins:e
            }
        })
    }

    cambioDimins=async(e:any)=>
    {
        await this.setState({
            detallesImins:{
                ...this.state.crear.detallesImins,detalleDimins:e
            }
            
        })
    }

    guardar=async()=>
    {
        await this.setState({
            cargando:true
        })
        let api: homoApi = new homoApi();
        await this.setState({
            crear:{
                ...this.state.crear,idImarc:this.state.tipoArchivo
            }
        })
        //console.log('que sale de crear ',this.state.crear);
        let apiHomo:homoApi =new homoApi();
        let tmp=await api.actualizarparametrizaion(this.state.crear);
        //console.log('que sale ...',this.state.crear);
        let resultado=await apiHomo.tiposArchivoImportacion();
        let resultadoFinal = tmp.data;
        if (resultadoFinal.statusCode === 200) {
            this.llamarAlerta('success', 'Transaccion Exitosa...');
        }
        else {
            this.llamarAlerta('danger', 'Error Transaccion, Comunicarse con el Area de Tecnologia...');
        }
        await this.setState({
            estadoWizard:0,
            crear:{
                idImarc:0,
                imarcNombreArchivo:'',
                imarcTipoArchivo:'XLSX',
                detallesImcol:[],
                detallesImins:[],
            },
            tiposArchivos:resultado.data,
            tipoArchivo:0,
            cargando:false,
            estadoModal:false
        })
        console.log(tmp.data);



    }

    llamarAlerta = (tmp1: string, tmp2: string) => {
        this.setState({
            alerta: {
                ...this.state.basico, estado: true, variante: tmp1, valor: tmp2
            }
        })
        setTimeout(() => {
            this.setState({
                alerta: {
                    ...this.state.basico, estado: false, variante: '', valor: ''
                }
            })
        }, 3000);
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

    formatoBotton( cell:any,row:any)
    {
        return <Button variant="outline-danger" key={cell} onClick={this.seleccion.bind(this,row)} disabled={row.idImcol>0 ? true : false}>Eliminar</Button>;
    }

    async seleccion(e:any)
    {
        let filtro=this.state.crear.detallesImcol.filter(item => item.nombre !== e.nombre)
        await this.setState({
            crear:{
                ...this.state.crear,detallesImcol:filtro
            }
        })
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

    mostrarModal=(): any=>
    {
        if(this.state.estadoModal)
        {
            return(
                <ModalGuardar guardar={this.guardar} cerrar={()=>this.setState({estadoModal:false})}/>
            )
        }
    }

    mostrarCargando = (): any => {
        if (this.state.cargando) {
            return (
                <ModalCargando estado={this.state.cargando}></ModalCargando>
            )
        }
    }

    mostrarAlerta = (): any => {
        if (this.state.alerta.estado) {
            return (
                <Alerta informacion={this.state.alerta}></Alerta>
            )
        }
    }

    metodoNuevaColumna=():any=>
    {
        if(this.state.crear.idImarc === 0)
        {
            return(
                <Card>
                                <Card.Body>
                                        <Row>
                                            <Col>
                                                <div className="text-center">
                                                        <h2>Agregar Campos Archivo</h2>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                        <div className="form-group">
                                                                <label >Nombre Columna</label>
                                                                <input className="form-control" onChange={e=>this.cambioValorColumna(e)} name='nombre' value={this.state.agregarColumna.nombre} type='text' placeholder=""/>
                                                        </div>
                                            </Col>
                                            <Col>
                                                        <div className="form-group">
                                                                <label >Descripcion</label>
                                                                <input className="form-control" onChange={e=>this.cambioValorColumna(e)} name='descripcion' value={this.state.agregarColumna.descripcion} type='text' placeholder=""/>
                                                        </div>
                                            </Col>
                                            <Col>
                                                        <div className="form-group">
                                                                <label >Tipo de Dato</label>
                                                                
                                                                <select onChange={e=>this.cambioValorColumna(e)} className="form-control" name='tipoDato' value={this.state.agregarColumna.tipoDato}>
                                                                        <option value="--" key="0"></option>
                                                                        {this.state.tiposDatos.map((e : any, key : number) => {
                                                                                return <option key={key} value={e.valor}>{e.valor}</option>;
                                                                            })}
                                                                    </select>
                                                        </div>
                                            </Col>
                                        </Row> 
                                        <Row>
                                            <Col>
                                                        <div className="form-group">
                                                                <label >Estado Obligatorio</label>
                                                                <select onChange={e=>this.cambioValorColumna(e)} className="form-control" name='obligatorio' value={this.state.agregarColumna.obligatorio}>
                                                                        <option value="--" key="0"></option>
                                                                        <option value="true" key="1">VERDADERO</option>
                                                                        <option value="false" key="2">FALSO  </option>    
                                                                    </select>
                                                        </div>
                                            </Col>
                                            <Col>
                                                        <div className="form-group">
                                                                <label >Validador</label>
                                                                <input className="form-control" onChange={e=>this.cambioValorColumna(e)} name='validador' value={this.state.agregarColumna.validador} type='text' placeholder=""/>
                                                        </div>
                                            </Col>
                                            <Col>
                                                        <div className="form-group">
                                                                <label >Tipo Resolucion</label>
                                                                
                                                                <select onChange={e=>this.cambioValorColumnaJson(e)} className="form-control" name='tipoResolucion' value={this.state.agregarColumna.tipoResolucion}>
                                                                        <option value="--" key="0"></option>
                                                                        {this.state.tiposResolucion.map((e : any, key : number) => {
                                                                                return <option key={key} value={e.valor}>{e.valor}</option>;
                                                                            })}
                                                                    </select>
                                                        </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                        <div className="form-group">
                                                                <label >Json Consulta</label>
                                                                <input className="form-control" onChange={e=>this.cambioValorColumna(e)} name='json' value={this.state.agregarColumna.json} type='text' placeholder="sintaxis JSON" disabled={this.state.jsonColumna}/>
                                                        </div>
                                            </Col>                                
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Col>
                                                        <Button variant="primary" onClick={this.agregarColumna} disabled={this.state.crear.imarcNombreArchivo.length>0 ? false : true}>Agregar</Button>
                                                </Col>                            
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

    cargarDetalle=(e):any=>
    {
        return(
            <div>
                <Container>
                <Row>
                                <Col>
                                            <div className="form-group">
                                                    <label >Estado Obligatorio</label>
                                                    <select onChange={e=>this.cambioValorColumnaLista(e)} className="form-control" name='obligatorio' value={e.obligatorio} >
                                                            <option value="--" key="0"></option>
                                                            <option value="true" key="1">VERDADERO</option>
                                                            <option value="false" key="2">FALSO  </option>    
                                                        </select>
                                            </div>
                                </Col>
                                <Col>
                                            <div className="form-group">
                                                    <label >Validador</label>
                                                    <input className="form-control" onChange={e=>this.cambioValorColumnaLista(e)} name='validador' value={e.validador} type='text' placeholder="" />
                                            </div>
                                </Col>
                                <Col>
                                            <div className="form-group">
                                                    <label >Tipo Resolucion</label>                                                    
                                                    <select onChange={e=>this.cambioValorColumnaJson(e)} className="form-control" name='tipoResolucion' value={e.tipoResolucion} disabled={true}>
                                                            <option value="--" key="0"></option>
                                                            {this.state.tiposResolucion.map((e : any, key : number) => {
                                                                    return <option key={key} value={e.valor}>{e.valor}</option>;
                                                                })}
                                                        </select>
                                            </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                            <div className="form-group">
                                                    <label >Json Consulta</label>
                                                    <input className="form-control" onChange={e=>this.cambioValorColumnaLista(e)} name='json' value={e.json} type='text' />
                                            </div>
                                </Col>                                
                            </Row>
                </Container>
            </div>
        ) 
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

    wizard=():any=>
    {
        const tableOptions = {
            expandBy: "column",
            onExpand: this.handleExpand,
            onlyOneExpanding: true,
          };

          const expandColumnOptions = {
            //expandColumnVisible: true
          };
        switch (this.state.estadoWizard) {
            case 0:
                return(
                    <div>
                        <Row>
                            <Col>
                                    <div className="form-group">
                                                        <Form.Group controlId="form100">
                                                            <label >Seleccione Archivo Configuracion</label>
                                                            <select onChange={e=>this.cambioValorBuscar(e)} className="form-control" name='tipoArchivo' value={this.state.tipoArchivo}>
                                                                <option value="--" key="0"></option>
                                                                {this.state.tiposArchivos.map((e : any, key : number) => {
                                                                        return <option key={key} value={e.imarc_ideregistro}>{e.imarc_nombre_archivo}</option>;
                                                                    })}
                                                            </select>
                                                            <Form.Text className="text-muted">
                                                            Este Campo es Obligatorio...
                                                            </Form.Text>
                                                        </Form.Group> 
                                    </div>
                            </Col>
                            <Col sm={4}>
                                    <div className="form-group">
                                        <label>Buscar Informacion</label>
                                        <Button className="form-control" variant="primary" onClick={this.buscar} disabled={this.state.tipoArchivo>0 && this.props.permisos?.EDIT ? false : true}>Buscar</Button>                              
                                    </div>    
                            </Col>
                        </Row>
                       
                    </div>
                )
            case 1:
                return (
                    <div>
                        <Container>
                                <Row>
                                    <Col>
                                        <div className="text-center">
                                            <h2>
                                                <label >Nombre del Archivo</label>
                                            </h2>    
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                        <Col>
                                            <div className="form-group">
                                                    <label >Nombre Archivo</label>
                                                    <input className="form-control" onChange={e=>this.cambioValor(e)} name='imarcNombreArchivo' value={this.state.crear.imarcNombreArchivo} type='text' placeholder="" disabled={true}/>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="form-group">
                                                    <label >Tipo de Archivo</label>
                                                    <input className="form-control" onChange={e=>this.cambioValor(e)} name='imarcTipoArchivo' value={this.state.crear.imarcTipoArchivo} type='text' placeholder="" disabled={true}/>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="form-group">
                                                    <label >Tipo de proceso</label>
                                                    <select className="form-control" onChange={e=>this.cambioValor(e)} name='imarcTipoProceso' value={this.state.crear.imarcTipoProceso} placeholder="" disabled={true}>
                                                        <option value="1">Insertar registros</option>    
                                                        <option value="2">Actualizar registros</option>    
                                                    </select>
                                            </div>
                                        </Col>
                                </Row>
                                <br/>
                                <br/>
                            <Row>
                                <Col>
                                    <Button variant="secondary" onClick={()=>this.setState({estadoWizard:0})} size="lg">Atras</Button>
                                </Col>
                                <Col>
                                    <Button variant="info" onClick={()=>this.setState({estadoWizard:2})} size="lg">Siguiente</Button>
                                </Col>
                            </Row>    
                        </Container>
                    </div>
                )
            case 2:
                return (
                    <div>
                        {this.metodoNuevaColumna()}        
                            <br/>
                            <Row>
                                <Col>
                                    <div className="text-center">
                                            <h2>Lista de Campos Archivo</h2>
                                    </div>
                                </Col>
                            </Row>
                            <br/>
                            <br/>
                            <Row>
                                <Col>
                                <BootstrapTable wrapperClasses="table" data={this.state.crear.detallesImcol} striped={true} hover={true} pagination={paginationFactory({})} keyField="nombre"
                                options={tableOptions} expandColumnOptions={expandColumnOptions} expandableRow={() => true} expandComponent={this.cargarDetalle} noDataIndication="NO hay Informacion...">
                                            <TableHeaderColumn dataAlign="center" dataField="button" dataFormat={this.formatoBotton}>Eliminar</TableHeaderColumn>                                                                  
                                                            {this.getEncabezado()}                
                                </BootstrapTable>
                                </Col>
                            </Row>
                            <br/>
                            <br/>
                            <Row>
                                <Col>
                                    <Button variant="secondary" onClick={()=>this.setState({estadoWizard:1})} size="lg">Atras</Button>
                                </Col>
                                <Col>
                                    <Button variant="info" onClick={()=>this.setState({estadoWizard:3})} size="lg">Siguiente</Button>
                                </Col>
                            </Row>      
                    </div>
                )
            case 3:
                return(
                    <div>
                            <Row>
                                        <Col>
                                            <div className="text-center">
                                                    <h2>Tablas Parametrizacion</h2>
                                            </div>
                                        </Col>
                            </Row>
                                            <ParametrizacionImportacionImins listaTablas={this.state.listaTablas} informacion={this.state.crear.detallesImins} eliminarDetalle={this.eliminarImins} agregarDetalle={this.agregarImins} idImarcpadre={this.state.crear.idImarc}/>
                                    <br/>
                                    <br/>        
                            <Row>
                                        <Col>
                                            <Button variant="secondary" onClick={()=>this.setState({estadoWizard:2})} size="lg">Atras</Button>
                                        </Col>
                                        <Col>
                                            <Button variant="info" onClick={()=>this.setState({estadoWizard:4})} size="lg">Siguiente</Button>
                                        </Col>
                            </Row>
                    </div>
                ) 
            case 4:
                return(
                    <div>
                            <Row>
                                <Col>
                                    <div className="text-center">
                                            <h2>parametrizar Campos Tablas</h2>
                                    </div>
                                </Col>
                            </Row>
                                    <ParametrizacionImportacionDimins  informacion={this.state.crear.detallesImins} cambioDetalle={this.cambioDimins}/>
                            <br/>
                            <br/>         
                            <Button variant="success" onClick={()=>this.setState({estadoModal:true})} >Actualizar Parametrizacion</Button>
                            <br/>
                            <br/>
                            <Row>
                                <Col>
                                    <Button variant="secondary" onClick={()=>this.setState({estadoWizard:3})} size="lg">Atras</Button>
                                </Col>
                            </Row>  
                    </div>
                )       
        }
    }

    render() {
        return(
            <div>
                <Suspense fallback={<div>Cargando...</div>}>
                    <div className="row">
                        <div className="d-flex p-2 bd-highlight">
                            <h2>Patametrizacion Importacion Homologaciones</h2>
                        </div>
                        <div className="col-12">
                            {this.mostrarAlerta()}
                            {this.mostrarModal()}
                            {this.mostrarCargando()}
                            {this.wizard()}
                        </div>
                    </div>
                </Suspense>
            </div>
        )
    }

}
export default ParametrizacionImportActualizar;