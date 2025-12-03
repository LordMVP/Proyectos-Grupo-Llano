import React from "react";
import { Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import UnidadesApi from "../../../api/homologaciones/UnidadesApi";
import Page, { PageableRequest } from "../../../models/dto/Pagination";
import FormTitle from "../../../components/utils/FormTitle/FormTitle";
import _ from "lodash";
import { MdFiberNew, MdEdit } from "react-icons/md";
import DataTableComponent from "../DataTableComponent/DataTableComponent";
import UnidadDTO from "../../../models/dto/UnidadDTO";
import PARAMETROS from "../../../data/constantes";
import { toast } from "react-toastify";
import EffectivePermisions from "../../../models/dto/EffectivePermission";

interface IUnidadEditorProps {
  unidadTitle: string;
  unidadClase: number;
  showSearch?: boolean;
  permissions: EffectivePermisions;
  showSwitch?: boolean;
  textSwitch?: string;
  switchCallback?: any;
  prefixId: string;
}

interface SUnidadEditorComponentState {
  loading: boolean;
  page: Page | null;
  item: UnidadDTO | null;
  showAll: boolean;
}

const defaultItem: UnidadDTO = {
  uniIderegistro: null,
  uniCodigo: "",
  uniNombre1: "",
  uniPropiedad: { estado: "A" },
};
const defaultPageable: PageableRequest = {
  page: 0,
  size: 5,
  sort: "uniIderegistro",
};

class UnidadEditor extends React.Component<
  IUnidadEditorProps,
  SUnidadEditorComponentState
> {
  private unidadesApi = new UnidadesApi();
  public textInput: any;
  public columns = [
    {
      name: "Codigo",
      selector: "uniCodigo",
    },
    {
      name: "Nombre",
      selector: "uniNombre1",
    },
    {
      name: "Estado",
      selector: "uniPropiedad.estado",
    },
    {
      name: "Opciones",
      cell: (row) => (
        <Button
          disabled={!this.props.permissions.EDIT}
          onClick={() => this.selectRow(row)}
          variant="primary"
          size="sm"
        >
          Editar
        </Button>
      ),
    },
  ];

  constructor(props: IUnidadEditorProps) {
    super(props);
    this.nuevoItemClick = this.nuevoItemClick.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFormResponse = this.handleFormResponse.bind(this);
    this.updateTable = this.updateTable.bind(this);

    this.textInput = React.createRef();
    let arr: any[] = [];
    let page: Page = { content: arr };
    this.state = {
      showAll: false,
      loading: false,
      page: page,
      item: defaultItem,
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
  }
  async updateTable(pageable: PageableRequest) {
    pageable.sort = "uniFecha,desc";
    //pageable.filter = !this.state.showAll?'estado,A':null;
    const response = await this.unidadesApi.getByClass(
      this.props.unidadClase,
      pageable
    );
    this.setState({
      loading: false,
      page: response.data,
    });
  }
  nuevoItemClick() {
    this.setState({ item: defaultItem });
    this.textInput.current.focus();
  }
  handleFormSubmit(event) {
    this.unidadesApi
      .saveByClass(this.state.item as UnidadDTO, this.props.unidadClase)
      .then(this.handleFormResponse)
      .catch((error) => {
        if (error.response.status === 409) {
          toast.error("Codigo o nombre duplicado");
        } else {
          console.log("Error actualizar unidad " + error);
          toast.error("No se logro actualizar el registro");
        }
      });
    event.preventDefault();
  }
  handleFormResponse(response: any) {
    if (PARAMETROS.APP_DEV.DEBUG) {
      console.log(response);
    }
    toast("Registro insertado con exito");
    this.updateTable(defaultPageable);
  }
  selectRow(row: any) {
    this.setState({ item: row });
    this.textInput.current.focus();
  }

  handleChange(event) {
    const { value, name } = event.target;
    let itemCopy: UnidadDTO = JSON.parse(JSON.stringify(this.state.item));
    _.set(itemCopy, name, value);
    this.setState({ item: itemCopy });
  }
  render() {
    return (
      <Row>
        <Col md={12} className="small">
          <Form onSubmit={this.handleFormSubmit}>
            <FormTitle
              active={this.props.permissions.CREATE}
              title={this.props.unidadTitle}
              onNew={this.nuevoItemClick}
            />
            <Form.Row className="align-items-center">
              <Form.Group as={Col} controlId="codigo">
                <Form.Label>
                  Codigo{" "}
                  {this.state.item?.uniIderegistro ? "(editando)" : "(nuevo)"}
                </Form.Label>
                <InputGroup className="mb-2" size="sm">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">
                      {this.state.item?.uniIderegistro ? (
                        <MdEdit size="1.5em" />
                      ) : (
                        <MdFiberNew size="1.5em" />
                      )}
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    required
                    onChange={this.handleChange}
                    name="uniCodigo"
                    ref={this.textInput}
                    value={this.state.item?.uniCodigo}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} controlId="descripcion">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  required
                  onChange={this.handleChange}
                  name="uniNombre1"
                  className="mb-2"
                  size="sm"
                  value={this.state.item?.uniNombre1}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  required
                  onChange={this.handleChange}
                  name="uniPropiedad.estado"
                  className="mb-2"
                  size="sm"
                  as="select"
                  value={this.state.item?.uniPropiedad.estado}
                >
                  <option value="A">Activo</option>
                  <option value="I">Inactivo</option>
                </Form.Control>
              </Form.Group>
              <Col xs="auto" className="">
                <Button
                  disabled={!this.props.permissions.SAVE}
                  size="sm"
                  className=""
                  type="submit"
                >
                  Guardar
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Col>
        <Col md={12}>
          <h6 className="h6">Listado de {this.props.unidadTitle}</h6>
          <DataTableComponent
            showFilter={true}
            prefixId={this.props.prefixId}
            loading={this.state.loading}
            showSearch={this.props.showSearch}
            page={this.state.page as Page}
            columns={this.columns}
            onUpdate={this.updateTable}
          ></DataTableComponent>
        </Col>
      </Row>
    );
  }
}
export default UnidadEditor;
