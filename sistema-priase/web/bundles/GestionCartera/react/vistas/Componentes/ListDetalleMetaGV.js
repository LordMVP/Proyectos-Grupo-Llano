import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Button, Row, Col} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import ToolkitProvider, { ColumnToggle, CSVExport } from 'react-bootstrap-table2-toolkit';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { textFilter } from 'react-bootstrap-table2-filter';
import { ACCION } from '../../store/actions/TiposAcciones';
const { ExportCSVButton } = CSVExport;

/**
 * Lista detalle  cumplimiento de metas por gestion visita
 */
class ListDetalleMetaGV extends Component {

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
        sort: true
    },{
        dataField: 'gvis_numeroradicado',
        text: 'Radicado',
        sort: true
    }, {
        dataField: 'mege_descripcion',
        text: 'Novedad',
        filter: textFilter({
            placeholder: 'Ingrese Novedad',
        }),
        sort: true
    },  {
        dataField: 'gvis_fechavisita',
        text: 'Fecha Visita',
        sort: true
    }];

       
        
       
    /**
   * Método encargado de obtener los datos generales para el formulario del listados de novedad visita
  */
    componentDidMount() {

    }

    render() {
        const { dataDetalleCMGV } = this.props.gestionCarteraState;
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
                
                    <h1>Lista Detalle Cumplimiento Meta por Gestión Visita</h1>
                    <div className="customHr">.</div>
                    <br />
                 
                <ToolkitProvider
                    keyField='cmetv_idregistro' 
                    data={dataDetalleCMGV} 
                    columns={this.state.columnas} 
                    /*exportCSV={ 
                        {
                            fileName: 'Lista_Detalle_Metas_Visitas.csv',
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

ListDetalleMetaGV.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ListDetalleMetaGV);
export { VistaRedux as RVistaListDetalleMetaGV };