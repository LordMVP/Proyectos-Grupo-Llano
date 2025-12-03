// Code by github.com/adwher

import axios from 'axios'
import { Util } from './Util'

class Peticion {
    constructor(react) {
        this.react = react
    }

    async pedir(req, modo, condicion = undefined) {
        const parametros = req.parametros || condicion

        try {
            const { data } = parametros
                ? await axios[modo](
                      typeof req === 'string' ? req : req.url,
                      parametros
                  )
                : await axios[modo](typeof req === 'string' ? req : req.url)

            if (typeof req === 'string') return data

            if (data.length >= 0) {
                //si no trae datos restablezca los valores del arreglo en cuestión

                //modificación cuando el id y el texto esta dentro de otro objeto json
                if (req.config) {
                    if (req.config.length === 2) {
                        //cuando requiere visualizar dos parámetros
                        const {
                            config: [id = 'id', texto = 'texto'],
                            ...rest
                        } = req
                        let arreglo = data.map((dato) => ({
                            id: `${dato[id]} - ${dato[texto]}`,
                            texto: `${dato[id]} - ${dato[texto]}`,
                        }))
                        arreglo=arreglo.map(fila=> {return {id:Util.limpiarDato(fila.id), texto:Util.limpiarDato(fila.texto)}})
                        if (rest.json)
                            this.react.setState({ [rest.json]: arreglo })
                    } else if (req.config.length === 3) {
                        //cuando require visualizar tres parámetros
                        const {
                            config: [id = 'id', id1 = 'id1', texto = 'texto'],
                            ...rest
                        } = req
                        let arreglo = data.map((dato) => ({
                            id: `${dato[id]} - ${dato[id1]} - ${dato[texto]}`,
                            texto: `${dato[id]} - ${dato[id1]} - ${dato[texto]}`,
                        }))
                        arreglo=arreglo.map(fila=> {return {id:Util.limpiarDato(fila.id), texto:Util.limpiarDato(fila.texto)}})
                        if (rest.json)
                            this.react.setState({ [rest.json]: arreglo })
                    }
                } else if (req.configJson) {
                    //cuando el id y el texto se encuentra dentro de otro objeto json
                    const {
                        configJson: [id = 'id', id1 = 'id1', texto = 'texto'],
                        ...rest
                    } = req
                    let arreglo = data.map((dato) => ({
                        id: `${dato[id][id1]} - ${dato[id][texto]}`,
                        texto: `${dato[id][id1]} - ${dato[id][texto]}`,
                    }))
                    arreglo=arreglo.map(fila=> {return {id:Util.limpiarDato(fila.id), texto:Util.limpiarDato(fila.texto)}})
                    if (rest.json) this.react.setState({ [rest.json]: arreglo })
                } else if (req.configJsonDos) {
                    //cuando el id y el texto se encuentra dentro de otro objeto json
                    const {
                        configJsonDos: [
                            id = 'id',
                            id1 = 'id1',
                            texto = 'texto',
                        ],
                        ...rest
                    } = req
                    let arreglo = data.map((dato) => ({
                        id: `${dato[id]} - ${dato[id1][texto]}`,
                        texto: `${dato[id]} - ${dato[id1][texto]}`,
                    }))
                    arreglo=arreglo.map(fila=> {return {id:Util.limpiarDato(fila.id), texto:Util.limpiarDato(fila.texto)}})
                    if (rest.json) this.react.setState({ [rest.json]: arreglo })
                }
                return data
            } else {
                //si la consulta es vacía restablezca la información
                const { ...rest } = req
                this.react.setState({ [rest.json]: [], [rest.value]: '-1' })
                return null
            }
        } catch (e) {
            console.warn(e)
        }
    }
    //peticion get
    get = async (req) => this.pedir(req, 'get')
    //peticion post
    post = async (req, condicion) => this.pedir(req, 'post', condicion)
}

export default Peticion
