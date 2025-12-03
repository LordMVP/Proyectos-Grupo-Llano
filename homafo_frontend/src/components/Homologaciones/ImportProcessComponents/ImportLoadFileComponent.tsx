import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Alert  } from 'antd';
import { Col, Form } from "react-bootstrap";
import { Button, Card, Elevation } from "@blueprintjs/core";
import HomologacionApi from '../../../api/homologaciones/Homologacion';
import ImportacionApi from '../../../api/homologaciones/ImportacionApi';
import { saveAs } from "file-saver";
import NewLoader from '../../loader/NewLoader';
import 'antd/dist/antd.css';

interface ImarcConfiguracion {
    imarc_ideregistro: number,
    imarc_nombre_archivo: string
}

interface ProcesoActivo {
    procesoId: number;
    fechaInicio: number;
    usuarioId: number;
    hiloId: number;
    tiempoTranscurrido: number;
    fechaFinal: number | null;
}

interface ProcesoResponse {
    procesoInactivo: boolean;
    codigo: number;
    mensaje: string;
    procesoActivo: ProcesoActivo | null;
}

interface ImportLoadFileComponentProps {
    handlerComplete: (nextStep) => void
}

function ImportLoadFileComponent(props: ImportLoadFileComponentProps) {

    const [configuracion, setConfiguracion] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [configuraciones, setConfiguraciones] = useState<ImarcConfiguracion[]>([]);
    const homologacionApi = new HomologacionApi();
    const importacionApi = new ImportacionApi();
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);


    const [procesoActivo, setProcesoActivo] = useState<ProcesoActivo | null>(null);
    const [tiempoTranscurrido, setTiempoTranscurrido] = useState<number>(0);
    const [mensaje, setMensaje] = useState<string>("");
    const timerRef = useRef<NodeJS.Timeout | null>(null);


    useEffect(() => {
        checkActiveProcess();
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);
    
    //Actualizar tiempo transcurrido cada segundo
useEffect(() => {
    if (procesoActivo) {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        
        timerRef.current = setInterval(() => {
            const now = new Date().getTime();
            // Check if fechaInicio is a timestamp (number) or a string date
            const startTime = typeof procesoActivo.fechaInicio === 'number' 
                ? procesoActivo.fechaInicio 
                : new Date(procesoActivo.fechaInicio).getTime();
            
            // Ensure we never show negative time
            const elapsedSeconds = Math.max(0, Math.floor((now - startTime) / 1000));
            setTiempoTranscurrido(elapsedSeconds);
            
        }, 1000);
    } else {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }
    
    return () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };
}, [procesoActivo]);


    useEffect(() => {
        homologacionApi.tiposArchivoImportacion().then(response => {
            setConfiguraciones(response.data);
            setConfiguracion(response.data[0].imarc_ideregistro);
        });
    }, []);


     const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
};

    const checkActiveProcess = () => {
        setIsRefreshing(true);
        importacionApi.validarProcesoImportacion()
            .then(response => {
                const data: ProcesoResponse = response.data;
                if (!data.procesoInactivo && data.procesoActivo) {
                    setProcesoActivo(data.procesoActivo);
                    setMensaje(data.mensaje);
                } else {
                    setProcesoActivo(null);
                    setMensaje("");
                }
            })
            .catch(error => {
                console.error("Error checking process status:", error);
            }).finally(() => {
            setIsRefreshing(false);
        }
        );
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        //console.log(files[0]?.name +" conf "+configuracion + " file "+files[0]);
        //console.log(files[0])
        const formData = new FormData();
        // dict of all elements
        formData.append("imarc", "" + configuracion);
        formData.append("file", files[0]);
        setProcesoActivo({ procesoId: 0, fechaInicio: Date.now(), usuarioId: 0, hiloId: 0, tiempoTranscurrido: 0, fechaFinal: null });
        importacionApi.processFile(formData).then(response => {

            let filename = "";
            let disposition = response.headers['content-disposition'];
            if (disposition && disposition.indexOf('attachment') !== -1) {
                var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                var matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');

                }
            }
            let enc= new TextDecoder("utf-8")
            //const conJson;

            try{
                const conJson= JSON.parse(enc.decode(response.data))
                props.handlerComplete({ type: 'complete', step: 'validacion', response: conJson });

                if(conJson.objeto != undefined){
                    var byteArray = Buffer.from(conJson.objeto,'base64');              
                    let blob=new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });           
                    saveAs (blob, filename)
                }                
            }catch(e){
                    console.log(e)                
            }            
            setProcesoActivo(null);
        });
    }

    const opcionesConfiguracion = configuraciones.map((item) => <option value={item.imarc_ideregistro}>{item.imarc_nombre_archivo}</option>);
    return (
        <Fragment>
            <Card elevation={Elevation.TWO}>
                 {procesoActivo ? (
                    <Fragment>
                        <Alert
                            message={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{mensaje + " por favor espera hasta que termine el proceso" || "Proceso en ejecución"}</span>
                                    <Button
                                        className="bp3-minimal bp3-small"
                                        onClick={checkActiveProcess}
                                    >
                                        Volver a cargar
                                    </Button>
                                </div>
                            } description={
                                <div>
                                    <p>Proceso ID: {procesoActivo.procesoId}</p>
                                    <p>Tiempo transcurrido: {formatTime(tiempoTranscurrido)}</p>
                                    <p>Fecha de inicio: {new Date(procesoActivo.fechaInicio).toLocaleString()}</p>
                                </div>
                            }
                            type="info"
                            showIcon
                            style={{ marginBottom: 16 }}
                        />
                        {
                            isRefreshing && (
                                <NewLoader />
                            )
                        }
                    </Fragment>

                ) :
                <Form className="small" onSubmit={handleSubmit}>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>
                                Seleccionar configuracion
                        </Form.Label>
                            <Form.Control onChange={e => setConfiguracion(e.target.value)} as="select" className="mb-2" size="sm">
                                {opcionesConfiguracion}
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>
                                Seleccionar Archivo
                        </Form.Label>
                            <Form.File onChange={(event) => setFiles(event.target.files)}>
                            </Form.File>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row className="align-items-center">
                        <Col md={12} className="">
                            <Button
                                className="docs-wiggle bp3-fill"
                                icon="refresh"
                                onClick={handleSubmit}                    >
                                Realizar el cargue
                    </Button>
                        </Col>
                    </Form.Row>
                </Form>
            }
                        </Card>
        </Fragment>
    );

}

export default ImportLoadFileComponent;