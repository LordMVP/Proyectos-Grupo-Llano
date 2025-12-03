import React, { Component } from 'react'
import { Form, Col, Button, ButtonToolbar } from 'react-bootstrap'
import { Typeahead  } from 'react-bootstrap-typeahead';
// import * as API from '../../api/aforosMulti'
import * as API from '../../api/aforos/selectMultiusuario'

type changeEventElement = React.ChangeEvent<HTMLInputElement>;

type SearchState = { 
    idMultiusuario: string; 
    codMultiusuario: string; 
    nombreMulti:[],
    nombreMultiSelected: [{id:number,object:string}]; 
    estado: string; 
    loading: boolean; 
};


export default class AforosSearch extends Component<{onSubmit:any,clear:any },SearchState> {

    constructor(props) {
        super(props)
        this.state = {
            idMultiusuario:"",
            codMultiusuario:"",
            nombreMulti:[],
            nombreMultiSelected:[{id:0,object:""}],
            estado:"",
            loading: false }
    }

    onSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        this.props.onSubmit(this.state)

    }
    handleChange = (event: changeEventElement)=> this.setState({ [event.target.name]: event.target.value } as any)
    

    
    searchLimit =(event,selected)=>{ 
        console.log("keydown event",event.target.value)
        if(event.target.value.length >= 2){ 

            API.getNombresMulti(event.target.value).then(response => {console.log(response); this.setState({nombreMulti:response.data})})
            .catch(err => { console.log(err)});
            
        }
        if(selected !== undefined){
            this.setState({nombreMultiSelected:selected[0].object || ""}) 
            console.log("state",this.state)
        }
    }
    

    render() {
        const {
            idMultiusuario,
            codMultiusuario,
            nombreMulti,
            estado }=this.state

        return (<div>
            <hr/>
            <br/>
            <Form className="mb-2" onSubmit={this.onSubmit}>
            <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>ID MultiUsuario</Form.Label>
                    <Form.Control placeholder="ID" name="idMultiusuario" value={idMultiusuario} onChange={this.handleChange} />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Código Suscripción</Form.Label>
                    <Form.Control placeholder="Codigo Multiusuario" name="codMultiusuario" value={codMultiusuario}  onChange={this.handleChange} />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridNom">
                        <Form.Label>Tercero Nombres/Apellidos</Form.Label>
                        <Typeahead
                        id="nombreMulti-typeahead"
                        emptyLabel="No hay resultados"
                        labelKey="object"
                        name="nombreMulti"
                        value={nombreMulti}
                        multiple={false}
                        onChange={(selected:[{ id: number;  object: string; }]) => { this.setState({nombreMultiSelected:selected});}}
                        onKeyDown={(event: Event,selected:any)=>{this.searchLimit(event,selected)}}
                        // options={  this.state.nombres_apellidotercer}
                        options={  this.state.nombreMulti}
                        placeholder="nombre Multiusuario"/>
                    </Form.Group>

                <Form.Group md="2" as={Col} controlId="formGridState">
                    <Form.Label>Estado</Form.Label>
                    <Form.Control as="select" name="estado" value={estado}  onChange={this.handleChange} >
                            <option value=""> ---- </option>
                            <option>Activo</option>
                            <option>Inactivo</option>
                    </Form.Control>
                </Form.Group>
            </Form.Row>
            
            <ButtonToolbar >
                <Button variant="primary" className="mr-2" type="submit">Buscar</Button>
                <Button variant="primary" type="reset"   onClick={() => this.props.clear()}>Limpiar</Button>
            </ButtonToolbar>
        </Form >
        </div>)
    }
}
