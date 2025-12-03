import React, { Component, Fragment } from 'react';
import connect from "react-redux/es/connect/connect";
import { Button, Form, Col, Dropdown, Nav, Row } from "react-bootstrap";
import ReactTable from 'react-table-6'
import { postServiceR } from '../../../store/actions/Utils'
import RUTAS_API from '../../../global/rutas_api'


export default class DetalleConsolidado extends Component {
    constructor(props) {
        super(props);
        this.state = {
            terIderegistro: undefined
        }

    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {
        if (prevProps.row != this.props.row) {
            this.setState({ terIderegistro: !!this.props.row && this.props.row.terIderegistro });
            !!this.props.periodosFacturadosE &&
                !!this.props.periodosConsolidadosE &&
                !!this.props.row.terIderegistro &&
                this.getDetalle();

        }

    }

    getDetalle = async (e) => {
        console.log("entró al servicio", this.props)
        const params = {
            perIderegistro: this.props.periodosFacturadosE,
            prlIderegistro: this.props.periodosConsolidadosE,
            terIderegistro: [this.props.row.terIderegistro],
            statePerE:this.props.statePerE
        }
        await this.props.postServiceR(
            RUTAS_API.COAP_CONSOLIDADOAPRO.CONSULTA_DETALLE_RESUMEN_CONSOLIDADO,
            params,
            {},
            "listaDetalle"
        )
    };

    render() {
        const { banDetalle, handleRegresar, row } = this.props;
        //const {} = this.state
        const columns = [
            {
                Header: "Periodo Prestación",
                accessor: "fechaPrestacion",
                minWidth: 150,
                headerClassName: "headerTableTextStyle",
            },
            {
                Header: "Periodo liquidación",
                accessor: "fechaFacturacion",
                minWidth: 150,
                headerClassName: "headerTableTextStyle",
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
        ]

        return (
            <Fragment>
                {banDetalle && <h2 className="mt-3" >Detalle resumen proceso</h2> }
                {banDetalle && <hr></hr> }
                {banDetalle && <Row>
                    <Col xs={6}>
                        <div className="mt-3 d-flex ">
                            <Button className="ml-2" onClick={handleRegresar}>Regresar</Button>
                        </div>
                    </Col>
                </Row>}
                {banDetalle && row && !!this.props.detalleConsolidadoLista && this.props.detalleConsolidadoLista.data && <ReactTable className="mt-3"
                    data={this.props.detalleConsolidadoLista.data}
                    columns={columns}
                    defaultPageSize={5}
                    //page={this.state.page}
                    onPageChange={(page) => this.setState({ page })}
                // onFetchData={(state, instance) => {
                //     this.consultaConsolidadoFac(state.page, state.pageSize)
                // }}
                />}
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    detalleConsolidadoLista: state.Utils.listaDetalle,
    row: state.Items.row
});

const mapDispatchToProps = {
    postServiceR

}

export const RDetalleConsolidado = connect(
    mapStateToProps,
    mapDispatchToProps
)(DetalleConsolidado)