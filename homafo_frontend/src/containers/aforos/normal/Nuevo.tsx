import React, { Component  } from 'react'
import { Form, Col, Button, ButtonToolbar, Alert, Card, Modal, ListGroup , OverlayTrigger , Tooltip , InputGroup , Spinner } from 'react-bootstrap'
import { Modal as ModalANT } from 'antd'
import * as API from '../../../api/aforos/aforos'
import { connect } from 'react-redux'
// import { Typeahead  } from 'react-bootstrap-typeahead';
import { loadTiposAforo, loadFrecuenciaRecoleccion, loadBarrio, loadConceptoAforo, loadTecnicoAforador, loadEstado, loadTipoUso, loadMacrorutasRecoleccion } from '../../../actions/aforos/selects'
import { bindActionCreators } from 'redux'
import * as Dates from '../../../utils/Dates'
// import * as validations from 'utils/validations'
import Loader from '../../../components/loader/Init'
import { Redirect } from "react-router-dom";
import SimpleSearch from '../../../components/search/SimpleSearch';
import homoApi from '../../../api/homologaciones/Homologacion';
import tafoApi from '../../../api/homologaciones/TipoAforoApi';
import utilsVarios from '../../../utils/UtilsVarios';

///validar permisos
import PARAMETROS from '../../../data/constantes';
import SesionApi from '../../../api/common/SesionApi';
import UtilsFunction from '../../../components/utils/UtilsFunction';
import ParparametrosAforoApi from "../../../api/aforos/ParParametrosAforoApi";
import parametrosApi from '../../../api/homologaciones/ParParametrosApi';
import uniApi from '../../../api/homologaciones/UniUnidad';
import basicoDefault from '../../../api/homologaciones/BasicoDefault';




const sesionApi = new SesionApi();

type changeEventElement = React.ChangeEvent<HTMLInputElement>;
type KeyboardEvent = React.KeyboardEvent<HTMLInputElement>;

type SendData = {
    idSuscripcion: number,
    idTercero: number,
    numPqr: string,
    idUsuario: number,
    uniTipoAforo: number,
    vigenciaDesde: string,
    vigenciaHasta: string,
    vigenciaFinal: string,
    fechaRegistro: string,
    estado: string,
    tecnicoAforador: number,
    conceptoAforo: string,
    factor: string,
    observaciones: string,
    nombreEstablecimiento: string,
    referenciaComercial: string,
    frecuenciaRecoleccion: string,
    jornada: string,
    ideafopadre: Number,
    rureIderegistro: Number,
    afo_cantidadfrecuenciarecoleccion: number,
    barrioUsuarioCodigo:string,
    actividadComercial:number,
    actividadComercialText:string,
    tfdIderegistro: number,
    tfvIderegistro: number,
    tfdDescripcion: string,
    diasSemanaSelecionado: string | null,
    cantidad: number,
    frecuencia: number
}


type NuevoState = {
    loading: boolean,
    saveStatus: boolean;
    codigoSub: string;
    radicadoPqrs: string;
    idSuscripcion: string;
    idTercero: string;
    numPqr: string;
    idUsuario: string;
    nombresYapellidos: string;
    direccion: string;
    tipoUso: string;
    referenciaComercial: string;
    actividadComercial: number;
    actividadComercialText: string;
    nombreEstablecimiento: string;
    barrioUsuario: string;
    barrioUsuarioCodigo:string;
    frecuenciaRecoleccion: string;
    jornada: string;
    tipoAforo: string;
    vigenciaDesde: string;
    vigenciaHasta: string;
    vigenciaFinal: string;
    fechaRegistro: string
    estado: string
    tecnicoAforador: string;
    factor: string;
    conceptoAforo: string;
    observaciones: string;
    showModal: boolean;
    showAlert: boolean;
    messageAlert: string;
    variantAlert: [string];
    focusNext: boolean;
    redirect: any;
    estadoExtraordinario: Number,
    ideafopadre: any,
    rureIderegistro: any,
    listaMacrorutas: any,
    estadoFormExtraordinario: any,
    afo_cantidadfrecuenciarecoleccion: any,
    effectivePermissions: any,
    permissions: [],
    informacionPermisos:string,
    tafoListaTmp: [],
    plazoTifoAforo:0,
    plazoTifoAforoVigencia:0,
    estadoBusquedaPadre:boolean,
    claseAforo:Number,
    parametros: [],
    parametrosHom:[],
    fechaMinima:string,
    actividadesComerciales: Array<{
        uni_ideregistro: number,
        uni_nombre1: string,
        [key: string]: any // For any other properties that might exist
    }>,
    refFrecuenciaRecoleccio:string
    diasSemanaSelecionado: string | null;
    tfdIderegistro: number;
    tfvIderegistro: number;
    tfdDescripcion: string;
    cantidad: number;
    frecuencia: number;
};
//interface ISelects {
// selects: {

//     tiposAforo: [],
//     frecuenciaRecoleccion: [],
//     Barrio: [],
//     conceptoAforo: [],
//     tecnicoAforador: [],
//     Estado :[],
//     tipoUso:[]
// }
//};

class Nuevo extends Component<{ selects: any, actions: any }, NuevoState> {

    constructor(props) {

        super(props)
        this.state = {
            loading: false,
            saveStatus: true,
            idSuscripcion: "",
            idTercero: "",
            codigoSub: "",
            radicadoPqrs: "",
            numPqr: "",
            idUsuario: "",
            nombresYapellidos: "",
            direccion: "",
            tipoUso: "",
            referenciaComercial: "",
            actividadComercial: 0,
            actividadComercialText: "",
            nombreEstablecimiento: "",
            barrioUsuario: "",
            barrioUsuarioCodigo: "",
            frecuenciaRecoleccion: "",
            refFrecuenciaRecoleccio:"",
            jornada: "",
            tipoAforo: "",
            vigenciaDesde: "",
            vigenciaHasta: "",
            vigenciaFinal:"",
            fechaRegistro: Dates.currentDate(),
            estado: "En Proceso",
            tecnicoAforador: "",
            factor: "",
            conceptoAforo: "",
            observaciones: "",
            showModal: false,
            showAlert: false,
            messageAlert: "",
            variantAlert: ['light'],
            focusNext: false,
            redirect: null,
            estadoExtraordinario: 0,
            ideafopadre: null,
            rureIderegistro: null,
            listaMacrorutas: [],
            estadoFormExtraordinario: false,
            afo_cantidadfrecuenciarecoleccion: null,
            effectivePermissions: { EDIT: false, VIEW: false, CREATE: false, SAVE: false, DELETE: false, QUERY: false },
            permissions: [],
            informacionPermisos:'Seleccione Suscripcion y Verifique Permisos',
            tafoListaTmp:[],
            plazoTifoAforo:0,
            plazoTifoAforoVigencia:0,
            estadoBusquedaPadre:false,
            claseAforo:0,
            parametros: [],
            parametrosHom:[],
            fechaMinima:'',
            actividadesComerciales:[],
            diasSemanaSelecionado: null,
            tfdIderegistro: 0,
            tfvIderegistro: 0,
            tfdDescripcion: "",
            cantidad: 0,
            frecuencia: 0,
        }
    } //end constructor


    //componentDidMount():void {
    componentDidMount = async () => {
        //global selects [barrio,ConceptoAforo,tecnicoAforador,tiposAforo,]
        this.props.actions.loadTiposAforo();
        this.props.actions.loadEstado();
        this.props.actions.loadTecnicoAforador();
        this.props.actions.loadMacrorutasRecoleccion();
        this.props.actions.loadConceptoAforo();//nuevo
        await this.cargarParametros();
        await this.cargarParametrosHom();
        await this.cargarClaseAforo();
        await this.cargarActividades();
        await this.cargarMacrorutasRecoleccion();
        //console.log('que tiene las macrorutas ',this.state.listaMacrorutas);
        await sesionApi.loadPermisos(PARAMETROS.AFORO_NORMAL.PROGRAMA_ID).then(response => {
            this.setState({ permissions: response.data });
        })
        await this.cargarPermisos();
        ///cargar tafo///////////
            let tafoTmp: tafoApi = new tafoApi();
            let tafoTmp1= await tafoTmp.listaTafoGeneral();
            console.log('tafo',tafoTmp1);
            await this.setState({
            tafoListaTmp:tafoTmp1.data.content
            })
        await this.obtenerfechaMinina();    
    }

    obtenerfechaMinina=async()=>
    {
        var today = new Date(),
        date = today.getFullYear() + '-' +((today.getMonth() + 1)<10 ? ('0'+(today.getMonth() + 1)) : (today.getMonth() + 1)) + '-' + today.getDate();
        await this.setState({
            fechaMinima:date
        })

    }

    cargarParametros=async()=>
    {
        let paraApiAforo: ParparametrosAforoApi = new ParparametrosAforoApi();
        let tmp = await paraApiAforo.listaParametros();
        await this.setState({
        parametros: tmp.data
        })
    }

    cargarParametrosHom=async()=>
    {
        let paraApi:parametrosApi=new parametrosApi();
        let tmp=await paraApi.listaParametros();
        await this.setState({
            parametrosHom:tmp.data
        })
    }

    async cambioValor(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        console.log('desde input '+value + ' '+name );

        // Buscar el item seleccionado para obtener tanto el ID como el texto
        const itemSeleccionado = this.state.actividadesComerciales.find((item: any) => item.uni_ideregistro === parseInt(value));

        await this.setState({
            actividadComercial: parseInt(value) || 0,
            actividadComercialText: itemSeleccionado ? itemSeleccionado.uni_nombre1 : ""
        })
        
    }

    cargarClaseAforo=async()=>
    {
        let basico: basicoDefault = new basicoDefault();
        let tmp=await basico.buscarParametro('uni_clase_suscripcion_normal', this.state.parametros);
        await this.setState({
            claseAforo:parseInt(tmp)
        })
    }

    cargarActividades=async()=>
    {
        var _ = require('lodash');
        let basico: basicoDefault = new basicoDefault();
        let api:uniApi =new uniApi();
        let tmp=await api.datosUnidades(parseInt(basico.buscarParametro('clase_actividad_economica', this.state.parametrosHom)),0);
        await this.setState({
            actividadesComerciales:_.sortBy(tmp.data,'uni_nombre1') //tmp.data
        })
    }

    cargarPermisos = async () => {
        let effectivePermission = UtilsFunction.getEffectivePermissions(this.state.permissions, 'AFORO_NORMAL');
        await this.setState({ effectivePermissions: effectivePermission });
    }

    cargarMacrorutasRecoleccion = async () => {
        try {
            let api: homoApi = new homoApi();
            let tmp = await api.macrorutasRecoleccion();
            this.setState({
                listaMacrorutas: tmp.data
            })

        } catch (e) {
            console.log('error que sale ' + e);
        }
    }

    cargarMacrorutasRecoleccionSuscripcion = async () => {
        try {
            let api: homoApi = new homoApi();
            let tmp = await api.macrorutasRecoleccionSuscripcion(this.state.idSuscripcion);
            this.setState({
                listaMacrorutas: tmp.data
            })

        } catch (e) {
            console.log('error que sale ' + e);
        }
    }


    buscarFrecuenciaRecoleccion = () => {
        let horarioTmp = '';
        let afo_cantidadfreTmp = 0;
        let filtro = this.state.listaMacrorutas.filter(item => item.rure_ideregistro === this.state.rureIderegistro);
        let tmp = filtro[0];
        if (tmp != null) {
            for (let uno in tmp.horario) {
                horarioTmp = horarioTmp + ',' + tmp.horario[uno];
                afo_cantidadfreTmp = afo_cantidadfreTmp + 1;
            }
            this.setState({
                frecuenciaRecoleccion: horarioTmp,
                afo_cantidadfrecuenciarecoleccion: afo_cantidadfreTmp
            })
        }
    }

    handleChange = async(event: changeEventElement) => {

        const {value, name}=event.target;
        console.log('desde input '+value + ' '+name );
        this.setState({ [name]: value } as any)

        if (name === "tipoAforo") {
            this.props.actions.loadConceptoAforo(value);
            console.log(this.state.tafoListaTmp)
            //let filtroTipo = this.props.selects.tiposAforo.filter(item => item.id === parseInt(event.target.value));
            let filtroTipo:any=this.state.tafoListaTmp.filter(item => item['tafoIderegistro'] == (value) );
            if (filtroTipo.length > 0)
            {
                this.setState({
                    plazoTifoAforo:filtroTipo[0].tafoPlazoMaximo,
                    plazoTifoAforoVigencia:filtroTipo[0].tafoVigencia,
                    vigenciaDesde: '' ,
                    vigenciaHasta:'',
                    vigenciaFinal:'',
                    factor:filtroTipo[0].tafoFactorProduccion
                  })

                //if (filtroTipo[0].object.toUpperCase().indexOf('EXTRAORDINARIO') >= 0) {
                if (filtroTipo[0].tafoAforoPadre)
                {
                    this.setState({
                        estadoExtraordinario: 1,
                        ideafopadre: null,
                        estadoFormExtraordinario: true,
                    })
                }
                else
                    this.setState({
                        estadoExtraordinario: 0,
                        ideafopadre: null,
                        estadoFormExtraordinario: false
                    })
            }
        }
        if (name === "vigenciaHasta") {
            console.log(value)
            if (value >= this.state.vigenciaDesde) {
                this.setState({ [name]: value } as any)
            } else {
                this.setState({ [name]: "" } as any)
                alert('Ops!,Vigencia-Hasta debe ser mayor o igual que "Vigencia Desde".');
            }

        }
        if (name === "vigenciaFinal") {
            console.log(value)
            if (value >= this.state.vigenciaFinal) {
                this.setState({ [name]: value } as any)
            } else {
                this.setState({ [name]: "" } as any)
                alert('Ops!,Vigencia-Final debe ser mayor o igual que "Vigencia Desde".');
            }

        }
        if (name === "vigenciaDesde") {
            let util:utilsVarios=new utilsVarios();
            let fecha1=util.convertStringToDate(value);
            let fecha2=util.sumarDias(fecha1,this.state.plazoTifoAforo);           
            let fechafinal=util.convertDateToString(fecha2);
            let fecha3=util.sumarDias(fecha2,this.state.plazoTifoAforoVigencia); 
            let fechafinal2=util.convertDateToString(fecha3);
            await this.setState({
                vigenciaDesde: value ,
                vigenciaHasta:fechafinal,
                vigenciaFinal:fechafinal2
            });
            ///cargar tafo///////////
            //let tafoTmp: tafoApi = new tafoApi();
            //let tafoTmp1= await tafoTmp.fechaFinalAforo(parseInt(this.state.tipoAforo),this.state.rureIderegistro,value);
            //let tmp=tafoTmp1.data[0];
            /*
            if (value <= this.state.vigenciaHasta || this.state.vigenciaHasta === "") {
                this.setState({
                     [name]: value ,
                     vigenciaHasta:tmp.fechaFinal
                    } as any)
            } else {
                this.setState({ [name]: "" } as any)
                alert('Ops!,"Vigencia Hasta" debe ser mayor o igual que Vigencia-Desde ');
            }
            */

        }

        if (name === "factor") {
            if (!value || value.match(/^\d{1,}(\.\d{0,4})?$/)) {
                console.log("if true factor setstate", event.target.value)
                this.setState({ factor: value });
            } else {
                this.setState({ factor: "" });
            }

            //  this.props.actions.loadConceptoAforo(event.target.value);
        }

        if (name === "rureIderegistro") {
            let horarioTmp = '';
            let afo_cantidadfreTmp = 0;
            let filtro = this.state.listaMacrorutas.filter(item => item.rure_ideregistro === parseInt(value));
            let tmp = filtro[0];
            for (let uno in tmp.horario) {
                horarioTmp = horarioTmp + ',' + tmp.horario[uno];
                afo_cantidadfreTmp = afo_cantidadfreTmp + 1;
            }
            this.setState({
                frecuenciaRecoleccion: horarioTmp,
                afo_cantidadfrecuenciarecoleccion: afo_cantidadfreTmp
            })
        }
        if (name === "diasSemanaSelecionado") {
            // Find the selected item from tiposAforo based on the selected value
            const selectedItem = this.props.selects.tiposAforo.find(
                item => `${item.id}|${item.frecuencia}|${item.tfdDescripcion}` === value
            );
            
            if (selectedItem) {
                // Update state with all required values
                this.setState({
                    diasSemanaSelecionado: value,
                    tfdIderegistro: selectedItem.tfdIderegistro || 0,
                    tfvIderegistro: selectedItem.tfvIderegistro || 0,
                    tfdDescripcion: selectedItem.tfdDescripcion || "",
                    cantidad: selectedItem.cantidad || 0,
                    frecuencia: selectedItem.frecuencia || 0
                });
            } 
        }
    };
    alertInformation = (showAlert: boolean, variantAlert: [string], messageAlert: string) => {
        this.setState({
            showAlert: showAlert,
            variantAlert: variantAlert,
            messageAlert: messageAlert
        }, () => { window.setTimeout(() => { this.setState({ showAlert: false, variantAlert: ['light'], messageAlert: "" }) }, 4000) });

    }

    
    ejecutarBusquedad = () => {
        this.setState({ loading: true });
        const dataFlush = { idSuscripcion: this.state.idSuscripcion, codigoSub: this.state.codigoSub, radicadoPqrs: this.state.radicadoPqrs }
        console.log("dataflush send", dataFlush)
        API.GetNuevo(dataFlush).then(response => {
            console.log("comming data nuevo:", response)

            if (response.success === false || response.data.idUsuario === null) {// searched Object: null
                this.alertInformation(true, ['secondary'], response.message)


                this.setState({
                    idUsuario: '',
                    idTercero: '',
                    numPqr: '',
                    nombresYapellidos: '',
                    direccion: '',
                    tipoUso: '',
                    referenciaComercial: '',
                    actividadComercialText: '',
                    actividadComercial: 0,
                    nombreEstablecimiento: '',
                    barrioUsuario: '',
                    frecuenciaRecoleccion: '',
                    jornada: '',
                    saveStatus: true,
                    loading: false,
                    focusNext: false,
                    barrioUsuarioCodigo:'',
                    rureIderegistro: 0,

                })

                // return response;

            } else {// searched Object: is NOT null 
                console.log("NoNull, data come", response)
                this.setState({

                    idUsuario: response.data.idUsuario || "",
                    idSuscripcion: response.data.idSuscripcion || "",
                    idTercero: response.data.idTercero || "",
                    numPqr: response.data.numPqr || "",
                    radicadoPqrs: response.data.numPqr || "",
                    codigoSub: response.data.codSuscripcion || "",
                    nombresYapellidos: response.data.nombresYapellidos || "",
                    direccion: response.data.direccion || "",
                    tipoUso: response.data.tipoUso || "",
                    referenciaComercial: response.data.referenciaComercial || "",
                    actividadComercial: parseInt(response.data.actividadComercial) || 0,
                    actividadComercialText: response.data.actividadComercial || "",
                    nombreEstablecimiento: response.data.nombreEstablecimiento,
                    barrioUsuario: response.data.barrioUsuario || "",
                    frecuenciaRecoleccion: response.data.frecuenciaRecoleccion || "",
                    jornada: response.data.jornada || "",
                    ///saveStatus: false,
                    loading: false,
                    focusNext: true,
                    rureIderegistro: response.data.rureIderegistro || "",
                    barrioUsuarioCodigo:response.data.barrioUsuarioCodigo || "",
                })
                this.props.actions.loadTecnicoAforador(this.state.idTercero);
                this.cargarMacrorutasRecoleccionSuscripcion();
                console.log("load suscripcion to state:", this.state);
                if (this.state.rureIderegistro > 0) {
                    this.buscarFrecuenciaRecoleccion();
                }
                if(this.state.effectivePermissions.CREATE)
                {
                    this.setState({
                        saveStatus: false,
                        informacionPermisos:'Puede Guardar...'
                    })
                }
                // return response;     
            }


        }).catch(error => {
            this.setState({ loading: false });
            if (!error) {
                // network error
                console.log("error x")
                return Promise.reject(error);
            }
            console.log('Error', error.message);
            return Promise.reject(error);
        });
    }
    _handleKeyDownSearch = (e: KeyboardEvent): void => {
        if (e.key === 'Enter') {
                this.ejecutarBusquedad();
        }
    } // end handleKeyDownSearch
    _handleButtonSearch = (): void => {
        this.ejecutarBusquedad();
    }

    handleModalClose = (): void => {
        this.setState({ showModal: false });
    }
    handleModalSave = (): void => {

        const data: SendData = {
            idSuscripcion: parseInt(this.state.idSuscripcion), //number
            idTercero: parseInt(this.state.idTercero), //number
            numPqr: this.state.numPqr, //number
            idUsuario: parseInt(this.state.idUsuario), //number
            uniTipoAforo: parseInt(this.state.tipoAforo), //number
            vigenciaDesde: this.state.vigenciaDesde,
            vigenciaHasta: this.state.vigenciaHasta,
            vigenciaFinal: this.state.vigenciaFinal,
            fechaRegistro: this.state.fechaRegistro,
            estado: this.state.estado,
            tecnicoAforador: parseInt(this.state.tecnicoAforador),  //number
            conceptoAforo: this.state.conceptoAforo,
            factor: this.state.factor.toString(),
            observaciones: this.state.observaciones,
            frecuenciaRecoleccion: this.state.frecuenciaRecoleccion,
            jornada: this.state.jornada,
            nombreEstablecimiento: this.state.nombreEstablecimiento,
            referenciaComercial: this.state.referenciaComercial,
            ideafopadre: this.state.ideafopadre,
            rureIderegistro: this.state.rureIderegistro,
            afo_cantidadfrecuenciarecoleccion: this.state.afo_cantidadfrecuenciarecoleccion,
            barrioUsuarioCodigo:this.state.barrioUsuarioCodigo,
            actividadComercial: parseInt(this.state.actividadComercial.toString()),
            actividadComercialText: this.state.actividadComercialText,
            tfdIderegistro: this.state.tfdIderegistro,
            tfvIderegistro: this.state.tfvIderegistro,
            tfdDescripcion: this.state.tfdDescripcion,
            diasSemanaSelecionado: this.state.diasSemanaSelecionado,
            cantidad: this.state.cantidad,
            frecuencia: this.state.frecuencia
}
        console.log("data to send", data)
        API.CreateNewAforo(data)
            .then(response => {
                if (response.data.success === true) {
                    ModalANT.success({
                        title: 'Aforo Creado',
                        content: (
                            <div>
                                <p>Se ha creado el aforo con exito: {response.data.data.afoIderegistro} </p>
                            </div>
                        ),
                        onOk() { },
                    });
                    this.setState({
                        showAlert: true,
                        variantAlert: ['success'],
                        messageAlert: "Se ha grabado con Exito "
                    });
                    setTimeout(() => { this.setState({ redirect: "/aforos/normal/consultar" }) }, 2500);
                    console.log(response)
                } else {
                    //  return response;
                    this.setState({
                        showAlert: true,
                        variantAlert: ['danger'],
                        messageAlert: response.data.message
                    }, () => { window.setTimeout(() => { this.setState({ showAlert: false, variantAlert: ['light'], messageAlert: "" }) }, 8000) });
                    console.log(response)
                }
                //  return response;
            })
            .catch(error => {
                if (!error) { // network error
                    this.setState({
                        showAlert: true,
                        variantAlert: ['warning'],
                        messageAlert: "Ops!,Error de Conexion.No se ha podido guardar "
                    }, () => { window.setTimeout(() => { this.setState({ showAlert: false, variantAlert: ['light'], messageAlert: "" }) }, 8000) });
                    return Promise.reject(error);
                } //end if
                // server error
                this.setState({
                    showAlert: true,
                    variantAlert: ['danger'],
                    messageAlert: "Ops!,Error al guardar el aforo "
                }, () => { window.setTimeout(() => { this.setState({ showAlert: false, variantAlert: ['light'], messageAlert: "" }) }, 6000) });

                return Promise.reject(error.status);
            });
        this.setState({ showModal: false });
    } //END handleModalSave

    onSubmit = async (event) => {
        event.preventDefault();
        
        // Validar si el campo de frecuencia es obligatorio y está vacío
        if (this.props.selects.tiposAforo) {
            const diasRecoleccion = this.props.selects.tiposAforo
                .filter(item => item.id === this.state.tipoAforo && item.diasSemana);
            
            if (diasRecoleccion.length > 0 && !this.state.diasSemanaSelecionado) {
                this.alertInformation(true, ['warning'], 'Debe seleccionar una Frecuencia');
                return;
            }
        }
        
        this.setState({ showModal: true })
    }

    KeyDownSearchAforoPadre = (e: KeyboardEvent): void =>
    {
        if (e.key === 'Enter') {

            this.setState({ loading: true });
            const dataFlush = { numAforoPadre: this.state.ideafopadre }
            console.log("dataflush send", dataFlush)
            API.GetAforoPadre(dataFlush).then(response => {
                console.log("comming data nuevo:", response)

                if (response.success === false || response.data.idUsuario === null) {// searched Object: null
                    this.alertInformation(true, ['secondary'], response.message)


                    this.setState({
                        idUsuario: '',
                        idTercero: '',
                        numPqr: '',
                        nombresYapellidos: '',
                        direccion: '',
                        tipoUso: '',
                        referenciaComercial: '',
                        actividadComercial: 0,
                        actividadComercialText: '',
                        nombreEstablecimiento: '',
                        barrioUsuario: '',
                        frecuenciaRecoleccion: '',
                        jornada: '',
                        saveStatus: true,
                        loading: false,
                        focusNext: false,
                        rureIderegistro: 0
                    })

                    // return response;

                } else {// searched Object: is NOT null 
                    console.log("NoNull, data come", response)
                    this.setState({

                        idUsuario: response.data.idUsuario || "",
                        idSuscripcion: response.data.idSuscripcion || "",
                        idTercero: response.data.idTercero || "",
                        numPqr: response.data.numPqr || "",
                        radicadoPqrs: response.data.numPqr || "",
                        codigoSub: response.data.codSuscripcion || "",
                        nombresYapellidos: response.data.nombresYapellidos || "",
                        direccion: response.data.direccion || "",
                        tipoUso: response.data.tipoUso || "",
                        referenciaComercial: response.data.referenciaComercial || "",
                        actividadComercial: parseInt(response.data.actividadComercial) || 0,
                        actividadComercialText: response.data.actividadComercial || "",
                        nombreEstablecimiento: response.data.nombreEstablecimiento,
                        barrioUsuario: response.data.barrioUsuario || "",
                        frecuenciaRecoleccion: response.data.frecuenciaRecoleccion || "",
                        jornada: response.data.jornada || "",
                        saveStatus: false,
                        loading: false,
                        focusNext: true,
                        rureIderegistro: response.data.rureIderegistro,
                        barrioUsuarioCodigo : response.data.barrioUsuarioCodigo || "",
                    })
                    this.props.actions.loadTecnicoAforador(this.state.idTercero);
                    console.log("load suscripcion to state:", this.state)
                    if (this.state.rureIderegistro > 0) {
                        this.buscarFrecuenciaRecoleccion();
                    }
                    // return response;     
                }


            }).catch(error => {
                this.setState({ loading: false });
                if (!error) {
                    // network error
                    console.log("error x")
                    return Promise.reject(error);
                }
                console.log('Error', error.message);
                return Promise.reject(error);
            });
        }
    } // end handleKeyDownSearch

    buscarSuscripcionPadre = (): void =>
    {

            this.setState({ 
                loading: true, 
                estadoBusquedaPadre:true,
            });
            const dataFlush = { numAforoPadre: this.state.ideafopadre }
            console.log("dataflush send", dataFlush)
            API.GetAforoPadre(dataFlush).then(response => {
                console.log("comming data nuevo:", response)

                if (response.success === false || response.data.idUsuario === null) {// searched Object: null
                    this.alertInformation(true, ['secondary'], response.message)


                    this.setState({
                        idUsuario: '',
                        idTercero: '',
                        numPqr: '',
                        nombresYapellidos: '',
                        direccion: '',
                        tipoUso: '',
                        referenciaComercial: '',
                        actividadComercial: 0,
                        actividadComercialText: '',
                        nombreEstablecimiento: '',
                        barrioUsuario: '',
                        frecuenciaRecoleccion: '',
                        jornada: '',
                        saveStatus: true,
                        loading: false,
                        focusNext: false,
                        rureIderegistro: 0,
                        estadoBusquedaPadre:false
                    })

                    // return response;

                } else {// searched Object: is NOT null 
                    console.log("NoNull, data come", response)
                    this.setState({

                        idUsuario: response.data.idUsuario || "",
                        idSuscripcion: response.data.idSuscripcion || "",
                        idTercero: response.data.idTercero || "",
                        numPqr: response.data.numPqr || "",
                        radicadoPqrs: response.data.numPqr || "",
                        codigoSub: response.data.codSuscripcion || "",
                        nombresYapellidos: response.data.nombresYapellidos || "",
                        direccion: response.data.direccion || "",
                        tipoUso: response.data.tipoUso || "",
                        referenciaComercial: response.data.referenciaComercial || "",
                        actividadComercial: response.data.actividadComercial || "",
                        actividadComercialText: response.data.actividadComercial || "",
                        nombreEstablecimiento: response.data.nombreEstablecimiento,
                        barrioUsuario: response.data.barrioUsuario || "",
                        barrioUsuarioCodigo : response.data.barrioUsuarioCodigo || "", 
                        frecuenciaRecoleccion: response.data.frecuenciaRecoleccion || "",
                        jornada: response.data.jornada || "",
                        saveStatus: false,
                        loading: false,
                        focusNext: true,
                        rureIderegistro: response.data.rureIderegistro,
                        estadoBusquedaPadre:false,
                    })
                    this.props.actions.loadTecnicoAforador(this.state.idTercero);
                    console.log("load suscripcion to state:", this.state)
                    if (this.state.rureIderegistro > 0) {
                        this.buscarFrecuenciaRecoleccion();
                    }
                    // return response;     
                }


            }).catch(error => {
                this.setState({ loading: false });
                if (!error) {
                    // network error
                    console.log("error x")
                    return Promise.reject(error);
                }
                console.log('Error', error.message);
                return Promise.reject(error);
            });
    } // end handleKeyDownSearch

    inforExtraordinario = (): any => {
        if (this.state.estadoExtraordinario > 0) {
            return (
                <Form.Row>
                    <Form.Group md="4" as={Col} controlId="factorFormGrid">
                        <Form.Label >Aforo  Ordinario Padre</Form.Label>
                        <InputGroup className="mb-3">
                        <Form.Control name="ideafopadre" value={this.state.ideafopadre} onChange={this.handleChange} type="number" placeholder="" onKeyDown={this.KeyDownSearchAforoPadre} />
                              <InputGroup.Append>
                                              <Button
                                      variant="primary"
                                      className="mr-5"
                                      type="button"
                                      onClick={this.buscarSuscripcionPadre}
                                    >
                                    {(() => {
                                                  if (this.state.estadoBusquedaPadre) {
                                                    return (
                                                    <Spinner animation="border" size="sm" as="span" role="status"  aria-hidden="true" />
                                                    )
                                                  } else 
                                                   {
                                                    return (
                                                      <div></div>
                                                    )
                                                  } 
                                                })()
                                              }    
                                    Cargar
                                    </Button>
                              </InputGroup.Append>
                      </InputGroup>
                    </Form.Group>
                </Form.Row>
            )
        }
    }

    validarGuardar=()=>
    {
        if(this.state.saveStatus)
                                    {
                                        return(
                                            <OverlayTrigger
                                                placement="right"
                                                delay={{ show: 250, hide: 400 }}
                                                overlay={<Tooltip id="button-tooltip-2">{this.state.informacionPermisos}</Tooltip>}
                                            >
                                               <span className="d-inline-block">
                                                    <Button variant="primary" className="mr-5" type="submit" disabled={this.state.saveStatus} style={{ pointerEvents: 'none' }}> Guardar</Button>
                                                </span>
                                            </OverlayTrigger>
                                        )
                                    }
                                    else
                                    {
                                        return(
                                            <Button variant="primary" className="mr-5" type="submit" disabled={this.state.saveStatus}> Guardar</Button>
                                        )
                                    }
    }

    render() {

        const {
            //     idUsuario,
            saveStatus,
            idSuscripcion,
            codigoSub,
            radicadoPqrs,
            numPqr,
            nombresYapellidos,
            direccion,
            tipoUso,
            referenciaComercial,
            actividadComercial,
            nombreEstablecimiento,
            barrioUsuario,
            //jornada,
            tipoAforo,
            vigenciaDesde,
            vigenciaHasta,
            vigenciaFinal,
            fechaRegistro,
            estado,
            tecnicoAforador,
            factor,
            conceptoAforo,
            observaciones,
            showModal,
            showAlert,
            messageAlert,
            redirect,

        } = this.state
        const { selects } = this.props

        if (redirect) {
            return <Redirect to={redirect} />
        }

        return (
            <div>
                <hr />
                <br />
                <SimpleSearch
                    labels={["Id Suscripcion", "Codigo Suscripción", "Radicado PQR'S"]}
                    names={["idSuscripcion", "codigoSub", "radicadoPqrs"]}
                    input0={idSuscripcion}
                    input1={codigoSub}
                    input2={radicadoPqrs}
                    handleChange={this.handleChange}
                    _handleKeyDownSearch={this._handleKeyDownSearch}
                    estadoExtraordinario={this.state.estadoFormExtraordinario}
                    _handleButtonSearch={this._handleButtonSearch}
                />
                {this.state.variantAlert.map((t: any, i: number) => {
                    return <Alert
                        key={i}
                        variant={t}
                        transition={true}
                        onClose={() => this.setState({ showAlert: false })}
                        show={showAlert}
                    >{messageAlert}.
                            </Alert>
                })
                }
                <Form className="mb-2" onSubmit={this.onSubmit}>

                    <Card className="mb-5" style={{ borderColor: 'rgba(0, 161, 255, 0.3)' }}>
                        <Card.Body >
                            <Alert variant='info'  >
                                Información Básica Suscripción {this.state.loading && <Loader isRelative />} {saveStatus ? '' : '✔'}
                            </Alert>

                            <Form.Row>
                                <Form.Group as={Col} controlId="naformGrid32">
                                    <Form.Label>Nombres y Apellidos</Form.Label>
                                    <Form.Control required placeholder=" " name="nombresYapellidos" value={nombresYapellidos} onChange={this.handleChange} disabled />
                                </Form.Group>

                                <Form.Group as={Col} controlId="dformGrid3">
                                    <Form.Label>Dirección</Form.Label>
                                    <Form.Control name="direccion" value={direccion} onChange={this.handleChange} disabled required />
                                </Form.Group>
                                <Form.Group as={Col} controlId="uformGridn">
                                    <Form.Label>Tipo Uso</Form.Label>
                                    <Form.Control name="tipoUso" value={tipoUso} onChange={this.handleChange} disabled required>
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="cformGrid21">
                                    <Form.Label>Referencia Comercial</Form.Label>
                                    <Form.Control placeholder="" name="referenciaComercial" value={referenciaComercial} onChange={this.handleChange} />
                                </Form.Group>
                                <Form.Group as={Col} controlId="acformGrid1">
                                    <Form.Label>Actividad comercial</Form.Label>
                                    <select onChange={e=>this.cambioValor(e)} className="form-control" name='actividadComercial' value={
                                        (() => {
                                            if (actividadComercial > 0) return actividadComercial;
                                            const itemPorTexto = this.state.actividadesComerciales.find((e: any) => e.uni_nombre1 === this.state.actividadComercialText);
                                            return itemPorTexto ? itemPorTexto.uni_ideregistro : 0;
                                        })()
                                    }>
                                                    <option value={0} key="0">-- Seleccione --</option>
                                                    {this.state.actividadesComerciales.map((e : any, key : number) => {
                                                        return <option key={key} value={e.uni_ideregistro}>{e.uni_nombre1}</option>;
                                                    })}
                                                </select> 
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGrid2">
                                    <Form.Label>Nombre del establecimiento</Form.Label>
                                    <Form.Control name="nombreEstablecimiento" value={nombreEstablecimiento} onChange={this.handleChange} autoFocus={this.state.focusNext} />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group md="4" as={Col} controlId="bFormGridState12">
                                    <Form.Label>Barrio </Form.Label>
                                    <Form.Control name="barrioUsuario" value={barrioUsuario} onChange={this.handleChange} disabled >
                                    </Form.Control>
                                    </Form.Group>
                                    {/* <Typeahead
                                    id="barrio-typeahead"
                                    emptyLabel="No hay resultados"
                                    labelKey="object"
                                    name="barrio"
                                    // value={barrio}
                                    multiple={false}
                                    // onChange={(selected:[]) => { console.log(selected);this.setState({barrio:selected});}}
                                    options={  this.state.barrioUsuario}
                                    placeholder="Barrio"/> 
                                </Form.Group>
                                <Form.Group md="2" as={Col} controlId="formGridStatejornada" >
                                    <Form.Label>Ruta de Recoleccion</Form.Label>
                                    <Form.Control as="select" name="rureIderegistro" value={rureIderegistro} onChange={this.handleChange} required >
                                        <option></option>
                                        {this.state.listaMacrorutas.map((e: any, key: number) => {
                                            return <option key={key} value={e.rure_ideregistro}>{e.rut_nombre}</option>;
                                        })}
                                    </Form.Control>
                                </Form.Group>*/}
                                {tipoAforo && this.props.selects.tiposAforo &&
                                    (() => {
                                        const diasRecoleccion = this.props.selects.tiposAforo
                                            .filter(item => item.id == tipoAforo && item.diasSemana);

                                        // Solo si hay elementos que mostrar
                                        if (diasRecoleccion.length > 0) {
                                            return (
                                                <Form.Group as={Col} controlId="diasSemana" md="4">
                                                    <Form.Label>Frecuencia:</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        name="diasSemanaSelecionado"
                                                        value={this.state.diasSemanaSelecionado || ""}
                                                        onChange={this.handleChange}
                                                        disabled={false}
                                                        required
                                                    >
                                                        <option value="">Seleccione</option>
                                                        {diasRecoleccion.map((item, index) => (
                                                            <option key={index} value={`${item.id}|${item.frecuencia}|${item.tfdDescripcion}`}>
                                                                {item.frecuencia}-{item.tfdDescripcion}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Form.Group>
                                            );
                                        }
                                        return null;
                                    })()
                                }
                            </Form.Row>
                            <Form.Row className="mt-3 mb-3">
                                {tipoAforo && this.state.diasSemanaSelecionado && this.props.selects.tiposAforo &&
                                    (() => {
                                        const diasRecoleccion = this.props.selects.tiposAforo
                                            .filter(item => `${item.id}|${item.frecuencia}|${item.tfdDescripcion}` === this.state.diasSemanaSelecionado);

                                        // Solo si hay elementos que mostrar
                                        if (diasRecoleccion.length > 0) {
                                            const tipoSeleccionado = diasRecoleccion[0];
                                            
                                            try {
                                                // Parsear el JSON de diasSemana
                                                const diasObj = JSON.parse(tipoSeleccionado.diasSemana);

                                                return (
                                                    <Col md={4}>
                                                        <Card className=''>
                                                            <Card.Header className="d-flex justify-content-between align-items-center">
                                                                <span><strong>Días de recolección</strong></span>
                                                                <div className="d-flex flex-column align-items-start">
                                                                    <small className="mb-1"><strong>Frecuencia: </strong>{tipoSeleccionado.frecuencia} días</small>
                                                                    <small><strong>Cantidad:</strong> {tipoSeleccionado.cantidad} días</small>
                                                                </div>
                                                            </Card.Header>
                                                            <Card.Body className="py-2">
                                                                <ListGroup variant="flush">
                                                                    {diasObj.map((dia, i) => (
                                                                        <ListGroup.Item key={i} className="py-1 d-flex align-items-center">
                                                                            <i className="fas fa-calendar-day mr-2"></i>
                                                                            {dia.dis_nombre_dia}
                                                                        </ListGroup.Item>
                                                                    ))}
                                                                </ListGroup>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                );
                                            } catch (e) {
                                                console.error("Error al parsear días de semana:", e);
                                                return null;
                                            }
                                        }
                                        return null;
                                    })()
                                }
                            </Form.Row>
                            {/*
                            <Form.Row>
                                <Form.Group md="12" as={Col} controlId="formGridState134">
                                    <Form.Label>Frecuecia Recolección</Form.Label>
                                    <ListGroup>
                                        {
                                            frecuenciaRecoleccion.split(',').filter(item => item !== "").map((item) => {
                                                return <ListGroup.Item>{item}</ListGroup.Item>
                                            })
                                        }
                                    </ListGroup>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group md="12" as={Col} controlId="cantidadFrecuencia">
                                    <Form.Label>Cantidad de frecuencia de recolección: {this.state.afo_cantidadfrecuenciarecoleccion}</Form.Label>
                                </Form.Group>
                            </Form.Row>
                            */
    }
                        </Card.Body>
                    </Card>
                    <Card className="mb-5" style={{ borderColor: 'rgba(0, 161, 255, 0.3)' }}>
                        <Card.Body>
                            <Alert variant='info'>Información del Aforo</Alert>
                            <Form.Row>
                                <Form.Group md="2" as={Col} controlId="formGridState2">
                                    <Form.Label>Tipo Aforo</Form.Label>
                                    <Form.Control as="select" name="tipoAforo" value={tipoAforo} onChange={this.handleChange} required>
                                        <option></option>
                                        {                                            
                                            this.state.tafoListaTmp.map((t: any, i: number) => {
                                                if(t.uniClaseaforo===this.state.claseAforo)
                                                {
                                                    return <option key={i} value={t.unidad.uniIderegistro}> {t.unidad.uniCodigo} - {t.unidad.uniNombre1}</option>                                                  
                                                }
                                                else
                                                {
                                                    return null;
                                                }
                                            
                                        })
                                        }
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGrid26" >
                                    <Form.Label>Vigencia Desde</Form.Label>
                                    <Form.Control type="date" name="vigenciaDesde" value={vigenciaDesde} onChange={this.handleChange} disabled={parseInt(tipoAforo)>0 ? false : true } required />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGrid3">
                                    <Form.Label>Vigencia Hasta</Form.Label>
                                    <Form.Control type="date" name="vigenciaHasta" value={vigenciaHasta} onChange={this.handleChange} required  />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGrid3">
                                    <Form.Label>Vigencia Final</Form.Label>
                                    <Form.Control type="date" name="vigenciaFinal" value={vigenciaFinal} onChange={this.handleChange} required disabled={true} />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGrid4">
                                    <Form.Label>Fecha de registro</Form.Label>
                                    <Form.Control type="date" name="fechaRegistro" disabled={true} value={fechaRegistro} onChange={this.handleChange} required />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                            <Form.Group as={Col} controlId="formGrid4rad2">
                                    <Form.Label>Radicado PQRS</Form.Label>
                                    <Form.Control type="text" name="numPqr" value={numPqr} onChange={this.handleChange} />
                                </Form.Group>
                                <Form.Group as={Col} controlId="estadoFormGrid" md="2">
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Control as="select" name="estado" value={estado} onChange={this.handleChange} required>
                                        <option value={'En Proceso'}>En Proceso</option>
                                        {
                                            /*selects.Estado.map((t: any, i: number) => {
                                                console.log(t)
                                                console.log(i)
                                                return <option key={i} value={t.object}> {t.object}</option>
                                            }
                                            )*/
                                        }
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} controlId="aforadorFormGrid">
                                    <Form.Label>Técnico Aforador</Form.Label>
                                    <Form.Control as="select" name="tecnicoAforador" value={tecnicoAforador} onChange={this.handleChange} required  >
                                        <option> </option>
                                        {
                                            selects.tecnicoAforador.map((t: any, i: number) => {
                                                return <option key={i} value={t.id}> {t.object}</option>
                                            }
                                            )
                                        }
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} controlId="conceptoFormGrid">
                                    <Form.Label >Concepto del Aforo</Form.Label>
                                    <Form.Control as="select" name="conceptoAforo" value={conceptoAforo} onChange={this.handleChange} required>
                                        <option value="" > </option>
                                        {
                                            selects.conceptoAforo.map((t: any, i: number) => {
                                                return <option key={i} value={t.id}> {t.object}</option>
                                            }
                                            )
                                        }
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group md="2" as={Col} controlId="factorFormGrid">
                                    <Form.Label >Factor</Form.Label>
                                    <Form.Control disabled={true} name="factor" value={factor} onChange={this.handleChange} type="text" placeholder="0.000" required />
                                </Form.Group>
                            </Form.Row>
                            {this.inforExtraordinario()}
                            <Form.Row>
                                <Form.Group md="6" as={Col} controlId="observaciones.ControlTextarea1">
                                    <Form.Label >Observaciones</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="observaciones" value={observaciones} onChange={this.handleChange} required />
                                </Form.Group>
                            </Form.Row>
                            <ButtonToolbar>
                                        {this.validarGuardar()}
                            </ButtonToolbar>
                        </Card.Body>
                    </Card>
                </Form >
                <Modal show={showModal} onHide={this.handleModalClose} centered animation={false} >
                    <Modal.Header closeButton>
                        <Modal.Title>Guardar Aforo con codigo de suscripción: {codigoSub}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Desea guardar la información?
                        {!this.state.effectivePermissions?.CREATE ? <p>No tiene permisos para Guardar...</p> : null}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleModalClose} >
                            No
                    </Button>
                        <Button disabled={!this.state.effectivePermissions?.CREATE} variant="primary" onClick={this.handleModalSave} >
                            Si
                    </Button>
                    </Modal.Footer>
                </Modal>

            </div >
        )
    }
}



const mapToStateToprops = state => {
    return {
        selects: state.selects,
    }
}
const mapToDispatchToProps = dispatch => {

    return {
        actions: bindActionCreators({ loadTiposAforo, loadFrecuenciaRecoleccion, loadBarrio, loadConceptoAforo, loadTecnicoAforador, loadEstado, loadTipoUso, loadMacrorutasRecoleccion }, dispatch)
    }
}

export default connect(mapToStateToprops, mapToDispatchToProps)(Nuevo)