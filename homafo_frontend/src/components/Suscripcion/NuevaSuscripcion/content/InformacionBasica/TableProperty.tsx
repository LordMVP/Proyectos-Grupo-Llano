import React, { useState, useEffect } from "react";
import { Form, Col, Button, Table } from "react-bootstrap";
import { connect } from "react-redux";
import Spinner from "react-loader-spinner";
//redux
import { loadMunicipios } from "../../../../../actions/suscripcionActions";
import {
  getBuscarPropiedadesPorTercero,
  clearBuscarPropiedadesPorTercero,
  deletePropiedad,
  postCrearPropiedad,
  clearCrearPropiedad,
  clearBorrarPropiedad,
  clearCopiarPropiedad,
  clearActualizarPropiedad,
} from "../../../../../actions/suscripcionTercero";
//inner components
import ModalCreateProperty from "./ModalCreateProperty";
import ModalDeleteProperty from "./ModalDeleteProperty";
import ModalCloneProperty from "./ModalCloneProperty";
//intefaces
import { formDataThird, formDataPropertyResultSearch } from "../../interfaces";
//methods
import { reorderPropertyClone, reOrderTablePages } from "../../methods";

type Props = {
  lista_propiedades_tercero: any[];
  formThird: formDataThird;
  delete_propiedad: any;
  crear_propiedad: any;
  update_propiedad: any;
  loadMunicipiosAction: () => void;
  getBuscarPropiedadesPorTerceroAction: (id: string | number) => void;
  clearBuscarPropiedadesPorTerceroAction: () => void;
  deletePropiedadAction: (id: string | number) => void;
  postCrearPropiedadAction: (data: any) => void;
  clearCrearPropiedadAction: () => void;
  clearBorrarPropiedadAction: () => void;
  clearCopiarPropiedadAction: () => void;
  clearActualizarPropiedadAction: () => void;
  handleAsingProperty: (data: any) => void;
  handleChangeSeccion: (data: string) => void;
};

function TableProperty(props: Props) {
  //props
  const {
    lista_propiedades_tercero,
    formThird,
    delete_propiedad,
    crear_propiedad,
    update_propiedad,
    loadMunicipiosAction,
    getBuscarPropiedadesPorTerceroAction,
    clearBuscarPropiedadesPorTerceroAction,
    deletePropiedadAction,
    postCrearPropiedadAction,
    clearCrearPropiedadAction,
    clearBorrarPropiedadAction,
    clearCopiarPropiedadAction,
    clearActualizarPropiedadAction,
    handleAsingProperty,
    handleChangeSeccion,
  } = props;
  //states
  const [isLoadin, setIsLoadin] = useState(false);
  const [modalProperty, setModalProperty] = useState<boolean>(false);
  const [modalDeleteProperty, setModalDeleteProperty] =
    useState<boolean>(false);
  const [modalClone, setModalClone] = useState<boolean>(false);
  const [idThird, setidThird] = useState<string>("");
  const [isCreateProperty, setIsCreateProperty] = useState<boolean>(false);
  const [isEditProperty, setisEditProperty] = useState<boolean>(false);
  const [currentDeleteData, setcurrentDeleteData] = useState<string | number>(
    ""
  );
  const [dataTableProperty, setDataTableProperty] = useState<any[]>([]);
  const [currentPage, setcurrentPage] = useState<number>(0);
  const [currentSuscriptionCondition, setCurrentSuscriptionCondition] =
    useState<boolean>(false);
  const [currentDataEdit, setCurrentDataEdit] =
    useState<formDataPropertyResultSearch | null>(null);
  const [currentDataClone, setCurrentDataClone] =
    useState<formDataPropertyResultSearch | null>(null);
  //methods
  const clearRedux = () => {
    clearCrearPropiedadAction();
    clearBorrarPropiedadAction();
    clearCopiarPropiedadAction();
    clearActualizarPropiedadAction();
  };

  const onCLoseModal = () => {
    console.log("Cerrar modal");
    clearRedux();
    setModalProperty(false);
    setisEditProperty(false);
  };
  const onCLoseModalDelete = () => {
    setModalDeleteProperty(false);
    setcurrentDeleteData("");
    clearRedux();
  };
  const onCLoseModalClone = () => {
    setModalClone(false);
    setCurrentDataClone(null);
    clearRedux();
  };
  const onEditProperty = (property: any) => {
    setModalProperty(true);
    setisEditProperty(true);

    setCurrentSuscriptionCondition(Boolean(property.hasSubscription));
    setCurrentDataEdit(property);
  };

  const onDeleteProperty = (idPRoperty: string | number) => {
    setModalDeleteProperty(true);
    setcurrentDeleteData(idPRoperty);
  };
  const deleteProperty = () => {
    if (currentDeleteData !== "") {
      deletePropiedadAction(currentDeleteData);
    }
  };
  const onCloneProperty = (property: any) => {
    setModalClone(true);

    //Boolean(property.hasSubscription)
    setCurrentSuscriptionCondition(
      property.proIdpadre !== null ? false : Boolean(property.hasSubscription)
    );
    console.log(property);
    setCurrentDataClone(property);
  };
  const cloneProperty = () => {
    if (!currentDataClone) return;
    const newFormClone = reorderPropertyClone(currentDataClone, true);
    postCrearPropiedadAction(newFormClone);
  };
  const clonePropertyv2 = () => {
    if (!currentDataClone) return;
    const newFormClone = reorderPropertyClone(currentDataClone, false);
    postCrearPropiedadAction(newFormClone);
  };

  const toggleIsCreateProperty = () => setIsCreateProperty((prev) => !prev);

  //effects

  useEffect(() => {
    loadMunicipiosAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      formThird.terIderegistro !== null &&
      `${formThird.terIderegistro}` !== idThird
    ) {
      setidThird(`${formThird.terIderegistro}`);
    }

    if (formThird.terIderegistro === null) {
      setidThird("");
      clearBuscarPropiedadesPorTerceroAction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formThird]);

  useEffect(() => {
    if (idThird !== "") {
      getBuscarPropiedadesPorTerceroAction(idThird);
      setIsLoadin(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idThird]);
  useEffect(() => {
    if (isCreateProperty && formThird.terIderegistro !== null) {
      getBuscarPropiedadesPorTerceroAction(formThird.terIderegistro);
      setIsLoadin(true);
      onCLoseModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateProperty]);
  useEffect(() => {
    if (delete_propiedad) {
      if (formThird.terIderegistro !== null) {
        onCLoseModalDelete();
        setIsLoadin(true);
        getBuscarPropiedadesPorTerceroAction(formThird.terIderegistro);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delete_propiedad]);
  useEffect(() => {
    console.log(crear_propiedad);
    if (crear_propiedad !== null) {
      onCLoseModalClone();
      onCLoseModal();
      clearCrearPropiedadAction();
      if (formThird.terIderegistro !== null) {
        getBuscarPropiedadesPorTerceroAction(formThird.terIderegistro);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crear_propiedad]);
  useEffect(() => {
    console.log(update_propiedad);

    if (update_propiedad !== null) {
      onCLoseModalClone();
      onCLoseModal();
      clearCrearPropiedadAction();
      if (formThird.terIderegistro !== null) {
        getBuscarPropiedadesPorTerceroAction(formThird.terIderegistro);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update_propiedad]);
  //update_propiedad
  useEffect(() => {
    if (lista_propiedades_tercero) {
      const data = reOrderTablePages(lista_propiedades_tercero, 5);

      setDataTableProperty(data);
      setIsLoadin(false);
      setcurrentPage(0);
    }
  }, [lista_propiedades_tercero]);

  useEffect(() => {
    if (isLoadin) {
      handleAsingProperty(null);
    }
  }, [isLoadin, handleAsingProperty]);

  //inner compoenents
  const ComponentLoad = () => {
    return (
      <div className="w-100  d-flex flex-column  justify-content-center align-items-center">
        <Spinner
          type="Oval"
          color="#6B9DEB"
          height={45}
          width={55}
          strokeWidth={10}
        />
        <h2>Cargando propiedades</h2>
      </div>
    );
  };

  if (isLoadin) {
    return <ComponentLoad />;
  }
  //render

  return (
    <>
      <ModalCreateProperty
        show={modalProperty}
        onHide={onCLoseModal}
        formThird={formThird}
        toggleIsCreateProperty={toggleIsCreateProperty}
        isEditProperty={isEditProperty}
        dataProperty={currentDataEdit}
        isFatherSuscripciton={currentSuscriptionCondition}
      />
      <ModalDeleteProperty
        show={modalDeleteProperty}
        onHide={onCLoseModalDelete}
        onSubmit={deleteProperty}
      />
      <ModalCloneProperty
        show={modalClone}
        onHide={onCLoseModalClone}
        onSubmit={cloneProperty}
        onSubmitv2={clonePropertyv2}
        data={currentDataClone}
        isFatherSuscripciton={currentSuscriptionCondition}
      />
      <Form.Group as={Col} md="12">
        <Form.Row>
          <div className="w-100 d-flex justify-content-end mb-3">
            <Button variant="primary" onClick={() => setModalProperty(true)}>
              Nueva Propiedad
            </Button>
          </div>
        </Form.Row>
        <Form.Row>
          {dataTableProperty[currentPage] && (
            <Table striped bordered hover>
              <thead className="bg-primary text-white text-center">
                <tr>
                  <th>Municipio</th>
                  <th>Dirección</th>
                  <th>Barrio</th>
                  <th>Numero Catastral</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {dataTableProperty[currentPage].map((propiedad) => (
                  <tr
                    className="text-center"
                    key={`property-${propiedad?.proIderegistro}`}
                  >
                    <td>{propiedad?.uniMunicipioNombre}</td>
                    <td>{propiedad?.proDireccion}</td>
                    <td>{propiedad?.uniBarrioNombre}</td>
                    <td>{propiedad?.proNumcatastral}</td>
                    <td>
                      <Button
                        variant="success"
                        className="mr-3"
                        onClick={() => onEditProperty(propiedad)}
                      >
                        Editar
                      </Button>

                      <Button
                        variant="success"
                        className="mr-3"
                        onClick={() => onCloneProperty(propiedad)}
                      >
                        Clonar
                      </Button>

                      {!propiedad.hasSubscription && (
                        <Button
                          variant="success"
                          className="mr-3"
                          onClick={() => {
                            handleAsingProperty(propiedad);
                            handleChangeSeccion("suscripcion");
                          }}
                        >
                          Seleccionar
                        </Button>
                      )}

                      <Button
                        variant="danger"
                        className="mr-3"
                        onClick={() =>
                          onDeleteProperty(propiedad?.proIderegistro)
                        }
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Form.Row>
        {dataTableProperty.length > 0 && (
          <Form.Row>
            <div className="w-100 d-flex justify-content-between ">
              <div>
                Numero de paginas - {dataTableProperty.length} pagina actual -{" "}
                {currentPage + 1}
              </div>
              <div>
                <Button
                  variant="primary"
                  className="mr-2"
                  onClick={() => setcurrentPage(currentPage - 1)}
                  disabled={isLoadin || currentPage === 0}
                >
                  Anterior
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setcurrentPage(currentPage + 1)}
                  disabled={
                    isLoadin || currentPage === dataTableProperty.length - 1
                  }
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </Form.Row>
        )}
      </Form.Group>
    </>
  );
}

const mapStateToProps = (states) => ({
  lista_propiedades_tercero:
    states.suscripcionTerceroReducer.lista_propiedades_tercero,
  delete_propiedad: states.suscripcionTerceroReducer.delete_propiedad,
  crear_propiedad: states.suscripcionTerceroReducer.crear_propiedad,
  update_propiedad: states.suscripcionTerceroReducer.update_propiedad,
});

const mapDispatchToProps = (dispatch) => ({
  loadMunicipiosAction: () => dispatch(loadMunicipios()),
  getBuscarPropiedadesPorTerceroAction: (idTercero: string | number) =>
    dispatch(getBuscarPropiedadesPorTercero(idTercero)),
  clearBuscarPropiedadesPorTerceroAction: () =>
    dispatch(clearBuscarPropiedadesPorTercero()),
  deletePropiedadAction: (idPropiedad: string | number) =>
    dispatch(deletePropiedad(idPropiedad)),
  postCrearPropiedadAction: (data: any) => dispatch(postCrearPropiedad(data)),
  clearCrearPropiedadAction: () => dispatch(clearCrearPropiedad()),
  clearBorrarPropiedadAction: () => dispatch(clearBorrarPropiedad()),
  clearCopiarPropiedadAction: () => dispatch(clearCopiarPropiedad()),
  clearActualizarPropiedadAction: () => dispatch(clearActualizarPropiedad()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TableProperty);
