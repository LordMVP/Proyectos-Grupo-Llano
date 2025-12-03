import * as React from 'react';
import {Button} from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import paginationFactory from "react-bootstrap-table2-paginator";

interface IProps{
    valorkey:any,
    datos:any[],
    editar:(value : any)=>void,
    encabezado:string[]
}

class TableFormatoBootstrap extends React.Component<IProps,any>
{
    constructor(props:IProps)
    {
        super(props);
        this.state={
            valorSeleccion:{},
            value:'',
            paginador:[],
        };
        this.getEncabezado=this.getEncabezado.bind(this);
        this.formatoBotton=this.formatoBotton.bind(this);
    }

    componentDidMount() 
    {
        this.getEncabezado();
    }

    formatoBotton( cell:any,row:any)
    {
        //console.log(cell);
        return <Button variant="success" key={cell} onClick={ this.seleccion.bind(this,row)}>Editar</Button>;
    }

    formatoGeneral(cell:any)
    {  
        return cell.tipDescripcion;
    }

    formatoGeneral2(cell:any)
    {
        let resultado='';
        for(let tmp in cell)
        {
            if(typeof cell[tmp] === 'string')
            {
                resultado=cell[tmp];
            }
        }
        return resultado;
        
        
    }

    seleccion(e:any)
    {
        //this.props.editar(e);
        //console.log(e);
        this.props.editar(e);
    }

    getEncabezado()
    {
        var encabezado = this.props.encabezado;
        return encabezado.map((row : any, index : number)=>{
            var tmp=row;
            var tmp2=tmp.lastIndexOf(".");
            if(tmp2>0)
            {
                let nombre1=row.substring(0, tmp2);
                return <TableHeaderColumn key={index} dataAlign="center" dataField={nombre1} dataFormat={this.formatoGeneral2} dataSort={true} >
                    {nombre1}
                    </TableHeaderColumn>
            }
            else
            {
            return <TableHeaderColumn key={index} dataAlign="center" dataField={row} dataSort={true}>
                    {row}
                    </TableHeaderColumn>
            }        
        })
    }

    render()
    {   
        return(
            <div className="table-responsive">

                        <BootstrapTable data-mobile-responsive="true" wrapperClasses="table" data={this.props.datos} striped={true} hover={true} pagination={paginationFactory({})} keyField={this.props.valorkey} noDataIndication="No Hay Informacion...">                                
                                        <TableHeaderColumn dataAlign="center" dataField="button" dataFormat={this.formatoBotton}>Editar</TableHeaderColumn> 
                                        {this.getEncabezado()}
                        </BootstrapTable>          
            </div>
        );
    }

}

export default TableFormatoBootstrap;
