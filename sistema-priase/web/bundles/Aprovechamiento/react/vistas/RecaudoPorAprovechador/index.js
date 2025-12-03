import React, { Fragment, useState, useRef, useEffect } from "react";
import { Card, Tab, Tabs } from "react-bootstrap";
import { useMutation } from "react-query";
import {
  getReportPeriods,
  getNamesExploitation,
  getReportReacudo,
} from "../../apis";
import {
  INITIALFORM_RECAUDACION_POR_APROVECHADOR,
  REMOVE_DUPLICATES,
  REMOVE_DUPLICATES_OBJECTS,
} from "../../global/constantes";

//import components
import FilterMenu from "./Content/FilterMenu";
import AccordionDetails from "./Content/AccordionDetails";

import { toast } from "react-toastify";
//estaso por defecto
const initialStateDataReports = { data: [], raw: {} };
const dataDefaultApi = {
  dataTable: [],
  dataNames: [],
  dataDocs: [],
  dataPeriods: [],
  dataPeriodsLiq: [],
};
/**
 *
 * @returns {component}
 * @description Funcion que retorna el componente de la vista de reporte de recaudo por aprovechamiento
 */
export function RecaudoPorAprovechador() {
  //estados de la vista
  const [tabSelect, setTabSelect] = useState("exploitation");
  const [stateDataApi, setStateDataApi] = useState(dataDefaultApi);
  const [form, setForm] = useState(INITIALFORM_RECAUDACION_POR_APROVECHADOR);
  const [dataSelect, setDataSelect] = useState([]);
  const [dataReports, setDataReports] = useState(initialStateDataReports);
  //Mutables para consultar a la api
  const {
    mutate: getData,
    data,
    isSuccess,
  } = useMutation(({ filter, page }) => getReportReacudo(filter, page));
  const { mutate: getPeriods, data: periods } = useMutation(getReportPeriods);
  const { mutate: getNames, data: namesAndDocs } = useMutation(({ filter }) =>
    getNamesExploitation(filter)
  );
  //Ref para el formulario
  const buttonCleanRef = useRef(null);

  //capturador de efecto y cambios
  //Caudo se cambia de pestaña se ejecuta el cambio de estado y la consulta
  useEffect(() => {
    getPeriods();
    setDataReports(initialStateDataReports);
    setStateDataApi(dataDefaultApi);
    if (tabSelect === "incentive")
      getNames({ filter: "APROVECHADORINCENTIVO" });
    if (tabSelect === "exploitation") getNames({ filter: "APROVECHADOR" });
    if (buttonCleanRef) buttonCleanRef.current.click();
  }, [tabSelect]);
  //capturador los periodos se cargan de la api se guardan es estados y de ordenan
  useEffect(() => {
    if (!periods) return;
    let period = periods.data.map((ele) => {
      const startDate = new Date(ele.perFecinicial);
      let monthString = `${startDate.getMonth() + 1}`;
      if (startDate.getMonth() + 1 < 10) {
        monthString = "0" + (startDate.getMonth() + 1);
      }
      return {
        value: `${monthString}-${startDate.getFullYear()}`,
        label: `${startDate.getMonth() + 1}-${startDate.getFullYear()} `,
      };
    });
    let periodLiq = periods.data.map((ele) => {
      const startDate = new Date(ele.perFecinicial);
      const endDate = new Date(ele.perFecfinal);

      return {
        value: { start: ele.perFecinicial, end: ele.perFecfinal },
        label: `${startDate.getMonth() + 1}-${startDate.getFullYear()}  a  ${
          endDate.getMonth() + 1
        }-${endDate.getFullYear()} `,
      };
    });
    //REMOVE_DUPLICATES_OBJECTS
    period = REMOVE_DUPLICATES_OBJECTS(period);
    periodLiq = REMOVE_DUPLICATES_OBJECTS(periodLiq);
    setStateDataApi({
      ...stateDataApi,
      dataPeriods: period,
      dataPeriodsLiq: periodLiq,
    });
  }, [periods]);
  //capturador de los nombres y documentos de los aprovechadores
  useEffect(() => {
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
  //capturador los datos del filtro
  useEffect(() => {
    if (!(data && isSuccess)) return;

    if (data.data.content.length === 0) toast.error("No se encontraron datos");
    setDataReports({
      data: data.data.content ? data.data.content : [],
      raw: data.data,
    });
  }, [data, isSuccess]);

  /**
   *
   * @param {number} num
   * @description Funcion que cambia los datos haciendo una nueva consulta a la api para cmabiar al pagina
   */
  const onPagerChange = (num) => {
    getData({
      filter: {
        terIderegistro: REMOVE_DUPLICATES([...form.dsusId, ...form.codBefore]),
        periodo: form.period,
        periodoliq: form.dateDate,
      },
      page: num,
    });
  };
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
              getData={getData}
            />
            {dataReports.data.length > 0 ? (
              <AccordionDetails
                titleTable={
                  tabSelect === "exploitation" ? "Aprovechador" : "Alcaldia"
                }
                infoData={dataReports.data}
                infoRaw={dataReports.raw}
                onPagerChange={onPagerChange}
                dataSelect={dataSelect}
                setDataSelect={setDataSelect}
                form={form}
              />
            ) : null}
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
              getData={getData}
            />

            {dataReports.data.length > 0 ? (
              <AccordionDetails
                titleTable={
                  tabSelect === "exploitation" ? "Aprovechador" : "Alcaldia"
                }
                infoData={dataReports.data}
                infoRaw={dataReports.raw}
                onPagerChange={onPagerChange}
                dataSelect={dataSelect}
                setDataSelect={setDataSelect}
                form={form}
              />
            ) : null}
          </Tab>
        </Tabs>
      </Card.Body>
    </Fragment>
  );
}
