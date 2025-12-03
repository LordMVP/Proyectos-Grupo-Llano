import React from "react";
import { Form, Col, Button } from "react-bootstrap";
//import interfaces
import { formDataSearchInterface } from "../../interfaces";
//innner interface
type Props = {
  formData: formDataSearchInterface;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  search: () => void;
  searchName: () => void;
  onClear: () => void;
};

const FormSearhThird = (props: Props) => {
  //props
  const { formData, handleChange, search, searchName, onClear } = props;

  return (
    <Form.Row>
      {/*primer input */}
      <Form.Group as={Col} md="4">
        <Form.Label>Documento Tercero</Form.Label>
        <Form.Control
          name="docThird"
          type="text"
          placeholder="Número de Documento"
          onChange={handleChange}
          value={formData.docThird}
        />
      </Form.Group>
      {/*segundo input */}
      <Form.Group as={Col} md="8">
        <Form.Label>Nombre y Apellidos Completos</Form.Label>
        <Form.Control
          name="nameThird"
          type="text"
          placeholder="Nombre y apellidos"
          onChange={handleChange}
          value={formData.nameThird}
        />
      </Form.Group>
      {/*tercero input */}
      <Form.Group as={Col} md="4">
        <Form.Label>Codigo Cliente</Form.Label>
        <Form.Control
          name="code"
          type="text"
          placeholder="Codigo Antiguo"
          onChange={handleChange}
          value={formData.code}
        />
      </Form.Group>
      {/*cuarto input */}
      <Form.Group as={Col} md="4">
        <Form.Label>Id Suscripción</Form.Label>
        <Form.Control
          name="idSuscription"
          type="text"
          placeholder="Codigo Antiguo"
          onChange={handleChange}
          value={formData.idSuscription}
        />
      </Form.Group>
      {/*botones */}
      <Form.Group
        as={Col}
        md="4"
        className="pt-4 d-flex justify-content-around"
      >
        {" "}
        <Button onClick={onClear}> Limpiar</Button>
        <Button onClick={search}> Buscar</Button>
        <Button onClick={searchName}> Buscar Nombre</Button>
      </Form.Group>
    </Form.Row>
  );
};
export default FormSearhThird;
