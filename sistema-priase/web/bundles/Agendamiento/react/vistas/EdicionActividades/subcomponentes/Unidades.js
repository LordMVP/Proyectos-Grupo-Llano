import React, { Component } from 'react'

//componentes appfuture-react
import { Combo, Tabla } from 'appfuture-react'

//Rutas entre la vista Edición Actividades y Symfony-EdicionActividadesController
import URL from '../../../global/rutas_api'
import Peticion from '../../Assets/util/peticion'
import Autocompletado from '../../Assets/componentes/Autocompletado';
//Usar componente modal
import Modal from '../../Assets/componentes/Modal'
//Carga de funciones
import { Util } from '../../Assets/util/Util'


/**
 *
 *
 * @class Unidades
 * @extends {Component}
 */
class Unidades extends Component {

  /**
   *Define estados iniciales
   * @memberof Unidades
   */
  constructor(props) {
    super(props)
    this.state = {
      contratista: '-1',
      unidadResponsable: '-1',
      /**
       * Lista de unidades para visualizar en la tabla
       * de relación unidades y contratista
       */
      lista: this.props.value,
      /**
       * Lista de opciones para el combo contratista
       * desde el componente padre Edición Actividades
       */
      contratistaJson: this.props.opcionesContratista,
    }
  }

  //ejemplificar objeto POST y GET axios
  peticion = new Peticion(this)

  /**
   * Realiza las consultas previas para listar los elementos que irán en los combobox
   * @method
   * @param {Object} prepProps - Cargar atributos del componente
   * @async
   */

  componentDidUpdate(prevProps) {
    if (this.props.opcionesContratista !== prevProps.opcionesContratista) {
      this.setState({
        contratistaJson: this.props.opcionesContratista,
      })
    }
    if (this.props.value !== prevProps.value) {
      this.setState({
        lista: this.props.value,
      })
    }
    if (this.props.limpieza !== prevProps.limpieza) {
      if (this.props.limpieza) {
        this.setState({
          contratista: '-1',
          unidadResponsable: '-1',
        })
        this.props.onChange({
          target: { id: 'limpieza' },
          value: false,
        })
      }
    }
  }

  /**
   * Arreglo para el componente tabla, tres columnas:
   * Contratista, Unidad responsable y Acción(eliminar).
   * Este último llama función remover
   */
  //Arreglo con los id y nombre de columnas para el componente Tabla

  columnas = [
    {
      Header: 'Unidades',
      columns: [
        { Header: 'Contratista', accessor: 'contratista' },
        { Header: 'Unidad responsable', accessor: 'unidadResponsable' },

        {
          Header: 'Acción',
          accessor: 'id',
          Cell: (props) => (
            <button onClick={(e) => this.remover(props.index)}>
              eliminar
                        </button>
          ),
        },
      ],
    },
  ]

  /**
   * Cambia el valor del estado asociado a cada componente
   * @method
   * @async
   * @param {int} id al nombre del estado que se desea modificar
   * @param {(int|string)} value del componente correspondiente al dato
   * que se visualizará en el componente
   */

  change = ({ target: { id, value } }) => {
    this.setState({ [id]: value })

    //El cambio del contratista modifica el combo de unidades responsables
    if (id === 'contratista') {
      this.peticion.post({
        url: URL.EDICIONACTIVIDADES.CUADRILLA,
        configJsonDos: ['ureIderegistro', 'cuadrilla', 'cuadrillaNom'],
        parametros: {
          empresa: Util.obtenerId(value),
        },
        json: 'unidadResponsableJson',
        value: 'unidadResponsable',
      })
    }
  }

  /**
   *
   *Habilita el botón agregar
   *@method
   *@param {Object} props
   *@return {JSX} Componente - Button
   */
  BotonAgregar = () => {
    const { contratista, unidadResponsable } = this.state

    return contratista !== '-1' && unidadResponsable !== '-1' ? (
      <button onClick={this.agregar}>agregar</button>
    ) : (
        <button disabled={true}>agregar</button>
      )
  }

  /**
   * Agrega una nueva fila a la tabla. Evaluando previamente que la información no este repetida
   * @method
   */

  agregar = () => {
    const { contratista, unidadResponsable } = this.state
    const { idContratante } = this.props
    if (contratista !== '-1' && unidadResponsable !== '-1') {
      //Confirma sí los datos contratista y unidades responsable
      const filtrar = this.state.lista.map((fila) => {
        return fila.contratista == contratista &&
          fila.unidadResponsable == unidadResponsable
          ? true
          : false
      })
      if (filtrar.includes(true)) {
        this.setState({
          titulo: '¡CONTRATISTAS Y UNIDAD REPETIDOS!',
          texto: `El contratista y la unidad ya están asociados en la lista principal`,
        })
        //despliega modal
        this.setState({ mostrar: true })
      } else {
        //Si no existe adiciona la información en la tabla 'unidades'
        this.setState(
          {
            lista: [
              ...this.state.lista,
              { idContratante, contratista, unidadResponsable },
            ],
          },
          () => {
            this.props.onChange({
              target: { id: 'unidades', value: this.state.lista },
            })
          }
        )
        // limpieza
        this.setState({
          unidadResponsable: '-1',
        })
      }
    }
  }

  /**
   * Elimina la relación contratista y unidad responsable de la lista 'unidades'
   * Sin embargo, sí de la consulta trae una lista con unidades y contratista existentes
   * y se quiere suprimir una de sus filas debe hacer uso del api 'ELIMINAR_URA_UNIDADES',
   * eliminando la relación en el backend y en el fronted. De lo contratrio,
   * @method
   * @param {int} index -lleva consigo el índice de  la fila que se desea eliminar
   * 
   */
  remover = (index) => {
    const fila = this.state.lista.filter((a, b) => {
      return index == b
    })
    //Aplica el uso del API para eliminar la fila seleccionada,
    //sí de la lista existe una fila con relación de unidades y contratista
    //de la consulta
    if (fila[0].hasOwnProperty('eliminarUnidades')) {
      this.peticion.post({
        url: URL.EDICIONACTIVIDADES.ELIMINAR_URA_UNIDADES,
        parametros: {
          ureIderegistro: fila[0].ureIderegistro,
          proaIderegistro: fila[0].proaIderegistro,
        },
      })
    }
    //Eliminar de la lista en el front
    const lista = this.state.lista.filter((a, b) => index !== b)
    this.setState({ lista })
    this.props.onChange({
      target: { id: 'unidades', value: this.state.lista },
    })
  }

  /**
   *Renderiza la vista 
   * @return {JSX} componente - returna vista jsx 
   */

  render() {
    return (
      <React.Fragment>
        <Modal
          titulo={this.state.titulo}
          texto={this.state.texto}
          mostrar={this.state.mostrar}
          ocultarAlerta={this.change}
          botones={this.botones}
        />
        <div className="formulario">
          <Combo
            propTexto="texto"
            propValor="id"
            id="contratista"
            label="Contratista:"
            value={this.state.contratista}
            opciones={this.state.contratistaJson}
            onChange={this.change}
          />
          <Autocompletado
            id="unidadResponsable"
            label="Unidad Responsable"
            marcaAgua={'Escribe la unidad responsable'}
            value={this.state.unidadResponsable}
            opciones={this.state.unidadResponsableJson}
            onChange={this.change}
            required={true}
          />
        </div>

        <div className="contenedor">
          <this.BotonAgregar />
        </div>

        <div className="contenedor">
          <Tabla datos={this.state.lista} columnas={this.columnas} />
        </div>
      </React.Fragment>
    )
  }
}

export default Unidades
