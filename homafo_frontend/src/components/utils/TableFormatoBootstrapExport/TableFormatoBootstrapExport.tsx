import * as React from 'react';
import {Button} from 'react-bootstrap';
//import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider/*, { CSVExport }*/ from 'react-bootstrap-table2-toolkit';

interface IProps{
    valorkey:any,
    datos:any[],
    editar:(value : any)=>void,
    encabezado:string[]
}

class TableFormatoBootstrapExport extends React.Component<IProps,any>
{
    constructor(props:IProps)
    {
        super(props);
        this.state={
            valorSeleccion:{},
            value:'',
            paginador:[],
            //columnas:[],            
            columnas:[
                {
                    dataField: "Editar",
                    text: "Editar",
                    align: 'center',
                    formatter: (rowContent, row) => {
                        return (    
                            <Button variant="success" key={rowContent} onClick={ this.seleccion.bind(this,row)}>Editar</Button>
                        )
                      }
                },
                {
                    dataField: "Codigo",
                    text: "Codigo",
                    sort: true,
                    align: 'center',
                  },
                {
                dataField: "Identificacion",
                text: "Identificacion",
                align: 'center'
              },
              {
                dataField: "Nombres",
                text: "Nombres",
                align: 'center'
              },
              {
                dataField: "Direccion",
                text: "Direccion",
                sort: true,
                align: 'center',
              },
              {
                dataField: "Catastral",
                text: "Catastral",
                sort: true,
                align: 'center',
              },
              {
                dataField: "Estrato",
                text: "Estrato",
                sort: true,
                align: 'center',
              },
              {
                dataField: "Ciclo",
                text: "Ciclo",
                sort: true,
                align: 'center',
              },
              {
                dataField: "Clase",
                text: "Clase",
                sort: true,
                align: 'center',
              },
              {
                dataField: "Fecha",
                text: "Fecha",
                sort: true,
                align: 'center',
              },
              {
                dataField: "Convenio",
                text: "Convenio",
                sort: true,
                align: 'center',
              },
              {
                dataField: "Barrio",
                text: "Barrio",
                sort: true,
                align: 'center',
              },
              {
                dataField: "Medidor",
                text: "Medidor",
                sort: true,
                align: 'center',
              },
              {
                dataField: "codigoAltEmpresa",
                text: "codigo empresa Alterna",
                sort: true,
                align: 'center',
                hidden: true
              },
              {
                dataField: "fechaAltEmpresa",
                text: "fecha inicio Alterna",
                sort: true,
                align: 'center',
                hidden: true
              },
              {
                dataField: "medidorAltEmpresa",
                text: "medidor Alterna",
                sort: true,
                align: 'center',
                hidden: true
              }

            ],
            

        };
        this.getEncabezado=this.getEncabezado.bind(this);
        this.formatoBotton=this.formatoBotton.bind(this);
    }

    async componentDidMount() 
    {   
        //await this.getEncabezadoNext();
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

    getEncabezadoNext=async()=>
    {
       let editar={
                dataField: "Editar",
                text: "Editar",
                align: 'center',
                formatter: (rowContent, row) => {
                    return (    
                        <Button variant="success" key={rowContent} onClick={ this.seleccion.bind(this,row)}>Editar</Button>
                    )
                  }
              }
        await this.setState({
            columnas:[...this.state.columnas,editar]
        })       
       for(let item in this.props.encabezado)
       {
        let tmp={
            dataField: this.props.encabezado[item],
            text: this.props.encabezado[item],
            align: 'center'
        }
        await this.setState({
            columnas:[...this.state.columnas,tmp]
        })
       }
       return this.state.columnas; 
    }

    getEncabezado()
    {
    }

    descargar=(onExport:any)=>
    {
        console.log('que llego ',onExport);
    }

    render()
    {
    //const { ExportCSVButton } = CSVExport;   

        return(
            <ToolkitProvider
                keyField={this.props.valorkey}
                data={ this.props.datos }
                columns={ this.state.columnas }
                exportCSV
                >
                    {
                        props=>(
                            <React.Fragment>
                                <MyExportCSV { ...props.csvProps } />
                                <hr />
                                <BootstrapTable { ...props.baseProps }  data-mobile-responsive="true" wrapperClasses="table"s striped={true} hover={true} pagination={paginationFactory({})} keyField={this.props.valorkey} noDataIndication="No Hay Informacion..." >                                
                                                </BootstrapTable> 
                            </React.Fragment>
                        )
                    }
                </ToolkitProvider>
            
        );
    }

}

export default TableFormatoBootstrapExport;

const MyExportCSV = (props) => {
    const handleClick = () => {
      props.onExport();
    };
    return (
      <div>
        <button className="btn btn-primary" onClick={ handleClick }>Click para Exportar CSV</button>
      </div>
    );
  };
