import React, { useEffect, useState } from "react";
import { Modal, Card, Button } from "react-bootstrap";
import { useMutation } from "react-query";
import { getoficioTercero } from "../../../apis";
/**
 * muestra el modal con el pdf
 *
 * @param {object} props - propiedades del componente
 * @param {object} props.show - estado del modal
 * @param {object} props.onClose - funcion para cerrar el modal
 * @param {object} props.form - información del formulario del modal
 * @returns {component}
 */
export default function ModalFilePDF({ show, onClose, form }) {
  // mutables para consultar a la api
  const { mutate: getOficioTercero, data: dataOficioTercero } = useMutation(
    (data) => getoficioTercero(data)
  );
  //estados de la vista
  const [dataPdf, setDataPdf] = useState(null);
  //capturador de efecto y cambios
  //captura el cambio de estado del modal y de la informacion del formulario para hacer la consulta
  useEffect(() => {
    if (form.dsusId.length > 0 && show) getOficioTercero(form.dsusId);
  }, [form, show]);
  useEffect(() => {
    //si se recibe la informacion del pdf la guarda para mostrarla
    if (dataOficioTercero) {
      setDataPdf(
        `data:application/pdf;base64,${dataOficioTercero.data.base64}`
      );
    }
  }, [dataOficioTercero]);
  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Distribución </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card.Body className="w-100" style={{ height: "70vh", width: "50vw" }}>
          <object
            className="w-100 h-100"
            data={dataPdf}
            type="application/pdf"
          ></object>
        </Card.Body>
      </Modal.Body>
      <Modal.Footer>
        <div className="w-100 d-flex justify-content-end">
          <Button className="mr-3">
            <a
              href={dataPdf}
              download="documento.pdf"
              className="text-decoration-none text-white"
            >
              Exportar Oficio
            </a>
          </Button>
          <Button onClick={onClose}> Regresar</Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
