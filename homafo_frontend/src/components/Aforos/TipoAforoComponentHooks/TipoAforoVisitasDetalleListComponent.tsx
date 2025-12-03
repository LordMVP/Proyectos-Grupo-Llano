import React from 'react';
import DetalleTipoAforoDTO from '../../../models/dto/DetalleTipoAforoDTO';



type TipoAforoVisitasDetalleListProps = {
    detalles:DetalleTipoAforoDTO[],
    onEdit:any
}
function TipoAforoVisitasDetalleListComponent(props :TipoAforoVisitasDetalleListProps){
    const renderRow = (item:DetalleTipoAforoDTO) =>{
        return (
            <tr key={item.index}>                
                <td>{item.dtafoDesde}</td>
                <td>{item.dtafoHasta}</td>
                <td>{item.dtafoFrecuencia}</td>
                <td>{item.dtafoCantidadVisitas}</td>                
            </tr>
        );
    }
    return (
        <div className="row">
            <div className="col-12">
                <table className="table table-sm">
                    <thead>                        
                        <th>Desde</th>
                        <th>Hasta</th>
                        <th>Frecuencia</th>
                        <th>Visitas</th>                        
                    </thead>
                    <tbody>
                        {props.detalles.map(item=> renderRow(item))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TipoAforoVisitasDetalleListComponent;