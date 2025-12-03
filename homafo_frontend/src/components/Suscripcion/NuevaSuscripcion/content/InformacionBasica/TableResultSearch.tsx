import React from "react";
import { Table, Button } from "react-bootstrap";

//import interface
import { dataResultSearchInterface } from "../../interfaces";

//inner interfaces
type Props = {
  data: dataResultSearchInterface[] | [];
  action: (data: dataResultSearchInterface) => void;
  result: any[];
};

export default function TableResultSearch(props: Props) {
  //props
  const { data = [], action, result } = props;
  return (
    <Table striped bordered hover>
      <thead className="bg-primary text-white text-center">
        <tr>
          <th>Tipo Documento</th>
          <th>Documento</th>
          <th>Nombre y Apellidos</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody className="text-center">
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.typeDocument}</td>
            <td>{item.document}</td>
            <td>{item.name}</td>
            <td>
              <Button variant="primary" onClick={() => action(result[index])}>
                Seleccionar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
