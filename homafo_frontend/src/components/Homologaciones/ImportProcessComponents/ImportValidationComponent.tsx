import { Button, Callout, Card, Elevation, Intent, UL, Collapse, HTMLTable, Icon } from '@blueprintjs/core';
import React, { Fragment, useState } from 'react';
import ImportProcessResponse from '../../../models/dto/ImportProcessResponseDTO';

interface ImportInfoStepComponentProps {
    handlerComplete: (nextStep) => void,
    info: ImportProcessResponse
}

function ImportValidationComponent(props: ImportInfoStepComponentProps) {
    const [isErrorsOpen, setIsErrorsOpen] = useState(false);
    const validaciones = props.info?.validaciones?.map((validacion) => <li>{validacion.mensaje}</li>);
    const hasErrors = (props.info?.informacionImportacion?.mensajesError || []).length > 0;

    
    return (
        <Fragment>
            <Card interactive={true} elevation={Elevation.TWO} className=".modifier">
                <Callout intent={props.info.codigo != 0 ? Intent.DANGER : Intent.SUCCESS} title="Resultados de la validacion">
                    <p>{props.info?.mensaje}</p>
                    <p hidden={!props.info?.informacionImportacion?.pimpId}>
                        Se creo el proceso de importacion <b>{props.info?.informacionImportacion?.pimpId}</b>.<br/>
                        El cual genero un total de <b>{props.info?.informacionImportacion?.numeroProyecciones}</b> proyecciones para insertar.
                    </p>
                    
                    {hasErrors && (
                        <div style={{ marginBottom: '15px' }}>
                            <div 
                                onClick={() => setIsErrorsOpen(!isErrorsOpen)}
                                style={{ 
                                    cursor: 'pointer', 
                                    padding: '8px 10px',
                                    background: '#FFE8E6', 
                                    borderRadius: '3px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: isErrorsOpen ? '10px' : '0'
                                }}
                            >
                                <span style={{ color: '#D13913', fontWeight: 'bold' }}>
    <Icon icon="error" intent={Intent.DANGER} style={{ marginRight: '8px' }}/>
    ⇲ Errores encontrados ({props.info?.informacionImportacion?.mensajesError?.length || 0})
</span>
                            </div>
                            
                            <Collapse isOpen={isErrorsOpen}>
                                <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #DDD', borderRadius: '3px' }}>
                                    <HTMLTable striped condensed style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th>Fila</th>
                                                <th>Proceso</th>
                                                <th>Descripción del error</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {props.info?.informacionImportacion?.mensajesError?.map((error, index) => {
                                                // Parse the error message
                                                const match = error.match(/Fila: (\d+) Proceso: (\d+) Error: (.+)/);
                                                if (match) {
                                                    const [, fila, proceso, descripcion] = match;
                                                    return (
                                                        <tr key={index}>
                                                            <td>{fila}</td>
                                                            <td>{proceso}</td>
                                                            <td>{descripcion}</td>
                                                        </tr>
                                                    );
                                                }
                                                return (
                                                    <tr key={index}>
                                                        <td colSpan={3}>{error}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </HTMLTable>
                                </div>
                            </Collapse>
                        </div>
                    )}
                    
                    <UL>
                        {validaciones}
                    </UL>
                    <Button onClick={() => props.handlerComplete({ type: 'setStep', step: 'seleccion' })}>Regresar</Button>
                </Callout>
            </Card>
        </Fragment>
    );
}

export default ImportValidationComponent;