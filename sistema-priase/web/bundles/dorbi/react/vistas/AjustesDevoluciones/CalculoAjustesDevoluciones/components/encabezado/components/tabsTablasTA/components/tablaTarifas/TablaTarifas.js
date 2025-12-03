import React, { useState, useEffect } from 'react'
import ReactTable from 'react-table-6';
import axios from 'axios';
import RUTAS_API from '../../../../../../../../../global/rutas_api';

const TablaTarifas = ({ classContainerTable = '',
    nameContainerTable = 'Tarifas',
    typeTable = '',
    namelastColumn = 'lastColumn',
    dataTablaCalculos }) => {
    const [valoresTabla, setValoresTabla] = useState(null);

    useEffect(() => {
      obtenerValoresTabla();
    }, [])

    const obtenerValoresTabla = () => {
        if (dataTablaCalculos.length > 0) {
            const resultado = filterArrayType(dataTablaCalculos, typeTable);
            const resultados = [
                { 
                    estrato: 'Estrato Uno',
                    tcEnergia: resultado['ms-CCSEM'],
                    tcGasAseo: resultado['ms-CCSAM'],
                    valueTLU: resultado['ms-CLUS'],
                    valueTBL: resultado['ms-TBL'],
                    valueTRT: resultado['ms-TRTE1'],
                    valueTDF: resultado['ms-TDFE1'],
                    valueTTL: resultado['ms-TTLE1'],
                    lastColumn: namelastColumn === 'TA sin Dinc' ? resultado['ms-TA'] : resultado['ms-TAMD'],
                    valueTFE: namelastColumn === 'TA sin Dinc' ? resultado['ms-TSEE1'] : resultado['ms-TSEDE1'],
                    valueTTA: namelastColumn === 'TA sin Dinc' ? resultado['ms-TSAE1'] : resultado['ms-TSADE1'],
                },
                {
                    estrato: 'Estrato Dos',
                    tcEnergia: resultado['ms-CCSEM'],
                    tcGasAseo: resultado['ms-CCSAM'],
                    valueTLU: resultado['ms-CLUS'],
                    valueTBL: resultado['ms-TBL'],
                    valueTRT: resultado['ms-TRTE2'],
                    valueTDF: resultado['ms-TDFE2'],
                    valueTTL: resultado['ms-TTLE2'],
                    lastColumn: namelastColumn === 'TA sin Dinc' ? resultado['ms-TA'] : resultado['ms-TAMD'],
                    valueTFE: namelastColumn === 'TA sin Dinc' ? resultado['ms-TSEE2'] : resultado['ms-TSEDE2'],
                    valueTTA: namelastColumn === 'TA sin Dinc' ? resultado['ms-TSAE2'] : resultado['ms-TSADE2']
                },
                {
                    estrato: 'Estrato Tres',
                    tcEnergia: resultado['ms-CCSEM'],
                    tcGasAseo: resultado['ms-CCSAM'],
                    valueTLU: resultado['ms-CLUS'],
                    valueTBL: resultado['ms-TBL'],
                    valueTRT: resultado['ms-TRTE3'],
                    valueTDF: resultado['ms-TDFE3'],
                    valueTTL: resultado['ms-TTLE3'],
                    lastColumn: namelastColumn === 'TA sin Dinc' ? resultado['ms-TA'] : resultado['ms-TAMD'],
                    valueTFE: namelastColumn === 'TA sin Dinc' ? resultado['ms-TSEE3'] : resultado['ms-TSEDE3'],
                    valueTTA: namelastColumn === 'TA sin Dinc' ? resultado['ms-TSAE3'] : resultado['ms-TSADE3']
                },
                {
                    estrato: 'Estrato Cuatro',
                    tcEnergia: resultado['ms-CCSEM'],
                    tcGasAseo: resultado['ms-CCSAM'],
                    valueTLU: resultado['ms-CLUS'],
                    valueTBL: resultado['ms-TBL'],
                    valueTRT: resultado['ms-TRTE4'],
                    valueTDF: resultado['ms-TDFE4'],
                    valueTTL: resultado['ms-TTLE4'],
                    lastColumn: namelastColumn === 'TA sin Dinc' ? resultado['ms-TA'] : resultado['ms-TAMD'],
                    valueTFE: namelastColumn === 'TA sin Dinc' ? resultado['ms-TSEE4'] : resultado['ms-TSEDE4'],
                    valueTTA: namelastColumn === 'TA sin Dinc' ? resultado['ms-TSAE4'] : resultado['ms-TSADE4']
                },
                {
                    estrato: 'Estrato Cinco',
                    tcEnergia: resultado['ms-CCSEM'],
                    tcGasAseo: resultado['ms-CCSAM'],
                    valueTLU: resultado['ms-CLUS'],
                    valueTBL: resultado['ms-TBL'],
                    valueTRT: resultado['ms-TRTE5'],
                    valueTDF: resultado['ms-TDFE5'],
                    valueTTL: resultado['ms-TTLE5'],
                    lastColumn: namelastColumn === 'TA sin Dinc' ? resultado['ms-TA'] : resultado['ms-TAMD'],
                    valueTFE: namelastColumn === 'TA sin Dinc' ? resultado['ms-TSEE5'] : resultado['ms-TSEDE5'],
                    valueTTA: namelastColumn === 'TA sin Dinc' ? resultado['ms-TSAE5'] : resultado['ms-TSADE5']
                },
                {
                    estrato: 'Estrato Seis',
                    tcEnergia: resultado['ms-CCSEM'],
                    tcGasAseo: resultado['ms-CCSAM'],
                    valueTLU: resultado['ms-CLUS'],
                    valueTBL: resultado['ms-TBL'],
                    valueTRT: resultado['ms-TRTE6'],
                    valueTDF: resultado['ms-TDFE6'],
                    valueTTL: resultado['ms-TTLE6'],
                    lastColumn: namelastColumn === 'TA sin Dinc' ? resultado['ms-TA'] : resultado['ms-TAMD'],
                    valueTFE: namelastColumn === 'TA sin Dinc' ? resultado['ms-TSEE6'] : resultado['ms-TSEDE6'],
                    valueTTA: namelastColumn === 'TA sin Dinc' ? resultado['ms-TSAE6'] : resultado['ms-TSADE6']
                },
                {
                    estrato: 'PP1',
                    tcEnergia: resultado['ms-CCSEM'],
                    tcGasAseo: resultado['ms-CCSAM'],
                    valueTLU: resultado['ms-CLUS'],
                    valueTBL: resultado['ms-TBL'],
                    valueTRT: resultado['ms-TRTPP'],
                    valueTDF: resultado['ms-TDFPP'],
                    valueTTL: resultado['ms-TTLPP'],
                    lastColumn: namelastColumn === 'TA sin Dinc' ? resultado['ms-TA'] : resultado['ms-TAMD'],
                    valueTFE: namelastColumn === 'TA sin Dinc' ? resultado['ms-TSEFPPO'] : resultado['ms-TSEFPPO'],
                    valueTTA: namelastColumn === 'TA sin Dinc' ? resultado['ms-TSAPPC'] : resultado['ms-TSADPPC']
                },
                {
                    estrato: 'PP2',
                    tcEnergia: resultado['ms-CCSEM'],
                    tcGasAseo: resultado['ms-CCSAM'],
                    valueTLU: resultado['ms-CLUS'],
                    valueTBL: resultado['ms-TBL'],
                    valueTRT: resultado['ms-TRTPP'],
                    valueTDF: resultado['ms-TDFPP'],
                    valueTTL: resultado['ms-TTLPP'],
                    lastColumn: namelastColumn === 'TA sin Dinc' ? resultado['ms-TA'] : resultado['ms-TAMD'],
                    valueTFE: namelastColumn === 'TA sin Dinc' ? resultado['ms-TSEFPPO'] : resultado['ms-TSEFPPO'],
                    valueTTA: namelastColumn === 'TA sin Dinc' ? resultado['ms-TSAPPC'] : resultado['ms-TSADPPC']
                },
                {
                    estrato: 'PP3',
                    tcEnergia: resultado['ms-CCSEM'],
                    tcGasAseo: resultado['ms-CCSAM'],
                    valueTLU: resultado['ms-CLUS'],
                    valueTBL: resultado['ms-TBL'],
                    valueTRT: resultado['ms-TRTPP'],
                    valueTDF: resultado['ms-TDFPP'],
                    valueTTL: resultado['ms-TTLPP'],
                    lastColumn: namelastColumn === 'TA sin Dinc' ? resultado['ms-TA'] : resultado['ms-TAMD'],
                    valueTFE: namelastColumn === 'TA sin Dinc' ? resultado['ms-TSEFPPO'] : resultado['ms-TSEFPPO'],
                    valueTTA: namelastColumn === 'TA sin Dinc' ? resultado['ms-TSAPPC'] : resultado['ms-TSADPPC']
                },
                {
                    estrato: 'PP4',
                    tcEnergia: resultado['ms-CCSEM'],
                    tcGasAseo: resultado['ms-CCSAM'],
                    valueTLU: resultado['ms-CLUS'],
                    valueTBL: resultado['ms-TBL'],
                    valueTRT: resultado['ms-TRTPP'],
                    valueTDF: resultado['ms-TDFPP'],
                    valueTTL: resultado['ms-TTLPP'],
                    lastColumn: namelastColumn === 'TA sin Dinc' ? resultado['ms-TA'] : resultado['ms-TAMD'],
                    valueTFE: namelastColumn === 'TA sin Dinc' ? resultado['ms-TSEFPPO'] : resultado['ms-TSEFPPO'],
                    valueTTA: namelastColumn === 'TA sin Dinc' ? resultado['ms-TSAPPC'] : resultado['ms-TSADPPC']
                },
            ];
            setValoresTabla(resultados);
        }
    }

    const filterArrayType = (array, key) => {
        const initialValue = {};
        const filterArray = array.filter(x=> x.segmento === key);
        filterArray.forEach(element => {
            initialValue[element.conAlias] = element.valor 
        });
        return initialValue;
    };
    

    const columnsTable = [
        {
            Header: "Estrato",
            accessor: "estrato",
        },
        {
            Header: "TC Energia",
            accessor: "tcEnergia",
        },
        {
            Header: "TC Gas o Aseo",
            accessor: "tcGasAseo",
        },
        {
            Header: "TLU",
            accessor: "valueTLU",
        },
        {
            Header: "TBL",
            accessor: "valueTBL",
        },
        {
            Header: "TRT",
            accessor: "valueTRT",
        },
        {
            Header: "TDF",
            accessor: "valueTDF",
        },
        {
            Header: "TTL",
            accessor: "valueTTL",
        },
        {
            Header: namelastColumn === 'TA sin Dinc' ? 'TA' : 'TA-DINC',
            accessor: "lastColumn",
        },
        {
            Header: namelastColumn === 'TA sin Dinc' ? 'TFE' : 'TFE-DINC',
            accessor: "valueTFE",
        },
        {
            Header: namelastColumn === 'TA sin Dinc' ? 'TTA' : 'TTA-DINC',
            accessor: "valueTTA",
        }
    ];

    return (
        <div>
            {
                valoresTabla &&
                <div className={classContainerTable}>
                    <div className='m-3'>{nameContainerTable}</div>

                    <ReactTable
                        columns={columnsTable}
                        data={valoresTabla}
                        showPaginationBottom={false}
                        defaultPageSize={10}
                    />

                </div>
            }
        </div>
    );
};

export default TablaTarifas;
