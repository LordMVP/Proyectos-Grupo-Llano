import React, { Fragment, useRef, useState } from "react";
import { Button, Form, Col, Card } from "react-bootstrap";
import Select from "react-select";
import TablaSeleccion from "./TablaSeleccion";

const initialStateSelectInput = {
  value: 0,
  label: "Seleccione",
};

const initPage = 0;
/**
 * este componente muestra el filtro y dispara el evento del servidor de busqueda
 *
 * @param {object} props - propiedades del componente
 * @param {string} props.text - texto a usar para identificar el tipo de datos por defecto que traera
 * @param {object} props.buttonCleanRef - referencia del boton de limpiar
 * @param {requestCallback} props.getData - funcion que hace la peticion al back
 * @param {object[]} props.dataDocs - array de documentos de terceros
 * @param {object[]} props.dataNamesDocs - array de  nombres de  terceros
 * @param {object[]} props.options - array de  periodos de liquidación
 * @param {requestCallback} props.setForm - funcion que cambia el valor del form
 * @param {object} props.form - el form actual
 * @returns {component}
 */
export default function FilterMenu({
  text = "Información",
  buttonCleanRef,
  getData,
  dataSelect,
  setForm,
  form,
  stateDataApi,
  setDataSelect,
  incentive,
}) {
  //  const [currentPageNum, setcurrentPageNum] = useState(0);
  const InputNameRef = useRef(null);
  const InputDocRef = useRef(null);
  const InputSelectRef = useRef(null);

  const stateDisableClear = form
    ? (form.dsusId && form.dsusId.length !== 0) ||
      (form.codBefore && form.codBefore.length !== 0) ||
      form.dateInit !== 0 ||
      form.dateEnd !== 0
    : false;
  const stateDisableSearch = form
    ? ((form.dsusId && form.dsusId.length !== 0) ||
        (form.codBefore && form.codBefore.length !== 0)) &&
      form.periods &&
      form.periods.length !== 0
    : false;
  /**
   * envia los datos del form
   */
  const onSubmit = () => {
    const body = {
      idTerceroList: [...form.dsusId, ...form.codBefore].reduce((acc, item) => {
        if (!acc.includes(item)) {
          acc.push(item);
        }
        return acc;
      }, []),
      settlementPeriods: form.periods,
    };
    getData({
      incentive,
      body,
    });
  };
  /**
   * limpia los input y el form para un futura busqueda
   */
  const onClean = () => {
    InputSelectRef.current.select.setValue(initialStateSelectInput);
    //   InputNameRef.current.select.setValue(initialStateSelectInput);
    InputNameRef.current.select.clearValue();
    //  InputDocRef.current.select.setValue(initialStateSelectInput);
    InputDocRef.current.select.clearValue();
    setDataSelect([]);
    setForm({
      dsusId: [],
      codBefore: [],
      dateInit: 0,
      dateEnd: 0,
      periods: [],
    });
  };

  /**
   * funcion encargada de la eliminación de la información de un aprovechador
   * tambien devuelve la tabla de la seleccion a la pagina inicial
   *
   * @param {objet} dataInner  - información de un aprovechador
   */
  const deleteOneSelect = (dataInner) => {
    let all = false;
    let tempForm = form;
    let tempInputDataNames = InputNameRef.current.select.getValue();
    let tempInputDataDocs = InputDocRef.current.select.getValue();

    tempInputDataNames.forEach((ele) => {
      if (ele.value === "todos") {
        all = true;
      }
    });
    tempInputDataDocs.forEach((ele) => {
      if (ele.value === "todos") {
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
    setDataSelect([]);
    setForm({ ...form, dsusId: [], codBefore: [] });
  };

  const onChangeNamesThirds = (e) => {
    if (e.length > 0) {
      let all = false;
      let tempobje = form;
      let dataComplete = [];

      e.forEach((ele) => {
        if (ele.value === "todos") {
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
        dataComplete = [...tempobje.dsusId, ...form.codBefore].reduce(
          (acc, item) => {
            if (!acc.includes(item)) {
              acc.push(item);
            }
            return acc;
          },
          []
        );
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
      return setForm(tempobje);
    }

    setDataSelect(() => {
      let result = [];
      if (form.codBefore) {
        form.codBefore.forEach((ele) => {
          stateDataApi.dataTable.forEach((ele2) => {
            if (ele === ele2.terIderegistro) {
              result.push(ele2);
            }
          });
        });
      }

      return result;
    });
    return setForm({ ...form, dsusId: [] });
  };
  const onChangeDocsThirds = (e) => {
    if (e.length > 0) {
      let tempobje = form;
      let all = false;
      let dataComplete = [];
      e.forEach((ele) => {
        if (ele.value === "todos") {
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
        dataComplete = [...form.dsusId, ...tempobje.codBefore].reduce(
          (acc, item) => {
            if (!acc.includes(item)) {
              acc.push(item);
            }
            return acc;
          },
          []
        );
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
      return setForm(tempobje);
    }
    setDataSelect(() => {
      let result = [];
      if (form.dsusId) {
        form.dsusId.forEach((ele) => {
          stateDataApi.dataTable.forEach((ele2) => {
            if (ele === ele2.terIderegistro) {
              result.push(ele2);
            }
          });
        });
      }

      return result;
    });

    return setForm({ ...form, codBefore: [] });
  };
  const changePeriodo = (e) => {
    const { value } = e;
    setForm({
      ...form,
      periods: value,
    });
  };

  return (
    <Fragment>
      <h2>{text}</h2>
      <Form className="w-100">
        <Form.Row className="w-100">
          <Form.Group className="inline-form" as={Col} md="3">
            <Form.Label>Tercero Nombre / Apellido</Form.Label>
            <Select
              ref={InputNameRef}
              onChange={onChangeNamesThirds}
              id={"periodosNombre"}
              options={
                stateDataApi && stateDataApi.dataNames
                  ? [
                      { value: "todos", label: "Todos" },
                      ...stateDataApi.dataNames,
                    ]
                  : []
              }
              placeholder="Seleccione"
              isMulti={true}
              noOptionsMessage={() => "No se encontraron resultados"}
            />
          </Form.Group>
          <Form.Group className="inline-form" as={Col} md="3">
            <Form.Label>Documento Tercero</Form.Label>
            <Select
              ref={InputDocRef}
              onChange={onChangeDocsThirds}
              id={"periodosDocumento"}
              options={
                stateDataApi && stateDataApi.dataDocs
                  ? [
                      {
                        value: "todos",
                        label: "Todos",
                      },
                      ...stateDataApi.dataDocs,
                    ]
                  : []
              }
              label="Single select"
              placeholder="Seleccione"
              isMulti={true}
              noOptionsMessage={() => "No se encontraron resultados"}
            />
          </Form.Group>
          <Form.Group className="inline-form" as={Col} md="3">
            <Form.Label>Periodos</Form.Label>
            <Select
              ref={InputSelectRef}
              onChange={changePeriodo}
              id={"periodosliquidacion"}
              options={
                stateDataApi && stateDataApi.dataPeriods
                  ? stateDataApi.dataPeriods
                  : []
              }
              label="Single select"
              placeholder="Seleccione"
              noOptionsMessage={() => "No se encontraron resultados"}
            />
          </Form.Group>

          <Form.Group
            className="d-flex justify-content-start align-items-start pt-4"
            as={Col}
            md="3"
          >
            <Button disabled={!stateDisableSearch} onClick={onSubmit}>
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
          </Form.Group>
        </Form.Row>
        <Card.Body className="w-100">
          <TablaSeleccion
            deleteAllSelect={deleteAllSelect}
            deleteOneSelect={deleteOneSelect}
            dataSelect={dataSelect}
          />
        </Card.Body>
      </Form>
    </Fragment>
  );
}
