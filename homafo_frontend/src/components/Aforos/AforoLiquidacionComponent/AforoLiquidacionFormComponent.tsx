import React, { Fragment, useEffect, useState } from "react";
import AforoPreLiquidacionResponse from "../../../models/dto/AforoPreLiquidacionResponse";
import PARAMETROS from "../../../data/constantes";
import DetalleMaestroVisita from "../../../models/dto/DetalleMaestroVisita";


type AforoLiquidacionFormComponentProps = {
    preliquidacion: AforoPreLiquidacionResponse;
    onConfirmar:any;
}

const DIV_TONELADAS=1000;

function AforoLiquidacionFormComponent(props: AforoLiquidacionFormComponentProps) {
    //const [totalConsolidado, setTotalConsolidado] = useState<number>();
    const [preliquidacion, setPreliquidacion] = useState<AforoPreLiquidacionResponse>();

    useEffect(() => {
        setPreliquidacion(props.preliquidacion);
        //const sumtotal = props.preliquidacion?.maestroVisitas?.detallesMaestroVisita?.reduce((sum, item) => sum + item.detalles.reduce((sum, item) => sum + item.dcvaVolumenaforo, 0), 0);
        //setTotalConsolidado(sumtotal);
    }, [props.preliquidacion])

    



    return (
        <Fragment>
            <h5>Resultado Liquidacion</h5>
            <table className="table">
                <thead>
                    <th>Descripcion</th>
                    <th>Valor</th>
                </thead>
                <tbody>
                    <tr key="1">
                        <td>
                            Total visitas:
                        </td>
                        <td>
                        {preliquidacion?.minimoVisitas as number
                        /* [JLMENDOZA] (Math.round(totalConsolidado as number * 100)/100).toFixed(2)*/}
                        </td>
                    </tr>
                    {preliquidacion?.tipoAforo == PARAMETROS.CLASES.CLASE_AFORO_MULTIPLE ? <tr key="2">
                        <td>
                            Cantidad Usuarios:
                        </td>
                        <td>
                            {preliquidacion?.detalleAforo?.length}
                        </td>
                    </tr>:
                    ""}     
                    <tr key="3">
                        <td>
                            Total Volumen:
                        </td>
                        <td>
                            { (preliquidacion?.totalVisitasConsolidado as number)?.toFixed(6) }                            
                        </td>
                    </tr> 
                    <tr key="4">
                        <td>
                            Total Volumen Prom:
                        </td>
                        <td>
                            { (preliquidacion?.volumenMedio as number)?.toFixed(6)}                            
                        </td>
                    </tr> 
                    {preliquidacion?.tipoAforo == PARAMETROS.CLASES.CLASE_AFORO_MULTIPLE ? <tr key="5">
                        <td>Total Toneladas:</td>
                        <td>{((preliquidacion?.maestroVisitas?.detallesMaestroVisita?.reduce((a:number,i:DetalleMaestroVisita):any=> {                 
                         return (a + i.dmafPesoaforo) },0) as number)/ DIV_TONELADAS).toFixed(6)}</td>
                    </tr> : ""}

                    {preliquidacion?.tipoAforo != PARAMETROS.CLASES.CLASE_AFORO_MULTIPLE ?  <tr key="7">
                        <td>
                            Factor de equivalencia
                        </td>
                        <td>
                            {preliquidacion?.genFactorEquivalencia}
                        </td>
                    </tr> : ""}
                </tbody>
            </table>
        </Fragment>
    );

}


export default AforoLiquidacionFormComponent;