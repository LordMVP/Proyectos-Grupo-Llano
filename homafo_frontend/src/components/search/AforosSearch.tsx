import React, { Component } from 'react';
import { Form, Col, Button, ButtonToolbar } from 'react-bootstrap';
import { Typeahead  } from 'react-bootstrap-typeahead';
import * as API from '../../api/aforos/select'

type  changeEventElement = React.ChangeEvent<HTMLInputElement>;
type AforosSearchState = {
    suscripcion: string;
    codigoSub: string;
    numAforo:string;
    nombres_apellidotercer:[];
    nombresTercerSelected:[{ id: number; object: string; }];
    documento_tercer:string;
    ubicacion:string;
    estrato:string;
    direccion:  string;
    municipio:any;
    Barrios:[];
    numCatastral:string;
    tipo_Uso:string;
    ciclo:string;
    ruta:string;
    catastral:string;
    estado:string;
    barrio:[{ id: number; object: string; }];
    municipios:any;
    stoYSena:string;
    fechaInicio:string;
    fechaFin:string;
    };

export default class AforosSearch extends Component<{onSubmit:any, clear:any,selects:any},AforosSearchState> {

    constructor(props) {
        super(props)
        this.state = {
            suscripcion:"",
            codigoSub:"",
            numAforo:"",
            nombres_apellidotercer:[],
            nombresTercerSelected:[{id:0, object:""}],
            documento_tercer:"",
            ubicacion:"",
            estrato:"",
            direccion: "",
            municipio:" ",
            barrio:[{id:0, object:""}],
            numCatastral:"",
            tipo_Uso:"",
            ciclo:"",
            ruta:"",
            catastral:"",
            estado:"",
            Barrios:[],
            municipios:[],
            stoYSena:"",
            fechaInicio:"",
            fechaFin:"",

         }
    }

    //_nombreTercero = React.createRef<Typeahead>();
    _nombreTercero:any = React.createRef();
    _barrio:any=React.createRef();

    searchLimit =(event,selected)=>{ 
        if(selected=== undefined){
            this.setState({nombresTercerSelected: [{id:0, object:""}]}) 
            selected=""
        }
        console.log("keydown event",event.target.value)
        if(event.target.value.length >= 2){ 
            API.getTercerNombres(event.target.value).then(response => {
                if(response.success===true){

                    console.log(response); this.setState({nombres_apellidotercer:response.data})
                }else{ this.setState({nombres_apellidotercer:[]})}
            }).catch(err => { console.log(err)});  
        }
    }

    handleChange = (event: changeEventElement)=> {

        this.setState({ [event.target.name]: event.target.value } as any)
        if(event.target.name === "municipio" ){

            const idMunicipio =event.target.value.split("&")[0] || "0"
            API.getBarrios(idMunicipio)
              .then( response => {
                  if(response === null){
                      this.setState({Barrios:[]})
                  }else{ 
                      this.setState({Barrios:response})} 
              }).catch(error => { return Promise.reject(error); });
        } 
    }//end handlechange

onSubmit = async (e : any) => {
    console.log("state--::",this.state)
     e.preventDefault()
     const objectMunicipio = this.state.municipio.split("&")[1] || ""
     let objectNombres =""
     let objectBarrio =""
     if(this.state.nombresTercerSelected.length){objectNombres= this.state.nombresTercerSelected[0].object}else{ objectNombres= ""} 
     if(this.state.barrio.length){objectBarrio= this.state.barrio[0].object}else{ objectBarrio= ""} 
     this.props.onSubmit({
        suscripcion:this.state.suscripcion,
        codigoSub:this.state.codigoSub,
        nombres_apellidotercer:objectNombres,
        numAforo:this.state.numAforo,
        documento_tercer:this.state.documento_tercer,
        ubicacion:this.state.ubicacion,
        estrato:this.state.estrato,
        direccion: this.state.direccion,
        municipio:objectMunicipio,
        barrio:objectBarrio,
        numCatastral:this.state.numCatastral,
        tipo_Uso:this.state.tipo_Uso,
        ciclo:this.state.ciclo,
        ruta:this.state.ruta,
        catastral:this.state.catastral,
        estado:this.state.estado,
        stoYSena:this.state.stoYSena,
        fechaInicio:this.state.fechaInicio,
        fechaFin:this.state.fechaFin,
     })
    } //end onsubmit

    limpiar= async()=>
    {
        await this.setState({
            suscripcion:"",
            codigoSub:"",
            numAforo:"",
            nombres_apellidotercer:[],
            nombresTercerSelected:[{id:0, object:""}],
            documento_tercer:"",
            ubicacion:"",
            estrato:"",
            direccion: "",
            municipio:" ",
            barrio:[{id:0, object:""}],
            numCatastral:"",
            tipo_Uso:"",
            ciclo:"",
            ruta:"",
            catastral:"",
            estado:"",         
            stoYSena:"",
            fechaInicio:"",
            fechaFin:"",   
         }) 
         this.props.clear();
         //this._nombreTercero.current.state.selected= [];
         this._nombreTercero.current.clear();
         this._barrio.current.clear();
    }
    
    render():JSX.Element {
        
        const{suscripcion,
            codigoSub,
            numAforo,
            nombres_apellidotercer,
            documento_tercer,
            ubicacion,
            estrato,
            direccion,
            municipio,
            barrio,
            numCatastral,
            tipo_Uso,
            ciclo,
            ruta,
            catastral,
            estado,
            stoYSena,
            fechaInicio,
            fechaFin,
         }=this.state

        return (<div>
            <hr/><br/>
            <Form className="mb-2" onSubmit={this.onSubmit}>
                <Form.Row>
                    <Form.Group as={Col} controlId="formGridSus" md="2" >
                        <Form.Label>Suscripcion</Form.Label>
                        <Form.Control placeholder="id suscripcion" name="suscripcion" value={suscripcion} onChange={this.handleChange}  />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCod" md="2" >
                        <Form.Label>Codigo Suscripcion</Form.Label>
                        <Form.Control placeholder="Codigo Suscripcion" name="codigoSub" value={codigoSub} onChange={this.handleChange} />
                    </Form.Group>
                    
                    <Form.Group as={Col} controlId="formGridNom" md="2" >
                        <Form.Label>Numero Aforo</Form.Label>
                        <Form.Control placeholder="Numero aforo" name="numAforo" value={numAforo} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridDoc" md="2">
                        <Form.Label>Documento Tercero</Form.Label>
                        <Form.Control placeholder="Documento tercero" name="documento_tercer" value={documento_tercer} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridNom">
                        <Form.Label>Tercero Nombres/Apellidos</Form.Label>
                        <Typeahead
                        id="nombres-typeahead"
                        emptyLabel="No hay resultados"
                        labelKey="object"
                        name="TerceroNombres"
                        value={nombres_apellidotercer}
                        multiple={false}
                        onChange={(selected:[{ id: number;  object: string; }]) => { this.setState({nombresTercerSelected:selected}); console.log('cambio segundo');}}
                        onKeyDown={(event: Event,selected:any)=>{this.searchLimit(event,selected)}}
                        options={  this.state.nombres_apellidotercer}
                        placeholder="Nombres/Apellidos"
                        ref={this._nombreTercero}/>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                <Form.Group as={Col} controlId="formGridState" md="2">
                        <Form.Label>Municipio</Form.Label>
                        <Form.Control as="select" name="municipio" value={municipio} onChange={this.handleChange}>
                            <option value="">------------</option>
                            {!!this.props.selects.Municipio.length && this.props.selects.Municipio.map((t: any) => {
                                return <option key={t.id} data-mid={t.id} value={t.id+"&"+t.object}> {t.object}</option>})
                            }
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridubic" md="1">
                        <Form.Label>Ubicación</Form.Label>
                        <Form.Control as="select" name="ubicacion" value={ubicacion} onChange={this.handleChange} >
                            <option></option>
                            {this.props.selects.Ubicacion.map((t: any, i: number) => {
                                return <option key={i} value={t.object}> {t.object}</option>})
                            } 
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridState" md="1">
                        <Form.Label>Estrato</Form.Label>
                        <Form.Control as="select" name="estrato" value={estrato} onChange={this.handleChange}>
                        <option value=""> </option>
                        {this.props.selects.Estrato.map((t: any, i: number) => {
                                return <option key={i} value={t.object}> {t.object}</option>})
                        }    
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>Barrio</Form.Label>
                        <Typeahead
                        id="barrio-typeahead"
                        emptyLabel="No hay resultados"
                        labelKey="object"
                        name="barrio"
                        value={barrio}
                        multiple={false}
                        onChange={(selected:[{id:number,object:string}]) => { this.setState({barrio:selected});}}
                        options={  this.state.Barrios}
                        placeholder="Barrio"
                        ref={this._barrio}
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Direccion</Form.Label>
                        <Form.Control name="direccion" value={direccion} onChange={this.handleChange} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} controlId="formGridText" md="2">
                        <Form.Label>Numero catastral</Form.Label>
                        <Form.Control placeholder=" numero Catastral" name="numCatastral" value={ numCatastral} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridEmail"  md="2"  >
                        <Form.Label> Catastral Internacional</Form.Label>
                        <Form.Control placeholder="Catastral" name="catastral"  value={catastral} onChange={this.handleChange} />
                    </Form.Group>
                   
                    <Form.Group as={Col} controlId="formGridState" md="2">
                        <Form.Label>Ciclo</Form.Label>
                        <Form.Control as="select" name="ciclo" value={ciclo} onChange={this.handleChange}>
                            <option></option>
                            { this.props.selects.Ciclo.map((t: any, i: number) => {
                                 return <option key={i} value={t.id}> {t.object}</option> })
                            } 
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridState" md="3">
                        <Form.Label>Ruta</Form.Label>
                        <Form.Control as="select" name="ruta" value={ruta} onChange={this.handleChange}>
                            <option></option>
                             {this.props.selects.Ruta.map((t: any, i: number) => {
                                 return <option key={i} value={t.id}> {t.object}</option> })
                             } 
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridState"  md="3" >
                        <Form.Label>Tipo de Uso</Form.Label>
                        <Form.Control as="select" name="tipo_Uso" value={tipo_Uso} onChange={this.handleChange}>
                            <option></option>
                             {this.props.selects.tipoUso.map((t: any, i: number) => {
                                 return <option  key={i} value={t.object}> {t.object}</option>})
                             } 
                        </Form.Control>
                    </Form.Group>
                    
                </Form.Row>
                <Form.Row>
                <Form.Group as={Col} controlId="formGridState" md="3">
                        <Form.Label>Estado</Form.Label>
                        <Form.Control as="select" name="estado" value={estado} onChange={this.handleChange}>
                            <option> ----- </option>
                            <option>Vigente</option>
                            <option>Vencido</option>
                            <option>Inactivo</option>
                            {/* {this.props.selects.Estado.map((t: any, i: number) => { return <option key={i} value={t.id}> {t.object}</option>})} */}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridText" md="2">
                        <Form.Label>Sto Y Seña</Form.Label>
                        <Form.Control placeholder="Sto Y Seña" name="stoYSena" value={stoYSena} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridText" md="2">
                        <Form.Label>Fecha Inicio</Form.Label>
                        <Form.Control type="date" name="fechaInicio" value={fechaInicio} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridText" md="2">
                        <Form.Label>Fecha Fin</Form.Label>
                        <Form.Control type="date" name="fechaFin" value={fechaFin} onChange={this.handleChange} />
                    </Form.Group>
                </Form.Row>
                <ButtonToolbar >
                    {/* <Button variant="primary"  className="mr-2"> Ver detalle Aforado</Button> */}
                    <Button variant="primary" className="mr-2" type="submit"> Buscar</Button>
                    <Button variant="primary" type="reset" onClick={this.limpiar}> Limpiar</Button>
                </ButtonToolbar>
            </Form >
        </div>
        )
    }
}
