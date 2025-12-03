import React from "react";
import { Card, Tab, Tabs } from "react-bootstrap";
import {
  FormCompresiondistribucion,
  FormInfoOperative,
  FormLiquidacionEDS,
  FormMedicionEDSATR,
} from "./sections";

export function Reports() {
  return (
    <Tabs defaultActiveKey="infoOp" className="mb-3">
      <Tab eventKey="infoOp" title="Información operativa">
        <FormInfoOperative />
      </Tab>
      <Tab eventKey="liqEds" title="Liquidación EDS">
        <FormLiquidacionEDS />
      </Tab>
      <Tab eventKey="meEds" title="Medicion EDS ATR-DESGLO">
        <FormMedicionEDSATR />
      </Tab>
      <Tab eventKey="report" title="Reporte compresion distribución">
        <FormCompresiondistribucion />
      </Tab>
    </Tabs>
  );
}

export { Reports as NocomReports };
