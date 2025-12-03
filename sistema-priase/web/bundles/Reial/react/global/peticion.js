// Code by @adwher

import axios from 'axios'

async function peticion(req, modo = 'post') {
  try {
    const { data } = await axios({
      url: req.url,
      method: modo,
      data: req.parametros,
      params: req.params
    });

    // arreglar datos
    if (req.config && Array.isArray(data)) {
      let { valor, id, texto, json, textoComoValor, separador = '-', autocompletado } = req.config

      let copia = data

      // datos estan dentro de uno o más objetos
      if (json) {
        let arbol = json.split('.');
        for (let rama of arbol) copia = copia.map(dato => dato[rama])
      }

      // mostrar autocompletado
      if (valor && texto && autocompletado) {
        copia = copia.map(function (dato) {

          let textoCombo = `${dato[valor]} ${separador} ${dato[texto]}`
          let valorCombo = textoComoValor ? textoCombo : dato[valor]

          return { ...dato, valor: textoCombo, texto: textoCombo }
        })
        console.log('desde autocompletado');
        console.log(copia);
      }

      // mostrar tres valores
      else if (valor && id && texto) {
        copia = copia.map(function (dato) {
          let textoCombo = `${dato[valor]} ${separador} ${dato[id]} ${separador} ${dato[texto]}`
          let valorCombo = textoComoValor ? textoCombo : dato[valor]
          return { ...dato, valor: valorCombo, texto: textoCombo }
        });
      }

      // mostrar dos valores
      else if (valor && texto) {
        copia = copia.map(function (dato) {
          let textoCombo = `${dato[valor]} ${separador} ${dato[texto]}`
          let valorCombo = textoComoValor ? textoCombo : dato[valor]

          return { ...dato, valor: valorCombo, texto: textoCombo }
        })
      }

      if (typeof req.callback == 'function') req.callback(copia)
    }

    return data;
  }
  catch (error) {
    console.warn(error);
    return null
  }
}

async function peticionAutocomplete(req, modo = 'post') {
  try {
    const { data } = await axios({
      url: req.url,
      method: modo,
      data: req.parametros,
      params: req.params
    })

    // arreglar datos

    if (req.config && Array.isArray(data.datos)) {
      let { valor, id, texto, json, textoComoValor, separador = '-', autocompletado } = req.config

      let copia = data.datos;

      // datos estan dentro de uno o más objetos

      if (json) {
        let arbol = json.split('.')

        for (let rama of arbol) copia = copia.map(dato => dato[rama])
      }

      // mostrar autocompletado



      if (valor && texto && autocompletado) {
        copia = copia.map(function (dato) {
          let textoCombo = `${dato[valor]} ${separador} ${dato[texto]}`
          let valorCombo = textoComoValor ? textoCombo : dato[valor]
          return { ...dato, valor: valorCombo, texto: textoCombo };
        });
        console.log('desde autocompletado');
        console.log(copia);
      }


      // mostrar tres valores

      else if (valor && id && texto) {
        copia = copia.map(function (dato) {
          let textoCombo = `${dato[valor]} ${separador} ${dato[id]} ${separador} ${dato[texto]}`
          let valorCombo = textoComoValor ? textoCombo : dato[valor]

          return { ...dato, valor: valorCombo, texto: textoCombo }
        });
      }


      // mostrar dos valores

      else if (valor && texto) {
        copia = copia.map(function (dato) {
          let textoCombo = `${dato[valor]} ${separador} ${dato[texto]}`
          let valorCombo = textoComoValor ? textoCombo : dato[valor]

          return { ...dato, valor: valorCombo, texto: textoCombo }
        })
      }

      if (typeof req.callback == 'function') req.callback(copia)
    }

    return data
  }

  catch (error) {
    console.warn(error)
    return null
  }
}

export default {
  get(config) { return peticion(config, 'get') },

  post(config) { return peticion(config, 'post') },

  postCustom(config) { return peticionAutocomplete(config, 'post') },

  getCustom(config) { return peticionAutocomplete(config, 'get') },

}
