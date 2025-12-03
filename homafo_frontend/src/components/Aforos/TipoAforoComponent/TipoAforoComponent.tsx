
import React from 'react';
import { Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import Page, { PageableRequest } from '../../../models/dto/Pagination';
import DataTableComponent from '../../utils/DataTableComponent/DataTableComponent';
import FormTitle from '../../utils/FormTitle/FormTitle';
import { MdEdit, MdFiberNew, MdAdd } from 'react-icons/md';
import _ from 'lodash'
import TipoAforoDTO from '../../../models/dto/TipoAforoDTO';
import TipoAforoApi from '../../../api/homologaciones/TipoAforoApi';
import DataTable from 'react-data-table-component';
import DetalleTipoAforoDTO from '../../../models/dto/DetalleTipoAforoDTO';
import PermisoProgramaDto from '../../../models/dto/PermisoProgramaDto';
import EffectivePermisions from '../../../models/dto/EffectivePermission';
import UtilsFunction from '../../utils/UtilsFunction';
import NoAutorizadoComponent from '../../utils/SeccionNoAutorizadaComponent/NoAutorizadoComponent';
import { toast } from 'react-toastify';
import PARAMETROS from '../../../data/constantes';
import UnidadesApi from '../../../api/homologaciones/UnidadesApi';


const unidadesApi = new UnidadesApi();
const conditionalRowStyles = [
    {
        when: row => row.dtafoIderegistro == null,
        style: {
            backgroundColor: '#9ccc65',
            color: 'white',
            '&:hover': {
                cursor: 'pointer',
            },
        },
    }
];


interface ITipoAforoComponentProps {
    permissions: PermisoProgramaDto[]
}

interface STipoAforoComponentState {
    loading: boolean,
    page: Page | null,
    item: TipoAforoDTO | null;
    detalle: DetalleTipoAforoDTO | null;
    effectivePermissions?: EffectivePermisions;
    clasesAforo: any
}

const defaultItem: TipoAforoDTO =
{
    'tafoIderegistro': null,
    'tafoFrecuencia': 0,
    'tafoVigencia': 0,
    'tafoPlazoMaximo': 0,
    'tafoHolgura': 0,
    'tafoFactorProduccion': 0,
    'tafoFactorEquivalencia': 0,
    'tafoAforoPadre': false,
    'uniClaseaforo': undefined,
    'unidad': { 'uniIderegistro': null, 'uniCodigo': '', 'uniNombre1': '', 'uniPropiedad': { 'estado': 'A' } },
    'detalles': Array<DetalleTipoAforoDTO>(),
    'dateCreated':''
};
const defaultDetalle: DetalleTipoAforoDTO = {
    dtafoIderegistro: null,
    dtafoDesde: 0,
    dtafoHasta: 0,
    dtafoCantidadVisitas: 0,
    dtafoFrecuencia: 0
};

const columnsDetalle = [
    {
        name: 'Id',
        selector: 'dtafoIderegistro',
        omit: true
    },
    {
        name: 'Desde',
        selector: 'dtafoDesde',
    },
    {
        name: 'Hasta',
        selector: 'dtafoHasta'
    },
    {
        name: 'Frecuencia',
        selector: 'dtafoFrecuencia'
    },
    {
        name: 'Cant. visitas',
        selector: 'dtafoCantidadVisitas'
    }
];
const defaultPageable: PageableRequest = { 'page': 0, 'size': 5, 'sort': null };
class TipoAforoComponent extends React.Component<ITipoAforoComponentProps, STipoAforoComponentState>{

    private tipoAforoApi = new TipoAforoApi();
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
            name: 'Vigencia(dias)',
            selector: 'tafoVigencia'
        },
        {
            name: 'Plazo Ejecucion(dias)',
            selector: 'tafoPlazoMaximo'
        },
        {
            name: 'Holgura(dias)',
            selector: 'tafoHolgura'
        },
        {
            name: 'Fact. Produccion',
            selector: 'tafoFactorProduccion'
        },
        
        {
            name: 'Estado',
            selector: row => row.unidad.uniPropiedad ? row.unidad.uniPropiedad.estado : '-',
        },
        {
            name: 'Fecha',
            selector: row=><span>{new Date(row.dateCreated).toLocaleDateString()}</span>,
        },
        {
            name: 'Opciones',
            cell: row => <Button onClick={() => this.selectRow(row)} variant="primary" size="sm">Editar</Button>,
        }
    ];
    constructor(props: ITipoAforoComponentProps) {
        super(props);
        this.updateTable = this.updateTable.bind(this);
        this.handleNewItemClick = this.handleNewItemClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleFormResponse = this.handleFormResponse.bind(this);
        this.getDetalleCopy = this.getDetalleCopy.bind(this);
        this.getItemCopy = this.getItemCopy.bind(this);
        this.handleChangeDetalle = this.handleChangeDetalle.bind(this);
        //let arr: any[] = [];
        let page: Page = { content: [] };
        this.state = { loading: false, page: page, item: defaultItem, detalle: defaultDetalle, clasesAforo: [] };
    }
    componentDidMount() {
        this.updatePemissions();
        unidadesApi.getByClass(PARAMETROS.CLASES.CLASE_CLASE_AFORO).then(response => {
            const options = response.data.content.map((clase) => <option value={clase.uniIderegistro}>{clase.uniNombre1}</option>);
            this.setState({ clasesAforo: options });
        });
    }
    updatePemissions() {
        const effectivePermission = UtilsFunction.getEffectivePermissions(this.props.permissions, 'AFORO_PARAMETRIZACION.PARAMETRIZACION_TIPOS_AFOROS');
        this.setState({ effectivePermissions: effectivePermission });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.permissions !== this.props.permissions) {
            this.updatePemissions();
        }
    }
    handleNewItemClick() {
        this.setState({ item: defaultItem });
        //this.textInput.current.focus();
    }
    handleFormSubmit(event) {
        event.preventDefault();
        if (this.state.item?.uniClaseaforo == undefined) {
            toast.error("Debe seleccionar la clase de aforo");
            return;
        }
        if(this.state.item.detalles.length <=0){
            toast.error("Debe agregar por lo menos un campo en los detalles de rangos.");
            return;
        }

        if(this.state.item.tafoVigencia === 0){
            toast.error("La vigencia no puede ser 0");
            return;
        }
        if(this.state.item.tafoPlazoMaximo === 0){
            toast.error("El plazo maximo ejecucion no puede ser 0.");
            return;
        }
        if(this.state.item.tafoHolgura === 0){
            toast.error("La holgura no puede ser 0.");
            return;
        }
        /*if(this.state.item.tafoFactorProduccion === 0){
            toast.error("El factor de produccion no puede ser 0");
            return;
        }*/
        this.tipoAforoApi.save(this.state.item as TipoAforoDTO).then(this.handleFormResponse);

    }
    handleFormResponse(response: any) {
        toast.success("Registro grabado con exito ");
        this.updateTable(defaultPageable);
        if (PARAMETROS.DEBUG) {
            console.log(response);
        }
    }
    async updateTable(pageable: PageableRequest) {
        const response = await this.tipoAforoApi.getPage(pageable);
        this.setState({
            loading: false,
            page: response.data
        });
    }
    selectRow(row: any) {
        this.setState({ item: row });
    }

    validarDetalle(detalle: DetalleTipoAforoDTO, detalles: DetalleTipoAforoDTO[]) {
        return _.find(detalles, function (o: DetalleTipoAforoDTO) {
            return o.dtafoFrecuencia == detalle.dtafoFrecuencia &&
                (((detalle.dtafoDesde >= o.dtafoDesde) && (detalle.dtafoDesde <= o.dtafoHasta)) &&
                    ((detalle.dtafoHasta >= o.dtafoDesde) && (detalle.dtafoHasta <= o.dtafoHasta)));
        })
            ? true : false;
    };

    validarDetalleFields(detalle: DetalleTipoAforoDTO) {
        return detalle.dtafoDesde == undefined ||
            detalle.dtafoDesde == null ||
            detalle.dtafoHasta == undefined ||
            detalle.dtafoHasta == null ||
            detalle.dtafoFrecuencia == undefined ||
            detalle.dtafoFrecuencia == null ||
            detalle.dtafoFrecuencia <= 0 ||
            detalle.dtafoCantidadVisitas == undefined ||
            detalle.dtafoCantidadVisitas == null ||
            detalle.dtafoCantidadVisitas <= 0;
    }
    addDetalle(event) {
        event.preventDefault();
        const detalleCopy = this.getDetalleCopy();
        if (this.validarDetalleFields(detalleCopy)) {
            toast.error("Debes validar todos los campos, son requeridos");
            return;
        }
        const itemCopy = this.getItemCopy();
        const find = this.validarDetalle(detalleCopy, itemCopy.detalles);
        if (find) {
            toast.error('Ya existe un registro con los datos, o hay solapamiento en los rangos.')
            return;
        };
        detalleCopy.dtafoIderegistro = null;
        itemCopy.detalles.unshift(detalleCopy);
        this.setState({ item: itemCopy, detalle: defaultDetalle });
    }

    removeDetalle(event, row: any) {
        event.preventDefault();
        let itemCopy = this.getItemCopy();
        if (row.dtafoIderegistro == null) {
            _.remove(itemCopy.detalles, {
                dtafoDesde: row.dtafoDesde,
                dtafoHasta: row.dtafoHasta,
                dtafoCantidadVisitas: row.dtafoCantidadVisitas
            });
        } else {
            _.remove(itemCopy.detalles, {
                dtafoIderegistro: row.dtafoIderegistro
            });
        }
        this.setState({ item: itemCopy });
    }

    getColumns() {
        const newColumns = [
            { name: 'Eliminar', cell: (row) => <a href="#" onClick={($event) => this.removeDetalle($event, row)}>Eliminar</a> }
        ];
        const columns = _.union(columnsDetalle, newColumns);
        return columns;
    }

    getDetalleCopy(): DetalleTipoAforoDTO {
        const detalleCopy: DetalleTipoAforoDTO = _.cloneDeep(this.state.detalle) as DetalleTipoAforoDTO;
        return detalleCopy;
    }
    getItemCopy(): TipoAforoDTO {
        const itemCopy: TipoAforoDTO = JSON.parse(JSON.stringify(this.state.item)) as TipoAforoDTO;
        return itemCopy;
    }
    handleChange(event) {
        const { value, name } = event.target;
        console.log(name, value);
        if (name == 'tafoAforoPadre') {
            let itemCopy = this.getItemCopy();
            _.set(itemCopy, name, !itemCopy.tafoAforoPadre);
            this.setState({ item: itemCopy });
        } else {
            let itemCopy = this.getItemCopy();
            _.set(itemCopy, name, value);
            this.setState({ item: itemCopy });
        }
    }
    handleChangeDetalle(event) {
        const { value, name } = event.target;
        let detalleCopy = this.getDetalleCopy();
        _.set(detalleCopy, name, value);
        this.setState({ detalle: detalleCopy });
    }

    render() {
        if (this.state?.effectivePermissions?.VIEW) {
            return (
                <Row className="small">
                    <Col md={12}>
                        <Form onSubmit={this.handleFormSubmit}>
                            <Row>
                                <Col>
                                    <FormTitle active={true} title="Tipo de aforo" onNew={this.handleNewItemClick} />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <div className="col-12 pt-2 justify-content-center align-self-center">
                                        <p className="text-left">Listado de detalles del tipo de aforo</p>
                                    </div>
                                    <Form.Row className="align-items-center">
                                        <Form.Group as={Col} controlId="tafoAforoPadre">
                                            <Form.Check onChange={this.handleChange} name="tafoAforoPadre" className="mb-2" checked={this.state.item?.tafoAforoPadre} type="checkbox" label="Requiere comparar con aforo anterior ?" />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row className="align-items-center">
                                        <Form.Group as={Col} controlId="codigo">
                                            <Form.Label>Codigo  {this.state.item?.tafoIderegistro ? '(editando)' : '(nuevo)'}</Form.Label>
                                            <InputGroup className="mb-2" size="sm">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text id="basic-addon1">
                                                        {this.state.item?.tafoIderegistro ? <MdEdit size="1.5em" /> : <MdFiberNew size="1.5em" />}
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
                                            <Form.Control required onChange={this.handleChange} name="unidad.uniPropiedad.estado" className="mb-2" size="sm" as="select" value={this.state.item?.unidad.uniPropiedad?.estado} >
                                                <option value="A">Activo</option>
                                                <option value="I">Inactivo</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row className="align-items-center row-cols-3">
                                        <Form.Group as={Col}>
                                            <Form.Label>
                                                Clase Aforo
                                            </Form.Label>
                                            <Form.Control as="select" required onChange={this.handleChange} name="uniClaseaforo" className="mb-2" size="sm" value={this.state.item?.uniClaseaforo} >
                                                <option value={undefined}>Seleccionar clase de aforo</option>
                                                {this.state.clasesAforo}
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>
                                                Factor produccion
                                            </Form.Label>
                                            <Form.Control required onChange={this.handleChange} name="tafoFactorProduccion" className="mb-2" size="sm" value={this.state.item?.tafoFactorProduccion} />
                                        </Form.Group>                                        
                                        <Form.Group as={Col}>
                                            <Form.Label>
                                                Vigencia(dias).
                                            </Form.Label>
                                            <Form.Control type="number" min="1"  required onChange={this.handleChange} name="tafoVigencia" className="mb-2" size="sm" value={this.state.item?.tafoVigencia} />
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>
                                                Plazo ejecucion(dias).
                                            </Form.Label>
                                            <Form.Control type="number" required onChange={this.handleChange} name="tafoPlazoMaximo" className="mb-2" size="sm" value={this.state.item?.tafoPlazoMaximo} />
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>
                                                Holgura(dias).
                                            </Form.Label>
                                            <Form.Control type="number" required onChange={this.handleChange} name="tafoHolgura" className="mb-2" size="sm" value={this.state.item?.tafoHolgura} />
                                        </Form.Group>
                                    </Form.Row>
                                </Col>
                                <Col md={6} className="bg-light">
                                    <div className="col-12 pt-2 justify-content-center align-self-center">
                                        <p className="text-left">Cantidad visitas según el volumen resultante</p>
                                    </div>
                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Label>
                                                (Vol.Desde)
                                            </Form.Label>
                                            <Form.Control step="0.01" type="number" onChange={this.handleChangeDetalle} name="dtafoDesde" className="mb-2" size="sm" value={this.state.detalle?.dtafoDesde} />
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>
                                                (Vol.Hasta)
                                            </Form.Label>
                                            <Form.Control step="0.01"  type="number" onChange={this.handleChangeDetalle} name="dtafoHasta" className="mb-2" size="sm" value={this.state.detalle?.dtafoHasta} />
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>
                                                Frecuencia
                                            </Form.Label>
                                            <Form.Control type="number" onChange={this.handleChangeDetalle} name="dtafoFrecuencia" className="mb-2" size="sm" value={this.state.detalle?.dtafoFrecuencia} />
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>
                                                Cant. Visitas Total
                                            </Form.Label>
                                            <InputGroup>
                                                <Form.Control type="number" onChange={this.handleChangeDetalle} name="dtafoCantidadVisitas" className="mb-2" size="sm" value={this.state.detalle?.dtafoCantidadVisitas} />
                                                <InputGroup.Append>
                                                    <Button onClick={($event) => this.addDetalle($event)} size="sm" className="mb-2" variant="outline-success"><MdAdd color="#534bae" /></Button>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <DataTable
                                            title="Detalles"
                                            columns={this.getColumns()}
                                            data={this.state.item?.detalles as any[]}
                                            pagination={false}
                                            highlightOnHover={true}
                                            //striped={true}
                                            dense={true}
                                            noHeader={true}
                                            fixedHeader={true}
                                            fixedHeaderScrollHeight="100px"
                                            conditionalRowStyles={conditionalRowStyles}
                                        />
                                    </Form.Row>
                                </Col>
                            </Row>
                            <Row className="pt-2">
                                <Col>
                                    <Form.Row className="align-items-center">
                                        <Col md={12} className="">
                                            <Button block size="sm" type="submit">Guardar</Button>
                                        </Col>
                                    </Form.Row>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                    <Col md={12} className="mt-2">
                        <h6 className="h6">Listado de Tipo de visitas de aforos</h6>
                        <DataTableComponent showFilter={true} prefixId='tip-afo' showSearch={true} expandableRowsComponent={<TableExpandedComponent />} page={this.state.page as Page} columns={this.columns} onUpdate={this.updateTable}>
                        </DataTableComponent>
                    </Col>
                </Row>
            );
        } else {
            return (
                <NoAutorizadoComponent />
            );
        }
    }

}
function TableExpandedComponent(props) {

    //const data = props.data?.detalles;
    const data = _.map(props.data?.detalles, function (x) {
        x.omit = true;
        return x
    });
    //const rows = props.data?.detalles?.map( (item)=> <tr><td>{item.dtafoDesde}</td><td>{item.dtafoHasta}</td><td>{item.dtafoCantidadVisitas}</td></tr>);
    return (
        <Row>
            <div className="col-12 pt-2 justify-content-center align-self-center">
                <p className="text-center">Listado de detalles del tipo de aforo</p>
            </div>
            <div className="col-md-12 d-flex justify-content-center align-self-center">
                <DataTable
                    title="Detalles"
                    columns={columnsDetalle}
                    data={data}
                    pagination={true}
                    highlightOnHover={true}
                    striped={true}
                    dense={true}
                    noHeader={true}
                    fixedHeader={true}
                    paginationPerPage={3}
                    paginationRowsPerPageOptions={[3, 5]}
                    fixedHeaderScrollHeight="100px"
                />
            </div>
        </Row>
    )
}
export default TipoAforoComponent;