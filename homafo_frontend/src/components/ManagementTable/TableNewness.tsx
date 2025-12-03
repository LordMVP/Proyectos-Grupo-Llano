import React from "react";
import { Table, Button } from "react-bootstrap";
import { TiDelete } from "react-icons/ti";
import { FaPlusCircle } from "react-icons/fa";
type Props = {
  data?: any;
  submitShowData: (data: any) => void;
  submitDeleteData: (data: any) => void;
  submitApproveData: (data: any) => void;
};

export default function TableNewness(props: Props) {
  //props
  const { data, submitShowData, submitDeleteData, submitApproveData } = props;
  return (
    <div className="overflow-auto">
      <Table striped bordered hover>
        <thead className="bg-primary text-white text-center">
          <tr>
            <th>IdOperario</th>
            <th>IdRegistro</th>
            <th>Fecha Solucion</th>
            <th>IdSuscripcion</th>
            <th>Pqr</th>
            <th>Tipo Solicitud</th>
            <th>Novedad</th>
            <th>Observacion</th>

            <th>Imagen</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            Array.isArray(data?.content) &&
            data?.content.map((item, index) => (
              <tr className="text-center" key={`datoActualizar-${index}`}>
                <td>{item?.usuIderegistro}</td>
                <td>{item?.dsnovIderegistro}</td>
                <td>{item?.dsnovNovFecha}</td>
                <td>{item?.dsusIderegistro}</td>
                <td>{item?.dsnovNumpqr}</td>
                <td>{item?.tipSolicitud?.valor}</td>
                <td>
                  {item?.novedades?.reduce(
                    (pre, ac) => pre + ` ${ac.valor} -`,
                    ""
                  )}
                </td>
                <td>{item?.dsnovObservaciones}</td>

                <td>
                  <Button onClick={() => submitShowData(item)}>Ver</Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    className="mr-2"
                    onClick={() => submitDeleteData(item)}
                  >
                    <TiDelete size={25} />
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => submitApproveData(item)}
                  >
                    <FaPlusCircle size={20} />
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}
