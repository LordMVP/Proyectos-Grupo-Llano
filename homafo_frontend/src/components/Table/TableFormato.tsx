import * as React from 'react';
import { Table } from 'react-bootstrap';
import {Pagination, Button} from 'react-bootstrap';

interface IProps{
    datos:any[],
    editar:(value : any)=>void,
    encabezado:string[]
    //titulo:string,
    //accionBoton:()=>void,
    //estilo?:string
    //cambioValor:(value: React.ChangeEvent<HTMLSelectElement>)=>void;
    //datos:[]
}

class Lista extends React.Component<IProps,any>
{
    constructor(props:IProps)
    {
        super(props);
        this.state={
            value:'',
            paginador:[]
        };
        //this.accionBoton=this.accionBoton.bind(this);
        this.getLLaves=this.getLLaves.bind(this);
        this.getEncabezado=this.getEncabezado.bind(this);
        this.getDatosFila=this.getDatosFila.bind(this);
        this.paginationValores=this.paginationValores.bind(this);
    }

    componentDidMount() 
    {
        this.paginationValores();
        //this.getLista();
        //console.log(this.props.datos);

    }

    paginationValores()
    {
        for (let number = 1; number <= 5; number++) {
            this.state.paginador.push(
              <Pagination.Item key={number} active={number === 2}>
                {number}
              </Pagination.Item>,
            );
          }
    }

    getLLaves ()
    {
        //console.log(this.props.datos);
    }

    getEncabezado ()
    {
        //var tmp=this.getLLaves();
        var tmp=this.props.encabezado;
        //console.log(tmp);
        //var tmp2 = tmp.push('ver');
        //console.log(tmp2);
        var keys = tmp;
        //var keys = this.getLLaves();
            return keys.map((key :string)=>{
            return <th key={key}>{key}</th>
            })
            
    }

    getDatosFila()
    {
         var items = this.props.datos;
            var keys = this.props.encabezado
            return items.map((row : any, index : number)=>{
                return <tr key={index}><td><Button variant="success" onClick={ this.seleccion.bind(this,row)}>Editar</Button></td><RenderRow key={index} data={row} keys={keys}/></tr>
            })
    }

    seleccion(e:any)
    {
        this.props.editar(e);
    }

    render()
    {
        return(
            <div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Editar</th>
                            {this.getEncabezado()}
                            
                        </tr>
                    </thead>
                    <tbody>
                        {this.getDatosFila()}
                    </tbody>
                </Table>
            </div>
        );
    }
}

const RenderRow = (props :any ) =>{
    return props.keys.map((key : any)=>{
        return <td key={props.data[key]}>{props.data[key]}</td>
    })
}   

export default Lista;