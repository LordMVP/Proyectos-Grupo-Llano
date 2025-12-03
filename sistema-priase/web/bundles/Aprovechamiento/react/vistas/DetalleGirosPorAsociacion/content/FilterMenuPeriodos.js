import React, { useRef, Fragment, useEffect, useState } from "react";
import { Button, Form, Col, Card } from "react-bootstrap";
import Select from "react-select";
import moment from "moment";

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

 * @param {object } props.stateDataApi - objeto con los datos de la api para la busqueda
 * @returns  {component}
 */
export default function FilterMenuPeriodos({
  text = "Información",
  setForm = () => {},
  form,
  buttonCleanRef,
  getData,

  stateDataApi,
}) {
  //const
  //estados del compoenente
  const [isDisableSearch, setisDisableSearch] = useState(false);
  const [stateDisableClear, setstateDisableClear] = useState(false);

  //ref para el formulario
  const InputNameRef = useRef(null);
  const InputDocRef = useRef(null);

  //funcion para hacer la busqueda a la api
  const onSubmit = () => {
    let settlementPeriods = [];
    form.dateDate.forEach((element) => {
      settlementPeriods.push({
        start: `${element}-01-01`,
        end: `${element}-12-31`,
      });
    });

    getData({
      idTerceroList: REMOVE_DUPLICATES([...form.dsusId, ...form.codBefore]),
      settlementPeriods,
    });
  };
  //funcion para limpiar los inputs
  const onClean = () => {
    InputNameRef.current.select.clearValue();
    InputDocRef.current.select.clearValue();

    setForm(INITIALFORM_RECAUDACION_POR_APROVECHADOR);
  };

  // camptura los cambios de los inputs para ponerlos en el formulario

  const onChangeNames = (e) => {
    if (e.length > 0) {
      let all = false;
      let tempobje = form;
      let dataComplete = [];

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

      setForm({ ...form, dsusId: tempobje.dsusId });
      return;
    }

    setForm({ ...form, dsusId: [] });
  };
  // camptura los cambios de los inputs para ponerlos en el formulario
  const onChangeDoTerm = (e) => {
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
        data = stateDataApi.dataPeriods.map((ele) => ele.value);
      } else {
        data = e.map((item) => item.value);
      }

      return setForm({ ...form, dateDate: data });
    }

    //dateDate
    return setForm({ ...form, dateDate: [] });
  };

  //captura los cambios en el formulario
  useEffect(() => {
    if (form) {
      setstateDisableClear(
        !(
          (form.dsusId && form.dsusId.length > 0) ||
          (form.dateDate && form.dateDate.length > 0)
        )
      );
      setisDisableSearch(form.dsusId && form.dateDate);
    }
  }, [form]);
  //funcion para limpiar los inputs cuando se cambia de pestaña
  useEffect(() => {
    onClean();
  }, [text]);
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
              options={
                stateDataApi.dataNames.length > 0
                  ? [
                      {
                        value: "Todos",
                        label: "Todos",
                      },
                      ...stateDataApi.dataNames,
                    ]
                  : []
              }
              label="Single select"
              placeholder="Seleccione"
              noOptionsMessage={() => "No se encontraron resultados"}
              isMulti={true}
            />
          </Form.Group>
          <Form.Group className="inline-form" as={Col} md="3">
            <Form.Label>Peridos</Form.Label>
            <Select
              ref={InputDocRef}
              onChange={onChangeDoTerm}
              id={"periodosDocumento"}
              options={
                stateDataApi.dataPeriods.length > 0
                  ? [
                      {
                        value: "Todos",
                        label: "Todos",
                      },
                      ...stateDataApi.dataPeriods,
                    ]
                  : []
              }
              label="Single select"
              placeholder="Seleccione"
              isMulti={true}
              noOptionsMessage={() => "No se encontraron resultados"}
            />
          </Form.Group>
          <Form.Group className="inline-form pt-4" as={Col} md="5">
            <Button disabled={!isDisableSearch} onClick={onSubmit}>
              Buscar
            </Button>
            <Button
              disabled={stateDisableClear}
              onClick={onClean}
              className="ml-2"
              ref={buttonCleanRef}
            >
              Limpiar
            </Button>{" "}
          </Form.Group>
        </Form.Row>
      </Form>
    </Fragment>
  );
}
