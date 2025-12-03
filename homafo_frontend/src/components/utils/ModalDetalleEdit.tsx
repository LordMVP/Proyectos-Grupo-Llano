import React, { ReactNode } from "react";
import { Button, Modal, Container, Table } from 'react-bootstrap'

interface Iprops{
    columnsData:[string,string,string,string,string,string,string];
    columnTotal:[string];
    data:any[];
    children?:ReactNode;
    showModal:boolean;
    observaciones:string;
    dataTotal:any;
    handleModalClose:()=>void;
}

export default function ModalDetalles(props:Iprops) {

  return (
    <>
    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" animation={false} show={props.showModal} onHide={props.handleModalClose} dialogClassName="modal-detalle" >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Detalle  {props.children}
                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Container>
                                                <Table striped bordered hover  responsive="sm">
                                                    <thead className="green-header" >
                                                        <tr key="detailsHead">
                                                            <th>{props.columnsData[0]}</th>
                                                            <th>{props.columnsData[1]}</th>
                                                            <th>{props.columnsData[2]}</th>
                                                            <th>{props.columnsData[3]}</th>
                                                            <th>{props.columnsData[4]}</th>
                                                            <th>{props.columnsData[5]}</th>
                                                            <th>{props.columnsData[6]}</th>
                                                            
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                        props.data.map((row:any,index)  => {
                                                            console.log("data map detalles",row.dimensiones)
                                                                return <tr key={index}>
                                                                    <td> {row.tipoRecipiente} </td>
                                                                    <td> {row.dimensiones} </td>
                                                                    <td> {row.cantidadRecipientes} </td>
                                                                    <td> {row.equivalencia?.toFixed(3)} </td>
                                                                    <td> {row.peso?.toFixed(3)} </td> 
                                                                    <td> {row.total?.toFixed(3)} </td>
                                                                    <td> {row.observaciones} </td>                                                                                     
                                                                </tr>
                                                            })
                                                        }
                                                        {console.log("data total detalles",props.dataTotal)}
                                                        {console.log("data total detalles",props.data)}
                                                        <tr>
                                                            <td className="green-header"> <strong>{props.columnTotal[0]}</strong>:</td>
                                                            <td > </td>
                                                            {/* <td > <strong>{props.data[0].totalCantidadRecipientes}</strong></td> */}    
                                                            <td > <strong>{props.data.reduce((a,i)=>{
                                                                    return a + (i.cantidadRecipientes as number)
                                                            },0)}</strong></td>     

                                                            <td> <strong>{props.data.reduce((a,i)=>{
                                                                    return a + (i.equivalencia as number)
                                                            },0)?.toFixed(3)}</strong></td>
                                                            <td > <strong>{props.data.reduce((a,i)=>{
                                                                    return a + (i.peso as number)
                                                            },0)?.toFixed(3)}</strong></td>     
                                                            <td > <strong>{props.data.reduce((a,i)=>{
                                                                    return a + (i.total as number)
                                                            }
                                                            ,0)?.toFixed(3)}</strong></td>
                                                            
                                                                                               
                                                            <td > </td>                                                                                                                        
                                                        </tr> 

                                                    </tbody>
                                                </Table>
                                                <hr/>
                                                <label><strong>Observaciones :</strong></label>
                                                <div>{props.observaciones} </div>

                                            </Container>
                            </Modal.Body>
                             <Modal.Footer>
                                <Button onClick={props.handleModalClose}>Cerrar</Button>
                          </Modal.Footer>
                     </Modal>
    </>
  );
}

ModalDetalles.defaultProps = {
    data:[{tipo_recipiente: '',dimensiones: '',cantidad_recipientes: '',equivalencia: '',total: ''}],
    observaciones:"",
};
