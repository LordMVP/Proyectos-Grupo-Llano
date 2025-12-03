import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
import { downloadFileBase64 } from "../../../apiHooks";;
import { getInformacionOperativa } from "../../../apiHooks/nocom/reports";
import InputCustom from "../../utils/InputCustom";


export function FormInfoOperative() {
  //states
  const [dateInit, setDataInit] = useState({
    fechaInicio: "",
  });
  // hooks api
  const { mutate: methodInfo, data: fileInfo } = getInformacionOperativa();
  //methods

  const handleChange = (event) => {
    const { value, name } = event.target;
    setDataInit((prev) => ({ ...prev, [name]: value }));
  };

  // effects
  useEffect(() => {
    if (!dateInit) return;
    if (!dateInit.fechaInicio) return;

    methodInfo(dateInit);
  }, [dateInit]);
  useEffect(() => {
    if (!fileInfo) return;
    downloadFileBase64(
      fileInfo.data,
      "application/vnd.ms-excel",
      "informacion operativa.xls"
    );
  }, [fileInfo]);

  return (
    <Form className="w-100">
      <InputCustom
        label="Fecha de inicio"
        md={4}
        propsInput={{
          type: "date",
          name: "fechaInicio",
          onChange: handleChange,
        }}
      />
    </Form>
  );
}
