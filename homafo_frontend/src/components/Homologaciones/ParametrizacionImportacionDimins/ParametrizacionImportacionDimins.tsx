import React from 'react';
import parametrosApi from '../../../api/homologaciones/ParParametrosApi';
import { Row, Col, Button, Accordion, Card } from 'react-bootstrap';
import { TableHeaderColumn } from 'react-bootstrap-table';
import ParametrizacionDetalleDimins from '../../../components/Homologaciones/ParametrizacionDetalleDimins/ParametrizacionDetalleDimins';
import update from 'immutability-helper';

interface IProps {
    value?: any,
    informacion: any,
    cambioDetalle: (e: any) => void,
}

class ParametrizacionImportacionDimins extends React.Component<IProps, any>
{
    constructor(props: IProps) {
        super(props);
        this.state = {
            cargando: false,
            estadoLista: false,
            lista: [],
            listaEncabezado: ['tabla', 'orden'],
            seleccion: '',
            seleccionTabla: ''
        }
        this.getEncabezado = this.getEncabezado.bind(this);
        this.formatoBotton = this.formatoBotton.bind(this);
    }

    async componentDidMount() {
        await this.cargarParametros();
        await this.cargarDefecto();
        await this.setState({
            lista: this.props.informacion
        });
        //console.log('que llego de empresas ',this.state.lista);
    }

    cargarParametros = async () => {
        let paraApi: parametrosApi = new parametrosApi();
        let tmp = await paraApi.listaParametros();
        await this.setState({
            parametros: tmp.data
        })
    }

    cargarDefecto = async () => {
    }

    async cambioValor(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
        const { value, name } = e.target;
        await this.setState({
            detalle: {
                ...this.state.detalle, [name]: value
            }
        })
    }

    formatoBotton(cell: any, row: any) {
        return <Button variant="outline-danger" key={cell} onClick={this.seleccion.bind(this, row)}>Eliminar</Button>;
    }

    async seleccion(e: any) {
        let filtro = this.state.lista.filter(item => item.tabla !== e.tabla)
        await this.setState({
            lista: filtro
        })
        //await this.props.eliminarDetalle(this.state.lista);
    }

    agregarColumna = async () => {
        let tmp = this.state.lista;
        tmp.push(this.state.detalle);
        await this.setState({
            lista: tmp,
            detalle: {
                tabla: '',
                orden: 0,
                json: ''
            }
        })
        //await this.props.agregarDetalle(this.state.lista);
    }

    editarDetalle = async (e) => {
        //console.log('que tabla selecciono ',e);
        //console.log('que tien la lista ',this.state.lista);
        await this.setState({
            seleccionTabla: e,
        })

    }

    cambioDetalle = async (e) => {
        //let valorTmp =this.state.lista.filter(item => item.tabla === this.state.seleccionTabla);
        let valorTmp = this.state.lista.filter(item => item.idImins === this.state.seleccionTabla.idImins);
        valorTmp[0].detalleDimins = e;
        //let index=this.state.lista.findIndex(item => item.tabla === this.state.seleccionTabla);
        let index = this.state.lista.findIndex(item => item.idImins === this.state.seleccionTabla.idImins);
        let updateRegistro = update(this.state.lista, { $splice: [[index, 1, valorTmp[0]]] });
        await this.setState({
            lista: updateRegistro
        })
        this.props.cambioDetalle(this.state.lista);
    }

    getEncabezado() {
        //var encabezado = ['CODIGO','UBICACION','ESTRATO','MUNICIPIO','NOMBRE','IDENTIFICACION','DIRECCION','CICLO'];
        var encabezado = this.state.listaEncabezado;
        return encabezado.map((row: any, index: number) => {
            var tmp = row;
            var tmp2 = tmp.lastIndexOf(".");
            if (tmp2 > 0) {
                let nombre1 = row.substring(0, tmp2);
                return <TableHeaderColumn key={index} dataAlign="center" dataField={nombre1} dataFormat={this.formatoGeneral2} dataSort={true} >
                    {nombre1}
                </TableHeaderColumn>
            }
            else {
                return <TableHeaderColumn key={index} dataAlign="center" dataField={row} dataSort={true}>
                    {row}
                </TableHeaderColumn>
            }
        })
    }

    formatoGeneral2(cell: any) {
        let resultado = '';
        for (let tmp in cell) {
            if (typeof cell[tmp] === 'string') {
                resultado = cell[tmp];
            }
        }
        return resultado;


    }

    handleExpand = async (rowKey, isExpand) => {
        //this.expandedRows[rowKey] = isExpand;
        //console.log('que seleccione...'+rowKey);
        //console.log('que seleccione2...'+isExpand);
        if (isExpand) {
            await this.setState({
                busqueda: [],
                seleccion: rowKey
            })
            //await this.cargarBarrios();
            //this.actualizarSeleccion(rowKey);
        }
        else {
            await this.setState({
                busqueda: []
            })
        }
    }

    cargarDetalle = (e): any => {
        return (
            <div>
                <Row>
                    <Col>
                        <div className="form-group">
                            <label >Json Consulta</label>
                            <input className="form-control" name='json' value={e.json} type='text' disabled={true} />
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

    render() {

        return (
            <div>

                <Accordion>
                    {this.state.lista.map((e: any, key: string) => {
                        return (
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey={e.idImins} onClick={() => this.editarDetalle(e)}>
                                        Tabla N {key+1} - [ {e.tabla} ] - (Click detalles)
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey={e.idImins}>
                                    <Card.Body>
                                        <ParametrizacionDetalleDimins informacion={e.detalleDimins} cambioValor={this.cambioDetalle} />
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        )
                    })}
                </Accordion>

            </div>
        )
    }

}
export default ParametrizacionImportacionDimins;