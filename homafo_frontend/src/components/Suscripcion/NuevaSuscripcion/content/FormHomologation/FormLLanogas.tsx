import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Form, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Spinner from "react-loader-spinner";
//components
import ModalResultFilter from "./ModalResultFilter";
import "./tableTitle.css";
//actions redux
import * as actions from "../../../../../actions/suscripcionHomologacion";

//interfaces
import { filterSusHomologacion } from "../../interfaces";
//initail values

import { initialFomrFilterSusHomologacion } from "../../initialsValues";
import { validFormsHomologacionSearch } from "../../methods";

type Props = {
  idEmpresa: number;
  nameEnterprise: string;
  empreas_convenios: any; //redux state
  buscarHomologaciones: any; //redux state
  loadBuscarHomologaciones: (form: any) => void;
  selectHomologacion: (data: any) => void;
  clearBuscarHomologaciones: () => void;
  clearCrearHomologacion: () => void;
  handleChangeConvenio: (name: string) => void;
  currentSuscription: any;
  currentIdSuscripcion: any;
  crear: any;
};
function FormLLanogas(props: Props) {
  //props
  const {
    idEmpresa,
    nameEnterprise,
    buscarHomologaciones,
    clearCrearHomologacion,
    loadBuscarHomologaciones,
    selectHomologacion,
    handleChangeConvenio,
    crear,
    currentSuscription,
    currentIdSuscripcion,
    clearBuscarHomologaciones,
  } = props;
  //states
  const [formFilter, setFormFilter] = useState<filterSusHomologacion>({
    ...initialFomrFilterSusHomologacion(),
  });
  const [showModalResult, setShowModalResult] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDesh, setIsDeshomologacion] = useState<boolean>(false);
  //methods

  const handleChageInputs = (event: any) => {
    const { name, value } = event.target;
    if (name === "idempresa") {
      setFormFilter((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormFilter((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSearch = () => {
    let newForm: filterSusHomologacion = initialFomrFilterSusHomologacion();

    const isDeshomologacion = validFormsHomologacionSearch(
      currentSuscription,
      formFilter
    );
    if (isDeshomologacion) {
      newForm = {
        ...newForm,
        idempresa: idEmpresa,
        idsus: formFilter.idsus || currentSuscription.dsusIderegistr,
        deshomologacion: true,
      };
    } else {
      newForm = {
        ...newForm,
        ...formFilter,
        idempresa: idEmpresa,
        deshomologacion: false,
      };
    }
    setIsDeshomologacion(Boolean(newForm.deshomologacion));
    setCurrentData(null);
    selectHomologacion(null);

    loadBuscarHomologaciones(newForm);
    setIsLoading(true);
  };
  const handloToggle = () => setShowModalResult((prev) => !prev);
  const handleDataEdit = (data: any) => {
    setCurrentData(data);

    setFormFilter((prev) => ({
      ...prev,
      pcodigo: data.dsusPcodigo,
      medidor: data.proIdepropieda,
      idsus: data.dsusIderegistr,
    }));
    selectHomologacion({ ...data, isDeshomologacion: isDesh });
    handleChangeConvenio(`${data?.convenios[0]?.cnre_nombre}`);
    handloToggle();
  };

  //effects
  useEffect(() => {
    if (idEmpresa > 0) {
      setFormFilter((prev) => ({ ...prev, idempresa: Number(idEmpresa) }));
    }
  }, [idEmpresa]);
  useEffect(() => {
    if (buscarHomologaciones) {
      if (buscarHomologaciones?.length > 0) {
        setShowModalResult(true);
      } else {
        toast.warn("No se encontro homologaciones para estos datos");
        clearBuscarHomologaciones();
      }
      setIsLoading(false);
    }
  }, [buscarHomologaciones, clearBuscarHomologaciones]);
  useEffect(() => {
    if (crear) {
      setCurrentData(null);
      selectHomologacion(null);
      setFormFilter({ ...initialFomrFilterSusHomologacion() });
      clearBuscarHomologaciones();
      clearCrearHomologacion();
    }
  }, [
    clearBuscarHomologaciones,
    clearCrearHomologacion,
    crear,
    selectHomologacion,
  ]);
  useEffect(() => {
    if (currentIdSuscripcion.isSus !== 0) {
      setFormFilter((prev) => ({
        ...prev,
        idsus: currentIdSuscripcion.isSus,
        pcodigo: currentIdSuscripcion.pCodigo,
      }));
    }
  }, [currentIdSuscripcion]);

  //renders
  return (
    <>
      <ModalResultFilter
        show={showModalResult}
        onHide={handloToggle}
        onSelect={handleDataEdit}
        listData={buscarHomologaciones ? buscarHomologaciones : []}
      />
      <Form.Row
        className={`border border-primary rounded position-relative mx-2 p-1 ${
          nameEnterprise.length < 56 ? "" : "mt-4"
        }`}
      >
        <Form.Group
          as={Col}
          md="12"
          className={
            nameEnterprise.length < 56
              ? "position-absolute d-flex positionTop"
              : "position-absolute d-flex mb-4 positionTopx2"
          }
        >
          <h2 className="bg-white">{nameEnterprise}</h2>
        </Form.Group>
        <Form.Group as={Col} md="4">
          <Form.Label>Medidor</Form.Label>
          <Form.Control
            type="number"
            name="medidor"
            value={formFilter.medidor}
            onChange={handleChageInputs}
          />
        </Form.Group>

        <Form.Group as={Col} md="4">
          <Form.Label>Codigo</Form.Label>
          <Form.Control
            type="number"
            name="pcodigo"
            value={formFilter.pcodigo}
            onChange={handleChageInputs}
          />
        </Form.Group>

        <Form.Group as={Col} md="4"></Form.Group>

        <Form.Group as={Col} md="4">
          <Form.Label>Id Suscripcion</Form.Label>
          <Form.Control
            type="number"
            name="idsus"
            value={formFilter.idsus || ""}
            onChange={handleChageInputs}
          />
        </Form.Group>

        {/*multiple */}
        <Form.Group as={Col} md="8">
          <Form.Label>Ultimos Consumo GAS</Form.Label>
          <Form.Row>
            {currentData &&
              currentData?.consumos?.map((it, idx) => (
                <Form.Group as={Col} md="4" key={`cosu-data-val-${idx}`}>
                  {it[0]?.split("-")[1]}
                  <Form.Control type="text" value={it[0]?.split("-")[0]} />
                </Form.Group>
              ))}
          </Form.Row>
        </Form.Group>
        <Form.Group as={Col} md="6">
          <Form.Label>Tipo Uso</Form.Label>
          <Form.Control
            type="text"
            disabled={true}
            value={currentData ? currentData?.uniNombre1 : ""}
          />
        </Form.Group>
        <Form.Group as={Col} md="2">
          <Form.Label>Estrato</Form.Label>
          <Form.Control
            type="text"
            disabled={true}
            value={currentData ? currentData?.proCatestrato : ""}
          />
        </Form.Group>

        <Form.Group as={Col} md="4" className="pt-3 mt-3">
          <Button className="w-100" onClick={handleSearch}>
            {isLoading ? (
              <Spinner
                type="Oval"
                color="#fff"
                height={25}
                width={35}
                strokeWidth={10}
              />
            ) : (
              "Buscar Homologacion"
            )}
          </Button>
        </Form.Group>
      </Form.Row>
    </>
  );
}
const mapStateToProps = ({ suscripcionHomologacionReducer }) => ({
  empreas_convenios: suscripcionHomologacionReducer.empreas_convenios,
  buscarHomologaciones: suscripcionHomologacionReducer.buscarHomologaciones,
});
const mapDispatchToProps = (dispatch) => ({
  loadEmpresasConvenios: (id: string | number) =>
    dispatch(actions.loadEmpresasConvenios(id)),
  loadBuscarHomologaciones: (form: any) =>
    dispatch(actions.loadBuscarHomologaciones(form)),
  clearBuscarHomologaciones: () =>
    dispatch(actions.clearBuscarHomologaciones()),
  clearCrearHomologacion: () => dispatch(actions.clearCrearHomologacion()),
});
export default connect(mapStateToProps, mapDispatchToProps)(FormLLanogas);
