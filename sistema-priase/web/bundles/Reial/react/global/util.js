export default {
	/**
	 * Actualiza un objeto con las propiedades nuevas
	 * @param objetoAnterior El objeto que se va a actualizar
	 * @param nuevasPropiedades Las nuevas propiedades del objeto
	 * @returns {{}}
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
	 * @returns {id o vacio}
	 */

	obtenerId (texto, posicion = 0, separador = '-') {
		texto = texto.toString()

		if (!this.validarValor(texto)) return ''

		const valor =
			posicion != -1
				? texto.split(` ${separador} `)[posicion]
				: texto.split(` ${separador} `)[texto.split(` ${separador} `).length - 1]

		return valor.trim();
	},

	/**
	 * Valida que los campos no se encuentren vacios o en su estado por defecto
	 * @param objeto Objeto cuyos datos van a ser validados
	 * @returns {Boolean}
	 */

	validarObjeto(objeto) {
		for (let index in objeto) {
			let valor = objeto[index]
			let resultado = this.validarValor(valor)

			if (resultado === false) return false
		}

		return true
	},

	/**
	 * Valida que el valor no se encuentre vacios o en su estado por defecto
	 * @param valor Elemento a ser validado
	 * @returns {Boolean}
	 */

	validarValor(dato) {
		switch (dato) {
			case null:
			case undefined:
			case '':
			case '-1':
				return false

			default:
				return true
		}
	},

	validarArreglo (dato) {
		return Array.isArray(dato) && !!dato.length
	},

	validarFormula (formula = '') {
		function validarParentesis(formula = '') {
			const arregloFormula = formula.trim().split(' ')
			const parentesis = arregloFormula.filter((fila) => {
				return fila == '(' || fila == ')'
			})
			if (parentesis.length <= 0) return true
			const str = parentesis.join('')
			console.log('parentesis: ' + str)
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

			console.log('validar operador')
			console.log(formula)
			console.log(separador)
			//verifica inconsistencias con operadores
			const expresionOperador = /(AND|OR|\(|\))(?=\s(AND|OR|\(|\)))/g
			let arregloOperador = []
			let coincidencia = ''
			while ((coincidencia = expresionOperador.exec(formula))) {
				console.log('operadores')
				console.log(
					formula.substring(
						coincidencia.index,
						expresionOperador.lastIndex
					)
				)
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
			console.log('Error en operadores: ' + arregloOperador.join(',  '))

			const expresionOperando = /(AND|OR|\(|\)|<>|>=|<=|==|===|>|<|\!=)/
			const operando = separador.map((e) => {
				const parcial = expresionOperando.exec(e)
				return parcial === null ? 'DATO' : e
			})
			console.log(operando)
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
			console.log('Errores en operandos: ' + arregloOperando)
			return arregloOperador.length <= 0 && arregloOperando.length <= 0
				? true
				: { arregloOperador, arregloOperando }
		}
		console.log(formula)
		const vParentesis = validarParentesis(formula)
		const vOperando = validarOperador(formula)
		//no existen paréntesis en la fórmula
		console.log('respuesta formula')
		console.log(vParentesis)
		console.log(vOperando)
		console.log(vParentesis && vOperando)
		return vParentesis === true && vOperando === true
			? true
			: { vParentesis, vOperando }
	},
	limpiarDato (arreglo) {
		let parcial = arreglo[0].texto.split(' ')
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
}
