import React, { useState, useEffect } from 'react'

const CamposIngreso = ({ comboSeleccionado, valorToneladas, observacion,
    setValorToneladas, setObservacion }) => {
    const REGEX_DECIMAL = /^[+-]?\d*\.?\d{0,99}$/g;

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
        <div>
            {comboSeleccionado
                ? <div className='mt-3'>
                    <div className='form-group text-center mb-5'>
                        <label>Valor</label>
                        <input
                            className="form-control" id="valor" placeholder="valor" type="text"
                            value={valorToneladas} onChange={(e) => { setValorToneladas(validarNumerosDecimales(e, REGEX_DECIMAL)) }} />
                    </div>
                    <div className='form-group text-center mb-5'>
                        <label>Observación</label>
                        <textarea className="form-control" id="observacion" placeholder="observación" type="text"
                            value={observacion} onChange={(e) => { setObservacion(e.target.value) }}></textarea>
                    </div>
                </div>
                : null
            }
        </div>
    );
};

export default CamposIngreso;