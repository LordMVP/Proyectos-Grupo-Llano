import React, { Fragment, useRef, useState, useEffect } from "react";
import { Card, Accordion, Button } from "react-bootstrap";
import TablaResumen from "./TablaResumen";
import TablaFacturaCastigada from "./TablaFacturaCastigada";
import PaginationTable from "./PaginationTable";
/**
 * componente con las secciones a mostrar
 * @param {object} props - propiedades del componente
 *  @param {object} props.data - respuesta del back
 *  @param {requestCallback} props.onPagerChange - funcion para cambiar de pagina
 * @returns {component}
 */
export default function AccordionData(props) {
  //props
  const { data, onPagerChange } = props;
  //states
  const [dataDetail, setDataDetail] = useState([]);
  const detailRef = useRef(null);
  const detailBackRef = useRef(null);
  //methods
  const onClickDetail = (data) => {
    //asigna al estado de dataDetail la informacion selecionada y se va a la seccion con la información
    setDataDetail(data);
    if (detailRef) {
      detailRef.current.click();
    }
  };
  const onClickBack = () => {
    //regresa a la seccion anterior
    if (detailBackRef) {
      detailBackRef.current.click();
    }
  };
  return (
    <Fragment>
      <Accordion defaultActiveKey="1" className="w-100 mt-3">
        <Card className="w-100">
          <Accordion.Toggle
            ref={detailBackRef}
            as={Card.Header}
            eventKey="1"
            className="w-100 btn text-left"
          >
            <b>Resumen consolidado cartera castigada aprovechamiento</b>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1" className="w-100">
            <Card.Body className="w-100">
              <TablaResumen data={data.data} onAction={onClickDetail} />
              <PaginationTable data={data.data} onPagerChange={onPagerChange} />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card className="w-100">
          <Accordion.Toggle
            ref={detailRef}
            as={Card.Header}
            eventKey="2"
            className="w-100 btn text-left"
          >
            <b>Detalle facturación castigada aprovechamiento</b>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="2" className="w-100">
            <Card.Body className="w-100">
              <div className="w-100 d-flex justify-content-start m-3">
                <Button onClick={onClickBack}> Regresar</Button>
              </div>
              <TablaFacturaCastigada data={dataDetail} />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </Fragment>
  );
}
