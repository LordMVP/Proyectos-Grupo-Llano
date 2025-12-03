import React, { Fragment, useRef, useState, useEffect } from "react";
import { Card, Accordion, Button } from "react-bootstrap";
import TableAprovechamientoTercero from "./TableAprovechamientoTercero";
import TablaDetalle from "./TablaDetalle";
import TablaDetallePeriodos from "./TablaDetallePeriodos";
import TablaCruceRecaudo from "./TablaCruceRecaudo";
import SoportePagos from "./SoportePagos";
import TablaDetalleReacuidoConsolidado from "./TablaDetalleReacuidoConsolidado";
import TablaCruceRecuadoNA from "./TablaCruceRecuadoNA";
import TablaCruceReacudoA from "./TablaCruceReacudoA";
import TablaNotasCambios from "./TablaNotasCambios";
import TablaFacturaCastigadas from "./TablaFacturaCastigadas";
import ModalFilePDF from "./ModalFilePDF";
import PaginationTable from "./PaginationTable";
import { useMutation } from "react-query";
import moment from "moment";
import {
  getSoportePago,
  getdetalleAprovechador,
  getdetalleAprovechadorPeriodos,
  getNotasRecaudoTerceros,
  getReportReacudoTerceros,
  getDetalleRecaudoAlcaldia,
  getDetalleRecaudoAlcaldiaMes,
  getFacturaCastigada,
} from "../../../apis";
import { toast } from "react-toastify";
/**
 * muestra un acordeon de secciones que muestra los resultados del filtro
 *
 * @param {object} props - propiedades del componente
 * @param {object[]} props.titleTable - el nombre de las tablas dependiendo del tipo de reporte
 * @param {object[]} props.infoData - array de los aprovechadores a seleccionar
 * @param {object} props.infoRaw - información como llega del servidor sin filtrar
 * @param {requestCallback} props.onPagerChange - funcion para el cambio de pagina
 * @param {object[]} props.form - informacion del formulario de busqueda usado para filtrar
 * @returns {component}
 * @description Funcion que retorna el componente de la vista de reporte de recaudo por aprovechamiento en su parte de accordeon
 */

export default function AccordionDetails({
  titleTable,
  infoData,
  infoRaw,
  onPagerChange,
  form,
}) {
  //mutables para consultar a la api
  const { mutate: getDataSoportePago, data: dataSoportePago } = useMutation(
    (data) => getSoportePago(data)
  );
  const { mutate: getDetalleAprovechador, data: dataDetalleAprovechador } =
    useMutation((data) => getdetalleAprovechador(data));

  const { mutate: getTerceroPeriodos, data: dataTerceroPeriodos } = useMutation(
    (data) => getdetalleAprovechadorPeriodos(data)
  );
  const {
    mutate: getNotasRecaudoTercerosData,
    data: dataNotasRecaudoTerceros,
  } = useMutation((data) => getNotasRecaudoTerceros(data));
  const {
    mutate: getReportReacudoTercerosData,
    data: dataReportReacudoTerceros,
  } = useMutation((data) => getReportReacudoTerceros(data));
  const {
    mutate: getDetalleRecaudoAlcaldiaData,
    data: dataDetalleRecaudoAlcaldia,
  } = useMutation((data) => getDetalleRecaudoAlcaldia(data));
  //getDetalleRecaudoAlcaldiaMes
  const {
    mutate: getDetalleRecaudoAlcaldiaMesData,
    data: dataDetalleRecaudoAlcaldiaMes,
  } = useMutation((data) => getDetalleRecaudoAlcaldiaMes(data));

  const { mutate: getFacturaCastigadaData, data: dataFacturaCastigada } =
    useMutation((data) => getFacturaCastigada(data));
  // estados del componente
  const [nameAprovechador, setNameAprovechador] = useState("");
  const [dataRecaudo, setDataRecaudo] = useState(false);
  const [dataApiSoporteRecaudo, setdataApiSoporteRecaudo] = useState([]);
  const [dataTerSelect, setdataTerSelect] = useState({});
  const [dataAfor, setDataAfor] = useState({ yes: null, not: null });
  const [dataNote, setDataNote] = useState(null);
  const [isAforo, setIsAforo] = useState(1);
  const [terIdAlcaldia, setTerIdAlcaldia] = useState();
  const detailRef = useRef(null);
  const detailRERef = useRef(null);
  const detailREcoRef = useRef(null);
  const detailCruceRef = useRef(null);
  const detailSoporRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  //abre el modal de los archivos pdf
  const onShowModal = () => {
    setShowModal(true);
  };
  //cierra el modal de los archivos pdf
  const onCloseModal = () => {
    setShowModal(false);
  };
  //activa la peticion de los soportes de pagos
  const onClickSoporte = (data) => {
    getDataSoportePago({
      id: data,
      period: form.period ? form.period : "",
      dateDate: form.dateDate ? form.dateDate : [],
    });
  };
  //activa la peticion de los detalles de aprovechamiento
  const onClickDetailValue = (data) => {
    if (titleTable === "Aprovechador") {
      getDetalleAprovechador(data);
    }
    if (titleTable === "Alcaldia") {
      setTerIdAlcaldia(data);
      getDetalleRecaudoAlcaldiaData({
        id: data,
        settlementPeriod: form.dateDate ? form.dateDate : [],
        page: 0,
      });
    }
    setdataTerSelect(data);
  };
  // simula un click en el boton
  const onClickDetailRe = () => {
    if (!detailRERef) return;
    detailRERef.current.click();
  };
  //activa la peticion de los detalles de aprovechamiento periodos
  const onClicSetDetail = (detail) => {
    setNameAprovechador(detail.thirdPartyName);

    getTerceroPeriodos({
      id: dataTerSelect,
      settlementPeriod: form.dateDate ? form.dateDate : [],
    });
  };
  //activa la peticion de los reacuods de aprovechamiento y notas de recaudo
  const onClickDetailRecuido = () => {
    if (!detailREcoRef) return;
    detailREcoRef.current.click();
  };
  //activa la peticion de los reacuods de aprovechamiento y notas de recaudo
  const onClickDetailRecuidoNA = (data) => {
    setIsAforo(data);

    getNotasRecaudoTercerosData({
      querry: {
        id: dataTerSelect,
        settlementPeriod: form.dateDate,
      },

      aforado: data,
      page: 0,
      incentivo: titleTable === "Aprovechador" ? 0 : 1,
    });
    getFacturaCastigadaData({
      page: 0,
      incentivo: titleTable === "Aprovechador" ? 0 : 1,
      querry: {
        id: dataTerSelect,
        settlementPeriod: form.dateDate,
      },
    });
    if (data === 0) {
      getReportReacudoTercerosData({
        tercero: dataTerSelect,
        querry: {
          id: dataTerSelect,
          settlementPeriod: form.dateDate,
        },
        aforado: data,
        page: 0,
      });
    }
    if (data === 1) {
      const today = moment().format("YYYY-MM-DD");
      getReportReacudoTercerosData({
        tercero: dataTerSelect,
        querry: {
          id: dataTerSelect,
          settlementPeriod: [{ start: today, end: today }],
        },
        aforado: data,
        page: 0,
      });
    }
  };
  const onDetail = () => {
    setNameAprovechador(" ");
    getDetalleRecaudoAlcaldiaMesData({
      idList: [terIdAlcaldia],
      period: form.period ? form.period : "",
      page: 0,
    });
    getNotasRecaudoTercerosData({
      querry: {
        id: terIdAlcaldia,
        settlementPeriod: form.dateDate,
      },

      aforado: isAforo,
      page: 0,
      incentivo: titleTable === "Aprovechador" ? 0 : 1,
    });

    getFacturaCastigadaData({
      page: 0,
      incentivo: titleTable === "Aprovechador" ? 0 : 1,
      querry: {
        id: terIdAlcaldia,
        settlementPeriod: form.dateDate,
      },
    });
  };
  const onChangePage = (num) => {
    getNotasRecaudoTercerosData({
      querry: {
        id: dataTerSelect,
        settlementPeriod: form.dateDate,
      },
      aforado: isAforo,
      page: num,
      incentivo: titleTable === "Aprovechador" ? 0 : 1,
    });
  };
  const onChangePageFac = (num) => {
    getFacturaCastigadaData({
      page: num,
      incentivo: titleTable === "Aprovechador" ? 0 : 1,
      querry: {
        id: dataTerSelect,
        settlementPeriod: form.dateDate,
      },
    });
  };

  const onChangePageDetail = (num) => {
    getDetalleRecaudoAlcaldiaData({
      id: terIdAlcaldia,
      settlementPeriod: form.dateDate ? form.dateDate : [],
      page: num,
    });
  };
  const onChangePageDetailMouth = (num) => {
    getDetalleRecaudoAlcaldiaMesData({
      idList: [terIdAlcaldia],
      period: form.period ? form.period : "",
      page: num,
    });
  };
  const onChangePageRecuado = (num) => {
    if (isAforo === 0) {
      getReportReacudoTercerosData({
        tercero: dataTerSelect,
        querry: {
          id: dataTerSelect,
          settlementPeriod: form.dateDate,
        },
        aforado: isAforo,
        page: num,
      });
    }

    if (isAforo === 1) {
      getReportReacudoTercerosData({
        tercero: dataTerSelect,
        querry: {
          id: dataTerSelect,
          settlementPeriod: [{ start: today, end: today }],
        },
        aforado: isAforo,
        page: num,
      });
    }
  };

  //capturador de eventos y cambios

  //captura el resultado de la consulta de los soportes de pagos
  useEffect(() => {
    if (dataSoportePago) {
      if (dataSoportePago.data.length > 0)
        toast.warn("No se encontraron datos");

      setdataApiSoporteRecaudo(dataSoportePago.data);
      if (detailSoporRef.current) {
        return detailSoporRef.current.click();
      }
    }
  }, [dataSoportePago]);
  //captura el resultado de la consulta de los detalles de aprovechamiento
  useEffect(() => {
    if (dataDetalleAprovechador) {
      if (!detailRef.current) return;
      detailRef.current.click();
    }
  }, [dataDetalleAprovechador]);
  useEffect(() => {
    if (dataDetalleRecaudoAlcaldia) {
      if (!detailRef.current) return;
      detailRef.current.click();
    }
  }, [dataDetalleRecaudoAlcaldia]);
  //captura el resultado de la consulta de los detalles de aprovechamiento periodos
  useEffect(() => {
    if (dataTerceroPeriodos) {
      if (!detailREcoRef) return;
      detailREcoRef.current.click();
    }
  }, [dataTerceroPeriodos]);
  //captura el resultado de la consulta de los reacuods de aprovechamiento y notas de recaudo
  useEffect(() => {
    if (dataNotasRecaudoTerceros && dataReportReacudoTerceros) {
      if (isAforo === 1)
        setDataAfor({ yes: dataReportReacudoTerceros.data, not: null });
      if (isAforo === 0)
        setDataAfor({ yes: null, not: dataReportReacudoTerceros.data });

      setDataNote(dataNotasRecaudoTerceros.data);
      setDataRecaudo(true);
      if (!detailCruceRef) return;
      detailCruceRef.current.click();
    }

    if (dataNotasRecaudoTerceros && titleTable === "Alcaldia") {
      setDataNote(dataNotasRecaudoTerceros.data);
    }
  }, [dataNotasRecaudoTerceros, dataReportReacudoTerceros]);

  useEffect(() => {
    if (dataDetalleRecaudoAlcaldiaMes) {
      setDataRecaudo(true);
      if (!detailCruceRef) return;
      detailCruceRef.current.click();
    }
  }, [dataDetalleRecaudoAlcaldiaMes]);
  return (
    <Fragment>
      <ModalFilePDF show={showModal} onClose={onCloseModal} form={form} />
      <Accordion defaultActiveKey="1" className="w-100 mt-3">
        <Card className="w-100">
          <Accordion.Toggle
            ref={detailRERef}
            as={Card.Header}
            eventKey="1"
            className="w-100 btn text-left"
          >
            <b>Recaudo Aprovechamiento por Tercero</b>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1" className="w-100">
            <Card.Body className="w-100">
              <TableAprovechamientoTercero
                titleTable={titleTable}
                onClickDetailValue={onClickDetailValue}
                onClickSoporte={onClickSoporte}
                data={infoData}
                raw={infoRaw}
                onPagerChange={onPagerChange}
                onShowModal={onShowModal}
              />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card className="w-100">
          <Accordion.Toggle
            ref={detailSoporRef}
            as={Card.Header}
            eventKey="2"
            className="w-100 btn text-left"
          >
            <b>Soportes Pagos Terceros</b>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="2" className="w-100">
            <Card.Body className="w-100">
              <SoportePagos data={dataApiSoporteRecaudo} />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card className="w-100">
          <Accordion.Toggle
            ref={detailRef}
            as={Card.Header}
            eventKey="3"
            className="w-100 btn text-left"
          >
            <b>
              Detalle recaudo consolidado por{" "}
              {titleTable === "Aprovechador"
                ? titleTable
                : "periodo de la alcaldia"}
            </b>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="3" className="w-100">
            <Card.Body className="w-100">
              <div className="d-flex justify-content-start mb-3">
                <Button onClick={() => onClickDetailRe()}> Regresar</Button>
              </div>
              {titleTable === "Aprovechador" ? (
                <TablaDetalle
                  data={
                    dataDetalleAprovechador
                      ? dataDetalleAprovechador.data
                      : null
                  }
                  onClicSetDetail={onClicSetDetail}
                />
              ) : (
                <TablaDetallePeriodos
                  data={
                    dataDetalleRecaudoAlcaldia
                      ? dataDetalleRecaudoAlcaldia.data
                      : null
                  }
                  onClicSetDetail={onDetail}
                />
              )}
              {dataDetalleRecaudoAlcaldia && (
                <PaginationTable
                  data={dataDetalleRecaudoAlcaldia.data}
                  onPagerChange={onChangePageDetail}
                />
              )}
            </Card.Body>
          </Accordion.Collapse>
        </Card>

        {titleTable === "Aprovechador" && (
          <Card className={`w-100 ${nameAprovechador !== "" ? "" : "d-none"}`}>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="4"
              className="w-100 btn text-left"
              ref={detailREcoRef}
            >
              <b>
                Detalle recaudo consolidado por aprovechador {nameAprovechador}
              </b>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="4" className="w-100">
              <Card.Body className="w-100">
                <div className="d-flex justify-content-start mb-3">
                  <Button
                    onClick={() => {
                      if (detailRef) detailRef.current.click();
                    }}
                  >
                    Regresar
                  </Button>
                </div>
                <TablaDetalleReacuidoConsolidado
                  data={dataTerceroPeriodos ? dataTerceroPeriodos.data : []}
                  onClickDetailRecuidoNA={onClickDetailRecuidoNA}
                />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        )}

        <Card
          className={`w-100 ${
            dataRecaudo && nameAprovechador !== "" ? "" : "d-none"
          }`}
        >
          <Accordion.Toggle
            ref={detailCruceRef}
            as={Card.Header}
            eventKey="5"
            className="w-100 btn text-left"
          >
            {titleTable === "Aprovechador" ? (
              <b>
                Cruce de Reacudo {isAforo === 0 ? " No Aforado" : "Aforado"}
              </b>
            ) : (
              <b>Cruce de Recaudo</b>
            )}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="5" className="w-100">
            <Card.Body className="w-100">
              <div className="d-flex justify-content-start mb-3">
                <Button onClick={onClickDetailRecuido}> Regresar</Button>
              </div>
              {titleTable === "Aprovechador" ? (
                <Fragment>
                  {isAforo === 0 ? (
                    <Fragment>
                      <TablaCruceRecuadoNA data={dataAfor.not} />
                      {dataAfor.not && (
                        <PaginationTable
                          data={dataAfor.not}
                          onPagerChange={onChangePageRecuado}
                        />
                      )}
                    </Fragment>
                  ) : (
                    <Fragment>
                      <TablaCruceReacudoA data={dataAfor.yes} />{" "}
                      {dataAfor.yes && (
                        <PaginationTable
                          data={dataAfor.yes}
                          onPagerChange={onChangePageRecuado}
                        />
                      )}
                    </Fragment>
                  )}
                </Fragment>
              ) : (
                <Fragment>
                  <TablaCruceRecaudo
                    data={
                      dataDetalleRecaudoAlcaldiaMes
                        ? dataDetalleRecaudoAlcaldiaMes.data
                        : null
                    }
                  />
                  {dataDetalleRecaudoAlcaldiaMes && (
                    <PaginationTable
                      data={dataDetalleRecaudoAlcaldiaMes.data}
                      onPagerChange={onChangePageDetailMouth}
                    />
                  )}
                </Fragment>
              )}
            </Card.Body>
          </Accordion.Collapse>
        </Card>

        <Card
          className={`w-100 ${
            dataRecaudo && nameAprovechador !== "" ? "" : "d-none"
          }`}
        >
          <Accordion.Toggle
            as={Card.Header}
            eventKey="7"
            className="w-100 btn text-left"
          >
            <b>Notas/ Cambios de Valor</b>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="7" className="w-100">
            <Card.Body className="w-100">
              <div className="d-flex justify-content-start mb-3">
                <Button onClick={onClickDetailRecuido}> Regresar</Button>
              </div>
              <TablaNotasCambios data={dataNote} />
              {dataNote && (
                <PaginationTable data={dataNote} onPagerChange={onChangePage} />
              )}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card
          className={`w-100 ${
            dataRecaudo && nameAprovechador !== "" ? "" : "d-none"
          }`}
        >
          <Accordion.Toggle
            as={Card.Header}
            eventKey="8"
            className="w-100 btn text-left"
          >
            <b>Facturas Castigadas</b>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="8" className="w-100">
            <Card.Body className="w-100">
              <div className="d-flex justify-content-start mb-3">
                <Button onClick={onClickDetailRecuido}> Regresar</Button>
              </div>
              <TablaFacturaCastigadas
                data={dataFacturaCastigada ? dataFacturaCastigada.data : null}
              />
              {dataFacturaCastigada && (
                <PaginationTable
                  data={dataFacturaCastigada.data}
                  onPagerChange={onChangePageFac}
                />
              )}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </Fragment>
  );
}
