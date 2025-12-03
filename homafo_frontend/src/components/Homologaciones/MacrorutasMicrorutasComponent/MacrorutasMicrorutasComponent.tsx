import React from 'react';
import { Row, Col, Form, InputGroup, Modal } from 'react-bootstrap';
import { Button } from 'antd';
import Page, { PageableRequest } from '../../../models/dto/Pagination';
import DataTableComponent from '../../../components/utils/DataTableComponent/DataTableComponent';
import DataTable from 'react-data-table-component';
import _ from 'lodash'
import MacrorutasApi from '../../../api/homologaciones/MacrorutasApi';
import FormTitle from '../../../components/utils/FormTitle/FormTitle';
import RutaApi from '../../../api/homologaciones/RutaApi';
import MacrorutaDTO, { HorarioDTO } from 'models/dto/MacrotutaDTO';
import { MdAdd } from 'react-icons/md';
import AreaPrestacionApi from '../../../api/homologaciones/AreaPrestacionApi';
import { toast } from 'react-toastify';
import UtilsFunction from '../../utils/UtilsFunction';
import PermisoProgramaDto from '../../../models/dto/PermisoProgramaDto';
import EffectivePermisions from '../../../models/dto/EffectivePermission';
import NoAutorizadoComponent from '../../utils/SeccionNoAutorizadaComponent/NoAutorizadoComponent';
import PARAMETROS from '../../../data/constantes';
import BarriosApi from '../../../api/homologaciones/BarriosApi';

const barrioApi = new BarriosApi();
interface IMacrorutasMicrorutasComponentProps {
    permissions: PermisoProgramaDto[]
}

interface SMacrorutasMicrorutasComponentState {
    loading: boolean;
    page: Page | null;
    item: MacrorutaDTO | null;
    pageMicrorutas?: Page | null;
    effectivePermissions?: EffectivePermisions;
    loadingTable: boolean;
    clearSelectedRows?: boolean;
    showModal: boolean;
    barrios: any[];
    selectedRow: any;
    horario: HorarioDTO;
    itemC: MacrorutaDTO;
}

const columnsHorarios = [
    {
        name: 'Dia',
        selector: 'hrrDia',
    },
    {
        name: 'Hor. Inicio',
        selector: 'hrrHorinicio',
    },
    {
        name: 'Hor. Final',
        selector: 'hrrHorfin'
    }
];



const defaultItem: MacrorutaDTO = {
    rureIderegistro: null,
    arprIderegistro: null,
    rutIdemacruta: null,
    horarios: [],
    microrutas: [],
    rutMicroruta: []
}
const defaultHorario: HorarioDTO = {
    hrrIderegistro: null,
    hrrDia: undefined,
    rureIderegistro: undefined,
    hrrHorfin: undefined,
    hrrHorinicio: undefined,
    hrrSwtact: 'A',
    microruta: undefined
}

const columnsMicrorutas = [
    {
        name: 'Codigo',
        selector: 'uniTiporuta.uniCodigo',
    },
    {
        name: 'Nombre microruta',
        selector: 'rutNombre',
    }
];

class MacrorutasMicrorutasComponent extends React.Component<IMacrorutasMicrorutasComponentProps, SMacrorutasMicrorutasComponentState>{

    private columns = [
        {
            name: 'Nombre',
            selector: 'rutIdemacruta.rutNombre'
        },
        {
            name: 'Area prestacion',
            selector: 'arprNombre'
        },
        {
            name: 'Opciones',
            cell: (row) => (
                <div style={{ display: 'flex', gap: '5px' }}>
                    <Button onClick={() => this.selectRow(row)} type="primary" size="small">
                        Editar
                    </Button>
                    <Button 
                        onClick={() => this.expandRowByButton(row)} 
                        type="default" 
                        size="small"
                    >
                        Ver microrutas
                    </Button>
                </div>
            ),
        }
    ];
    private macrorutasAPi = new MacrorutasApi();
    private rutasAPi = new RutaApi();
    private areaPrestacionApi = new AreaPrestacionApi();
    private macroRutas: any[] = [];
    private areasPrestacion: any[] = [];
    //private barrios: any[] = [];

    constructor(props: IMacrorutasMicrorutasComponentProps) {
        super(props);
        this.handleNewItemClick = this.handleNewItemClick.bind(this);
        this.handleSelectedRowMicrorutas = this.handleSelectedRowMicrorutas.bind(this);
        this.updateTable = this.updateTable.bind(this);
        this.updateTableMicrorutas = this.updateTableMicrorutas.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeHorario = this.handleChangeHorario.bind(this);
        this.isSelectedMicroruta = this.isSelectedMicroruta.bind(this);
        this.getHorarioCopy = this.getHorarioCopy.bind(this);
        this.getItemCopy = this.getItemCopy.bind(this);
        this.agregarHorario = this.agregarHorario.bind(this);
        this.getColumnsMicroRutas = this.getColumnsMicroRutas.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.expandRowByButton = this.expandRowByButton.bind(this);
        let page: Page = { content: [] };
        this.state = { 
            barrios: [], 
            showModal: false, 
            clearSelectedRows: false, 
            loadingTable: false, 
            loading: false, 
            page: page, 
            item: defaultItem, 
            horario: defaultHorario, 
            selectedRow: null,
            itemC: defaultItem
        };
    }
    getColumnsMicroRutas() {
        const newColumns = [
            { name: 'Ver Barrios', cell: (row) => <a href="#" onClick={() => this.verBarrios(row)}>Ver barrios</a> },
            { name: 'Editar Horarios', cell: (row) => <Button onClick={() => this.handleSelectedRowMicrorutas(row)} type="primary" size="small" disabled={this.state.selectedRow == row}>Editar</Button> }
        ];
        const columns = _.union(columnsMicrorutas, newColumns);
        return columns;
    }
    async verBarrios(row) {
        const barrios = await barrioApi.getListByMicroRuta(row.rutIderegistro);
        this.setState({ showModal: true, barrios: barrios.data });
    }
    
    handleClose() {
        this.setState({ showModal: false })
    }

    expandRowByButton(row: MacrorutaDTO) {
        // Buscar y hacer clic en el botón de expandir de esta fila
        setTimeout(() => {
            const expandButton = document.querySelector(`[data-row-id="${row.rureIderegistro}"] button[data-testid^="expander-button"]`) as HTMLElement;
            if (expandButton) {
                expandButton.click();
            } else {
                // Fallback: buscar todos los botones de expandir y usar el índice
                const allExpandButtons = document.querySelectorAll('button[data-testid^="expander-button"]');
                if (allExpandButtons.length > 0) {
                    // Intentar encontrar el botón correspondiente por contexto
                    const targetButton = Array.from(allExpandButtons).find(btn => {
                        const row_elem = btn.closest('[role="row"]');
                        return row_elem && row_elem.textContent?.includes(row.rutIdemacruta?.rutNombre || '');
                    }) as HTMLElement;
                    if (targetButton) {
                        targetButton.click();
                    }
                }
            }
        }, 100);
    }

    handleNewItemClick() {
        this.setState({ item: defaultItem, clearSelectedRows: !this.state.clearSelectedRows });
        //this.textInput.current.focus();
    }
    updatePemissions() {
        const effectivePermission = UtilsFunction.getEffectivePermissions(this.props.permissions, 'PARAMETRIZACION_GENERAL.PARAMETRIZACION_MACRORUTAS');
        this.setState({ effectivePermissions: effectivePermission });
    }
    componentDidUpdate(prevProps) {
        if (prevProps.permissions !== this.props.permissions) {
            this.updatePemissions();
        }
    }
    async componentDidMount() {
        this.loadMacroRutas();
        this.loadAreaPrestacion();
        this.updatePemissions();
    }

    async loadMacroRutas() {
        const response = await this.rutasAPi.getPageByType(null, PARAMETROS.CLASES_RUTAS.ID_CLASE_MACRORUTA);
        this.macroRutas = response.data.content;
    }
    async loadAreaPrestacion() {
        const response = await this.areaPrestacionApi.getPage(null);
        this.areasPrestacion = response.data.content;
    }

    async loadMacroruta(id: number) {
        const response = await this.macrorutasAPi.getByMacroruta(id);
        this.setState({ itemC: response.data });
        this.selectRow(response.data);
    }

    handleFormSubmit = (event: any) => {
        event.preventDefault();
        if (this.state.item?.rutIdemacruta == undefined) {
            toast.error("Debe seleccionar una macroruta");
            return;
        }
        if (this.state.item?.arprIderegistro == undefined) {
            toast.error("Debe seleccionar el area de prestacion.");
            return;
        }

        this.macrorutasAPi.save(this.state.item as MacrorutaDTO).then(() => {
            toast.success("Parametrizacion guardada con exito");
            this.updateTable(PARAMETROS.DEFAULT_PAGEABLE);
        }).catch(error => {
            toast.error("Se presento un error al guardar" + error);
        });

    }

    handleSelectedRowMicrorutas(state: any) {
        //debugger;
        let itemCopy = this.getItemCopy();
        let itemCopyC = this.getItemsCopyC();
        const itemOriginal = itemCopyC?.horarios?.filter(item => item.rureIderegistro == itemCopy.rureIderegistro);

        if (itemCopy.rutIdemacruta == null) {
            toast.error("Debe seleccionar una macroruta");
            return;
        }
        if (itemCopy.arprIderegistro == null) {
            toast.error("Debe seleccionar un area de prestacion");
            return;
        }
        this.setState({ selectedRow: state });
        let microrutasJson = [{ 'microRuta': state.rutIderegistro, 'nombre': state.rutNombre, 'codigo': state.rutCodigo }];
    
        //Filtrar HOrarios por Microruta
        
        itemCopy.rutMicroruta = microrutasJson;
        itemCopy.horarios = itemOriginal?.filter(item => item.microruta == state.rutIderegistro);
        //itemCopy.horarios = horarios;
        this.setState({ item: itemCopy });
    }
    isSelectedMicroruta(row: any) {
        const itemCopy = JSON.parse(JSON.stringify(this.state.item));
        return _.find(itemCopy.microrutas, { 'rutIderegistro': row.rutIderegistro }) != undefined;
    }
    selectRow = (row: MacrorutaDTO) => {
        this.setState({ item: row, loading: true });
        this.updateTableMicrorutas({ page: 0, size: 5 });
    }
    async updateTableMicrorutas(pageable: PageableRequest) {
        const response = await this.rutasAPi.getPageByType(pageable, PARAMETROS.CLASES_RUTAS.ID_CLASE_MICRORUTA);
        this.setState({
            loading: false,
            pageMicrorutas: response.data
        });
    }
    async updateTable(pageable: PageableRequest) {
        /* if(this.state.loadingTable){
             this.macrorutasAPi.source.cancel();            
         }*/
        const copy = this.getItemCopy();
        const search = copy.rutIdemacruta?.rutNombre ? copy.rutIdemacruta?.rutNombre : undefined;
        this.setState({ loading: true, loadingTable: true });
        const pageableWithSearch = { ...pageable, search: search?.toString() };
        const response = await this.macrorutasAPi.getPage(search === undefined ? pageable : pageableWithSearch);
        this.setState({
            loading: false,
            loadingTable: false,
            page: response.data,
            itemC: response.data?.content[0]
        });
        const itemCopy = this.getItemCopy();
        console.log(itemCopy);
    }
    renderHorarios(row: any) {
        const valor = row.horarios.map(horario => horario.hrrDia + '-');
        return (valor);
    }
    agregarHorario(event: any) {
        debugger;
        event.preventDefault();
        
        const newHorario = this.getHorarioCopy();
        if (this.state.item?.rutIdemacruta?.rutIderegistro == null) {
            toast.warning("Debe seleccionar una macroruta");
            return;
        }
        if (newHorario.hrrDia == undefined || newHorario.hrrHorinicio == undefined || newHorario.hrrHorfin == undefined) {
            toast.warning("Datos no validos, para el horario");
            return;
        }
        const itemCopy = this.getItemCopy();

        const find = itemCopy.horarios
            .find(detalle =>
            (
                detalle.hrrDia == newHorario.hrrDia
                && detalle.hrrHorinicio == newHorario.hrrHorinicio
                && detalle.hrrHorfin == newHorario.hrrHorfin
            )
            );
        if (find) {
            toast.warning('Ya existe un registro con los datos')
            return;
        };
        newHorario.hrrIderegistro = null;
        newHorario.microruta = this.state.selectedRow.rutIderegistro;
        itemCopy.horarios.unshift(newHorario);
        this.setState({ item: itemCopy });
        toast.success('Horario agregado');

    }
    removerHorario(event: any, row: any) {
        event.preventDefault();
        let itemCopy = this.getItemCopy();
        if (row.hrrIderegistro == null) {
            _.remove(itemCopy.horarios, {
                hrrDia: row.hrrDia,
                hrrHorinicio: row.hrrHorinicio,
                hrrHorfin: row.hrrHorfin
            });
        } else {
            _.remove(itemCopy.horarios, {
                hrrIderegistro: row.hrrIderegistro
            });
        }
        this.setState({ item: itemCopy });
        //Remover horario a itemc
        const itemCopyC = this.getItemsCopyC();
        const horarios = itemCopyC.horarios;
        _.remove(horarios, {
            hrrIderegistro: row.hrrIderegistro
        });
        this.setState({ itemC: itemCopyC });
        toast.success('Horario eliminado');
    }
    handleChange(event) {
        const { value, name } = event.target;
        if (name === "rutIdemacruta.rutIderegistro") {
            this.loadMacroruta(value);

        } else {
            let itemCopy: MacrorutaDTO = this.getItemCopy();
            _.set(itemCopy, name, value);
            this.setState({ item: itemCopy });
        }
    }
    handleChangeHorario(event) {
        const { value, name } = event.target;
        const microRuta = this.state.selectedRow;
        let itemCopy: HorarioDTO = this.getHorarioCopy();
        _.set(itemCopy, name, value);
        itemCopy.microruta = microRuta.rutIderegistro;
        this.setState({ horario: itemCopy });
    }
    getColumnsHorarios() {
        const newColumns = [
            { name: 'Eliminar', cell: (row) => <a href="#" onClick={($event) => this.removerHorario($event, row)}>Eliminar</a> }
        ];
        const columns = _.union(columnsHorarios, newColumns);
        return columns;
    }

    getItemCopy(): MacrorutaDTO {
        const itemCopy: MacrorutaDTO = JSON.parse(JSON.stringify(this.state.item))
        return itemCopy;
    }
    getItemsCopyC(): MacrorutaDTO {
        const itemCopy: MacrorutaDTO = JSON.parse(JSON.stringify(this.state.itemC))
        return itemCopy;
    }
    getHorarioCopy(): HorarioDTO {
        const detalleCopy: HorarioDTO = JSON.parse(JSON.stringify(this.state.horario))
        return detalleCopy;
    }

    render() {
        const macrorutasOption = this.macroRutas.map((item) => <option key={item.rutIderegistro as number} value={item.rutIderegistro as number}>{item.rutNombre}</option>);
        const areasPrestacionOption = this.areasPrestacion.map((item) => <option key={item.arprIderegistro as number} value={item.arprIderegistro as number}>{item.arprNombre}</option>);
        const media = this.state.barrios.length / 2;
        const part1 = this.state.barrios.slice(0, media);
        const part2 = this.state.barrios.slice(media, this.state.barrios.length);
        const barriosList1 = part1.map((barrio) => <li>{barrio.barrioNom}</li>);
        const barriosList2 = part2.map((barrio) => <li>{barrio.barrioNom}</li>);
        if (this.state?.effectivePermissions?.VIEW) {
            return (
                <Row className="small">
                    <Modal show={this.state.showModal} onHide={this.handleClose} backdrop="static" keyboard={false}>
                        <Modal.Header closeButton>
                            <Modal.Title>Listado de barrios asociados.</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row">
                                <div className="col-6">
                                    <ul>
                                        {barriosList1}
                                    </ul>
                                </div>
                                <div className="col-6">
                                    <ul>
                                        {barriosList2}
                                    </ul>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                    <Col md={12}>
                        <Form onSubmit={this.handleFormSubmit}>
                            <Row>
                                <Col>
                                    <FormTitle active={true} title="Parametrizacion Macrorutas" onNew={this.handleNewItemClick} />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <Form.Row>
                                        <Form.Group as={Col} md={6}>
                                            <Form.Label>Macro ruta</Form.Label>
                                            <Form.Control
                                                required
                                                onChange={this.handleChange}
                                                name="rutIdemacruta.rutIderegistro"
                                                className="mb-2"
                                                size="sm"
                                                as="select"
                                                value={this.state.item?.rutIdemacruta?.rutIderegistro ? this.state.item?.rutIdemacruta?.rutIderegistro : ''}
                                            >
                                                <option value="">Seleccione la macroruta</option>
                                                {macrorutasOption}
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group as={Col} md={6}>
                                            <Form.Label>Area de prestacion</Form.Label>
                                            <Form.Control
                                                required
                                                onChange={this.handleChange}
                                                name="arprIderegistro"
                                                className="mb-2"
                                                size="sm"
                                                as="select"
                                                value={this.state.item?.arprIderegistro ? this.state.item?.arprIderegistro : ''}
                                            >
                                                <option value="">Seleccione area de prestacion</option>
                                                {areasPrestacionOption}
                                            </Form.Control>
                                        </Form.Group>
                                    </Form.Row>
                                </Col>
                            </Row>
                            <Row>
                                {
                                    this.state.item?.rutIdemacruta && this.state.item?.arprIderegistro ? (
                                        <Col md={6}>

                                            <div className="col-12 pt-2 justify-content-center align-self-center">
                                                <p className="text-left">Micro rutas seleccionadas</p>
                                            </div>
                                            <DataTableComponent showSearch={true} clearSelectedRows={this.state.clearSelectedRows} selectableRowSelected={this.isSelectedMicroruta} onSelectedRowsChange={this.handleSelectedRowMicrorutas} selectableRows={false} page={this.state.pageMicrorutas as Page} columns={this.getColumnsMicroRutas()} onUpdate={this.updateTableMicrorutas} ></DataTableComponent>
                                        </Col>
                                    ) :
                                        <Col md={12}>

                                            <div className="alert alert-info text-center" role="alert">
                                                <p className='h6'>Seleccione una macroruta y un area de prestacion para terminar de parametrizar las micro rutas</p>
                                            </div>
                                        </Col>
                                }
                                {
                                    this.state.selectedRow?.rutIderegistro != null && this.state.selectedRow?.rutIderegistro !== undefined &&
                                    (
                                        <Col md={6}>
                                            <Form.Row>
                                                <Form.Group as={Col} md={4}>
                                                    <Form.Label>Dia de la semana</Form.Label>
                                                    <Form.Control as='select' onChange={this.handleChangeHorario} name="hrrDia" className="mb-2" size="sm" value={this.state.horario?.hrrDia}>
                                                        <option value="">Seleccionar dia</option>
                                                        <option value="Lunes">Lunes</option>
                                                        <option value="Martes">Martes</option>
                                                        <option value="Miercoles">Miercoles</option>
                                                        <option value="Jueves">Jueves</option>
                                                        <option value="Viernes">Viernes</option>
                                                        <option value="Sabado">Sabado</option>
                                                        <option value="Domingo">Domingo</option>
                                                    </Form.Control>
                                                </Form.Group>
                                                <Form.Group as={Col} md={3}>
                                                    <Form.Label>Hr. Inicio</Form.Label>
                                                    <Form.Control type="time" onChange={this.handleChangeHorario} name="hrrHorinicio" className="mb-2" size="sm" value={this.state.horario?.hrrHorinicio}></Form.Control>
                                                </Form.Group>
                                                <Form.Group as={Col} md={3}>
                                                    <Form.Label>Hr. Fin</Form.Label>
                                                    <InputGroup>
                                                        <Form.Control type="time" onChange={this.handleChangeHorario} name="hrrHorfin" className="mb-2" size="sm" value={this.state.horario?.hrrHorfin}></Form.Control>
                                                    </InputGroup>
                                                </Form.Group>
                                                <Form.Group as={Col} md={2} className="align-self-center mt-3">
                                                            <Button
                                                                onClick={($event) => this.agregarHorario($event)}
                                                                size="middle"
                                                                className="ml-2"
                                                                type="primary"
                                                                icon={<MdAdd />}
                                                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
                                                            >
                                                                Agregar
                                                            </Button>
                                                </Form.Group>
                                            </Form.Row>
                                            <Form.Row>
                                                <p className="text-center">Listado de horarios</p>
                                                <DataTable
                                                    title="Detalles"
                                                    columns={this.getColumnsHorarios()}
                                                    data={this.state.item?.horarios as any}
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
                                            </Form.Row>
                                        </Col>
                                    )
                                }
                            </Row>
                            {
                                this.state.item?.rutIdemacruta && this.state.item?.arprIderegistro && (
                                    <Row className="pb-2">
                                        <Col>
                                            <Form.Row className="align-items-center">
                                                <Col md={12} className="">
                                                    <Button block size="middle" type="primary" disabled={!this.state.selectedRow} onClick={this.handleFormSubmit}
                                                    >Guardar</Button>
                                                </Col>
                                            </Form.Row>
                                        </Col>
                                    </Row>
                                )
                            }
                        </Form>
                    </Col>
                    <Row className="mt-2">
                        <Col md={12} className="mt-2">
                            <h6 className="ml-3">Listado de macrorutas parametrizadas</h6>
                        </Col>
                    </Row>
                    <Col md={12} className="mt-2">
                        <DataTableComponent showSearch={true} expandableRowsComponent={<TableExpandedComponent />} page={this.state.page as Page} columns={this.columns} onUpdate={this.updateTable}>
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
    const dataMicrorutas = props.data?.microrutas || [];
    const allHorarios = props.data?.horarios || [];
    
    // Estado para la microruta seleccionada
    const [selectedMicroruta, setSelectedMicroruta] = React.useState<any>(null);
    
    // Agrupar horarios por microruta
    const horariosGrouped = _.groupBy(allHorarios, 'microruta');
    
    // Crear columnas mejoradas para microrutas con selección - distribuidas
    const columnsMicrorutasExpanded = [
        {
            name: 'Código',
            selector: 'uniTiporuta.uniCodigo',
            width: '15%',
            wrap: true,
            center: true
        },
        {
            name: 'Nombre Microruta',
            selector: 'rutNombre',
            width: '65%',
            wrap: true
        },
        {
            name: 'Horarios',
            cell: (row: any) => {
                const count = horariosGrouped[row.rutIderegistro]?.length || 0;
                return (
                    <span className="badge badge-info">
                        {count} horario{count !== 1 ? 's' : ''}
                    </span>
                );
            },
            width: '20%',
            center: true
        }
    ];
    
    // Crear columnas mejoradas para horarios - distribuidas
    const columnsHorariosExpanded = [
        {
            name: 'Día',
            selector: 'hrrDia',
            width: '35%',
            center: true
        },
        {
            name: 'Inicio',
            selector: 'hrrHorinicio',
            width: '32%',
            center: true
        },
        {
            name: 'Fin',
            selector: 'hrrHorfin',
            width: '33%',
            center: true
        }
    ];

    // Obtener horarios de la microruta seleccionada
    const horariosSeleccionados = selectedMicroruta 
        ? horariosGrouped[selectedMicroruta.rutIderegistro] || []
        : [];

    // Función para manejar la selección de microruta
    const handleMicrorutaClick = (row: any) => {
        setSelectedMicroruta(row);
    };

    return (
        <Row className="p-3">
            <Col md={12}>
                <Row className="mb-3">
                    <Col md={12}>
                        <h5 className="text-center mb-1">
                            <span role="img" aria-label="clipboard">📋</span> Información Detallada de Macroruta
                        </h5>
                    </Col>
                </Row>
                
                <Row>
                    {/* Tabla de Microrutas */}
                    <Col md={7}>
                        <div className="border rounded p-2">
                            <div className="text-center mb-1">
                                <h6 className="font-weight-bold mb-1">
                                    <span role="img" aria-label="map">🗺️</span> Microrutas Asociadas
                                </h6>
                            </div>
                            <DataTable
                                columns={columnsMicrorutasExpanded}
                                data={dataMicrorutas}
                                pagination={true}
                                highlightOnHover={true}
                                striped={true}
                                dense={true}
                                noHeader={true}
                                fixedHeader={true}
                                paginationPerPage={6}
                                paginationRowsPerPageOptions={[6, 12]}
                                fixedHeaderScrollHeight="300px"
                                onRowClicked={handleMicrorutaClick}
                                pointerOnHover={true}
                                conditionalRowStyles={[
                                    {
                                        when: (row: any) => selectedMicroruta?.rutIderegistro === row.rutIderegistro,
                                        style: {
                                            backgroundColor: '#e3f2fd',
                                            fontWeight: 'bold',
                                        },
                                    }
                                ]}
                            />
                        </div>
                    </Col>
                    
                    {/* Tabla de Horarios - más angosta */}
                    <Col md={5}>
                        <div className="border rounded p-2">
                            <div className="text-center mb-1">
                                <h6 className="font-weight-bold mb-1">
                                    <span role="img" aria-label="clock">🕐</span> Horarios
                                </h6>
                            </div>
                            {!selectedMicroruta ? (
                                <div className="text-center text-muted p-4">
                                    <div className="mb-3">
                                        <span role="img" aria-label="pointer" style={{fontSize: '2rem'}}>👆</span>
                                    </div>
                                    <p>Selecciona una microruta para ver sus horarios</p>
                                </div>
                            ) : horariosSeleccionados.length > 0 ? (
                                <DataTable
                                    columns={columnsHorariosExpanded}
                                    data={horariosSeleccionados}
                                    pagination={true}
                                    highlightOnHover={true}
                                    striped={true}
                                    dense={true}
                                    noHeader={true}
                                    fixedHeader={true}
                                    paginationPerPage={8}
                                    paginationRowsPerPageOptions={[8, 15]}
                                    fixedHeaderScrollHeight="300px"
                                />
                            ) : (
                                <div className="text-center text-muted p-4">
                                    <div className="mb-3">
                                        <span role="img" aria-label="empty" style={{fontSize: '2rem'}}>📅</span>
                                    </div>
                                    <p>Esta microruta no tiene horarios configurados</p>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}
export default MacrorutasMicrorutasComponent;