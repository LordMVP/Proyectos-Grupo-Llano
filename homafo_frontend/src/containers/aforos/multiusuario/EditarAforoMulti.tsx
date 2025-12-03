import React, { Component } from 'react'
import { Form, Col, Button, Modal } from 'react-bootstrap'
import * as API from '../../../api/aforos/aforosMulti'
import * as API_AFOROS_NORMAL from '../../../api/aforos/aforos'
//import TableRotated from '../../../components/Table/TableRotated'
import { connect } from 'react-redux'
import { loadTiposAforoMulti, loadBarrioMulti, loadEstado, loadTiposDistribucion, loadDepartamento, loadMunicipioMulti, loadTecnicoAforador } from '../../../actions/aforos/selectsAforosMulti'
import { loadActividad, loadConceptoAforo } from '../../../actions/aforos/selects'
import { bindActionCreators } from 'redux'

//import DetalleRegistrosAforo from './DetalleRegistrosAforo'
import DetalleRegistroAforos from '../../../components/Table/DetalleRegistroAforos'
//import ConsolidadoAforosMulti from './ConsolidadoAforosMulti'
import ConsolidadoAforos from '../../../components/Table/ConsolidadoAforos'
// import Loader from 'components/loader/Init'
import ParparametrosAforoApi from "../../../api/aforos/ParParametrosAforoApi";
import basicoDefault from '../../../api/homologaciones/BasicoDefault';
//import paginationFactory from "react-bootstrap-table2-paginator";
//import {cellEditFactory/*, selectFilter*/} from 'react-bootstrap-table2-editor';
//import cellEditFactory from 'react-bootstrap-table2-editor';
//import selectFilter from 'react-bootstrap-table2-filter';
//import BootstrapTable from "react-bootstrap-table-next";
//import selects from 'reducers/aforos/selects'
import RelacionSuscripciones from './RelacionSuscripciones'
import { toast } from 'react-toastify';
import { Redirect , Link } from "react-router-dom";

///validar permisos
import PARAMETROS from '../../../data/constantes';
import SesionApi from '../../../api/common/SesionApi';
import UtilsFunction from '../../../components/utils/UtilsFunction';


const sesionApi = new SesionApi();

type changeEventElement = React.ChangeEvent<HTMLInputElement>;
type FormEvent = React.FormEvent<HTMLFormElement>;

type dafo_detaforo = {
  afoNumpqr: string,
  dsusIderegistr: string,
  dafoMultiusuporcentaje: number,  
  uniActsuscripc: number;
  iasusNombreestablecimiento: string;
  iasusReferenciacomercial: string;

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

class EditarAforoMulti extends Component<{ actions: any, selectsMulti: any, history: any, location: any, selects: any }, {}> {
  /*const selectOptions = {
    0: 'good',
    1: 'Bad',
    2: 'unknown'
  };
  */

  state = {

    //suscripcion:"",
    //nombresApellidoTercero:"",
    //documentoTercero:"",

    lastBarrio: "",

    vigenciaDesde: "",
    vigenciaHasta: "",
    fechaCreacion: "",
    fechaActualizacion: "",
    observaciones: "",
    afom_distribucion: "",
    nombre: "",
    codigoSus: "",
    cantidad: "",
    suscripcionesList: [],
    uni_tipoaforo: 0,
    afo_estado: "",
    estados: [],
    parametros: [],
    tiposDistribucion: [],
    mafv_factor: "",

    departamento: "",
    idDepartamento: "",
    municipio: "",
    idMunicipio: "",
    fechaInicio: "",
    tipoDistribucion: "",

    aforos_realizados: [
      {
        idAforo: 0, numeroVisita: '', idMaestro: 0, fechaVisita: '', dia: '', aforador: '',
        semana: '', volumen: '', total: {}, estado: "", detalles: []
      }
      // detalles_observaciones: "",detalles_totales:"",detalles:[]}
    ]

    ,
    aforos_pendientes: [],


    info_basica: false,

    detalle_registro_aforo: false,
    consolidado_aforos: false,
    showModalRegistro: false,
    showModalSave: false,
    aforosmulti_consolidados: {
      cargo_variable: "23",
      cargo_fijo: "23",
      vol_medio: "23",
      data: []
    },
    actividadOptions: [],

    suscriptorListColumns: [
      {
        dataField: "id",
        text: "Id Suscripcion",
        short: true,
        align: "center",
        editable: false,
      },
      {
        dataField: "codigo",
        text: "Codigo",
        align: "center",
        editable: false,
      },
      {
        dataField: "nombre",
        text: "Nombre",
        align: "center",
        editable: false,
      },
      {
        dataField: "direccion",
        text: "Dirección",
        align: "center",
        editable: false,
      },
      {
        dataField: "porcentaje",
        text: "Porcentaje",
        align: "center",
        editable: false,
      },
      {
        dataField: "numpqr",
        text: "Radicado PQR",
        align: "center",
        editable: false,
      },
      {
        dataField: "uni_actsuscripc",
        text: "Actividad",
        align: "center",
        editable: false,
        
        formatter: (rowContent, row) => {
          console.log(row);
          console.log(row.id);
          console.log(rowContent);

          return (
            

            <div>
              <select name={row.id} onChange={e=>this.cambioValor(row.id, e.target.value)} 
              value={row.uni_actsuscripc} >
                <option></option> 
                {this.props.selects.Actividad.map((t: any) => {                  
                  return <option key={t.id} value={t.id}> {t.object}</option>                 
                })

                }
              </select>


            </div>
          )
        }
      },
      {
        dataField: "iasus_nombreestablecimiento",
        text: "Santo y seña",
        align: "center",
        editable: true,
      },
      {
        dataField: "iasus_referenciacomercial",
        text: "Referencia comercial",
        align: "center",
        editable: true,
      }



    ],
    isExtraordinario: false,
    afo_ideafopadre: 0,
    conceptoAforo: 0,
    toMenu: false,
    effectivePermissions:{EDIT:false,VIEW:false,CREATE:false,SAVE:false,DELETE:false,QUERY:false},
    permissions: [],
    afom_direccion:'',
    afom_descripcion:'',
    distribucionUniforme:false,


  }

   cambioValor= async(id_suscriptor,valor) =>
{
  //console.log("paso1");
//console.log(id_suscriptor);
//console.log(valor);
//console.log(this.state.suscripcionesList);


let lista:any = this.state.suscripcionesList.map(i =>{
  let item:ItemSuscriptor = i;
  if (item.id == id_suscriptor){  
     let itemNew: ItemSuscriptor = new ItemSuscriptor(
      item.id,
      item.codigo,
      item.nombre,
      item.direccion,
      item.porcentaje,
      item.numpqr,
      item.barrio_ideregistro,
      item.nombreBarrio,
       parseInt(valor),
       item.iasus_nombreestablecimiento,
       item.iasus_referenciacomercial,
       item.cmpDireccion,
       item.estrato,
       item.empresaSus,
       item.tipoUsoSus,
       item.estadoSus
       )
     return itemNew;
   }else{
      return i;
   }
  
});
console.log(lista);
 await this.setState({
  suscripcionesList: lista
})


}

//   actualizarSuscriptor= (element: any) => {
// console.log("actualizando: ",element);
// console.log("actualizando2:",element.name);
//   }
  callSelectsApi = async () => {
    // if ((this.props.selects.Actividad.length == 0)) { this.props.actions.loadActividad(); console.log("loading lastBarrios") }
    this.props.actions.loadTiposDistribucion(); console.log("loading destribuc")
    await this.props.actions.loadTiposAforoMulti(); console.log("loading tipos aforo multi")
    this.props.actions.loadDepartamento(); console.log("loading depart")
    this.props.actions.loadTecnicoAforador(); console.log("loading tecnico Aforador")
    this.props.actions.loadActividad(); console.log("loading Actividades")

    // this.props.actions.loadBarrio("null");

  }
  callDataApi=async()=>  {
  //callDataApi(): void {
    //let numAforoToedit = window.location.pathname.split("/")[9];        
    // API.GetInfoBasicaAforosEdit(numAforoToedit)
    //const data={numAforo:this.props.location.state.idAforo}
    //API.GetInfoBasicaAforosEdit(data)
    await API.GetMultiAforoById(this.props.location.state.idAforo)

      .then(response => {
        console.log("viene data response:::::", response)
        if (response.success === true) {
          let lista = response.data.dafoDetAforo.map(i => {
            //if (response)                    
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
            //suscripcion:response.data.suscripcion,
            //nombresApellidoTercero:response.data.nombresApellidoTercero,
            //documentoTercero:response.data.documentoTercero,
            //lastBarrio: response.data.barrio,
            lastBarrio: response.data.dafoDetAforo.slice(0, 1).map(i => {
              console.log("map barrio:", i.nombreBarrio);
              return i.nombreBarrio;
            }),

            estado: response.data.estado,
            vigenciaDesde: response.data.afoFechaInicio,
            vigenciaHasta: response.data.afoFechafinvegencia,
            fechaCreacion: response.data.afoFecha,
            fechaActualizacion: response.data.afoFechaActualizacion,
            observaciones: response.data.afoObservaciones,
            afom_distribucion: response.data.afomDistribucion,
            suscripcionesList: lista,
            uni_tipoaforo: response.data.uniTipoaforo,
            afo_estado: response.data.afoEstado,
            mafv_factor: response.data.mafvFactor,
            afo_ideafopadre: response.data.afoIdeafopadre,
            conceptoAforo: response.data.conceptoAforo,
            idDepartamento: response.data.idDepartamento,
            afom_direccion:response.data.afomDireccion,
            afom_descripcion:response.data.afomDescripcion,
            distribucionUniforme:response.data.distribucionUniforme
          })

          // this.props.actions.loadMunicipioMulti(this.state.idDepartamento); console.log("loading barrios list") 
          // this.props.actions.loadBarrio(this.state.idMunicipio); console.log("loading barrios list") 
          this.props.actions.loadBarrioMulti("17"); console.log("loading barrios list")
          this.props.actions.loadMunicipioMulti("x");

          this.props.actions.loadConceptoAforo(response.data.conceptoAforo); 
          let filtroTipo = this.props.selectsMulti.tiposAforoMulti.filter(item => item.id == (response.data.uniTipoaforo));

            if (filtroTipo.length > 0) {
              console.log(filtroTipo[0].object.toUpperCase());
              if (filtroTipo[0].object.toUpperCase().indexOf('EXTRAORDINARIO') >= 0) {
                this.setState({ isExtraordinario: true });
              } else {
                this.setState({ isExtraordinario: false });
                this.setState({ afo_ideafopadre: null });
              }
            }
          return response;
        }
      }  //end.then-infoBasica
      ).catch(error => { return Promise.reject(error.status); }); //end .catch-InfoBasicaA


    API_AFOROS_NORMAL.GetAforosRealizadosEdit(this.props.location.state.idAforo)
      .then(response => {
        console.log("respuesta: ", response);
        if (response.success === true) {
          let x = response.data
          const aforoRealizados = x.filter((item) => { return item.estado !== "P" });
          const aforosPendientes = response.data.filter(item => { return item.estado !== "T" });
          console.log("response visitas edit..", response, aforosPendientes, aforoRealizados)
          this.setState({ aforos_realizados: aforoRealizados })
          this.setState({ aforos_pendientes: aforosPendientes })
          return response;
        }
        return response;
      }  //end.then-AforosRealizados
      ).catch(error => { return Promise.reject(error.status); }); //end .catch-AforosRealizados y pendiente T-P

  } //end callDataApi

  componentDidMount = async () =>
  {
    await this.callDataApi();
    await this.callSelectsApi();

    await sesionApi.loadPermisos(PARAMETROS.AFORO_MULTIUSUARIO.PROGRAMA_ID).then(response => {
      this.setState({ permissions: response.data });
  })

  await this.cargarPermisos();
    /*if (this.props.location.state){
        console.log("idAforo: ", this.props.location.state.idAforo);
    } 
    */

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
  }

  cargarPermisos=async()=>
    {
      let effectivePermission = UtilsFunction.getEffectivePermissions(this.state.permissions,'AFORO_MULTIUSUARIO');    
      await this.setState({effectivePermissions:effectivePermission});
    }

  handleChange = async(event: changeEventElement) => {

    const {value, name }=event.target;
    //this.setState({ [event.target.name]: event.target.value } as any)
    await this.setState({ [name]: value } as any)

    if (name == "departamento") {
      //  this.props.actions.loadMunicipio(event.target.value);
    }
    if (name == "municipio") {
      this.props.actions.loadBarrioMulti(event.target.value);
    }
    if (name === "vigenciaHasta") {
      if (value >= this.state.vigenciaDesde) {
        await this.setState({ [name]: value } as any)
      } else {
        await this.setState({ [name]: "" } as any)
        alert('Ops!,Vigencia-Hasta debe ser mayor o igual que "Vigencia Desde".');
      }

    }
    if (name === "vigenciaDesde") {
      if (value <= this.state.vigenciaHasta || this.state.vigenciaHasta === "") {
        await this.setState({ [name]: value } as any)
      } else {
        await this.setState({ [name]: "" } as any)
        alert('Ops!,"Vigencia Hasta" debe ser mayor o igual que Vigencia-Desde ');
      }
    }

    if (name === "afom_distribucion") {
      let tmpEstado:any=this.state.tiposDistribucion.filter(item => item['valor']===value)[0];
      await this.setState({
        distribucionUniforme:tmpEstado.estado
      })
    };

  };

  changeAccordionStatus = (e: any) => {
    const { name } = e.target
    this.setState((prevState: any) => ({ [name]: !prevState[name] }))
  }
  onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (this.validarForm()) {
      this.setState({ showModalSave: true })   
    }
  }
  handleRegistroDetalleModalOpen = () => {
    this.setState({
      showModalRegistro: true
    });

  }
  handleModalSave = () => {
   console.log(this.state.suscripcionesList);
   /*
   const data = {
    afo_ideregistro: this.props.location.state.idAforo,
    afom_distribucion: this.state.afom_distribucion,    
    dafoDetAforo: this.state.suscripcionesList.map(
      x => {
        let item:ItemSuscriptor = x;
        let y: dafo_detaforo = {
          dsus_ideregistr: item.id,
          dafo_multiusuporcentaje: item.porcentaje,
          afo_numpqr: item.numpqr,
          uni_actsuscripc: item.uni_actsuscripc,
		      iasus_nombreestablecimiento: item.iasus_nombreestablecimiento,
		      iasus_referenciacomercial: item.iasus_referenciacomercial
        }
        return y;
      }
    ),
    afo_observaciones: this.state.observaciones,
    afom_direccion:this.state.afom_direccion,
    afom_descripcion:this.state.afom_descripcion,
   }
   */
   ////starcorp
   const data = {
    afoIderegistro: this.props.location.state.idAforo,
    afomDistribucion: this.state.afom_distribucion,    
    dafoDetAforo: this.state.suscripcionesList.map(
      x => {
        let item:ItemSuscriptor = x;
        let y: dafo_detaforo = {
          dsusIderegistr: item.id,
          dafoMultiusuporcentaje: item.porcentaje,
          afoNumpqr: item.numpqr,
          uniActsuscripc: item.uni_actsuscripc,
		      iasusNombreestablecimiento: item.iasus_nombreestablecimiento,
		      iasusReferenciacomercial: item.iasus_referenciacomercial
        }
        return y;
      }
    ),
    afoObservaciones: this.state.observaciones,
    afomDireccion:this.state.afom_direccion,
    afomDescripcion:this.state.afom_descripcion,
    distribucionUniforme:this.state.distribucionUniforme,
   }

/*
    const data = {

      // barrio: this.state.barrio[0].id,
      barrio: this.state.lastBarrio,
      estado: this.state.afo_estado,
      vigenciaDesde: this.state.vigenciaDesde,
      vigenciaHasta: this.state.vigenciaHasta,
      observaciones: this.state.observaciones,
      nombreUsuario: this.state.nombre,
      codigoSus: this.state.codigoSus,
      cantidad: this.state.cantidad,
      departamento: this.state.departamento,
      municipio: this.state.municipio,
      fechaInicial: this.state.fechaInicio,
      // fechaActualizacion: currentDate(),

      tipoDistribucion: this.state.tipoDistribucion,
      codUsuario: this.state.codigoSus,
      //suscripcion: this.state.suscripcion
    }
    */
    console.log("data to updated:://///////// ", data)
    
    API.UpdateMultiAforosEdit(data)
      .then(response => {
        if (response.data.success === true) {
          this.setState({
            showAlert: true,
            variantAlert: ['success'],
            messageAlert: "Se ha guardado con Exito! "
          });
          setTimeout(() => { this.setState({ showAlert: false }) }, 6500);
          toast("Se ha actualizado con Exito");
          setTimeout(() => { this.setState({ toMenu: true }) }, 2000);
          console.log("data updated succesful", response); return response;
        } else {
          this.setState({
            showAlert: true,
            variantAlert: ['info'],
            messageAlert: response.data.message
          });
          setTimeout(() => { this.setState({ showAlert: false }) }, 3500);

          return response
        }
      }
      ).catch(error => {
        this.setState({
          showAlert: true,
          variantAlert: ['warning'],
          messageAlert: "No se han podido guardar los cambios!"
        });
        setTimeout(() => { this.setState({ showAlert: false }) }, 6500);

        return Promise.reject(error);
      });
    this.setState({ showModalSave: false });

    
  } //END handleModalSave


  handleModalSaveClose = () => {
    this.setState({
      showModalSave: false
    });

  }

  handleRegistroModalClose = () => {
    this.setState({
      showModalRegistro: false
    });
  }
    

  validarForm = () => {
    let lista:ItemSuscriptor[] = this.state.suscripcionesList;

    let total: number = lista.reduce((total, item) => total + parseFloat(item.porcentaje + ""), 0);

    if (total != 100) {      
      toast.error("el porcentaje debe ser 100");
      return false;
    }else {
      return true;
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
      //disableSubmit: this.disabledSubmit(),
    })

  }

  inforExtraordinario = (): any => {
    if (this.state.isExtraordinario == true) {
      return (
        <Form.Row>
          <Form.Group md="2" as={Col} controlId="factorFormGrid">
            <Form.Label >Aforo Ordinario Padre</Form.Label>
            <Form.Control name="afo_ideafopadre" 
               value={this.state.afo_ideafopadre}                
               type="number" placeholder="" 
               disabled={true}/>
          </Form.Group>
        </Form.Row>
      )
    }
  }

  render(): JSX.Element {

    const {
      //suscripcion,
      //nombresApellidoTercero,
      //documentoTercero,
      lastBarrio,
      vigenciaDesde,
      vigenciaHasta,
      observaciones,
      //fechaInicio,
      info_basica,
      detalle_registro_aforo,
      consolidado_aforos,
      showModalSave,
      afo_estado
     } = this.state
    // showModalRegistro

    if (this.state.toMenu) {
      return <Redirect to={"/aforos/multiusuario"} />
    }

    return (
      <div>
        <Form className="mb-2" onSubmit={this.onSubmit}>
          {/* <Form.Row>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Suscripción</Form.Label>
                            <Form.Control placeholder="Suscripcion" name= "suscripcion" value={suscripcion} onChange={this.handleChange} disabled />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Tercero Nombres/Apellidos</Form.Label>
                            <Form.Control placeholder="Nombres/Apellidos" name= "nombresApellidoTercero" value={nombresApellidoTercero} onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Documento Tercero</Form.Label>
                            <Form.Control placeholder="Documento " name= "documentoTercero" value={documentoTercero} onChange={this.handleChange} />
                        </Form.Group>
                        <hr/>
                        
                    </Form.Row>  */}

          <Form.Row>
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Barrio</Form.Label>
              <Form.Control name="lastBarrio" value={lastBarrio} onChange={this.handleChange} readOnly>

                {/* <option> </option>
                                <option>---</option> */}
                {/* {this.props.selectsMulti.barriosMulti.map(dept=>{
                                        return (<option value={dept.id}>{dept.object}</option>)
                                    })} */}
              </Form.Control>
            </Form.Group>



            <Form.Group md="2" as={Col} controlId="afo_estado">
              <Form.Label>Estado</Form.Label>
              <Form.Control name="afo_estado" type="text" value={afo_estado} onChange={this.handleChange}  disabled/ >
            </Form.Group>


            <Form.Group as={Col} controlId="formGridEmail" >
              <Form.Label>Vigencia Desde</Form.Label>
              <Form.Control placeholder="Vigencia" type="date" name="vigenciaDesde" value={vigenciaDesde} onChange={this.handleChange} required readOnly />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Vigencia Hasta</Form.Label>
              <Form.Control placeholder="Vigencia" type="date" name="vigenciaHasta" value={vigenciaHasta} onChange={this.handleChange} required readOnly/>
            </Form.Group>


          </Form.Row>
          <Form.Row>
            <Form.Group md="3" as={Col} controlId="formGridEmail" className="sm-2">
              <Form.Label>Fecha creación</Form.Label>
              <Form.Control placeholder="creación" type="date" name="fechaCreacion" value={this.state.fechaCreacion} onChange={this.handleChange} disabled />
            </Form.Group>
            <Form.Group md="3" as={Col} controlId="formGridEmail">
              <Form.Label> Fecha actualización</Form.Label>
              <Form.Control placeholder="actualizacion" type="date" name="fechaActualizacion" value={this.state.fechaActualizacion} onChange={this.handleChange} disabled={true} />
            </Form.Group>
          </Form.Row>

          <Form.Row>

            <Form.Group md="8" as={Col} controlId="exampleForm.ControlTextarea1">
              <Form.Label >Observaciones</Form.Label>
              <Form.Control as="textarea" rows={3} name="observaciones" value={observaciones} onChange={this.handleChange} required  readOnly/>
            </Form.Group>
            <Form.Group md="4" as={Col} controlId="exampleForm.ControlTextarea1">
              <br /><br />
              <div>
                <Link to="/aforos/multiusuario/consultar" >
                                <button className="btn btn-primary" >Regresar al Listado </button>
                </Link>                 
                <Button variant="success" style={{ margin: "10px" }} type="submit" disabled={!this.state.effectivePermissions?.EDIT}> Guardar cambios</Button>
              </div>
            </Form.Group>

          </Form.Row>

          {this.inforExtraordinario()}

          <Button variant="primary" className="mr-5" name="info_basica" onClick={this.changeAccordionStatus}> {info_basica ? '--' : '+'}</Button> Información Básica Suscripción
                {info_basica && <div>
            {/* <NuevoMultiusuario withOptions={false} />  */}
            {/* <Form.Row>
              <BootstrapTable
                data={this.state.suscripcionesList}
                keyField="id"
                columns={this.state.suscriptorListColumns}
                bootstrap4
                striped={true}
                hover={true}
                pagination={paginationFactory({})}
                cellEdit={cellEditFactory({ mode: 'click', blurToSave:true })}
              />
            </Form.Row> */}

            <RelacionSuscripciones
            suscripcionesList={this.state.suscripcionesList}
            afom_distribucion={this.state.afom_distribucion}
            handleChange={this.handleChange}
            onUpdateRelacionSus={this.onUpdateRelacionSus}
            isExtraordinario={this.state.isExtraordinario}
            distribucionUniforme={this.state.distribucionUniforme}
            aforoId={this.props.location.state.idAforo}
          />

            <Form.Row className="mb-2">

              <Form.Group as={Col} controlId="formGridEmail" md="3">
                <Form.Label>Cantidad Suscripciones {this.state.suscripcionesList.length || ""}</Form.Label>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridEmail" md="3">
                <Form.Label>Porcentaje Distribuido % {

                  Math.round(this.state.suscripcionesList
                    .reduce((total, item) => total + parseFloat((item as ItemSuscriptor).porcentaje + ""), 0))
                }</Form.Label>
              </Form.Group>
            </Form.Row >


            <Form.Row>
              <Form.Group
                md="3"
                as={Col}
                controlId="formGridState"
                form="nuevoMultiForm"
              >
                <Form.Label>Tipo Aforo</Form.Label>
                <Form.Control
                  as="select"
                  name="uni_tipoaforo"
                  value={this.state.uni_tipoaforo}
                  onChange={this.handleChange}
                  disabled
                >
                  <option> </option>
                  {
                    this.props.selectsMulti.tiposAforoMulti.map((t: any, i: number) => {
                      return (
                        <option key={i} value={t.id}>
                          {" "}
                          {t.object}
                        </option>
                      );
                    })}
                </Form.Control>
              </Form.Group>
              <Form.Group                
                as={Col}
                controlId="formConcepto"                
              >
                <Form.Label>Concepto Aforo</Form.Label>
                <Form.Control
                  as="select"
                  name="conceptoAforo"
                  value={this.state.conceptoAforo}
                  onChange={this.handleChange}
                  disabled
                >
                  <option> </option>
                  {
                  this.props.selects.conceptoAforo.map((t: any, i: number) => {
                    
                    return <option key={i} value={t.id}> {t.object}</option>
                  })
                }
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridEmail" >
                <Form.Label>Vigencia Desde</Form.Label>
                <Form.Control placeholder="Vigencia" type="date" name="vigenciaDesde" value={vigenciaDesde} onChange={this.handleChange} required readOnly/>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Vigencia Hasta</Form.Label>
                <Form.Control placeholder="Vigencia" type="date" name="vigenciaHasta" value={vigenciaHasta} onChange={this.handleChange} required readOnly/>
              </Form.Group>



              <Form.Group md="3" as={Col} controlId="formGridEmail" className="sm-2">
                <Form.Label>Fecha creación</Form.Label>
                <Form.Control placeholder="creación" type="date" name="fechaCreacion" value={this.state.fechaCreacion} onChange={this.handleChange} disabled />
              </Form.Group>


            </Form.Row>
            <Form.Row>


              <Form.Group md="2" as={Col} controlId="afo_estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="afo_estado"
                  value={this.state.afo_estado}
                  onChange={this.handleChange}
                  required
                  disabled
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
              <Form.Group md="3" as={Col} controlId="formGridStatedsitribuc">
                <Form.Label>Tipo Distribución</Form.Label>
                <Form.Control
                  as="select"
                  name="afom_distribucion"
                  value={this.state.afom_distribucion}
                  onChange={this.handleChange}
                  disabled={this.state.isExtraordinario}
                >
                  <option value="0" key="0"></option>
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
            </Form.Row>
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
            <Form.Row>

              <Form.Group md="8" as={Col} controlId="exampleForm.ControlTextarea1">
                <Form.Label >Observaciones</Form.Label>
                <Form.Control as="textarea" rows={3} name="observaciones" value={observaciones} onChange={this.handleChange} required />
              </Form.Group>




            </Form.Row>
            <Form.Row>
              <Form.Group md="2" as={Col} controlId="mafv_factor">
                <Form.Label>Factor</Form.Label>
                <Form.Control
                  name="mafv_factor"
                  value={this.state.mafv_factor}
                  onChange={this.handleChange}
                  type="text"
                  placeholder="0.000"
                  required
                  disabled
                />
              </Form.Group>

            </Form.Row>
          </div>}
        </Form>
        <hr />


        <hr />

        <Button
          variant="primary"
          className="mr-5"
          type="submit"
          name="detalle_registro_aforo"
          onClick={this.changeAccordionStatus}> {detalle_registro_aforo ? '--' : '+'}</Button>Detalle Registros Aforos
        {detalle_registro_aforo && <div>

          <DetalleRegistroAforos
            data={this.state.aforos_realizados}
            tecnicoAforador={this.props.selectsMulti.tecnicoAforador}
            aforos_pendientes={this.state.aforos_pendientes}
            aforoId={this.props.location.state.idAforo}
          // data: any[],tecnicoAforador,aforos_pendientes
          />


        </div>}
        <hr />
        <Button variant="primary" className="mr-5" type="submit" name="consolidado_aforos" onClick={this.changeAccordionStatus}> {consolidado_aforos ? '--' : '+'}</Button>Consolidado Aforos
        {consolidado_aforos && <div>

          <ConsolidadoAforos
            tiposAforo={this.props.selectsMulti.tiposAforoMulti}
            idAforo={this.props.location.state.idAforo}
          />

        </div>}{/*modal detalles*/}
        <hr />

        {/* <Modal  size="lg" aria-labelledby="contained-modal-title-vcenter" show={showModalRegistro} animation={false} onHide={this.handleRegistroModalClose} dialogClassName="modal-detalle" >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Detalle
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Table striped bordered hover >
                                <thead>
                                    <tr>
                                        
                                        <th>Tipo recipiente</th>
                                        <th>Dimensiones </th>
                                        <th>Cantidad recipientes</th>
                                        <th>Equivalencia (m3)</th>
                                        <th>Volumen (m3) </th>
                                        <th>Peso (m3 Toneladas)</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td> Bolsa domestica  </td>
                                        <td >60 x 86</td>
                                        <td >4</td>
                                        <td >0.06</td>
                                        <td >0.06</td>
                                        <td >0.2</td>
                                    </tr>
                                    <tr>
                                        <td> Caja estacionaria  </td>
                                        <td >2.5 yd3</td>
                                        <td >3</td>
                                        <td >1.4</td>
                                        <td >0.06</td>
                                        <td >5.7</td>
                                    </tr>
                                    <tr>
                                        <td> <strong>TOTALES</strong>:  </td>
                                        <td > <strong></strong>:</td>
                                        <td > <strong>12</strong>:</td>
                                        <td > <strong>3</strong>:</td>
                                        <td > <strong>3</strong>:</td>
                                        <td > <strong>43</strong>:</td>
                                    </tr>

                                </tbody>
                            </Table>
                            <label><strong>Observaciones:</strong></label>
                            <input type="text" className="form-control" placeholder="" />

                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleRegistroModalClose}>Cerrar</Button>
                    </Modal.Footer>
                </Modal> */}

        <Modal show={showModalSave} onHide={this.handleModalSaveClose} centered animation={false} >
          <Modal.Header closeButton>
            <Modal.Title></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Desea guardar la información?
            {!this.state.effectivePermissions?.EDIT ? <p>No tiene permisos para Actualizar...</p> : null}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleModalSaveClose} >
              No
                    </Button>
            <Button disabled={!this.state.effectivePermissions?.EDIT} variant="primary" onClick={this.handleModalSave} >
              Si
                    </Button>
          </Modal.Footer>
        </Modal>


        {/*end modal detalles*/}

      </div>

    )
  }
}

const mapToStateToprops = state => {
  return {
    selectsMulti: state.selectsMulti,
    selects: state.selects,
  }
}
const mapToDispatchToProps = dispatch => {

  return {
    actions: bindActionCreators({ loadTiposAforoMulti, loadBarrioMulti, loadEstado, loadTiposDistribucion, loadDepartamento, loadMunicipioMulti, loadTecnicoAforador, loadActividad, loadConceptoAforo}, dispatch)
  }
}

export default connect(mapToStateToprops, mapToDispatchToProps)(EditarAforoMulti)
