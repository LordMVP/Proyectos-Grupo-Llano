import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Form, Col, Button, Table } from "react-bootstrap";
import moment from "moment";
import { toast } from "react-toastify";
import Spinner from "react-loader-spinner";
//innt styles
import "./tableTitle.css";

//inner components
import ModalListSuscriptions from "./ModalListSuscriptions";
//interfaces
import {
  formDataSuscriptionInterface,
  conceptInterface,
} from "../../interfaces";
//initial values
import {
  initCurrentConcept,
  initialDataFormSuscriptionFuc,
} from "../../initialsValues";

//methods
import {
  filtarEstratos,
  isValidFormSuscripcion,
  reorderFormSuscripcion,
} from "../../methods";
//actions redux
import * as actions from "../../../../../actions/suscripcionSuscriptorSuscripcion";
import * as actionsThird from "../../../../../actions/suscripcionTercero";
// APIs para cargar parámetros
import basicoDefault from "../../../../../api/homologaciones/BasicoDefault";
import parametrosApi from "../../../../../api/homologaciones/ParParametrosApi";
const FormSuscription = (props: any) => {
  //props
  const {
    select,
    suscripcion_by_tercero,
    estados,
    tipos_uso,
    estratos,
    conceptos,
    ciclos,
    liquidaciones,
    macroRutas,
    macroRutas_by_id,
    horarios,
    horarios_rutas,
    rutas,
    rutasAprovechamiento,
    empresas,

    crear_suscripcion,
    edit_suscripcion,
    loadEstadosSuscripcionActions,
    loadTiposUsos,
    loadEstratosActions,
    loadConceptos,
    loadCiclos,
    loadMacroRuta,
    loadMacroRutaById,
    loadHorarios,
    loadRutas,
    loadRutasAprovechamiento,
    loadLiquidaciones,
    third,
    propertyData,
    loadEmpresas,
    loadActividadEconomica,
    loadCrearSuscripcionAction,
    loadSuscripcionesByIdTerceroActions,
    loadEditSuscripcionACtion,
    clearSuscripcionesByIdTerceroActions,
    clearEditSuscripcionAction,
    clearCrearSuscripcionAction,
    handleAsingProperty,
    loadHorariosRutas,
    clearMacroRutaById,
    loadPropiedadesThird,
    handleAsingSuscription,
    clearRutas,
    clearHorarios,
  } = props;
  //const
  const cloneInitialDataFormSuscription: formDataSuscriptionInterface = {
    ...initialDataFormSuscriptionFuc(),
  };
  const cloneInitConcept: conceptInterface = { ...initCurrentConcept };
  const listmsj: string[] = [
    "Se creo la suscripcion con exito",
    "Se actualizo la suscripcion con exito",
  ];
  //states
  const [formData, setFormData] = useState<formDataSuscriptionInterface>({
    ...cloneInitialDataFormSuscription,
  });
  const [microrutas, setMicrorutas] = useState<any[]>([]);
  const [currentConcep, setcurrentConcep] =
    useState<conceptInterface>(cloneInitConcept);
  const [listConcepts, setlistConcepts] = useState<conceptInterface[]>([]);
  const [modalList, setModalList] = useState<boolean>(false);
  const [listSuscripcion, setListSuscripcion] = useState<any[]>([]);
  const [isLoadinfList, setIsLoadinfList] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listStratos, setListStratos] = useState<any[]>([]);
  const [parametros, setParametros] = useState<any>({});
  
  //methods
  const handleChangeInputs = (e: any) => {
    const { name, value } = e.target;
    setIsLoading(false);
    if (
      name === "uniTipusosuscr" ||
      name === "proCatestrato" ||
      name === "uniLiquidacion" ||
      name === "cicIderegistro"
    ) {
      if (name === "cicIderegistro") {
        setFormData((prev) => ({
          ...prev,
          cicIderegistro: Number(value),
          recoleccionBarridoDTO: {
            ...prev.recoleccionBarridoDTO,
            rutIderegistroBar: 0,
          },
          rutaAprovechamientoDTO: {
            ...prev.rutaAprovechamientoDTO,
            rutIderegistro: 0,
          },
        }));

        return;
      }

      if (name === "uniLiquidacion") {
        setFormData((prev) => ({
          ...prev,
          [name]: Number(value),
        }));
      }
      if (name === "uniTipusosuscr") {
        const newArraList = filtarEstratos(
          estratos.map((element) => ({
            code: Number(element?.code || 0),
            nombre: `${element?.nombre || "name"}`,
          })),
          Number(value)
        );
        setListStratos([...newArraList]);
        console.log(newArraList);
        setFormData((prev) => ({
          ...prev,
          uniTipusosuscr: Number(value),
          proCatestrato: Number(newArraList[0].code),
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: Number(value) }));
      }

      return;
    } else if (name === "iasusCobrojuridico") {
      setFormData((prev) => ({
        ...prev,
        inforadicionalsuscripcionDTO: {
          ...prev.inforadicionalsuscripcionDTO,
          iasusCobrojuridico: value === "S" ? true : false,
        },
      }));
      return;
    } else if (name === "iasusPagapeaje") {
      setFormData((prev) => ({
        ...prev,
        inforadicionalsuscripcionDTO: {
          ...prev.inforadicionalsuscripcionDTO,
          iasusPagapeaje: value === "S" ? true : false,
        },
      }));
      return;
    } else if (name === "macroruta") {
      setFormData((prev) => ({
        ...prev,
        recoleccionBarridoDTO: {
          ...prev.recoleccionBarridoDTO,
          rutIdMacroRuta: Number(value),
          rutIderegistroBar: 0,
        },
      }));
      setMicrorutas([]);
      clearMacroRutaById();
      loadMacroRutaById(Number(value));
      loadHorarios(Number(value));
      return;
    } else if (name === "microruta") {
      setFormData((prev) => ({
        ...prev,
        recoleccionBarridoDTO: {
          ...prev.recoleccionBarridoDTO,
          rutIderegistro: Number(value),
        },
      }));

      return;
    } else if (name === "incentivo" || name === "aforado") {
      setFormData((prev) => ({
        ...prev,
        rutaAprovechamientoDTO: {
          ...prev.rutaAprovechamientoDTO,
          [name]: value === "S" ? true : false,
        },
      }));

      return;
    } else if (name === "rutaBarrido") {
      setFormData((prev) => ({
        ...prev,
        recoleccionBarridoDTO: {
          ...prev.recoleccionBarridoDTO,
          rutIderegistroBar: Number(value),
        },
      }));
      loadHorariosRutas(Number(value));
      return;
    } else if (name === "rutaAprovechamiento") {
      setFormData((prev) => ({
        ...prev,

        rutaAprovechamientoDTO: {
          ...prev.rutaAprovechamientoDTO,
          rutIderegistro: Number(value),
        },
      }));
      return;
    } else if (name === "refComer") {
      setFormData((prev) => ({
        ...prev,

        inforadicionalsuscripcionDTO: {
          ...prev.inforadicionalsuscripcionDTO,
          iasusReferenciacomercial: value,
        },
      }));
      return;
    } else if (name === "empIderegistro") {
      setFormData((prev) => ({
        ...prev,

        rutaAprovechamientoDTO: {
          ...prev.rutaAprovechamientoDTO,
          terAprovechamiento: Number(value),
        },
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeCurrentConcep = (e: any) => {
    const { name, value } = e.target;
    if (name === "uniConcepto") {
      setcurrentConcep((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setcurrentConcep((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlerAddListConcept = () => {
    setlistConcepts((prev) => [...prev, currentConcep]);
  };
  const handleRemoveListConcept = (position: number) => {
    let cloneCurrentList: conceptInterface[] = [...listConcepts];
    cloneCurrentList.splice(position, 1);

    setlistConcepts([...cloneCurrentList]);
  };

  const handleSubmitSave = () => {
    // Crear una copia del objeto formData para realizar modificaciones
    let formDataModified = {...formData};
    
    // Verificar y modificar rutIderegistroBar si es necesario
    if (formDataModified.recoleccionBarridoDTO.rutIderegistroBar === 0 && 
        formDataModified.recoleccionBarridoDTO.rutIderegistroBar !== null) {
      formDataModified.recoleccionBarridoDTO.rutIderegistroBar = 1297;
    }
    
    const { valid, form } = isValidFormSuscripcion(formDataModified, listConcepts);

    if (!valid) return;
    setIsLoading(true);

    setFormData(formDataModified);
        // Usar los datos ya modificados para la acción
    if (formDataModified.dsusIderegistr === null)
      return loadCrearSuscripcionAction(form);
    if (formData.dsusIderegistr !== null)
      return loadEditSuscripcionACtion(Number(formDataModified.dsusIderegistr), form);
  };
  const handleCloseModalList = () => setModalList(false);
  const handleSelectEdit = (data: any) => {
    const { formRaw, listConcepts: conceptsOrder } = reorderFormSuscripcion(
      data,
      estratos.map((element) => ({
        code: Number(element?.code || 0),
        nombre: `${element?.nombre || "name"}`,
      })),
      setListStratos
    );
    loadHorariosRutas(Number(formRaw.recoleccionBarridoDTO.rutIderegistroBar));
    setFormData({ ...formRaw });
    handleAsingSuscription(formRaw);
    setlistConcepts([...conceptsOrder]);
    loadRutas(data.uniMunicipio, data.uniBarrio.barrioIderegistro);

    loadMacroRutaById(Number(formRaw.recoleccionBarridoDTO.rutIdMacroRuta));
    loadHorarios(Number(formRaw.recoleccionBarridoDTO.rutIdMacroRuta));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleListSuscripcions = () => {
    setIsLoadinfList(true);
    setIsLoading(false);
    clearSuscripcionesByIdTerceroActions();
    loadSuscripcionesByIdTerceroActions(third);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleClear = () => {
    handleAsingSuscription(null);
    setlistConcepts([]);
    setIsLoading(false);
    clearSuscripcionesByIdTerceroActions();
    setFormData({ ...initialDataFormSuscriptionFuc() });
    clearRutas();
    clearHorarios();
  };

  //Dummy data
  const dummyRutas = [{ rutNombre: "Ruta Barrido", rutIderegistroBar: 1297 }]
  

    //effects
  // Cargar parámetros primero
  useEffect(() => {
    const cargarParametros = async () => {
      try {
        const paraApi = new parametrosApi();
        const tmp = await paraApi.listaParametros();
        setParametros(tmp.data);
      } catch (e) {
        console.error('Error al cargar parámetros:', e);
      }
    };
    cargarParametros();
  }, []);

  // Cargar datos cuando los parámetros estén disponibles
  useEffect(() => {
    if (Object.keys(parametros).length === 0) return; // Esperar a que se carguen los parámetros
    
    const basico = new basicoDefault();
    const estructuraAprovechamiento = parseInt(basico.buscarParametro('estructura_aprovechamiento', parametros));
    
    
    loadEstadosSuscripcionActions();
    loadTiposUsos();
    loadEstratosActions();
    loadConceptos();
    loadCiclos();
    loadMacroRuta();
    loadLiquidaciones();
    loadEmpresas();
    loadActividadEconomica();
    
    if (estructuraAprovechamiento) {
      loadRutasAprovechamiento(estructuraAprovechamiento);
    } else {
      console.warn('⚠️ No se encontró el parámetro estructura_aprovechamiento, usando valor por defecto 3224');
      loadRutasAprovechamiento(246);
    }
  }, [
    parametros,
    loadEstadosSuscripcionActions,
    loadTiposUsos,
    loadEstratosActions,
    loadConceptos,
    loadCiclos,
    loadMacroRuta,
    loadLiquidaciones,
    loadEmpresas,
    loadActividadEconomica,
    loadRutasAprovechamiento,
  ]);
  useEffect(() => {
    if (
      estados &&
      Array.isArray(estados) &&
      Boolean(estados[0]) &&
      formData.dsusEstado === ""
    ) {
      setFormData((prev) => ({ ...prev, dsusEstado: estados[0].code }));
    }

    if (
      tipos_uso &&
      Array.isArray(tipos_uso) &&
      Boolean(tipos_uso[0]) &&
      estratos &&
      Array.isArray(estratos) &&
      Boolean(estratos[0])
    ) {
      if (formData.uniTipusosuscr === 0 || formData.proCatestrato === 0) {
        console.log(estratos);
        const newArraList = filtarEstratos(
          estratos.map((element) => ({
            code: Number(element?.code || 0),
            nombre: `${element?.nombre || "name"}`,
          })),
          Number(tipos_uso[0].id)
        );
        setListStratos([...newArraList]);
        setFormData((prev) => ({
          ...prev,
          uniTipusosuscr: Number(tipos_uso[0].id),
          proCatestrato: Number(newArraList[0].code),
        }));
      }
    }

    if (
      liquidaciones &&
      Array.isArray(liquidaciones) &&
      Boolean(liquidaciones[0]) &&
      formData.uniLiquidacion === 0
    ) {
      setFormData((prev) => ({
        ...prev,
        uniLiquidacion: Number(liquidaciones[0].id),
      }));
    }
    if (
      conceptos &&
      Array.isArray(conceptos) &&
      Boolean(conceptos[0]) &&
      currentConcep.uniConcepto === 0
    ) {
      setcurrentConcep((prev) => ({
        ...prev,
        uniConcepto: conceptos[0].uniConcepto,
      }));
    }
    if (
      ciclos &&
      Array.isArray(ciclos) &&
      ciclos.length > 0 &&
      formData.cicIderegistro === 0
    ) {
      const seCiclo = ciclos.find(
        (it) =>
          it?.cicNombre.trim().toLowerCase() ===
          "Ciclo General ASEO".toLowerCase()
      );
      if (seCiclo) {
        setFormData((prev) => ({
          ...prev,
          cicIderegistro: Number(seCiclo.cicIderegistro),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          cicIderegistro: Number(ciclos[0].cicIderegistro),
        }));
      }
    }
    if (
      macroRutas &&
      Array.isArray(macroRutas) &&
      Boolean(macroRutas[0]) &&
      formData.recoleccionBarridoDTO.rutIdMacroRuta === 0
    ) {
      setFormData((prev) => ({
        ...prev,
        recoleccionBarridoDTO: {
          ...prev.recoleccionBarridoDTO,
          rutIdMacroRuta: macroRutas[0].rutIderegistro,
        },
      }));

      loadMacroRutaById(macroRutas[0].rutIderegistro);
      loadHorarios(macroRutas[0].rutIderegistro);
    }
  }, [
    estados,
    tipos_uso,
    estratos,
    formData,
    conceptos,
    ciclos,
    macroRutas,
    loadMacroRutaById,
    liquidaciones,
    currentConcep.uniConcepto,
    loadRutas,
    loadHorarios,
  ]);

  useEffect(() => {
    if (
      rutas &&
      Array.isArray(rutas) &&
      rutas.length > 0 &&
      formData.recoleccionBarridoDTO.rutIderegistroBar === 0
    ) {
      loadHorariosRutas(rutas[0].rutIderegistro);
      setFormData((prev) => ({
        ...prev,
        recoleccionBarridoDTO: {
          ...prev.recoleccionBarridoDTO,
          rutIderegistroBar: rutas[0].rutIderegistro,
        },
      }));
    }
  }, [
    formData.recoleccionBarridoDTO.rutIderegistroBar,
    setFormData,
    rutas,
    loadHorariosRutas,
  ]);

  useEffect(() => {
    if (macroRutas_by_id && Array.isArray(macroRutas_by_id)) {
      let mitemmp: { name: any; id: any; global: any }[] = [];
      macroRutas_by_id.forEach((item) => {
        item.itemsHijos.forEach((innerItem) => {
          mitemmp = [
            ...mitemmp,
            {
              name: innerItem.nombre,
              id: innerItem.id,
              global: item.id,
            },
          ];
        });
      });

      setMicrorutas([...mitemmp]);

      if (formData.recoleccionBarridoDTO.rutIderegistro === 0) {
        setFormData((prev) => ({
          ...prev,
          recoleccionBarridoDTO: {
            ...prev.recoleccionBarridoDTO,
            rutIderegistro: mitemmp[0] ? Number(mitemmp[0].id) : 0,
          },
        }));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [macroRutas_by_id, formData.recoleccionBarridoDTO.rutIderegistroBar]);

  useEffect(() => {
    if (third && formData.terIderegistro === 0) {
      setListSuscripcion([]);
      setFormData((prev) => ({
        ...prev,
        terIderegistro: Number(third),

        rutaAprovechamientoDTO: {
          ...prev.rutaAprovechamientoDTO,
          terIderegistro: Number(third),
        },
      }));
    }
  }, [third, setFormData, formData.terIderegistro, setListSuscripcion]);

  useEffect(() => {
    if (third === null && formData.terIderegistro !== 0) {
      handleClear();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [third, handleClear]);

  useEffect(() => {
    if (!propertyData) return;

    setFormData((prev) => ({
      ...prev,
      proIderegistro: propertyData.proIderegistro,
    }));
    loadRutas(propertyData.uniMunicipio, propertyData.uniBarrio);
  }, [propertyData, formData.proIderegistro, setFormData, loadRutas]);

  useEffect(() => {
    if (third !== null) {
      loadSuscripcionesByIdTerceroActions(third);
      setListSuscripcion([]);
      setIsLoadinfList(true);
    }
  }, [
    third,
    setListSuscripcion,
    setIsLoadinfList,
    loadSuscripcionesByIdTerceroActions,
  ]);
  useEffect(() => {
    if (crear_suscripcion) {
      toast.success(`${listmsj[0]}`);
      clearCrearSuscripcionAction();
      handleAsingProperty(null);
      handleClear();
      setIsLoading(false);
      handleListSuscripcions();
      if (third) loadPropiedadesThird(third);
    }
  }, [
    clearCrearSuscripcionAction,
    crear_suscripcion,
    handleAsingProperty,
    handleClear,
    handleListSuscripcions,
    listmsj,
    loadPropiedadesThird,
    third,
  ]);

  useEffect(() => {
    if (
      suscripcion_by_tercero &&
      Array.isArray(suscripcion_by_tercero) &&
      select &&
      select === "suscripcion"
    ) {
      if (suscripcion_by_tercero.length > 0) {
        setListSuscripcion(suscripcion_by_tercero);
        setModalList(true);
        setIsLoadinfList(false);
      } else {
        toast.warn(`Este tercero no tiene suscripciones`);
        setIsLoadinfList(false);
      }
    } else if (suscripcion_by_tercero && Array.isArray(suscripcion_by_tercero)) {
      // Si llegan datos pero no es para modal, también detener el loading
      setIsLoadinfList(false);
    }
  }, [suscripcion_by_tercero, setListSuscripcion, select]);

  useEffect(() => {
    if (edit_suscripcion) {
      toast.success(`${listmsj[1]}`);
      setIsLoading(false);
      clearEditSuscripcionAction();
    }
  }, [edit_suscripcion, listmsj, clearEditSuscripcionAction]);

  return (
    <>
      <ModalListSuscriptions
        show={modalList}
        onHide={handleCloseModalList}
        list={listSuscripcion}
        onSelect={handleSelectEdit}
      />
      {third && (
        <Form.Row className="my-3">
          <div className="w-100 d-flex justify-content-end pr-3">
            <Button className="mr-3" onClick={handleClear}>
              Nueva Suscripción
            </Button>
            <Button onClick={handleListSuscripcions}>
              {isLoadinfList ? (
                <div className="d-flex">
                  Cargando suscripciones{" "}
                  <Spinner
                    type="Oval"
                    color="#fff"
                    height={25}
                    width={35}
                    strokeWidth={10}
                  />
                </div>
              ) : (
                "Lista de suscripciones"
              )}
            </Button>
          </div>
        </Form.Row>
      )}

      <Form.Row className="my-3">
        <Form.Group as={Col} md="12">
          <Form.Row>
            <Form.Group as={Col} md="2">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                name={`dsusEstado`}
                value={formData.dsusEstado}
                onChange={handleChangeInputs}
              >
                {estados &&
                  Array.isArray(estados) &&
                  estados.map((it) => (
                    <option key={`option-state${it.id}`} value={it.code}>
                      {it.nombre}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} md="2">
              <Form.Label>Codigo</Form.Label>
              <Form.Control
                type="text"
                disabled={true}
                value={formData.dsusPcodigo}
              />
            </Form.Group>
            <Form.Group as={Col} md="2">
              <Form.Label>Id Tercero</Form.Label>
              <Form.Control
                type="text"
                disabled={true}
                value={formData.terIderegistro}
              />
            </Form.Group>
            <Form.Group as={Col} md="2">
              <Form.Label>ID Suscripcion</Form.Label>
              <Form.Control
                type="text"
                disabled={true}
                value={formData.dsusIderegistr ? formData.dsusIderegistr : ""}
              />
            </Form.Group>
            <Form.Group as={Col} md="2">
              <Form.Label>Fec. Creación</Form.Label>
              <Form.Control
                type="text"
                disabled={true}
                value={
                  formData.dsusFecinicio !== ""
                    ? moment(formData.dsusFecinicio).format("DD-MM-YYYY")
                    : ""
                }
              />
            </Form.Group>
            <Form.Group as={Col} md="2">
              <Form.Label>Fec. Modific.</Form.Label>
              <Form.Control
                type="text"
                disabled={true}
                value={
                  formData.dsusIniestado !== ""
                    ? moment(formData.dsusIniestado).format("DD-MM-YYYY")
                    : ""
                }
              />
            </Form.Group>

            <Form.Group as={Col} md="4">
              <Form.Label>Tipo de Uso</Form.Label>
              <Form.Control
                as="select"
                name="uniTipusosuscr"
                onChange={handleChangeInputs}
                value={formData.uniTipusosuscr}
              >
                {tipos_uso &&
                  Array.isArray(tipos_uso) &&
                  tipos_uso.map((it) => (
                    <option key={`option-type${it.id}`} value={it.id}>
                      {it.nombre}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} md="4">
              <Form.Label>Estrato</Form.Label>
              <Form.Control
                as="select"
                name="proCatestrato"
                onChange={handleChangeInputs}
                value={formData.proCatestrato}
              >
                {listStratos.map((it) => (
                  <option key={`option-type${it.code}`} value={it.code}>
                    {it.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form.Row>
        </Form.Group>

        <Form.Group as={Col} md="12">
          <Form.Row>
            <Form.Group as={Col} md="4">
              <Form.Label>Cobro Jurídico</Form.Label>
              <Form.Control
                as="select"
                name="iasusCobrojuridico"
                onChange={handleChangeInputs}
                value={
                  formData.inforadicionalsuscripcionDTO?.iasusCobrojuridico
                    ? "S"
                    : "N"
                }
              >
                <option value="S">SI</option>
                <option value="N">NO</option>
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label>Liquidación</Form.Label>
              <Form.Control
                name="uniLiquidacion"
                onChange={handleChangeInputs}
                value={formData.uniLiquidacion}
                as="select"
              >
                {liquidaciones &&
                  Array.isArray(liquidaciones) &&
                  liquidaciones.map((it) => (
                    <option key={`liq-${it.id}`} value={it.id}>
                      {it.nombre}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label>Ciclo</Form.Label>
              <Form.Control
                name="cicIderegistro"
                onChange={handleChangeInputs}
                value={formData.cicIderegistro}
                as="select"
              >
                {ciclos &&
                  Array.isArray(ciclos) &&
                  ciclos.map((it) => (
                    <option
                      key={`ciclo-${it.cicIderegistro}`}
                      value={it.cicIderegistro}
                    >
                      {it.cicNombre}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label>Paga Peaje</Form.Label>
              <Form.Control
                name="iasusPagapeaje"
                as="select"
                disabled
                value={
                  formData.inforadicionalsuscripcionDTO?.iasusPagapeaje
                    ? "S"
                    : "N"
                }
                onChange={handleChangeInputs}
              >
                <option value="S">SI</option>
                <option value="N">NO</option>
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} md="8">
              <Form.Label>Referencia Comercio</Form.Label>
              <Form.Control
                type="text"
                name="refComer"
                value={
                  formData.inforadicionalsuscripcionDTO.iasusReferenciacomercial
                }
                onChange={handleChangeInputs}
              />
            </Form.Group>
          </Form.Row>
        </Form.Group>

        <Form.Group as={Col} md="12">
          <Form.Row>
            <Form.Group as={Col} md="6">
              {/*columna 1 */}

              <Form.Row className="border border-primary rounded position-relative mx-2 p-1">
                <Form.Group
                  as={Col}
                  md="12"
                  className="position-absolute d-flex positionTop"
                >
                  <h2 className="bg-white">Recolección</h2>
                </Form.Group>
                <Form.Group as={Col} md="12">
                  <Form.Label>Macroruta</Form.Label>
                  <Form.Control
                    as="select"
                    name="macroruta"
                    onChange={handleChangeInputs}
                    value={formData.recoleccionBarridoDTO.rutIdMacroRuta}
                  >
                    {macroRutas &&
                      Array.isArray(macroRutas) &&
                      macroRutas.map((it) => (
                        <option
                          key={`macroruta-${it.rutIderegistro}`}
                          value={it.rutIderegistro}
                        >
                          {it.rutNombre}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>Frecuencia</Form.Label>
                  <Form.Control as="select" multiple>
                    {horarios &&
                      Array.isArray(horarios) &&
                      horarios.map((it) => (
                        <option
                          key={`day-${it.hrrIderegistro}`}
                          value={it.hrrIderegistro}
                        >
                          {it.hrrDia}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>Microruta</Form.Label>
                  <Form.Control
                    name="microruta"
                    onChange={handleChangeInputs}
                    value={formData.recoleccionBarridoDTO.rutIderegistro}
                    as="select"
                  >
                    {microrutas &&
                      microrutas.map((it, idx) => (
                        <option key={`microruta-${it.id}-${idx}`} value={it.id}>
                          {it.name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </Form.Row>

              <Form.Row className="border border-primary rounded position-relative mx-2 mt-4 p-1">
                <Form.Group
                  as={Col}
                  md="12"
                  className="position-absolute d-flex positionTop"
                >
                  <h2 className="bg-white">Aprovechamiento</h2>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>Incentivo?</Form.Label>
                  <Form.Control
                    as="select"
                    name="incentivo"
                    value={
                      formData.rutaAprovechamientoDTO.incentivo ? "S" : "N"
                    }
                    onChange={handleChangeInputs}
                  >
                    <option value="S">SI</option>
                    <option value="N">NO</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col} md="6">
                  <Form.Label>Aforado ?</Form.Label>
                  <Form.Control
                    as="select"
                    name="aforado"
                    value={formData.rutaAprovechamientoDTO.aforado ? "S" : "N"}
                    onChange={handleChangeInputs}
                  >
                    <option value="S">SI</option>
                    <option value="N">NO</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="12">
                  <Form.Label>Ruta</Form.Label>
                  <Form.Control
                    as="select"
                    name="rutaAprovechamiento"
                    onChange={handleChangeInputs}
                    value={formData.rutaAprovechamientoDTO.rutIderegistro || 0}
                  >
                    <option value={0}>Seleccione</option>
                    {rutasAprovechamiento &&
                      Array.isArray(rutasAprovechamiento) &&
                      rutasAprovechamiento.map((it) => (
                        <option
                          key={`rutas-aprovechamiento-${it.rut_ideregistro}`}
                          value={it.rut_ideregistro}
                        >
                          {it.rut_nombre}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="12">
                  <Form.Label>Empresa</Form.Label>
                  <Form.Control
                    as="select"
                    name="empIderegistro"
                    value={
                      formData.rutaAprovechamientoDTO.terAprovechamiento || 0
                    }
                    onChange={handleChangeInputs}
                  >
                    <option value={0}>Seleccione</option>
                    {empresas &&
                      Array.isArray(empresas) &&
                      empresas.map((it) => (
                        <option key={`empresa-${it.id}`} value={it.id}>
                          {it.nombre}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </Form.Row>
            </Form.Group>
            <Form.Group as={Col} md="6">
              {/*columna 2 */}
              <Form.Row className="border border-primary rounded position-relative mx-2 p-1">
                <Form.Group
                  as={Col}
                  md="12"
                  className="position-absolute d-flex positionTop"
                >
                  <h2 className="bg-white">Barrido</h2>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>Frecuencia</Form.Label>
                  <Form.Control as="select" multiple>
                    {horarios_rutas &&
                      Array.isArray(horarios_rutas) &&
                      horarios_rutas.map((it) => (
                        <option
                          key={`day-${it.hrrIderegistro}`}
                          value={it.hrrIderegistro}
                        >
                          {it.hrrDia}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>Ruta</Form.Label>
                  <Form.Control
                    as="select"
                    name="rutaBarrido"
                    value={formData.recoleccionBarridoDTO.rutIderegistroBar}
                    onChange={handleChangeInputs}
                  >
                    {
                      dummyRutas.map((it) => (
                        <option
                          key={`rutas-${it.rutIderegistroBar}`}
                          value={it.rutIderegistroBar}
                        >
                          {it.rutNombre}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </Form.Row>

              <Form.Row className="border border-primary rounded position-relative mx-2 mt-4 p-1">
                <Form.Group
                  as={Col}
                  md="12"
                  className="position-absolute d-flex positionTop"
                >
                  <h2 className="bg-white">Conceptos Relacionados</h2>
                </Form.Group>

                <Form.Group as={Col} md="3">
                  <Form.Label>Concepto</Form.Label>
                  <Form.Control
                    as="select"
                    name="uniConcepto"
                    value={currentConcep.uniConcepto}
                    onChange={handleChangeCurrentConcep}
                  >
                    {conceptos &&
                      Array.isArray(conceptos) &&
                      conceptos.map((it) => (
                        <option
                          key={`concepto-${it.uniConcepto}`}
                          value={it.uniConcepto}
                        >
                          {it.conNombre}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Vigencia Desde</Form.Label>
                  <Form.Control
                    type="date"
                    name="fecInicio"
                    value={currentConcep.fecInicio}
                    onChange={handleChangeCurrentConcep}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Hasta</Form.Label>
                  <Form.Control
                    type="date"
                    name="fecFinal"
                    value={currentConcep.fecFinal}
                    onChange={handleChangeCurrentConcep}
                  />
                </Form.Group>
                <Form.Group as={Col} md="1" className="pt-4 mt-2">
                  <Button variant="success" onClick={handlerAddListConcept}>
                    +
                  </Button>
                </Form.Group>

                <Form.Group as={Col} md="12">
                  <Table striped bordered>
                    <thead className="bg-success text-white text-center">
                      <tr>
                        <th>Concepto</th>
                        <th>Desde</th>
                        <th>Hasta</th>
                        <th>Accion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listConcepts.map((it, idx) => (
                        <tr key={`concept-${idx}`} className="text-center">
                          <td>
                            {
                              conceptos.find(
                                (item) =>
                                  Number(item.uniConcepto) ===
                                  Number(it.uniConcepto)
                              )?.conNombre
                            }
                          </td>
                          <td>{moment(it.fecInicio).format("DD-MM-YYYY")}</td>
                          <td>{moment(it.fecFinal).format("DD-MM-YYYY")}</td>
                          <td>
                            <Button
                              variant="danger"
                              className="mr-3"
                              onClick={() => handleRemoveListConcept(idx)}
                            >
                              -
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Form.Group>
              </Form.Row>
            </Form.Group>
          </Form.Row>
        </Form.Group>
        <Form.Group as={Col} md="12">
          <Button
            variant="primary"
            className="mr-3"
            onClick={handleSubmitSave}
            disabled={isLoading}
          >
            {formData.dsusIderegistr ? "Actualizar" : "Guardar"}
          </Button>
        </Form.Group>
      </Form.Row>
    </>
  );
};

const mapStateToProps = ({ suscripcionSuscriptorReducer }) => ({
  convenios: suscripcionSuscriptorReducer.convenios,
  crear_suscriptor: suscripcionSuscriptorReducer.crear_suscriptor,
  crear_suscripcion: suscripcionSuscriptorReducer.crear_suscripcion,
  edit_suscripcion: suscripcionSuscriptorReducer.edit_suscripcion,
  search_id: suscripcionSuscriptorReducer.search_id,
  detalles: suscripcionSuscriptorReducer.detalles,
  propiedades: suscripcionSuscriptorReducer.propiedades,
  suscripcion_by_tercero: suscripcionSuscriptorReducer.suscripcion_by_tercero,
  filtrar_suscripcion: suscripcionSuscriptorReducer.filtrar_suscripcion,
  estados: suscripcionSuscriptorReducer.estados,
  tipos_uso: suscripcionSuscriptorReducer.tipos_uso,
  liquidaciones: suscripcionSuscriptorReducer.liquidaciones,
  ciclos: suscripcionSuscriptorReducer.ciclos,
  rutas: suscripcionSuscriptorReducer.rutas,
  rutasAprovechamiento: suscripcionSuscriptorReducer.rutasAprovechamiento,
  macroRutas: suscripcionSuscriptorReducer.macroRutas,
  macroRutas_by_id: suscripcionSuscriptorReducer.macroRutas_by_id,
  horarios: suscripcionSuscriptorReducer.horarios,
  horarios_rutas: suscripcionSuscriptorReducer.horarios_rutas,
  actividad_economica: suscripcionSuscriptorReducer.actividad_economica,
  tipos_suscripcion: suscripcionSuscriptorReducer.tipos_suscripcion,
  conceptos: suscripcionSuscriptorReducer.conceptos,
  estratos: suscripcionSuscriptorReducer.estratos,
  empresas: suscripcionSuscriptorReducer.empresas,
});

const mapDispatchToProps = (dispatch) => ({
  loadConveniosAction: () => dispatch(actions.loadConvenios()),
  clearConveniosAction: () => dispatch(actions.clearConvenios()),
  loadCrearSuscriptorAction: (data: any) =>
    dispatch(actions.loadCrearSuscriptor(data)),
  clearCrearSuscriptorAction: () => dispatch(actions.clearCrearSuscriptor()),

  loadCrearSuscripcionAction: (data: any) =>
    dispatch(actions.loadCrearSuscripcion(data)),

  clearCrearSuscripcionAction: () => dispatch(actions.clearCrearSuscripcion()),

  loadEditSuscripcionACtion: (id: number | string, data: any) =>
    dispatch(actions.loadEditarSuscripcion(id, data)),

  clearEditSuscripcionAction: () => dispatch(actions.clearEditarSuscripcion()),
  loadBuscarSuscripcionIdAction: (id: string | number) =>
    dispatch(actions.loadBuscarSuscripcionId(id)),
  clearBuscarSuscripcionIdAction: () =>
    dispatch(actions.clearBuscarSuscripcionId()),
  loadDetallesSuscripcionActions: (id: string | number) =>
    dispatch(actions.loadDetallesSuscripcion(id)),
  clearDetallesSuscripcionActions: () =>
    dispatch(actions.clearDetallesSuscripcion()),

  loadPropiedadesActions: (id: string | number) =>
    dispatch(actions.loadPropiedades(id)),
  clearPropiedadesActions: () => dispatch(actions.clearPropiedades()),

  loadSuscripcionesByIdTerceroActions: (id: string | number) =>
    dispatch(actions.loadSuscripcionesByIdTercero(id)),

  clearSuscripcionesByIdTerceroActions: () =>
    dispatch(actions.clearSuscripcionesByIdTercero()),

  loadFiltrarSuscripcionActions: (body: any) =>
    dispatch(actions.loadFiltrarSuscripcion(body)),

  clearFiltrarSuscripcionActions: () =>
    dispatch(actions.clearFiltrarSuscripcion()),

  loadEstadosSuscripcionActions: () =>
    dispatch(actions.loadEstadosSuscripcion()),

  clearEstadosSuscripcion: () => dispatch(actions.clearEstadosSuscripcion()),

  loadEstratosActions: () => dispatch(actions.loadEstratos()),

  clearEstratos: () => dispatch(actions.clearEstratos()),

  loadTiposUsos: () => dispatch(actions.loadTiposUsos()),
  clearTiposUsos: () => dispatch(actions.clearTiposUsos()),

  loadLiquidaciones: () => dispatch(actions.loadLiquidaciones()),
  clearLiquidaciones: () => dispatch(actions.clearLiquidaciones()),

  loadCiclos: () => dispatch(actions.loadCiclos()),
  clearCiclos: () => dispatch(actions.clearCiclos()),

  loadRutas: (idmun: string | number, idbar: string | number) =>
    dispatch(actions.loadRutas(idmun, idbar)),
  clearRutas: () => dispatch(actions.clearRutas()),

  loadRutasAprovechamiento: (tipoEstructura: string | number) =>
    dispatch(actions.loadRutasAprovechamiento(tipoEstructura)),
  clearRutasAprovechamiento: () => dispatch(actions.clearRutasAprovechamiento()),

  loadMacroRuta: () => dispatch(actions.loadMacroRuta()),
  clearMacroRuta: () => dispatch(actions.clearMacroRuta()),

  loadMacroRutaById: (id: string | number) =>
    dispatch(actions.loadMacroRutaById(id)),
  clearMacroRutaById: () => dispatch(actions.clearMacroRutaById()),

  loadHorarios: (id: string | number) => dispatch(actions.loadHorarios(id)),
  clearHorarios: () => dispatch(actions.clearHorarios()),

  loadActividadEconomica: () => dispatch(actions.loadActividadEconomica()),
  clearActividadEconomica: () => dispatch(actions.clearActividadEconomica()),

  loadTiposSuscripcion: (idMun: string | number, idCon: string | number) =>
    dispatch(actions.loadTiposSuscripcion(idMun, idCon)),
  clearTiposSuscripcion: () => dispatch(actions.clearTiposSuscripcion()),

  loadConceptos: () => dispatch(actions.loadConceptos()),

  clearConceptos: () => dispatch(actions.clearConceptos()),
  loadHorariosRutas: (id) => dispatch(actions.loadHorariosRutas(id)),

  loadEmpresas: () => dispatch(actions.loadEmpresas()),
  loadPropiedadesThird: (id: string | number) =>
    dispatch(actionsThird.getBuscarPropiedadesPorTercero(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormSuscription);
