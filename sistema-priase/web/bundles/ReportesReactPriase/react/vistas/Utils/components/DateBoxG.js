import React from "react";
import { Form, Col } from "react-bootstrap";

const DateBoxG = (props) => {
  const { md, id, label, } = props;
  return (
    <Form.Group as={Col} md={!!md ? md : "4"}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className="form-control"
        type="date"
        name={id}
        {...props}
      />
      <span className="input-group-addon">
        <span className="glyphicon glyphicon-calendar" />
      </span>
    </Form.Group >
  );
};

export default DateBoxG;
