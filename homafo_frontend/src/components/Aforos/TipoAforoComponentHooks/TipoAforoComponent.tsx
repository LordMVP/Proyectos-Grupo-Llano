import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import DetalleTipoAforoDTO from '../../../models/dto/DetalleTipoAforoDTO';
import TipoAforoDTO from '../../../models/dto/TipoAforoDTO';
import TipoAforoFormComponent from './TipoAforoFormComponent';
import TipoAforoVisitasDetalleListComponent from './TipoAforoVisitasDetalleListComponent';
import TipoAforoVisitasFormComponent from './TipoAforoVisitasFormComponent';
import _ from 'lodash'
import { toast } from 'react-toastify';

function TipoAforoComponentHooks(props?: any) {
    const [detalles, setDetalles] = useState<DetalleTipoAforoDTO[]>([]);
    const [detalle,setDetalle] = useState<DetalleTipoAforoDTO>();
    const [tipoAforo] = useState<TipoAforoDTO>();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    console.log(props);

    const onSubmit = (data: TipoAforoDTO) => {
        console.log(data);
        console.log(props);
    };

    const addDetalle = (data: DetalleTipoAforoDTO) => {        
        setDetalle(undefined);
        let lastDetalles = [...detalles];
        if(data.index){
            lastDetalles = _.remove(lastDetalles,{'index':data.index});            
        }
        if (validarDetalle(data,lastDetalles)) {            
            data.index = lastDetalles.length+1;        
            lastDetalles.push(data);
            setDetalles(lastDetalles)
        }else {
                toast.error("Rango no permitido, ya se encuentra agregado o causa solapamiento.");
        }
    }

    const validarDetalle = (detalle: DetalleTipoAforoDTO,detalles:DetalleTipoAforoDTO[]): boolean => {
        return _.find(detalles, function (o: DetalleTipoAforoDTO) 
                        { return o.dtafoFrecuencia == detalle.dtafoFrecuencia && 
                            ((detalle.dtafoDesde >= o.dtafoDesde && detalle.dtafoDesde <= o.dtafoHasta) || 
                            (detalle.dtafoHasta >= o.dtafoDesde && detalle.dtafoHasta <= o.dtafoHasta)); 
                        })
                        ?false:true;        
    };
    const onEdit = (data:DetalleTipoAforoDTO) => {
        setDetalle(data);
        setShow(true);
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <TipoAforoFormComponent onSubmit={onSubmit} data={tipoAforo as TipoAforoDTO} />
                </div>
                <div className="col-md-6 col-sm-12">
                    <TipoAforoVisitasDetalleListComponent onEdit={onEdit} detalles={detalles as DetalleTipoAforoDTO[]} />
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                </div>
                <div className="col-6">
                    <Button size="sm" variant="primary" onClick={handleShow}>
                        Agregar detalle
                    </Button>
                </div>
            </div>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Detalle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TipoAforoVisitasFormComponent onAdd={addDetalle} onFinish={handleClose} defaultValue={detalle as DetalleTipoAforoDTO} />
                </Modal.Body>                
            </Modal>
        </div>
    );
}

export default TipoAforoComponentHooks;