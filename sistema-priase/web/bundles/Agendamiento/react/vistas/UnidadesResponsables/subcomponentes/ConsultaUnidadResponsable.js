import React, { Component } from 'react'
import { Combo, Tabla, VentanaModal } from 'appfuture-react'

//Rutas entre la vista Edición Actividades y Symfony-EdicionActividadesController
import URL from '../../../global/rutas_api'
//LLamado de la petición por POST o GET empleando AXIOS
import Peticion from '../../Assets/util/peticion'
//Carga de funciones
import { Util } from '../../Assets/util/Util'
//Usar componente modal
import Modal from '../../Assets/componentes/Modal'
import axios from 'axios'


/**
 *
 *
 * @class ConsultaUnidadResponsable
 * @extends {Component}
 */
class ConsultaUnidadResponsable extends Component {
  //inicialización de variables
  /**
   *Define estados iniciales
   * @memberof SolicitudAgendamiento
   */
  state = {
    // defecto

    contratista: '-1',
    estado: '-1',
    proceso: '-1',
    unidadResponsable: '-1',
    estadoJson: this.props.opcionesEstado,
  }

  peticion = new Peticion(this)

  //Arreglo con los id y nombre de columnas para el componente Tabla

  columnas = [
    {
      Header: 'Consulta frecuencia',

      columns: [
        {
          Header: 'Item',
          accessor: 'item',
        },
        {
          Header: 'Empresa Contratante',
          accessor: 'empresaContratista',
        },
        { Header: 'Unidad responsable', accessor: 'unidadResponsable' },
        { Header: 'Estado', accessor: 'estado' },
        {
          Header: 'Acción',
          accesor: 'id',
          Cell: (props) => (
            <button onClick={(e) => this.asignar(props.index)}>
              ver
                        </button>
          ),
        },
      ],
    },
  ]

  /**
   * Agrega una nueva fila a la tabla. Evaluando previamente que la información no este repetida.
   * @method
   */
  asignar = (index) => {
    this.props.cerrarModal(this.state.lista[index],this.state.proceso)
  }

  /**
   * Realiza las consultas previas para listar los elementos que irán en los combobox
   * @method
   * @async
   */

  componentDidUpdate(prevProps) {
    if (prevProps.opcionesEstado != this.props.opcionesEstado) {
      this.setState({
        estadoJson: this.props.opcionesEstado,
      })
    }
    if (prevProps.opcionesProceso != this.props.opcionesProceso) {
      this.setState({
        procesoJson: this.props.opcionesProceso,
      })
    }
    if (prevProps.opcionesContratista != this.props.opcionesContratista) {
      this.setState({
        contratistaJson: this.props.opcionesContratista,
      })
    }
    if (prevProps.opcionesUnidad != this.props.opcionesUnidad) {
      this.setState({
        unidadResponsableJson: this.props.opcionesUnidad,
      })
    }
    if (this.props.mostrar !== prevProps.mostrar) {
      if (this.props.mostrar) {
        //restablece valores
        this.setState({
          lista: [],
          // defecto
          contratista: '-1',
          estado: '-1',
          proceso: '-1',
          unidadResponsable: '-1',
        })
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

  change = ({ target: { id, value } }) => {
    if (id == 'contratista') {
      this.props.onChange({ target: { id: id, value: value } });
    }
    this.setState({ [id]: value })
  }

  /**
   * Cierra el modal de la consulta
   * @method
   */
  cerrarModal = () => { }

  /**
   *
   *Consulta filtrando información, previa selección de varios campos para listarlos en una tabla
   *@method
   */
  consultar = () => {
    const { contratista, proceso, unidadResponsable, estado } = this.state
    if (
      contratista === '-1' ||
      proceso === '-1' /*&&
      unidadResponsable === '-1' &&
      estado === '-1'*/
    ) {
      this.setState({
        titulo: '¡FALTA INFORMACIÓN!',
        texto:
          //'Escoja al menos una de las siguientes opciones: Contratista, Proceso, Unidad Responsable o Estado.',
          'Escoja al menos una de las siguientes opciones: Contratista, Proceso',
      })
      //despliega modal
      this.setState({ mostrar: true })
      return
    } else {
      let estado =
        this.state.estado === 'Activo'
          ? 'A'
          : this.state.estado === 'Inactivo'
            ? 'I'
            : this.state.estado === 'Incapacidad'
              ? 'IN'
              : this.state.estado === 'Licencia'
                ? 'L'
                : '-1'
      this.peticion
        .post({
          url:
            URL.UNIDADES_RESPONSABLES
              .CONSULTAR_URE_UNIDAD_RESPONSABLE,
          parametros: {
            proceso:
              this.state.proceso !== '-1'
                ? Util.obtenerId(this.state.proceso)
                : null,
            ure: {
              ureEstado: estado !== '-1' ? estado : null,
              cuadrilla: {
                cuadrillaCod:
                  this.state.unidadResponsable !== '-1'
                    ? Util.obtenerId(
                      this.state.unidadResponsable
                    )
                    : null,
              },
              cuadrillaCodemp:
                this.state.contratista !== '-1'
                  ? Util.obtenerId(this.state.contratista, 0)
                  : null,
            }
          },
        })
        .then((data) => {
          if (data == null) {
            this.setState({
              lista: [],
            })
            return
          }
          const lista = data.map((fila,i) => {
            let estado =
              fila.ureEstado === 'A'
                ? 'Activo'
                : fila.ureEstado === 'I'
                  ? 'Inactivo'
                  : fila.ureEstado === 'R'
                    ? 'Incapacidad'
                    : fila.ureEstado === 'L'
                      ? 'Licencia'
                      : '-1'
            return {
              item:i+1,
              ureIderegistro: fila.ureIderegistro,
              empresaContratista: `${fila.empresaContratista.empresaCod} - ${fila.empresaContratista.empresaNom}`,
              unidadResponsable: `${fila.cuadrilla.cuadrillaCod} - ${fila.cuadrilla.cuadrillaNom}`,
              estado,
            }
          })
          this.setState({
            lista,
          })
        })
    }
  }

  /**
   *Renderiza la vista
   * @return {JSX} componente - returna vista jsx
   */

  render() {
    return (
      <VentanaModal
        titulo="Consulta Unidades Responsables"
        mostrar={this.props.mostrar}
        cerrarModal={this.props.cerrarModal}>
        <div className="caja formulario">
          <label className="tag">Filtro consulta</label>
          <Combo
            propTexto="texto"
            propValor="id"
            id="contratista"
            label="contratista"
            value={this.state.contratista}
            opciones={this.state.contratistaJson}
            onChange={this.change}
          />

          <Combo
            propTexto="texto"
            propValor="id"
            id="proceso"
            label="proceso"
            value={this.state.proceso}
            opciones={this.state.procesoJson}
            onChange={this.change}
          />

          <Combo
            propTexto="texto"
            propValor="id"
            id="unidadResponsable"
            label="unidad responsable"
            value={this.state.unidadResponsable}
            opciones={this.state.unidadResponsableJson}
            onChange={this.change}
          />

          <Combo
            propTexto="texto"
            propValor="id"
            id="estado"
            label="estado"
            value={this.state.estado}
            opciones={this.state.estadoJson}
            onChange={this.change}
          />
        </div>

        <div className="contenedor">
          <button onClick={this.consultar}>consultar</button>
        </div>

        <div className="contenedor">
          <Tabla datos={this.state.lista} columnas={this.columnas} />
        </div>
        <Modal
          titulo={this.state.titulo}
          texto={this.state.texto}
          mostrar={this.state.mostrar}
          ocultarAlerta={this.change}
          botones={this.botones}
        />
      </VentanaModal>
    )
  }
}

export default ConsultaUnidadResponsable
