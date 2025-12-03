import React, { useState } from 'react';
import { TablaConceptos } from './components'

import './styles.scss';

const ContainerConceptosConstantes = ({ valorConcepto, setValorConcepto, setValorNombreConcepto, setConceptoSelected2 }) => {
    const REGEX_DECIMAL_20 = /^[+-]?\d*\.?\d{0,20}$/g;



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

    return (
        <div className='container-conceptos-constantes-module'>
            <div className='mt-5 group-section '>
                <TablaConceptos setValorConcepto={setValorConcepto} setValorNombreConcepto={setValorNombreConcepto} setConceptoSelected2={setConceptoSelected2} />

                <div className='container form-group text-center mt-5 pr-5 pl-5'>
                    <label>Valor</label>
                    <input className='form-control input-valor-concepto' id='ValorConcepto' placeholder='valor' type='text'
                        value={valorConcepto} onChange={(e) => setValorConcepto(validarNumerosDecimales(e, REGEX_DECIMAL_20))}></input>
                </div>
            </div>
        </div>
    );
};

export default ContainerConceptosConstantes;