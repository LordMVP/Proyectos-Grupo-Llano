import React from 'react';
import { Combo } from 'appfuture-react';

const horas = [
  { num: 1,  valor: '01:00' },
  { num: 2,  valor: '02:00' },
  { num: 3,  valor: '03:00' },
  { num: 4,  valor: '04:00' },
  { num: 5,  valor: '05:00' },
  { num: 6,  valor: '06:00' },
  { num: 7,  valor: '07:00' },
  { num: 8,  valor: '08:00' },
  { num: 9,  valor: '09:00' },
  { num: 10, valor: '10:00' },
  { num: 11, valor: '11:00' },
  { num: 12, valor: '12:00' },
  { num: 13, valor: '13:00' },
  { num: 14, valor: '14:00' },
  { num: 15, valor: '15:00' },
  { num: 16, valor: '16:00' },
  { num: 17, valor: '17:00' },
  { num: 18, valor: '18:00' },
  { num: 19, valor: '19:00' },
  { num: 20, valor: '20:00' },
  { num: 21, valor: '21:00' },
  { num: 22, valor: '22:00' },
  { num: 23, valor: '23:00' },
  { num: 24, valor: '23:59' }
];

/**
 * Método encargado de mostrar el combo de horas
 * @param {Object} props propiedades enviadas en el componente padre
 */
const ComboHoras = (props) => {
  let index = 0;
  if (props.ultimaHora) {
    index = horas.findIndex(h => h.num === props.ultimaHora);
    if (index === -1) {
      index = 0;
    }
  }
  const opciones = horas.slice(index);

  return (<Combo
    opciones={opciones}
    cols={2}
    propTexto='valor'
    propValor='valor'
    label='Hora Fin:'
    name='horaFin'
    value={props.valor}
    onChange={props.onChange}
    mostrarOpcionDefecto={false}
    extra={{ disabled: props.disabled }}
  />);
};

export { ComboHoras };
