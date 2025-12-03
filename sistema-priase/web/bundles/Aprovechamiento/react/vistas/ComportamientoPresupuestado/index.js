import React, { Fragment, useRef, useState, useEffect } from "react";
import { Form, Button, Col, Card, Accordion } from "react-bootstrap";
import TablaComportamiento from "./content/TablaComportamiento";
import TablaAnalisisconPresupuesto from "./content/TablaAnalisisconPresupuesto";
import Select from "react-select";
import { useMutation } from "react-query";
import { getReportPeriods, getSearchReportInvoicing } from "../../apis";
import { REMOVE_DUPLICATES_OBJECTS } from "../../global/constantes";

import { toast } from "react-toastify";

/**
 * componente que contiene la vista de comportamiento presupuestado
 * @returns {component}
 */
export function ComportamientoPresupuestado() {
  //api
  const { mutate: getPeriods, data: periods } = useMutation(getReportPeriods);
  const { mutate: getReport, data: report } = useMutation((a) =>
    getSearchReportInvoicing(a)
  );
  //ref
  const InputRef = useRef(null);
  //state
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState(null);
  const [dataShowReport, setDataShowReport] = useState(null);
  //methods
  const handleChange = (e) => {
    //controla los cambios de la seleccion de los periodos
    if (e !== null) {
      if (e > 12) return toast.warn("No se puede seleccionar mas de 12");
      setData(e);
    }
  };
  const handlerSubmit = async () => {
    //controla el submit del formulario
    if (data && data.length > 0) {
      if (data.length > 12)
        return toast.warn("No se puede seleccionar mas de 12");
      getReport({ settlementPeriods: data.map((it) => it.value) });
    }
  };
  const hablerClear = () => {
    //limpia los datos del formulario
    setData(null);
    if (InputRef) InputRef.current.select.clearValue();
  };

  //effect

  useEffect(() => {
    //obtiene los periodos
    getPeriods();
  }, []);

  useEffect(() => {
    //mapea los datos de los periodos traidos de la api
    if (periods) {
      let period = periods.data.map((ele) => {
        const startDate = new Date(ele.perFecinicial);

        return {
          value: { start: ele.perFecinicial, end: ele.perFecfinal },
          label: `${
            startDate.getMonth() + 1 < 10
              ? `0${startDate.getMonth() + 1}`
              : startDate.getMonth() + 1
          }-${startDate.getFullYear()}`,
        };
      });
      //Quitamos los duplicados
      period = REMOVE_DUPLICATES_OBJECTS(period);
      setPeriod(period);
    }
  }, [periods]);
  useEffect(() => {
    //mapea los datos del reporte traidos de la api
    if (report) {
      if (report.data.length > 0) {
        setDataShowReport(report.data);
      } else {
        toast.warn("No se encontraron datos");
      }
    }
  }, [report]);
  return (
    <Fragment>
      <Form.Row>
        <Form.Group className="inline-form" as={Col} md="6">
          <Form.Label>Periodos Comparación</Form.Label>
          <Select
            ref={InputRef}
            onChange={handleChange}
            value={data}
            options={period ? period : []}
            label="Seleccionar"
            placeholder="Seleccione"
            isMulti={true}
            noOptionsMessage={() => "No se encontraron resultados"}
          />
        </Form.Group>
        <Form.Group className="inline-form" as={Col} md="6">
          <div className="w-100 d-flex justify-content-start pt-4">
            <Button
              className="mr-3"
              disabled={data ? false : true}
              onClick={handlerSubmit}
            >
              Buscar
            </Button>
            <Button disabled={data ? false : true} onClick={hablerClear}>
              Limpiar
            </Button>
          </div>
        </Form.Group>
      </Form.Row>

      {dataShowReport && (
        <Fragment>
          <Accordion defaultActiveKey="1" className="w-100 mt-3">
            <Card className="w-100">
              <Accordion.Toggle
                as={Card.Header}
                eventKey="1"
                className="w-100 btn text-left"
              >
                <b>Comportamiento</b>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="1" className="w-100">
                <Card.Body className="w-100">
                  <TablaComportamiento data={dataShowReport} />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card className="w-100">
              <Accordion.Toggle
                as={Card.Header}
                eventKey="2"
                className="w-100 btn text-left"
              >
                <b>Análisis con Presupuesto vs Ejecutado con Tesorería</b>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="2" className="w-100">
                <Card.Body className="w-100">
                  <TablaAnalisisconPresupuesto data={dataShowReport} />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Fragment>
      )}
    </Fragment>
  );
}
