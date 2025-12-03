import React, { Fragment, useState, useRef, useEffect } from "react";

import Select from "react-select";
import { Form, Col } from "react-bootstrap";

// import { searchCityApi } from "../../../global/methodsApi/methods";
// import {
//   getFirmsMethods,
//   getOrganismsMethods,
//   getAdvisersMethods,
// } from "../../../global/methodsApi/peticionesApiVentas";
// import { autocompleteNameMethods } from "../../../global/methodsApi/peticionesApi";
import "./InputCustom.scss";
import { BoxArrowRight } from "react-bootstrap-icons";

export default function InputCustom({
  name = "default",
  refCustom,
  onChange = () => {},
  placeholder = "",
  defaultValue = "",
  md = "3",
  label = "",
  type = "text",
  options = [],
  isMulti = false,
  autoCompleteOptions = [],
  value = "",
  disabled = false,
  maxNumEnumerate = 0,
  inputEmail,
  setInputEmail,
}) {
  //api
  // const { dataFirms, mutateFirms } = getFirmsMethods();
  // const { dataOrganisms, mutateOrganisms } = getOrganismsMethods();
  // const { dataAdvisers, mutateAdvisers } = getAdvisersMethods();
  // const { responseAutocompleteName, autocompleteName } = autocompleteNameMethods();
  //states
  const [optionsAutoComplete, setOptionsAutoComplete] = useState([]);
  const [optionsAutoCompleteText, setOptionsAutoCompleteText] = useState([]);
  const [dataDefaultInputDate, setDataDefaultInputDate] = useState(
    defaultValue !== ""
  );
  const [valueInputGeo, setValueInputGeo] = useState(defaultValue);
  const [inputFirm, setInputFirm] = useState(defaultValue);
  const [valueInputText, setValueInputText] = useState(defaultValue);
  const [disableEmail, setDisableEmail] = useState(true);
  const [selectEmail, setSelectEmail] = useState(true);

  //refs
  const InputGeoRef = useRef(null);
  const InputTextRef = useRef(null);
  const InputDateRef = useRef(null);
  const InputSelectRef = useRef(null);
  const InputGroup = useRef(null);
  const InputFirm = useRef(null);

  const onFocus = (event) => {
    event.target.autocomplete = "off";
  };

  const customOnChange = (e) => {
    const valueAceptNum = /^[0-9]+$/;
    if (type === "geoSearch") {
      if (e.target.value === "") {
        setValueInputGeo("");

        return setOptionsAutoComplete([]);
      }
      InputGeoRef.current.value = e.target.value;
      setValueInputGeo(e.target.value);

      searchCityApi(e.target.value.trim().toUpperCase()).then((dataApi) => {
        if (dataApi.data.data.length > 0) {
          setOptionsAutoComplete(
            dataApi.data.data.map((it) => ({ value: it.id, text: it.nombre }))
          );
        }
      });

      return;
    }

    if (type === "numberRaw") {
      setValueInputText(e.target.value);
      return onChange({
        ...e,
        target: { ...e.target, name: name, value: e.target.value },
      });
    }
    if (type === "number") {
      if (e.target.value === "") {
        setValueInputText("");
        return onChange({
          ...e,

          target: { ...e.target, name: name, value: null },
        });
      }
      if (e.target.value.match(valueAceptNum)) {
        const tempValue = `${e.target.value}`;
        if (maxNumEnumerate > 0 && tempValue.length <= maxNumEnumerate) {
          setValueInputText(e.target.value);
          return onChange({
            ...e,
            target: { ...e.target, name: name, value: e.target.value },
          });
        }
        if (maxNumEnumerate === 0) {
          setValueInputText(e.target.value);
          return onChange({
            ...e,
            target: { ...e.target, name: name, value: e.target.value },
          });
        }
      }
    }

    if (type === "text" && autoCompleteOptions.length > 0) {
      if (e.target.value === "") {
        InputTextRef.current.value = e.target.value;
        setValueInputText("");
        return setOptionsAutoCompleteText([]);
      }
      InputTextRef.current.value = e.target.value;
      setValueInputText(e.target.value);
      const result = autoCompleteOptions.filter((item) =>
        item.toLowerCase().includes(e.target.value.toLowerCase())
      );
      onChange({
        ...e,
        target: { ...e.target, name: name, value: e.target.value },
      });
      return setOptionsAutoCompleteText(result);
    }

    if (
      type === "firmSearch" ||
      type === "organismSearch" ||
      type === "advisersSearch" ||
      type === "nameAutocomplete"
    ) {
      setInputFirm(e.target.value);
      if (e.target.value === "") {
        InputFirm.current.value = e.target.value;
        onChange({
          target: {
            name,
            value: 0,
            nameDir: e.target.value,
            item: { id: 0, nombre: e.target.value },
          },
        });
        return setOptionsAutoComplete([]);
      }

      InputFirm.current.value = e.target.value;
      if (type === "firmSearch") mutateFirms(`${e.target.value}`.toLowerCase());
      if (type === "organismSearch")
        mutateOrganisms(`${e.target.value}`.toLowerCase());
      if (type === "advisersSearch")
        mutateAdvisers(`${e.target.value}`.toLowerCase());
      if (type === "nameAutocomplete" && e.target.value.length > 1) {
        autocompleteName(e.target.value);
        onChange({
          target: {
            name,
            value: 0,
            nameDir: e.target.value,
            item: { id: 0, nombre: e.target.value },
          },
        });
      }

      return;
    }

    if (
      (type === "text" ||
        type === "password" ||
        (type === "email" && options.length == 0) ||
        type === "select" ||
        type === "checkSelect" ||
        type === "date" ||
        type === "textArea") &&
      autoCompleteOptions.length === 0
    ) {
      setValueInputText(e.target.value);
      return onChange(e);
    } else if (type === "email" && options.length > 0) {
      let tempText = e.target.value;

      if (inputEmail !== "") {
        tempText = tempText.replace(/@.*/g, "");
      }
      setValueInputText(tempText);
      return onChange(e);
    }
  };

  const customSelect = (value) => {
    if (value === "otro") {
      setSelectEmail("false");
      setInputEmail("");
    } else {
      setInputEmail(value);
    }

    setDisableEmail(false);
  };

  const onClickOptionAutocomplete = async (e) => {
    setValueInputGeo(e.text);
    onChange({
      target: {
        name,
        value: e.value,
        nameDir: e.text,
      },
    });
    setOptionsAutoComplete([]);
  };

  const onClickOptionAutocompleteFirm = async (e) => {
    if (InputFirm && InputFirm.current) {
      InputFirm.current.value = e.nombre;
    }
    setInputFirm(e.nombre);
    onChange({
      target: {
        name,
        value: e.id,
        nameDir: e.nombre,
        item: e,
      },
    });
    setOptionsAutoComplete([]);
  };

  const onClickOptionAutocompleteText = (e) => {
    onChange({
      target: {
        name,
        value: e,
      },
    });
    setOptionsAutoCompleteText([]);
    setValueInputText(e);
    if (InputTextRef && InputTextRef.current) {
      InputTextRef.current.value = e;
    }
  };

  useEffect(() => {
    if (!refCustom) return;

    if (InputGroup && InputGroup.current) {
      refCustom(InputGroup);
    }
  }, [InputGroup]);

  useEffect(() => {
    if (!refCustom) return;
    if (InputSelectRef && InputSelectRef.current) {
      refCustom(InputSelectRef);
    }
  }, [InputSelectRef]);
  // useEffect(() => {
  //   if (dataFirms) {
  //     setOptionsAutoComplete(dataFirms.data);
  //   }
  // }, [dataFirms]);
  // useEffect(() => {
  //   if (dataOrganisms) {
  //     setOptionsAutoComplete(dataOrganisms.data);
  //   }
  // }, [dataOrganisms]);
  // useEffect(() => {
  //   if (dataAdvisers) {
  //     setOptionsAutoComplete(dataAdvisers.data);
  //   }
  // }, [dataAdvisers]);
  // useEffect(() => {
  //   if (responseAutocompleteName) {
  //     setOptionsAutoComplete(responseAutocompleteName.data);
  //   }
  // }, [responseAutocompleteName]);
  useEffect(() => {
    if (disabled) {
      setValueInputText(value);
    } else {
      setValueInputText(defaultValue);
    }
  }, [disabled, defaultValue]);

  //returns conditionals dataAdvisers

  if (type === "email" && options.length !== 0) {
    return (
      <Fragment>
        <Form.Group
          className="inline-form px-3"
          as={Col}
          md={md}
          onFocus={onFocus}
          ref={InputGroup}
        >
          {label !== "" && <label className="form-label">{label}</label>}
          <div className="form-select-mail">
            <input
              className={
                selectEmail === true
                  ? "form-control w-50"
                  : " form-control w-100"
              }
              ref={InputTextRef}
              value={disabled ? value : valueInputText}
              type={type === "number" ? "text" : type}
              defaultValue={disabled ? value : valueInputText}
              placeholder={placeholder}
              name={name}
              onChange={customOnChange}
              disabled={disableEmail}
              autocomplete={"off"}
            />
            {selectEmail === true && (
              <Select
                ref={InputSelectRef}
                className={"w-50"}
                onChange={(e) => {
                  customSelect(e.value);
                }}
                name={"select_" + name}
                options={options}
                isMulti={isMulti}
                placeholder={"Seleccione"}
              />
            )}

            {selectEmail !== true && (
              <button
                onClick={() => setSelectEmail(true)}
                className="btn btn-primary btn-optSelect"
              >
                <BoxArrowRight></BoxArrowRight>
              </button>
            )}
          </div>
        </Form.Group>
      </Fragment>
    );
  }

  if (
    type === "text" ||
    type === "number" ||
    type === "password" ||
    type === "email"
  ) {
    return (
      <Fragment>
        <Form.Group
          className="inline-form px-3"
          as={Col}
          md={md}
          onFocus={onFocus}
          ref={InputGroup}
        >
          <label className="form-label">{label || "  "}</label>
          <input
            className="form-control w-100 "
            ref={InputTextRef}
            value={disabled ? value : valueInputText}
            type={type === "number" ? "text" : type}
            defaultValue={disabled ? value : valueInputText}
            placeholder={placeholder}
            name={name}
            onChange={customOnChange}
            disabled={disabled}
          />
          {maxNumEnumerate > 0 && type === "number" && (
            <div className="w-100 d-flex justify-content-end">
              <label
                className={`form-label mt-2 ${
                  `${valueInputText}`.length > maxNumEnumerate
                    ? "text-danger"
                    : ""
                }`}
              >
                {`${`${valueInputText}`.length} / ${maxNumEnumerate}`}
              </label>
            </div>
          )}
          {optionsAutoCompleteText.length > 0 && (
            <div className="InputAutocompleteContent d-flex flex-column ">
              {optionsAutoCompleteText.map((option, index) => (
                <div
                  key={index}
                  className="InputAutocompleteItem"
                  onClick={() => onClickOptionAutocompleteText(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </Form.Group>
      </Fragment>
    );
  }

  if (type === "numberRaw") {
    return (
      <Fragment>
        <Form.Group
          className="inline-form px-3"
          as={Col}
          md={md}
          onFocus={onFocus}
          ref={InputGroup}
        >
          {label !== "" && <label className="form-label">{label}</label>}
          <input
            className="form-control w-100 "
            ref={InputTextRef}
            value={disabled ? value : valueInputText}
            type={"number"}
            defaultValue={disabled ? value : valueInputText}
            placeholder={placeholder}
            name={name}
            onChange={customOnChange}
            disabled={disabled}
          />
          {maxNumEnumerate > 0 && type === "number" && (
            <div className="w-100 d-flex justify-content-end">
              <label
                className={`form-label mt-2 ${
                  `${valueInputText}`.length > maxNumEnumerate
                    ? "text-danger"
                    : ""
                }`}
              >
                {`${`${valueInputText}`.length} / ${maxNumEnumerate}`}
              </label>
            </div>
          )}
          {optionsAutoCompleteText.length > 0 && (
            <div className="InputAutocompleteContent d-flex flex-column ">
              {optionsAutoCompleteText.map((option, index) => (
                <div
                  key={index}
                  className="InputAutocompleteItem"
                  onClick={() => onClickOptionAutocompleteText(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </Form.Group>
      </Fragment>
    );
  }
  if (type === "textArea") {
    return (
      <Fragment>
        <Form.Group
          className="inline-form"
          as={Col}
          md={md}
          onFocus={onFocus}
          ref={InputGroup}
        >
          {label !== "" && <label className="form-label">{label}</label>}
          <textarea
            className="form-control w-100"
            name={name}
            placeholder={placeholder}
            onChange={customOnChange}
            disabled={disabled}
          >
            {disabled ? value : valueInputText}
          </textarea>
        </Form.Group>
      </Fragment>
    );
  }

  if (type === "date") {
    const onFocusDate = (event) => {
      onFocus(event);
      setDataDefaultInputDate(false);
    };
    return (
      <Fragment>
        <Form.Group
          className="inline-form px-3 "
          as={Col}
          md={md}
          onFocus={onFocusDate}
          ref={InputDateRef}
        >
          {label !== "" && <label className="form-label">{label}</label>}
          <input
            className="form-control w-100"
            value={disabled ? value : valueInputText}
            type={"date"}
            defaultValue={dataDefaultInputDate ? defaultValue : ""}
            placeholder={placeholder}
            name={name}
            onChange={customOnChange}
            disabled={disabled}
          />
        </Form.Group>
      </Fragment>
    );
  }
  if (type === "geoSearch") {
    return (
      <Fragment>
        <Form.Group
          onFocus={onFocus}
          className="inline-form px-3 "
          as={Col}
          md={md}
          ref={InputGroup}
          style={{ position: "relative" }}
        >
          {label !== "" && <label className="form-label">{label}</label>}
          <input
            className="form-control w-100"
            ref={InputGeoRef}
            value={disabled ? value : valueInputGeo}
            type={"text"}
            defaultValue={defaultValue}
            placeholder={placeholder}
            name={name}
            onChange={customOnChange}
            disabled={disabled}
          />

          {optionsAutoComplete.length > 0 && (
            <div className="InputAutocompleteContent d-flex flex-column ">
              {optionsAutoComplete.map((option, index) => (
                <div
                  key={index}
                  className="InputAutocompleteItem"
                  onClick={() => onClickOptionAutocomplete(option)}
                >
                  {option.text}
                </div>
              ))}
            </div>
          )}
        </Form.Group>
      </Fragment>
    );
  }

  if (
    type === "firmSearch" ||
    type === "organismSearch" ||
    type === "advisersSearch" ||
    type === "nameAutocomplete"
  ) {
    return (
      <Fragment>
        <Form.Group
          onFocus={onFocus}
          className="inline-form px-3"
          as={Col}
          md={md}
          ref={InputGroup}
          style={{ position: "relative" }}
        >
          {label !== "" && <label className="form-label">{label}</label>}

          <input
            className="form-control w-100"
            ref={InputFirm}
            value={disabled ? value : inputFirm}
            type={type}
            defaultValue={defaultValue}
            placeholder={placeholder}
            name={name}
            onChange={customOnChange}
            disabled={disabled}
          />
          {optionsAutoComplete.length > 0 && (
            <div className="InputAutocompleteContent d-flex flex-column ">
              {optionsAutoComplete.map((option, index) => (
                <div
                  key={index}
                  className="InputAutocompleteItem"
                  onClick={() => onClickOptionAutocompleteFirm(option)}
                >
                  {option.nombre}
                </div>
              ))}
            </div>
          )}
        </Form.Group>
      </Fragment>
    );
  }

  if (type === "checkSelect") {
    return (
      <Fragment>
        <Form.Group
          className="inline-form px-3"
          as={Col}
          md={md}
          onFocus={onFocus}
        >
          {label !== "" && <label className="form-label">{label}</label>}
          <Form.Check
            className="w-100"
            type="checkbox"
            disabled={disabled}
            onChange={onChange}
            name={name}
          />
        </Form.Group>
      </Fragment>
    );
  }

  if (type === "select") {
    return (
      <Fragment>
        <Form.Group
          className="inline-form px-3"
          as={Col}
          md={md}
          onFocus={onFocus}
        >
          {label !== "" && <Form.Label>{label}</Form.Label>}
          <Select
            ref={InputSelectRef}
            defaultValue={defaultValue}
            isDisabled={disabled}
            onChange={(e) => {
              customOnChange({
                target: {
                  name: name,
                  value: e ? (isMulti ? e : e.value) : null,
                },
              });
            }}
            name={name}
            options={options}
            isMulti={isMulti}
            placeholder={"Seleccione"}
          />
        </Form.Group>
      </Fragment>
    );
  }
  return null;
}