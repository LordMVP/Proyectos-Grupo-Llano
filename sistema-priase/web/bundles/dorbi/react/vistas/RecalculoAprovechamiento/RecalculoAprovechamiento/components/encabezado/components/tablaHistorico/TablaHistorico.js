import React, { useState, useEffect } from 'react'
import ReactTable from 'react-table-6';
import moment from 'moment';


const TablaHistorico = ({ setNumeroActualizacion, listadoHistoricoRecalculo }) => {
    const [tablaHistorico, setTablaHistorico] = useState([]);

    useEffect(() => {
        setTablaHistorico(listadoHistoricoRecalculo.map((item) => {
            return {
                nroRecalculo: item.numeroActualizacion,
                fechaCertificacion: moment(item.fechaRegistro).format('YYYY-MM-DD') || '.',
                detalle: refLink(item.numeroActualizacion)
            };
            //lista.push(elemento);
        }));
        console.log('tabla historico', tablaHistorico);
    }, []);


    const funcionPrueba = (numeroActualizacion) => {
        setNumeroActualizacion(numeroActualizacion);
    };

    const refLink = (numeroActualizacion) => (<button onClick={() => funcionPrueba(numeroActualizacion)} className="btn btn-link">Ver</button>);

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
            Header: "Detalle",
            accessor: "detalle",
        },
    ];

    return (
        <div>
            {
                tablaHistorico.length > 0 &&
                <div className='tablaHistorico'>
                    <div className='m-3 mb-1 text-center'><strong> {' Histórico '} </strong></div>

                    <ReactTable
                        className='ml-5 mr-5'
                        columns={columnsTable}
                        data={tablaHistorico}
                        showPaginationBottom={true}
                        defaultPageSize={tablaHistorico.length > 5 ? 5 : tablaHistorico.length}
                    />

                </div>
            }
        </div>
    );
};

export default TablaHistorico;
