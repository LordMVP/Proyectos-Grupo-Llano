import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col } from "react-bootstrap";
import { isNumberCellPhone } from "../../methods";
import { toast } from "react-toastify";
type dataEditInterface = {
  position: number;
  data: {
    type: string;
    value: string;
  };
};
type Props = {
  show: boolean;
  onHide: () => void;
  onAction: (data: dataEditInterface) => void;

  data: {
    type: string;

    number: string;
    position: number;
  } | null;
  optionList: {
    label: string;
    value: string;
  }[];
};

export default function ModalEditPhone(props: Props) {
  //props
  const { show, onHide, onAction, optionList, data } = props;
  //states
  const [formDataEdit, setFormDataEdit] = useState<{
    type: string;
    value: string;
  }>({ type: "", value: "" });
  //methods
  const editPhone = () => {
    if (data) {
      onAction({
        position: data.position,
        data: formDataEdit,
      });
      onHide();
    }
  };
  const editValueNumber = (e: any) => {
    const { value } = e.target;
    const idMovil = optionList.find((op) => op.label === "Movil")?.value;
    if (
      Number(formDataEdit.type) === Number(idMovil) &&
      !isNumberCellPhone(value)
    ) {
      toast.warn("El numero debe ser un celular");
    } else {
      setFormDataEdit((prev) => ({ ...prev, value: value }));
    }
  };
  //effects
  useEffect(() => {
    if (show && data) {
      setFormDataEdit({ type: data.type, value: data.number });
    } else {
      setFormDataEdit({ type: "", value: "" });
    }
  }, [show, data]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Editar número</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Row>
          <Form.Group as={Col} md="5">
            <Form.Label>Tipo Telefono</Form.Label>
            <Form.Control
              as="select"
              value={formDataEdit.type}
              onChange={(e: any) =>
                setFormDataEdit((prev) => ({ ...prev, type: e.target.value }))
              }
            >
              {optionList.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} md="7">
            <Form.Label>Número</Form.Label>
            <Form.Control
              type="text"
              defaultValue={formDataEdit.value}
              onChange={editValueNumber}
            />
          </Form.Group>
        </Form.Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} className="mr-3">
          Cerrar
        </Button>
        <Button variant="primary" className="mr-3" onClick={editPhone}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
