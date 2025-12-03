import React, { useState, useEffect, useRef } from "react";
import { Form, Col, Button, Table } from "react-bootstrap";
import Spinner from "react-loader-spinner";
import Select from "react-select";
import moment from "moment";
import { toast } from "react-toastify";
//redux
import { connect } from "react-redux";
import {
  loadCiudades,
  clearCiudades,
  loadTipoIdentificacion,
  loadTipoPersona,
} from "../../../../../actions/suscripcionActions";
import {
  loadClasificacionTerceros,
  createSuscripcionTercero,
  actualizarSuscripcionTercero,
  clearActualizarSuscripcionTercero,
  clearSuscripcionTercero,
} from "../../../../../actions/suscripcionTercero";
//import component

import ModalEditPhone from "./ModalEditPhone";
import ModalEditEmail from "./ModalEditEmail";
import TableProperty from "./TableProperty";
// custom hooks
import { getUnitsContact } from "../../../../../api/hooks/suscripciones";
//interfaces
import { formDataThird } from "../../interfaces";
//default values
import { initialDataFormThird } from "../../initialsValues";
//methods generals
import {
  validNumberNotSimbol,
  isNumberCellPhone,
  isEmail,
  isValidForm,
  reorderForm,
} from "../../methods";

//innner interface
type Props = {
  isClear: boolean;
  onClearGeneric: () => void;
  search: () => void;
  searchDoc: () => void;
  ciudades: any[];
  tipos_persona: any[];
  tipos_indentificacion: any[];
  onLoadCiudades: (id: string) => void;
  onClearCiudades: () => void;
  loadTipoIdentificacion: () => void;
  loadTipoPersona: () => void;
  handleChangeFormCreate: (formDataThird: formDataThird) => void;
  seletThird: formDataThird | null;
  loadClasificacion: () => void;
  clasificaciones: any[];
  crearTercero: (data: any) => void;
  crear: any;
  actualizar: any;
  actualizarSuscripcionTerceroAction: (data: { id: string; form: any }) => void;
  handleAsingIdThird: (data: null | string | number) => void;
  handleAsingProperty: (data: any) => void;
  handleChangeSeccion: (data: string) => void;
  clearActualizar: () => void;
  clearCrearTercero: () => void;
};
type dataEditInterfacePhone = {
  position: number;
  data: {
    type: string;
    value: string;
  };
};

type typeCurrenNumber = {
  type: string;
  number: string;
};
type typeCurrenNumberEdit = {
  type: string;

  number: string;
  position: number;
} | null;

function FormInformationThird(props: Props) {
  //props
  const {
    isClear,
    onClearGeneric,
    search,
    searchDoc,
    ciudades,
    onLoadCiudades,
    onClearCiudades,
    loadTipoIdentificacion,
    tipos_indentificacion,
    tipos_persona,
    loadTipoPersona,
    handleChangeFormCreate,
    seletThird,
    loadClasificacion,
    clasificaciones,
    crearTercero,
    crear,
    actualizar,
    actualizarSuscripcionTerceroAction,
    clearActualizar,
    clearCrearTercero,
    handleAsingIdThird,
    handleAsingProperty,
    handleChangeSeccion,
  } = props;

  //consts
  const selectCity = useRef<any>(null);
  const selectClasThird = useRef<any>(null);
  // hooks api
  const [units, getUnits] = getUnitsContact(null);
  //state
  const [formData, setformData] = useState<formDataThird>({
    ...initialDataFormThird,
  });
  const [isLoading, setisLoading] = useState(false);

  const [modalEditPhone, setModalEditPhone] = useState<boolean>(false);
  const [modalEditEmail, setModalEditEmail] = useState<boolean>(false);
  const [listClasificationsThird, setlistClasificationsThird] = useState<
    number[]
  >([]);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentNumber, setCurrentNumber] = useState<typeCurrenNumber>({
    type: "",
    number: "",
  });

  const [currentNumberEdit, setCurrentNumberEdit] =
    useState<typeCurrenNumberEdit>(null);
  const [numberPhone, setNumberPhone] = useState<typeCurrenNumber[]>([]);
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [currentEmailEdit, setCurrentEmailEdit] = useState<{
    position: number;
    email: string;
  } | null>(null);
  const [emails, setEmails] = useState<string[]>([]);
  //methods

  const onCLoseModalEdit = () => {
    setCurrentNumberEdit(null);
    setModalEditPhone(false);
  };
  const onCLoseModalEditEmail = () => setModalEditEmail(false);
  const editPhone = (data: dataEditInterfacePhone) =>
    setNumberPhone((prev) =>
      prev.map((item: typeCurrenNumber, index: number) =>
        data.position === index
          ? {
              type: data.data.type,
              number: data.data.value,
            }
          : item
      )
    );
  const deletePhome = (position: number) => {
    console.log(position);
    let custonArray: typeCurrenNumber[] = [];

    numberPhone.forEach((item: typeCurrenNumber, index: number) => {
      if (position !== index) {
        custonArray.push(item);
      }
    });

    setNumberPhone(custonArray);
  };
  const editEmail = (data) => {
    const { position, email } = data;

    let custonArray: string[] = [];
    emails.forEach((item: string, index: number) => {
      if (position === index) {
        custonArray.push(email);
      } else {
        custonArray.push(item);
      }
    });

    setEmails(custonArray);
  };

  const deleteEmail = (position: number) => {
    let custonArray: string[] = [];

    emails.forEach((item: string, index: number) => {
      if (position !== index) {
        custonArray.push(item);
      }
    });

    setEmails(custonArray);
  };
  const handleChangeSelect = (e: any) => {
    const { name, value } = e;

    if (name === "ciudadCod") {
      onClearCiudades();

      setformData({
        ...formData,
        [name]: `${value.value}`,
        ciudadNombre: value.label,
      });
    }
    if (name === "claterceros") {
      setlistClasificationsThird(value.map((it) => Number(it.value)));
    }
  };
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    console.log("que hay en data",formData)
    //^[a-zA-Z ]+$ or empty
    const regex = /^[a-zA-Z ]+$/;
    //terApellido
    if (name === "terApellido") {
      if (regex.test(value) || value === "") {
        setformData({ ...formData, [name]: value });
      }
    } else if (name === "terNombre") {
      if (regex.test(value) || value === "") {
        setformData({ ...formData, [name]: value });
      }
    } else if (name === "uniTipidentifica") {
      setformData({ ...formData, [name]: Number(value) });
    } else if (name === "uniTiptercero") {
      setformData({ ...formData, [name]: value === "" ? null : Number(value) });
    } else if (name === "terDocumento") {
      if (validNumberNotSimbol(value))
        setformData({ ...formData, [name]: value });
    } else if (name === "terDigverificacion") {
      if (validNumberNotSimbol(value) && value.length <= 1)
        setformData({ ...formData, [name]: value });
    } else {
      setformData({ ...formData, [name]: value });
    }
  };
  const saveThird = () => {
    setisLoading(true);
    if (isEdit) {
      const data = isValidForm(
        formData,
        listClasificationsThird,
        emails,
        numberPhone
      );
      if (data.valid && formData.terIderegistro) {
        actualizarSuscripcionTerceroAction({
          id: `${formData.terIderegistro}`,
          form: data.form,
        });
      } else {
        toast.error("Verifique los datos");
        setisLoading(false);
      }
    } else {
      const data = isValidForm(
        formData,
        listClasificationsThird,
        emails,
        numberPhone
      );

      if (data.valid) {
        crearTercero(data.form);
      } else {
        toast.error("Verifique los datos");
        setisLoading(false);
      }
    }
  };
  const onSearchCity = (e: string) => {
    if (e !== "") onLoadCiudades(e);
  };
  const onCLearForm = () => {
    if (selectCity) selectCity.current.select.clearValue();
    if (selectClasThird) selectClasThird.current.select.clearValue();
    handleAsingIdThird(null);
    setformData(initialDataFormThird);
    setEmails([]);
    setNumberPhone([]);
    setIsEdit(false);
    setformData((prev) => ({
      ...prev,
      uniTiptercero: tipos_persona ? tipos_persona[0]?.uniIderegistro : null,
      uniTipidentifica: tipos_indentificacion
        ? tipos_indentificacion[0]?.uniIderegistro
        : null,
    }));
  };

  const setnumberPhone = (e: any) => {
    if (!e.target) return;
    if (!validNumberNotSimbol(e.target.value)) return;
    const { value } = e.target;

    setCurrentNumber((prev) => ({
      ...prev,
      number: value,
    }));
  };
  const addNumber = () => {
    const idMovil = units.find((it) => it.nombre.indexOf("Movil") > -1);
    if (
      currentNumber.type === idMovil?.id &&
      !isNumberCellPhone(currentNumber.number)
    ) {
      toast.warn("El numero debe ser un celular");
    } else {
      setNumberPhone([
        ...numberPhone,
        { type: currentNumber.type, number: currentNumber.number },
      ]);
      setCurrentNumber({
        type: units?.filter(
          (it) => it.nombre !== "Correo electronico Contacto"
        )[0]?.id,
        number: "",
      });
    }
  };
  const onEditNumber = (position: number) => {
    console.log(position);
    setCurrentNumberEdit({
      type: numberPhone[position].type,

      number: numberPhone[position].number,
      position,
    });

    setModalEditPhone(true);
  };
  const addEmail = () => {
    if (isEmail(currentEmail)) {
      setEmails((prev) => [...prev, currentEmail]);

      setCurrentEmail("");
    } else {
      toast.warn("El email no es valido");
    }
  };
  const onEditEmail = (position: number) => {
    setModalEditEmail(true);
    setCurrentEmailEdit({
      position,
      email: emails[position],
    });
  };

  const onChangeSelectTypeNumber = (e: any) => {
    const value = e.target.value;
    setCurrentNumber((prev) => ({
      ...prev,
      type: value,
    }));
  };
  //effects
  useEffect(() => {
    loadTipoIdentificacion();
    loadTipoPersona();
    loadClasificacion();
    getUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    handleChangeFormCreate(formData);
    if (selectCity) {
      if (formData.ciudadCod !== "") {
        if (selectCity.current.state.value === null) {
          selectCity.current.select.setValue({
            value: formData.ciudadCod,
            label: formData.ciudadNombre,
          });
        }
        if (selectCity.current.state.value !== null) {
          if (selectCity.current.state.value.value !== formData.ciudadCod) {
            selectCity.current.select.setValue({
              value: formData.ciudadCod,
              label: formData.ciudadNombre,
            });
          }
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);
  useEffect(() => {
    if (
      tipos_indentificacion &&
      tipos_indentificacion.length > 0 &&
      formData.uniTipidentifica === null
    ) {
      setformData({
        ...formData,
        uniTipidentifica: tipos_indentificacion[0].uniIderegistro,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipos_indentificacion]);
  useEffect(() => {
    if (tipos_persona && tipos_persona.length > 0) {
      if (formData.uniTiptercero === null) {
        const dataUse = tipos_persona.filter((it) => it.uniNivel === 2);
        setformData((prev) => ({
          ...prev,
          uniTiptercero: dataUse[0].uniIderegistro,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipos_persona]);
  useEffect(() => {
    if (seletThird) {
      console.log(seletThird);
      const { cloneForm, classification, emails, numPhones } = reorderForm(
        seletThird,
        units
      );
      console.log(cloneForm);

      let tempDataRawClass: { label: string; value: string }[] = [];

      classification.forEach((element) => {
        const searchClas = clasificaciones.find(
          (ele) => Number(ele.id) === element
        );
        if (searchClas !== undefined) {
          tempDataRawClass.push({
            label: searchClas.nombre,
            value: searchClas.id.toString(),
          });
        }
      });
      if (selectClasThird)
        selectClasThird.current.select.setValue(tempDataRawClass);
      if (selectCity)
        selectCity.current.select.clearValue({
          label: seletThird.ciudadNombre,
          value: seletThird.ciudadCod,
        });

      setformData({ ...cloneForm });
      setlistClasificationsThird(classification);
      setEmails(emails);
      setNumberPhone(numPhones);
      setIsEdit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seletThird]);

  useEffect(() => {
    if (crear) {
      toast.success("Tercero creado correctamente");
      setisLoading(false);
      setformData((prev) => ({
        ...prev,
        terIderegistro: `${crear?.terIderegistro}`,
      }));
      handleAsingIdThird(crear?.terIderegistro);
      setIsEdit(true);
      clearCrearTercero();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crear]);
  useEffect(() => {
    if (actualizar) {
      toast.success("Tercero actualizado correctamente");
      setisLoading(false);
      clearActualizar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualizar]);

  useEffect(() => {
    if (isClear) {
      onCLearForm();
      onClearGeneric();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClear]);

  useEffect(() => {
    //setCurrentNumber
    if (!units) return;
    setCurrentNumber((prev) => ({
      ...prev,
      type: units.filter((it) => it.nombre !== "Correo electronico Contacto")[0]
        ?.id,
    }));
  }, [units]);

  console.log(units);
  // renders
  const ComponentLoad = () => {
    return (
      <>
        <Spinner
          type="Oval"
          color="#fff"
          height={20}
          width={20}
          strokeWidth={3}
        />
      </>
    );
  };
  return (
    <>
      <ModalEditPhone
        show={modalEditPhone}
        onHide={onCLoseModalEdit}
        onAction={editPhone}
        optionList={
          units
            ? units
                .filter((it) => it.nombre !== "Correo electronico Contacto")
                .map((it) => ({
                  label: it.nombre.indexOf("Movil") > -1 ? "Movil" : "Fijo",
                  value: it.id,
                }))
            : []
        }
        data={currentNumberEdit}
      />
      <ModalEditEmail
        show={modalEditEmail}
        onHide={onCLoseModalEditEmail}
        data={currentEmailEdit}
        onAction={editEmail}
      />
      <Form.Row>
        <Form.Group as={Col} md="12">
          <div className="w-100 d-flex justify-content-end">
            <Button className="mr-3" onClick={onCLearForm}>
              Nuevo Tercero
            </Button>
            <Button onClick={saveThird}>
              {isEdit ? "Actualizar" : "Guardar"}

              {isLoading && <ComponentLoad />}
            </Button>
          </div>
        </Form.Group>
        {/*seccion col 1 */}
        <Form.Group as={Col} md="6">
          {/*row 1 */}
          <Form.Row>
            <Form.Group as={Col} md="6">
              <Form.Label>Documento Tercero</Form.Label>

              <Form.Control
                as="select"
                name="uniTipidentifica"
                onChange={handleChange}
                value={
                  `${formData.uniTipidentifica}` ||
                  tipos_indentificacion[0].uniIderegistro
                }
              >
                {tipos_indentificacion.map((it) => (
                  <option key={it.uniIderegistro} value={it.uniIderegistro}>
                    {it.uniNombre1}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} md="3" className="pt-4 mt-2">
              <Form.Control
                type="text"
                name="terDocumento"
                placeholder="Número de Documento"
                value={formData.terDocumento}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group as={Col} md="2" className="pt-4 mt-2">
              <Form.Control
                type="text"
                name="terDigverificacion"
                placeholder="DV"
                value={formData.terDigverificacion || ""}
                onChange={handleChange}
                disabled={formData.uniTipidentifica == 929 || formData.uniTipidentifica == 1047 ? false : true}
              />
            </Form.Group>
            <Form.Group as={Col} md="1" className="pt-4 mt-2">
              <Button variant="primary" onClick={searchDoc}>
                B
              </Button>
            </Form.Group>
          </Form.Row>
          {/*row 2 */}
          <Form.Row>
            <Form.Group as={Col} md="6">
              <Form.Label>Tercero Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombres"
                name="terNombre"
                value={formData.terNombre}
                onChange={handleChange}
                datatype="text"


              />
            </Form.Group>
            <Form.Group as={Col} md="6">
              <Form.Label>Tercero Apellido</Form.Label>
              <Form.Control
                type="text"
                placeholder="Apellidos"
                name="terApellido"
                value={formData.terApellido}
                onChange={handleChange}
              />
            </Form.Group>
          </Form.Row>
          {/*row 3 */}
          <Form.Row>
            <Form.Group as={Col} md="6">
              <Form.Label>Fecha Nacimiento</Form.Label>
              <Form.Control
                type="date"
                name="terFecnacimiento"
                value={moment(formData.terFecnacimiento).format("YYYY-MM-DD")}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group as={Col} md="6">
              <Form.Label>Genero</Form.Label>

              <Form.Control
                as="select"
                name="terSexo"
                value={formData.terSexo}
                onChange={handleChange}
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="N">N /A</option>
              </Form.Control>
            </Form.Group>
          </Form.Row>

          {/*row 4 */}
          <Form.Row>
            <Form.Group as={Col} md="12">
              <h2>Contacto Telefónico</h2>
            </Form.Group>

            <Form.Group as={Col} md="5">
              <Form.Label>Tipo Telefono</Form.Label>
              <Form.Control
                as="select"
                value={currentNumber.type}
                onChange={onChangeSelectTypeNumber}
              >
                {units &&
                  units
                    .filter((it) => it.nombre !== "Correo electronico Contacto")
                    .map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.nombre.indexOf("Movil") > -1 ? "Movil" : "Fijo"}
                      </option>
                    ))}
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} md="5">
              <Form.Label>Número</Form.Label>
              <Form.Control
                type="text"
                value={currentNumber.number}
                onChange={setnumberPhone}
              />
            </Form.Group>
            <Form.Group as={Col} md="2" className="pt-4 mt-2">
              <Button
                variant="success"
                onClick={addNumber}
                disabled={currentNumber.number === ""}
              >
                +
              </Button>
            </Form.Group>

            <Form.Group as={Col} md="12">
              <Table striped bordered>
                <tbody>
                  {numberPhone.length > 0 &&
                    numberPhone.map((item, index) => (
                      <tr key={`table-if-${index}`} className="text-center">
                        <td>{item.type === "4666" ? "Movil" : "Fijo"}</td>
                        <td>{item.number}</td>
                        <td>
                          <Button
                            variant="success"
                            className="mr-2"
                            onClick={() => onEditNumber(index)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => deletePhome(index)}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Form.Group>
          </Form.Row>
        </Form.Group>
        {/*seccion col 2 */}
        <Form.Group as={Col} md="6">
          {/*row 1 */}
          <Form.Row>
            <Form.Group as={Col} md="6">
              <Form.Label>Ciudad Expedicion</Form.Label>
              <Select
                ref={selectCity}
                options={
                  ciudades &&
                  Array.isArray(ciudades) &&
                  ciudades.map((it) => ({
                    label: it.nombre,
                    value: it.id,
                  }))
                }
                name="ciudadCod"
                defaultValue={
                  formData.ciudadCod
                    ? {
                        label: formData.ciudadNombre,
                        value: formData.ciudadCod,
                      }
                    : {
                        label: "Ciudad",
                        value: "",
                      }
                }
                onChange={(e: any) =>
                  e ? handleChangeSelect({ name: "ciudadCod", value: e }) : null
                }
                onInputChange={onSearchCity}
                placeholder={"Ciudad"}
              />
            </Form.Group>
            <Form.Group as={Col} md="6">
              <Form.Label>Fecha Expedición</Form.Label>
              <Form.Control
                type="date"
                name="terDocexpedicion"
                value={moment(formData.terDocexpedicion).format("YYYY-MM-DD")}
                onChange={handleChange}
              />
            </Form.Group>
          </Form.Row>

          {/*row 2 */}
          <Form.Row>
            <Form.Group as={Col} md="10">
              <Form.Label>Nombre y Apellidos Completos</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre y Apellidos"
                value={`${formData.terNombre} ${formData.terApellido}`}
                disabled={true}
              />
            </Form.Group>
            <Form.Group as={Col} md="2" className="pt-4 mt-2">
              <Button variant="primary" onClick={search}>
                B
              </Button>
            </Form.Group>
          </Form.Row>
          {/*row 3 */}
          <Form.Row>
            <Form.Group as={Col} md="6">
              <Form.Label>Naturaleza</Form.Label>
              <Form.Control
                as="select"
                name="uniTiptercero"
                value={formData.uniTiptercero || ""}
                onChange={handleChange}
              >
                <option value="">-- Seleccione --</option>
                {tipos_persona
                  ?.filter((it) => it.uniNivel === 2)
                  ?.map((it) => (
                    <option
                      key={it.uniIderegistro}
                      value={it.uniIderegistro}
                    >{`${it.uniNombre1}${
                      it.uniNombre2 ? ` - ${it.uniNombre2}` : ""
                    } `}</option>
                  ))}
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} md="6">
              <Form.Label>Clasificación</Form.Label>
              <Select
                ref={selectClasThird}
                options={clasificaciones.map((it) => ({
                  label: it.nombre,
                  value: it.id,
                }))}
                name="claterceros"
                defaultValue={
                  formData.claterceros && formData.claterceros.length > 0
                    ? formData.claterceros.reduce(
                        // eslint-disable-next-line array-callback-return
                        (acc: any[], it: any): any => {
                          const dataFind = clasificaciones.find(
                            (it2) => it2.id === it.uniClatercero
                          );
                          if (dataFind) {
                            acc.push({
                              label: dataFind.nombre,
                              value: dataFind.id,
                            });
                            return acc;
                          }
                        },
                        []
                      )
                    : []
                }
                onChange={(e: any) =>
                  e
                    ? handleChangeSelect({ name: "claterceros", value: e })
                    : null
                }
                isMulti={true}
              />
            </Form.Group>
          </Form.Row>

          {/*row 4 */}
          <Form.Row>
            <Form.Group as={Col} md="12">
              <h2>Contacto Correo</h2>
            </Form.Group>
            <Form.Group as={Col} md="10">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                value={currentEmail}
                onChange={(e: any) => setCurrentEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} md="2" className="pt-4 mt-2">
              <Button
                variant="success"
                disabled={!isEmail(currentEmail)}
                onClick={addEmail}
              >
                +
              </Button>
            </Form.Group>

            <Form.Group as={Col} md="12">
              <Table striped bordered>
                <tbody>
                  {emails.map((item, idx) => (
                    <tr className="text-center" key={`email-${idx}`}>
                      <td>{item}</td>

                      <td>
                        <Button
                          variant="success"
                          className="mr-2"
                          onClick={() => onEditEmail(idx)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => deleteEmail(idx)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Form.Group>
          </Form.Row>
        </Form.Group>
        {/*seccion col 3 */}
        <TableProperty
          formThird={formData}
          handleAsingProperty={handleAsingProperty}
          handleChangeSeccion={handleChangeSeccion}
        />
      </Form.Row>
    </>
  );
}
var _ = require('lodash');
const mapStateToProps = (state) => ({
  ciudades: state.suscripcionReducer.ciudades,
  tipos_indentificacion: state.suscripcionReducer.tipos_indentificacion,
  tipos_persona: state.suscripcionReducer.tipos_persona,
  clasificaciones: _.sortBy(state.suscripcionTerceroReducer.clasificaciones,'nombre'),
  crear: state.suscripcionTerceroReducer.crear,
  actualizar: state.suscripcionTerceroReducer.actualizar,
});

const mapDispatchToProps = (dispatch) => ({
  onLoadCiudades: (data) => dispatch(loadCiudades(data)),
  onClearCiudades: () => dispatch(clearCiudades()),
  loadTipoIdentificacion: () => dispatch(loadTipoIdentificacion()),
  loadTipoPersona: () => dispatch(loadTipoPersona()),
  loadClasificacion: () => dispatch(loadClasificacionTerceros()),
  crearTercero: (form: any) => dispatch(createSuscripcionTercero(form)),
  actualizarSuscripcionTerceroAction: (data: { id: string; form: any }) =>
    dispatch(actualizarSuscripcionTercero(data)),
  clearActualizar: () => dispatch(clearActualizarSuscripcionTercero()),
  clearCrearTercero: () => dispatch(clearSuscripcionTercero()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormInformationThird);
