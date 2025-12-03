import React from 'react'
import { Button, Modal } from 'react-bootstrap'

interface Iprops{
  idUsuario:string;
  showModal:boolean;
  handleModalClose:()=>void;
  handleModalSave:()=>void;
}

export default function ModalSave(props:Iprops) {
   
  return (
    <Modal show={props.showModal} onHide={props.handleModalClose} centered animation={false} >
        <Modal.Header closeButton>
            <Modal.Title>Guardar Aforo para el usuario: {props.idUsuario}</Modal.Title>
        </Modal.Header>
            <Modal.Body>Desea guardar la información?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleModalClose} > No</Button>
                <Button variant="primary" onClick={props.handleModalSave} >Si</Button>
            </Modal.Footer>
    </Modal>
  );
}

ModalSave.defaultProps = {
    idUsuario:"",
    showModal:""
};


