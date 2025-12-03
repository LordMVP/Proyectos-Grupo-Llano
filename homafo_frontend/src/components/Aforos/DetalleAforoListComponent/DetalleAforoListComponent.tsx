import React, { Fragment, useEffect, useState } from 'react';
//import PARAMETROS from '../../../data/constantes';
//import DetalleAforoDTO from '../../../models/dto/DetalleAforoDTO';
//import { PageableRequest, PageT } from '../../../models/dto/Pagination';
//import DataTableComponent from '../../utils/DataTableComponent/DataTableComponent';
import { Row,Col } from 'react-bootstrap';

import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";

/*
[
            {
                name: 'Id',
                selector: "dafoIderegistro",
                sortable: true,
                width: '10%',
                cell: (row: DetalleAforoDTO) => { return row.dafoIderegistro }
            },
            {
                name: 'Aforo',
                selector: "aforo",
                sortable: true,
                width: '10%',
                cell: (row: DetalleAforoDTO) => { return row.aforo }
            },
            {
                name: 'Suscripcion',
                selector: "dsusIderegistr",
                sortable: true,
                width: '10%',
                cell: (row: DetalleAforoDTO) => { return row.dsusIderegistr }
            },
            {
                name: 'Codigo',
                sortable: true,
                width: '15%',
                cell: (row: DetalleAforoDTO) => { return row.dsusResource.dsusPcodigo }
            },
            {
                name: 'Documento',
                sortable: true,
                width: '10%',
                omit:true,
                cell: (row: DetalleAforoDTO) => { return row.dsusResource.terceroDocumento }
            },
            {
                name: 'Nombre',
                sortable: true,
                width: '25%',
                cell: (row: DetalleAforoDTO) => { return row.dsusResource.terceroNombreCompleto }
            },

            {
                name: '% Participacion',
                sortable: true,
                width: '10%',
                cell: (row: DetalleAforoDTO) => { return row.dafoMultiusuporcentaje }
            },
            {
                name: '% Vol.mt3',
                sortable: false,
                width: '10%',
                omit: params?.volumenGenerado === undefined,
                // {(Math.round(totalConsolidado as number * 100)/100).toFixed(2)}
                cell: (row: DetalleAforoDTO) => { 
                            const valor = (Number(row.dafoMultiusuporcentaje) / 100) * params?.volumenGenerado;
                            return (valor as number)?.toFixed(6);
                 }
            },
            {
                name: '% Tafna',
                sortable: true,
                width: '10%',
                omit: params?.tafna === undefined,
                cell: (row: DetalleAforoDTO) => {
                    const valor = (Number(row.dafoMultiusuporcentaje) / 100) * params?.tafna; 
                    return (valor as number )?.toFixed(6);
                }
            },
        ]
*/


const columns = (params?: any): any[] => {
    return (
        [
            {
                dataField: "dafoIderegistro",
                text: "Id",
                short: true,
                align: "center",
                headerAlign: 'center',
                editable: false,
                footerAlign: 'center', 
                footer:"total"
            },
            {
                dataField: "aforo",
                text: "Aforo",
                short: true,
                align: "center",
                headerAlign: 'center',
                editable: false,
                footerAlign: 'center',
                footer:"" 
            },
            {
                dataField: "dsusIderegistr",
                text: "Suscripcion",
                short: true,
                align: "center",
                headerAlign: 'center',
                editable: false,
                footerAlign: 'center', 
                footer:""
            },
            {
                dataField: "dsusResource.dsusPcodigo",
                text: "Codigo",
                short: true,
                align: "center",
                headerAlign: 'center',
                editable: false,
                footerAlign: 'center',
                footer:"" 
            },
            {
                dataField: "dsusResource.terceroNombreCompleto",
                text: "Nombre",
                short: true,
                align: "center",
                headerAlign: 'center',
                editable: false,
                footerAlign: 'center', 
                footer:""
            },
            {
                dataField: "dafoMultiusuporcentaje",
                text: "% Participacion",
                short: true,
                align: "center",
                headerAlign: 'center',
                editable: false,
                footerAlign: 'center',
                footer:row=>{return (row.reduce((a,i)=>{
                    return a + parseFloat(i) 
                },0))?.toFixed(6)}
            },
            {
                dataField:"dafoMultiusuporcentaje",
                formatter:(row)=>{return  ((Number(row) / 100) * params?.volumenGenerado)?.toFixed(6)},
                text: "% Vol.mt3",
                short: true,
                align: "center",
                headerAlign: 'center',
                editable: false,
                footerAlign: 'center',
                hidden: params?.volumenGenerado === undefined,
                footer:()=>{return params?.volumenGenerado?.toFixed(6)} 
            },
            {
                dataField:"dafoMultiusuporcentaje",
                formatter:(row)=>{return ((Number(row) / 100) * params?.tafna)?.toFixed(6)},
                text: "Tafna",
                short: true,
                align: "center",
                headerAlign: 'center',
                editable: false,
                footerAlign: 'center',
                hidden: params?.tafna === undefined,
                footer:()=>{return params?.tafna} 
            }
        ]
    );
};

type PeliquidacionDetalleType = {
    tafna: number;
    volumenGenerado: number;
    onConfirmar: any;
}

type DetalleAforoListComponentProps = {
    //onAdd?:any;
    detalles?: any;//PageT<DetalleAforoDTO>;
    preliquidar?: PeliquidacionDetalleType;
}

function DetalleAforoListComponent(props: DetalleAforoListComponentProps) {
    //const [detalles, setDetalles] = useState<PageT<DetalleAforoDTO>>();
    //const [loading] = useState<boolean>(false);
    //const [tTafna,setTtafna]=useState<any>(0);
    //const [vVolumen,setVvolumen]=useState<any>(0);
    const [listaDetalle,setListaDetalle]=useState<any>([]);
    

    useEffect(() => {
        console.log("propssss")
        console.log(props)
        setListaDetalle(props.detalles == undefined ? [] : props.detalles.content)
        //setDetalles(props.detalles)
        //setTtafna(props.preliquidar?.tafna)
        //setVvolumen(props.preliquidar?.volumenGenerado)
    }, [props.detalles,props.preliquidar?.tafna,props.preliquidar?.volumenGenerado,props.detalles?.content]);

    /*const onUpdate = (pageable: PageableRequest) => {
        console.log(pageable);
    }*/
    const confirmarLiquidacion = (state:number) => {
        props.preliquidar?.onConfirmar(state);
    }
    /*const onSelect = (row:any) =>{
        console.log(row);
    }*/
    return (
        <Fragment>
            <Row>
                <Col>
                    {/*<DataTableComponent
                        columns={columns(props.preliquidar)}
                        page={detalles}
                        loading={loading}
                        onUpdate={onUpdate}
                        customStyles={PARAMETROS.DATATABLES_CUSTOM_STYLE}
                    >
                    </DataTableComponent>*/}
                    <BootstrapTable
                    id={"tbDetalleAforo"}
                    data={listaDetalle}
                    keyField="id"
                    columns={columns(props.preliquidar)}
                    bootstrap4
                    striped={true}
                    hover={true}
                    pagination={paginationFactory({})}
                    ></BootstrapTable>

                </Col>
            </Row>
            {/*<Row>
                <Col sm={{span:2,offset:6}}>
                        <Form.Text muted> 
                            Total General:
                        </Form.Text>
                    </Col>
                <Col sm={1}>
                        { (props.detalles?.content.reduce((a:number,i:DetalleAforoDTO):any=>{
                            return a + Number(i.dafoMultiusuporcentaje)  ;  
                        },0))?.toFixed(3) }
                    </Col>
                <Col sm={1}>
                        { vVolumen ? (props.detalles?.content.reduce((a:number,i:DetalleAforoDTO):any=>{
                            return a + ((Number(i.dafoMultiusuporcentaje)/100) * vVolumen) ;  
                        },0))?.toFixed(6) : <p></p>}
                    </Col>
                    <Col sm={1}>
                        { tTafna ?  (props.detalles?.content.reduce((a:number,i:DetalleAforoDTO):any=>{
                            return a + (( Number(i.dafoMultiusuporcentaje) /100 ) * tTafna) ;  
                        },0))?.toFixed(6) : <p></p> }
                    </Col>
            </Row>*/}
            <Row>
                { props.preliquidar && 
                <div className="col-md-12 pt-4" >
                    <button onClick={()=>confirmarLiquidacion(1)} type="button" className="btn btn-success btn-md btn-block">Confirmar Liquidacion</button>
                    <button onClick={()=>confirmarLiquidacion(0)} type="button" className="btn btn-danger btn-md btn-block">Cancelar Liquidacion</button>
                </div>
                }
            </Row>

        </Fragment>
    );

}

export default DetalleAforoListComponent;