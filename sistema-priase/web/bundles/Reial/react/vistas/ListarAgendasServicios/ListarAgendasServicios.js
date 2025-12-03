import React, { Component } from 'react'
import { Combo, Tabla, VentanaDialogo } from 'appfuture-react'

import API from '../../global/rutas_api'
import Util from '../../global/util'
import Peticion from '../../global/peticion'
import Edicion from './subcomponentes/Edicion'

// redux

import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'

/**
 *
 *
 * @class ListarAgendasServicios
 * @extends {Component}
 */
class ListarAgendasServicios extends Component {

  /**
   *Define estados iniciales
   * @memberof ListarAgendasServicios
   */
  state = {
    lista: [],
    dialogoModal: false,
    edicionModal: false,

    // defecto

    identificador: '',
    orden: '',

    agenda: '-1',
    empresa: '-1',

    editable: {},
  }

  columnas = [
    {
      Header: 'Servicios por agenda',

      columns: [
        {
          Header: 'Servicio',
          accessor: 'servicio',
          Cell: props => props.value.servicioNom,
        },

        { Header: 'Orden', accessor: 'serageOrdser' },

        {
          Header: 'Municipio',
          accessor: 'municipio',
          Cell: props => props.value.proyectoNom,
        },

        {
          Header: 'Dependencia',
          accessor: 'dependencia',
          Cell: props => props.value.depempresaNom,
        },

        {
          Header: 'Acción',
          accessor: 'id',
          Cell: (props) => {
            return (
              <div className="d-flex justify-content-center btn-group">
                <button className="btn" onClick={() => this.editar(props)}>
                  <span>editar</span>
                </button>
              </div>
            )
          },
        },
      ],
    }
  ]

  montado = false

	/**
     *
     *Habilita el botón crear
     *@method
     *@return {JSX} Componente - Button
     */

  BotonCrear = () => {
    const { agenda, empresa } = this.state

    /* prettier-ignore */

    return Util.validarObjeto({ agenda, empresa })
      ? <button className="btn" onClick={this.crear}>crear</button>
      : <button className="btn" disabled={true}>crear</button>
  }

	/**
     *
     *Habilita el botón guardar
     *@method
     *@return {JSX} Componente - Button
     */
  BotonGuardar = () => {
    const paraEnviar = this.state.lista.filter(item => item.guardar)

    /* prettier-ignore */

    return paraEnviar.length > 0
      ? <button className="btn" onClick={this.handleDialogo}>guardar</button>
      : <button className="btn" disabled={true}>guardar</button>
  }

	/**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     */
  componentDidMount() {
    // empresaJson

    Peticion.post({
      url: API.LISTAR_AGENDAS.LISTAR_EMPRESAS,
      config: {
        valor: 'empresaCod',
        texto: 'empresaNom',
      },

      callback: empresaJson => this.setState({ empresaJson })
    })

    this.montado = true
  }

  /**
   * Realiza las consultas previas para listar los elementos que irán en los combobox
   * @method
   * @param {Object} props - Cargar atributos del componente
   */
  componentDidUpdate(props, state) {
    if (this.montado) {
      // agendaJson y dependenciaJson

      if (this.state.empresa !== state.empresa) {
        // consultar dependencias

        if (Util.validarValor(this.state.empresa)) {
          this.cambioEmpresa(this.state.empresa)
        }

        else this.setState({
          agenda: '-1',
          dependencia: '-1',
          municipio: '-1',
          agendaJson: undefined,
          dependenciaJson: undefined,
          municipioJson: undefined,
        })
      }

      // lista

      if (this.state.agenda !== state.agenda) {
        if (Util.validarValor(this.state.agenda)) {
          this.buscar(this.state.agenda)
        }

        else this.setState({ lista: [] })
      }
    }
  }

	/**
     * Cambia el valor del estado asociado a cada componente
     * @method
     * @async
     * @param {int} id al nombre del estado que se desea modificar
     * @param {(int|string)} value del componente correspondiente al dato
     * que se visualizará en el componente
     */
  change = ({ target: { id, value } }) => this.setState({ [id]: value })

  /**
   *
   * Lista las agendas realizando la consulta por empresa
   * @method
   * @async
   * @param {string} empresa Identificador de la empresa
   */
  cambioEmpresa = async (empresa) => {
    empresa = Util.obtenerId(empresa)

    // agendaJson
    await Peticion.post({
      url: API.LISTAR_AGENDAS.CONSULTAR_TODAS,
      parametros: {
        empresa: empresa
      },
      config: {
        valor: 'agendaCod',
        texto: 'agendaNom',
      },
      callback: agendaJson => this.setState({ agendaJson })
    })
  };


  /**
   *
   * Busca por código  y lista la información en una tabla
   * @method
   * @async
   */
  buscar = async (agenda = this.state.agenda) => {
    agenda = Util.obtenerId(agenda)

    let parametros = { serageCodage: agenda }

    let lista = await Peticion.post({
      url: API.LISTAR_AGENDAS_SERVICIOS.CONSULTAR_POR_CODIGO,
      parametros,
    })

    if (!lista.length) return // no hay datos

    this.setState({ lista })
  }

  /**
   *
   * Cancela la operación sobre el formulario
   * @method
   * @async
   */
  cancelar = async () => {
    await this.limpiarCampos()
    await this.setState({ datos: [] })
  }

  /**
   *
   * Crear la agenda servicio
   * @method
   * @async
   */
  crear = async () => {
    await this.setState({
      editable: {
        indice: 0,
        serageCodemp: Util.obtenerId(this.state.empresa),
        serageCodage: Util.obtenerId(this.state.agenda),
      }
    })

    await this.handleEdicion(true)
  }

  /**
   *
   * Modifica la agenda servicio
   * @method
   * @async
   * @param {object} original - fila actual
   * @param {int} index - posición de la fila actual en la tabla
   */
  editar = async ({ original, index }) => {
    await this.setState({
      editable: { indice: index, ...original }
    })

    this.handleEdicion(true)
  }

  /**
   *
   * Procesa la fila seleccionada de la tabla
   * @method
   * @async
   * @param {array} datos - Información a procesar
   */
  procesarEdicion = async (datos) => {
    if (datos != null) {
      if (datos.serageCod) {
        // crear

        delete datos.crear
        delete datos.indice

        datos.guardar = true

        let lista = [...this.state.lista, datos]

        await this.setState({ lista })
      }

      else {
        // editar

        const lista = this.state.lista.map(function (elemento, indice) {
          if (indice === datos.indice) {
            delete datos.crear
            delete datos.indice

            elemento = { ...datos, guardar: true }
          }

          return elemento
        })

        await this.setState({ lista })
      }
    }

    await this.handleEdicion(false)
  }

  /**
	 *
	 * Permite guardar las agendas
	 * @method
   * @async
	 * 
	 */
  guardar = async () => {
    this.handleDialogo(false)

    // filtrar y organizar

    let paraEnviar = this.state.lista
      .filter(item => item.guardar)
      .map(elemento => {
        delete elemento.guardar
        delete elemento.municipio
        delete elemento.dependencia
        delete elemento.servicio

        return elemento
      })

    // peticion

    await Peticion.post({
      url: API.LISTAR_AGENDAS_SERVICIOS.AGREGAR_SERVICIOS,
      parametros: paraEnviar
    })

    // final

    await this.limpiarCampos()

    if (Util.validarValor(Util.obtenerId(this.state.agenda))) {
      this.buscar(this.state.agenda)
    }
  }

  /**
   *
   * Desplegar modal
   * @method
   * @param {boolean} valor - Habilita el modal
   */
  handleDialogo = (valor) => {
    if (valor == undefined) valor = !this.state.dialogoModal
    return this.setState({ dialogoModal: valor })
  }

  /**
   *
   * Habilitar edición
   * @method
   * @param {boolean} valor - Habilita la edición de la fila
   */
  handleEdicion = (valor) => {
    if (valor == undefined) valor = !this.state.edicionModal
    return this.setState({ edicionModal: valor })
  }


  /**
   *
   * Limpiar formulario
   * @method
   */
  limpiarCampos = () => {
    return this.setState({
      lista: [],

      identificador: '',
      orden: '',

      servicio: '-1',
      tipo: '-1',
      dependencia: '-1',
      municipio: '-1',
    })
  }

  botones = [
    { texto: 'guardar', callback: this.guardar },
    { texto: 'cancelar', callback: this.handleDialogo }
  ]

  /**
   *Renderiza la vista 
   * @return {JSX} componente - returna vista jsx 
   */
  render() {
    const { BotonCrear, BotonGuardar } = this

    const texto = this.state.identificador ? 'Editar' : 'Crear'

    return (
      <React.Fragment>
        <h1>{texto} asociación agenda servicios</h1>

        <VentanaDialogo
          titulo="Confirmación"
          texto="¿Confirma transacción?"
          mostrar={this.state.dialogoModal}
          botones={this.botones}
        />

        <div className="contenedor d-flex justify-content-center btn-group">
          <BotonGuardar />
          <BotonCrear />
          <button className="btn" onClick={this.cancelar}>
            <span>cancelar</span>
          </button>
        </div>

        <div className="contenedor formulario">
          <Combo
            id="empresa"
            label="empresa"
            value={this.state.empresa}
            opciones={this.state.empresaJson}
            required={true}
            onChange={this.change}
          />

          <Combo
            id="agenda"
            label="agenda"
            value={this.state.agenda}
            onChange={this.change}
            opciones={this.state.agendaJson}
            required={true}
            extra={{ disabled: !this.state.agendaJson }}
          />
        </div>

        <div className="contenedor">
          <Edicion
            mostrar={this.state.edicionModal}
            cerrarModal={this.handleEdicion}
            procesar={this.procesarEdicion}
            editable={this.state.editable}
          />

          <Tabla
            columnas={this.columnas}
            datos={this.state.lista}
          />
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch)
}

const VistaRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListarAgendasServicios)

export { VistaRedux as RListarAgendasServicios }
