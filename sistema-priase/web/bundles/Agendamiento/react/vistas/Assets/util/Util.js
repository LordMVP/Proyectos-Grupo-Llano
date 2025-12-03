const Util = {
  /**
   * Actualiza un objeto con las propiedades nuevas
   * @param objetoAnterior El objeto que se va a actualizar
   * @param nuevasPropiedades Las nuevas propiedades del objeto
   * @return {Object}
   */
  actualizarObjeto: (objetoAnterior, nuevasPropiedades) => {
    return {
      ...objetoAnterior,
      ...nuevasPropiedades,
    }
  },

  /**
   * Actualiza un objeto con las propiedades nuevas
   * @param texto El texto que contiene el id para el envío de la información POST
   * @param posicion Determinar en cual posición del arreglo se encuentra el ID, por defecto es cero
   * Sí es el último, sin importar la cantidad, se envía -1
   * @return {(int | null)}
   */

  obtenerId: (texto, posicion = 0) => {
    if (texto === '-1') return ''
    if (texto.search('-') < 1) return texto
    const valor =
      posicion != -1
        ? texto.split(' - ')[posicion]
        : texto.split(' - ')[texto.split(' - ').length - 1]

    return valor.trim()
  },

  /**
   * Valida que los campos no se encuentren vacios o en su estado por defecto
   * @param objeto Objeto cuyos datos van a ser validados
   * @returns {Boolean}
   */

  verificar(objeto) {
    for (let index in objeto) {
      switch (objeto[index]) {
        case null:
        case undefined:
        case '':
        case '-1':
          return false
      }
    }

    return true
  },

  /**
   * Valida la formula tando en operandos, como en operadores y paréntesis
   * @param {String} Obtiene la formaula entregada desde la vista selección y asignación
   * @returns {Boolean, Boolean} ValidaParéntesos ValidaOperadoresOperandos
   */

  validarFormula: (formula = '') => {
    function validarParentesis(formula = '') {
      const arregloFormula = formula.trim().split('')
      const parentesis = arregloFormula.filter((fila) => {
        return fila == '(' || fila == ')'
      })
      if (parentesis.length <= 0) return true
      const str = parentesis.join('')

      if (str.length <= 1) return str

      let coincidencia, caracter
      let reunir = []

      let apertura = ['[', '{', '(']
      let cierre = [']', '}', ')']

      for (let i = 0; i < str.length; i++) {
        caracter = str[i]

        if (cierre.indexOf(caracter) > -1) {
          coincidencia = apertura[cierre.indexOf(caracter)]
          if (reunir.length == 0 || reunir.pop() != coincidencia) {
            return str
          }
        } else {
          reunir.push(caracter)
        }
      }

      return reunir.length == 0
    }
    function validarOperador(formula) {
      //limpiar formula
      formula = formula.trim().split(' ')
      formula = formula.map((elemento) => elemento.trim())

      let indice = -1
      const cantidad = formula ? formula.length : 0
      let incremento = -1
      let resultado = []

      while (++indice < cantidad) {
        const valor = formula[indice]
        if (valor) {
          resultado[++incremento] = valor
        }
      }
      formula = resultado.join(' ')
      let separador = formula.split(' ')

      //verifica inconsistencias con operadores
      const expresionOperador = /((\()(?=\s(AND|OR)))|((AND|OR)(?=\s(AND|OR|\))))/g
      let arregloOperador = []
      let coincidencia = ''
      while ((coincidencia = expresionOperador.exec(formula))) {
        if (formula.charAt(expresionOperador.lastIndex + 1) == 'A') {
          arregloOperador.push(
            formula.substring(
              coincidencia.index,
              expresionOperador.lastIndex + 4
            )
          )
        } else if (
          formula.charAt(expresionOperador.lastIndex + 1) == 'O'
        ) {
          arregloOperador.push(
            formula.substring(
              coincidencia.index,
              expresionOperador.lastIndex + 3
            )
          )
        } else {
          arregloOperador.push(
            formula.substring(
              coincidencia.index,
              expresionOperador.lastIndex + 2
            )
          )
        }
      }

      const expresionOperando = /(AND|OR|\(|\)|<>|>=|<=|==|=|===|>|<|\!=)/
      const operando = separador.map((e) => {
        const parcial = expresionOperando.exec(e)
        return parcial === null ? 'DATO' : e
      })

      let arregloOperando = []
      for (let i in operando) {
        if (i < operando.length) {
          operando[i] == operando[parseInt(i) + 1] &&
            operando[i] == 'DATO'
            ? arregloOperando.push(
              `${separador[i]} ${separador[parseInt(i) + 1]}`
            )
            : ''
        }
      }
      arregloOperando = arregloOperando.join(' ')

      return arregloOperador.length <= 0 && arregloOperando.length <= 0
        ? true
        : { arregloOperador, arregloOperando }
    }

    const vParentesis = validarParentesis(formula)
    const vOperando = validarOperador(formula)
    //no existen paréntesis en la fórmula

    return vParentesis === true && vOperando === true
      ? true
      : { vParentesis, vOperando }
  },
  limpiarDato: (arreglo) => {
    if (typeof arreglo == 'string') {
      return arreglo.replace(/\s+/g, ' ').trim();
    }
    let parcial

    if (Array.isArray(arreglo)) {
      parcial = arreglo[0].texto.split(' ')
    } else {
      parcial = arreglo.split(' ')
    }

    parcial = parcial.map((elemento) => elemento.trim())

    let indice = -1
    const cantidad = parcial ? parcial.length : 0
    let incremento = -1
    let resultado = []

    while (++indice < cantidad) {
      const valor = parcial[indice]
      if (valor) {
        resultado[++incremento] = valor
      }
    }

    resultado = resultado.join(' ')
    return resultado
  },
  validarTelefono: (numero) => {
    const validar = /^[0-9]{7,10}$/g
    return validar.exec(numero) == null ? true : false
  },
  validarCorreo: (correo) => {
    const validar = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return validar.exec(correo) == null ? true : false
  },
}

export { Util }
