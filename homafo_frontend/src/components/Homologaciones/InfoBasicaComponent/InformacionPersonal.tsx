import * as React from 'react';
import { Row, Col, Card, InputGroup, Popover, OverlayTrigger } from 'react-bootstrap';

interface IProps {
    basico: any;
    listaNaturaleza: any[];
    permisoVista: (e: string) => boolean;
    permisoEstado: (e: string) => boolean;
    cambioValor: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
}

const InformacionPersonal: React.FC<IProps> = ({ 
    basico, 
    listaNaturaleza, 
    permisoVista, 
    permisoEstado, 
    cambioValor 
}) => {
    return (
        <Card className="mb-3">
            <Card.Header><strong>Información Personal</strong></Card.Header>
            <Card.Body>
                <Row>
                    <Col style={{ display: permisoVista('col-terceroDocumento') ? "block" : "none" }}>
                        <div className="form-group">
                            <label>Documento Tercero ({basico.tipoDocumento}) / DV</label>
                            <InputGroup className="mb-3">
                                <input 
                                    disabled 
                                    className="form-control" 
                                    onChange={cambioValor} 
                                    name='terDocumento' 
                                    value={basico.terDocumento} 
                                    type='text' 
                                    placeholder=""
                                />
                                <InputGroup.Append>
                                    <InputGroup.Text id="basic-addon2">{basico.terDigverificacion}</InputGroup.Text>
                                </InputGroup.Append>
                            </InputGroup>
                        </div>
                    </Col>
                    <Col style={{ display: permisoVista('col-terceroNombre') ? "block" : "none" }}>
                        <div className="form-group">
                            <label>Terceros Apellidos/Nombres</label>
                            <OverlayTrigger 
                                placement="bottom" 
                                overlay={(
                                    <Popover id="popover-basic">
                                        <Popover.Title as="h2">{basico.terNomcompleto}</Popover.Title>
                                    </Popover>
                                )}
                            >
                                <input 
                                    disabled={permisoEstado('col-terceroNombre')} 
                                    className="form-control" 
                                    onChange={cambioValor} 
                                    name='terNomcompleto' 
                                    value={basico.terNomcompleto} 
                                    type='text' 
                                    placeholder=""
                                />
                            </OverlayTrigger>
                        </div> 
                    </Col>
                    <Col style={{ display: permisoVista('col-naturaleza') ? "block" : "none" }}>
                        <div className="form-group">
                            <label>Naturaleza</label>
                            <select 
                                disabled={true} 
                                onChange={cambioValor} 
                                className="form-control" 
                                name='naturaleza' 
                                value={basico.naturaleza}
                            >
                                <option value="--" key="0"></option>
                                {listaNaturaleza.filter((n: any) => n.uni_nombre2).map((e: any, key: number) => {
                                    return <option key={key} value={e.uni_ideregistro}>{e.uni_nombre2}</option>;
                                })}
                            </select>    
                        </div> 
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default InformacionPersonal;
