import { useForm } from "react-hook-form";
import React, { Fragment, useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import MubaApi from '../../../api/homologaciones/MubaApi';
import Page, { PageableRequest } from '../../../models/dto/Pagination';
import DataTableComponent from '../../utils/DataTableComponent/DataTableComponent';
import ProyectosApi from "../../../api/homologaciones/ProyectosApi";
import Select from 'react-select'
import BarriosApi from "../../../api/homologaciones/BarriosApi";
import PARAMETROS from "../../../data/constantes";
import AsyncSelect from 'react-select/async';
//import './MunicipioBarrio.css'

const mubaApi = new MubaApi();
const proyectosApi: ProyectosApi = new ProyectosApi();
const barriosApi: BarriosApi = new BarriosApi();
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
    }
];
function MunicipioBarrioComponent(props) {
    const [page, setPage] = useState<Page>();
    const { register,getValues, setValue ,handleSubmit, errors } = useForm();
    const [municipios, setMunicipios] = useState([]);
   // const [data,setData] = useState({});
    //const [barrios, setBarrios] = useState([]);
    const onSubmit = data => console.log(data);

    console.log(props);

    useEffect(() => {
        loadMunicipios();
        //loadBarrios();
    }, []);

    const loadMunicipios = () => {
        proyectosApi.getPage(null).then(response => {
            const optionsTmp = response.data.content.map((proyecto) => { return { 'value': proyecto.proyectoIderegistro, 'label': proyecto.proyectoNom } });
            console.log(optionsTmp);
            setMunicipios(optionsTmp);
        });
    }
    const updateTable = (pageable: PageableRequest) => {
        mubaApi.getPage(pageable).then(response => {
            setPage(response.data);
        });
    }
    const promiseOptions = inputValue =>
        new Promise(resolve => {
            barriosApi.getPageSearch(PARAMETROS.DEFAULT_PAGEABLE, inputValue).then(response => {
                const tmp = response.data.content.map((barrio) => { return { 'label': barrio.barrioNom, 'key': barrio.barrioNom, 'value': barrio.barrioIderegistro } });
                resolve(tmp);
            });
        });
    const consultarDisponibilidad = (event,action) =>{
        console.log(event);
        console.log(action);        
        setValue(action.name,event.value); 
        const {munIderegistro,barrioIderegistro} = getValues();  
        console.log(getValues())     ;
        mubaApi.getByEmpresaMunicipioBarrio(munIderegistro, barrioIderegistro).then(response => {
            console.log(response.data);
        });
    }    
    return (
        <Fragment>
            <Row className="small">
                <Col md={12}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Form.Group as={Col} controlId="municipio">
                                <Form.Label>Municipio</Form.Label>
                                <Select onChange={consultarDisponibilidad} name="munIderegistro" options={municipios}/>
                                {errors.munIderegistro && <span>This field is required</span>}
                            </Form.Group>
                            <Form.Group as={Col} controlId="barrio">
                                <Form.Label>Barrio</Form.Label>
                                <AsyncSelect onChange={consultarDisponibilidad} loadOptions={promiseOptions} name="barrioIderegistro" ref={register} />
                                {errors.barrioIderegistro && <span>This field is required</span>}
                            </Form.Group>
                        </Row>
                        <input name="kio" ref={register} defaultValue="hol"/>
                        <Row>
                            <input type="submit" value="Enviar"/>
                        </Row>
                    </form>
                </Col>
                <Col md={12} className="mt-2">
                    <h6 className="h6">Listado de municipios y barrios</h6>
                    <Row>
                        <DataTableComponent showSearch={true} page={page as Page} columns={columns} onUpdate={updateTable}>
                        </DataTableComponent>
                    </Row>
                </Col>
            </Row>
        </Fragment>
    )
}

export default MunicipioBarrioComponent;