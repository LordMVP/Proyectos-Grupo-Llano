

import {TconceptosList} from '../../../../src/models/types/aforos/ConceptosList'   //import first
import  * as API from '../../../api/aforos/aforosVisitas'
import React, { Component } from 'react'
import { Button, Modal,  Row , Col, Form, Container } from 'react-bootstrap'
import { Tselect } from '../../../models/types/aforos/select';
// import { render } from "@testing-library/react";
import { Typeahead  } from 'react-bootstrap-typeahead';
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { currentDate } from '../../../utils/Dates';
import { RiFolderUploadFill  } from "react-icons/ri"
import parametrosApi from '../../../api/homologaciones/ParParametrosApi';
type changeEventElement = React.ChangeEvent<HTMLInputElement>;
// interface Iprops{
//     data?:[];
//     children?:ReactNode;
//     showModalConceptos?:boolean;
//     handleModalConceptosClose?:()=>void;
//     handleModalConceptosSave?:(x:any)=>void;
// }

const typeahead = React.createRef<Typeahead<any>>();
const convToneladas=1000;

export default class ModalConceptosVisitas extends Component <{showModalConceptos,handleModalConceptosClose,handleModalConceptosSave,data,idVisita,consecutivo,estado,fechaEjecucion,observaciones,dia,semana,permisos, permisosGeneral}>  {
    state={
        file: [] as any ,
        fileObj : [] as any,
        fileArray : []  as any,
        tipoArchivoList:[] as Array<Tselect>,
        tipoArchivo:"",
        parametros:{},
        checked:false,
        visitaList:[], //maybe should be a props |||| props.data[]  become in itemList
        idVisita:"",
        consecutivo:"",
        estado:"",
        observaciones:"",
        fechaEjecucion:currentDate(),
        addConcepto:"",
        addconceptoSelected:[] as Array<TconceptosList>,
        conceptosList:[] as Array<TconceptosList>,
        addCantidad:"",
        addPeso:"",
        semana:"",
        dia:"",
        addObservaciones:"",
        itemsList:{} as any,
        permisosModal:true,
        permisosModal2:true,
        columnasTabla:[
            {
                dataField: "eliminar",
                text: "Eliminar",
                align: 'center',
                headerAlign: 'center',
                formatter: (cell, row, rowIndex) => {
                    return (    
                        <Button variant="outline-danger" type="button" key={cell-rowIndex}  onClick={()=>{this._deleteRow(row)}} disabled={this.validarPermisos()}> Eliminar</Button>
                    )
                  },
                  headerStyle: { backgroundColor: '#6c757d', color: '#ffffff',  width: '100px'}
              },
              {
                dataField: "tipoRecipiente",
                text: "Concepto",
                align: 'center',
                headerAlign: 'center',
                sort: true,
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff',  width: '100px'}
              },
              {
                dataField: "cantidadRecipientes",
                text: "Cantidad",
                align: 'center',
                headerAlign: 'center',
                sort: true,
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff',  width: '100px'}
              },
              {
                dataField: "peso",
                formatter:row=>row.toFixed(3),
                text: "Peso",
                align: 'center',
                headerAlign: 'center',
                sort: true,
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff',  width: '100px'},
              },
              {
                dataField: "peso",
                formatter:row=>(row/convToneladas).toFixed(6),
                text: "Ton.",
                align: 'center',
                headerAlign: 'center',
                sort: true,
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff',  width: '100px'},
              },
              {
                dataField: "volumen",
                text: "Volumen",
                align: 'center',
                headerAlign: 'center',
                sort: true,
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff',  width: '100px'}
              },
              {
                dataField: "observaciones",
                text: "Observaciones",
                align: 'center',
                headerAlign: 'center',
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff',  width: '100px'}
              },
        ],
    }
    async componentWillReceiveProps(prevProps){
        // if(prevProps[name]!==this.props[name])
        console.log("prevProps--->",prevProps)
        
        await this.setState({itemsList:prevProps.data,observaciones:'',permisosModal:prevProps.permisos, permisosModal2:prevProps.permisosGeneral},()=>{ console.log("itemsList modal conptos:::",this.state.itemsList)})
        if(this.props.fechaEjecucion===""){

            await this.setState({fechaEjecucion:currentDate()})
        }else{
            await this.setState({fechaEjecucion:this.props.fechaEjecucion})
            
        }
        await this.setState({
            observaciones:prevProps.observaciones,
            semana:this.props.semana,
            dia:this.props.dia,
            idVisita:prevProps.idVisita,
            addConcepto:"",addCantidad:"",addPeso:"",addObservaciones:"",
            permisosModal:prevProps.permisos,
            permisosModal2:prevProps.permisosGeneral,
            estado:prevProps.estado,
        }) 
        console.log('prevProps estado',this.state.permisosModal);       
    }
    cargarParametros=async()=>
    {
        let paraApi:parametrosApi=new parametrosApi();
        let tmp=await paraApi.listaParametros();
        await this.setState({
            parametros:tmp.data
        })
    }
    async componentDidMount(){
        this.fetchData();
        await this.cargarParametros();
        this.setState({
            permisosModal:this.props.permisos,
            permisosModal2:this.props.permisosGeneral 
        })
    }

    onCargarFotosVisita=(vista)=>{
        console.log('visita')
        this.setState({checked:vista})
        /*const totalVisitasTramitadas = this.state.visitasTramitadasList.concat(this.state.visitasRegistradasListHD);
         
        totalVisitasTramitadas.map((item)=>{
            if (item.id === idVisita) {
                this.setState({detalleSeleccionado:item.detalles})
                this.setState({observacionSeleccionada:item.observaciones})
                this.setState({semanaSeleccionada:item.semana})
                this.setState({diaSeleccionada:item.diaSemanaFechaProgramacion})
                this.setState({fechaEjecucionSeleccionada:item.fechaEjecucion},()=>{this.setState({ShowModalCargarArchivos:true})})
                return item
            } else {
                return item
            }
            
        })
        console.log('que tiene tercero //////////si es true es desabilitado...  ',this.state.permisosTercero);
        console.log('que tiene geenral //////////si es true tiene permiso ',this.state.effectivePermissions?.EDIT );
        */
    }
    onDeletePhoto=async()=>{
        await this.setState({
            fileObj:[] as any,fileArray:[] as any
        })
    }

    onDeleteSinglePhoto=async(index: number)=>{
        const newFileObj = [...this.state.fileObj];
        const newFileArray = [...this.state.fileArray];
        
        // Remover el archivo del índice especificado
        if (newFileObj[0]) {
            const filesArray = Array.from(newFileObj[0]);
            filesArray.splice(index, 1);
            
            // Crear un nuevo FileList-like object
            const dt = new DataTransfer();
            filesArray.forEach((file: any) => dt.items.add(file));
            
            newFileObj[0] = dt.files;
        }
        
        newFileArray.splice(index, 1);
        
        await this.setState({
            fileObj: newFileObj,
            fileArray: newFileArray
        });
    }

    buscarParametro=(llave)=>
    {
        let resultado='';
        for(var indice in this.state.parametros)
        {
            
            let tmp=this.state.parametros[indice];
            let tmp2=tmp[llave];
            if(tmp2!=undefined)
            {
                resultado=tmp2;
            }
        }
        return resultado;
    }

    validarArchivosCarga=(e)=>
    {
        let tipo=0;
        for(var indice in e)
        {
            if(JSON.parse(this.buscarParametro('tipo_documento_adjuntar')).indexOf(e[indice].type)<0)
            {
                tipo=tipo+1;
            }
        }
        return tipo;
    }

    uploadMultipleFiles=(e:React.ChangeEvent<HTMLInputElement>)=> {
        
        let tmp = e.target.files;
        if (!tmp || tmp.length === 0) return;
        
        let archivosArray = Array.prototype.slice.call(tmp);
        if(this.validarArchivosCarga(archivosArray)>0)
        {
            //this.llamarAlerta('warning', 'error al cargar archivos, esta incumpliendo algunos de los requisitos...');
        }
        else
        {
            console.log("e.target.files-->",e.target.files)
            
            // Crear DataTransfer para combinar archivos existentes con nuevos
            const dt = new DataTransfer();
            
            // Agregar archivos existentes si los hay
            if (this.state.fileObj[0]) {
                Array.from(this.state.fileObj[0]).forEach((file: any) => {
                    dt.items.add(file);
                });
            }
            
            // Agregar nuevos archivos
            Array.from(tmp).forEach((file: any) => {
                dt.items.add(file);
            });
            
            // Crear array de URLs para previsualización
            let mfileArray = [...this.state.fileArray];
            Array.from(tmp).forEach((file: any) => {
                mfileArray.push(URL.createObjectURL(file));
            });

            this.setState({ 
                fileObj: [dt.files],
                fileArray: mfileArray,
                file: mfileArray
            })
            
            // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
            e.target.value = '';
        }       
        
    }

    fetchData=()=>{

        API.getTiposAdjunto().then(response=>{

            if(response.success===true){
                this.setState({ tipoArchivoList: response.data })
                return response;
            }  
            return response
            
        }).catch(err => { 
            if(!!err.isAxiosError && !err.response){ Promise.reject(err);}
            return Promise.reject(err); }); //end .catch

        API.getTipoRecipientesVisitas().then(response => {
            
            if(response.success===true){
                this.setState({ conceptosList: response.data })
                return response;
            } } //end.then-consolidado
            ).catch(error => { return Promise.reject(error.status); }); //end .catch-consolidado
        }
    

    handleChange = (event: changeEventElement) => this.setState({ [event.target.name]: event.target.value } as any)

    _addRow=(e)=>{
        e.preventDefault()
        const {addconceptoSelected,addCantidad,addPeso,addObservaciones}=this.state

        const volumenCalculado = this.calcularVolumen(addconceptoSelected[0].conValor,addPeso,addCantidad)
        const data ={
            idTipoRecipiente:addconceptoSelected[0].uniConcepto,
            tipoRecipiente:addconceptoSelected[0].conNombre,
            cantidadRecipientes:parseInt(addCantidad),
            peso:parseFloat(addPeso),
            volumen:volumenCalculado,
            observaciones:addObservaciones,
            idDetalleConcepto:0
        }
         const updateItemsList = [...this.state.itemsList, data]
         this.setState({itemsList:updateItemsList,addConcepto:"",addCantidad:"",addPeso:"",addObservaciones:""})
         const instance = typeahead.current;
         instance?.clear();
         //instance?.focus();
         //addconceptoSelected
    }

    _deleteRow=(row)=>{
        const { itemsList } = this.state;
        
        //const newItemsList = itemsList;
        //newItemsList.splice(index, 1);
        let newItemsList=itemsList.filter(item=> item.idTipoRecipiente !== row.idTipoRecipiente);
        this.setState({itemsList:newItemsList})
    }
 calcularVolumen=(factor,peso,cantidad)=>{
     console.log(peso)
     return factor*cantidad
 }
 handleModalConceptosSave=()=>{
     const {itemsList,fechaEjecucion,observaciones,fileObj,tipoArchivo}=this.state
     const {idVisita}= this.props
     
     // Primero llamamos a la función de guardar con los datos actuales
     this.props.handleModalConceptosSave(itemsList,idVisita,fechaEjecucion,observaciones,fileObj,tipoArchivo)
     
     // Luego limpiamos el estado
     this.setState({
         checked:false,
         fileObj: [],
         fileArray: [],
         tipoArchivo: ""
     })
 }

 validarPermisos=():any=> ///los valores que llegan si estan deshabilitados falso o verdadero
 {
     if(!this.state.permisosModal)
     {
        return false;
     }
     else
     {
         if(!this.state.permisosModal2)
            return false;
         else
            return true;
     }
 }

render(){
const {fechaEjecucion,addCantidad,addPeso,addConcepto,addObservaciones, observaciones, tipoArchivo}=this.state;
//const colStyle = { backgroundColor: '#6c757d', color: '#ffffff',  width: '100px'};
        
        return (
            // modal-detalle vertical-align-center
            
            <Modal
        centered
        animation={false} show={this.props.showModalConceptos} onHide={this.props.handleModalConceptosClose} size="lg"         
        aria-labelledby="example-custom-modal-styling-title">
    {/* <Modal size="lg" centered aria-labelledby="contained-modal-title-vcenter" animation={false} show={this.props.showModalConceptos} onHide={this.props.handleModalConceptosClose} dialogClassName="modal-90w" > */}
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            <div>
                                Detalles conceptos de la Visita: {this.props.consecutivo}, {this.state.dia} de la <strong>Semana </strong> {this.props.semana}
                            </div>
                            </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>                                         
                                                <Row>
                                                    <Col>
                                                        <div className="form-group">
                                                            <h5>Fecha Ejecución</h5>
                                                            <input disabled={true} className="form-control form-control-md" type="date"  name="fechaEjecucion" value={fechaEjecucion} onChange={this.handleChange} required form="conceptos-form" />
                                                        </div>
                                                    </Col>
                                                </Row>    
                                                <form id="conceptos-form" onSubmit= {this._addRow}>
                                                <Row>
                                                    <Col>
                                                            <div className="form-group">
                                                                <h5><label >Agregar Concepto</label></h5>
                                                            </div>
                                                    </Col>
                                                </Row>    
                                                <Container className="border rounded p-3 mb-3" style={{backgroundColor: '#f8f9fa'}}>
                                                <Row>
                                                        <Col sm={8}>
                                                                <div className="form-group">
                                                                            <label >Concepto</label>
                                                                            <Typeahead
                                                                            inputProps={{ required: true,form:"conceptos-form" }}
                                                                            id="nombre-conceptos-typeahead"
                                                                            emptyLabel="No hay resultados"
                                                                            labelKey="conNombre"
                                                                            name="registrarConcepto"
                                                                            // defaultSelected={["andres","juank"]}
                                                                            value={addConcepto}
                                                                            multiple={false}
                                                                            onChange={(selected:[{ uniConcepto: number,  conNombre: string, conValor: number }[]]) => { 
                                                                                this.setState(
                                                                                    {addconceptoSelected:selected},()=>{return console.log("nom selct",selected)}
                                                                                    )
                                                                                
                                                                                    // this.setState({registrarConceptoTypeHead:selected})
                                                                                    
                                                                                    }}
                                                                                    options={  this.state.conceptosList}
                                                                                    placeholder="concepto" 
                                                                                    ref={typeahead}      
                                                                                    />
                                                                </div>
                                                        </Col>
                                                        <Col sm={2}>
                                                                <div className="form-group">
                                                                            <label >Cantidad</label>
                                                                            <input className="form-control form-control-sm " type="number" placeholder="" min="1" name ="addCantidad" value={addCantidad} onChange={this.handleChange} required form="conceptos-form" />
                                                                </div>
                                                        </Col>
                                                        <Col sm={2}>
                                                                <div className="form-group">
                                                                            <label >Peso</label>
                                                                            <input className="form-control form-control-sm " type="number" step="any" placeholder="" min="0" name ="addPeso" value={addPeso} onChange={this.handleChange} required form="conceptos-form" />
                                                                </div>
                                                        </Col>                                                         
                                                </Row>
                                                <Row>
                                                        <Col>
                                                                        <div className="form-group">
                                                                                    <label >Observaciones</label>
                                                                                    <input className="form-control form-control-sm " type="text" placeholder=""  name ="addObservaciones" value={addObservaciones} onChange={this.handleChange}  form="conceptos-form" />
                                                                        </div>
                                                        </Col>      
                                                </Row>                                                
                                                <Row>
                                                    <Col>
                                                            <div className="form-group">
                                                                <Row>
                                                                    <Col xs="2">
                                                                <Button variant="primary" form="conceptos-form" type="submit" disabled={this.validarPermisos()}> Añadir</Button> 
                                                                </Col>
                                                                <Col>
                                                                    <Button 
                                                                        variant={this.state.checked ? "secondary" : "info"}  
                                                                        onClick={()=>this.onCargarFotosVisita(!this.state.checked)}
                                                                    >
                                                                        {this.state.checked ? "Ocultar" : "Cargar"} <RiFolderUploadFill/>
                                                                    </Button>
                                                                </Col>
                                                                </Row>
                                                            </div>
                                                    </Col>
                                                    
                                                </Row> 
                                                {this.state.checked && (
                                                    <Container className="border rounded p-3 mb-3" style={{backgroundColor: '#f8f9fa'}}>
                                                        <Row>
                                                            <Col>
                                                                <h5 className="mb-3">
                                                                    <i className="fas fa-upload mr-2"></i>
                                                                    Cargar Archivos Adjuntos
                                                                </h5>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <div className="form-group">
                                                                    <Form.Label><strong>Tipo de Archivo:</strong></Form.Label>
                                                                    <Form.Control 
                                                                        as="select" 
                                                                        name="tipoArchivo" 
                                                                        value={tipoArchivo} 
                                                                        onChange={this.handleChange} 
                                                                        required
                                                                    >
                                                                        <option value="">-- Seleccione el tipo --</option>
                                                                        {!!this.state.tipoArchivoList.length && this.state.tipoArchivoList.map((t: any) => {
                                                                            return <option key={t.id} data-mid={t.id} value={t.id}> {t.object}</option>})
                                                                        } 
                                                                    </Form.Control>
                                                                </div>           
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <div className="form-group">
                                                                    <Form.Label><strong>Seleccionar Archivos:</strong></Form.Label>    
                                                                    <Form.File
                                                                        label="Cargar Archivos" 
                                                                        data-browse="Buscar" 
                                                                        custom 
                                                                        onChange={this.uploadMultipleFiles} 
                                                                        multiple 
                                                                    />
                                                                </div>                        
                                                            </Col>
                                                        </Row>
                                                        
                                                        {this.state.fileObj[0] && this.state.fileObj[0].length > 0 && (
                                                            <Row>
                                                                <Col>
                                                                    <div className="form-group">
                                                                        <label>
                                                                            <strong>
                                                                                <i className="fas fa-file-alt mr-2"></i>
                                                                                Archivos seleccionados: ({this.state.fileObj[0].length})
                                                                            </strong>
                                                                        </label>
                                                                        <ul className="list-group">
                                                                            {Array.from(this.state.fileObj[0]).map((file: any, index: number) => (
                                                                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                                                    <span>
                                                                                        <i className="fas fa-file mr-2 text-primary"></i>
                                                                                        {file.name} 
                                                                                        <small className="text-muted ml-2">
                                                                                            ({(file.size / 1024).toFixed(2)} KB)
                                                                                        </small>
                                                                                    </span>
                                                                                    <Button 
                                                                                        size="sm" 
                                                                                        variant="outline-danger" 
                                                                                        onClick={() => this.onDeleteSinglePhoto(index)}
                                                                                        title="Eliminar este archivo"
                                                                                    >
                                                                                        <i className="fas fa-trash"></i> Eliminar
                                                                                    </Button>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        )}
                                                        
                                                        <Row>
                                                            <Col>
                                                                <div className="form-group">
                                                                    <Button 
                                                                        type="button" 
                                                                        size="sm" 
                                                                        variant="outline-danger" 
                                                                        onClick={this.onDeletePhoto}
                                                                        disabled={!this.state.fileObj[0] || this.state.fileObj[0].length === 0}
                                                                    >
                                                                        <i className="fas fa-times-circle mr-1"></i>
                                                                        Limpiar Todos
                                                                    </Button>
                                                                </div> 
                                                            </Col>
                                                        </Row>
                                                    </Container>
                                                )}  
                                                </Container>
                                                </form>
                                                {/* <Form className="mb-2" onSubmit={this.onSubmit}></Form> */}
                                                <Row>
                                                    <Col>
                                                            <div className="form-group">
                                                                <h5><label>Observaciones General</label></h5>
                                                                <input className="form-control" type="text" name="observaciones" value={observaciones} onChange={this.handleChange} />
                                                            </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                        <Col>
                                                                <div className="table-responsive">
                                                                <BootstrapTable data={this.state.itemsList} keyField='gact_fecgestion' columns={ this.state.columnasTabla }
                                                                bootstrap4
                                                                striped={true}
                                                                hover={true}
                                                                pagination={paginationFactory({})}
                                                                data-mobile-responsive="true"
                                                                wrapperClasses="table"
                                                                noDataIndication="No Hay Informacion..."
                                                                //headerWrapperClasses={colStyle}
                                                                />                             
                                                                </div>
                                                        </Col>
                                                    </Row>
                                            
                            </Modal.Body>
                             <Modal.Footer>
                                <Button onClick={this.props.handleModalConceptosClose}>Cerrar</Button>
                                <Button  onClick={this.handleModalConceptosSave} disabled={this.state.itemsList.length>0 && this.validarPermisos()===false ? false : true}>Guardar</Button>
                          </Modal.Footer>
                     </Modal>
    
  );
}
}

// ModalDetalles.defaultProps = {
//     data:[{tipo_recipiente: '',dimensiones: '',cantidad_recipientes: '',equivalencia: '',total: ''}],
//     observaciones:"",
// };
