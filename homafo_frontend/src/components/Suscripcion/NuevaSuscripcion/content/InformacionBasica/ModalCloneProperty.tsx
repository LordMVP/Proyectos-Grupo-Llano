import React from "react";
import { Modal, Button } from "react-bootstrap";
type Props = {
  show: boolean;
  data?: any;
  isFatherSuscripciton: boolean;
  onHide: () => void;
  onSubmit: () => void;
  onSubmitv2: () => void;
};

export default function ModalCloneProperty(props: Props) {
  //props
  const { show, onHide, onSubmit, onSubmitv2, data } = props;
  console.log(data);
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header className="bg-primary text-white">
        <Modal.Title>Clonar propiedad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {data?.proIdpadre === null ? (
          data?.hasSubscription ? (
            <p>
              {`¿Está seguro de clonar la propiedad en la dirección ${data?.proDireccion}?`}
            </p>
          ) : (
            <p>
              {`La propiedad en la dirección ${data?.proDireccion} no tiene una suscripción`}
            </p>
          )
        ) : (
          <p>
            {`Está propiedad es hija de la propiedad ${data?.proIdpadre} por lo que no puede ser clonada`}
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} className="mr-3">
          Cerrar
        </Button>

        {data?.proIdpadre === null && data?.hasSubscription && (
          <Button variant="primary" className="mr-3" onClick={onSubmit}>
            Clonar
          </Button>
        )}
        <Button variant="primary" className="mr-3" onClick={onSubmitv2}>
          Clonar como padre
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
