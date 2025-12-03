import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Col, Table } from "react-bootstrap";
import Spinner from "react-loader-spinner";
//redux
import { connect } from "react-redux";
import { loadBarrios } from "../../../../../actions/suscripcionActions";
import {
  loadComplementos,
  searchGeolocalizar,
  loadTokent,
  getListaCapas,
  searchCaracteristicasArcgis,
  getTiposPropiedad,
  getTiposClasificacionVivienda,
  postCrearPropiedad,
  clearListaCapas,
  clearTokent,
  clearTiposPropiedad,
  clearTiposClasificacionVivienda,
  putEditarPropiedad,
  clearActualizarPropiedad,
  clearComplementos,
} from "../../../../../actions/suscripcionTercero";
//inner components
import Map from "./Map";
//inerfaces
import {
  formDataProperty,
  formDataThird,
  formDataPropertyResultSearch,
  formDataPropertyDef,
} from "../../interfaces";
//initials values
import { initialFormDataProperty } from "../../initialsValues";
//methods
import {
  validNumberNotSimbol,
  isValidFormProperty,
  reorderProperty,
  reorderPropertyClone,
} from "../../methods";
//styles

//import "../../../../../assets/themesArcgis/light/main.css";
//import "../../../../../assets/themesArcgis/light/view.css";
//inner styles
import "./modalProperty.css";
import { toast } from "react-toastify";
//inner interfaces
type complementSearch = {
  idMunicipio: string | number;
  idBarrio: string | number;
};
type Props = {
  show: boolean;
  formThird: formDataThird;
  municipios: any[];
  barrios: any[];
  complementos_direccion: any[];
  geo_data: any;
  token_mapa: any;
  lista_capas: any[];
  geo_data_caracteristicas: any;
  tipos_propiedad: any[];
  tipos_vivienda: any[];
  crear_propiedad: any;
  isEditProperty: boolean;
  dataProperty: formDataPropertyResultSearch | null;
  isFatherSuscripciton: boolean;
  clearComplementos: () => void;

  onHide: () => void;
  loadBarriosAction: (municipioId: number | string) => void;
  loadComplementosAction: (data: complementSearch) => void;
  searchGeolocalizarAction: (data: any) => void;
  loadTokentAction: () => void;
  getListaCapasAction: () => void;
  searchCaracteristicasArcgisAction: (data: any) => void;
  getTiposPropiedadAction: () => void;
  getTiposClasificacionViviendaAction: () => void;
  postCrearPropiedadAction: (data: any) => void;
  toggleIsCreateProperty: () => void;
  clearListaCapasAction: () => void;
  clearTokentAction: () => void;
  clearTiposPropiedadAction: () => void;
  clearTiposClasificacionViviendaAction: () => void;
  putEditarPropiedadAction: (data: any) => void;
  clearActualizarPropiedad: () => void;
};

function ModalCreateProperty(props: Props) {
  //props
  const {
    show,
    municipios,
    barrios,
    complementos_direccion,
    geo_data,
    token_mapa,
    lista_capas,
    geo_data_caracteristicas,
    tipos_propiedad,
    tipos_vivienda,
    crear_propiedad,
    formThird,
    isEditProperty,
    dataProperty,
    isFatherSuscripciton,
    loadBarriosAction,
    onHide,
    loadComplementosAction,
    searchGeolocalizarAction,
    loadTokentAction,
    getListaCapasAction,
    searchCaracteristicasArcgisAction,
    getTiposPropiedadAction,
    getTiposClasificacionViviendaAction,
    postCrearPropiedadAction,
    toggleIsCreateProperty,
    clearListaCapasAction,
    clearTokentAction,
    clearTiposPropiedadAction,
    clearTiposClasificacionViviendaAction,
    putEditarPropiedadAction,
    clearActualizarPropiedad,
  } = props;
  //const
  const cloneInitialFormDataProperty = { ...initialFormDataProperty };
  //states
  const [formData, setFormData] = useState<formDataProperty>(
    cloneInitialFormDataProperty
  );
  const [zoneProperty, setZoneProperty] = useState<string>("");
  const [dataMapOnlyShow, setdataMapOnlyShow] = useState<number[]>([]);
  const [currentClassification, setCurrentClassification] =
    useState<string>("");
  const [classification, setClassification] = useState<string[]>([]);
  const [currentDataClone, setCurrentDataClone] =
    useState<formDataPropertyDef | null>(null);
  const [currentDataClonev2, setCurrentDataClonev2] =
    useState<formDataPropertyDef | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //methods
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "uniMunicipio") {
      // si es municipio
      setFormData((prev) => ({
        ...prev,
        uniMunicipio: Number(value),
        uniBarrio: 0,
        uniCmpdireccion: 0,
        uniMunicipioNombre: municipios.find(
          (it) => Number(it.id) === Number(value)
        )?.nombre,
      }));

      loadBarriosAction(value);
    } else if (name === "uniBarrio") {
      //si el barrio es cambiado
      setFormData((prev) => ({
        ...prev,
        uniBarrio: Number(value),
        uniCmpdireccion: 0,
        uniBarrioNombre: barrios.find((it) => Number(it.id) === Number(value))
          ?.nombre,

        proAltriesgo: barrios.find((it) => Number(it.id) === Number(value))
          ?.riesgo
          ? "S"
          : "N",
      }));
      clearComplementos();
      const searchComplement: complementSearch = {
        idMunicipio: formData.uniMunicipio,
        idBarrio: Number(value),
      };
      loadComplementosAction(searchComplement);
    } else if (name === "uniCmpdireccion") {
      //si el complemento es cambiado
      setFormData((prev) => ({
        ...prev,
        uniCmpdireccion: Number(value),
        uniCmpdireccionNombre: complementos_direccion.find(
          (it) => Number(it.id) === Number(value)
        )?.nombre,
      }));
    } else if (name === "proDigitos") {
      //

      if (validNumberNotSimbol(value) && `${value}`.length < 2) {
        if (`${value}`.length === 0)
          setFormData((prev) => ({ ...prev, [name]: "" }));
        if (`${value}`.length === 1)
          setFormData((prev) => ({ ...prev, [name]: Number(value) }));
      }
    } else if (
      name === "proNumcatastral" ||
      name === "proNumcatastralnacional" ||
      name === "proNummatriculainmobiliaria"
    ) {
      if (validNumberNotSimbol(value)) {
        if (name === "proNumcatastral" && value.length < 16) {
          setFormData((prev) => ({ ...prev, [name]: value }));
        }
        if (name === "proNumcatastralnacional" && value.length < 31) {
          setFormData((prev) => ({ ...prev, [name]: value }));
        }
        if (name === "proNummatriculainmobiliaria") {
          setFormData((prev) => ({ ...prev, [name]: value }));
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleAddClassification = () => {
    setClassification((prev) => [...prev, currentClassification]);
  };

  const handleRemoveClassification = (index: number) => {
    setClassification((prev) => {
      const newClassification = [...prev];
      newClassification.splice(index, 1);
      return newClassification;
    });
  };
  const handleBlurEventDireccion = () => {
    setdataMapOnlyShow([]);
    const objGeo = {
      direccion: formData.proDireccion,
      complemento:
        formData.uniCmpdireccionNombre === "0"
          ? null
          : formData.uniCmpdireccionNombre,
      barrio: formData.uniBarrioNombre,
      ciudad: formData.uniMunicipioNombre,
    };

    searchGeolocalizarAction(objGeo);
  };
  const handleSubmitSaveProperty = () => {
    const classificationWithName = classification.map((item) => ({
      uniIderegistro: item,
      uniNombre1: tipos_vivienda.find((it) => it.id === item)?.nombre,
    }));

    const { valid, cloneForm } = isValidFormProperty(
      formThird,
      formData,
      classificationWithName
    );
    if (valid) {
      setIsLoading(true);
      postCrearPropiedadAction(cloneForm);
    }
  };
  const handleSubmiCloneProperty = () => {
    postCrearPropiedadAction(currentDataClone);
  };
  const handleSubmiClonePropertyv2 = () => {
    postCrearPropiedadAction(currentDataClonev2);
  };
  const handleSubmitUpdateProperty = () => {
    console.log("Edit");
    const classificationWithName = classification.map((item) => ({
      uniIderegistro: item,
      uniNombre1: tipos_vivienda.find((it) => it.id === item)?.nombre,
    }));

    const { valid, cloneForm } = isValidFormProperty(
      formThird,
      formData,
      classificationWithName
    );
    if (valid && dataProperty) {
      clearActualizarPropiedad();
      setIsLoading(true);
      putEditarPropiedadAction({
        id: dataProperty.proIderegistro,
        form: cloneForm,
      });
    }
  };

  //effects
  useEffect(() => {
    if (
      formData.uniMunicipio === 0 &&
      municipios.length > 0 &&
      !isEditProperty
    ) {
      setFormData((prev) => ({
        ...prev,
        uniMunicipio: Number(municipios[0].id),
        uniMunicipioNombre: municipios[0].nombre,
      }));
      loadBarriosAction(municipios[0].id);
    }
  }, [formData.uniMunicipio, isEditProperty, loadBarriosAction, municipios]);
  useEffect(() => {
    if (formData.uniBarrio === 0 && barrios.length > 0 && !isEditProperty) {
      setFormData((prev) => ({
        ...prev,
        uniBarrio: Number(barrios[0].id),
        uniBarrioNombre: barrios[0].nombre,
      }));
      const searchComplement: complementSearch = {
        idMunicipio: formData.uniMunicipio,
        idBarrio: barrios[0].id,
      };
      loadComplementosAction(searchComplement);
    }
  }, [
    barrios,
    formData.uniBarrio,
    formData.uniMunicipio,
    isEditProperty,
    loadComplementosAction,
  ]);

  useEffect(() => {
    if (geo_data) {
      const { x, y } = geo_data.location;

      setFormData((prev) => ({
        ...prev,
        proGpslatitud: y,
        proGpslongitud: x,
      }));
    }
  }, [geo_data]);

  useEffect(() => {
    if (crear_propiedad) {
      toggleIsCreateProperty();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crear_propiedad]);

  useEffect(() => {
    console.log(geo_data_caracteristicas);
    if (geo_data_caracteristicas && Array.isArray(geo_data_caracteristicas)) {
      if (geo_data_caracteristicas.length > 0) {
        const { attributes } = geo_data_caracteristicas[0];
        const { SETU_CCDGO, SECU_CCDGO, MANZ_CCDGO } = attributes;
        setFormData((prev) => ({
          ...prev,
          proSeccion: Number(SECU_CCDGO),
          proManzana: Number(MANZ_CCDGO),
          mubaSector: Number(SETU_CCDGO),
        }));
      } else {
        toast.warn(
          "No se encontro un numero catastral en las coordenadas especificadas"
        );
      }
    }
  }, [geo_data_caracteristicas]);

  useEffect(() => {
    console.log(geo_data);
    console.log(formData.proZona);
    console.log(formData.proZona);
    if (geo_data) {
      if (formData.proZona !== zoneProperty && formData.proZona !== "") {
        setZoneProperty(formData.proZona);
      }

      setZoneProperty(formData.proZona);
      const objGeo = {
        type: formData.proZona === "U" ? 1 : 2,
        x: geo_data.location.x,
        y: geo_data.location.y,
      };
      searchCaracteristicasArcgisAction(objGeo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo_data, formData]);
  useEffect(() => {
    if (
      tipos_propiedad &&
      Array.isArray(tipos_propiedad) &&
      tipos_propiedad.length > 0 &&
      !isEditProperty
    ) {
      setFormData((prev) => ({
        ...prev,
        uniTippropieda: Number(tipos_propiedad[0].id),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipos_propiedad]);
  useEffect(() => {
    if (
      Array.isArray(tipos_vivienda) &&
      tipos_vivienda.length > 0 &&
      !isEditProperty
    ) {
      setCurrentClassification(`${tipos_vivienda[0].id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipos_vivienda]);
  useEffect(() => {
    if (isEditProperty && dataProperty) {
      const { formProperty, clasification } = reorderProperty(dataProperty);
      const newFormClone = reorderPropertyClone(dataProperty, true);
      const newFormClonev2 = reorderPropertyClone(dataProperty, false);
      setCurrentDataClone(newFormClone);
      setCurrentDataClonev2(newFormClonev2);
      setFormData(formProperty);
      setClassification(clasification);
      loadBarriosAction(formProperty.uniMunicipio);

      const searchComplement: complementSearch = {
        idMunicipio: formProperty.uniMunicipio,
        idBarrio: formProperty.uniBarrio,
      };

      loadComplementosAction(searchComplement);
      setdataMapOnlyShow([
        Number(formProperty.proGpslongitud),
        Number(formProperty.proGpslatitud),
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditProperty, dataProperty]);

  //show
  useEffect(() => {
    if (show) {
      setIsLoading(false);
      getListaCapasAction();
      loadTokentAction();
      getTiposPropiedadAction();
      getTiposClasificacionViviendaAction();
    } else {
      setFormData({ ...initialFormDataProperty });
      setClassification([]);
      clearListaCapasAction();
      clearTokentAction();
      clearTiposPropiedadAction();
      clearTiposClasificacionViviendaAction();
      setdataMapOnlyShow([]);
      setCurrentDataClone(null);
      setIsLoading(false);
      if (municipios && municipios[0]) {
        setFormData((prev) => ({
          ...prev,
          uniMunicipio: Number(municipios[0].id),
          uniMunicipioNombre: municipios[0].nombre,
        }));
        loadBarriosAction(municipios[0].id);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header>
        <Modal.Title>
          {isEditProperty ? "Actualizar Propiedad" : "Crear Propiedad"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="w-100 modalPropertyScroll">
          <Form.Row>
            {/*seccion 1 */}
            <Form.Group as={Col} md="8">
              <Form.Row>
                {/*row 1  */}
                <Form.Group as={Col} md="5">
                  <Form.Label>Municipio</Form.Label>
                  <Form.Control
                    as="select"
                    name="uniMunicipio"
                    onChange={handleInputChange}
                    value={formData.uniMunicipio}
                  >
                    {municipios.map((city) => (
                      <option key={`municipio-${city.id}`} value={city.id}>
                        {city.nombre}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col} md="7">
                  <Form.Label>Barrio</Form.Label>
                  <Form.Control
                    as="select"
                    name="uniBarrio"
                    value={formData.uniBarrio}
                    onChange={handleInputChange}
                  >
                    {barrios.map((barrio) => (
                      <option key={`barrio-${barrio.id}`} value={barrio.id}>
                        {barrio.nombre}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                {/*row 2  */}
                <Form.Group as={Col} md="12">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    name="proDireccion"
                    onBlur={handleBlurEventDireccion}
                    onChange={handleInputChange}
                    value={formData.proDireccion}
                  />
                </Form.Group>
                {/*row 3  */}
                <Form.Group as={Col} md="6">
                  <Form.Label>Catastral Antiguo</Form.Label>
                  <Form.Control
                    type="text"
                    name="proNumcatastral"
                    value={formData.proNumcatastral}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>Catastral Nuevo (30 Car)</Form.Label>
                  <Form.Control
                    type="text"
                    name="proNumcatastralnacional"
                    value={formData.proNumcatastralnacional}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                {/*row 4  */}

                <Form.Group as={Col} md="6">
                  <Form.Label>Tipo Propiedad</Form.Label>
                  <Form.Control
                    as="select"
                    value={`${formData.uniTippropieda}`}
                    name="uniTippropieda"
                    onChange={handleInputChange}
                  >
                    {Array.isArray(tipos_propiedad) &&
                      tipos_propiedad.map((item) => (
                        <option
                          key={`tipo-propiedad-${item.id}`}
                          value={item.id}
                        >
                          {item.nombre}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col} md="2">
                  <Form.Label>Sector </Form.Label>
                  <Form.Control type="text" value={formData.mubaSector} />
                </Form.Group>

                <Form.Group as={Col} md="2">
                  <Form.Label>Comuna </Form.Label>
                  <Form.Control type="text" value={formData.proSeccion} />
                </Form.Group>
                <Form.Group as={Col} md="2">
                  <Form.Label>Manzana </Form.Label>
                  <Form.Control type="text" value={formData.proManzana} />
                </Form.Group>

                {/*row 4  */}

                <Form.Group as={Col} md="6">
                  <Form.Label>Zona insegura </Form.Label>
                  <Form.Control
                    as="select"
                    value={`${formData.proAltriesgo}`}
                    name="proAltriesgo"
                    disabled={true}
                    onChange={handleInputChange}
                  >
                    <option value="S">SI</option>
                    <option value="N">No</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="2">
                  <Form.Label>Latitud </Form.Label>
                  <Form.Control type="text" value={formData.proGpslatitud} />
                </Form.Group>
                <Form.Group as={Col} md="2">
                  <Form.Label>Longitud </Form.Label>
                  <Form.Control type="text" value={formData.proGpslongitud} />
                </Form.Group>
                <Form.Group as={Col} md="2">
                  <Form.Label>Altitud </Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
                {/*row 5  */}
                <Form.Group as={Col} md="12" className="h-25">
                  <div className="modalPropertyScrollContainerMap">
                    {token_mapa && Array.isArray(lista_capas) && (
                      <Map
                        token={token_mapa}
                        geo_data={geo_data}
                        capas={lista_capas}
                        formData={formData}
                        searchCaracteristicasArcgisAction={
                          searchCaracteristicasArcgisAction
                        }
                        dataMapOnlyShow={dataMapOnlyShow}
                        setFormData={setFormData}
                      />
                    )}
                  </div>
                </Form.Group>
              </Form.Row>
            </Form.Group>
            {/*seccion 2 */}
            <Form.Group as={Col} md="4">
              {/*row 1  */}
              <Form.Row>
                <Form.Group as={Col} md="12">
                  <Form.Label>Complemento Propiedad</Form.Label>
                  <Form.Control
                    as="select"
                    name="uniCmpdireccion"
                    value={formData.uniCmpdireccion}
                    onChange={handleInputChange}
                  >
                    <option value={0}>Selecione</option>
                    {complementos_direccion.map((complemento) => (
                      <option
                        key={`complemento-${complemento.id}`}
                        value={complemento.id}
                      >
                        {complemento.nombre}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Form.Row>

              {/*row 2  */}
              <Form.Row>
                <Form.Group as={Col} md="12">
                  <Form.Label>Matricula inmobiliaria</Form.Label>
                  <Form.Control
                    type="text"
                    name="proNummatriculainmobiliaria"
                    value={formData.proNummatriculainmobiliaria}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Form.Row>

              {/*row 3  */}
              <Form.Row>
                <Form.Group as={Col} md="4">
                  <Form.Label>Independecia</Form.Label>
                  <Form.Control
                    type="text"
                    name="proDigitos"
                    value={formData.proDigitos}
                    onChange={handleInputChange}
                    disabled
                  />
                </Form.Group>
                <Form.Group as={Col} md="8">
                  <Form.Label>Ubicación</Form.Label>
                  <Form.Control
                    as="select"
                    name="proZona"
                    value={formData.proZona}
                    onChange={handleInputChange}
                  >
                    <option value="U">Urbano</option>
                    <option value="R">Rural</option>
                  </Form.Control>
                </Form.Group>
              </Form.Row>

              {/*row 4  */}

              <Form.Row>
                <Form.Group as={Col} md="10">
                  <Form.Label>Clasificacion Vivienda</Form.Label>
                  <Form.Control
                    as="select"
                    value={currentClassification}
                    onChange={(e: any) =>
                      setCurrentClassification(e.target.value)
                    }
                  >
                    {tipos_vivienda.map((item) => (
                      <option key={`tipo-vivienda-${item.id}`} value={item.id}>
                        {item.nombre}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="2" className="pt-4 mt-2">
                  <Button
                    variant="success"
                    onClick={handleAddClassification}
                    disabled={classification.includes(currentClassification)}
                  >
                    +
                  </Button>
                </Form.Group>

                <Form.Group as={Col} md="12">
                  <Table bordered>
                    <tbody className="text-center">
                      {classification.map((item, index) => (
                        <tr key={`classification-select-${index}`}>
                          <td>
                            {
                              tipos_vivienda.find((it) => it.id === item)
                                ?.nombre
                            }
                          </td>
                          <td>
                            <Button
                              variant="danger"
                              onClick={() => handleRemoveClassification(index)}
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
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} className="mr-3">
          Cerrar
        </Button>
        {isEditProperty && isFatherSuscripciton && (
          <Button
            variant="primary"
            className="mr-3"
            onClick={handleSubmiCloneProperty}
          >
            Clonar
          </Button>
        )}

        {isEditProperty && (
          <Button
            variant="primary"
            className="mr-3"
            onClick={handleSubmiClonePropertyv2}
          >
            Clonar como padre
          </Button>
        )}
        {isEditProperty ? (
          <Button
            variant="primary"
            className="mr-3"
            onClick={handleSubmitUpdateProperty}
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
              "Actualizar"
            )}
          </Button>
        ) : (
          <Button
            variant="primary"
            className="mr-3"
            onClick={handleSubmitSaveProperty}
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
        )}
      </Modal.Footer>
    </Modal>
  );
}
const mapStateToProps = (states) => ({
  municipios: states.suscripcionReducer.municipios,
  barrios: states.suscripcionReducer.barrios,
  complementos_direccion:
    states.suscripcionTerceroReducer.complementos_direccion,
  geo_data: states.suscripcionTerceroReducer.geo_data,
  token_mapa: states.suscripcionTerceroReducer.token_mapa,
  lista_capas: states.suscripcionTerceroReducer.lista_capas,
  geo_data_caracteristicas:
    states.suscripcionTerceroReducer.geo_data_caracteristicas,
  tipos_propiedad: states.suscripcionTerceroReducer.tipos_propiedad,
  tipos_vivienda: states.suscripcionTerceroReducer.tipos_vivienda,
  crear_propiedad: states.suscripcionTerceroReducer.crear_propiedad,
  update_propiedad: states.suscripcionTerceroReducer.update_propiedad,
});

const mapDispatchToProps = (dis) => ({
  loadBarriosAction: (municipioId: number | string) =>
    dis(loadBarrios(municipioId)),
  loadComplementosAction: (data: complementSearch) =>
    dis(loadComplementos(data)),
  searchGeolocalizarAction: (data: any) => dis(searchGeolocalizar(data)),
  loadTokentAction: () => dis(loadTokent()),
  getListaCapasAction: () => dis(getListaCapas()),
  searchCaracteristicasArcgisAction: (data: any) =>
    dis(searchCaracteristicasArcgis(data)),
  getTiposPropiedadAction: () => dis(getTiposPropiedad()),
  getTiposClasificacionViviendaAction: () =>
    dis(getTiposClasificacionVivienda()),
  postCrearPropiedadAction: (data: any) => dis(postCrearPropiedad(data)),

  clearListaCapasAction: () => dis(clearListaCapas()),
  clearTokentAction: () => dis(clearTokent()),
  clearTiposPropiedadAction: () => dis(clearTiposPropiedad()),
  clearTiposClasificacionViviendaAction: () =>
    dis(clearTiposClasificacionVivienda()),
  putEditarPropiedadAction: (data: any) => dis(putEditarPropiedad(data)),
  clearActualizarPropiedad: () => dis(clearActualizarPropiedad()),
  clearComplementos: () => dis(clearComplementos()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalCreateProperty);
