import React, { useState, useEffect } from 'react'
import ReactTable from 'react-table-6';

const TablaHistorico = ({ setMostrarTabla, periodoSeleccionado, setPeriodoSeleccionado, dataTablaHistorico, setNumeroActualizacionSeleccionado, numeroActualizacionSeleccionado }) => {
    const [tablaHistorico, setTablaHistorico] = useState([]);
    const [conceptoSelected, setConceptoSelected] = useState({});

    useEffect(() => {
        console.log('Tabla');
        setTablaHistorico(dataTablaHistorico);
    }, []);

    const changueValue = (event) => {
        setNumeroActualizacionSeleccionado(event);
        setPeriodoSeleccionado(periodoSeleccionado);
        sessionStorage.setItem('nroRecalculo', event);
        sessionStorage.setItem('idPeriodo', periodoSeleccionado);
    };
    
    const columnsTable = [
        {
            Header: "N. RECALCULO",
            accessor: "nroRecalculo",
        },
        {
            Header: "FECHA CERTIFICACIÓN",
            accessor: "fechaCertificacion",
        },
        {
            Header: "OBSERVACION",
            accessor: "observacion",
        },
        {
            Header: "Detalle",
            accessor: "detalle",
        }
    ];

    return (
        <div>
            {
                tablaHistorico.length > 0 &&
                <div className='tablaHistorico'>
                    <div className='m-3 mb-1 text-center'><strong> {' Histórico '} </strong></div>

                    <ReactTable
                        className='ml-6 mr-6'
                        columns={columnsTable}
                        data={tablaHistorico}
                        showPaginationBottom={false}
                        defaultPageSize={tablaHistorico.length}
                        getTrProps={(state, rowInfo, column, instance) => {
                            if (rowInfo && rowInfo.row) {
                                return {
                                    onClick: (e) => {
                                        e.preventDefault();
                                        setConceptoSelected(rowInfo.original);
                                        changueValue(rowInfo.original.nroRecalculo);
                                    },
                                    style: {
                                        cursor: 'pointer',
                                        border: rowInfo.original.index === conceptoSelected.index ? '1px green solid' : 'unset'
                                    }
                                }
                            } else {
                                return {}
                            }
                        }}
                    />

                </div>
            }
        </div>
    );
};

export default TablaHistorico;
