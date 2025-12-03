import { TAforoNormalEdit } from '../../../../src/models/types/aforos/AforoNormalEdit'   //import first
import React, { Component } from 'react'
import { Form, Col, Button, Modal, Card, Row, ListGroup } from 'react-bootstrap'
import * as API from '../../../api/aforos/aforos'
import { connect } from 'react-redux'
import { loadBarrio, loadTipoGenerador, loadTiposAforo, loadTecnicoAforador, loadEstado, loadActividad, loadRutaMicroMacro } from '../../../actions/aforos/selects'
// import { loadTiposAforo, loadFrecuenciaRecoleccion, loadBarrio, loadConceptoAforo, loadTecnicoAforador  } from '../../actions/selects'
import { bindActionCreators } from 'redux'
import { Typeahead } from 'react-bootstrap-typeahead';
import { Alert } from 'react-bootstrap'
import { currentDate } from '../../../utils/Dates'
import '../../../assets/editaforo.css';
import DetalleRegistroAforos from '../../../components/Table/DetalleRegistroAforos'
import ConsolidadoAforos from '../../../components/Table/ConsolidadoAforos'
import { Redirect } from "react-router-dom";
import { Link } from 'react-router-dom'

///validar permisos
import PARAMETROS from '../../../data/constantes';
import SesionApi from '../../../api/common/SesionApi';
import UtilsFunction from '../../../components/utils/UtilsFunction';
import { FaArrowLeft, FaSave } from 'react-icons/fa'


const sesionApi = new SesionApi();

type changeEventElement = React.ChangeEvent<HTMLInputElement>;
// type clickEvent = React.MouseEvent<HTMLButtonElement>;
// type KeyboardEvent = React.KeyboardEvent<HTMLInputElement>;
type FormEvent = React.FormEvent<HTMLFormElement>;




class EditarAforo extends Component<{ actions: any, selects: any, history: any }, {}> {

    state = {
        //---general state---
        info_actual:false,
        info_basica: false,
        detalle_registro_aforo: false,
        consolidado_aforos: false,
        showModal: false,
        variantAlert: ['light'],
        showAlert: false,
        messageAlert: "",
        showModalSave: false,

        //---base state---
        suscripcion: "",
        nombreUsuario: "",
        nombres_apellidotercer: "",
        documento_tercero: "",
        barrio: [{ "id": 0, "object": "" }],
        idMunicipio: 0,
        idBarrio: 0,
        lastBarrio: "",
        estado: "",
        vigenciaDesde: "",
        vigenciaHasta: "",
        fechaCreacion: "",
        fechaActualizacion: "",
        observaciones: "",

        //---infoBasica state---
        codigoSub: "",
        direccion: "",
        actividadComercial: 0,
        idActividadComercial: 0,
        tipoGenerador: "",
        santoSenia: "",
        referenciaComercial: "",
        numAforo: "",
        fechaInicial: "",
        fechaProrroga: "",
        rutaMicroMacro : 0 ,
        ///aforos  tables
        aforos_realizados: [
            {
                idAforo: 0, numeroVisita: '', idMaestro: 0, fechaVisita: '', dia: '', aforador: '',
                semana: '', volumen: '', total: {}, estado: "", detalles: []
            }
            // detalles_observaciones: "",detalles_totales:"",detalles:[]}
        ]

        ,
        aforos_pendientes: [],
        aforos_consolidados: {
            data: [],
            factor_produccion: "",
            tipo: "",
            tafna: "",
            totales: { numero_visitas: "", volumen: "", volumen_mes: "" }
        },
        redirect: null as any,
        effectivePermissions:{EDIT:false,VIEW:false,CREATE:false,SAVE:false,DELETE:false,QUERY:false},
        permissions: [],
        nombreConcepto:'',
        nombreTipoAforo:'',

    } //end state


    callSelectsApi(): void {        
        this.props.actions.loadTipoGenerador();
        this.props.actions.loadTiposAforo();
        this.props.actions.loadTecnicoAforador("null");
        this.props.actions.loadEstado();
        this.props.actions.loadActividad();
        this.props.actions.loadRutaMicroMacro(4376);
    }//end callselcts


    callDataApi(): void {
        //let numAforoToedit = window.location.pathname.split("/")[9];
        let paths = window.location.pathname.split('/');
        const numAforoToedit=paths[paths.length-1];
        const data = { numAforo: numAforoToedit }
        API.GetInfoBasicaAforosEdit(data)
            .then(response => {
                if (response.success === true) {
                    const responseData: TAforoNormalEdit = response.data
                    // const data:TAforoNormalEdit = responseData

                    //console.log('que llego de response en editar //////////////////// ',response);
                    this.setState({
                        suscripcion: responseData.suscripcion,
                        nombres_apellidotercer: responseData.nombresApellidoTercero,
                        documento_tercero: responseData.documentoTercero,
                        lastBarrio: responseData.barrio,
                        estado: responseData.estado,
                        vigenciaDesde: responseData.vigenciaDesde,
                        vigenciaHasta: responseData.vigenciaHasta,
                        fechaCreacion: responseData.fechaCreacion,
                        fechaActualizacion: responseData.fechaActualizacion,
                        observaciones: responseData.observaciones,
                        direccion: responseData.direccion,
                        codigoSub: responseData.codUsuario,
                        nombreUsuario: responseData.nombreUsuario,
                        actividadComercial: responseData.actividadComercial,
                        idActividadComercial: responseData.idActividadComercial,
                        tipoGenerador: responseData.tipoGenerador,
                        santoSenia: responseData.santoSenia,
                        referenciaComercial: responseData.referenciaComercial,
                        numAforo: responseData.numAforo,
                        fechaInicial: responseData.fechaInicial,
                        fechaProrroga: responseData.fechaProrroga,
                        idMunicipio: responseData.idMunicipio,
                        idBarrio: responseData.idBarrio,
                        nombreConcepto: responseData.nombreConcepto,
                        nombreTipoAforo: responseData.nombreTipoAforo,
                        rutaMicroMacro: responseData.rutaMicroMacro
                    })
                this.props.actions.loadBarrio(this.state.idMunicipio); 
                } else {
                    setTimeout(() => { this.setState({ redirect: "/aforos/normal/consultar" }) }, 0);
                    return response;
                }

            }  //end.then-infoBasica
            ).catch(error => { return Promise.reject(error.status); }); //end .catch-InfoBasicaA


        API.GetAforosRealizadosEdit(numAforoToedit)
            .then(response => {
                if (response.success === true) {
                    let x = response.data
                    const aforoRealizados = x.filter((item) => { return item.estado !== "P" });
                    const aforosPendientes = response.data.filter(item => { return item.estado !== "T" });
                    console.log("response visitas edit", response, aforosPendientes, aforoRealizados)
                    this.setState({ aforos_realizados: aforoRealizados })
                    this.setState({ aforos_pendientes: aforosPendientes })
                    return response;
                }
                return response;
            }  //end.then-AforosRealizados
            ).catch(error => { return Promise.reject(error.status); }); //end .catch-AforosRealizados y pendiente T-P

        API.GetAforoConsolidadoEdit(numAforoToedit).then(response => {
            this.setState({ aforos_consolidados: response })
            return response;
        }  //end.then-consolidado
        ).catch(error => { return Promise.reject(error.status); }); //end .catch-consolidado


    } //end callDataApi

    async componentDidMount() {
        this.callDataApi();        
        this.callSelectsApi();
        await sesionApi.loadPermisos(PARAMETROS.AFORO_NORMAL.PROGRAMA_ID).then(response => {
            this.setState({ permissions: response.data });
        })
        await this.cargarPermisos();
        console.log(this.props)
    }

    cargarPermisos=async()=>
    {
      let effectivePermission = UtilsFunction.getEffectivePermissions(this.state.permissions,'AFORO_NORMAL');    
      await this.setState({effectivePermissions:effectivePermission});
    }

    alertInformation = (variant: [string], message: string) => {
        this.setState({
            showAlert: true,
            variantAlert: variant,
            messageAlert: message
        }, () => { window.setTimeout(() => { this.setState({ showAlert: false, variantAlert: ['light'], messageAlert: "" }) }, 5000) });
    }

    handleChange = (event: changeEventElement) => {
        console.log("%c changeEvent====>", "color: blue");
        console.log(event.target.name, "  ", event.target.value);
        this.setState({ [event.target.name]: event.target.value } as any)
        const message = 'Ops!,Vigencia-Hasta debe ser mayor o igual que "Vigencia Desde".'

        if (event.target.name === "vigenciaHasta") {
            if (event.target.value >= this.state.vigenciaDesde) {
                this.setState({ [event.target.name]: event.target.value } as any)
            } else {
                this.setState({ [event.target.name]: "" } as any)
                alert(message);
            }
        }
        if (event.target.name === "vigenciaDesde") {
            if (event.target.value <= this.state.vigenciaHasta || this.state.vigenciaHasta === "") {
                this.setState({ [event.target.name]: event.target.value } as any)
            } else {
                this.setState({ [event.target.name]: "" } as any)
                alert(message);
            }
        }
    }//end handlechange

    changeAccordionStatus = (e: any): void => {
        const { name } = e.target
        this.setState((updater: any) => ({ [name]: !updater[name] }))
    }

    handleModalSaveClose = (): void => {
        this.setState({ showModalSave: false })
    }

    handleModalSave = (): void => {
        let objectBarrio = ""
        console.log(" this.state.barrio::", this.state.barrio)
        if (this.state.barrio.length > 0 || this.state.barrio[0].id === 0) {
            objectBarrio = this.state.idBarrio.toString()
        }
        else { objectBarrio = this.state.lastBarrio } //idBarrio
        const data = {
            // barrio: this.state.barrio[0].id===0?this.state.lastBarrio:this.state.barrio[0].id,
            barrio: objectBarrio,
            estado: this.state.estado,
            vigenciaDesde: this.state.vigenciaDesde,
            vigenciaHasta: this.state.vigenciaHasta,
            fechaCreacion: this.state.fechaCreacion,
            fechaActualizacion: currentDate(),
            observaciones: this.state.observaciones,

            direccion: this.state.direccion,
            codUsuario: this.state.codigoSub,
            nombreUsuario: this.state.nombreUsuario,
            idActividadComercial: this.state.idActividadComercial,
            tipoGenerador: this.state.tipoGenerador,
            santoSenia: this.state.santoSenia,
            referenciaComercial: this.state.referenciaComercial,
            numAforo: this.state.numAforo,
            fechaInicial: this.state.fechaInicial,
            fechaProrroga: this.state.fechaProrroga,
        }
        console.log(" state::", this.state)


        console.log("%cdata to updated:::::::====>" + data, "color: orange");
        API.UpdateAforosEdit(data)
            .then(response => {
                console.log("response::", response)
                if (response.data.success === true) {
                    this.alertInformation(['success'], "Se ha guardado con Exito!!!");

                    // setTimeout(()=>{this.setState({ redirect: "/aforos/normal/consultar" })}, 6000);
                    console.log("data updated successful", response); return response;
                } else { this.alertInformation(['info'], response.data.message); return response }
            }
            ).catch(error => {
                this.alertInformation(['warning'], "Error,No se han podido guardar los cambios!")
                return Promise.reject(error);
            });
        this.setState({ showModalSave: false });
    } //END handleModalSave

    onSubmitEdit = (event: FormEvent): void => {
        event.preventDefault();
        this.setState({ showModalSave: true })
    }//end catch error

    render(): JSX.Element {
        const {
            info_actual,
            info_basica,
            detalle_registro_aforo,
            consolidado_aforos,
            showAlert,
            messageAlert,
            showModalSave,

            //----base----
            suscripcion,
            nombreUsuario,
            documento_tercero,
            barrio,
            lastBarrio,
            vigenciaDesde,
            vigenciaHasta,
            fechaCreacion,
            fechaActualizacion,
            observaciones,

            //---basicInfo---
            codigoSub,
            // nombres_apellidos,
            direccion,
            // barrio
            // actividadComercial,
            rutaMicroMacro,
            tipoGenerador,
            santoSenia,
            nombres_apellidotercer,
            numAforo,
            fechaInicial, idActividadComercial, referenciaComercial, nombreConcepto , nombreTipoAforo,
            fechaProrroga, redirect } = this.state

        const {
            selects } = this.props
        if (redirect) {
            return <Redirect to={redirect} />
        }

        return (
            <div>
                <Form className="mb-2" onSubmit={this.onSubmitEdit} >
                {/* informacion basica */}
                <Button
                variant="primary"
                className="mr-5 "
                name="info_basica"
                onClick={this.changeAccordionStatus}>
                {info_basica ? '--' : '+'}</Button>
            <strong>Información Básica</strong>
            {info_basica && <div><br />

                <Form.Row>
                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Codigo usuario</Form.Label>
                        <Form.Control placeholder="Codigo suscripcion" name="codigoSub" value={codigoSub} onChange={this.handleChange} disabled />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Nombre usuario</Form.Label>
                        <Form.Control placeholder="Nombres/Apellidos" name="nombreUsuario" value={nombreUsuario} onChange={this.handleChange} disabled />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control placeholder="dirección" name="direccion" value={direccion} onChange={this.handleChange} disabled />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>Barrio</Form.Label>
                        {/* <Form.Control placeholder="barrio" name="barrio" value={barrio} onChange={this.handleChange} /> */}
                        <Typeahead
                            id="barrio-typeahead"
                            emptyLabel="No hay resultados"
                            inputProps={{ required: true, disabled: true }}
                            defaultInputValue={lastBarrio}
                            labelKey="object"
                            name="barrio"
                            value={barrio}
                            multiple={false}
                            onChange={(selected: []) => { this.setState({ barrio: selected }); }}
                            options={this.props.selects.Barrio}
                            placeholder="Barrio"
                            onInputChange={() => { console.log("change typehead") }}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} controlId="formGridStateactividad">
                        <Form.Label>Actividad</Form.Label>
                        <Form.Control as="select" name="idActividadComercial" value={idActividadComercial} onChange={this.handleChange} required >
                            {selects.Actividad.map((t: any) => {
                                return <option key={t.id} value={t.id}> {t.object}</option>
                            })
                            }

                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>Tipo de Generador</Form.Label>
                        <Form.Control as="select" name="tipoGenerador" value={tipoGenerador} onChange={this.handleChange} disabled={true}>
                            {selects.tipoGenerador.map((t: any, i: number) => {
                                return <option key={i} value={t.object}> {t.object}</option>
                            })
                            }
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>Santo y seña</Form.Label>
                        <Form.Control placeholder="Nombre establecimiento" name="santoSenia" value={santoSenia} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>Referencia Comercial</Form.Label>
                        <Form.Control placeholder="Referencia Comercial" name="referenciaComercial" value={referenciaComercial} onChange={this.handleChange} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} controlId="formGridState" md="3">
                        <Form.Label>Estado aforo</Form.Label>
                        <Form.Control as="select" name="estado" value={this.state.estado} onChange={this.handleChange} required >
                                {selects.Estado.map((t: any, i: number) => {
                                return <option key={i} value={t.object}> {t.object}</option>
                            })}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label> Fecha inicial</Form.Label>
                        <Form.Control placeholder="inicial" type="date" name="fechaInicial" disabled={true} value={fechaInicial} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label> Fecha prórroga</Form.Label>
                        <Form.Control placeholder="prórroga" type="date" name="fechaProrroga" disabled={true} value={fechaProrroga} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group as ={Col} controlId="formGridState">
                    <Form.Label></Form.Label>
                    <Card>
                            <Card.Header>Recoleccion</Card.Header>
                            <Card.Body><Row><Col>
                            <Form.Group as = {Col} controlId="formGridState" >
                            <Form.Label>Frecuencias</Form.Label>
                            <ListGroup as="ul">
                            {
                                selects.RutaMicroMacro.filter(x=>x.rut_ideregistro===rutaMicroMacro)
                                .map(z=>
                                    z.frecuencias.map(i=>{return <ListGroup.Item>{i.dia}</ListGroup.Item>}))
                                                        
                            }
                            </ListGroup>
                            </Form.Group>
                            </Col></Row></Card.Body>
                    </Card>
                    </Form.Group> 
                </Form.Row>
            </div>}
            <hr /> {/* end Base data for editing */}
                {/* Informacion Aforo Actual */}
                <Button
                    variant="primary"
                    className="mr-5 "
                    name="info_actual"
                    onClick={this.changeAccordionStatus}>
                    {info_actual ? '--' : '+'}</Button>
                <strong>Información Aforo Actual</strong>
                {info_actual && (
                    <Card border='light'>
                        <Card.Body>
                            <Row className="mb-4">
                                <Col md={4}>
                                    <Form.Group >
                                        <Form.Label >Suscripción</Form.Label>
                                        <Form.Control 
                                            placeholder="" 
                                            autoFocus 
                                            name="suscripcion" 
                                            value={suscripcion} 
                                            onChange={this.handleChange} 
                                            disabled 
                                            className="bg-light"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group >
                                        <Form.Label>Tercero Nombres/Apellidos</Form.Label>
                                        <Form.Control 
                                            placeholder="" 
                                            name="nombres_apellidotercer" 
                                            value={nombres_apellidotercer} 
                                            onChange={this.handleChange} 
                                            disabled 
                                            className="bg-light"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group >
                                        <Form.Label >Documento Tercero</Form.Label>
                                        <Form.Control 
                                            placeholder="" 
                                            name="documento_tercero" 
                                            value={documento_tercero} 
                                            onChange={this.handleChange} 
                                            disabled 
                                            className="bg-light"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            {this.state.variantAlert.map((t: any, i: number) => (
                                <Alert
                                    key={i}
                                    transition={true}
                                    variant={t}
                                    show={showAlert}
                                >
                                    {messageAlert}
                                </Alert>
                            ))}
                            
                            <Card className="mb-3 shadow-sm">
                                <Card.Header className="py-2">
                                <h6 className="mb-0">Datos del Aforo</h6>
                                </Card.Header>
                                <Card.Body>
                                    <Row >
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label >Tipo Aforo</Form.Label>
                                                <Form.Control 
                                                    disabled 
                                                    name="lastBarrio" 
                                                    value={nombreTipoAforo} 
                                                    onChange={this.handleChange} 
                                                    className="bg-light"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label >Concepto</Form.Label>
                                                <Form.Control 
                                                    disabled 
                                                    name="lastBarrio" 
                                                    value={nombreConcepto} 
                                                    onChange={this.handleChange} 
                                                    className="bg-light"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label >Estado aforo</Form.Label>
                                                <Form.Control 
                                                    as="select" 
                                                    name="estado" 
                                                    value={this.state.estado} 
                                                    disabled 
                                                    onChange={this.handleChange}
                                                    className="bg-light" 
                                                >
                                                    <option value="">Seleccione</option>
                                                    <option value="En Proceso">En Proceso</option>
                                                    <option value="Inactivo">Inactivo</option>
                                                    <option value="Pre-Liquidacion">Pre-Liquidacion</option>
                                                    {/* Si viene un estado diferente, mostrarlo también */}
                                                    {this.state.estado && 
                                                     !['En Proceso', 'Inactivo', 'Pre-Liquidacion', ''].includes(this.state.estado) && (
                                                        <option value={this.state.estado}>{this.state.estado}</option>
                                                    )}
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label >Vigencia Desde</Form.Label>
                                                <Form.Control 
                                                    placeholder="Vigencia" 
                                                    type="date" 
                                                    name="vigenciaDesde" 
                                                    value={vigenciaDesde} 
                                                    onChange={this.handleChange} 
                                                    required 
                                                    disabled={true}
                                                    className="bg-light" 
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    
                                    <Row >
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label >Vigencia Hasta</Form.Label>
                                                <Form.Control 
                                                    placeholder="Vigencia hasta" 
                                                    type="date" 
                                                    name="vigenciaHasta" 
                                                    value={vigenciaHasta} 
                                                    onChange={this.handleChange} 
                                                    required 
                                                    disabled={true}
                                                    className="bg-light" 
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label >Numero aforo</Form.Label>
                                                <Form.Control 
                                                    placeholder="numero aforo" 
                                                    name="numAforo" 
                                                    value={numAforo} 
                                                    onChange={this.handleChange} 
                                                    disabled
                                                    className="bg-light" 
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label >Fecha creación</Form.Label>
                                                <Form.Control 
                                                    placeholder="creación" 
                                                    type="date" 
                                                    name="fechaCreacion" 
                                                    value={fechaCreacion} 
                                                    onChange={this.handleChange} 
                                                    disabled
                                                    className="bg-light" 
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label >Fecha actualización</Form.Label>
                                                <Form.Control 
                                                    placeholder="actualizacion" 
                                                    type="date" 
                                                    name="fechaActualizacion" 
                                                    value={fechaActualizacion} 
                                                    onChange={this.handleChange} 
                                                    disabled={true}
                                                    className="bg-light" 
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                            
                            <Row>
                                <Col md={8}>
                                    <Form.Group >
                                        <Form.Label >Observaciones</Form.Label>
                                        <Form.Control 
                                            as="textarea" 
                                            rows={3} 
                                            name="observaciones" 
                                            value={observaciones} 
                                            onChange={this.handleChange} 
                                            required 
                                            className="border-primary"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4} className="d-flex align-items-end">
                                    <div className="mt-4 w-100">
                                        <div className="d-flex justify-content-end">
                                            <Link to="/aforos/normal/consultar">
                                                <Button 
                                                    variant="outline-primary" 
                                                    className="mr-3"
                                                    size='sm'
                                                >
                                                    <FaArrowLeft  /> Volver
                                                </Button>
                                            </Link> 
                                            <Button 
                                                variant="primary" 
                                                type="submit" 
                                                hidden={false} 
                                                disabled={!this.state.effectivePermissions?.EDIT}
                                                size='sm'
                                            >
                                            <FaSave className="mr-1" /> Guardar Cambios
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                )}
                    <hr />
                </Form>
                {/* end informacion basica */}
                {/* registro aforos */}
                <Button
                    variant="primary"
                    className="mr-5 "
                    name="detalle_registro_aforo"
                    onClick={this.changeAccordionStatus}>
                    {detalle_registro_aforo ? '--' : '+'} </Button><strong>Detalle Registro Aforos</strong>
                {detalle_registro_aforo && <div> <br />

                    <DetalleRegistroAforos
                        data={this.state.aforos_realizados}
                        tecnicoAforador={selects.tecnicoAforador}
                        aforos_pendientes={this.state.aforos_pendientes}
                        aforoId={this.state.numAforo}
                    />


                </div>}

                <hr />
                {/* end registro aforos */}
                {/* consolidado aforos */}
                <Button

                    variant="primary"
                    className="mr-5"
                    name="consolidado_aforos"
                    onClick={this.changeAccordionStatus}
                >{consolidado_aforos ? '--' : '+'}</Button>
                <strong>Consolidado Aforos</strong>
                {consolidado_aforos && <div style={{ marginBottom: "50px" }} className="section-form-4"> <br />
                    <ConsolidadoAforos
                        // data={this.state.aforos_consolidados}
                        tiposAforo={selects.tiposAforo}
                        // totales={this.state.aforos_consolidados.totales}
                        idAforo={numAforo}
                    />

                </div>}{/* end consolidado aforos */}
                <div style={{ marginBottom: "50px" }}></div>

                <Modal show={showModalSave} onHide={this.handleModalSaveClose} centered animation={false} >
                    <Modal.Header closeButton>
                        <Modal.Title>Aforo N° {numAforo}</Modal.Title>
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
            </div>
        )
    }
}

const mapTostateToprops = state => {
    return {
        selects: state.selects,
    }
}

const mapTodispatchToprops = dispatch => {
    return {
        actions: bindActionCreators({ loadBarrio, loadTipoGenerador, loadTiposAforo, loadTecnicoAforador, loadEstado, loadActividad, loadRutaMicroMacro }, dispatch)
    }
}

export default connect(mapTostateToprops, mapTodispatchToprops)(EditarAforo)



