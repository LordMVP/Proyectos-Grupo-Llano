import React, { useState, useEffect } from 'react'
import ReactTable from 'react-table-6';

const TablaTAConDinc = ({ listadoHistoricoRecalculo, numeroActualizacion, listaRecalculo }) => {
    const [valoresTabla, setValoresTabla] = useState(null);
    const [valoresTablaAjuste, setValoresTablaAjuste] = useState(null);
    const [valoresTablaDevolucion, setValoresTablaDevolucion] = useState(null);

    useEffect(() => {
        if (listadoHistoricoRecalculo.length > 0 && numeroActualizacion != '-1' && listaRecalculo.length > 0) {
            obtenerValoresTabla();
            const validacionajusdev = convertArrayToObject(listaRecalculo, 'conAlias');

            if((validacionajusdev['ms-TAMDAJU']) && (validacionajusdev['ms-TAMDDEV'])){
                console.log("se ejecutaran ambos")
                obtenerValoresTablaAjustes();
                obtenerValoresTablaDevolucion();
            }else if(validacionajusdev['ms-TAMDAJU']){
                console.log("solo ajuste")
                obtenerValoresTablaAjustes();
            }else if(validacionajusdev['ms-TAMDDEV']){
                console.log("solo devolucion")
                obtenerValoresTablaDevolucion();
            }
        };
    }, []);

    

    const obtenerValoresTabla = () => {
        const resultado = convertArrayToObject(listaRecalculo, 'conAlias');
        const valoresCuentaTA = {
            taAjustado: resultado['TA_CALCULADO'] ? resultado['TA_CALCULADO'].valor : 0,
            taAplicado: resultado['TA_ANT_CALCULADO'] ? resultado['TA_ANT_CALCULADO'].valor : 0,
            ajuste: resultado['CTA-AD-DN'] ? resultado['CTA-AD-DN'].valor : 0
            // ajuste: checkAjusteInicial(resultado['TA_CALCULADO'] ? resultado['TA_CALCULADO'].valor : 0,
            //                             resultado['TA_ANT_CALCULADO'] ? resultado['TA_ANT_CALCULADO'].valor : 0,
            //                             resultado['CTA-AJU-DN'] ? resultado['CTA-AJU-DN'].valor : 0)
        };
        const resultados = [
            {
                ...valoresCuentaTA,
                estrato: 'Estrato Uno',
                porcentajeSubCont: `- ${resultado['FCSE1D'].valor}`,
                valorSubCont: `${resultado['RSPFCSE1D'].valor}`,
                valorAplicar: resultado['RADFCSE1D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'Estrato Dos',
                porcentajeSubCont: `- ${resultado['FCSE2D'].valor}`,
                valorSubCont: `${resultado['RSPFCSE2D'].valor}`,
                valorAplicar: resultado['RADFCSE2D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'Estrato Tres',
                porcentajeSubCont: resultado['FCSE3D'].valor,
                valorSubCont: resultado['RSPFCSE3D'].valor,
                valorAplicar: resultado['RADFCSE3D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'Estrato Cuatro',
                porcentajeSubCont: resultado['FCSE4D'].valor,
                valorSubCont: resultado['RSPFCSE4D'].valor,
                valorAplicar: resultado['RADFCSE4D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'Estrato Cinco',
                porcentajeSubCont: resultado['FCSE5D'].valor,
                valorSubCont: resultado['RSPFCSE5D'].valor,
                valorAplicar: resultado['RADFCSE5D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'Estrato Seis',
                porcentajeSubCont: resultado['FCSE6D'].valor,
                valorSubCont: resultado['RSPFCSE6D'].valor,
                valorAplicar: resultado['RADFCSE6D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'PP1',
                porcentajeSubCont: resultado['FCSPPOD'].valor,
                valorSubCont: resultado['RSPFCSPP1D'].valor,
                valorAplicar: resultado['RADFCPP1D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'PP2',
                porcentajeSubCont: resultado['FCSPPCD'].valor,
                valorSubCont: resultado['RSPFCSPP2D'].valor,
                valorAplicar: resultado['RADFCPP2D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'PP3',
                porcentajeSubCont: resultado['FCSPPCD'].valor,
                valorSubCont: resultado['RSPFCSPP3D'].valor,
                valorAplicar: resultado['RADFCPP3D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'PP4',
                porcentajeSubCont: resultado['FCSPPCD'].valor,
                valorSubCont: resultado['RSPFCSPP4D'].valor,
                valorAplicar: resultado['RADFCPP4D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'GP1',
                porcentajeSubCont: resultado['FCSGP1D'].valor,
                valorSubCont: resultado['RSPFCSGP1D'].valor,
                valorAplicar: resultado['RADFCGP1D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'GP2',
                porcentajeSubCont: resultado['FCSGP2D'].valor,
                valorSubCont: resultado['RSPFCSGP2D'].valor,
                valorAplicar: resultado['RADFCGP2D'].valor
            },
        ];
        console.log("Mapeado :: ", resultados);
        setValoresTabla(resultados);
    };

    const obtenerValoresTablaAjustes = () => {
        const resultado = convertArrayToObject(listaRecalculo, 'conAlias');
        const valoresCuentaTA = {
            taAjustado: resultado['ms-TAMDAJU'] ? resultado['ms-TAMDAJU'].valor : 0,
            taAplicado: resultado['TA_ANT_CALCULADO'] ? resultado['TA_ANT_CALCULADO'].valor : 0,
            ajuste: resultado['CTA-AJU-DN'] ? resultado['CTA-AJU-DN'].valor : 0
            // ajuste: checkAjusteInicial(resultado['TA_CALCULADO'] ? resultado['TA_CALCULADO'].valor : 0,
            //                             resultado['TA_ANT_CALCULADO'] ? resultado['TA_ANT_CALCULADO'].valor : 0,
            //                             resultado['CTA-AJU-DN'] ? resultado['CTA-AJU-DN'].valor : 0)
        };
        const resultados = [
            {
                ...valoresCuentaTA,
                estrato: 'Estrato Uno',
                porcentajeSubCont: `- ${resultado['FCSE1D'].valor}`,
                valorSubCont: `${resultado['RAJUAPE1D'].valor}`,
                valorAplicar: resultado['RAJUFCSE1D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'Estrato Dos',
                porcentajeSubCont: `- ${resultado['FCSE2D'].valor}`,
                valorSubCont: `${resultado['RAJUAPE2D'].valor}`,
                valorAplicar: resultado['RAJUFCSE2D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'Estrato Tres',
                porcentajeSubCont: resultado['FCSE3D'].valor,
                valorSubCont: resultado['RAJUAPE3D'].valor,
                valorAplicar: resultado['RAJUFCSE3D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'Estrato Cuatro',
                porcentajeSubCont: resultado['FCSE4D'].valor,
                valorSubCont: resultado['RAJUAPE4D'].valor,
                valorAplicar: resultado['RAJUFCSE4D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'Estrato Cinco',
                porcentajeSubCont: resultado['FCSE5D'].valor,
                valorSubCont: resultado['RAJUAPE5D'].valor,
                valorAplicar: resultado['RAJUFCSE5D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'Estrato Seis',
                porcentajeSubCont: resultado['FCSE6D'].valor,
                valorSubCont: resultado['RAJUAPE6D'].valor,
                valorAplicar: resultado['RAJUFCSE6D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'PP1',
                porcentajeSubCont: resultado['FCSPPOD'].valor,
                valorSubCont: resultado['RAJUAPPP1D'].valor,
                valorAplicar: resultado['RAJUFCPP1D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'PP2',
                porcentajeSubCont: resultado['FCSPPCD'].valor,
                valorSubCont: resultado['RAJUAPPP2D'].valor,
                valorAplicar: resultado['RAJUFCPP2D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'PP3',
                porcentajeSubCont: resultado['FCSPPCD'].valor,
                valorSubCont: resultado['RAJUAPPP3D'].valor,
                valorAplicar: resultado['RAJUFCPP3D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'PP4',
                porcentajeSubCont: resultado['FCSPPCD'].valor,
                valorSubCont: resultado['RAJUAPPP4D'].valor,
                valorAplicar: resultado['RAJUFCPP4D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'GP1',
                porcentajeSubCont: resultado['FCSGP1D'].valor,
                valorSubCont: resultado['RAJUAPGP1D'].valor,
                valorAplicar: resultado['RAJUFCGP1D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'GP2',
                porcentajeSubCont: resultado['FCSGP2D'].valor,
                valorSubCont: resultado['RAJUAPGP2D'].valor,
                valorAplicar: resultado['RAJUFCGP2D'].valor
            },
        ];
        console.log("Mapeado :: ", resultados);
        setValoresTablaAjuste(resultados);
    };

    const obtenerValoresTablaDevolucion = () => {
        const resultado = convertArrayToObject(listaRecalculo, 'conAlias');
        const valoresCuentaTA = {
            taAjustado: resultado['ms-TAMDDEV'] ? resultado['ms-TAMDDEV'].valor : 0,
            taAplicado: resultado['TA_ANT_CALCULADO'] ? resultado['TA_ANT_CALCULADO'].valor : 0,
            ajuste: resultado['CTA-DEV-DN'] ? resultado['CTA-DEV-DN'].valor : 0
            // ajuste: checkAjusteInicial(resultado['TA_CALCULADO'] ? resultado['TA_CALCULADO'].valor : 0,
            //                             resultado['TA_ANT_CALCULADO'] ? resultado['TA_ANT_CALCULADO'].valor : 0,
            //                             resultado['CTA-AJU-DN'] ? resultado['CTA-AJU-DN'].valor : 0)
        };
        const resultados = [
            {
                ...valoresCuentaTA,
                estrato: 'Estrato Uno',
                porcentajeSubCont: `- ${resultado['FCSE1D'].valor}`,
                valorSubCont: `${resultado['RDEVAPE1D'].valor}`,
                valorAplicar: resultado['RDEVFCSE1D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'Estrato Dos',
                porcentajeSubCont: `- ${resultado['FCSE2D'].valor}`,
                valorSubCont: `${resultado['RDEVAPE2D'].valor}`,
                valorAplicar: resultado['RDEVFCSE2D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'Estrato Tres',
                porcentajeSubCont: resultado['FCSE3D'].valor,
                valorSubCont: resultado['RDEVAPE3D'].valor,
                valorAplicar: resultado['RDEVFCSE3D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'Estrato Cuatro',
                porcentajeSubCont: resultado['FCSE4D'].valor,
                valorSubCont: resultado['RDEVAPE4D'].valor,
                valorAplicar: resultado['RDEVFCSE4D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'Estrato Cinco',
                porcentajeSubCont: resultado['FCSE5D'].valor,
                valorSubCont: resultado['RDEVAPE5D'].valor,
                valorAplicar: resultado['RAJUFCSE5D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'Estrato Seis',
                porcentajeSubCont: resultado['FCSE6D'].valor,
                valorSubCont: resultado['RDEVAPE6D'].valor,
                valorAplicar: resultado['RDEVFCSE6D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'PP1',
                porcentajeSubCont: resultado['FCSPPOD'].valor,
                valorSubCont: resultado['RDEVAPPP1D'].valor,
                valorAplicar: resultado['RDEVFCPP1D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'PP2',
                porcentajeSubCont: resultado['FCSPPCD'].valor,
                valorSubCont: resultado['RDEVAPPP2D'].valor,
                valorAplicar: resultado['RDEVFCPP2D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'PP3',
                porcentajeSubCont: resultado['FCSPPCD'].valor,
                valorSubCont: resultado['RDEVAPPP3D'].valor,
                valorAplicar: resultado['RDEVFCPP3D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'PP4',
                porcentajeSubCont: resultado['FCSPPCD'].valor,
                valorSubCont: resultado['RDEVAPPP4D'].valor,
                valorAplicar: resultado['RDEVFCPP4D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'GP1',
                porcentajeSubCont: resultado['FCSGP1D'].valor,
                valorSubCont: resultado['RDEVAPGP1D'].valor,
                valorAplicar: resultado['RDEVFCGP1D'].valor
            },
            {
                ...valoresCuentaTA,
                estrato: 'GP2',
                porcentajeSubCont: resultado['FCSGP2D'].valor,
                valorSubCont: resultado['RDEVAPGP2D'].valor,
                valorAplicar: resultado['RDEVFCGP2D'].valor
            },
        ];
        console.log("Mapeado :: ", resultados);
        setValoresTablaDevolucion(resultados);
    };

    const checkAjusteInicial = (taAjustado, taAplicado, ajuste) => {
        if (numeroActualizacion == 0) {
            return taAjustado - taAplicado;
        } else {
            return ajuste;
        }
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
                    <div className='m-3'>TA CON DINC</div>

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
                    <div className='m-3'>TA AJUSTES CON DINC</div>

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
                    <div className='m-3'>TA DEVOLUCIONES CON DINC</div>

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

export default TablaTAConDinc;