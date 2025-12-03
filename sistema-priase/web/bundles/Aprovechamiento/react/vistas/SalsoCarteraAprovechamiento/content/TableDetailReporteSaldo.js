import React, { useEffect, useState, Fragment, useRef } from "react";
import { Table, Button, Accordion, Card } from "react-bootstrap";
import PaginationDinamic from "./PaginationDinamic";
import { REORDER_PAGES_DATA } from "../../../global/constantes";

export default function TableDetailReporteSaldo(props) {
  //props
  const { data = [], incentive } = props;
  //const
  const titleTableDinammic = incentive === 1 ? "Alcaldia" : "Aprovechamiento";
  const columns = [
    titleTableDinammic,
    "Total Facturado",
    "Recaudo Girado",
    "Cambios Vlr",
    "DINC",
    "Vlr Cartera Castigada",
    "Saldo Cartera",
    "Accion",
  ];
  const columns2 = [
    "Periodo Prestación",
    "Periodo Liquidación",
    "Total Facturado",
    "Reacudo Girado",
    "Cambios Vlr",
    "DINC",
    "Vlr Cartera Castigada",
    "Saldo Cartera",
  ];
  //states
  const [curremtPage, setCurremtPage] = useState(0);
  const [curremtPageDetails, setCurremtPageDetails] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [tableDataDetails, setTableDataDetails] = useState([]);
  const [total, setTotal] = useState({});
  const [totalDetails, setTotalDetails] = useState({});
  //ref
  const detailRef = useRef();
  //methods
  const handleClick = (item) => {
    const tempDataTable = REORDER_PAGES_DATA(item);
    setCurremtPageDetails(0);
    setTableDataDetails(tempDataTable);

    setTotalDetails({
      invoicedTotal: item.reduce((a, b) => a + b.invoicedTotal, 0),
      orderCollection: item.reduce((a, b) => a + b.orderCollection, 0),
      vlrChanges: item.reduce((a, b) => a + b.vlrChanges, 0),
      dinc: item.reduce((a, b) => a + b.dinc, 0),
      punishedWalletVlr: item.reduce((a, b) => a + b.punishedWalletVlr, 0),
      walletResidue: item.reduce((a, b) => a + b.walletResidue, 0),
    });

    if (detailRef) detailRef.current.click();
  };
  //effects
  useEffect(() => {
    if (data && data.length > 0) {
      const tempDataTable = REORDER_PAGES_DATA(data);
      setTableData(tempDataTable);
      setTotal({
        totalFacturado: data.reduce((a, b) => a + b.invoicedTotal, 0),
        totalRecaudoGirado: data.reduce((a, b) => a + b.orderCollection, 0),
        totalCambiosVlr: data.reduce((a, b) => a + b.vlrChanges, 0),
        totalDINC: data.reduce((a, b) => a + b.dinc, 0),
        totalVlrCarteraCastigada: data.reduce(
          (a, b) => a + b.punishedWalletVlr,
          0
        ),
        totalSaldoCartera: data.reduce((a, b) => a + b.walletResidue, 0),
      });
    }
  }, [data]);
  useEffect(() => {
    if (tableDataDetails && tableDataDetails.length > 0) {
    }
  }, [tableDataDetails]);
  return (
    <Fragment>
      <Accordion defaultActiveKey="1" className="w-100 mt-3">
        <Card className="w-100">
          <Accordion.Toggle
            as={Card.Header}
            eventKey="1"
            className="w-100 btn text-left"
          >
            <b>Saldo Cartera Terceros Aprovechadores</b>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1" className="w-100">
            <Card.Body className="w-100">
              <div
                className="d-flex flex-column w-100 mt-3 "
                style={{ overflow: "auto" }}
              >
                <Table striped bordered hover variant="info">
                  <thead className="text-uppercase">
                    <tr>
                      {columns.map((column, index) => (
                        <th key={index}>{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData[curremtPage] &&
                      tableData[curremtPage].map((item, index) => (
                        <tr key={index}>
                          <td>{item.aprov}</td>
                          <td>{item.invoicedTotal}</td>
                          <td>{item.orderCollection}</td>
                          <td>{item.vlrChanges}</td>
                          <td>{item.dinc}</td>
                          <td>{item.punishedWalletVlr}</td>
                          <td>{item.walletResidue}</td>
                          <td>
                            <Button onClick={() => handleClick(item.details)}>
                              Detalle
                            </Button>
                          </td>
                        </tr>
                      ))}
                    <tr>
                      <td>TOTALES</td>
                      <td>{total.totalFacturado}</td>
                      <td>{total.totalRecaudoGirado}</td>
                      <td>{total.totalCambiosVlr}</td>
                      <td>{total.totalDINC}</td>
                      <td>{total.totalVlrCarteraCastigada}</td>
                      <td>{total.totalSaldoCartera}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              {tableData.length > 1 && (
                <PaginationDinamic
                  currentPage={curremtPage}
                  setCurrentPage={setCurremtPage}
                  numPages={tableData.length - 1}
                />
              )}
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
            <b>Detalle Saldo Cartera por Periodo por Tercero Aprovechador</b>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="2" className="w-100">
            <Card.Body className="w-100">
              <div
                className="d-flex flex-column w-100 mt-3 "
                style={{ overflow: "auto" }}
              >
                <Table striped bordered hover variant="info">
                  <thead className="text-uppercase">
                    <tr>
                      {columns2.map((column, index) => (
                        <th key={index}>{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableDataDetails[curremtPageDetails] &&
                      tableDataDetails[curremtPageDetails].map(
                        (item, index) => (
                          <tr key={index}>
                            <td>{item.benefitPeriod}</td>
                            <td>{item.settlementPeriod}</td>
                            <td>{item.invoicedTotal}</td>
                            <td>{item.orderCollection}</td>
                            <td>{item.vlrChanges}</td>
                            <td>{item.dinc}</td>
                            <td>{item.punishedWalletVlr}</td>
                            <td>{item.walletResidue}</td>
                          </tr>
                        )
                      )}
                    <tr>
                      <td></td>
                      <td>TOTALES</td>
                      <td>{totalDetails.invoicedTotal}</td>
                      <td>{totalDetails.orderCollection}</td>
                      <td>{totalDetails.vlrChanges}</td>
                      <td>{totalDetails.dinc}</td>
                      <td>{totalDetails.punishedWalletVlr}</td>
                      <td>{totalDetails.walletResidue}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              {totalDetails.length > 1 && (
                <PaginationDinamic
                  currentPage={curremtPageDetails}
                  setCurrentPage={setCurremtPageDetails}
                  numPages={totalDetails.length - 1}
                />
              )}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </Fragment>
  );
}
