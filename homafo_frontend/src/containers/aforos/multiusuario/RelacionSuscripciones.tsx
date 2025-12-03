import React, { Component, Fragment } from "react";

import { Form, Col, Card, Alert, Button, Modal, Row } from "react-bootstrap";
import {
  AiOutlineClear,
  AiOutlineUserAdd,
  AiOutlineSearch,
  AiOutlineSync
} from "react-icons/ai";
import * as API from "../../../api/aforos/aforos";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import BootstrapTable from "react-bootstrap-table-next";

import paginationFactory from "react-bootstrap-table2-paginator";
import ModalCargando from "../../../components/utils/ModalCargando/ModalCargando";

import { loadActividad } from '../../../actions/aforos/selects'
import { toast } from 'react-toastify';

type changeEventElement = React.ChangeEvent<HTMLInputElement>;

type NuevoState = {
  addIdSus: string;
  addCodigo: string;
  addPorcentaje: number;
  addRadicado: string;
  addNameTer: string;
  addDirecTer: string;
  boolNewSearch: boolean; /*para controlar si se quiere añadir un suscriptor o buscar, para añadir primero hay que buscar 
                              true: se va a buscar un suscriptor
                              false: ya se busco el suscriptor y se le va a agregar el porcentaje y el radicado PQRS*/

  boolEdit: boolean;//para saber si se esta editando un suscriptor, se cambia el comportamiento del boton1 btnAddSearch de actualizar
  enumBtn1: comportamientoBtn1;
  showAlert: boolean;
  variantAlert: [string];
  messageAlert: string;
  loading: boolean;

  suscriptorListColumns: any[];
  barrio_ideregistro: number;//codigo del barrio
  nombreBarrio: string; //nombre del barrio
  actividad: number;
  santoysena: string;
  refcomercial: string;
  cmpDireccion: string;  
  estrato: string;  
  empresaSus: string;
  tipoUsoSus: string;
  estadoSus: string;
  showModalDetailSuscriptor: boolean;

};

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
  empresaSus: string;
  tipoUsoSus: string;
  estadoSus: string;

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
    empresaSus: string,
    tipoUsoSus: string,
    estadoSus: string
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
    this.estadoSus = estadoSus;
  }
}

enum comportamientoBtn1 {
  buscar,
  adicionar,
  actualizar
}

//112619400002, 203510000000, 030220705102
class RelacionSuscripciones extends Component<
  {
    withOptions?: boolean; selectsMulti: any; selects: any, handleChange, onUpdateRelacionSus, actions: any,
    suscripcionesList: ItemSuscriptor[]; afom_distribucion; isExtraordinario , distribucionUniforme , aforoId:number
  },
  NuevoState
  > {
  constructor(props) {
    super(props);
    this.state = {
      addIdSus: "",
      addCodigo: "",
      addNameTer: "",
      addDirecTer: "",
      addPorcentaje: 0.0,
      addRadicado: "",
      boolNewSearch: true,
      boolEdit: false,
      enumBtn1: comportamientoBtn1.buscar,
      showAlert: false,
      variantAlert: ["light"],
      messageAlert: "",
      loading: false,
      suscriptorListColumns: [
        {
          dataField: "id",
          text: "Suscripcion",
          short: true,
          align: "center",
          headerAlign: 'center',
          headerStyle: { backgroundColor: '#6c757d', color: '#ffffff', }
        },
        {
          dataField: "codigo",
          text: "Codigo",
          align: "center",
          headerAlign: 'center',
          headerStyle: { backgroundColor: '#6c757d', color: '#ffffff', }
        }        ,
        {
          dataField: "estadoSus",
          text: "Estado",
          align: "center",
          headerAlign: 'center',
          headerStyle: { backgroundColor: '#6c757d', color: '#ffffff', }
        },
        {
          dataField: "tipoUsoSus",
          text: "Tipo Uso",
          align: "center",
          headerAlign: 'center',
          headerStyle: { backgroundColor: '#6c757d', color: '#ffffff', }
        },
        {
          dataField: "nombre",
          text: "Nombre",
          align: "center",
          headerAlign: 'center',
          headerStyle: { backgroundColor: '#6c757d', color: '#ffffff', }
        },
        {
          dataField: "direccion",
          text: "Dirección",
          align: "center",
          headerAlign: 'center',
          headerStyle: { backgroundColor: '#6c757d', color: '#ffffff', }
        },
        {
          dataField: "porcentaje",
          formatter:row=>this.truncarDecimales(Number(row)),
          text: "Porcentaje",
          align: "center",
          headerAlign: 'center',
          headerStyle: { backgroundColor: '#6c757d', color: '#ffffff', }
        },
        {
          dataField: "numpqr",
          text: "Pqrs",
          align: "center",
          headerAlign: 'center',
          hidden:true,
          headerStyle: { backgroundColor: '#6c757d', color: '#ffffff', }
        },
        {
          dataField: "accion",
          text: "Acciones",
          align: 'center',
          headerAlign: 'center',
          headerStyle: { backgroundColor: '#6c757d', color: '#ffffff', },
          formatter: (rowContent, row) => {
            return (
              <div>
                <Row>
                  <Col>
                      <Button variant="info" key={rowContent} onClick={this.detalles.bind(this, row)} >detalles</Button>
                  </Col>
                  <Col>
                      {this.props.aforoId == 0 ? <Button variant="primary" key={rowContent} onClick={this.editar.bind(this, row)} disabled={this.props.isExtraordinario}>editar</Button> : <p></p>}
                  </Col>
                  <Col>
                      {this.props.aforoId == 0 ? <Button variant="danger" key={rowContent} onClick={this.eliminar.bind(this, row)} disabled={this.props.isExtraordinario}>eliminar</Button> : <p></p>}
                  </Col>
                </Row>
              </div>
            )
          }
        }

      ],
      barrio_ideregistro: 0,
      nombreBarrio: "",
      actividad: 0,
      santoysena: "",
      refcomercial: "",
      cmpDireccion: "",      
      estrato: "",
      empresaSus: "",
      tipoUsoSus: "",
      estadoSus: "",
      showModalDetailSuscriptor: false
    };


  }

  truncarDecimales = (num) => {
    const factor = Math.pow(10, 2);
    return Math.trunc(num * factor) / factor;
  }

  componentWillReceiveProps() {
  }

  componentDidMount(): void {
    this.props.actions.loadActividad(); console.log("loading Actividades")
  }

  handleChange = (event: changeEventElement) => {
    this.setState({ [event.target.name]: event.target.value } as any);
    if (event.target.name === "addPorcentaje") {
      
      /*
      if (parseInt(event.target.value) > 100) {
        this.setState({ [event.target.name]: 0.0 })
  
      } else
      
      if (parseInt(event.target.value) < 1) {
        this.setState({ [event.target.name]: 0.0 })
      } else {
        this.setState({ [event.target.name]: parseInt(event.target.value) });
      }
      */
      // this.props.actions.loadConceptoAforo(event.target.value);
    }

  };

  alertInformation = (
    showAlert: boolean,
    variantAlert: [string],
    messageAlert: string
  ) => {
    this.setState(
      {
        showAlert: showAlert,
        variantAlert: variantAlert,
        messageAlert: messageAlert,
      },
      () => {
        window.setTimeout(() => {
          this.setState({
            showAlert: false,
            variantAlert: ["light"],
            messageAlert: "",
          });
        }, 4000);
      }
    );
  };

  buscarSuscriptorApi = async () => {
    const dataFlush = {
      idSuscripcion: this.state.addIdSus,
      codigoSub: this.state.addCodigo,
      radicadoPqrs: this.state.addRadicado,
    };
    await this.setState({
      loading: true,
    });
    await API.GetNuevo(dataFlush)
      .then((response) => {
        console.log("RelacionSuscripciones: comming data nuevo:", response);

        if (response.success === false || response.data.idUsuario === null) {
          // searched Object: null
          this.alertInformation(true, ["secondary"], response.message);

          //  this.setState({
          //     idUsuario:'',
          //     idTercero:'',
          //     numPqr:'',
          //     nombresYapellidos: '',
          //     direccion: '',
          //     tipoUso: '',
          //     referenciaComercial: '',
          //     actividadComercial: '',
          //     nombreEstablecimiento: '',
          //     barrioUsuario: '',
          //     frecuenciaRecoleccion: '',
          //     jornada: '',
          //     saveStatus: true,
          //     loading: false,
          //     focusNext:false,
          // })

          // return response;
        } else {
          // searched Object: is NOT null

          console.log('que llego de response sus//////////////////////////////////////// ',response.data);
          this.setState({
            addIdSus: response.data.idSuscripcion,
            addCodigo: response.data.codSuscripcion,
            addNameTer: response.data.nombresYapellidos,
            addDirecTer: response.data.direccion,
            addRadicado: response.data.numPqr == "null" ? "" : response.data.numPqr,
            barrio_ideregistro: response.data.barrioUsuarioCodigo,
            nombreBarrio: response.data.barrioUsuario,
            actividad: response.data.uniActSuscripc,
            santoysena: response.data.nombreEstablecimiento,
            refcomercial: response.data.referenciaComercial,
            cmpDireccion: response.data.cmpDireccion,
            estrato: response.data.estrato,
            empresaSus: response.data.nombreConvenio,
            tipoUsoSus: response.data.tipoUso,
            estadoSus: response.data.estado//estadoSus

            //     idUsuario:response.data.idUsuario || "",
            //     idSuscripcion:response.data.idSuscripcion || "",
            //     idTercero:response.data.idTercero || "",
            //     numPqr:response.data.numPqr || "",
            //     radicadoPqrs:response.data.numPqr || "",
            //     codigoSub: response.data.codSuscripcion || "",
            //     nombresYapellidos: response.data.nombresYapellidos || "",
            //     direccion: response.data.direccion || "",
            //     tipoUso: response.data.tipoUso || "",
            //     referenciaComercial: response.data.referenciaComercial || "",
            //     actividadComercial: response.data.actividadComercial || "",
            //     nombreEstablecimiento: response.data.nombreEstablecimiento ,
            //     barrioUsuario: response.data.barrioUsuario || "",
            //     frecuenciaRecoleccion: response.data.frecuenciaRecoleccion || "",
            //     jornada: response.data.jornada || "",
            //     saveStatus: false,
            //     loading: false,
            //     focusNext:true,
          });
          console.log("load suscripcion to state:", this.state);
          this.setState({ enumBtn1: comportamientoBtn1.adicionar });
          // return response;
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        if (!error) {
          // network error
          console.log("error x");
          return Promise.reject(error);
        }
        console.log("Error", error.message);
        return Promise.reject(error);
      });

    await this.setState({
      loading: false,
    });

  };

  handleClickButton = (event) => {
    console.log(event);
    console.log(event.target.name);
    if (event.target.name === "btnAddSearch") {
      if (!this.props.afom_distribucion) {
        toast.warning("debe seleccionar el tipo de distribución");
        return;
      }

      switch (this.state.enumBtn1) {
        case comportamientoBtn1.buscar:
          console.log("llamado a buscar");
          if (this.state.addIdSus != "" || this.state.addCodigo != "" || this.state.addRadicado) {
            this.buscarSuscriptorApi();
          }
          break;
        case comportamientoBtn1.adicionar:
          console.log("llamado a adicionar");

          if (this.props.suscripcionesList.find((item) => item.id === this.state.addIdSus)) {
            //if it exists it is not added
            this.alertInformation(true, ["secondary"], "el suscriptor ya esta en la tabla, no se agregará");
            break;
          }

          //if (this.props.afom_distribucion == 4) {
            if (this.props.distribucionUniforme) {
            if (this.state.addPorcentaje == 0.0) {
              this.alertInformation(true, ["secondary"], "no se permite cero en porcentaje distribuido");
              break;
            }
          }

          let item: ItemSuscriptor = new ItemSuscriptor(
            this.state.addIdSus,
            this.state.addCodigo,
            this.state.addNameTer,
            this.state.addDirecTer,
            this.state.addPorcentaje,
            this.state.addRadicado,
            this.state.barrio_ideregistro,
            this.state.nombreBarrio,
            this.state.actividad,
            this.state.santoysena,
            this.state.refcomercial,
            this.state.cmpDireccion,
            this.state.estrato,
            this.state.empresaSus,
            this.state.tipoUsoSus,
            this.state.estadoSus
          );
          const suscripcionAdded = [...this.props.suscripcionesList, item]
          this.props.onUpdateRelacionSus(suscripcionAdded);

          this.setState({
            addIdSus: "",
            addCodigo: "",
            addNameTer: "",
            addDirecTer: "",
            addPorcentaje: 0.0,
            addRadicado: "",
            barrio_ideregistro: 0,
            nombreBarrio: "",
            actividad: 0,
            santoysena: "",
            refcomercial: "",
            cmpDireccion: "",
            estrato: "",
            empresaSus: "",
            tipoUsoSus: "",
            estadoSus: ""
          });

          this.setState({ enumBtn1: comportamientoBtn1.buscar });

          break;

        case comportamientoBtn1.actualizar:
          console.log("llamado a actualizar");
          const newList = this.props.suscripcionesList.map((item) => {
            if (item.id == this.state.addIdSus) {
              let updateItem: ItemSuscriptor = new ItemSuscriptor(
                item.id,
                item.codigo,
                item.nombre,
                item.direccion,
                this.state.addPorcentaje,
                this.state.addRadicado,
                item.barrio_ideregistro,
                item.nombreBarrio,
                this.state.actividad,
                this.state.santoysena,
                this.state.refcomercial,
                this.state.cmpDireccion,
                this.state.estrato,
                item.empresaSus,
                item.tipoUsoSus,
                item.estadoSus
              );

              return updateItem;
            }

            return item;

          })
          this.props.onUpdateRelacionSus(newList);
          this.setState({
            addIdSus: "",
            addCodigo: "",
            addNameTer: "",
            addDirecTer: "",
            addPorcentaje: 0.0,
            addRadicado: "",
            barrio_ideregistro: 0,
            nombreBarrio: "",
            actividad: 0,
            santoysena: "",
            refcomercial: "",
            empresaSus: "",
            tipoUsoSus: "",
            estadoSus: ""
          });
          this.setState({ enumBtn1: comportamientoBtn1.buscar });

          break;
      }

    }

    if (event.target.name === "btnClear") {
      this.clear();
    }
  };

  clear = () => {
    this.setState({
      addIdSus: "",
      addCodigo: "",
      addNameTer: "",
      addDirecTer: "",
      addPorcentaje: 0.0,
      addRadicado: "",
      barrio_ideregistro: 0,
      nombreBarrio: "",
      actividad: 0,
      santoysena: "",
      refcomercial: "",
      empresaSus: "",
      tipoUsoSus: "",
      estadoSus: ""
    });
    this.setState({ enumBtn1: comportamientoBtn1.buscar });
  };

  mostrarCargando = (): any => {
    if (this.state.loading) {
      return <ModalCargando estado={this.state.loading}></ModalCargando>;
    }
  };





  //...

  /*alertInformation=(variant:[string],message:string)=>{        
       }
       */

  /*calcularDistribucionPorcentualSimple=(data)=>{
      } 
      */
  /*calcularDistribucionPorcentualNoSimple=(data)=>{
     } */
  handleAddSuscripcion = (event): void => {
    console.log("handleAddSuscripcion" + event);
  };
  /*handleDeleteSuscripcion=(codigoUsuario:string):void=>{
     }*/
  /*calcularParticipacionPorcentual=(newPorcentaje:string,add:boolean):void=>{
     }*/


  editar = (e: any) => {
    console.log("editando");
    console.log(e);
    this.setState({
      addIdSus: e.id,
      addCodigo: e.codigo,
      addNameTer: e.nombre,
      addDirecTer: e.direccion,
      addPorcentaje: e.porcentaje,
      addRadicado: e.numpqr,
      actividad: e.uni_actsuscripc,
      santoysena: e.iasus_nombreestablecimiento,
      refcomercial: e.iasus_referenciacomercial,
      empresaSus: e.empresaSus,
      tipoUsoSus: e.tipoUsoSus,
      estadoSus: e.estadoSus,

      //boolNewSearch :true,
      enumBtn1: comportamientoBtn1.actualizar,
      boolEdit: true,
    });
  }

  eliminar = (e: any) => {
    const newList = this.props.suscripcionesList.filter((item) => item.id !== e.id);
    this.props.onUpdateRelacionSus(newList);
  }

  detalles = (e: ItemSuscriptor) => {

    this.clear();
    this.setState({
      showModalDetailSuscriptor: true,
      addIdSus: e.id,
      addCodigo: e.codigo,
      addNameTer: e.nombre,
      addDirecTer: e.direccion,
      addPorcentaje: e.porcentaje,
      actividad: e.uni_actsuscripc,
      santoysena: e.iasus_nombreestablecimiento,
      refcomercial: e.iasus_referenciacomercial,
      empresaSus: e.empresaSus,
      tipoUsoSus: e.tipoUsoSus,
      estadoSus: e.estadoSus,
      cmpDireccion: e.cmpDireccion,
      estrato: e.estrato,
    })

  }

  handleModalDetallesClose = (): void => {
    this.setState({
      showModalDetailSuscriptor: false,

      addIdSus: "",
      addCodigo: "",
      addNameTer: "",
      addDirecTer: "",
      addPorcentaje: 0.0,
      actividad: 0,
      santoysena: "",
      refcomercial: "",
      empresaSus: "",
      tipoUsoSus: "",
      estadoSus: "",
      cmpDireccion: "",
      estrato: "",
    });
  }


  totalPorcentaje = (s:ItemSuscriptor[]) => {
    let total: number = this.props.suscripcionesList
      .reduce((total, item) => total + Number(item.porcentaje), 0) - 
      s.reduce((total, item) => total + Number(item.porcentaje), 0);

    return this.truncarDecimales(total);
  }
  totalPorcentajeInactivo = (s:ItemSuscriptor[]) => {
    let total: number = s
      .reduce((total, item) => total + Number(item.porcentaje), 0);

    return this.truncarDecimales(total);
  }


  disabledAddPorcentaje = () => {

    if (this.state.enumBtn1 === comportamientoBtn1.buscar) {
      return true
    } else if (this.props.distribucionUniforme===false/*this.props.afom_distribucion == 2*/) {
      return true
    } else {
      return false
    }
  }

  disabledGeneral = (targetName) => {

    if (this.props.isExtraordinario == true) {
      return true;
    } else {

      if ((targetName == "actividad") || (targetName == "santoysena") || (targetName == "refcomercial") || (targetName == "cmpDireccion") || (targetName == "estrato")) {
        if (this.state.enumBtn1 === comportamientoBtn1.buscar) {
          return true;
        } else {
          return false;
        }
      } else {

        if (this.state.enumBtn1 === comportamientoBtn1.buscar) {
          return false;
        } else {
          return true;
        }
      }

      return false;
    }

  }

  render(): JSX.Element {

    return (
      <Fragment>
        {this.mostrarCargando()}

        <Form
          id="relacionSucripcionesForm"
          className="mb-2"
          onSubmit={this.handleAddSuscripcion}

        >
          <Card className="mb-5">
            <Card.Body>

              <Form.Row>
                <Col>
                      <Alert variant="info">Relación Suscripciones</Alert>
                </Col>
              </Form.Row>
              <Form.Row>
                {this.state.variantAlert.map((t: any, i: number) => {
                  return (
                    <Alert
                      key={i}
                      variant={t}
                      onClose={() => this.setState({ showAlert: false })}
                      show={this.state.showAlert}
                    >
                      {this.state.messageAlert}.
                    </Alert>
                  );
                })}
              </Form.Row>
              <Form.Row className="">
                  <Col>
                    <div className="form-group">
                        <Form.Label>Id Suscripciones</Form.Label>
                        <Form.Control
                          placeholder="Suscripcion"
                          name="addIdSus"
                          value={this.state.addIdSus}
                          onChange={this.handleChange}
                          //disabled={this.state.enumBtn1 === comportamientoBtn1.buscar ? false : true}
                          disabled={this.disabledGeneral("addIdSus")}
                        />
                    </div>
                  </Col>
                  <Col>
                      <div className="form-group">
                          <Form.Label>Codigo</Form.Label>
                          <Form.Control
                            placeholder="Codigo "
                            type="text"
                            name="addCodigo"
                            value={this.state.addCodigo || ""}
                            onChange={this.handleChange}
                            disabled={this.disabledGeneral("addCodigo")}
                          />       
                      </div>
                  </Col>
                  <Col>
                      <div className="form-group">
                          <Form.Label>Radicado PQR'S</Form.Label>
                          <Form.Control
                            placeholder="Radicado"
                            name="addRadicado"
                            value={this.state.addRadicado || ""}
                            onChange={this.handleChange}
                            disabled={this.disabledGeneral("addRadicado")}
                          />
                      </div>
                  </Col>
                </Form.Row>
                <Form.Row className="">
                  <Col>
                    <div className="form-group">
                          <Button
                                    name="btnAddSearch"
                                    variant="primary"
                                    onClick={(event) => this.handleClickButton(event)}
                                    disabled={this.props.isExtraordinario}
                                    block
                                  >
                                    {this.state.enumBtn1 === comportamientoBtn1.actualizar ? "Actualizar"
                                      : this.state.enumBtn1 === comportamientoBtn1.buscar ? "Buscar "
                                        : "Adicionar "
                                    }
                                    {
                                      this.state.enumBtn1 === comportamientoBtn1.actualizar ? (<AiOutlineSync />)
                                        : this.state.enumBtn1 === comportamientoBtn1.buscar ? (<AiOutlineSearch />)
                                          : (<AiOutlineUserAdd />)
                                    }
                          </Button> 
                    </div>                            
                  </Col>
                  <Col>
                              <div className="form-group">
                                        <Button name="btnClear" block variant="secondary" onClick={(event) => this.handleClickButton(event)} disabled={this.props.isExtraordinario}>
                                            Limpiar
                                            <AiOutlineClear />
                                        </Button>
                                  </div>
                          </Col>
              </Form.Row> 
              <Form.Row>
                  <Col>
                      <div className="form-group">
                            <h3>
                                  <Form.Label>Informacion Suscripcion</Form.Label>
                            </h3>
                      </div>
                  </Col>
              </Form.Row>
              <Form.Row>
                    <Col>
                          <div className="form-group">
                              <Form.Label>Nombre</Form.Label>
                              <Form.Control
                                type="text"
                                name="addNameTercero"
                                value={this.state.addNameTer || ""}
                                disabled={true}
                              ></Form.Control>
                          </div>
                    </Col>
                    <Col>
                          <div className="form-group">
                                <Form.Label>Dirección</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="addDireccion"
                                  value={this.state.addDirecTer + " " + this.state.nombreBarrio || ""}
                                  disabled={true}
                                ></Form.Control>
                          </div>
                    </Col>
                    <Col>
                          <div className="form-group">
                              <Form.Label>Porcentaje</Form.Label>
                              <input className="form-control" name="addPorcentaje"
                                type="number"
                                step="0.001"
                                value={this.state.addPorcentaje}
                                onChange={this.handleChange}
                                required
                                disabled={this.disabledAddPorcentaje()}
                                />
                          </div>
                    </Col>
              </Form.Row>                      
              <Form.Row style={{ /*backgroundColor: "#8CDD81"*/ }}>
                <Form.Group as={Col} xs={4} >
                  <Form.Label>Actividad</Form.Label>
                  <Form.Control
                    as="select"
                    name="actividad"
                    value={this.state.actividad}
                    onChange={this.handleChange}
                    disabled={this.disabledGeneral("actividad")}
                  >
                    <option> </option>
                    {
                      this.props.selects.Actividad.map((t: any) => {
                        return (
                          <option key={t.id} value={t.id}>
                            {t.object}
                          </option>
                        );
                      })}

                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} xs={4}>
                  <Form.Label>Santo y Seña</Form.Label>
                  <Form.Control
                    name="santoysena"
                    type="text"
                    value={this.state.santoysena}
                    onChange={this.handleChange}
                    required
                    disabled={this.disabledGeneral("santoysena")}
                  >
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} xs={4}>
                  <Form.Label>Ref Comercial</Form.Label>
                  <Form.Control
                    name="refcomercial"
                    type="text"
                    value={this.state.refcomercial}
                    onChange={this.handleChange}
                    required
                    disabled={this.disabledGeneral("refcomercial")}
                  >
                  </Form.Control>
                </Form.Group>
                </Form.Row>
                <Form.Row style={{ /*backgroundColor: "#8CDD81"*/ }}>
                    <Form.Group as={Col} xs={12}>
                      <Form.Label>Complemento Direccion</Form.Label>
                      <Form.Control
                        name="cmpDireccion"
                        type="text"
                        value={this.state.cmpDireccion}
                        onChange={this.handleChange}
                        disabled={true}
                      >
                      </Form.Control>
                    </Form.Group>
              </Form.Row>
              <br/>
              <br/>
              <Form.Row>
                <Form.Group as={Col}>

                  <BootstrapTable
                    data={this.props.suscripcionesList}
                    keyField="id"
                    columns={this.state.suscriptorListColumns}
                    bootstrap4
                    striped={true}
                    hover={true}
                    pagination={paginationFactory({})}
                  />
                </Form.Group>
              </Form.Row>

              <Form.Row className="mb-2">

                <Form.Group as={Col} controlId="formGridEmail" md="3">
                  <Form.Label>Cantidad Suscripciones {this.props.suscripcionesList.length || ""}</Form.Label>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridEmail" md="3">
                  <Form.Label>Porcentaje Distribuido % {this.totalPorcentaje(
                    this.props.suscripcionesList.filter(i=>i.estadoSus !=="A")
                  )}</Form.Label>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridEmail" md="3">
                  <Form.Label>Cantidad Suscripcion Inactiva: {
                  this.props.suscripcionesList.filter(i=>i.estadoSus !=="A").length}</Form.Label>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridEmail" md="3">
                  <Form.Label>Porcentaje Distribuido Inactivo % {
                    this.totalPorcentajeInactivo(
                      this.props.suscripcionesList.filter(i=>i.estadoSus !=="A"))                 
                  }</Form.Label>
                </Form.Group>
              </Form.Row >
            </Card.Body>
          </Card>
        </Form>
        <br/>              
        <Modal show={this.state.showModalDetailSuscriptor} size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered closeButton
          onHide={this.handleModalDetallesClose}
        >
          <Modal.Header closeButton>
            <Modal.Title><h3>Detalles de suscriptor</h3></Modal.Title>
          </Modal.Header>
          <Modal.Body  >
            <Form.Row>
              <Form.Group as={Col} xs={2}>
                <Form.Label>Id</Form.Label>
                <Form.Control
                  placeholder="Suscripcion"
                  name="addIdSus"
                  value={this.state.addIdSus}
                  disabled={true}
                />
              </Form.Group>
              <Form.Group as={Col} xs={3}>
                <Form.Label>Codigo</Form.Label>
                <Form.Control
                  placeholder="Codigo "
                  type="text"
                  name="addCodigo"
                  value={this.state.addCodigo || ""}
                  disabled={true}
                />
              </Form.Group>
              <Form.Group as={Col} xs={6}>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="addNameTercero"
                  value={this.state.addNameTer || ""}
                  disabled={true}
                ></Form.Control>
              </Form.Group>
              <Form.Group as={Col} xs={4}>
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  name="addDireccion"
                  value={this.state.addDirecTer || ""}
                  disabled={true}
                ></Form.Control>
              </Form.Group>
              <Form.Group as={Col} xs={6}>
                <Form.Label>Complemento Direccion</Form.Label>
                <Form.Control
                  name="cmpDireccion"
                  type="text"
                  value={this.state.cmpDireccion}
                  disabled={true}
                >
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} xs={2}>
                <Form.Label>Estrato</Form.Label>
                <Form.Control
                  name="estrato"
                  type="text"
                  value={this.state.estrato}
                  disabled={true}
                >
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} xs={2}>
                <Form.Label>Porcentaje</Form.Label>
                <Form.Control
                  name="addPorcentaje"
                  type="number"
                  max="100"
                  min="0"
                  value={this.state.addPorcentaje}
                  disabled={true}
                >
                </Form.Control>
              </Form.Group>

            </Form.Row>
            <Form.Row >
              <Form.Group as={Col} xs={3}>
                <Form.Label>Actividad</Form.Label>
                <Form.Control
                  as="select"
                  name="actividad"
                  value={this.state.actividad}
                  onChange={this.handleChange}
                  disabled={true}
                >
                  <option> </option>
                  {
                    this.props.selects.Actividad.map((t: any) => {
                      return (
                        <option key={t.id} value={t.id}>
                          {t.object}
                        </option>
                      );
                    })}

                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} xs={4}>
                <Form.Label>Santo y Seña</Form.Label>
                <Form.Control
                  name="santoysena"
                  type="text"
                  value={this.state.santoysena}
                  disabled={true}
                >
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} xs={4}>
                <Form.Label>Ref Comercial</Form.Label>
                <Form.Control
                  name="refcomercial"
                  type="text"
                  value={this.state.refcomercial}
                  disabled={true}
                >
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Form.Row >
              <Form.Group as={Col} xs={6}>
                <Form.Label>Empresa - Convenio</Form.Label>
                <Form.Control
                  name="empresa"
                  type="text"
                  value={this.state.empresaSus}
                  disabled={true}
                >
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} xs={4}>
                <Form.Label>Tipo de Uso</Form.Label>
                <Form.Control
                  name="tipouso"
                  type="text"
                  value={this.state.tipoUsoSus}
                  disabled={true}
                >
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} xs={1}>
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  name="estado"
                  type="text"
                  value={this.state.estadoSus}
                  disabled={true}
                >
                </Form.Control>
              </Form.Group>
              
            </Form.Row>
          </Modal.Body>
        </Modal>
      </Fragment>
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
    actions: bindActionCreators({ loadActividad }, dispatch),
  };
};

export default connect(
  mapToStateToprops,
  mapToDispatchToProps
)(RelacionSuscripciones);