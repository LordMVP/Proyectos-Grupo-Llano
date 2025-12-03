import React, { Component } from 'react'
import { Fecha, Tabla, TextArea, Input } from 'appfuture-react'

import Autocompletado from '../../../Assets/componentes/Autocompletado'
import API from '../../../../global/rutas_api'
import Peticion from '../../../../global/peticion'
import Util from '../../../../global/util'
import axios from 'axios';

/**
 *
 *
 * @class Novedades
 * @extends {Component}
 */
class Novedades extends Component {
  /**
   *Define estados iniciales
   * @memberof ActividadesMunicipios
   */
  state = {
    lista: [],
    cuadrillaJson: this.props.cuadrillaJson || [],
    novedadJson: this.props.novedadJson || [],
    lista: this.props.lista || [],

    // defecto

    cuadrilla: '',
    novedad: '',

    fecha: '',
    observaciones: ''
  }

  columnas = [
    {
      Header: 'Novedades',

      columns: [
        { Header: 'Fecha', accessor: 'visitaFecvis', },
        { Header: 'Cuadrilla', accessor: 'cuadrilla' },
        { Header: 'Código Novedad', accessor: 'visitaCodnov' },
        {
          Header: 'Novedad', Cell: (props) => {
            const { original } = props;
            let dato = 'Indefinido';
            if (original.novedad) {
              dato = original.novedad.novedadNom;
            } else {
              dato = original.visitaNomnov;
            }
            return (dato) ? dato : 'Indefinido';
          }
        },
        { Header: 'Observaciones', accessor: 'visitaObsvis' },
        {
          Header: 'Acción',
          accessor: 'visitaCodnov',
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

                this.props.onChange({ target: { id: 'novedades', value: datos } })
              }
            }

            return (
              <button className="btn" onClick={click}>
                <span>eliminar</span>
              </button>
            )
          },
        },
      ]
    }];

	/**
     *
     *Habilita el botón agregar
     *@method
     *@return {JSX} Componente - Button
     */
  BotonAgregar = () => {
    /* prettier-ignore */
    return (Util.validarValor(this.state.fecha) && Util.validarValor(this.state.cuadrilla) && Util.validarValor(this.state.novedad))
      ? <button className="btn" onClick={this.agregar}>agregar</button>
      : <button className="btn" disabled={true}>agregar</button>;
  };

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
   * Método encargado de guardar las novedades
   * @method
   */
  guardar = async () => {
    this.limpiarCampos()
    this.props.onChange({ target: { id: 'novedades', value: [] } });
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
    if (prev.cuadrillaJson !== this.props.cuadrillaJson) {
      this.setState({ cuadrillaJson: this.props.cuadrillaJson })
    }
    if (prev.novedadJson !== this.props.novedadJson) {
      this.setState({ novedadJson: this.props.novedadJson })
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

  /**
   *
   *Agrega la información a la tabla
   * @method
   */
  agregar = () => {
    const servicio = this.props.servicio;
    const fecha = this.state.fecha;

    const datos = [
      ...this.props.value,
      {
        visitaCodsus: Util.obtenerId(servicio.suscriptor),
        visitaCodage: servicio.agenda,
        visitaOrdtra: servicio.ordenTrabajo,
        visitaCodcua: Util.obtenerId(this.state.cuadrilla),
        visitaCodnov: Util.obtenerId(this.state.novedad),
        visitaFecvis: fecha,
        visitaObsvis: this.state.observaciones,
        visitaEfe: false,
        visitaEst: servicio.id,

        //exclusivo tabla
        visitaNomcua: Util.obtenerId(this.state.cuadrilla, 1),
        visitaNomnov: Util.obtenerId(this.state.novedad, 1),
        cuadrilla: this.state.cuadrilla,
      }
    ]
    this.props.onChange({ target: { id: 'novedades', value: datos } });
    this.limpiarCampos();
  }

	/**
	 *
	 *Limpiar el formulario
	 * @method
	 * 
	 */
  limpiarCampos = () => {
    this.setState({
      cuadrilla: '-1',
      novedad: '-1',
      fecha: '',
      observaciones: ''

    });
  }

  /**
 *
 *Carga la lista de municipios al escoger un contratista, suscriptor y orden de trabajo del combobox
 * @method
 * 
 */
  async obtenerLista() {
    const { servicio } = this.props;
    axios.post(API.BUSQUEDA_SERVICIOS.CONSULTAR_NOVEDADES, {
      suscriptor: Util.obtenerId(servicio.suscriptor),
      ordenTrabajo: servicio.ordenTrabajo,
      servicio: servicio.id
    }).then(respuesta => {
      let data = respuesta.data;
      if (respuesta.data.length > 0) {
        data.map(fila => {
          fila.cuadrilla = `${fila.cuadrilla.cuadrillaCod} - ${fila.cuadrilla.cuadrillaNom}`;
          return fila;
        });
      }

      this.setState({ lista: data });
    });
  }

  /**
 *Renderiza la vista 
 * @return {JSX} componente - returna vista jsx 
 */
  render() {
    return (
      <React.Fragment>
        <div className="fila">
          <Fecha
            id='fecha'
            label='Fecha'
            fecha={this.state.fecha}
            onChange={this.change}
          />

          <Autocompletado
            id="cuadrilla"
            label="cuadrilla"
            marcaAgua={'Escribe la cuadrilla'}
            opciones={this.state.cuadrillaJson}
            onChange={this.change}
            value={this.state.cuadrilla}
            required={true}
            extra={{
              disabled: false
            }}
          />

          <Autocompletado
            id="novedad"
            label="novedad"
            marcaAgua={'Escribe la novedad'}
            opciones={this.state.novedadJson}
            onChange={this.change}
            value={this.state.novedad}
            required={true}
            extra={{
              disabled: false
            }}
          />

        </div>

        <div className="contenedor">
          <Input
            id="observaciones"
            label="observaciones"
            value={this.state.observaciones}
            onChange={this.change} />
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
    );
  }
}

export default Novedades;
