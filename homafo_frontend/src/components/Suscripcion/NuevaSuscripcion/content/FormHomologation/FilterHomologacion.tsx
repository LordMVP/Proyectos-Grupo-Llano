import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Form, Col, Button, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import moment from "moment";
import Spinner from "react-loader-spinner";
//custom components

import PaginationTable from "../../../../utils/Paginators/PaginationTable";
//actions redux
import * as actions from "../../../../../actions/suscripcionHomologacion";

//methods
import { reOrderTablePages } from "../../methods";
//initial states

type Props = {
  buscar: any; // redux state
  convenios: any; // redux state
  currentSuscription: any;
  empresas: any; // redux state
  loadBuscarHomologacion: (form: any) => void; // redux action
  clearBuscarHomologacion: () => void; // redux action
  loadEmpresasConvenios: (id: string | number) => void; // redux action
  setSeccionForm: (secion: number) => void;
  loadEmpresas: () => void; // redux action
  clearEmpresas: () => void; // redux action
  loadConveniosEmpresas: (id: string | number) => void; // redux action
};

type FormInterface = {
  idsus: null | number;
  idempresa: null | number;
  fechaIni: null | string;
  fechaFin: null | string;
};

//component
function FilterHomologacion(props: Props) {
  //props
  const {
    currentSuscription,
    buscar,
    empresas,
    loadBuscarHomologacion,
    loadEmpresasConvenios,
    setSeccionForm,
    loadConveniosEmpresas,
  } = props;
  //const

  const innitFormValues: FormInterface = {
    idsus: null,
    idempresa: null,
    fechaIni: null,
    fechaFin: null,
  };

  //states
  const [formFilter, setFormFilter] = useState<FormInterface>({
    ...innitFormValues,
  });
  const [tableData, setTableData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setisLoading] = useState(false);
  const [resultSearch, setResultSearch] = useState<boolean>(false);
  //methods
  const changleInputs = (event: any) => {
    const { name, value } = event.target;

    if (name === "idempresa") {
      setFormFilter((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else if (name === "convenio") {
      setFormFilter((prev) => ({
        ...prev,
        [name]: Number(value),
        idempresa: 0,
      }));
      loadEmpresasConvenios(Number(value));
    } else {
      setFormFilter((prev) => ({
        ...prev,
        [name]: moment(value).format("YYYY-MM-DD"),
      }));
    }
  };

  const handleSearchFilter = () => {
    if (Number(formFilter.idempresa) === 0) {
      toast.error("Por favor seleccione una empresa");
      return;
    }
    if (!formFilter.fechaIni) {
      toast.error("Por favor seleccione una fecha de inicio");
      return;
    }
    if (!formFilter.fechaFin) {
      toast.error("Por favor seleccione una fecha de final");
      return;
    }

    loadBuscarHomologacion(formFilter);
    setisLoading(true);
  };
  //effects
  useEffect(() => {
    if (
      empresas &&
      Array.isArray(empresas) &&
      empresas.length > 0 &&
      formFilter.idempresa === 0
    ) {
      setFormFilter((prev) => ({
        ...prev,
        convenio: empresas[0].empresa_sevemp,
      }));
      loadConveniosEmpresas(Number(empresas[0].empresa_sevemp));
    }
  }, [
    setFormFilter,
    loadEmpresasConvenios,
    formFilter.idempresa,
    empresas,
    loadConveniosEmpresas,
  ]);

  useEffect(() => {
    if (buscar) {
      const newDataTable = reOrderTablePages(buscar, 10);
      setCurrentPage(0);
      setTableData(newDataTable);
      setResultSearch(true);
      setisLoading(false);
    }
  }, [buscar]);
  useEffect(() => {
    if (currentSuscription) {
      setFormFilter((prev) => ({
        ...prev,
        idsus: Number(currentSuscription.dsusIderegistr),
      }));
    }
  }, [currentSuscription]);

  //renders

  return (
    <Form.Row className="my-3">
      <Form.Group as={Col} md="12">
        <Form.Row>
          <Form.Group as={Col} md="4">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              name="fechaIni"
              onChange={changleInputs}
              value={`${formFilter.fechaIni}`}
            />
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>Hasta</Form.Label>
            <Form.Control
              type="date"
              name="fechaFin"
              onChange={changleInputs}
              value={`${formFilter.fechaFin}`}
            />
          </Form.Group>

          <Form.Group as={Col} md="4">
            <Form.Label>Empresa</Form.Label>
            <Form.Control
              as="select"
              name="idempresa"
              onChange={changleInputs}
              value={`${formFilter.idempresa}`}
            >
              <option value={0}>Seleccione</option>
              {empresas &&
                Array.isArray(empresas) &&
                empresas.map((it) => (
                  <option
                    key={`empre-h-${it.empresa_sevemp}`}
                    value={it.empresa_sevemp}
                  >
                    {it.empresa_nom}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
        </Form.Row>
      </Form.Group>

      <Form.Group as={Col} md="12">
        <Button variant="primary" className="mr-3" onClick={handleSearchFilter}>
          {isLoading ? (
            <Spinner
              type="Oval"
              color="#fff"
              height={25}
              width={35}
              strokeWidth={10}
            />
          ) : (
            "Buscar"
          )}
        </Button>

        <Button
          variant="primary"
          className="mr-3"
          onClick={() => setSeccionForm(0)}
        >
          Regresar
        </Button>
      </Form.Group>

      {resultSearch && (
        <Form.Group as={Col} md="12">
          <Form.Row>
            <Table striped bordered>
              <thead className="bg-primary text-white text-center">
                <tr>
                  <th>Fecha</th>
                  <th>Convenio</th>
                  <th>Empresa</th>
                  <th>Nombres Apellidos</th>

                  <th>Codigo Suscripción Alterna</th>

                  <th>Usuario</th>
                </tr>
              </thead>
              <tbody>
                {tableData[currentPage] &&
                  Array.isArray(tableData[currentPage]) &&
                  tableData[currentPage].map((it) => (
                    <tr className="text-center" key={it.idsus}>
                      <td>{it?.fecha}</td>
                      <td>{it?.convenio}</td>
                      <td> {it?.empresa}</td>
                      <td> {it?.nomcompleto}</td>
                      <td> {it?.susalterna}</td>
                      <td> {it?.usuario}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            <PaginationTable
              numPage={tableData.length}
              first={currentPage === 0}
              last={currentPage === tableData.length - 1}
              numPageCurrent={currentPage}
              onClick={setCurrentPage}
              isLoading={isLoading || tableData.length === 0}
            />
          </Form.Row>
        </Form.Group>
      )}
    </Form.Row>
  );
}

const mapStateToProps = ({ suscripcionHomologacionReducer }) => ({
  buscar: suscripcionHomologacionReducer.buscar,
  empreas_convenios: suscripcionHomologacionReducer.empreas_convenios,
  convenios: suscripcionHomologacionReducer.convenios,
  empresas: suscripcionHomologacionReducer.empresasHologables,
  convenios_empresas: suscripcionHomologacionReducer.convenios_empresas,
});

const mapDispatchToProps = (dispatch) => ({
  loadBuscarHomologacion: (form: any) =>
    dispatch(actions.loadBuscarHomologacion(form)),

  clearBuscarHomologacion: () => dispatch(actions.clearBuscarHomologacion()),

  loadEmpresasConvenios: (id: string | number) =>
    dispatch(actions.loadEmpresasConvenios(id)),
  loadConveniosEmpresas: (id: string | number) =>
    dispatch(actions.loadConveniosEmpresas(id)),
  clearConveniosEmpresas: () => dispatch(actions.clearConveniosEmpresas()),

  loadEmpresas: () => dispatch(actions.loadEmpresas()),
  clearEmpresas: () => dispatch(actions.clearEmpresas()),
});
export default connect(mapStateToProps, mapDispatchToProps)(FilterHomologacion);
