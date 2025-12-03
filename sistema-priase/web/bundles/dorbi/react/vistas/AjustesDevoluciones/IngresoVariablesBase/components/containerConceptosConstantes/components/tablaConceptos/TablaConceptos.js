import React, { useState, useEffect } from 'react'
import ReactTable from 'react-table-6';
import axios from 'axios';
import RUTAS_API from '../../../../../../../global/rutas_api';

const TablaConceptos = ({ setValorConcepto, setValorNombreConcepto, setConceptoSelected2 }) => {
    const [valoresTabla, setValoresTabla] = useState([]);
    const [conceptoSelected, setConceptoSelected] = useState([]);
    // const [valorConcepto, setValorConcepto] = useState(0);

    useEffect(() => {
        axios.post(RUTAS_API.RECALCULO_VARIABLE.OBTENER_CONCEPTOS_CONSTANTES, {})
            .then(respuesta => {
                if (respuesta.data.datos != null) {
                    const valoresCalculadosT = fijarValoresTabla(respuesta.data.datos);
                    setValoresTabla(valoresCalculadosT);
                }
            });

    }, []);

    const fijarValoresTabla = (listaConceptos) => {
        return listaConceptos.map(concepto => {
            return {
                id: concepto.uniConcepto,
                conceptoText: concepto.nombreConcepto,
                conceptoAbrev: concepto.abreviatura,
                valorActual: concepto.valor,
                valorAnterior: concepto.valorAnterior,
            }
        });
    }

    const columnsTable = [
        {
            Header: "CONCEPTO",
            accessor: "conceptoText",
            minWidth: 300,
        },
        {
            Header: "ABREVIATURA",
            accessor: "conceptoAbrev",
            minWidth: 100,
        },
        {
            Header: "VALOR ACTUAL",
            accessor: "valorActual",
            minWidth: 100,
        },
        {
            Header: "VALOR ANTERIOR",
            accessor: "valorAnterior",
            minWidth: 100,
        },
    ];
    return (
        <div>
            {
                valoresTabla &&
                <div className='tabla-conceptos-constantes'>
                    <ReactTable
                        columns={columnsTable}
                        data={valoresTabla}
                        showPaginationBottom={true}
                        defaultPageSize={5}
                        getTrProps={(state, rowInfo, column, instance) => {
                            if (rowInfo && rowInfo.row) {
                                return {
                                    onClick: (e) => {
                                        e.preventDefault();
                                        setConceptoSelected(rowInfo.original);
                                        setValorConcepto(rowInfo.original.valorActual);
                                        setValorNombreConcepto(rowInfo.original.conceptoText);
                                        setConceptoSelected2(rowInfo.original)
                                    },
                                    style: {
                                        cursor: 'pointer',
                                        border: rowInfo.original.id === conceptoSelected.id ? '1px green solid' : 'unset'
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

export default TablaConceptos;
