import * as React from 'react';
import { Row, Col, Card, Popover, OverlayTrigger } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

interface IProps {
    basico: any;
    departamentos: any[];
    proyectos: any[];
    barrios: any[];
    barrioSeleccion: any[];
    listaComplementoPropiedad: any[];
    permisoVista: (e: string) => boolean;
    permisoEstado: (e: string) => boolean;
    cambioValor: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
    cambioValor2: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
    cambioValor3: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
    cambioValorBarrio: (e: any) => void;
}

const InformacionUbicacion: React.FC<IProps> = ({ 
    basico,
    departamentos,
    proyectos,
    barrios,
    barrioSeleccion,
    listaComplementoPropiedad,
    permisoVista,
    permisoEstado,
    cambioValor,
    cambioValor2,
    cambioValor3,
    cambioValorBarrio
}) => {
    return (
        <Card className="mb-3">
            <Card.Header><strong>Ubicación</strong></Card.Header>
            <Card.Body>
                <Row>
                    <Col style={{ display: permisoVista('col-departamento') ? "block" : "none" }}>
                        <div className="form-group">
                            <label>Departamento</label>
                            <select 
                                disabled 
                                onChange={cambioValor2} 
                                className="form-control" 
                                name='departamento' 
                                value={basico.departamento}
                            >
                                <option value="0" key="0"></option>
                                {departamentos.map((e: any, key: number) => {
                                    return <option key={key} value={e.departamento_ideregistro}>{e.departamento_nom}</option>;
                                })}
                            </select>  
                        </div> 
                    </Col>
                    <Col style={{ display: permisoVista('col-municipio') ? "block" : "none" }}>
                        <div className="form-group">
                            <label>Municipio</label>
                            <select 
                                disabled 
                                onChange={cambioValor3} 
                                className="form-control" 
                                name='proyecto' 
                                value={basico.proyecto}
                            >
                                <option value="0" key="0"></option>
                                {proyectos.map((e: any, key: number) => {
                                    return <option key={key} value={e.proyecto_ideregistro}>{e.proyecto_nom}</option>;
                                })}
                            </select>  
                        </div> 
                    </Col>   
                    <Col style={{ display: permisoVista('col-barrio') ? "block" : "none" }}>
                        <div className="form-group">
                            <label>Barrio</label>
                            <Typeahead
                                id="basic-typeahead-single"
                                labelKey="barrio_nom"
                                onChange={cambioValorBarrio}
                                options={barrios}
                                placeholder="Elegir barrio..."
                                selected={barrioSeleccion}
                                disabled={permisoEstado('col-barrio')}
                            />
                        </div> 
                    </Col>
                </Row>
                <Row>
                    <Col style={{ display: permisoVista('col-direccion') ? "block" : "none" }}>
                        <div className="form-group">
                            <label>Dirección</label>
                            <OverlayTrigger 
                                placement="bottom" 
                                overlay={(
                                    <Popover id="popover-basic">
                                        <Popover.Title as="h2">{basico.direccion}</Popover.Title>
                                    </Popover>
                                )}
                            >
                                <input 
                                    disabled={permisoEstado('col-direccion')} 
                                    className="form-control" 
                                    onChange={cambioValor} 
                                    name='direccion' 
                                    value={basico.direccion} 
                                    type='text' 
                                    placeholder=""
                                />
                            </OverlayTrigger>
                        </div> 
                    </Col>
                    <Col style={{ display: permisoVista('col-propiedad') ? "block" : "none" }}>
                        <div className="form-group">
                            <label>Complemento Propiedad</label>
                            <select 
                                disabled={permisoEstado('col-propiedad')} 
                                onChange={cambioValor} 
                                className="form-control" 
                                name='complementoPropiedad' 
                                value={basico.complementoPropiedad}
                            >
                                {listaComplementoPropiedad.map((e: any, key: number) => {
                                    return <option key={key} value={e.mbcd_ideregistr}>{e.uni_nombre1}</option>;
                                })}
                            </select>  
                        </div> 
                    </Col>
                </Row>
                <Row>                           
                    <Col style={{ display: permisoVista('col-longitud') ? "block" : "none" }}>
                        <div className="form-group">
                            <label>Longitud</label>
                            <input 
                                disabled={true} 
                                className="form-control" 
                                onChange={cambioValor} 
                                name='longitud' 
                                value={basico.longitud} 
                                type='text' 
                                placeholder=""
                            />
                        </div> 
                    </Col>
                    <Col style={{ display: permisoVista('col-latitud') ? "block" : "none" }}>
                        <div className="form-group">
                            <label>Latitud</label>
                            <input 
                                disabled={true} 
                                className="form-control" 
                                onChange={cambioValor} 
                                name='latitud' 
                                value={basico.latitud} 
                                type='text' 
                                placeholder=""
                            />
                        </div> 
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default InformacionUbicacion;
