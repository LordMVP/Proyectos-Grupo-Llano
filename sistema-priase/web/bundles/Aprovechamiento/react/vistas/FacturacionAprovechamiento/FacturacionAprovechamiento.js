import React, { Fragment, useState, useRef, useEffect } from "react";
import { Card, Tab, Tabs } from "react-bootstrap";
import { FilterMenu, AccordionDetails } from "./components";
import { useMutation } from "react-query";
import {
  getReportDefault,
  getReportPeriods,
  getNamesExploitation,
} from "../../apis";
const initialStateDataReports = { data: [], raw: {} };

const dataDefaultApi = {
  dataTable: [],
  dataNames: [],
  dataDocs: [],
  dataPeriods: [],
};
import { INITIALFORM_RECAUDACION_POR_APROVECHADOR } from "../../global/constantes";
/**
 * Componente que muestra el filtro de busqueda asi como su resultado
 *
 * @returns {component}
 */
export function FacturacionAprovechamiento() {
  const [tabSelect, setTabSelect] = useState("exploitation");
  const [stateDataApi, setStateDataApi] = useState(dataDefaultApi);
  const [form, setForm] = useState(INITIALFORM_RECAUDACION_POR_APROVECHADOR);
  const [dataSelect, setDataSelect] = useState([]);
  const [dataReports, setDataReports] = useState(initialStateDataReports);

  const buttonCleanRef = useRef(null);
  const {
    mutate: getData,
    data,
    isSuccess,
  } = useMutation(({ filter, page }) => getReportDefault(filter, page));
  const { mutate: getPeriods, data: periods } = useMutation(getReportPeriods);
  const { mutate: getNames, data: namesAndDocs } = useMutation(({ filter }) =>
    getNamesExploitation(filter)
  );

  /**
   * @description: Funcion que se ejecuta cuando se cambia el tab
   */
  useEffect(() => {
    getPeriods();
    setDataReports(initialStateDataReports);
    setStateDataApi(dataDefaultApi);
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
      const endDate = new Date(ele.perFecfinal);

      return {
        value: { start: ele.perFecinicial, final: ele.perFecfinal },
        label: `${startDate.getMonth() + 1}-${startDate.getFullYear()}  a  ${
          endDate.getMonth() + 1
        }-${endDate.getFullYear()} `,
      };
    });
    setStateDataApi({
      ...stateDataApi,
      dataPeriods: period,
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
  /**
   *  @description: Funcion que se ejecuta cuando se cambia el filtro
   */
  useEffect(() => {
    if (!(data && isSuccess)) return;
    setDataReports({
      data: data.data.content ? data.data.content : [],
      raw: data.data,
    });
  }, [data]);
  useEffect(() => {
    if (!(data && isSuccess)) return;
    setDataReports({ data: data.data.content, raw: data.data });
  }, [data, isSuccess]);
  /**
   * @description: Funcion hace una nueva peiticion al back
   */

  const onPagerChange = (num) => {
    const query = {
      terIderegistro: [...form.dsusId, ...form.codBefore].reduce(
        (acc, item) => {
          if (!acc.includes(item)) {
            acc.push(item);
          }
          return acc;
        },
        []
      ),
      periodoliqInicial: form.dateInit,
      periodoliqFinal: form.dateEnd,
    };

    getData({ filter: query, page: num });
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
          ></Tab>
          <Tab
            eventKey="incentive"
            title="Incentivo aprovechamiento"
            onEnter={() => {
              setTabSelect("incentive");
            }}
          ></Tab>
        </Tabs>
        <Card.Body className="w-100">
          <FilterMenu
            text={
              tabSelect === "exploitation"
                ? "Información aprovechamiento"
                : "Información Alcaldia"
            }
            getData={getData}
            buttonCleanRef={buttonCleanRef}
            stateDataApi={stateDataApi}
            setForm={setForm}
            form={form}
            setDataSelect={setDataSelect}
            dataSelect={dataSelect}
          />

          {dataReports.data.length > 0 ? (
            <AccordionDetails
              infoData={dataReports.data}
              infoRaw={dataReports.raw}
              onPagerChange={onPagerChange}
              dataSelect={dataSelect}
              setDataSelect={setDataSelect}
            />
          ) : (
            ""
          )}
        </Card.Body>
      </Card.Body>
    </Fragment>
  );
}
