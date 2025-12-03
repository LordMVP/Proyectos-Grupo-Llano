import * as React from 'react';
import { Row, Col, Card, Popover, OverlayTrigger } from 'react-bootstrap';

interface IProps {
    basico: any;
    ubicacionLista: any[];
    actividadesComerciales: any[];
    permisoVista: (e: string) => boolean;
    permisoEstado: (e: string) => boolean;
    cambioValor: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
}

const InformacionCatastral: React.FC<IProps> = ({ 
    basico,
    ubicacionLista,
    actividadesComerciales,
    permisoVista,
    permisoEstado,
    cambioValor
}) => {
    return (
        <Card className="mb-3">
            <Card.Header><strong>Información Catastral</strong></Card.Header>
            <Card.Body>
                <Row>
                    <Col style={{ display: permisoVista('col-catastral') ? "block" : "none" }}>
                        <div className="form-group">
                            <label>Catastral Anterior (15 Caracteres)</label>
                            <OverlayTrigger 
                                placement="bottom" 
                                overlay={(
                                    <Popover id="popover-basic">
                                        <Popover.Title as="h2">{basico.resolCatastral}</Popover.Title>
                                    </Popover>
                                )}
                            >
                                <input 
                                    disabled={permisoEstado('col-catastral')} 
                                    className="form-control" 
                                    onChange={cambioValor} 
                                    name='catastralAntes' 
                                    value={basico.catastralAntes} 
                                    type='text' 
                                    placeholder=""
                                />
                            </OverlayTrigger>
                        </div> 
                    </Col>
                    <Col style={{ display: permisoVista('col-catastralNuevo') ? "block" : "none" }}>
                        <div className="form-group">
                            <label>Catastral Nacional (30 Caracteres)</label>
                            <input 
                                disabled={permisoEstado('col-catastralNuevo')} 
                                className="form-control" 
                                onChange={cambioValor} 
                                name='castastralNuevo' 
                                value={basico.castastralNuevo} 
                                type='text' 
                                placeholder=""
                            />
                        </div> 
                    </Col>
                    <Col style={{ display: permisoVista('col-independencia') ? "block" : "none" }}>
                        <div className="form-group">
                            <label>Independencia</label>
                            <input 
                                disabled={true} 
                                className="form-control" 
                                onChange={cambioValor} 
                                name='independencia' 
                                value={basico.independencia} 
                                type='number' 
                                placeholder=""
                            />
                        </div> 
                    </Col>
                </Row>
                <Row>    
                    <Col style={{ display: permisoVista('col-matricula') ? "block" : "none" }}>
                        <div className="form-group">
                            <label>Matrícula Inmobiliaria</label>
                            <input 
                                disabled={permisoEstado('col-matricula')} 
                                className="form-control" 
                                onChange={cambioValor} 
                                name='matriculaInmobiliaria' 
                                value={basico.matriculaInmobiliaria} 
                                type='text' 
                                placeholder=""
                            />
                        </div> 
                    </Col>
                    <Col style={{ display: permisoVista('col-ubicacion') ? "block" : "none" }}>
                        <div className="form-group">
                            <label>Ubicación</label>
                            <select 
                                disabled={permisoEstado('col-ubicacion')} 
                                onChange={cambioValor} 
                                className="form-control" 
                                name='ubicacion' 
                                value={basico.ubicacion}
                            >
                                <option value="0" key="0"></option>
                                {ubicacionLista.map((e: any, key: number) => {
                                    return <option key={key} value={e.uni_codigo1}>{e.uni_nombre1}</option>;
                                })}
                            </select>  
                        </div> 
                    </Col>
                    <Col style={{ display: permisoVista('col-comercial') ? "block" : "none" }}>
                        <div className="form-group">
                            <label>Actividad Comercial</label>
                            <select 
                                disabled={permisoEstado('col-comercial')} 
                                onChange={cambioValor} 
                                className="form-control" 
                                name='actividadComercial' 
                                value={basico.actividadComercial}
                            >
                                <option value="0" key="0"></option>
                                {actividadesComerciales.map((e: any, key: number) => {
                                    return <option key={key} value={e.uni_ideregistro}>{e.uni_nombre1}</option>;
                                })}
                            </select>  
                        </div> 
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default InformacionCatastral;
