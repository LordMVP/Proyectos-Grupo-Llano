import React from "react";
import { Form, Col } from "react-bootstrap";

const SelectBoxG = (props) => {
  const {
    md,
    label,
    value,
    validations,
    options,
    emptyoption,
    emptyoptiondisabled,
    valueoption,
    labeloption,
  } = props;
  return (
    <Form.Group as={Col} md={md}>
      {!!label && <Form.Label>{label}</Form.Label>}
      <Form.Control value={value} as="select" custom {...props}>
        <option value={""} disabled={!!emptyoptiondisabled}>
          {emptyoption}
        </option>
        {!!options &&
          options.length > 0 &&
          options.map((opcion, indexOpcion) => (
            <option key={indexOpcion} value={opcion[valueoption]}>
              {opcion[labeloption]}
            </option>
          ))}
      </Form.Control>
      {!!validations && (
        <Form.Control.Feedback type="invalid">
          {validations}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default SelectBoxG;
