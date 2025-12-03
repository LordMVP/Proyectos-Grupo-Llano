import React, { Component } from 'react'
/**
 * Calcula la cantidad de días dependiendo el mes y sí el año es viciesto o no
 * @method
 * @param {int} mes - Corresponde al mes
 * @param {int} año - Corresponde al año
 * @returns {int} Corresponde a la cantidad de días a listar
 */
function listar(mes, año) {
    function viciesto() {
        return (año % 100 !== 0 && año % 4 === 0) || año % 400 === 0
    }

    if (mes === -1) mes = 11

    switch (mes) {
        case 0:
        case 2:
        case 4:
        case 6:
        case 7:
        case 9:
        case 11:
            return 31
            break

        case 3:
        case 5:
        case 8:
        case 10:
            return 30
            break

        default:
            return viciesto() ? 29 : 28
            break
    }
}
/**
 * Determina el día actual
 * @method
 * @param {int} mes - Corresponde al mes
 * @param {int} año -Corresponde al año
 * @returns {int} año - Corresponde al día actual
 */
function inicio(mes, año) {
    const fecha = new Date(año, mes, 1)
    return fecha.getDay() - 1 === -1 ? 6 : fecha.getDay() - 1
}

/**
 * renderiza los componentes en la vista
 * @param {int} dia
 * @param {int} mes
 * @param {int} año
 * @param {int} lista
 * @param {Object} props
 * @returns {jsx} Componente - Calendario
 */
export default function({ dia, mes, año, lista, ...props }) {
    const dias = []
    const diario = listar(mes, año)

    function comparativa(a, b = lista) {
        function comparar(a, b) {
            return a.map((c, d) => c === b[d]).reduce((c, d) => c && d)
        }

        if (b === lista) {
            for (const fecha of b) if (comparar(fecha, a)) return true
        } else return comparar(a, b)
    }

    for (let activo = inicio(mes, año); activo > 0; activo--) {
        dias.push(<div className="dia pasado"></div>)
    }

    for (let activo = 1; activo <= diario; activo++) {
        const className = comparativa([activo, mes, año])
            ? activo === dia
                ? 'dia activo habil'
                : 'dia habil'
            : activo === dia
            ? 'dia activo'
            : 'dia'

        dias.push(
            <div className={className} onClick={(e) => props.onClick(activo)}>
                {activo}
            </div>
        )
    }

    return <div className="dias">{dias}</div>
}
