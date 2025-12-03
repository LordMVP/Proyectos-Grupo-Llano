
import React from 'react';
import Page from '../../../models/dto/Pagination';
import { Row, Col, Form, Button } from 'react-bootstrap';
import FormTitle from '../../../components/utils/FormTitle/FormTitle';
import _ from 'lodash'
import ProyectosApi from '../../../api/homologaciones/ProyectosApi';
import ProyectoDTO from '../../../models/dto/ProyectoDTO';
import BarriosApi from '../../../api/homologaciones/BarriosApi';
import BarrioDTO from '../../../models/dto/BarrioDTO';
//import DataTableComponent from 'components/utils/DataTableComponent/DataTableComponent';
import RutaApi from '../../../api/homologaciones/RutaApi';
import UnidadesApi from '../../../api/homologaciones/UnidadesApi'
import SecSector from '../../../api/homologaciones/SecSector'
import MubaApi from '../../../api/homologaciones/MubaApi'
import MubaDTO from '../../../models/dto/MubaDTO';
import PARAMETROS from '../../../data/constantes';
import { toast } from 'react-toastify';
//import styles from './ParametrizacionBarrioComponent.css';
const ID_CLASE_MICRORUTA = 3016;
interface IParametrizacionBarrioComponentProps {
}

interface SParametrizacionBarrioComponentState {
    loading: boolean;
    page: Page | null;
    item?: MubaDTO | null;
    proyectos?: ProyectoDTO[];
    barrios?: BarrioDTO[];
    sectores?: any[];
    barriosHomllanogas?: BarrioDTO[];
    microRutas?: any[] | null;
    complementos?: any[] | null;
    selectedRutas?:any[];
    selectedFrecuencias?:any[];
}
const frecuencias = [
    { valor: 1, dia: "Lunes" },
    { valor: 2, dia: "Martes" },
    { valor: 3, dia: "Miercoles" },
    { valor: 4, dia: "Jueves" },
    { valor: 5, dia: "Viernes" },
    { valor: 6, dia: "Sabado" },
    { valor: 7, dia: "Domingo" }];
/*const columnsMicrorutas = [
    {
        name: 'Codigo',
        selector: 'uniTiporuta.uniCodigo',
    },
    {
        name: 'Nombre microruta',
        selector: 'rutNombre',
    }

];*/
class ParametrizacionBarrioComponent extends React.Component<IParametrizacionBarrioComponentProps, SParametrizacionBarrioComponentState>{
    //  private municipios: ProyectoDTO[] = [];
    //private barrios: BarrioDTO[] = [];
    private proyectosApi: ProyectosApi = new ProyectosApi();
    private barriosApi: BarriosApi = new BarriosApi();
    private rutasAPi = new RutaApi();
    private unidadApi = new UnidadesApi();
    private sectorApi = new SecSector();
    private mubaApi = new MubaApi();

    constructor(props: IParametrizacionBarrioComponentProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleNewItemClick = this.handleNewItemClick.bind(this);
        this.handleSelectedRowMicrorutas = this.handleSelectedRowMicrorutas.bind(this);
        this.isSelectedMicroruta = this.isSelectedMicroruta.bind(this);
        this.getItemCopy = this.getItemCopy.bind(this);
        this.onRutasChange = this.onRutasChange.bind(this);
        this.onFrecuenciasChange = this.onFrecuenciasChange.bind(this);
        let page: Page = { content: [] };
        this.state = { loading: false, page: page, item: { mubaIderegistro: null, dmubaActivo: {dmubaRutas: []} } };
    }
    componentDidMount() {
        this.loadProyectos();
        this.loadBarrios();
        this.loadMicrorutas();
        this.loadComplementos();
        this.loadSectores();
        this.loadBarriosLlanogas();
    }
    handleSelectedRowMicrorutas(state: any) {
        const itemCopy = JSON.parse(JSON.stringify(this.state.item));
        itemCopy.microrutas = state.selectedRows;
        const microrutasJson = itemCopy.microrutas.map((item) => { let object = { 'microRuta': item.rutIderegistro, 'nombre': item.rutNombre }; return object; });
        itemCopy.rutMicroruta = microrutasJson;
        this.setState({ item: itemCopy });
        console.log('Selected Rows: ', state.selectedRows);
    }
    isSelectedMicroruta(row: any) {
        const itemCopy = JSON.parse(JSON.stringify(this.state.item));
        console.log("Valide rows");
        return _.find(itemCopy.microrutas, { 'rutIderegistro': row.rutIderegistro }) != undefined;
    }

    async handleFormSubmit(event) {
        event.preventDefault();
        const response = await this.mubaApi.save(this.state.item as MubaDTO);
        toast(response);

    }
    handleNewItemClick() {

    }
    async handleChange(event) {        
        const { value, name } = event.target;
        let itemCopy: any = this.getItemCopy();     
        if(event.target.selectedOptions != undefined){            
            const selectedValues = Array.from(event.target.selectedOptions, (item:any) => item.value);
            if(event.target.multiple){
            _.set(itemCopy, name, selectedValues);
            }else {
                _.set(itemCopy, name, value);
            }
            if (name === "uniMunicipio" || name === "uniBarrio") {
                if (itemCopy.uniMunicipio != undefined && itemCopy.uniBarrio != undefined) {
                   try{
                    const response = await this.mubaApi.getByEmpresaMunicipioBarrio(itemCopy.uniMunicipio, itemCopy.uniBarrio);                    
                    if (response.status == 200) {
                        itemCopy = response.data;                                                
                    }
                   }catch(error){
                        toast("Sin coincidencias para municipio y barrio" + error);
                   }
                    
                }
            }
            this.setState({ item: itemCopy });
            console.log(itemCopy);
            return; 
        }
        _.set(itemCopy, name, value);
        this.setState({ item: itemCopy });
        console.log(itemCopy);
    }

    onRutasChange(inputValue, { action }) {
        console.log(inputValue,action);
        let itemCopy: any = this.getItemCopy();
        itemCopy.dmubaActivo.dmubaRutas = inputValue;
        this.setState({ item: itemCopy });
    }
    onFrecuenciasChange(inputValue, { action }) {
        console.log(inputValue,action);
        let itemCopy: any = this.getItemCopy();
        itemCopy.dmubaActivo.dmubaRutas = inputValue;
        this.setState({ item: itemCopy });
    }

    getItemCopy(): any {
        const itemCopy: any = JSON.parse(JSON.stringify(this.state.item))
        return itemCopy;
    }
    async loadProyectos() {
        const response = await this.proyectosApi.getPage(null);
        this.setState({ proyectos: response.data.content });
        //this.municipios = response.data.content;
    }
    async loadBarrios() {
        const response = await this.barriosApi.getPage({ sort: "barrioNom", page: -1, size: -1 });
        this.setState({ barrios: response.data.content });
        //this.municipios = response.data.content;
    }
    async loadMicrorutas() {
        const response = await this.rutasAPi.getPageByType(null, ID_CLASE_MICRORUTA);
        this.setState({
            microRutas: response.data.content
        });
    }

    async loadComplementos() {
        const response = await this.unidadApi.getByClass(41);
        this.setState({
            complementos: response.data.content
        });
    }
    async loadSectores() {
        const response = await this.sectorApi.getPage(null);
        this.setState({sectores: response.data.content});
    }

    async loadBarriosLlanogas() {
        const response = await this.barriosApi.getPageEmpresa({ sort: "barrioNom", page: -1, size: -1 }, PARAMETROS.PARAMETRIZACION_BARRIOS.EMPRESA_HOMOLOGACION_BARRIO);
        this.setState({ barriosHomllanogas: response.data.content });
    }

    render() {
        const municipiosOptions = this.state.proyectos?.map((item) => <option key={item.proyectoIderegistro as number} value={item.proyectoIderegistro as number}>{item.proyectoNom}</option>);
        const barriosOptions = this.state.barrios?.map((item) => <option key={item.barrioIderegistro as number} value={item.barrioIderegistro as number}>{item.barrioNom}</option>);
        const sectorOptions = this.state.sectores?.map((item) => <option key={item.secIderegistro as number} value={item.secIderegistro as number}>{item.secNombre}</option>);
        const barrioHomllanogasOptions = this.state.barriosHomllanogas?.map((item) => <option key={item.barrioIderegistro as number} value={item.barrioIderegistro as number}>{item.barrioNom}</option>);
        const microRutasOptions = this.state.microRutas?.map((item) => <option key={item.rutIderegistro as number} value={item.rutIderegistro}>{item.rutNombre}</option>);
        //const microRutasOptions = this.state.microRutas?.map((item) => { const obj = { 'rutIderegistro': item.rutIderegistro, 'rutNombre': item.rutNombre }; return obj; });
        const frecuenciasOptions = frecuencias?.map((item) => <option key={item.dia} value={item.dia}>{item.dia}</option>);
        const complementosOptions = this.state.complementos?.map((item) => <option key={item.uniIderegistro} value={item.uniIderegistro}>{item.uniNombre1}</option>);
        return (
            <Row className="small">
                <Col md={12}>
                    <Form onSubmit={this.handleFormSubmit}>
                        <Row>
                            <Col>
                                <FormTitle title="Parametrizacion de barrios" onNew={this.handleNewItemClick} />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Municipio</Form.Label>
                                        <Form.Control required onChange={this.handleChange} name="uniMunicipio" className="mb-2" size="sm" as="select" value={this.state.item?.uniMunicipio}>
                                            <option value={undefined}>Seleccione el municipio</option>
                                            {municipiosOptions}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Barrio</Form.Label>
                                        <Form.Control required onChange={this.handleChange} name="uniBarrio" className="mb-2" size="sm" as="select" value={this.state.item?.uniBarrio}>
                                            <option value={undefined}>Seleccione el barrio</option>
                                            {barriosOptions}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Codigo</Form.Label>
                                        <Form.Control required onChange={this.handleChange} name="dmuba.dmubaCodigo" className="mb-2" size="sm" value={this.state.item?.dmubaActivo?.dmubaCodigo}>

                                        </Form.Control>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Sector</Form.Label>
                                        <Form.Control required onChange={this.handleChange} name="mubaSector" className="mb-2" size="sm" as="select" value={this.state.item?.mubaSector}>
                                            <option>Seleccione el sector</option>
                                            {sectorOptions}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Barrio Homologacion llanogas</Form.Label>
                                        <Form.Control required onChange={this.handleChange} name="dmubaActivo.barrioHomllanogas" className="mb-2" size="sm" as="select" value={this.state.item?.dmubaActivo?.barrioHomllanogas}>
                                            <option>Seleccione el barrio de homologacion</option>
                                            {barrioHomllanogasOptions}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Factor</Form.Label>
                                        <Form.Control required onChange={this.handleChange} name="mubaFactor" className="mb-2" size="sm" value={this.state.item?.mubaFactor} >

                                        </Form.Control>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} >
                                        <Form.Label>Microrutas</Form.Label>
                                        <Form.Control multiple required onChange={this.handleChange} name="dmubaActivo.dmubaRutas" className="mb-2" size="sm" as="select" value={this.state.item?.dmubaActivo?.dmubaRutas}>
                                            {microRutasOptions}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group as={Col} >
                                        <Form.Label>Frecuencias</Form.Label>
                                        <Form.Control multiple required onChange={this.handleChange} name="dmubaActivo.dmubaFrecuenciasBarrido" className="mb-2" size="sm" as="select" value={this.state.item?.dmubaActivo?.dmubaFrecuenciasBarrido}>
                                            {frecuenciasOptions}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Complementos</Form.Label>
                                        <Form.Control multiple required onChange={this.handleChange} name="complementos" className="mb-2" size="sm" as="select" value={this.state.item?.complementos}>
                                            {complementosOptions}
                                        </Form.Control>
                                    </Form.Group>
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
            </Row>
        );
    }

}
export default ParametrizacionBarrioComponent;