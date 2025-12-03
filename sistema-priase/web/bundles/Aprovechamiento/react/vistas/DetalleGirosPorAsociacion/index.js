import React, { Fragment, useState, useEffect, useRef } from "react";
import { Card, Tab, Tabs } from "react-bootstrap";
import FilterMenu from "./content/FilterMenu";
import FilterMenuPeriodos from "./content/FilterMenuPeriodos";
import TableGirosDetallePeriodos from "./content/TableGirosDetallePeriodos";
import { REMOVE_DUPLICATES_OBJECTS } from "../../global/constantes";
import { useMutation } from "react-query";

import {
  getNamesExploitation,
  getGirosPorAsociacion,
  getReportPeriods,
  getDetailGirosPorAsociacion,
} from "../../apis";

import TableDetalle from "./content/TableDetalle";
//default states
const dataDefaultApi = {
  dataTable: [],
  dataNames: [],
  dataDocs: [],
  dataPeriods: [],
  dataPeriodsLiq: [],
};
export function DetalleGirosPorAsociacion() {
  //use Api
  const { mutate: getNames, data: namesAndDocs } = useMutation(({ filter }) =>
    getNamesExploitation(filter)
  );
  const { mutate: getPeriods, data: periods } = useMutation(getReportPeriods);
  const { mutate: getGirosPorAsociacionMethod, data: giroPorAsociacion } =
    useMutation((filter) => getGirosPorAsociacion(filter));
  const {
    mutate: getDetailGirosPorAsociacionMethod,
    data: detailGirosPorAsociacion,
  } = useMutation((filter) => getDetailGirosPorAsociacion(filter));
  //use States
  const [tabSelect, setTabSelect] = useState("exploitation");
  const [stateDataApi, setStateDataApi] = useState(dataDefaultApi);
  const [dataSelect, setDataSelect] = useState([]);
  const [form, setForm] = useState({});
  const [formPeriodo, setFormPeriodo] = useState({});
  const [resultApi, setresultApi] = useState(null);
  //Ref para el formulario
  const buttonCleanRef = useRef(null);
  const buttonCleanRefDetails = useRef(null);
  //effects
  useEffect(() => {
    setStateDataApi(dataDefaultApi);
    if (tabSelect === "incentive")
      getNames({ filter: "APROVECHADORINCENTIVO" });
    if (tabSelect === "exploitation") getNames({ filter: "APROVECHADOR" });
    setresultApi(null);
  }, [tabSelect]);
  //capturador de los nombres y documentos de los aprovechadores
  useEffect(() => {
    if (!namesAndDocs) return;
    getPeriods();
    const docsoptions = namesAndDocs.data.map((ele) => ({
      value: ele.terIderegistro,
      label: `NIT : ${ele.terDocumento} - COD :${ele.terDigverificacion}`,
    }));
    const nameoptions = namesAndDocs.data.map((ele) => ({
      value: ele.terIderegistro,
      label: ele.terNomcompleto,
    }));

    setStateDataApi({
      ...stateDataApi,
      dataNames: nameoptions,
      dataDocs: docsoptions,
      dataTable: namesAndDocs.data,
    });
  }, [namesAndDocs]);
  useEffect(() => {
    if (giroPorAsociacion) {
      setresultApi(giroPorAsociacion);
    }
  }, [giroPorAsociacion]);
  useEffect(() => {
    if (!periods) return;

    const period = periods.data.map((ele) => {
      const startDate = new Date(ele.perFecinicial);

      return {
        value: startDate.getFullYear(),
        label: startDate.getFullYear(),
      };
    });

    setStateDataApi({
      ...stateDataApi,
      dataPeriods: REMOVE_DUPLICATES_OBJECTS(period),
      dataPerdioRaw: periods.data,
    });
  }, [periods]);
  return (
    <Card.Body className="w-100">
      <Tabs defaultActiveKey="exploitation" className="mb-3">
        <Tab
          eventKey="exploitation"
          title="Aprovechamiento"
          onEnter={() => {
            setTabSelect("exploitation");
          }}
        >
          <Tabs defaultActiveKey="1" className="mb-3">
            <Tab eventKey="1" title="Información Aprovechador">
              <FilterMenu
                text={
                  tabSelect === "exploitation"
                    ? "Información aprovechamiento"
                    : "Información alcaldia"
                }
                dataSelect={dataSelect}
                setDataSelect={setDataSelect}
                stateDataApi={stateDataApi}
                setForm={setForm}
                form={form}
                buttonCleanRef={buttonCleanRef}
                getData={getGirosPorAsociacionMethod}
              />
              {resultApi && (
                <TableDetalle data={resultApi ? resultApi.data : []} />
              )}
            </Tab>
            <Tab
              eventKey="2"
              title="Detalle Giros de Aprovechamiento por periodos"
            >
              <FilterMenuPeriodos
                text={
                  tabSelect === "exploitation"
                    ? "Información aprovechamiento"
                    : "Información alcaldia"
                }
                dataSelect={dataSelect}
                setDataSelect={setDataSelect}
                stateDataApi={stateDataApi}
                setForm={setFormPeriodo}
                form={formPeriodo}
                buttonCleanRef={buttonCleanRefDetails}
                getData={getDetailGirosPorAsociacionMethod}
              />
              <TableGirosDetallePeriodos
                data={
                  detailGirosPorAsociacion ? detailGirosPorAsociacion.data : []
                }
              />
            </Tab>
          </Tabs>
        </Tab>
      </Tabs>
    </Card.Body>
  );
}
