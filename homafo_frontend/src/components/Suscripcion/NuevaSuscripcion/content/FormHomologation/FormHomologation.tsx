import React, { useState, useEffect } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import Spinner from "react-loader-spinner";
//import innet component
import FormLLanogas from "./FormLLanogas";
import FormEmsa from "./FormEmsa";
import FilterHomologacion from "./FilterHomologacion";
//init states
import { initialDataHomologacionOldFuc } from "../../initialsValues";
//interfaces
import { formDataHomologacionOldInterface } from "../../interfaces";
//
import { validFormHomologacionOld } from "../../methods";
import { getSuscripcionesByIDTercero } from "../../../../../api/hooks/suscripciones";
//actions redux
import * as actions from "../../../../../actions/suscripcionHomologacion";
import { toast } from "react-toastify";
import ModalListSuscriptions from "./ModalListSuscriptions";
type Props = {
  currentSuscription: any; // suscripcion actual
  detalle_sus: any; // redux state
  convenios: any; // redux state
  empreas_convenios: any; // redux state
  convenios_empresas: any; // redux state
  ciclos: any; // redux state
  crear: any; // redux state
  actualizar: any; // redux state,
  suscripcion_by_tercero: any; // redux state,
  susHomologacion: any; // redux state,
  empresas: any; // redux state,
  isActive: boolean; // boolean
  clearBuscarHomologacion: () => void; // redux action
  loadDetalleSuscripcion: (id: string | number) => void; // redux action
  clearDetalleSuscripcion: () => void; // redux action
  loadConvenios: () => void; // redux action
  clearConvenios: () => void; // redux action
  loadEmpresasConvenios: (id: string | number) => void; // redux action
  clearEmpresasConvenios: () => void; // redux action
  loadConveniosEmpresas: (id: string | number) => void; // redux action
  clearConveniosEmpresas: () => void; // redux action
  loadCiclosHomologacion: (id: string | number) => void; // redux action
  clearCiclosHomologacion: () => void; // redux action
  loadCrearHomologacion: (form: any) => void; // redux action
  clearCrearHomologacion: () => void; // redux action
  loadActualizarHomologacion: (form: any) => void; // redux action
  clearActualizarHomologacion: () => void; // redux action
  loadBuscarHomologaciones: (form: any) => void; // redux action
  loadDsusHomologacion: (id: string | number) => void; // redux action
  clearDsusHomologacion: () => void; // redux action
  loadEmpresas: () => void; // redux action
  clearEmpresas: () => void; // redux action
  clearBuscarHomologaciones: () => void; // redux action
};

function FormHomologation(props: Props) {
  //props
  const {
    empresas,
    susHomologacion,
    crear,
    currentSuscription,
    isActive,
    clearBuscarHomologacion,

    loadCrearHomologacion,
    clearCrearHomologacion,
    clearDsusHomologacion,
    loadEmpresas,
    loadConveniosEmpresas,
    clearBuscarHomologaciones,
  } = props;
  //types
  type defaultInitValue = {
    isSus: number;
    pCodigo: string;
  };
  //const

  const innitValue: defaultInitValue = {
    isSus: 0,
    pCodigo: "",
  };
  // hooks api

  const [listSuscripciones, getListSuscripciones, onClearList] =
    getSuscripcionesByIDTercero(null);
  //states

  const [seccion, setSeccion] = useState<number>(1);
  const [seccionForm, setSeccionForm] = useState<number>(0);
  const [formHomologacion, setformHomologacion] =
    useState<formDataHomologacionOldInterface>({
      ...initialDataHomologacionOldFuc(),
    });
  const [nameEnterprise, setNameEnterprise] = useState<string>("");
  const [currentData, setCurrentData] = useState<any>(null);
  const [idConvenio, setIdConvenio] = useState<string>("");
  const [idEmpresa, setidEmpresa] = useState<number>(0);
  const [isLoading, setIsLoadin] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isClear, setIsClear] = useState(false);
  const [currentIdSuscripcion, setCurrentIdSuscripcion] =
    useState<defaultInitValue>(innitValue);
  //methods
  const handleChangeConvenio = (name: string) => setIdConvenio(name);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const selectSeccionForName = (name: string) => {
    let exists = name.toLowerCase().indexOf("llano");
    setNameEnterprise(name);
    let current: number = exists !== -1 ? 1 : 2;
    onClearList();
    if (seccion !== current) {
      clearBuscarHomologaciones();
      setSeccion(current);
      handleChangeConvenio("");
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setidEmpresa(value);
    setIsClear(true);
    loadConveniosEmpresas(value);
    clearDsusHomologacion();
    setCurrentData(null);
    handleSelectHomologacion(null);
    setformHomologacion({ ...initialDataHomologacionOldFuc() });
    setCurrentIdSuscripcion(innitValue);
    const sData = empresas?.find((it) => Number(it.empresa_sevemp) === value);

    if (sData) {
      const nameEnterprise = sData?.empresa_nom;
      if (nameEnterprise) selectSeccionForName(nameEnterprise);
    }
  };

  const handleChangeSeccion = (num: number) => {
    clearBuscarHomologacion();
    setSeccionForm(num);
  };
  const handleSelectHomologacion = (data: any) => {
    if (data) {
      setCurrentData(data);

      setIsLoadin(true);
    } else {
      clearDsusHomologacion();
      setCurrentData(null);
      setformHomologacion({ ...initialDataHomologacionOldFuc() });
    }
  };

  const handleSaVeHomologacion = () => {
    loadCrearHomologacion(formHomologacion);
  };
  const handleSelectSuscripcion = (data: any) => {
    setCurrentIdSuscripcion({
      isSus: data.dsusIderegistr,
      pCodigo: data.dsusPcodigo,
    });
    onClearList();
  };
  //effects

  useEffect(() => {
    loadEmpresas();
  }, [loadEmpresas]);

  useEffect(() => {
    if (currentData) {
      console.log(currentSuscription);
      console.log(currentData);
      const per_ideregistro = currentSuscription?.perIderegistro;

      if (!per_ideregistro) {
        toast.error("No existen datos del perido");
        setIsLoadin(false);
        return;
      }

      const newForm = validFormHomologacionOld(
        currentData,
        currentSuscription,
        idEmpresa
      );
      console.log(newForm);
      setformHomologacion(newForm);
      setIsLoadin(false);
    }
  }, [currentData, currentSuscription, idEmpresa, susHomologacion]);
  useEffect(() => {
    if (crear) {
      toast.success(
        formHomologacion.deshomologacion
          ? "Deshomologacion realizada de forma correcta."
          : "Homologacion creada con exito"
      );
      clearCrearHomologacion();
      setCurrentData(null);

      setformHomologacion({ ...initialDataHomologacionOldFuc() });
    }
  }, [clearCrearHomologacion, crear, formHomologacion.deshomologacion]);

  useEffect(() => {
    if (
      empresas &&
      Array.isArray(empresas) &&
      empresas.length > 0 &&
      idEmpresa === 0
    ) {
      loadConveniosEmpresas(Number(empresas[0].empresa_sevemp));
      setidEmpresa(Number(empresas[0].empresa_sevemp));
      selectSeccionForName(empresas[0].empresa_nom);
    }
  }, [empresas, idEmpresa, loadConveniosEmpresas, selectSeccionForName]);
  useEffect(() => {
    if (isActive)
      getListSuscripciones(
        Number(currentSuscription.terIderegistro),
        idEmpresa
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, idEmpresa]);

  useEffect(() => {
    if (listSuscripciones && listSuscripciones.length > 0) {
      setShowModal(true);
    }
  }, [listSuscripciones]);

  useEffect(() => {
    if (isClear) setIsClear(false);
  }, [isClear]);

  // renders
  return (
    <>
      <ModalListSuscriptions
        show={showModal}
        onHide={() => setShowModal(false)}
        list={listSuscripciones || []}
        onSelect={handleSelectSuscripcion}
      />

      {/*form create */}
      {seccionForm === 0 && (
        <Form.Row className="my-3">
          <Form.Group as={Col} md="4">
            <Form.Group as={Col} md="12">
              <Form.Row>
                <Form.Group as={Col} md="12">
                  <Form.Label>Empresa Alterna</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={handleChange}
                    defaultValue="0"
                    value={idEmpresa}
                  >
                    {empresas &&
                      Array.isArray(empresas) &&
                      empresas
                        .filter(
                          (it) =>
                            !currentSuscription.empAlternasId.includes(
                              Number(it.empresa_sevemp)
                            )
                        )
                        .map((it) => (
                          <option
                            key={`conveni-h-${it.empresa_sevemp}`}
                            value={it.empresa_sevemp}
                          >
                            {it.empresa_nom}
                          </option>
                        ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col} md="12">
                  <Form.Label>Convenio</Form.Label>
                  <Form.Control
                    type="text"
                    disabled={true}
                    value={idConvenio}
                  />
                </Form.Group>
              </Form.Row>
            </Form.Group>
          </Form.Group>
          {!isClear && (
            <Form.Group as={Col} md="8" className="py-3">
              {seccion === 1 && (
                <FormLLanogas
                  nameEnterprise={nameEnterprise}
                  idEmpresa={idEmpresa}
                  selectHomologacion={handleSelectHomologacion}
                  crear={crear}
                  handleChangeConvenio={handleChangeConvenio}
                  currentSuscription={currentSuscription}
                  currentIdSuscripcion={currentIdSuscripcion}
                />
              )}
              {seccion === 2 && (
                <FormEmsa
                  nameEnterprise={nameEnterprise}
                  idEmpresa={idEmpresa}
                  selectHomologacion={handleSelectHomologacion}
                  crear={crear}
                  handleChangeConvenio={handleChangeConvenio}
                  currentSuscription={currentSuscription}
                  currentIdSuscripcion={currentIdSuscripcion}
                />
              )}
            </Form.Group>
          )}

          <Form.Group as={Col} md="12">
            <Button
              variant="primary"
              className="mr-3"
              disabled={Boolean(formHomologacion.periodoHomologa === 0)}
              onClick={handleSaVeHomologacion}
            >
              {isLoading ? (
                <Spinner
                  type="Oval"
                  color="#fff"
                  height={25}
                  width={35}
                  strokeWidth={10}
                />
              ) : (
                "Guardar"
              )}
            </Button>

            <Button
              variant="primary"
              className="mr-3"
              onClick={() => {
                handleChangeSeccion(1);
                onClearList();
              }}
            >
              Consultar
            </Button>
          </Form.Group>
        </Form.Row>
      )}

      {/*form search */}

      {seccionForm === 1 && (
        <FilterHomologacion
          setSeccionForm={handleChangeSeccion}
          currentSuscription={currentSuscription}
        />
      )}
    </>
  );
}
const mapStateToProps = ({
  suscripcionHomologacionReducer,
  suscripcionSuscriptorReducer,
}) => ({
  detalle_sus: suscripcionHomologacionReducer.detalle_sus,
  convenios: suscripcionHomologacionReducer.convenios,
  empreas_convenios: suscripcionHomologacionReducer.empreas_convenios,
  convenios_empresas: suscripcionHomologacionReducer.convenios_empresas,
  ciclos: suscripcionHomologacionReducer.ciclos,
  crear: suscripcionHomologacionReducer.crear,
  actualizar: suscripcionHomologacionReducer.actualizar,
  suscripcion_by_tercero: suscripcionSuscriptorReducer.suscripcion_by_tercero,

  susHomologacion: suscripcionHomologacionReducer.susHomologacion,
  empresas: suscripcionHomologacionReducer.empresasHologables,
});

const mapDispatchToProps = (dispatch) => ({
  loadBuscarHomologaciones: (form: any) =>
    dispatch(actions.loadBuscarHomologaciones(form)),
  clearBuscarHomologacion: () => dispatch(actions.clearBuscarHomologacion()),
  loadDetalleSuscripcion: (id: string | number) =>
    dispatch(actions.loadDetalleSuscripcion(id)),

  clearDetalleSuscripcion: () => dispatch(actions.clearDetalleSuscripcion()),
  loadConvenios: () => dispatch(actions.loadConvenios()),
  clearConvenios: () => dispatch(actions.clearConvenios()),

  loadEmpresasConvenios: (id: string | number) =>
    dispatch(actions.loadEmpresasConvenios(id)),
  clearEmpresasConvenios: () => dispatch(actions.clearEmpresasConvenios()),

  loadConveniosEmpresas: (id: string | number) =>
    dispatch(actions.loadConveniosEmpresas(id)),
  clearConveniosEmpresas: () => dispatch(actions.clearConveniosEmpresas()),

  loadCiclosHomologacion: (id: string | number) =>
    dispatch(actions.loadCiclosHomologacion(id)),
  clearCiclosHomologacion: () => dispatch(actions.clearCiclosHomologacion()),

  loadCrearHomologacion: (form: any) =>
    dispatch(actions.loadCrearHomologacion(form)),
  clearCrearHomologacion: () => dispatch(actions.clearCrearHomologacion()),

  loadActualizarHomologacion: (form: any) =>
    dispatch(actions.loadActualizarHomologacion(form)),
  clearActualizarHomologacion: () =>
    dispatch(actions.clearActualizarHomologacion()),
  loadDsusHomologacion: (id: string | number) =>
    dispatch(actions.loadDsusHomologacion(id)),
  clearDsusHomologacion: () => dispatch(actions.clearDsusHomologacion()),

  loadEmpresas: () => dispatch(actions.loadEmpresasHomologables()),
  clearEmpresas: () => dispatch(actions.clearEmpresasHomologables()),
  clearBuscarHomologaciones: () =>
    dispatch(actions.clearBuscarHomologaciones()),
});
export default connect(mapStateToProps, mapDispatchToProps)(FormHomologation);
