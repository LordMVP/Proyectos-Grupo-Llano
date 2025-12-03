import _ from 'lodash'
import TipoAforoApi from '../../../api/homologaciones/TipoAforoApi';
import Tertercero from '../../../api/homologaciones/TerTercero';
import UtilsFunction from '../../../components/utils/UtilsFunction';
import AforoInfoDTO from '../../../models/dto/AforoInfoDTO';
import React, { Fragment, useEffect, useState } from 'react';
import { Col, Form, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import { UseFormMethods } from 'react-hook-form';
import TipoAforoDTO from '../../../models/dto/TipoAforoDTO';
import UnidadesApi from '../../../api/homologaciones/UnidadesApi';
import PARAMETROS from '../../../data/constantes';
import MacrorutasApi from '../../../api/homologaciones/MacrorutasApi';
import MacrorutaDTO from '../../../models/dto/MacrotutaDTO';



const tipoAforoApi = new TipoAforoApi();
const terceroApi = new Tertercero();
const unidadApi = new UnidadesApi();
const rureApi = new MacrorutasApi();

const popover = (
    <Popover id="popover-basic">
        <Popover.Title as="h3">Aforo uniforme</Popover.Title>
        <Popover.Content>
            Un aforo uniforme ajusta cada una de las suscripciones con el mismo peso.
        </Popover.Content>
    </Popover>
);

type AforoInfoComponetProps = {
    aforo: AforoInfoDTO;
    form: UseFormMethods<AforoInfoDTO>;
    readonly?:boolean;
}

function AforoFormComponent(props: AforoInfoComponetProps) {
    //const [aforo, setAforo] = useState<AforoInfoDTO>();
    const { register, reset, watch, setValue } = props.form;
    const [tiposAforo, setTiposAforo] = useState<TipoAforoDTO[]>([]);
    const [aforadores, setAforadores] = useState<any[]>([]);
    const [conceptos, setConceptos] = useState<any[]>([]);
    const [rures, setRures] = useState<MacrorutaDTO[]>([]);
    const [tipoAforo, setTipoAforo] = useState<TipoAforoDTO>();
    const observable = watch(['tipoAforoId', 'afoFechaInicio']);

    useEffect(() => {
        tipoAforoApi.getPage(null).then(response => {
            setTiposAforo(response.data.content);
        });
        terceroApi.getAforadores().then((response) => {
            setAforadores(response.data.data)
        });
        unidadApi.getByClass(PARAMETROS.CLASES.CLASE_CONCEPTO_AFORO).then(response => {
            setConceptos(response.data.content);
        });
        rureApi.getPage(null).then(response => {
            setRures(response.data.content);
        });
    }, []);

    useEffect(() => {
        actualizarFechaVigencia();
    }, [observable.afoFechaInicio]);

    useEffect(() => {
        console.log("Cambio en tipo de  por effect", observable.tipoAforoId)
        if (observable.tipoAforoId) {
            const tipoAforo: TipoAforoDTO = _.find<TipoAforoDTO>(tiposAforo, { 'tafoIderegistro': observable.tipoAforoId as number });
            console.log(tipoAforo);
            setTipoAforo(tipoAforo);
            actualizarFechaVigencia();
        }
    }, [observable.tipoAforoId]);

    useEffect(() => {
        reset(props.aforo);
        console.log('Reset form');
    }, [props.aforo]);

    const actualizarFechaVigencia = () => {
        if (observable.tipoAforoId && observable.afoFechaInicio) {
            const tipoAforo: TipoAforoDTO = _.find<TipoAforoDTO>(tiposAforo, { 'tafoIderegistro': observable.tipoAforoId as number });
            const fechaInicio = new Date(observable.afoFechaInicio);
            fechaInicio.setDate(fechaInicio.getDate() + tipoAforo.tafoVigencia);
            setValue('afoFechaVigencia', UtilsFunction.formatDate(fechaInicio));
        }
    }


    return (<Fragment>
        <Row className="g-3">
            <Col md={3} sm={12} className="mb-3">
                <Form.Label>Tipo Aforo</Form.Label>
                <select disabled={props.readonly} className="form-control form-control-sm" name="tipoAforoId" ref={register({ required: true, valueAsNumber: true })}>
                    {UtilsFunction.renderOptionsList<TipoAforoDTO>(tiposAforo, 'tafoIderegistro', 'unidad.uniNombre1')}
                </select>
            </Col>
            <Col md={3} sm={12} className="mb-3">
                <Form.Label>Fecha inicio</Form.Label>
                <input readOnly={props.readonly} className="form-control form-control-sm" name="afoFechaInicio" type="date" ref={register({ required: true })} />
            </Col>
            <Col md={3} sm={12} className="mb-3">
                <Form.Label>Fecha Final Vigencia</Form.Label>
                <input  readOnly className="form-control form-control-sm" name="afoFechaVigencia" type="date" ref={register({ required: true })} />
            </Col>
            <Col md={3} sm={12} className="mb-3">
                <Form.Label>Numero PRQ</Form.Label>
                <input readOnly={props.readonly} className="form-control form-control-sm" name="afoNumpqr" type="number" ref={register({ required: false })} />
            </Col>
        </Row>
        <Row>
            <Col md={3} sm={12} className="mb-3">
                <Form.Label>Aforador</Form.Label>
                <select disabled={props.readonly} className="form-control form-control-sm" name="terAforadorId" ref={register({ required: true, valueAsNumber: true })}>
                    {UtilsFunction.renderOptionsList<any>(aforadores, 'id', 'object')}
                </select>
            </Col>
            <Col md={3} sm={12} className="mb-3">
                <Form.Label>Macroruta</Form.Label>
                <select disabled={props.readonly} className="form-control form-control-sm" name="rureIderegistro" ref={register({ required: true, valueAsNumber: true })}>
                    {UtilsFunction.renderOptionsList<any>(rures, 'rureIderegistro', 'rutIdemacruta.rutNombre')}
                </select>
            </Col>
            <Col md={3} sm={12} className="mb-3">
                <Form.Label>Concepto del aforo</Form.Label>
                <select disabled={props.readonly} className="form-control form-control-sm" name="conceptoAforoId" ref={register({ required: true, valueAsNumber: true })}>
                    {UtilsFunction.renderOptionsList<any>(conceptos, 'uniIderegistro', 'uniNombre1')}
                </select>
            </Col>
            <Col md={3} sm={12} className="mb-3">
                <Form.Label>Factor</Form.Label>
                <input readOnly={props.readonly} className="form-control form-control-sm" step="any" name="mafvFactor" type="number" ref={register({ required: true, valueAsNumber: true })} />
            </Col>

        </Row>
        <Row>
            {tipoAforo?.tafoAforoPadre &&
                <Col md={6} sm={12} className="mb-3">
                    <Form.Label>Aforo padre (id)</Form.Label>
                    <input readOnly={props.readonly} className="form-control form-control-sm" name="afoIdeAfoPadre" type="number" ref={register({ required: tipoAforo?.tafoAforoPadre, valueAsNumber: true })} />
                </Col>
            }
            <Col lg={6} md={6} sm={12} className="mb-3">
                <Form.Label>Observaciones</Form.Label>
                <textarea readOnly={props.readonly} className="form-control form-control-sm" name="afoObservaciones" ref={register({ required: false })}>
                </textarea>
            </Col>
        </Row>
        {tipoAforo?.uniClaseaforo == PARAMETROS.CLASES.CLASE_AFORO_MULTIPLE &&
            <Row>
                <div className="col-md-12 col-sm-10 mb-3">
                    <div className="form-check">
                        <input disabled={props.readonly} readOnly={props.readonly} className="form-check-input" name="afoDistribucionUniforme" type="checkbox" ref={register({ required: false })} />
                        <label className="form-check-label">
                            Aforo de distribucion uniforme
                        </label>
                        <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                            <a href="#"> (Info) </a>
                        </OverlayTrigger>
                    </div>
                </div>
            </Row>
        }        
    </Fragment>);
}


export default AforoFormComponent;