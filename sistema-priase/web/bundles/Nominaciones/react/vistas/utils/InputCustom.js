import React from "react";
import { Col, Form } from "react-bootstrap";

export default function InputCustom({ propsInput, label, md }) {
  return (
    <Form.Group className="inline-form px-3 " as={Col} md={md}>
      {label !== "" && <label className="form-label">{label}</label>}
      <input className="form-control w-100" {...propsInput} />
    </Form.Group>
  );
}
