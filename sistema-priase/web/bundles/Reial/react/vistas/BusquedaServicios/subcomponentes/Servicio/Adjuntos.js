import React, { Component } from 'react'
import { Tabla } from 'appfuture-react'

import Peticion from '../../../../global/peticion'
import API from '../../../../global/rutas_api'

import { toast } from 'react-toastify'

/**
 *
 *
 * @class Adjuntos
 * @extends {Component}
 */
class Adjuntos extends Component {
  	/**
     *Define estados iniciales
     * @memberof Adjuntos
     */
  state = {
    lista: [],
    archivos: [],
  }
  archivos = React.createRef()
  columnas = [{
    Header: 'Adjuntos',

    columns: [
      {
        Header: 'Fecha',
        accessor: 'fecha',
      },

      { Header: 'Nombre', accessor: 'nombre' },

      {
        Header: 'Acciones',
        accessor: 'id',
        Cell: (props) => {
          return (
            <div className="d-flex justify-content-center btn-group">
              <button className="btn" onClick={() => this.descargar(props)}>
                <span>descargar</span>
              </button>
            </div>
          )
        }
      }
    ]
  }];

	/**
     *
     *Habilita el botón agregar
     *@method
     *@param {Object} props
     *@return {JSX} Componente - Button
     */
  BotonAgregar = () => {
    return this.state.archivos
      ? <button className="btn" onClick={this.agregar}>agregar</button>
      : <button className="btn" disabled={true}>agregar</button>
  };

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @param {Object} prep - Cargar atributos del componente
     * 
     */	
  componentDidUpdate(prev) {
    if (prev.servicio.id !== this.props.servicio.id) {
      this.obtenerLista()
    }
  }

	/**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * 
     */  
  componentDidMount() {
    // lista
    this.obtenerLista()
  }

	/**
     * Cambia el valor del estado asociado a cada componente
     * @method
     * @async
     * @param {int} id al nombre del estado que se desea modificar
     * @param {(int|string)} value del componente correspondiente al dato
     * que se visualizará en el componente
     */
  change = ({ target: { value } }) => this.setState({ rutas: value })

  
/**
 *
 * Carga archivo al momento de que se registre
 * @param {files} target - Archivo para adjuntar
 */
onFileChange = ({ target }) => this.setState({ archivos: target.files })

  // vista

  
/**
 *
 * Adjuntar archivo en servidor y registrar la ruta en la BD
 * @method
 * @async
 * 
 */
agregar = async () => {
    // adjuntar
    const parametros = new FormData()
    for (let archivo of this.state.archivos) {
      parametros.append('archivo', archivo)
    }
    const respuesta = await Peticion.post({
      url: API.BUSQUEDA_SERVICIOS.ADJUNTAR_ARCHIVO,
      parametros
    });
    // registrar
    if (!respuesta.datos) return // No hubo respuesta
    let { id, ...datos } = respuesta.datos[0]
    await Peticion.post({
      url: API.BUSQUEDA_SERVICIOS.REGISTRAR_ADJUNTO,
      parametros: {
        sigueId: this.props.id,
        sadjCodemp: this.props.servicio.contratante,
        sadjIdazdigital: id,
        sadjProarchivo: {
          ...datos,
          nombreOriginal: this.state.archivos[0].name
        }
      }
    });

	/**
	 *
	 *Limpiar el formulario
	 * @method
	 * 
	 */

    await this.setState({ archivos: null })
    this.archivos.current.value = ""

    // lista

    await this.obtenerLista()
  }

  /**
   *
   *
   * @method
   * @async
   * @param {int} id - Identificador del archivo
   * @param {string} tipo - Tipo de archivo
   * @param {string} nombre - Nombre de archivo
   * @throws No existe respuesta
   */
  descargar = async ({ original: { id, tipo, nombre } }) => {
    try {
      const { datos } = await Peticion.post({
        url: API.BUSQUEDA_SERVICIOS.CONSULTAR_ARCHIVO,
        parametros: { id }
      })

      if (!datos) throw new Error('no hay datos de respuesta')

      // descarga

      const elemento = document.createElement('a')

      elemento.href = `data:${tipo};base64,${datos.contenido}`
      elemento.download = nombre

      elemento.click()
      elemento.remove()
    }

    catch (error) {
      let opciones = {
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }

      toast.error('Algo fallo intentando descargar el archivo', opciones)
      console.warn('Hubo un error: ', error)
    }
  }

  /**
  * Realizar petición con los parámetros del formulario para llenar la tabla de archivos adjuntos
  * @method
  */  
  obtenerLista = async () => {
    let lista = await Peticion.post({
      url: API.BUSQUEDA_SERVICIOS.CONSULTAR_ADJUNTOS,
      parametros: {
        sigueId: this.props.id,
        sadjCodemp: this.props.servicio.contratante
      }
    });
    if (lista.length == undefined) return // no hay datos
    // organizar
    lista = lista.map(function (archivo) {
      return {
        id: archivo.sadjIdazdigital,
        nombre: archivo.sadjProarchivo.nombreOriginal,
        fecha: archivo.sadjFecha,
        tipo: archivo.sadjProarchivo.tipo,
      }
    });
    this.setState({ lista });
  };

    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */  
  render() {
    return (
      <React.Fragment>
        <div className="contenedor">
          <input
            id="adjuntos"
            type="file"
            multiple={false}
            ref={this.archivos}
            onChange={this.onFileChange} />
        </div>

        <div className="contenedor botones">
          <this.BotonAgregar />
        </div>

        <div className="contenedor">
          <Tabla
            datos={this.state.lista}
            columnas={this.columnas}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default Adjuntos
