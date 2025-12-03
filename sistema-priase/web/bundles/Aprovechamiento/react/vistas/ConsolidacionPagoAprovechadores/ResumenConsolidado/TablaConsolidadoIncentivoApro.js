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

export default class TablaConsolidadoIncentivoApro extends Component {
    constructor(props) {
        super(props);

        this.state = {
            periodosConsolidadosV: [],
            resumenConsolidadoV: [],
            periodosConsolidadosE: [],
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

    submitHandler = async (e) => {
        e.preventDefault()
        e.stopPropagation();
        const { periodosConsolidadosE, statePerE } = this.state;
        const params = {
            prlIderegistro: periodosConsolidadosE,
            estado: statePerE
        }
        await this.props.postServiceR(
            RUTAS_API.COAP_CONSOLIDADOAPRO.CONSULTA_RESUMEN_CONSOLIDADO_INCENTIVO_APRO,
            params,
            {},
            "resumenConsolidadoList"
        )
    }

    handlePeriodo = (e) => {
        this.setState({ periodosConsolidadosV: e })
        const evento = prepairIdParam(e)
        const state = prepairStateParam(e)
        this.setState({ periodosConsolidadosE: evento })
        this.setState({ statePerE: state })
        this.setState({ banPeriodosFacturado: true })
    }

    consultaConsolidadoFac = async (page, pageSize, mostrarTabla) => { }

    handleRegresar = (e) => {
        console.log("llegó del hijo al padre")
        this.setState({banDetalle:false})
    }

    limpiar = () => {
        this.setState({periodosConsolidadosV:""})
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
        const columnsIA = [
            {
                Header: "Tercero",
                accessor: "terNomcompleto",
                minWidth: 300,
                headerClassName: "headerTableTextStyle",
            },
            {
                Header: "Municipio",
                accessor: "municipio",
                minWidth: 180,
                headerClassName: "headerTableTextStyle",
            },
            {
                Header: "Saldo facturado",
                accessor: "coapSaldoFactIa",
                minWidth: 150,
                headerClassName: "headerTableTextStyle",
            },
            {
                Header: "Cambios valor corriente",
                accessor: "coapCambioVlrCteIa",
                minWidth: 180,
                headerClassName: "headerTableTextStyle",
            },
            {
                Header: "Pago corriente",
                accessor: "coapPagoCteIa",
                minWidth: 150,
                headerClassName: "headerTableTextStyle",
            },
            {
                Header: "Cambios valor pago corriente",
                accessor: "coapCambioVlrPagoCteIa",
                minWidth: 180,
                headerClassName: "headerTableTextStyle",
            },
            {
                Header: "Valores castigados",
                accessor: "coapVlrCastigadoIa",
                minWidth: 180,
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
                    columns={columnsIA }
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
    resumenConsolidado: state.Utils.resumenConsolidadoList

});

const mapDispatchToProps = {
    consultaGetAprovechamiento,
    savePostService,
    postServiceR,
    saveItem
}

export const RTablaConsolidadoIncentivoApro = connect(
    mapStateToProps,
    mapDispatchToProps
)(TablaConsolidadoIncentivoApro);
