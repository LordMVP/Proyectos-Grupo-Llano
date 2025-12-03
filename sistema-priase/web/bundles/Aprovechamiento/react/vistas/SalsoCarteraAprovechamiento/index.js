import React, { Fragment, useState, useRef, useEffect } from "react";
import { Card, Tab, Tabs } from "react-bootstrap";
import FilterMenu from "./content/FilterMenu";
import { useMutation } from "react-query";
import {
  getReportPeriods,
  getNamesExploitation,
  getReportDefaultSaldoCartera,
} from "../../apis";

import TableDetailReporteSaldo from "./content/TableDetailReporteSaldo";
const dataDefaultApi = {
  dataTable: [],
  dataNames: [],
  dataDocs: [],
  dataPeriods: [],
};
export function SalsoCarteraAprovechamiento() {
  const [tabSelect, setTabSelect] = useState("exploitation");
  const [stateDataApi, setStateDataApi] = useState(dataDefaultApi);
  const [dataSelect, setDataSelect] = useState([]);
  const [form, setForm] = useState({});
  const [resultApi, setResultApi] = useState(null);

  const buttonCleanRef = useRef(null);

  const { mutate: getPeriods, data: periods } = useMutation(getReportPeriods);
  const { mutate: getNames, data: namesAndDocs } = useMutation(({ filter }) =>
    getNamesExploitation(filter)
  );
  const { mutate: getReportDefault, data: reportDefault } = useMutation(
    (filter) => getReportDefaultSaldoCartera(filter)
  );

  /**
   * @description: Funcion que se ejecuta cuando se cambia el tab
   */
  useEffect(() => {
    getPeriods();

    setStateDataApi(dataDefaultApi);
    setResultApi(null);
    if (tabSelect === "incentive")
      getNames({ filter: "APROVECHADORINCENTIVO" });
    if (tabSelect === "exploitation") getNames({ filter: "APROVECHADOR" });

    if (buttonCleanRef && buttonCleanRef.current)
      buttonCleanRef.current.click();
  }, [tabSelect]);

  useEffect(() => {
    if (!periods) return;

    const period = periods.data.map((ele) => {
      const startDate = new Date(ele.perFecinicial);

      return {
        value: { start: ele.perFecinicial, end: ele.perFecfinal },
        label: `${startDate.getMonth() + 1}-${startDate.getFullYear()}`,
      };
    });

    const periodtemp = period.map((item) =>
      period.filter((it) => it.label === item.label)
    );
    let listLabels = [];
    let periodFilter = [];
    periodtemp.forEach((item) => {
      if (!listLabels.includes(item[0].label)) {
        listLabels.push(item[0].label);
        periodFilter.push({
          label: item[0].label,
          value: item.map((it) => it.value),
        });
      }
    });

    setStateDataApi({
      ...stateDataApi,
      dataPeriods: periodFilter,
    });
  }, [periods]);
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
  useEffect(() => {
    if (reportDefault) {
      setResultApi(reportDefault.data);
    }
  }, [reportDefault]);

  /**
   * @description: Funcion hace una nueva peiticion al back
   */

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
            {tabSelect === "exploitation" && (
              <Fragment>
                <FilterMenu
                  text={
                    tabSelect === "exploitation"
                      ? "Información aprovechamiento"
                      : "Información Alcaldia"
                  }
                  dataSelect={dataSelect}
                  setDataSelect={setDataSelect}
                  stateDataApi={stateDataApi}
                  setForm={setForm}
                  form={form}
                  buttonCleanRef={buttonCleanRef}
                  getData={getReportDefault}
                  incentive={tabSelect === "incentive" ? 1 : 0}
                />
                {resultApi && (
                  <TableDetailReporteSaldo
                    data={resultApi}
                    incentive={tabSelect === "incentive" ? 1 : 0}
                  />
                )}
              </Fragment>
            )}
          </Tab>
          <Tab
            eventKey="incentive"
            title="Incentivo aprovechamiento"
            onEnter={() => {
              setTabSelect("incentive");
            }}
          >
            {tabSelect === "incentive" && (
              <Fragment>
                <FilterMenu
                  text={
                    tabSelect === "exploitation"
                      ? "Información aprovechamiento"
                      : "Información Alcaldia"
                  }
                  dataSelect={dataSelect}
                  setDataSelect={setDataSelect}
                  stateDataApi={stateDataApi}
                  setForm={setForm}
                  form={form}
                  buttonCleanRef={buttonCleanRef}
                  getData={getReportDefault}
                  incentive={tabSelect === "incentive" ? 1 : 0}
                />
                {resultApi && (
                  <TableDetailReporteSaldo
                    data={resultApi}
                    incentive={tabSelect === "incentive" ? 1 : 0}
                  />
                )}
              </Fragment>
            )}
          </Tab>
        </Tabs>
      </Card.Body>
    </Fragment>
  );
}
