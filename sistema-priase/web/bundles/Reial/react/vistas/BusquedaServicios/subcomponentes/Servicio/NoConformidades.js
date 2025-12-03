import React, { Component } from 'react'
import { Input, Combo, TextArea, Tabla, VentanaModal } from 'appfuture-react'

import Autocompletado from '../../../Assets/componentes/Autocompletado'
import API from '../../../../global/rutas_api'
import Peticion from '../../../../global/peticion'
import Util from '../../../../global/util'
import axios from 'axios';


/**
 *
 *
 * @class NoConformidades
 * @extends {Component}
 */
class NoConformidades extends Component {
  /**
   *Define estados iniciales
   * @memberof NoConformidades
   */
  state = {
    modal: false,
    colaboradorJson: this.props.colaboradorJson || [],
    noConformidadJson: this.props.noConformidadJson || [],
    defectologiaJson: this.props.defectologiaJson || [],
    lista: this.props.lista || [],

    // defecto

    id: '',
    colaborador: '',
    defectologia: '',
    noConformidad: '',

    descripcion: '',
    motivo: '',
  }

  columnas = [
    {
      Header: 'No conformidades',

      columns: [
        {
          Header: 'No Conformidad',
          accessor: 'ancNombrenoconformidad',
        },

        { Header: 'Defectologia', accessor: 'ancNombredefectologia' },

        { Header: 'Descripción', accessor: 'ancDescripcionapertura' },
        {
          Header: 'Acción',
          accessor: 'ancIderegistro',
          Cell: (props) => {
            const click = () => {
              if (props.original.ancIderegistro) {
                this.setState({ id: props.original.ancIderegistro })
                this.handleModal();
              }

              else {
                // eliminar
                let datos = this.props.value
                const indice = props.index - this.state.lista.length

                datos = datos.filter(function (value, index) {
                  return index !== indice
                })

                this.props.onChange({ target: { id: 'noConformidades', value: datos } })
              }
            }

            return (
              <button className="btn" onClick={click}>
                <span>cerrar</span>
              </button>
            )
          },
        },
      ],
    },
  ]

	/**
     *
     *Habilita el botón agregar
     *@method
     *@return {JSX} Componente - Button
     */
  BotonAgregar = () => {
    const { colaborador, noConformidad } = this.state
    return Util.validarObjeto({ colaborador, noConformidad })
      ? <button className="btn" onClick={this.agregar}>agregar</button>
      : <button className="btn" disabled={true}>agregar</button>
  }

	/**
     *
     *Habilita el botón guardar
     *@method
     *@return {JSX} Componente - Button
     */
  BotonGuardar = () => {
    return (this.props.value.length > 0)
      ? <button className="btn" onClick={this.guardar}>Guardar</button>
      : <button className="btn" disabled={true}>Guardar</button>
  };

  /**
   * Método encargado de guardar las actividades
   * @method
   */
  guardar = async () => {
    this.limpiarCampos()
    this.props.onChange({ target: { id: 'noConformidades', value: [] } });
    await this.props.guardar();
    this.obtenerLista();
  };

  /**
   * Realiza las consultas previas para listar los elementos que irán en los combobox
   * @method
   * @param {Object} prev - Cargar atributos del componente
   */
  componentDidUpdate(prev) {
    if (prev.servicio.id !== this.props.servicio.id) {
      this.obtenerLista()
    }
    if (prev.colaboradorJson !== this.props.colaboradorJson) {
      this.setState({ colaboradorJson: this.props.colaboradorJson })
    }
    if (prev.noConformidadJson !== this.props.noConformidadJson) {
      this.setState({ noConformidadJson: this.props.noConformidadJson })
    }
    if (prev.defectologiaJson !== this.props.defectologiaJson) {
      this.setState({ defectologiaJson: this.props.defectologiaJson })
    }
    if (prev.lista !== this.props.lista) {
      this.setState({ lista: this.props.lista })
    }
  }

	/**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     */
  componentDidMount() {
    const { servicio } = this.props
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

  // vista

  /**
   *
   *Agrega la información a la tabla
   * @method
   */
  agregar = () => {
    const servicio = this.props.servicio

    const datos = [
      ...this.props.value,
      {
        ancServiciocodser: servicio.id,
        ancCodigosuscripcion: Util.obtenerId(servicio.suscriptor),
        ancCodigonoconformidad: Util.obtenerId(this.state.noConformidad),
        ancNombrenoconformidad: Util.obtenerId(this.state.noConformidad, 1),
        ancCodigodefectologia: Util.obtenerId(this.state.defectologia),
        ancNombredefectologia: Util.obtenerId(this.state.defectologia, 1),
        ancDescripcionapertura: this.state.descripcion,
        ancOrdentrabajo: servicio.ordenTrabajo,
        ancAgenda: servicio.agenda,
      },
    ]

    this.props.onChange({ target: { id: 'noConformidades', value: datos } })

    // final

    this.limpiarCampos()
  }

  /**
   *
   * cambia el estado de la no conformidad
   * @method
   * @async
   */
  cerrar = async () => {
    if (this.state.id && this.state.motivo) {
      await Peticion.post({
        url: API.BUSQUEDA_SERVICIOS.NO_CONFORMIDAD_CERRAR,
        parametros: {
          ancIderegistro: this.state.id,
          ancDescripcioncierre: this.state.motivo,
        },
      })
    }

    // final

    await this.setState({ modal: false })
    await this.obtenerLista()
  }


  /**
   *
   * Despliega el modal
   * @method
   */
  handleModal = () => {
    let estado = {}

    if (this.state.id) {
      estado.id = ''
      estado.motivo = ''
    }

    this.setState({ ...estado, modal: !this.state.modal })
  }


  /**
   *
   * Limpiar el formulario
   * @method
   */
  limpiarCampos = () => {
    this.setState({
      colaborador: '',
      defectologia: '',
      noConformidad: '',
      descripcion: '',
    });
  }

  obtenerLista() {
    const { servicio } = this.props;
    axios.post(API.BUSQUEDA_SERVICIOS.CONSULTAR_NO_CONFORMIDADES, { ordenTrabajo: servicio.ordenTrabajo, servicio: servicio.id, suscripcion: servicio.suscriptor })
      .then(respuesta => {
        let datos = (respuesta.data.datos.length > 0) ? respuesta.data.datos : [];
        datos = datos.map(function (dato) {
          let { noConforme, defectologia } = dato;
          return {
            ancIderegistro: dato.ancIderegistro,
            ancCodigonoconformidad: noConforme.noconformeCod,
            ancNombrenoconformidad: noConforme.noconformeNom,
            ancCodigodefectologia: defectologia.defectologiaCod,
            ancNombredefectologia: defectologia.defectologiaNom,
            ancDescripcionapertura: dato.ancDescripcionapertura,
          }
        });
        this.setState({ lista: datos });
      });
  }

  /**
   *Renderiza la vista 
   * @return {JSX} componente - returna vista jsx 
   */
  render() {
    return (
      <React.Fragment>
        <VentanaModal
          mostrar={this.state.modal}
          cerrarModal={this.handleModal}>

          <h1>Cerrar no conformidad</h1>

          <Input
            id="id"
            label="id"
            value={this.state.id}
            extra={{ disabled: true }}
          />

          <TextArea
            id="motivo"
            label="motivo"
            value={this.state.motivo}
            onChange={this.change}
          />

          <div className="contenedor btn-group">
            <button
              className="btn"
              disabled={!this.state.motivo}
              onClick={this.cerrar}>
              Cerrar
						</button>

            <button className="btn" onClick={this.handleModal}>
              Cancelar
						</button>
          </div>
        </VentanaModal>

        <div className="contenedor formulario">
          <Autocompletado
            id="colaborador"
            label="colaborador"
            marcaAgua={'Escribe el colaborador'}
            opciones={this.state.colaboradorJson}
            onChange={this.change}
            value={this.state.colaborador}
            required={true}
            extra={{
              disabled: false
            }}
          />

          <Autocompletado
            id="noConformidad"
            label="no conformidad"
            marcaAgua={'Escribe la no conformidad'}
            opciones={this.state.noConformidadJson}
            onChange={this.change}
            value={this.state.noConformidad}
            required={true}
            extra={{
              disabled: false
            }}
          />

          <Autocompletado
            id="defectologia"
            label="defectologia"
            marcaAgua={'Escribe la defectología'}
            opciones={this.state.defectologiaJson}
            onChange={this.change}
            value={this.state.defectologia}
            required={true}
            extra={{
              disabled: false
            }}
          />

        </div>

        <div className="contenedor">
          <Input
            id="descripcion"
            label="descripcion"
            value={this.state.descripcion}
            onChange={this.change}
          />
        </div>

        <div className="contenedor botones">
          <this.BotonAgregar />
          <this.BotonGuardar />
        </div>

        <div className="contenedor">
          <Tabla
            datos={[...this.state.lista, ...this.props.value]}
            columnas={this.columnas}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default NoConformidades
