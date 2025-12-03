import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Modal, Form } from "react-bootstrap";
import Select from "react-select";

type Facturacion = {
    color: string;
    nombre: string;
    orden: string;
};

type Barrio = {
    idbarrio: any;
    llave: any;
    valor: string;
};

type General = {
    llave: any;
    valor: string;
};

type Marcacion = {
    uniConcepto: number;
    orden: number;
    nombre: string;
};

const dot = (color = 'transparent') => ({
    alignItems: 'center',
    display: 'flex',
    ':before': {
        backgroundColor: color,
        borderRadius: 10,
        content: '" "',
        display: 'block',
        marginRight: 8,
        height: 10,
        width: 10,
    },
});

const customStyles: any = {
    control: (provided) => ({
        ...provided,
        backgroundColor: "white",
    }),
    option: (provided, state) => ({
        ...provided,
        ...dot(state.data.color),
        backgroundColor: state.isSelected
            ? "#e6f7ff"
            : state.isFocused
                ? "#f0f0f0"
                : "white",
        color: "black",
    }),
    singleValue: (provided, { data }) => ({
        ...provided,
        ...dot(data.color),
    }),
};

interface Props {
    showModal: boolean;
    setShowModal: (boolean) => void;
    selectedRow?: any;
    handleSave: (formData) => void;
    listaUnidadesEdit?: any;
    listaBarriosAseo?: any;
}

function ModalEditForm(props: Props) {
    const { showModal, setShowModal, selectedRow, handleSave, listaUnidadesEdit, listaBarriosAseo } = props;

    const [formData, setFormData] = useState<any>(null);

    const [facturacion, setFacturacion] = useState<Facturacion[]>([]);
    const [barrios, setBarrios] = useState<Barrio[]>([]);
    const [actividadesComerciales, setActividadesComerciales] = useState<General[]>([]);
    const [tiposUsos, setTiposUsos] = useState<General[]>([]);
    const [estratos, setEstratos] = useState<General[]>([]);
    const [tiposLiquidaciones, setTiposLiquidaciones] = useState<General[]>([]);
    const [marcaciones,setMarcaciones] = useState<Marcacion[]>([]);

    const opcionesServicioEmsa = [{ label: "SI", value: "EMSA" }, { label: "NO", value: "" }];
    const opcionesServicioGas = [{ label: "SI", value: "GAS" }, { label: "NO", value: "" }];
    const opcionesTipoDocumento = [{ label: "Seleccionar", value: "" },{ label: "CC", value: "CC" }, { label: "NIT", value: "NIT" }];
    const opcionesZonas = [{ label: "Seleccionar", value: "" },{ label: "URBANA", value: "U" }, { label: "RURAL", value: "R" }];
    
    const loadSelectors = () => {
        setFacturacion(listaUnidadesEdit.tipoFacturacion);
        setBarrios(listaBarriosAseo);
        setActividadesComerciales(listaUnidadesEdit.actsComercial);
        setTiposUsos(listaUnidadesEdit.tiposUso);
        setEstratos(listaUnidadesEdit.estratos);
        setTiposLiquidaciones(listaUnidadesEdit.liquidaciones);
        setMarcaciones(listaUnidadesEdit.marcacionLiquidacion);
    }

    const handleInputChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setFormData({ ...formData, [name]: value });
        
    };

    const handleSelectChange = (name, value) => {
        console.log("Select",name,value);

        switch(name) {
            case "servicioEmsa":
                setFormData({
                    ...formData,
                    [name]: value,
                    medidorAlternoEmsa: "",
                    codigoAlternoEmsa: "",
                });
                break;
            case "servicioGas":
                setFormData({
                    ...formData,
                    [name]: value,
                    medidorAlternoGas: "",
                    codigoAlternoGas: "",
                });
                break;
            default:
                setFormData({ ...formData, [name]: value });
                break;
        }
    };

    const handleCheckboxChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        let checked = e.target.checked;
        console.log("checked",name,checked,value);
        if(checked){
            setFormData({ ...formData, [name]: value });
        }else{
            setFormData({ ...formData, [name]: null });
        }
    };

    useEffect(() => {
        if (listaUnidadesEdit && listaBarriosAseo) {
            loadSelectors()
        }
    }, [listaUnidadesEdit, listaBarriosAseo]);

    useEffect(() => {
        if (selectedRow) {
            console.log(selectedRow);
            let formDataRaw = {
                actsusIderegistro: selectedRow.actsusIderegistro,
                fechaEncuesta: selectedRow.fechaEncuesta,
                usuIderegistro: selectedRow.usuIderegistro,
                facturacion: selectedRow.facturacion,
                terNombre: selectedRow.terNombre,
                terTipoDocumento: selectedRow.terTipoDocumento,
                terDocumento: selectedRow.terDocumento,
                terTelcelular: selectedRow.terTelcelular,
                terCorreo: selectedRow.terCorreo,
                proDireccion: selectedRow.proDireccion,
                proZona: selectedRow.proZona,
                mubaSector: selectedRow.mubaSector,
                proSeccion: selectedRow.proSeccion,
                proManzana: selectedRow.proManzana,
                uniBarrio: selectedRow.barrio?.llave,
                uniComplemento: selectedRow.complemento?.llave,
                nomEstablecimiento: selectedRow.nomEstablecimiento,
                uniActcomercial: selectedRow.actComercial?.llave,
                proCatestrato: selectedRow.estrato?.llave,
                uniTipusosus: selectedRow.tipUsosus?.llave,
                uniLiquidacion: selectedRow.liquidacion?.llave,
                proNumcatastral: selectedRow.proNumcatastral,
                proNumcatastralnacional: selectedRow.proNumcatastralnacional,
                servicioEmsa: selectedRow?.actsusAlterna?.find(alterna => alterna.servicio_alterno === "EMSA")?.servicio_alterno ?? "",
                medidorAlternoEmsa: selectedRow?.actsusAlterna?.find(alterna => alterna.servicio_alterno === "EMSA")?.medidor_alterno ?? "",
                codigoAlternoEmsa: selectedRow?.actsusAlterna?.find(alterna => alterna.servicio_alterno === "EMSA")?.codigo_alterno ?? "",
                servicioGas: selectedRow?.actsusAlterna?.find(alterna => alterna.servicio_alterno === "GAS")?.servicio_alterno ?? "",
                medidorAlternoGas: selectedRow?.actsusAlterna?.find(alterna => alterna.servicio_alterno === "GAS")?.medidor_alterno ?? "",
                codigoAlternoGas: selectedRow?.actsusAlterna?.find(alterna => alterna.servicio_alterno === "GAS")?.codigo_alterno ?? "",
                deshabitado: selectedRow?.conceptosLiquidacion?.deshabitado,
                descuento_pap: selectedRow?.conceptosLiquidacion?.descuento_pap,
                observacion: selectedRow.observacion
            };
            console.log(opcionesServicioEmsa.map((item) => ({
                ...item,
                label: item.label,
                value: item.value,
            })).find((f) => f.value === formDataRaw.servicioEmsa))
            setFormData(formDataRaw);
        }
    }, [selectedRow]);

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Datos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {formData && (
                    <Form>
                        <h5 className="fw-bolder text-primary mb-0">Información de Facturación</h5>
                        <hr style={{ borderTop: '2px solid black', margin: '0' }} />
                        <Form.Group>
                            <Form.Label>Fecha Encuesta <span className="text-danger">{`(*)`}</span></Form.Label>
                            <Form.Control
                                type="date"
                                name="fechaEncuesta"
                                value={formData.fechaEncuesta}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Usuario (Colaborador) <span className="text-danger">{`(*)`}</span></Form.Label>
                            <Form.Control
                                type="number"
                                name="usuIderegistro"
                                value={formData.usuIderegistro}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Facturación <span className="text-danger">{`(*)`}</span></Form.Label>
                            <Select
                                name="facturacion"
                                options={facturacion.map((item) => ({
                                    ...item,
                                    label: item.nombre,
                                    value: item.nombre,
                                }))}
                                value={facturacion.map((item) => ({
                                    ...item,
                                    label: item.nombre,
                                    value: item.nombre,
                                })).find((f) => f.value === (formData.facturacion ?? "")) || null}
                                onChange={(item) => handleSelectChange("facturacion", item?.value)}
                                placeholder="Selecciona la facturación..."
                                styles={customStyles}
                                isSearchable
                            />
                        </Form.Group>

                        <h5 className="fw-bolder text-primary mb-0">Información del Cliente</h5>
                        <hr style={{ borderTop: '2px solid black', margin: '0' }} />
                        <Form.Group>
                            <Form.Label>Nombres Completos <span className="text-danger">{`(*)`}</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="terNombre"
                                value={formData.terNombre}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Tipo Documento <span className="text-danger">{`(*)`}</span></Form.Label>
                            <Select
                                name="terTipoDocumento"
                                options={opcionesTipoDocumento}
                                value={opcionesTipoDocumento.find((f) => f.value === (formData.terTipoDocumento ?? "")) || null}
                                onChange={(item) => handleSelectChange("terTipoDocumento", item?.value)}
                                placeholder="Selecciona el tipo documento..."
                                styles={customStyles}
                                isSearchable={false}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Número Documento <span className="text-danger">{`(*)`}</span></Form.Label>
                            <Form.Control
                                type="number"
                                name="terDocumento"
                                value={formData.terDocumento}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="number"
                                name="terTelcelular"
                                value={formData.terTelcelular}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                name="terCorreo"
                                value={formData.terCorreo}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <h5 className="fw-bolder text-primary mb-0">Información del Predio</h5>
                        <hr style={{ borderTop: '2px solid black', margin: '0' }} />
                        <Form.Group>
                            <Form.Label>Dirección <span className="text-danger">{`(*)`}</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="proDireccion"
                                value={formData.proDireccion}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Zona <span className="text-danger">{`(*)`}</span></Form.Label>
                            <Select
                                name="proZona"
                                options={opcionesZonas}
                                value={opcionesZonas.find((f) => f.value === (formData.proZona ?? "")) || null}
                                onChange={(item) => handleSelectChange("proZona", item?.value)}
                                placeholder="Selecciona la zona..."
                                styles={customStyles}
                                isSearchable={false}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Sector</Form.Label>
                            <Form.Control
                                type="number"
                                name="mubaSector"
                                value={formData.mubaSector}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Sección</Form.Label>
                            <Form.Control
                                type="number"
                                name="proSeccion"
                                value={formData.proSeccion}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Manzana</Form.Label>
                            <Form.Control
                                type="number"
                                name="proManzana"
                                value={formData.proManzana}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Barrio <span className="text-danger">{`(*)`}</span></Form.Label>
                            <Select
                                name="uniBarrio"
                                options={barrios.map((item) => ({
                                    ...item,
                                    label: item.valor,
                                    value: item.llave,
                                }))}
                                value={barrios.map((item) => ({
                                    ...item,
                                    label: item.valor,
                                    value: item.llave,
                                })).find((f) => f.value === (formData.uniBarrio ?? "")) || null}
                                onChange={(item) => handleSelectChange("uniBarrio", item?.value)}
                                placeholder="Selecciona un barrio..."
                                isSearchable
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Nombre Establecimiento</Form.Label>
                            <Form.Control
                                type="text"
                                name="nomEstablecimiento"
                                value={formData.nomEstablecimiento}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Actividad Comercial</Form.Label>
                            <Select
                                name="uniActcomercial"
                                options={actividadesComerciales.map((item) => ({
                                    ...item,
                                    label: item.valor,
                                    value: item.llave,
                                }))}
                                value={actividadesComerciales.map((item) => ({
                                    ...item,
                                    label: item.valor,
                                    value: item.llave,
                                })).find((f) => f.value === (formData.uniActcomercial ?? "")) || null}
                                onChange={(item) => handleSelectChange("uniActcomercial", item?.value)}
                                placeholder="Selecciona una actividad comercial..."
                                isSearchable
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Estrato <span className="text-danger">{`(*)`}</span></Form.Label>
                            <Select
                                name="proCatestrato"
                                options={estratos.map((item) => ({
                                    ...item,
                                    label: item.valor,
                                    value: parseInt(item.llave),
                                }))}
                                value={estratos.map((item) => ({
                                    ...item,
                                    label: item.valor,
                                    value: parseInt(item.llave),
                                })).find((f) => f.value === (formData.proCatestrato ?? "")) || null}
                                onChange={(item) => handleSelectChange("proCatestrato", item?.value)}
                                placeholder="Selecciona un estrato..."
                                isSearchable={false}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Tipo Uso <span className="text-danger">{`(*)`}</span></Form.Label>
                            <Select
                                name="uniTipusosus"
                                options={tiposUsos.map((item) => ({
                                    ...item,
                                    label: item.valor,
                                    value: item.llave,
                                }))}
                                value={tiposUsos.map((item) => ({
                                    ...item,
                                    label: item.valor,
                                    value: item.llave,
                                })).find((f) => f.value === (formData.uniTipusosus ?? "")) || null}
                                onChange={(item) => handleSelectChange("uniTipusosus", item?.value)}
                                placeholder="Selecciona un tipo de uso..."
                                isSearchable
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Liquidación <span className="text-danger">{`(*)`}</span></Form.Label>
                            <Select
                                name="uniLiquidacion"
                                options={tiposLiquidaciones.map((item) => ({
                                    ...item,
                                    label: item.valor,
                                    value: item.llave,
                                }))}
                                value={tiposLiquidaciones.map((item) => ({
                                    ...item,
                                    label: item.valor,
                                    value: item.llave,
                                })).find((f) => f.value === (formData.uniLiquidacion ?? "")) || null}
                                onChange={(item) => handleSelectChange("uniLiquidacion", item?.value)}
                                placeholder="Selecciona una liquidación..."
                                isSearchable
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Número Catastral</Form.Label>
                            <Form.Control
                                type="number"
                                name="proNumcatastral"
                                value={formData.proNumcatastral}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Número Catastral Nacional</Form.Label>
                            <Form.Control
                                type="number"
                                name="proNumcatastralnacional"
                                value={formData.proNumcatastralnacional}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Servicio EMSA</Form.Label>
                            <Select
                                name="servicioEmsa"
                                options={opcionesServicioEmsa}
                                value={opcionesServicioEmsa.find((f) => f.value === (formData.servicioEmsa ?? "")) || null}
                                onChange={(item) => handleSelectChange("servicioEmsa", item?.value)}
                                placeholder="Selecciona una opción..."
                                isSearchable={false}
                            />
                        </Form.Group>
                        {
                            formData.servicioEmsa === "EMSA" ? (
                                <Form.Group>
                                    <Form.Label>Número Medidor Alterno Energía</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="medidorAlternoEmsa"
                                        value={formData.medidorAlternoEmsa}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            ) : <></>
                        }
                        {
                            formData.servicioEmsa === "EMSA" ? (
                                <Form.Group>
                                    <Form.Label>Código Alterno Energía</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="codigoAlternoEmsa"
                                        value={formData.codigoAlternoEmsa}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            ) : <></>
                        }
                        <Form.Group>
                            <Form.Label>Servicio GAS</Form.Label>
                            <Select
                                name="servicioGas"
                                options={opcionesServicioGas}
                                value={opcionesServicioGas.find((f) => f.value === (formData.servicioGas ?? "")) || null}
                                onChange={(item) => handleSelectChange("servicioGas", item?.value)}
                                placeholder="Selecciona una opción..."
                                isSearchable={false}
                            />
                        </Form.Group>
                        {
                            formData.servicioGas === "GAS" ? (
                                <Form.Group>
                                    <Form.Label>Número Medidor Alterno Gas</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="medidorAlternoGas"
                                        value={formData.medidorAlternoGas}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            ) : <></>
                        }
                        {
                            formData.servicioGas === "GAS" ? (
                                <Form.Group>
                                    <Form.Label>Código Alterno Gas</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="codigoAlternoGas"
                                        value={formData.codigoAlternoGas}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            ) : <></>
                        }
                        <Form.Group>
                            {marcaciones.sort((a, b) => a.orden - b.orden) // ordena por "orden"
                                .map((item) => (
                                    item.nombre !== "AFORADO" ? (
                                    <Form.Check
                                        key={item.orden}
                                        type="checkbox"
                                        label={item.nombre}
                                        name={item.nombre.toLowerCase()}
                                        value={item.uniConcepto}
                                        checked={formData[item.nombre.toLowerCase()] !== null}
                                        onChange={handleCheckboxChange}
                                    />
                                    ) : <></>
                                ))}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Observación</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="observacion"
                                value={formData.observacion}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Escribe una observación..."
                            />
                        </Form.Group>
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={()=>{handleSave(formData)}}>
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

const mapStateToProps = ({ tablasGestion }) => ({
    listaUnidadesEdit: tablasGestion.listaUnidadesEdit,
    listaBarriosAseo: tablasGestion.listaBarriosAseo,
})

const mapDispatchToProps = () => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditForm);