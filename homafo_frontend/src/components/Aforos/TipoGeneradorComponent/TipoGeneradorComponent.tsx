
import React from 'react';
import { Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import Page, { PageableRequest } from '../../../models/dto/Pagination';
import DataTableComponent from '../../utils/DataTableComponent/DataTableComponent';
import FormTitle from '../../utils/FormTitle/FormTitle';
import { MdEdit, MdFiberNew, MdTimer } from 'react-icons/md';
import _ from 'lodash'
import GeneradorDTO from '../../../models/dto/GeneradorDTO';
import GeneradorApi from '../../../api/homologaciones/GeneradorApi';
import UnidadesApi from '../../../api/homologaciones/UnidadesApi';
import UnidadDTO from '../../../models/dto/UnidadDTO';
import { toast } from 'react-toastify';
import PermisoProgramaDto from '../../../models/dto/PermisoProgramaDto';
import EffectivePermisions from '../../../models/dto/EffectivePermission';
import UtilsFunction from '../../utils/UtilsFunction';
import NoAutorizadoComponent from '../../utils/SeccionNoAutorizadaComponent/NoAutorizadoComponent';
import PARAMETROS from '../../../data/constantes';

interface ITipoGeneradorComponentProps {
    permissions: PermisoProgramaDto[]
}

interface STipoGeneradorComponentState {
    loading: boolean,
    page: Page | null,
    item: GeneradorDTO | null;
    effectivePermissions?: EffectivePermisions;
}
const defaultItem: GeneradorDTO =
{
    'genIderegistro': null,
    'uniTipouso': 0,
    'genDesde': 0,
    'genHasta': 0,
    'genVolumenDesde': 0,
    'genVolumenHasta': 0,
    'genFactorEquivalencia':0,
    'uniClaseaforo': 0,
    'fechaGenerador':'',
    'unidad': { 'uniIderegistro': null, 'uniCodigo': '', 'uniNombre1': '', 'uniPropiedad': { 'estado': 'A' } }
};
const defaultPageable: PageableRequest = { 'page': 0, 'size': 5, 'sort': null };
class TipoGeneradorComponent extends React.Component<ITipoGeneradorComponentProps, STipoGeneradorComponentState>{
    private generadorApi = new GeneradorApi();
    private unidadesApi = new UnidadesApi();
    private tiposUso: UnidadDTO[] = [];
    private clasesAforo: UnidadDTO[] = [];
    public columns = [
        {
            name: 'Codigo',
            selector: 'unidad.uniCodigo'
        },
        {
            name: 'Nombre',
            selector: 'unidad.uniNombre1'
        },
        {
            name: 'Tipo uso',
            selector: 'uniTipousoDesc'
        },
        {
            name: 'Estrato Desde',
            selector: 'genDesde'
        },
        {
            name: 'Estrato Hasta',
            selector: 'genHasta'
        },
        {
            name: 'Vol. Desde',
            selector: 'genVolumenDesde'
        },
        {
            name: 'Vol. Hasta',
            selector: 'genVolumenHasta'
        },
        {
            name: 'Factor Equivalencia',
            selector: 'genFactorEquivalencia'
        },
        {
            name: 'Estado',
            selector: row => row.unidad.uniPropiedad ? row.unidad.uniPropiedad.estado : '-',
        },
        {
            name: 'Fecha',
            selector: row=><span>{new Date(row.fechaGenerador).toLocaleDateString()}</span>,
        },
        {
            name: 'Opciones',
            cell: row => <Button onClick={() => this.selectRow(row)} variant="primary" size="sm">Editar</Button>,
        }
    ];
    constructor(props: ITipoGeneradorComponentProps) {
        super(props);
        this.updateTable = this.updateTable.bind(this);
        this.handleNewItemClick = this.handleNewItemClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleFormResponse = this.handleFormResponse.bind(this);
        let arr: any[] = [];
        let page: Page = { content: arr };
        this.state = { loading: false, page: page, item: defaultItem };
    }

    updatePemissions() {
        console.log(this.props.permissions);
        const effectivePermission = UtilsFunction.getEffectivePermissions(this.props.permissions, 'AFORO_PARAMETRIZACION.PARAMETRIZACION_TIPOS_GENERADOR');
        this.setState({ effectivePermissions: effectivePermission });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.permissions !== this.props.permissions) {
            this.updatePemissions();
        }
    }
    async componentDidMount() {
        const response = await this.unidadesApi.getByClass(2);
        this.tiposUso = response.data.content;
        this.unidadesApi.getByClass(PARAMETROS.CLASES.CLASE_CLASE_AFORO).then(response => {
            //const options = response.data.content.map((clase) => <option value={clase.uniIderegistro}>{clase.uniNombre1}</option>);
            this.clasesAforo = response.data.content;
        });
        this.updatePemissions();
    }
    handleNewItemClick() {
        this.setState({ item: defaultItem });
        //this.textInput.current.focus();
    }
    handleFormSubmit(event) {
        this.generadorApi.save(this.state.item as GeneradorDTO).then(this.handleFormResponse);
        event.preventDefault();
    }
    handleFormResponse(response: any) {
        console.log(response);
        toast("Registro insertado con exito");
        this.updateTable(defaultPageable);
    }
    async updateTable(pageable: PageableRequest) {
        const response = await this.generadorApi.getPage(pageable);
        this.setState({
            loading: false,
            page: response.data
        });
    }
    selectRow(row: any) {
        this.setState({ item: row });
        //alert('Click ' + row.id);
    }
    handleChange(event) {
        const { value, name } = event.target;
        let itemCopy: GeneradorDTO = JSON.parse(JSON.stringify(this.state.item))
        _.set(itemCopy, name, value);
        this.setState({ item: itemCopy });
    }

    render() {
        //const { loading, page } = this.state;
        const tiposUsoOptions = this.tiposUso.map((item) => <option key={item.uniIderegistro as number} value={item.uniIderegistro as number}>{item.uniNombre1}</option>);
        const clasesAforoOptions = this.clasesAforo.map((item) => <option key={item.uniIderegistro as number} value={item.uniIderegistro as number}>{item.uniNombre1}</option>);
        if (this.state?.effectivePermissions?.VIEW) {
            return (
                <Row className="small">
                    <Col md={12}>
                        <Form onSubmit={this.handleFormSubmit}>
                            <FormTitle active={true} title="Tipo de generador" onNew={this.handleNewItemClick} />
                            <Form.Row className="align-items-center">
                                <Form.Group as={Col} controlId="codigo">
                                    <Form.Label>Codigo  {this.state.item?.genIderegistro ? '(editando)' : '(nuevo)'}</Form.Label>
                                    <InputGroup className="mb-2" size="sm">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="basic-addon1">
                                                {this.state.item?.genIderegistro ? <MdEdit size="1.5em" /> : <MdFiberNew size="1.5em" />}
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control required onChange={this.handleChange} name="unidad.uniCodigo" value={this.state.item?.unidad.uniCodigo} />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group as={Col} controlId="descripcion">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control required onChange={this.handleChange} name="unidad.uniNombre1" className="mb-2" size="sm" value={this.state.item?.unidad.uniNombre1} />
                                </Form.Group>
                                <Form.Group as={Col} controlId="estado">
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Control required onChange={this.handleChange} name="unidad.uniPropiedad.estado" className="mb-2" size="sm" as="select" value={this.state.item?.unidad.uniPropiedad.estado} >
                                        <option value="A">Activo</option>
                                        <option value="I">Inactivo</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row className="align-items-center">
                                <Form.Group as={Col} controlId="tipo_uso">
                                    <Form.Label>Tipo de uso</Form.Label>
                                    <Form.Control required onChange={this.handleChange} name="uniTipouso" className="mb-2" size="sm" as="select" value={this.state.item?.uniTipouso} >
                                        <option>Seleccione tipo de uso</option>
                                        {tiposUsoOptions}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} controlId="clase_aforo">
                                    <Form.Label>Clase aforo</Form.Label>
                                    <Form.Control required onChange={this.handleChange} name="uniClaseaforo" className="mb-2" size="sm" as="select" value={this.state.item?.uniClaseaforo} >
                                        <option>Seleccione clase de aforo</option>
                                        {clasesAforoOptions}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} controlId="factor_equivalencia">
                                    <Form.Label>Densidad (0,20-PG / 0,25-GG)</Form.Label>
                                    <Form.Control type="number" required onChange={this.handleChange} name="genFactorEquivalencia" className="mb-2" size="sm" value={this.state.item?.genFactorEquivalencia} />                                      
                                </Form.Group>
                            </Form.Row>
                            <Form.Row className="align-items-center">
                                <Form.Group as={Col} md={4} controlId="rango_estrato">
                                    <Form.Label>Estrato (desde) - (hasta)</Form.Label>
                                    <InputGroup className="mb-2" size="sm">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="basic-addon1">
                                                <MdTimer size="1.5em" />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control type="number" required placeholder="Desde" onChange={this.handleChange} name="genDesde" value={this.state.item?.genDesde} />
                                        <Form.Control type="number" required placeholder="Hasta" onChange={this.handleChange} name="genHasta" value={this.state.item?.genHasta} />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group as={Col} md={4} controlId="rango_volumen">
                                    <Form.Label>Volumen (vol.Desde) - (vol.Hasta)</Form.Label>
                                    <InputGroup className="mb-2" size="sm">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="basic-addon2">
                                                <MdTimer size="1.5em" />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control type="number" placeholder="Desde" onChange={this.handleChange} name="genVolumenDesde" value={this.state.item?.genVolumenDesde} />
                                        <Form.Control type="number" placeholder="Hasta" onChange={this.handleChange} name="genVolumenHasta" value={this.state.item?.genVolumenHasta} />
                                    </InputGroup>
                                </Form.Group>                               
                            </Form.Row>
                            <Form.Row className="mb-2">
                            <Col xs="auto" className="">
                                    <Button size="sm" className="" type="submit">Guardar</Button>
                                </Col>
                            </Form.Row>
                        </Form>
                    </Col>
                    <Col md={12}>
                        <Col md={12}>
                            <h6 className="h6">Listado de Tipos de generador</h6>
                            <DataTableComponent showFilter={true} prefixId='tip-gen' showSearch={true} page={this.state.page as Page} columns={this.columns} onUpdate={this.updateTable}>
                            </DataTableComponent>
                        </Col>
                    </Col>

                </Row>
            );
        } else {
            return (
                <NoAutorizadoComponent/>
              );
        }
    }

}
export default TipoGeneradorComponent;