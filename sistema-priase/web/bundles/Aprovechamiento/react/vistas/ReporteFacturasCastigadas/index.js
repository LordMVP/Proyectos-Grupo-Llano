import React, { Fragment, useState, useEffect, useRef } from "react";
import { Card, Tab, Tabs } from "react-bootstrap";
import FilterMenu from "./content/FilterMenu";
import Accordion from "./content/Accordion";
import { useMutation } from "react-query";

import { getNamesExploitation, getReportPunished } from "../../apis";
import { REMOVE_DUPLICATES } from "../../global/constantes";
//default states
const dataDefaultApi = {
  dataTable: [],
  dataNames: [],
  dataDocs: [],
  dataPeriods: [],
  dataPeriodsLiq: [],
};
/**
 *  componente que muestra el detalle de las facturas castigadas
 * @returns {component}
 */
export function ReporteFacturasCastigadas() {
  //use Api
  const { mutate: getNames, data: namesAndDocs } = useMutation(({ filter }) =>
    getNamesExploitation(filter)
  );
  const { mutate: getReportPunishedMutate, data: reportPunished } = useMutation(
    (filter) => getReportPunished(filter)
  );
  //use States
  const [tabSelect, setTabSelect] = useState("exploitation");
  const [stateDataApi, setStateDataApi] = useState(dataDefaultApi);
  const [dataSelect, setDataSelect] = useState([]);
  const [form, setForm] = useState({});
  const [resultApi, setresultApi] = useState(null);
  //Ref para el formulario
  const buttonCleanRef = useRef(null);
  //methods
  const onPagerChange = (num) => {
    //hace una nueva peticion a la api con la pagina nueva
    getData({
      filter: {
        idTerceroList: REMOVE_DUPLICATES([...form.dsusId, ...form.codBefore]),
        endDate: form.endDate,
        initialDate: form.initialDate,
      },
      page: num,
    });
  };
  //effects
  useEffect(() => {
    // detecta el cambio de seccion para pedir nuevos datos
    setStateDataApi(dataDefaultApi);
    if (tabSelect === "incentive")
      getNames({ filter: "APROVECHADORINCENTIVO" });
    if (tabSelect === "exploitation") getNames({ filter: "APROVECHADOR" });
    setresultApi(null);
  }, [tabSelect]);

  useEffect(() => {
    //capturador de los nombres y documentos de los aprovechadores
    if (!namesAndDocs) return;
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
    //capturador de los datos de la api
    setresultApi(reportPunished);
  }, [reportPunished]);
  return (
    <Fragment>
      <Card.Body className="w-100">
        <Tabs defaultActiveKey="exploitation" className="mb-3">
          <Tab
            eventKey="exploitation"
            title="Aprovechamiento"
            onEnter={() => {
              setTabSelect("exploitation");
            }}
          >
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
              getData={getReportPunishedMutate}
            />

            {resultApi && (
              <Accordion data={resultApi} onPagerChange={onPagerChange} />
            )}
          </Tab>
          <Tab
            eventKey="incentive"
            title="Incentivo aprovechamiento"
            onEnter={() => {
              setTabSelect("incentive");
            }}
          >
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
              getData={getReportPunishedMutate}
            />

            {resultApi && (
              <Accordion data={resultApi} onPagerChange={onPagerChange} />
            )}
          </Tab>
        </Tabs>
      </Card.Body>
    </Fragment>
  );
}
