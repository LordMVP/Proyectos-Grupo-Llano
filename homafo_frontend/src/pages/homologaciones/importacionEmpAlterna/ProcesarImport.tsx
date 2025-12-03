import { Button, Tab, Tabs } from '@blueprintjs/core';
import React, { Fragment, useReducer } from 'react';
import ImportEditComponent from '../../../components/Homologaciones/ImportProcessComponents/ImportEditComponent';
import ImportProcessListComponent from '../../../components/Homologaciones/ImportProcessComponents/ImportListProcess';
import ImportLoadFileComponent from '../../../components/Homologaciones/ImportProcessComponents/ImportLoadFileComponent';
import ImportResultadoComponent from '../../../components/Homologaciones/ImportProcessComponents/ImportResultadoComponent';
import ImportValidationComponent from '../../../components/Homologaciones/ImportProcessComponents/ImportValidationComponent';
import ImportProcessResponse from '../../../models/dto/ImportProcessResponseDTO';
import './ProcesarImport.css';

type ImportState  = {
    step:string,
    response?:ImportProcessResponse
    pimpId?:number
    data?:any
}

type Action = {type:'complete', response?:ImportProcessResponse,step:string,pimpId:number,data?:any}
| {type:'setStep',step:string}


function reducer(state:ImportState, action:Action) {
    switch (action.type) {
        case 'complete':return {...state, response:action.response,step:action.step,pimpId:action.pimpId,data:action.data};
        case 'setStep':return {...state,step:action.step}
    }
}

const initialState = {step:'lista'};

function ProcesarImport() {
    const[state,dispatch] = useReducer(reducer,initialState);


    return (
        <Fragment>
            <Tabs renderActiveTabPanelOnly={true} id="TabsExample" onChange={(key)=>dispatch({type:'setStep',step:key.toString()})} selectedTabId={state.step}>
                <Tab id="lista" disabled={(state.step!='lista' && state.step!='seleccion')} title="Listado de procesos no finalizados" panel={<ImportProcessListComponent handlerComplete={dispatch}/>} />
                <Tab id="seleccion" disabled={state.step!='selecccion'} title="Seleccion de la configuracion" panel={<ImportLoadFileComponent handlerComplete={dispatch}/>} />
                <Tab id="validacion" disabled={state.step!='validacion'} title="Validacion del archivo" panel={<ImportValidationComponent handlerComplete={dispatch} info={state.response as ImportProcessResponse}/>} />
                <Tab id="procesar" disabled={state.step!='procesar'} title="Procesamiento" panel={<ImportEditComponent handlerComplete={dispatch} pimpId={state.pimpId}/>} />
                <Tab id="resultado" disabled={state.step!='resultado'} title="Resultado procesamiento" panel={<ImportResultadoComponent handlerComplete={dispatch} pimpId={state.pimpId} data={state.data}/>} />
                <Tabs.Expander />
                <Button icon="home" onClick={()=>dispatch({type:'setStep',step:'lista'})}>Inicio</Button>                
            </Tabs>
        </Fragment>
    );

}

export default ProcesarImport;