import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Button, Row, Col} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { textFilter } from 'react-bootstrap-table2-filter';
import { ACCION } from '../../store/actions/TiposAcciones';
const { ExportCSVButton } = CSVExport;

/**
 * Lista detalle cumplimiento de metas por recaudo
 */
class ListDetalleMetaRE extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columnas: this.columnas
        }

    }
    
    columnas = [{
        dataField: 'mgef_nombre',
        text: 'Cliente',
        filter: textFilter({
            placeholder: 'Ingrese Cliente',
        }),
        footer: '',
        sort: true
    }, {
        dataField: 'fac_numero',
        text: 'Factura',
        filter: textFilter({
            placeholder: 'Ingrese Nro. Factura',
        }),
        footer: '',
        sort: true
    }, {
        dataField: 'mgef_segmento',
        text: 'Segmento',
        filter: textFilter({
            placeholder: 'Ingrese Segmento',
        }),
        footer: 'Totales',
        sort: true
    },{
        dataField: 'cmetr_valor_factura',
        text: 'Valor Factura',
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0),
        sort: true
    }, {
        dataField: 'cmetr_total_recaudo',
        text: 'Valor Recaudo',
        footer: columnData => columnData.reduce((acc, item) => acc + item, 0),
        sort: true
    }, {
        dataField: 'cmetr_fecha_pago',
        text: 'Fecha Pago',
        footer: '',
        sort: true
    }];

       
        
       
    /**
   * Método encargado de obtener los datos generales para el formulario del listados de novedad visita
  */
    componentDidMount() {

    }

    render() {
        const { dataDetalleCMRE } = this.props.gestionCarteraState;
        const   MyExportCSV = (props) => {
            const handleClick = () => {
              props.onExport();
            };
            return (
              <div>
                <button className="btn btn-success" onClick={ handleClick }>Exportar CSV</button>
              </div>
            );
          };
        return (
            <Fragment>
                    <h1>Lista Detalle Cumplimiento Meta por Recaudo</h1>
                    <div className="customHr">.</div>
                    <br />
                 
                <ToolkitProvider
                    keyField='cmetr_idregistro' 
                    data={dataDetalleCMRE} 
                    columns={this.state.columnas} 
                   /* exportCSV={ 
                        {
                            fileName: 'Lista_Detalle_Meta_Recaudo.csv',
                            noAutoBOM: false,
                            onlyExportFiltered: true, 
                            exportAll: false,
                            blobType: 'text/csv;charset=utf-8'
                        } 
                    }*/
                >
                    {
                        props => (
                            <div>
                                {/*<hr />
                                <MyExportCSV { ...props.csvProps } />
                                <hr />*/}
                                <BootstrapTable bootstrap4 wrapperClasses="table-responsive" 
                                    rowClasses="text-nowrap" striped bordered hover 
                                    { ...props.baseProps }
                                    pagination={paginationFactory()} 
                                    filter={filterFactory()} filterPosition="top"
                                    noDataIndication="No hay registros disponible"/>
                            </div>
                        )
                    }
                </ToolkitProvider>
              
            </Fragment>
        );
    }
}

ListDetalleMetaRE.propTypes = {
    history: PropTypes.object
};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera
});

const mapDispatchToProps = dispatch => ({
  
    listarItem() {
        dispatch({
            type: ACCION.LISTAR_ITEM,
            payload: "Listar "
        })

    }
});

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListDetalleMetaRE);
export { VistaRedux as RVistaListDetalleMetaRE };