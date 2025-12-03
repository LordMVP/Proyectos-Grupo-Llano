import React from "react";
import { Form, Col } from "react-bootstrap";
import "./ComponentsStyles.scss";

const TextBoxG = (props) => {
  const { md, label, value, validations, classfordiv } = props;
  return (
    <Form.Group as={Col} md={md} className={!!classfordiv ? classfordiv : ""}>
      {!!label && <Form.Label>{label}</Form.Label>}
      <Form.Control value={value} {...props} />
      {!!validations && (
        <Form.Control.Feedback type="invalid">
          {validations}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default TextBoxG;
