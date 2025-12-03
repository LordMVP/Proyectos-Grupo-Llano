import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col } from "react-bootstrap";

type dataEditInterface = {
  position: number;
  email: string;
} | null;
type Props = {
  show: boolean;
  onHide: () => void;
  data: dataEditInterface;
  onAction: (data: { position: number; email: string }) => void;
};

export default function ModalEditEmail(props: Props) {
  //props
  const { show, onHide, onAction, data } = props;
  //states
  const [formDataEdit, setFormDataEdit] = useState<string>("");
  //methods
  const editEmail = () => {
    if (data) {
      onAction({
        position: data.position,
        email: formDataEdit,
      });
      onHide();
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormDataEdit(e.target.value);
  };
  //effects
  useEffect(() => {
    if (data) {
      setFormDataEdit(data.email);
    }
  }, [data]);
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Editar correo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Row>
          <Form.Group as={Col} md="12">
            <Form.Control
              type="email"
              defaultValue={data?.email}
              value={formDataEdit}
              onChange={handleChange}
            />
          </Form.Group>
        </Form.Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} className="mr-3">
          Cerrar
        </Button>
        <Button variant="primary" className="mr-3" onClick={editEmail}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
