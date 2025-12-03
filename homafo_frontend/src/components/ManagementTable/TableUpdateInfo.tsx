import React from "react";
import { Table, Button } from "react-bootstrap";
import { TiDelete } from "react-icons/ti";
import { FaPlusCircle } from "react-icons/fa";
import { connect } from "react-redux";
type Props = {
  data?: any;
  submitShowData: (data: any) => void;
  submitDeleteData: (data: any) => void;
  submitApproveData: (data: any) => void;
};

export const TableUpdateInfo = (props: Props) => {
  //props
  const {
    data = [],
    submitShowData,
    submitDeleteData,
    submitApproveData,
  } = props;

  return (
    <div className="overflow-auto w-100">
      <Table striped bordered hover>
        <thead className="bg-primary text-white text-center">
          <tr>
            <th>IdOperario</th>
            <th>IdRegistro</th>
            <th>Fecha Actualizacion</th>
            <th>IdSuscripcion</th>
            <th>CodigoAseo</th>
            <th>Datos Actualizacion</th>
            <th>Estado</th>
            <th>Accion</th>
            <th>Proceso</th>
          </tr>
        </thead>

        <tbody>
          {data &&
            Array.isArray(data?.content) &&
            data?.content.map((item, index) => (
              <tr className="text-center" key={`datoActualizar-${index}`}>
                <td>{item?.usuIderegistro}</td>
                <td>{item?.actsusIderegistro}</td>
                <td>{item?.actsusFecha}</td>
                <td>{item?.dsusIderegistro}</td>
                <td>{item?.dsusPcodigoAseo}</td>

                <td>
                  <Button
                    variant="primary"
                    onClick={() => submitShowData(item)}
                  >
                    Ver
                  </Button>
                </td>

                <td>{item?.actsusEstado === "P" ? "PENDIENTE" : "N/A"}</td>
                <td className="d-flex align-items-center gap-2">
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
                <td>{item?.actsusTipo}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TableUpdateInfo);
