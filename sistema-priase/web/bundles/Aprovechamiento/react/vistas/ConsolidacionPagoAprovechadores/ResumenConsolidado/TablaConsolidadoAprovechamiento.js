import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";
import ReactTable from 'react-table-6'
import { Button, Form, Col, Row } from "react-bootstrap";
import { FaFilePdf, FaFileExcel, FaFileCsv } from "react-icons/fa";
import RUTAS_API from "../../../global/rutas_api";
import { consultaGetAprovechamiento, savePostService, postServiceR } from "../../../store/actions/Utils";
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { prepairDataSelect, prepairId, prepairIdParam, prepairDataSelectState, prepairStateParam } from '../../Utils/StandarMethods'
const animatedComponents = makeAnimated();
import { RDetalleConsolidado } from "./DetalleConsolidado"
import {saveItem} from '../../../store/actions/Items'

export default class TablaConsolidadoFacturas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            periodosConsolidadosV: [],
            periodosFacturadosV: [],
            tercerosPeriodoV: [],
            resumenConsolidadoV: [],
            periodosConsolidadosE: [],
            periodosFacturadosE: [],
            tercerosPeriodoE: [],
            banPeriodosFacturado: false,
            banTercerosPeriodo: false,
            banEjec: false,
            statePerE: "",
            banDetalle:false,
            row : ""

        }
    }

    componentDidMount() {
        this.filtroPeriodoConsolidado();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.periodosFacturados !== this.props.periodosFacturados) {
            this.setState({periodosFacturadosV: prepairDataSelect(this.props.periodosFacturados.data, "perNombre", "perIderegistro")  },
            () => {this.tercerosPorPeriodo(prepairId(this.state.periodosFacturadosV))
                this.setState({periodosFacturadosE: prepairId(this.state.periodosFacturadosV) })
            })
        }
        if(prevProps.tercerosPeriodo !== this.props.tercerosPeriodo){
            this.setState({tercerosPeriodoV: prepairDataSelect(this.props.tercerosPeriodo.data, "terNomcompleto", "terIderegistro") },
            () => this.setState({tercerosPeriodoE: prepairId(this.state.tercerosPeriodoV) }) )
        }
    }


    filtroPeriodoConsolidado = () => {
        const {param} = this.props;
        let tipoProceso = !!param && param == 'TIPO_APROVECHAMIENTO' ? 1 : 2
        const params = {tipoProceso}
        this.props.consultaGetAprovechamiento(
            RUTAS_API.COAP_CONSOLIDADOAPRO.CONSULTA_FILTROS_PERIODO_CONSOLIDADO,
            params,
            {},
            "listaPeriodosConsolidados"
        );
    };

    filtroPeriodoFacturado = (periodoId) => {
        const params = {
            prlaIderegistro: periodoId
        }
        this.props.consultaGetAprovechamiento(
            RUTAS_API.COAP_CONSOLIDADOAPRO.CONSULTA_FILTRO_PERIODO_FACTURACION,
            params,
            {},
            "listaPeriodosFacturados"
        )
    };

    tercerosPorPeriodo = async (periodoLiq) => {
        const params = {
            perIderegistro: periodoLiq
        }
        await this.props.postServiceR(
            RUTAS_API.COAP_CONSOLIDADOAPRO.CONSULTA_TERCERO_PERIODO_FACTURACION,
            params,
            {},
            "tercerosPorPeriodo"
        )
    };

    submitHandler = async (e) => {
        e.preventDefault()
        e.stopPropagation();
        const { periodosConsolidadosE, periodosFacturadosE, tercerosPeriodoE, statePerE } = this.state;
        const params = {
            perIderegistro: periodosFacturadosE,
            prlIderegistro: periodosConsolidadosE,
            terIderegistro: tercerosPeriodoE,
            estado: statePerE
        }
        await this.props.postServiceR(
            RUTAS_API.COAP_CONSOLIDADOAPRO.CONSULTA_RESUMEN_CONSOLIDADO,
            params,
            {},
            "resumenConsolidadoList"
        )
    }

    handlePeriodo = (e) => {
        this.setState({ periodosConsolidadosV: e })
        console.log("evento", e)
        const evento = prepairIdParam(e)
        const state = prepairStateParam(e)
        this.setState({ periodosConsolidadosE: evento })
        this.setState({ statePerE: state })
        this.setState({ banPeriodosFacturado: true })
        this.filtroPeriodoFacturado(evento);
        
    }

    handlePeriodoLiq = (e) => {
        this.setState({ periodosFacturadosV: e })
        const evento = prepairId(e)
        this.setState({ periodosFacturadosE: evento })
        this.setState({ banTercerosPeriodo: true })
        this.tercerosPorPeriodo(evento);
    }

    handleTercero = (e) => {
        this.setState({ tercerosPeriodoV: e })
        const evento = prepairId(e)
        this.setState({ tercerosPeriodoE: evento })
    }

    consultaConsolidadoFac = async (page, pageSize, mostrarTabla) => { }

    obtenerDetalleConsolidado = (row) => {
        console.log("objeto",row)
        this.props.saveItem(row, "row")
        this.setState({row:row, banDetalle: true });
    }

    handleRegresar = (e) => {
        console.log("llegó del hijo al padre")
        this.setState({banDetalle:false})
    }

    limpiar = () => {
        this.setState({periodosConsolidadosV:""})
        this.setState({periodosFacturadosV:""})
        this.setState({tercerosPeriodoV:""})
        this.setState({banPeriodosFacturado: false})
    }

    render() {
        const {
            periodosConsolidadosV,
            periodosFacturadosV,
            tercerosPeriodoV,
            resumenConsolidado,
            banPeriodosFacturado,
            banTercerosPeriodo,
            banEjec,
            banDetalle,
            row,
            periodosFacturadosE,
            periodosConsolidadosE,
            statePerE
        } = this.state;
        const { param} = this.props;
        const columnsA = [
            {
                Header: "Aprovechador",
                accessor: "terNomcompleto",
                minWidth: 300,
                headerClassName: "headerTableTextStyle",
            },
            {
                Header: "Accion",
                Cell: row => {
                    return (<div style={{ textAlign: "center" }}>
                        <Button className="ml-2"
                            variant="primary"
                            onClick={() => this.obtenerDetalleConsolidado(row.original)
                            }>Detalle</Button>
                    </div>
                    )
                },
                minWidth: 100,
                headerClassName: 'headerTableTextStyle',
            },
            {
                Header: "Saldo facturación CC",
                accessor: "coapSaldoFactCc",
                minWidth: 180,
                headerClassName: "headerTableTextStyle",
            },
            {
                Header: "Saldo facturación TA",
                accessor: "coapSaldoFactTa",
                minWidth: 180,
                headerClassName: "headerTableTextStyle",
            },
            {
                Header: "Cambios vlr TA",
                accessor: "coapCambioVlrCteTa",
                minWidth: 180,
                headerClassName: "headerTableTextStyle",
            },
            {
                Header: "Pago corriente CC",
                accessor: "coapPagoCteCc",
                minWidth: 150,
                headerClassName: "headerTableTextStyle",
            },
            {
                Header: "Pago corriente TA",
                accessor: "coapPagoCteTa",
                minWidth: 150,
                headerClassName: "headerTableTextStyle",
            },
            {
                Header: "Facturado ajuste CC",
                accessor: "coapFactAjusteCc",
                minWidth: 180,
                headerClassName: "headerTableTextStyle",
            },
            {
                Header: "Facturado ajuste TA",
                accessor: "coapFactAjusteTa",
                minWidth: 180,
                headerClassName: "headerTableTextStyle",
            },
            {
                Header: "Pago ajuste CC",
                accessor: "coapPagoAjusteCc",
                minWidth: 150,
                headerClassName: "headerTableTextStyle",
            },
            {
                Header: "Pago ajuste TA",
                accessor: "coapPagoAjusteTa",
                minWidth: 150,
                headerClassName: "headerTableTextStyle",
            },
            {
                Header: "Cambios Valor Pago corriente",
                accessor: "coapCambioVlrPagoCte",
                minWidth: 230,
                headerClassName: "headerTableTextStyle",
            },
            {
                Header: "Valores castigados",
                accessor: "coapVlrCastigado",
                minWidth: 150,
                headerClassName: "headerTableTextStyle",
            },
            {
                Header: "DINC",
                accessor: "dinc",
                minWidth: 90,
                headerClassName: "headerTableTextStyle",
            },
        ];

        return (
            <Fragment>
                {!banDetalle && <h2 className="mt-3" >Resumen Proceso</h2>}
                <hr></hr> 
                {!banDetalle && <Form onSubmit={this.submitHandler} >
                    <Form.Row>                         
                        <Form.Group className="inline-form" as={Col} md="3">
                            <Form.Label>Periodo</Form.Label>
                            <Select
                                value={periodosConsolidadosV}
                                onChange={this.handlePeriodo}
                                id={"periodosConsolidadosV"}
                                options={!!this.props.periodosConsolidados ? prepairDataSelectState(this.props.periodosConsolidados.data, "perNombre", "prlIderegistro", "estado") : []}
                                label="Single select"
                                placeholder="Seleccione"   
                                noOptionsMessage={() => "No se encontraron resultados"}
                             
                            />
                        </Form.Group>
                        <Form.Group as={Col} md="3">
                            <Form.Label>Periodo Liquidación</Form.Label>
                            <Select
                                isMulti
                                value={periodosFacturadosV}
                                onChange={this.handlePeriodoLiq}
                                id={"periodosFacturadosV"}
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                options={!!this.props.periodosFacturados ? prepairDataSelect(this.props.periodosFacturados.data, "perNombre", "perIderegistro") : []}
                                isDisabled={!!!banPeriodosFacturado}
                                placeholder="Seleccione"
                                noOptionsMessage={() => "No se encontraron resultados"}


                            />
                        </Form.Group>
                         <Form.Group className="inline-form" as={Col} md="3">
                            <Form.Label>Tercero</Form.Label>
                            <Select
                                isMulti
                                as="select"
                                custom
                                value={tercerosPeriodoV}
                                onChange={this.handleTercero}
                                id={"tercerosPeriodoV"}
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                options={!!this.props.tercerosPeriodo ? prepairDataSelect(this.props.tercerosPeriodo.data, "terNomcompleto", "terIderegistro") : []}
                                isDisabled={!!!banPeriodosFacturado}
                                placeholder="Seleccione"
                                noOptionsMessage={() => "No se encontraron resultados"}

                            />
                        </Form.Group>
                        <Form.Group as={Col} md="3">
                            <Form.Label></Form.Label>
                            <Form className="inline-form"  >
                                <Button disabled={!!!banPeriodosFacturado} type="submit">Buscar</Button>
                                <Button disabled={!!!banPeriodosFacturado} onClick={this.limpiar} className="ml-2">Limpiar</Button>
                            </Form>
                        </Form.Group>
                    </Form.Row>
                </Form>}
                {/* <Row>
                    <Col xs={6}></Col>
                    <Col xs={6}>
                        <div className="d-flex justify-content-end">
                            <FaFilePdf size="3rem" color="red" />
                            <FaFileExcel size="3rem" color="green" />
                            <FaFileCsv size="3rem" />
                        </div>

                    </Col>
                </Row> */}
                {!banDetalle && !!this.props.resumenConsolidado && this.props.resumenConsolidado.data && <ReactTable className="mt-3"
                    data={this.props.resumenConsolidado.data}
                    columns={columnsA}
                    defaultPageSize={5}
                    //page={this.state.page}
                    onPageChange={(page) => this.setState({ page })}
                    onFetchData={(state, instance) => {
                        this.consultaConsolidadoFac(state.page, state.pageSize)
                    }}
                    nextText="Siguiente"
                    pageText="Página"
                    previousText="Anterior"
                    noDataText="No se encontraron resultados"
                    ofText="de"
                    rowsText="Filas"
                    showPageJump={false}


                />}
                {!banDetalle && !!this.props.resumenConsolidado && this.props.resumenConsolidado.data && <Row>
                    <Col xs={6}></Col>
                    <Col xs={6}>
                        <div className="mt-3 d-flex justify-content-end">
                            <Button type="submit">Aprobar</Button>
                            <Button className="ml-2">Descartar</Button>
                        </div>

                    </Col>
                </Row>}
                <RDetalleConsolidado banDetalle={banDetalle} periodosFacturadosE={periodosFacturadosE}
                  periodosConsolidadosE={periodosConsolidadosE} statePerE={statePerE} handleRegresar={this.handleRegresar}  ></RDetalleConsolidado>
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    periodosConsolidados: state.Utils.listaPeriodosConsolidados,
    periodosFacturados: state.Utils.listaPeriodosFacturados,
    tercerosPeriodo: state.Utils.tercerosPorPeriodo,
    resumenConsolidado: state.Utils.resumenConsolidadoList

});

const mapDispatchToProps = {
    consultaGetAprovechamiento,
    savePostService,
    postServiceR,
    saveItem
}

export const RTablaConsolidadoFacturas = connect(
    mapStateToProps,
    mapDispatchToProps
)(TablaConsolidadoFacturas);
