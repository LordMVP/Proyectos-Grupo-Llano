import React, { ReactNode } from "react";
// import { Table, Button } from 'react-bootstrap'
interface Iprops{
  colums:[string,string,string];
  data:[any,any,any];
  children?:ReactNode;
}

export default function TableRotated(props:Iprops) {
   
  return (
    <>
    {props.children}
    <table id="table-rotated">
        <tr >
            <th > {props.colums[0]}</th>
            <td >  <div>{props.data[0]}</div></td>
        </tr>
        <tr  >
            <th >{props.colums[1]}</th>
            <td > {props.data[1]}</td>
        </tr>
        <tr  >
            <th>{props.colums[2]}</th>
            <td > {props.data[2]}</td>
        </tr>
    </table>
            <br />

    </>
  );
}