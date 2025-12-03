import React, { useRef, Fragment, useEffect, useState } from "react";
import { Button, Form, Col, Card } from "react-bootstrap";
import Select from "react-select";
import TablaSeleccion from "./TablaSeleccion";

import { INITIALFORM_RECAUDACION_POR_APROVECHADOR } from "../../../global/constantes";
import { REMOVE_DUPLICATES } from "../../../global/constantes";
/**
 *
 * @param {object } props  - propiedades del componente
 * @param {string } props.text - texto para mostrar como titulo
 * @param {requestCallback } props.setForm - funcion para setear el formulario
 * @param {object } props.form - objecto con los datos del formulario
 * @param {requestCallback } props.buttonCleanRef - funcion para limpiar los inputs
 * @param {requestCallback } props.getData - funcion para consultar los datos de la api
 * @param {object[]} props.dataSelect - arreglo de objetos con los datos  seleccionados del a tabla
 * @param {requestCallback } props.setDataSelect - funcion para setear los datos seleccionados
 * @param {object } props.stateDataApi - objeto con los datos de la api para la busqueda
 * @returns  {component}
 */
export default function FilterMenu({
  text = "Información",
  setForm,
  form,
  buttonCleanRef,
  getData,
  dataSelect,
  setDataSelect,
  stateDataApi,
}) {
  //estados del compoenente
  const [isDisableSearch, setisDisableSearch] = useState(false);
  const [stateDisableClear, setstateDisableClear] = useState(false);
  //ref para el formulario
  const InputNameRef = useRef(null);
  const InputDocRef = useRef(null);
  const InputPerRef = useRef(null);
  const InputSelectRef = useRef(null);
  //captura los cambios en el formulario
  useEffect(() => {
    setstateDisableClear(
      form
        ? form.dsusId.length !== 0 ||
            form.codBefore.length !== 0 ||
            form.period !== 0 ||
            form.dateDate.length !== 0
        : false
    );
    setisDisableSearch(
      (form.dsusId.length !== 0 || form.codBefore.length !== 0) &&
        form.period !== 0 &&
        form.dateDate.length !== 0
    );
  }, [form]);
  //funcion para limpiar los inputs cuando se cambia de pestaña
  useEffect(() => {
    onClean();
  }, [text]);
  //funcion para hacer la busqueda a la api
  const onSubmit = () => {
    getData({
      filter: {
        terId: REMOVE_DUPLICATES([...form.dsusId, ...form.codBefore]),
        period: form.period,
        settlementPeriodForms: form.dateDate,
      },
      page: 0,
    });
  };
  //funcion para limpiar los inputs
  const onClean = () => {
    InputPerRef.current.select.clearValue();
    InputSelectRef.current.select.clearValue();
    InputNameRef.current.select.clearValue();
    InputDocRef.current.select.clearValue();
    setDataSelect([]);
    setForm(INITIALFORM_RECAUDACION_POR_APROVECHADOR);
  };

  /**
   * funcion encargada de la eliminación de la información de un aprovechador
   * tambien devuelve la tabla de la seleccion a la pagina inicial
   *
   * @param {object} dataInner  - información de un terIderegistro
   */
  const deleteOneSelect = (dataInner) => {
    let all = false;
    let tempForm = form;
    let tempInputDataNames = InputNameRef.current.select.getValue();
    let tempInputDataDocs = InputDocRef.current.select.getValue();

    tempInputDataNames.forEach((ele) => {
      if (ele.value === "Todos") {
        all = true;
      }
    });
    tempInputDataDocs.forEach((ele) => {
      if (ele.value === "Todos") {
        all = true;
      }
    });
    if (all) {
      let namesNotAll = stateDataApi.dataNames.filter(
        (item) => item.value !== dataInner.terIderegistro
      );
      let docsNotAll = stateDataApi.dataDocs.filter(
        (item) => item.value !== dataInner.terIderegistro
      );
      tempForm.dsusId = stateDataApi.dataNames.map((ele) =>
        ele.value !== dataInner.terIderegistro ? ele.value : null
      );
      tempForm.codBefore = stateDataApi.dataDocs.map((ele) =>
        ele.value !== dataInner.terIderegistro ? ele.value : null
      );
      InputNameRef.current.select.setValue(namesNotAll);
      InputDocRef.current.select.setValue(docsNotAll);
      setForm(tempForm);
      return;
    }
    tempInputDataNames = tempInputDataNames.filter(
      (item) => item.value !== dataInner.terIderegistro
    );

    tempInputDataDocs = tempInputDataDocs.filter(
      (item) => item.value !== dataInner.terIderegistro
    );

    tempForm.dsusId = tempInputDataDocs.map((ele) => ele.value);
    tempForm.codBefore = tempInputDataNames.map((ele) => ele.value);

    setForm(tempForm);
    if (tempInputDataNames.length > 0) {
      InputNameRef.current.select.setValue(tempInputDataNames);
    } else {
      InputNameRef.current.select.clearValue();
    }

    if (tempInputDataDocs.length > 0) {
      InputDocRef.current.select.setValue(tempInputDataDocs);
    } else {
      InputDocRef.current.select.clearValue();
    }
  };
  /**
   * borra todas la selecciones echas y vuelve a la pagina inicial
   */
  const deleteAllSelect = () => {
    InputNameRef.current.select.clearValue();
    InputDocRef.current.select.clearValue();
    InputSelectRef.current.select.clearValue();
    setDataSelect([]);
    setForm({ ...form, dsusId: [], codBefore: [], dateDate: [] });
  };
  // camptura los cambios de los inputs para ponerlos en el formulario

  const onChangeNames = (e) => {
    if (e.length > 0) {
      let all = false;
      let tempobje = form;
      let dataComplete = [];
      let result = [];
      e.forEach((ele) => {
        if (ele.value === "Todos") {
          all = true;
        }
      });
      if (all) {
        tempobje.dsusId = stateDataApi.dataTable.map(
          (ele) => ele.terIderegistro
        );
        dataComplete = stateDataApi.dataTable.map((ele) => ele.terIderegistro);
      } else {
        tempobje.dsusId = e.map((item) => item.value);

        dataComplete = REMOVE_DUPLICATES([
          ...tempobje.dsusId,
          ...form.codBefore,
        ]);
      }

      dataComplete.forEach((ele) => {
        stateDataApi.dataTable.forEach((ele2) => {
          if (ele === ele2.terIderegistro) {
            result.push(ele2);
          }
        });
      });
      setDataSelect(result);
      setForm({ ...form, dsusId: tempobje.dsusId });
      return;
    }
    setDataSelect(() => {
      let result = [];
      form.codBefore.forEach((ele) => {
        stateDataApi.dataTable.forEach((ele2) => {
          if (ele === ele2.terIderegistro) {
            result.push(ele2);
          }
        });
      });

      return result;
    });
    setForm({ ...form, dsusId: [] });
  };
  // camptura los cambios de los inputs para ponerlos en el formulario
  const onChangeDoTerm = (e) => {
    if (e.length > 0) {
      let tempobje = form;
      let all = false;
      let dataComplete = [];
      e.forEach((ele) => {
        if (ele.value === "Todos") {
          all = true;
        }
      });

      if (all) {
        //stateDataApi.
        tempobje.codBefore = stateDataApi.dataTable.map(
          (ele) => ele.terIderegistro
        );
        dataComplete = stateDataApi.dataTable.map((ele) => ele.terIderegistro);
      } else {
        tempobje.codBefore = e.map((item) => item.value);
        dataComplete = REMOVE_DUPLICATES([
          ...form.dsusId,
          ...tempobje.codBefore,
        ]);
      }

      let result = [];
      dataComplete.forEach((ele) => {
        stateDataApi.dataTable.forEach((ele2) => {
          if (ele === ele2.terIderegistro) {
            result.push(ele2);
          }
        });
      });

      setDataSelect(result);
      return setForm({ ...form, codBefore: tempobje.codBefore });
    }
    setDataSelect(() => {
      let result = [];
      form.dsusId.forEach((ele) => {
        stateDataApi.dataTable.forEach((ele2) => {
          if (ele === ele2.terIderegistro) {
            result.push(ele2);
          }
        });
      });

      return result;
    });

    return setForm({ ...form, codBefore: [] });
  };
  // camptura los cambios de los inputs para ponerlos en el formulario
  const onChangePeriods = (e) => {
    if (e.length > 0) {
      let data;
      let all = false;
      e.forEach((ele) => {
        if (ele.value === "Todos") {
          all = true;
        }
      });
      if (all) {
        //stateDataApi.
        data = stateDataApi.dataPeriodsLiq.map((ele) => ele.value);
      } else {
        data = e.map((item) => item.value);
      }

      return setForm({ ...form, dateDate: data });
    }

    //dateDate
    return setForm({ ...form, dateDate: [] });
  };
  // camptura los cambios de los inputs para ponerlos en el formulario
  const onChangePeriodSingle = (e) => {
    if (e) return setForm({ ...form, period: e.value });

    setForm({ ...form, period: 0 });
  };
  return (
    <Fragment>
      <h2>{text}</h2>
      <Form>
        <Form.Row>
          <Form.Group className="inline-form" as={Col} md="4">
            <Form.Label>Tercero Nombre / Apellidos: </Form.Label>
            <Select
              ref={InputNameRef}
              onChange={onChangeNames}
              id={"periodosNombre"}
              options={[
                {
                  value: "Todos",
                  label: "Todos",
                },
                ...stateDataApi.dataNames,
              ]}
              label="Single select"
              placeholder="Seleccione"
              noOptionsMessage={() => "No se encontraron resultados"}
              isMulti={true}
            />
          </Form.Group>
          <Form.Group className="inline-form" as={Col} md="2">
            <Form.Label>Documento Tercero</Form.Label>
            <Select
              ref={InputDocRef}
              onChange={onChangeDoTerm}
              id={"periodosDocumento"}
              options={[
                {
                  value: "Todos",
                  label: "Todos",
                },
                ...stateDataApi.dataDocs,
              ]}
              label="Single select"
              placeholder="Seleccione"
              isMulti={true}
              noOptionsMessage={() => "No se encontraron resultados"}
            />
          </Form.Group>
          <Form.Group className="inline-form" as={Col} md="2">
            <Form.Label>Periodo</Form.Label>
            <Select
              ref={InputPerRef}
              onChange={onChangePeriodSingle}
              id={"periodosPeriodo"}
              options={stateDataApi.dataPeriods}
              label="Single select"
              placeholder="Seleccione"
              noOptionsMessage={() => "No se encontraron resultados"}
            />
          </Form.Group>
          <Form.Group className="inline-form" as={Col} md="4">
            <Form.Label>
              Periodo de liquidación / Periodo de prestación
            </Form.Label>
            <Select
              ref={InputSelectRef}
              id={"periodosliquidacion"}
              onChange={onChangePeriods}
              options={[
                {
                  value: "Todos",
                  label: "Todos",
                },
                ...stateDataApi.dataPeriodsLiq,
              ]}
              isDisabled={form.period && form.period !== 0 ? false : true}
              placeholder="Seleccione"
              isMulti={true}
              noOptionsMessage={() => "No se encontraron resultados"}
            />
          </Form.Group>
        </Form.Row>
        <Card.Body className="w-100">
          <TablaSeleccion
            deleteAllSelect={deleteAllSelect}
            deleteOneSelect={deleteOneSelect}
            dataSelect={dataSelect}
          />
        </Card.Body>
        <Form.Row className="d-flex justify-content-center">
          <Button disabled={!isDisableSearch} onClick={onSubmit}>
            Buscar
          </Button>
          <Button
            disabled={!stateDisableClear}
            onClick={onClean}
            className="ml-2"
            ref={buttonCleanRef}
          >
            Limpiar
          </Button>
        </Form.Row>
      </Form>
    </Fragment>
  );
}
