import {configuracion} from '../entorno';

export function Log(mensaje, argumentos, tipo) {
  if (configuracion.entorno === 'desarrollo') {
    switch (tipo) {
      case 'error':
        console.error(`${mensaje} \nArgumentos: ${argumentos}`);
        break;
      case 'warn':
        console.warn(`${mensaje} \nArgumentos: ${argumentos}`);
        break;
      case 'log':
      default:
        console.log(`${mensaje} \nArgumentos: ${argumentos}`);
        break;
    }
    
  }
}
