

// import {TconceptosList} from '../../../../src/models/types/aforos/ConceptosList'   //import first 
import  * as API from '../../../api/aforos/aforosVisitas'
import React, { Component } from 'react'
import { Button, Modal, Container,Form, Alert , Carousel , Col, Row } from 'react-bootstrap'
import { Tselect } from '../../../models/types/aforos/select';
import parametrosApi from '../../../api/homologaciones/ParParametrosApi';
import Alerta from '../../../components/utils/AlertaComponent/AlertaComponent';
//import ArchivosApi from '../../../api/homologaciones/ArchivosApi';
// import { render } from "@testing-library/react";
type changeEventElement = React.ChangeEvent<HTMLInputElement>;
// interface Iprops{
//     data?:[];
//     children?:ReactNode;
//     showModalConceptos?:boolean;
//     handleModalConceptosClose?:()=>void;
//     handleModalConceptosSave?:(x:any)=>void;
// }
// interface HTMLInputEvent extends Event {
//     target: HTMLInputElement & EventTarget;
// }



export default class ModalCargarFotos extends Component <{showModalConceptos,handleModalConceptosClose,handleModalConceptosSave,idVisita,fechaEjecucion,idAforo, permisos, permisosGeneral}>  {

    

    constructor(props) {
        super(props)
        // this.state = {
        //     file: [] as Array<any>
        // }
    }
    state={
        file: [] as any ,
        idVisita:"",
        observaciones:"",
        fechaEjecucion:"",
        itemsList:[],
        idAforo:"",
        tipoArchivo:"",
        tipoArchivoList:[] as Array<Tselect>,
        progressInfos: [{percentage:0,fileName:""}] as Array<any>,
        showAlert: false,
        variantAlert: ['light'],
        messageAlert:"",
        fileObj : [] as any,
        fileArray : []  as any,
        archivosTmp:[],
        indexCarousel:0,
        alerta:{
            variante:'',
            estado:false,
            valor:''
        },
        parametros:{},
        permisosModal:true,
        permisosModal2:true,
    }
    
    uploadMultipleFiles=(e:React.ChangeEvent<HTMLInputElement>)=> {
        
        let tmp = e.target.files;
        if (!tmp || tmp.length === 0) return;
        
        let archivosArray = Array.prototype.slice.call(tmp);
        if(this.validarArchivosCarga(archivosArray)>0)
        {
            this.llamarAlerta('warning', 'error al cargar archivos, esta incumpliendo algunos de los requisitos...');
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

    uploadFiles=async(e)=> {
        e.preventDefault()
        console.log(this.state.file)
        const fdata = new FormData()
        const files = this.state.fileObj
        for (var index = 0; index < files.length; ++index) {
            fdata.append('files[]',files[index])
            //console.log("files[index]---->",files[index]);
        }
        //console.log("files.files files.files",files)
        
        //fdata.append('files',files)
        //console.log("this.fileObj this.fileObj",this.state.fileObj)
        // const {file.idVisita,idAforo,} =this.state
        // const data={idVisita:this.state.idVisita,token:user.token,}
        // let data={idDetalle:this.state.idVisita ,uniTipoAdjunto:this.state.tipoArchivo,:""} 
        
        
        ///nuevo starcorp
        let arrayTmp:any=Array.prototype.slice.call(files[0]);
        //fdata.append('fileList',arrayTmp[0])
        for(let key of Object.keys(arrayTmp)) {
            if (key !== 'length') {
                fdata.append('fileList', arrayTmp[key]);
            }
          }
        //fdata.append('vaaDTO', vaaDTO )
        //let archivosApi:ArchivosApi=new ArchivosApi();

        
        fdata.append('idDetalle',this.state.idVisita )
        fdata.append('uniTipoAdjunto',this.state.tipoArchivo)
        fdata.append('observaciones',this.state.observaciones)
        //let ingreso= await archivosApi.cargarArchivosVisita(fdata); 
        //console.log('que llego ',ingreso.data);        
        this.setState({message:"Subiendo..."})
        this.alertInformation(true,['info'],"Subiendo");
        API.postArchivosVisitas(fdata).then((response)=>{

            console.log("Alert:",response)
            if(response.success===true){
                this.setState({message:"Se ha subido con exito!!"})
                this.alertInformation(true,['info'],response.message);
            }


        }).catch((err)=>{
            console.log("err postarchivos",err)
            this.setState({message:err})
            this.alertInformation(true,['info'],"Error conexión!");
        })
        
        // Limpiar el estado después de subir
        this.setState({
            tipoArchivo:'',
            observaciones:'',
            fileObj:[],
            fileArray:[],
            indexCarousel:0
        })
        this.alertInformation(false,['light'],"");
        this.props.handleModalConceptosSave(1);
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
    
    async componentWillReceiveProps(preProvs){

       console.log('que llego de prePros ',preProvs);
       await this.setState({idVisita:this.props.idVisita,fechaEjecucion:this.props.fechaEjecucion,idAforo:this.props.idAforo,permisosModal:preProvs.permisos, permisosModal2:preProvs.permisosGeneral})
       if(preProvs.showModalConceptos)
       {
            await this.setState({
                fileObj:[],
                fileArray:[]
            })
       }
        
    }
    alertInformation=(showAlert:boolean,variantAlert:[string],messageAlert:string)=>{
        this.setState({
            showAlert: showAlert,
            variantAlert: variantAlert,
            messageAlert: messageAlert
        },() => { window.setTimeout(() => { this.setState({ showAlert: false,variantAlert:['light'],messageAlert:"" }) }, 6000) });}

    async componentDidMount(){
        this.fetchData();
        await this.cargarParametros();
        await this.setState({
            permisosModal:this.props.permisos,
            permisosModal2:this.props.permisosGeneral 
        })
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
        }
    

    handleChange = (event: changeEventElement) => this.setState({ [event.target.name]: event.target.value } as any)

 
 handleModalConceptosSave=()=>{
     //const {fileArray,fechaEjecucion,observaciones}=this.state
     //const {archivosTmp,tipoArchivo,observaciones}=this.state
     //const {idVisita}= this.props
     //this.props.handleModalConceptosSave(itemsList,idVisita,fechaEjecucion,observaciones)
     //this.props.handleModalConceptosSave(archivosTmp,idVisita,tipoArchivo,observaciones)
     this.props.handleModalConceptosSave(0)
 }
 onDeletePhoto=async()=>{
    await this.setState({
        fileObj:[] as any,fileArray:[] as any,indexCarousel:0
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
    
    // Ajustar el índice del carrusel si es necesario
    let newIndex = this.state.indexCarousel;
    if (newIndex >= newFileArray.length && newFileArray.length > 0) {
        newIndex = newFileArray.length - 1;
    } else if (newFileArray.length === 0) {
        newIndex = 0;
    }
    
    await this.setState({
        fileObj: newFileObj,
        fileArray: newFileArray,
        indexCarousel: newIndex
    });
 }

 seleccionFoto=async(selectedIndex, e)=>
 {
    await this.setState({
        indexCarousel:selectedIndex
    })
    console.log('que tiene seleccion ',e);
 }

 llamarAlerta = (tmp1: string, tmp2: string) => {
    this.setState({
        alerta: {
            ...this.state.alerta, estado: true, variante: tmp1, valor: tmp2
        }
    })
    setTimeout(() => {
        this.setState({
            alerta: {
                ...this.state.alerta, estado: false, variante: '', valor: ''
            }
        })
    }, 3000);
}

 cargarParametros=async()=>
    {
        let paraApi:parametrosApi=new parametrosApi();
        let tmp=await paraApi.listaParametros();
        await this.setState({
            parametros:tmp.data
        })
    }

    buscarParametro=(llave)=>
    {
        let resultado='';
        for(var indice in this.state.parametros)
        {
            
            let tmp=this.state.parametros[indice];
            let tmp2=tmp[llave];
            if(tmp2!==undefined)
            {
                resultado=tmp2;
            }
        }
        return resultado;
    }
    
    mostrarAlerta = (): any => {
        if (this.state.alerta.estado) {
            return (
                <Alerta informacion={this.state.alerta}></Alerta>
            )
        }
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
const {tipoArchivo,observaciones,messageAlert,showAlert}=this.state
        
        return (
            <>
             <Modal centered size="lg" aria-labelledby="contained-modal-title-vcenter" animation={false} show={this.props.showModalConceptos} onHide={this.props.handleModalConceptosClose} dialogClassName="modal-detalle" >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Cargar Archivos para la visita:{this.props.idVisita}
                            <div>{this.props.children}</div>
                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            {this.mostrarAlerta()}
                                            <Container>
                                               <div> ---
                                               {this.state.variantAlert.map((t: any, i: number) => {
                                                return <Alert
                                                        key={i}
                                                        variant={t}
                                                        transition={true}
                                                        show={showAlert}
                                                        >{messageAlert} 
                                                        </Alert>
                                                        })
                                                     }   
                                                   </div> 
                                            <form>
                                                <Row>
                                                    <Col style={{display: 'flex', justifyContent: 'center'}}>
                                                       
                                                            <Carousel activeIndex={this.state.indexCarousel} onSelect={this.seleccionFoto}>
                                                                {(this.state.fileArray || []).map(url => (
                                                                    <Carousel.Item>
                                                                        <img src={url} alt="" style={{height:"500px",width:"700px"}} />
                                                                    </Carousel.Item>
                                                                ))}
                                                            </Carousel>

                                                    </Col>
                                                </Row>
                                                {this.state.fileObj[0] && this.state.fileObj[0].length > 0 && (
                                                    <Row className="mt-3">
                                                        <Col>
                                                            <div className="form-group">
                                                                <label><strong>Archivos cargados: ({this.state.fileObj[0].length})</strong></label>
                                                                <ul className="list-group">
                                                                    {Array.from(this.state.fileObj[0]).map((file: any, index: number) => (
                                                                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                                            <span>
                                                                                <i className="fas fa-file mr-2"></i>
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
                                                                                <i className="fas fa-trash"></i>
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
                                                            <Button type="button" size="sm" variant="outline-danger" onClick={this.onDeletePhoto}>Limpiar Todos</Button>
                                                        </div> 
                                                    </Col>
                                                </Row>                                       
                                                <Row>
                                                    <Col>
                                                        <div className="form-group">
                                                        <label>Seleccionar Archivos</label>    
                                                        <Form.File
                                                        // ref={fileInput=>this.fileInput =fileInput}
                                                        label="Cargar Archivos" data-browse="Buscar" custom onChange={this.uploadMultipleFiles} multiple />
                                                        </div>                        
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <div className="form-group">
                                                            <Form.Label>Tipo Archivos</Form.Label>
                                                            <Form.Control as="select" name="tipoArchivo" value={tipoArchivo} onChange={this.handleChange} required>
                                                                <option value="">----------</option>
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
                                                            <label>Observaciones</label>
                                                            <input className="form-control" type="text" placeholder=""  name ="observaciones" value={observaciones} onChange={this.handleChange} />
                                                        </div>
                                                    </Col>
                                                </Row>                    
                                                <Row>
                                                    <Col>
                                                    <div className="form-group">
                                                        {/* <Button onClick={this.fileInput.click()}>Selecciona el archivo</Button> */}
                                                        <Button type="button" variant="success" onClick={this.uploadFiles} disabled={this.state.tipoArchivo.length>0 && this.state.fileObj.length>0 && this.validarPermisos()===false ? false : true}>Subir</Button>
                                                    </div>
                                                    </Col>
                                                </Row>
                                                {this.validarPermisos()===true ? <p>NO TIENE PERMISOS...</p> : null}                
                                        </form >

                                            </Container>
                            </Modal.Body>
                             <Modal.Footer>
                                <Button onClick={this.handleModalConceptosSave}>Cerrar</Button>
                                
                                {/* <Button onClick={this.handleModalConceptosSave}>Guardar</Button> */}
                          </Modal.Footer>
                     </Modal>
    </>
  );
}
}


