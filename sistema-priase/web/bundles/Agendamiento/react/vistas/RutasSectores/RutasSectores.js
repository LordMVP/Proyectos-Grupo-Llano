import React, { Component } from 'react'
import { Captcha, Combo, Tabla, Botonera, TextoNumerico } from 'appfuture-react'

import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'

import Peticion from '../Assets/util/peticion'
import URL from '../../global/rutas_api'

import { Util } from '../Assets/util/Util'
import Modal from '../Assets/componentes/Modal'

/**
 *
 *
 * @class RutasSectores
 * @extends {Component}
 */
class RutasSectores extends Component {
  /**
   *Define estados iniciales
   * @memberof SolicitudAgendamiento
   */
  state = {
    lista: [],
    listaEliminar: [],
    mostrar: false,
    ruta: '-1',
    sector: '',
    orden: '',
  }

  peticion = new Peticion(this)

  /**
   * Realiza las consultas previas para listar los elementos que irán en los combobox
   * @method
   * @async
   */

  async componentDidMount() {
    await this.peticion.get({
      url: URL.RUTAS_SECTORES.LISTAR_SECTORES,
      config: ['secIderegistro', 'secDescripcion'],
      json: 'sectorJson',
      value: 'sector',
    })
    await this.peticion.get({
      url: URL.RUTAS_SECTORES.LISTAR_RUTAS,
      config: ['rutIderegistro', 'rutNombre'],
      json: 'rutaJson',
      value: 'ruta',
    })
  }

  //Arreglo con los id y nombre de columnas para el componente Tabla

  columnas = [
    {
      Header: 'Sectores relacionados',

      columns: [
        { Header: 'Orden', accessor: 'seruOrderruta' },
        { Header: 'Ruta', accessor: 'ruta' },

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
    if (id === 'sector') {
      this.peticion
        .post({
          url: URL.RUTAS_SECTORES.CONSULTAR_RELACIONES_SECTORES_RUTAS,
          parametros: { idSector: Util.obtenerId(value) },
        })
        .then((data) => {
          if (data != null) {
            const lista = data.map((fila) => {
              return {
                editarBoton: true,
                sector: value,
                seruOrderruta: fila.seruOrderruta,
                ruta: `${fila.seruIderegistro} - ${fila.rutIderegistro.rutNombre}`,
              }
            })
            this.setState({ lista })
          } else {
            this.setState({
              lista: [],
              municipio: '',
              idRegistro: '',
              editar: false,
            })
          }
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
  BotonAgregar = (props) => {
    const { ruta, sector, orden } = this.state

    return ruta === '-1' || sector === '-1' || orden <= 0 ? (
      <button disabled={true}>agregar</button>
    ) : (
        <button onClick={this.agregar}>agregar</button>
      )
  }

  /**
   * Cierra el modal de la consulta
   * @method
   */

  cerrarModal = () => { }

  //Arreglo para emplearlo en el componente Modal, con sus respectivas funciones

  botones = [{ texto: 'Cerrar', callback: this.cerrarModal, index: 2 }]

  /**
   * Agrega una nueva fila a la tabla. Evaluando previamente que la información no este repetida.
   * @method
   */

  agregar = () => {
    const { ruta, sector, orden } = this.state

    const existeSector = this.state.lista.filter(sector => {
      return sector.seruOrderruta == orden;
    });

    if (existeSector.length > 0) {
      this.setState({
        titulo: '¡Información!',
        texto: 'El orden seleccionado para el sector ya se encuentra en la lista.',
        mostrar: true
      });
      return;
    }

    const filtrar = this.state.lista.map((fila) => {
      return fila.sector === sector &&
        Util.obtenerId(fila.ruta) === Util.obtenerId(ruta)
        ? true
        : false
    })

    if (filtrar.includes(true)) {
      //Modal
      this.setState({
        titulo: '¡ELEMENTOS ASOCIADOS!',
        texto: 'La ruta ya esta asociado a un sector.',
      });
      //Elimina si existe un segundo botón
      this.botones.length === 2 ? this.botones.shift() : null
      //despliega modal
      this.setState({ mostrar: true })
    } else {
      const lista = [
        ...this.state.lista,
        { sector, ruta, seruOrderruta: orden },
      ];

      this.setState({ lista }, () => {
        this.setState({ ruta: '-1', orden: '' })
      })
    }
  }
  /**
   * Elimina la fila seleccionada en la tabla
   * @method
   * @param {int} index -Índice que corresponde al número de la fila que se desea eliminar
   */

  remover = (index) => {
    const fila = this.state.lista.filter((a, b) => {
      return index == b
    })

    if (fila[0].hasOwnProperty('editarBoton')) {
      const id = Util.obtenerId(fila[0].ruta)
      const listaEliminar = [...this.state.listaEliminar, { id }]
      this.setState({ listaEliminar })
    }
    const lista = this.state.lista.filter((a, b) => index !== b)
    this.setState({ lista })
  }

  /**
   * Se ejecuta al momento de pulsar sobre el botón Guardar
   * @method
   */

  guardar = () => {
    if (
      this.state.lista.length <= 0 &&
      this.state.listaEliminar.length <= 0
    ) {
      //Modal
      this.setState({
        titulo: '¡FALTA INFORMACIÓN!',
        texto: 'Falta escoger: Una ruta y asociarla a un sector',
      })
      //Elimina si existe un segundo botón
      this.botones.length === 2 ? this.botones.shift() : null
      //despliega modal
      this.setState({ mostrar: true })
    } else {
      this.setState({
        titulo: '¡ENVIAR INFORMACIÓN!',
        texto: '¿Confirma Transacción?',
      })
      //Agrega botón
      this.botones.length === 1
        ? this.botones.unshift({
          texto: 'Aceptar',
          callback: this.guardarModal,
          index: 1,
        })
        : null
      //despliega modal
      this.setState({ mostrar: true })
    }
  }

  /**
   * Restablece los valores a las condiciones iniciales
   * @method
   */

  nuevo = () => {
    //limpiar formulario
    this.setState({
      lista: [],
      listaEliminar: [],
      sector: '',
      ruta: '-1',
    })
  }



  //Arreglo para emplearlo en el componente botonera, con sus respectivas funciones

  funciones = [{ texto: 'guardar', callback: this.guardar }, { texto: 'nuevo', callback: this.nuevo }]

  /**
   * Se ejecuta al momento de pulsar en  'aceptar' del modal, desplegado en la función 'guardar'.
   * Y solo ocurre al validar los campos necesarios para registrar o actualizar la información
   * @method
   * @async
   */

  guardarModal = async () => {
    const filtrarLista = this.state.lista.filter((a) => {
      return a.hasOwnProperty('editarBoton') === false
    })

    if (filtrarLista.length <= 0 && this.state.listaEliminar.length <= 0) {
      //Modal
      this.setState({
        titulo: '¡SIN INFORMACIÓN NUEVA!',
        texto: 'No está ingresando información nueva al sector.',
      })
      //Elimina si existe un segundo botón
      this.botones.length === 2 ? this.botones.shift() : null
      //despliega modal
      this.setState({ mostrar: true })
      return false
    } else if (
      filtrarLista.length > 0 &&
      this.state.listaEliminar.length <= 0
    ) {
      const listaFinal = filtrarLista.map((fila) => {
        return {
          secIderegistro: {
            secIderegistro: Util.obtenerId(fila.sector),
          },
          rutIderegistro: {
            rutIderegistro: Util.obtenerId(fila.ruta),
          },
          seruOrderruta: fila.seruOrderruta
        }
      })
      this.peticion.post({
        url: URL.RUTAS_SECTORES.REGISTRAR_RELACIONES_SECTORES,
        parametros: listaFinal,
      })
    } else if (
      filtrarLista.length > 0 &&
      this.state.listaEliminar.length >= 0
    ) {
      //Eliminar información rutas
      if (this.state.listaEliminar.length > 0) {
        await this.state.listaEliminar.map((elemento) => {
          this.peticion.post({
            url: URL.RUTAS_SECTORES.ELIMINAR_RELACIONES_SECTORES,
            parametros: { idSecRuta: elemento.id },
          })
        })
      }
      const listaFinal = filtrarLista.map((fila) => {
        return {
          secIderegistro: {
            secIderegistro: Util.obtenerId(fila.sector),
          },
          rutIderegistro: {
            rutIderegistro: Util.obtenerId(fila.ruta),
          },
          seruOrderruta: fila.seruOrderruta
        }
      })
      await this.peticion.post({
        url: URL.RUTAS_SECTORES.REGISTRAR_RELACIONES_SECTORES,
        parametros: listaFinal,
      })
    } else {
      //Eliminar información rutas
      if (this.state.listaEliminar.length > 0) {
        this.state.listaEliminar.map((elemento) => {
          this.peticion.post({
            url: URL.RUTAS_SECTORES.ELIMINAR_RELACIONES_SECTORES,
            parametros: { idSecRuta: elemento.id },
          })
        })
      }
    }

    //limpiar formulario
    this.setState({
      lista: [],
      listaEliminar: [],
      sector: '',
      ruta: '-1',
    })
  }

  /**
   *Renderiza la vista
   * @return {JSX} Componente - returna vista jsx
   */

  render() {
    return (
      <React.Fragment>
        <h1>Empresa - Relación Sectores y Rutas</h1>

        <Botonera funciones={this.funciones} />
        <Modal
          titulo={this.state.titulo}
          texto={this.state.texto}
          mostrar={this.state.mostrar}
          ocultarAlerta={this.change}
          botones={this.botones}
        />
        <div className="caja contenedor">
          <label className="tag">Información Sectores</label>

          <div className="formulario">
            <Combo
              propTexto="texto"
              propValor="id"
              id="sector"
              label="Sectores"
              value={this.state.sector}
              opciones={this.state.sectorJson}
              onChange={this.change}
            />
            <Combo
              propTexto="texto"
              propValor="id"
              id="ruta"
              label="Rutas"
              value={this.state.ruta}
              opciones={this.state.rutaJson}
              onChange={this.change}
            />
            <TextoNumerico
              aceptaDecimales={false}
              aceptaNegativos={false}
              label='Orden:'
              cols={4}
              value={this.state.orden}
              onChange={this.change}
              id='orden'
              name='orden'
            />
          </div>

          <div className="contenedor">
            <this.BotonAgregar />
          </div>

          <div className="contenedor">
            <Tabla
              datos={this.state.lista}
              columnas={this.columnas}
            />
          </div>
        </div>
        <Captcha />
      </React.Fragment>
    )
  }
}

RutasSectores.propTypes = {}

const mapStateToProps =
  //inicialización de variables

  (state) => {
    return {}
  }

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch)
}

const VistaRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(RutasSectores)

export { VistaRedux as RRutasSectores }
