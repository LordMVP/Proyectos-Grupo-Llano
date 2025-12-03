import * as React from 'react';
import {Button} from 'react-bootstrap';
//import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";

interface IProps{
    valorkey:any,
    datos:any[],
    editar:(value : any)=>void,
    //encabezado:string[],
    columnas:any[]
}

class TableBootstrapV2 extends React.Component<IProps,any>
{
    constructor(props:IProps)
    {
        super(props);
        this.state={
            valorSeleccion:{},
            value:'',
            paginador:[],
            columnasTabla:[],
            columnaEditar:{
                dataField: "Editar",
                text: "Editar",
                align: 'center',
                formatter: (rowContent, row) => {
                    return (    
                        <Button variant="success" key={rowContent} onClick={this.seleccion.bind(this,row)}>Adjuntos</Button>
                    )
                  }
              }
        };
    }

    componentDidMount() 
    {
    }

    seleccion(e:any)
    {
        this.props.editar(e);
    }

    render()
    {   
        return(
            <div className="table-responsive">

                        <BootstrapTable
                         data-mobile-responsive="true"
                         wrapperClasses="table"
                         columns={this.props.columnas}
                         data={this.props.datos} 
                         striped={true}
                         hover={true}
                         pagination={paginationFactory({})}
                         keyField={this.props.valorkey}
                         noDataIndication="No Hay Informacion..."/>         
            </div>
        );
    }

}

export default TableBootstrapV2;
