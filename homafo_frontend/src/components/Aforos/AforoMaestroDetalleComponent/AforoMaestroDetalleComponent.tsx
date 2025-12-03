import React, { Fragment, useState } from "react";
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import PARAMETROS from "../../../data/constantes";
import AforoPreLiquidacionResponse from "../../../models/dto/AforoPreLiquidacionResponse";
import DetalleConceptoVisitaResource from "../../../models/dto/DetalleConceptoVisitaResource";
import DetalleMaestroVisita from "../../../models/dto/DetalleMaestroVisita";
import MaestroVisitasResource from "../../../models/dto/MaestroVisitasResource";
import UtilsFunction from "../../utils/UtilsFunction";
import './AforoMaestroDetalleComponent.css' 

import {Container,Col,Row, Form} from "react-bootstrap"

const DIV_TONELADAS=1000;


type AforoMaestroDetalleComponentProps = {
    preliquidacion: AforoPreLiquidacionResponse;
}

function AforoMaestroDetalleComponent(props: AforoMaestroDetalleComponentProps) {

    const [maestro, setMaestro] = useState<MaestroVisitasResource>();
    const [tipoAforo,setTipoAforo]=useState(false)   

    const columns = [
        {
            name: 'Visita',
            selector: "dmavConsecutivovisita",
            sortable: true,
            width: '10%',
            cell: (row: DetalleMaestroVisita) => { return row.dmavConsecutivovisita }
        },
        {
            name: 'Fecha Visita',
            selector: "dmafFechavisita",
            sortable: true,
            width: '15%',
            cell: (row: DetalleMaestroVisita) => { return UtilsFunction.formatDate(row.dmafFechavisita) }
        },
        {
            name: 'Tecnico aforador',
            selector: "terAforadorNombre",
            sortable: true,
            width: '35%',
            cell: (row: DetalleMaestroVisita) => { return row.terAforadorNombre; }
        },
        {
            name: 'Vol. mt3',
            sortable: true,
            width: '15%',
            cell: (row: DetalleMaestroVisita) => {
                return (row.detalles.reduce((sum, row) => sum + row.dcvaVolumenaforo, 0))?.toFixed(6);
            },
            footerAlign: 'center',
              footer:0,
        },
        {
            name: 'Peso Kg',
            sortable: true,
            width: '15%',
            cell: (row: DetalleMaestroVisita) => {
                return ( row.detalles.reduce((sum, row) => sum + row.dcvaPesoaforo, 0) as number )?.toFixed(6);
            },
            footerAlign: 'center',
              footer:0,
            omit:!tipoAforo
        },
        {
            name: 'Peso Ton',
            sortable: true,
            width: '15%',
            cell: (row: DetalleMaestroVisita) => {
                return ((row.detalles.reduce((sum, row) => sum + row.dcvaPesoaforo, 0))/DIV_TONELADAS)?.toFixed(6);
            },
            footerAlign: 'center',
              footer:0,
            omit:!tipoAforo
        },
    ];
    
    //const [preliquidacion, setPreliquidacion] = useState<AforoPreLiquidacionResponse>();

    useEffect(() => {
        setMaestro(props.preliquidacion?.maestroVisitas);
        setTipoAforo(props.preliquidacion?.tipoAforo==PARAMETROS.CLASES.CLASE_AFORO_MULTIPLE)
        
        //setPreliquidacion(props.preliquidacion);        
    }, [props.preliquidacion])

   
    return (
        <Fragment>
            <DataTable
                title="Registro Visitas"
                data={maestro?.detallesMaestroVisita as DetalleMaestroVisita[]}
                columns={columns}
                expandableRows={true}
                expandableRowsComponent={<AforoMaestroDetalleVisitaComponent />}
                customStyles={PARAMETROS.DATATABLES_CUSTOM_STYLE}
                dense
            />
            <Container>
                < hr/>
                <Row>
                    <Col sm={{span:2,offset:5}}>
                        <Form.Text muted>
                            Total General:
                        </Form.Text>
                    </Col>
                    <Col sm={{span:1}}>
                            {   (maestro?.detallesMaestroVisita?.reduce((a:number,i:DetalleMaestroVisita):number=>{                                
                                return a + i.detalles.reduce((sum, row) => sum + row.dcvaVolumenaforo, 0) ;
                            },0))?.toFixed(6)
                            }
                    </Col>
                    <Col sm={{span:1, offset:1}}>
                            {props.preliquidacion?.tipoAforo === PARAMETROS.CLASES.CLASE_AFORO_MULTIPLE ? 
                            (maestro?.detallesMaestroVisita?.reduce((acum:number,i2:DetalleMaestroVisita):number=> {                 
                                return acum + i2.detalles.reduce((sum, row) => sum + row.dcvaPesoaforo, 0);
                            }, 0))?.toFixed(6) 
                            : <p></p>
                            }
                    </Col>
                    <Col sm={{span:1, offset:1}} className="d-flex text-right">
                            {props.preliquidacion?.tipoAforo === PARAMETROS.CLASES.CLASE_AFORO_MULTIPLE? 
                            (maestro?.detallesMaestroVisita?.reduce((acum:number,i2:DetalleMaestroVisita):number=> {                 
                                return acum + (i2.detalles.reduce((sum, row) => sum + row.dcvaPesoaforo, 0) / DIV_TONELADAS);
                            }, 0))?.toFixed(6) : <p></p>}
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )

}

type AforoMaestroDetalleVisitaComponentProps = {
    data?: DetalleMaestroVisita
}

const columnsDetalle = [
    {
        name: 'Concepto',
        selector: "uniConceptoNombre",
        sortable: true,
        width: '35%',
        cell: (row: DetalleConceptoVisitaResource) => { return row.uniConceptoNombre }
    },
    {
        name: 'Cantidad',
        selector: "dcvaCantidadconcepto",
        sortable: true,
        cell: (row: DetalleConceptoVisitaResource) => { return row.dcvaCantidadconcepto }
    },
    {
        name: 'Peso (Kg)',
        selector: "dcvaPesoaforo",
        sortable: true,
        cell: (row: DetalleConceptoVisitaResource) => { return row.dcvaPesoaforo }
    },
    {
        name: 'Volumen',
        selector: "dcvaVolumenaforo",
        sortable: true,
        cell: (row: DetalleConceptoVisitaResource) => { return row.dcvaVolumenaforo }
    },
    {
        name: 'Observacion',
        selector: "dcvaObservaciones",
        sortable: true,
        width: '20%',
        cell: (row: DetalleConceptoVisitaResource) => { return row.dcvaObservaciones }
    },

];

function AforoMaestroDetalleVisitaComponent(props: AforoMaestroDetalleVisitaComponentProps) {

    return (
        <Fragment>
            <div className="card shadow mt-3 mb-3 bg-body rounded border-primary">
                <div className="card-body" >
                    <DataTable
                        title="Conceptos registrados en la visita"
                        data={props.data?.detalles as DetalleConceptoVisitaResource[]}
                        columns={columnsDetalle}
                        dense
                        theme="dark"

                    />
                </div>
            </div>

        </Fragment>
    )
}
export default AforoMaestroDetalleComponent;