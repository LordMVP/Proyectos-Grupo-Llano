import React, { ReactNode } from "react";
// import React, { Component } from 'react'
import { Form, Col, Button, } from 'react-bootstrap'
import { MdSearch } from "react-icons/md";

type KeyboardEvent = React.KeyboardEvent<HTMLInputElement>;
type changeEventElement = React.ChangeEvent<HTMLInputElement>;
interface Iprops{
  labels:[string,string,string];
  names:[string,string,string];
  input0:string;
  input1:string;
  input2:string;
  handleChange:(e:changeEventElement)=>void;
  _handleKeyDownSearch:(e:KeyboardEvent)=>void;
  _handleButtonSearch?:()=>void;
  children?:ReactNode;
  estadoExtraordinario?:boolean
}

export default function SimpleSearch(props:Iprops) {
   
  return (
    <>
    <Form className="mb-2" >
      <Form.Row className="">
        <Form.Group className="mb-3" as={Col} controlId="formGridEmail">
          <Form.Label style={{color: 'rgba(0, 105, 217)'}}>{props.labels[0]} </Form.Label>
           <Form.Control disabled={props.estadoExtraordinario} placeholder={props.labels[0]} autoFocus name={props.names[0]} value={props.input0} onChange={props.handleChange} onKeyDown={props._handleKeyDownSearch} />
        </Form.Group>
        <Form.Group className="mb-3" as={Col} controlId="formGridEmail">
          <Form.Label style={{color: 'rgba(0, 105, 217)'}} >{props.labels[1]}</Form.Label>
          <Form.Control disabled={props.estadoExtraordinario} placeholder={props.labels[1]} name={props.names[1]}  value={props.input1} onChange={props.handleChange} onKeyDown={props._handleKeyDownSearch} />
        </Form.Group>
        <Form.Group className="mb-3" as={Col} controlId="formGridEmail">
          <Form.Label style={{color: 'rgba(0, 105, 217)'}} >{props.labels[2]}</Form.Label>
          <Form.Control disabled={props.estadoExtraordinario} placeholder={props.labels[2]}name={props.names[2]} value={props.input2} onChange={props.handleChange} onKeyDown={props._handleKeyDownSearch} />
        </Form.Group>
      </Form.Row>
      <Form.Row className="">
        <Button variant="primary" size="sm" block onClick={props._handleButtonSearch}><MdSearch/>Buscar informacion</Button>
      </Form.Row>
               
    </Form>

    </>
  );
}

