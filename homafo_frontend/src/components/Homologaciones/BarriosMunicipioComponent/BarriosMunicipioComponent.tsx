import React, { Fragment, FunctionComponent, useEffect, useState } from 'react';
//import { AutoComplete, Button, Card, Form, Select, Tabs, Input, Steps } from 'antd';
import 'antd/dist/antd.compact.css';
import { AutoComplete, Card, InputNumber, Result, Spin, Tabs } from 'antd';
import { Form, Input, Button } from 'antd';
import Select from 'antd/lib/select';
import ProyectosApi from '../../../api/homologaciones/ProyectosApi';
import BarriosApi from '../../../api/homologaciones/BarriosApi';
import PARAMETROS from '../../../data/constantes';
import SecSector from '../../../api/homologaciones/SecSector';
import MubaApi from '../../../api/homologaciones/MubaApi';
import RutaApi from '../../../api/homologaciones/RutaApi';
import UnidadesApi from '../../../api/homologaciones/UnidadesApi';
import MubaDTOFull from '../../../models/dto/MubaDTO';
import UtilsFunction from '../../utils/UtilsFunction';
import EffectivePermisions from '../../../models/dto/EffectivePermission';
import NoAutorizadoComponent from '../../utils/SeccionNoAutorizadaComponent/NoAutorizadoComponent';
import Page, { PageableRequest } from '../../../models/dto/Pagination';
import DataTableComponent from '../../utils/DataTableComponent/DataTableComponent';
import { getSesionInfo } from '../../../utils/Utils';


const proyectosApi: ProyectosApi = new ProyectosApi();
const barriosApi: BarriosApi = new BarriosApi();
const sectoresApi: SecSector = new SecSector();
const mubaApi: MubaApi = new MubaApi();
const rutasAPi: RutaApi = new RutaApi();
const unidadApi: UnidadesApi = new UnidadesApi();

type OptionType = { label: string, value: any };

const layout = {
    labelCol: { span: 4 }
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const { TabPane } = Tabs;


function BarriosMunicipioComponent(props) {
    const [step, setStep] = useState('0');
    const [data, setData] = useState<any>({});
    const [result, setResult] = useState<any>();
    const [isInit, setInit] = useState<boolean>(true);
    const [loading, setLoading] = useState(false);
    const [effectivePermissions, setPermissions] = useState<EffectivePermisions>();

    useEffect(() => {
        const effectivePermission = UtilsFunction.getEffectivePermissions(props.permissions, 'PARAMETRIZACION_GENERAL.PARAMETRIZACION_BARRIOS');
        setPermissions(effectivePermission);
    }, [props.permissions]);
    const handleChange = (newStep) => {
        setStep(newStep);
    }

    const onFinish = (values, step) => {
        console.log(values);
        setData(values);
        handleChange((step + 1) + '');
    }

    const onNew = () =>{        
        setData({});
        setResult({});
        setInit(true);
        handleChange('1');
    }
    const edit = (values) =>{        
        onFinish(values,1);
    }
    const sendData = (values) => {
        handleChange('3');
        setLoading(true);
        mubaApi.save(values as MubaDTOFull).then(response => {
            setResult(response.data);
            setLoading(false);            
        });
    }
    const init = () => {
        setData({});
        setResult({});
        setInit(true);
        handleChange('0');
    }

    if (effectivePermissions?.VIEW) {
        return (
            <Fragment>
                <Tabs activeKey={step} onChange={handleChange}>
                    <TabPane forceRender={false} tab="Listado" key="0">
                        <ListMunicipioBarrio onNew={onNew} onSelect={edit}></ListMunicipioBarrio>
                    </TabPane>
                    <TabPane disabled forceRender={false} tab="Seleccion" key="1">
                        <MunicipioBarrioForm init={isInit} onFinish={onFinish}></MunicipioBarrioForm>
                    </TabPane>
                    <TabPane disabled forceRender={false} tab="Parametrizacion" key="2">
                        <ParametrizacionMunicipioBarrio onCancel={init} data={data} onFinish={sendData}></ParametrizacionMunicipioBarrio>
                    </TabPane>
                    <TabPane disabled  forceRender={false} tab="Resultado" key="3">
                        <Spin tip="Cargando..." spinning={loading}>
                            <ResultadoPanel status={result?.result} title='Resultado' onClick={init} message={result?.message} >
                            </ResultadoPanel>
                        </Spin>
                    </TabPane>
                </Tabs>
            </Fragment>
        )
    } else {
        return (
            <NoAutorizadoComponent />
        );
    }
}


function MunicipioBarrioForm(props) {
    // const [proyectos, setProyectos] = useState<any>([]);
    const [options, setOptions] = useState<any>([]);
    const [barriosOptions, setBarriosOptions] = useState([]);
    const [barrio, setBarrio] = useState<OptionType>();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (props.isInit) {
            setBarrio(undefined);
            form.resetFields();
        }
        console.log("Cargando");    
        setBarriosOptions([]);
        form.resetFields();
        setBarrio(undefined);
        setLoading(true);
        proyectosApi.getPage(null).then(response => {
            const optionsTmp = response.data.content.map((proyecto) => { return { 'value': proyecto.proyectoIderegistro, 'label': proyecto.proyectoNom } });
            setOptions(optionsTmp)
            setLoading(false);
        });
    }, [props]);

    const handleSearchBarrio = (value) => {
        barriosApi.getPageSearch(PARAMETROS.DEFAULT_PAGEABLE, value).then(response => {
            const tmp = response.data.content.map((barrio) => { return { 'label': barrio.barrioNom, 'key': barrio.barrioNom, 'value': barrio.barrioIderegistro } });
            setBarriosOptions(tmp);
        });
    }

    const handleSelectBarrio = (value, option) => {
        setBarrio(option);
        console.log(value);
    }

    const onFinish = (values) => {
        values.uniBarrio = barrio;
        props.onFinish(values, 1);
    }
    const handleChange = (value) => {
        console.log(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
    }

    return (
        <Fragment>
            <Spin tip="Cargando..." spinning={loading}>
                <Card title="Seleccion de municipio y barrio">
                    <Form form={form}  {...layout} onFinish={onFinish}>
                        <Form.Item name="uniMunicipio" label="Municipio" rules={[{ required: true, message: 'El municipio es obligatorio' }]}>
                            <Select
                                labelInValue
                                style={{ width: '100%' }}
                                placeholder="Seleccionar el municipio"
                                options={options}
                                onChange={handleChange}
                            />
                        </Form.Item>
                        <Form.Item label="Barrio">
                            <Form.Item name="uniBarrio" rules={[{ required: true, message: 'El barrio es obligatorio' }]} style={{ display: 'inline-block', width: 'calc(30% - 8px)' }}>
                                <AutoComplete
                                    dropdownMatchSelectWidth={500}
                                    onSearch={handleSearchBarrio}
                                    options={barriosOptions}
                                    onSelect={handleSelectBarrio}
                                >
                                </AutoComplete>
                            </Form.Item>
                            <Form.Item style={{ display: 'inline-block', width: 'calc(70% - 8px)', margin: '0 8px' }} >
                                <Input readOnly={true} value={barrio?.label} />
                            </Form.Item>
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button htmlType="submit" type="primary">
                                Seleccionar y continuar
                        </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Spin>
        </Fragment >
    )
}


function ParametrizacionMunicipioBarrio(props) {
    const [data, setData] = useState<any>();
    const [form] = Form.useForm();
    const [sectoresOptions, setSectoresOptions] = useState<any[]>();
    const [barriosHomologacion, setBarriosHomologacion] = useState<any[]>();
    const [microRutas, setMicroRutas] = useState<any[]>();
    const [rutasBarrido,setRutasBarrido]=useState<any[]>();
    const [complementos, setComplementos] = useState<any[]>();
    const [frecuencias, setFrecuencias] = useState<any[]>();
    const [loading, setLoading] = useState(false);
    const [sesionInfo,setSesionInfo] = useState<any>();
    const loadSectores = () => {
        sectoresApi.getPage(null).then(response => {
            const options = response.data.content.map((item) => { return { 'value': item.secIderegistro, 'label': item.secNombre } });
            setSectoresOptions(options);
        });
    }

    const loadBarriosHomologacion = () => {
        barriosApi.getPageEmpresa({ sort: "barrioNom", page: -1, size: -1 }, PARAMETROS.PARAMETRIZACION_BARRIOS.EMPRESA_HOMOLOGACION_BARRIO).then(response => {
            const options = response.data.content.map((item) => { return { 'value': item.barrioIderegistro, 'label': item.barrioNom } });
            setBarriosHomologacion(options)
        });
    };

    const loadMicroRutas = () => {
        rutasAPi.getPageByType(null, PARAMETROS.PARAMETRIZACION_BARRIOS.ID_CLASE_MICRORUTA).then(response => {
            const options = response.data.content.map((item) => { return { 'value': item.rutIderegistro, 'label': item.rutNombre } });
            setMicroRutas(options)
        });
    }

    const loadRutasBarrido = () => {
        rutasAPi.getPageByType(null, PARAMETROS.PARAMETRIZACION_BARRIOS.ID_CLASE_RUTABARRIDO).then(response => {
            const options = response.data.content.map((item) => { return { 'value': item.rutIderegistro, 'label': item.rutNombre } });
            setRutasBarrido(options)
        });
    }

    const loadComplementos = () => {
        unidadApi.getByClass(PARAMETROS.PARAMETRIZACION_BARRIOS.ID_CLASE_COMPLEMENTOS).then(response => {
            const options = response.data.content.map((item) => { return { 'value': item.uniIderegistro, 'label': item.uniNombre1 } });
            setComplementos(options);
        });
    }

    const loadFrecuencias = () => {
        setFrecuencias(PARAMETROS.PARAMETRIZACION_BARRIOS.FRECUENCIAS);
    }

    const loadData = (data) => {
        if(data?.uniMunicipio?.value && data?.uniBarrio?.value){
        setLoading(true);
        mubaApi.getByEmpresaMunicipioBarrio(data.uniMunicipio.value, data.uniBarrio.value).then(response => {
            setData({...response.data});
            form.setFieldsValue({ ...response.data});
            setLoading(false);
        }
        ).catch(error => {
            const newData = { uniBarrio: data.uniBarrio.value, uniMunicipio: data.uniMunicipio.value, mubaFactor: 0 };
            setData(newData);
            console.log(error);
            setLoading(false);
        });
    }
    };
    useEffect(() => {
        loadData(props.data);
        loadSectores();
        loadBarriosHomologacion();
        loadMicroRutas();
        loadRutasBarrido();
        loadComplementos();
        loadFrecuencias();
        setSesionInfo(getSesionInfo());

    }, [props.data]);

    const onFinish = (values) => {        
        values.uniBarrio = props.data.uniBarrio.value;        
        setData({ ...data, ...values });        
        props.onFinish({ ...data, ...values }, 2);
    }
    return (
        <Fragment>
            <Spin tip="Cargando..." spinning={loading}>
                <Card title="Parametrizacion">
                    <Form form={form} {...layout} onFinish={onFinish} initialValues={data}>
                        <Form.Item label='Factor:' name='mubaFactor' hidden={sesionInfo?.idEmpresa == PARAMETROS.EMPRESA_BIOAGRICOLA}>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item label='Sectores' name='mubaSector' rules={[{ required: true, message: 'El sector es obligatorio' }]}>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Seleccionar el sector"
                                options={sectoresOptions}
                            />
                        </Form.Item>
                        <Form.Item label='Barrios Homologacion:' name='barrioHomllanogas' rules={[{ required: true, message: 'El barrio para homologacion es obligatorio' }]}>
                            <Select
                                showSearch
                                style={{ width: '100%' }}
                                placeholder="Seleccionar el barrio"
                                options={barriosHomologacion}
                                optionFilterProp="children"
                                filterOption={(input : string, option) =>{
                                 if(option!= undefined && option.label){
                                     const label:string = option.label as string;
                                    return label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                 }return false;
                                  }}
                            />
                        </Form.Item>
                        <Form.Item label='Microruta de recoleccion:' name='dmubaRutas' rules={[{ required: true, message: 'El barrio para homologacion es obligatorio' }]}>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Seleccionar las microrutas de recoleccion"
                                mode='multiple'
                                options={microRutas}
                            >
                            </Select>
                        </Form.Item>
                        <Form.Item label='Frecuencias:' name='dmubaFrecuenciasBarrido' rules={[{ required: true, message: 'Debe escoger al menos una frecuencia' }]}>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Seleccionar las frecuencias"
                                mode='multiple'
                                options={frecuencias}
                            >
                            </Select>
                        </Form.Item>
                        <Form.Item label='Ruta Barrido:' name='mbru' rules={[{ required: true, message: 'La Ruta Barrido es obligatorio' }]}>
                            <Select
                                defaultValue={[]}
                                style={{ width: '100%' }}
                                placeholder="Seleccionar las rutas de barrido"
                                mode='multiple'
                                options={rutasBarrido}                               
                            >
                            </Select>
                        </Form.Item>
                        <Form.Item label='Complementos:' name='complementos' rules={[{ required: true, message: 'Debe seleccionar al menos un complemento' }]}>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Seleccion de complementos"
                                mode='multiple'
                                options={complementos}
                                optionFilterProp="children"
                                filterOption={(input : string, option) =>{
                                 if(option!= undefined && option.label){
                                     const label:string = option.label as string;
                                    return label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                 }return false;
                                  }}
                            >
                            </Select>
                        </Form.Item>
                        <Form.Item label='Zona Alto Riesgo:' name='zonaRiesgo' rules={[{ required: true, message: 'Debe seleccionar al menos una Zona' }]}>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Seleccion de Zona Riesgo"
                                options={[{value:'true',label:'Si'},{value:'false',label:'No'}]}
                            >
                            </Select>
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button htmlType="submit" type="primary">
                                Guardar Informacion
                        </Button>
                        <Button type="primary" danger onClick={props.onCancel}>
                                Cancelar
                        </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Spin>
        </Fragment>
    )
}


const ResultadoPanel: FunctionComponent<{ status: any, title: string, message: string, buttonText?: string, onClick: any }> = (props) => {
    return (
        <Fragment>
            <Result
                status={props.status}
                title={props.title}
                subTitle={props.message}
                extra={[
                    <Button type="primary" key="console" onClick={props.onClick}>
                        {props.buttonText ? props.buttonText : 'Continuar'}
                    </Button>
                ]}
            />
        </Fragment>
    )
}

/*const LoadingMessage: FunctionComponent<{ message: string, title: string, tipo?: any }> = (props) => {
    return (<Fragment>
        <Spin tip="Cargando...">
            <Alert
                message={props.title}
                description={props.message}
                type={props.tipo ? props.tipo : 'info'}
            />
        </Spin>
    </Fragment>)
}
*/

function ListMunicipioBarrio(props) {
    const columns = [
        {
            name: 'Municipio',
            selector: 'munNombre'
        },
        {
            name: 'Barrio',
            selector: 'barrioNombre'
        },
        {
            name: 'Sector',
            selector: 'secNombre'
        },
        {
            name: 'Editar',
            cell: row => <Button onClick={() => selectRow(row)} type="primary" size="small" >Editar</Button>,
        }
    ];
    const [page, setPage] = useState<Page>();
    const updateTable = (pageable: PageableRequest) => {
        mubaApi.getPage(pageable).then(response => {
            setPage(response.data);
        });
    }
    const selectRow = (row) =>{
        console.log(row);
        const data = {uniMunicipio:{value:row.munIderegistro},uniBarrio:{value:row.barrioIderegistro}}
        props.onSelect(data);
    }
    return (<Fragment>
        <Button onClick={props.onNew} value="Nuevo" type="primary" >Nuevo Registro</Button>
        <DataTableComponent showFilter={false} showSearch={true} page={page as Page} columns={columns} onUpdate={updateTable}>
        </DataTableComponent>
        </Fragment>
    )
}

export default BarriosMunicipioComponent;