import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { downloadFileBase64, getLiquidacionEDS } from "../../../apiHooks";
import InputCustom from "../../utils/InputCustom";

export function FormLiquidacionEDS() {
  // api hooks
  const { mutate, data } = getLiquidacionEDS();
  //states
  const [dateInit, setDataInit] = useState({
    fechaInicio: "",
    fechaFin: "",
  });

  //methods
  const handleChange = (event) => {
    const { value, name } = event.target;
    setDataInit((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!dateInit.fechaInicio) return;
    if (!dateInit.fechaFin) return;
    mutate(dateInit);
  };
  useEffect(() => {
    if (!data || !data.data) return;

    downloadFileBase64(
      data.data,
      "application/vnd.ms-excel",
      "LiquidacionEDS.xls"
    );
  }, [data]);

  // render
  return (
    <Form className="w-100 row" onSubmit={handleSubmit}>
      <InputCustom
        label="Fecha de inicio"
        md={4}
        propsInput={{
          type: "date",
          name: "fechaInicio",
          onChange: handleChange,
          max: dateInit.fechaFin,
        }}
      />
      <InputCustom
        label="Fecha de fin"
        md={4}
        propsInput={{
          type: "date",
          name: "fechaFin",
          onChange: handleChange,
          min: dateInit.fechaInicio,
        }}
      />
      <Button type="submit">Buscar</Button>
    </Form>
  );
}
