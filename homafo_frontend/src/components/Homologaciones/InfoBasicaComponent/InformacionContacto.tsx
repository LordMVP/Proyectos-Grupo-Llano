import * as React from 'react';
import { Row, Col, Card, Button, ListGroup } from 'react-bootstrap';

interface IProps {
    basico: any;
    correoTmp: number;
    correoValorTmp: string;
    telefonoTmp: number;
    telefonoValorTmp: string;
    estadoItemCorreo: string;
    estadoItemTel: string;
    contactoTerceroUnidades: any[];
    permisoVista: (e: string) => boolean;
    permisoEstado: (e: string) => boolean;
    cambioValorGeneral: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
    cambioValorContactoTercero: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
    agregarContactoTercero: (tipo: string) => void;
    eliminarNuevoCorreo: () => void;
    eliminarNuevoCorreo2: () => void;
    seleccionItemContacto: (valor: string) => void;
    seleccionItemContacto2: (valor: string) => void;
}

const InformacionContacto: React.FC<IProps> = ({
    basico,
    correoTmp,
    correoValorTmp,
    telefonoTmp,
    telefonoValorTmp,
    estadoItemCorreo,
    estadoItemTel,
    contactoTerceroUnidades,
    permisoVista,
    permisoEstado,
    cambioValorGeneral,
    cambioValorContactoTercero,
    agregarContactoTercero,
    eliminarNuevoCorreo,
    eliminarNuevoCorreo2,
    seleccionItemContacto,
    seleccionItemContacto2
}) => {
    return (
        <Card className="mb-3">
            <Card.Header><strong>Información de Contacto</strong></Card.Header>
            <Card.Body>
                <Row>
                    <Col md={6} style={{ display: permisoVista('col-correo') ? "block" : "none" }}>
                        <Card className="mb-3" style={{ height: '100%' }}>
                            <Card.Header as="h6" className="bg-light">
                                <i className="fas fa-envelope mr-2"></i>Correos Electrónicos
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col xs={5}>
                                        <label className="small">Tipo</label>
                                        <select 
                                            disabled={permisoEstado('col-correo')} 
                                            onChange={cambioValorContactoTercero} 
                                            className="form-control form-control-sm" 
                                            name='correoTmp' 
                                            value={correoTmp}
                                        >
                                            <option value="0">Seleccionar...</option>
                                            {contactoTerceroUnidades.map((e: any, key: number) => {
                                                if(e.uni_codigo1.indexOf("EMAIL") >= 0) {
                                                    return <option key={key} value={e.uni_ideregistro}>{e.uni_nombre1}</option>;
                                                }
                                                return null;
                                            })}
                                        </select>  
                                    </Col>
                                    <Col xs={7}>
                                        <label className="small">Correo</label>
                                        <input 
                                            disabled={permisoEstado('col-correo')} 
                                            className="form-control form-control-sm" 
                                            onChange={cambioValorGeneral} 
                                            name='correoValorTmp' 
                                            value={correoValorTmp} 
                                            type='email' 
                                            placeholder="correo@ejemplo.com"
                                        />       
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col className="text-right">
                                        <Button 
                                            variant="success" 
                                            size="sm" 
                                            onClick={() => agregarContactoTercero('EMAIL')} 
                                            disabled={correoTmp > 0 && correoValorTmp.length > 0 ? false : true}
                                            className="mr-1"
                                        >
                                            <i className="fas fa-plus"></i> Agregar
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            size="sm" 
                                            onClick={eliminarNuevoCorreo} 
                                            disabled={estadoItemCorreo === '' ? true : false}
                                        >
                                            <i className="fas fa-trash"></i> Eliminar
                                        </Button>
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col>
                                        <label className="small font-weight-bold">Lista de Correos:</label>
                                        <ListGroup variant="flush" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                            {basico.contactoTerceroLista.map((e: any) => {
                                                if(e.cont_ideregistro >= 0 && e.uni_codigo1.indexOf("EMAIL") >= 0)
                                                    return (
                                                        <ListGroup.Item 
                                                            key={e.cont_valor} 
                                                            action
                                                            style={{cursor:'pointer', fontSize: '0.85rem', padding: '0.5rem'}}  
                                                            onClick={() => seleccionItemContacto(e.cont_valor)} 
                                                            active={e.cont_valor === estadoItemCorreo ? true : false}
                                                        >
                                                            <strong>{e.uni_nombre1}:</strong> {e.cont_valor}
                                                        </ListGroup.Item>
                                                    );
                                                return null;
                                            })}
                                            {basico.contactoTerceroLista.filter((e: any) => e.cont_ideregistro >= 0 && e.uni_codigo1.indexOf("EMAIL") >= 0).length === 0 && (
                                                <ListGroup.Item className="text-muted text-center small">
                                                    No hay correos registrados
                                                </ListGroup.Item>
                                            )}
                                        </ListGroup>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    <Col md={6} style={{ display: permisoVista('col-telefono') ? "block" : "none" }}>
                        <Card className="mb-3" style={{ height: '100%' }}>
                            <Card.Header as="h6" className="bg-light">
                                <i className="fas fa-phone mr-2"></i>Teléfonos
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col xs={5}>
                                        <label className="small">Tipo</label>
                                        <select 
                                            disabled={permisoEstado('col-telefono')} 
                                            onChange={cambioValorContactoTercero} 
                                            className="form-control form-control-sm" 
                                            name='telefonoTmp' 
                                            value={telefonoTmp}
                                        >
                                            <option value="0">Seleccionar...</option>
                                            {contactoTerceroUnidades.map((e: any) => {
                                                if(e.uni_codigo1.indexOf("TEL") >= 0) {
                                                    return <option value={e.uni_ideregistro}>{e.uni_nombre1}</option>;
                                                }
                                                return null;
                                            })}
                                        </select>  
                                    </Col>
                                    <Col xs={7}>
                                        <label className="small">Número</label>
                                        <input 
                                            disabled={permisoEstado('col-telefono')} 
                                            className="form-control form-control-sm" 
                                            onChange={cambioValorGeneral} 
                                            name='telefonoValorTmp' 
                                            value={telefonoValorTmp} 
                                            type='text' 
                                            placeholder="3001234567"
                                        />       
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col className="text-right">
                                        <Button 
                                            variant="success" 
                                            size="sm" 
                                            onClick={() => agregarContactoTercero('TEL')} 
                                            disabled={telefonoTmp > 0 && telefonoValorTmp.length > 0 ? false : true}
                                            className="mr-1"
                                        >
                                            <i className="fas fa-plus"></i> Agregar
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            size="sm" 
                                            onClick={eliminarNuevoCorreo2} 
                                            disabled={estadoItemTel === '' ? true : false}
                                        >
                                            <i className="fas fa-trash"></i> Eliminar
                                        </Button>
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col>
                                        <label className="small font-weight-bold">Lista de Teléfonos:</label>
                                        <ListGroup variant="flush" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                            {basico.contactoTerceroLista.map((e: any, index: number) => {
                                                // Verificar si este uni_ideregistro corresponde a un tipo de teléfono
                                                const esTelefono = contactoTerceroUnidades.some(u => 
                                                    u.uni_ideregistro === e.uni_ideregistro && u.uni_codigo1.indexOf("TEL") >= 0
                                                ) || e.uni_codigo1.indexOf("TEL") >= 0;
                                                
                                                if(e.cont_ideregistro >= 0 && esTelefono)
                                                    return (
                                                        <ListGroup.Item 
                                                            key={e.cont_ideregistro !== 0 ? `tel-${e.cont_ideregistro}` : `tel-new-${index}`} 
                                                            action
                                                            style={{cursor:'pointer', fontSize: '0.85rem', padding: '0.5rem'}} 
                                                            onClick={() => seleccionItemContacto2(e.cont_valor)} 
                                                            active={e.cont_valor === estadoItemTel ? true : false}
                                                        >
                                                            <strong>{e.uni_nombre1}:</strong> {e.cont_valor}
                                                        </ListGroup.Item>
                                                    );
                                                return null;
                                            })}
                                            {basico.contactoTerceroLista.filter((e: any) => {
                                                const esTelefono = contactoTerceroUnidades.some(u => 
                                                    u.uni_ideregistro === e.uni_ideregistro && u.uni_codigo1.indexOf("TEL") >= 0
                                                ) || e.uni_codigo1.indexOf("TEL") >= 0;
                                                return e.cont_ideregistro >= 0 && esTelefono;
                                            }).length === 0 && (
                                                <ListGroup.Item className="text-muted text-center small">
                                                    No hay teléfonos registrados
                                                </ListGroup.Item>
                                            )}
                                        </ListGroup>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default InformacionContacto;
