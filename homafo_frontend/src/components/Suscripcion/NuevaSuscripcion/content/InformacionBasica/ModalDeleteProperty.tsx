import React from "react";
import { Modal, Button } from "react-bootstrap";
type Props = {
  show: boolean;
  contentText?: string | undefined;
  onHide: () => void;
  onSubmit: () => void;
};

export default function ModalDeleteProperty(props: Props) {
  //props
  const { show, onHide, onSubmit, contentText } = props;
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header className="bg-danger text-white">
        <Modal.Title>Eliminar propiedad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {contentText ? contentText : "¿Está seguro de eliminar la propiedad?"}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} className="mr-3">
          Cerrar
        </Button>
        <Button variant="danger" className="mr-3" onClick={onSubmit}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
