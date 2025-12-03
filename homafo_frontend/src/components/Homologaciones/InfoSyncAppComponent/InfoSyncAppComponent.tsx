import React from "react";
import { Table, Button, Card } from "react-bootstrap";
import PaginatorWithApi from "../../../components/utils/Paginators/PaginatorWithApi";
import ModalDataInfo from "../../../components/utils/ModalDataInfo";
import Spinner from "react-loader-spinner";
import SlideFotos from "../../../components/utils/SlideFotos/SlideFotos";
import tablasGestionService from '../../../api/tablasGestion/tablasGestion';

interface IProps {
    value: number,
    permisos?: any,
}

class InfoSyncAppComponent extends React.Component<IProps, any> {
    //props
    constructor(props: IProps) {
        super(props);
        this.state = {
            showModal: false,
            isLoadingTable: true,
            isLoadingImages: true,
            data: [],
            selectedRow: null,
            imagenesActualizacion: [],
            currentImage: 0
        }
    }

    componentDidMount() {
        if (this.props.value !== undefined && this.props.value !== null) {
            this.loadListActualizacionSync(0);
        } else {
            this.setState({ data: null });
        }
    }

    loadListActualizacionSync = async (page: number) => {
        let tablasApi: tablasGestionService = new tablasGestionService();
        let response = await tablasApi.getListaActualizacionSincronizadoSuscripcion(this.props.value, page);
        await this.setState({
            data: response.data,
            isLoadingTable: false
        });
    }

    loadImagenesActualizacion = (id: number | string) => {
        let tablasApi: tablasGestionService = new tablasGestionService();
        tablasApi.getImagenesActualizacion(id).then((response) => {
            let imagenes = [];
            if (response.data !== undefined && response.data !== null) {
                imagenes = response.data.map((item, index) => ({
                    ...item,
                    id: item.id,
                    name: 'Imágen ' + parseInt(index + 1),
                    url: `data:${item.tipo};base64,${item.imagen}`,
                    tipo: item.tipo
                }));
            }
            this.setState({
                imagenesActualizacion: imagenes,
                isLoadingImages: false
            });
        });
    }

    handleShowModal = (data: any) => {
        this.setState({
            selectedRow: data,
            showModal: true
        });
        this.loadImagenesActualizacion(data.actsusIderegistro);
    };

    handleCloseModal = () => {
        this.setState({
            showModal: false,
            isLoadingImages: true,
            selectedRow: null,
            imagenesActualizacion: []
        });
    };

    render() {
        return (
            <div className="overflow-auto w-100 d-flex justify-content-center">
                <ModalDataInfo
                    show={this.state.showModal}
                    onHide={this.handleCloseModal}
                    variant="primary"
                    title={"Imágenes " + this.state.selectedRow?.actsusTipo}
                    size="lg"
                >
                    <div className="row flex-column align-items-center">
                        <div className="mt-3 col-10">
                            <Card>
                                <Card.Header>Observación</Card.Header>
                                <Card.Body>
                                    <p>
                                        {this.state.selectedRow?.observacion}
                                    </p>
                                </Card.Body>
                            </Card>
                        </div>
                        {
                            this.state.isLoadingImages === true
                                ? (
                                    <div className="mt-3 col-8 d-flex justify-content-center align-items-center">
                                        <Spinner
                                            type="Oval"
                                            color="#007bff"
                                            height={35}
                                            width={55}
                                            strokeWidth={30}
                                        />
                                    </div>
                                ) : (
                                    <div className="mt-3 col-6 d-flex justify-content-center text-center">
                                        {
                                            this.state.imagenesActualizacion && this.state.imagenesActualizacion.length > 0
                                                ? (
                                                    <SlideFotos fotosList={this.state.imagenesActualizacion} />
                                                ) : (
                                                    <h3 className="bold text-danger">No hay imágenes a la suscripción</h3>
                                                )
                                        }
                                    </div>
                                )
                        }
                    </div>
                </ModalDataInfo>
                {
                    this.state.isLoadingTable === true
                        ? <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                            <Spinner
                                type="Oval"
                                color="#007bff"
                                height={35}
                                width={55}
                                strokeWidth={30}
                            />
                        </div>
                        : this.state.data && Array.isArray(this.state.data?.content)
                            ? <div>
                                <Table striped bordered hover>
                                    <thead className="bg-primary text-white text-center">
                                        <tr>
                                            <th>IdOperario</th>
                                            <th>IdRegistro</th>
                                            <th>Fecha Actualizacion</th>
                                            <th>IdSuscripcion</th>
                                            <th>CodigoAseo</th>
                                            <th>Imagenes</th>
                                            <th>Estado</th>
                                            <th>Proceso</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            this.state.data?.content.map((item, index) => (
                                                <tr className="text-center" key={`datoActualizar-${index}`}>
                                                    <td>{item?.usuIderegistro}</td>
                                                    <td>{item?.actsusIderegistro}</td>
                                                    <td>{item?.actsusFecha}</td>
                                                    <td>{item?.dsusIderegistro}</td>
                                                    <td>{item?.dsusPcodigoAseo}</td>
                                                    <td>
                                                        <Button variant="primary" onClick={() => this.handleShowModal(item)}>Consultar</Button>
                                                    </td>
                                                    <td>{item?.actsusEstado === "R" ? "SINCRONIZADO" : "N/A"}</td>
                                                    <td>{item?.actsusTipo}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                                {this.state.data && Object.keys(this.state.data).length > 0 && (
                                    <PaginatorWithApi
                                        nameItems="actualizaciones"
                                        data={this.state.data}
                                        handleChangePage={this.loadListActualizacionSync}
                                    />
                                )}
                            </div>
                            : <h1 className="bold text-danger">No hay datos relacionados a la suscripción</h1>
                }
            </div>
        );
    };
};

export default InfoSyncAppComponent;
