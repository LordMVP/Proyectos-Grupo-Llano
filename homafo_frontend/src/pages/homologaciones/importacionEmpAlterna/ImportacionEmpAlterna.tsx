import React, { Suspense } from 'react'
import { Row, Col , Button , Tabs , Tab} from 'react-bootstrap';
import Alerta from '../../../components/utils/AlertaComponent/AlertaComponent';
import homoApi from '../../../api/homologaciones/Homologacion';
import { trackPromise } from "react-promise-tracker";
import Cargando from '../../../components/utils/Cargando';
import ModalCargando from '../../../components/utils/ModalCargando/ModalCargando';
import basicoDefault from '../../../api/homologaciones/BasicoDefault';
import parametrosApi from '../../../api/homologaciones/ParParametrosApi';
import ImportacionEmsa from '../../../components/Homologaciones/ImportacionEmsa/ImportacionEmsa';
import ImportacionGas from '../../../components/Homologaciones/ImportacionGas/ImportacionGas';

interface IProps {
    //agregarTarea:(tarea :ITareas)=>void;
    //lista:IAutor[];
    //eliminar: (id:number)=>void; 
    value?: any,
    //cambioValor:(value: React.ChangeEvent<HTMLSelectElement>)=>void;
}

class ImportacionEmpAlterna extends React.Component<IProps, any>
{
    constructor(props: IProps) {
        super(props);
        this.state={
            value:'',
            estado:0,
            //vistaLista:false,
            //vistaEditar:false,
            encabezadoLista:['Codigo','Identificacion','Nombres','Direccion','Catastral','Estrato','Ciclo','Clase','Fecha'],
            listaResultado:[],
            menuEditar:['+','+','+','+'],
            estadoBusqueda: 0,
            basico:{primero:'nada'},
            suscripcion:{},
            homologacion:{},
            gestion:{},
            alerta:{
                variante:'',
                estado:false,
                valor:''
            },
            seleccionBusqueda:{},
            login:{
                idEmpresa:0,
                idUsuario:0
            },
        };
    }

    cargarProyectos = async () => {
        try {
            let api: homoApi = new homoApi();
            let tmp = await api.listaProyectos(this.state.login.idEmpresa);
            this.setState({
                proyectos: tmp.data
            })
        } catch (e) {
            console.log('error que sale ' + e);
        }
    }

    async componentDidMount()
    {
        await this.cargarDatosSesion();
        await this.cargarParametros();
    }

    cargarDatosSesion=async()=>
    {
       let basico:basicoDefault=new basicoDefault();
       let resultado=basico.extraerInfoToken(localStorage.getItem('token')); 
        await this.setState({
            login:{
                ...this.state.login,idEmpresa:resultado.idEmpresa,idUsuario:resultado.idUsuario
            },
            basico:{
                ...this.state.basico,idUsuario:resultado.idUsuario
            }
        })
    }

    cargarParametros=async()=>
    {
        let paraApi:parametrosApi=new parametrosApi();
        let tmp=await paraApi.listaParametros();
        await this.setState({
            parametros:tmp.data
        })
    }


    async cambioValor(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
        const { value, name } = e.target;
        //console.log('desde input '+value + ' '+name );
        await this.setState({
            busqueda: {
                ...this.state.busqueda, [name]: value
            }
        })

    }

    buscar = async (e: any) => {
        this.setState({
            cargando:true
        })
        let api: homoApi = new homoApi();
        let tmp:any = await trackPromise(api.listaBusquedaGeneral(e));
        //console.log(e);
        await this.setState({
            listaResultado: tmp.data,
            estado: 1,
            cargando:false
            //!this.state.vistaLista
            //vistaEditar:false           
        })
    }

    limpiar = () => {
        this.setState({
            estado: 0,
            //vistaLista:false,
            //vistaEditar:false,
            estadoBusqueda: this.state.estadoBusqueda + 1
        })
    }

    listar= () =>
    {
        this.setState({
            estado: 1
        })
    }

    editarHomo = async (e: any) => {
        this.setState({
            cargando:true
        })
        //console.log(e);
        let api: homoApi = new homoApi();
        let tmp = await api.informacionBasica(e.Dsuscripcion);
        let tmp2=await api.informacionSuscripcion(e.Dsuscripcion);
        let tmp3=await api.informacionHomologacion(e.Dsuscripcion);
        let tmp4=await api.informacionGestion(e.Dsuscripcion);
        await this.setState({
            //vistaLista:false,
            //vistaEditar:true,
            seleccionBusqueda:e,
            basico: tmp.data[0],
            suscripcion:tmp2.data[0],
            homologacion:tmp3.data[0],
            gestion:tmp4.data[0],
            estado: 2,
            cargando:false
        })
    }

    cambioAcordeon = (e: any) => {
        let tmp = this.state.menuEditar[e] === '+' ? '-' : '+';
        let tmpArray = this.state.menuEditar;
        tmpArray[e] = tmp;
        this.setState({
            menuEditar: tmpArray
        })
    }

    guardarBasico = async (e: any) => {
        try {
            this.setState({
                cargando:true
            })
            //console.log(e);
            let api: homoApi = new homoApi();
            let tmp = await api.guardarInfobasica(e);
            let resultado = tmp.data;
            if (resultado.statusCode === 200) {
                this.llamarAlerta('success', 'Transaccion Exitosa...');
            }
            else {
                this.llamarAlerta('danger', 'Error Transaccion, Comunicarse con el Area de Tecnologia...');
            }
            await this.setState({
                estado: 0,
                estadoBusqueda: this.state.estadoBusqueda + 1,
                cargando:false
            })
        } catch (e) {
            console.log(e);
        }

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

    mostrarAlerta = (): any => {
        if (this.state.alerta.estado) {
            return (
                <Alerta informacion={this.state.alerta}></Alerta>
            )
        }
    }

    cambioEstado=async(e)=>
    {
        await this.setState({
            estado:parseInt(e)
        })
    }
   

    mostrarLista=(): any=>
    {
        if(this.state.estado>1)
        {
            return(
                <div>
                    <Row>
                        <Col>
                            <div className="form-group">
                                    <Button variant="primary" onClick={()=>this.setState({estado:1})}>Regresar al Listado</Button>
                                </div>                                
                        </Col>                        
                    </Row>                        
                </div>
                
            )            
        }
        else
            return

    }

    mostrarCargando = (): any => {
        if (this.state.cargando) {
            return (
                <ModalCargando estado={this.state.cargando}></ModalCargando>
            )
        }
    }

    renderEstado = (): any => {
        switch (this.state.estado) {
            case 0:
                return (
                    <div>
                            <ImportacionEmsa/>
                    </div>
                )
            case 1:
                return (
                    <div>
                        <ImportacionGas/>
                    </div>
                )
            case 2:
                return (
                    <Row>
                        <Col>
                                <h2>tres</h2> 
                        </Col>
                    </Row>
                )

        }
    }

    render() {
        return (
            <div>
                <Suspense fallback={<div>Cargando...</div>}>
                    <div className="row">
                        <div className="d-flex p-2 bd-highlight">
                            <h2>Importacion Informacion</h2>
                        </div>
                        <div className="col-12">
                            {this.mostrarAlerta()}
                            {this.mostrarCargando()}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                        <Tabs defaultActiveKey="0" id="importacion-tabs" onSelect={(k) => this.cambioEstado(k)}>
                                <Tab eventKey="0" title="Importar Informacion Emsa">
                                    {this.renderEstado()}
                                </Tab>
                                <Tab eventKey="1" title="Importar Informacion Gas">
                                     {this.renderEstado()}
                                </Tab>
                        </Tabs>                            
                            <Cargando/>
                        </div>
                    </div>
                </Suspense>
            </div>
        );
    }
}

export default ImportacionEmpAlterna;