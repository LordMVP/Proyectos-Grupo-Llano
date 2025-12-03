import moment from 'moment';

const Util = {
  /**
   * Actualiza un objeto con las propiedades nuevas
   * @param objetoAnterior El objeto que se va a actualizar
   * @param nuevasPropiedades Las nuevas propiedades del objeto
   * @returns {{}}
   */
  actualizarObjeto: (objetoAnterior, nuevasPropiedades) => {
    return {
      ...objetoAnterior,
      ...nuevasPropiedades
    };
  },

  /**
   * Validar si un objeto es de tipo Array y si tiene longitud mayor a 0
   * @param arreglo Object
   * @returns {boolean}
   */
  validarArreglo: arreglo => {
    return arreglo && Array.isArray(arreglo) && arreglo.length > 0;
  },

  /**
   * Detiene la ejecución de un evento y también evita la propagación de éste.
   * @param evento Event
   */
  detenerEvento: evento => {
    if (evento.preventDefault) {
      evento.preventDefault();
    }
    if (evento.stopPropagation) {
      evento.stopPropagation();
    }
    if (evento.returnValue) {
      evento.returnValue = false;
    }
  },

  /**
   * Valida si un objeto existe y además tiene propiedades
   * @param obj Object
   * @returns {boolean}
   */
  esObjetoVacio: obj => {
    return !obj || Object.keys(obj).length === 0;
  },

  generarIdControl: prefijo => {
    let d = new Date().getTime();
    if (window.performance && typeof window.performance.now === 'function') {
      d += window.performance.now();
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return prefijo + '_' + uuid.replace(/-/g, '');
  },

  validarStringsRequeridos: (strings) => {
    for (let i = 0; i < strings.length; i++) {
      const str = strings[i].toString();
      if (str.trim().length === 0) {
        return false;
      }
    }
    return true;
  },

  convertirStringAFecha: fecha => {
    if (!fecha || fecha.trim && fecha.trim().length === 0) {
      return null;
    }

    if (fecha instanceof Date) {
      return fecha;
    }

    if (typeof fecha === 'string') {
      return new Date(moment(fecha).format('YYYY-MM-DD'));
    }

    return '';
  }
};

export { Util };
