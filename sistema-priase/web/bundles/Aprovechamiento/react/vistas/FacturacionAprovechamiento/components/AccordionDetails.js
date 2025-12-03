import React, { useRef, useState } from "react";
import { Card, Accordion, Button } from "react-bootstrap";
import PaginationTable from "./PaginationTable";
import TableDetails from "./TableDetails";
import ChangeValue from "./ChangeValue";
import TablaSeleccion from "./TablaSeleccion";
/**
 * muestra un acordeon de secciones que muestra los resultados del filtro
 *
 * @param {object} props - propiedades del componente
 * @param {object[]} props.infoData - array de los aprovechadores a seleccionar
 * @param {object[]} props.dataNamesDocs - los nommbres y numeros de documento a relacionar con el aprovechador
 * @param {requestCallback} props.setDataSelect - funcion encargar de cambiar el estado de las selecciones
 * @param {object} props.infoRaw - información como llega del servidor sin filtrar
 * @param {requestCallback} props.onPagerChange - funcion para el cambio de pagina
 * @param {object[]} props.dataSelect - informacion de los aprovechadores seleccionada por el usuario
 * @returns {component}
 */
export default function AccordionDetails({
  infoData,
  dataNamesDocs,
  setDataSelect,
  infoRaw,
  onPagerChange,
  dataSelect,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const changeValueRef = useRef(null);

  const onClickChangeValue = () => {
    if (!changeValueRef) return;
    changeValueRef.current.click();
  };
  return (
    <Accordion defaultActiveKey="1" className="w-100">
      <Card className="w-100">
        <Accordion.Toggle
          as={Card.Header}
          eventKey="1"
          className="w-100 btn text-left"
        >
          <b>Reporte Consolidado de la seleccion de Terceros</b>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="1" className="w-100">
          <Card.Body className="w-100">
            <TableDetails
              data={infoData}
              dataNamesDocs={dataNamesDocs}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
            <PaginationTable data={infoRaw} onPagerChange={onPagerChange} />
            <div className="w-100 d-flex flex-row justify-content-end">
              <Button onClick={onClickChangeValue}>Cambios Valor</Button>
              <Button className="ml-3">Distribución</Button>
            </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card className="w-100">
        <Accordion.Toggle
          ref={changeValueRef}
          as={Card.Header}
          eventKey="2"
          className="w-100 btn text-left"
        >
          <b>Detalles de cambios de valor</b>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="2" className="w-100">
          <Card.Body className="w-100">
            <ChangeValue data={infoData} />
            <PaginationTable data={infoRaw} onPagerChange={onPagerChange} />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
