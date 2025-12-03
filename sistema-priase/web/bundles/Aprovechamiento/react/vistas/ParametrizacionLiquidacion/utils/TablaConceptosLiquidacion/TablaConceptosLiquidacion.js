import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";
import ReactTable from 'react-table-6'
import { Button, Form, Col, Row } from "react-bootstrap";
import RModalDetalleConceParam from '../Modals/ModalDetalleConceParam'
import ModalCambioDatos from "../Modals/ModalCambioDatos"
import {
  saveConsultaGetAprovechamiento, savePostService, postServiceR, consultaGetAprovechamiento,
} from "../../../../store/actions/Utils";
import RUTAS_API from "../../../../global/rutas_api";
import { PROGRAMAS } from "../../../../global/constantes"
import { messageService } from '../Services/serviceLiquidacion.service';
import { saveItem } from '../../../../store/actions/Items'


export default class TablaConceptosLiquidacion extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      listaConceptosAprovState: this.props.listaConceptosAprov,
      openModalConceptosParam: false,
      row: "",
      openModalEliminar: false,
      search: "",
      admin: this.props.admin ,
      apro: "1",
      data: [],
      paginas: "",
      pageSize: 5,
      mostrarTabla: 1


    }
  }

  componentDidMount() {
    this.validarPermisosUsuario();
    console.log(" VALIDANDO PERMISOS ::::::::::::::::::::::: ")
    console.log(this.props) 
    this.ejecutarSubscripcion();
  }

  ejecutarSubscripcion = () => {
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message) {
        this.setState({ page: 0, pageSize: this.tableApro.state.pageSize, search: "" },
          () => { this.listConceptosAprovechamiento(message.text, this.state.page, this.state.pageSize) });
      }
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  listConceptosAprovechamiento = async (apro, page, size) => {
    const { search } = this.state;
    let respuesta = {};
    this.props.saveConsultaGetAprovechamiento(undefined, "listaConceptosAprov")
    respuesta = await this.props.consultaGetAprovechamiento(
      RUTAS_API.COLI_CONLIQUIDA_APROVECHAMIENTO.CONSULTA_CONCEPTOS_LIQU,
      { search, apro, page, size },
      {},
      "listaConceptosAprov"
    );
    this.setState({
      paginas: !!respuesta.totalPages ? respuesta.totalPages : 0,
      data: !!respuesta.content ? respuesta.content : [], page: page
    })
  }


  consultaConceposAprov = (page, pageSize) => {
    this.listConceptosAprovechamiento(!!this.props.mostrarTabla ? this.props.mostrarTabla : this.state.apro, page, pageSize);
  }

  cargarConceptosSuscripcion = (row) => {
    this.setState({ row: row, openModalConceptosParam: true })
    this.props.saveItem(true, "cerrarModalEditar")
  }

  eliminarConceptosSuscripcion = (row) => {
    this.setState({ row: row, openModalEliminar: true })
  }

  /**
   * Método encargado de cerrar el modal de consulta del detalle de conceptos por suscripción
   */
  closeModal = () => {
    this.props.saveItem(false, "cerrarModalEditar")
  };

  cerrarModal = () => {
    this.setState({ openModalEliminar: false })
  }

  eliminarRegistro = async (e) => {
    e.preventDefault()
    e.stopPropagation();
    const { row } = this.state
    const objetoConcepto = {
      coliAprovIderegistro: row.coliAprovIderegistro,
      coliEstado: "I",
      uniConcepto: row.uniConcepto,
      uniLiquidacion: row.uniLiquidacion,
      uniPorcentaje: row.uniPorcentaje,
      uniDocumento: row.uniDocumento,
      uniTipdocument: row.uniTipdocument,
      terIderegistro: row.terIderegistro
    }
    await this.props.postServiceR(
      RUTAS_API.COLI_CONLIQUIDA_APROVECHAMIENTO.CONSULTA_INSERTAR_CONCEPTO,
      objetoConcepto,
      {},
      "objetoConcepto"
    );
    messageService.sendMessage(this.props.mostrarTabla)
    this.setState({ openModalEliminar: false })
  }

  handleChangeSearch = (e) => {
    this.setState({ search: e.target.value });
  };

  submitSearchHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.listConceptosAprovechamiento(!!this.props.mostrarTabla ? this.props.mostrarTabla : this.state.apro, 0, this.tableApro.state.pageSize);


  }

  validarPermisosUsuario = () => {
    if (this.props.mostrarTabla == 1) {
      this.props.consultaGetAprovechamiento(
        RUTAS_API.COLI_CONLIQUIDA_APROVECHAMIENTO.CONSULTA_PERMISOS,
        { idPrograma: PROGRAMAS.PAR_LIQ_APROVE },
        {},
        "permisosUsuario"
      );
    } else if (this.props.mostrarTabla == 2) {
      this.props.consultaGetAprovechamiento(
        RUTAS_API.COLI_CONLIQUIDA_APROVECHAMIENTO.CONSULTA_PERMISOS,
        { idPrograma: PROGRAMAS.PAR_LIQ_INCEN_APROVE },
        {},
        "permisosUsuario"
      );
    }
  }

  aceptarRegistroEx = () => {
    this.props.saveItem(false, "openModalActualizar")
    if (this.props.terIdRegistroValidar == "") {
      this.setState({ mostrarTablaState: 1 })
      this.listConceptosAprovechamiento(1, this.state.page, this.state.pageSize)
      this.props.saveItem(1, "mostrarTablaStateR");
    } else {
      this.setState({ mostrarTablaState: 2 })
      this.listConceptosAprovechamiento(2, this.state.page, this.state.pageSize)
      this.props.saveItem(2, "mostrarTablaStateR");
    }
  }

  render() {
    const { mostrarTablaState, row, openModalEliminar, search,  apro, paginas, data } = this.state;
    const { cerrarModalEditar, openModalActualizar, objetoConcepto } = this.props;
    const admin =  !!this.props.admin ? ( this.props.admin.data==true ? this.props.admin.data  :false )  : false  
    console.log(" RENDERIZANDO TABLA PAAMETRIZACION :: !!" + !!this.props.admin + "  !!!" + !!! this.props.admin);  
    console.log(" VALOR ADMINNNNNNNNNNNNNNNNNNNNNNNNNNNN  : "+ admin)
    const columnsA = [
      {
        Header: "Liquidación",
        accessor: "liqNombre",
        minWidth: 250,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Documento",
        accessor: "docNombre",
        minWidth: 140,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Tipo Documento",
        accessor: "tidoNombre",
        minWidth: 230,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Concepto",
        accessor: "conNombre",
        minWidth: 400,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Porcentaje",
        accessor: "uniPorcentaje",
        minWidth: 90,
        headerClassName: "headerTableTextStyle",
      },
      {
        Cell: row => {
          return (<div style={{ textAlign: "center" }}>
            { admin==true &&
              <Button
                variant="danger"
                onClick={() => this.eliminarConceptosSuscripcion(row.original)
                }>Eliminar</Button>
              }{    
              admin==true &&
              <Button className="ml-2"
                variant="primary"
                onClick={() => this.cargarConceptosSuscripcion(row.original)
                }>Editar</Button>
            }
          </div>
          )
        },
        minWidth: 170,
        headerClassName: 'headerTableTextStyle',
      }

    ];
    const columnsIA = [
      {
        Header: "Tercero",
        accessor: "terNomcompleto",
        minWidth: 250,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Municipio",
        accessor: "municipio",
        minWidth: 140,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Liquidación",
        accessor: "liqNombre",
        minWidth: 250,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Documento",
        accessor: "docNombre",
        minWidth: 140,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Tipo Documento",
        accessor: "tidoNombre",
        minWidth: 230,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Concepto",
        accessor: "conNombre",
        minWidth: 400,
        headerClassName: "headerTableTextStyle",
      },
      {
        Header: "Porcentaje",
        accessor: "uniPorcentaje",
        minWidth: 90,
        headerClassName: "headerTableTextStyle",
      },
      {
        Cell: row => {
          return (<div style={{ textAlign: "center" }}>
            { admin==true &&
              <Button
                variant="danger"
                onClick={() => this.eliminarConceptosSuscripcion(row.original)
                }>Eliminar</Button>
              }{    
              admin==true &&
              <Button className="ml-2"
                variant="primary"
                onClick={() => this.cargarConceptosSuscripcion(row.original)
                }>Editar</Button>
            }
          </div>
          )
        },
        minWidth: 170,
        headerClassName: 'headerTableTextStyle',
      }

    ]

    return (
      <Fragment>
        <h2>{apro.text}</h2>
        <h2 className="mt-3" >Parametrización actual</h2>
        <hr></hr>
        <Row>
          <Col xs={6}></Col>
          <Col xs={6}>
            <Form className="inline-form;d-flex justify-content-end" inline onSubmit={this.submitSearchHandler}>
              <Form.Group controlId="busquedaConcep">
                <Form.Label></Form.Label>
                <Form.Control
                  value={search}
                  onChange={this.handleChangeSearch}
                  type="text"
                  placeholder="Buscar"
                />
              </Form.Group>
              <Button type="submit">
                Buscar
              </Button>
            </Form>
          </Col>
        </Row>

        {<ReactTable className="mt-3"
          data={data}
          columns={this.props.mostrarTabla == 1 || mostrarTablaState == 1 ? columnsA : columnsIA}
          pages={paginas}
          defaultPageSize={5}
          ref={(r) => this.tableApro = r}
          manual
          page={this.state.page}
          onPageChange={(page) => this.setState({ page })}
          onFetchData={(state, instance) => {
            this.consultaConceposAprov(state.page, state.pageSize)
          }}
          nextText="Siguiente"
          pageText="Página"
          previousText="Anterior"
          noDataText="No se encontraron resultados"
          ofText="de"
          rowsText="Filas"
          showPageJump={false}


        />}
        {cerrarModalEditar && (
          <RModalDetalleConceParam
            row={row}
            closeModal={this.closeModal}>
          </RModalDetalleConceParam>
        )}

        {openModalEliminar &&
          <ModalCambioDatos
            cerrarModal={this.cerrarModal}
            aceptarModal={this.eliminarRegistro}
            mensaje={"¿Está seguro de realizar esta operación?"}
            titulo={"Confirmación"}
            aceptarOption={true}
            cancelarOption={true}
          />}
        {openModalActualizar && <ModalCambioDatos
          aceptarModal={this.aceptarRegistroEx}
          mensaje={objetoConcepto.data == true ? "Actualización exitoso" : "Registro ya existe en el sistema"}
          titulo={"Confirmación"}
          aceptarOption={true}
          cancelar={false}
        />}
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    admin: state.Utils.permisosUsuario,
    listaConceptosAprovR: state.Utils.listaConceptosAprov,
    cerrarModalEditar: state.Items.cerrarModalEditar,
    openModalActualizar: state.Items.openModalActualizar,
    objetoConcepto: state.Utils.objetoConcepto,
    terIdRegistroValidar: state.Items.terIdRegistroValidar,
    mostrarTablaStateR: state.Items.mostrarTablaStateR

  }
}

const mapDispatchToProps = {
  saveConsultaGetAprovechamiento,
  savePostService,
  postServiceR,
  consultaGetAprovechamiento,
  saveItem
};

export const RTablaConceptosLiquidacion = connect(
  mapStateToProps,
  mapDispatchToProps
)(TablaConceptosLiquidacion);

