import React, { useState, useEffect } from 'react';
import { TablaConceptos } from './components'
import { Input, Combo } from 'appfuture-react';
import RUTAS_API from '../../../../../global/rutas_api';
import axios from 'axios';
import { mostrarAlerta } from '../../../../../store/actions/AplicacionAcciones';

import './styles.scss';

const ContainerConceptosVariables = ({ areaPrestacion, uniLiquidacion, valorConcepto, valorObservacion, setValorConcepto, setValorNombreConcepto, setValorObservacion, setConceptoSelected2, setPeriodoSelected, setIdeConcepto }) => {
    /** Constantes */
    const REGEX_DECIMAL_20 = /^[+-]?\d*\.?\d{0,20}$/g;

    /** States */
    const [listaAnio, setListaAnio] = useState([]);
    const [anioSeleccionado, setAnioSeleccionado] = useState(-1);
    const [listaPeriodo, setListaPeriodo] = useState([]);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState(-1);
    const [listaConceptos, setlistaConceptos] = useState([]);
    const [conceptoSeleccionado, setConceptoSeleccionado] = useState(-1);
    // ListasGenerales
    const [allListPeriodo, setAllListPeriodo] = useState([]);
    const [listaRacoConcepto, setListaRacoConcepto] = useState([]);

    /** Effects */

    useEffect(() => {
        consultarAnioDePeriodo(areaPrestacion)
    }, []);

    /** Funciones y métodos */
    const validarNumerosDecimales = (e, regex) => {
        if (e.key === ',') {
            e.preventDefault();
            return false;
        }
        const value = e.target.value;
        if (value.match(regex) == null) {
            return value.substr(0, value.length - 1);
        } else {
            return value;
        }
    };

    const consultarAnioDePeriodo = (idArea) => {
        axios
            .post(RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS.CONSULTAR_MESES_PERIODO, {
                idArea: idArea,
            })
            .then((respuesta) => {
                console.log(respuesta.data.datos);
                const { listaAnio, listaPeriodo } = sortAnioPeriodo(respuesta.data.datos);
                listaPeriodo.sort((a, b) => (a.numeroMes > b.numeroMes) ? 1 : -1);
                setListaAnio(listaAnio);
                setAllListPeriodo(listaPeriodo);
            });
    };

    const sortAnioPeriodo = (periodos) => {
        let listaPeriodo = [], listaAnio = [];
        periodos.map((dato) => {
            listaPeriodo.push({
                idRegistroMes: dato.perIdeRegistro,
                titulo: `${dato.smperDescripcion}`,
                anio: dato.perFecInicial,
                idPeriodoPadre: dato.perIdEPadre,
                numeroMes: dato.smperNumero,
            });

            listaAnio.push({
                titulo: `${dato.perFecInicial} - ${dato.nombrePeriodo}`,
                perIderegistro: dato.perIdEPadre,
            });
        });
        listaAnio = [...new Map(listaAnio.map(item => [item["perIderegistro"], item])).values()];
        console.log(listaPeriodo);
        return { listaPeriodo, listaAnio }
    };

    const cargarPeriodo = (value) => {
        const filterPeriodo = allListPeriodo.filter(x => x.idPeriodoPadre === +value);
        setListaPeriodo(filterPeriodo);
    };

    const consultarConceptos = (idLiquidacion) => {
        axios.post(RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS.CONSULTAR_CONCEPTOS_BASE, { uniLiquidacion: idLiquidacion })
            .then(respuesta => {
                if (respuesta.data.codigo > 0) {
                    setlistaConceptos(construirObjetoVariables(respuesta.data.datos));
                } else {
                    setlistaConceptos([]);
                }
            });
    };

    /**
     * Método encargado de contruir un objeto con los periodos consultados.
     * @param {Object} periodos Datos de los periodos consultados.
     * @returns {Object}
     */
    const construirObjetoVariables = (conceptos) => {
        setListaRacoConcepto([]);
        let gruposRaco = {};
        conceptos.filter(a => {
            const idConcepto = a.uniConcepto.uniIderegistro;
            if (!gruposRaco[idConcepto]) {
                gruposRaco[idConcepto] = [];
            }
            gruposRaco[idConcepto].push(a);
        });
        let listaFinal = [];
        for (const idConcepto in gruposRaco) {
            let listaRaco = [];
            const grupoRaco = gruposRaco[idConcepto];
            for (let index = 0; index < grupoRaco.length; index++) {
                const racoCon = grupoRaco[index];
                if (racoCon.raco.racoIderegistr) {
                    listaRaco.push({
                        racoIderegistr: racoCon.raco.racoIderegistr,
                        racoValor: racoCon.raco.racoValor,
                        nombre: racoCon.conNombre,
                        rangoIni: racoCon.raco.racoRaninicial,
                        rangoFin: racoCon.raco.racoRanfinal,
                        observacion: racoCon.descripcion,
                    });
                }
            }
            let obj = {
                idConcepto: idConcepto,
                nombre: (listaRaco.length > 0) ? listaRaco[0].nombre : grupoRaco[0].conNombre,
                listaRaco: listaRaco,
            };
            listaFinal.push(obj);
        }
        return listaFinal;
    };

    const obtenerListaRaco = (idConcepto) => {
        setListaRacoConcepto([]);
        const listaRaco = listaConceptos.find(x => x.idConcepto == idConcepto);
        if (listaRacoConcepto.length === 0) {
            mostrarAlerta({ tipo: "Error", mensaje: "El concepto no cuenta con Raco." });
        }
        
        setListaRacoConcepto(listaRaco.listaRaco);
    }

    const controlarCambio = (evento) => {
        let change = {};
        const { name, value } = evento.target;
        switch (name) {
            case 'anio':
                setPeriodoSeleccionado(-1);
                setConceptoSeleccionado(-1);
                setListaRacoConcepto([]);
                setAnioSeleccionado(value);
                cargarPeriodo(value);
                break;
            case 'periodo':
                setConceptoSeleccionado(-1);
                setPeriodoSeleccionado(value);
                setPeriodoSelected(value);
                if (value != '-1') {
                    consultarConceptos(uniLiquidacion);
                }
                break;
            case 'concepto':
                setConceptoSeleccionado(value);
                setIdeConcepto(value);
                if (value != '-1') {
                    obtenerListaRaco(value);
                }
            default:
                break;
        }
    };

    return (
        <div className='container-conceptos-variables-module'>
            <div className='mt-5 group-section'>

                <div className="conf-general row mt-5">

                    <Combo
                        opciones={listaAnio}
                        key="perIderegistro"
                        propTexto="titulo"
                        propValor="perIderegistro"
                        label="Año:"
                        name="anio"
                        value={anioSeleccionado}
                        onChange={(e) => controlarCambio(e)}
                    />
                    <Combo
                        opciones={listaPeriodo}
                        key='idRegistroMes'
                        propTexto='titulo'
                        propValor='idRegistroMes'
                        label="Periodo:"
                        name="periodo"
                        value={periodoSeleccionado}
                        onChange={(e) => controlarCambio(e)}
                    />
                    <Combo
                        opciones={listaConceptos}
                        key="idConcepto"
                        propTexto="nombre"
                        propValor="idConcepto"
                        label="Concepto:"
                        name="concepto"
                        value={conceptoSeleccionado}
                        onChange={(e) => controlarCambio(e)}
                    />
                </div>

                {conceptoSeleccionado != -1 && listaRacoConcepto.length > 0 &&
                    <div>
                        <TablaConceptos listaElementos={listaRacoConcepto}
                            setValorConcepto={setValorConcepto}
                            setValorNombreConcepto={setValorNombreConcepto}
                            setValorObservacion={setValorObservacion}
                            valorObservacion={valorObservacion} 
                            setConceptoSelected2={setConceptoSelected2} />
                        <div className='container text-center'>
                            <div className='form-group text-center mt-5 pl-5 pr-5'>
                                <label>Valor</label>
                                <input className="form-control input-valor-concepto" id="ValorConcepto" placeholder="valor" type="text"
                                    value={valorConcepto} onChange={(e) => setValorConcepto(validarNumerosDecimales(e, REGEX_DECIMAL_20))}></input>
                            </div>
                            <div className='form-group text-center mt-5 pl-5 pr-5'>
                                <label>Observacion</label>
                                <textarea
                                    name='descripcion'
                                    id='descripcion'
                                    value={valorObservacion || ''}
                                    onChange={(e) => setValorObservacion(e.target.value)}
                                    className='form-control input-valor-observacion'
                                    rows='3'
                                    placeholder='Descripción'
                                >
                                </textarea>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default ContainerConceptosVariables;