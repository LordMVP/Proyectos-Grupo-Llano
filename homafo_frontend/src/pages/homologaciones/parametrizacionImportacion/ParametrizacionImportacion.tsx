import React,{ Suspense } from 'react';
import parametrosApi from '../../../api/homologaciones/ParParametrosApi';
import { Tabs , Tab} from 'react-bootstrap';
import ModalCargando from '../../../components/utils/ModalCargando/ModalCargando';
import Alerta from '../../../components/utils/AlertaComponent/AlertaComponent';
import Cargando from '../../../components/utils/Cargando';
import ParametrizacionImportActualizar from '../../../components/Homologaciones/ParametrizacionImportActualizar/ParametrizacionImportActualizar'
import ParametrizacionImportCrear from '../../../components/Homologaciones/ParametrizacionImportCrear/ParametrizacionImportacionCrear'
import PARAMETROS from '../../../data/constantes';
import SesionApi from '../../../api/common/SesionApi';
import UtilsFunction from '../../../components/utils/UtilsFunction';


const sesionApi = new SesionApi();
interface IProps {
    value?: any,
    informacion?:any,
    //guardarInfoGestion:(e:any)=>void
}

class ParametrizacionImportacion extends React.Component<IProps, any>
{
    constructor(props: IProps) {
        super(props);
        this.state={
            cargando:false,
            estadoLista:false,
            estado:0,
            alerta:{
                variante:'',
                estado:false,
                valor:''
            },
            effectivePermissions:{EDIT:false,VIEW:false,CREATE:false,SAVE:false,DELETE:false,QUERY:false},
            permissions: [],
        }
    }

    async componentDidMount()
    {
        await this.cargarParametros();
        await this.cargarDefecto();
        await sesionApi.loadPermisos(PARAMETROS.PARAMETRIZACION_IMPORTACION.PROGRAMA_ID).then(response => {
            this.setState({ permissions: response.data });
        })
        await this.cargarPermisos();
    }

    cargarPermisos=async()=>
    {
      let effectivePermission = UtilsFunction.getEffectivePermissions(this.state.permissions,'PARAMETRIZACION_IMPORTACION');    
      await this.setState({effectivePermissions:effectivePermission});
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

    cambioEstado=async(e)=>
    {
        await this.setState({
            estado:parseInt(e)
        })
    }

    mostrarAlerta = (): any => {
        if (this.state.alerta.estado) {
            return (
                <Alerta informacion={this.state.alerta}></Alerta>
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

    renderEstado = (): any => {
        switch (this.state.estado) {
            case 0:
                return (
                    <div>
                        <ParametrizacionImportCrear permisos={this.state.effectivePermissions}/>
                    </div>
                )
            case 1:
                return (
                    <div>
                            <ParametrizacionImportActualizar permisos={this.state.effectivePermissions}/>
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
                            <h2>patametrizacion Importacion Homologaciones</h2>
                        </div>
                        <div className="col-12">
                            {this.mostrarAlerta()}
                            {this.mostrarCargando()}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                        <Tabs defaultActiveKey="0" id="importacion-tabs" onSelect={(k) => this.cambioEstado(k)}>
                                <Tab eventKey="0" title="Nueva Parametrizacion">
                                    {this.renderEstado()}
                                </Tab>
                                <Tab eventKey="1" title="Ver parametrizacion">
                                     {this.renderEstado()}
                                </Tab>
                        </Tabs>
                            
                            <Cargando/>
                        </div>
                    </div>
                </Suspense>
            </div>
        )
    }
}
export default ParametrizacionImportacion;