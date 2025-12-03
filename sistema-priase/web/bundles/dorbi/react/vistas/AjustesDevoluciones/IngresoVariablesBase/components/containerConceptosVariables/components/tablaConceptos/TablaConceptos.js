import React, { useState, useEffect } from 'react'
import ReactTable from 'react-table-6';

const TablaConceptos = ({ listaElementos, setValorConcepto, setValorNombreConcepto, setValorObservacion, setConceptoSelected2 }) => {
    const [valoresTabla, setValoresTabla] = useState([]);
    const [conceptoSelected, setConceptoSelected] = useState({});

    useEffect(() => {
        setValorConcepto(0);
        listarElementosConcepto(listaElementos);
    }, [])

    const listarElementosConcepto = (listaElementos) => {
        const listaItem = [];
        let index = 0;
        listaElementos.map(elemento => {
            listaItem.push({
                index: index++,
                conceptoText: elemento.nombre + ' (' + elemento.rangoIni + ',' + elemento.rangoFin + ')',
                conceptoAbrev: '-',
                valor: elemento.racoValor,
                descripcion: elemento.observacion,
                idRaco: elemento.racoIderegistr
            });
        });
        setValoresTabla(listaItem);
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
            Header: "VALOR",
            accessor: "valor",
            minWidth: 100,
        },
        {
            Header: "DESCRIPCION",
            accessor: "descripcion",
            minWidth: 300,
        },
        {
            Header: " ",
            accessor: "espacio",
            minWidth: 20,
        },
    ];

    return (
        <div>
            {
                valoresTabla &&
                <div className='tabla-conceptos-variables'>
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
                                        setValorConcepto(rowInfo.original.valor);
                                        setValorNombreConcepto(rowInfo.original.conceptoText)
                                        setValorObservacion(rowInfo.original.descripcion)
                                        setConceptoSelected2(rowInfo.original);
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

export default TablaConceptos;
