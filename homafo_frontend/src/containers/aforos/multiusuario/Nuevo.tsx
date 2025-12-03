import React, { Component } from "react";
import { Form, Col, Button, ButtonToolbar, Alert, Modal, ListGroup , InputGroup , Spinner, Card } from "react-bootstrap";
import { connect } from "react-redux";
import { Modal as ModalANT } from 'antd'
import { bindActionCreators } from "redux";
import {
  loadTiposAforoMulti,
  loadEstado,
  loadTecnicoAforador
} from "../../../actions/aforos/selectsAforosMulti";
import {
  loadFrecuenciaRecoleccion, loadConceptoAforo
} from "../../../actions/aforos/selects";
import * as Dates from "../../../utils/Dates";
import RelacionSuscripciones from './RelacionSuscripciones'
import basicoDefault from '../../../api/homologaciones/BasicoDefault';
import ParparametrosAforoApi from "../../../api/aforos/ParParametrosAforoApi";
import homoApi from '../../../api/homologaciones/Homologacion';
import * as API from '../../../api/aforos/aforosMulti';
import * as APIA from "../../../api/aforos/aforos";
import { toast } from 'react-toastify';
import { Redirect } from "react-router-dom";
import tafoApi from '../../../api/homologaciones/TipoAforoApi';
import utilsVarios from '../../../utils/UtilsVarios';
import { Typeahead } from 'react-bootstrap-typeahead';

///validar permisos
import PARAMETROS from '../../../data/constantes';
import SesionApi from '../../../api/common/SesionApi';
import UtilsFunction from '../../../components/utils/UtilsFunction';

const PORCENTAJE_100:number=100.000;
const sesionApi = new SesionApi();

type changeEventElement = React.ChangeEvent<HTMLInputElement>;
type formEvent = React.FormEvent<HTMLFormElement>;

type NuevoState = {
  id_aforo: number;
  uni_tipoaforo: number;
  afo_fecha: string; //fecha de registro
  afo_fechaInicio: string; //fecha inicio
  afo_fechafinvegencia: string; //fecha de vencimiento
  afo_numpqr: string; //radicado pqr
  afo_estado: string; //estado
  mafv_factor: string; //factor
  ter_aforador: string; //id tecnico aforador
  afo_observaciones: string; //observaciones de aforo
  afom_distribucion: string; // tipo de distribucion
  afom_distribucionNombre: string; // tipo de distribucion
  barrio_ideregistro: number; // codigo del barrio 
  nombreBarrio: string;
  afo_ideafopadre: any;//id aforo padre cuando uni_tipoaforo es 3182 = EXTRAORDINARIO
  conceptoAforo: string;

  showModal: boolean; //para mostrar la ventana de guardar

  suscripcionesList: ItemSuscriptor[];

  parametros: [];
  estados: [];
  tiposDistribucion: [];
  rure_idregistro: any;
  afo_frecuenciaRecoleccion: string;
  listaMacrorutas: any;
  afo_cantidadfrecuenciarecoleccion: number; //cantidad de frecuencia de recolección, calculada a partir de afo_frecuenciaRecoleccion

  showAlert: boolean;
  messageAlert: string;
  variantAlert: [string];

  novedad: novedad;//para identificar si se esta creando o actualizando, depende de this.props.location.state.idAforo
  
  isExtraordinario: boolean;

  redirect: any;
  effectivePermissions:any,
  permissions: [],
  tafoListaTmp:[],
  afom_direccion:string,
  afom_descripcion:string,
  plazoTifoAforo:Number,
  distribucionUniforme:boolean,
  estadoBusquedaPadre:boolean,
  claseAforo:Number,
  barrioSelector:string,
  barriosListado:[],
  complementoListado:[],
  complementoSelector:string
  isLoading:boolean,

  tfdIderegistro: number,
  tfvIderegistro: number,
  tfdDescripcion: string,
  diasSemanaSelecionado: string | null,
  cantidad: number,
  frecuencia: number
};


type dafo_detaforo = {
  afoNumpqr: string,
  dsusIderegistr: string,
  dafoMultiusuporcentaje: number,
  uniActsuscripc: number,
  iasusNombreestablecimiento: string,
  iasusReferenciacomercial: string
}

/*//pendiente aclarar los datos  de esta tabla
type afom_afomultiusuario={
  afom_distribucion: string,
}
*/

type SendData = {
  //los nombres de las variables deben coincidir con el dto afo_ideafopadre
  afoIderegistro: number;
  uniTipoaforo: number,
  afoFecha: string,
  afoFechaInicio: string;
  afoFechafinvegencia: string;
  afoNumpqr: string;
  uniClaseSuscripcionaforo: Number,
  afoFrecuenciaRecoleccion: string,
  afoEstado: string,
  terAforador: string,
  //uni_tipogenerador:string,
  mafvFactor: string;
  //usu_idregistro:string
  afoObservaciones: string;
  //afo_cantidadfrecuenciarecoleccion:number;
  //tfd_idregistro: string;
  barrioIderegistro: number;
  complementoIdregistro: number;
  //uni_complemento: string;
  //afo_idpadre:number;
  //afo_fechaactualizacion:string;
  rureIdregistro: number;

  /*idSuscripcion:number,   
  idUsuario:number,   
  conceptoAforo:string,    
  nombreEstablecimiento:string,
  referenciaComercial:string,
  jornada:string,
  */
  dafoDetAforo: dafo_detaforo[],
  afoCantidadfrecuenciarecoleccion: number,
  afomDistribucion: string,
  afomDistribucionNombre: string,
  afoIdeafopadre: Number,
  conceptoAforo: string,
  afomDireccion:string,
  afomDescripcion:string,
  distribucionUniforme:boolean,
  
  tfdIderegistro: number,
  tfvIderegistro: number,
  tfdDescripcion: string,
  diasSemanaSelecionado: string | null,
  cantidad: number,
  frecuencia: number
}


class ItemSuscriptor {
  id: string;
  codigo: string;
  nombre: string;
  direccion: string;
  porcentaje: number;
  numpqr: string;
  barrio_ideregistro: number;//codigo del barrio
  nombreBarrio: string; //nombre del barrio
  uni_actsuscripc: number;
  iasus_nombreestablecimiento: string;
  iasus_referenciacomercial: string;
  cmpDireccion: string;
  estrato: string;
  empresaSus:string;
  tipoUsoSus:string;
  estadoSus:string;

  constructor(
    id: string,
    codigo: string,
    nombre: string,
    direccion: string,
    porcentaje: number,
    numpqr: string,
    barrio_ideregistro: number,
    nombreBarrio: string,
    uni_actsuscripc: number,
    iasus_nombreestablecimiento: string,
    iasus_referenciacomercial: string,
    cmpDireccion: string,
    estrato: string,
    empresaSus:string,
    tipoUsoSus:string,
    estadoSus:string    
  ) {
    this.id = id;
    this.codigo = codigo;
    this.nombre = nombre;
    this.porcentaje = porcentaje;
    this.numpqr = numpqr;
    this.direccion = direccion;
    this.barrio_ideregistro = barrio_ideregistro;
    this.nombreBarrio = nombreBarrio;
    this.uni_actsuscripc = uni_actsuscripc;
    this.iasus_nombreestablecimiento = iasus_nombreestablecimiento;
    this.iasus_referenciacomercial = iasus_referenciacomercial;
    this.cmpDireccion = cmpDireccion;
    this.estrato = estrato;
    this.empresaSus = empresaSus;
    this.tipoUsoSus = tipoUsoSus;
    this.estadoSus  = estadoSus;
  }
}

enum novedad {
  nuevo,
  actualizacion,
}

class Nuevo extends Component<
  { withOptions?: boolean; selectsMulti: any; selects: any; actions: any, location?: any },
  NuevoState
  > {
  constructor(props) {
    super(props);
    this.state = {
      //al agregar variables, actualizar initializeState
      id_aforo: 0,
      uni_tipoaforo: 0,
      afo_fecha: Dates.currentDate(),
      afo_fechaInicio: "",
      afo_fechafinvegencia: "",
      afo_numpqr: "",
      afo_estado: "",
      mafv_factor: "",
      ter_aforador: "",
      afo_observaciones: "",
      afom_distribucion: "",
      afom_distribucionNombre: "",
      showModal: false,
      suscripcionesList: [],
      afo_cantidadfrecuenciarecoleccion: 0,
      barrio_ideregistro: 0,
      nombreBarrio: "",
      afo_ideafopadre: null,
      conceptoAforo: "",

      //JLMENDOZA
      barrioSelector:"",
      complementoSelector:"",
      barriosListado:[],
      complementoListado:[],
      isLoading:false,

      estados: [],
      tiposDistribucion: [],
      parametros: [],
      rure_idregistro: null,
      afo_frecuenciaRecoleccion: "",
      listaMacrorutas: [],

      showAlert: false,
      messageAlert: "",
      variantAlert: ["light"],
      novedad: novedad.nuevo,

      isExtraordinario: false,
      redirect: null,
      effectivePermissions:{EDIT:false,VIEW:false,CREATE:false,SAVE:false,DELETE:false,QUERY:false},
      permissions: [],
      tafoListaTmp:[],
      afom_direccion:'',
      afom_descripcion:'',
      plazoTifoAforo:0,
      distribucionUniforme:false,
      estadoBusquedaPadre:false,
      claseAforo:0,
      tfdIderegistro: 0,
      tfvIderegistro: 0,
      tfdDescripcion: "",
      diasSemanaSelecionado: null,
      cantidad: 0,
      frecuencia: 0,
    };
  }


  initializeState = (): void => {
    console.log("limpiando State.....");
    this.setState({
      id_aforo: 0,
      uni_tipoaforo: 0,
      afo_fecha: Dates.currentDate(),
      afo_fechaInicio: "",
      afo_fechafinvegencia: "",
      afo_numpqr: "",
      afo_estado: "",
      mafv_factor: "",
      ter_aforador: "",
      afo_observaciones: "",
      afom_distribucion: "",
      afom_distribucionNombre: "",
      showModal: false,
      suscripcionesList: [],
      afo_cantidadfrecuenciarecoleccion: 0,
      barrio_ideregistro: 0,
      nombreBarrio: "",
      afo_ideafopadre: null,


      rure_idregistro: null,
      afo_frecuenciaRecoleccion: "",


      showAlert: false,
      messageAlert: "",
      variantAlert: ["light"],
      novedad: novedad.nuevo,
      
      isExtraordinario: false,
      barrioSelector:"",
      complementoSelector:"",


    });
  }

  componentDidMount = async () => {
    this.props.actions.loadTiposAforoMulti();
    this.props.actions.loadEstado();
    this.props.actions.loadTecnicoAforador();
    this.props.actions.loadConceptoAforo();//nuevo

    let paraApiAforo: ParparametrosAforoApi = new ParparametrosAforoApi();
    let tmp = await paraApiAforo.listaParametros();
    await this.setState({
      parametros: tmp.data
    })

    let basico: basicoDefault = new basicoDefault();
    await this.setState({
      estados: await JSON.parse(basico.buscarParametro('estados', this.state.parametros))
    })

    await this.setState({
      tiposDistribucion: await JSON.parse(basico.buscarParametro('tipos_distribucion', this.state.parametros))
    })

    this.cargarClaseAforo();

    this.cargarMacrorutasRecoleccion();
    this.cargarBarriosProyecto();
    await sesionApi.loadPermisos(PARAMETROS.AFORO_MULTIUSUARIO.PROGRAMA_ID).then(response => {
      this.setState({ permissions: response.data });
    })
    await this.cargarPermisos();

    if (this.props.location.state) {
      console.log("idAforo: ", this.props.location.state.idAforo);
      this.setState({
        novedad: novedad.actualizacion,
        id_aforo: this.props.location.state.idAforo,
      })

      API.GetMultiAforoById(this.props.location.state.idAforo)
        .then(response => {

          console.log("respuesta: ", response);

          if (response.success === true) {

            let lista = response.data.dafoDetAforo.map(i => {
              console.log("id suscrip: ", i.dsus_ideregistr);
              let itemNew: ItemSuscriptor = new ItemSuscriptor(
                i.dsusIderegistr,
                i.codigo,
                i.nombre,
                i.direccion,
                i.dafoMultiusuporcentaje,
                i.afoNumpqr,
                i.codigoBarrio,
                i.nombreBarrio,
                i.uniActsuscripc,
                i.iasusNombreestablecimiento,
                i.iasusReferenciacomercial,
                i.cmpDireccion,
                i.estrato,
                i.empresaSus,
                i.tipoUsoSus,
                i.estadoSus
              )
              return itemNew;
            });
            this.alertInformation(['success'], "multiAforo cargado")

            this.setState({
              showAlert: true,
              variantAlert: ['success'],
              messageAlert: "multiAforo Cargado",

              uni_tipoaforo: response.data.uniTipoaforo,
              afo_fecha: response.data.afoFecha,
              afo_fechaInicio: response.data.afoFechaInicio,
              afo_fechafinvegencia: response.data.afoFechafinvegencia,
              afo_numpqr: response.data.afoNumpqr,
              afo_estado: response.data.afoEstado,
              mafv_factor: response.data.mafvFactor,
              ter_aforador: response.data.ter_aforador,
              afo_observaciones: response.data.afoObservaciones,
              afom_distribucion: response.data.afomDistribucion,
              afom_distribucionNombre: response.data.afomDistribucionNombre,
              rure_idregistro: response.data.rureIdregistro,
              suscripcionesList: lista,
              barrio_ideregistro: lista.length > 0 ? lista[0].barrio_ideregistro : 0,
              afo_ideafopadre: response.data.afoIdeafopadre,
              
            });


            let filtroTipo = this.props.selectsMulti.tiposAforoMulti.filter(item => item.id == (response.data.uniTipoaforo));

            console.log(response.data.uniTipoaforo);
            console.log(filtroTipo.length);
            if (filtroTipo.length > 0) {
              console.log(filtroTipo[0].object.toUpperCase());
              if (filtroTipo[0].object.toUpperCase().indexOf('EXTRAORDINARIO') >= 0) {
                this.setState({ isExtraordinario: true });
              } else {
                this.setState({ isExtraordinario: false });
                this.setState({ afo_ideafopadre: null });
              }
            }


            toast("multiAforo Cargado");
          } else {
            this.alertInformation(['warning'], response.data.message)
          }
        })
        .catch(error => {
          if (!error) {
            this.alertInformation(['warning'], "Ops!,Error de Conexión.No se ha podido buscar el aforo " + this.props.location.state.idAforo)
            return Promise.reject(error);
          }
          this.alertInformation(['danger'], "Ops!,Error Conexión  ")
          return Promise.reject(error.status);
        });
    }
    ///cargar tafo///////////
    let tafoTmp: tafoApi = new tafoApi();
    let tafoTmp1= await tafoTmp.listaTafoGeneral();
    await this.setState({
      tafoListaTmp:tafoTmp1.data.content
    })  

  }

  cargarClaseAforo=async()=>
    {
        let basico: basicoDefault = new basicoDefault();
        let tmp=await basico.buscarParametro('uni_clase_suscripcion_multiusuario', this.state.parametros);
        await this.setState({
            claseAforo:parseInt(tmp)
        })
    }

  cargarPermisos=async()=>
    {
      let effectivePermission = UtilsFunction.getEffectivePermissions(this.state.permissions,'AFORO_MULTIUSUARIO');    
      await this.setState({effectivePermissions:effectivePermission});
    }

  cargarMacrorutasRecoleccion = async () => {
    try {
      let api: homoApi = new homoApi();
      let tmp = await api.macrorutasRecoleccion();
      this.setState({
        listaMacrorutas: tmp.data
      })
      this.calcularFrecuenciaYCantidadRecoleccion(parseInt(this.state.rure_idregistro));
    } catch (e) {
      console.log('error: ' + e);
    }
  }

  cargarBarriosProyecto = async () => {
    try {
      let api: homoApi = new homoApi();
      let tmp = await api.listaBarriosNativo('01');
      this.setState({
        barriosListado: tmp.data
      })
    } catch (e) {
      console.log('error Barrios: ' + e);
    }
  }


  onSubmit = (event: formEvent) => {
    event.preventDefault();
    console.log("full stateeee:", this.state);
    if (this.validarForm()) {
      this.setState({ showModal: true })
    }
  }

  validarForm = () => {
    let total: number = this.state.suscripcionesList
      .reduce((total, item) => total + Number(item.porcentaje), 0);
    const factor = Math.pow(10, 2);
    total = Math.trunc(total * factor) / factor;

    if (total !== Number(PORCENTAJE_100)) {      
      toast.error("el porcentaje debe ser 100")
      this.alertInformation(['danger'], "el porcentaje debe ser 100");
      return false;
    }else {
      return true;
    }   
    
  }

  handleModalClose = (): void => {
    this.setState({ showModal: false });
  }
//JLMENDOZA
  handleClick = () : void => {
    this.buscarSuscriptorApi();
    console.log(this.state.complementoSelector + "- "+ this.state.barrioSelector)
  }
  buscarSuscriptorApi = async () => {
    const dataFlush = {
      complemento: this.state.complementoSelector,
      barrio: this.state.barrioSelector
    };
    if (!this.state.afom_distribucion) {
      toast.warning("debe seleccionar el tipo de distribución");
      return;
    }
    if(this.state.complementoSelector==""|| this.state.complementoSelector == undefined){
      toast.warning("debe seleccionar un Complemento");
      return;
    }
    this.setState({isLoading:true})

    await APIA.GetListNuevo(dataFlush).then((response)=>{
      console.log(response)
      const participacion:number= PORCENTAJE_100 / response.data.length;

      let lista = response.data.map(i => {
        let itemNew: ItemSuscriptor = new ItemSuscriptor(
          i.idSuscripcion,
          i.codSuscripcion,
          i.nombresYapellidos,
          i.direccion,
          this.state.afom_distribucion == '2' ? participacion : 0.0,
          i.numPqr == "null" ? "" : i.numPqr ,
          i.barrioUsuarioCodigo,
          i.barrioUsuario,
          i.uniActSuscripc,
          i.nombreEstablecimiento,
          i.referenciaComercial,
          i.cmpDireccion,
          i.estrato,
          i.nombreConvenio,
          i.tipoUso,
          i.estado
        )
        return itemNew;
      });

      this.setState({
        suscripcionesList: lista,
        rure_idregistro: this.state.rure_idregistro,
        isLoading:false

      })

    }).catch((error) => {console.log(error)})
  
  }
// **************************************************

  handleModalSave = (): void => {
    console.log("salvando....")

    let basico: basicoDefault = new basicoDefault();

    if (this.state.suscripcionesList.length > 0) {
      const data: SendData = {
        afoIderegistro: this.state.id_aforo,
        uniTipoaforo: this.state.uni_tipoaforo, //number
        afoFecha: this.state.afo_fecha,
        afoFechaInicio: this.state.afo_fechaInicio,
        afoFechafinvegencia: this.state.afo_fechafinvegencia,
        afoNumpqr: this.state.afo_numpqr,
        uniClaseSuscripcionaforo: JSON.parse(basico.buscarParametro('uni_clase_suscripcion_multiusuario', this.state.parametros)),
        afoFrecuenciaRecoleccion: this.state.afo_frecuenciaRecoleccion,
        afoEstado: this.state.afo_estado,
        terAforador: this.state.ter_aforador,
        mafvFactor: this.state.mafv_factor,
        afoObservaciones: this.state.afo_observaciones,
        barrioIderegistro:parseInt(this.state.barrioSelector),
        complementoIdregistro:parseInt(this.state.complementoSelector),
        rureIdregistro: this.state.rure_idregistro,
        dafoDetAforo: this.state.suscripcionesList.map(
          x => {
            let y: dafo_detaforo = {
              dsusIderegistr: x.id,
              dafoMultiusuporcentaje: x.porcentaje,
              afoNumpqr: x.numpqr,
              uniActsuscripc: x.uni_actsuscripc,
              iasusNombreestablecimiento: x.iasus_nombreestablecimiento,
              iasusReferenciacomercial: x.iasus_referenciacomercial
            }
            return y;
          }
        ),
        afoCantidadfrecuenciarecoleccion: this.state.afo_cantidadfrecuenciarecoleccion,
        afomDistribucion: this.state.afom_distribucion,
        afomDistribucionNombre: this.state.afom_distribucionNombre,
        afoIdeafopadre: this.state.afo_ideafopadre,
        conceptoAforo: this.state.conceptoAforo,
        afomDireccion:this.state.afom_direccion,
        afomDescripcion:this.state.afom_descripcion,
        distribucionUniforme:this.state.distribucionUniforme,
        tfdIderegistro: this.state.tfdIderegistro,
        tfvIderegistro: this.state.tfvIderegistro,
        tfdDescripcion: this.state.tfdDescripcion,
        diasSemanaSelecionado: this.state.diasSemanaSelecionado,
        cantidad: this.state.cantidad,
        frecuencia: this.state.frecuencia
      }

      if (this.state.novedad == novedad.nuevo) {

        console.log("datos a guardar:", data);

        API.CreateAforoMulti(data)
          .then(response => {
            console.log(response.data.susccess);
            console.log(response.data);
            console.log(response);


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
                messageAlert: response.data.message
              });
              toast("Se ha grabado con Exito");
              setTimeout(() => { this.setState({ redirect: "/aforos/multiusuario" }) }, 2500);
              this.initializeState();
            } else {
              this.alertInformation(['warning'], response.data.message)
              toast(response.data.message);
            }

          })
          .catch(error => {
            if (!error) { // network error
              this.alertInformation(['warning'], "Ops!,Error de Conexión.No se ha podido guardar ")
              return Promise.reject(error);
            } //end if
            // server error
            this.alertInformation(['danger'], "Ops!,Error Conexión  ")
            return Promise.reject(error.status);
          });

        this.setState({ showModal: false });

      } else if (this.state.novedad == novedad.actualizacion) {

        API.UpdateAforosMulti(data)
          .then(response => {
            if (response.data.success === true) {
              this.setState({
                showAlert: true,
                variantAlert: ['success'],
                messageAlert: response.data.message
              });
              toast("Se ha grabado con Exito");
              this.initializeState();
            } else {
              this.alertInformation(['warning'], response.data.message)
            }

          })
          .catch(error => {
            if (!error) { // network error
              this.alertInformation(['warning'], "Ops!,Error de Conexión.No se ha podido guardar ")
              return Promise.reject(error);
            } //end if
            // server error
            this.alertInformation(['danger'], "Ops!,Error Conexión  ")
            return Promise.reject(error.status);
          });
        this.setState({ showModal: false });

      }

    }
  }

  handleKeyPress = (e) => {
    if (e.target.name === "afo_ideafopadre") {
      if (e.charCode === 13) {
        this.loadPadre()
      }
    }



  }


  inforExtraordinario = (): any => {
    if (this.state.isExtraordinario == true) {
      return (
        <Form.Row>
              <Form.Group md="6" as={Col} controlId="factorFormGrid">
                    <Form.Label >Aforo Ordinario Padre</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control  name="afo_ideafopadre" value={this.state.afo_ideafopadre} onChange={this.handleChange}
                          onKeyPress={this.handleKeyPress}
                          type="number" placeholder="" />
                              <InputGroup.Append>
                                              <Button
                                              variant="primary"
                                              className="mr-5"
                                              type="button"
                                              onClick={this.loadPadre}>
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

  handleChange = async(event: changeEventElement) => {
    if(event[0]!==undefined){
      const e=event[0]
      const municipio=30

      console.log(e)

      if(e.hasOwnProperty('barrio_ideregistro')){
        let apiHomo:homoApi =new homoApi();
        const complemento= await apiHomo.complementoPropiedad(municipio,e.barrio_ideregistro);
        this.setState({
            complementoListado:complemento.data,
            barrioSelector:e.barrio_ideregistro
        })
      }

      if(e.hasOwnProperty('mbcd_ideregistr')){
        this.setState({
          complementoSelector:e.mbcd_ideregistr
      })
      }

    }else{
    const {value, name}=event.target;
    if (event.target.name === "uni_tipoaforo" || "afo_numpqr" || "afo_estado" || "mafv_factor" || "conceptoAforo" || "afom_direccion" || "afom_descripcion") {
      this.setState({ [name]: value } as any)
    }

    if (name === "uni_tipoaforo") {
      this.props.actions.loadConceptoAforo(value);
      //let filtroTipo = this.props.selectsMulti.tiposAforoMulti.filter(item => item.id == (event.target.value));
      let filtroTipo:any=this.state.tafoListaTmp.filter(item => item['tafoIderegistro'] == (value) );

      if (filtroTipo.length > 0) {
        //if (filtroTipo[0].object.toUpperCase().indexOf('EXTRAORDINARIO') >= 0)
          this.setState({
            plazoTifoAforo:filtroTipo[0].tafoPlazoMaximo,
            afo_fechaInicio: '' ,
            afo_fechafinvegencia:'',
            mafv_factor:filtroTipo[0].tafoFactorProduccion
          })
        if (filtroTipo[0].tafoAforoPadre)
        {
          this.setState({ isExtraordinario: true });
        } else {
          this.setState({ isExtraordinario: false });
          this.setState({ afo_ideafopadre: null });
        }
      }
    }

    if (name === "afo_fechaInicio")
    {
      ///cargar tafo///////////
      //let tafoTmp: tafoApi = new tafoApi();
      //let tafoTmp1= await tafoTmp.fechaFinalAforo(this.state.uni_tipoaforo,this.state.rure_idregistro,value);
      //let tmp=tafoTmp1.data[0];
      ///sumar dias de tafo
      let util:utilsVarios=new utilsVarios();
      let fecha1=util.convertStringToDate(value);
      let fecha2=util.sumarDias(fecha1,this.state.plazoTifoAforo);
      let fechafinal=util.convertDateToString(fecha2);
      await this.setState({
        afo_fechaInicio: value ,
        afo_fechafinvegencia:fechafinal//tmp.fechaFinal
       });
    }  
      /*
      if ((this.state.afo_fechafinvegencia === "") || (value <= this.state.afo_fechafinvegencia))
      {
        await this.setState({
           afo_fechaInicio: value ,
           afo_fechafinvegencia:fechafinal//tmp.fechaFinal
          });
      } else {
        alert('error, "Vigencia Desde" debe ser menor o igual que Vigencia Hasta ');
      }

    }
    */
    
    if (name === "afo_fechafinvegencia") {

      if (value >= this.state.afo_fechaInicio) {
        this.setState({ afo_fechafinvegencia: value });
      } else {
        alert('Error!, Vigencia Hasta debe ser mayor o igual a la Vigencia Desde');
      }

    }
    
    if (name === "afom_distribucion") {
      let tmpEstado:any=this.state.tiposDistribucion.filter(item => item['valor']===value)[0];
      this.setState({
        afom_distribucion: value,
        distribucionUniforme:tmpEstado.estado,
        afom_distribucionNombre:tmpEstado.nombre
      })
    };

    if (name === "rure_idregistro") {
      this.setState({
        rure_idregistro: value
      })

      this.calcularFrecuenciaYCantidadRecoleccion(parseInt(value));
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
}
  }


  loadPadre = () => {
    this.setState({
      estadoBusquedaPadre:true,
    })
    API.GetMultiAforoByIdPadre(this.state.afo_ideafopadre)
      .then(response => {

        if ((response.success === true) && (response.data != null)) {

          let lista = response.data.dafoDetAforo.map(i => {
            let itemNew: ItemSuscriptor = new ItemSuscriptor(
              i.dsusIderegistr,
              i.codigo,
              i.nombre,
              i.direccion,
              i.dafoMultiusuporcentaje,
              i.afoNumpqr,
              i.codigoBarrio,
              i.nombreBarrio,
              i.uni_actsuscripc,
              i.iasusNombreestablecimiento,
              i.iasusReferenciacomercial,
              i.cmpDireccion,
              i.estrato,
              i.empresaSus,
              i.tipoUsoSus,
              i.estadoSus
            )
            return itemNew;
          });



          this.setState({
            suscripcionesList: lista,
            afom_distribucion: response.data.afom_distribucion,
            rure_idregistro: response.data.rure_idregistro,
            estadoBusquedaPadre:false,
            
          })


          this.calcularFrecuenciaYCantidadRecoleccion(parseInt(response.data.rure_idregistro));
        } else {
          this.setState({
            suscripcionesList: [],
            afom_distribucion: "",
            rure_idregistro: null,
            estadoBusquedaPadre:false,
          })
        }

      }).catch(error => { return Promise.reject(error); });
  }


  calcularFrecuenciaYCantidadRecoleccion = (rure) => {
    let horarioTmp = '';
    let filtro = this.state.listaMacrorutas.filter(item => item.rure_ideregistro === parseInt(rure));



    if (filtro.length > 0) {
      let tmp = filtro[0];

      for (let uno in tmp.horario) {
        horarioTmp = horarioTmp + tmp.horario[uno] + ",";
      }

      this.setState({
        afo_frecuenciaRecoleccion: horarioTmp,
        afo_cantidadfrecuenciarecoleccion: horarioTmp.split(',').length - 1
      })

    }
  }



  onUpdateRelacionSus = (susList: ItemSuscriptor[]) => {
    let newList = susList;

    //if (this.state.afom_distribucion == "2") {
      if (this.state.distribucionUniforme === false) {
      newList = susList.map((item) => {
        let porcentaje = 100 / susList.length;
        let updateItem: ItemSuscriptor = new ItemSuscriptor(
          item.id,
          item.codigo,
          item.nombre,
          item.direccion,
          porcentaje,
          item.numpqr,
          item.barrio_ideregistro,
          item.nombreBarrio,
          item.uni_actsuscripc,
          item.iasus_nombreestablecimiento,
          item.iasus_referenciacomercial,
          item.cmpDireccion,
          item.estrato,
          item.empresaSus,
          item.tipoUsoSus,
          item.estadoSus
        );
        return updateItem;
      })
    }

    this.setState({
      suscripcionesList: newList,
      barrio_ideregistro: newList.length > 0 ? susList[0].barrio_ideregistro : 0,
      
    })


  }


  alertInformation = (variant: [string], message: string) => {
    this.setState({
      showAlert: true,
      variantAlert: variant,
      messageAlert: message
    }, () => { window.setTimeout(() => { this.setState({ showAlert: false, variantAlert: ['light'], messageAlert: "" }) }, 5000) });
    }
  renderDiasRecoleccion = () => {
    if (!this.state.uni_tipoaforo || !this.state.diasSemanaSelecionado || !this.props.selects.tiposAforo) {
      return null;
    }

    const diasRecoleccion = this.props.selects.tiposAforo.filter(
      item => `${item.id}|${item.frecuencia}|${item.tfdDescripcion}` === this.state.diasSemanaSelecionado
    );

    if (diasRecoleccion.length === 0) {
      return null;
    }

    const tipoSeleccionado = diasRecoleccion[0];
    
    try {
      const diasObj = JSON.parse(tipoSeleccionado.diasSemana);
      
      return (
        <Col md={4}>
          <Card>
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


  render(): JSX.Element {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const disabledLoad = this.state.isLoading || this.state.complementoListado.length === 0 || !this.state.complementoSelector;

    return (
      <div>
        <br/>
        <Alert variant='info'>Información del Aforo</Alert>
        <br/>
        <Form className="mb-2" id="nuevoMultiForm" onSubmit={this.onSubmit}>
          <Form.Row>
            <Form.Group as={Col} controlId="afo_fecha" md="3">
              <Form.Label>Fecha de registro</Form.Label>
              <Form.Control
                placeholder="Fecha de registro"
                type="date"
                name="afo_fecha"
                value={this.state.afo_fecha}
                onChange={this.handleChange}
                disabled
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group md="3" as={Col} controlId="formGridState"  form="nuevoMultiForm">
              <Form.Label>Tipo Aforo</Form.Label>
              <Form.Control
                as="select"
                name="uni_tipoaforo"
                value={this.state.uni_tipoaforo}
                onChange={this.handleChange}
              >
                <option> </option>
                {
                  this.state.tafoListaTmp.map((t: any, i: number) => {
                    //if(t.uniClaseaforo===this.state.claseAforo)
                    if(true)
                    {
                        return <option key={i} value={t.unidad.uniIderegistro}> {t.unidad.uniCodigo} - {t.unidad.uniNombre1}</option>                                                  
                    }
                    else
                    {
                        return null;
                    }
                  })}
              </Form.Control>
            </Form.Group>
            {/*
            <Form.Group as={Col} >
              <Form.Label>Ruta de Recoleccion</Form.Label>
              <Form.Control as="select" name="rure_idregistro" value={this.state.rure_idregistro}
                onChange={this.handleChange}
                required
                disabled={this.state.isExtraordinario}>
                <option> </option>
                {this.state.listaMacrorutas.map((e: any, key: number) => {
                  return <option key={key} value={e.rure_ideregistro}>{e.rut_nombre}</option>;
                })}
              </Form.Control>
            </Form.Group>
             */}
            <Form.Group as={Col} controlId="afo_fechaInicio">
              <Form.Label>Vigencia Desde</Form.Label>
              <Form.Control
                placeholder="Vigencia Desde"
                type="date"
                name="afo_fechaInicio"
                value={this.state.afo_fechaInicio}
                onChange={this.handleChange}
                required
                disabled={this.state.uni_tipoaforo>0 ? false : true}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="afo_fechafinvegencia">
              <Form.Label>Vigencia Hasta</Form.Label>
              <Form.Control
                placeholder="Vigencia Hasta"
                type="date"
                name="afo_fechafinvegencia"
                value={this.state.afo_fechafinvegencia}
                onChange={this.handleChange}
                required
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
          <Form.Group as={Col} controlId="afo_numpqr">
              <Form.Label>Radicado PQRS</Form.Label>
              <Form.Control
                type="text"
                name="afo_numpqr"
                value={this.state.afo_numpqr}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="afo_estado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                name="afo_estado"
                value={this.state.afo_estado}
                onChange={this.handleChange}
                required
              >
                <option> </option>
                {
                  this.state.estados.map((t: any, i: number) => {
                    return (
                      <option key={i} value={t.nombre}>
                        {" "}
                        {t.nombre}
                      </option>
                    );
                  })
                }
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} controlId="mafv_factor">
              <Form.Label>Factor</Form.Label>
              <Form.Control
                name="mafv_factor"
                value={this.state.mafv_factor}
                onChange={this.handleChange}
                type="text"
                placeholder="0.000"
                disabled={true}
                required
              />
            </Form.Group>

            
          </Form.Row>
          <Form.Row>

          </Form.Row>
          {this.inforExtraordinario()}

          <Form.Row>
            <Form.Group md="3" as={Col} controlId="formGridState" form="nuevoMultiForm" style={{ marginTop: "5px" }}>
              {this.state.variantAlert.map((t: any, i: number) => {
                return <Alert
                  key={i}
                  variant={t}
                  transition={true}
                  onClose={() => this.setState({ showAlert: false })}
                  show={this.state.showAlert}
                >{this.state.messageAlert}.
                            </Alert>
              })
              }
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group  as={Col} controlId="formGridStatedsitribuc">
              <Form.Label>Tipo Distribución</Form.Label>
              <Form.Control
                as="select"
                name="afom_distribucion"
                value={this.state.afom_distribucion}
                onChange={this.handleChange}
                disabled={this.state.isExtraordinario}
                required
              >
                <option> </option>
                {this.state.tiposDistribucion.map((t: any, i: number) => {
                  return (
                    <option key={i} value={t.valor}>
                      {" "}
                      {t.nombre}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} controlId="conceptoFormGrid">
              <Form.Label >Concepto del Aforo</Form.Label>
              <Form.Control as="select" name="conceptoAforo" value={this.state.conceptoAforo} onChange={this.handleChange} required>
                <option value="" > </option>
                {
                  this.props.selects.conceptoAforo.map((t: any, i: number) => {
                    
                    return <option key={i} value={t.id}> {t.object}</option>
                  })
                }
              </Form.Control>
            </Form.Group>
            <Form.Group md="6" as={Col} controlId="ter_aforador">
              <Form.Label>Técnico Aforador</Form.Label>
              <Form.Control
                as="select"
                name="ter_aforador"
                value={this.state.ter_aforador}
                onChange={this.handleChange}
                required
              >
                <option> </option>
                {this.props.selectsMulti.tecnicoAforador.map((t: any, i: number) => {
                  return (
                    <option key={i} value={t.id}>
                      {" "}
                      {t.object}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="afom_barrio">
              <Form.Label>Barrio</Form.Label>
              <Typeahead 
                clearButton
                id="basic-typeahead-single"
                placeholder="Elegir barrio..."
                labelKey="barrio_nom"
                options={this.state.barriosListado}
                onChange={this.handleChange}
                requerid
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Complemento</Form.Label>
              <Typeahead 
                clearButton
                id="basic-typeahead-single"
                labelKey="uni_nombre1"
                placeholder="Elegir Complemento"
                options={this.state.complementoListado}
                onChange={this.handleChange}
                requerid              
              />
            </Form.Group>
          </Form.Row>

          {this.state.barrioSelector && this.state.complementoListado.length === 0 && (
            <Alert variant="warning">No hay complementos disponibles para este barrio. No es posible cargar suscripciones.</Alert>
          )}

          <div className="d-grid gap-2">
            <Button variant="outline-primary" disabled={disabledLoad}
              onClick={!disabledLoad ? this.handleClick : undefined}>
              Cargar Suscripciones
            </Button>
          </div>
          <Form.Row>
                    <Form.Group as={Col} controlId="afom_direccion">
                            <Form.Label>Direccion</Form.Label>
                            <Form.Control
                              type="text"
                              name="afom_direccion"
                              value={this.state.afom_direccion}
                              onChange={this.handleChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="afom_descripcion">
                            <Form.Label>Descripcion</Form.Label>
                            <Form.Control
                              type="text"
                              name="afom_descripcion"
                              value={this.state.afom_descripcion}
                              onChange={this.handleChange}
                            />
                        </Form.Group>
          </Form.Row>
      
          {!!this.state.uni_tipoaforo && (
            <Form.Row>
              <Form.Group as={Col} controlId="diasSemana" md="4">
                <Form.Label>Frecuencia:</Form.Label>
                <Form.Control
                  as="select"
                  name="diasSemanaSelecionado"
                  value={this.state.diasSemanaSelecionado || ""}
                  onChange={this.handleChange}
                >
                  <option value="">Seleccione</option>
          {this.props.selects.tiposAforo
            ?.filter(item => item.id == this.state.uni_tipoaforo && item.diasSemana)
                    .map((item, index) => (
                      <option key={index} value={`${item.id}|${item.frecuencia}|${item.tfdDescripcion}`}>
                        {item.frecuencia} - {item.tfdDescripcion}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
    </Form.Row>
  )}
                                  <Form.Row className="mt-3 mb-3">
                                  {this.renderDiasRecoleccion()}
          </Form.Row>

          <RelacionSuscripciones
            suscripcionesList={this.state.suscripcionesList}
            afom_distribucion={this.state.afom_distribucion}
            handleChange={this.handleChange}
            onUpdateRelacionSus={this.onUpdateRelacionSus}
            isExtraordinario={this.state.isExtraordinario}
            distribucionUniforme={this.state.distribucionUniforme}
            aforoId={0}
          />

          <Form.Row>
            <Form.Group md="8" as={Col} controlId="afo_observaciones">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="afo_observaciones"
                value={this.state.afo_observaciones}
                onChange={this.handleChange}
                required
                style={{ resize: "none" }}
              />
            </Form.Group>
          </Form.Row>
          <ButtonToolbar>
            <Button
              variant="primary"
              className="mr-5"
              type="submit"
              form="nuevoMultiForm"
            >
              {" "}
              Guardar
            </Button>
          </ButtonToolbar>
        </Form>

        <Modal show={this.state.showModal} onHide={this.handleModalClose} centered animation={false} >
          <Modal.Header closeButton>
            <Modal.Title>Guardar Aforo </Modal.Title>
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

      </div>
    );
  }
}

const mapToStateToprops = (state) => {
  return {
    selectsMulti: state.selectsMulti,
    selects: state.selects    
  };
};
const mapToDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(
      { loadTiposAforoMulti, loadEstado, loadTecnicoAforador, loadFrecuenciaRecoleccion, loadConceptoAforo },
      dispatch
    ),
  };
};

export default connect(mapToStateToprops, mapToDispatchToProps)(Nuevo);