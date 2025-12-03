import React from "react";
import { Form, Col } from "react-bootstrap";

const TextBoxG = (props) => {
  const { md, name, label, value, changevalue, handleChange } = props;

  const change = (e) => {
    changevalue(name, e.target.value);
    !!handleChange && handleChange();
  };
  return (
    <Form.Group as={Col} md={md}>
      {!!label && <Form.Label>{label}</Form.Label>}
      <Form.Control value={value} onChange={change} {...props} />
    </Form.Group>
  );
};

export default TextBoxG;
