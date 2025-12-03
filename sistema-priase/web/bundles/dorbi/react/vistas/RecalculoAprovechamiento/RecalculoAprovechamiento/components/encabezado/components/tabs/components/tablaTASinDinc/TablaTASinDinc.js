import React, { useState, useEffect } from 'react'
import ReactTable from 'react-table-6';

const TablaTASinDic = ({ listadoHistoricoRecalculo, numeroActualizacion, listaRecalculo }) => {
    const [valoresTabla, setValoresTabla] = useState(null);
    const [valoresTablaAjuste, setValoresTablaAjuste] = useState(null);
    const [valoresTablaDevolucion, setValoresTablaDevolucion] = useState(null);

    useEffect(() => {
        if (listadoHistoricoRecalculo.length > 0 && numeroActualizacion != '-1' && listaRecalculo.length > 0) {
            obtenerValoresTabla();
            const validacionajusdev = convertArrayToObject(listaRecalculo, 'conAlias');

            if((validacionajusdev['ms-TAAJUS']) && (validacionajusdev['ms-TADEV'])){
                console.log("se ejecutaran ambos")
                obtenerValoresTablaAjustes();
                obtenerValoresTablaDevolucion();
            }else if(validacionajusdev['ms-TAAJUS']){
                console.log("solo ajuste")
                obtenerValoresTablaAjustes();
            }else if(validacionajusdev['ms-TADEV']){
                console.log("solo devolucion")
                obtenerValoresTablaDevolucion();
            }
        };
    }, []);

    const obtenerValoresTabla = () => {
        const resultado = convertArrayToObject(listaRecalculo, 'conAlias');
        const taAjustado = resultado['TA_CALCULADO'] ? resultado['TA_CALCULADO'].valor : 0;
        const taAplicado = resultado['TA_ANT_CALCULADO'] ? resultado['TA_ANT_CALCULADO'].valor : 0;
        const valorAjuste = resultado['CTA-AJUDEV'] ? resultado['CTA-AJUDEV'].valor : 0;
        
        const resultados = [
            {
                estrato: 'Estrato Uno',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: `- ${resultado['FCSE1'].valor}`,
                valorSubCont: `${resultado['RSPFCSE1'].valor}`,
                valorAplicar: resultado['RADFCSE1'].valor
            },
            {
                estrato: 'Estrato Dos',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: `- ${resultado['FCSE2'].valor}`,
                valorSubCont: `${resultado['RSPFCSE2'].valor}`,
                valorAplicar: resultado['RADFCSE2'].valor
            },
            {
                estrato: 'Estrato Tres',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSE3'].valor,
                valorSubCont: resultado['RSPFCSE3'].valor,
                valorAplicar: resultado['RADFCSE3'].valor
            },
            {
                estrato: 'Estrato Cuatro',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSE4'].valor,
                valorSubCont: resultado['RSPFCSE4'].valor,
                valorAplicar: resultado['RADFCSE4'].valor
            },
            {
                estrato: 'Estrato Cinco',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSE5'].valor,
                valorSubCont: resultado['RSPFCSE5'].valor,
                valorAplicar: resultado['RADFCSE5'].valor
            },
            {
                estrato: 'Estrato Seis',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSE6'].valor,
                valorSubCont: resultado['RSPFCSE6'].valor,
                valorAplicar: resultado['RADFCSE6'].valor
            },
            {
                estrato: 'PP1',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSPPO'].valor,
                valorSubCont: resultado['RSPFCSPP1'].valor,
                valorAplicar: resultado['RADFCSPP1'].valor
            },
            {
                estrato: 'PP2',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSPPC'].valor,
                valorSubCont: resultado['RSPFCSPP2'].valor,
                valorAplicar: resultado['RADFCSPP2'].valor
            },
            {
                estrato: 'PP3',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSPPC'].valor,
                valorSubCont: resultado['RSPFCSPP3'].valor,
                valorAplicar: resultado['RADFCSPP3'].valor
            },
            {
                estrato: 'PP4',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSPPC'].valor,
                valorSubCont: resultado['RSPFCSPP4'].valor,
                valorAplicar: resultado['RADFCSPP4'].valor
            },
            {
                estrato: 'GP1',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSGP1'].valor,
                valorSubCont: resultado['RSPFCSGP1'].valor,
                valorAplicar: resultado['RADFCSGP1'].valor
            },
            {
                estrato: 'GP2',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSGP2'].valor,
                valorSubCont: resultado['RSPFCSGP2'].valor,
                valorAplicar: resultado['RADFCSGP2'].valor
            },
        ];

        console.log("Mapeado :: ", resultados);

        setValoresTabla(resultados);

    };

    const obtenerValoresTablaAjustes = () => {
        const resultado = convertArrayToObject(listaRecalculo, 'conAlias');
        const taAjustado = resultado['ms-TAAJUS'] ? resultado['ms-TAAJUS'].valor : 0;
        const taAplicado = resultado['TA_ANT_CALCULADO'] ? resultado['TA_ANT_CALCULADO'].valor : 0;
        const valorAjuste = resultado['CTA-AJU'] ? resultado['CTA-AJU'].valor : 0;        


        const resultados = [
            {
                estrato: 'Estrato Uno',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: `- ${resultado['FCSE1'].valor}`,
                valorSubCont: `${resultado['RAJUPFCE1'].valor}`,
                valorAplicar: resultado['RAJUFCSE1'].valor
            },
            {
                estrato: 'Estrato Dos',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: `- ${resultado['FCSE2'].valor}`,
                valorSubCont: `${resultado['RAJUPFCE2'].valor}`,
                valorAplicar: resultado['RAJUFCSE2'].valor
            },
            {
                estrato: 'Estrato Tres',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSE3'].valor,
                valorSubCont: resultado['RAJUPFCE3'].valor,
                valorAplicar: resultado['RAJUFCSE3'].valor
            },
            {
                estrato: 'Estrato Cuatro',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSE4'].valor,
                valorSubCont: resultado['RAJUPFCE4'].valor,
                valorAplicar: resultado['RAJUFCSE4'].valor
            },
            {
                estrato: 'Estrato Cinco',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSE5'].valor,
                valorSubCont: resultado['RAJUPFCE5'].valor,
                valorAplicar: resultado['RAJUFCSE5'].valor
            },
            {
                estrato: 'Estrato Seis',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSE6'].valor,
                valorSubCont: resultado['RAJUPFCE6'].valor,
                valorAplicar: resultado['RAJUFCSE6'].valor
            },
            {
                estrato: 'PP1',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSPPO'].valor,
                valorSubCont: resultado['RAJUPFCPP1'].valor,
                valorAplicar: resultado['RAJUFCSPP1'].valor
            },
            {
                estrato: 'PP2',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSPPC'].valor,
                valorSubCont: resultado['RAJUPFCPP2'].valor,
                valorAplicar: resultado['RAJUFCSPP2'].valor
            },
            {
                estrato: 'PP3',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSPPC'].valor,
                valorSubCont: resultado['RAJUPFCPP3'].valor,
                valorAplicar: resultado['RAJUFCSPP3'].valor
            },
            {
                estrato: 'PP4',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSPPC'].valor,
                valorSubCont: resultado['RAJUPFCPP4'].valor,
                valorAplicar: resultado['RAJUFCSPP4'].valor
            },
            {
                estrato: 'GP1',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSGP1'].valor,
                valorSubCont: resultado['RAJUPFCGP1'].valor,
                valorAplicar: resultado['RAJUFCSGP1'].valor
            },
            {
                estrato: 'GP2',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSGP2'].valor,
                valorSubCont: resultado['RAJUPFCGP2'].valor,
                valorAplicar: resultado['RAJUFCSGP2'].valor
            },
        ];

        console.log("Mapeado :: ", resultados);

        setValoresTablaAjuste(resultados);

    };

    const obtenerValoresTablaDevolucion = () => {
        const resultado = convertArrayToObject(listaRecalculo, 'conAlias');
        const taAjustado = resultado['ms-TADEV'] ? resultado['ms-TADEV'].valor : 0;
        const taAplicado = resultado['TA_ANT_CALCULADO'] ? resultado['TA_ANT_CALCULADO'].valor : 0;
        const valorAjuste = resultado['CTA-DEV'] ? resultado['CTA-DEV'].valor : 0;        


        const resultados = [
            {
                estrato: 'Estrato Uno',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: `- ${resultado['FCSE1'].valor}`,
                valorSubCont: `${resultado['RDEVPFCSE1'].valor}`,
                valorAplicar: resultado['RDEVFCSE1'].valor
            },
            {
                estrato: 'Estrato Dos',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: `- ${resultado['FCSE2'].valor}`,
                valorSubCont: `${resultado['RDEVPFCSE2'].valor}`,
                valorAplicar: resultado['RDEVFCSE2'].valor
            },
            {
                estrato: 'Estrato Tres',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSE3'].valor,
                valorSubCont: resultado['RDEVPFCSE3'].valor,
                valorAplicar: resultado['RDEVFCSE3'].valor
            },
            {
                estrato: 'Estrato Cuatro',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSE4'].valor,
                valorSubCont: resultado['RDEVPFCSE4'].valor,
                valorAplicar: resultado['RDEVFCSE4'].valor
            },
            {
                estrato: 'Estrato Cinco',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSE5'].valor,
                valorSubCont: resultado['RDEVPFCSE5'].valor,
                valorAplicar: resultado['RDEVFCSE5'].valor
            },
            {
                estrato: 'Estrato Seis',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSE6'].valor,
                valorSubCont: resultado['RDEVPFCSE6'].valor,
                valorAplicar: resultado['RDEVFCSE6'].valor
            },
            {
                estrato: 'PP1',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSPPO'].valor,
                valorSubCont: resultado['RDEVPFCGP1'].valor,
                valorAplicar: resultado['RDEVFCSPP1'].valor
            },
            {
                estrato: 'PP2',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSPPC'].valor,
                valorSubCont: resultado['RDEVPFCPP2'].valor,
                valorAplicar: resultado['RDEVFCSPP2'].valor
            },
            {
                estrato: 'PP3',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSPPC'].valor,
                valorSubCont: resultado['RDEVPFCPP3'].valor,
                valorAplicar: resultado['RDEVFCSPP3'].valor
            },
            {
                estrato: 'PP4',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSPPC'].valor,
                valorSubCont: resultado['RDEVPFCPP4'].valor,
                valorAplicar: resultado['RDEVFCSPP4'].valor
            },
            {
                estrato: 'GP1',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSGP1'].valor,
                valorSubCont: resultado['RDEVPFCGP1'].valor,
                valorAplicar: resultado['RDEVFCSGP1'].valor
            },
            {
                estrato: 'GP2',
                taAplicado: taAplicado,
                taAjustado: taAjustado,
                ajuste: valorAjuste,
                porcentajeSubCont: resultado['FCSGP2'].valor,
                valorSubCont: resultado['RDEVPFCGP2'].valor,
                valorAplicar: resultado['RDEVFCSGP2'].valor
            },
        ];

        console.log("Mapeado :: ", resultados);

        setValoresTablaDevolucion(resultados);

    };

    const convertArrayToObject = (array, key) => {
        const initialValue = {};
        return array.reduce((obj, item) => {
            return {
                ...obj,
                [item[key]]: item,
            };
        }, initialValue);
    };

    const columnsTable = [
        {
            Header: "Estrato",
            accessor: "estrato",
        },
        {
            Header: "TA Aplicado",
            accessor: "taAplicado",
        },
        {
            Header: "TA Ajustado",
            accessor: "taAjustado",
        },
        {
            Header: "Ajuste",
            accessor: "ajuste",
        },
        {
            Header: "% SUB/CONT",
            accessor: "porcentajeSubCont",
        },
        {
            Header: "SUB/CONT",
            accessor: "valorSubCont",
        },
        {
            Header: "Valor Aplicar",
            accessor: "valorAplicar",
        },
    ];

    return (
        <div>
            {
                valoresTabla && listaRecalculo && listaRecalculo.length > 0 &&
                <div>
                    <div className='m-3'>TA Sin Dinc</div>

                    <ReactTable
                        columns={columnsTable}
                        data={valoresTabla}
                        showPaginationBottom={false}
                        defaultPageSize={12}
                    />
                </div>
                
            }
            {
                valoresTablaAjuste && listaRecalculo && listaRecalculo.length > 0 &&
                <div>
                    <div className='m-3'>TA AJUSTES Sin Dinc</div>

                    <ReactTable
                        columns={columnsTable}
                        data={valoresTablaAjuste}
                        showPaginationBottom={false}
                        defaultPageSize={12}
                    />
                </div>
            }
            {
                valoresTablaDevolucion && listaRecalculo && listaRecalculo.length > 0 &&
                <div>
                    <div className='m-3'>TA Devoluciones Sin Dinc</div>

                    <ReactTable
                        columns={columnsTable}
                        data={valoresTablaDevolucion}
                        showPaginationBottom={false}
                        defaultPageSize={12}
                    />
                </div>
            }

        </div>
    );
};

export default TablaTASinDic;